import json
import pathlib
import queue
import random
import re
import time

from arduino.app_utils import App, Bridge
from arduino.app_bricks.cloud_llm import CloudLLM, CloudModel
from arduino.app_bricks.web_ui import WebUI

# =====================================================================
#  Broof v5 - adds: your own notes, "why" explanations, missed questions
#  come back, saved decks, speaking style, difficulty, voice answers.
# =====================================================================

# ---------- 1. Gemini ----------
DECK_SIZE = 8
RETRY_GAP = 3            # a missed question comes back after this many answers

SYSTEM_PROMPT = (
    f"You write {DECK_SIZE} multiple-choice quiz questions. "
    "Reply with ONLY a JSON array, no markdown, no extra text. "
    'Each item: {"q": "question", "choices": ["a", "b", "c", "d"], "answer": 0, "why": "one short sentence"}. '
    "Exactly 4 short choices each. answer is the index (0-3) of the correct one. "
    "why = one short sentence explaining the correct answer. "
    "Mix up which index is correct. No repeated questions."
)

llm = CloudLLM(model=CloudModel.GOOGLE_GEMINI, system_prompt=SYSTEM_PROMPT, timeout=45)

STYLES = {
    "normal": "plain and clear",
    "mom": "like a confident, smooth, teasing mom with a husky voice, family-friendly ('sweetie', 'good job, baby', 'did you eat today?')",
    "coach": "like a loud, hyped-up sports coach",
}
LEVELS = {"easy": "easy, beginner level", "medium": "medium difficulty", "hard": "hard, exam-level"}

# Used if Wi-Fi or Gemini fails and nothing is saved for the topic
BACKUP = {
    "electronics": [
        {"q": "Ohm's law: V equals?", "choices": ["I*R", "I/R", "R/I", "I+R"], "answer": 0, "why": "Voltage is current times resistance."},
        {"q": "Unit of capacitance?", "choices": ["Henry", "Farad", "Ohm", "Tesla"], "answer": 1, "why": "Capacitance is measured in farads."},
        {"q": "Silicon diode forward drop?", "choices": ["0.1 V", "0.7 V", "3.3 V", "5 V"], "answer": 1, "why": "A silicon junction conducts at about 0.7 V."},
        {"q": "Ideal op-amp input current?", "choices": ["Infinite", "1 mA", "Zero", "1 A"], "answer": 2, "why": "Ideal op-amps have infinite input impedance."},
    ],
    "digital": [
        {"q": "Which gate outputs 1 only when inputs differ?", "choices": ["AND", "OR", "XOR", "NAND"], "answer": 2, "why": "XOR is true when exactly one input is true."},
        {"q": "Binary 1010 in decimal?", "choices": ["8", "10", "12", "5"], "answer": 1, "why": "8 + 2 = 10."},
        {"q": "NAND with both inputs 1 outputs?", "choices": ["0", "1", "Z", "X"], "answer": 0, "why": "NAND is the inverse of AND, and 1 AND 1 = 1."},
    ],
    "data": [
        {"q": "BST traversal that gives sorted order?", "choices": ["Pre-order", "In-order", "Post-order", "Level-order"], "answer": 1, "why": "In-order visits left, node, right."},
        {"q": "Average BST search time (balanced)?", "choices": ["O(1)", "O(log n)", "O(n)", "O(n^2)"], "answer": 1, "why": "Each step halves the search space."},
        {"q": "A heap's root holds the?", "choices": ["Median", "Min or max", "Last item", "Random item"], "answer": 1, "why": "A heap keeps the extreme value on top."},
    ],
    "japanese": [
        {"q": "'arigatou' means?", "choices": ["Sorry", "Hello", "Thank you", "Goodbye"], "answer": 2, "why": "Arigatou is how you say thank you."},
        {"q": "'mizu' means?", "choices": ["Fire", "Water", "Tree", "Book"], "answer": 1, "why": "Mizu is water."},
        {"q": "'neko' means?", "choices": ["Dog", "Bird", "Cat", "Fish"], "answer": 2, "why": "Neko is a cat."},
    ],
}

def backup_for(topic):
    t = topic.lower()
    for key, words in [("japanese", ["japan"]), ("digital", ["digital", "logic"]),
                       ("data", ["data", "tree", "heap", "hash"])]:
        if any(w in t for w in words):
            return BACKUP[key]
    return BACKUP["electronics"]

# ---------- 1b. Saved decks (so the demo survives no Wi-Fi / no quota) ----------
SAVE_FILE = pathlib.Path(__file__).with_name("saved_decks.json")

def load_saved():
    try:
        return json.loads(SAVE_FILE.read_text())
    except Exception:
        return {}

saved = load_saved()

def save_deck(key, questions):
    saved[key] = (questions + saved.get(key, []))[:24]
    try:
        SAVE_FILE.write_text(json.dumps(saved))
    except Exception as e:
        print("Could not save decks (fine, kept in memory):", str(e)[:100])

# ---------- 2. State (the web page reads this) ----------
answers = queue.Queue()   # answers from the switches / voice wait here
deck = []                 # questions waiting to be asked
retry = []                # [due_at_asked_count, question] for missed questions
current = None            # the question being asked right now
pending = {}              # settings changed by the web page

state = {
    "topic": "Electronics I: diodes, BJTs and op-amps",
    "style": "normal", "level": "medium", "notes": False,
    "question": "", "choices": [], "answer": -1, "why": "",
    "picked": -1, "result": "", "is_retry": False,
    "status": "Starting...", "source": "",
    "score": 0, "asked": 0, "streak": 0, "best_streak": 0,
    "missed": [],
}

# ---------- 3. Bridge ----------
def on_answer(index: int):
    answers.put(int(index))

Bridge.provide("answer", on_answer)

def led(r, g, b):
    try:
        Bridge.call("set_color", r, g, b)
    except Exception as e:
        print("LED error:", e)

def ascii(text):
    """The LCD only draws plain ASCII; also '|' is our separator."""
    return text.encode("ascii", "ignore").decode().replace("|", "/")

def lcd(name, text):
    try:
        Bridge.call(name, text)
    except Exception as e:
        print("LCD error:", e)

# ---------- 4. Web page API ----------
ui = WebUI()

def api_state():
    return state

def api_topic(name: str):
    pending["topic"] = name.strip()[:120]
    return {"ok": True}

def api_notes(text: str):
    pending["notes"] = text.strip()[:1800]
    return {"ok": True}

def api_style(name: str):
    if name in STYLES:
        pending["style"] = name
    return {"ok": True}

def api_level(name: str):
    if name in LEVELS:
        pending["level"] = name
    return {"ok": True}

def api_answer(i: int):
    """Voice answers from the web page work like a switch flip."""
    if 0 <= int(i) <= 3:
        answers.put(int(i))
    return {"ok": True}

voice_on = False

def api_voice(on: int):
    """The page tells the board when Voice is on, so it waits for the speech to finish."""
    global voice_on
    voice_on = int(on) == 1
    return {"ok": True}

ui.expose_api("GET", "/api/voice", api_voice)
ui.expose_api("GET", "/api/state", api_state)
ui.expose_api("GET", "/api/topic", api_topic)
ui.expose_api("GET", "/api/notes", api_notes)
ui.expose_api("GET", "/api/style", api_style)
ui.expose_api("GET", "/api/level", api_level)
ui.expose_api("GET", "/api/answer", api_answer)

# ---------- 5. Getting questions ----------
def deck_key():
    if state["notes"]:
        return "notes:" + state["topic"][:40]
    return state["topic"][:60] + "|" + state["level"] + "|" + state["style"]

def build_prompt(notes_text):
    base = (f"Difficulty: {LEVELS[state['level']]}. "
            f"Write the 'why' sentences {STYLES[state['style']]}. ")
    if notes_text:
        return base + "Write the questions ONLY from these student notes:\n" + notes_text
    return base + f"Topic: {state['topic']}"

def fetch_deck(notes_text=""):
    """One Gemini call -> a list of questions. Falls back to saved, then BACKUP."""
    key = deck_key()
    try:
        raw = llm.chat(build_prompt(notes_text))
        raw = re.sub(r"^```(json)?|```$", "", raw.strip()).strip()
        items = json.loads(raw)
        good = []
        for q in items:
            if len(q["choices"]) == 4 and 0 <= int(q["answer"]) <= 3:
                q["answer"] = int(q["answer"])
                q["why"] = str(q.get("why", ""))[:160]
                good.append(q)
        if not good:
            raise ValueError("no usable questions")
        state["source"] = "gemini"
        save_deck(key, [dict(q) for q in good])
        print(f"Gemini wrote {len(good)} questions")
        return good
    except Exception as e:
        print("Gemini failed:", str(e)[:200])
        if saved.get(key):
            state["source"] = "saved"
            old = [dict(q) for q in saved[key]]
            random.shuffle(old)
            return old[:DECK_SIZE]
        state["source"] = "backup"
        backup = [dict(q) for q in backup_for(state["topic"])]
        random.shuffle(backup)
        return backup

def show(q, is_retry):
    state.update(question=q["q"], choices=q["choices"], answer=q["answer"], why="",
                 picked=-1, result="", is_retry=is_retry,
                 status="Flip ONE switch ON to answer (1=A 2=B 3=C 4=D), then back OFF")
    lcd("lcd_question", "|".join([ascii(q["q"])] + [ascii(c)[:14] for c in q["choices"]]))
    print("\n" + "=" * 40)
    print("Q:", q["q"])
    for i, choice in enumerate(q["choices"]):
        print(f"   {'ABCD'[i]}) {choice}")

def next_question():
    """A due retry goes first; otherwise the next deck question."""
    if retry and (retry[0][0] <= state["asked"] or not deck):
        return retry.pop(0)[1], True
    if deck:
        return deck.pop(0), False
    return None, False

# ---------- 6. Main loop ----------
notes_text = ""

def loop():
    global current, deck, retry, notes_text

    if pending:                           # the web page changed something
        if "topic" in pending:
            state.update(topic=pending.pop("topic"), notes=False)
            notes_text = ""
            reset = True
        else:
            reset = False
        if "notes" in pending:
            notes_text = pending.pop("notes")
            state.update(topic="My notes", notes=bool(notes_text))
            reset = True
        if "style" in pending:
            state["style"] = pending.pop("style")
        if "level" in pending:
            state["level"] = pending.pop("level")
            reset = True
        if reset:
            state.update(score=0, asked=0, streak=0, missed=[])
            deck, retry, current = [], [], None

    if current is None:
        q, is_retry = next_question()
        if q is None:                     # only call Gemini when everything is used up
            led(0, 0, 1)                  # blue = thinking
            state.update(question="", choices=[], result="", why="", is_retry=False,
                         status="Gemini is writing a deck...")
            lcd("lcd_message", "Thinking...|" + ascii(state["topic"])[:16])
            deck = fetch_deck(notes_text)
            led(0, 0, 0)
            q, is_retry = next_question()
        current = q
        while not answers.empty():        # ignore flips made while waiting
            answers.get_nowait()
        show(current, is_retry)
        return

    try:
        choice = answers.get(timeout=0.1)
    except queue.Empty:
        return

    state["asked"] += 1
    state["picked"] = choice
    state["why"] = current.get("why", "")
    if choice == current["answer"]:
        state["score"] += 1
        state["streak"] += 1
        state["best_streak"] = max(state["best_streak"], state["streak"])
        state.update(result="right", status="Correct!")
        print("Correct!")
        led(0, 1, 0)                      # green
        lcd("lcd_message", f"Correct!|Streak {state['streak']}")
    else:
        state["streak"] = 0
        right = current["choices"][current["answer"]]
        state.update(result="wrong", status=f"Not quite. Answer: {'ABCD'[current['answer']]}) {right}")
        print(f"Wrong. Answer: {'ABCD'[current['answer']]}) {right}")
        led(1, 0, 0)                      # red
        lcd("lcd_message", f"Nope! Answer:|{'ABCD'[current['answer']]}){ascii(right)[:14]}")
        if current["q"] not in state["missed"]:
            state["missed"].append(current["q"])
        retry.append([state["asked"] + RETRY_GAP, dict(current)])   # it will come back
    print(f"Score: {state['score']}/{state['asked']}")

    time.sleep(8.0 if voice_on else 3.5)  # longer while the voice reads the "why"
    led(0, 0, 0)
    current = None                        # next loop takes the next question

App.run(user_loop=loop)

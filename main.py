import json
import queue
import random
import re
import time

from arduino.app_utils import App, Bridge
from arduino.app_bricks.cloud_llm import CloudLLM, CloudModel
from arduino.app_bricks.web_ui import WebUI

# ---------- 1. Gemini ----------
# One call returns a whole DECK of questions, so we stay far under the
# free-tier limit (20 calls/day x 8 questions = 160 questions).
DECK_SIZE = 8

SYSTEM_PROMPT = (
    f"You write {DECK_SIZE} multiple-choice quiz questions. "
    "Reply with ONLY a JSON array, no markdown, no extra text. "
    'Each item: {"q": "question", "choices": ["a", "b", "c", "d"], "answer": 0}. '
    "Exactly 4 short choices each. answer is the index (0-3) of the correct one. "
    "Mix up which index is correct. No repeated questions."
)

llm = CloudLLM(model=CloudModel.GOOGLE_GEMINI, system_prompt=SYSTEM_PROMPT, timeout=45)

# Used if Wi-Fi or Gemini fails, so the demo never dies
# Backup decks by subject (used only if Gemini fails)
BACKUP = {
    "electronics": [
        {"q": "Ohm's law: V equals?", "choices": ["I*R", "I/R", "R/I", "I+R"], "answer": 0},
        {"q": "Unit of capacitance?", "choices": ["Henry", "Farad", "Ohm", "Tesla"], "answer": 1},
        {"q": "Silicon diode forward drop?", "choices": ["0.1 V", "0.7 V", "3.3 V", "5 V"], "answer": 1},
        {"q": "Ideal op-amp input current?", "choices": ["Infinite", "1 mA", "Zero", "1 A"], "answer": 2},
    ],
    "digital": [
        {"q": "Which gate outputs 1 only when inputs differ?", "choices": ["AND", "OR", "XOR", "NAND"], "answer": 2},
        {"q": "Binary 1010 in decimal?", "choices": ["8", "10", "12", "5"], "answer": 1},
        {"q": "NAND with both inputs 1 outputs?", "choices": ["0", "1", "Z", "X"], "answer": 0},
    ],
    "data": [
        {"q": "BST traversal that gives sorted order?", "choices": ["Pre-order", "In-order", "Post-order", "Level-order"], "answer": 1},
        {"q": "Average BST search time (balanced)?", "choices": ["O(1)", "O(log n)", "O(n)", "O(n^2)"], "answer": 1},
        {"q": "A heap's root holds the?", "choices": ["Median", "Min or max", "Last item", "Random item"], "answer": 1},
    ],
    "japanese": [
        {"q": "'arigatou' means?", "choices": ["Sorry", "Hello", "Thank you", "Goodbye"], "answer": 2},
        {"q": "'mizu' means?", "choices": ["Fire", "Water", "Tree", "Book"], "answer": 1},
        {"q": "'neko' means?", "choices": ["Dog", "Bird", "Cat", "Fish"], "answer": 2},
    ],
}

def backup_for(topic):
    t = topic.lower()
    for key, words in [("japanese", ["japan"]), ("digital", ["digital", "logic"]),
                       ("data", ["data", "tree", "heap", "hash"])]:
        if any(w in t for w in words):
            return BACKUP[key]
    return BACKUP["electronics"]

# ---------- 2. State (the web page reads this) ----------
answers = queue.Queue()   # answers from the switches wait here
deck = []                 # questions waiting to be asked
current = None            # the question being asked right now
new_topic = None          # set by the web page when you pick a topic

state = {
    "topic": "Electronics I: diodes, BJTs and op-amps",
    "question": "", "choices": [], "answer": -1,
    "picked": -1, "result": "",          # result: "", "right" or "wrong"
    "status": "Starting...", "source": "",
    "score": 0, "asked": 0, "streak": 0, "best_streak": 0,
}

# ---------- 3. Bridge: the sketch calls this when a switch flips ON ----------
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
    global new_topic
    new_topic = name.strip()[:120]
    return {"ok": True}

ui.expose_api("GET", "/api/state", api_state)
ui.expose_api("GET", "/api/topic", api_topic)

# ---------- 5. Getting questions ----------
def fetch_deck():
    """One Gemini call -> a list of questions. Falls back to BACKUP."""
    try:
        raw = llm.chat(f"Topic: {state['topic']}")
        raw = re.sub(r"^```(json)?|```$", "", raw.strip()).strip()
        items = json.loads(raw)
        good = []
        for q in items:
            if len(q["choices"]) == 4 and 0 <= int(q["answer"]) <= 3:
                q["answer"] = int(q["answer"])
                good.append(q)
        if not good:
            raise ValueError("no usable questions")
        state["source"] = "gemini"
        print(f"Gemini wrote {len(good)} questions")
        return good
    except Exception as e:
        print("Gemini failed, using backup questions:", str(e)[:200])
        state["source"] = "backup"
        backup = [dict(q) for q in backup_for(state["topic"])]
        random.shuffle(backup)
        return backup

def show(q):
    state.update(question=q["q"], choices=q["choices"], answer=q["answer"],
                 picked=-1, result="", status="Flip ONE switch ON to answer (1=A 2=B 3=C 4=D), then back OFF")
    lcd("lcd_question", "|".join([ascii(q["q"])] + [ascii(c)[:14] for c in q["choices"]]))
    print("\n" + "=" * 40)
    print("Q:", q["q"])
    for i, choice in enumerate(q["choices"]):
        print(f"   {'ABCD'[i]}) {choice}")

# ---------- 6. Main loop ----------
def loop():
    global current, new_topic, deck

    if new_topic:                         # web page picked a new topic
        state.update(topic=new_topic, score=0, asked=0, streak=0)
        new_topic = None
        deck = []
        current = None

    if current is None:
        if not deck:                      # only call Gemini when the deck is empty
            led(0, 0, 1)                  # blue = thinking
            state.update(question="", choices=[], result="", status="Gemini is writing a deck...")
            lcd("lcd_message", "Thinking...|" + ascii(state["topic"])[:16])
            deck = fetch_deck()
            led(0, 0, 0)
        current = deck.pop(0)
        while not answers.empty():        # ignore flips made while waiting
            answers.get_nowait()
        show(current)
        return

    try:
        choice = answers.get(timeout=0.1)
    except queue.Empty:
        return

    state["asked"] += 1
    state["picked"] = choice
    if choice == current["answer"]:
        state["score"] += 1
        state["streak"] += 1
        state["best_streak"] = max(state["best_streak"], state["streak"])
        state.update(result="right", status="Correct!")
        print("Correct!")
        led(0, 1, 0)
        lcd("lcd_message", f"Correct!|Streak {state['streak']}")                      # green
    else:
        state["streak"] = 0
        right = current["choices"][current["answer"]]
        state.update(result="wrong", status=f"Not quite. Answer: {'ABCD'[current['answer']]}) {right}")
        print(f"Wrong. Answer: {'ABCD'[current['answer']]}) {right}")
        led(1, 0, 0)                      # red
        lcd("lcd_message", f"Nope! Answer:|{'ABCD'[current['answer']]}){ascii(right)[:14]}")
    print(f"Score: {state['score']}/{state['asked']}")

    time.sleep(2.5)
    led(0, 0, 0)
    current = None                        # next loop takes the next question

App.run(user_loop=loop)

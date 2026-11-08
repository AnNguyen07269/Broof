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
#  Broof v9 - the box works on its own: Courses -> Topics -> Quiz -> Results, all on the
#  LCD with the stick. Same flow as broof.study/use.html.
# =====================================================================

# ---------- 1. Gemini ----------
DECK_SIZE = 8
RETRY_GAP = 3            # a missed question comes back after this many answers

SYSTEM_PROMPT = (
    f"You are a sharp tutor who writes {DECK_SIZE} multiple-choice quiz questions that test understanding, not trivia. "
    "Reply with ONLY a JSON array, no markdown, no extra text. "
    'Each item: {"q": "question", "choices": ["a", "b", "c", "d"], "answer": 0, "why": "short explanation"}. '
    "Rules: "
    "1) Mix recall, small calculations, and 'what happens if...' or 'which is the best choice' application questions. "
    "2) Make the 3 wrong choices believable: use the mistakes students really make. "
    "3) Exactly 4 short choices (under 40 characters each). answer is the index (0-3) of the correct one, and vary it. "
    "4) why = at most 2 short sentences: say why the answer is right and, if useful, why the most tempting wrong answer is not. "
    "5) No repeated questions, no 'all of the above', no trick wording."
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
answers = queue.Queue()   # answers from the stick / switches / voice wait here
nextq = queue.Queue()     # the web page says "I finished talking, go on"
deck = []                 # questions waiting to be asked
retry = []                # [due_at_asked_count, question] for missed questions
current = None            # the question being asked right now
current_retry = False
pending = {}              # commands from the web page
page_seen = {"t": 0.0}    # last time the web page asked for the state
last_lesson = {"kind": "topic", "text": "", "ctx": None}
missed_items = []         # questions missed on the first try (for review)
notes_text = ""
voice_on = False
home_lcd = {"t": 0.0}
dwell = {"s": 3.5}        # how long to wait when nobody has the web page open
# Courses and topics (the same ones as broof.study/use.html). Gemini writes the quiz for any of them.
COURSES = [
    ("Electronics I", ["Ohm's law & resistors", "Capacitors & RC", "Diodes & op-amps"]),
    ("Digital Design", ["Number systems & gates", "Boolean algebra", "Flip-flops & counters"]),
    ("Data Structures", ["Arrays & linked lists", "Stacks & queues", "Trees & Big-O"]),
    ("Linear Algebra", ["Vectors & matrices", "Linear systems", "Eigenvalues"]),
    ("Computer Architecture", ["Instruction sets", "Pipelining", "Caches"]),
    ("CyberSec", ["Crypto basics", "Web attacks", "Network security"]),
    ("Machine Learning", ["Regression", "Neural networks", "Overfitting"]),
    ("Physics", ["Mechanics", "Electricity & magnetism", "Waves"]),
    ("Thermodynamics", ["The laws", "Cycles", "Heat transfer"]),
]
nav = {"screen": "home", "c": 0}      # which LCD screen: home | courses | topics
PROGRESS_FILE = pathlib.Path(__file__).with_name("saved_progress.json")
try:
    progress = json.loads(PROGRESS_FILE.read_text())
except Exception:
    progress = {}                      # "course:topic:level" -> best score ratio

def course_pct(ci):
    done = sum(1 for t in range(3) for lv in range(2) if progress.get(f"{ci}:{t}:{lv}", 0) >= 0.7)
    return round(100 * done / 6)

state = {
    "phase": "home",      # home | loading | quiz | done
    "topic": "", "style": "normal", "level": "medium", "notes": False, "is_review": False,
    "question": "", "choices": [], "answer": -1, "why": "", "qn": 0,
    "picked": -1, "result": "", "is_retry": False,
    "status": "", "source": "",
    "score": 0, "asked": 0, "streak": 0, "best_streak": 0,
    "done": 0, "total": 0, "review": [],
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
        return True
    except Exception as e:
        print("LCD error:", e)
        return False

# special LCD characters (the sketch draws them): 1 up, 2 down, 3 left, 4 right, 5 check, 6 cross, 7 star
UP, DOWN, LEFT, RIGHT, CHECK, CROSS, STAR = [chr(i) for i in range(1, 8)]

# ---------- 4. Web page API ----------
ui = WebUI()

def api_state():
    page_seen["t"] = time.time()
    return state

def api_topic(name: str):
    if name.strip():
        pending["cmd"] = ("topic", name.strip()[:120])
    return {"ok": True}

def api_notes(text: str):
    if text.strip():
        pending["cmd"] = ("notes", text.strip()[:1800])
    return {"ok": True}

def api_style(name: str):
    if name in STYLES:
        state["style"] = name
    return {"ok": True}

def api_level(name: str):
    if name in LEVELS:
        state["level"] = name
    return {"ok": True}

def api_answer(i: int):
    """Voice answers from the web page work like a stick push."""
    if 0 <= int(i) <= 3:
        answers.put(int(i))
    return {"ok": True}

def api_voice(on: int):
    """The page tells the board when Voice is on."""
    global voice_on
    voice_on = int(on) == 1
    return {"ok": True}

def api_next(n: int):
    """The page finished reading the explanation: go to the next question."""
    if int(n) == state["asked"]:
        nextq.put(1)
    return {"ok": True}

def api_home():
    pending["cmd"] = ("home",)
    return {"ok": True}

def api_again():
    pending["cmd"] = ("again",)
    return {"ok": True}

def api_review():
    pending["cmd"] = ("review",)
    return {"ok": True}

for path, fn in [("/api/state", api_state), ("/api/topic", api_topic), ("/api/notes", api_notes),
                 ("/api/style", api_style), ("/api/level", api_level), ("/api/answer", api_answer),
                 ("/api/voice", api_voice), ("/api/next", api_next), ("/api/home", api_home),
                 ("/api/again", api_again), ("/api/review", api_review)]:
    ui.expose_api("GET", path, fn)

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
                q["why"] = str(q.get("why", ""))[:220]
                good.append(q)
        if not good:
            raise ValueError("no usable questions")
        good = good[:DECK_SIZE]
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
    state["qn"] += 1
    state.update(question=q["q"], choices=q["choices"], answer=q["answer"], why="",
                 picked=-1, result="", is_retry=is_retry, status="")
    prefix = "Again: " if is_retry else f"Q{state['done'] + 1}/{state['total']} "
    lcd("lcd_question", "|".join([ascii(prefix + q["q"])] + [ascii(c)[:12] for c in q["choices"]]))
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

# ---------- 6. Lessons ----------
def reset_counters():
    state.update(score=0, asked=0, streak=0, done=0, total=0, review=[], question="", choices=[],
                 result="", why="", picked=-1, is_retry=False)
    missed_items.clear()

def show_home():
    """Draw the current LCD menu: home -> courses -> topics. Up/right/down/left pick the options."""
    ci = nav["c"]
    name = COURSES[ci][0]
    if nav["screen"] == "home":
        packed = ["Broof", "0:Courses"]
    elif nav["screen"] == "courses":
        packed = [ascii(f"{name} {course_pct(ci)}%"), "0:Open topics", "1:Next course", "3:Prev course", "2:Exit"]
    else:
        packed = [ascii(name)] + [f"{i}:{ascii(t)}" for i, t in enumerate(COURSES[ci][1])] + ["3:Exit"]
    ok = lcd("lcd_menu", "|".join(packed))
    home_lcd["t"] = time.time() if ok else time.time() - 25   # if the LCD is not ready, try again in 5 s

def go_home():
    global current, deck, retry
    deck, retry, current = [], [], None
    state.update(phase="home", question="", choices=[], result="", why="")
    led(0, 0, 0)
    home_lcd["t"] = 0.0           # draw it on the next loop (the LCD may still be booting)

def home_answer(choice):
    """Stick on the menus. Courses: up = open, right = next, left = previous, down = exit. Topics: up/right/down = topic, left = exit."""
    n = len(COURSES)
    if nav["screen"] == "home":
        if choice == 0:
            nav["screen"] = "courses"
    elif nav["screen"] == "courses":
        if choice == 0:
            nav["screen"] = "topics"
        elif choice == 1:
            nav["c"] = (nav["c"] + 1) % n
        elif choice == 3:
            nav["c"] = (nav["c"] - 1) % n
        elif choice == 2:
            nav["screen"] = "home"
    else:
        if choice in (0, 1, 2):
            start_nav_lesson(nav["c"], choice, 0)
            return
        nav["screen"] = "courses"
    show_home()

def start_nav_lesson(ci, ti, lv):
    """Level 1 = easy, level 2 = hard. One Gemini call for the topic."""
    state["level"] = "easy" if lv == 0 else "hard"
    nav.update(screen="topics", c=ci)
    start_lesson("topic", f"{COURSES[ci][0]}: {COURSES[ci][1][ti]}", ctx=(ci, ti, lv))

def done_answer(choice):
    """Results menu. Course lessons: up = next level/topic, right = redo, down = topics, left = courses."""
    ctx = last_lesson.get("ctx")
    if ctx:
        ci, ti, lv = ctx
        if choice == 0:
            if lv == 0:
                start_nav_lesson(ci, ti, 1)
            elif ti < 2:
                start_nav_lesson(ci, ti + 1, 0)
            else:
                nav.update(screen="courses", c=(ci + 1) % len(COURSES))
                go_home()
        elif choice == 1:
            start_nav_lesson(ci, ti, lv)
        elif choice == 2:
            nav.update(screen="topics", c=ci)
            go_home()
        elif choice == 3:
            nav.update(screen="courses", c=ci)
            go_home()
        return
    if choice == 0:
        start_lesson(last_lesson["kind"], last_lesson["text"] or state["topic"])
    elif choice == 1:
        start_review()
    elif choice == 2:
        nav["screen"] = "home"
        go_home()

def start_lesson(kind, text, ctx=None):
    """kind = 'topic' or 'notes'. One Gemini call, then 8 questions."""
    global deck, retry, current, notes_text
    last_lesson.update(kind=kind, text=text, ctx=ctx)
    if kind == "notes":
        notes_text = text
        state.update(topic="My notes", notes=True)
    else:
        notes_text = ""
        state.update(topic=text, notes=False)
    reset_counters()
    state.update(phase="loading", is_review=False, status="Gemini is writing your lesson...")
    retry, current = [], None
    led(0, 0, 1)                          # blue = thinking
    lcd("lcd_message", "Thinking...|Gemini: " + ascii(state["topic"])[:16])
    deck = fetch_deck(notes_text)
    led(0, 0, 0)
    state.update(total=len(deck), phase="quiz", status="")

def start_review():
    """Quiz again on only the questions missed on the first try. No Gemini call."""
    global deck, retry, current
    items = [dict(m) for m in missed_items]
    if not items:
        return
    random.shuffle(items)
    reset_counters()
    deck, retry, current = items, [], None
    state.update(total=len(deck), phase="quiz", is_review=True, status="")

def finish_lesson():
    global current
    current = None
    state.update(phase="done", question="", choices=[], result="", why="")
    print(f"\nLesson done: {state['score']}/{state['total']}")
    good = state["total"] > 0 and state["score"] * 10 >= state["total"] * 7
    led(0, 1, 0) if good else led(0, 0, 1)
    ctx = last_lesson.get("ctx")
    if not ctx:                       # lesson started from the web page
        options = ["0:New lesson"] + (["1:Review misses"] if missed_items else []) + ["2:Home"]
        lcd("lcd_menu", "|".join([f"Done! {state['score']}/{state['total']} {STAR}"] + options))
        return
    ci, ti, lv = ctx
    key = f"{ci}:{ti}:{lv}"
    progress[key] = max(progress.get(key, 0), state["score"] / max(1, state["total"]))
    try:
        PROGRESS_FILE.write_text(json.dumps(progress))
    except Exception as e:
        print("Could not save progress (fine):", str(e)[:100])
    pts = state["score"] * 10 + state["best_streak"] * 2
    lcd("lcd_message", f"Done! {state['score']}/{state['total']} {STAR}|Points: {pts}")
    time.sleep(2.5)
    lcd("lcd_message", f"Streak: {state['best_streak']}|Course {ci + 1}: {course_pct(ci)}% done")
    time.sleep(2.5)
    if missed_items:
        lcd("lcd_message", f"Review: {len(missed_items)} missed|" + ascii(missed_items[0]["q"])[:60])
    else:
        lcd("lcd_message", f"No misses! {STAR}|Nice work")
    time.sleep(3.0)
    nxt = "Next level" if lv == 0 else ("Next topic" if ti < 2 else "Next course")
    lcd("lcd_menu", "|".join([f"Done! {state['score']}/{state['total']} {STAR}", f"0:{nxt}", "1:Redo", "2:Topics", "3:Courses"]))
    while not answers.empty():        # ignore pushes made during the summary
        answers.get_nowait()

def handle_cmd(cmd):
    if cmd[0] == "home":
        nav["screen"] = "home"
        go_home()
    elif cmd[0] == "topic":
        start_lesson("topic", cmd[1])
    elif cmd[0] == "notes":
        start_lesson("notes", cmd[1])
    elif cmd[0] == "again":
        start_lesson(last_lesson["kind"], last_lesson["text"] or state["topic"], ctx=last_lesson.get("ctx"))
    elif cmd[0] == "review":
        start_review()

def wait_for_next():
    """After an answer: wait until the web page has finished speaking (or a timer if no page)."""
    while not nextq.empty():
        nextq.get_nowait()
    t0 = time.time()
    while True:
        elapsed = time.time() - t0
        page_live = time.time() - page_seen["t"] < 3.0
        if not page_live and elapsed > dwell["s"]:
            return                        # nobody is watching the page: short pause
        if elapsed > 90:
            return
        try:
            nextq.get(timeout=0.1)
            return
        except queue.Empty:
            pass
        if not answers.empty():           # push the stick again to skip ahead
            answers.get_nowait()
            return
        if "cmd" in pending:
            return

# ---------- 7. Main loop ----------
def loop():
    global current, current_retry

    cmd = pending.pop("cmd", None)
    if cmd:
        handle_cmd(cmd)
        return

    if state["phase"] in ("home", "done", "loading"):
        if state["phase"] == "home" and time.time() - home_lcd["t"] > 30:
            show_home()
        try:
            choice = answers.get(timeout=0.2)
        except queue.Empty:
            return
        if state["phase"] == "home":
            home_answer(choice)
        elif state["phase"] == "done":
            done_answer(choice)
        return

    if current is None:
        q, is_retry = next_question()
        if q is None:
            finish_lesson()
            return
        current, current_retry = q, is_retry
        while not answers.empty():        # ignore pushes made while waiting
            answers.get_nowait()
        show(current, is_retry)
        return

    try:
        choice = answers.get(timeout=0.1)
    except queue.Empty:
        return

    state["asked"] += 1
    if not current_retry:
        state["done"] += 1
    state["picked"] = choice
    state["why"] = current.get("why", "")
    right_text = current["choices"][current["answer"]]
    letter = "ABCD"[current["answer"]]
    if choice == current["answer"]:
        if not current_retry:
            state["score"] += 1
        else:
            for r in state["review"]:
                if r["q"] == current["q"]:
                    r["recovered"] = True
        state["streak"] += 1
        state["best_streak"] = max(state["best_streak"], state["streak"])
        state.update(result="right", status="Correct!")
        print("Correct!")
        led(0, 1, 0)                      # green
        lcd("lcd_message", f"{CHECK} Correct! {STAR}x{state['streak']}|" + ascii(current.get("why", ""))[:90])
        dwell["s"] = min(24.0, 3.0 + 0.26 * len(ascii(current.get("why", ""))[:90]))
    else:
        state["streak"] = 0
        state.update(result="wrong", status=f"Not quite. Answer: {letter}) {right_text}")
        print(f"Wrong. Answer: {letter}) {right_text}")
        led(1, 0, 0)                      # red
        lcd("lcd_message", f"{CROSS} Answer: {letter}|" + ascii(f"{right_text}. {current.get('why', '')}")[:100])
        dwell["s"] = min(24.0, 3.0 + 0.26 * len(ascii(f"{right_text}. {current.get('why', '')}")[:100]))
        if not current_retry:             # first miss: remember it, and ask once more later
            missed_items.append(dict(current))
            state["review"].append({"q": current["q"], "correct": f"{letter}) {right_text}",
                                    "why": current.get("why", ""), "recovered": False})
            retry.append([state["asked"] + RETRY_GAP, dict(current)])
    print(f"Score: {state['score']}/{state['done']}")

    wait_for_next()                       # the page tells us when the voice is done
    led(0, 0, 0)
    current = None                        # next loop takes the next question

go_home()
App.run(user_loop=loop)

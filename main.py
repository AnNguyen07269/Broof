import json
import queue
import random
import re
import time

from arduino.app_utils import App, Bridge
from arduino.app_bricks.cloud_llm import CloudLLM, CloudModel

# ---------- 1. Settings ----------
TOPIC = "Electronics I: diodes, BJTs and op-amps"

SYSTEM_PROMPT = (
    "You write ONE multiple-choice quiz question. "
    "Reply with ONLY a JSON object, no markdown, no extra text: "
    '{"q": "question", "choices": ["a", "b", "c", "d"], "answer": 0}. '
    "Exactly 4 short choices. answer is the index (0-3) of the correct one. "
    "Mix up which index is correct."
)

llm = CloudLLM(model=CloudModel.GOOGLE_GEMINI, system_prompt=SYSTEM_PROMPT)

# Used if Wi-Fi or Gemini fails, so the demo never dies
BACKUP = [
    {"q": "Ohm's law: V equals?", "choices": ["I*R", "I/R", "R/I", "I+R"], "answer": 0},
    {"q": "Unit of capacitance?", "choices": ["Henry", "Farad", "Ohm", "Tesla"], "answer": 1},
    {"q": "Silicon diode forward drop?", "choices": ["0.1 V", "0.7 V", "3.3 V", "5 V"], "answer": 1},
    {"q": "Ideal op-amp input current?", "choices": ["Infinite", "1 mA", "Zero", "1 A"], "answer": 2},
]

# ---------- 2. State ----------
answers = queue.Queue()   # answers from the switches wait here
current = None            # the question on screen right now
recent = []               # last few questions, so Gemini doesn't repeat
score = 0
asked = 0

# ---------- 3. Bridge: the sketch calls this when a switch flips ON ----------
def on_answer(index: int):
    answers.put(int(index))

Bridge.provide("answer", on_answer)

def led(r, g, b):
    try:
        Bridge.call("set_color", r, g, b)
    except Exception as e:
        print("LED error:", e)

# ---------- 4. Getting a question ----------
def new_question():
    try:
        avoid = " | ".join(recent[-5:])
        raw = llm.chat(f"Topic: {TOPIC}. Do not repeat these: {avoid}")
        raw = re.sub(r"^```(json)?|```$", "", raw.strip()).strip()
        q = json.loads(raw)
        if len(q["choices"]) != 4 or not 0 <= int(q["answer"]) <= 3:
            raise ValueError("bad format")
        q["answer"] = int(q["answer"])
    except Exception as e:
        print("Gemini failed, using a backup question:", e)
        q = random.choice(BACKUP)
    recent.append(q["q"])
    return q

def show(q):
    print("\n" + "=" * 40)
    print("Q:", q["q"])
    for i, choice in enumerate(q["choices"]):
        print(f"   {'ABCD'[i]}) {choice}")
    print("Flip a switch: 1=A  2=B  3=C  4=D")

# ---------- 5. Main loop ----------
def loop():
    global current, score, asked

    if current is None:
        led(0, 0, 1)                      # blue = thinking
        current = new_question()
        while not answers.empty():        # ignore flips made while waiting
            answers.get_nowait()
        led(0, 0, 0)
        show(current)
        return

    try:
        choice = answers.get(timeout=0.1)
    except queue.Empty:
        return

    asked += 1
    if choice == current["answer"]:
        score += 1
        print("Correct!")
        led(0, 1, 0)                      # green
    else:
        right = current["choices"][current["answer"]]
        print(f"Wrong. Answer: {'ABCD'[current['answer']]}) {right}")
        led(1, 0, 0)                      # red
    print(f"Score: {score}/{asked}")

    time.sleep(2)
    led(0, 0, 0)
    current = None                        # next loop gets a new question

App.run(user_loop=loop)

# Broof

**Your brain-rot-proof study bro.** A hands-on study box built solo at MakeUC 2026.

Gemini writes a quiz on any topic. You answer by flipping a real switch. The board's LCD and lights tell you right or wrong. Questions on a web page show your score and streak.

## How it works

- **Arduino UNO Q**, two brains:
  - Linux side (python/main.py): quiz logic, Gemini calls, web page
  - Microcontroller side (sketch/sketch.ino): debounced DIP switches, Grove LCD RGB backlight, RGB LED
  - They talk through the Arduino Bridge
- **Gemini API** (Cloud LLM brick): one call writes a deck of 8 questions
- **Web page** (assets/index.html): question, score, streak, topic picker
- Backup decks keep the demo working without Wi-Fi or quota

## Hardware

Arduino UNO Q, 4-switch DIP switch (D2 to D5), Grove LCD RGB Backlight V4.0 (I2C), breadboard, jumper wires.

## Run it

1. Open the app in Arduino App Lab, add the Cloud LLM brick (Gemini) and paste your own API key in its settings.
2. Run the app and open http://localhost:7000
3. Flip one switch to answer (1=A, 2=B, 3=C, 4=D), then flip it back.

Never commit API keys.

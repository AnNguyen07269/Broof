#include <Arduino_RouterBridge.h>

// ---------- Inputs: DIP switches 1-4 = answers A-D ----------
const int answerPins[4] = {D2, D3, D4, D5};
bool wasOn[4] = {false, false, false, false};

// ---------- Output: the board's RGB LED (LED3) ----------
// These LEDs light up when the pin is LOW ("active low").
// If the colors look inverted, swap LOW and HIGH below.
const int LED_ON = LOW;
const int LED_OFF = HIGH;

bool set_color(int r, int g, int b) {
  digitalWrite(LED3_R, r ? LED_ON : LED_OFF);
  digitalWrite(LED3_G, g ? LED_ON : LED_OFF);
  digitalWrite(LED3_B, b ? LED_ON : LED_OFF);
  return true;
}

void setup() {
  Bridge.begin();
  Monitor.begin();

  for (int i = 0; i < 4; i++) {
    pinMode(answerPins[i], INPUT_PULLUP);  // OFF = HIGH, ON = LOW
  }

  pinMode(LED3_R, OUTPUT);
  pinMode(LED3_G, OUTPUT);
  pinMode(LED3_B, OUTPUT);
  set_color(0, 0, 0);

  // Python can call set_color(r, g, b) through the Bridge
  Bridge.provide_safe("set_color", set_color);
}

void loop() {
  for (int i = 0; i < 4; i++) {
    bool isOn = digitalRead(answerPins[i]) == LOW;

    if (isOn && !wasOn[i]) {         // switch just flipped ON
      Monitor.print("Answer: ");
      Monitor.println((char)('A' + i));
      Bridge.notify("answer", i);    // tell Python: 0=A, 1=B, 2=C, 3=D
    }
    wasOn[i] = isOn;
  }
  delay(30);                         // simple debounce
}

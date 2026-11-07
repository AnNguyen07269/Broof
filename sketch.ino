#include <Arduino_RouterBridge.h>

// ---------- Inputs: DIP switches 1-4 = answers A-D ----------
const int answerPins[4] = {D2, D3, D4, D5};
bool stableOn[4] = {false, false, false, false};   // debounced state
bool lastRaw[4] = {false, false, false, false};
unsigned long changedAt[4] = {0, 0, 0, 0};
const unsigned long DEBOUNCE_MS = 60;   // contact must be steady this long

// "Armed" = every switch is OFF. An answer only counts when armed,
// so a bouncing contact or a slow flip can never answer twice.
bool armed = true;

// ---------- Output: the board's RGB LED (LED3, active low) ----------
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

  Bridge.provide_safe("set_color", set_color);
}

void loop() {
  unsigned long now = millis();
  bool anyOn = false;

  for (int i = 0; i < 4; i++) {
    bool raw = digitalRead(answerPins[i]) == LOW;

    // 1. Debounce: only accept a new state after it stays steady
    if (raw != lastRaw[i]) {
      lastRaw[i] = raw;
      changedAt[i] = now;
    }
    if (now - changedAt[i] >= DEBOUNCE_MS && raw != stableOn[i]) {
      stableOn[i] = raw;

      // 2. A clean OFF->ON while armed = one answer
      if (stableOn[i] && armed) {
        armed = false;
        Monitor.print("Answer: ");
        Monitor.println((char)('A' + i));
        Bridge.notify("answer", i);   // 0=A, 1=B, 2=C, 3=D
      }
    }
    if (stableOn[i]) anyOn = true;
  }

  // 3. Re-arm only when every switch is back OFF
  if (!anyOn) armed = true;

  delay(5);
}

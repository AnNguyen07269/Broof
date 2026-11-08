#include <Arduino_RouterBridge.h>
#include <Wire.h>

// =====================================================================
//  Broof - MCU side (the "reflexes")
//  Inputs : DIP switches 1-4 = answers A-D  (D2-D5)
//  Outputs: Grove LCD RGB (I2C: SDA/SCL) + board RGB LED
// =====================================================================

// ---------- DIP switches ----------
const int answerPins[4] = {D2, D3, D4, D5};
bool stableOn[4] = {false, false, false, false};
bool lastRaw[4] = {false, false, false, false};
unsigned long changedAt[4] = {0, 0, 0, 0};
const unsigned long DEBOUNCE_MS = 60;
bool armed = true;   // an answer only counts when all switches were OFF

// ---------- Board RGB LED (active low) ----------
const int LED_ON = LOW;
const int LED_OFF = HIGH;

// ---------- Grove LCD RGB Backlight V4.0 ----------
const uint8_t LCD_ADDR = 0x3E;   // text chip
const uint8_t RGB_ADDR = 0x62;   // backlight chip

String line1 = "";          // question (scrolls if long)
String choices[4];
int numChoices = 0;
int showing = 0;            // which choice line 2 shows right now
bool cycling = false;       // line 2 rotates through A-D while asking
int scrollPos = 0;
unsigned long lastScroll = 0, lastCycle = 0;
const unsigned long SCROLL_MS = 350, CYCLE_MS = 1500;

void lcdCommand(uint8_t c) {
  Wire.beginTransmission(LCD_ADDR); Wire.write(0x80); Wire.write(c); Wire.endTransmission();
}
void lcdChar(uint8_t c) {
  Wire.beginTransmission(LCD_ADDR); Wire.write(0x40); Wire.write(c); Wire.endTransmission();
}
void rgbWrite(uint8_t reg, uint8_t v) {
  Wire.beginTransmission(RGB_ADDR); Wire.write(reg); Wire.write(v); Wire.endTransmission();
}
void lcdColor(int r, int g, int b) {
  rgbWrite(0x04, r); rgbWrite(0x03, g); rgbWrite(0x02, b);
}
void lcdInit() {
  delay(500);   // give the LCD time to power up before talking to it
  lcdCommand(0x28); delay(5);
  lcdCommand(0x28); delay(1);
  lcdCommand(0x28);
  lcdCommand(0x0C);            // display on, no cursor
  lcdCommand(0x01); delay(2);  // clear
  lcdCommand(0x06);            // left to right
  rgbWrite(0x00, 0x00);
  rgbWrite(0x08, 0xFF);
  rgbWrite(0x01, 0x20);
  lcdColor(40, 40, 120);
}
// print exactly 16 chars on a row
void lcdRow(int row, const String &t) {
  lcdCommand(row == 0 ? 0x80 : 0xC0);
  for (int i = 0; i < 16; i++) lcdChar(i < (int)t.length() ? (uint8_t)t[i] : ' ');
}
void drawLine1() {
  if ((int)line1.length() <= 16) { lcdRow(0, line1); return; }
  String p = line1 + "   ", w = "";
  for (int i = 0; i < 16; i++) w += p[(scrollPos + i) % p.length()];
  lcdRow(0, w);
}
void drawChoice() {
  if (numChoices == 0) return;
  lcdRow(1, String((char)('A' + showing)) + ")" + choices[showing]);
}

// ---------- Functions Python calls through the Bridge ----------
bool set_color(int r, int g, int b) {
  digitalWrite(LED3_R, r ? LED_ON : LED_OFF);
  digitalWrite(LED3_G, g ? LED_ON : LED_OFF);
  digitalWrite(LED3_B, b ? LED_ON : LED_OFF);
  if (r || g || b) lcdColor(r ? 200 : 0, g ? 200 : 0, b ? 200 : 0);
  else lcdColor(120, 120, 120);   // neutral white while asking
  return true;
}

// question + choices in one string: "question|a|b|c|d"
bool lcd_question(String packed) {
  int start = 0, idx = 0;
  String parts[5];
  while (idx < 5) {
    int bar = packed.indexOf('|', start);
    if (bar == -1) { parts[idx++] = packed.substring(start); break; }
    parts[idx++] = packed.substring(start, bar);
    start = bar + 1;
  }
  line1 = parts[0];
  numChoices = idx - 1;
  for (int i = 0; i < numChoices; i++) choices[i] = parts[i + 1];
  showing = 0; scrollPos = 0; cycling = true;
  lastScroll = lastCycle = millis();
  drawLine1(); drawChoice();
  return true;
}

// two lines: "Correct!|Streak 3"
bool lcd_message(String packed) {
  cycling = false; numChoices = 0;
  int bar = packed.indexOf('|');
  line1 = bar == -1 ? packed : packed.substring(0, bar);
  scrollPos = 0; lastScroll = millis();
  drawLine1();
  lcdRow(1, bar == -1 ? "" : packed.substring(bar + 1));
  return true;
}

void setup() {
  Bridge.begin();
  Monitor.begin();

  for (int i = 0; i < 4; i++) pinMode(answerPins[i], INPUT_PULLUP);
  pinMode(LED3_R, OUTPUT); pinMode(LED3_G, OUTPUT); pinMode(LED3_B, OUTPUT);
  digitalWrite(LED3_R, LED_OFF); digitalWrite(LED3_G, LED_OFF); digitalWrite(LED3_B, LED_OFF);

  Wire.begin();
  lcdInit();
  lcdRow(0, "Broof");
  lcdRow(1, "brain-rot-proof");

  Bridge.provide_safe("set_color", set_color);
  Bridge.provide_safe("lcd_question", lcd_question);
  Bridge.provide_safe("lcd_message", lcd_message);
}

void loop() {
  unsigned long now = millis();

  // ---- LCD: scroll long text, rotate choices A-D on line 2 ----
  if ((int)line1.length() > 16 && now - lastScroll > SCROLL_MS) {
    scrollPos++; lastScroll = now; drawLine1();
  }
  if (cycling && numChoices > 0 && now - lastCycle > CYCLE_MS) {
    showing = (showing + 1) % numChoices; lastCycle = now; drawChoice();
  }

  // ---- Switches: debounce + armed ----
  bool anyOn = false;
  for (int i = 0; i < 4; i++) {
    bool raw = digitalRead(answerPins[i]) == LOW;
    if (raw != lastRaw[i]) { lastRaw[i] = raw; changedAt[i] = now; }
    if (now - changedAt[i] >= DEBOUNCE_MS && raw != stableOn[i]) {
      stableOn[i] = raw;
      if (stableOn[i] && armed) {
        armed = false;
        Monitor.print("Answer: ");
        Monitor.println((char)('A' + i));
        Bridge.notify("answer", i);
      }
    }
    if (stableOn[i]) anyOn = true;
  }
  if (!anyOn) armed = true;

  delay(5);
}

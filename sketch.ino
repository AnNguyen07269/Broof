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

// ---------- Grove Thumb Joystick (analog) ----------
// X -> A0, Y -> A1, VCC -> 3.3V, GND -> GND.
// Up = A, Right = B, Down = C, Left = D. Flip these if it feels backwards.
const int JOY_X = A0, JOY_Y = A1;
const bool JOY_INVERT_X = false;
const bool JOY_INVERT_Y = false;
const int JOY_DEAD = 220;            // out of 0-1023: how far to push before it counts
const unsigned long JOY_STABLE_MS = 40;
bool joyPresent = false;            // stays false if nothing is wired, so no ghost answers
int joyCx = 512, joyCy = 512;        // resting position, measured at start-up
int lastJoy = -1, stableJoy = -1;
unsigned long joyChangedAt = 0;

// ---------- Board RGB LED (active low) ----------
const int LED_ON = LOW;
const int LED_OFF = HIGH;

// ---------- Grove LCD RGB Backlight V4.0 ----------
const uint8_t LCD_ADDR = 0x3E;   // text chip
const uint8_t RGB_ADDR = 0x62;   // backlight chip

String line1 = "", line2 = "";   // top / bottom text (scroll if longer than 16)
String choices[4];
int dirs[4] = {0, 1, 2, 3};      // stick direction each option belongs to
int numChoices = 0;
int showing = 0;                 // which option the bottom row shows right now
bool cycling = false;            // bottom row rotates through the options
bool showLetter = true;          // "A)" before the text (questions); menus skip it
int scroll1 = 0, scroll2 = 0;
unsigned long lastScroll1 = 0, lastScroll2 = 0, lastCycle = 0, textAt = 0;
const unsigned long SCROLL1_MS = 330, SCROLL2_MS = 260, CYCLE_MS = 1400, SCROLL_DELAY_MS = 1200;

// custom glyphs, LCD codes 1-7
const uint8_t GLYPH[7][8] = {
  {0x04,0x0E,0x15,0x04,0x04,0x04,0x04,0x00},  // 1 up
  {0x04,0x04,0x04,0x04,0x15,0x0E,0x04,0x00},  // 2 down
  {0x02,0x06,0x0E,0x1E,0x0E,0x06,0x02,0x00},  // 3 left
  {0x08,0x0C,0x0E,0x0F,0x0E,0x0C,0x08,0x00},  // 4 right
  {0x00,0x01,0x03,0x16,0x1C,0x08,0x00,0x00},  // 5 check
  {0x00,0x11,0x0A,0x04,0x0A,0x11,0x00,0x00},  // 6 cross
  {0x04,0x04,0x1F,0x0E,0x0E,0x1B,0x11,0x00}   // 7 star
};
const uint8_t ARROW[4] = {1, 4, 2, 3};          // A=up B=right C=down D=left

void lcdCommand(uint8_t c) {
  Wire.beginTransmission(LCD_ADDR); Wire.write(0x80); Wire.write(c); Wire.endTransmission();
}
void lcdChar(uint8_t c) {
  Wire.beginTransmission(LCD_ADDR); Wire.write(0x40); Wire.write(c); Wire.endTransmission();
}
void lcdLoadGlyphs() {
  for (int g = 0; g < 7; g++) {
    lcdCommand(0x40 | ((g + 1) * 8));
    for (int r = 0; r < 8; r++) lcdChar(GLYPH[g][r]);
  lcdCommand(0x40); { const uint8_t SH[8] = {0x1F,0x15,0x1F,0x1F,0x0E,0x04,0x00,0x00}; for (int r = 0; r < 8; r++) lcdChar(SH[r]); }
  }
  lcdCommand(0x80);
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
  lcdLoadGlyphs();
}
// print exactly 16 chars on a row
void lcdRow(int row, const String &t) {
  lcdCommand(row == 0 ? 0x80 : 0xC0);
  for (int i = 0; i < 16; i++) lcdChar(i < (int)t.length() ? (t[i] == '`' ? 0 : (uint8_t)t[i]) : ' ');
}
// one row: plain if it fits, otherwise a 16-char window that slides along
void drawRow(int row, const String &t, int pos) {
  if ((int)t.length() <= 16) { lcdRow(row, t); return; }
  String p = t + "   ", w = "";
  for (int i = 0; i < 16; i++) w += p[(pos + i) % p.length()];
  lcdRow(row, w);
}
void drawChoice() {
  if (numChoices == 0) return;
  int d = dirs[showing];
  String t = String((char)ARROW[d]) + " ";
  if (showLetter) t += String((char)('A' + d)) + ")";
  t += choices[showing];
  lcdRow(1, t);
}

// returns -1 (centered) or 0-3 for A-D
int joyDirection() {
  int dx = analogRead(JOY_X) - joyCx;
  int dy = analogRead(JOY_Y) - joyCy;
  if (JOY_INVERT_X) dx = -dx;
  if (JOY_INVERT_Y) dy = -dy;
  if (!joyPresent) return -1;
  if (abs(dx) < JOY_DEAD && abs(dy) < JOY_DEAD) return -1;
  if (abs(dy) >= abs(dx)) return dy > 0 ? 0 : 2;   // up = A, down = C
  return dx > 0 ? 1 : 3;                            // right = B, left = D
}

void joyCalibrate() {
  long sx = 0, sy = 0;
  int minx = 1023, maxx = 0, miny = 1023, maxy = 0;
  for (int i = 0; i < 20; i++) {
    int x = analogRead(JOY_X), y = analogRead(JOY_Y);
    sx += x; sy += y;
    if (x < minx) minx = x; if (x > maxx) maxx = x;
    if (y < miny) miny = y; if (y > maxy) maxy = y;
    delay(5);
  }
  joyCx = sx / 20; joyCy = sy / 20;
  // a real stick at rest sits near the middle and holds still
  joyPresent = (joyCx > 350 && joyCx < 680 && joyCy > 350 && joyCy < 680 &&
                (maxx - minx) < 40 && (maxy - miny) < 40);
  Monitor.println(joyPresent ? "Joystick found" : "No joystick detected (switches only)");
  Monitor.print("Joystick center: "); Monitor.print(joyCx); Monitor.print(", "); Monitor.println(joyCy);
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

// split "a|b|c" into parts[], returns how many
int splitBar(const String &packed, String *parts, int maxParts) {
  int start = 0, idx = 0;
  while (idx < maxParts) {
    int bar = packed.indexOf('|', start);
    if (bar == -1) { parts[idx++] = packed.substring(start); break; }
    parts[idx++] = packed.substring(start, bar);
    start = bar + 1;
  }
  return idx;
}
void resetText() { scroll1 = scroll2 = 0; textAt = lastScroll1 = lastScroll2 = lastCycle = millis(); showing = 0; }

// question + choices in one string: "question|a|b|c|d"
bool lcd_question(String packed) {
  String parts[5];
  int n = splitBar(packed, parts, 5);
  line1 = parts[0]; line2 = "";
  numChoices = n - 1; showLetter = true;
  for (int i = 0; i < numChoices; i++) { choices[i] = parts[i + 1]; dirs[i] = i; }
  cycling = true; resetText();
  drawRow(0, line1, 0); drawChoice();
  return true;
}

// menu: "title|0:Start|1:Next topic|2:Level" (digit before ':' picks the arrow)
bool lcd_menu(String packed) {
  String parts[5];
  int n = splitBar(packed, parts, 5);
  line1 = parts[0]; line2 = "";
  numChoices = n - 1; showLetter = false;
  for (int i = 0; i < numChoices; i++) {
    int c = parts[i + 1].indexOf(':');
    dirs[i] = c > 0 ? constrain(parts[i + 1].substring(0, c).toInt(), 0, 3) : i;
    choices[i] = c > 0 ? parts[i + 1].substring(c + 1) : parts[i + 1];
  }
  cycling = numChoices > 0; resetText();
  drawRow(0, line1, 0);
  if (numChoices > 0) drawChoice(); else lcdRow(1, "");
  return true;
}

// two lines: "Correct!|why text..." (either one slides if longer than 16)
bool lcd_message(String packed) {
  cycling = false; numChoices = 0;
  int bar = packed.indexOf('|');
  line1 = bar == -1 ? packed : packed.substring(0, bar);
  line2 = bar == -1 ? "" : packed.substring(bar + 1);
  resetText();
  drawRow(0, line1, 0); drawRow(1, line2, 0);
  return true;
}

void setup() {
  Bridge.begin();
  Monitor.begin();

  for (int i = 0; i < 4; i++) pinMode(answerPins[i], INPUT_PULLUP);
  pinMode(LED3_R, OUTPUT); pinMode(LED3_G, OUTPUT); pinMode(LED3_B, OUTPUT);
  digitalWrite(LED3_R, LED_OFF); digitalWrite(LED3_G, LED_OFF); digitalWrite(LED3_B, LED_OFF);

  Wire.begin();
  analogReadResolution(10);   // 0-1023
  joyCalibrate();             // keep the stick centered while it boots
  lcdInit();
  lcdRow(0, "Broof");
  lcdRow(1, "brain-rot-proof");

  Bridge.provide_safe("set_color", set_color);
  Bridge.provide_safe("lcd_question", lcd_question);
  Bridge.provide_safe("lcd_message", lcd_message);
  Bridge.provide_safe("lcd_menu", lcd_menu);
}

void loop() {
  unsigned long now = millis();

  // ---- LCD: slide long text (after a short pause so the start is readable), rotate options ----
  if (now - textAt > SCROLL_DELAY_MS) {
    if ((int)line1.length() > 16 && now - lastScroll1 > SCROLL1_MS) { scroll1++; lastScroll1 = now; drawRow(0, line1, scroll1); }
    if (!cycling && (int)line2.length() > 16 && now - lastScroll2 > SCROLL2_MS) { scroll2++; lastScroll2 = now; drawRow(1, line2, scroll2); }
  }
  if (cycling && numChoices > 1 && now - lastCycle > CYCLE_MS) {
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
  // ---- Joystick: same rules, shares the "armed" flag with the switches ----
  int jd = joyDirection();
  if (jd != lastJoy) { lastJoy = jd; joyChangedAt = now; }
  if (now - joyChangedAt >= JOY_STABLE_MS && jd != stableJoy) {
    stableJoy = jd;
    if (stableJoy >= 0 && armed) {
      armed = false;
      Monitor.print("Joystick answer: ");
      Monitor.println((char)('A' + stableJoy));
      Bridge.notify("answer", stableJoy);
    }
  }
  if (stableJoy >= 0) anyOn = true;

  if (!anyOn) armed = true;

  delay(5);
}

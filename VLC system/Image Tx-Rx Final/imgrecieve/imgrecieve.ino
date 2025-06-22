#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// OLED display configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Phototransistor configuration
const int phototransistorPin = A0; // analog pin connected to the phototransistor
const int threshold = 600;         // threshold for deciding between LOW and HIGH

// Timing constants (should match transmitter)
const unsigned long startPulseDelay = 200; // ms; start synchronization pulse (LED LOW)
const unsigned long bitDelay = 500;        // ms; duration of each bit

// Image dimensions (for a 21x21 image)
const int imageWidth = 21;
const int imageHeight = 21;
const int imageBytes = (imageWidth * imageHeight + 7) / 8; // number of bytes (55 for 441 pixels)

// Buffer to store the received image data
byte receivedImage[imageBytes];

// Global flag for synchronization detection
bool syncReceived = false;

void setup() {
  Serial.begin(9600);
  pinMode(phototransistorPin, INPUT);
  
  // Initialize OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;) ; // halt if OLED init fails
  }
  display.clearDisplay();
  display.display();
  
  Serial.println("Receiver started. Waiting for sync pulse...");
  
  // Wait for the synchronization pulse from the transmitter
  waitForSyncPulse();
  Serial.println("Sync pulse detected. Beginning image reception...");
  
  // Receive the image data from the transmitted signal
  receiveImage();
  
  // Once all data is received, display it on the OLED display
  displayImage();
  
  Serial.println("Image reception complete. System idle (LED HIGH).");
}

void loop() {
  // Once image reception and display are done, remain idle.
  // (Optionally, you could add a command to restart reception.)
  digitalWrite(LED_BUILTIN, HIGH); // keep the onboard LED HIGH to indicate idle state
  // Do nothing in loop
}

// Wait until a LOW level is detected for at least startPulseDelay ms
void waitForSyncPulse() {
  unsigned long pulseStart = 0;
  bool inPulse = false;
  
  while (!syncReceived) {
    int sensorValue = analogRead(phototransistorPin);
    if (sensorValue < threshold) { // LOW detected
      if (!inPulse) {
        inPulse = true;
        pulseStart = millis();
      }
      if (millis() - pulseStart >= startPulseDelay) {
        syncReceived = true;
      }
    } else {
      // Reset if the pulse is broken
      inPulse = false;
    }
  }
}

// Receive the image data, bit by bit, from the phototransistor
void receiveImage() {
  // For each byte in the image data
  for (int i = 0; i < imageBytes; i++) {
    byte currentByte = 0;
    // For each bit in the byte (MSB first)
    for (int bitPos = 7; bitPos >= 0; bitPos--) {
      // Wait half the bit period to sample in the middle of the bit interval
      delay(bitDelay / 2);
      int sensorValue = analogRead(phototransistorPin);
      bool bitValue = (sensorValue > threshold) ? 1 : 0;
      // Set the bit in the current byte
      currentByte |= (bitValue << bitPos);
      // Wait the remainder of the bit period
      delay(bitDelay / 2);
      Serial.print(bitValue); // Debug: print the bit value
    }
    receivedImage[i] = currentByte;
    Serial.print("  Byte "); Serial.print(i); Serial.print(": ");
    Serial.println(currentByte, BIN);
  }
  Serial.println();
}

// Display the received image on the OLED display
void displayImage() {
  display.clearDisplay();
  // Draw the received bitmap at coordinates (10,10)
  display.drawBitmap(10, 10, receivedImage, imageWidth, imageHeight, WHITE);
  display.display();
}
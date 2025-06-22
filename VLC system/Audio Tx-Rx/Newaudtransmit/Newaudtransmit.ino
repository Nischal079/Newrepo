#define LIFI_LED_PIN 9         // Digital pin for LiFi LED transmitter (binary output)
#define SPEAKER_PIN 6          // PWM pin for speaker output
#define SAMPLE_RATE 8000       // Desired sample rate in Hz (8 kHz)
#define BIT_DELAY 15           // Delay (in microseconds) per bit when transmitting
#define WAV_HEADER_SIZE 44     // Standard WAV header size (bytes)

unsigned long headerBytesSkipped = 0;  // Counter to skip the WAV header

// Transmits one byte over the LiFi LED by sending its 8 bits (MSB first)
// and prints the bits to the Serial Monitor.
void transmitByte(byte data) {
  Serial.print("Transmitting: ");
  for (int i = 7; i >= 0; i--) {
    int bitVal = (data >> i) & 0x01;
    digitalWrite(LIFI_LED_PIN, bitVal);
    Serial.print(bitVal);
    delayMicroseconds(BIT_DELAY);
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  pinMode(LIFI_LED_PIN, OUTPUT);
  pinMode(SPEAKER_PIN, OUTPUT);
  Serial.println("Waiting for audio file data from laptop...");
}

void loop() {
  // Only proceed if data is available from the laptop
  if (Serial.available() > 0) {
    byte sample = Serial.read();

    // Skip the WAV header bytes (first 44 bytes)
    if (headerBytesSkipped < WAV_HEADER_SIZE) {
      headerBytesSkipped++;
      return;
    }

    // Output the sample to the speaker using PWM
    analogWrite(SPEAKER_PIN, sample);

    // Transmit the sample as binary via the LiFi LED
    transmitByte(sample);

    // Timing: For an 8 kHz sample rate, each sample period is 125 microseconds.
    // The transmitByte() function already takes 8 * BIT_DELAY microseconds.
    // Add any extra delay if needed to maintain the sample rate.
    unsigned long desiredSampleDelay = 1000000 / SAMPLE_RATE; // ≈125 µs
    unsigned long transmitTime = 8 * BIT_DELAY;               // e.g., 8*15 = 120 µs
    if (desiredSampleDelay > transmitTime) {
      delayMicroseconds(desiredSampleDelay - transmitTime);
    }
  }
}

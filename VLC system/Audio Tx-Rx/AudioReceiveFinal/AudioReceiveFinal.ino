/*
 * LiFi WAV Receiver Code for Transmitter
 *
 * This version automatically receives the bit stream, converts it into a sound message,
 * and plays it through a speaker—no serial commands needed.
 *
 * Hardware Setup:
 * - A photodiode on PHOTODIODE_PIN detects the LED's signal.
 * - A ~500ms LED HIGH preamble triggers the reception.
 * - The transmitter sends a 44-byte WAV header followed by 128 bytes of audio sample data.
 * - The header’s bytes 24–27 (little-endian) hold the sample rate to set playback speed.
 */

#define PHOTODIODE_PIN A0       // Analog pin for photodiode input.
#define SPEAKER_PIN 9           // PWM pin for speaker output.
#define HEADER_SIZE 44          // Size of WAV header.
#define AUDIO_BUFFER_SIZE 128   // Number of audio sample bytes.

unsigned long transmissionSpeed = 1000; // Fixed transmission speed in bits per second.
unsigned long bitPeriod;                // Bit period in microseconds.

byte wavHeader[HEADER_SIZE];            // Buffer for the WAV header.
byte audioBuffer[AUDIO_BUFFER_SIZE];    // Buffer for audio sample data.
bool dataReceived = false;
unsigned long sampleDelay = 125;        // Playback delay per sample (default for 8kHz).

void setup() {
  Serial.begin(115200);
  pinMode(PHOTODIODE_PIN, INPUT);
  pinMode(SPEAKER_PIN, OUTPUT);
  
  // Calculate the bit period.
  bitPeriod = 1000000UL / transmissionSpeed;
  
  Serial.println("LiFi WAV Receiver ready. Listening for transmissions...");
}

// Plays the received audio using PWM.
void playAudio() {
  Serial.println("Playing audio message...");
  for (int i = 0; i < AUDIO_BUFFER_SIZE; i++) {
    analogWrite(SPEAKER_PIN, audioBuffer[i]);  // Output sample (0-255 PWM duty cycle).
    delayMicroseconds(sampleDelay);
  }
  Serial.println("Audio playback complete.");
}

// Receives the WAV transmission from the transmitter.
void receiveWAVTransmission() {
  // Wait for the LED signal (preamble) to go HIGH.
  while (digitalRead(PHOTODIODE_PIN) == LOW) { }
  
  // Confirm a ~500ms HIGH as the preamble.
  unsigned long preambleStart = millis();
  while (digitalRead(PHOTODIODE_PIN) == HIGH) {
    if (millis() - preambleStart > 500) break;
  }

  // Use micros() for accurate timing.
  unsigned long startTime = micros();

  // Receive the 44-byte WAV header.
  for (int i = 0; i < HEADER_SIZE; i++) {
    byte data = 0;
    for (int bitIndex = 0; bitIndex < 8; bitIndex++) {
      unsigned long targetTime = startTime + ((i * 8 + bitIndex) * bitPeriod) + (bitPeriod / 2);
      while ((long)(micros() - targetTime) < 0) { } // Busy-wait until sampling time.
      int bitVal = digitalRead(PHOTODIODE_PIN);
      data |= (bitVal ? 1 : 0) << (7 - bitIndex);
    }
    wavHeader[i] = data;
  }
  
  // Parse the sample rate from header bytes 24-27 (little-endian).
  unsigned long sampleRate =  (unsigned long)wavHeader[24] 
                            | ((unsigned long)wavHeader[25] << 8)
                            | ((unsigned long)wavHeader[26] << 16)
                            | ((unsigned long)wavHeader[27] << 24);
  if (sampleRate == 0) sampleRate = 8000; // Fallback if parsing fails.
  sampleDelay = 1000000UL / sampleRate;
  Serial.print("WAV sample rate: ");
  Serial.println(sampleRate);
  
  // Receive the 128 bytes of audio data.
  unsigned long dataStartTime = startTime + (HEADER_SIZE * 8 * bitPeriod);
  for (int i = 0; i < AUDIO_BUFFER_SIZE; i++) {
    byte data = 0;
    for (int bitIndex = 0; bitIndex < 8; bitIndex++) {
      unsigned long targetTime = dataStartTime + ((i * 8 + bitIndex) * bitPeriod) + (bitPeriod / 2);
      while ((long)(micros() - targetTime) < 0) { }
      int bitVal = digitalRead(PHOTODIODE_PIN);
      data |= (bitVal ? 1 : 0) << (7 - bitIndex);
    }
    audioBuffer[i] = data;
  }
  dataReceived = true;
}

void loop() {
  // Continuously listen for a transmission.
  receiveWAVTransmission();
  
  if (dataReceived) {
    playAudio();
    dataReceived = false;
    Serial.println("Ready for next transmission.");
  }
}

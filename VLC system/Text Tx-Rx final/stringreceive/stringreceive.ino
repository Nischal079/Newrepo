#define RECEIVE_PIN A0       // Connect your phototransistor output here
#define SAMPLING_TIME 10    // Must match the transmitter's timing
#define THRESHOLD 20        // Phototransistor threshold

// Helper function to convert a byte to an 8-bit binary string.
String toBinaryString(byte data) {
  String binaryStr = "";
  for (int i = 7; i >= 0; i--) {
    binaryStr += ((data >> i) & 0x01) ? "1" : "0";
  }
  return binaryStr;
}

void setup() {
  Serial.begin(9600);
  pinMode(RECEIVE_PIN, INPUT);
  Serial.println("Receiver ready. Waiting for transmission...");
}

void loop() {
  // Wait for the start bit: expecting a LOW (i.e. analog reading below THRESHOLD).
  if (analogRead(RECEIVE_PIN) < THRESHOLD) {
    // Center the sampling by waiting half a bit time.
    delay(SAMPLING_TIME / 2);
    
    byte receivedByte = 0;
    
    // Read 8 data bits (LSB first).
    for (int i = 0; i < 8; i++) {
      delay(SAMPLING_TIME);  // Wait for the next bit period.
      int reading = analogRead(RECEIVE_PIN);
      int bitVal = (reading > THRESHOLD) ? 1 : 0;  // Compare against threshold.
      receivedByte |= (bitVal << i);
    }
    
    // Wait for and verify the stop bit (should be HIGH, i.e. above THRESHOLD).
    delay(SAMPLING_TIME);
    int stopReading = analogRead(RECEIVE_PIN);
    if (stopReading > THRESHOLD) {
     // Serial.print("Received character: ");
     // Serial.print(receivedByte);
     // Serial.print(" ('");
      Serial.print((char)receivedByte);
    //  Serial.print("') - Binary: ");
     // Serial.println(toBinaryString(receivedByte));
    } else {
      Serial.println("Error: Invalid stop bit detected.");
    }
    
    // Small delay to avoid retriggering on the same start bit.
    delay(1000);
  }
}
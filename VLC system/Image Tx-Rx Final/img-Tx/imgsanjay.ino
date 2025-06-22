#define TRANSMIT_LED 8
#define SAMPLING_TIME 6

// Chessboard data: 8x8 pixels (each byte represents a row)
uint8_t chessboard[8] = {0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA};
int total_bytes = 8;
int byte_index = 0;
bool waitingForRetransmitDecision = false;

void setup() {
  Serial.begin(9600);
  pinMode(TRANSMIT_LED, OUTPUT);
  digitalWrite(TRANSMIT_LED, HIGH);
  Serial.println("Press any key to start transmission...");
}

void loop() {
  if (waitingForRetransmitDecision) {
    if (Serial.available() > 0) {
      String decision = Serial.readStringUntil('\n');
      decision.trim();
      if (decision.equalsIgnoreCase("Y")) {
        waitingForRetransmitDecision = false;
        byte_index = 0;
        Serial.println("Retransmitting...");
      } else if (decision.equalsIgnoreCase("N")) {
        waitingForRetransmitDecision = false;
        Serial.println("Transmission ended. Press any key to restart.");
      } else {
        Serial.println("Invalid input. Please type Y or N:");
      }
    }
    return;
  }

  if (Serial.available() > 0) {
    Serial.readStringUntil('\n');
    byte_index = 0;
    Serial.println("Starting transmission...");
  }

  if (byte_index < total_bytes) {
    char currentByte = chessboard[byte_index];
    Serial.print("Transmitting byte ");
    Serial.print(byte_index);
    Serial.print(": 0x");
    Serial.print(currentByte, HEX);
    Serial.print(" (");
    Serial.print(toBinaryString(currentByte));
    Serial.println(")");
    
    transmit_byte(currentByte);
    byte_index++;
    
    if (byte_index >= total_bytes) {
      Serial.println("Transmission complete.");
      Serial.println("Do you want to retransmit? (Y/N)");
      waitingForRetransmitDecision = true;
    }
    delay(100);
  }
}

String toBinaryString(char data) {
  String binaryStr = "";
  for (int i = 7; i >= 0; i--) {
    binaryStr += ((data >> i) & 1) ? "1" : "0";
  }
  return binaryStr;
}

void transmit_byte(char data) {
  // Start bit (LOW)
  digitalWrite(TRANSMIT_LED, LOW);
  delay(SAMPLING_TIME);
  
  // Data bits (LSB first)
  for (int i = 0; i < 8; i++) {
    digitalWrite(TRANSMIT_LED, ((data >> i) & 0x01) ? HIGH : LOW);
    delay(SAMPLING_TIME);
  }
  
  // Stop bit (HIGH)
  digitalWrite(TRANSMIT_LED, HIGH);
  delay(1000); // Delay between bytes
}
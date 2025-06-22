#define TRANSMIT_LED 8
#define SAMPLING_TIME 5

String text = "";
int total_bytes = 0;
int byte_index = 0;
bool waitingForRetransmitDecision = false;

void setup() {
  Serial.begin(9600);
  pinMode(TRANSMIT_LED, OUTPUT);
  digitalWrite(TRANSMIT_LED, HIGH); // LED remains high when idle
  Serial.println("Enter the text to transmit:");
}

void loop() {
  // Check if we're waiting for the retransmit decision
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
        text = "";
        Serial.println("Transmission ended. Enter new text:");
      } else {
        Serial.println("Invalid input. Please type Y or N:");
      }
    }
    return; // Skip transmission until a decision is made
  }

  // If no text is stored, wait for user input.
  if (text == "" && Serial.available() > 0) {
    text = Serial.readStringUntil('\n');
    text.trim();
    if (text.length() > 0) {
      total_bytes = text.length();
      byte_index = 0;
      Serial.print("Transmitting: ");
      Serial.println(text);
    }
  }
  
  // Transmit the text if available
  if (text.length() > 0) {
    char currentByte = text.charAt(byte_index);
    String binary = toBinaryString(currentByte);
    Serial.print("Transmitting character: '");
    Serial.print(currentByte);
    Serial.print("' as binary: ");
    Serial.println(binary);
    
    transmit_byte(currentByte);
    byte_index++;
    
    // Check if we've finished one full transmission of the message.
    if (byte_index >= total_bytes) {
      Serial.println("Transmission complete.");
      Serial.println("Do you want to retransmit the message? (Y/N)");
      waitingForRetransmitDecision = true;
    }
    delay(100);  // Delay between transmitting each byte
  }
}

// Helper function to convert a char to its 8-bit binary representation.
String toBinaryString(char data) {
  String binaryStr = "";
  for (int i = 7; i >= 0; i--) {
    binaryStr += ((data >> i) & 1) ? "1" : "0";
  }
  return binaryStr;
}

void transmit_byte(char data) {
  // Start bit: set LED low.
  digitalWrite(TRANSMIT_LED, LOW);
  delay(SAMPLING_TIME);
  
  // Send 8 data bits.
  for (int i = 0; i < 8; i++) {
    digitalWrite(TRANSMIT_LED, ((data >> i) & 0x01) ? HIGH : LOW);
    delay(SAMPLING_TIME);
  }
  
  // Stop bit: set LED high.
  digitalWrite(TRANSMIT_LED, HIGH);
  delay(1000);
}
#define xPin A1
#define yPin A2
#define zPin A3

void setup() {
  Serial.begin(9600);
}

void loop() {
  int xRaw = analogRead(xPin);
  int yRaw = analogRead(yPin);
  int zRaw = analogRead(zPin);

  // Print the raw readings to check if the gyroscope is providing any data
  Serial.print("X: ");
  Serial.print(xRaw);
  Serial.print("\tY: ");
  Serial.print(yRaw);
  Serial.print("\tZ: ");
  Serial.println(zRaw);

  delay(200);
}

int gyro_X_pin = A1; // Gyroscope X-axis connected to analog pin A1
int gyro_Y_pin = A2; // Gyroscope Y-axis connected to analog pin A2
int gyro_Z_pin = A3; // Gyroscope Z-axis connected to analog pin A3

void setup() {
  Serial.begin(9600);
}

void loop() {
  int gyro_X = analogRead(gyro_X_pin);
  int gyro_Y = analogRead(gyro_Y_pin);
  int gyro_Z = analogRead(gyro_Z_pin);

  Serial.print("Gyro X: ");
  Serial.print(gyro_X);
  Serial.print(" | Gyro Y: ");
  Serial.print(gyro_Y);
  Serial.print(" | Gyro Z: ");
  Serial.println(gyro_Z);
  
  delay(1000); // adjust the delay as needed
}

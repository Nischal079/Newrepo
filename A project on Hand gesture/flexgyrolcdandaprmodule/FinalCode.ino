#include<Wire.h>
#include <LiquidCrystal.h>
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
const int xInput = A6;
const int yInput = A7;
const int zInput = A8;
int RawMin = 0;
int RawMax = 1023;
const int sampleSize = 10;
const float VCC = 5;      // voltage at Ardunio 5V line
const float R_DIV = 4700.0;  // resistor used to create a voltage divider
const float flatResistance = 25000.0; // resistance when flat
const float bendResistance = 100000.0;  // resistance at 90 deg
const int flexPin1 = A1;    
const int flexPin2 = A2;    
const int flexPin3 = A3;    
const int flexPin4 = A4;    
const int flexPin5 = A5;  
int D=1000;
#define M1 2
#define M2 3
#define M3 4
#define M4 5
#define M5 6
#define M6 7
#define M7 8
#define M8 9
void setup()
{
  Serial.begin(9600);
  Wire.begin();
  lcd.begin(16, 2);
  pinMode(flexPin1, INPUT);
  pinMode(flexPin2, INPUT);
  pinMode(flexPin3, INPUT);
  pinMode(flexPin4, INPUT);
  pinMode(flexPin5, INPUT);
   pinMode(M1, OUTPUT);
  pinMode(M2, OUTPUT);
  pinMode(M3, OUTPUT);
  pinMode(M4, OUTPUT);
  pinMode(M5, OUTPUT);
  pinMode(M6, OUTPUT);
  pinMode(M7, OUTPUT);
  pinMode(M8, OUTPUT);

  // Set the pins to HIGH (inactive state)
  digitalWrite(M1, HIGH);
  digitalWrite(M2, HIGH);
  digitalWrite(M3, HIGH);
  digitalWrite(M4, HIGH);
  digitalWrite(M5, HIGH);
  digitalWrite(M6, HIGH);
  digitalWrite(M7, HIGH);
  digitalWrite(M8, HIGH);
}


void loop() 
{
  int xRaw = ReadAxis(xInput);
  int yRaw = ReadAxis(yInput);
  int zRaw = ReadAxis(zInput);
  
  long xScaled = map(xRaw, RawMin, RawMax, -3000, 3000);
  long yScaled = map(yRaw, RawMin, RawMax, -3000, 3000);
  long zScaled = map(zRaw, RawMin, RawMax, -3000, 3000);
  
  Serial.println("X, Y, Z :: ");
  Serial.print(xRaw);
  Serial.print(", ");
  Serial.print(yRaw);
  Serial.print(", ");
  Serial.println(zRaw);
  Serial.println(" :: ");
  int ADCflex1= analogRead(flexPin1);
  int ADCflex2= analogRead(flexPin2);
  int ADCflex3= analogRead(flexPin3);
  int ADCflex4= analogRead(flexPin4);
  int ADCflex5= analogRead(flexPin5);

  float Vflex1 = ADCflex1 * VCC / 1023.0;
  float Vflex2 = ADCflex2 * VCC / 1023.0;
  float Vflex3 = ADCflex3 * VCC / 1023.0;
  float Vflex4 = ADCflex4 * VCC / 1023.0;
  float Vflex5 = ADCflex5 * VCC / 1023.0;


  float Rflex1 = R_DIV * (VCC / Vflex1 - 1.0);
  float Rflex2 = R_DIV * (VCC / Vflex2 - 1.0);
  float Rflex3 = R_DIV * (VCC / Vflex3 - 1.0);
  float Rflex4 = R_DIV * (VCC / Vflex4 - 1.0);
  float Rflex5 = R_DIV * (VCC / Vflex5 - 1.0);
  if ((xRaw > 320) && (yRaw > 320) && (zRaw > 320)) {
    if((Rflex1<26000) and (Rflex2<29000) and (Rflex3<30000) and (Rflex4<26000) and (Rflex5<27000)){
    Serial.println("Sensor is ready/straight");
   }
    else if((Rflex1>26000)and (Rflex2<29000) and (Rflex3<30000) and (Rflex4<26000)and (Rflex5<27000)){
      
        lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("I am hungry");
      playMessage(M1);
      }
    else if((Rflex1<26000) and (Rflex2>29000) and (Rflex3<30000) and (Rflex4<26000)and (Rflex5<27000)){
      
        lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Give me a glass of water");
      playMessage(M2);
      }
    else if((Rflex1<26000) and (Rflex2<29000) and (Rflex3>30000) and (Rflex4<26000)and (Rflex5<27000)){
        lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Hi, How are you");
      playMessage(M3);
      }
      else if((Rflex1<26000) and (Rflex2<29000) and (Rflex3<30000) and (Rflex4>26000)and (Rflex5<27000)){
          lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Nice to meet you");
      playMessage(M4);
        }
        else if((Rflex1<26000) and (Rflex2<29000) and (Rflex3<30000) and (Rflex4<26000) and (Rflex5>27000)){
            lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Good night");
      playMessage(M5);
          }
  } else {
    Serial.println("Not in alignment");
  }
  
  delay(2000);
}

int ReadAxis(int axisPin) {
  long reading = 0;
  analogRead(axisPin);
  delay(1);
  
  for (int i = 0; i < sampleSize; i++) {
    reading += analogRead(axisPin);
  }
  
  return reading / sampleSize;
}

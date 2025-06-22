#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Set the I2C address of your LCD module
#define I2C_ADDR 0x27

// Set the dimensions of your LCD (columns x rows)
#define LCD_COLUMNS 16
#define LCD_ROWS 2

// Create an instance of the LiquidCrystal_I2C class
LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLUMNS, LCD_ROWS);

void setup() {
  // Initialize the LCD with the I2C address and dimensions
  lcd.init();

  // Turn on the backlight (if available)
  lcd.backlight();

  // Print a message to the LCD
  lcd.print("Hello, LCD!");
}

void loop() {
  // Your loop code here
}

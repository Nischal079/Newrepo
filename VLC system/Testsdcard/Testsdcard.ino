#include <SPI.h>
#include <SD.h>
#include <TMRpcm.h>

#define SD_CS 10  // SD Card Module Chip Select Pin
#define AUDIO_PIN 9 // PWM Output for audio

TMRpcm audio;

void setup() {
    Serial.begin(9600);
    if (!SD.begin(SD_CS)) {
        Serial.println("SD Card Initialization Failed!");
        return;
    }
    Serial.println("Ready!");
    audio.speakerPin = AUDIO_PIN;
    // Play sound file (Ensure the file is "test.wav" on the SD card)
    audio.play("audio.wav");
}

void loop() {
    // Loop can be used for play/pause controls if needed
}

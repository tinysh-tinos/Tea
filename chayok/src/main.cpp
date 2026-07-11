#include "Arduino.h"

#define photo A0
#define water 2

void setup() {
  pinMode(photo, INPUT);
  pinMode(water, INPUT);

  Serial.begin(9600);
}

void serial_loop(){
  int a = analogRead(photo);
  int b = analogRead(water);

  Serial.print(a);
  Serial.print(", ");
  Serial.print(b);
}

void loop(){
  serial_loop();
  delay(100);
}
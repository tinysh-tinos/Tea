#include "Arduino.h"
#include "HX711.h"

#define photo A0
#define water 2
#define DT  A0
#define SCK A1

HX711 scale;                                                  

float calibration_factor = -14.15;                            
float units;                                                  
float ounces;                                                 

void setup() {
  pinMode(photo, INPUT);
  pinMode(water, INPUT);
  scale.begin(DT, SCK);                                       
  scale.set_scale();                                          
  scale.tare();                                               
  scale.set_scale(calibration_factor);    
  Serial.begin(9600);
}

void serial_loop(){
  int a = analogRead(photo);
  int b = analogRead(water);                            
  for (int i = 0; i < 10; i ++) {                              
    units = + scale.get_units(), 10;                          
  }
  units = units / 10;                                          
  ounces = units * 0.035274;                                  
  Serial.print(ounces);                                       

  Serial.print(a);
  Serial.print(", ");
  Serial.print(b);
}

void loop(){
  serial_loop();
  delay(100);
}

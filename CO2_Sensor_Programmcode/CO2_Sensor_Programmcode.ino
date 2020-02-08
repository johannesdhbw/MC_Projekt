// libraries
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include "Adafruit_CCS811.h"
#include <LiquidCrystal.h>
//#include <CO2Sensor.h>

// ******************************************************

// definition of lcd-pins
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
// definition of adafruit
Adafruit_CCS811 CCS;
 
// define led pin
#define RED       10
#define YELLOW    9
#define GREEN     8
#define TASTER 7

// define sampling rates for measurements
#define MODE_1    1
#define MODE_2    2
#define MODE_3    3

// define length of array
#define LENGTH 100

// values
int taster_1 = 0;    // Bestätigungs Taster
int taster_2 = 0;    // "Weiter" Taster
int taster_3 = 0;

// array for measurements
int measurement[LENGTH];

// counts runs
int i = 0;

// own functions
void printOut(int);
void writeLeds(int, int, int);
void ask(int);
void csvOutput(int, int);
int measurement_Mode();


// ******************************************************

void setup() {  
  // 16 character in 2 rows
  lcd.begin(16, 2);

  // labeling
  lcd.setCursor(0, 0);
  lcd.print("CO2-value:");

  // setup of led ouput
  pinMode(GREEN,OUTPUT);
  pinMode(YELLOW,OUTPUT);
  pinMode(RED,OUTPUT);

  // setup of taster input
  pinMode(TASTER, INPUT);

  // setup of serial output
  Serial.begin(9600);
  
  // sensor controll
  if(!CCS.begin()){
    Serial.println("Failed to start sensor! Please check your wiring.");
    while(1);
  }

  // wait for the sensor to be ready
  while(!CCS.available());
}

// ******************************************************

void loop() {

// ******************************************************
  int co2ppm = 0;

  co2ppm = 350;
  printOut(co2ppm);
  ask(co2ppm);
  csvOutput(1,co2ppm);
  delay(1000);

  co2ppm = 803;
  printOut(co2ppm);
  ask(co2ppm);
  csvOutput(2,co2ppm);
  delay(1000);

  co2ppm = 1400;
  printOut(co2ppm);
  ask(co2ppm);
  csvOutput(3,co2ppm);
  delay(1000);
  
  taster_1 = digitalRead(TASTER);
  if (taster_1 == HIGH)
  {
    lcd.setCursor(0, 0);
    lcd.print("Taster");
    delay(1000);
    lcd.setCursor(0, 0);
    lcd.print("CO2-value:");
  }
  
  // ******************************************************

  // clearing lcd display (better options?)
  lcd.clear();
  // labeling
  lcd.setCursor(0, 0);
  
  // ccs.available returns true if data is available to be read
  if(CCS.available()){
    // ccs.readdata returns true if an error occurs during the read
    if(!CCS.readData()){
  
      measurement[i] = CCS.geteCO2();

      // if length of array then stop
      if(i == LENGTH){
        Serial.print("finished");
        lcd.print("finished");
        while(1);
      }
      
      Serial.print("CO2: ");
      Serial.print(measurement[i]);
      Serial.print(";");
      Serial.print(i);
      lcd.print("CO2: ");
      lcd.print(measurement[i]);

      ++i;
    }
    else{
      Serial.println("ERROR!");
      lcd.print("ERROR!");
      // program stop
      while(1);
    }
  }
  delay(500);
}

// ******************************************************

// choose measurement Mode                                               lcd texts have yet to be added
int measurement_Mode(){
  // variable to save the modus
  int modus = 0; 
  while(modus == 0){
    // loop because it should wait until one of the two buttons was pushed
    while(taster_1 == 0 || taster_2 == 0){
      taster_1 = digitalRead(TASTER);
      taster_2 = digitalRead(TASTER);
      if(taster_1 = HIGH){
        modus = 1;
      }
    }
    // if quesitioning for breaking out of the menu loop 
    // otherwise the other loops would also be called
    if(modus != 0){
      break;
    }
    // reset taster_2 for the case the continue button was used
    taster_2 = 0;
    
    while(taster_1 == 0 || taster_2 == 0){
      taster_1 = digitalRead(TASTER);
      taster_2 = digitalRead(TASTER);
      if(taster_1 = HIGH){
        modus = 2;
      }
    }
      if(modus != 0){
      break;
    }
    taster_2 = 0;
    while(taster_1 == 0 || taster_2 == 0){
      taster_1 = digitalRead(TASTER);
      taster_2 = digitalRead(TASTER);
      if(taster_1 = HIGH){
        modus = 3;
      }
    }
  }
  return modus;
}

// ouput of co2 measurement
void printOut(int value){
  lcd.setCursor(0, 1);
  lcd.print(value);
  lcd.print(" ppm ");
}

// digital writing of leds
void writeLeds(int on, int firstOff, int secondOff){
    digitalWrite(on,HIGH);
    digitalWrite(firstOff,LOW);
    digitalWrite(secondOff,LOW);
}

// compare co2-level with limits
void ask(int value){
   if(value < 800){
    writeLeds(GREEN,YELLOW,RED);
  }else if(value > 799 && value < 1400){
    writeLeds(YELLOW,GREEN,RED);
  }else{
    writeLeds(RED,YELLOW,GREEN);
  }
}

void csvOutput(int number, int value){
  Serial.print(number);
  Serial.print(";");
  Serial.print(value);
  Serial.print('\n');
}

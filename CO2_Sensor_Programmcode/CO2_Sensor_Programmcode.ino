// libraries
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include "Adafruit_CCS811.h"
#include <LiquidCrystal.h>
#include <EEPROM.h>
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
#define TASTER    7

// define sampling rates for measurements
#define MODE_1    1
#define MODE_2    2
#define MODE_3    3

// define length of array
#define LENGTH_MODE_1 10
#define LENGTH_MODE_2 100
#define LENGTH_MODE_3 100

// define EEPROM range
#define EEPROM_MIN_ADDR  0
#define EEPROM_MAX_ADDR  255

// values
int taster_1 = 0;    // Bestätigungs Taster
int taster_2 = 0;    // "Weiter" Taster
int taster_3 = 0;

// array for measurements
int measurement[LENGTH_MODE_1];

// counts runs
int i = 0;

// own functions
void printOut(int);
void writeLeds(int, int, int);
void ask(int);
void csvOutput(int, int);
int measurement_Mode();
boolean writeEEPROM(int startAddr, const int* array, int numBytes);
boolean eepromAddrOk(int addr);
boolean readEEPROM(int startAddr, int array[], int numBytes);

// ******************************************************

void setup() {  
  // 16 character in 2 rows
  lcd.begin(16, 2);

  // labeling       Wird nicht gebraucht
  //lcd.setCursor(0, 0);
  //lcd.print("CO2-value:");

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
  // Erster Test ob LCD-Display funktionniert
  /*
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
  delay(1000);*/

  // Test für Tasterabfrage
  /*taster_1 = digitalRead(TASTER);
  if (taster_1 == HIGH)
  {
    lcd.setCursor(0, 0);
    lcd.print("Taster");
    delay(1000);
    lcd.setCursor(0, 0);
    lcd.print("CO2-value:");
  }
  */
  // ******************************************************

/////////////////////////////////////////////////////////////////////////////////////////////
// Test ob EEPROM Funktionen funktionieren
int start = 5;
int anzahl = 2;
 readEEPROM(start, measurement,anzahl);
/////////////////////////////////////////////////////////////////////////////////////////////




  // clearing lcd display (better options?)
  //lcd.clear();
  // labeling
  lcd.setCursor(0, 0);
  
  // ccs.available returns true if data is available to be read
  if(CCS.available()){
    // ccs.readdata returns true if an error occurs during the read
    if(!CCS.readData()){
  
      measurement[i] = CCS.geteCO2();

      // if length of array then stop
      if(i == LENGTH_MODE_1){ 
        lcd.clear();
        const int* array = measurement;
        int addr = 0;
        write_EEPROM(addr, array ,i);
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
// Check wether addr is ok
boolean eepromAddrOk(int addr) {
  return ((addr >= EEPROM_MIN_ADDR)) ; //&& ((addr <= EEPROM_MAX_ADDR));
}

// Write in EEPROM
boolean write_EEPROM(int startAddr, const int* array, int numBytes) {
  // counter
   lcd.setCursor(0,0);
  int i;
  // both first byte and last byte addresses must fall within
  // the allowed range  
  if (!eepromAddrOk(startAddr) || !eepromAddrOk(startAddr + numBytes)) {
    lcd.write("COULD N0T Write");
    delay(500);
    lcd.clear();
    return false;
  }
  for (i = 0; i < numBytes; i++) {
    EEPROM.write(startAddr + i, array[i]);
  }
  lcd.print("Write EEPROM");
  delay(500);
  lcd.clear();
  return true;
}

// Read from EEPROM
boolean readEEPROM(int startAddr, int array[], int numBytes) {
  int i=0;
  // both first byte and last byte addresses must fall within
  // the allowed range  
  if (!eepromAddrOk(startAddr) || !eepromAddrOk(startAddr + numBytes)) {
    return false;
  }
  for (i = 0; i < numBytes; i++) {
    //array[i] = EEPROM.read(startAddr + i);
    int wert = EEPROM.read(startAddr + i);
    lcd.clear();
    lcd.write(wert);
    delay(1000);
  }
  return true;
}

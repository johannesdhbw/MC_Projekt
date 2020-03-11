#include <Adafruit_CCS811.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SPITFT.h>
#include <Adafruit_SPITFT_Macros.h>
#include <gfxfont.h>

// libraries
#include <SPI.h>
#include <Wire.h>
//#include <Adafruit_GFX.h>
//#include "Adafruit_CCS811.h"
#include <LiquidCrystal.h>
#include <EEPROM.h> //unnötig
//#include <CO2Sensor.h>

// ******************************************************

// definition of lcd-pins
LiquidCrystal lcd(7, 6, 5, 4, 3, 2);
// definition of adafruit
Adafruit_CCS811 CCS;
 
// define analog pin
#define RED       A3
#define YELLOW    A2
#define GREEN     A1
#define BLUE      A0

// define buttons
#define UP_BUTTON      12
#define ENTER_BUTTON   13

// define sampling rates for measurements
#define MODE_1    1 //seconds
#define MODE_2    60  // seconds
#define MODE_3    1440  //seconds

// define length of array
#define LENGTH_ARRAY 10

// define EEPROM range
#define EEPROM_MIN_ADDR  0
#define EEPROM_MAX_ADDR  255

// values
int v_up_button = 0;
int v_enter_button = 0;

// array for measurements
int measurement[LENGTH_ARRAY] = { 0 };

// counts runs
//int i = 0;  // better if i is just local

// time measurement
unsigned long time1 = 0;
unsigned long time2 = 0;
unsigned long time_diff = 0;

// own functions
void writeLeds(int, int, int);
void ask(int);
int measurement_Mode();
void measure(int);
boolean writeEEPROM(int startAddr, const int* array, int numBytes);
boolean eepromAddrOk(int addr);
boolean readEEPROM(int startAddr, int array[], int numBytes);
boolean read_or_write();

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
  pinMode(UP_BUTTON, INPUT);
  pinMode(ENTER_BUTTON, INPUT);

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

void loop(){

/////////////////////////////////////////////////////////////////////////////////////////////
// Test ob EEPROM Funktionen funktionieren
/*int start = 5;
int anzahl = 2;
 readEEPROM(start, measurement,anzahl);*/
/////////////////////////////////////////////////////////////////////////////////////////////

  // labeling
  lcd.setCursor(0, 0);
 
  boolean read_last_measurement = read_or_write();
  
  lcd.clear();
  lcd.print("delay");
  delay(500);
  
  if(read_last_measurement == true){
  // read
  // ...
  }
  else{
    // new measurement
    int mode = measurement_mode();
    
    measure(mode);
  }

  delay(500);
}

// ******************************************************

boolean read_or_write(){

  // show menue
  lcd.clear();

  while(v_up_button == 0 || v_enter_button == 0){
    
    v_up_button += digitalRead(UP_BUTTON);
    delay(200);

    if(v_up_button == 0){
      lcd.setCursor(0,0);
      lcd.print("Read last");
      lcd.setCursor(0,1);
      lcd.print("Measure");
    }else{
      lcd.setCursor(0,0);
      lcd.print("Start new");
      lcd.setCursor(0,1);
      lcd.print("Measure");
    }
    
    if (v_up_button == 2){
      v_up_button = 0;
    }
    
    // read last measurement
    if (v_up_button == 0 && digitalRead(ENTER_BUTTON) == HIGH){
      v_up_button = 0;
      v_enter_button = 0;
      lcd.clear();
      lcd.print("Read...");
      delay(500);
      return true;
    }else
    // new measure
    if (v_up_button == 1 && digitalRead(ENTER_BUTTON) == HIGH){
      v_up_button = 0;
      v_enter_button = 0;
      lcd.clear();
      lcd.print("Measure...");
      delay(500);
      return false;
    }
  }
}


// choose measurement Mode
int measurement_mode(){
  // variable to save the modus
  int modus = 0; 

  lcd.clear();

  while(modus == 0){
      v_up_button += digitalRead(UP_BUTTON);

      delay(200);

      lcd.clear();
      lcd.setCursor(0,0);
      if(v_up_button == 0){
        lcd.print("Echtzeitmodus");
        }
      else if(v_up_button == 1){
        lcd.clear();
        lcd.print("Stundenauslegung");
        }
      else if(v_up_button == 2){
        lcd.clear();
        lcd.print("Tagesauslegung");
      }
      
      if (v_up_button == 3){
        v_up_button = 0;
      }
      
      if(v_up_button == 0 && digitalRead(ENTER_BUTTON) == HIGH){
        modus = MODE_1;
      }else if(v_up_button == 1 && digitalRead(ENTER_BUTTON) == HIGH){
        modus = MODE_2;
      }else if (v_up_button == 2 && digitalRead(ENTER_BUTTON) == HIGH){
        modus = MODE_3;
      }
    }
    
  lcd.clear();
  return modus;
}

void measure(int my_delay){
  
  lcd.clear();
  lcd.print("Mode: ");
  lcd.print(my_delay);

  int i = 0;

  while(measurement[LENGTH_ARRAY - 1] != 0){
    measurement[i] = { 0 };
    i += 1;
  }

  i = 0;
  time_diff = time1 = time2 = 0;
  
  while(measurement[LENGTH_ARRAY - 1] == 0){

    // starts for t=0 and counts
    time_diff = time_diff + time2 - time1;
    
    if(CCS.available()){
      
      if(!CCS.readData()){

        // start time measure
        time1 = millis();

        // measure co2 value
        measurement[i] = CCS.geteCO2();
        
        // ask led
        ask(measurement[i]);

        // output
        lcd.setCursor(0,1);
        lcd.print("CO2: ");
        lcd.print(measurement[i]);
        //Serial.print("CO2: ");
        //Serial.println(measurement[i]);
        //Serial.print("Time: ");
        //Serial.println(time_diff);
        Serial.print(time_diff);
        Serial.print(",");
        Serial.print(measurement[i]);
        Serial.print(";");
        
        delay(my_delay);

        // end time measure
        time2 = millis();
      }
      else{
        Serial.println("ERROR!");
        lcd.clear();
        lcd.print("ERROR!");
        while(1);
      }

      // counter++
      i += 1;
    }
   }
   do{
     Serial.println("finished");
   }while(0);
  
   delay(500);
}

// analog writing of leds
void writeLeds(int on, int firstOff, int secondOff){
    analogWrite(on, 150);
    analogWrite(firstOff, 0);
    analogWrite(secondOff, 0);
}

// compare co2-level with limits
void ask(int value){
   if(value < 800){
    writeLeds(GREEN,YELLOW,RED);
    analogWrite(BLUE, 0);
  }else if(value > 799 && value < 1400){
    writeLeds(YELLOW,GREEN,RED);
  }else{
    writeLeds(RED,YELLOW,GREEN);
    analogWrite(BLUE, 150);
  }
}


/*
// Check wether addr is ok
boolean eepromAddrOk(int addr) {
  return ((addr >= EEPROM_MIN_ADDR)); //&& ((addr <= EEPROM_MAX_ADDR));
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

*/

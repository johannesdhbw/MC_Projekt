
// libraries
#include <SPI.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SPITFT.h>
#include <Adafruit_SPITFT_Macros.h>
#include <gfxfont.h>
#include <Adafruit_CCS811.h>

// ******************************************************

// set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  
// definition of adafruit
Adafruit_CCS811 CCS;
 
// define analog pin
#define RED       A3
#define YELLOW    A2
#define GREEN     A1
#define BLUE      A0

// define buttons
#define SLEEP_BUTTON   2
#define UP_BUTTON      8
#define ENTER_BUTTON   9

// Variable die den Status des Taster ausliest, wird der sog. "Vektor" 0 zugewiesen                               
// Taster Anschluss an Pin 2 entspricht dem Vektor 0   (hier der Fall)
// Taster Anschluss an Pin 3 entspricht dem Vektor 1
volatile int sleep_status = 0;  

int sleeping = 0;

// define sampling rates for measurements
#define MODE_1    1 //seconds
#define MODE_2    60  // seconds
#define MODE_3    1440  //seconds

// define length of array
#define LENGTH_ARRAY 10

// values
int v_up_button = 0;
int v_enter_button = 0;

// array for measurements
int measurement[LENGTH_ARRAY] = { 0 };

// time measurement
unsigned long time1 = 0;
unsigned long time2 = 0;
unsigned long time_diff = 0;

// own functions
void writeLeds(int, int, int);
void ask(int);
int measurement_Mode();
void measure(int);
boolean read_or_write();
void sameLeds(int, int, int, int);
void sleepmode();

// ******************************************************

void setup(){  
  // initialize the lcd
  lcd.init();                      
  // Print a message to the LCD.
  lcd.backlight();
  // 16 character in 2 rows
  lcd.begin(16, 2);

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
  
  // Hier findet die Einbindung unseres Interrupt-Befehls statt
  attachInterrupt(0, sleepmode, CHANGE);   
}

// ******************************************************

void loop(){

  // set leds off
  sameLeds(GREEN, YELLOW, RED, 0);
  analogWrite(BLUE,0);
  
  // labeling
  lcd.setCursor(0, 0);
 
  boolean read_last_measurement = read_or_write();
  
  if(read_last_measurement == true){
    
    sameLeds(GREEN,YELLOW,RED,150);
    
    boolean restart = false;

    delay(200);
    
    while(restart == false){
      if(digitalRead(ENTER_BUTTON) == HIGH){
        restart = true;
      } 
    }
    lcd.clear();
  }
  else{
    // new measurement
    int mode = measurement_mode();
    
    measure(mode);
  }
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
      lcd.setCursor(0,1);
      lcd.print("Press enter");
      return true;
    }else
    // new measure
    if (v_up_button == 1 && digitalRead(ENTER_BUTTON) == HIGH){
      v_up_button = 0;
      v_enter_button = 0;
      lcd.clear();
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
}

// analog writing of leds
void writeLeds(int on, int firstOff, int secondOff){
    analogWrite(on, 150);
    analogWrite(firstOff, 0);
    analogWrite(secondOff, 0);
}

void sameLeds(int first, int second, int third, int value){
  analogWrite(first, value);
  analogWrite(second, value);
  analogWrite(third, value);
}

// compare co2-level with limits
void ask(int value){
   if(value < 800){
    writeLeds(GREEN,YELLOW,RED);
    analogWrite(BLUE, 0);
  }else if(value > 799 && value < 1400){
    writeLeds(YELLOW,GREEN,RED);
    analogWrite(BLUE, 0);
  }else{
    writeLeds(RED,YELLOW,GREEN);
    analogWrite(BLUE, 150);
  }
}

// Sobald die Unterbrechung "TasterUnterbricht" (der Wert am Pin ändert sich [CHANGE])...
void sleepmode() {
  
  sleep_status = digitalRead(SLEEP_BUTTON);
  delay(500);
  if(sleep_status =! 0){
    sleeping += 1;
    if(sleeping == 2){
      sleeping = 0;
    }
    if(sleeping == 0){
      sleep_status = 150;
      analogWrite(YELLOW, sleep_status);
    }else{
      sleep_status = 0;
      analogWrite(YELLOW, sleep_status);
    }
    
  }

  
  delay(500);
}

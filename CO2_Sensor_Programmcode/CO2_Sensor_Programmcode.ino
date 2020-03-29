// libraries
#include <SPI.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SPITFT.h>
#include <Adafruit_SPITFT_Macros.h>
#include <gfxfont.h>
#include <Adafruit_CCS811.h>
#include <SD.h>

// ******************************************************

// set the lcd address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27,20,4);  
// definition of adafruit commands
Adafruit_CCS811 CCS;

// define analog pins
#define RED       A3
#define YELLOW    A2
#define GREEN     A1
#define BLUE      A0

// define buttons
#define UP_BUTTON      8
#define ENTER_BUTTON   9
// SLEEP_BUTTON has to be on pin 2 or 3 caused the interrupt function
#define SLEEP_BUTTON   2

// variable to read the status of SLEEP_BUTTON
volatile int sleep_status = 0;  
// variable to know the sleeping status
int sleeping = 0;

// define sampling rates for measurements in seconds
#define MODE_1    1
#define MODE_2    60
#define MODE_3    1440

// variables to know status of up and enter buttons
int v_up_button = 0;
int v_enter_button = 0;

// define length of array
#define LENGTH_ARRAY 10

// array for measurements
int measurement[LENGTH_ARRAY] = { 0 };

// variable textfile
File textfile;

// variables for time measurement
unsigned long time1 = 0;
unsigned long time2 = 0;
unsigned long time_diff = 0;

// own functions
// function for green, yellow and red led to
// minimalize lines of code (order defines wich led is on)
void writeLeds(int, int, int);
// fucntion to interprete the measurement (good, middle, bad)
void ask(int);
// function to change the measurement mode
int measurement_Mode();
// function to measure the co2-level
void measure(int);
// user have to tell if he removes the sd-card
boolean read_or_write();
// function to get three leds on the same level
// this function is used for the reading mode
// first three ints for leds, last int for value (on/off)
void sameLeds(int, int, int, int);
// interrupt function to set arduino to sleep and wake up again
void sleepmodeInterrupt();
// function to safe measurement on sd-card
void writeToSD(int[]);

// ******************************************************

void setup(){  
  // initialize the lcd
  lcd.init();                      
  // lcd backlight turns on
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

  // sd-card controll
  if (!SD.begin(5)) {                                     
    Serial.println("Initialisierung fehlgeschlagen!");    
    return;
  }
  
  // Hier findet die Einbindung unseres Interrupt-Befehls statt
  attachInterrupt(0, sleepmodeInterrupt, CHANGE);   
}

// ******************************************************

void loop(){

  // set leds off
  sameLeds(GREEN, YELLOW, RED, 0);
  analogWrite(BLUE,0);
  
  // labeling
  lcd.setCursor(0, 0);

  while(sleeping == 1){
    lcd.clear();
    // lcd backlight turns off
    lcd.noBacklight();
    delay(200);
    // ENTER_BUTTON to exit the sleep-mode
    if(digitalRead(ENTER_BUTTON) == HIGH){
      // delay of 5 milisec with second condition of ENTER_BUTTON
      // to debounce the button
      delay(5);
      if(digitalRead(ENTER_BUTTON) == HIGH){
        sleeping = 0;
        // lcd backlight turns on
        lcd.backlight();
      }
    }
  }

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
     
   writeToSD(measurement);
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
void sleepmodeInterrupt() {
  sleep_status = digitalRead(SLEEP_BUTTON);
  // reads if SLEEP_BUTTON got pressed
  //sleep_status = digitalRead(SLEEP_BUTTON);
  if(digitalRead(SLEEP_BUTTON) == HIGH){
    // delay and second read with if condition to debounce SLEEP_BUTTON
    delay(5);
    //sleep_status = digitalRead(SLEEP_BUTTON);
    if(digitalRead(SLEEP_BUTTON) == HIGH){
      sleeping = 1;
    }
  }
  delay(500);
}


void writeToSD(int arrayMeasurement[]){
  Serial.println("Initialisiere SD-Karte");   
  if (!SD.begin(5)) {                                     // Wenn die SD-Karte nicht (!SD.begin) gefunden werden kann, ...
    Serial.println("Initialisierung fehlgeschlagen!");    // ... soll eine Fehlermeldung ausgegeben werden. ....
    return;
  }
  Serial.println("Initialisierung abgeschlossen");        // ... Ansonsten soll die Meldung "Initialisierung abgeschlossen." ausgegeben werden.

  textfile = SD.open("Include.txt", FILE_WRITE);

  // if sd-card could be found
  if(textfile){
    // write numbering of measurements to sd-card
    textfile.print(0);
    int i = 1;
    while(1 < LENGTH_ARRAY){
      textfile.print(",");
      textfile.print(i);
      i +=1;
    }
    textfile.println();
    // write measurements to sd-card
    textfile.print(measurement[0]);
    i = 1;
    while(i < LENGTH_ARRAY){
      textfile.print(",");
      textfile.print(measurement[i]);
      i += 1;
    }
    // close textfile
    textfile.close();
  }else{
    // error-warning
    Serial.println("Textdatei konnte nicht ausgelesen werden");
  }
}

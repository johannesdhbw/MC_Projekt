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

// define number of measurements
#define NUMB_MEASURE 100

// define sampling rates for measurements in milliseconds (depends on NUMB_MEASURE)
#define MODE_1    1
#define MODE_2    36000
#define MODE_3    86400000

// variables to know status of up and enter buttons
int v_up_button = 0;
int v_enter_button = 0;

// variable textfile
File textfile;

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
// user have to tell if he removes the sd-card or wants to start new measurement
boolean read_or_write();
// function to get three leds on the same level
// this function is used for the reading mode
// first three ints for leds, last int for value (on/off)
void sameLeds(int, int, int, int);
// interrupt function to set arduino to sleep and wake up again
void sleepmodeInterrupt();

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
    // error-warning with endless loop
    Serial.println("Failed to start sensor! Please check your wiring.");
    lcd.print("Failed to");
    lcd.setCursor(0, 1);
    lcd.print("start sensor");
    while(1);
  }

  // wait for the sensor to be ready
  while(!CCS.available());

  // sd-card controll
  if (!SD.begin(5)) {     
    // error-warning                                
    Serial.println("Initialisation failed!");
    lcd.print("Initialisation");
    lcd.setCursor(0, 1);
    lcd.print("of SD failed");
    delay(8000);
    return;
  }
  
  // integration of interrupt command
  attachInterrupt(0, sleepmodeInterrupt, CHANGE);   
}

// ******************************************************

void loop(){

  // set leds off
  sameLeds(GREEN, YELLOW, RED, 0);
  analogWrite(BLUE,0);
  
  // labeling
  lcd.setCursor(0, 0);

  // while sleep-mode is activated
  while(sleeping == 1){
    lcd.clear();
    // lcd backlight turns off
    lcd.noBacklight();
    delay(200);
    // reading ENTER_BUTTON to exit the sleep-mode
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

  // first menue read last or start new measurement
  boolean read_last_measurement = read_or_write();

  // if user wants to read last measurement
  if(read_last_measurement == true){

    // optical ouput that user knows that he can remove sd-card
    sameLeds(GREEN,YELLOW,RED,150);

    // boolean variable exit reading
    boolean restart = false;

    delay(200);

    // wait until ENTER_BUTTON is pushed
    while(restart == false){
      if(digitalRead(ENTER_BUTTON) == HIGH){
        restart = true;
      } 
    }
    lcd.clear();
  }
  // if user wants to start a new measurement
  else{
    // user have to select one of three measurement mode
    int mode = measurement_mode();

    // start new measurement and safe values on sd-card
    measure(mode);
  }
}

// ******************************************************

// removing the sd-card or start new measurement
boolean read_or_write(){

  lcd.clear();

  // live ouput of selection
  while(v_up_button == 0 || v_enter_button == 0){
    
    v_up_button += digitalRead(UP_BUTTON);
    delay(200);

    if(v_up_button == 0){
      lcd.setCursor(0,0);
      lcd.print("Read last");
      lcd.setCursor(0,1);
      lcd.print("Measurement");
    }else{
      lcd.setCursor(0,0);
      lcd.print("Start new");
      lcd.setCursor(0,1);
      lcd.print("Measurement");
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

  // live output of selection
  while(modus == 0){
      v_up_button += digitalRead(UP_BUTTON);

      delay(200);

      lcd.clear();
      lcd.setCursor(0,0);
      if(v_up_button == 0){
        lcd.print("Real Time");
        lcd.setCursor(0,1);
        lcd.print("Measurement");
        }
      else if(v_up_button == 1){
        lcd.clear();
        lcd.print("One Hour");
        lcd.setCursor(0,1);
        lcd.print("Measurement");
        }
      else if(v_up_button == 2){
        lcd.clear();
        lcd.print("One Day");
        lcd.setCursor(0,1);
        lcd.print("Measurement");
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

// co2-measurement
void measure(int my_delay){

  // ouput of selected mode
  lcd.clear();
  lcd.print("Mode: ");
  if(my_delay == MODE_1){
    lcd.print("1");
  }else if(my_delay == MODE_2){
    lcd.print("2");
  }else{
    lcd.print("3");
  }

  Serial.println("Initialisation of SD-Card");   
  // if sd-card couldn't be found
  if (!SD.begin(5)) {            
    // error-warning
    Serial.println("Initialisation failed!");
    lcd.clear();
    lcd.print("Initialisation");
    lcd.setCursor(0, 1);
    lcd.print("of SD failed"); 
    delay(8000);
    return;
  }
  Serial.println("Initialisation finished");        

  // create .txt-file named test
  // if .txt-file with the same name exists, the following data will be attached
  textfile = SD.open("Measure.txt", FILE_WRITE);
  
  // variable for measurements
  int var_measure;
  
  // if sd-card could be found
  if(textfile){

    textfile.println();

    // set local counter i = 0
    int i = 0;
    
    while(i < NUMB_MEASURE){
        // checks if co2-sensor is available
        if(CCS.available()){
          if(!CCS.readData()){
        
          // measure co2 value
          var_measure = CCS.geteCO2();            
          
          // ask led
          ask(var_measure);
          
          // lcd and serial output
          lcd.setCursor(0,1); 
          lcd.print("CO2: ");
          lcd.print(var_measure);
          Serial.print(var_measure);
          Serial.print(";");

          // safes measure in textfile
          textfile.print(var_measure);
          if(i < NUMB_MEASURE-1){
            textfile.print(",");
          }
          Serial.println("Write in textfile...");

          // delay to differentiate modus of measurement
          delay(my_delay);
          
          // counter++
          i += 1;
        } else{
           // error-warning
           Serial.println("ERROR!");
           lcd.clear();
           lcd.print("ERROR!");
           while(1);
        }
      } 
    }
    
    // close textfile
    textfile.close();
    lcd.clear();
    lcd.print("Finished");
    delay(1000);
  }else{
    // error-warning
    Serial.println("Textfile couldn't be read out");
    lcd.clear();
    lcd.print("Textfile could");
    lcd.setCursor(0, 1);
    lcd.print("not be found");
    delay(8000);
  }
}

// analog writing of leds, one turns on, two turn off
void writeLeds(int on, int firstOff, int secondOff){
    analogWrite(on, 150);
    analogWrite(firstOff, 0);
    analogWrite(secondOff, 0);
}

// three leds get the same value
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

// interrupt-function to read SLEEP_BUTTON at any time
// interrupt-function is activated when value of sleep-status change
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

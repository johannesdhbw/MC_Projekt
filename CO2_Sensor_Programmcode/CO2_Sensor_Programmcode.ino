// libraries
// sensor mg811/ccs811
#include <CO2Sensor.h>
// lcd
#include <LiquidCrystal.h>

// ******************************************************

// definition of lcd-pins
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
 
// define led pin
#define red 10
#define yellow 9
#define green 8
#define taster 7

// values
int tasterstatus = 0;

// own functions
void printOut(int);
void writeLeds(int, int, int);
void ask(int);
void csvOutput(int, int);

// ******************************************************

void setup() {  
  // 16 character in 2 rows
  lcd.begin(16, 2);

  // labeling
  lcd.setCursor(0, 0);
  lcd.print("CO2-value:");

  // setup of led ouput
  pinMode(green,OUTPUT);
  pinMode(yellow,OUTPUT);
  pinMode(red,OUTPUT);
  
  pinMode(taster, INPUT);

  Serial.begin(9600);
  

  //co2Sensor.calibrate();
}

// ******************************************************

void loop() {
  //int co2ppm = co2Sensor.read();
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
  
  tasterstatus = digitalRead(taster);
  if (tasterstatus == HIGH)
  {
    lcd.setCursor(0, 0);
    lcd.print("Taster");
    delay(1000);
    lcd.setCursor(0, 0);
    lcd.print("CO2-value:");
  }
  
}

// ******************************************************

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
    writeLeds(green,yellow,red);
  }else if(value > 799 && value < 1400){
    writeLeds(yellow,green,red);
  }else{
    writeLeds(red,yellow,green);
  }
}

void csvOutput(int number, int value){
  Serial.print(number);
  Serial.print(";");
  Serial.print(value);
  Serial.print('\n');
}

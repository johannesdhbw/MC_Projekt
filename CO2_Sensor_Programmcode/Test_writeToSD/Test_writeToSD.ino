#include <SPI.h>
#include <SD.h>  // In diesem Sketch verwenden wir die <SD.h> library

File textfile;          // An dieser Stelle wird die Variable "Textdatei" als File (dts. Datei) deklariert.

// define length of array
#define LENGTH_ARRAY 10

// array for measurements
int measurement[LENGTH_ARRAY] = { 0 };

void setup() {
  
  Serial.begin(9600);

  Serial.println("Initialisiere SD-Karte");   

  if (!SD.begin(5)) {                                     // Wenn die SD-Karte nicht (!SD.begin) gefunden werden kann, ...
    Serial.println("Initialisierung fehlgeschlagen!");    // ... soll eine Fehlermeldung ausgegeben werden. ....
    return;
  }
  
  Serial.println("Initialisierung abgeschlossen");        // ... Ansonsten soll die Meldung "Initialisierung abgeschlossen." ausgegeben werden.

  //********************************************************************

  

  // create textfile test.txt
  textfile = SD.open("test2.txt", FILE_WRITE);
  if (textfile) 
  {
    // write numbering to textfile
    textfile.print("0");
    int i = 1;
    while(i < LENGTH_ARRAY){
      textfile.print(",");
      textfile.print(i);
    }

/*
    // write measurement to textfile
    textfile.println(measurement[0]);
    i = 1;
    while(i < LENGTH_ARRAY){
      textfile.print(",");
      textfile.print(measurement[i]);
    }
   */ 
    // close textfile
    textfile.close();    
  
  } else {
    // error-warning
    Serial.println("textfile konnte nicht ausgelesen werden");
  }



  
}

void loop()    // Der Loop bleibt leer.
{ 
}

#include <SPI.h>
#include <SD.h>  // In diesem Sketch verwenden wir die <SD.h> library

File Textdatei;          // An dieser Stelle wird die Variable "Textdatei" als File (dts. Datei) deklariert.

// define length of array
#define LENGTH_ARRAY 10

// array for measurements
int measurement[LENGTH_ARRAY] = { 0 };

void funktion(int[]);

void setup() {
  Serial.begin(9600);
  Serial.println("Initialisiere SD-Karte");   
  if (!SD.begin(5)) {                                     // Wenn die SD-Karte nicht (!SD.begin) gefunden werden kann, ...
    Serial.println("Initialisierung fehlgeschlagen!");    // ... soll eine Fehlermeldung ausgegeben werden. ....
    return;
  }
  Serial.println("Initialisierung abgeschlossen");        // ... Ansonsten soll die Meldung "Initialisierung abgeschlossen." ausgegeben werden.

//**************************************************************
  
  
      funktion(measurement);

/*
  // NUN WIRD DIE TEXTDATEI AUSGELESEN 

    
  Textdatei = SD.open("test.txt");                            // Die Textdatei auf der SD-Karte wird wieder geoeffnet...
  
  if (Textdatei) 
  
{                                            
  Serial.println("test.txt:");                              // ... und der Name der Datei wird ausgegeben. 
 
    while (Textdatei.available())                             // Anschließend wird die Datei so lange ausgelesen (while)...
    {                          
      Serial.write(Textdatei.read());                         // ... bis keine Daten mehr gefunden werden können.
    }
   
  Textdatei.close();                                        // Im Anschluss wird die Textdatei wieder geschlossen.
} 

   else                                                             // Sollte keine Textdatei (also test.txt) gefunden werden können...
   
    {
    Serial.println("Textdatei konnte nicht geoeffnet werden");      // ... erscheint eine Fehlermeldung im seriellen Monitor.
    }
    */
    
}

void loop()    // Der Loop bleibt leer.
{ 
}

void funktion(int measurementA[]){
  Textdatei = SD.open("test2.txt", FILE_WRITE);            // An dieser Stelle wird die Textdatei erstellt. Unsere Textdatei soll "test" heißen und im Format ".txt" (Text) erstellt werden.
    
  if (Textdatei){                                        // Wenn die Textdatei ("test.txt") gefunden wurde....

    Textdatei.print(0);
    int i = 1;
    while(i < LENGTH_ARRAY){
      Textdatei.print(",");
      Textdatei.print(i);
      i += 1;
    }
    Textdatei.println();
    Textdatei.print(measurementA[0]);
    i = 1;
    
    while(i < LENGTH_ARRAY){
      Textdatei.print(",");
      Textdatei.print(measurementA[i]);
      
      Serial.println("Schreibe in Textdatei...");           // ... soll eine Meldung im seriellen Monitor erscheinen...
      /*
      Textdatei.println("Funduino GmbH");                   // ... und die Textdatei anschließend befüllt werden. 
      Textdatei.println("1, 2, 3, 4, 5");
      Textdatei.println("a, b, c, d, e");
      Textdatei.println();
       */
      i += 1;
    }                           
    Textdatei.close();                                    // Anschließend wird die Textdatei wieder geschlossen...
    Serial.println("Abgeschlossen.");                     // ... und eine erneute Meldung im seriellen Monitor ausgegeben.
    Serial.println();
    
  } else{                                                        // Wenn !keine! Textdatei gefunden werden kann ...
     
  Serial.println("Textdatei konnte nicht ausgelesen werden");   // ... erscheint eine Fehlermeldung im seriellen Monitor.
  }
}

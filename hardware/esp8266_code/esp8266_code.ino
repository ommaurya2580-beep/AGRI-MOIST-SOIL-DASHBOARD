#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// --- Wi-Fi Credentials ---
const char* ssid = "OPPO";
const char* password = "00000000";

// --- API Endpoint (Your EC2 Server IP) ---
const char* serverName = "http://18.215.153.77/api/sensor";

// --- Pin Definitions ---
const int MOISTURE_PIN = A0;  // Analog pin for Moisture Sensor
const int RELAY_PIN = D1;     // Digital pin for Water Pump Relay

// --- Timers ---
unsigned long previousMillis = 0;
const long interval = 5000;   // Send data every 5 seconds

void setup() {
  Serial.begin(115200);
  
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Pump OFF by default
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentMillis = millis();

  if(currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Check Wi-Fi connection status
    if(WiFi.status()== WL_CONNECTED){
      
      // 1. Read Moisture Sensor (0-1023)
      int sensorValue = analogRead(MOISTURE_PIN);
      
      // Convert analog value to Percentage (0% to 100%)
      // Note: Adjust the 1023 and 300 values based on your specific sensor calibration
      // In water: ~300. In dry air: ~1023
      int moisturePercentage = map(sensorValue, 1023, 300, 0, 100);
      
      // Constrain between 0 and 100
      if(moisturePercentage > 100) moisturePercentage = 100;
      if(moisturePercentage < 0) moisturePercentage = 0;
      
      Serial.print("Moisture Level: ");
      Serial.print(moisturePercentage);
      Serial.println("%");

      // 2. Prepare JSON Payload
      WiFiClient client;
      HTTPClient http;
      
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");

      String httpRequestData = "{\"moistureLevel\":" + String(moisturePercentage) + "}";
      
      // 3. Send POST request to EC2 Server
      int httpResponseCode = http.POST(httpRequestData);
      
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
        
        // 4. Parse the Response to get Pump Status
        StaticJsonDocument<200> doc;
        DeserializationError error = deserializeJson(doc, payload);
        
        if (!error) {
          bool pumpIsOn = doc["pumpIsOn"];
          
          if(pumpIsOn) {
            digitalWrite(RELAY_PIN, HIGH); // Turn Pump ON
            Serial.println("Pump turned ON");
          } else {
            digitalWrite(RELAY_PIN, LOW);  // Turn Pump OFF
            Serial.println("Pump turned OFF");
          }
        } else {
          Serial.print("deserializeJson() failed: ");
          Serial.println(error.c_str());
        }
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      
      http.end(); // Free resources
    }
    else {
      Serial.println("WiFi Disconnected");
    }
  }
}

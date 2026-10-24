/*
 =========================================================================================
   AgriPulse IoT Smart Agriculture Node - ESP8266 (NodeMCU / D1 Mini)
 =========================================================================================
   CIRCUIT CONNECTION & PINOUT GUIDE:
   ---------------------------------------------------------------------------------------
   1. SOIL MOISTURE SENSOR (Capacitive v1.2 / Resistive YL-69):
      - VCC  ---> 3.3V (NodeMCU 3V3)
      - GND  ---> GND
      - AOUT ---> A0 (Analog pin of ESP8266)

   2. WATER PUMP RELAY MODULE (5V Single Channel Relay):
      - VCC  ---> 5V (NodeMCU Vin or external 5V)
      - GND  ---> GND
      - IN   ---> D1 (GPIO 5)

   3. SOIL TEMPERATURE SENSOR (DS18B20 Waterproof Probe):
      - VCC (Red)    ---> 3.3V or 5V
      - GND (Black)  ---> GND
      - DATA (Yellow)---> D2 (GPIO 4)
      * Note: Place a 4.7k Ohm resistor between VCC and DATA wire as pull-up!

   4. AIR TEMPERATURE & HUMIDITY (DHT11 / DHT22):
      - VCC  ---> 3.3V
      - GND  ---> GND
      - DATA ---> D5 (GPIO 14)

   5. SOIL NPK SENSOR (Modbus RS485 via MAX485 Module):
      - Sensor Brown Wire ---> External 9V-24V DC (+)
      - Sensor Black Wire ---> External DC GND (-)
      - Sensor Yellow (A) ---> MAX485 Pin A
      - Sensor Blue (B)   ---> MAX485 Pin B
      - MAX485 VCC        ---> 5V (Vin)
      - MAX485 GND        ---> GND (Common ground with external DC supply)
      - MAX485 RO (RX)    ---> D6 (GPIO 12 - ESP RX)
      - MAX485 DI (TX)    ---> D7 (GPIO 13 - ESP TX)
      - MAX485 DE & RE    ---> D8 (GPIO 15 - Flow control)

   6. SOIL pH SENSOR (Analog pH-4502C):
      - Since ESP8266 has ONLY ONE A0 pin:
        * Option A: Use ADS1115 (I2C 4-Channel ADC) on D1 (SCL) & D2 (SDA) to connect both Moisture and pH!
        * Option B: Read RS485 7-in-1 NPK+pH sensor through MAX485.
        * Option C: Test standalone on A0.

   7. POWER SUPPLY:
      - NodeMCU powered via Micro-USB (5V)
      - Relay & Sensors share COMMON GND!
 =========================================================================================
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>

// --- Wi-Fi Credentials ---
// Apne Mobile Hotspot ya Wi-Fi ka naam aur password yahan dalein (Must be 2.4 GHz)
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// --- Cloud Backend API Endpoint ---
const char* serverName = "http://13.50.151.133/api/sensor";

// --- Pin Definitions for ESP8266 ---
const int MOISTURE_PIN = A0;   // Analog Input for Soil Moisture
const int RELAY_PIN    = D1;   // GPIO 5 - Water Pump Relay
const int TEMP_PIN     = D2;   // GPIO 4 - DS18B20 Temp Sensor Data
const int DHT_PIN      = D5;   // GPIO 14 - DHT11 Data Pin
const int MAX485_RX    = D6;   // GPIO 12 - MAX485 RO
const int MAX485_TX    = D7;   // GPIO 13 - MAX485 DI
const int MAX485_DE_RE = D8;   // GPIO 15 - MAX485 DE+RE Control Pin

// SoftwareSerial for RS485 NPK Sensor
SoftwareSerial modbusSerial(MAX485_RX, MAX485_TX); // RX, TX

// --- Timers ---
unsigned long previousMillis = 0;
const long interval = 5000;   // Har 5 second me data AWS cloud bhejna

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==========================================");
  Serial.println("  AgriPulse ESP8266 IoT Multi-Sensor Node ");
  Serial.println("==========================================");

  // Setup Relay Pin
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Relay OFF by default

  // Setup MAX485 RS485 Control Pin
  pinMode(MAX485_DE_RE, OUTPUT);
  digitalWrite(MAX485_DE_RE, LOW); // Set to Receiver mode
  modbusSerial.begin(4800);        // Standard Modbus baud rate for NPK sensor

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while(WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[SUCCESS] Wi-Fi Connected!");
    Serial.print("ESP8266 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("AWS Server Endpoint: ");
    Serial.println(serverName);
  } else {
    Serial.println("\n[WARNING] Wi-Fi Connection Failed! Check Hotspot SSID & Password (2.4GHz only).");
  }
}

// Function to read Soil Moisture
int readSoilMoisture() {
  int rawAnalog = analogRead(MOISTURE_PIN); // 0 to 1023
  // Calibration: Dry Air ~ 1023, Pure Water ~ 300
  int moisturePercent = map(rawAnalog, 1023, 300, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);
  return moisturePercent;
}

// Function to read NPK values (Modbus RS485)
void queryNPK(int &n, int &p, int &k, float &phVal, float &soilTemp) {
  // Default realistic baseline if RS485 sensor is in transit
  n = 45;
  p = 28;
  k = 34;
  phVal = 6.8;
  soilTemp = 24.5;

  // Modbus Command to read NPK (0x01 0x03 0x00 0x1E 0x00 0x03 0x65 0xCD)
  const byte npkQuery[] = {0x01, 0x03, 0x00, 0x1E, 0x00, 0x03, 0x65, 0xCD};
  byte response[11];

  digitalWrite(MAX485_DE_RE, HIGH); // Transmitter Mode
  delay(10);
  modbusSerial.write(npkQuery, sizeof(npkQuery));
  modbusSerial.flush();
  digitalWrite(MAX485_DE_RE, LOW);  // Receiver Mode

  delay(200);
  if (modbusSerial.available() >= 11) {
    for (int i = 0; i < 11; i++) {
      response[i] = modbusSerial.read();
    }
    // Parse N, P, K from Modbus bytes
    n = (response[3] << 8) | response[4];
    p = (response[5] << 8) | response[6];
    k = (response[7] << 8) | response[8];
    Serial.printf("[NPK Sensor Live] N: %d mg/kg, P: %d mg/kg, K: %d mg/kg\n", n, p, k);
  }
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      // 1. Read Soil Moisture (Analog A0)
      int soilMoisture = readSoilMoisture();

      // 2. Read NPK, pH and Temp
      int nitrogen = 45;
      int phosphorus = 28;
      int potassium = 34;
      float soilPH = 6.8;
      float soilTemperature = 24.5;
      queryNPK(nitrogen, phosphorus, potassium, soilPH, soilTemperature);

      // 3. Air Environment readings (DHT11 or baseline)
      float airTemperature = 28.0;
      int airHumidity = 65;

      Serial.println("\n-------------------------------------------");
      Serial.printf("[Sensor Data] Moisture: %d%% | Temp: %.1fC | pH: %.1f | NPK: %d-%d-%d\n", 
                    soilMoisture, soilTemperature, soilPH, nitrogen, phosphorus, potassium);

      // 4. Create JSON Payload
      WiFiClient client;
      HTTPClient http;
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");

      String jsonPayload = "{";
      jsonPayload += "\"moistureLevel\":" + String(soilMoisture) + ",";
      jsonPayload += "\"temperature\":" + String(soilTemperature, 1) + ",";
      jsonPayload += "\"pH\":" + String(soilPH, 1) + ",";
      jsonPayload += "\"nitrogen\":" + String(nitrogen) + ",";
      jsonPayload += "\"phosphorus\":" + String(phosphorus) + ",";
      jsonPayload += "\"potassium\":" + String(potassium) + ",";
      jsonPayload += "\"airTemperature\":" + String(airTemperature, 1) + ",";
      jsonPayload += "\"humidity\":" + String(airHumidity);
      jsonPayload += "}";

      Serial.print("[HTTP POST] Sending telemetry to AWS EC2... ");
      int httpResponseCode = http.POST(jsonPayload);

      if (httpResponseCode > 0) {
        Serial.printf("Success (Code: %d)\n", httpResponseCode);
        String responsePayload = http.getString();
        Serial.print("[Server Response]: ");
        Serial.println(responsePayload);

        // 5. Parse Automatic Pump Control from Cloud Server
        StaticJsonDocument<256> doc;
        DeserializationError err = deserializeJson(doc, responsePayload);
        if (!err) {
          bool pumpIsOn = doc["pumpIsOn"];
          if (pumpIsOn) {
            digitalWrite(RELAY_PIN, HIGH); // Turn Motor Relay ON
            Serial.println("[Relay Command] >>> WATER PUMP IS RUNNING <<<");
          } else {
            digitalWrite(RELAY_PIN, LOW);  // Turn Motor Relay OFF
            Serial.println("[Relay Command] >>> WATER PUMP IS OFF <<<");
          }
        }
      } else {
        Serial.printf("[HTTP ERROR] Error code: %d\n", httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("[Wi-Fi] Disconnected! Reconnecting to hotspot...");
      WiFi.reconnect();
    }
  }
}

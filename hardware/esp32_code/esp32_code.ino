#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ==========================================
// --- Wi-Fi Credentials ---
// Change these to your Mobile Hotspot or Home Wi-Fi
// Note: ESP32 only connects to 2.4 GHz Wi-Fi!
// ==========================================
const char* ssid = "YOUR_WIFI_NAME";        // e.g. "OPPO", "iPhone", "Redmi"
const char* password = "YOUR_WIFI_PASSWORD"; // Hotspot password

// ==========================================
// --- AWS EC2 Cloud IoT Endpoint ---
// ==========================================
const char* serverUrl = "http://13.50.151.133/api/sensor";

// ==========================================
// --- Pin Definitions for ESP32 ---
// Analog Moisture Sensor: Connect to GPIO 34 (ADC1_CH6) or GPIO 35
// Relay Module (Pump): Connect to GPIO 26 or GPIO 4
// ==========================================
const int MOISTURE_PIN = 34; // ADC1 pin (safe with Wi-Fi)
const int RELAY_PIN = 26;    // Relay control pin

// Send telemetry every 5 seconds
unsigned long previousMillis = 0;
const long interval = 5000;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- Starting AgriPulse ESP32 IoT Node ---");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Relay OFF

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[SUCCESS] Wi-Fi Connected!");
    Serial.print("Local IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Target Server: ");
    Serial.println(serverUrl);
  } else {
    Serial.println("\n[WARNING] Wi-Fi Connection failed! Please check SSID & Password.");
  }
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      // 1. Read Analog Soil Moisture (ESP32 ADC is 12-bit: 0 to 4095)
      int rawAdc = analogRead(MOISTURE_PIN);
      
      // Calibration: In dry air rawAdc is ~3200-3800. In water rawAdc is ~1200-1500.
      // Adjust these calibration numbers based on your physical sensor:
      int dryVal = 3500;
      int wetVal = 1300;
      
      int moisturePercentage = map(rawAdc, dryVal, wetVal, 0, 100);
      moisturePercentage = constrain(moisturePercentage, 0, 100);

      Serial.print("[Sensor] Raw ADC: ");
      Serial.print(rawAdc);
      Serial.print(" -> Moisture: ");
      Serial.print(moisturePercentage);
      Serial.println("%");

      // 2. Prepare JSON Payload
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // Build JSON with full telemetry (optional temperature & NPK can also be sent)
      String payload = "{\"moistureLevel\":" + String(moisturePercentage) + 
                       ",\"temperature\":24.5,\"pH\":6.8,\"nitrogen\":45,\"phosphorus\":28,\"potassium\":34}";

      Serial.print("[HTTP] Sending POST to AWS... ");
      int httpResponseCode = http.POST(payload);

      if (httpResponseCode > 0) {
        Serial.print("Response Code: ");
        Serial.println(httpResponseCode);

        String response = http.getString();
        Serial.print("Server Response: ");
        Serial.println(response);

        // Parse pump command from server
        StaticJsonDocument<200> doc;
        DeserializationError err = deserializeJson(doc, response);
        if (!err) {
          bool pumpIsOn = doc["pumpIsOn"];
          if (pumpIsOn) {
            digitalWrite(RELAY_PIN, HIGH);
            Serial.println("[Relay] Water Pump Turned ON");
          } else {
            digitalWrite(RELAY_PIN, LOW);
            Serial.println("[Relay] Water Pump Turned OFF");
          }
        }
      } else {
        Serial.print("[HTTP ERROR] Code: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("[Wi-Fi] Disconnected! Reconnecting...");
      WiFi.reconnect();
    }
  }
}

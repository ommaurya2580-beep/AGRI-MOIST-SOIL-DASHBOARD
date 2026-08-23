# AgriPulse System Architecture

Here is the complete high-level system architecture of the AgriPulse Smart Agriculture Platform, mapping out the connections between the React Frontend, Node.js Backend, AI Models, and IoT Hardware.

```mermaid
flowchart TB
    %% --- Users & Clients ---
    User((Farmer / User))
    
    subgraph Frontend [Frontend (React + Vite, Hosted on Vercel)]
        direction TB
        UI_Dash[Dashboard Layout]
        UI_Weather[Weather Intelligence]
        UI_Sensors[IoT Sensors & Motor Control]
        UI_AI[AgriPulse AI Assistant]
        UI_Wizard[Crop History Wizard]
        UI_Vision[AI Vision Analysis - Disease & Pest]
        
        UI_Dash --> UI_Weather
        UI_Dash --> UI_Sensors
        UI_Dash --> UI_AI
        UI_Dash --> UI_Wizard
        UI_Dash --> UI_Vision
    end

    subgraph Backend [Backend Server (Node.js / Express, Docker + AWS)]
        direction TB
        API_Gateway[API Gateway / Router]
        API_IoT[IoT Controller `/api/control`]
        API_State[State & Trends `/api/state`, `/api/trend`]
        API_Weather[Weather Integration]
        API_AI_Orchestrator[AI Model Orchestrator]
        
        API_Gateway --> API_IoT
        API_Gateway --> API_State
        API_Gateway --> API_Weather
        API_Gateway --> API_AI_Orchestrator
    end

    subgraph AI_Services [AI & Machine Learning Microservices]
        direction TB
        Model_1[Model-1: Crop Disease Detection]
        Model_2[Model-2: Pest Detection]
        Model_3[Model-3: Leaf Health Analyzer]
    end

    subgraph DatabaseLayer [Data Persistence]
        DB[(Cloud Database)]
        TS_DB[(Time-Series DB for Sensor Trends)]
    end

    subgraph IoT_Hardware [Physical Farm IoT Layer]
        direction TB
        ESP32[ESP32 Microcontroller]
        Sensors_Soil[Soil Sensors: Moisture, Temp, pH, NPK]
        Sensors_Env[Environment Sensors: DHT11/22]
        Relay[Relay Module]
        WaterPump[Water Pump / Motor]
        
        Sensors_Soil -->|Live Data| ESP32
        Sensors_Env -->|Live Data| ESP32
        ESP32 -->|Control Signal| Relay
        Relay -->|Power| WaterPump
    end

    %% --- Connections ---
    User <==>|Interacts via Web/Mobile| Frontend

    %% Frontend to Backend
    UI_Sensors <==>|Live Polling 5s & Control| API_IoT
    UI_Sensors <==>|Fetch Trends| API_State
    UI_Weather <==>|Fetch Forecast & History| API_Weather
    UI_Vision <==>|Upload Leaf Images| API_AI_Orchestrator
    UI_AI <==>|Context-aware Chat| API_Gateway
    UI_Wizard ==>|Save Farm Profile| API_Gateway

    %% Backend to Data & Services
    API_State <==>|Read/Write Data| DB
    API_State <==>|Read/Write Trends| TS_DB
    API_AI_Orchestrator ==>|Run Inference| Model_1
    API_AI_Orchestrator ==>|Run Inference| Model_2
    API_AI_Orchestrator ==>|Run Inference| Model_3

    %% Backend to IoT
    API_IoT <==>|MQTT / WebSocket / HTTP| ESP32
    API_State <==>|Receive Sensor Telemetry| ESP32
    
    %% Styling
    classDef frontend fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef backend fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#fff;
    classDef hardware fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef ai fill:#4c1d95,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef db fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#fff;

    class Frontend frontend;
    class Backend backend;
    class IoT_Hardware hardware;
    class AI_Services ai;
    class DatabaseLayer db;
```

### Component Details:

1. **Frontend (React)**: Handles the UI. The *Sensors Page* polls the backend every 5 seconds for live moisture readings and sends POST requests to turn the motor ON/OFF. The *AI Assistant* acts as a smart layer aggregating all this context.
2. **Backend (Node.js)**: The core API layer. It bridges the gap between the frontend UI, the physical IoT devices, and the databases.
3. **IoT Layer (Hardware)**: Deployed on the actual farm. The ESP32 gathers data from NPK, Moisture, and Temp sensors and sends telemetry to the backend. It also listens for Relay commands to toggle the Water Pump.
4. **AI Services**: Independent inference modules (Model-1, 2, 3) that consume images from the frontend (via the backend orchestrator) and return bounding boxes/confidence scores.
5. **Database Layer**: Stores persistent farmer profiles, crop history, and time-series sensor data for the charts.

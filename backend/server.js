// Updated: 2026-10-25
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const SensorData = require('./models/SensorData');
const DeviceState = require('./models/DeviceState');
const AnalysisRecord = require('./models/AnalysisRecord');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/iot_dashboard';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Initialize Device State if not exists
const initDeviceState = async () => {
  try {
    const count = await DeviceState.countDocuments({ fieldId: 'Field 1' });
    if (count === 0) {
      await DeviceState.create({ fieldId: 'Field 1' });
    }
  } catch (error) {
    console.error("Error initializing device state:", error);
  }
};
initDeviceState();

// --- API Endpoints for Frontend ---

// Get current state & full IoT telemetry
app.get('/api/state', async (req, res) => {
  try {
    const state = await DeviceState.findOne({ fieldId: 'Field 1' });
    
    // Check for physical hardware transmissions (source: 'hardware' or legacy documents)
    const latestHardwareData = await SensorData.findOne({ 
      fieldId: 'Field 1',
      source: { $ne: 'simulation' }
    }).sort({ timestamp: -1 });
    
    // Check if physical hardware sent a packet in the last 12 seconds
    let isHardwareLive = false;
    let currentMoisture = null;
    let secondsSinceLastPacket = null;
    
    if (latestHardwareData) {
      const timeDiff = Date.now() - new Date(latestHardwareData.timestamp).getTime();
      secondsSinceLastPacket = Math.max(0, Math.round(timeDiff / 1000));
      if (timeDiff < 12000) { // 12 seconds timeout (ESP sends every 3 seconds)
        isHardwareLive = true;
        currentMoisture = latestHardwareData.moistureLevel;
      }
    }
    
    // If hardware is live, show live values. If disconnected, values are null/offline.
    const readings = {
      moisture: isHardwareLive ? currentMoisture : null,
      temperature: isHardwareLive ? (latestHardwareData?.temperature ?? 24.0) : null,
      pH: isHardwareLive ? (latestHardwareData?.pH ?? 6.8) : null,
      nitrogen: isHardwareLive ? (latestHardwareData?.nitrogen ?? 42) : null,
      phosphorus: isHardwareLive ? (latestHardwareData?.phosphorus ?? 28) : null,
      potassium: isHardwareLive ? (latestHardwareData?.potassium ?? 35) : null,
      airTemperature: isHardwareLive ? (latestHardwareData?.airTemperature ?? 28.0) : null,
      humidity: isHardwareLive ? (latestHardwareData?.humidity ?? 65) : null,
      lightIntensity: isHardwareLive ? (latestHardwareData?.lightIntensity ?? 850) : null,
      rainfall: 0
    };

    // Stored historical / cached telemetry (from previous sessions)
    const cachedReadings = latestHardwareData ? {
      moisture: latestHardwareData.moistureLevel,
      temperature: latestHardwareData.temperature ?? 24.0,
      pH: latestHardwareData.pH ?? 6.8,
      nitrogen: latestHardwareData.nitrogen ?? 42,
      phosphorus: latestHardwareData.phosphorus ?? 28,
      potassium: latestHardwareData.potassium ?? 35,
      timestamp: latestHardwareData.timestamp
    } : null;

    const device = {
      name: isHardwareLive ? 'ESP32 / ESP8266 Live Node' : 'No Hardware Connected',
      mac: isHardwareLive ? '24:6F:28:3A:7F:11' : 'None',
      network: isHardwareLive ? 'Active Telemetry' : 'Disconnected',
      ip: isHardwareLive ? '13.50.151.133' : 'None',
      uptime: isHardwareLive ? 'Live Stream Active' : 'Offline',
      firmware: 'v1.0.6',
      lastPacketTime: latestHardwareData ? latestHardwareData.timestamp : null,
      secondsSinceLastPacket
    };
    
    res.json({
      isOnline: isHardwareLive,
      status: isHardwareLive ? 'online' : 'disconnected',
      statusText: isHardwareLive ? 'Device Online (Live Hardware)' : 'No Hardware Connected (Offline)',
      currentMoisture,
      readings,
      cachedReadings,
      device,
      lastPacketTime: latestHardwareData ? latestHardwareData.timestamp : null,
      secondsSinceLastPacket,
      serverTime: new Date(),
      state
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical trend (last 24 hours / historical series)
app.get('/api/trend', async (req, res) => {
  try {
    const rawTrend = await SensorData.find({ fieldId: 'Field 1' })
      .sort({ timestamp: -1 })
      .limit(24);
    
    const latest = rawTrend[0];
    const baseM = (latest && latest.moistureLevel > 0) ? latest.moistureLevel : 42;
    const baseT = latest?.temperature || 24;
    const basePh = latest?.pH || 6.8;
    const baseN = latest?.nitrogen || 42;
    const baseP = latest?.phosphorus || 28;
    const baseK = latest?.potassium || 35;

    // Standard 24h formatted time slots
    const times = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '10 PM', '12 AM'];
    
    const trendData = {
      'Moisture': times.map((t, idx) => ({
        time: t,
        value: Math.max(15, Math.min(85, Math.round(baseM + Math.sin(idx * 0.9) * 4)))
      })),
      'Temperature': times.map((t, idx) => ({
        time: t,
        value: Math.round(baseT + Math.sin(idx * 0.8 - 1) * 3)
      })),
      'pH': times.map((t, idx) => ({
        time: t,
        value: Number((basePh + (idx % 2 === 0 ? 0.1 : -0.1)).toFixed(1))
      })),
      'Nitrogen (N)': times.map((t, idx) => ({
        time: t,
        value: Math.round(baseN + (idx % 3) - 1)
      })),
      'Phosphorus (P)': times.map((t, idx) => ({
        time: t,
        value: Math.round(baseP + (idx % 2))
      })),
      'Potassium (K)': times.map((t, idx) => ({
        time: t,
        value: Math.round(baseK + (idx % 4) - 1)
      }))
    };

    res.json(trendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update controls from frontend
app.post('/api/control', async (req, res) => {
  try {
    const { isAutoMode, isManualOverride, overrideDurationHours, pumpIsOn } = req.body;
    
    const update = { lastUpdated: Date.now() };
    if (isAutoMode !== undefined) update.isAutoMode = isAutoMode;
    if (isManualOverride !== undefined) update.isManualOverride = isManualOverride;
    if (overrideDurationHours !== undefined) update.overrideDurationHours = overrideDurationHours;
    if (pumpIsOn !== undefined) update.pumpIsOn = pumpIsOn;

    const state = await DeviceState.findOneAndUpdate(
      { fieldId: 'Field 1' },
      update,
      { new: true, upsert: true }
    );
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API Endpoints for ESP8266 / ESP32 Hardware ---

// Check latest sensor telemetry
app.get('/api/sensor', async (req, res) => {
  try {
    const latest = await SensorData.findOne({ fieldId: 'Field 1' }).sort({ timestamp: -1 });
    if (!latest) {
      return res.json({ message: "No sensor packets recorded yet." });
    }
    const ageSeconds = Math.round((Date.now() - new Date(latest.timestamp).getTime()) / 1000);
    res.json({
      latest,
      ageSeconds,
      isLive: ageSeconds < 12,
      targetEndpoint: "POST http://13.50.151.133/api/sensor"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hardware posts sensor data here
app.post('/api/sensor', async (req, res) => {
  try {
    const rawMoisture = req.body.moistureLevel ?? req.body.moisture ?? req.body.moisture_level ?? req.body.soilMoisture;
    
    if (rawMoisture === undefined || rawMoisture === null) {
      return res.status(400).json({ error: 'moistureLevel or moisture is required in JSON body' });
    }

    const moistureLevel = Number(rawMoisture);
    const temperature = Number(req.body.temperature ?? req.body.temp ?? 24.2);
    const pH = Number(req.body.pH ?? req.body.ph ?? 6.8);
    const nitrogen = Number(req.body.nitrogen ?? req.body.n ?? 42);
    const phosphorus = Number(req.body.phosphorus ?? req.body.p ?? 28);
    const potassium = Number(req.body.potassium ?? req.body.k ?? 35);
    const airTemperature = Number(req.body.airTemperature ?? req.body.airTemp ?? 28.0);
    const humidity = Number(req.body.humidity ?? 65);
    const lightIntensity = Number(req.body.lightIntensity ?? req.body.light ?? 850);

    const newData = new SensorData({ 
      moistureLevel,
      temperature,
      pH,
      nitrogen,
      phosphorus,
      potassium,
      airTemperature,
      humidity,
      lightIntensity,
      source: 'hardware'
    });
    await newData.save();

    console.log(`[IoT Telemetry] Saved REAL HARDWARE packet from ${req.ip}: moisture=${moistureLevel}%, temp=${temperature}C, pH=${pH}`);

    // Check logic if auto mode is on
    const state = await DeviceState.findOne({ fieldId: 'Field 1' });
    if (state && state.isAutoMode) {
      if (moistureLevel < 40) { // Below threshold
        state.pumpIsOn = true;
      } else if (moistureLevel > 60) { // Above threshold
        state.pumpIsOn = false;
      }
      await state.save();
    }

    // Return current pump status to hardware
    res.json({ 
      success: true,
      pumpIsOn: state ? state.pumpIsOn : false,
      recordedMoisture: moistureLevel
    });
  } catch (error) {
    console.error('[IoT Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// Simulate incoming IoT Sensor packet
app.post('/api/sensor/simulate', async (req, res) => {
  try {
    const moisture = req.body.moisture || Math.floor(Math.random() * 20 + 35);
    const newData = new SensorData({
      moistureLevel: moisture,
      temperature: 24 + Math.floor(Math.random() * 4),
      pH: Number((6.7 + Math.random() * 0.3).toFixed(1)),
      nitrogen: 40 + Math.floor(Math.random() * 6),
      phosphorus: 26 + Math.floor(Math.random() * 5),
      potassium: 33 + Math.floor(Math.random() * 5),
      source: 'simulation'
    });
    await newData.save();
    res.json({ success: true, message: "Simulation Demo Packet Recorded", data: newData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API Endpoints for ML Crop Analysis ---

app.post('/api/analysis/disease', upload.single('image'), async (req, res) => {
  try {
    const { crop, plantPart, userId, farmId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    // Prepare form data for FastAPI
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append('crop', crop || 'wheat');
    formData.append('plantPart', plantPart || 'leaf');
    
    // Call Python ML Service on AWS EC2
    const model1Url = process.env.MODEL1_URL || 'http://16.192.162.67/api/v1/disease/predict';
    const mlResponse = await axios.post(model1Url, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    const rawData = mlResponse.data;
    
    // Map AI service response to frontend expected format
    const isUncertain = rawData.disease === 'Unknown' || rawData.confidence < 50;
    
    const mlData = {
      crop: crop || 'wheat',
      plantPart: plantPart || 'leaf',
      modelVersion: 'v1.0',
      status: isUncertain ? 'uncertain' : 'success',
      predictions: [
        { label: rawData.disease, confidence: rawData.confidence }
      ]
    };
    
    // Save to database
    const analysisId = 'ANA-' + Date.now();
    const record = new AnalysisRecord({
      analysisId,
      userId: userId || 'anonymous',
      farmId: farmId || 'farm-01',
      cropType: mlData.crop,
      plantPart: mlData.plantPart,
      modelVersion: mlData.modelVersion,
      topPrediction: mlData.predictions[0].label,
      topConfidence: mlData.predictions[0].confidence,
      predictions: mlData.predictions,
      analysisStatus: mlData.status
    });
    
    await record.save();
    
    res.json({
      success: true,
      analysisId,
      ...mlData
    });
    
  } catch (error) {
    console.error("Error in /api/analysis/disease:", error.message);
    res.status(500).json({ error: 'Failed to process analysis' });
  }
});

// Pest Detection endpoint forwarding to new EC2 instance
app.post('/api/analysis/pest', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    
    // Using Model 2 EC2 Public IP
    const model2Url = process.env.MODEL2_URL || 'http://13.50.81.200/api/pest/predict';
    const mlResponse = await axios.post(model2Url, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    res.json(mlResponse.data);
    
  } catch (error) {
    console.error("Error in /api/analysis/pest:", error.message);
    res.status(500).json({ error: 'Failed to process pest analysis' });
  }
});

// --- Optional TinyFish Agricultural Web Intelligence Module ---
try {
  const tinyfishRoutes = require('./tinyfish/tinyfishRoutes');
  app.use('/api/tinyfish', tinyfishRoutes);
  console.log('TinyFish module registered at /api/tinyfish');
} catch (err) {
  console.warn('TinyFish module not mounted:', err.message);
}

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

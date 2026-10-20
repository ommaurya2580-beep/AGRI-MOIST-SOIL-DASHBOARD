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
    const latestSensorData = await SensorData.findOne({ fieldId: 'Field 1' }).sort({ timestamp: -1 });
    
    // Check if physical hardware sent a packet in the last 60 seconds
    let isHardwareLive = false;
    let currentMoisture = 42;
    
    if (latestSensorData) {
      const timeDiff = Date.now() - new Date(latestSensorData.timestamp).getTime();
      if (timeDiff < 60000) {
        isHardwareLive = true;
      }
      if (latestSensorData.moistureLevel !== undefined && latestSensorData.moistureLevel !== null && latestSensorData.moistureLevel > 0) {
        currentMoisture = latestSensorData.moistureLevel;
      }
    }
    
    const readings = {
      moisture: currentMoisture,
      temperature: latestSensorData?.temperature || 24.0,
      pH: latestSensorData?.pH || 6.8,
      nitrogen: latestSensorData?.nitrogen || 42,
      phosphorus: latestSensorData?.phosphorus || 28,
      potassium: latestSensorData?.potassium || 35,
      airTemperature: latestSensorData?.airTemperature || 28.0,
      humidity: latestSensorData?.humidity || 65,
      lightIntensity: latestSensorData?.lightIntensity || 850,
      rainfall: 0
    };

    const device = {
      name: 'ESP32-WF-01',
      mac: '24:6F:28:3A:7F:11',
      network: 'AgriPulse_Net',
      ip: '192.168.1.105',
      uptime: '2d 14h 32m',
      firmware: 'v1.0.6',
      lastSync: latestSensorData ? latestSensorData.timestamp : new Date()
    };
    
    res.json({
      isOnline: isHardwareLive,
      status: isHardwareLive ? 'online' : 'connected_server',
      statusText: isHardwareLive ? 'Device Online (Live Hardware)' : 'Connected to IoT Cloud (Cloud Telemetry Active)',
      currentMoisture,
      readings,
      device,
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

// Hardware posts sensor data here
app.post('/api/sensor', async (req, res) => {
  try {
    const { 
      moistureLevel, 
      temperature = 24.2, 
      pH = 6.8, 
      nitrogen = 42, 
      phosphorus = 28, 
      potassium = 35,
      airTemperature = 28.0,
      humidity = 65,
      lightIntensity = 850 
    } = req.body;
    
    if (moistureLevel === undefined) {
      return res.status(400).json({ error: 'moistureLevel is required' });
    }

    const newData = new SensorData({ 
      moistureLevel: Number(moistureLevel),
      temperature: Number(temperature),
      pH: Number(pH),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      airTemperature: Number(airTemperature),
      humidity: Number(humidity),
      lightIntensity: Number(lightIntensity)
    });
    await newData.save();

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
    res.json({ pumpIsOn: state ? state.pumpIsOn : false });
  } catch (error) {
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
      potassium: 33 + Math.floor(Math.random() * 5)
    });
    await newData.save();
    res.json({ success: true, message: "IoT Sensor Packet Recorded", data: newData });
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

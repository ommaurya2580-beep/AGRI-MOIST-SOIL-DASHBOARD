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
// Serve the frontend build folder as static files
app.use(express.static(path.join(__dirname, 'public')));

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

// Get current state
app.get('/api/state', async (req, res) => {
  try {
    const state = await DeviceState.findOne({ fieldId: 'Field 1' });
    const latestSensorData = await SensorData.findOne({ fieldId: 'Field 1' }).sort({ timestamp: -1 });
    
    // Check if offline (no data in last 30 seconds)
    let isOnline = false;
    let currentMoisture = 0;
    
    if (latestSensorData) {
      const timeDiff = Date.now() - new Date(latestSensorData.timestamp).getTime();
      // Changed to 6000 (6 seconds) for almost instant offline detection with a 1s network buffer
      if (timeDiff < 6000) {
        isOnline = true;
        currentMoisture = latestSensorData.moistureLevel;
      }
    }
    
    res.json({
      state,
      currentMoisture,
      isOnline
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical trend (last 7 days simplified)
app.get('/api/trend', async (req, res) => {
  try {
    const trend = await SensorData.find({ fieldId: 'Field 1' })
      .sort({ timestamp: -1 })
      .limit(7); // In real app, group by day
    res.json(trend.reverse());
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
      { new: true }
    );
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API Endpoints for ESP8266 (Hardware) ---

// ESP8266 posts moisture data here
app.post('/api/sensor', async (req, res) => {
  try {
    const { moistureLevel } = req.body;
    
    if (moistureLevel === undefined) {
      return res.status(400).json({ error: 'moistureLevel is required' });
    }

    const newData = new SensorData({ moistureLevel });
    await newData.save();

    // Check logic if auto mode is on
    const state = await DeviceState.findOne({ fieldId: 'Field 1' });
    if (state.isAutoMode) {
      if (moistureLevel < 40) { // Below threshold
        state.pumpIsOn = true;
      } else if (moistureLevel > 60) { // Above threshold
        state.pumpIsOn = false;
      }
      await state.save();
    }

    // Return the current pump status to the ESP8266 so it knows what to do
    res.json({ pumpIsOn: state.pumpIsOn });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const mlResponse = await axios.post('http://100.54.13.254:8000/api/v1/disease/predict', formData, {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

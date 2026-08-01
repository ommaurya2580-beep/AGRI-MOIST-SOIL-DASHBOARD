require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const SensorData = require('./models/SensorData');
const DeviceState = require('./models/DeviceState');

const app = express();
app.use(cors());
app.use(express.json());

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
    
    res.json({
      state,
      currentMoisture: latestSensorData ? latestSensorData.moistureLevel : 0
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

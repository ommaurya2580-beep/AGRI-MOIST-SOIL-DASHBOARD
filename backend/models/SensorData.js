// Updated: 2026-10-25
const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  moistureLevel: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    default: 24.2
  },
  pH: {
    type: Number,
    default: 6.8
  },
  nitrogen: {
    type: Number,
    default: 42
  },
  phosphorus: {
    type: Number,
    default: 28
  },
  potassium: {
    type: Number,
    default: 35
  },
  airTemperature: {
    type: Number,
    default: 28.0
  },
  humidity: {
    type: Number,
    default: 65
  },
  lightIntensity: {
    type: Number,
    default: 850
  },
  fieldId: {
    type: String,
    default: 'Field 1'
  },
  source: {
    type: String,
    enum: ['hardware', 'simulation'],
    default: 'hardware'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);

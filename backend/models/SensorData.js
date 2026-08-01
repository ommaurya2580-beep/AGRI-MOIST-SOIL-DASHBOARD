const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  moistureLevel: {
    type: Number,
    required: true
  },
  fieldId: {
    type: String,
    default: 'Field 1'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);

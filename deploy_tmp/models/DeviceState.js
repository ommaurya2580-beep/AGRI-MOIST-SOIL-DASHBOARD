const mongoose = require('mongoose');

const deviceStateSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    default: 'Field 1',
    unique: true
  },
  isAutoMode: {
    type: Boolean,
    default: true
  },
  isManualOverride: {
    type: Boolean,
    default: false
  },
  pumpIsOn: {
    type: Boolean,
    default: false
  },
  overrideDurationHours: {
    type: Number,
    default: 1
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeviceState', deviceStateSchema);

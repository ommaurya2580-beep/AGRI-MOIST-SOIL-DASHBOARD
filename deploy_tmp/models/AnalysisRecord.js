const mongoose = require('mongoose');

const analysisRecordSchema = new mongoose.Schema({
  analysisId: { type: String, required: true },
  userId: { type: String, default: "anonymous" },
  farmId: { type: String, default: "farm-01" },
  cropId: { type: String, default: "wheat-01" },
  cropType: { type: String, required: true },
  plantPart: { type: String, required: true },
  imageUrl: { type: String }, // Optional depending on if we save locally or S3
  modelVersion: { type: String },
  topPrediction: { type: String },
  topConfidence: { type: Number },
  predictions: { type: Array },
  analysisStatus: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalysisRecord', analysisRecordSchema);

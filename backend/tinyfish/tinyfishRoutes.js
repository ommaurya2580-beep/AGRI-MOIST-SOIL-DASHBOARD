/**
 * TinyFish Express Routes
 *
 * Exposes endpoints:
 *   GET  /api/tinyfish/status     - Health & configuration check
 *   POST /api/tinyfish/advisories - Search & validate agricultural advisories
 */
const express = require('express');
const router = express.Router();
const tinyfishController = require('./tinyfishController');

// Status check endpoint
router.get('/status', (req, res) => tinyfishController.getStatus(req, res));

// Advisory search & validation endpoint
router.post('/advisories', (req, res) => tinyfishController.getAdvisories(req, res));

module.exports = router;

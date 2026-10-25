// Updated: 2026-10-25
/**
 * TinyFish Module Configuration
 *
 * All settings are driven by environment variables.
 * If TINYFISH_ENABLED is false or TINYFISH_API_KEY is missing,
 * the module safely falls back to a disabled state without crashing the backend.
 */
require('dotenv').config();

const config = {
  enabled: process.env.TINYFISH_ENABLED === 'true',
  apiKey: process.env.TINYFISH_API_KEY ? process.env.TINYFISH_API_KEY.trim() : '',
  searchUrl: process.env.TINYFISH_SEARCH_URL || 'https://api.search.tinyfish.ai',
  fetchUrl: process.env.TINYFISH_FETCH_URL || 'https://api.fetch.tinyfish.ai',
  timeoutMs: parseInt(process.env.TINYFISH_TIMEOUT_MS, 10) || 20000,
  
  // Whitelisted trusted agricultural domains for priority ranking & validation
  trustedDomains: [
    'icar.gov.in',
    'iiwbr.icar.gov.in',
    'krishi.icar.gov.in',
    'kvk.icar.gov.in',
    'agricoop.nic.in',
    'agricoop.gov.in',
    'vikaspedia.in',
    'fao.org',
    'cimmyt.org',
    'tamu.edu',
    'agritech.tnau.ac.in',
    'extension.umn.edu',
    'ipm.ucanr.edu'
  ]
};

module.exports = config;

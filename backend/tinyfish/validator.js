/**
 * TinyFish Input Validator & SSRF Guard
 *
 * Ensures input parameters are sanitized and prevents malicious URLs from being queried.
 */
const config = require('./config');

/**
 * Sanitize text input: strip HTML, trim, enforce max length
 */
function sanitizeString(str, maxLength = 100) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[^\w\s\-,.()/%]/gi, '') // Strip unsafe special characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate incoming advisory request payload
 */
function validateAdvisoryRequest(body) {
  const errors = [];

  const crop = sanitizeString(body.crop || 'wheat', 50);
  const issue = sanitizeString(body.issue || body.disease || body.pest || '', 80);
  const chemical = sanitizeString(body.chemical || body.fertilizer || '', 100);
  const location = sanitizeString(body.location || body.state || '', 60);
  const stage = sanitizeString(body.stage || '', 50);

  if (!crop && !issue && !chemical) {
    errors.push('At least one search parameter (crop, issue, or chemical/fertilizer) is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      crop: crop || 'wheat',
      issue,
      chemical,
      location,
      stage
    }
  };
}

/**
 * Check if a URL belongs to a trusted agricultural domain
 */
function isTrustedDomain(urlString) {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();
    
    // Check against trusted domain whitelist
    return config.trustedDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Validate URL for TinyFish Fetch API (Guards against SSRF)
 */
function validateFetchUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('http')) {
    return { isValid: false, reason: 'Invalid URL format' };
  }

  try {
    const parsed = new URL(url);
    // Block private/local IP spaces (SSRF protection)
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.16.') ||
      host.startsWith('172.31.') ||
      host === '169.254.169.254'
    ) {
      return { isValid: false, reason: 'Access to private internal network addresses is forbidden.' };
    }

    return { isValid: true, url: parsed.toString() };
  } catch (e) {
    return { isValid: false, reason: 'Malformed URL.' };
  }
}

module.exports = {
  sanitizeString,
  validateAdvisoryRequest,
  isTrustedDomain,
  validateFetchUrl
};

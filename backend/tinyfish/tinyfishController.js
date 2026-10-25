// Updated: 2026-10-25
/**
 * TinyFish Controller Layer
 *
 * Handles HTTP requests, enforces validation, coordinates service calls,
 * and produces unified, predictable JSON responses.
 */
const tinyfishService = require('./tinyfishService');
const { validateAdvisoryRequest } = require('./validator');

class TinyFishController {
  /**
   * GET /api/tinyfish/status
   * Returns whether TinyFish module is enabled and configured
   */
  async getStatus(req, res) {
    try {
      const isConfigured = tinyfishService.isConfigured();
      res.json({
        enabled: isConfigured,
        message: isConfigured 
          ? 'TinyFish Agricultural Web Intelligence is active and configured.'
          : 'TinyFish module is inactive (TINYFISH_ENABLED=false or missing API key).'
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to inspect TinyFish status' });
    }
  }

  /**
   * POST /api/tinyfish/advisories
   * Retrieves web advisories & validates recommendations from trusted sources
   */
  async getAdvisories(req, res) {
    try {
      // 1. Validate payload
      const validation = validateAdvisoryRequest(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const params = validation.data;

      // 2. Query TinyFish Search
      const searchResult = await tinyfishService.searchAdvisories(params);

      // If module is disabled, return polite fallback
      if (!searchResult.enabled) {
        return res.json({
          success: true,
          enabled: false,
          message: searchResult.message,
          sources: [],
          validation: {
            status: 'disabled',
            badge: 'Web Intelligence Inactive',
            color: 'slate',
            message: 'TinyFish API is not enabled. AgriPulse core functions remain fully operational.'
          }
        });
      }

      // If search failed or errored gracefully
      if (!searchResult.success) {
        return res.json({
          success: false,
          enabled: true,
          error: searchResult.error,
          sources: [],
          validation: {
            status: 'unavailable',
            badge: 'Service Temporarily Unavailable',
            color: 'slate',
            message: 'Could not connect to external search engine. Please verify network or API quota.'
          }
        });
      }

      // 3. Evaluate validation against retrieved sources
      const validationOutcome = tinyfishService.evaluateValidation(searchResult.sources, params);

      // 4. Return predictable, normalized response
      return res.json({
        success: true,
        enabled: true,
        crop: params.crop,
        issue: params.issue,
        chemical: params.chemical,
        query: searchResult.query,
        sources: searchResult.sources,
        validation: validationOutcome,
        disclaimer: 'Agricultural Web Intelligence provides supplementary extension literature retrieved from web sources. It does not overwrite ML model predictions or replace on-field KVK agronomist consultation.'
      });

    } catch (err) {
      console.error('Unhandled error in TinyFishController:', err);
      // Fail gracefully so frontend doesn't crash
      res.status(500).json({
        success: false,
        error: 'An internal error occurred while processing agricultural advisories.'
      });
    }
  }
}

module.exports = new TinyFishController();

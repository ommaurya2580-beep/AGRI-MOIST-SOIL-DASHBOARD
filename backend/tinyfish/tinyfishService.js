/**
 * TinyFish Service Layer
 *
 * Communicates with TinyFish Search and Fetch APIs.
 * Ensures strict timeout handling, normalization, trusted source labeling,
 * and zero-crash fault-tolerance.
 */
const axios = require('axios');
const config = require('./config');
const { isTrustedDomain, validateFetchUrl } = require('./validator');

class TinyFishService {
  /**
   * Check if TinyFish is active and configured
   */
  isConfigured() {
    return Boolean(config.enabled && config.apiKey);
  }

  /**
   * Build targeted search query for agricultural validation
   */
  buildSearchQuery({ crop, issue, chemical, location, stage }) {
    const parts = [crop || 'Wheat'];
    if (issue) parts.push(issue);
    if (chemical) parts.push(chemical);
    if (location) parts.push(location);
    if (stage) parts.push(stage);
    
    // Add trusted domain keywords
    parts.push('ICAR KVK advisory management dosage');
    return parts.join(' ').trim();
  }

  /**
   * Search agricultural web literature via TinyFish Search API
   */
  async searchAdvisories(queryParams) {
    if (!this.isConfigured()) {
      return {
        enabled: false,
        message: 'TinyFish Web Intelligence is disabled or API key not configured.',
        sources: []
      };
    }

    const query = this.buildSearchQuery(queryParams);

    try {
      const response = await axios.get(config.searchUrl, {
        params: {
          query,
          limit: 5,
          location: queryParams.location || 'India'
        },
        headers: {
          'X-API-Key': config.apiKey,
          'Authorization': `Bearer ${config.apiKey}`,
          'Accept': 'application/json'
        },
        timeout: config.timeoutMs
      });

      const rawResults = response.data?.results || response.data?.data || response.data || [];
      const normalizedSources = this.normalizeSearchResults(rawResults);

      return {
        enabled: true,
        success: true,
        query,
        sources: normalizedSources
      };
    } catch (error) {
      console.warn('TinyFish Search API notice:', error.message);
      return {
        enabled: true,
        success: false,
        query,
        error: error.code === 'ECONNABORTED' 
          ? 'TinyFish search timed out after 20 seconds.' 
          : `Search failed: ${error.message}`,
        sources: []
      };
    }
  }

  /**
   * Fetch full-text content of verified advisory pages via TinyFish Fetch API
   */
  async fetchAdvisoryContent(urls) {
    if (!this.isConfigured() || !Array.isArray(urls) || urls.length === 0) {
      return [];
    }

    // SSRF validation: only fetch valid, external URLs
    const safeUrls = urls
      .map(u => validateFetchUrl(u))
      .filter(res => res.isValid)
      .map(res => res.url)
      .slice(0, 3); // Max 3 pages

    if (safeUrls.length === 0) return [];

    try {
      const response = await axios.post(config.fetchUrl, {
        urls: safeUrls,
        format: 'markdown'
      }, {
        headers: {
          'X-API-Key': config.apiKey,
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: config.timeoutMs
      });

      return response.data?.pages || response.data?.results || [];
    } catch (error) {
      console.warn('TinyFish Fetch API notice:', error.message);
      return [];
    }
  }

  /**
   * Normalize search output, tag trusted domains, and extract snippets
   */
  normalizeSearchResults(rawList) {
    if (!Array.isArray(rawList)) return [];

    return rawList.map(item => {
      const url = item.url || item.link || '';
      let domain = '';
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = 'external-source';
      }

      const isTrusted = isTrustedDomain(url);

      let sourceType = 'Agricultural Web';
      if (domain.includes('icar.gov.in') || domain.includes('iiwbr')) sourceType = 'ICAR Institute';
      else if (domain.includes('kvk.')) sourceType = 'Krishi Vigyan Kendra (KVK)';
      else if (domain.includes('gov.in') || domain.includes('nic.in')) sourceType = 'Ministry of Agriculture';
      else if (domain.includes('fao.org')) sourceType = 'UN Food & Agriculture Org (FAO)';
      else if (domain.includes('edu') || domain.includes('ac.in')) sourceType = 'State Agricultural University';

      return {
        title: item.title || 'Extension Bulletin',
        url,
        domain,
        sourceType,
        isTrusted,
        snippet: (item.snippet || item.description || item.content || '').slice(0, 300),
        publishedDate: item.date || item.publishedDate || null
      };
    });
  }

  /**
   * Validate recommended treatment against retrieved sources
   */
  evaluateValidation(sources, { chemical, issue }) {
    if (!sources || sources.length === 0) {
      return {
        status: 'unverified',
        badge: 'No Web Evidence Found',
        color: 'slate',
        message: 'No live extension advisories could be retrieved at this moment.'
      };
    }

    const combinedText = sources.map(s => `${s.title} ${s.snippet}`).join(' ').toLowerCase();
    const chemLower = (chemical || '').toLowerCase();
    const issueLower = (issue || '').toLowerCase();

    // Check if chemical is mentioned in the advisory
    const chemMentioned = chemLower && combinedText.includes(chemLower.split(' ')[0]);
    const issueMentioned = issueLower && combinedText.includes(issueLower.split(' ')[0]);

    if (chemMentioned && issueMentioned) {
      return {
        status: 'verified',
        badge: 'Confirmed by Extension Literature',
        color: 'emerald',
        message: `Treatment (${chemical}) for ${issue} is corroborated by retrieved government/university advisories.`
      };
    } else if (issueMentioned) {
      return {
        status: 'partial',
        badge: 'Condition Recognized',
        color: 'blue',
        message: `Found official advisories for ${issue}, but specific local dosage should be rechecked with a KVK officer.`
      };
    } else {
      return {
        status: 'warning',
        badge: 'Requires Expert Review',
        color: 'amber',
        message: 'Web information does not clearly confirm this specific treatment. Please review original sources or consult an agricultural expert.'
      };
    }
  }
}

module.exports = new TinyFishService();

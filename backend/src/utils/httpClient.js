import axios from 'axios';
import env from '../config/env.js';

/**
 * Makes an HTTP GET request to a target URL with standard browser-like headers.
 * Isolated into its own module so tests can mock it without fighting axios internals.
 *
 * @param {string} url
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export async function httpGet(url) {
  return axios.get(url, {
    timeout: env.fetchTimeout,
    maxContentLength: env.maxResponseSize,
    maxBodyLength: env.maxResponseSize,
    responseType: 'text',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; PagePulseBot/1.0; +https://pagepulse.app)',
      Accept: 'text/html,application/xhtml+xml',
    },
    maxRedirects: 5,
  });
}

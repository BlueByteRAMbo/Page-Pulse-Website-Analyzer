import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Analyzes a publicly accessible URL.
 * @param {string} url
 * @returns {Promise<import('../types').AnalysisResult>}
 */
export async function analyzeUrl(url) {
  const { data } = await api.post('/api/analyze', { url });
  return data;
}

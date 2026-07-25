import * as cheerio from 'cheerio';
import { httpGet } from '../utils/httpClient.js';

const ACCEPTED_CONTENT_TYPES = ['text/html'];

function createError(code, message, statusCode = 400) {
  const err = new Error(message);
  err.code = code;
  err.statusCode = statusCode;
  return err;
}

async function fetchPage(url) {
  const start = Date.now();

  let response;
  try {
    response = await httpGet(url);
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      throw createError('TIMEOUT', 'The request timed out.', 504);
    }
    if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
      throw createError('UNREACHABLE', 'The website could not be reached.', 502);
    }
    if (err.response) {
      return {
        html: typeof err.response.data === 'string' ? err.response.data : '',
        status: err.response.status,
        responseTime: Date.now() - start,
        contentType: err.response.headers['content-type'] || '',
      };
    }
    throw createError('NETWORK_ERROR', 'A network error occurred while fetching the page.', 502);
  }

  return {
    html: response.data,
    status: response.status,
    responseTime: Date.now() - start,
    contentType: response.headers['content-type'] || '',
  };
}

function assertIsHtml(contentType) {
  const lower = contentType.toLowerCase();
  const isHtml = ACCEPTED_CONTENT_TYPES.some((t) => lower.includes(t));
  if (!isHtml) {
    throw createError('NOT_HTML', 'The URL does not point to an HTML page.', 422);
  }
}

function countWords($) {
  const clone = $.root().clone();
  clone.find('script, style, noscript').remove();
  const text = clone.text();
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return 0;
  return normalized.split(' ').filter((w) => w.length > 0).length;
}

export async function analyzePage(url) {
  const { html, status, responseTime, contentType } = await fetchPage(url);

  assertIsHtml(contentType);

  const $ = cheerio.load(html);

  const title = $('title').first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    null;

  const h1Count = $('h1').length;

  const missingAltImages = $('img').filter((_, el) => {
    const alt = $(el).attr('alt');
    return alt === undefined || alt === null;
  }).length;

  const wordCount = countWords($);

  return { status, responseTime, title, metaDescription, h1Count, missingAltImages, wordCount };
}

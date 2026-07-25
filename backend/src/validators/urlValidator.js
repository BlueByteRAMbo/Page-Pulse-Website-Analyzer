// Private IP ranges that must never be fetched.
const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

class UrlValidator {
  /**
   * Validates a URL string for use as a fetch target.
   * @param {string} raw
   * @returns {{ valid: boolean, code?: string, message?: string }}
   */
  validate(raw) {
    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      return this._fail('MISSING_URL', 'URL is required.');
    }

    const url = raw.trim();

    // Reject duplicate slashes in path after protocol
    if (/([^:])\/\//.test(url.replace(/^https?:\/\//, ''))) {
      return this._fail('INVALID_URL', 'URL contains duplicate slashes.');
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return this._fail('INVALID_URL', 'URL is malformed or missing a protocol (http/https).');
    }

    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return this._fail(
        'INVALID_PROTOCOL',
        `Unsupported protocol "${parsed.protocol}". Only http and https are allowed.`
      );
    }

    const hostname = parsed.hostname.toLowerCase();

    if (hostname === 'localhost' || hostname === '0.0.0.0') {
      return this._fail('PRIVATE_ADDRESS', 'Localhost URLs are not allowed.', 403);
    }

    if (PRIVATE_IP_PATTERNS.some((re) => re.test(hostname))) {
      return this._fail('PRIVATE_ADDRESS', 'Private IP addresses are not allowed.', 403);
    }

    return { valid: true };
  }

  _fail(code, message, statusCode = 400) {
    return { valid: false, code, message, statusCode };
  }
}

export default new UrlValidator();

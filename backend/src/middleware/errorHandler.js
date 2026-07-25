import env from '../config/env.js';

const { nodeEnv } = env;

// Maps known error codes to HTTP status codes.
const STATUS_MAP = {
  MISSING_URL: 400,
  INVALID_URL: 400,
  INVALID_PROTOCOL: 400,
  PRIVATE_ADDRESS: 403,
  NOT_HTML: 422,
  TIMEOUT: 504,
  UNREACHABLE: 502,
  NETWORK_ERROR: 502,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/**
 * Centralized error handler — must be registered last in Express.
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const code = err.code || 'SERVER_ERROR';
  const statusCode = err.statusCode || STATUS_MAP[code] || 500;
  const message = err.message || 'An unexpected error occurred.';

  const payload = {
    success: false,
    error: { message, code },
  };

  // Never leak stack traces in production
  if (nodeEnv !== 'production' && err.stack) {
    payload.error.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

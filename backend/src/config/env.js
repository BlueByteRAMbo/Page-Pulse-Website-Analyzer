import 'dotenv/config';

const required = ['PORT'];

for (const key of required) {
  if (!process.env[key]) {
    // Render and most platforms inject PORT automatically.
    // Warn rather than crash so local dev without a .env still works.
    console.warn(`[config] Warning: ${key} not set, using fallback.`);
  }
}

export default {
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),
  maxResponseSize: parseInt(process.env.MAX_RESPONSE_SIZE, 10) || 5_242_880,
  fetchTimeout: parseInt(process.env.FETCH_TIMEOUT, 10) || 10_000,
};

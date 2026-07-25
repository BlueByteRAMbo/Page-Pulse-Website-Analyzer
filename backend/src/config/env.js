import 'dotenv/config';

const required = ['PORT'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default {
  port: parseInt(process.env.PORT, 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),
  maxResponseSize: parseInt(process.env.MAX_RESPONSE_SIZE, 10) || 5_242_880,
  fetchTimeout: parseInt(process.env.FETCH_TIMEOUT, 10) || 10_000,
};

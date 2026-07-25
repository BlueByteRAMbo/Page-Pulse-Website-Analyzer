import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import env from './config/env.js';
import analyzeRouter from './routes/analyze.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

const { port, allowedOrigins, nodeEnv } = env;

const app = express();

// Security
app.use(helmet());

// CORS — strict in production
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || nodeEnv === 'development') {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} is not allowed.`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// Logging — skip in test to keep output clean
if (nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '16kb' }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/analyze', analyzeRouter);

// 404 and error handlers — must come last
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[page-pulse] Server running on port ${port} (${nodeEnv})`);
});

export default app;

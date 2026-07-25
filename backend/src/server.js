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

// Security headers
app.use(helmet());

// CORS — only allow listed origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or health-check calls (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} is not allowed.`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// Logging
if (nodeEnv !== 'test') {
  // 'combined' gives structured logs on Render; 'dev' is colourised for local
  app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Body parsing — cap at 16 KB to limit abuse surface
app.use(express.json({ limit: '16kb' }));

// Health check — used by Render for zero-downtime deploys
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

import { env } from './config/env.js';
import express from 'express';
import cors from 'cors';
import dns from 'node:dns';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import { createOriginMatcher } from './config/cors.js';
import contentRoutes from './routes/contentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { configureUploadStorage, uploadsDir } from './middleware/upload.js';
import { serveAsset } from './services/assetStorage.js';

// Local DNS workaround for MongoDB Atlas SRV lookup.
// Do not override DNS servers in production.
if (!env.isProduction) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

configureUploadStorage(env.uploadsDir);

const app = express();

if (env.isProduction) {
  // Required for correct client IPs when running behind a reverse proxy.
  app.set('trust proxy', 1);
}

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS Configuration
// CLIENT_URL accepts a comma-separated list. Entries may use '*' as a wildcard,
// which is useful for Vercel preview deployment URLs.
const matchesAllowedOrigin = createOriginMatcher(env.clientUrl);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. curl or Postman).
      if (!origin) return callback(null, true);

      if (
        matchesAllowedOrigin(origin) ||
        (!env.isProduction && origin.startsWith('http://localhost:'))
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.get('/uploads/:filename', serveAsset);
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use(['/api/auth', '/api/content'], async (req, res, next) => {
  if (env.isProduction && mongoose.connection.readyState !== 1 && !(await connectDB())) {
    res.setHeader('Retry-After', '10');
    return res.status(503).json({ success: false, message: 'Storage is reconnecting. Please try again shortly.' });
  }
  next();
});
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sana Fatma Portfolio API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'fallback',
    revision: process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || null,
    timestamp: new Date().toISOString()
  });
});

// Unknown API routes should return JSON rather than the SPA/HTML.
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  console.error('[Server Error]:', err.stack || err);

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status >= 500 ? 'Internal Server Error' : err.message
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(
      `[Portfolio Backend] Server active and listening on http://localhost:${env.port}`
    );
  });

  server.on('error', (error) => {
    console.error('[Portfolio Backend] Failed to start:', error.message);
    process.exitCode = 1;
  });
};

if (process.env.VERCEL) {
  // Vercel invokes the exported Express app; it must not call app.listen().
  await connectDB();
} else {
  startServer().catch((error) => {
    console.error('[Portfolio Backend] Fatal startup error:', error);
    process.exitCode = 1;
  });
}

export default app;

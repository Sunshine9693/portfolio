
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'node:dns';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'node:url';

import { connectDB } from './config/db.js';
import contentRoutes from './routes/contentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { configureUploadStorage, uploadsDir } from './middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Local DNS workaround for MongoDB Atlas SRV lookup.
// Do not override DNS servers in production.
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

configureUploadStorage(process.env.UPLOADS_DIR);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. curl or Postman).
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true);
      }

      // Preserve the existing permissive CORS behavior.
      return callback(null, true);
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
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sana Fatma Portfolio API',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `[Portfolio Backend] Server active and listening on http://localhost:${PORT}`
    );
  });
};

startServer();

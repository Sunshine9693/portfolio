import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables before any other module reads them.
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const isProduction = process.env.NODE_ENV === 'production';
const normalizeUrl = (value = '') => value.trim().replace(/\/+$/, '');
const parsedPort = Number.parseInt(process.env.PORT, 10);

export const env = {
  isProduction,
  port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 5000,
  clientUrl: normalizeUrl(process.env.CLIENT_URL),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sana_portfolio',
  jwtSecret: process.env.JWT_SECRET || (isProduction ? '' : 'dev_only_portfolio_jwt_secret_change_me'),
  adminSetupToken: process.env.ADMIN_SETUP_TOKEN || (isProduction ? '' : 'dev_only_admin_setup_token_change_me'),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  uploadsDir: process.env.UPLOADS_DIR || '',
};

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET must be configured in production.');
}

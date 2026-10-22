import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isMongoConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_FILE = path.join(__dirname, '..', 'data', 'adminUser.json');

const JWT_SECRET = process.env.JWT_SECRET || 'sana_fatma_ultra_secure_portfolio_jwt_secret_2026_key';

const readFileAdmin = () => {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    }
  } catch (e) { /* ignore */ }
  return null;
};

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Try MongoDB first
      if (isMongoConnected) {
        try {
          const { AdminUser } = await import('../models/AdminUser.js');
          const admin = await AdminUser.findById(decoded.id).select('-password');
          if (admin) {
            req.admin = admin;
            return next();
          }
        } catch (e) {
          // MongoDB lookup failed, try file fallback
        }
      }

      // File-based fallback
      const fileAdmin = readFileAdmin();
      if (fileAdmin && fileAdmin.id === decoded.id) {
        req.admin = {
          id: fileAdmin.id,
          _id: fileAdmin.id,
          username: fileAdmin.username,
          email: fileAdmin.email,
          lastLogin: fileAdmin.lastLogin
        };
        return next();
      }

      return res.status(401).json({ success: false, message: 'Admin account not found or deactivated.' });
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no authentication token provided.' });
  }
};

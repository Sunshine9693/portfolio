import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isMongoConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_FILE = path.join(__dirname, '..', 'data', 'adminUser.json');

const JWT_SECRET = process.env.JWT_SECRET || 'sana_fatma_ultra_secure_portfolio_jwt_secret_2026_key';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// ── File-based admin helpers ────────────────────────────────────────────

const readFileAdmin = () => {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('[Auth] Failed to read admin file:', e.message);
  }
  return null;
};

const writeFileAdmin = (adminData) => {
  const dir = path.dirname(ADMIN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2), 'utf8');
};

// ── Dynamic model loader (only when Mongo is connected) ─────────────────

let AdminUser = null;
const getAdminUserModel = async () => {
  if (!AdminUser && isMongoConnected) {
    try {
      const mod = await import('../models/AdminUser.js');
      AdminUser = mod.AdminUser;
    } catch (e) {
      console.warn('[Auth] Could not load AdminUser model:', e.message);
    }
  }
  return AdminUser;
};

// ── Login ───────────────────────────────────────────────────────────────

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
    }

    // Try MongoDB first
    const Model = await getAdminUserModel();
    if (Model && isMongoConnected) {
      try {
        const admin = await Model.findOne({
          $or: [
            { username: username.trim() },
            { email: username.trim().toLowerCase() }
          ]
        });

        if (admin) {
          const isMatch = await admin.matchPassword(password);
          if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
          }
          admin.lastLogin = new Date();
          await admin.save();
          const token = generateToken(admin._id);
          return res.json({
            success: true,
            token,
            admin: { id: admin._id, username: admin.username, email: admin.email, lastLogin: admin.lastLogin }
          });
        }
      } catch (e) {
        console.warn('[Auth] MongoDB login attempt failed, trying file fallback:', e.message);
      }
    }

    // File-based fallback
    const fileAdmin = readFileAdmin();
    if (!fileAdmin) {
      return res.status(401).json({ success: false, message: 'No admin account found. Please complete Initial Setup first.' });
    }

    const nameMatch = fileAdmin.username === username.trim() || fileAdmin.email === username.trim().toLowerCase();
    if (!nameMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const passMatch = await bcrypt.compare(password, fileAdmin.password);
    if (!passMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    fileAdmin.lastLogin = new Date().toISOString();
    writeFileAdmin(fileAdmin);

    const token = generateToken(fileAdmin.id);
    return res.json({
      success: true,
      token,
      admin: { id: fileAdmin.id, username: fileAdmin.username, email: fileAdmin.email, lastLogin: fileAdmin.lastLogin }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login authentication.' });
  }
};

// ── Get Me ──────────────────────────────────────────────────────────────

export const getMe = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    return res.json({
      success: true,
      admin: {
        id: req.admin.id || req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
        lastLogin: req.admin.lastLogin
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving admin info.' });
  }
};

// ── Initial Setup ───────────────────────────────────────────────────────

export const setupInitialAdmin = async (req, res) => {
  try {
    const { setupToken, username, email, password } = req.body;

    const expectedToken = process.env.ADMIN_SETUP_TOKEN || 'sana_admin_setup_secure_token_2026';

    if (!setupToken || setupToken !== expectedToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or missing admin setup token. Check your server .env configuration.'
      });
    }

    if (!username || !email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, valid email, and a secure password of at least 8 characters.'
      });
    }

    // Try MongoDB first
    const Model = await getAdminUserModel();
    if (Model && isMongoConnected) {
      try {
        const existingCount = await Model.countDocuments();
        if (existingCount > 0) {
          return res.status(400).json({
            success: false,
            message: 'Admin account already exists. For security, setup is only permitted once.'
          });
        }

        const admin = await Model.create({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: password
        });

        const token = generateToken(admin._id);
        return res.status(201).json({
          success: true,
          message: 'Initial administrator account created securely.',
          token,
          admin: { id: admin._id, username: admin.username, email: admin.email }
        });
      } catch (e) {
        console.warn('[Auth] MongoDB setup failed, using file fallback:', e.message);
      }
    }

    // File-based fallback
    const existingAdmin = readFileAdmin();
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists. For security, setup is only permitted once.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const adminId = 'file_admin_' + Date.now();

    const adminData = {
      id: adminId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    writeFileAdmin(adminData);
    console.log('[Auth] Admin account created via file-based storage (no MongoDB).');

    const token = generateToken(adminId);
    return res.status(201).json({
      success: true,
      message: 'Initial administrator account created securely (file-based, no MongoDB required).',
      token,
      admin: { id: adminId, username: adminData.username, email: adminData.email }
    });
  } catch (error) {
    console.error('Initial admin setup error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

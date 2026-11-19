import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isMongoConnected } from '../config/db.js';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_FILE = path.join(__dirname, '..', 'data', 'adminUser.json');

const generateToken = (id, version = 0) => {
  return jwt.sign({ id, version }, env.jwtSecret, { expiresIn: '7d' });
};

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

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

    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
    }

    if (username.length > 254 || password.length > 200) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
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
          const token = generateToken(admin._id, admin.tokenVersion);
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

    const token = generateToken(fileAdmin.id, fileAdmin.tokenVersion);
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
    if (env.isProduction && !isMongoConnected) {
      return res.status(503).json({ success: false, message: 'Account storage is temporarily unavailable. Please try again shortly.' });
    }
    const { setupToken, username, email, password } = req.body;

    const expectedToken = env.adminSetupToken;

    if (!expectedToken || !setupToken || typeof setupToken !== 'string' || setupToken !== expectedToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or missing admin setup token. Check your server .env configuration.'
      });
    }

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, valid email, and a secure password of at least 8 characters.'
      });
    }

    if (username.trim().length > 60 || email.trim().length > 254 || !isValidEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid username (max 60 characters) and email address.'
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

// Account recovery requires the server owner's setup key and the existing email.
export const recoverAdminAccess = async (req, res) => {
  try {
    const { setupToken, email, password } = req.body || {};
    if (!env.adminSetupToken || typeof setupToken !== 'string' || setupToken !== env.adminSetupToken) {
      return res.status(403).json({ success: false, message: 'The recovery key is invalid.' });
    }
    if (typeof email !== 'string' || !isValidEmail(email.trim()) || typeof password !== 'string' || password.length < 12 || password.length > 200) {
      return res.status(400).json({ success: false, message: 'Provide the existing account email and a password of 12 to 200 characters.' });
    }
    const Model = await getAdminUserModel();
    if (!Model || !isMongoConnected) {
      return res.status(503).json({ success: false, message: 'Account storage is temporarily unavailable.' });
    }
    const admin = await Model.findOne({ email: email.trim().toLowerCase() });
    if (!admin) return res.status(404).json({ success: false, message: 'No administrator matches this email address.' });
    admin.password = password;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    await admin.save();
    return res.json({ success: true, admin: { username: admin.username, email: admin.email } });
  } catch (error) {
    console.error('Admin recovery failed:', error.message);
    return res.status(500).json({ success: false, message: 'Could not recover access. Please try again.' });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== 'string' || !currentPassword || currentPassword.length > 200) {
      return res.status(400).json({ success: false, message: 'Enter your current password.' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 12 || Buffer.byteLength(newPassword, 'utf8') > 72) {
      return res.status(400).json({ success: false, message: 'Choose a password of at least 12 characters and no more than 72 bytes.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'Choose a different password from your current one.' });
    }
    const Model = await getAdminUserModel();
    const databaseAdmin = Model && isMongoConnected ? await Model.findById(req.admin.id || req.admin._id) : null;
    const fileAdmin = !env.isProduction && !databaseAdmin ? readFileAdmin() : null;
    const admin = databaseAdmin || (fileAdmin?.id === req.admin.id ? fileAdmin : null);
    if (!admin) return res.status(503).json({ success: false, message: 'Account storage is temporarily unavailable. Your password has not changed.' });
    const matches = databaseAdmin ? await admin.matchPassword(currentPassword) : await bcrypt.compare(currentPassword, admin.password);
    if (!matches) return res.status(400).json({ success: false, message: 'Your current password is incorrect.' });
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    if (databaseAdmin) {
      admin.password = newPassword;
      await admin.save();
    } else {
      admin.password = await bcrypt.hash(newPassword, 10);
      writeFileAdmin(admin);
    }
    return res.json({ success: true, message: 'Password changed. Other sessions have been signed out.', token: generateToken(admin.id || admin._id, admin.tokenVersion) });
  } catch (error) {
    console.error('Password change failed:', error.message);
    return res.status(500).json({ success: false, message: 'Could not change your password. Please try again.' });
  }
};

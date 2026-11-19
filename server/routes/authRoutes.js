import express from 'express';
import rateLimit from 'express-rate-limit';
import { loginAdmin, getMe, setupInitialAdmin, recoverAdminAccess, changeAdminPassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait a few minutes and try again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', authLimiter, loginAdmin);
router.get('/me', protectAdmin, getMe);
router.post('/change-password', authLimiter, protectAdmin, changeAdminPassword);
router.post('/setup-initial-admin', authLimiter, setupInitialAdmin);
router.post('/recover', authLimiter, recoverAdminAccess);

export default router;

import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitMessage, getMessages, deleteMessage } from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this address. Please wait a few minutes and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, submitMessage);
router.get('/messages', protectAdmin, getMessages);
router.delete('/messages/:id', protectAdmin, deleteMessage);

export default router;

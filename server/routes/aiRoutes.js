import express from 'express';
import rateLimit from 'express-rate-limit';
import { chatWithAssistant } from '../controllers/aiController.js';

const router = express.Router();

// Rate limiter: 25 requests per 10 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
  message: {
    success: false,
    message: 'AI assistant request limit reached. Please wait a few minutes before asking again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/chat', aiLimiter, chatWithAssistant);

export default router;

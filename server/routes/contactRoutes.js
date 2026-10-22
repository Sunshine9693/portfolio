import express from 'express';
import { submitMessage, getMessages, deleteMessage } from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitMessage);
router.get('/messages', protectAdmin, getMessages);
router.delete('/messages/:id', protectAdmin, deleteMessage);

export default router;

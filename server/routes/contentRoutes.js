import express from 'express';
import { getPublicData, updateSection, uploadAsset } from '../controllers/contentController.js';
import { protectAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPublicData);
router.put('/section', protectAdmin, updateSection);
router.post('/upload', protectAdmin, upload.single('file'), uploadAsset);

export default router;

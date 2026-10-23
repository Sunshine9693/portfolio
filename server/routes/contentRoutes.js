import express from 'express';
import { deleteUploadedAsset, getPublicData, updateSection, uploadAsset, uploadManagedAsset } from '../controllers/contentController.js';
import { protectAdmin } from '../middleware/auth.js';
import { upload, uploadManagedFile } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPublicData);
router.put('/section', protectAdmin, updateSection);
router.post('/upload', protectAdmin, upload.single('file'), uploadAsset);
router.post('/media/:kind', protectAdmin, uploadManagedFile, uploadManagedAsset);
router.delete('/upload/:filename', protectAdmin, deleteUploadedAsset);

export default router;

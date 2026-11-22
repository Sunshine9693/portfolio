import express from 'express';
import { deleteUploadedAsset, getPublicData, updateSection, uploadAsset, uploadManagedAsset } from '../controllers/contentController.js';
import { protectAdmin } from '../middleware/auth.js';
import { uploadSingleFile, uploadManagedFile } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPublicData);
router.put('/section', protectAdmin, updateSection);
router.post('/upload', protectAdmin, uploadSingleFile, uploadAsset);
router.post('/media/:kind', protectAdmin, uploadManagedFile, uploadManagedAsset);
router.post('/media/:kind/publish', protectAdmin, (req, res, next) => { req.publishMedia = true; next(); }, uploadManagedFile, uploadManagedAsset);
router.delete('/upload/:filename', protectAdmin, deleteUploadedAsset);

export default router;

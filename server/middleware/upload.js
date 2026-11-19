import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultUploadsDir = path.join(__dirname, '..', 'uploads');
export let uploadsDir = defaultUploadsDir;

export const configureUploadStorage = (directory = process.env.UPLOADS_DIR) => {
  uploadsDir = path.resolve(directory || defaultUploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName =
      path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-zA-Z0-9_-]/g, '_') ||
      'upload';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const managedExtensions = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

const hasMatchingExtension = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  return Boolean(managedExtensions[file.mimetype]?.includes(extension));
};

const fileFilter = (req, file, cb) => {
  if (managedExtensions[file.mimetype] && hasMatchingExtension(file)) {
    cb(null, true);
    return;
  }

  cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // Within the Vercel request body limit.
  },
});

const managedUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes =
      req.params.kind === 'photo'
        ? ['image/jpeg', 'image/png', 'image/webp']
        : req.params.kind === 'certificate'
          ? Object.keys(managedExtensions)
          : [];

    if (!allowedTypes.includes(file.mimetype) || !hasMatchingExtension(file)) {
      cb(
        new Error(
          req.params.kind === 'photo'
            ? 'Choose a JPG, PNG, or WebP image.'
            : 'Choose a JPG, PNG, WebP image, or PDF certificate.'
        )
      );
      return;
    }

    cb(null, true);
  },
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

const handleUploadError = (res, error) => {
  const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  return res.status(status).json({ success: false, message: error.code === 'LIMIT_FILE_SIZE' ? 'Choose a file smaller than 4 MB.' : error.message });
};

export const uploadSingleFile = (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (error) return handleUploadError(res, error);
    next();
  });
};

export const uploadManagedFile = (req, res, next) => {
  if (!['photo', 'certificate'].includes(req.params.kind)) {
    return res.status(400).json({ success: false, message: 'Unsupported media type.' });
  }

  managedUpload.single('file')(req, res, (error) => {
    if (error) return handleUploadError(res, error);
    next();
  });
};

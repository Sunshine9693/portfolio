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
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, SVG, and PDF files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  }
});

const managedExtensions = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

const managedUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = req.params.kind === 'photo'
      ? ['image/jpeg', 'image/png', 'image/webp']
      : req.params.kind === 'certificate'
        ? Object.keys(managedExtensions)
        : [];
    const extension = path.extname(file.originalname).toLowerCase();

    if (!managedExtensions[file.mimetype]?.includes(extension) || !allowedTypes.includes(file.mimetype)) {
      cb(new Error(req.params.kind === 'photo'
        ? 'Choose a JPG, PNG, or WebP image.'
        : 'Choose a JPG, PNG, WebP image, or PDF certificate.'));
      return;
    }

    cb(null, true);
  },
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

export const uploadManagedFile = (req, res, next) => {
  if (!['photo', 'certificate'].includes(req.params.kind)) {
    return res.status(400).json({ success: false, message: 'Unsupported media type.' });
  }

  managedUpload.single('file')(req, res, (error) => {
    if (error) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ success: false, message: error.message });
    }

    next();
  });
};

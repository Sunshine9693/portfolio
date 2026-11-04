import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { PortfolioData } from '../models/PortfolioData.js';
import { defaultPortfolioData } from '../data/defaultPortfolioData.js';
import { uploadsDir } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localCacheFile = path.join(__dirname, '..', 'data', 'activePortfolioData.json');

const OBJECT_SECTIONS = new Set(['hero', 'about', 'education', 'socialLinks', 'sectionVisibility']);
const ARRAY_SECTIONS = new Set([
  'skills',
  'projects',
  'internships',
  'achievements',
  'certificates',
  'gallery',
]);
const VALID_SECTIONS = new Set([...OBJECT_SECTIONS, ...ARRAY_SECTIONS]);
const MAX_SECTION_BYTES = 1024 * 1024;

// In-memory cache fallback initialized from defaultPortfolioData or local cache file
let inMemoryData = { ...defaultPortfolioData };
if (fs.existsSync(localCacheFile)) {
  try {
    const fileContent = fs.readFileSync(localCacheFile, 'utf8');
    inMemoryData = JSON.parse(fileContent);
  } catch (err) {
    console.error('Error reading localCacheFile:', err);
  }
}

const persistLocalCache = (data) => {
  const temporaryFile = `${localCacheFile}.${process.pid}.tmp`;

  try {
    fs.mkdirSync(path.dirname(localCacheFile), { recursive: true });
    fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(temporaryFile, localCacheFile);
  } catch (err) {
    console.error('Failed to write localCacheFile:', err);
    try {
      if (fs.existsSync(temporaryFile)) fs.unlinkSync(temporaryFile);
    } catch (cleanupError) {
      console.error('Failed to clean up temporary cache file:', cleanupError);
    }
  }
};

const toPlainValue = (value) => {
  if (value && typeof value.toObject === 'function') return value.toObject();
  return JSON.parse(JSON.stringify(value));
};

const validateSectionPayload = (section, data) => {
  if (!VALID_SECTIONS.has(section)) {
    return 'Unknown portfolio section.';
  }

  if (data === null || typeof data !== 'object') {
    return 'Section data must be an object or an array.';
  }

  if (OBJECT_SECTIONS.has(section) && Array.isArray(data)) {
    return `The '${section}' section must be an object.`;
  }

  if (ARRAY_SECTIONS.has(section)) {
    if (!Array.isArray(data)) {
      return `The '${section}' section must be an array.`;
    }
    if (data.length > 200) {
      return `The '${section}' section contains too many entries.`;
    }
    if (data.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
      return `Every entry in '${section}' must be an object.`;
    }
  }

  if (section === 'sectionVisibility') {
    const invalidEntry = Object.entries(data).find(([, value]) => typeof value !== 'boolean');
    if (invalidEntry) return 'Section visibility values must be true or false.';
  }

  if (Buffer.byteLength(JSON.stringify(data), 'utf8') > MAX_SECTION_BYTES) {
    return `The '${section}' section is too large.`;
  }

  return null;
};

export const getPublicData = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let data = await PortfolioData.findOne().sort({ updatedAt: -1 });
      if (!data) {
        data = await PortfolioData.create(defaultPortfolioData);
      }
      return res.json({ success: true, data });
    }

    // Graceful fallback to in-memory/file cached data if DB is offline
    return res.json({ success: true, data: inMemoryData, isCachedFallback: true });
  } catch (error) {
    console.error('getPublicData error:', error);
    return res.json({ success: true, data: inMemoryData, isCachedFallback: true });
  }
};

export const updateSection = async (req, res) => {
  try {
    const { section, data } = req.body || {};
    const validationError = validateSectionPayload(section, data);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (mongoose.connection.readyState === 1) {
      let portfolioDoc = await PortfolioData.findOne().sort({ updatedAt: -1 });
      if (!portfolioDoc) {
        portfolioDoc = new PortfolioData(defaultPortfolioData);
      }

      portfolioDoc[section] = data;
      portfolioDoc.markModified(section);
      await portfolioDoc.save();

      const savedData = toPlainValue(portfolioDoc[section]);
      inMemoryData = { ...inMemoryData, [section]: savedData };
      persistLocalCache(inMemoryData);

      return res.json({
        success: true,
        message: `Section '${section}' updated successfully.`,
        data: savedData,
      });
    }

    inMemoryData = { ...inMemoryData, [section]: data };
    persistLocalCache(inMemoryData);

    return res.json({
      success: true,
      message: `Section '${section}' updated in persistent local storage.`,
      data,
    });
  } catch (error) {
    console.error('updateSection error:', error);
    return res.status(500).json({ success: false, message: 'Could not update the portfolio section.' });
  }
};

const hasValidFileSignature = (filePath, mimetype) => {
  const descriptor = fs.openSync(filePath, 'r');
  const header = Buffer.alloc(12);

  try {
    fs.readSync(descriptor, header, 0, header.length, 0);
  } finally {
    fs.closeSync(descriptor);
  }

  if (mimetype === 'image/jpeg') {
    return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  }
  if (mimetype === 'image/png') {
    return header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimetype === 'image/webp') {
    return header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP';
  }
  if (mimetype === 'application/pdf') {
    return header.toString('ascii', 0, 5) === '%PDF-';
  }
  return false;
};

const removeInvalidUpload = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Failed to remove invalid upload:', error);
  }
};

export const uploadAsset = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    if (!hasValidFileSignature(req.file.path, req.file.mimetype)) {
      removeInvalidUpload(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'The uploaded file contents do not match its file type.',
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      fileUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error('uploadAsset error:', error);
    removeInvalidUpload(req.file?.path);
    return res.status(500).json({ success: false, message: 'The file could not be uploaded.' });
  }
};

export const uploadManagedAsset = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Choose a file to upload.' });
    }

    if (!hasValidFileSignature(req.file.path, req.file.mimetype)) {
      removeInvalidUpload(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'The uploaded file contents do not match its file type.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error('uploadManagedAsset error:', error);
    removeInvalidUpload(req.file?.path);
    return res.status(500).json({ success: false, message: 'The file could not be uploaded.' });
  }
};

export const deleteUploadedAsset = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/.test(filename)) {
      return res.status(400).json({ success: false, message: 'Invalid uploaded file name.' });
    }

    const assetPath = path.resolve(uploadsDir, filename);
    if (path.dirname(assetPath) !== path.resolve(uploadsDir)) {
      return res.status(400).json({ success: false, message: 'Invalid uploaded file path.' });
    }

    let portfolio = inMemoryData;
    if (mongoose.connection.readyState === 1) {
      const latestPortfolio = await PortfolioData.findOne().sort({ updatedAt: -1 }).lean();
      if (latestPortfolio) portfolio = latestPortfolio;
    }

    const assetUrl = `/uploads/${filename}`;
    const referencedUrls = [
      portfolio.hero?.portraitUrl,
      portfolio.hero?.resumeUrl,
      ...(Array.isArray(portfolio.projects) ? portfolio.projects.map((item) => item.imageUrl) : []),
      ...(Array.isArray(portfolio.certificates) ? portfolio.certificates.map((item) => item.fileUrl) : []),
      ...(Array.isArray(portfolio.gallery) ? portfolio.gallery.map((item) => item.url) : []),
    ];
    if (referencedUrls.includes(assetUrl)) {
      return res.status(409).json({ success: false, message: 'This file is still in use by portfolio content.' });
    }

    if (!fs.existsSync(assetPath)) {
      return res.status(404).json({ success: false, message: 'Uploaded file was not found.' });
    }

    fs.unlinkSync(assetPath);
    return res.json({ success: true, message: 'Uploaded file deleted.' });
  } catch (error) {
    console.error('deleteUploadedAsset error:', error);
    return res.status(500).json({ success: false, message: 'Could not delete the uploaded file.' });
  }
};

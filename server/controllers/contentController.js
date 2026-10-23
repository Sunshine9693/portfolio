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
  try {
    fs.writeFileSync(localCacheFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write localCacheFile:', err);
  }
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
    const { section, data } = req.body;

    if (!section || data === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide both section name and update data.' });
    }

    inMemoryData[section] = data;
    persistLocalCache(inMemoryData);

    if (mongoose.connection.readyState === 1) {
      let portfolioDoc = await PortfolioData.findOne().sort({ updatedAt: -1 });
      if (!portfolioDoc) {
        portfolioDoc = new PortfolioData(defaultPortfolioData);
      }

      portfolioDoc[section] = data;
      portfolioDoc.markModified(section);
      await portfolioDoc.save();

      return res.json({
        success: true,
        message: `Section '${section}' updated successfully.`,
        data: portfolioDoc[section]
      });
    }

    return res.json({
      success: true,
      message: `Section '${section}' updated in persistent local storage.`,
      data: inMemoryData[section]
    });
  } catch (error) {
    console.error('updateSection error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAsset = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      fileUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('uploadAsset error:', error);
    return res.status(500).json({ success: false, message: error.message });
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

export const uploadManagedAsset = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Choose a file to upload.' });
  }

  if (!hasValidFileSignature(req.file.path, req.file.mimetype)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, message: 'The uploaded file contents do not match its file type.' });
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
      ...(portfolio.projects || []).map((item) => item.imageUrl),
      ...(portfolio.certificates || []).map((item) => item.fileUrl),
      ...(portfolio.gallery || []).map((item) => item.url),
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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { PortfolioData } from '../models/PortfolioData.js';
import { defaultPortfolioData } from '../data/defaultPortfolioData.js';

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

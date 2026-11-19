import mongoose from 'mongoose';
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { env } from '../config/env.js';

const bucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'portfolioAssets' });

export async function persistAsset(file) {
  if (mongoose.connection.readyState !== 1) {
    if (env.isProduction) throw new Error('Upload storage is unavailable. Please try again shortly.');
    return;
  }
  const upload = bucket().openUploadStream(file.filename, { metadata: { contentType: file.mimetype } });
  try {
    await pipeline(fs.createReadStream(file.path), upload);
  } catch (error) {
    await upload.abort().catch(() => {});
    throw error;
  } finally {
    fs.rmSync(file.path, { force: true });
  }
}

export async function serveAsset(req, res, next) {
  if (mongoose.connection.readyState !== 1) return next();
  try {
    const storage = bucket();
    const file = await storage.find({ filename: req.params.filename }).next();
    if (!file) return next();
    res.setHeader('Content-Type', file.metadata?.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', file.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    await pipeline(storage.openDownloadStream(file._id), res);
  } catch (error) {
    next(error);
  }
}

export async function deleteStoredAsset(filename) {
  if (mongoose.connection.readyState !== 1) return false;
  const storage = bucket();
  const file = await storage.find({ filename }).next();
  if (!file) return false;
  await storage.delete(file._id);
  return true;
}

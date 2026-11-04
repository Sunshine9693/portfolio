import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { PortfolioData } from '../models/PortfolioData.js';
import { defaultPortfolioData } from '../data/defaultPortfolioData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const activeDataFile = path.join(__dirname, '..', 'data', 'activePortfolioData.json');

// Local DNS workaround for MongoDB Atlas SRV lookup, matching the API server.
if (!env.isProduction) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const loadSeedData = () => {
  if (fs.existsSync(activeDataFile)) {
    const parsed = JSON.parse(fs.readFileSync(activeDataFile, 'utf8'));
    console.log('[Seed] Using server/data/activePortfolioData.json.');
    return parsed;
  }

  console.log('[Seed] Active content file not found; using built-in default portfolio data.');
  return defaultPortfolioData;
};

const seedDatabase = async () => {
  const force = process.argv.includes('--force');

  try {
    const seedData = loadSeedData();
    const validationError = new PortfolioData(seedData).validateSync();
    if (validationError) {
      throw new Error(`Seed data failed validation: ${validationError.message}`);
    }

    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Seed] Connected to MongoDB.');

    const existingCount = await PortfolioData.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(
        `[Seed] ${existingCount} portfolio document(s) already exist. Nothing changed. ` +
          'Run with --force to replace them.'
      );
      await mongoose.disconnect();
      return;
    }

    if (existingCount > 0) {
      await PortfolioData.deleteMany({});
      console.log('[Seed] Cleared existing portfolio documents (--force).');
    }

    const created = await PortfolioData.create(seedData);
    console.log(
      `[Seed] Seeded portfolio document ${created._id} ` +
        `(${created.projects.length} projects, ${created.gallery.length} gallery items).`
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  }
};

seedDatabase();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PortfolioData } from '../models/PortfolioData.js';
import { defaultPortfolioData } from '../data/defaultPortfolioData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sana_portfolio';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    await PortfolioData.deleteMany({});
    console.log('[Seed] Cleared existing portfolio documents.');

    const created = await PortfolioData.create(defaultPortfolioData);
    console.log(`[Seed] Successfully seeded portfolio document with ID: ${created._id}`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

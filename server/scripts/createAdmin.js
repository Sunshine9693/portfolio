import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { AdminUser } from '../models/AdminUser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

const setupAdminCli = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sana_portfolio';
    await mongoose.connect(mongoUri);
    console.log('[Admin Setup] Connected to MongoDB.');

    const adminCount = await AdminUser.countDocuments();
    if (adminCount > 0) {
      console.log(`[Admin Setup] An admin account already exists (${adminCount} found). Aborting for security.`);
      process.exit(0);
    }

    console.log('--- SECURE INITIAL ADMIN REGISTRATION ---');
    const username = (await askQuestion('Enter Admin Username (default: sana): ')).trim() || 'sana';
    const email = (await askQuestion('Enter Admin Email (default: sanathesunshine9693@gmail.com): ')).trim() || 'sanathesunshine9693@gmail.com';
    const password = (await askQuestion('Enter Admin Password (min 8 characters): ')).trim();

    if (!password || password.length < 8) {
      console.error('Password must be at least 8 characters.');
      process.exit(1);
    }

    const admin = await AdminUser.create({
      username,
      email,
      password
    });

    console.log(`[Admin Setup] Successfully created admin account for: ${admin.username} (${admin.email})`);
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('[Admin Setup Error]:', error);
    rl.close();
    process.exit(1);
  }
};

setupAdminCli();

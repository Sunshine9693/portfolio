import mongoose from 'mongoose';
import { env } from './env.js';

export let isMongoConnected = false;

mongoose.connection.on('connected', () => {
  isMongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
});

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB: ${error.message}`);
    console.warn('[MongoDB Warning]: Falling back to file-based auth and storage.');
    isMongoConnected = false;
    return false;
  }
};

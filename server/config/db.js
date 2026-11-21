import mongoose from 'mongoose';
import { env } from './env.js';
import { createConnectionRecovery } from '../services/connectionRecovery.js';

export let isMongoConnected = false;

mongoose.connection.on('connected', () => {
  isMongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  recovery.retry();
});

const recovery = createConnectionRecovery({
  isReady: () => mongoose.connection.readyState === 1,
  connect: async () => {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    isMongoConnected = true;
  },
  onError: (error) => {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB: ${error.message}`);
    console.warn('[MongoDB Warning]: Retrying connection automatically.');
    isMongoConnected = false;
  },
});

export const connectDB = recovery.ensure;

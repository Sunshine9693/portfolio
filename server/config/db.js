import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sana_portfolio', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB: ${error.message}`);
    console.warn(`[MongoDB Warning]: Falling back to file-based auth and storage.`);
    isMongoConnected = false;
    return false;
  }
};

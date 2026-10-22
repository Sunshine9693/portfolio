import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 150,
    default: 'General Portfolio Inquiry',
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: 3000,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
  }
}, { timestamps: true });

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

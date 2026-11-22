import mongoose from 'mongoose';
import { ContactMessage } from '../models/ContactMessage.js';
import { env } from '../config/env.js';

const MAX_IN_MEMORY_MESSAGES = 500;
let inMemoryMessages = [];

const cleanText = (value) =>
  value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim();

const validateMessagePayload = (body = {}) => {
  const { name, email, subject, message } = body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return { error: 'Name, email, and message are required fields.' };
  }

  if (typeof subject !== 'undefined' && subject !== null && typeof subject !== 'string') {
    return { error: 'Subject must be text.' };
  }

  const cleanName = cleanText(name);
  const cleanEmail = cleanText(email).toLowerCase();
  const cleanSubject = typeof subject === 'string' ? cleanText(subject) : '';
  const cleanMessage = cleanText(message);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return { error: 'Name, email, and message are required fields.' };
  }

  if (cleanName.length < 2 || cleanName.length > 100) {
    return { error: 'Name must be between 2 and 100 characters.' };
  }

  if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
    return { error: 'Please provide a valid email address.' };
  }

  if (cleanSubject.length > 150) {
    return { error: 'Subject must be 150 characters or fewer.' };
  }

  if (cleanMessage.length < 10 || cleanMessage.length > 3000) {
    return { error: 'Message must be between 10 and 3000 characters.' };
  }

  return {
    value: {
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject || 'Portfolio Inquiry',
      message: cleanMessage,
    },
  };
};

export const submitMessage = async (req, res) => {
  try {
    const validation = validateMessagePayload(req.body);
    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const newMessage = {
      ...validation.value,
      ipAddress: String(req.ip || req.socket?.remoteAddress || '').slice(0, 100),
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const savedDoc = await ContactMessage.create(newMessage);
      return res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Your message has been received.',
        messageId: savedDoc._id,
      });
    }

    // Never acknowledge a production inquiry that will disappear on restart.
    if (env.isProduction) {
      return res.status(503).json({ success: false, message: 'Your message has not been saved because storage is reconnecting. Please try again shortly, or contact Sana by email.' });
    }

    // Temporary storage is only for local development.
    newMessage._id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    inMemoryMessages.unshift(newMessage);
    if (inMemoryMessages.length > MAX_IN_MEMORY_MESSAGES) {
      inMemoryMessages.length = MAX_IN_MEMORY_MESSAGES;
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      messageId: newMessage._id,
    });
  } catch (error) {
    console.error('submitMessage error:', error);
    return res.status(503).json({ success: false, message: 'Could not confirm that your message was saved. Please try again later or contact Sana by email.' });
  }
};

export const getMessages = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: messages.length, messages });
    }

    if (env.isProduction) return res.status(503).json({ success: false, message: 'Message storage is temporarily unavailable. Please retry.' });
    return res.json({ success: true, count: inMemoryMessages.length, messages: inMemoryMessages });
  } catch (error) {
    console.error('getMessages error:', error);
    return res.status(500).json({ success: false, message: 'Could not load contact messages.' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid message ID.' });
      }

      const deleted = await ContactMessage.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }
      return res.json({ success: true, message: 'Message deleted successfully.' });
    }

    if (env.isProduction) return res.status(503).json({ success: false, message: 'Message storage is temporarily unavailable. Nothing has been deleted.' });
    const initialLength = inMemoryMessages.length;
    inMemoryMessages = inMemoryMessages.filter((message) => message._id.toString() !== id);
    if (inMemoryMessages.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    return res.json({ success: true, message: 'Message deleted from storage.' });
  } catch (error) {
    console.error('deleteMessage error:', error);
    return res.status(500).json({ success: false, message: 'Could not delete the contact message.' });
  }
};

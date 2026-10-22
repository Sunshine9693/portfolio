import mongoose from 'mongoose';
import { ContactMessage } from '../models/ContactMessage.js';

let inMemoryMessages = [];

export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const newMessage = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'Portfolio Inquiry',
      message: message.trim(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const savedDoc = await ContactMessage.create(newMessage);
      return res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Your message has been received.',
        messageId: savedDoc._id
      });
    }

    // In-memory fallback
    newMessage._id = 'msg_' + Date.now();
    inMemoryMessages.unshift(newMessage);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      messageId: newMessage._id
    });
  } catch (error) {
    console.error('submitMessage error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit message. Please try again later.' });
  }
};

export const getMessages = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: messages.length, messages });
    }

    return res.json({ success: true, count: inMemoryMessages.length, messages: inMemoryMessages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      await ContactMessage.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Message deleted successfully.' });
    }

    inMemoryMessages = inMemoryMessages.filter(m => m._id.toString() !== id);
    return res.json({ success: true, message: 'Message deleted from storage.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

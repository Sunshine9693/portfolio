import { test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { submitMessage, getMessages, deleteMessage } from '../controllers/contactController.js';

const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
const inquiry = { name: ' QA Visitor ', email: ' QA@EXAMPLE.COM ', subject: '', message: ' A local automated contact-form test. ' };

test('contact validation, durable success, and production storage failures', async t => {
  const originalCreate = ContactMessage.create;
  const originalProduction = env.isProduction;
  const originalState = mongoose.connection.readyState;
  env.isProduction = true;
  try {
    await t.test('invalid input is rejected before any database write', async () => {
      ContactMessage.create = async () => { throw new Error('must not write invalid input'); };
      for (const body of [{}, { ...inquiry, email: 'invalid' }, { ...inquiry, message: 'short' }, { ...inquiry, name: { $gt: '' } }]) {
        const res = response(); await submitMessage({ body }, res);
        assert.equal(res.statusCode, 400); assert.equal(res.body.success, false);
      }
    });
    await t.test('success means the normalized inquiry was stored', async () => {
      mongoose.connection.readyState = 1;
      let stored;
      ContactMessage.create = async value => { stored = value; return { _id: 'local-test-id' }; };
      const res = response(); await submitMessage({ body: inquiry, ip: '127.0.0.1' }, res);
      assert.equal(res.statusCode, 201);
      assert.equal(stored.email, 'qa@example.com'); assert.equal(stored.name, 'QA Visitor');
      assert.equal(stored.subject, 'Portfolio Inquiry'); assert.equal(res.body.messageId, 'local-test-id');
    });
    await t.test('a failed write never returns a success acknowledgement', async () => {
      ContactMessage.create = async () => { throw new Error('Simulated disconnected storage'); };
      const res = response(); await submitMessage({ body: inquiry }, res);
      assert.equal(res.statusCode, 503); assert.equal(res.body.success, false);
    });
    await t.test('disconnected production storage cannot silently accept or hide inquiries', async () => {
      mongoose.connection.readyState = 0;
      for (const handler of [submitMessage, getMessages, deleteMessage]) {
        const res = response(); await handler({ body: inquiry, params: { id: 'test' } }, res);
        assert.equal(res.statusCode, 503); assert.equal(res.body.success, false);
      }
    });
  } finally { ContactMessage.create = originalCreate; env.isProduction = originalProduction; mongoose.connection.readyState = originalState; }
});

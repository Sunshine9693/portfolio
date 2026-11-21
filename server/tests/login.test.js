import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AdminUser } from '../models/AdminUser.js';
import { env } from '../config/env.js';
import { loginAdmin } from '../controllers/authController.js';

const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test('admin login accepts username capitalization without changing password rules', async (t) => {
  const originalFind = AdminUser.findOne;
  const originalProduction = env.isProduction;
  mongoose.connection.emit('connected');
  t.after(() => { AdminUser.findOne = originalFind; env.isProduction = originalProduction; mongoose.connection.emit('disconnected'); });
  const password = 'Correct Password 123!';
  const passwordHash = await bcrypt.hash(password, 4);
  const admin = { _id: '0123456789abcdef01234567', username: 'Sana', email: 'sana@example.com', tokenVersion: 3, matchPassword: (value) => bcrypt.compare(value, passwordHash), save: async () => {} };
  AdminUser.findOne = async (query) => query.$or.some((entry) => entry.email === admin.email || (entry.username && new RegExp(entry.username.$regex, entry.username.$options).test(admin.username))) ? admin : null;

  for (const username of ['Sana', 'sana', 'SANA', '  sAnA  ', 'SANA@EXAMPLE.COM', ' sana@example.com ']) {
    await t.test(`sign-in using ${username.trim()}`, async () => {
      const res = response();
      await loginAdmin({ body: { username, password } }, res);
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.admin.username, 'Sana');
      assert.equal(jwt.verify(res.body.token, env.jwtSecret).version, 3);
    });
  }
  await t.test('passwords remain case-sensitive and are not trimmed', async () => {
    for (const wrongPassword of [password.toLowerCase(), ` ${password}`]) {
      const res = response();
      await loginAdmin({ body: { username: 'sana', password: wrongPassword } }, res);
      assert.equal(res.statusCode, 401);
      assert.match(res.body.message, /password is incorrect/);
    }
  });
  await t.test('username patterns cannot match another account', async () => {
    const res = response();
    await loginAdmin({ body: { username: '.*', password } }, res);
    assert.equal(res.statusCode, 401);
    assert.doesNotMatch(res.body.message, /setup|no admin account/i);
  });
  await t.test('special characters in real usernames are treated literally', async () => {
    admin.username = 'Sana.+(test)';
    const res = response();
    await loginAdmin({ body: { username: 'sana.+(test)', password } }, res);
    assert.equal(res.statusCode, 200);
    admin.username = 'Sana';
  });
  await t.test('a production database outage is not reported as a bad password', async () => {
    env.isProduction = true;
    mongoose.connection.emit('disconnected');
    const res = response();
    await loginAdmin({ body: { username: 'sana', password } }, res);
    assert.equal(res.statusCode, 503);
    mongoose.connection.emit('connected');
  });
  await t.test('a failed account query is retryable', async () => {
    AdminUser.findOne = async () => { throw new Error('Simulated unavailable database'); };
    const res = response();
    await loginAdmin({ body: { username: 'sana', password } }, res);
    assert.equal(res.statusCode, 503);
  });
});

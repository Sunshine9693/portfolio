import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.js';
import { changeAdminPassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';

const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } });

test('password changes validate credentials and revoke older sessions', async (t) => {
  const originalFind = AdminUser.findById;
  mongoose.connection.emit('connected');
  t.after(() => { AdminUser.findById = originalFind; mongoose.connection.emit('disconnected'); });
  const id = '0123456789abcdef01234567';
  let saved = 0;
  const admin = { id, _id: id, tokenVersion: 0, matchPassword: async (value) => value === 'current-password', save: async () => { saved++; } };
  AdminUser.findById = () => ({ then: (resolve, reject) => Promise.resolve(admin).then(resolve, reject), select: async () => admin });
  const request = (currentPassword, newPassword) => ({ admin: { id }, body: { currentPassword, newPassword } });

  for (const [label, current, next] of [
    ['missing current password', '', 'new-password-long'],
    ['short password', 'current-password', 'short'],
    ['same password', 'current-password', 'current-password'],
    ['bcrypt byte limit', 'current-password', 'é'.repeat(37)],
    ['wrong current password', 'incorrect-password', 'new-password-long'],
  ]) {
    await t.test(label, async () => {
      const res = response();
      await changeAdminPassword(request(current, next), res);
      assert.equal(res.statusCode, 400);
      assert.equal(saved, 0);
    });
  }
  const res = response();
  await changeAdminPassword(request('current-password', 'new-password-long'), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(saved, 1);
  assert.equal(admin.password, 'new-password-long');
  const claims = jwt.verify(res.body.token, env.jwtSecret);
  assert.equal(claims.id, id);
  assert.equal(claims.version, 1);

  for (const [label, token, expected] of [
    ['old session rejected', jwt.sign({ id }, env.jwtSecret), false],
    ['new session accepted', res.body.token, true],
  ]) {
    await t.test(label, async () => {
      let accepted = false;
      const result = response();
      await protectAdmin({ headers: { authorization: `Bearer ${token}` } }, result, () => { accepted = true; });
      assert.equal(accepted, expected);
      if (!expected) assert.equal(result.statusCode, 401);
    });
  }
  await t.test('anonymous password changes require authentication', async () => {
    const result = response();
    await protectAdmin({ headers: {} }, result, () => assert.fail('Anonymous access allowed'));
    assert.equal(result.statusCode, 401);
  });
});

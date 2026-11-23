import { test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { PortfolioData } from '../models/PortfolioData.js';
import { env } from '../config/env.js';
import { getPublicData, updateSection } from '../controllers/contentController.js';

const response = () => ({ json(body) { this.body = body; return this; } });

test('public content excludes legacy phone numbers from database and cached responses', async () => {
  const originalFind = PortfolioData.findOne;
  const originalState = mongoose.connection.readyState;
  const originalProduction = env.isProduction;
  const doc = new PortfolioData({ socialLinks: { phone: 'private-test-number', email: 'public@example.test' } });
  doc.save = async () => {};
  PortfolioData.findOne = () => ({ sort: async () => doc });
  mongoose.connection.readyState = 1;
  env.isProduction = true;
  try {
    // Exercise a cached legacy record as well as the normal database response.
    await updateSection({ body: { section: 'socialLinks', data: doc.socialLinks.toObject() } }, response());
    for (const readyState of [1, 0]) {
      mongoose.connection.readyState = readyState;
      const res = response();
      await getPublicData({}, res);
      assert.equal(Object.hasOwn(res.body.data.socialLinks, 'phone'), false);
      assert.equal(res.body.data.socialLinks.email, 'public@example.test');
      assert.equal(doc.socialLinks.phone, 'private-test-number');
    }
  } finally {
    PortfolioData.findOne = originalFind;
    mongoose.connection.readyState = originalState;
    env.isProduction = originalProduction;
  }
});

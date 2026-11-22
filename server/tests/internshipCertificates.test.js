import { test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { PortfolioData } from '../models/PortfolioData.js';
import { updateSection, getPublicData } from '../controllers/contentController.js';
import { env } from '../config/env.js';

const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test('internship PDF and image attachments survive save and public read without changing existing details', async () => {
  const originalFind = PortfolioData.findOne;
  const originalState = mongoose.connection.readyState;
  const originalProduction = env.isProduction;
  const doc = new PortfolioData({ internships: [{ id: 'one', company: 'Company', role: 'Intern', highlights: ['Built an API'], technologies: ['Java'] }, { id: 'two', company: 'Other company' }] });
  let saved;
  doc.save = async () => {
    assert.equal(doc.validateSync(), undefined);
    saved = doc.toObject();
  };
  PortfolioData.findOne = () => ({ sort: async () => doc });
  mongoose.connection.readyState = 1;
  env.isProduction = true;
  try {
    for (const [type, extension] of [['application/pdf', 'pdf'], ['image/png', 'png']]) {
      const data = doc.internships.map(item => item.toObject());
      Object.assign(data[0], { certificateUrl: `/uploads/internship.${extension}`, certificateType: type, certificateName: `Internship certificate.${extension}` });
      const res = response();
      await updateSection({ body: { section: 'internships', data } }, res);
      assert.equal(res.body.success, true);
      assert.equal(saved.internships[0].certificateUrl, data[0].certificateUrl);
      assert.equal(res.body.data[0].certificateType, type);
      assert.deepEqual(res.body.data[0].highlights, ['Built an API']);
      assert.deepEqual(res.body.data[0].technologies, ['Java']);
      assert.equal(res.body.data[1].company, 'Other company');
      const publicResponse = response();
      await getPublicData({}, publicResponse);
      assert.equal(publicResponse.body.data.internships[0].certificateName, data[0].certificateName);
    }
    const data = doc.internships.map(item => item.toObject());
    Object.assign(data[0], { certificateUrl: '', certificateType: '', certificateName: '' });
    const res = response();
    await updateSection({ body: { section: 'internships', data } }, res);
    assert.equal(res.body.success, true);
    assert.equal(saved.internships[0].certificateUrl, '');
    assert.equal(saved.internships.length, 2);
  } finally {
    PortfolioData.findOne = originalFind;
    mongoose.connection.readyState = originalState;
    env.isProduction = originalProduction;
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import helmet from 'helmet';
import { setAssetHeaders } from '../services/assetHeaders.js';
import { portfolioOrigin } from '../config/cors.js';

test('public PDF embedding works only for the portfolio while other routes keep Helmet protections', async () => {
  const app = express();
  app.use(helmet());
  app.get('/certificate.pdf', (req, res) => {
    setAssetHeaders(res, 'application/pdf', 'My certificate.pdf');
    res.end('%PDF-1.4');
  });
  app.get('/photo.png', (req, res) => {
    setAssetHeaders(res, 'image/png', 'photo.png');
    res.end();
  });
  app.get('/api/private', (req, res) => res.json({ ok: true }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const pdf = await fetch(`${base}/certificate.pdf`);
    const policy = pdf.headers.get('content-security-policy');
    assert.equal(pdf.headers.get('x-frame-options'), null);
    assert.equal(policy.split(';').find(v => v.startsWith('frame-ancestors')), `frame-ancestors 'self' ${portfolioOrigin}`);
    assert.ok(policy.includes("script-src 'self'"));
    assert.ok(policy.includes("object-src 'self'"));
    assert.equal(pdf.headers.get('content-type'), 'application/pdf');
    assert.equal(pdf.headers.get('content-disposition'), "inline; filename*=UTF-8''My%20certificate.pdf");
    assert.equal(pdf.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
    assert.equal(await pdf.text(), '%PDF-1.4');
    for (const route of ['/photo.png', '/api/private']) {
      const response = await fetch(`${base}${route}`);
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
      assert.ok(response.headers.get('content-security-policy').includes("frame-ancestors 'self';"));
      assert.ok(!response.headers.get('content-security-policy').includes(portfolioOrigin));
      if (route === '/photo.png') assert.ok(response.headers.get('cache-control').includes('immutable'));
      await response.text();
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
});

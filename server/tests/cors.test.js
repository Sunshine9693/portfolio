import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import { createOriginMatcher, portfolioOrigin } from '../config/cors.js';

test('the actual portfolio origin remains allowed with stale environment configuration', () => {
  const match = createOriginMatcher('https://old-portfolio.vercel.app');
  assert.equal(match(portfolioOrigin), true);
  assert.equal(match('https://sanafatma-portfolio.vercel.app.attacker.example'), false);
  assert.equal(match('https://unrelated.vercel.app'), false);
  assert.equal(match('https://old-portfolio.vercel.app'), true);
  assert.equal(createOriginMatcher('https://preview-*.example.com/')('https://preview-123.example.com'), true);
});

test('browser login and bearer upload preflights receive the correct CORS response', async () => {
  const app = express();
  const match = createOriginMatcher('');
  app.use(cors({ origin: (origin, callback) => callback(null, match(origin)),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    for (const path of ['/api/auth/login', '/api/content/media/photo']) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { method: 'OPTIONS',
        headers: { Origin: portfolioOrigin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,authorization' } });
      assert.equal(response.status, 204);
      assert.equal(response.headers.get('access-control-allow-origin'), portfolioOrigin);
      assert.match(response.headers.get('access-control-allow-headers'), /Authorization/);
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
});

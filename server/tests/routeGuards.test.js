import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import contentRoutes from '../routes/contentRoutes.js';
import contactRoutes from '../routes/contactRoutes.js';

test('anonymous users cannot edit content, publish files or read private messages', async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/content', contentRoutes); app.use('/api/contact', contactRoutes);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    for (const [method, path] of [['PUT', '/api/content/section'], ['POST', '/api/content/upload'], ['POST', '/api/content/media/photo/publish'], ['POST', '/api/content/media/certificate/publish'], ['DELETE', '/api/content/upload/test.png'], ['GET', '/api/contact/messages']]) {
      const res = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { method });
      assert.equal(res.status, 401, `${method} ${path}`);
      assert.equal((await res.json()).success, false);
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
});

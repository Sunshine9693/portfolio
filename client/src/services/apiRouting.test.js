import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getApiBaseUrl, resolveApiAsset, PRODUCTION_API_ORIGIN } from './apiRouting.js';

test('production login, API requests and uploaded media use the same Render origin', () => {
  const base = getApiBaseUrl(false, 'https://outdated.example');
  assert.equal(base, PRODUCTION_API_ORIGIN);
  assert.equal(resolveApiAsset('/uploads/photo.jpg', base), `${base}/uploads/photo.jpg`);
  assert.equal(resolveApiAsset('/images/portrait.jpg', base), '/images/portrait.jpg');
  assert.equal(resolveApiAsset('https://example.com/image.png', base), 'https://example.com/image.png');
  assert.equal(getApiBaseUrl(true, ' http://localhost:5000/ '), 'http://localhost:5000');
});

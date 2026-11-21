import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateUpload, prepareUpload, uploadErrorMessage } from './uploadFile.js';
import { canRetryRequest } from './requestRecovery.js';

test('phone files with no MIME type get their known image type before multipart upload', async () => {
  const file = new File(['test'], 'photo.JPG', { type: '' });
  const prepared = await prepareUpload(file);
  assert.equal(prepared.type, 'image/jpeg');
  assert.equal(prepared.name, 'photo.JPG');
  assert.equal(await prepared.text(), 'test');
});
test('large photos may be prepared; oversized PDFs and unreadable formats get clear errors', () => {
  assert.doesNotThrow(() => validateUpload({ name: 'photo.jpg', type: 'image/jpeg', size: 8 * 1024 * 1024 }, true));
  assert.throws(() => validateUpload({ name: 'certificate.pdf', type: 'application/pdf', size: 5 * 1024 * 1024 }), /PDF is larger/);
  assert.throws(() => validateUpload({ name: 'photo.heic', type: 'image/heic', size: 100 }), /export as JPG/);
  assert.throws(() => validateUpload({ name: 'document.pdf', type: 'application/pdf', size: 100 }, true), /Choose a JPG/);
});
test('retry transient reads and login once, never upload writes or wrong passwords', () => {
  const error = (method, url, status) => ({ config: { method, url }, response: { status } });
  assert.equal(canRetryRequest(error('get', '/api/auth/me', 503)), true);
  assert.equal(canRetryRequest(error('post', '/api/auth/login', 502)), true);
  assert.equal(canRetryRequest(error('post', '/api/content/upload', 502)), false);
  assert.equal(canRetryRequest(error('put', '/api/content/section', 503)), false);
  assert.equal(canRetryRequest(error('post', '/api/auth/login', 401)), false);
  const attempted = error('get', '/api/auth/me', 503);
  attempted.config._recoveryAttempt = true;
  assert.equal(canRetryRequest(attempted), false);
  attempted.config._recoveryAttempt = false;
  attempted.config.signal = { aborted: true };
  assert.equal(canRetryRequest(attempted), false);
  assert.match(uploadErrorMessage({ response: { status: 413 } }), /too large/);
});

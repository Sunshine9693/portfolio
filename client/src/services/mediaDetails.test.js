import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareMediaDetails } from './mediaDetails.js';

test('photo publication does not silently stop when the optional title is empty', () => {
  const metadata = prepareMediaDetails('photo', { title: '', caption: 'My caption' }, { name: 'My_Photo.jpg' }, 'upload-id');
  assert.equal(metadata.title, 'My Photo');
  assert.equal(metadata.id, 'upload-id');
  assert.equal(metadata.caption, 'My caption');
});
test('certificate links without a scheme are normalized, unsafe links produce a visible error', () => {
  assert.equal(prepareMediaDetails('certificate', { title: '', credentialUrl: 'www.example.com/verify' }, { name: 'Course.pdf' }, 'id').credentialUrl, 'https://www.example.com/verify');
  assert.throws(() => prepareMediaDetails('certificate', { title: '', credentialUrl: 'javascript:alert(1)' }, { name: 'Course.pdf' }, 'id'), /must start/);
  assert.throws(() => prepareMediaDetails('photo', { title: '' }, null, 'id'), /Choose a photo/);
});

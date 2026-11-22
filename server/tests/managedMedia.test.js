import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMediaItem, appendMediaItem } from '../services/managedMedia.js';
import { PortfolioData } from '../models/PortfolioData.js';

const file = { filename: 'upload-123.png', originalname: 'My photo.png', mimetype: 'image/png' };
test('blank titles use the filename and saved media matches the real schema', () => {
  for (const kind of ['photo', 'certificate']) {
    const item = buildMediaItem(kind, { id: 'test-1', title: '' }, file);
    assert.equal(item.title, 'My photo');
    const doc = new PortfolioData({ [kind === 'photo' ? 'gallery' : 'certificates']: [item] });
    assert.equal(doc.validateSync(), undefined);
    assert.equal(kind === 'photo' ? item.url : item.fileUrl, '/uploads/upload-123.png');
  }
});
test('reject malformed metadata before saving an uploaded asset', () => {
  assert.throws(() => buildMediaItem('certificate', { credentialUrl: 'javascript:alert(1)' }, file), /must use/);
  assert.throws(() => buildMediaItem('photo', { title: { $gt: '' } }, file), /Invalid title/);
  assert.throws(() => buildMediaItem('photo', { id: '../../path' }, file), /identifier/);
});
test('concurrent additions append without replacing existing photos and retries reuse the same item', async () => {
  const saved = [{ id: 'original', title: 'Keep this photo' }];
  const model = {
    async findOneAndUpdate(query, update, options) {
      assert.equal(options.runValidators, true);
      assert.equal(update.$set, undefined);
      const item = update.$push.gallery;
      assert.equal(query['gallery.id'].$ne, item.id);
      if (saved.some(existing => existing.id === item.id)) return null;
      saved.push(item);
      return { gallery: [...saved] };
    },
    async findById() { return { gallery: [...saved] }; },
  };
  await Promise.all(['one', 'two'].map(id => appendMediaItem(model, 'portfolio', 'gallery', { id, title: id })));
  assert.deepEqual(saved.map(item => item.id), ['original', 'one', 'two']);
  assert.equal((await appendMediaItem(model, 'portfolio', 'gallery', { id: 'one' })).title, 'one');
  assert.equal(saved.length, 3);
});

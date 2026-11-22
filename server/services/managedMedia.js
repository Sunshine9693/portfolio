import path from 'node:path';
import { randomUUID } from 'node:crypto';

export function buildMediaItem(kind, metadata, file) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error('Invalid file details.');
  const text = (key, limit) => {
    if (metadata[key] != null && typeof metadata[key] !== 'string') throw new Error(`Invalid ${key}.`);
    const value = (metadata[key] || '').trim();
    if (value.length > limit) throw new Error(`${key} is too long (maximum ${limit} characters).`);
    return value;
  };
  const id = text('id', 100) || randomUUID();
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Invalid upload identifier.');
  const title = text('title', 160) || path.parse(file.originalname).name.slice(0, 160) || 'Untitled';
  const fileUrl = `/uploads/${file.filename}`;
  if (kind === 'photo') return { id, title, type: 'photo', url: fileUrl, caption: text('caption', 500), category: text('category', 80) };
  const credentialUrl = text('credentialUrl', 2000);
  if (credentialUrl) {
    let url;
    try { url = new URL(credentialUrl); } catch { throw new Error('Enter a complete credential link, such as https://example.com.'); }
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Credential links must use https:// or http://.');
  }
  return { id, title, issuer: text('issuer', 120), date: text('date', 80), description: text('description', 1000),
    credentialUrl, fileUrl, fileType: file.mimetype, verified: true };
}

// Append on the server instead of replacing an array from a stale browser tab.
export async function appendMediaItem(model, documentId, section, item) {
  const updated = await model.findOneAndUpdate(
    { _id: documentId, [`${section}.id`]: { $ne: item.id } },
    { $push: { [section]: item } },
    { new: true, runValidators: true }
  );
  if (updated) return updated[section].find(entry => entry.id === item.id);
  const latest = await model.findById(documentId);
  const existing = latest?.[section]?.find(entry => entry.id === item.id);
  if (!existing) throw new Error('The uploaded item could not be published. Please try again.');
  return existing;
}

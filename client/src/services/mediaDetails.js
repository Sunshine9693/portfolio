export function prepareMediaDetails(kind, draft, file, id) {
  if (!file) throw new Error(`Choose a ${kind === 'photo' ? 'photo' : 'certificate file'} first.`);
  const title = draft.title.trim() || file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim().slice(0, 160) || 'Untitled';
  let credentialUrl = draft.credentialUrl?.trim() || '';
  if (credentialUrl && !/^[a-z][a-z0-9+.-]*:/i.test(credentialUrl)) credentialUrl = `https://${credentialUrl}`;
  if (credentialUrl) {
    let url;
    try { url = new URL(credentialUrl); } catch { throw new Error('Enter a valid credential link, or leave that optional field empty.'); }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Credential links must start with https:// or http://.');
  }
  return { ...draft, id, title, ...(kind === 'certificate' ? { credentialUrl } : {}) };
}

const TOKEN_KEY = 'sana_admin_token';

// Some private browsing modes block storage. Sign-in can still use in-memory state.
export function readAdminToken(storage) {
  try { return (storage ?? globalThis.localStorage)?.getItem(TOKEN_KEY) || ''; }
  catch { return ''; }
}

export function saveAdminToken(token, storage) {
  try { (storage ?? globalThis.localStorage).setItem(TOKEN_KEY, token); return true; }
  catch { return false; }
}

export function clearAdminToken(storage) {
  try { (storage ?? globalThis.localStorage)?.removeItem(TOKEN_KEY); }
  catch { /* The in-memory session is cleared by AuthContext. */ }
}

export function isRejectedAdminSession(error) {
  const response = error?.response;
  return [401, 403].includes(response?.status) && response.data?.success === false;
}

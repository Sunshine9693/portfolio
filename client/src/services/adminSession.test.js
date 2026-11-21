import test from 'node:test';
import assert from 'node:assert/strict';
import { readAdminToken, saveAdminToken, clearAdminToken, isRejectedAdminSession } from './adminSession.js';

test('session storage round-trip and sign-out', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  assert.equal(readAdminToken(storage), '');
  assert.equal(saveAdminToken('example-token', storage), true);
  assert.equal(readAdminToken(storage), 'example-token');
  clearAdminToken(storage);
  assert.equal(readAdminToken(storage), '');
});

test('blocked browser storage cannot prevent an in-memory sign-in', () => {
  const blocked = () => { throw new Error('Storage unavailable'); };
  const storage = { getItem: blocked, setItem: blocked, removeItem: blocked };
  assert.equal(readAdminToken(storage), '');
  assert.equal(saveAdminToken('example-token', storage), false);
  assert.doesNotThrow(() => clearAdminToken(storage));
});

test('only an explicit API rejection clears the saved session', () => {
  assert.equal(isRejectedAdminSession({ response: { status: 401, data: { success: false } } }), true);
  assert.equal(isRejectedAdminSession({ response: { status: 403, data: { success: false } } }), true);
  for (const error of [new Error('Network error'), { code: 'ECONNABORTED' }, { response: { status: 503, data: { success: false } } }, { response: { status: 502, data: 'Bad gateway' } }, { response: { status: 401, data: '<html>Proxy error</html>' } }]) {
    assert.equal(isRejectedAdminSession(error), false);
  }
});

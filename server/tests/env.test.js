import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('production refuses startup without a configured JWT secret', () => {
  const moduleUrl = new URL('../config/env.js', import.meta.url).href;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(moduleUrl)})`], {
    env: { ...process.env, NODE_ENV: 'production', JWT_SECRET: '' }, encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.error, undefined);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /JWT_SECRET must be configured in production/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createConnectionRecovery } from '../services/connectionRecovery.js';

test('failed startup schedules recovery; concurrent requests share one attempt', async () => {
  let ready = false;
  let attempts = 0;
  const scheduled = [];
  const recovery = createConnectionRecovery({
    isReady: () => ready,
    connect: async () => { attempts++; if (attempts === 1) throw new Error('offline'); ready = true; },
    schedule: callback => { scheduled.push(callback); return { unref() {} }; },
  });
  assert.deepEqual(await Promise.all([recovery.ensure(), recovery.ensure()]), [false, false]);
  assert.equal(attempts, 1);
  assert.equal(scheduled.length, 1);
  scheduled.shift()();
  assert.equal(await recovery.ensure(), true);
  assert.equal(attempts, 2);
  assert.equal(await recovery.ensure(), true);
  assert.equal(attempts, 2);
  ready = false;
  recovery.retry(); recovery.retry();
  assert.equal(scheduled.length, 1);
  scheduled.shift()();
  assert.equal(await recovery.ensure(), true);
  assert.equal(attempts, 3);
});

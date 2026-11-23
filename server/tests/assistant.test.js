import { test } from 'node:test';
import assert from 'node:assert/strict';
import { env } from '../config/env.js';
import { chatWithAssistant } from '../controllers/aiController.js';

const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
test('assistant validates input and remains useful without an external provider', async () => {
  const keys = [env.openaiApiKey, env.geminiApiKey, env.openrouterApiKey];
  env.openaiApiKey = ''; env.geminiApiKey = ''; env.openrouterApiKey = '';
  try {
    for (const message of ['', ' ', {}, 'x'.repeat(501)]) {
      const res = response(); await chatWithAssistant({ body: { message } }, res);
      assert.equal(res.statusCode, 400);
    }
    for (const [message, link] of [['What projects has she built?', '#projects'], ['What technologies does she use?', '#skills'], ['How can I contact Sana?', '#contact']]) {
      const res = response(); await chatWithAssistant({ body: { message } }, res);
      assert.equal(res.body.success, true); assert.equal(res.body.sectionLink, link);
      assert.equal(res.body.isLiveLLM, false);
      assert.doesNotMatch(res.body.reply, /flagship/i);
      assert.doesNotMatch(res.body.reply, /\*\*Phone:|\b\d{10}\b/);
      assert.doesNotMatch(res.body.infoNotice, /API_KEY/);
    }
  } finally { [env.openaiApiKey, env.geminiApiKey, env.openrouterApiKey] = keys; }
});

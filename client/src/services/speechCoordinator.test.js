import { test } from 'node:test';
import assert from 'node:assert/strict';

test('narration and assistant speech never overlap; stale callbacks cannot stop the new speaker', async () => {
  const spoken = [];
  let cancellations = 0;
  globalThis.window = { speechSynthesis: {
    paused: false, speaking: false,
    getVoices: () => [{ name: 'Google UK English Female', lang: 'en-GB' }],
    speak(utterance) { spoken.push(utterance); this.speaking = true; utterance.onstart?.(); },
    cancel() { cancellations++; this.speaking = false; },
    pause() { this.paused = true; }, resume() { this.paused = false; },
  } };
  globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  try {
    const { speechCoordinator } = await import('./speechCoordinator.js');
    assert.equal(speechCoordinator.speak({ text: 'About Sana', source: 'about' }), true);
    speechCoordinator.pause(); assert.equal(window.speechSynthesis.paused, true);
    speechCoordinator.resume(); assert.equal(window.speechSynthesis.paused, false);
    assert.equal(speechCoordinator.speak({ text: 'Assistant reply', source: 'assistant' }), true);
    assert.equal(spoken.length, 2); assert.ok(cancellations >= 2);
    spoken[0].onend();
    assert.equal(speechCoordinator.currentSource, 'assistant');
    speechCoordinator.stop('about');
    assert.equal(speechCoordinator.currentSource, 'assistant');
    speechCoordinator.stop('assistant');
    assert.equal(speechCoordinator.currentSource, null);
    assert.equal(speechCoordinator.currentUtterance, null);
  } finally { delete globalThis.window; delete globalThis.SpeechSynthesisUtterance; }
});

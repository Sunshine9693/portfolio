// Global Speech Coordinator to ensure About Narrator and AI Assistant never speak simultaneously

class SpeechCoordinator {
  constructor() {
    this.currentSource = null; // 'about' | 'assistant' | null
    this.currentUtterance = null;
    this.listeners = new Set();
    this.femaleVoice = null;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  initVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const preferred = [
      'Microsoft Libby Online (Natural) - English (United Kingdom)',
      'Microsoft Sonia Online (Natural) - English (United Kingdom)',
      'Google UK English Female',
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Microsoft Susan - English (United Kingdom)',
      'Samantha',
      'Victoria',
      'Karen',
      'Moira',
      'Fiona'
    ];

    let found = null;
    for (const p of preferred) {
      found = voices.find(v => v.name.toLowerCase().includes(p.toLowerCase()));
      if (found) break;
    }

    if (!found) {
      found = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman')));
    }

    if (!found) {
      found = voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    this.femaleVoice = found;
  }

  getVoice() {
    if (!this.femaleVoice) this.initVoices();
    return this.femaleVoice;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    this.listeners.forEach(fn => fn(event));
  }

  speak({ text, source, onStart, onEnd, onBoundary, onError, rate = 0.98, pitch = 1.05 }) {
    if (!('speechSynthesis' in window)) return;

    // Immediately stop any active speech from any source
    this.stop();

    this.currentSource = source;
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const voice = this.getVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = (e) => {
      this.notify({ type: 'start', source });
      if (onStart) onStart(e);
    };

    utterance.onend = (e) => {
      this.currentSource = null;
      this.currentUtterance = null;
      this.notify({ type: 'end', source });
      if (onEnd) onEnd(e);
    };

    utterance.onerror = (e) => {
      this.currentSource = null;
      this.currentUtterance = null;
      this.notify({ type: 'error', source, error: e });
      if (onError) onError(e);
    };

    if (onBoundary) {
      utterance.onboundary = onBoundary;
    }

    window.speechSynthesis.speak(utterance);
  }

  stop(source) {
    if (!('speechSynthesis' in window)) return;
    if (this.currentSource) {
      const prevSource = this.currentSource;
      window.speechSynthesis.cancel();
      this.currentSource = null;
      this.currentUtterance = null;
      this.notify({ type: 'stop', source: prevSource });
    }
  }

  pause() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.notify({ type: 'pause', source: this.currentSource });
    }
  }

  resume() {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.notify({ type: 'resume', source: this.currentSource });
    }
  }
}

export const speechCoordinator = new SpeechCoordinator();

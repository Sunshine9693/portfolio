import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Volume2, VolumeX, Mic, MicOff, ArrowUpRight, Info } from 'lucide-react';
import api, { isApiCancel } from '../../services/api';
import { speechCoordinator } from '../../services/speechCoordinator';

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "Hello! I am Sana Fatma's AI Portfolio Assistant. Feel free to ask about her projects, technical skills, internships, or education at MANUU.",
  sectionLink: null,
  sectionName: null,
};

const PRESET_QUESTIONS = [
  'Tell me about Sana.',
  'What projects has she built?',
  'What technologies does she use?',
  'Tell me about her internships.',
  'How can I contact her?',
];

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
  const [notice, setNotice] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const isSendingRef = useRef(false);

  // Auto-scroll chat.
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, notice, isLoading]);

  // Subscribe to the shared speech coordinator.
  useEffect(() => {
    const unsubscribe = speechCoordinator.subscribe((event) => {
      if (event.source !== 'assistant') return;

      if (['end', 'stop', 'error'].includes(event.type)) {
        setSpeakingMessageIndex(null);
      }
    });

    return () => {
      unsubscribe();
      speechCoordinator.stop('assistant');
    };
  }, []);

  // Web Speech recognition setup for voice input.
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
      if (transcript) {
        setInput(transcript.slice(0, 500));
      } else {
        setNotice('No speech was detected. Please try again.');
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === 'no-speech' || event.error === 'aborted') return;

      setNotice(
        event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'Microphone access was blocked. Allow microphone permission in your browser to use voice input.'
          : 'Voice input could not start. Please type your question instead.'
      );
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // Recognition may already be stopped.
      }
      recognitionRef.current = null;
    };
  }, []);

  // Close the drawer with Escape when it is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;

      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition may already be stopped.
      }
      speechCoordinator.stop('assistant');
      setSpeakingMessageIndex(null);
      setIsListening(false);
      setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already be stopped.
    }
    setIsListening(false);
  };

  const handleClose = () => {
    stopListening();
    speechCoordinator.stop('assistant');
    setSpeakingMessageIndex(null);
    setIsOpen(false);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setNotice('Speech recognition is not supported in this browser. Please type your question instead.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    // Do not let the assistant's own speech get captured by the microphone.
    speechCoordinator.stop('assistant');
    setSpeakingMessageIndex(null);
    setNotice('');

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Recognition error:', error);
      setIsListening(false);
      setNotice('Voice input could not start. Please type your question instead.');
    }
  };

  const handleSendMessage = async (textToSend) => {
    if (isSendingRef.current) return;

    const query = (textToSend ?? input).trim();
    if (!query) return;

    if (query.length > 500) {
      setNotice('Please keep your question to 500 characters or fewer.');
      return;
    }

    isSendingRef.current = true;
    const userMessage = { role: 'user', text: query };
    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setIsLoading(true);
    setNotice('');
    stopListening();

    try {
      const res = await api.post('/api/ai/chat', { message: query });

      if (res.data?.success && typeof res.data.reply === 'string') {
        setMessages((previous) => [
          ...previous,
          {
            role: 'assistant',
            text: res.data.reply,
            sectionLink: res.data.sectionLink || null,
            sectionName: res.data.sectionName || null,
            infoNotice: res.data.infoNotice || '',
          },
        ]);

        if (res.data.infoNotice) setNotice(res.data.infoNotice);
      } else {
        setMessages((previous) => [
          ...previous,
          {
            role: 'assistant',
            text: 'I encountered a brief issue retrieving that detail. Please try asking again or explore the portfolio sections directly.',
          },
        ]);
        setNotice(res.data?.message || 'The assistant returned an unexpected response.');
      }
    } catch (error) {
      if (isApiCancel(error)) return;

      console.error('AI assistant error:', error);
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text:
            error.code === 'ECONNABORTED'
              ? 'The assistant took too long to respond. Please try again in a moment.'
              : 'The AI service is currently operating in offline mode. Please feel free to inspect the sections directly or reach out to Sana via the Contact form.',
        },
      ]);
      setNotice(
        error.response?.data?.message ||
          'The assistant could not be reached. You can still explore the portfolio sections directly.'
      );
    } finally {
      isSendingRef.current = false;
      setIsLoading(false);
    }
  };

  const speakText = (index, text) => {
    if (speakingMessageIndex === index) {
      speechCoordinator.stop('assistant');
      setSpeakingMessageIndex(null);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    const didStart = speechCoordinator.speak({
      text: cleanText,
      source: 'assistant',
      rate: 1.0,
      pitch: 1.05,
      onStart: () => setSpeakingMessageIndex(index),
      onEnd: () => setSpeakingMessageIndex(null),
      onError: () => {
        setSpeakingMessageIndex(null);
        setNotice('This reply could not be read aloud in your browser.');
      },
    });

    if (!didStart) {
      setNotice('This reply could not be read aloud in your browser.');
    }
  };

  const handleNavClick = (sectionLink) => {
    if (!sectionLink) return;
    const target = document.querySelector(sectionLink);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Modern Circular Launcher with soft cyan/violet glow */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn-primary p-4 rounded-full shadow-glow-cyan flex items-center gap-2 group transition-all duration-300 hover:scale-105"
          aria-label="Open AI Portfolio Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-midnight" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet animate-ping" />
          </div>
          <span className="hidden sm:inline font-mono-tech text-xs font-bold uppercase tracking-wider pr-1 text-midnight">
            AI Assistant
          </span>
        </button>
      )}

      {/* Expandable Chat Drawer with Midnight Theme */}
      {isOpen && (
        <div
          className="card-dev rounded-3xl shadow-2xl w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col overflow-hidden animate-fade-in relative text-left border-cyan/40"
          role="dialog"
          aria-label="AI Portfolio Assistant"
        >
          {/* Header */}
          <div className="bg-midnight-elevated/90 backdrop-blur-md p-4 border-b border-midnight-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-midnight-card border border-cyan/40 flex items-center justify-center text-cyan shadow-sm">
                <Bot className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h4 className="font-heading text-lg text-slate-main tracking-wide uppercase leading-tight">
                  AURA PORTFOLIO GUIDE
                </h4>
                <div className="flex items-center gap-1.5 font-mono-tech text-[10px] text-cyan">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
                  <span>Grounded in verified portfolio data</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-full text-slate-muted hover:text-slate-main hover:bg-white/5 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {notice && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] font-sans text-amber-100"
              >
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                <span className="flex-1">{notice}</span>
                <button
                  type="button"
                  onClick={() => setNotice('')}
                  className="shrink-0 text-amber-300/80 hover:text-amber-100"
                  aria-label="Dismiss assistant notice"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const isSpeaking = speakingMessageIndex === index;

              return (
                <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan to-indigo text-midnight font-medium rounded-br-none shadow-sm'
                        : 'bg-midnight-elevated border border-midnight-border text-slate-main/95 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Section link navigation button */}
                    {msg.sectionLink && (
                      <button
                        type="button"
                        onClick={() => handleNavClick(msg.sectionLink)}
                        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-midnight-card border border-cyan/40 text-[11px] font-mono-tech text-cyan font-bold hover:bg-cyan hover:text-midnight transition-colors"
                      >
                        <span>{msg.sectionName || 'Navigate to Section'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Speech button for assistant message */}
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakText(index, msg.text)}
                      aria-pressed={isSpeaking}
                      className="mt-1 flex items-center gap-1 text-[10px] font-mono-tech text-slate-muted hover:text-cyan transition-colors px-1"
                      title={isSpeaking ? 'Stop reading aloud' : 'Read aloud'}
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
                    </button>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-muted text-xs font-mono-tech p-2">
                <span className="w-2 h-2 rounded-full bg-cyan animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-violet animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px]">Consulting portfolio records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-midnight-border/60 flex gap-1.5 overflow-x-auto no-scrollbar">
            {PRESET_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
                className="shrink-0 text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-slate-muted hover:text-slate-main hover:border-cyan/40 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-midnight-surface border-t border-midnight-border flex items-center gap-2"
          >
            {/* Voice input toggle */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              aria-label={isListening ? 'Stop voice input' : 'Speak your question'}
              aria-pressed={isListening}
              title={isListening ? 'Listening... click to stop' : 'Speak your question'}
              className={`p-2.5 rounded-xl border transition-colors disabled:opacity-40 ${
                isListening
                  ? 'bg-cyan text-midnight border-cyan animate-pulse'
                  : 'bg-midnight-elevated border-midnight-border text-slate-muted hover:text-cyan'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything about Sana..."
              maxLength={500}
              autoComplete="off"
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-primary p-2.5 rounded-xl disabled:opacity-40 transition-opacity"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

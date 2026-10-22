import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, X, Send, Volume2, Mic, MicOff, ArrowUpRight, Sparkles } from 'lucide-react';
import { speechCoordinator } from '../../services/speechCoordinator';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am Sana Fatma's AI Portfolio Assistant. Feel free to ask about her projects, technical skills, internships, or education at MANUU.",
      sectionLink: null,
      sectionName: null
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Subscribe to speech coordinator
  useEffect(() => {
    const unsubscribe = speechCoordinator.subscribe((event) => {
      if (event.source !== 'assistant' || event.type === 'end' || event.type === 'stop') {
        setIsSpeaking(false);
      } else if (event.type === 'start' && event.source === 'assistant') {
        setIsSpeaking(true);
      }
    });

    return () => {
      unsubscribe();
      speechCoordinator.stop('assistant');
    };
  }, []);

  // Web Speech recognition setup for voice input
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Recognition error:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || query.trim().length === 0) return;

    const userMessage = { role: 'user', text: query.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorNotice(null);

    try {
      const res = await axios.post('/api/ai/chat', { message: query.trim() });
      if (res.data?.success) {
        const replyText = res.data.reply;
        const newMsg = {
          role: 'assistant',
          text: replyText,
          sectionLink: res.data.sectionLink,
          sectionName: res.data.sectionName,
          infoNotice: res.data.infoNotice
        };
        setMessages(prev => [...prev, newMsg]);

        if (res.data.infoNotice) {
          setErrorNotice(res.data.infoNotice);
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: "I encountered a brief issue retrieving that detail. Please try asking again or explore the portfolio sections directly."
          }
        ]);
      }
    } catch (err) {
      console.error('AI assistant error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "The AI service is currently operating in offline mode. Please feel free to inspect the sections directly or reach out to Sana via the Contact form."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if (isSpeaking) {
      speechCoordinator.stop('assistant');
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '');
    speechCoordinator.speak({
      text: cleanText,
      source: 'assistant',
      rate: 1.0,
      pitch: 1.05,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleNavClick = (sectionLink) => {
    if (!sectionLink) return;
    const target = document.querySelector(sectionLink);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const presetQuestions = [
    "Tell me about Sana.",
    "What projects has she built?",
    "What technologies does she use?",
    "Tell me about her internships.",
    "How can I contact her?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Modern Circular Launcher with soft cyan/violet glow */}
      {!isOpen && (
        <button
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
        <div className="card-dev rounded-3xl shadow-2xl w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col overflow-hidden animate-fade-in relative text-left border-cyan/40">
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
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-slate-muted hover:text-slate-main hover:bg-white/5 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan to-indigo text-midnight font-medium rounded-br-none shadow-sm'
                        : 'bg-midnight-elevated border border-midnight-border text-slate-main/95 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Section link navigation button */}
                    {msg.sectionLink && (
                      <button
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
                      onClick={() => speakText(msg.text)}
                      className="mt-1 flex items-center gap-1 text-[10px] font-mono-tech text-slate-muted hover:text-cyan transition-colors px-1"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isSpeaking ? 'Speaking...' : 'Read Aloud'}</span>
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
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="shrink-0 text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-slate-muted hover:text-slate-main hover:border-cyan/40 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-midnight-surface border-t border-midnight-border flex items-center gap-2"
          >
            {/* Voice input toggle */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Listening... click to stop' : 'Speak your question'}
              className={`p-2.5 rounded-xl border transition-colors ${
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
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Sana..."
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

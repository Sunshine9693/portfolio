import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Square, Volume2, Sparkles, Layers, Brain, Code, CheckCircle2 } from 'lucide-react';
import { FemaleAIAvatar } from './FemaleAIAvatar';
import { speechCoordinator } from '../../services/speechCoordinator';

let hasAttemptedIntroductionAutoplay = false;
const autoplayStatusKey = 'aura-introduction-autoplay-status';

const getStoredAutoplayStatus = () => {
  try {
    return window.sessionStorage.getItem(autoplayStatusKey);
  } catch {
    return null;
  }
};

const storeAutoplayStatus = (status) => {
  try {
    window.sessionStorage.setItem(autoplayStatusKey, status);
  } catch {
    // The in-memory guard still prevents duplicate attempts when storage is unavailable.
  }
};

export const About = ({ aboutData }) => {
  const [playbackState, setPlaybackState] = useState(() => {
    const previousStatus = getStoredAutoplayStatus();
    return previousStatus === 'completed' || previousStatus === 'stopped' ? previousStatus : 'idle';
  });
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);
  const [currentSentenceText, setCurrentSentenceText] = useState('');
  const [autoplayBlocked, setAutoplayBlocked] = useState(() =>
    ['attempted', 'blocked', 'started'].includes(getStoredAutoplayStatus())
  );
  const narrationRunRef = useRef(0);
  const autoplayTimerRef = useRef(null);

  const defaultNarration =
    "Hi! Let me introduce you to Sana Fatma. She is a Computer Science and Engineering undergraduate at Maulana Azad National Urdu University, graduating in 2027. Sana is passionate about web development, software engineering, and artificial intelligence. She has worked on projects including AURA, her personalized AI assistant, and SnapShoes, an e-commerce application. Through internships and personal projects, she continues to develop her programming, frontend, backend, and problem-solving skills. Explore her projects to discover what she is building, and feel free to connect with her about relevant opportunities.";

  const narrationScript = aboutData?.narrationScript || defaultNarration;

  const sentences = React.useMemo(() => {
    return narrationScript
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);
  }, [narrationScript]);

  // Subscribe to speech coordinator events
  useEffect(() => {
    const unsubscribe = speechCoordinator.subscribe((event) => {
      if (event.source !== 'about') {
        // If another source (like assistant) started, reset about state
        setPlaybackState('idle');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
      } else if (event.type === 'stop') {
        setPlaybackState('stopped');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
        storeAutoplayStatus('stopped');
      } else if (event.type === 'end') {
        setPlaybackState('completed');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
        storeAutoplayStatus('completed');
      } else if (event.type === 'start') {
        setPlaybackState('speaking');
      } else if (event.type === 'error') {
        setPlaybackState('idle');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
        setAutoplayBlocked(true);
        storeAutoplayStatus('blocked');
      } else if (event.type === 'pause') {
        setPlaybackState('paused');
      } else if (event.type === 'resume') {
        setPlaybackState('speaking');
      }
    });

    return () => {
      unsubscribe();
      window.clearTimeout(autoplayTimerRef.current);
      speechCoordinator.stop('about');
    };
  }, []);

  const startNarration = useCallback((autoplay = false) => {
    const runId = ++narrationRunRef.current;
    window.clearTimeout(autoplayTimerRef.current);
    setAutoplayBlocked(false);
    storeAutoplayStatus('attempted');

    if (!('speechSynthesis' in window)) {
      setPlaybackState('idle');
      setAutoplayBlocked(true);
      storeAutoplayStatus('blocked');
      return false;
    }

    let charOffset = 0;
    const sentenceOffsets = sentences.map((s) => {
      const start = narrationScript.indexOf(s, charOffset);
      charOffset = start + s.length;
      return { start, end: charOffset, text: s };
    });

    let started = false;
    if (autoplay) {
      autoplayTimerRef.current = window.setTimeout(() => {
        if (narrationRunRef.current !== runId || started) return;
        narrationRunRef.current += 1;
        speechCoordinator.stop('about');
        setPlaybackState('idle');
        setAutoplayBlocked(true);
        storeAutoplayStatus('blocked');
      }, 5000);
    }

    const didQueueSpeech = speechCoordinator.speak({
      text: narrationScript,
      source: 'about',
      rate: 0.96,
      pitch: 1.05,
      onStart: () => {
        if (narrationRunRef.current !== runId) return;
        started = true;
        window.clearTimeout(autoplayTimerRef.current);
        setPlaybackState('speaking');
        setAutoplayBlocked(false);
        storeAutoplayStatus('started');
        setActiveSentenceIndex(0);
        setCurrentSentenceText(sentences[0] || '');
      },
      onBoundary: (event) => {
        if (narrationRunRef.current !== runId) return;
        if (event.name === 'sentence' || event.name === 'word') {
          const current = sentenceOffsets.find(
            (range) => event.charIndex >= range.start && event.charIndex <= range.end
          );
          if (current) {
            setActiveSentenceIndex(sentenceOffsets.indexOf(current));
            setCurrentSentenceText(current.text);
          }
        }
      },
      onEnd: () => {
        if (narrationRunRef.current !== runId) return;
        window.clearTimeout(autoplayTimerRef.current);
        setPlaybackState('completed');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
        storeAutoplayStatus('completed');
      },
      onError: () => {
        if (narrationRunRef.current !== runId) return;
        window.clearTimeout(autoplayTimerRef.current);
        setPlaybackState('idle');
        setAutoplayBlocked(true);
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
        storeAutoplayStatus('blocked');
      }
    });

    if (!didQueueSpeech) {
      window.clearTimeout(autoplayTimerRef.current);
      setPlaybackState('idle');
      setAutoplayBlocked(true);
      storeAutoplayStatus('blocked');
      return false;
    }

    return true;
  }, [narrationScript, sentences]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const previousStatus = getStoredAutoplayStatus();
      if (hasAttemptedIntroductionAutoplay || previousStatus) {
        hasAttemptedIntroductionAutoplay = true;
        setAutoplayBlocked(['attempted', 'blocked', 'started'].includes(previousStatus));
        return;
      }
      hasAttemptedIntroductionAutoplay = true;
      storeAutoplayStatus('attempted');
      startNarration(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [startNarration]);

  const pauseNarration = () => {
    speechCoordinator.pause();
  };

  const resumeNarration = () => {
    speechCoordinator.resume();
  };

  const stopNarration = () => {
    narrationRunRef.current += 1;
    window.clearTimeout(autoplayTimerRef.current);
    speechCoordinator.stop('about');
    setPlaybackState('stopped');
    setActiveSentenceIndex(-1);
    setCurrentSentenceText('');
    storeAutoplayStatus('stopped');
  };

  const replayNarration = () => {
    startNarration();
  };

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-midnight-border bg-midnight-surface/50">
      {autoplayBlocked && playbackState === 'idle' && (
        <div
          aria-live="polite"
          className="fixed bottom-24 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-cyan/40 bg-midnight-card/95 p-3 shadow-xl backdrop-blur-md"
        >
          <span className="font-mono-tech text-[10px] text-slate-muted">Ready when you are</span>
          <button
            onClick={() => startNarration()}
            className="btn-primary shrink-0 px-3 py-2 rounded-xl text-[10px] font-mono-tech font-bold uppercase flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Introduction</span>
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-violet" />
            <span>Interactive Virtual Introduction</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
            MEET SANA FATMA
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-muted">
            Computer Science undergraduate at MANUU with a focus on web development, software engineering, and AI applications.
          </p>
        </div>

        {/* Main Grid: Left Avatar Guide Console, Right Written Bio & Highlighting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Left Column (5 cols): Animated AI Guide Character */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="card-dev rounded-3xl p-6 sm:p-8 w-full flex flex-col items-center justify-between border-cyan/30 shadow-card-dev-hover">
              {/* Virtual Guide Avatar */}
              <FemaleAIAvatar
                isSpeaking={playbackState === 'speaking'}
                isPaused={playbackState === 'paused'}
                currentSentenceText={currentSentenceText}
                autoplayBlocked={autoplayBlocked}
                playbackState={playbackState}
              />

              {/* Audio Controls Bar */}
              <div className="mt-6 w-full pt-6 border-t border-midnight-border flex flex-col items-center gap-3">
                <span className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider">
                  Audio Introduction Controls
                </span>

                <span role="status" className="font-mono-tech text-[10px] text-cyan uppercase tracking-wider">
                  {playbackState === 'speaking' ? 'Speaking' : playbackState === 'paused' ? 'Paused' : playbackState === 'stopped' ? 'Stopped' : playbackState === 'completed' ? 'Completed' : 'Ready'}
                </span>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {['idle', 'stopped', 'completed'].includes(playbackState) && (
                    <button
                      onClick={() => startNarration()}
                      aria-label={playbackState === 'completed' ? 'Replay Introduction' : 'Play Introduction'}
                      className="btn-primary px-6 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{playbackState === 'completed' ? 'Replay Introduction' : 'Play Introduction'}</span>
                    </button>
                  )}

                  {playbackState === 'speaking' && (
                    <button
                      onClick={pauseNarration}
                      className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 text-cyan border-cyan/50"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </button>
                  )}

                  {playbackState === 'paused' && (
                    <button
                      onClick={resumeNarration}
                      className="btn-primary px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Resume</span>
                    </button>
                  )}

                  {['speaking', 'paused'].includes(playbackState) && (
                    <>
                      <button
                        onClick={replayNarration}
                        className="p-2.5 rounded-xl border border-midnight-border bg-midnight-elevated text-slate-muted hover:text-slate-main transition-colors"
                        title="Replay from start"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={stopNarration}
                        aria-label="Stop Introduction"
                        className="p-2.5 rounded-xl border border-midnight-border bg-midnight-elevated text-slate-muted hover:text-rose-400 transition-colors"
                        title="Stop Introduction"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </button>
                    </>
                  )}
                </div>

                <div className="text-[11px] font-sans text-slate-muted text-center flex items-center gap-1.5 mt-1">
                  <Volume2 className="w-3.5 h-3.5 text-cyan" />
                  <span>Spoken via natural female English speech synthesis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Written Bio with Active Sentence Tracker */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-dev rounded-3xl p-6 sm:p-10 text-left relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-midnight-border text-xs font-mono-tech text-slate-muted">
                <span className="text-cyan font-bold uppercase tracking-wider">
                  About Sana Fatma
                </span>
                <span className="text-[11px] text-slate-muted">MANUU • B.Tech CSE 2027</span>
              </div>

              {/* Written Bio Header */}
              <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase mb-4">
                "CRAFTING ACCESSIBLE CODE & EXPLORING INTELLIGENT AI EXPERIENCES."
              </h3>

              {/* Dynamic Sentence Highlighting */}
              <div className="text-sm sm:text-base text-slate-main/90 leading-relaxed font-sans space-y-3">
                {sentences.map((sentence, idx) => {
                  const isActive = playbackState === 'speaking' && activeSentenceIndex === idx;
                  return (
                    <span
                      key={idx}
                      className={`inline-block mr-1.5 transition-all duration-300 rounded px-1.5 py-0.5 ${
                        isActive
                          ? 'sentence-active font-medium shadow-glow-cyan'
                          : ''
                      }`}
                    >
                      {sentence}{' '}
                    </span>
                  );
                })}
              </div>

              {/* Source verification footer */}
              <div className="mt-8 pt-4 border-t border-midnight-border/60 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs text-slate-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-accent" />
                  <span>Verified Resume Profile Information</span>
                </div>
                <span className="text-slate-muted/70">Editable via Admin Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Core Engineering Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-dev rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-midnight-elevated border border-cyan/30 flex items-center justify-center text-cyan">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-xl text-slate-main tracking-wide uppercase">
                FULL-STACK DEVELOPMENT
              </h4>
              <p className="font-sans text-xs sm:text-sm text-slate-muted leading-relaxed">
                Building responsive web interfaces with React.js, Tailwind CSS, and connecting RESTful Express services with MongoDB databases.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-midnight-border text-[11px] font-mono-tech text-cyan">
              React • Node • Express • Mongo
            </div>
          </div>

          <div className="card-dev rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-midnight-elevated border border-violet/30 flex items-center justify-center text-violet">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-xl text-slate-main tracking-wide uppercase">
                AI & CONVERSATIONAL UX
              </h4>
              <p className="font-sans text-xs sm:text-sm text-slate-muted leading-relaxed">
                Developing intelligent assistants like AURA with speech recognition, prompt grounding, notes, and productivity tooling.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-midnight-border text-[11px] font-mono-tech text-violet">
              LLM APIs • Speech APIs • Python
            </div>
          </div>

          <div className="card-dev rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-midnight-elevated border border-indigo/30 flex items-center justify-center text-indigo">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-xl text-slate-main tracking-wide uppercase">
                CORE PROBLEM SOLVING
              </h4>
              <p className="font-sans text-xs sm:text-sm text-slate-muted leading-relaxed">
                Solid foundation in Data Structures and Algorithms with C, C++, and object-oriented Java programming across three internships.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-midnight-border text-[11px] font-mono-tech text-indigo">
              Java OOP • Data Structures • C/C++
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Volume2,
  Sparkles,
  Layers,
  Brain,
  Code,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { FemaleAIAvatar } from './FemaleAIAvatar';
import { speechCoordinator } from '../../services/speechCoordinator';

const DEFAULT_BIO =
  "I'm Sana Fatma, a Computer Science and Engineering undergraduate passionate about building responsive web applications and exploring AI-powered experiences. Through personal projects, academic work, and three internships, I've been developing practical skills across frontend development, backend integration, databases, and Java programming. I enjoy turning ideas into functional products while continuously improving my problem-solving skills.";

const DEFAULT_NARRATION =
  'Hi! Let me introduce you to Sana Fatma. She is a Computer Science and Engineering undergraduate at Maulana Azad National Urdu University, graduating in 2027. Sana is passionate about web development, software engineering, and artificial intelligence. She has worked on projects including AURA, her personalized AI assistant, and SnapShoes, an e-commerce application. Through internships and personal projects, she continues to develop her programming, frontend, backend, and problem-solving skills. Explore her projects to discover what she is building, and feel free to connect with her about relevant opportunities.';

const DEFAULT_HIGHLIGHTS = [
  {
    title: 'Full-Stack Foundations',
    description:
      'Hands-on experience developing modular interfaces with React and connecting RESTful Express services with MongoDB.',
    icon: 'Layers',
  },
  {
    title: 'AI & Conversational UX',
    description:
      'Building voice-first AI assistants and LLM integrations grounded in practical task automation.',
    icon: 'Brain',
  },
  {
    title: 'Core Problem Solving',
    description:
      'Strong foundation in Data Structures and Algorithms with C, C++, and object-oriented Java development.',
    icon: 'Code',
  },
];

const HIGHLIGHT_ICONS = { Layers, Brain, Code };
const HIGHLIGHT_STYLES = [
  { wrapper: 'border-cyan/30', text: 'text-cyan' },
  { wrapper: 'border-violet/30', text: 'text-violet' },
  { wrapper: 'border-indigo/30', text: 'text-indigo-light' },
];

const safeText = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

export const About = ({ aboutData, narrationCommand, setIsNarratingGlobal }) => {
  const [playbackState, setPlaybackState] = useState('idle');
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);
  const [currentSentenceText, setCurrentSentenceText] = useState('');
  const [speechError, setSpeechError] = useState('');
  const narrationRunRef = useRef(0);
  const previousCommandRef = useRef(narrationCommand ?? 0);

  const narrationScript = safeText(aboutData?.narrationScript, DEFAULT_NARRATION);
  const bio = safeText(aboutData?.bio, DEFAULT_BIO);
  const subtitle = safeText(
    aboutData?.subtitle,
    'Bridging Frontend Craftsmanship with AI Innovation'
  );
  const title = safeText(aboutData?.title, 'ABOUT ME');

  const highlights = useMemo(() => {
    const configured = Array.isArray(aboutData?.highlights)
      ? aboutData.highlights.filter((highlight) => highlight && typeof highlight === 'object')
      : [];
    return configured.length > 0 ? configured : DEFAULT_HIGHLIGHTS;
  }, [aboutData?.highlights]);

  const sentences = useMemo(
    () => narrationScript.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.trim().length > 0),
    [narrationScript]
  );

  // Keep the navbar narration indicator in sync with the real playback state.
  useEffect(() => {
    setIsNarratingGlobal?.(playbackState === 'speaking');
  }, [playbackState, setIsNarratingGlobal]);

  useEffect(
    () => () => {
      setIsNarratingGlobal?.(false);
    },
    [setIsNarratingGlobal]
  );

  // Subscribe to coordinator events so the two speech features never overlap.
  useEffect(() => {
    const unsubscribe = speechCoordinator.subscribe((event) => {
      if (event.source !== 'about') return;

      if (event.type === 'stop') {
        setPlaybackState('stopped');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
      } else if (event.type === 'end') {
        setPlaybackState('completed');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
      } else if (event.type === 'start') {
        setPlaybackState('speaking');
      } else if (event.type === 'error') {
        setPlaybackState('idle');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
        setSpeechError('Audio narration could not start in this browser. You can still read the full introduction below.');
      } else if (event.type === 'pause') {
        setPlaybackState('paused');
      } else if (event.type === 'resume') {
        setPlaybackState('speaking');
      }
    });

    return () => {
      unsubscribe();
      speechCoordinator.stop('about');
    };
  }, []);

  const startNarration = useCallback(() => {
    const runId = ++narrationRunRef.current;
    setSpeechError('');

    if (!('speechSynthesis' in window)) {
      setPlaybackState('idle');
      setSpeechError('Speech synthesis is not supported in this browser. Please use a modern browser to listen.');
      return false;
    }

    let charOffset = 0;
    const sentenceOffsets = sentences.map((sentence) => {
      const foundIndex = narrationScript.indexOf(sentence, charOffset);
      const start = foundIndex >= 0 ? foundIndex : charOffset;
      charOffset = start + sentence.length;
      return { start, end: charOffset, text: sentence };
    });

    const didQueueSpeech = speechCoordinator.speak({
      text: narrationScript,
      source: 'about',
      rate: 0.96,
      pitch: 1.05,
      onStart: () => {
        if (narrationRunRef.current !== runId) return;
        setPlaybackState('speaking');
        setSpeechError('');
        setActiveSentenceIndex(0);
        setCurrentSentenceText(sentences[0] || '');
      },
      onBoundary: (event) => {
        if (narrationRunRef.current !== runId) return;
        if (event.name !== 'sentence' && event.name !== 'word') return;

        const current = sentenceOffsets.find(
          (range) => event.charIndex >= range.start && event.charIndex <= range.end
        );
        if (current) {
          setActiveSentenceIndex(sentenceOffsets.indexOf(current));
          setCurrentSentenceText(current.text);
        }
      },
      onEnd: () => {
        if (narrationRunRef.current !== runId) return;
        setPlaybackState('completed');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
      },
      onError: () => {
        if (narrationRunRef.current !== runId) return;
        setPlaybackState('idle');
        setActiveSentenceIndex(-1);
        setCurrentSentenceText('');
        setSpeechError('Audio narration was interrupted. Press Play Introduction to try again.');
      },
    });

    if (!didQueueSpeech) {
      setPlaybackState('idle');
      setSpeechError('Audio narration could not start in this browser. You can still read the full introduction below.');
      return false;
    }

    return true;
  }, [narrationScript, sentences]);

  const pauseNarration = () => {
    speechCoordinator.pause();
  };

  const resumeNarration = () => {
    speechCoordinator.resume();
  };

  const stopNarration = () => {
    narrationRunRef.current += 1;
    speechCoordinator.stop('about');
    setPlaybackState('stopped');
    setActiveSentenceIndex(-1);
    setCurrentSentenceText('');
  };

  const replayNarration = () => {
    startNarration();
  };

  // The navbar sends a command; About decides whether it should play, pause,
  // or resume based on the current narration state.
  useEffect(() => {
    if (narrationCommand === previousCommandRef.current) return;
    previousCommandRef.current = narrationCommand;

    if (playbackState === 'speaking') {
      speechCoordinator.pause();
    } else if (playbackState === 'paused') {
      speechCoordinator.resume();
    } else {
      startNarration();
    }
  }, [narrationCommand, playbackState, startNarration]);

  const isSpeaking = playbackState === 'speaking';

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-midnight-border bg-midnight-surface/50">
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-violet" />
            <span>{title} • Interactive Virtual Introduction</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
            MEET SANA FATMA
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-muted">
            {subtitle}
          </p>
        </div>

        {/* Main Grid: Left Avatar Guide Console, Right Written Bio & Highlighting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Left Column (5 cols): Animated AI Guide Character */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="card-dev rounded-3xl p-6 sm:p-8 w-full flex flex-col items-center justify-between border-cyan/30 shadow-card-dev-hover">
              <FemaleAIAvatar
                isSpeaking={isSpeaking}
                isPaused={playbackState === 'paused'}
                currentSentenceText={currentSentenceText}
                speechError={Boolean(speechError)}
                playbackState={playbackState}
              />

              {/* Audio Controls Bar */}
              <div className="mt-6 w-full pt-6 border-t border-midnight-border flex flex-col items-center gap-3">
                <span className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider">
                  Audio Introduction Controls
                </span>

                <span role="status" className="font-mono-tech text-[10px] text-cyan uppercase tracking-wider">
                  {playbackState === 'speaking'
                    ? 'Speaking'
                    : playbackState === 'paused'
                      ? 'Paused'
                      : playbackState === 'stopped'
                        ? 'Stopped'
                        : playbackState === 'completed'
                          ? 'Completed'
                          : 'Ready'}
                </span>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {['idle', 'stopped', 'completed'].includes(playbackState) && (
                    <button
                      onClick={startNarration}
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
                        aria-label="Replay introduction from start"
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

                {speechError && (
                  <div
                    role="alert"
                    className="mt-1 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-left text-[11px] font-sans text-amber-200"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{speechError}</span>
                  </div>
                )}

                <div className="text-[11px] font-sans text-slate-muted text-center flex items-center gap-1.5 mt-1">
                  <Volume2 className="w-3.5 h-3.5 text-cyan" />
                  <span>Spoken via browser speech synthesis • Press play whenever you are ready</span>
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

              <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase mb-4">
                "CRAFTING ACCESSIBLE CODE & EXPLORING INTELLIGENT AI EXPERIENCES."
              </h3>

              <p className="text-sm sm:text-base text-slate-main/90 leading-relaxed font-sans">
                {bio}
              </p>

              <div className="mt-7 pt-5 border-t border-midnight-border/70">
                <div className="mb-3 flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-slate-muted">
                  <Volume2 className="h-3.5 w-3.5 text-cyan" />
                  <span>Audio Narration Transcript</span>
                </div>

                <div className="text-sm sm:text-base text-slate-main/90 leading-relaxed font-sans space-y-3">
                  {sentences.map((sentence, index) => {
                    const isActive = isSpeaking && activeSentenceIndex === index;
                    return (
                      <span
                        key={`${sentence}-${index}`}
                        className={`inline-block mr-1.5 transition-all duration-300 rounded px-1.5 py-0.5 ${
                          isActive ? 'sentence-active font-medium shadow-glow-cyan' : ''
                        }`}
                      >
                        {sentence}{' '}
                      </span>
                    );
                  })}
                </div>
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
          {highlights.map((highlight, index) => {
            const Icon = HIGHLIGHT_ICONS[highlight.icon] || HIGHLIGHT_ICONS.Layers;
            const style = HIGHLIGHT_STYLES[index % HIGHLIGHT_STYLES.length];

            return (
              <div
                key={`${highlight.title || 'highlight'}-${index}`}
                className="card-dev rounded-2xl p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-midnight-elevated border ${style.wrapper} flex items-center justify-center ${style.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading text-xl text-slate-main tracking-wide uppercase">
                    {highlight.title || 'Core Highlight'}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-muted leading-relaxed">
                    {highlight.description || ''}
                  </p>
                </div>
                <div className={`pt-4 mt-4 border-t border-midnight-border text-[11px] font-mono-tech ${style.text}`}>
                  Highlight 0{index + 1} • Verified Profile
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

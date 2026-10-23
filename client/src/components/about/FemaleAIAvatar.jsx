import React from 'react';
import { Volume2, Sparkles, Bot } from 'lucide-react';

export const FemaleAIAvatar = ({ isSpeaking, isPaused, currentSentenceText, autoplayBlocked, playbackState }) => {
  const statusText = isSpeaking
    ? 'AURA Speaking'
    : isPaused
      ? 'Paused'
      : playbackState === 'completed'
        ? 'Introduction complete'
        : playbackState === 'stopped'
          ? 'Introduction stopped'
          : autoplayBlocked
            ? 'Tap to begin'
            : 'Ready to introduce';

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <div className="relative mb-4 max-w-xs sm:max-w-sm w-full animate-fade-in">
        <div className="relative p-3.5 sm:p-4 rounded-2xl bg-midnight-elevated/90 backdrop-blur-md border border-cyan/40 shadow-glow-cyan text-left">
          {/* Header in speech bubble */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-midnight-border text-[11px] font-mono-tech">
            <div className="flex items-center gap-1.5 text-cyan font-bold">
              <Bot className="w-3.5 h-3.5 text-violet" />
              <span>AURA — Virtual Guide</span>
            </div>
            {isSpeaking && (
              <div className="flex items-end gap-0.5 h-3.5 px-1">
                <span className="w-1 bg-cyan rounded-full wave-bar-1" />
                <span className="w-1 bg-violet rounded-full wave-bar-2" />
                <span className="w-1 bg-indigo rounded-full wave-bar-3" />
                <span className="w-1 bg-cyan rounded-full wave-bar-4" />
              </div>
            )}
            {isPaused && (
              <span className="text-amber-300 font-mono-tech text-[10px]">Paused</span>
            )}
            {!isSpeaking && !isPaused && (
              <span className="text-slate-muted text-[10px]">{statusText}</span>
            )}
          </div>

          {/* Speech text */}
          <p className="font-sans text-xs sm:text-sm text-slate-main leading-relaxed">
            {isSpeaking ? (
              <span className="text-cyan font-medium">
                "{currentSentenceText || 'Introducing Sana Fatma...'}"
              </span>
            ) : isPaused ? (
              <span className="text-slate-muted italic">
                Narration paused. Click Resume to continue listening.
              </span>
            ) : playbackState === 'completed' ? (
              <span className="text-slate-muted italic">
                Introduction complete. Replay it whenever you like.
              </span>
            ) : playbackState === 'stopped' ? (
              <span className="text-slate-muted italic">
                Introduction stopped. Press Play Introduction to listen again.
              </span>
            ) : autoplayBlocked ? (
              <span>
                Automatic audio didn't start. Tap <span className="text-violet font-semibold">Play Introduction</span> to hear Sana's background.
              </span>
            ) : (
              <span>
                "Hi! Let me introduce you to <strong className="text-cyan font-semibold">Sana</strong>. Her introduction will begin automatically when your browser allows."
              </span>
            )}
          </p>

          {/* Speech bubble pointer arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-midnight-elevated border-r border-b border-cyan/40 rotate-45" />
        </div>
      </div>

      {/* Stylized Vector Animated Avatar Container */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center animate-float">
        {/* Holographic Glowing Ambient Rings */}
        <div className={`absolute inset-0 rounded-full border border-cyan/30 holo-ring ${isSpeaking ? 'opacity-80 scale-105' : 'opacity-40'} transition-all duration-700`} />
        <div className={`absolute inset-3 rounded-full border border-violet/30 holo-ring [animation-direction:reverse] ${isSpeaking ? 'opacity-70' : 'opacity-30'}`} />
        <div className="absolute -inset-2 bg-gradient-to-tr from-cyan/20 via-violet/20 to-transparent rounded-full blur-xl pointer-events-none" />

        {/* Outer Circular Frame */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-midnight-card via-midnight-surface to-midnight border-2 border-cyan/50 shadow-card-dev-hover overflow-hidden flex items-center justify-center">
          {/* Futuristic Background grid inside circular portrait */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* SVG Character Illustration */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="skinGrad" x1="100" y1="50" x2="100" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDDFD0" />
                <stop offset="100%" stopColor="#F5C4B1" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="60" y1="20" x2="140" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="60%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="suitGrad" x1="100" y1="130" x2="100" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            {/* Back Hair */}
            <path
              d="M55 70 C50 120 55 170 80 185 C75 160 70 110 75 70 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M145 70 C150 120 145 170 120 185 C125 160 130 110 125 70 Z"
              fill="url(#hairGrad)"
            />

            {/* Tech Collar / Body */}
            <path
              d="M60 175 C60 145 75 135 100 135 C125 135 140 145 140 175 L155 200 L45 200 Z"
              fill="url(#suitGrad)"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            {/* Tech Lapel Accents */}
            <path d="M85 140 L100 165 L115 140" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="100" cy="155" r="3" fill="#A78BFA" />

            {/* Neck */}
            <rect x="88" y="115" width="24" height="24" rx="4" fill="url(#skinGrad)" />

            {/* Head Shape */}
            <ellipse cx="100" cy="85" rx="36" ry="42" fill="url(#skinGrad)" />

            {/* Hair Front Bangs / Styling */}
            <path
              d="M64 80 C60 50 80 35 100 35 C120 35 140 50 136 80 C130 65 118 60 100 60 C82 60 70 65 64 80 Z"
              fill="url(#hairGrad)"
            />
            {/* Elegant Side Strands */}
            <path
              d="M65 75 C65 105 72 125 76 130 C72 120 70 95 72 75 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M135 75 C135 105 128 125 124 130 C128 120 130 95 128 75 Z"
              fill="url(#hairGrad)"
            />

            {/* Futuristic Headset / Communicator */}
            <path
              d="M66 85 C66 70 70 50 100 48"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Glowing Earpiece */}
            <circle cx="66" cy="85" r="7" fill="#151D2E" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="66" cy="85" r="3.5" fill="#38BDF8" className={isSpeaking ? 'animate-ping' : ''} />
            {/* Small microphone boom */}
            <path d="M66 88 C70 98 80 105 88 105" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="89" cy="105" r="2.5" fill="#A78BFA" />

            {/* Eyebrows */}
            <path d="M78 72 C83 69 90 70 93 73" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M122 72 C117 69 110 70 107 73" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />

            {/* Eyes (Blinking Animation) */}
            <g className="animate-blink" style={{ transformOrigin: '100px 82px' }}>
              {/* Left Eye */}
              <ellipse cx="86" cy="82" rx="5" ry="6" fill="#0F172A" />
              <circle cx="84.5" cy="80.5" r="2" fill="#FFFFFF" />
              <circle cx="87.5" cy="83.5" r="1" fill="#38BDF8" />
              <path d="M80 79 C84 76 89 77 92 79" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

              {/* Right Eye */}
              <ellipse cx="114" cy="82" rx="5" ry="6" fill="#0F172A" />
              <circle cx="112.5" cy="80.5" r="2" fill="#FFFFFF" />
              <circle cx="115.5" cy="83.5" r="1" fill="#38BDF8" />
              <path d="M108 79 C111 76 116 77 120 79" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Soft Blush */}
            <ellipse cx="78" cy="92" rx="6" ry="3" fill="#F472B6" fillOpacity="0.25" />
            <ellipse cx="122" cy="92" rx="6" ry="3" fill="#F472B6" fillOpacity="0.25" />

            {/* Gentle Nose */}
            <path d="M99 87 C100 92 101 93 104 93" stroke="#DDA895" strokeWidth="1.5" strokeLinecap="round" />

            {/* Mouth: Changes dynamically based on isSpeaking */}
            {isSpeaking ? (
              /* Synchronized open speaking mouth */
              <path
                d="M93 103 C93 98 107 98 107 103 C107 108 93 108 93 103 Z"
                fill="#C2410C"
                className="mouth-speaking"
                stroke="#FB923C"
                strokeWidth="1.5"
              />
            ) : (
              /* Natural pleasant closed smile */
              <path
                d="M93 103 C96 107 104 107 107 103"
                stroke="#EA580C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>

        {/* Small Floating Status Badge */}
        <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-midnight-elevated border border-cyan/50 text-[10px] font-mono-tech text-cyan flex items-center gap-1.5 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan animate-ping' : 'bg-emerald-accent'}`} />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
};

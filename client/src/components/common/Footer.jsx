import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-midnight-border bg-midnight-dark py-12 px-4 sm:px-6 lg:px-8 text-left relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan via-indigo to-violet flex items-center justify-center font-heading text-2xl text-midnight font-bold shadow-glow-cyan">
            SF
          </div>
          <div>
            <h4 className="font-heading text-2xl text-slate-main tracking-wide uppercase leading-tight">
              SANA FATMA
            </h4>
            <p className="font-mono-tech text-xs text-slate-muted">
              B.Tech CSE • Full-Stack & AI Developer • MANUU
            </p>
          </div>
        </div>

        {/* Center note */}
        <div className="text-center md:text-left text-xs font-mono-tech text-slate-muted">
          <div>Built with React, Vite, Tailwind CSS & Node.js</div>
          <div className="mt-1 text-cyan/80">Midnight Developer Design System</div>
        </div>

        {/* Back to top & Admin Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="btn-secondary px-4 py-2 rounded-full text-xs font-mono-tech uppercase flex items-center gap-1.5 hover:border-cyan/50 text-slate-muted hover:text-cyan"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <button
            onClick={scrollToTop}
            className="btn-primary p-2.5 rounded-full shadow-glow-cyan transition-transform hover:-translate-y-1"
            title="Back to Top"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4 text-midnight" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-midnight-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-tech text-slate-muted/70 gap-2">
        <span>© {new Date().getFullYear()} Sana Fatma. All rights reserved.</span>
        <span className="text-cyan/70">Verified Portfolio Architecture</span>
      </div>
    </footer>
  );
};

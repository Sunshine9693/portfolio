import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Volume2, Shield, FileDown } from 'lucide-react';

export const Navbar = ({ onTriggerNarration, isNarrating }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'gallery', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Certificates', href: '#gallery', id: 'gallery' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-300 w-full max-w-7xl rounded-full px-4 sm:px-6 py-3 flex items-center justify-between ${
          isScrolled
            ? 'bg-midnight-surface/90 backdrop-blur-md border border-midnight-border shadow-card-dev'
            : 'bg-midnight-surface/60 backdrop-blur-sm border border-midnight-border/60'
        }`}
      >
        {/* Brand Monogram */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan via-indigo to-violet flex items-center justify-center font-heading text-xl text-midnight font-bold tracking-wider shadow-sm group-hover:shadow-glow-cyan transition-all duration-300">
            SF
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-heading tracking-[0.18em] text-lg text-slate-main leading-tight group-hover:text-cyan transition-colors uppercase">
              Sana Fatma
            </span>
            <span className="font-mono-tech text-[10px] text-slate-muted tracking-wider uppercase">
              B.Tech CSE • Developer
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        {isHome && (
          <ul className="hidden xl:flex items-center gap-2 xl:gap-3">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`px-2.5 py-2 rounded-full text-xs font-mono-tech uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan text-midnight font-bold shadow-glow-cyan'
                        : 'text-slate-muted hover:text-cyan hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Bio Quick Button */}
          {isHome && onTriggerNarration && (
            <button
              onClick={onTriggerNarration}
              title={isNarrating ? 'Pause Audio Narration' : 'Listen to Voice Intro'}
              className={`p-2.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 text-xs font-mono-tech ${
                isNarrating
                  ? 'border-cyan bg-cyan/20 text-cyan animate-pulse'
                  : 'border-midnight-border hover:border-cyan/50 text-slate-muted hover:text-cyan bg-midnight-elevated'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isNarrating ? 'text-cyan' : ''}`} />
              <span className="hidden md:inline text-[11px]">
                {isNarrating ? 'Playing' : 'Audio Bio'}
              </span>
            </button>
          )}

          {/* Download Resume Button */}
          <a
            href="/Sana_Fatma_Resume.pdf"
            download="Sana_Fatma_Resume.pdf"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-midnight-border bg-midnight-elevated hover:bg-cyan hover:text-midnight text-xs font-mono-tech text-slate-main transition-all duration-300"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>

          {/* Admin Portal Link */}
          <Link
            to="/admin"
            title="Admin Dashboard"
            className="p-2.5 rounded-full border border-midnight-border text-slate-muted hover:text-cyan hover:border-cyan/40 transition-colors bg-midnight-elevated"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Mobile menu toggle */}
          {isHome && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-full text-slate-main hover:text-cyan border border-midnight-border"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed inset-x-4 top-20 bg-midnight-surface/95 backdrop-blur-xl border border-midnight-border rounded-3xl p-6 shadow-2xl flex flex-col gap-4 xl:hidden z-50 max-h-[80vh] overflow-y-auto text-left">
          <div className="flex items-center justify-between pb-3 border-b border-midnight-border">
            <span className="font-heading tracking-widest text-lg text-slate-main">NAVIGATION</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-muted hover:text-slate-main"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-4 py-2.5 rounded-xl text-sm font-mono-tech uppercase tracking-wider transition-colors ${
                  activeSection === item.id
                    ? 'bg-cyan text-midnight font-bold'
                    : 'text-slate-muted hover:bg-white/5 hover:text-cyan'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-midnight-border flex flex-col gap-3">
            <a
              href="/Sana_Fatma_Resume.pdf"
              download="Sana_Fatma_Resume.pdf"
              className="btn-primary w-full py-3 rounded-xl text-center text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Download Verified Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

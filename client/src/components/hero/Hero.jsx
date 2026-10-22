import React, { useState, useEffect } from 'react';
import { ArrowUpRight, FileDown, Sparkles, GraduationCap, Briefcase, Code, Terminal } from 'lucide-react';

export const Hero = ({ heroData }) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const roles = [
    'Computer Science Student',
    'Web Developer',
    'AI Enthusiast'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [roles.length]);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const portraitSrc = heroData?.portraitUrl || '/images/sana_portrait.jpg';

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden ambient-glow-hero"
    >
      {/* Background Decorative Gradient Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-violet/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-card border border-midnight-border text-xs font-mono-tech text-slate-muted shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse" />
            <span>Available for opportunities</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-midnight-card border border-cyan/30 text-xs font-mono-tech text-cyan">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>B.Tech CSE • MANUU</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-midnight-card border border-violet/30 text-xs font-mono-tech text-violet">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Class of 2027</span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center text-left">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Software & AI Developer</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-mono-tech text-slate-muted font-normal">
                Sana Fatma
              </h2>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl text-slate-main tracking-[-0.04em] uppercase leading-[0.94] drop-shadow-sm">
              Building thoughtful software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-indigo to-violet">
                and exploring intelligent
              </span> <br />
              experiences.
            </h1>

            <div className="flex items-center gap-3 py-1 font-mono-tech">
              <span className="text-xs text-slate-muted uppercase tracking-widest">
                Role:
              </span>
              <div className="relative h-7 overflow-hidden inline-block min-w-[240px]">
                <div
                  key={currentRoleIndex}
                  className="text-base sm:text-lg text-cyan font-bold tracking-wide animate-fade-in"
                >
                  › {roles[currentRoleIndex]}
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-muted leading-relaxed max-w-2xl font-sans font-light">
              I'm Sana Fatma, a final-year Computer Science and Engineering student passionate about web development, software engineering, and AI-powered applications.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-primary px-7 py-3.5 rounded-full text-xs sm:text-sm font-mono-tech font-bold uppercase tracking-wider flex items-center gap-2 group shadow-glow-cyan"
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href={heroData?.resumeUrl || '/Sana_Fatma_Resume.pdf'}
                download="Sana_Fatma_Resume.pdf"
                className="btn-secondary px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono-tech font-medium uppercase tracking-wider flex items-center gap-2 group hover:text-cyan"
              >
                <FileDown className="w-4 h-4 text-cyan transition-transform group-hover:translate-y-0.5" />
                <span>Download Resume</span>
              </a>

              <button
                onClick={() => scrollToSection('contact')}
                className="btn-secondary px-6 py-3.5 rounded-full text-xs sm:text-sm font-mono-tech font-medium uppercase tracking-wider flex items-center gap-2 hover:border-cyan/60 hover:text-cyan"
              >
                <span>Contact Me</span>
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Portrait with Refined Developer Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Soft Blue/Violet Ambient Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan/30 via-indigo/25 to-violet/30 blur-xl opacity-60" />

              {/* Main Refined Portrait Card */}
              <div className="relative card-dev rounded-3xl p-4 sm:p-5 shadow-card-dev overflow-hidden group border-midnight-border">
                {/* Code-inspired Card Header */}
                <div className="flex items-center justify-between pb-3 px-1 border-b border-midnight-border mb-3 text-xs font-mono-tech text-slate-muted">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-muted font-mono-tech">
                    sana_fatma.profile.ts
                  </span>
                </div>

                {/* Portrait Photo Container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-midnight-elevated border border-midnight-border group-hover:border-cyan/40 transition-colors">
                  {!imgError ? (
                    <img
                      src={portraitSrc}
                      alt="Sana Fatma — Software Engineer & AI Developer"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan to-indigo flex items-center justify-center font-heading text-3xl text-midnight font-bold mb-3 shadow-glow-cyan">
                        SF
                      </div>
                      <h4 className="font-heading text-xl text-slate-main">SANA FATMA</h4>
                      <p className="font-mono-tech text-xs text-slate-muted">B.Tech CSE • MANUU</p>
                    </div>
                  )}

                  {/* Gradient Overlay at Bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-midnight-card via-midnight-card/80 to-transparent pointer-events-none" />

                  {/* Bottom Info Floating Ribbon */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-midnight-elevated/90 backdrop-blur-md border border-midnight-border flex items-center justify-between">
                    <div>
                      <div className="font-heading text-lg text-slate-main uppercase tracking-wide leading-none">
                        SANA FATMA
                      </div>
                      <div className="font-mono-tech text-[10px] text-cyan tracking-wider uppercase mt-1">
                        Maulana Azad National Urdu Univ.
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-tech text-xs text-emerald-accent font-bold">
                        CGPA 8.72
                      </div>
                      <div className="font-mono-tech text-[9px] text-slate-muted uppercase">
                        Class of 2027
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Snippet Under Portrait */}
                <div className="mt-3 p-2.5 rounded-xl bg-midnight-surface/80 border border-midnight-border/60 font-mono-tech text-[11px] text-slate-muted">
                  <span className="text-violet">const</span> <span className="text-cyan">developer</span> = &#123; role: <span className="text-emerald-accent">"Full-Stack & AI"</span>, grad: <span className="text-amber-300">2027</span> &#125;;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Stats Strip */}
        <div className="mt-14 pt-8 border-t border-midnight-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[
            { label: 'Academic CGPA', value: '8.72', sublabel: 'Consistent >8.5 at MANUU' },
            { label: 'Internships', value: '03', sublabel: 'Industry Experience' },
            { label: 'Documented Projects', value: '05', sublabel: 'AI & Web Solutions' },
            { label: 'Expected Year', value: '2027', sublabel: 'B.Tech CSE Graduate' },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="font-heading text-3xl sm:text-4xl text-slate-main tracking-tight">
                {stat.value}
              </div>
              <div className="font-mono-tech text-xs text-cyan uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
              <div className="font-sans text-[11px] text-slate-muted">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

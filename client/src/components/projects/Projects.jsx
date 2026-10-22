import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, ExternalLink, Mic, Cpu, Layers, CheckCircle2, Clock, X, Info } from 'lucide-react';
import { Github } from '../common/Icons';

export const Projects = ({ projectsData }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const defaultProjects = [
    {
      id: 'aura-voice-assistant',
      title: 'AURA — Personalized AI Voice Assistant',
      subtitle: 'Voice-Driven Full-Stack Productivity Assistant',
      type: 'Personal Project',
      status: 'Ongoing',
      category: 'Artificial Intelligence & Full-Stack',
      featured: true,
      description: 'A personalized AI voice assistant engineered with React.js, Node.js, Express.js, MongoDB, and LLM APIs for conversational task automation.',
      longDescription: 'AURA is Sana Fatma’s flagship exploration into AI voice interfaces. Designed as a full-stack web application, it supports natural conversational prompting, speech-to-text processing, notes, reminders, weather queries, and persistent user preference storage in MongoDB.',
      technologies: ['React.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'LLM API', 'Axios', 'Web Speech API'],
      features: [
        'Personalized natural language conversational interaction with AI',
        'Voice-based task interaction and speech synthesis playback',
        'Built-in modules for notes, reminders, weather updates, and information retrieval',
        'REST APIs connecting frontend and LLM backend via Axios',
        'MongoDB persistent database storage for user preferences and history',
        'Responsive interface built with React.js, Vite, and Tailwind CSS'
      ],
      plannedFeatures: [
        'Future multilingual voice translation module',
        'Direct calendar and email workflow integrations',
        'Smart-home device triggers via IoT webhooks'
      ],
      architecture: [
        'Frontend: React.js + Vite + Tailwind CSS with Web Speech recognition and synthesis',
        'Backend: Express.js REST server handling LLM prompt grounding and tool execution',
        'Database: MongoDB Atlas storing notes, reminders, and user state',
        'Client-Server: Secure Axios HTTP communication with JWT session tokens'
      ],
      githubUrl: 'https://github.com/sanathesunshine',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'snapshoes-ecommerce',
      title: 'SnapShoes — Full-Stack E-Commerce Web App',
      subtitle: 'Modern Footwear Catalog & Cart Experience',
      type: 'Personal Project',
      status: 'Ongoing',
      category: 'Frontend & E-Commerce',
      featured: false,
      description: 'Developing the frontend of a full-stack footwear e-commerce application with product catalogs, cart, wishlist, and login flows.',
      longDescription: 'SnapShoes offers an interactive online shopping portal with modern filtering, interactive product showcases, wishlist saving, and streamlined checkout UI flows.',
      technologies: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Responsive UI'],
      features: [
        'Dynamic product listing and detailed single-item views',
        'Interactive shopping cart calculation and wishlist toggling',
        'User login and account registration interface flows',
        'Fluid responsive layout spanning mobile, tablet, and widescreen monitors'
      ],
      plannedFeatures: [
        'Integrated payment gateway checkout',
        'Order tracking dashboard and inventory webhook hooks'
      ],
      architecture: [
        'Modular React components for catalog, cart, and authentication',
        'Local state management for cart synchronization across views',
        'Tailwind CSS design system with custom brand color tokens'
      ],
      githubUrl: 'https://github.com/sanathesunshine',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'hostel-allocation-system',
      title: 'Automated Hostel Allocation System',
      subtitle: 'Fairness-Driven Academic Group Solution',
      type: 'College Group Project',
      status: 'Completed',
      category: 'Database & Systems',
      featured: false,
      description: 'A database-driven allocation system replacing manual room assignments with automated constraint-based allocation logic.',
      longDescription: 'Developed collaboratively at MANUU, this application automates the university hostel allotment workflow, providing a student application portal and an administrative dashboard.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Database Integration', 'Algorithmic Allocation Logic'],
      features: [
        'Student application workflow with academic verification checks',
        'Comprehensive administrative management dashboard for seat allotment',
        'Frontend and database integration automating seat assignment',
        'Constraint-based allocation logic designed to maintain transparency and fairness'
      ],
      plannedFeatures: [
        'Automated SMS notifications for selected room allocations'
      ],
      architecture: [
        'Frontend UI for student applications and admin status review',
        'Relational database schema storing student criteria, room capacity, and quotas',
        'Deterministic rule engine prioritizing allocations according to college guidelines'
      ],
      githubUrl: 'https://github.com/sanathesunshine',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'task-management-system',
      title: 'Intelligent Task Management System',
      subtitle: 'Modular To-Do & Productivity Application',
      type: 'Personal Project',
      status: 'Completed',
      category: 'Web Application',
      featured: false,
      description: 'A streamlined task management web application with dynamic priority sorting, real-time DOM updates, and browser local storage persistence.',
      longDescription: 'Built with pure vanilla JavaScript to demonstrate strong core DOM manipulation and modular programming without heavy framework overhead.',
      technologies: ['Vanilla JavaScript (ES6+)', 'HTML5', 'CSS3', 'Local Storage API'],
      features: [
        'Dynamic task prioritization (Urgent, High, Normal)',
        'Instant real-time UI updates with zero page reloads',
        'Persistent state stored securely in browser LocalStorage',
        'Modular, maintainable code architecture with decoupled modules'
      ],
      plannedFeatures: [
        'Custom task category tags and deadline notifications'
      ],
      architecture: [
        'Modular JS pattern separating Data Store, UI Renderer, and Event Listeners',
        'LocalStorage synchronization hook on every create, edit, or delete action'
      ],
      githubUrl: 'https://github.com/sanathesunshine',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'music-player-spotify-clone',
      title: 'User Interaction-Based Music Player',
      subtitle: 'Audio Interface & Spotify Clone',
      type: 'Personal Project',
      status: 'Completed',
      category: 'Audio & Interactive UI',
      featured: false,
      description: 'An interactive web music player featuring a custom seek bar, playlist controls, and real-time audio playback feedback.',
      longDescription: 'Engineered to study ergonomic user interaction patterns and audio DOM events, implementing smooth scrub bars, volume controls, and track queues.',
      technologies: ['HTML5 Audio API', 'CSS3 Animations', 'JavaScript ES6+', 'Event Handling'],
      features: [
        'Custom interactive seek bar with smooth scrubbing and time stamps',
        'Dynamic playlist management and track queueing',
        'Real-time audio feedback, playing states, and volume controls',
        'Responsive navigation and playback controls for mobile devices'
      ],
      plannedFeatures: [
        'Audio visualizer canvas frequencies and lyric synchronization'
      ],
      architecture: [
        'HTML5 Audio API event listeners (timeupdate, loadedmetadata, ended)',
        'CSS transition timeline with dynamic width calculations'
      ],
      githubUrl: 'https://github.com/sanathesunshine',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    }
  ];

  const projects = projectsData && projectsData.length > 0 ? projectsData : defaultProjects;
  const auraProject = projects.find(p => p.featured || p.id === 'aura-voice-assistant') || projects[0];
  const gridProjects = projects.filter(p => p.id !== auraProject.id);

  const filterOptions = ['All', 'Personal Project', 'College Group Project', 'Ongoing', 'Completed'];

  const filteredGridProjects = gridProjects.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Personal Project' || activeFilter === 'College Group Project') {
      return p.type === activeFilter;
    }
    if (activeFilter === 'Ongoing' || activeFilter === 'Completed') {
      return p.status === activeFilter;
    }
    return true;
  });

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-midnight-border bg-midnight-surface/30">
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-violet" />
              <span>Engineering Portfolio</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
              FEATURED PROJECTS
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-muted">
              Documented projects spanning conversational AI systems, e-commerce, and algorithmic allocation.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono-tech uppercase tracking-wider transition-all ${
                  activeFilter === filter
                    ? 'bg-cyan text-midnight font-bold shadow-glow-cyan'
                    : 'bg-midnight-elevated border border-midnight-border text-slate-muted hover:text-cyan'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 1. HERO SPOTLIGHT CARD: AURA PERSONALIZED AI VOICE ASSISTANT */}
        <div className="mb-12">
          <div className="card-ai-glow rounded-3xl p-6 sm:p-10 shadow-card-dev-hover overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column (7 cols): Content & Highlights */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan/15 border border-cyan/40 text-cyan text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-violet" /> Flagship AI Project
                  </span>
                  <span className="px-3 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-slate-muted text-xs font-mono-tech uppercase">
                    {auraProject.type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-midnight-elevated border border-emerald-500/30 text-emerald-accent text-xs font-mono-tech uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {auraProject.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-3xl sm:text-5xl text-slate-main tracking-tight uppercase leading-none">
                    {auraProject.title}
                  </h3>
                  <p className="font-mono-tech text-xs sm:text-sm text-cyan uppercase tracking-wider mt-1.5">
                    {auraProject.subtitle}
                  </p>
                </div>

                <p className="font-sans text-sm sm:text-base text-slate-muted leading-relaxed">
                  {auraProject.longDescription}
                </p>

                {/* Verified Resume Features */}
                <div className="space-y-2 pt-1">
                  <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan" /> Verified Core Capabilities:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-muted">
                    {(auraProject.features || []).slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-midnight-elevated/70 p-2.5 rounded-xl border border-midnight-border/70">
                        <span className="text-cyan font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Future Possibilities Note */}
                <div className="p-3 rounded-xl bg-midnight/60 border border-midnight-border flex items-start gap-2.5 text-xs font-sans text-slate-muted">
                  <Info className="w-4 h-4 text-violet shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-main font-mono-tech">Future Scope (Planned):</strong>{' '}
                    {(auraProject.plannedFeatures || []).join(', ')}.
                  </span>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {auraProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-xs font-mono-tech text-slate-main hover:border-cyan/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedProject(auraProject)}
                    className="btn-primary px-6 py-2.5 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan"
                  >
                    <span>Inspect Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {auraProject.githubUrl && (
                    <a
                      href={auraProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-5 py-2.5 rounded-full text-xs font-mono-tech uppercase tracking-wider flex items-center gap-2 hover:text-cyan"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column (5 cols): Architecture Visualizer */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="bg-midnight/90 rounded-2xl border border-midnight-border p-6 space-y-6 shadow-inner">
                  <div className="flex items-center justify-between border-b border-midnight-border pb-3 text-xs font-mono-tech text-slate-muted">
                    <span className="flex items-center gap-2 text-cyan">
                      <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                      AURA Architecture
                    </span>
                    <span className="text-[10px] uppercase">Node • Express • Mongo</span>
                  </div>

                  {/* Equalizer Frequency Visualizer */}
                  <div className="bg-midnight-elevated/70 rounded-xl p-4 border border-midnight-border flex flex-col items-center justify-center space-y-3">
                    <div className="flex items-end justify-center gap-1.5 h-16 w-full px-4">
                      {[40, 65, 85, 30, 95, 55, 75, 45, 90, 60, 35, 80, 50, 70, 40].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-1.5 rounded-full ${
                            i % 3 === 0
                              ? 'bg-cyan animate-pulse'
                              : i % 2 === 0
                              ? 'bg-violet'
                              : 'bg-indigo'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono-tech text-[10px] text-slate-muted uppercase tracking-widest">
                      Voice Signal Processing & Prompt Pipeline
                    </span>
                  </div>

                  {/* Architecture Stack */}
                  <div className="space-y-2 text-xs font-mono-tech">
                    <div className="p-2.5 rounded-lg bg-midnight-card border border-midnight-border flex justify-between items-center">
                      <span className="text-slate-main">1. UI & Speech Engine</span>
                      <span className="text-cyan">React + Vite + Speech API</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-midnight-card border border-midnight-border flex justify-between items-center">
                      <span className="text-slate-main">2. API Router & Intelligence</span>
                      <span className="text-violet">Express.js + LLM API</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-midnight-card border border-midnight-border flex justify-between items-center">
                      <span className="text-slate-main">3. Persistent State</span>
                      <span className="text-indigo">MongoDB Atlas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. GRID PROJECTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGridProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              className="card-dev rounded-3xl p-6 sm:p-7 flex flex-col justify-between group text-left"
            >
              <div>
                {/* Header status */}
                <div className="flex items-center justify-between pb-3 border-b border-midnight-border mb-4 text-xs font-mono-tech">
                  <span className="text-cyan uppercase tracking-wider font-semibold">
                    {project.type}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      project.status === 'Ongoing'
                        ? 'bg-cyan/15 text-cyan border border-cyan/30'
                        : 'bg-midnight-elevated text-slate-muted border border-midnight-border'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase leading-tight mb-1.5 group-hover:text-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider mb-4">
                  {project.subtitle}
                </p>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-slate-muted leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Features Snippet */}
                <div className="space-y-1.5 mb-6">
                  <span className="font-mono-tech text-[11px] text-slate-main uppercase tracking-wider font-semibold">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-1 text-xs font-sans text-slate-muted">
                    {(project.features || []).slice(0, 3).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5">
                        <span className="text-cyan font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Tech Chips & Action Button */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-5 pt-4 border-t border-midnight-border">
                  {project.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-slate-main"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono-tech text-slate-main group-hover:text-cyan uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Case Details</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-cyan hover:border-cyan/40 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative card-dev rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left space-y-6 border-cyan/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-midnight-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-tech text-xs text-cyan uppercase font-bold">
                    {selectedProject.type}
                  </span>
                  <span className="text-slate-muted text-xs">•</span>
                  <span className="font-mono-tech text-xs text-slate-main uppercase">
                    Status: {selectedProject.status}
                  </span>
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl text-slate-main tracking-wide uppercase leading-tight">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-slate-main hover:border-cyan/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="font-sans text-sm sm:text-base text-slate-muted leading-relaxed">
              {selectedProject.longDescription || selectedProject.description}
            </p>

            {/* Architecture Details if present */}
            {selectedProject.architecture && selectedProject.architecture.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-bold">
                  System Architecture
                </span>
                <div className="space-y-2">
                  {selectedProject.architecture.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-midnight-elevated border border-midnight-border text-xs font-mono-tech text-slate-muted flex items-center gap-2">
                      <span className="text-cyan font-bold">›</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features List */}
            <div className="space-y-2">
              <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-bold">
                Documented Features & Capabilities
              </span>
              <ul className="space-y-2">
                {(selectedProject.features || []).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-slate-muted">
                    <CheckCircle2 className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Planned Features if any */}
            {selectedProject.plannedFeatures && selectedProject.plannedFeatures.length > 0 && (
              <div className="p-4 rounded-xl bg-midnight border border-midnight-border text-xs font-sans text-slate-muted">
                <span className="font-mono-tech text-slate-main font-bold block mb-1">
                  Future Planned Possibilities:
                </span>
                {selectedProject.plannedFeatures.join(' • ')}
              </div>
            )}

            {/* Technologies */}
            <div className="space-y-2 pt-2">
              <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-bold">
                Technology Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-xs font-mono-tech text-slate-main"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer Links */}
            <div className="pt-4 border-t border-midnight-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-mono-tech uppercase flex items-center gap-2 hover:text-cyan"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="btn-secondary px-5 py-2 rounded-xl text-xs font-mono-tech uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import { useState } from 'react';
import { ExternalLink, CheckCircle2, Clock, X } from 'lucide-react';
import { Github } from '../common/Icons';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';
import { withProjectStory } from '../../data/projectStories';
import { ProjectStory } from './ProjectStory';
import { ProjectScreenshot } from './ProjectScreenshot';

export const Projects = ({ projectsData }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const dialogRef = useDialogBehavior(Boolean(selectedProject), () => setSelectedProject(null));

  const defaultProjects = [
    {
      id: 'aura-voice-assistant',
      title: 'AURA — Personalized AI Voice Assistant',
      subtitle: 'Voice assistant with React and Node.js',
      type: 'Personal Project',
      status: 'Ongoing',
      category: 'Artificial Intelligence & Full-Stack',
      featured: true,
      description: "A voice assistant for spoken questions, notes, reminders, and weather updates.",
      longDescription: "I built AURA to handle spoken requests, save notes and reminders, and answer questions. It connects a React interface to an Express backend, language model APIs, and MongoDB.",
      technologies: ['React.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'LLM API', 'Axios', 'Web Speech API'],
      features: [
        "Spoken questions and responses",
        "Notes, reminders, and weather updates",
        "React frontend connected to Express APIs",
        "Saved preferences and conversation history",
        "MongoDB storage",
        "Responsive React interface"
      ],
      plannedFeatures: [
        "Multilingual voice support",
        "Email and calendar integration",
        "Smart-home controls"
      ],
      architecture: [
        "React handles voice input and displays responses.",
        "Express sends requests to the language model API.",
        "MongoDB stores notes, reminders, and preferences.",
        "Axios connects the frontend to the backend."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'snapshoes-ecommerce',
      title: 'SnapShoes — Full-Stack E-Commerce Web App',
      subtitle: 'Footwear shopping application',
      type: 'Personal Project',
      status: 'Ongoing',
      category: 'Frontend & E-Commerce',
      featured: false,
      description: "I'm building a shoe-shopping interface with product listings, a cart, a wishlist, and sign-in pages.",
      longDescription: "SnapShoes is an ongoing React project. My focus is the frontend: browsing and filtering products, managing a cart and wishlist, and building the account and checkout screens.",
      technologies: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Responsive UI'],
      features: [
        "Product listings and detail pages",
        "Shopping cart and wishlist",
        "Sign-in and registration screens",
        "Responsive layouts for phones and desktops"
      ],
      plannedFeatures: [
        "Payment integration",
        "Order tracking and inventory updates"
      ],
      architecture: [
        "React components for products, cart, and account screens.",
        "Shared state keeps the cart in sync across pages.",
        "Tailwind CSS handles the responsive layouts."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'hostel-allocation-system',
      title: 'Automated Hostel Allocation System',
      subtitle: 'Academic group project',
      type: 'College Group Project',
      status: 'Completed',
      category: 'Database & Systems',
      featured: false,
      description: "A group project that assigns hostel rooms using student applications, available capacity, and allocation rules.",
      longDescription: "Built with a team at MANUU, this project brings student applications and hostel room allocation into one system. Students can apply for rooms, and administrators can review and manage allotments.",
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Database Integration', 'Algorithmic Allocation Logic'],
      features: [
        "Student applications and eligibility checks",
        "Dashboard for room allotments",
        "Connected application forms and database",
        "Room assignments based on allocation rules"
      ],
      plannedFeatures: [
        "SMS notifications for room assignments"
      ],
      architecture: [
        "Students apply through a web form.",
        "A database stores applications and room availability.",
        "Allocation rules determine room assignments."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'task-management-system',
      title: 'Intelligent Task Management System',
      subtitle: "Task list with priorities",
      type: 'Personal Project',
      status: 'Completed',
      category: 'Web Application',
      featured: false,
      description: "A JavaScript task manager that sorts tasks by priority and saves them in the browser.",
      longDescription: "I built this task manager with JavaScript, HTML, and CSS to practise DOM updates and local storage. Tasks can be organised by priority and remain saved after the page is closed.",
      technologies: ['Vanilla JavaScript (ES6+)', 'HTML5', 'CSS3', 'Local Storage API'],
      features: [
        "Urgent, high, and normal priorities",
        "Updates without reloading the page",
        "Tasks saved in browser local storage",
        "Separate code for data, display, and events"
      ],
      plannedFeatures: [
        "Task categories and deadline reminders"
      ],
      architecture: [
        "JavaScript handles tasks, page updates, and user actions.",
        "Local storage saves changes when tasks are added, edited, or removed."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'music-player-spotify-clone',
      title: 'User Interaction-Based Music Player',
      subtitle: "Web music player",
      type: 'Personal Project',
      status: 'Completed',
      category: 'Audio & Interactive UI',
      featured: false,
      description: "A browser music player with playlists, track seeking, and volume controls.",
      longDescription: "I built this player to practise the HTML audio API and JavaScript events. It includes a seek bar, track queue, playback status, and volume controls.",
      technologies: ['HTML5 Audio API', 'CSS3 Animations', 'JavaScript ES6+', 'Event Handling'],
      features: [
        "Seek bar with playback time",
        "Playlists and a track queue",
        "Playback status and volume controls",
        "Controls that work on mobile"
      ],
      plannedFeatures: [
        "Audio visualiser and synced lyrics"
      ],
      architecture: [
        "HTML audio events track playback and song changes.",
        "JavaScript updates the seek bar and playback controls."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    }
  ];

  const projects = (Array.isArray(projectsData) ? projectsData : defaultProjects).map(withProjectStory);
  const filterOptions = ['All', 'Personal Project', 'College Group Project', 'Ongoing', 'Completed'];

  const matchesActiveFilter = (project) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Personal Project' || activeFilter === 'College Group Project') {
      return project.type === activeFilter;
    }
    if (activeFilter === 'Ongoing' || activeFilter === 'Completed') {
      return project.status === activeFilter;
    }
    return true;
  };

  const filteredProjects = projects.filter(matchesActiveFilter);
  const auraProject =
    filteredProjects.find((project) => project.featured || project.id === 'aura-voice-assistant') ||
    filteredProjects[0] ||
    null;
  const gridProjects = auraProject
    ? filteredProjects.filter((project) => project !== auraProject)
    : [];
  const auraTechnologies = Array.isArray(auraProject?.technologies) ? auraProject.technologies : [];
  const auraFeatures = Array.isArray(auraProject?.features) ? auraProject.features : [];


  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-midnight-border bg-midnight-surface/30">
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
              <span>Selected work</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
              Projects
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-muted">
              A selection of my web development, AI, and academic projects.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
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

        {filteredProjects.length === 0 ? (
          <div className="card-dev rounded-3xl p-10 sm:p-14 text-center">
            <h3 className="font-heading text-2xl sm:text-3xl text-slate-main uppercase tracking-wide">
              {projects.length === 0 ? 'No projects published yet' : 'No projects match this filter'}
            </h3>
            <p className="mx-auto mt-2 max-w-xl font-sans text-sm text-slate-muted">
              {projects.length === 0
                ? 'Project case studies will appear here once they are added through the admin portal.'
                : 'Try a different project type or status to see the available case studies.'}
            </p>
            {projects.length > 0 && activeFilter !== 'All' && (
              <button
                type="button"
                onClick={() => setActiveFilter('All')}
                className="btn-secondary mt-6 px-5 py-2.5 rounded-xl text-xs font-mono-tech uppercase"
              >
                Clear Filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 1. HERO SPOTLIGHT CARD: FEATURED PROJECT */}
            <div className="mb-12">
          <div className="card-ai-glow rounded-3xl p-6 sm:p-10 shadow-card-dev-hover overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column (7 cols): Content & Highlights */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan/15 border border-cyan/40 text-cyan text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5">
                    Featured project
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
                  {auraProject.longDescription || auraProject.description || ''}
                </p>
                <ProjectStory project={auraProject} />

                {/* Verified Resume Features */}
                {auraFeatures.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan" /> Features
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-muted">
                      {auraFeatures.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-midnight-elevated/70 p-2.5 rounded-xl border border-midnight-border/70">
                          <span className="text-cyan font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Chips */}
                {auraTechnologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {auraTechnologies.map((tech, idx) => (
                      <span
                        key={`${tech}-${idx}`}
                        className="px-3 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-xs font-mono-tech text-slate-main hover:border-cyan/40 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedProject(auraProject)}
                    className="btn-primary px-6 py-2.5 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan"
                  >
                    <span>View project</span>

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

              <aside className="lg:col-span-5 space-y-4">
                <ProjectScreenshot imageUrl={auraProject.imageUrl} title={auraProject.title} onPreview={() => setSelectedProject(auraProject)} />
                <div className="rounded-2xl border border-midnight-border bg-midnight-elevated/50 p-6 space-y-4">
                <h4 className="text-lg font-semibold text-slate-main">How it works</h4>
                <ul className="space-y-3 text-sm text-slate-muted leading-relaxed">
                  {(Array.isArray(auraProject.architecture) ? auraProject.architecture : []).slice(0, 3).map((detail, index) => (
                    <li key={index} className="flex items-start gap-2"><span className="text-cyan" aria-hidden="true">•</span><span>{detail}</span></li>
                  ))}
                </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* 2. GRID PROJECTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gridProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              className="card-dev rounded-3xl p-6 sm:p-7 flex flex-col justify-between group text-left"
            >
              <div>
                <div className="mb-5 empty:hidden">
                  <ProjectScreenshot imageUrl={project.imageUrl} title={project.title} onPreview={() => setSelectedProject(project)} />
                </div>
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
                <div className="mb-6"><ProjectStory project={project} /></div>

                {/* Features Snippet */}
                <div className="space-y-1.5 mb-6">
                  <span className="font-mono-tech text-[11px] text-slate-main uppercase tracking-wider font-semibold">
                    Features
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
                  {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, tIdx) => (
                    <span
                      key={`${tech}-${tIdx}`}
                      className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-slate-main"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono-tech text-slate-main group-hover:text-cyan uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>View project</span>

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
          </>
        )}
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          ref={dialogRef}
          tabIndex={-1}
          aria-modal="true"
          aria-label={`${selectedProject.title} case study`}
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
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-slate-main hover:border-cyan/50"
                aria-label="Close project case study"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ProjectScreenshot imageUrl={selectedProject.imageUrl} title={selectedProject.title} expanded />

            {/* Description */}
            <p className="font-sans text-sm sm:text-base text-slate-muted leading-relaxed">
              {selectedProject.longDescription || selectedProject.description}
            </p>
            <ProjectStory project={selectedProject} />

            {/* Architecture Details if present */}
            {Array.isArray(selectedProject.architecture) && selectedProject.architecture.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-bold">
                  How it works
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
                Features
              </span>
              <ul className="space-y-2">
                {(Array.isArray(selectedProject.features) ? selectedProject.features : []).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-slate-muted">
                    <CheckCircle2 className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Planned Features if any */}
            {Array.isArray(selectedProject.plannedFeatures) && selectedProject.plannedFeatures.length > 0 && (
              <div className="p-4 rounded-xl bg-midnight border border-midnight-border text-xs font-sans text-slate-muted">
                <span className="font-mono-tech text-slate-main font-bold block mb-1">
                  Planned additions
                </span>
                {selectedProject.plannedFeatures.join(' • ')}
              </div>
            )}

            {/* Technologies */}
            <div className="space-y-2 pt-2">
              <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-bold">
                Built with
              </span>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedProject.technologies) ? selectedProject.technologies : []).map((tech, idx) => (
                  <span
                    key={`${tech}-${idx}`}
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
                    <span>View code</span>
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
                type="button"
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

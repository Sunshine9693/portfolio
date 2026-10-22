import React, { useState } from 'react';
import { Sparkles, Code2, Server, Cpu, Brain, ArrowUpRight, X, CheckCircle2 } from 'lucide-react';

export const Skills = ({ skillsData }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const defaultCategories = [
    {
      id: 'frontend',
      category: 'Frontend Development',
      tag: 'UI & Interactivity',
      description: 'Building responsive, accessible user interfaces with clean component architectures, modern CSS, and state management.',
      items: [
        { name: 'HTML5', focus: 'Semantic markup & Web Accessibility (WCAG)' },
        { name: 'CSS3', focus: 'Modern layout, Flexbox, Grid & Keyframes' },
        { name: 'JavaScript (ES6+)', focus: 'DOM manipulation, Async/Await & Event-Driven' },
        { name: 'React.js', focus: 'Component lifecycle, Hooks, State & Routing' },
        { name: 'Angular', focus: 'Enterprise component patterns & TypeScript' },
        { name: 'Tailwind CSS', focus: 'Utility-first rapid responsive styling' }
      ]
    },
    {
      id: 'data-ai',
      category: 'Data & Artificial Intelligence',
      tag: 'AI Exploration',
      description: 'Leveraging LLM APIs, Generative AI architectures, and Python data tooling for practical analytics and smart automation.',
      items: [
        { name: 'LLM APIs', focus: 'Model prompt integration & API orchestration' },
        { name: 'Generative AI', focus: 'Conversational agent architecture & workflows' },
        { name: 'NumPy', focus: 'Array computing & numerical vectorization' },
        { name: 'Pandas', focus: 'Structured dataset manipulation & cleaning' },
        { name: 'Matplotlib & Seaborn', focus: 'Statistical data visualization & plotting' },
        { name: 'Foundational ML', focus: 'Supervised learning & model evaluation basics' }
      ]
    },
    {
      id: 'backend',
      category: 'Backend & Databases',
      tag: 'Server & Storage',
      description: 'Architecting RESTful services, integrating persistent NoSQL databases, and managing secure API endpoints.',
      items: [
        { name: 'Node.js', focus: 'Event-driven JavaScript runtime & asynchronous I/O' },
        { name: 'Express.js', focus: 'REST API routing, middleware & error pipelines' },
        { name: 'MongoDB', focus: 'NoSQL document schemas, indexing & queries' },
        { name: 'REST APIs', focus: 'HTTP contract design, JSON serialization & status codes' }
      ]
    },
    {
      id: 'programming',
      category: 'Programming & Core Concepts',
      tag: 'Computer Science Core',
      description: 'Strengthening algorithmic efficiency, modular object-oriented programming, and low-level memory concepts.',
      items: [
        { name: 'Java', focus: 'OOP (Encapsulation, Inheritance, Polymorphism)' },
        { name: 'C', focus: 'Pointers, memory management & imperative basics' },
        { name: 'C++', focus: 'Standard Template Library (STL) & procedural code' },
        { name: 'Python', focus: 'Scripting, tooling & data workflows' },
        { name: 'Data Structures & Algorithms', focus: 'Arrays, linked lists, trees, graphs, sorting' },
        { name: 'OOP Principles', focus: 'Modular system design & clean code standards' }
      ]
    }
  ];

  const categories = skillsData && skillsData.length > 0 ? skillsData : defaultCategories;

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 ambient-glow-section">
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-violet" />
            <span>Developer Competencies</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
            TECHNICAL SKILLS
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-muted">
            Structured into four distinct technical domains, built across academic coursework, 5 projects, and 3 internships.
          </p>
        </div>

        {/* 4 Developer-Style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {categories.map((card, index) => {
            const isAI = card.id === 'data-ai';

            return (
              <div
                key={card.id || index}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${card.category}`}
                onClick={() => setSelectedCategory(card)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCategory(card);
                  }
                }}
                className={`group cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-cyan ${
                  isAI
                    ? 'card-ai-glow hover:border-violet/60'
                    : 'card-dev hover:border-cyan/50'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-midnight-border mb-5">
                    <span
                      className={`font-mono-tech text-[10px] tracking-widest uppercase font-bold ${
                        isAI ? 'text-violet' : 'text-cyan'
                      }`}
                    >
                      {card.tag || `CAT-0${index + 1}`}
                    </span>
                    <span className="font-mono-tech text-xs text-slate-muted font-semibold">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105 ${
                      isAI
                        ? 'bg-midnight-elevated border border-violet/40 text-violet shadow-glow-violet'
                        : 'bg-midnight-elevated border border-cyan/30 text-cyan shadow-glow-subtle'
                    }`}
                  >
                    {index === 0 && <Code2 className="w-6 h-6" />}
                    {index === 1 && <Brain className="w-6 h-6" />}
                    {index === 2 && <Server className="w-6 h-6" />}
                    {index === 3 && <Cpu className="w-6 h-6" />}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl text-slate-main tracking-wide uppercase leading-tight mb-2.5">
                    {card.category}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs text-slate-muted leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Tech Chips */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(card.items || []).slice(0, 5).map((item, itemIdx) => (
                      <span
                        key={itemIdx}
                        className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-slate-main"
                      >
                        {item.name}
                      </span>
                    ))}
                    {(card.items || []).length > 5 && (
                      <span className="text-[10px] font-mono-tech px-2 py-1 rounded-full text-cyan">
                        +{(card.items || []).length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-3.5 border-t border-midnight-border flex items-center justify-between font-mono-tech text-xs uppercase tracking-wider font-semibold text-slate-muted group-hover:text-cyan transition-colors">
                    <span>Inspect Stack</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Modal */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="relative card-dev rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left border-cyan/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-midnight-border mb-6">
              <div>
                <span className="font-mono-tech text-xs text-cyan uppercase tracking-widest font-bold">
                  {selectedCategory.tag}
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl text-slate-main tracking-wide uppercase mt-1">
                  {selectedCategory.category}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-slate-main hover:border-cyan/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-sans text-sm text-slate-muted leading-relaxed mb-6">
              {selectedCategory.description}
            </p>

            <div className="space-y-3">
              <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-semibold block">
                VERIFIED SKILLS & COMPETENCIES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(selectedCategory.items || []).map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-midnight-elevated border border-midnight-border flex items-start gap-3 hover:border-cyan/40 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono-tech text-xs font-bold text-slate-main">
                        {skill.name}
                      </div>
                      <div className="font-sans text-[11px] text-slate-muted mt-0.5">
                        {skill.focus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-midnight-border flex justify-end">
              <button
                onClick={() => setSelectedCategory(null)}
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

import React, { useState } from 'react';
import { Sparkles, FileText, ExternalLink, Eye, X, Award, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export const Gallery = ({ certificatesData, galleryData }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePreview, setActivePreview] = useState(null);

  const defaultCertificates = [
    {
      id: 'ibm-genai',
      title: 'Generative AI Completion Certificate',
      issuer: 'IBM SkillsBuild',
      date: 'August 2026',
      credentialUrl: '',
      fileUrl: '/certificates/ibm_genai.pdf',
      description: 'Specialized credential covering generative model architectures, prompting techniques, LLM applications, and ethical AI development.',
      verified: true
    },
    {
      id: 'ibm-github',
      title: 'Git and GitHub Mastery Certificate',
      issuer: 'IBM SkillsBuild',
      date: 'August 2026',
      credentialUrl: '',
      fileUrl: '/certificates/ibm_github.pdf',
      description: 'Comprehensive certification on collaborative version control, branch workflows, merge conflict resolution, and open-source contribution patterns.',
      verified: true
    },
    {
      id: 'neo4j-graph',
      title: 'Neo4j Graph Database Certification',
      issuer: 'Neo4j GraphAcademy',
      date: 'September 2026',
      credentialUrl: '',
      fileUrl: '/certificates/neo4j_cert.pdf',
      description: 'Professional validation on graph database theory, Cypher querying language, node-relationship traversal, and connected data modeling.',
      verified: true
    }
  ];

  const defaultGallery = [
    {
      id: 'sana-prof',
      title: 'Sana Fatma — Developer Portrait',
      type: 'photo',
      url: '/images/sana_portrait.jpg',
      caption: 'Final-year Computer Science and Engineering student at MANUU.',
      category: 'Portrait'
    }
  ];

  const certificates = certificatesData && certificatesData.length > 0 ? certificatesData : defaultCertificates;
  const gallery = galleryData && galleryData.length > 0 ? galleryData : defaultGallery;

  const categories = ['All', 'Certificates', 'Photos'];

  return (
    <section id="gallery" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-midnight-border bg-midnight-surface/30">
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-violet" />
              <span>Verified Documents & Gallery</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
              Certificates & Learning
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-muted">
              Verified credentials, skill-building milestones, and selected portfolio media.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 bg-midnight-card p-1.5 rounded-full border border-midnight-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-tech uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan text-midnight font-bold shadow-glow-cyan'
                    : 'text-slate-muted hover:text-slate-main'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates Grid */}
        {(activeCategory === 'All' || activeCategory === 'Certificates') && (
          <div className="mb-14 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-main uppercase tracking-widest font-bold">
              <Award className="w-4 h-4 text-cyan" />
              <span>Verified Professional Certifications</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certificates.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="card-dev rounded-2xl p-6 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-midnight-border text-xs font-mono-tech text-slate-muted">
                      <span className="text-cyan font-bold">{cert.issuer}</span>
                      <span>{cert.date}</span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-midnight-elevated border border-cyan/30 flex items-center justify-center text-cyan mb-2">
                      <FileText className="w-5 h-5" />
                    </div>

                    <h4 className="font-heading text-2xl text-slate-main tracking-wide uppercase leading-tight group-hover:text-cyan transition-colors">
                      {cert.title}
                    </h4>

                    <p className="font-sans text-xs text-slate-muted leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-midnight-border flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-mono-tech text-emerald-accent">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Document
                    </span>

                    {cert.fileUrl && (
                      <button
                        onClick={() => setActivePreview({ type: 'pdf', url: cert.fileUrl, title: cert.title })}
                        className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 hover:border-cyan/50 hover:text-cyan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media / Photos Grid */}
        {(activeCategory === 'All' || activeCategory === 'Photos') && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-main uppercase tracking-widest font-bold">
              <ImageIcon className="w-4 h-4 text-violet" />
              <span>Media Assets & Showcase</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setActivePreview({ type: 'image', url: item.url, title: item.title })}
                  className="card-dev rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] bg-midnight-elevated overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="btn-primary px-4 py-2 rounded-full text-xs font-mono-tech uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> View Media
                      </span>
                    </div>
                  </div>
                  <div className="p-4 text-left">
                    <h5 className="font-heading text-lg text-slate-main tracking-wide uppercase">
                      {item.title}
                    </h5>
                    <p className="font-sans text-xs text-slate-muted mt-1">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / PDF Document Previewer Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative card-dev rounded-3xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[92vh] border-cyan/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-midnight-border mb-4">
              <div className="space-y-0.5 text-left">
                <span className="font-mono-tech text-xs text-cyan uppercase font-bold">
                  {activePreview.type === 'pdf' ? 'Verified Document Viewer' : 'Media Preview'}
                </span>
                <h4 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                  {activePreview.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activePreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-cyan"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActivePreview(null)}
                  className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-slate-main"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden rounded-xl bg-midnight flex items-center justify-center min-h-[400px]">
              {activePreview.type === 'pdf' ? (
                <iframe
                  src={activePreview.url}
                  title={activePreview.title}
                  className="w-full h-full min-h-[500px] border-0 rounded-xl"
                />
              ) : (
                <img
                  src={activePreview.url}
                  alt={activePreview.title}
                  className="max-h-[70vh] object-contain rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

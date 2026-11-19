import { useState } from 'react';
import {
  Sparkles,
  FileText,
  ExternalLink,
  Eye,
  X,
  Award,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { resolveAssetUrl } from '../../services/api';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';

const SafeImage = ({ src, alt, className = '', fallbackClassName = '', preview = false }) => {
  const [imageState, setImageState] = useState({ src, failed: false, ready: false });
  const failed = imageState.src === src && imageState.failed;
  const ready = imageState.src === src && imageState.ready;

  const handleLoad = async (event) => {
    const image = event.currentTarget;
    try { await image.decode(); } catch { /* Some browsers already decoded the image. */ }
    if (image.naturalWidth > 0) setImageState({ src, failed: false, ready: true });
  };

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-midnight-elevated text-slate-muted ${fallbackClassName || className}`}
        role="img"
        aria-label={`${alt} — image unavailable`}
      >
        <ImageIcon className="h-8 w-8 text-slate-subtle" />
        <span className="font-mono-tech text-[10px] uppercase tracking-wider">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={preview ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={handleLoad}
      onError={() => setImageState({ src, failed: true, ready: false })}
      data-ready={ready}
      className={`gallery-image ${className}`}
    />
  );
};

export const Gallery = ({ certificatesData, galleryData }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePreview, setActivePreview] = useState(null);

  useDialogBehavior(Boolean(activePreview), () => setActivePreview(null));

  const defaultCertificates = [
    {
      id: 'ibm-genai',
      title: 'Generative AI Completion Certificate',
      issuer: 'IBM SkillsBuild',
      date: 'August 2026',
      credentialUrl: '',
      fileUrl: '/certificates/ibm_genai.pdf',
      description: 'Specialized credential covering generative model architectures, prompting techniques, LLM applications, and ethical AI development.',
      verified: true,
    },
    {
      id: 'ibm-github',
      title: 'Git and GitHub Mastery Certificate',
      issuer: 'IBM SkillsBuild',
      date: 'August 2026',
      credentialUrl: '',
      fileUrl: '/certificates/ibm_github.pdf',
      description: 'Comprehensive certification on collaborative version control, branch workflows, merge conflict resolution, and open-source contribution patterns.',
      verified: true,
    },
    {
      id: 'neo4j-graph',
      title: 'Neo4j Graph Database Certification',
      issuer: 'Neo4j GraphAcademy',
      date: 'September 2026',
      credentialUrl: '',
      fileUrl: '/certificates/neo4j_cert.pdf',
      description: 'Professional validation on graph database theory, Cypher querying language, node-relationship traversal, and connected data modeling.',
      verified: true,
    },
  ];

  const defaultGallery = [
    {
      id: 'sana-prof',
      title: 'Sana Fatma — Developer Portrait',
      type: 'photo',
      url: '/images/sana_portrait.jpg',
      caption: 'Final-year Computer Science and Engineering student at MANUU.',
      category: 'Portrait',
    },
  ];

  const certificates = Array.isArray(certificatesData) ? certificatesData : defaultCertificates;
  const gallery = Array.isArray(galleryData) ? galleryData : defaultGallery;

  const categories = ['All', 'Certificates', 'Photos'];

  const openCertificatePreview = (certificate) => {
    if (!certificate.fileUrl) return;
    const isImage =
      certificate.fileType?.startsWith('image/') ||
      /\.(jpe?g|png|webp)(?:$|\?)/i.test(certificate.fileUrl);

    setActivePreview({
      type: isImage ? 'image' : 'pdf',
      url: resolveAssetUrl(certificate.fileUrl),
      title: certificate.title || 'Certificate',
    });
  };

  const openGalleryPreview = (item) => {
    if (!item.url) return;
    setActivePreview({
      type: item.type === 'video' ? 'video' : 'image',
      url: resolveAssetUrl(item.url),
      title: item.title || 'Portfolio media',
    });
  };

  return (
    <section id="gallery" className={`relative py-24 px-4 sm:px-6 lg:px-8 border-t border-midnight-border bg-midnight-surface/30${activePreview ? ' gallery-preview-open' : ''}`}>
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">

              <span>Continued learning</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
              Certificates & Learning
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-muted">
              Courses, certificates, and moments from my work.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 bg-midnight-card p-1.5 rounded-full border border-midnight-border">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-tech uppercase tracking-wider transition-all ${
                  activeCategory === category
                    ? 'bg-cyan text-midnight font-bold shadow-glow-cyan'
                    : 'text-slate-muted hover:text-slate-main'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates Grid */}
        {(activeCategory === 'All' || activeCategory === 'Certificates') && (
          <div className="mb-14 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-main uppercase tracking-widest font-bold">
              <Award className="w-4 h-4 text-cyan" />
              <span>Certificates</span>
            </div>

            {certificates.length === 0 ? (
              <div className="card-dev rounded-2xl p-10 text-center font-sans text-sm text-slate-muted">
                No certificates are published yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {certificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    className="card-dev rounded-2xl p-6 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-midnight-border text-xs font-mono-tech text-slate-muted">
                        <span className="text-cyan font-bold">{certificate.issuer || 'Certificate'}</span>
                        <span>{certificate.date || ''}</span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-midnight-elevated border border-cyan/30 flex items-center justify-center text-cyan mb-2">
                        <FileText className="w-5 h-5" />
                      </div>

                      <h4 className="font-heading text-2xl text-slate-main tracking-wide uppercase leading-tight group-hover:text-cyan transition-colors">
                        {certificate.title || 'Untitled certificate'}
                      </h4>

                      <p className="font-sans text-xs text-slate-muted leading-relaxed">
                        {certificate.description || ''}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-midnight-border flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1 text-[11px] font-mono-tech text-emerald-accent">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Certificate
                      </span>

                      {certificate.fileUrl && (
                        <button
                          type="button"
                          onClick={() => openCertificatePreview(certificate)}
                          className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 hover:border-cyan/50 hover:text-cyan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media / Photos Grid */}
        {(activeCategory === 'All' || activeCategory === 'Photos') && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-main uppercase tracking-widest font-bold">
              <ImageIcon className="w-4 h-4 text-violet" />
              <span>Gallery</span>
            </div>

            {gallery.length === 0 ? (
              <div className="card-dev rounded-2xl p-10 text-center font-sans text-sm text-slate-muted">
                No media items are published yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item, index) => (
                  <button
                    key={item.id || index}
                    type="button"
                    onClick={() => openGalleryPreview(item)}
                    className="gallery-media-card card-dev rounded-2xl overflow-hidden cursor-pointer group text-left"
                  >
                    <div className="gallery-image-frame relative aspect-[4/3] bg-midnight-elevated overflow-hidden">
                      <SafeImage
                        src={resolveAssetUrl(item.url)}
                        alt={item.title || 'Portfolio media'}
                        className="w-full h-full object-cover"
                        fallbackClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="btn-primary px-4 py-2 rounded-full text-xs font-mono-tech uppercase tracking-wider flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> View Media
                        </span>
                      </div>
                    </div>
                    <div className="p-4 text-left">
                      <h5 className="font-heading text-lg text-slate-main tracking-wide uppercase">
                        {item.title || 'Untitled media'}
                      </h5>
                      <p className="font-sans text-xs text-slate-muted mt-1">
                        {item.caption || ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / PDF Document Previewer Modal */}
      {activePreview && (
        <div
          className="gallery-preview fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activePreview.title} preview`}
        >
          <div
            className="relative card-dev rounded-3xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[92vh] border-cyan/40"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-midnight-border mb-4">
              <div className="space-y-0.5 text-left">
                <span className="font-mono-tech text-xs text-cyan uppercase font-bold">
                  {activePreview.type === 'pdf' ? 'Certificate viewer' : 'Media Preview'}
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
                  aria-label="Open media in a new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-slate-main"
                  aria-label="Close media preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="gallery-preview-media flex-1 overflow-hidden rounded-xl bg-midnight flex items-center justify-center min-h-0 sm:min-h-[400px]">
              {activePreview.type === 'pdf' ? (
                <iframe
                  src={activePreview.url}
                  title={activePreview.title}
                  className="w-full h-full min-h-[500px] border-0 rounded-xl"
                />
              ) : activePreview.type === 'video' ? (
                <video
                  src={activePreview.url}
                  controls
                  className="max-h-[70vh] w-full rounded-xl"
                >
                  Your browser does not support embedded video playback.
                </video>
              ) : (
                <SafeImage
                  src={activePreview.url}
                  alt={activePreview.title}
                  preview
                  className="max-h-[70vh] max-w-full object-contain rounded-xl"
                  fallbackClassName="h-[50vh] w-full rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

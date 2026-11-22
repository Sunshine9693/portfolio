import { useState } from 'react';
import { ExternalLink, Image as ImageIcon, Eye } from 'lucide-react';
import { resolveAssetUrl } from '../../services/api';

export function ProjectScreenshot({ imageUrl, title, onPreview, expanded = false }) {
  const [failedSource, setFailedSource] = useState('');
  // The old shared illustration is not a screenshot of an individual project.
  const source = typeof imageUrl === 'string' && imageUrl.trim() !== '/images/hero.png'
    ? resolveAssetUrl(imageUrl.trim()) : '';
  if (!source || !(/^(https?:\/\/|\/[^/]|blob:|data:image\/)/i.test(source))) return null;

  if (failedSource === source) {
    return <div role="img" aria-label={`${title} screenshot unavailable`}
      className="aspect-video rounded-2xl border border-midnight-border bg-midnight-elevated flex items-center justify-center gap-2 text-sm text-slate-muted">
      <ImageIcon size={18} aria-hidden="true" /> Screenshot unavailable
    </div>;
  }

  const image = <img src={source} alt={`${title} screenshot`} loading={expanded ? 'eager' : 'lazy'} decoding="async"
    onError={() => setFailedSource(source)}
    className="h-full w-full object-contain" />;
  const frameClass = 'relative block w-full aspect-video overflow-hidden rounded-2xl border border-midnight-border bg-midnight-elevated';

  if (onPreview && !expanded) return <button type="button" onClick={onPreview}
    aria-label={`Preview ${title} screenshot`} className={`${frameClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan hover:border-cyan/60 transition-colors`}>
    {image}
    <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-midnight-surface/95 border border-midnight-border px-3 py-1.5 text-xs text-slate-main">
      <Eye size={14} aria-hidden="true" /> View screenshot
    </span>
  </button>;

  return <figure className="space-y-2">
    <div className={frameClass}>{image}</div>
    {expanded && <figcaption>
      <a href={source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan hover:underline">
        <ExternalLink size={14} aria-hidden="true" /> Open full-size screenshot
      </a>
    </figcaption>}
  </figure>;
}

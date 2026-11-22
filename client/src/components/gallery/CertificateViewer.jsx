import { lazy, Suspense, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { resolveAssetUrl } from '../../services/api';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';

const PdfPreview = lazy(() => import('./PdfPreview'));

export function CertificateViewer({ url, fileType = '', title, onClose }) {
  const dialogRef = useDialogBehavior(true, onClose);
  const [imageFailed, setImageFailed] = useState(false);
  const source = resolveAssetUrl(url);
  const isImage = fileType?.startsWith('image/') || /\.(jpe?g|png|webp)(?:$|\?)/i.test(source);
  const previewUrl = !isImage ? `${source}${source.includes('?') ? '&' : '?'}preview=2` : source;

  return <div role="dialog" aria-modal="true" aria-label={`${title} preview`} ref={dialogRef} tabIndex={-1}
    onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/90 backdrop-blur-md">
    <div onClick={event => event.stopPropagation()} className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-midnight-border bg-midnight-surface p-4 sm:p-6 shadow-2xl space-y-4">
      <div className="flex items-start justify-between gap-3 border-b border-midnight-border pb-4">
        <div className="min-w-0"><p className="text-sm text-cyan">Internship certificate</p><h3 className="text-xl sm:text-2xl text-slate-main font-semibold break-words">{title}</h3></div>
        <button type="button" onClick={onClose} aria-label="Close internship certificate" className="p-2 shrink-0 rounded-full border border-midnight-border text-slate-main"><X size={20} /></button>
      </div>
      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan underline"><ExternalLink size={16} />Open {isImage ? 'certificate' : 'PDF'} in a new tab</a>
      <div className="min-h-0 rounded-xl bg-midnight-elevated overflow-hidden">
        {isImage ? (imageFailed ? <p role="alert" className="p-6 text-sm text-slate-muted">The image could not load. Use the link above to open the certificate.</p>
          : <img src={source} alt={title} onError={() => setImageFailed(true)} className="max-h-[60vh] max-w-full mx-auto object-contain" />)
          : <Suspense fallback={<p role="status" className="p-6 text-sm text-slate-muted">Loading PDF viewer…</p>}><PdfPreview url={previewUrl} title={title} /></Suspense>}
      </div>
    </div>
  </div>;
}

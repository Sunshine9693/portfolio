import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

function PdfPage({ document, pageNumber, title }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    let renderTask;
    const render = async () => {
      try {
        const page = await document.getPage(pageNumber);
        if (cancelled) return;
        const natural = page.getViewport({ scale: 1 });
        // A bounded resolution stays sharp on phones without allocating huge canvases.
        const scale = Math.min(2, 1600 / natural.width, Math.sqrt(4000000 / (natural.width * natural.height)));
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport });
        await renderTask.promise;
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    };
    render();
    return () => { cancelled = true; renderTask?.cancel(); };
  }, [document, pageNumber]);

  return (
    <div className="w-full">
      {status === 'loading' && <p role="status" className="p-6 text-center text-sm text-slate-muted">Loading certificate page…</p>}
      {status === 'error' && <p role="alert" className="p-6 text-center text-sm text-slate-muted">This page could not be displayed. Use the Open PDF link above to view the original.</p>}
      <canvas ref={canvasRef} role="img" aria-label={`${title}, page ${pageNumber}`}
        hidden={status !== 'ready'} className="w-full h-auto bg-white rounded-lg" />
    </div>
  );
}

export default function PdfPreview({ url, title }) {
  const [document, setDocument] = useState(null);
  const [failed, setFailed] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setDocument(null);
    setFailed(false);
    setPageNumber(1);
    const task = getDocument({ url, isEvalSupported: false });
    task.promise.then(pdf => {
      if (!cancelled) setDocument(pdf);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; task.destroy().catch(() => {}); };
  }, [url]);

  return (
    <div className="w-full min-h-0 max-h-[60vh] overflow-y-auto p-2 sm:p-3" tabIndex={0} aria-label="Certificate PDF preview">
      {failed ? <p role="alert" className="p-6 text-center text-sm text-slate-muted">The PDF preview could not load. Use the Open PDF link above to view or download your certificate.</p>
        : !document ? <p role="status" className="p-6 text-center text-sm text-slate-muted">Loading certificate…</p>
          : <>
            {document.numPages > 1 && <nav aria-label="Certificate pages" className="flex items-center justify-center gap-4 mb-3 text-sm text-slate-main">
              <button type="button" disabled={pageNumber === 1} onClick={() => setPageNumber(value => value - 1)} className="btn-secondary px-3 py-2 rounded-lg disabled:opacity-40">Previous page</button>
              <span aria-live="polite">{pageNumber} / {document.numPages}</span>
              <button type="button" disabled={pageNumber === document.numPages} onClick={() => setPageNumber(value => value + 1)} className="btn-secondary px-3 py-2 rounded-lg disabled:opacity-40">Next page</button>
            </nav>}
            <PdfPage key={`${url}:${pageNumber}`} document={document} pageNumber={pageNumber} title={title} />
          </>}
    </div>
  );
}

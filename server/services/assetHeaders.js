import { portfolioOrigin } from '../config/cors.js';

// Uploaded PDFs are public documents embedded by our separately hosted frontend.
// Keep Helmet's API protections intact and relax framing only for these files.
export function setAssetHeaders(res, contentType, filename) {
  res.setHeader('Content-Type', contentType);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (contentType !== 'application/pdf') {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return;
  }

  const csp = String(res.getHeader('Content-Security-Policy') || '')
    .split(';').filter(directive => !/^\s*(frame-ancestors|object-src)\b/i.test(directive));
  csp.push(`frame-ancestors 'self' ${portfolioOrigin}`, "object-src 'self'");
  res.setHeader('Content-Security-Policy', csp.filter(Boolean).join(';'));
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(filename)}`);
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
}

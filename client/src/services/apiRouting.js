export const PRODUCTION_API_ORIGIN = 'https://portfolio-backend-v8mm.onrender.com';

export const getApiBaseUrl = (isDevelopment, configuredBaseUrl = '') =>
  isDevelopment ? configuredBaseUrl.trim().replace(/\/+$/, '') : PRODUCTION_API_ORIGIN;

export function resolveApiAsset(url, apiBaseUrl) {
  if (!url || typeof url !== 'string') return '';
  if (/^(?:https?:)?\/\//i.test(url) || /^(?:data|blob):/i.test(url)) return url;
  if (url.startsWith('/uploads/') && apiBaseUrl) return `${apiBaseUrl}${url}`;
  return url;
}

import axios from 'axios';
import { canRetryRequest } from './requestRecovery';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
// Vercel forwards production API and upload requests through the site's origin.
// Keep an optional direct API URL for local development only.
export const API_BASE_URL = import.meta.env.DEV ? configuredBaseUrl.replace(/\/+$/, '') : '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
});

api.interceptors.response.use(response => response, async error => {
  if (!canRetryRequest(error)) throw error;
  error.config._recoveryAttempt = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  return api.request(error.config);
});

export const resolveAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (/^(?:https?:)?\/\//i.test(url) || /^(?:data|blob):/i.test(url)) return url;
  if (url.startsWith('/uploads/') && API_BASE_URL) return `${API_BASE_URL}${url}`;
  return url;
};

export const isApiCancel = (error) => error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError';

export default api;

import axios from 'axios';
import { canRetryRequest } from './requestRecovery';
import { getApiBaseUrl, resolveApiAsset } from './apiRouting';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
// Browser requests go directly to the Render API with explicit CORS permission.
// An external rewrite cannot present an upstream browser challenge to the visitor.
export const API_BASE_URL = getApiBaseUrl(import.meta.env.DEV, configuredBaseUrl);

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

export const resolveAssetUrl = (url) => resolveApiAsset(url, API_BASE_URL);

export const isApiCancel = (error) => error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError';

export default api;

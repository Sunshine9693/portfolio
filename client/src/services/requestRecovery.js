export const canRetryRequest = (error) => {
  const config = error.config;
  if (!config || config.signal?.aborted || error.code === 'ERR_CANCELED' || config._recoveryAttempt) return false;
  const safe = ['get', 'head'].includes(config.method?.toLowerCase()) ||
    (config.method?.toLowerCase() === 'post' && config.url === '/api/auth/login');
  return safe && (!error.response || [502, 503, 504].includes(error.response.status));
};

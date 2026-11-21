// The deployed portfolio is a first-party client even if CLIENT_URL is stale.
// Additional deployment origins can still be supplied through CLIENT_URL.
export const portfolioOrigin = 'https://sanafatma-portfolio.vercel.app';

export function createOriginMatcher(clientUrl = '') {
  const allowed = [portfolioOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173',
    ...clientUrl.split(',').map(value => value.trim().replace(/\/+$/, '')).filter(Boolean)];
  return origin => allowed.some(value => {
    if (!value.includes('*')) return value === origin;
    const pattern = value.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return new RegExp(`^${pattern}$`).test(origin);
  });
}

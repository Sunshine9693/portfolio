import { useEffect } from 'react';

export function usePortfolioReveal(isLoading) {
  useEffect(() => {
    if (isLoading || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll('main section:not(#hero) .card-dev, main section:not(#hero) .card-ai-glow');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.06 });
    targets.forEach((target) => { target.classList.add('reveal-pending'); observer.observe(target); });
    return () => { observer.disconnect(); targets.forEach((target) => target.classList.remove('reveal-pending')); };
  }, [isLoading]);
}

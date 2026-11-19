import { useEffect } from 'react';

export function usePortfolioReveal(isLoading) {
  useEffect(() => {
    if (isLoading || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = new Set();
    const selector = 'main section:not(#hero) .card-dev, main section:not(#hero) .card-ai-glow, main section:not(#hero) > div > div:first-child, #hero dl > div';
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
    const observeNewTargets = () => {
      targets.forEach((target) => {
        if (!target.isConnected) { observer.unobserve(target); targets.delete(target); }
      });
      document.querySelectorAll(selector).forEach((target) => {
        if (targets.has(target)) return;
        targets.add(target);
        const siblings = Array.from(target.parentElement.children);
        target.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(target), 3) * 70}ms`);
        target.classList.add('motion-reveal', 'reveal-pending');
        observer.observe(target);
      });
    };
    observeNewTargets();
    // Project and gallery filters can introduce cards after the first render.
    const mutations = new MutationObserver(observeNewTargets);
    const main = document.querySelector('main');
    if (main) mutations.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      targets.forEach((target) => {
        target.classList.remove('motion-reveal', 'reveal-pending');
        target.style.removeProperty('--reveal-delay');
      });
    };
  }, [isLoading]);
}

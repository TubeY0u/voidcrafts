/* ════════════════════════════════════════
   main.js — Entry point, init all modules
   ════════════════════════════════════════ */

import { initCursor }    from './cursor.js';
import { initStars }     from './stars.js';
import { initScroll }    from './scroll.js';
import { initManifesto } from './manifesto.js';

// ── Boot ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initStars();
  initScroll();
  initManifesto();
  initReveal();
  initCounters();
  initHeroReveal();
});

// ── Reveal on scroll (IntersectionObserver) ────────────────
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el    = entry.target;
        const delay = parseInt(el.dataset.delay ?? 0, 10);

        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// ── Animated number counters ──────────────────────────────
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  nums.forEach((el) => observer.observe(el));
}

function animateCounter(el, target) {
  const duration = 1600;
  const start    = performance.now();

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(ease(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ── Hero initial reveal (staggered on load) ───────────────
function initHeroReveal() {
  // Small delay so fonts are loaded
  requestAnimationFrame(() => {
    document.querySelectorAll('.section-hero .reveal').forEach((el) => {
      const delay = parseInt(el.dataset.delay ?? 0, 10) + 200;
      setTimeout(() => el.classList.add('is-visible'), delay);
    });
  });
}

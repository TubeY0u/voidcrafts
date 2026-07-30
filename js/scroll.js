/* ════════════════════════════════════════
   scroll.js — Lenis smooth scroll + Nav + Progress bar
   ════════════════════════════════════════ */

export function initScroll() {
  // ── Lenis ──────────────────────────────
  // Lenis is loaded via CDN in index.html
  const lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // ── Progress Bar ───────────────────────
  const progressBar = document.getElementById('progressBar');

  lenis.on('scroll', ({ progress }) => {
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
  });

  // ── Nav on scroll ──────────────────────
  const nav = document.getElementById('nav');

  lenis.on('scroll', ({ scroll }) => {
    if (!nav) return;
    if (scroll > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── Smooth scroll buttons ──────────────
  // Elements with data-scroll-to="sectionId"
  document.querySelectorAll('[data-scroll-to]').forEach((el) => {
    el.addEventListener('click', () => {
      const targetId = el.dataset.scrollTo;
      const target   = document.getElementById(targetId);
      if (target) lenis.scrollTo(target, { offset: -80 });
    });
  });

  // Nav links with href="#section"
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) lenis.scrollTo(target, { offset: -80 });
    });
  });

  return lenis;
}

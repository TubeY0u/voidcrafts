/* ════════════════════════════════════════
   manifesto.js — Staggered line reveal on scroll
   ════════════════════════════════════════ */

export function initManifesto() {
  const section = document.getElementById('manifesto');
  if (!section) return;

  const lines = section.querySelectorAll('.manifesto-line');
  if (!lines.length) return;

  let activated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !activated) {
          activated = true;
          lines.forEach((line, i) => {
            setTimeout(() => {
              line.classList.add('is-active');
            }, i * 220);
          });
        } else if (!entry.isIntersecting) {
          // Re-trigger when scrolled back to section
          activated = false;
          lines.forEach((line) => line.classList.remove('is-active'));
        }
      });
    },
    { threshold: 0.55 }
  );

  observer.observe(section);
}

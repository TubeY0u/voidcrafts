/* ════════════════════════════════════════
   cursor.js — Smooth custom cursor with lag ring
   ════════════════════════════════════════ */

export function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Touch devices get no cursor
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;
  let rafId;

  // Update mouse position immediately
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    mouseX = -200; mouseY = -200;
    ringX  = -200; ringY  = -200;
  });

  // Lerp loop for ring
  function loop() {
    ringX += (mouseX - ringX) * 0.10;
    ringY += (mouseY - ringY) * 0.10;

    dot.style.left  = `${mouseX}px`;
    dot.style.top   = `${mouseY}px`;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;

    rafId = requestAnimationFrame(loop);
  }

  loop();

  // Hover state for interactive elements
  const interactiveSelectors = 'a, button, [data-cursor-hover]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      dot.classList.add('cursor--hover');
      ring.classList.add('cursor-ring--hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      dot.classList.remove('cursor--hover');
      ring.classList.remove('cursor-ring--hover');
    }
  });

  // Cleanup
  return () => cancelAnimationFrame(rafId);
}

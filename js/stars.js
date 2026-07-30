/* ════════════════════════════════════════
   stars.js — Canvas star field with parallax
   ════════════════════════════════════════ */

export function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouseX = 0, mouseY = 0;
  let width, height;
  let rafId;

  const STAR_COUNT = 140;
  const PARALLAX_STRENGTH = 0.025;

  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:     Math.random() * width,
        y:     Math.random() * height,
        r:     Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.003 + 0.001,  // twinkle speed
        phase: Math.random() * Math.PI * 2,     // twinkle offset
        depth: Math.random() * 0.8 + 0.2,      // parallax depth
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const cx = width  / 2;
    const cy = height / 2;
    const dx = (mouseX - cx) * PARALLAX_STRENGTH;
    const dy = (mouseY - cy) * PARALLAX_STRENGTH;

    stars.forEach((s) => {
      const twinkle = 0.5 + 0.5 * Math.sin(time * s.speed * 1000 + s.phase);
      const alpha   = s.alpha * (0.4 + 0.6 * twinkle);

      const px = s.x + dx * s.depth;
      const py = s.y + dy * s.depth;

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 190, 255, ${alpha})`;
      ctx.fill();
    });

    rafId = requestAnimationFrame(draw);
  }

  // Init
  resize();
  createStars();
  rafId = requestAnimationFrame(draw);

  // Track mouse for parallax
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createStars();
    }, 200);
  });

  return () => cancelAnimationFrame(rafId);
}

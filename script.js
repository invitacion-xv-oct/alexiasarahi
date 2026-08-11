/* ================================================================
   INVITACIÓN XV AÑOS — ALEXIA SARAHÍ
   ================================================================ */

/* ── 1. STARS CANVAS ─────────────────────────────────────────── */
(function initStars() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildStars();
  }

  function buildStars() {
    const density = 5500; // px² per star
    const count   = Math.max(60, Math.floor(canvas.width * canvas.height / density));
    stars = Array.from({ length: count }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.002,
    }));
  }

  let raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.phase += s.speed;
      const alpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(194, 208, 228, ${alpha.toFixed(2)})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  // Pause when section is off-screen to save battery
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!raf) draw();
    } else {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }, { threshold: 0 });
  observer.observe(canvas.closest('section'));

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = null;
    resize();
    draw();
  });

  resize();
  draw();
})();

/* ── 2. COUNTDOWN TIMER ──────────────────────────────────────── */
(function initCountdown() {
  const TARGET = new Date('2026-10-10T18:00:00'); // 10 Oct 2026, 6:00 PM
  const elDays = document.getElementById('days');
  const elHrs  = document.getElementById('hours');
  const elMin  = document.getElementById('minutes');
  const elSec  = document.getElementById('seconds');
  if (!elDays) return;

  function pad(n, w) { return String(n).padStart(w, '0'); }

  function tick() {
    const diff = TARGET - Date.now();
    if (diff <= 0) {
      elDays.textContent = '00';
      elHrs.textContent  = '00';
      elMin.textContent  = '00';
      elSec.textContent  = '00';
      return;
    }
    const totalSec = Math.floor(diff / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600)  / 60);
    const s = totalSec % 60;

    elDays.textContent = pad(d, 3);
    elHrs.textContent  = pad(h, 2);
    elMin.textContent  = pad(m, 2);
    elSec.textContent  = pad(s, 2);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ── 3. SCROLL-REVEAL (IntersectionObserver) ─────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
})();

/* ── 4. CONFIRMAR WHATSAPP ───────────────────────────────────── */
(function initConfirmar() {
  const input   = document.getElementById('num-asistentes');
  const btnWa   = document.getElementById('btn-confirmar-wa');
  const btnMas  = document.getElementById('btn-mas');
  const btnMenos= document.getElementById('btn-menos');
  if (!input || !btnWa) return;

  const BASE_MSG = 'Hola Alexia, confirmo mi asistencia y la de mi familia a tus XV años el 10 de octubre, en total seremos: ';
  const PHONE    = '5567680474';

  function buildUrl() {
    const n = Math.max(1, parseInt(input.value, 10) || 1);
    input.value = n;
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(BASE_MSG + n + ' personas');
  }

  function refresh() { btnWa.href = buildUrl(); }

  btnWa.href = buildUrl();
  input.addEventListener('input', refresh);
  input.addEventListener('change', refresh);

  if (btnMas) {
    btnMas.addEventListener('click', () => {
      const cur = parseInt(input.value, 10) || 1;
      if (cur < 30) { input.value = cur + 1; refresh(); }
    });
  }
  if (btnMenos) {
    btnMenos.addEventListener('click', () => {
      const cur = parseInt(input.value, 10) || 1;
      if (cur > 1) { input.value = cur - 1; refresh(); }
    });
  }
})();

/* ── 5. STAGGERED TIMELINE ITEMS ─────────────────────────────── */
(function initTimelineStagger() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 110);
      });
      io.disconnect();
    }
  }, { threshold: 0.15 });

  // Observe the whole timeline section
  const section = document.getElementById('itinerario');
  if (section) io.observe(section);

  // Add fade-in class to each tl-item (they don't have it by default to avoid fighting CSS)
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(16px)';
    item.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  // Augment "visible" to work on tl-items via style (since we set inline styles)
  const origObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 110);
      });
      origObserver.disconnect();
    }
  }, { threshold: 0.15 });

  if (section) origObserver.observe(section);
})();

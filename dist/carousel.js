(() => {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.slide')];
  const dots = [...carousel.querySelectorAll('.slide-dots button')];
  const toggle = carousel.querySelector('.rotation-control');
  const track = carousel.querySelector('.slides');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let playing = !reducedMotion.matches;
  let timer;
  let hovering = false;
  const stopTimer = () => window.clearTimeout(timer);
  function show(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === active);
      slide.setAttribute('aria-hidden', String(i !== active));
      dots[i].setAttribute('aria-current', String(i === active));
    });
    carousel.querySelector('.slide-counter').textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }
  function schedule() {
    stopTimer();
    toggle.textContent = playing ? 'Pausar' : 'Reproduzir';
    toggle.setAttribute('aria-label', playing ? 'Pausar carrossel automático' : 'Reproduzir carrossel automático');
    track.setAttribute('aria-live', playing ? 'off' : 'polite');
    if (playing && !hovering && !document.hidden) timer = window.setTimeout(() => { show(active + 1); schedule(); }, 5000);
  }
  // Stop on keyboard focus; restarting requires an explicit choice.
  carousel.addEventListener('focusin', event => {
    if (event.target.matches(':focus-visible')) { playing = false; schedule(); }
  });
  toggle.addEventListener('click', () => { playing = !playing; schedule(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { playing = false; show(i); schedule(); }));
  carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { playing = false; schedule(); } });
  let touchStart;
  carousel.addEventListener('touchstart', event => { touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; }, { passive: true });
  carousel.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { playing = false; show(active + (dx < 0 ? 1 : -1)); schedule(); }
    touchStart = null;
  }, { passive: true });
  carousel.querySelector('.carousel-controls').hidden = false;
  show(0);
  schedule();
})();

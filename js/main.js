/* main.js — Animations et interactions STAYKR FAMILY */

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* ---- Reveal on scroll ---- */
function revealElements() {
  document.querySelectorAll('.reveal-up:not(.revealed)').forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      const delay = el.style.getPropertyValue('--delay') || (i * 0.07 + 's');
      setTimeout(() => el.classList.add('revealed'), parseFloat(delay) * 1000);
    }
  });
}

window.addEventListener('scroll', revealElements, { passive: true });
window.addEventListener('resize', revealElements, { passive: true });
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(revealElements, 100);
});

/* ---- Parallax subtle sur le hero ---- */
const heroBg = document.querySelector('.bg-gradient');
window.addEventListener('mousemove', (e) => {
  if (!heroBg) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  heroBg.style.transform = `translate(${x}px, ${y}px)`;
}, { passive: true });

/* ---- Ripple effect sur les boutons ---- */
document.querySelectorAll('.btn-primary, .btn-discord-big').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      top:${y}px;
      left:${x}px;
      background:rgba(255,255,255,0.25);
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* Keyframe ripple */
const s = document.createElement('style');
s.textContent = `@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}`;
document.head.appendChild(s);

/* ---- Compteur animé ---- */
function animateCounter(el, target, duration = 1500) {
  if (isNaN(target) || target === 0) return;
  const start = 0;
  const step  = (timestamp) => {
    if (!animateCounter._start) animateCounter._start = timestamp;
    const progress = Math.min((timestamp - animateCounter._start) / duration, 1);
    el.textContent  = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  animateCounter._start = null;
  requestAnimationFrame(step);
}

/* Observe le compteur de membres */
const countEl = document.getElementById('memberCount');
if (countEl) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const val = parseInt(countEl.textContent) || 0;
        animateCounter(countEl, val);
        obs.unobserve(countEl);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(countEl);
}

/* ---- Curseur personnalisé (trail) ---- */
const trail = [];
const TRAIL_LENGTH = 8;
for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;
    width:${6 - i * 0.5}px;
    height:${6 - i * 0.5}px;
    background:rgba(230,57,80,${0.5 - i * 0.05});
    border-radius:50%;
    pointer-events:none;
    z-index:9999;
    transition:transform 0.05s;
    left:0;top:0;
    will-change:transform;
  `;
  document.body.appendChild(dot);
  trail.push({ el: dot, x: 0, y: 0 });
}

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

function animateTrail() {
  trail.forEach((dot, i) => {
    if (i === 0) {
      dot.x += (mouseX - dot.x) * 0.35;
      dot.y += (mouseY - dot.y) * 0.35;
    } else {
      dot.x += (trail[i-1].x - dot.x) * 0.5;
      dot.y += (trail[i-1].y - dot.y) * 0.5;
    }
    dot.el.style.transform = `translate(${dot.x - 3}px, ${dot.y - 3}px)`;
  });
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ---- Texte glitch sur le titre hero ---- */
const heroTitle = document.querySelector('.hero-title .line1');
if (heroTitle) {
  const original = heroTitle.textContent;
  const chars = 'アイウエオカキクケコサシスセソタチツテト';
  let glitchTimer;

  heroTitle.addEventListener('mouseenter', () => {
    let iter = 0;
    clearInterval(glitchTimer);
    glitchTimer = setInterval(() => {
      heroTitle.textContent = original.split('').map((c, i) => {
        if (i < iter) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iter >= original.length) {
        clearInterval(glitchTimer);
        heroTitle.textContent = original;
      }
      iter += 0.5;
    }, 40);
  });
}

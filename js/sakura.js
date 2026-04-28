/* sakura.js — Petales de cerisier animés */
(function() {
  const container = document.getElementById('sakuraContainer');
  if (!container) return;

  const COUNT = 25;
  const colors = ['#ff6b9d', '#ffb3c6', '#ffc8dd', '#e63950', '#c084fc', '#f472b6'];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createPetal() {
    const petal = document.createElement('div');
    const size  = random(6, 16);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = random(0, 100);
    const dur    = random(8, 18);
    const delay  = random(-15, 0);
    const drift  = random(-60, 60);
    const rot    = random(0, 360);
    const rotEnd = rot + random(-180, 180);

    petal.style.cssText = `
      position: absolute;
      top: -20px;
      left: ${startX}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50% 0 50% 0;
      opacity: ${random(0.3, 0.7)};
      transform: rotate(${rot}deg);
      animation: sakuraFall ${dur}s ${delay}s linear infinite;
      --drift: ${drift}px;
      --rot-end: ${rotEnd}deg;
      pointer-events: none;
    `;

    return petal;
  }

  // Injection du keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sakuraFall {
      0% {
        transform: translateX(0) translateY(-20px) rotate(0deg);
        opacity: 0;
      }
      5% { opacity: 0.6; }
      90% { opacity: 0.4; }
      100% {
        transform: translateX(var(--drift)) translateY(110vh) rotate(var(--rot-end));
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < COUNT; i++) {
    container.appendChild(createPetal());
  }
})();

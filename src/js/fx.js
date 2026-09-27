// JavaScript-driven motion: falling leaves and celebration bursts on a
// canvas, animated with requestAnimationFrame. Everything is a no-op under
// prefers-reduced-motion, and the loop sleeps when nothing is on screen.
import { reducedMotion } from './ui.js';

const PALETTE = () => ['#f2c14e', '#f4d56a', '#e58a2b', '#c2412d'];

// Painted leaf sprites (the same watercolor specimens used in the hunt).
const SPRITES = ['spec-aspen', 'spec-birch', 'spec-big', 'spec-red', 'spec-aspen', 'spec-cottonwood'].map((n) => {
  const im = new Image();
  im.decoding = 'async';
  im.src = `img/art/${n}.webp`;
  return im;
});
function drawSprite(ctx, size, idx) {
  const im = SPRITES[idx % SPRITES.length];
  if (!im.complete || !im.naturalWidth) return false;
  const h = size * 3.2, w = (h * im.naturalWidth) / im.naturalHeight;
  ctx.drawImage(im, -w / 2, -h / 2, w, h);
  return true;
}

// Fallback leaf drawn as two bezier halves around a midrib.
function drawLeaf(ctx, size, color, idx = 0) {
  if (drawSprite(ctx, size, idx)) return;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.95, -size * 0.55, size * 0.85, size * 0.55, 0, size * 0.62);
  ctx.bezierCurveTo(-size * 0.85, size * 0.55, -size * 0.95, -size * 0.55, 0, -size);
  ctx.fill();
  ctx.strokeStyle = 'rgba(80,50,10,.35)';
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.8);
  ctx.lineTo(0, size * 1.05);
  ctx.stroke();
}

function makeCanvas(host) {
  const c = document.createElement('canvas');
  c.className = 'fx-canvas';
  c.setAttribute('aria-hidden', 'true');
  host.appendChild(c);
  const ctx = c.getContext('2d');
  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = host.getBoundingClientRect();
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    c.style.width = r.width + 'px';
    c.style.height = r.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();
  return { c, ctx, fit, w: () => host.clientWidth, h: () => host.clientHeight };
}

// Gentle ambient leaf fall inside `host`. Returns a stop() function.
export function leafFall(host, { count = 14, wind = 0.25 } = {}) {
  if (!host || reducedMotion()) return () => {};
  const cv = makeCanvas(host);
  const colors = PALETTE();
  const rnd = (a, b) => a + Math.random() * (b - a);
  const spawn = (initial) => ({
    x: rnd(0, cv.w()),
    y: initial ? rnd(-cv.h(), cv.h()) : rnd(-60, -20),
    s: rnd(5, 11),
    vy: rnd(18, 34),
    phase: rnd(0, Math.PI * 2),
    sway: rnd(18, 42),
    spin: rnd(-1.4, 1.4),
    rot: rnd(0, Math.PI * 2),
    flip: rnd(0, Math.PI * 2),
    color: colors[Math.floor(Math.random() * colors.length)] || '#e8a317',
    idx: Math.floor(Math.random() * 6),
  });
  const leaves = Array.from({ length: count }, () => spawn(true));
  let raf = 0;
  let last = performance.now();
  let visible = true;
  let running = true;

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && running && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  });
  io.observe(host);

  function tick(t) {
    raf = 0;
    if (!running || !visible || document.hidden) return;
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    const { ctx } = cv;
    ctx.clearRect(0, 0, cv.w(), cv.h());
    for (const L of leaves) {
      L.phase += dt * 1.3;
      L.y += L.vy * dt;
      L.x += (Math.sin(L.phase) * L.sway + wind * 30) * dt;
      L.rot += L.spin * dt;
      L.flip += dt * 2.2;
      if (L.y > cv.h() + 30 || L.x > cv.w() + 40 || L.x < -40) Object.assign(L, spawn(false));
      ctx.save();
      ctx.translate(L.x, L.y);
      ctx.rotate(L.rot);
      ctx.scale(Math.cos(L.flip) * 0.8 + 0.2 * Math.sign(Math.cos(L.flip)), 1); // 3D-ish tumble
      ctx.globalAlpha = 0.9;
      drawLeaf(ctx, L.s, L.color, L.idx);
      ctx.restore();
    }
    raf = requestAnimationFrame(tick);
  }
  const onResize = () => cv.fit();
  const onVis = () => {
    if (!document.hidden && running && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVis);
  raf = requestAnimationFrame(tick);
  return () => {
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    cv.c.remove();
  };
}

// One-shot burst of leaves from a point (e.g., a checked hunt item).
export function burst(x, y, { n = 22 } = {}) {
  if (reducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'fx-layer';
  document.body.appendChild(layer);
  const cv = makeCanvas(layer);
  const colors = PALETTE();
  const parts = Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const sp = 140 + Math.random() * 260;
    return {
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 220,
      s: 5 + Math.random() * 7,
      rot: Math.random() * 6,
      spin: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)] || '#e8a317',
      idx: Math.floor(Math.random() * 6),
    };
  });
  const start = performance.now();
  let last = start;
  function tick(t) {
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    const age = (t - start) / 1000;
    const { ctx } = cv;
    ctx.clearRect(0, 0, cv.w(), cv.h());
    for (const p of parts) {
      p.vy += 520 * dt;
      p.vx *= 0.985;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - age / 1.4);
      drawLeaf(ctx, p.s, p.color, p.idx);
      ctx.restore();
    }
    if (age < 1.4) requestAnimationFrame(tick);
    else layer.remove();
  }
  requestAnimationFrame(tick);
}

// Tween a number over time with easing; calls fn(value) each frame.
export function tween(from, to, ms, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) {
  if (reducedMotion()) return fn(to);
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    fn(from + (to - from) * ease(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

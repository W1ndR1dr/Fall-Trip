// The handcrafting runtime: hand-cut paper edges, tilts, ink that draws
// itself, rubber stamps that thunk down, and hand-drawn doodle icons.
// All motion is JavaScript (requestAnimationFrame) and respects reduced motion.
import { reducedMotion } from './ui.js';

// Stable hash → seeded RNG, so a slip keeps the same edge every visit.
export function hash(str = '') {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

// A deckled clip-path polygon: small torn jitter all around, size-independent.
export function deckle(seed, { amp = 1.8, step = 22, notch = 0.06 } = {}) {
  const r = rng(seed);
  const pts = [];
  const j = () => (r() * amp * (r() < notch ? 2.6 : 1)).toFixed(1);
  const n = step;
  for (let i = 0; i <= n; i++) pts.push(`${(100 * i / n).toFixed(2)}% ${j()}px`);
  for (let i = 1; i <= n; i++) pts.push(`calc(100% - ${j()}px) ${(100 * i / n).toFixed(2)}%`);
  for (let i = n - 1; i >= 0; i--) pts.push(`${(100 * i / n).toFixed(2)}% calc(100% - ${j()}px)`);
  for (let i = n - 1; i >= 1; i--) pts.push(`${j()}px ${(100 * i / n).toFixed(2)}%`);
  return `polygon(${pts.join(',')})`;
}

// Decorate slips and specimens inside root: edges + gentle tilt.
export function decorate(root) {
  root.querySelectorAll('.slip, .specimen').forEach((el, i) => {
    const key = el.dataset.key || el.textContent.slice(0, 40) + i;
    const seed = hash(key);
    el.style.setProperty('--deckle', deckle(seed));
    if (!el.classList.contains('no-tilt') && !el.closest('.log')) {
      const t = (rng(seed + 1)() - 0.5) * 1.3;
      el.style.setProperty('--tilt', t.toFixed(2) + 'deg');
    }
  });
  root.querySelectorAll('[data-draw]').forEach((el) => drawOn(el));
}

// Animate an SVG's stroked paths drawing themselves in (like a pen).
export function drawOn(svg, { ms = 900, delay = 0 } = {}) {
  const paths = [...svg.querySelectorAll('path, line, polyline, circle, ellipse')].filter((p) => p.getAttribute('stroke') || getComputedStyle(p).stroke !== 'none');
  if (!paths.length) return;
  if (reducedMotion()) return;
  const lens = paths.map((p) => {
    try { return p.getTotalLength(); } catch (e) { return 0; }
  });
  paths.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]} ${lens[i]}`; p.style.strokeDashoffset = lens[i]; });
  const t0 = performance.now() + delay;
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  const step = (t) => {
    const k = Math.min(1, Math.max(0, (t - t0) / ms));
    const e = 1 - Math.pow(1 - k, 2);
    let budget = e * total;
    paths.forEach((p, i) => {
      const use = Math.min(lens[i], Math.max(0, budget));
      p.style.strokeDashoffset = lens[i] - use;
      budget -= lens[i];
    });
    if (k < 1) requestAnimationFrame(step);
    else paths.forEach((p) => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
  };
  requestAnimationFrame(step);
}

// Set how much of an SVG path is drawn (0..1), for scroll-linked ink.
export function inkProgress(path, k) {
  const L = path._len || (path._len = path.getTotalLength());
  path.style.strokeDasharray = `${L} ${L}`;
  path.style.strokeDashoffset = (L * (1 - Math.max(0, Math.min(1, k)))).toFixed(1);
}

// A rubber stamp coming down: big and light → thunk → settle, with a wobble.
export function thunk(el, { rot = -8 } = {}) {
  if (!el) return;
  if (reducedMotion()) { el.style.opacity = '.9'; return; }
  const t0 = performance.now();
  const ms = 420;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    let s, o;
    if (k < 0.55) { const a = k / 0.55; s = 1.8 - 0.86 * a * a; o = 0.15 + 0.85 * a; }
    else { const a = (k - 0.55) / 0.45; s = 0.94 + 0.06 * Math.sin(a * Math.PI * 0.5); o = 1 - 0.1 * a; }
    el.style.transform = `scale(${s.toFixed(3)}) rotate(${(rot + (1 - k) * 6).toFixed(2)}deg)`;
    el.style.opacity = o.toFixed(2);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Press a specimen in: the painting drops and settles, then tape appears.
export function pressIn(img, tape) {
  if (reducedMotion() || !img) return;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 520);
    const e = 1 - Math.pow(1 - k, 3);
    img.style.transform = `translateY(${(-26 * (1 - e)).toFixed(1)}px) rotate(${(-12 * (1 - e)).toFixed(1)}deg) scale(${(1.15 - 0.15 * e).toFixed(3)})`;
    if (tape) tape.style.opacity = k > 0.6 ? ((k - 0.6) / 0.4).toFixed(2) : '0';
    if (k < 1) requestAnimationFrame(step);
    else { img.style.transform = ''; if (tape) tape.style.opacity = ''; }
  };
  requestAnimationFrame(step);
}

// ---------------------------------------------------------------------------
// Hand-drawn doodles (SVG). Slight irregularity baked into each path.
const D = (inner, vb = '0 0 32 32', cls = 'ico') =>
  `<svg viewBox="${vb}" class="${cls}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const doodles = {
  today: D('<path d="M16 9.5c3.4-.2 6.3 2.6 6.4 6 .2 3.6-2.6 6.5-6.1 6.6-3.6.1-6.5-2.7-6.6-6.2C9.6 12.4 12.4 9.7 16 9.5z"/><path d="M16 3.2v3.1M16 26v3M3.4 16h3M25.8 16.3h3M7 7.3l2.2 2.1M23 23.1l2 2M6.8 25.2l2.3-2M22.9 9.1 25 7"/>'),
  plan: D('<path d="M6 6.5c4.8-.4 9.6.3 14.3 0M6.3 12.6c3.6.2 7.1-.3 10.8.1M6 18.8c5.2-.3 10.3.2 15.4 0M6.2 25c2.9.2 5.7-.2 8.6.1"/><path d="M23 21.5c1.3 2 2.5 3.7 3.2 6-2.4-.5-4.2-1.2-6-2.6"/>'),
  explore: D('<path d="M4 27.5 12.3 11l5.4 8.4 3.8-5.2 7 13.3z"/><path d="M22.8 7.2c1.3-.2 2.4.9 2.4 2.2 0 1.2-1 2.3-2.3 2.3a2.3 2.3 0 0 1-.1-4.5z"/>'),
  kids: D('<path d="M16 27c-5-4-10.2-8-10.4-13.3-.2-3.4 2.3-6 5.2-6 2.2 0 4 1.3 5.2 3.4 1.3-2.2 3.2-3.5 5.4-3.4 3 .2 5.1 2.9 4.8 6.2-.5 5.2-5.3 9.2-10.2 13.1z"/>'),
  faith: D('<path d="M16 3.5c.3 8.3-.2 16.6.2 25M9.3 11.3c4.6.3 9 0 13.6.2"/>'),
  back: D('<path d="M19.6 7.2c-3.2 3-6.1 5.8-9.2 8.9 3 2.9 6.2 5.8 9.3 8.8"/>'),
  map: D('<path d="M4 7.6 11.4 5l9.1 3 7.6-2.7v19.2L20.4 27l-9-3.2L4 26.4z"/><path d="M11.4 5.2v18.4M20.4 8.1V27"/>'),
  car: D('<path d="M5.5 20.2 7.6 13c.4-1.3 1.6-2 2.9-2h10.9c1.4 0 2.5.8 2.9 2.1l2 7"/><path d="M3.8 20.3c7.8-.3 16.5-.4 24.4.1l-.2 5.2c-8-.3-16.1-.1-24.1 0z"/><path d="M9 25.8v1.8M23.2 25.6v2"/>'),
  walk: D('<path d="M17.8 4.4c1.2 0 2.1 1 2 2.2 0 1.1-1 2-2.2 2-1.1-.1-2-1-2-2.1.1-1.2 1-2.1 2.2-2.1z"/><path d="m14.8 28 2.3-7.8-3.8-3.9 1.4-6.2 5.1 3.8 3.9 1.3M11 16.6l-2.4 4.9"/>'),
  clock: D('<path d="M16 4.2c6.5-.1 11.8 5.2 11.8 11.7.1 6.6-5.2 11.9-11.7 11.9C9.6 27.9 4.3 22.6 4.2 16 4.2 9.6 9.5 4.3 16 4.2z"/><path d="M16 9.1c.1 2.4-.2 4.6.1 7l4 2.7"/>'),
  cup: D('<path d="M5.3 11c5.5-.3 11.1.1 16.5 0-.3 3.6.6 7.6-1.5 10.8-2.6 3.6-9.3 3.8-12.2.4-2.4-3-2.3-7.4-2.8-11.2z"/><path d="M21.8 13.2c3.3-1.3 5.7 1.2 4.9 3.8-.6 2-2.9 2.7-5.3 2.4M10 4.6c-1 1.3.9 2.5 0 3.8M14.3 4.2c-1 1.3.9 2.6 0 3.9"/>'),
  pack: D('<path d="M6.3 11.5c6.5-.4 12.9.1 19.4-.1l-.6 16c-6.2.2-12.3-.1-18.4.1z"/><path d="M11.7 11.3c-.2-2.8.7-5.8 4.3-5.8 3.7.1 4.5 3 4.3 5.9M6.6 18.4c6.2.2 12.6-.2 18.8.1"/>'),
  list: D('<path d="M11.5 8.3c5.5-.2 11-.1 16.5 0M11.6 16.2c5.4.2 10.8-.2 16.3 0M11.4 24c5.6-.2 11.1.2 16.6 0"/><path d="M4.6 8.2h1.5M4.4 16.1h1.6M4.6 24h1.4"/>'),
  star: D('<path d="M16 3.8c1.2 3.4 2.3 6.6 3.4 9.2 3.2.1 6.2.2 9.1.4-2.4 2-4.8 3.8-7.3 5.7 1 3.1 1.8 6.3 2.8 9.4-2.6-1.9-5.3-3.8-8.1-5.6-2.6 1.9-5.3 3.8-7.9 5.6 1-3.1 2-6.2 2.9-9.3-2.4-1.9-4.8-3.7-7.2-5.6 3 0 6-.2 9-.3 1.1-3.2 2.2-6.3 3.3-9.5z"/>'),
  info: D('<path d="M16 4.1c6.6 0 11.9 5.3 11.8 11.9 0 6.5-5.4 11.8-11.9 11.8-6.5-.1-11.7-5.4-11.7-11.9C4.3 9.4 9.5 4.2 16 4.1z"/><path d="M16 14.3c.1 3 .1 5.9 0 8.8M16 9.6v.4"/>'),
  share: D('<path d="M16 19.4c-.1-5.3.1-10.4 0-15.6M10.4 9.3c1.9-1.8 3.8-3.7 5.6-5.6 1.9 1.9 3.8 3.7 5.6 5.6"/><path d="M6.8 16.4c-.2 3.4-.1 6.9.1 10.3 6.1.4 12.1.2 18.2 0 .1-3.4.2-6.9 0-10.3"/>'),
  gear: D('<path d="M16 11.1c2.7 0 4.9 2.2 4.9 4.9 0 2.7-2.3 4.9-5 4.9a4.9 4.9 0 0 1 .1-9.8z"/><path d="M16 3.6v3.8M16 24.6v3.8M3.6 16h3.8M24.6 16h3.8M7.2 7.3l2.7 2.7M22.1 22.2l2.7 2.6M7.2 24.8l2.7-2.7M22.1 9.9l2.7-2.7"/>'),
  sparkle: D('<path d="M16 3.8c.8 5.3 3 8.6 8.6 9.7-5.4 1.3-7.8 4.4-8.7 9.8-1-5.3-3.4-8.6-8.6-9.8 5.2-1 7.7-4.3 8.7-9.7z"/>'),
  eye: D('<path d="M3.3 16.2c3.2-5.2 7.6-8.4 12.8-8.4 5.4 0 9.7 3.4 12.6 8.3-3 4.9-7.3 8.1-12.8 8-5.2 0-9.5-3.1-12.6-7.9z"/><path d="M16 12.2c2.2-.1 4 1.7 3.9 3.9 0 2.1-1.8 3.9-4 3.8a3.9 3.9 0 0 1 .1-7.7z"/>'),
  book: D('<path d="M16 8.3c-3.6-2.5-7.7-2.9-11.8-2V25c4.2-.8 8.2-.3 11.9 2.2 3.6-2.4 7.6-3 11.8-2.2V6.3C23.8 5.4 19.6 5.8 16 8.3zM16 8.4v18.7"/>'),
  pray: D('<path d="M16.1 4.2c-2.6 3-4 7-4 11.2l-4.5 6.2 3.8 3 4.5-5.9 4.4 5.9 3.9-3.1-4.4-6.1c.1-4.2-1.2-8.2-3.7-11.2zM16.1 4.3v14.3"/>'),
  check: D('<path d="M5.5 17.2c2.6 2 4.6 4.3 6.2 7.2 4-7.2 8.8-13.8 15-19.8"/>'),
  moon: D('<path d="M22.8 22.4c-6.3 1.2-12.2-3-13.2-9.2-.5-3.2.3-6.2 2-8.7C6.2 5.8 3 11.4 4.4 17.1c1.6 6.4 8.1 10.4 14.5 8.8 2.6-.7 4.6-2 6.2-3.9-.8.2-1.5.3-2.3.4z"/>'),
  leaf: D('<path d="M16 28.4v-6.5M16 22c-6.8-.2-9.6-6.4-8.4-14.6 6.4-.4 14.1.5 14.8 8.3.4 4.1-2.5 6.4-6.4 6.3z"/><path d="M16 21.8c-.7-4.3-1.7-7.8-4.1-11"/>'),
  ext: D('<path d="M18.3 5c2.9 0 5.8-.1 8.7.1v8.6M26.8 5.2 14.5 17.6"/><path d="M22.8 18.4c0 2.8.1 5.6-.1 8.5-5.6.2-11.3.1-16.9 0-.1-5.7-.1-11.3.1-16.9 2.8-.2 5.6-.1 8.4-.1"/>'),
  sun: D('<path d="M16 10.2c3.2 0 5.8 2.6 5.7 5.8.1 3.2-2.6 5.8-5.8 5.8a5.8 5.8 0 0 1 .1-11.6z"/><path d="M16 3.2v3M16 26.2v2.8M3.2 16h3M26 16h2.8"/>'),
  sunset: D('<path d="M4 23.2c8.1-.3 16.1.2 24 0M8.4 19.2c.1-4.2 3.5-7.4 7.7-7.3 4.1 0 7.3 3.3 7.4 7.4M16 3.6v4.6M12.2 6.3 16 9.8l3.8-3.6"/>'),
  signal: D('<path d="M4.6 26.5h.5M10.5 26.5v-5.2M16.2 26.6V16M22 26.5V11M27.6 26.4V5.6"/>'),
  plus: D('<path d="M16 6.3c.2 6.5 0 12.9.1 19.4M6.3 16.1c6.5-.2 12.9.1 19.4-.1"/>'),
  speaker: D('<path d="M5 12.6v6.9h4.8l6 4.7V7.7l-6 4.9z"/><path d="M20.2 12.2c2 2.1 2.1 5.4 0 7.6"/>'),
  pin: D('<path d="M16 28.2c-4.2-5.4-8.5-10-8.4-15.3.1-4.6 3.8-8.2 8.4-8.1 4.6 0 8.3 3.7 8.3 8.3.1 5.3-4.2 9.8-8.3 15.1z"/><path d="M16 9.6c1.9 0 3.4 1.5 3.4 3.4a3.4 3.4 0 0 1-6.8 0c0-1.9 1.5-3.4 3.4-3.4z"/>'),
};
// Log markers: a hand-inked circle (flexible) and a filled seal (anchor).
export const logDot = (anchor) => anchor
  ? `<svg class="dot" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.4c4.3-.2 7.6 3.3 7.6 7.6 0 4.2-3.4 7.6-7.7 7.6-4.2 0-7.5-3.4-7.5-7.6C2.4 5.8 5.8 2.5 10 2.4z" fill="currentColor" opacity=".9"/><path d="M6.4 10.3 9 12.8l4.6-5.6" stroke="#fbf6ea" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`
  : `<svg class="dot" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3c3.9-.1 7 3.1 6.9 7 .1 3.8-3.1 7-7 6.9-3.8 0-6.9-3.2-6.8-7C3.2 6 6.2 3 10 3z" fill="var(--page-c)" stroke="currentColor" stroke-width="1.6"/></svg>`;

// Hand-drawn flourish under titles (drawn in by drawOn).
export const flourish = () =>
  `<svg class="flourish" viewBox="0 0 190 14" data-draw aria-hidden="true"><path d="M2 8c20-5 40 3 62-1 16-3 26-6 40-2 12 3 18 6 30 3 14-4 30-6 54 0" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M92 5c3-4 7-4 9 0-2 4-6 4-9 0z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`;

// Pencil ring drawn around a chosen word.
export const ring = (seed = 1) => {
  const r = rng(seed);
  const w = () => (r() - 0.5) * 4;
  return `<svg class="ring" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M${8 + w()} ${22 + w()} C${6 + w()} ${6 + w()} ${50 + w()} ${2 + w()} ${86 + w()} ${8 + w()} C${100 + w()} ${14 + w()} ${96 + w()} ${34 + w()} ${60 + w()} ${37 + w()} C${26 + w()} ${40 + w()} ${2 + w()} ${32 + w()} ${12 + w()} ${12 + w()} C${16 + w()} ${7 + w()} ${22 + w()} ${5 + w()} ${30 + w()} ${4 + w()}" fill="none" stroke="var(--rust)" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
};

// Hand-drawn star for "maybe", outline or filled.
export const maybeStar = (on) =>
  `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.8c1.2 3.4 2.3 6.6 3.4 9.2 3.2.1 6.2.2 9.1.4-2.4 2-4.8 3.8-7.3 5.7 1 3.1 1.8 6.3 2.8 9.4-2.6-1.9-5.3-3.8-8.1-5.6-2.6 1.9-5.3 3.8-7.9 5.6 1-3.1 2-6.2 2.9-9.3-2.4-1.9-4.8-3.7-7.2-5.6 3 0 6-.2 9-.3 1.1-3.2 2.2-6.3 3.3-9.5z" fill="${on ? 'var(--gold-wash)' : 'none'}" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;

// Paperclip.
export const paperclip = () =>
  `<svg class="paperclip" viewBox="0 0 22 52" aria-hidden="true"><path d="M7 14V8a4 4 0 0 1 8 0v34a6 6 0 0 1-12 0V12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

// A round rubber stamp with text on a circle and an inner label.
export function stampSVG({ top = 'EASTERN SIERRA', bottom = 'OCT · 2026', mid = 'FOUND', seed = 3, size = 110 } = {}) {
  const r = rng(seed);
  const id = 'st' + seed;
  const holes = Array.from({ length: 26 }, () => `<circle cx="${(10 + r() * 100).toFixed(1)}" cy="${(10 + r() * 100).toFixed(1)}" r="${(0.6 + r() * 1.8).toFixed(1)}" fill="black"/>`).join('');
  return `<svg viewBox="0 0 120 120" width="${size}" aria-hidden="true"><defs>
<path id="${id}a" d="M20 60a40 40 0 1 1 80 0"/><path id="${id}b" d="M17 60a43 43 0 0 0 86 0"/>
<mask id="${id}m"><rect width="120" height="120" fill="white"/>${holes}</mask></defs>
<g mask="url(#${id}m)" fill="currentColor" stroke="currentColor">
<circle cx="60" cy="60" r="54" fill="none" stroke-width="3.2"/><circle cx="60" cy="60" r="47" fill="none" stroke-width="1.2"/>
<text font-family="Courier Prime, monospace" font-weight="700" font-size="11.5" letter-spacing="2.4" stroke="none"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">${top}</textPath></text>
<text font-family="Courier Prime, monospace" font-weight="700" font-size="10.5" letter-spacing="2.2" stroke="none"><textPath href="#${id}b" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">${bottom}</textPath></text>
<path d="M18 50 H102 M18 72 H102" stroke-width="1.4"/>
<text x="60" y="66.5" text-anchor="middle" font-family="Fell, Georgia, serif" font-size="19" stroke="none" letter-spacing="1">${mid}</text>
</g></svg>`;
}

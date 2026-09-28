// Leaf hunt effects that run outside React: the "found" burst (tiny copies of
// the found thing's own silhouette in the kid's color) and the all-found leaf
// fall. Both draw on one fixed layer on <body>, move with transforms only and
// stop their frame loop when idle. Callers skip them under reduced motion.
import { specimenSilhouette } from '@/art';

const SVG = 'http://www.w3.org/2000/svg';

type Particle = {
  svg: SVGSVGElement;
  path: SVGPathElement;
  alive: boolean;
  born: number;
  life: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  // leaf fall only
  sway?: number;
  phase?: number;
  freq?: number;
  x0?: number;
  delay?: number;
};

let layer: HTMLDivElement | null = null;
function getLayer() {
  if (layer && layer.isConnected) return layer;
  layer = document.createElement('div');
  layer.className = 'hunt-fx';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  return layer;
}

// Silhouette boxes, measured once per id (path data is in drawing units).
const boxes = new Map<string, { x: number; y: number; w: number; h: number }>();
function boxFor(id: string, d: string, probe: SVGPathElement) {
  let b = boxes.get(id);
  if (!b) {
    probe.setAttribute('d', d);
    try {
      const r = probe.getBBox();
      b = r.width && r.height ? { x: r.x, y: r.y, w: r.width, h: r.height } : { x: 0, y: 0, w: 96, h: 96 };
    } catch {
      b = { x: 0, y: 0, w: 96, h: 96 };
    }
    boxes.set(id, b);
  }
  return b;
}

function makeParticle(): Particle {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'hunt-fx-p');
  const path = document.createElementNS(SVG, 'path');
  svg.appendChild(path);
  getLayer().appendChild(svg);
  return { svg, path, alive: false, born: 0, life: 0, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, size: 10 };
}

function shape(p: Particle, id: string, color: string, size: number) {
  const d = specimenSilhouette(id);
  p.path.setAttribute('d', d);
  const b = boxFor(id, d, p.path);
  const k = size / Math.max(b.w, b.h);
  p.svg.setAttribute('viewBox', `${b.x} ${b.y} ${b.w} ${b.h}`);
  p.svg.setAttribute('width', String(+(b.w * k).toFixed(1)));
  p.svg.setAttribute('height', String(+(b.h * k).toFixed(1)));
  p.path.style.fill = color;
  p.size = size;
}

// ---------------------------------------------------------------------------
// Found burst: 7 particles from a pool of 9 (the oldest are reused).

const POOL = 9;
const GRAVITY = 900; // px/s²
const pool: Particle[] = [];
let burstRaf = 0;

function stepBurst(t: number) {
  let any = false;
  for (const p of pool) {
    if (!p.alive) continue;
    const age = (t - p.born) / 1000;
    if (age >= p.life) {
      p.alive = false;
      p.svg.style.opacity = '0';
      continue;
    }
    any = true;
    const x = p.x + p.vx * age;
    const y = p.y + p.vy * age + 0.5 * GRAVITY * age * age;
    const r = p.rot + p.vr * age;
    const k = age / p.life;
    // Hold, then fade out over the last 60% of the flight.
    const o = k < 0.4 ? 1 : 1 - (k - 0.4) / 0.6;
    const s = age < 0.08 ? 0.4 + (age / 0.08) * 0.6 : 1;
    p.svg.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${r.toFixed(1)}deg) scale(${s.toFixed(3)})`;
    p.svg.style.opacity = o.toFixed(3);
  }
  burstRaf = any ? requestAnimationFrame(stepBurst) : 0;
}

/**
 * Launch `n` silhouettes of `id` from (x, y) in viewport px, in `color`
 * (a CSS color, e.g. "var(--kid-2)"). 300–520 px/s, gravity 900 px/s²,
 * spin up to ±360°/s, fading out over 0.9 s.
 */
export function burst(x: number, y: number, id: string, color: string, n = 7) {
  if (typeof document === 'undefined') return;
  while (pool.length < POOL) pool.push(makeParticle());
  const now = performance.now();
  // Free particles first, then the oldest live ones.
  const order = [...pool].sort((a, b) => Number(a.alive) - Number(b.alive) || a.born - b.born);
  for (let i = 0; i < Math.min(n, POOL); i++) {
    const p = order[i];
    // Fan upward: -160°..-20°, evenly spread with a little jitter.
    const a = ((-160 + (140 * (i + 0.5)) / n + (Math.random() - 0.5) * 16) * Math.PI) / 180;
    const v = 300 + Math.random() * 220;
    shape(p, id, color, 8 + Math.random() * 4.5);
    p.alive = true;
    p.born = now;
    p.life = 0.9;
    p.x = x;
    p.y = y;
    p.vx = Math.cos(a) * v;
    p.vy = Math.sin(a) * v;
    p.rot = Math.random() * 360;
    p.vr = (Math.random() * 2 - 1) * 360;
    p.svg.style.opacity = '0';
  }
  if (!burstRaf) burstRaf = requestAnimationFrame(stepBurst);
}

// ---------------------------------------------------------------------------
// Leaf fall: 24 leaves drift down over about 2.4 s, then the layer empties.

let fallRaf = 0;
let fall: Particle[] = [];

function stepFall(t: number) {
  const H = window.innerHeight;
  let any = false;
  for (const p of fall) {
    const age = (t - p.born) / 1000 - (p.delay ?? 0);
    if (age < 0) {
      any = true;
      continue;
    }
    if (age >= p.life) {
      if (p.alive) {
        p.alive = false;
        p.svg.remove();
      }
      continue;
    }
    any = true;
    const k = age / p.life;
    const y = p.y + p.vy * age + 0.5 * 120 * age * age;
    const sway = Math.sin((p.phase ?? 0) + age * (p.freq ?? 3)) * (p.sway ?? 20);
    const x = (p.x0 ?? 0) + sway;
    const r = p.rot + Math.cos((p.phase ?? 0) + age * (p.freq ?? 3)) * 38 + p.vr * age;
    const o = k < 0.12 ? k / 0.12 : k > 0.72 ? Math.max(0, 1 - (k - 0.72) / 0.28) : 1;
    p.svg.style.transform = `translate3d(${x.toFixed(1)}px, ${Math.min(y, H + 40).toFixed(1)}px, 0) translate(-50%, -50%) rotate(${r.toFixed(1)}deg)`;
    p.svg.style.opacity = o.toFixed(3);
  }
  if (any) fallRaf = requestAnimationFrame(stepFall);
  else {
    fallRaf = 0;
    fall = [];
  }
}

/** A gentle fall of 24 leaves across the screen, in the given colors. */
export function leafFall(colors: string[], ids: string[] = ['aspen', 'aspen', 'heart', 'birch', 'cottonwood', 'red']) {
  if (typeof document === 'undefined') return;
  cancelAnimationFrame(fallRaf);
  fall.forEach((p) => p.svg.remove());
  fall = [];
  const W = window.innerWidth;
  const now = performance.now();
  for (let i = 0; i < 24; i++) {
    const p = makeParticle();
    p.svg.style.opacity = '0';
    shape(p, ids[i % ids.length], colors[i % colors.length], 14 + Math.random() * 12);
    p.alive = true;
    p.born = now;
    p.delay = (i / 24) * 0.7 + Math.random() * 0.12;
    p.life = 1.5 + Math.random() * 0.25;
    p.x0 = ((i * 0.618034) % 1) * W * 0.92 + W * 0.04;
    p.y = -30 - Math.random() * 60;
    p.vy = 300 + Math.random() * 160;
    p.rot = Math.random() * 360;
    p.vr = (Math.random() * 2 - 1) * 60;
    p.sway = 14 + Math.random() * 22;
    p.phase = Math.random() * Math.PI * 2;
    p.freq = 2.6 + Math.random() * 1.8;
    fall.push(p);
  }
  fallRaf = requestAnimationFrame(stepFall);
}

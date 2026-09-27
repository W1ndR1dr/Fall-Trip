// Real-topography renderer. Contour polygons come straight from
// /home/user/Fall-Trip/public/img/topo/*.json (east is UP, so the drive runs
// bottom -> top). We draw "illuminated contours" (Tanaka method): every
// elevation band is filled with a hypsometric tint, and a copy shifted toward
// the sun leaves a lit sliver on slopes that face it; a copy shifted away leaves
// a shaded sliver. Dark mode = evening, sun low in the WEST (bottom of the map).
// Light mode = early morning, sun low in the EAST (top of the map).
import fs from 'fs';

const DIR = '/home/user/Fall-Trip/public/img/topo/';
const cache = {};
export function loadTopo(name) {
  if (!cache[name]) cache[name] = JSON.parse(fs.readFileSync(DIR + name + '.json', 'utf8'));
  return cache[name];
}

// Trim path precision to 1 decimal is already done in the source; we just
// round to integers-with-half to cut size where it is visually lossless.
const slim = (d) => d.replace(/(\d+)\.(\d)/g, (m, a, b) => (b === '0' ? a : `${a}.${b}`));

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
function ramp(stops, t) {
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      return mix(c0, c1, (t - t0) / (t1 - t0));
    }
  }
  return stops[stops.length - 1][1];
}

// Palettes. `t` is normalised elevation over the map's own range.
const PAL = {
  dark: {
    water: '#0b0908',
    ramp: [[0, '#100b08'], [0.3, '#140e0a'], [0.5, '#1b130d'], [0.66, '#271a10'], [0.8, '#3b2412'], [0.92, '#5e3515'], [1, '#9a5a22']],
    lit: 'rgba(255,184,100,VAL)', litMin: 0.08, litMax: 0.72,
    shade: 'rgba(0,0,0,0.55)',
    sun: +1, // sun toward +y (west, bottom)
  },
  light: {
    water: '#e7eef0',
    ramp: [[0, '#f8f3ec'], [0.3, '#f4ece1'], [0.55, '#efe2d2'], [0.75, '#ead3b9'], [0.9, '#e8c39c'], [1, '#e9b27a']],
    lit: 'rgba(255,255,255,VAL)', litMin: 0.55, litMax: 0.95,
    shade: 'rgba(122,72,30,0.26)',
    sun: -1, // sun toward -y (east, top)
  },
};

/**
 * Render a topo map as an <svg> string.
 * opts: { name, theme, view:[x,y,w,h], width, height, id, shift, route:[keys], routeParts, stops:[{key,label,sub,anchor:'l'|'r'}], here, next, mask }
 */
export function topoSVG(opts) {
  const { name, theme, view, width, height, id } = opts;
  const T = loadTopo(name);
  const P = PAL[theme];
  const levels = T.layers.map((l) => l.level);
  const lo = Math.min(...levels), hi = Math.max(...levels);
  const shift = opts.shift ?? 0.9;
  const sx = 0, sy = P.sun * shift;

  // Keep only bands that intersect the view (cheap bbox test on the path).
  const [vx, vy, vw, vh] = view;
  const defs = [];
  const body = [];
  T.layers.forEach((l, i) => {
    const t = (l.level - lo) / (hi - lo || 1);
    const pid = `${id}-L${i}`;
    defs.push(`<path id="${pid}" d="${slim(l.d)}"/>`);
    const fill = ramp(P.ramp, t);
    const litA = (P.litMin + (P.litMax - P.litMin) * Math.pow(t, 1.2)).toFixed(2);
    body.push(
      `<use href="#${pid}" transform="translate(${sx} ${sy})" fill="${P.lit.replace('VAL', litA)}"/>` +
      `<use href="#${pid}" transform="translate(${-sx} ${-sy})" fill="${P.shade}"/>` +
      `<use href="#${pid}" fill="${fill}"/>`
    );
  });

  // Base: the lowest band colour everywhere (below-first-contour ground).
  const land = name === 'route' ? P.water : ramp(P.ramp, 0);

  return `<svg class="topo ${opts.cls || ''}" viewBox="${view.join(' ')}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>${defs.join('')}</defs>
  <rect x="${vx - 20}" y="${vy - 20}" width="${vw + 40}" height="${vh + 40}" fill="${land}"/>
  ${body.join('')}
  ${opts.overlay || ''}
</svg>`;
}

// ---------------------------------------------------------------------------
// Route geometry: a centripetal Catmull-Rom spline through the real stop
// coordinates (the JSON has stops, not road geometry; the production build
// would use simplified OSM road lines).
export function splinePath(pts, tension = 0.5) {
  if (pts.length < 2) return '';
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2, p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2, p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

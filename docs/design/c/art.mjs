// Crisp, generated SVG specimens for the leaf hunt.
// Every shape uses CSS variables so one symbol renders two ways:
//   unfound  -> a clean line drawing in currentColor (the reference picture)
//   found    -> flat botanical color (--f*, --l*, --d* set per item)
import polygonClipping from 'polygon-clipping';

const r1 = (n) => Math.round(n * 10) / 10;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
const toD = (pts, close = true) => 'M' + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L') + (close ? 'Z' : '');

// Monotone-ish Catmull-Rom interpolation over (angle, radius) control points.
function interp(cps, x) {
  let i = 0; while (i < cps.length - 2 && x > cps[i + 1][0]) i++;
  const p0 = cps[Math.max(0, i - 1)], p1 = cps[i], p2 = cps[i + 1], p3 = cps[Math.min(cps.length - 1, i + 2)];
  const t = (x - p1[0]) / (p2[0] - p1[0] || 1);
  const m1 = (p2[1] - p0[1]) / ((p2[0] - p0[0]) || 1) * (p2[0] - p1[0]);
  const m2 = (p3[1] - p1[1]) / ((p3[0] - p1[0]) || 1) * (p2[0] - p1[0]);
  const t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
}

// Polar leaf: control points [deg from tip (0) clockwise to base (180), r]. Mirrored.
function polarOutline(cps, R, n = 360) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = -180 + (360 * i) / n; // start at base on the left, sweep over the tip, end at base on the right
    const r = R * interp(cps, Math.abs(a));
    const rad = (a * Math.PI) / 180;
    pts.push([Math.sin(rad) * r, -Math.cos(rad) * r]);
  }
  return pts;
}

// Width-profile leaf (base at 0,0; tip at 0,-L).
function widthOutline(L, w, n = 220) {
  const right = [], left = [];
  for (let i = 0; i <= n; i++) { const t = i / n; right.push([w(t), -t * L]); }
  for (let i = n; i >= 0; i--) { const t = i / n; left.push([-w(t), -t * L]); }
  return [...left.reverse().slice(0, -1).reverse(), ...right].length ? [...right.reverse(), ...left.reverse()] : [];
}

// Add teeth along a closed outline. Teeth lean toward the tip (highest point).
function teeth(pts, { period = 4, depth = 1.2, kind = 'serrate', double = 0, baseGuard = 0.1, tipGuard = 0.05 }) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const S = cum[cum.length - 1];
  let tipI = 0; pts.forEach((p, i) => { if (p[1] < pts[tipI][1]) tipI = i; });
  const sTip = cum[tipI];
  // orientation: signed area
  let A = 0; for (let i = 0; i < pts.length - 1; i++) A += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1];
  const sign = A > 0 ? 1 : -1;
  const N = Math.round(S / (period / 10));
  const out = [];
  let j = 0;
  for (let k = 0; k <= N; k++) {
    const s = (k * S) / N;
    while (j < cum.length - 2 && cum[j + 1] < s) j++;
    const seg = cum[j + 1] - cum[j] || 1, u = (s - cum[j]) / seg;
    const a = pts[j], b = pts[j + 1];
    const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
    let tx = (b[0] - a[0]) / seg, ty = (b[1] - a[1]) / seg;
    const nx = -ty * sign, ny = tx * sign;
    // phase measured from the tip outward on both sides, so teeth point at the tip
    const d = Math.abs(s - sTip);
    const p = (d / period) % 1;
    let g = kind === 'crenate' ? Math.pow(Math.sin(Math.PI * p), 0.55) : (p < 0.82 ? Math.pow(1 - p / 0.82, 1.1) : (p - 0.82) / 0.18);
    if (double) { const p2 = ((d / (period / 2.6)) % 1); g += double * (p2 < 0.8 ? 1 - p2 / 0.8 : (p2 - 0.8) / 0.2); }
    const m = smooth(0, baseGuard * S, s) * smooth(0, baseGuard * S, S - s) * smooth(tipGuard * S * 0.3, tipGuard * S, d);
    const off = depth * g * m;
    out.push([x - nx * off, y - ny * off]);
  }
  return out;
}

// ------------------------------------------------------------------ builders
const g = (inner, t = '') => `<g${t ? ` transform="${t}"` : ''}>${inner}</g>`;
const blade = (d, n = 1) => `<path class="bl" d="${d}" fill="var(--f${n}, none)" stroke="var(--l${n}, currentColor)" stroke-width="1.4" stroke-linejoin="round"/>`;
const veins = (d, w = 0.9, n = 1) => `<path class="vn" d="${d}" fill="none" stroke="var(--d${n}, currentColor)" stroke-opacity="var(--dop, .55)" stroke-width="${w}" stroke-linecap="round"/>`;
const stem = (d, n = 1) => `<path d="${d}" fill="none" stroke="var(--l${n}, currentColor)" stroke-width="1.8" stroke-linecap="round"/>`;

function pinnateVeins(tipY, pairs, { t0 = 0.12, t1 = 0.78, reach = 30, rise = 0.16, curve = 0.5, widthAt }) {
  const L = -tipY;
  let d = `M0 0Q${r1(L * 0.02)} ${r1(-L * 0.5)} 0 ${r1(tipY * 0.94)}`;
  for (let i = 0; i < pairs; i++) {
    const t = t0 + ((t1 - t0) * i) / Math.max(1, pairs - 1);
    const te = Math.min(0.97, t + rise);
    const xe = (widthAt ? widthAt(te) : reach) * 0.84;
    const y = -t * L, ye = -te * L;
    for (const sx of [1, -1]) d += `M0 ${r1(y)}Q${r1(sx * xe * curve)} ${r1(y - (ye - y) * -0.15)} ${r1(sx * xe)} ${r1(ye)}`;
  }
  return d;
}

// width function from polar outline: sample max |x| near a given height
function widthFromPts(pts) {
  const ys = pts.map((p) => p[1]); const top = Math.min(...ys);
  return (t) => {
    const y = top * t; let best = 0;
    for (const [x, py] of pts) if (Math.abs(py - y) < 1.2) best = Math.max(best, Math.abs(x));
    return best;
  };
}

function polarLeaf({ cps, R, tooth, pairs, rot = 0, stemLen = 14, tx = 50, ty = 84, t0, t1, rise, curve }) {
  const base = polarOutline(cps, R);
  const out = tooth ? teeth(base, tooth) : base;
  const top = Math.min(...base.map((p) => p[1]));
  const v = pinnateVeins(top, pairs, { widthAt: widthFromPts(base), t0, t1, rise, curve });
  return g(stem(`M0 0Q1.5 ${stemLen * 0.6} ${-1} ${stemLen}`) + blade(toD(out)) + veins(v), `translate(${tx} ${ty}) rotate(${rot})`);
}

function widthLeaf({ L, w, tooth, pairs, rot = 0, stemLen = 10, tx = 50, ty = 90, t0, t1, rise, curve }) {
  const right = [], left = [];
  const n = 240;
  for (let i = 0; i <= n; i++) { const t = i / n; right.push([w(t), -t * L]); }
  for (let i = n; i >= 0; i--) { const t = i / n; left.push([-w(t), -t * L]); }
  const base = [...left.reverse(), ...right.slice(1)].reverse(); // base-left -> tip -> base-right
  // rebuild as: start at base left going up the left edge, over the tip, down the right edge
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n; pts.push([-w(t), -t * L]); }
  for (let i = n - 1; i >= 0; i--) { const t = i / n; pts.push([w(t), -t * L]); }
  const out = tooth ? teeth(pts, tooth) : pts;
  const v = pinnateVeins(-L, pairs, { widthAt: w, t0, t1, rise, curve });
  return g(stem(`M0 0Q1 ${stemLen * 0.6} -0.5 ${stemLen}`) + blade(toD(out)) + veins(v, 0.8), `translate(${tx} ${ty}) rotate(${rot})`);
}

// Maple (Acer glabrum): union of three toothed lobes, palmate veins.
function maple() {
  const lobe = (L, W, ang) => {
    const pts = [];
    const n = 120;
    const w = (t) => W * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.9)), 0.9) * (1 - 0.25 * t);
    for (let i = 0; i <= n; i++) { const t = i / n; pts.push([-w(t), -t * L]); }
    for (let i = n - 1; i >= 0; i--) { const t = i / n; pts.push([w(t), -t * L]); }
    const tt = teeth(pts, { period: 4.2, depth: 1.5, double: 0.45, baseGuard: 0.18 });
    const a = (ang * Math.PI) / 180;
    return tt.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);
  };
  const lobes = [lobe(46, 15, 0), lobe(36, 13, 52), lobe(36, 13, -52), lobe(18, 8, 112), lobe(18, 8, -112)];
  const poly = polygonClipping.union(...lobes.map((p) => [[...p, p[0]]]));
  const d = poly.map((pg) => pg.map((ring) => toD(ring.slice(0, -1))).join('')).join('');
  let vd = '';
  for (const [L, ang] of [[42, 0], [32, 52], [32, -52], [15, 112], [15, -112]]) {
    const a = (ang * Math.PI) / 180;
    const ex = Math.sin(a) * L, ey = -Math.cos(a) * L;
    vd += `M0 0L${r1(ex)} ${r1(ey)}`;
    for (const f of [0.35, 0.6]) {
      const px = ex * f, py = ey * f;
      for (const s of [1, -1]) {
        const b = a + s * 0.75;
        vd += `M${r1(px)} ${r1(py)}L${r1(px + Math.sin(b) * L * 0.22)} ${r1(py - Math.cos(b) * L * 0.22)}`;
      }
    }
  }
  return g(stem('M0 0Q1.5 8 -1 16') + blade(d) + veins(vd, 0.85), 'translate(50 70)');
}

// ------------------------------------------------------------------ items
// Egg-param leaf: tip up. a = half width, b = half length, egg = wider toward base,
// tip = acuminate pull, notch = cordate base. Origin = petiole attachment.
function eggLeaf({ a, b, egg = 0.15, tip = 0, tipW = 0.35, notch = 0, notchW = 0.5, tooth, pairs, rot = 0, stemLen = 12, tx = 50, ty = 84, t0 = 0.12, t1 = 0.74, rise = 0.16, curve = 0.5, scale = 1, palm = 0 }) {
  const n = 360, pts = [];
  for (let i = 0; i <= n; i++) {
    const ph = Math.PI + (2 * Math.PI * i) / n; // start at base, sweep left side up to tip, down right side
    let x = -a * Math.sin(ph) * (1 - egg * Math.cos(ph));
    let y = b * Math.cos(ph) * -1;
    const dTip = Math.atan2(Math.sin(ph), Math.cos(ph)); // 0 at tip
    y -= tip * Math.exp(-((dTip / tipW) ** 2));
    x *= 1 - 0.55 * Math.exp(-((dTip / (tipW * 1.1)) ** 2)) * (tip > 0 ? 1 : 0);
    const dBase = Math.atan2(Math.sin(ph - Math.PI), Math.cos(ph - Math.PI));
    y -= notch * Math.exp(-((dBase / notchW) ** 2));
    pts.push([x, y]);
  }
  // translate so attachment (base point) is at 0,0
  const by = pts[0][1];
  const P = pts.map(([x, y]) => [x * scale, (y - by) * scale]);
  const out = tooth ? teeth(P, tooth) : P;
  const top = Math.min(...P.map((p) => p[1]));
  let v = pinnateVeins(top, pairs, { widthAt: widthFromPts(P), t0, t1, rise, curve });
  if (palm) {
    // basal veins into cordate lobes
    for (const s of [1, -1]) v += `M0 0Q${r1(s * a * 0.5 * scale)} ${r1(-b * 0.1 * scale)} ${r1(s * a * 0.8 * scale)} ${r1(-b * 0.55 * scale)}`;
  }
  return g(stem(`M0 0Q1.5 ${stemLen * 0.6} ${-1} ${stemLen}`) + blade(toD(out)) + veins(v), `translate(${tx} ${ty}) rotate(${rot})`);
}

// Maple is below; the rest are egg leaves.
export const ART = {
  aspen: eggLeaf({ a: 33, b: 31, egg: 0.08, tip: 7, tipW: 0.32, notch: 6, notchW: 0.55, tooth: { period: 4.4, depth: 1.25, kind: 'crenate', baseGuard: 0.06 }, pairs: 4, ty: 80, stemLen: 14, t0: 0.12, t1: 0.62, rise: 0.22, curve: 0.55, rot: 6, palm: 1 }),
  cottonwood: eggLeaf({ a: 20, b: 34, egg: 0.32, tip: 10, tipW: 0.4, notch: 2, tooth: { period: 3.4, depth: 0.95, kind: 'crenate', baseGuard: 0.05, tipGuard: 0.12 }, pairs: 6, ty: 86, stemLen: 9, rot: -10, t0: 0.08, t1: 0.72, rise: 0.16 }),
  willow: eggLeaf({ a: 8.5, b: 40, egg: 0.05, tip: 4, tipW: 0.3, tooth: { period: 2.8, depth: 0.45, baseGuard: 0.1 }, pairs: 9, ty: 92, stemLen: 6, rot: 24, t0: 0.08, t1: 0.86, rise: 0.08, curve: 0.6 }),
  birch: eggLeaf({ a: 22, b: 27, egg: 0.25, tip: 4, tipW: 0.35, notch: 0, tooth: { period: 4.2, depth: 1.45, double: 0.5, baseGuard: 0.07 }, pairs: 5, ty: 80, stemLen: 12, rot: -14, t0: 0.12, t1: 0.72, rise: 0.15 }),
  big: eggLeaf({ a: 50, b: 47, egg: 0.1, tip: 10, tipW: 0.32, notch: 9, notchW: 0.55, tooth: { period: 5.6, depth: 1.8, kind: 'crenate', baseGuard: 0.06 }, pairs: 5, tx: 58, ty: 112, stemLen: 16, rot: -16, t0: 0.12, t1: 0.64, rise: 0.22, curve: 0.55, palm: 1 }),
  heart: eggLeaf({ a: 31, b: 30, egg: 0.02, tip: 14, tipW: 0.38, notch: 13, notchW: 0.42, tooth: { period: 4.2, depth: 0.9, kind: 'crenate', baseGuard: 0.03 }, pairs: 4, ty: 72, stemLen: 18, rot: 4, t0: 0.16, t1: 0.66, rise: 0.2, curve: 0.55, palm: 1 }),
};
ART.red = maple();

// Jeffrey pine cone: ovoid of overlapping scales ("gentle" prickles point in).
ART.cone = (() => {
  const R = rng(7); let s = '';
  const rows = 9;
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1); // 0 top .. 1 bottom
    const cy = 16 + t * 64;
    const half = 24 * Math.pow(Math.sin(Math.PI * (0.12 + t * 0.8)), 0.8);
    const n = Math.max(2, Math.round(half / 6.5));
    for (let k = 0; k < n; k++) {
      const cx = 50 - half + ((k + (r % 2) * 0.5 + 0.25) * (2 * half)) / n;
      if (Math.abs(cx - 50) > half - 2) continue;
      const w = 6.6 - Math.abs(cx - 50) / half * 1.6, h = 7.4;
      s += `<path d="M${r1(cx - w)} ${r1(cy - 1)}Q${r1(cx)} ${r1(cy - h * 0.5)} ${r1(cx + w)} ${r1(cy - 1)}Q${r1(cx + w * 0.5)} ${r1(cy + h * 0.55)} ${r1(cx)} ${r1(cy + h * 0.6)}Q${r1(cx - w * 0.5)} ${r1(cy + h * 0.55)} ${r1(cx - w)} ${r1(cy - 1)}Z" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.1" stroke-linejoin="round"/>`;
      s += `<path d="M${r1(cx)} ${r1(cy + 1)}l0 2.2" stroke="var(--d1, currentColor)" stroke-opacity="var(--dop,.55)" stroke-width="1" stroke-linecap="round"/>`;
    }
  }
  return `<path d="M50 88 L50 94" stroke="var(--l1, currentColor)" stroke-width="2.2" stroke-linecap="round"/>` + s;
})();

// Granite: a rounded boulder, salt-and-pepper crystals, one glint.
ART.granite = (() => {
  const R = rng(11);
  const rock = 'M16 74C12 60 18 44 32 36C44 29 60 28 72 34C84 40 90 54 86 68C83 78 72 82 50 82C32 82 19 81 16 74Z';
  let sp = '';
  for (let i = 0; i < 70; i++) {
    const x = 20 + R() * 64, y = 36 + R() * 44;
    const inside = ((x - 51) / 34) ** 2 + ((y - 59) / 22) ** 2 < 0.86;
    if (!inside) continue;
    const r = 0.6 + R() * 1.5, dark = R() < 0.55;
    sp += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(r * 1.6)}" height="${r1(r)}" rx=".3" transform="rotate(${Math.round(R() * 180)} ${r1(x)} ${r1(y)})" fill="${dark ? 'var(--s1, currentColor)' : 'var(--s2, none)'}" ${dark ? '' : 'stroke="var(--s2l, currentColor)" stroke-width=".5"'} opacity="${dark ? 'var(--sop,.7)' : 1}"/>`;
  }
  const star = (x, y, r) => `<path d="M${x} ${y - r}C${x + r * 0.12} ${y - r * 0.12} ${x + r * 0.12} ${y - r * 0.12} ${x + r} ${y}C${x + r * 0.12} ${y + r * 0.12} ${x + r * 0.12} ${y + r * 0.12} ${x} ${y + r}C${x - r * 0.12} ${y + r * 0.12} ${x - r * 0.12} ${y + r * 0.12} ${x - r} ${y}C${x - r * 0.12} ${y - r * 0.12} ${x - r * 0.12} ${y - r * 0.12} ${x} ${y - r}Z" fill="var(--g1, currentColor)"/>`;
  return `<path d="${rock}" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.4"/>${sp}${star(70, 30, 9)}${star(82, 44, 4.5)}`;
})();

// Beaver dam: a stump chewed to a point in front of a stick pile, water line.
ART.dam = (() => {
  const R = rng(3); let sticks = '';
  for (let i = 0; i < 26; i++) {
    const t = R(); const x = 10 + t * 62; const top = 64 - Math.sin(Math.PI * t) * 20;
    const y = top + R() * (70 - top);
    const a = (R() - 0.5) * 0.9, L = 10 + R() * 12;
    sticks += `M${r1(x - Math.cos(a) * L / 2)} ${r1(y - Math.sin(a) * L / 2)}L${r1(x + Math.cos(a) * L / 2)} ${r1(y + Math.sin(a) * L / 2)}`;
  }
  const water = 'M4 76Q14 73 24 76T44 76T64 76T84 76T98 76';
  const water2 = 'M12 84Q20 81.5 28 84T44 84';
  const stump = 'M70 82L70 52L74 40L77 30L80 40L84 52L84 82Z';
  return `<path d="M8 72Q40 36 76 72Z" fill="var(--f2, none)" stroke="none"/>` +
    `<path d="${sticks}" stroke="var(--l2, currentColor)" stroke-width="2.2" stroke-linecap="round" fill="none"/>` +
    `<path d="${stump}" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="M72 50L77 33L82 50M73 60h8M74 68h6" stroke="var(--d1, currentColor)" stroke-opacity="var(--dop,.55)" stroke-width=".9" fill="none"/>` +
    `<path d="${water} ${water2}" stroke="var(--w1, currentColor)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
})();

// Tufa tower: knobbly column on the lake, with a reflection.
ART.tufa = (() => {
  const R = rng(5); const L = [], Rr = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14; const y = 78 - t * 60; const half = 14 - t * 7 + Math.sin(t * 17) * 2.2 + (R() - 0.5) * 2.4;
    L.push([50 - half - (R() * 1.5), y]); Rr.push([50 + half + (R() * 1.5), y]);
  }
  const pts = [...L, [50 - 5, 15], [48, 12], [53, 12], [55, 15], ...Rr.reverse()];
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i]; d += `Q${r1(p[0])} ${r1(p[1])} ${r1((p[0] + q[0]) / 2)} ${r1((p[1] + q[1]) / 2)}`; }
  d += 'Z';
  const small = 'M20 78Q20 66 24 62Q28 60 30 66Q31 72 32 78Z';
  const holes = [[44, 60, 2], [55, 48, 1.6], [47, 36, 1.4], [53, 26, 1.2], [57, 66, 1.5]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="var(--d1, currentColor)" fill-opacity="var(--dop,.55)"/>`).join('');
  return `<path d="${d}" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="${small}" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.3"/>` + holes +
    `<path d="M8 79H92M26 85H74M38 90H62" stroke="var(--w1, currentColor)" stroke-width="1.6" stroke-linecap="round"/>`;
})();

// Aspen "eyes": a trunk with dark eye-shaped branch scars.
ART.eyes = (() => {
  const trunk = 'M34 6C33 30 32 60 30 94H68C66 60 65 30 64 6Z';
  const eye = (x, y, w, h) => `<path d="M${x - w} ${y}Q${x} ${y - h} ${x + w} ${y}Q${x} ${y + h} ${x - w} ${y}Z" fill="var(--s1, currentColor)"/><ellipse cx="${x}" cy="${y}" rx="${r1(w * 0.28)}" ry="${r1(h * 0.34)}" fill="var(--f1, var(--paper))"/>`;
  return `<path d="${trunk}" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.4"/>` +
    `<path d="M40 20h7M52 34h6M38 50h5M56 70h7M42 82h6" stroke="var(--d1, currentColor)" stroke-opacity="var(--dop,.55)" stroke-width="1.2" stroke-linecap="round"/>` +
    eye(48, 40, 10, 9) + eye(46, 64, 7, 6);
})();

// Mule deer track: two pointed toes.
ART.track = (() => {
  const toe = (s) => `<path d="M${50 + s * 3} 18C${50 + s * 16} 26 ${50 + s * 19} 56 ${50 + s * 15} 72C${50 + s * 12} 82 ${50 + s * 3} 82 ${50 + s * 2.5} 72C${50 + s * 2} 56 ${50 + s * 1.5} 34 ${50 + s * 3} 18Z" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.4" stroke-linejoin="round"/>`;
  return `<ellipse cx="50" cy="52" rx="40" ry="42" fill="var(--f2, none)"/>` + toe(1) + toe(-1) +
    `<circle cx="36" cy="88" r="2.4" fill="var(--d1, currentColor)" fill-opacity="var(--dop,.55)"/><circle cx="64" cy="88" r="2.4" fill="var(--d1, currentColor)" fill-opacity="var(--dop,.55)"/>`;
})();

// Obsidian: a faceted shard of glass.
ART.obsidian = (() => {
  const out = 'M18 70L30 34L54 20L80 32L86 58L66 80L34 82Z';
  return `<path d="${out}" fill="var(--f1, none)" stroke="var(--l1, currentColor)" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="M30 34L46 50L54 20M46 50L80 32M46 50L66 80M46 50L18 70M46 50L86 58" stroke="var(--d1, currentColor)" stroke-opacity="var(--dop,.55)" stroke-width="1" fill="none"/>` +
    `<path d="M36 38L48 26" stroke="var(--g1, none)" stroke-width="2" stroke-linecap="round"/><path d="M62 30L74 36" stroke="var(--g1, none)" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
})();

// Found-state palettes (light, dark share hue; dark is slightly deeper)
export const COLORS = {
  aspen: { f1: '#E6AE2C', l1: '#A87612', d1: '#FFE39A' },
  cottonwood: { f1: '#D7B53A', l1: '#8F7616', d1: '#F6E596' },
  willow: { f1: '#B5AE45', l1: '#6E6A1C', d1: '#E9E4A0' },
  birch: { f1: '#DC8A2B', l1: '#96561A', d1: '#FFD196' },
  red: { f1: '#B9322A', l1: '#7A1A16', d1: '#F29A84' },
  big: { f1: '#CF8F2E', l1: '#8C5B14', d1: '#F8D38C' },
  heart: { f1: '#D8602A', l1: '#8E3312', d1: '#FFB78E' },
  cone: { f1: '#9A6437', l1: '#5A3518', d1: '#E2AE7C' },
  granite: { f1: '#D9D1C3', l1: '#7D7366', s1: '#2A2522', s2: '#FFFFFF', s2l: '#A69C8E', g1: '#E6AE2C', sop: 0.85 },
  dam: { f1: '#E3C9A0', l1: '#7A5230', d1: '#7A5230', f2: '#8C6A4A', l2: '#5E3F24', w1: '#5F8C92' },
  tufa: { f1: '#D8CBB2', l1: '#86765C', d1: '#86765C', w1: '#5F8C92' },
  eyes: { f1: '#F1EBDD', l1: '#9C9282', d1: '#9C9282', s1: '#2A2522' },
  track: { f1: '#5B3F2A', l1: '#3E2A1A', d1: '#5B3F2A', f2: '#D9C29A' },
  obsidian: { f1: '#26222B', l1: '#0F0D12', d1: '#6D6878', g1: '#FFFFFF' },
};

export function symbols() {
  return Object.entries(ART).map(([id, s]) => `<symbol id="art-${id}" viewBox="0 0 100 100" overflow="visible">${s}</symbol>`).join('');
}
export function colorVars(id) {
  const c = COLORS[id]; if (!c) return '';
  return Object.entries(c).map(([k, v]) => `--${k}:${v}`).join(';');
}

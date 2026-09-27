// Crisp SVG specimen art for the leaf hunt. Leaves are generated from a
// botanical model (blade profile, margin type, venation) so every drawing
// shares the same line weight, light direction and construction.
// All art lives in a 96x96 viewBox.

const f1 = (n) => +n.toFixed(1);
const pt = (p) => `${f1(p[0])} ${f1(p[1])}`;
const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

// Blade half-width profile: rounded base (a<1), pointed tip (b>=1).
function profile(t, a, b) {
  if (t <= 0 || t >= 1) return 0;
  return Math.pow(t, a) * Math.pow(1 - t, b);
}
function normProfile(a, b) {
  let m = 0;
  for (let i = 1; i < 200; i++) m = Math.max(m, profile(i / 200, a, b));
  return (t) => profile(t, a, b) / m;
}
// Margin modulation (0..1 multiplier). u = position along margin in tooth units.
function margin(kind, t, n, d) {
  if (!n) return 1;
  const u = (t * n) % 1;
  if (kind === 'crenate') return 1 - d + d * Math.sqrt(Math.sin(Math.PI * u));
  if (kind === 'serrate') return 1 - d + d * Math.pow(u, 1.6);
  return 1;
}

/**
 * Pinnate leaf. Returns {outline, veins, petiole} path strings in local space
 * (base at 0,0, tip at 0,-L), then transformed by angle/offset.
 */
function pinnate({ tipK = 0, L, W, a, b, kind, n, d, n2 = 0, d2 = 0, veins = 6, spread = 0.16, curve = 0.3, stem = 0.2, angle = 0, cx = 48, cy = 84, bend = 0 }) {
  const f = normProfile(a, b);
  const N = 240;
  const R = [], Lft = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    let w = W * f(t) * margin(kind, t, n, d);
    if (tipK && t > 1 - tipK) { const u = (t - (1 - tipK)) / tipK; w *= 1 - 0.55 * Math.sin(u * Math.PI / 2); }
    if (n2) w *= margin('serrate', t, n2, d2);
    // slight asymmetry + midrib bend
    const bx = bend * Math.sin(Math.PI * t) * L;
    R.push([bx + w, -t * L]);
    Lft.push([bx - w * 0.98, -t * L]);
  }
  const T = (p) => { const r = rot(p, angle); return [r[0] + cx, r[1] + cy]; };
  const outline = 'M' + [...R, ...Lft.reverse()].map((p) => pt(T(p))).join('L') + 'Z';
  // midrib
  const mid = [];
  for (let i = 0; i <= 20; i++) { const t = (i / 20) * 0.96; mid.push(T([bend * Math.sin(Math.PI * t) * L, -t * L])); }
  let vp = 'M' + mid.map(pt).join('L');
  // secondary veins (alternate slightly)
  for (let k = 0; k < veins; k++) {
    for (const side of [1, -1]) {
      const t0 = 0.08 + (k / veins) * 0.78 + (side < 0 ? 0.03 : 0);
      const t1 = Math.min(0.97, t0 + spread + 0.06 * (1 - k / veins));
      const w1 = W * f(t1) * 0.86;
      const bx0 = bend * Math.sin(Math.PI * t0) * L, bx1 = bend * Math.sin(Math.PI * t1) * L;
      const p0 = [bx0, -t0 * L], p1 = [bx1 + side * w1, -t1 * L];
      const c = [bx0 + side * w1 * 0.55, -(t0 + (t1 - t0) * curve) * L];
      vp += `M${pt(T(p0))}Q${pt(T(c))} ${pt(T(p1))}`;
    }
  }
  const s0 = T([0, 0]), s1 = T([L * 0.02, L * stem]);
  const sc = T([-L * 0.03, L * stem * 0.5]);
  const petiole = `M${pt(s0)}Q${pt(sc)} ${pt(s1)}`;
  return { outline, veins: vp, petiole };
}

// Palmate 3-lobed maple (mountain maple, Acer glabrum), polar construction.
function maple({ cx = 48, cy = 52, R = 36, angle = 0 }) {
  const lobes = [
    { a: 0, r: 1, w: 0.62 },
    { a: 1.22, r: 0.86, w: 0.56 },
    { a: -1.22, r: 0.86, w: 0.56 },
    { a: 2.3, r: 0.5, w: 0.42 },
    { a: -2.3, r: 0.5, w: 0.42 },
  ];
  const N = 360;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const phi = -Math.PI + (i / N) * 2 * Math.PI;
    let r = 0.4;
    for (const l of lobes) {
      let dphi = Math.atan2(Math.sin(phi - l.a), Math.cos(phi - l.a));
      const g = Math.exp(-(dphi * dphi) / (2 * l.w * l.w * 0.35));
      r = Math.max(r, 0.4 + (l.r - 0.4) * Math.pow(g, 1.4));
    }
    // petiole notch at the bottom
    const db = Math.atan2(Math.sin(phi - Math.PI), Math.cos(phi - Math.PI));
    r *= 1 - 0.55 * Math.exp(-(db * db) / 0.02);
    // double serration
    r *= 1 - 0.045 * Math.pow((i * 26 / N) % 1, 1.6) - 0.02 * Math.pow((i * 78 / N) % 1, 1.5);
    const p = rot([Math.sin(phi) * r * R, -Math.cos(phi) * r * R], angle);
    pts.push([cx + p[0], cy + p[1] + R * 0.12]);
  }
  const base = rot([0, R * 0.12], angle);
  const o = [cx + base[0], cy + base[1]];
  const outline = 'M' + pts.map(pt).join('L') + 'Z';
  let veins = '';
  for (const l of lobes) {
    const tip = rot([Math.sin(l.a) * l.r * R * 0.9, -Math.cos(l.a) * l.r * R * 0.9], angle);
    const mid = rot([Math.sin(l.a) * l.r * R * 0.45 + 1.5, -Math.cos(l.a) * l.r * R * 0.45], angle);
    veins += `M${pt(o)}Q${pt([cx + mid[0], cy + mid[1] + R * 0.12])} ${pt([cx + tip[0], cy + tip[1] + R * 0.12])}`;
  }
  const st = rot([R * 0.06, R * 0.62], angle);
  const petiole = `M${pt(o)}Q${pt([o[0] - 3, o[1] + R * 0.3])} ${pt([cx + st[0], cy + st[1]])}`;
  return { outline, veins, petiole };
}

// Cordate (heart-shaped) leaf, from the classic heart curve, tip elongated.
function heart({ cx = 48, cy = 50, s = 2.2, angle = 0 }) {
  const N = 240, pts = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * 2 * Math.PI;
    let x = 16 * Math.pow(Math.sin(th), 3);
    let y = 13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th);
    y = -y; // point down
    // flip so the point is at the top (the leaf tip) and elongate it
    y = -y;
    if (y < 0) y *= 1 + 0.25 * Math.pow(-y / 17, 2);
    // fine crenate margin
    const k = 1 - 0.02 * Math.sqrt(Math.abs(Math.sin(th * 22)));
    const p = rot([x * s * k, (y - 1) * s * k], angle);
    pts.push([cx + p[0], cy + p[1]]);
  }
  const outline = 'M' + pts.map(pt).join('L') + 'Z';
  const o = rot([0, 4 * s], angle), tip = rot([0, -21 * s], angle);
  const O = [cx + o[0], cy + o[1]], TIP = [cx + tip[0], cy + tip[1]];
  let veins = `M${pt(O)}L${pt(TIP)}`;
  // half-width of the blade at local y (unrotated), from the raw curve
  const raw = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * 2 * Math.PI;
    let x = 16 * Math.pow(Math.sin(th), 3);
    let y = 13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th);
    if (y < 0) y *= 1 + 0.25 * Math.pow(-y / 17, 2);
    raw.push([x, y - 1]);
  }
  const halfW = (yy) => raw.filter((p) => Math.abs(p[1] - yy) < 0.9).reduce((m, p) => Math.max(m, Math.abs(p[0])), 0);
  const V = [[3.2, 5, 0.86], [0.5, -2.5, 0.84], [-3.5, -8, 0.8], [-8, -13, 0.72], [-12.5, -17, 0.6]];
  for (const [y0, y1, k] of V) {
    for (const side of [1, -1]) {
      const w = halfW(y1) * k;
      const A = rot([0, y0 * s], angle), E = rot([side * w * s, y1 * s], angle), C = rot([side * w * 0.45 * s, (y0 - 1.2) * s], angle);
      veins += `M${pt([cx + A[0], cy + A[1]])}Q${pt([cx + C[0], cy + C[1]])} ${pt([cx + E[0], cy + E[1]])}`;
    }
  }
  const st = rot([1.5, 12 * s], angle);
  const petiole = `M${pt(O)}Q${pt([O[0] - 2, O[1] + 9])} ${pt([cx + st[0], cy + st[1]])}`;
  return { outline, veins, petiole };
}

// ---------------------------------------------------------------------------
// Colours: each specimen has a hue pair [base, tip] + vein colour.
const LEAF = {
  aspen: { c: ['#E3A21A', '#F7CF4E'], v: '#FFE9A3', e: '#A8680A' },
  cottonwood: { c: ['#D99A1E', '#F2C94C'], v: '#FFE7A0', e: '#9C6410' },
  willow: { c: ['#B9A12E', '#E6CC57'], v: '#FFF0B0', e: '#7E6A14' },
  birch: { c: ['#D9731E', '#F2A53C'], v: '#FFD8A0', e: '#9A4A0E' },
  red: { c: ['#B8321F', '#E0553A'], v: '#FFB3A0', e: '#7C1F12' },
  big: { c: ['#D0851C', '#F0B540'], v: '#FFE1A0', e: '#8E560C' },
  heart: { c: ['#DD8A1C', '#F6BF45'], v: '#FFE3A6', e: '#98580D' },
};

function leafSVG(id, shape, pal, extra = '') {
  const g = `g-${id}`;
  return `<defs><linearGradient id="${g}" x1="0" y1="1" x2="0.4" y2="0"><stop offset="0" stop-color="${pal.c[0]}"/><stop offset="1" stop-color="${pal.c[1]}"/></linearGradient></defs>
  <g class="spec">
    <path class="stem" d="${shape.petiole}" fill="none" stroke="${pal.e}" stroke-width="1.8" stroke-linecap="round"/>
    <path class="blade" d="${shape.outline}" fill="url(#${g})" stroke="${pal.e}" stroke-width=".9" stroke-linejoin="round"/>
    <path class="vein" d="${shape.veins}" fill="none" stroke="${pal.v}" stroke-width=".8" stroke-linecap="round" opacity=".75"/>
    ${extra}
  </g>`;
}

export function artFor(id, uid) {
  const k = `${uid}-${id}`;
  switch (id) {
    case 'aspen':
      return leafSVG(k, pinnate({ L: 60, W: 29, a: 0.34, b: 0.72, tipK: 0.18, kind: 'crenate', n: 20, d: 0.05, veins: 5, spread: 0.2, angle: 0.3, cx: 40, cy: 80, stem: 0.28 }), LEAF.aspen);
    case 'eyes':
      return eyesSVG();
    case 'cottonwood':
      return leafSVG(k, pinnate({ L: 74, W: 20, a: 0.3, b: 1.35, kind: 'serrate', n: 34, d: 0.035, veins: 7, spread: 0.14, angle: 0.42, cx: 36, cy: 84, stem: 0.16, bend: 0.03 }), LEAF.cottonwood);
    case 'willow':
      return leafSVG(k, pinnate({ L: 80, W: 9.5, a: 0.85, b: 1.05, kind: 'serrate', n: 44, d: 0.05, veins: 10, spread: 0.07, curve: 0.2, angle: 0.62, cx: 30, cy: 82, stem: 0.08, bend: 0.06 }), LEAF.willow);
    case 'birch':
      return leafSVG(k, pinnate({ L: 58, W: 20, a: 0.5, b: 1.05, kind: 'serrate', n: 10, d: 0.13, n2: 30, d2: 0.05, veins: 6, spread: 0.13, angle: 0.3, cx: 42, cy: 78, stem: 0.22 }), LEAF.birch);
    case 'red':
      return leafSVG(k, maple({ cx: 48, cy: 46, R: 38, angle: -0.18 }), LEAF.red);
    case 'big': {
      const big = pinnate({ L: 78, W: 30, a: 0.4, b: 1.15, kind: 'serrate', n: 30, d: 0.03, veins: 7, spread: 0.15, angle: 0.28, cx: 34, cy: 88, stem: 0.1 });
      const small = pinnate({ L: 20, W: 8.5, a: 0.42, b: 0.95, kind: 'crenate', n: 10, d: 0.05, veins: 3, spread: 0.2, angle: -0.35, cx: 80, cy: 90, stem: 0.25 });
      const g2 = `g-${k}-s`;
      const extra = `<defs><linearGradient id="${g2}" x1="0" y1="1" x2="0.4" y2="0"><stop offset="0" stop-color="${LEAF.aspen.c[0]}"/><stop offset="1" stop-color="${LEAF.aspen.c[1]}"/></linearGradient></defs>
        <path d="${small.petiole}" fill="none" stroke="${LEAF.aspen.e}" stroke-width="1.2" stroke-linecap="round"/>
        <path class="blade" d="${small.outline}" fill="url(#${g2})" stroke="${LEAF.aspen.e}" stroke-width=".7"/>
        <path class="vein" d="${small.veins}" fill="none" stroke="${LEAF.aspen.v}" stroke-width=".5" opacity=".7"/>`;
      return leafSVG(k, big, LEAF.big, extra);
    }
    case 'heart':
      return leafSVG(k, heart({ cx: 48, cy: 52, s: 1.8, angle: 0.22 }), LEAF.heart);
    case 'cone':
      return coneSVG(k);
    case 'granite':
      return graniteSVG(k);
    case 'dam':
      return damSVG(k);
    case 'tufa':
      return tufaSVG(k);
    case 'track':
      return trackSVG(k);
    case 'obsidian':
      return obsidianSVG(k);
  }
  return '';
}

// Seeded random for stable speckles.
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

function coneSVG(k) {
  // Jeffrey pine cone: egg-shaped, scales in a spiral lattice, prickles tucked in.
  const cx = 48, cy = 50;
  const outline = [];
  for (let i = 0; i < 120; i++) {
    const th = (i / 120) * Math.PI * 2;
    const y = -Math.cos(th);
    const w = Math.sin(th) * (y > 0 ? 1 - 0.18 * y : 1 - 0.32 * -y);
    outline.push([cx + w * 23, cy + y * 34]);
  }
  const path = 'M' + outline.map(pt).join('L') + 'Z';
  let scales = '';
  const r = rng(7);
  for (let row = 0; row < 11; row++) {
    const y = cy - 30 + row * 6.2;
    const off = row % 2 ? 4.6 : 0;
    for (let col = -4; col <= 4; col++) {
      const x = cx + col * 9.2 + off;
      const s = 5.4 - Math.abs(row - 6) * 0.18;
      scales += `<path d="M${f1(x - s)} ${f1(y)}Q${f1(x)} ${f1(y + s * 1.25)} ${f1(x + s)} ${f1(y)}Q${f1(x)} ${f1(y - s * 0.35)} ${f1(x - s)} ${f1(y)}Z" fill="${r() > 0.5 ? '#A56A3A' : '#96602F'}" stroke="#5A3517" stroke-width=".7"/><circle cx="${f1(x)}" cy="${f1(y + s * 0.35)}" r=".9" fill="#E3B27A"/>`;
    }
  }
  return `<defs><clipPath id="cp-${k}"><path d="${path}"/></clipPath><radialGradient id="rg-${k}" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#B57A45"/><stop offset="1" stop-color="#6E4221"/></radialGradient></defs>
  <g class="spec"><path d="M48 16 Q49 10 46 6" stroke="#6E4221" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path class="blade" d="${path}" fill="url(#rg-${k})" stroke="#4A2A12" stroke-width=".9"/>
  <g clip-path="url(#cp-${k})" class="detail">${scales}</g>
  <path d="${path}" fill="none" stroke="#4A2A12" stroke-width="1"/></g>`;
}

function blob(cx, cy, rx, ry, seed, n = 9, j = 0.12) {
  const r = rng(seed); const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * j;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  // closed Catmull-Rom
  let d = `M${pt(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d + 'Z';
}

function graniteSVG(k) {
  const d = blob(48, 58, 34, 23, 11, 9, 0.1);
  const r = rng(3);
  let sp = '';
  for (let i = 0; i < 95; i++) {
    const x = 14 + r() * 68, y = 34 + r() * 48;
    const c = r();
    const col = c < 0.42 ? '#2A2622' : c < 0.7 ? '#F4F0EA' : c < 0.85 ? '#D6B3A0' : '#8E8780';
    sp += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(0.6 + r() * 1.5)}" ry="${f1(0.5 + r() * 1.1)}" transform="rotate(${Math.round(r() * 180)} ${f1(x)} ${f1(y)})" fill="${col}"/>`;
  }
  const star = (x, y, s) => `<path d="M${x} ${y - s}Q${x + s * 0.12} ${y - s * 0.12} ${x + s} ${y}Q${x + s * 0.12} ${y + s * 0.12} ${x} ${y + s}Q${x - s * 0.12} ${y + s * 0.12} ${x - s} ${y}Q${x - s * 0.12} ${y - s * 0.12} ${x} ${y - s}Z" fill="#FFF8E6"/>`;
  return `<defs><clipPath id="cp-${k}"><path d="${d}"/></clipPath><radialGradient id="rg-${k}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#D9D3CA"/><stop offset="1" stop-color="#8F877D"/></radialGradient>
  <radialGradient id="gl-${k}"><stop offset="0" stop-color="#FFD58A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient></defs>
  <g class="spec"><path class="blade" d="${d}" fill="url(#rg-${k})" stroke="#5E574F" stroke-width=".9"/>
  <g clip-path="url(#cp-${k})" class="detail">${sp}</g>
  <path d="${d}" fill="none" stroke="#5E574F" stroke-width=".9"/>
  <g class="detail"><circle cx="62" cy="44" r="12" fill="url(#gl-${k})"/>${star(62, 44, 8)}${star(34, 52, 4)}</g></g>`;
}

function damSVG(k) {
  const r = rng(5);
  let sticks = '';
  for (let i = 0; i < 34; i++) {
    const t = r();
    const x = 12 + t * 72;
    const h = 30 * Math.sin(Math.PI * t) * (0.55 + r() * 0.45);
    const y = 66 - r() * h;
    const len = 14 + r() * 18;
    const a = (r() - 0.5) * 50;
    const col = ['#7A4E2A', '#8E5E33', '#A2703F', '#6A4222'][Math.floor(r() * 4)];
    sticks += `<line x1="${f1(x - len / 2)}" y1="${f1(y)}" x2="${f1(x + len / 2)}" y2="${f1(y)}" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" stroke="${col}" stroke-width="${f1(2 + r() * 1.6)}" stroke-linecap="round"/>`;
  }
  // chewed-point stump
  const stump = `<path d="M74 66 L74 44 L77 36 L80 44 L80 66Z" fill="#E7D9BE" stroke="#8E6E45" stroke-width=".9"/><path d="M74 44 L77 36 L80 44" fill="#C9A676"/>`;
  return `<defs><linearGradient id="w-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FA6B8"/><stop offset="1" stop-color="#4E7486"/></linearGradient></defs>
  <g class="spec">
    <path class="blade" d="M10 68 Q48 30 86 68 Z" fill="#5A3A20" stroke="#3E2713" stroke-width=".9"/>
    <g class="detail">${sticks}</g>
    ${stump}
    <rect class="water" x="4" y="66" width="88" height="20" rx="3" fill="url(#w-${k})"/>
    <path class="detail" d="M10 73h22M40 73h14M62 73h22M16 79h18M46 79h24" stroke="#CFE6EE" stroke-width="1" stroke-linecap="round" opacity=".7"/>
  </g>`;
}

function tufaSVG(k) {
  // knobbly tower: build the outline from stacked bulges.
  const left = [], right = [];
  const r = rng(9);
  for (let i = 0; i <= 14; i++) {
    const y = 72 - i * 4.6;
    const base = 15 - i * 0.55 + (i > 10 ? -(i - 10) * 1.6 : 0);
    left.push([48 - base - (r() * 3.2), y]);
    right.push([48 + base + (r() * 3.2), y]);
  }
  const d = 'M' + [...left, [47, 5], ...right.reverse()].map(pt).join('L') + 'Z';
  let bumps = '';
  for (let i = 0; i < 26; i++) {
    const y = 12 + r() * 58, x = 48 + (r() - 0.5) * 22 * (1 - (72 - y) / 110);
    bumps += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.2 + r() * 2.2)}" fill="${r() > 0.5 ? '#B8AA91' : '#E4DAC6'}" opacity=".9"/>`;
  }
  return `<defs><clipPath id="cp-${k}"><path d="${d}"/></clipPath><linearGradient id="t-${k}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9DFCC"/><stop offset="1" stop-color="#A89A82"/></linearGradient>
  <linearGradient id="w-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86B3BE"/><stop offset="1" stop-color="#4F7C8A"/></linearGradient></defs>
  <g class="spec">
    <path class="blade" d="${d}" fill="url(#t-${k})" stroke="#6F634F" stroke-width=".9" stroke-linejoin="round"/>
    <g clip-path="url(#cp-${k})" class="detail">${bumps}</g>
    <path d="${d}" fill="none" stroke="#6F634F" stroke-width=".9" stroke-linejoin="round"/>
    <rect class="water" x="6" y="72" width="84" height="16" rx="3" fill="url(#w-${k})"/>
    <path class="detail" d="M14 78h20M44 78h10M62 78h18M22 83h14M50 83h20" stroke="#D8EEF2" stroke-width="1" stroke-linecap="round" opacity=".75"/>
  </g>`;
}

function eyesSVG() {
  const eye = (x, y, w, a) => `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - w} ${y}Q${x} ${y - w * 0.62} ${x + w} ${y}Q${x} ${y + w * 0.62} ${x - w} ${y}Z" fill="#2E2620"/><path d="M${x - w * 0.55} ${y}Q${x} ${y - w * 0.28} ${x + w * 0.55} ${y}Q${x} ${y + w * 0.28} ${x - w * 0.55} ${y}Z" fill="#5E5046"/></g>`;
  return `<defs><linearGradient id="bark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8BFAE"/><stop offset=".35" stop-color="#F3EEE4"/><stop offset=".8" stop-color="#E4DCCD"/><stop offset="1" stop-color="#AFA491"/></linearGradient></defs>
  <g class="spec">
    <path class="blade" d="M30 4 Q27 48 29 92 L67 92 Q69 48 66 4Z" fill="url(#bark)" stroke="#8E8471" stroke-width=".9"/>
    <g class="detail">${eye(47, 30, 11, -8)}${eye(52, 64, 8, 6)}
      <path d="M36 14h6M55 46h7M38 80h5M58 84h5M34 48h4" stroke="#6C6152" stroke-width="1.2" stroke-linecap="round"/></g>
  </g>`;
}

function trackSVG(k) {
  // Mule deer: two pointed "teardrop" halves making an upside-down heart.
  const half = (x, y, s, flip) => {
    const f = flip ? -1 : 1;
    return `<path d="M${x} ${y - 13 * s}C${x + f * 7 * s} ${y - 9 * s} ${x + f * 9 * s} ${y + 4 * s} ${x + f * 7.5 * s} ${y + 11 * s}C${x + f * 6 * s} ${y + 15 * s} ${x + f * 1.2 * s} ${y + 14 * s} ${x + f * 0.8 * s} ${y + 9 * s}C${x + f * 0.4 * s} ${y + 1 * s} ${x - f * 0.4 * s} ${y - 7 * s} ${x} ${y - 13 * s}Z"/>`;
  };
  const print = (x, y, s, a) => `<g transform="rotate(${a} ${x} ${y})" fill="#6A472B">${half(x - 1.6 * s, y, s, true)}${half(x + 1.6 * s, y, s, false)}</g>`;
  return `<g class="spec">
    <path class="blade" d="${blob(48, 50, 40, 36, 21, 10, 0.08)}" fill="#D9C4A4" stroke="#A88D66" stroke-width=".9"/>
    <g class="detail">${print(38, 62, 1.35, -12)}${print(60, 32, 1.1, -12)}</g>
  </g>`;
}

function obsidianSVG(k) {
  const d = 'M16 64 L30 30 L52 18 L78 34 L84 60 L62 78 L32 80 Z';
  return `<defs><linearGradient id="o-${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B3945"/><stop offset=".55" stop-color="#16151B"/><stop offset="1" stop-color="#0B0A0E"/></linearGradient></defs>
  <g class="spec">
    <path class="blade" d="${d}" fill="url(#o-${k})" stroke="#07060A" stroke-width="1" stroke-linejoin="round"/>
    <g class="detail">
      <path d="M30 30 L52 18 L56 44 Z" fill="#4A4856" opacity=".85"/>
      <path d="M56 44 L78 34 L84 60 Z" fill="#26242E"/>
      <path d="M36 40 Q46 36 52 26" stroke="#C9C6D6" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M40 66 Q50 58 62 62M44 72 Q54 64 66 68" stroke="#5D5A6C" stroke-width=".9" fill="none"/>
    </g>
  </g>`;
}

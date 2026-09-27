// Crisp, generated SVG art for the leaf hunt. Every leaf outline is built from
// a half-width profile along the midrib, then given a botanically plausible
// margin (crenate, serrate, doubly serrate) and pinnate/palmate venation.
// Each item yields two symbols: art-<id> (found, full colour) and sil-<id>
// (not yet found: a single soft silhouette that reads as "a slot to fill").

const f = (n) => (Math.round(n * 100) / 100).toString();
const P = (pts, close = true) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + (close ? 'Z' : '');

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Catmull-Rom through points -> dense polyline (closed)
function spline(pts, per = 14, closed = true) {
  const out = [];
  const n = pts.length;
  const get = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

// Resample a closed polyline to even spacing
function resample(pts, step) {
  const out = [];
  const n = pts.length;
  let acc = 0;
  out.push(pts[0]);
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let pos = step - acc;
    while (pos <= d) {
      const t = pos / d;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      pos += step;
    }
    acc = (acc + d) % step;
  }
  return out;
}

// Apply a margin to a closed outline. `weight(i)` fades teeth near base/tip.
function margin(pts, { kind = 'serrate', tooth = 4, amp = 1.2, weight = () => 1 }) {
  const step = tooth / 8;
  const r = resample(pts, step);
  const n = r.length;
  // centroid for outward direction check
  const cx = r.reduce((a, p) => a + p[0], 0) / n, cy = r.reduce((a, p) => a + p[1], 0) / n;
  return r.map((p, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n];
    let nx = b[1] - a[1], ny = -(b[0] - a[0]);
    const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    if ((p[0] - cx) * nx + (p[1] - cy) * ny < 0) { nx = -nx; ny = -ny; }
    const ph = (i / 8) % 1;
    let o;
    if (kind === 'crenate') o = Math.sin(Math.PI * ph) * amp;
    else if (kind === 'double') o = (ph < 0.8 ? ph / 0.8 : (1 - ph) / 0.2) * amp + ((i / 16) % 1 < 0.85 ? ((i / 16) % 1) / 0.85 : (1 - (i / 16) % 1) / 0.15) * amp * 0.9;
    else o = (ph < 0.78 ? ph / 0.78 : (1 - ph) / 0.22) * amp; // serrate: slow rise, sharp drop
    const w = weight(i / n, p);
    return [p[0] + nx * o * w, p[1] + ny * o * w];
  });
}

// Pinnate leaf from half-width profile hw(t), t=0 base .. 1 tip, midrib along -y
function pinnate({ cx = 50, base = 80, L = 66, hw, cordate = 0, N = 90, t0 = 0 }) {
  const right = [], left = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + (i / N) * (1 - t0);
    let y = base - t * L;
    // cordate: lobes swing below the petiole junction
    if (cordate) y += cordate * Math.pow(1 - smooth(0, 0.32, t), 1.6) * Math.sin(Math.min(1, t / 0.32) * Math.PI) * 1.0;
    const w = hw(t);
    right.push([cx + w, y]);
    left.push([cx - w, y]);
  }
  return [[cx, base - Math.min(0, t0) * L], ...right.slice(1, -1), [cx, base - L], ...left.slice(1, -1).reverse()];
}

function pinnateVeins({ cx = 50, base = 80, L = 66, hw, pairs = 6, t0 = 0.1, t1 = 0.82, reach = 0.86, rise = 0.16, curl = 0.5 }) {
  const Y = (t) => base - t * L;
  const out = [`M${f(cx)} ${f(base + 2)}L${f(cx)} ${f(Y(0.96))}`];
  for (let i = 0; i < pairs; i++) {
    const t = t0 + ((t1 - t0) * i) / Math.max(1, pairs - 1);
    const te = Math.min(0.97, t + rise);
    const w = hw(te) * reach;
    for (const s of [1, -1]) {
      const c1x = cx + s * hw(t + rise * 0.3) * curl, c1y = Y(t + rise * 0.15);
      out.push(`M${f(cx)} ${f(Y(t))}Q${f(c1x)} ${f(c1y)} ${f(cx + s * w)} ${f(Y(te))}`);
    }
  }
  return out.join('');
}

function petiole(cx, base, len, bend = 4, rot = 0) {
  return `M${f(cx)} ${f(base - 1)}Q${f(cx + bend * 0.4)} ${f(base + len * 0.55)} ${f(cx + bend)} ${f(base + len)}`;
}

// ---------------------------------------------------------------------------
const PAL = {
  gold: ['#F2C54B', '#DDA021', '#B87A0A', '#FBE3A0'],
  amber: ['#F0B040', '#D98A1E', '#A8620B', '#F9D596'],
  lime: ['#DCCB4E', '#BDA92C', '#8A7A12', '#EFE3A0'],
  willow: ['#D9CC62', '#B7A53A', '#7E7120', '#EEE6A8'],
  red: ['#E0553A', '#BF3322', '#8E1F14', '#F29A7E'],
  orange: ['#EE9A3C', '#D56F1F', '#A1480E', '#F8C58A'],
  heart: ['#F4B23E', '#E08A1F', '#B0600C', '#FAD595'],
};

function leafSymbol(id, { outline, veins, pet, pal, rot = 0, scale = 1, tx = 0, ty = 0, gid }) {
  const [light, mid, dark, vein] = pal;
  const tr = `translate(${tx} ${ty}) rotate(${rot} 50 50) translate(50 50) scale(${scale}) translate(-50 -50)`;
  const art = `<symbol id="art-${id}" viewBox="0 0 100 100" overflow="visible">
    <defs><linearGradient id="g-${gid}" x1="0.15" y1="0.1" x2="0.85" y2="0.95"><stop offset="0" stop-color="${light}"/><stop offset="0.55" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
    <clipPath id="c-${gid}"><path d="${outline}"/></clipPath></defs>
    <g transform="${tr}">
      <path d="${pet}" fill="none" stroke="${dark}" stroke-width="2.1" stroke-linecap="round"/>
      <path d="${outline}" fill="url(#g-${gid})"/>
      <path d="${outline}" fill="none" stroke="${dark}" stroke-opacity=".35" stroke-width=".6"/>
      <g clip-path="url(#c-${gid})"><path d="${veins}" fill="none" stroke="${vein}" stroke-opacity=".85" stroke-width=".85" stroke-linecap="round"/>
</g>
    </g></symbol>`;
  const sil = `<symbol id="sil-${id}" viewBox="0 0 100 100" overflow="visible"><g transform="${tr}">
      <path d="${pet}" fill="none" class="sil-s" stroke-width="2.1" stroke-linecap="round"/>
      <path d="${outline}" class="sil-f"/></g></symbol>`;
  return art + sil;
}

export function buildArt() {
  const out = [];

  // Quaking aspen: nearly round, short abrupt tip, fine rounded teeth, long flat stem
  {
    const hw = (t) => Math.min(30 * Math.sqrt(Math.max(0, 1 - ((t - 0.42) / 0.56) ** 2)), 31 * Math.pow(Math.max(0, 1 - t) / 0.32, 1.45));
    const pts = pinnate({ base: 68, L: 58, hw, t0: -0.14 });
    const m = margin(pts, { kind: 'crenate', tooth: 3.3, amp: 0.75, weight: (_, p) => smooth(70, 62, p[1]) * smooth(14, 22, p[1]) });
    out.push(leafSymbol('aspen', { outline: P(m), veins: 'M50 76L50 68' + pinnateVeins({ base: 68, L: 58, hw, pairs: 4, t0: 0.04, t1: 0.5, rise: 0.26, reach: 0.9, curl: 0.62 }), pet: petiole(50, 77, 13, 5), pal: PAL.gold, rot: -18, ty: -2, gid: 'aspen' }));
  }
  // Black cottonwood: spear-shaped, rounded base, long taper, fine teeth
  {
    const hw = (t) => 24 * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, t), 0.62)), 0.85) * (t < 0.05 ? 0.6 + 8 * t : 1);
    const pts = pinnate({ base: 82, L: 72, hw });
    const m = margin(pts, { kind: 'serrate', tooth: 3.4, amp: 0.8, weight: (_, p) => smooth(80, 72, p[1]) * smooth(12, 22, p[1]) });
    out.push(leafSymbol('cottonwood', { outline: P(m), veins: pinnateVeins({ base: 82, L: 72, hw, pairs: 6, t0: 0.06, t1: 0.72, rise: 0.17, curl: 0.55 }), pet: petiole(50, 82, 12, -3), pal: PAL.lime, rot: 22, ty: -4, gid: 'cotton' }));
  }
  // Willow: long, narrow, finely toothed
  {
    const hw = (t) => 9.5 * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, t), 0.8)), 0.9);
    const pts = pinnate({ base: 90, L: 82, hw });
    const m = margin(pts, { kind: 'serrate', tooth: 3, amp: 0.45, weight: (_, p) => smooth(88, 80, p[1]) * smooth(10, 20, p[1]) });
    out.push(leafSymbol('willow', { outline: P(m), veins: pinnateVeins({ base: 90, L: 82, hw, pairs: 9, t0: 0.08, t1: 0.82, rise: 0.08, reach: 0.9, curl: 0.5 }), pet: petiole(50, 90, 6, 1), pal: PAL.willow, rot: 38, tx: 0, ty: -2, gid: 'willow' }));
  }
  // Water birch: small ovate, doubly serrate, straight parallel veins
  {
    const hw = (t) => 25 * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, t), 0.7)), 0.8) * (t < 0.06 ? 0.55 + 7.5 * t : 1);
    const pts = pinnate({ base: 76, L: 56, hw });
    const m = margin(pts, { kind: 'double', tooth: 3.6, amp: 0.95, weight: (_, p) => smooth(74, 64, p[1]) * smooth(20, 27, p[1]) });
    out.push(leafSymbol('birch', { outline: P(m), veins: pinnateVeins({ base: 76, L: 56, hw, pairs: 5, t0: 0.1, t1: 0.7, rise: 0.12, reach: 0.95, curl: 0.45 }), pet: petiole(50, 76, 10, -2), pal: PAL.amber, rot: -8, ty: 0, gid: 'birch' }));
  }
  // Red leaf: mountain maple, three lobes, coarse double teeth, palmate veins
  {
    const key = [[50, 76], [41, 74], [30, 70], [18, 62], [10, 50], [13, 40], [22, 38], [31, 42], [35, 38], [36, 27], [42, 16], [50, 8], [58, 16], [64, 27], [65, 38], [69, 42], [78, 38], [87, 40], [90, 50], [82, 62], [70, 70], [59, 74]];
    const base = spline(key, 10);
    const m = margin(base, { kind: 'double', tooth: 4.4, amp: 1.25, weight: (_, p) => (p[1] > 70 ? 0.2 : 1) });
    const veins = ['M50 78L50 12', 'M50 72L13 44', 'M50 72L87 44', 'M50 72Q36 70 22 64', 'M50 72Q64 70 78 64', 'M50 52L38 40', 'M50 52L62 40', 'M50 38L43 27', 'M50 38L57 27', 'M30 57L26 46', 'M70 57L74 46'].join('');
    out.push(leafSymbol('red', { outline: P(m), veins, pet: petiole(50, 76, 16, 6), pal: PAL.red, rot: 10, ty: 2, gid: 'red', scale: 0.98 }));
  }
  // The biggest leaf: a broad cottonwood leaf, deliberately too big for its tile
  {
    const hw = (t) => 30 * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, t), 0.66)), 0.8) * (t < 0.05 ? 0.6 + 8 * t : 1);
    const pts = pinnate({ base: 84, L: 70, hw });
    const m = margin(pts, { kind: 'serrate', tooth: 3.6, amp: 0.9, weight: (_, p) => smooth(82, 74, p[1]) * smooth(14, 24, p[1]) });
    out.push(leafSymbol('big', { outline: P(m), veins: pinnateVeins({ base: 84, L: 70, hw, pairs: 6, t0: 0.06, t1: 0.72, rise: 0.17, curl: 0.55 }), pet: petiole(50, 84, 12, 4), pal: PAL.orange, rot: -30, scale: 1.36, tx: 6, ty: -2, gid: 'big' }));
  }
  // Heart-shaped leaf: cordate base, pointed tip
  {
    const key = [[50, 66], [45, 72], [36, 76], [24, 74], [16, 64], [15, 52], [20, 40], [30, 29], [41, 19], [50, 9], [59, 19], [70, 29], [80, 40], [85, 52], [84, 64], [76, 74], [64, 76], [55, 72]];
    const m = margin(spline(key, 10), { kind: 'crenate', tooth: 3.6, amp: 0.8, weight: (_, p) => smooth(12, 20, p[1]) * (p[1] > 64 && Math.abs(p[0] - 50) < 8 ? 0 : 1) });
    const veins = ['M50 70L50 12', 'M50 64Q40 60 22 64', 'M50 64Q60 60 78 64', 'M50 58Q36 50 24 44', 'M50 58Q64 50 76 44', 'M50 46Q42 38 34 30', 'M50 46Q58 38 66 30', 'M50 34Q46 28 42 22', 'M50 34Q54 28 58 22'].join('');
    out.push(leafSymbol('heart', { outline: P(m), veins, pet: petiole(50, 67, 18, -4), pal: PAL.heart, rot: 12, ty: 2, gid: 'heart' }));
  }
  // Pinecone (Jeffrey pine): egg-shaped, scales with prickles turned inward
  {
    const outline = P(spline([[50, 10], [63, 16], [72, 32], [75, 52], [71, 72], [60, 86], [50, 89], [40, 86], [29, 72], [25, 52], [28, 32], [37, 16]], 12));
    let scales = '';
    for (let row = 0; row < 9; row++) {
      const y = 16 + row * 8.6;
      const off = row % 2 ? 5.2 : 0;
      for (let k = -4; k <= 4; k++) {
        const x = 50 + k * 10.4 + off;
        const w = 5.6, h = 7.2;
        scales += `<path d="M${f(x - w)} ${f(y + h * 0.35)}C${f(x - w)} ${f(y - h * 0.55)} ${f(x + w)} ${f(y - h * 0.55)} ${f(x + w)} ${f(y + h * 0.35)}Q${f(x)} ${f(y + h * 0.75)} ${f(x - w)} ${f(y + h * 0.35)}Z" fill="url(#g-scale)" stroke="#4A2A12" stroke-width=".75"/><circle cx="${f(x)}" cy="${f(y + h * 0.28)}" r=".85" fill="#3B2210"/>`;
      }
    }
    out.push(`<symbol id="art-cone" viewBox="0 0 100 100"><defs><clipPath id="c-cone"><path d="${outline}"/></clipPath>
      <radialGradient id="g-cone" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#8A5A30"/><stop offset="1" stop-color="#4A2A12"/></radialGradient><linearGradient id="g-scale" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C99462"/><stop offset="1" stop-color="#8A5530"/></linearGradient></defs>
      <g transform="rotate(-14 50 50)"><path d="M50 89L50 95" stroke="#6E4322" stroke-width="3" stroke-linecap="round"/><path d="${outline}" fill="url(#g-cone)"/>
      <g clip-path="url(#c-cone)">${scales}<path d="${outline}" fill="none" stroke="#3B2210" stroke-opacity=".25" stroke-width="6"/></g></g></symbol>`);
    out.push(`<symbol id="sil-cone" viewBox="0 0 100 100"><g transform="rotate(-14 50 50)"><path d="M50 89L50 95" class="sil-s" stroke-width="3" stroke-linecap="round"/><path d="${outline}" class="sil-f"/></g></symbol>`);
  }

  // Granite: salt-and-pepper rock with a sparkle
  {
    const outline = P(spline([[18, 64], [22, 44], [38, 32], [58, 30], [76, 38], [86, 56], [80, 72], [58, 78], [34, 77]], 12));
    const r = rng(11);
    let sp = '';
    for (let i = 0; i < 70; i++) {
      const x = 18 + r() * 68, y = 30 + r() * 48;
      const c = r();
      const col = c < 0.42 ? '#2A2622' : c < 0.66 ? '#F7F2EA' : c < 0.84 ? '#D7B7A4' : '#8E877D';
      sp += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(0.7 + r() * 1.5)}" ry="${f(0.5 + r() * 1.1)}" transform="rotate(${Math.round(r() * 180)} ${f(x)} ${f(y)})" fill="${col}"/>`;
    }
    const star = (x, y, s) => `<path d="M${x} ${y - s}Q${x + s * 0.14} ${y - s * 0.14} ${x + s} ${y}Q${x + s * 0.14} ${y + s * 0.14} ${x} ${y + s}Q${x - s * 0.14} ${y + s * 0.14} ${x - s} ${y}Q${x - s * 0.14} ${y - s * 0.14} ${x} ${y - s}Z"/>`;
    out.push(`<symbol id="art-granite" viewBox="0 0 100 100"><defs><clipPath id="c-gran"><path d="${outline}"/></clipPath>
      <linearGradient id="g-gran" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#E4DFD6"/><stop offset="1" stop-color="#A9A196"/></linearGradient></defs>
      <path d="${outline}" fill="url(#g-gran)"/><g clip-path="url(#c-gran)">${sp}<path d="M14 80Q50 60 90 74L90 90L14 90Z" fill="#3B342C" opacity=".14"/></g>
      <path d="${outline}" fill="none" stroke="#5E574D" stroke-opacity=".35" stroke-width=".7"/>
      <g fill="#FFF6D6">${star(66, 22, 9)}${star(80, 34, 4.5)}</g><circle cx="66" cy="22" r="3.2" fill="#FFE08A" opacity=".55"/></symbol>`);
    out.push(`<symbol id="sil-granite" viewBox="0 0 100 100"><path d="${outline}" class="sil-f"/></symbol>`);
  }

  // Beaver dam: a mound of crossed sticks holding back a pond
  {
    const mound = 'M8 70Q18 44 50 40Q82 44 92 70Z';
    const r = rng(5);
    let sticks = '';
    for (let i = 0; i < 46; i++) {
      const x = 10 + r() * 80, y = 42 + r() * 28;
      const a = (r() - 0.5) * 1.3 + (r() > 0.5 ? 0.2 : -0.2);
      const len = 12 + r() * 18;
      const dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
      const col = ['#6A4526', '#865A33', '#A47445', '#5A3A1F'][Math.floor(r() * 4)];
      sticks += `<path d="M${f(x - dx)} ${f(y - dy)}L${f(x + dx)} ${f(y + dy)}" stroke="${col}" stroke-width="${f(1.6 + r() * 1.6)}" stroke-linecap="round"/>`;
    }
    out.push(`<symbol id="art-dam" viewBox="0 0 100 100"><defs><clipPath id="c-dam"><path d="${mound}"/></clipPath>
      <linearGradient id="g-pond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8DB3C4"/><stop offset="1" stop-color="#5E8799"/></linearGradient></defs>
      <path d="M4 68Q50 60 96 68Q98 86 50 90Q2 86 4 68Z" fill="url(#g-pond)"/><path d="${mound}" fill="#4E331C"/><g clip-path="url(#c-dam)">${sticks}</g>
      <path d="M12 76H88" stroke="#CFE2EA" stroke-width="1.2" stroke-linecap="round" opacity=".8"/><path d="M20 83H44M56 83H80" stroke="#CFE2EA" stroke-width="1" stroke-linecap="round" opacity=".55"/>
      <path d="M74 30L74 48" stroke="#8A6A45" stroke-width="3.2" stroke-linecap="round"/><path d="M71 30L74 23L77 30Z" fill="#C9A474"/></symbol>`);
    out.push(`<symbol id="sil-dam" viewBox="0 0 100 100"><path d="${mound}" class="sil-f"/><path d="M4 68Q50 60 96 68Q98 86 50 90Q2 86 4 68Z" class="sil-f" opacity=".6"/></symbol>`);
  }

  // Tufa tower: knobbly limestone rising out of Mono Lake
  {
    const r = rng(3);
    const tower = (cx, top, w, seed) => {
      const rr = rng(seed);
      const L = [], R = [];
      for (let i = 0; i <= 12; i++) {
        const y = top + (i / 12) * (74 - top);
        const ww = w * (0.55 + 0.45 * (i / 12)) + (rr() - 0.5) * 3.2;
        L.push([cx - ww + (rr() - 0.5) * 2, y]);
        R.push([cx + ww + (rr() - 0.5) * 2, y]);
      }
      return P(spline([...R, ...L.reverse()], 6));
    };
    const t1 = tower(42, 16, 11, 21), t2 = tower(66, 34, 9, 34), t3 = tower(24, 44, 7, 8);
    let tex = '';
    for (let i = 0; i < 40; i++) tex += `<circle cx="${f(14 + r() * 66)}" cy="${f(18 + r() * 56)}" r="${f(0.6 + r() * 1.3)}" fill="#8B7B63" opacity=".45"/>`;
    out.push(`<symbol id="art-tufa" viewBox="0 0 100 100"><defs><linearGradient id="g-tufa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9DECB"/><stop offset=".6" stop-color="#CDBB9C"/><stop offset="1" stop-color="#A8957A"/></linearGradient>
      <linearGradient id="g-mono" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FA6BA"/><stop offset="1" stop-color="#4F7688"/></linearGradient>
      <clipPath id="c-tufa"><path d="${t1}${t2}${t3}"/></clipPath></defs>
      <path d="${t3}" fill="url(#g-tufa)"/><path d="${t2}" fill="url(#g-tufa)"/><path d="${t1}" fill="url(#g-tufa)"/>
      <g clip-path="url(#c-tufa)">${tex}</g><path d="${t1}${t2}${t3}" fill="none" stroke="#6E5F48" stroke-opacity=".3" stroke-width=".7"/>
      <path d="M6 72Q50 66 94 72Q96 88 50 92Q4 88 6 72Z" fill="url(#g-mono)"/><path d="M16 79H46M56 79H84M30 86H70" stroke="#D5E6EE" stroke-width="1" stroke-linecap="round" opacity=".6"/></symbol>`);
    out.push(`<symbol id="sil-tufa" viewBox="0 0 100 100"><path d="${t1}${t2}${t3}" class="sil-f"/><path d="M6 72Q50 66 94 72Q96 88 50 92Q4 88 6 72Z" class="sil-f" opacity=".6"/></symbol>`);
  }

  // Aspen "eyes": white bark with a dark eye-shaped branch scar
  {
    const bark = 'M28 6H72Q74 50 72 94H28Q26 50 28 6Z';
    const eye = (x, y, w, h) => `M${x - w} ${y}Q${x} ${y - h} ${x + w} ${y}Q${x} ${y + h} ${x - w} ${y}Z`;
    out.push(`<symbol id="art-eyes" viewBox="0 0 100 100"><defs><linearGradient id="g-bark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D9D3C4"/><stop offset=".35" stop-color="#F5F1E8"/><stop offset="1" stop-color="#C9C1AE"/></linearGradient></defs>
      <path d="${bark}" fill="url(#g-bark)"/><path d="${eye(50, 46, 15, 13)}" fill="#2E2822"/><path d="${eye(50, 46, 8, 5)}" fill="#5A4E42"/>
      <path d="M36 20h9M56 26h8M38 70h7M58 78h9M44 88h6M60 14h5" stroke="#A89E8A" stroke-width="1.4" stroke-linecap="round"/>
      <path d="${bark}" fill="none" stroke="#8C8272" stroke-opacity=".4" stroke-width=".7"/></symbol>`);
    out.push(`<symbol id="sil-eyes" viewBox="0 0 100 100"><path d="${bark}" class="sil-f"/></symbol>`);
  }

  // Animal track: a mule deer's split heart
  {
    const half = (s) => `M${50 + s * 2} 18Q${50 + s * 16} 30 ${50 + s * 18} 58Q${50 + s * 18} 76 ${50 + s * 9} 78Q${50 + s * 2} 78 ${50 + s * 2} 66Z`;
    out.push(`<symbol id="art-track" viewBox="0 0 100 100"><defs><radialGradient id="g-mud" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#C9B395" stop-opacity=".75"/><stop offset="1" stop-color="#C9B395" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="50" cy="52" rx="40" ry="42" fill="url(#g-mud)"/><path d="${half(-1)}${half(1)}" fill="#5B4331"/><path d="M46 26Q40 40 39 60M54 26Q60 40 61 60" stroke="#8A6C52" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6"/></symbol>`);
    out.push(`<symbol id="sil-track" viewBox="0 0 100 100"><path d="${half(-1)}${half(1)}" class="sil-f"/></symbol>`);
  }

  // Obsidian: black volcanic glass with conchoidal ripples
  {
    const o = 'M16 62L26 38L48 26L72 30L86 50L78 70L52 78L28 76Z';
    out.push(`<symbol id="art-obsidian" viewBox="0 0 100 100"><defs><clipPath id="c-obs"><path d="${o}"/></clipPath></defs>
      <path d="${o}" fill="#1F1D24"/><g clip-path="url(#c-obs)"><path d="M26 38L48 26L56 48L34 56Z" fill="#3A3744"/><path d="M56 48L72 30L86 50L66 60Z" fill="#2B2932"/><path d="M34 56L56 48L66 60L52 78L28 76Z" fill="#141318"/>
      <path d="M38 50Q50 44 60 50M40 58Q52 52 62 58M44 66Q54 61 62 66" stroke="#5C5870" stroke-width=".8" fill="none" opacity=".7"/></g>
      <path d="M31 40L46 31L49 36L35 45Z" fill="#fff" opacity=".6"/><path d="M73 36L80 48L77 49L71 38Z" fill="#fff" opacity=".35"/></symbol>`);
    out.push(`<symbol id="sil-obsidian" viewBox="0 0 100 100"><path d="${o}" class="sil-f"/></symbol>`);
  }

  return out.join('\n');
}

// A small standalone aspen leaf path for icons/decoration (24x24 box)
export function leafGlyph() {
  const hw = (t) => 8.4 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.98)), 0.75) * (1 - 0.35 * smooth(0.72, 1, t));
  const pts = pinnate({ cx: 12, base: 18.5, L: 15.5, hw, N: 40 });
  return P(pts);
}

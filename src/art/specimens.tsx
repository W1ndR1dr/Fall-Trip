// Botanical specimen art for the leaf hunt, drawn from a small model (blade
// profile, margin, venation) so every drawing shares one line weight, one
// light direction (top-left) and one construction. 96 × 96 viewBox, sized by
// its container.
//
//   <Specimen id="aspen" found={false} />   outline to look for
//   <Specimen id="aspen" found />           full fall color
//   <Leaf pigment="green" />                leaves explainer (green / gold / red)
//
// Found colors are real fall pigments (carotenoid golds; anthocyanin red only
// on the maple). Outlines use ink tokens. The `.art` class dims art in dark
// mode and red-shifts it for night vision.
import { useId, type ReactNode } from 'react';

type P2 = [number, number];
type Shape = { outline: string; veins: string; petiole: string };

const f1 = (n: number) => +n.toFixed(1);
const pt = (p: P2) => `${f1(p[0])} ${f1(p[1])}`;
const rot = ([x, y]: P2, a: number): P2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

// ---------------------------------------------------------------------------
// Leaf geometry

function profile(t: number, a: number, b: number) {
  if (t <= 0 || t >= 1) return 0;
  return Math.pow(t, a) * Math.pow(1 - t, b);
}
function normProfile(a: number, b: number) {
  let m = 0;
  for (let i = 1; i < 200; i++) m = Math.max(m, profile(i / 200, a, b));
  return (t: number) => profile(t, a, b) / m;
}
function margin(kind: string, t: number, n: number, d: number) {
  if (!n) return 1;
  const u = (t * n) % 1;
  if (kind === 'crenate') return 1 - d + d * Math.sqrt(Math.sin(Math.PI * u));
  if (kind === 'serrate') return 1 - d + d * Math.pow(u, 1.6);
  return 1;
}

type Pinnate = { tipK?: number; L: number; W: number; a: number; b: number; kind: string; n: number; d: number; n2?: number; d2?: number; veins?: number; spread?: number; curve?: number; stem?: number; angle?: number; cx?: number; cy?: number; bend?: number };

function pinnate({ tipK = 0, L, W, a, b, kind, n, d, n2 = 0, d2 = 0, veins = 6, spread = 0.16, curve = 0.3, stem = 0.2, angle = 0, cx = 48, cy = 84, bend = 0 }: Pinnate): Shape {
  const f = normProfile(a, b);
  const N = 240;
  const R: P2[] = [], Lft: P2[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    let w = W * f(t) * margin(kind, t, n, d);
    if (tipK && t > 1 - tipK) {
      const u = (t - (1 - tipK)) / tipK;
      w *= 1 - 0.55 * Math.sin((u * Math.PI) / 2);
    }
    if (n2) w *= margin('serrate', t, n2, d2);
    const bx = bend * Math.sin(Math.PI * t) * L;
    R.push([bx + w, -t * L]);
    Lft.push([bx - w * 0.98, -t * L]);
  }
  const T = (p: P2): P2 => {
    const r = rot(p, angle);
    return [r[0] + cx, r[1] + cy];
  };
  const outline = 'M' + [...R, ...Lft.reverse()].map((p) => pt(T(p))).join('L') + 'Z';
  const mid: P2[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = (i / 20) * 0.96;
    mid.push(T([bend * Math.sin(Math.PI * t) * L, -t * L]));
  }
  let vp = 'M' + mid.map(pt).join('L');
  for (let k = 0; k < veins; k++) {
    for (const side of [1, -1]) {
      const t0 = 0.08 + (k / veins) * 0.78 + (side < 0 ? 0.03 : 0);
      const t1 = Math.min(0.97, t0 + spread + 0.06 * (1 - k / veins));
      const w1 = W * f(t1) * 0.86;
      const bx0 = bend * Math.sin(Math.PI * t0) * L, bx1 = bend * Math.sin(Math.PI * t1) * L;
      const p0: P2 = [bx0, -t0 * L], p1: P2 = [bx1 + side * w1, -t1 * L];
      const c: P2 = [bx0 + side * w1 * 0.55, -(t0 + (t1 - t0) * curve) * L];
      vp += `M${pt(T(p0))}Q${pt(T(c))} ${pt(T(p1))}`;
    }
  }
  const s0 = T([0, 0]), s1 = T([L * 0.02, L * stem]);
  const sc = T([-L * 0.03, L * stem * 0.5]);
  return { outline, veins: vp, petiole: `M${pt(s0)}Q${pt(sc)} ${pt(s1)}` };
}

// Palmate 3-lobed mountain maple (Acer glabrum): polar construction.
function maple({ cx = 48, cy = 52, R = 36, angle = 0 }): Shape {
  const lobes = [
    { a: 0, r: 1, w: 0.62 },
    { a: 1.22, r: 0.86, w: 0.56 },
    { a: -1.22, r: 0.86, w: 0.56 },
    { a: 2.3, r: 0.5, w: 0.42 },
    { a: -2.3, r: 0.5, w: 0.42 },
  ];
  const N = 360;
  const pts: P2[] = [];
  for (let i = 0; i < N; i++) {
    const phi = -Math.PI + (i / N) * 2 * Math.PI;
    let r = 0.4;
    for (const l of lobes) {
      const dphi = Math.atan2(Math.sin(phi - l.a), Math.cos(phi - l.a));
      const g = Math.exp(-(dphi * dphi) / (2 * l.w * l.w * 0.35));
      r = Math.max(r, 0.4 + (l.r - 0.4) * Math.pow(g, 1.4));
    }
    const db = Math.atan2(Math.sin(phi - Math.PI), Math.cos(phi - Math.PI));
    r *= 1 - 0.55 * Math.exp(-(db * db) / 0.02);
    r *= 1 - 0.045 * Math.pow(((i * 26) / N) % 1, 1.6) - 0.02 * Math.pow(((i * 78) / N) % 1, 1.5);
    const p = rot([Math.sin(phi) * r * R, -Math.cos(phi) * r * R], angle);
    pts.push([cx + p[0], cy + p[1] + R * 0.12]);
  }
  const base = rot([0, R * 0.12], angle);
  const o: P2 = [cx + base[0], cy + base[1]];
  let veins = '';
  for (const l of lobes) {
    const tip = rot([Math.sin(l.a) * l.r * R * 0.9, -Math.cos(l.a) * l.r * R * 0.9], angle);
    const mid = rot([Math.sin(l.a) * l.r * R * 0.45 + 1.5, -Math.cos(l.a) * l.r * R * 0.45], angle);
    veins += `M${pt(o)}Q${pt([cx + mid[0], cy + mid[1] + R * 0.12])} ${pt([cx + tip[0], cy + tip[1] + R * 0.12])}`;
  }
  const st = rot([R * 0.06, R * 0.62], angle);
  return { outline: 'M' + pts.map(pt).join('L') + 'Z', veins, petiole: `M${pt(o)}Q${pt([o[0] - 3, o[1] + R * 0.3])} ${pt([cx + st[0], cy + st[1]])}` };
}

// Cordate leaf from the classic heart curve, tip elongated, fine crenate margin.
function heart({ cx = 48, cy = 50, s = 2.2, angle = 0 }): Shape {
  const N = 240;
  const pts: P2[] = [];
  const raw: P2[] = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(th), 3);
    let y = 13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th);
    if (y < 0) y *= 1 + 0.25 * Math.pow(-y / 17, 2);
    raw.push([x, y - 1]);
    const k = 1 - 0.02 * Math.sqrt(Math.abs(Math.sin(th * 22)));
    const p = rot([x * s * k, (y - 1) * s * k], angle);
    pts.push([cx + p[0], cy + p[1]]);
  }
  const o = rot([0, 4 * s], angle), tip = rot([0, -21 * s], angle);
  const O: P2 = [cx + o[0], cy + o[1]], TIP: P2 = [cx + tip[0], cy + tip[1]];
  let veins = `M${pt(O)}L${pt(TIP)}`;
  const halfW = (yy: number) => raw.filter((p) => Math.abs(p[1] - yy) < 0.9).reduce((m, p) => Math.max(m, Math.abs(p[0])), 0);
  const V: [number, number, number][] = [[3.2, 5, 0.86], [0.5, -2.5, 0.84], [-3.5, -8, 0.8], [-8, -13, 0.72], [-12.5, -17, 0.6]];
  for (const [y0, y1, k] of V) {
    for (const side of [1, -1]) {
      const w = halfW(y1) * k;
      const A = rot([0, y0 * s], angle), E = rot([side * w * s, y1 * s], angle), C = rot([side * w * 0.45 * s, (y0 - 1.2) * s], angle);
      veins += `M${pt([cx + A[0], cy + A[1]])}Q${pt([cx + C[0], cy + C[1]])} ${pt([cx + E[0], cy + E[1]])}`;
    }
  }
  const st = rot([1.5, 12 * s], angle);
  return { outline: 'M' + pts.map(pt).join('L') + 'Z', veins, petiole: `M${pt(O)}Q${pt([O[0] - 2, O[1] + 9])} ${pt([cx + st[0], cy + st[1]])}` };
}

// Seeded random for stable speckles.
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function blob(cx: number, cy: number, rx: number, ry: number, seed: number, n = 9, j = 0.12) {
  const r = rng(seed);
  const pts: P2[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * j;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = `M${pt(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1: P2 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d + 'Z';
}

// ---------------------------------------------------------------------------
// Shapes (computed once)

const SHAPES = {
  aspen: pinnate({ L: 60, W: 29, a: 0.34, b: 0.72, tipK: 0.18, kind: 'crenate', n: 20, d: 0.05, veins: 5, spread: 0.2, angle: 0.3, cx: 40, cy: 80, stem: 0.28 }),
  cottonwood: pinnate({ L: 74, W: 20, a: 0.3, b: 1.35, kind: 'serrate', n: 34, d: 0.035, veins: 7, spread: 0.14, angle: 0.42, cx: 36, cy: 84, stem: 0.16, bend: 0.03 }),
  willow: pinnate({ L: 80, W: 9.5, a: 0.85, b: 1.05, kind: 'serrate', n: 44, d: 0.05, veins: 10, spread: 0.07, curve: 0.2, angle: 0.62, cx: 30, cy: 82, stem: 0.08, bend: 0.06 }),
  birch: pinnate({ L: 58, W: 20, a: 0.5, b: 1.05, kind: 'serrate', n: 10, d: 0.13, n2: 30, d2: 0.05, veins: 6, spread: 0.13, angle: 0.3, cx: 42, cy: 78, stem: 0.22 }),
  red: maple({ cx: 48, cy: 46, R: 38, angle: -0.18 }),
  big: pinnate({ L: 78, W: 30, a: 0.4, b: 1.15, kind: 'serrate', n: 30, d: 0.03, veins: 7, spread: 0.15, angle: 0.28, cx: 34, cy: 88, stem: 0.1 }),
  bigSmall: pinnate({ L: 20, W: 8.5, a: 0.42, b: 0.95, kind: 'crenate', n: 10, d: 0.05, veins: 3, spread: 0.2, angle: -0.35, cx: 80, cy: 90, stem: 0.25 }),
  heart: heart({ cx: 48, cy: 52, s: 1.8, angle: 0.22 }),
  // Explainer leaf: a straight, centered aspen.
  explainer: pinnate({ L: 66, W: 32, a: 0.34, b: 0.72, tipK: 0.18, kind: 'crenate', n: 20, d: 0.05, veins: 5, spread: 0.2, angle: 0.12, cx: 44, cy: 82, stem: 0.24 }),
};

type Pigment = { c: [string, string]; v: string; e: string };
const LEAF: Record<string, Pigment> = {
  aspen: { c: ['#E3A21A', '#F7CF4E'], v: '#FFE9A3', e: '#A8680A' },
  cottonwood: { c: ['#D99A1E', '#F2C94C'], v: '#FFE7A0', e: '#9C6410' },
  willow: { c: ['#B9A12E', '#E6CC57'], v: '#FFF0B0', e: '#7E6A14' },
  birch: { c: ['#D9731E', '#F2A53C'], v: '#FFD8A0', e: '#9A4A0E' },
  red: { c: ['#B8321F', '#E0553A'], v: '#FFB3A0', e: '#7C1F12' },
  big: { c: ['#D0851C', '#F0B540'], v: '#FFE1A0', e: '#8E560C' },
  heart: { c: ['#DD8A1C', '#F6BF45'], v: '#FFE3A6', e: '#98580D' },
  green: { c: ['#3F7A26', '#86B84A'], v: '#D6EDB0', e: '#2C5519' },
};

// Outline state: what to look for.
const OUT = { fill: 'var(--fill)', stroke: 'var(--text-3)', vein: 'var(--text-3)' };

// ---------------------------------------------------------------------------
// Rendering

function LeafArt({ shape, pal, found, uid, extra }: { shape: Shape; pal: Pigment; found: boolean; uid: string; extra?: ReactNode }) {
  const g = `${uid}-g`;
  return (
    <>
      {found && (
        <defs>
          <linearGradient id={g} x1="0" y1="1" x2="0.4" y2="0">
            <stop offset="0" stopColor={pal.c[0]} />
            <stop offset="1" stopColor={pal.c[1]} />
          </linearGradient>
        </defs>
      )}
      <path d={shape.petiole} fill="none" stroke={found ? pal.e : OUT.stroke} strokeWidth={found ? 1.8 : 1.3} strokeLinecap="round" opacity={found ? 1 : 0.8} />
      <path d={shape.outline} fill={found ? `url(#${g})` : OUT.fill} stroke={found ? pal.e : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} strokeLinejoin="round" />
      <path d={shape.veins} fill="none" stroke={found ? pal.v : OUT.vein} strokeWidth={0.8} strokeLinecap="round" opacity={found ? 0.75 : 0.5} />
      {extra}
    </>
  );
}

function Big({ found, uid }: { found: boolean; uid: string }) {
  const s = SHAPES.bigSmall;
  const g2 = `${uid}-gs`;
  const pal = LEAF.aspen;
  return (
    <LeafArt
      shape={SHAPES.big}
      pal={LEAF.big}
      found={found}
      uid={uid}
      extra={
        <>
          {found && (
            <defs>
              <linearGradient id={g2} x1="0" y1="1" x2="0.4" y2="0">
                <stop offset="0" stopColor={pal.c[0]} />
                <stop offset="1" stopColor={pal.c[1]} />
              </linearGradient>
            </defs>
          )}
          <path d={s.petiole} fill="none" stroke={found ? pal.e : OUT.stroke} strokeWidth={1.2} strokeLinecap="round" />
          <path d={s.outline} fill={found ? `url(#${g2})` : OUT.fill} stroke={found ? pal.e : OUT.stroke} strokeWidth={found ? 0.7 : 1} />
          <path d={s.veins} fill="none" stroke={found ? pal.v : OUT.vein} strokeWidth={0.5} opacity={found ? 0.7 : 0.45} />
        </>
      }
    />
  );
}

const CONE_PATH = (() => {
  const cx = 48, cy = 50;
  const o: P2[] = [];
  for (let i = 0; i < 120; i++) {
    const th = (i / 120) * Math.PI * 2;
    const y = -Math.cos(th);
    const w = Math.sin(th) * (y > 0 ? 1 - 0.18 * y : 1 - 0.32 * -y);
    o.push([cx + w * 23, cy + y * 34]);
  }
  return 'M' + o.map(pt).join('L') + 'Z';
})();
const CONE_SCALES = (() => {
  const r = rng(7);
  const out: { d: string; fill: string; dot: P2 }[] = [];
  for (let row = 0; row < 11; row++) {
    const y = 20 + row * 6.2;
    const off = row % 2 ? 4.6 : 0;
    for (let col = -4; col <= 4; col++) {
      const x = 48 + col * 9.2 + off;
      const s = 5.4 - Math.abs(row - 6) * 0.18;
      out.push({ d: `M${f1(x - s)} ${f1(y)}Q${f1(x)} ${f1(y + s * 1.25)} ${f1(x + s)} ${f1(y)}Q${f1(x)} ${f1(y - s * 0.35)} ${f1(x - s)} ${f1(y)}Z`, fill: r() > 0.5 ? '#A56A3A' : '#96602F', dot: [f1(x), f1(y + s * 0.35)] });
    }
  }
  return out;
})();

function Cone({ found, uid }: { found: boolean; uid: string }) {
  return (
    <>
      <defs>
        <clipPath id={`${uid}-cp`}>
          <path d={CONE_PATH} />
        </clipPath>
        <radialGradient id={`${uid}-rg`} cx=".35" cy=".35" r=".8">
          <stop offset="0" stopColor="#B57A45" />
          <stop offset="1" stopColor="#6E4221" />
        </radialGradient>
      </defs>
      <path d="M48 16 Q49 10 46 6" stroke={found ? '#6E4221' : OUT.stroke} strokeWidth={found ? 2.2 : 1.4} fill="none" strokeLinecap="round" />
      <path d={CONE_PATH} fill={found ? `url(#${uid}-rg)` : OUT.fill} stroke={found ? '#4A2A12' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} />
      <g clipPath={`url(#${uid}-cp)`}>
        {CONE_SCALES.map((s, i) =>
          found ? (
            <g key={i}>
              <path d={s.d} fill={s.fill} stroke="#5A3517" strokeWidth={0.7} />
              <circle cx={s.dot[0]} cy={s.dot[1]} r={0.9} fill="#E3B27A" />
            </g>
          ) : (
            <path key={i} d={s.d} fill="none" stroke={OUT.vein} strokeWidth={0.6} opacity={0.45} />
          ),
        )}
      </g>
      <path d={CONE_PATH} fill="none" stroke={found ? '#4A2A12' : OUT.stroke} strokeWidth={1} />
    </>
  );
}

const GRANITE = (() => {
  const d = blob(48, 58, 34, 23, 11, 9, 0.1);
  const r = rng(3);
  const specks: { x: number; y: number; rx: number; ry: number; a: number; c: string }[] = [];
  for (let i = 0; i < 95; i++) {
    const x = 14 + r() * 68, y = 34 + r() * 48;
    const c = r();
    const col = c < 0.42 ? '#2A2622' : c < 0.7 ? '#F4F0EA' : c < 0.85 ? '#D6B3A0' : '#8E8780';
    specks.push({ x: f1(x), y: f1(y), rx: f1(0.6 + r() * 1.5), ry: f1(0.5 + r() * 1.1), a: Math.round(r() * 180), c: col });
  }
  return { d, specks };
})();
const sparkle = (x: number, y: number, s: number) =>
  `M${x} ${y - s}Q${x + s * 0.12} ${y - s * 0.12} ${x + s} ${y}Q${x + s * 0.12} ${y + s * 0.12} ${x} ${y + s}Q${x - s * 0.12} ${y + s * 0.12} ${x - s} ${y}Q${x - s * 0.12} ${y - s * 0.12} ${x} ${y - s}Z`;

function Granite({ found, uid }: { found: boolean; uid: string }) {
  return (
    <>
      <defs>
        <clipPath id={`${uid}-cp`}>
          <path d={GRANITE.d} />
        </clipPath>
        <radialGradient id={`${uid}-rg`} cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#D9D3CA" />
          <stop offset="1" stopColor="#8F877D" />
        </radialGradient>
        <radialGradient id={`${uid}-gl`}>
          <stop offset="0" stopColor="#FFD58A" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={GRANITE.d} fill={found ? `url(#${uid}-rg)` : OUT.fill} stroke={found ? '#5E574F' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} />
      <g clipPath={`url(#${uid}-cp)`} opacity={found ? 1 : 0.35}>
        {GRANITE.specks.map((s, i) => (
          <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} transform={`rotate(${s.a} ${s.x} ${s.y})`} fill={found ? s.c : s.c === '#F4F0EA' ? 'none' : OUT.vein} />
        ))}
      </g>
      <path d={GRANITE.d} fill="none" stroke={found ? '#5E574F' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} />
      {found && (
        <g>
          <circle cx="62" cy="44" r="12" fill={`url(#${uid}-gl)`} />
          <path d={sparkle(62, 44, 8)} fill="#FFF8E6" />
          <path d={sparkle(34, 52, 4)} fill="#FFF8E6" />
        </g>
      )}
    </>
  );
}

const DAM_STICKS = (() => {
  const r = rng(5);
  const out: { x1: number; x2: number; y: number; a: number; c: string; w: number; x: number }[] = [];
  for (let i = 0; i < 34; i++) {
    const t = r();
    const x = 12 + t * 72;
    const h = 30 * Math.sin(Math.PI * t) * (0.55 + r() * 0.45);
    const y = 66 - r() * h;
    const len = 14 + r() * 18;
    const a = (r() - 0.5) * 50;
    const col = ['#7A4E2A', '#8E5E33', '#A2703F', '#6A4222'][Math.floor(r() * 4)];
    out.push({ x1: f1(x - len / 2), x2: f1(x + len / 2), y: f1(y), a: f1(a), c: col, w: f1(2 + r() * 1.6), x: f1(x) });
  }
  return out;
})();

function Dam({ found, uid }: { found: boolean; uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA6B8" />
          <stop offset="1" stopColor="#4E7486" />
        </linearGradient>
        <clipPath id={`${uid}-cp`}>
          <path d="M10 68 Q48 30 86 68 Z" />
        </clipPath>
      </defs>
      <path d="M10 68 Q48 30 86 68 Z" fill={found ? '#5A3A20' : OUT.fill} stroke={found ? '#3E2713' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} />
      {found ? (
        DAM_STICKS.map((s, i) => <line key={i} x1={s.x1} y1={s.y} x2={s.x2} y2={s.y} transform={`rotate(${s.a} ${s.x} ${s.y})`} stroke={s.c} strokeWidth={s.w} strokeLinecap="round" />)
      ) : (
        <g clipPath={`url(#${uid}-cp)`} opacity={0.45}>
          {DAM_STICKS.filter((_, i) => i % 3 === 0).map((s, i) => (
            <line key={i} x1={s.x1} y1={s.y} x2={s.x2} y2={s.y} transform={`rotate(${s.a} ${s.x} ${s.y})`} stroke={OUT.vein} strokeWidth={0.8} strokeLinecap="round" />
          ))}
        </g>
      )}
      <path d="M74 66 L74 44 L77 36 L80 44 L80 66Z" fill={found ? '#E7D9BE' : OUT.fill} stroke={found ? '#8E6E45' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} strokeLinejoin="round" />
      {found && <path d="M74 44 L77 36 L80 44" fill="#C9A676" />}
      <rect x="4" y="66" width="88" height="20" rx="3" fill={found ? `url(#${uid}-w)` : OUT.fill} stroke={found ? 'none' : OUT.stroke} strokeWidth={1.1} />
      <path d="M10 73h22M40 73h14M62 73h22M16 79h18M46 79h24" stroke={found ? '#CFE6EE' : OUT.vein} strokeWidth="1" strokeLinecap="round" opacity={found ? 0.7 : 0.45} />
    </>
  );
}

const TUFA = (() => {
  const left: P2[] = [], right: P2[] = [];
  const r = rng(9);
  for (let i = 0; i <= 14; i++) {
    const y = 72 - i * 4.6;
    const base = 15 - i * 0.55 + (i > 10 ? -(i - 10) * 1.6 : 0);
    left.push([48 - base - r() * 3.2, y]);
    right.push([48 + base + r() * 3.2, y]);
  }
  const d = 'M' + [...left, [47, 5] as P2, ...right.reverse()].map(pt).join('L') + 'Z';
  const bumps: { x: number; y: number; r: number; c: string }[] = [];
  for (let i = 0; i < 26; i++) {
    const y = 12 + r() * 58, x = 48 + (r() - 0.5) * 22 * (1 - (72 - y) / 110);
    bumps.push({ x: f1(x), y: f1(y), r: f1(1.2 + r() * 2.2), c: r() > 0.5 ? '#B8AA91' : '#E4DAC6' });
  }
  return { d, bumps };
})();

function Tufa({ found, uid }: { found: boolean; uid: string }) {
  return (
    <>
      <defs>
        <clipPath id={`${uid}-cp`}>
          <path d={TUFA.d} />
        </clipPath>
        <linearGradient id={`${uid}-t`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9DFCC" />
          <stop offset="1" stopColor="#A89A82" />
        </linearGradient>
        <linearGradient id={`${uid}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86B3BE" />
          <stop offset="1" stopColor="#4F7C8A" />
        </linearGradient>
      </defs>
      <path d={TUFA.d} fill={found ? `url(#${uid}-t)` : OUT.fill} stroke={found ? '#6F634F' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} strokeLinejoin="round" />
      {found && (
        <g clipPath={`url(#${uid}-cp)`}>
          {TUFA.bumps.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity={0.9} />
          ))}
        </g>
      )}
      <rect x="6" y="72" width="84" height="16" rx="3" fill={found ? `url(#${uid}-w)` : OUT.fill} stroke={found ? 'none' : OUT.stroke} strokeWidth={1.1} />
      <path d="M14 78h20M44 78h10M62 78h18M22 83h14M50 83h20" stroke={found ? '#D8EEF2' : OUT.vein} strokeWidth="1" strokeLinecap="round" opacity={found ? 0.75 : 0.45} />
    </>
  );
}

function Eyes({ found, uid }: { found: boolean; uid: string }) {
  const eye = (x: number, y: number, w: number, a: number) => (
    <g transform={`rotate(${a} ${x} ${y})`}>
      <path d={`M${x - w} ${y}Q${x} ${y - w * 0.62} ${x + w} ${y}Q${x} ${y + w * 0.62} ${x - w} ${y}Z`} fill={found ? '#2E2620' : 'none'} stroke={found ? 'none' : OUT.stroke} strokeWidth={1.1} />
      {found && <path d={`M${x - w * 0.55} ${y}Q${x} ${y - w * 0.28} ${x + w * 0.55} ${y}Q${x} ${y + w * 0.28} ${x - w * 0.55} ${y}Z`} fill="#5E5046" />}
    </g>
  );
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bark`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C8BFAE" />
          <stop offset=".35" stopColor="#F3EEE4" />
          <stop offset=".8" stopColor="#E4DCCD" />
          <stop offset="1" stopColor="#AFA491" />
        </linearGradient>
      </defs>
      <path d="M30 4 Q27 48 29 92 L67 92 Q69 48 66 4Z" fill={found ? `url(#${uid}-bark)` : OUT.fill} stroke={found ? '#8E8471' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} />
      {eye(47, 30, 11, -8)}
      {eye(52, 64, 8, 6)}
      <path d="M36 14h6M55 46h7M38 80h5M58 84h5M34 48h4" stroke={found ? '#6C6152' : OUT.vein} strokeWidth="1.2" strokeLinecap="round" opacity={found ? 1 : 0.5} />
    </>
  );
}

const TRACK_BLOB = blob(48, 50, 40, 36, 21, 10, 0.08);
function Track({ found }: { found: boolean }) {
  // Mule deer: two pointed teardrop halves making an upside-down heart.
  const half = (x: number, y: number, s: number, flip: boolean) => {
    const f = flip ? -1 : 1;
    return `M${x} ${y - 13 * s}C${x + f * 7 * s} ${y - 9 * s} ${x + f * 9 * s} ${y + 4 * s} ${x + f * 7.5 * s} ${y + 11 * s}C${x + f * 6 * s} ${y + 15 * s} ${x + f * 1.2 * s} ${y + 14 * s} ${x + f * 0.8 * s} ${y + 9 * s}C${x + f * 0.4 * s} ${y + 1 * s} ${x - f * 0.4 * s} ${y - 7 * s} ${x} ${y - 13 * s}Z`;
  };
  const print = (x: number, y: number, s: number, a: number) => (
    <g transform={`rotate(${a} ${x} ${y})`} fill={found ? '#6A472B' : 'none'} stroke={found ? 'none' : OUT.stroke} strokeWidth={1.1}>
      <path d={half(x - 1.6 * s, y, s, true)} />
      <path d={half(x + 1.6 * s, y, s, false)} />
    </g>
  );
  return (
    <>
      <path d={TRACK_BLOB} fill={found ? '#D9C4A4' : OUT.fill} stroke={found ? '#A88D66' : OUT.stroke} strokeWidth={found ? 0.9 : 1.1} strokeDasharray={found ? undefined : '2 3'} />
      {print(38, 62, 1.35, -12)}
      {print(60, 32, 1.1, -12)}
    </>
  );
}

function Obsidian({ found, uid }: { found: boolean; uid: string }) {
  const d = 'M16 64 L30 30 L52 18 L78 34 L84 60 L62 78 L32 80 Z';
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-o`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B3945" />
          <stop offset=".55" stopColor="#16151B" />
          <stop offset="1" stopColor="#0B0A0E" />
        </linearGradient>
      </defs>
      <path d={d} fill={found ? `url(#${uid}-o)` : OUT.fill} stroke={found ? '#07060A' : OUT.stroke} strokeWidth={found ? 1 : 1.1} strokeLinejoin="round" />
      {found ? (
        <g>
          <path d="M30 30 L52 18 L56 44 Z" fill="#4A4856" opacity=".85" />
          <path d="M56 44 L78 34 L84 60 Z" fill="#26242E" />
          <path d="M36 40 Q46 36 52 26" stroke="#C9C6D6" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".9" />
          <path d="M40 66 Q50 58 62 62M44 72 Q54 64 66 68" stroke="#5D5A6C" strokeWidth=".9" fill="none" />
        </g>
      ) : (
        <path d="M30 30 L56 44 L84 60M52 18 L56 44 L62 78" stroke={OUT.vein} strokeWidth=".8" fill="none" opacity=".5" strokeLinejoin="round" />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Public API

/** Every hunt item id in src/content/kids.js has art. */
export const SPECIMEN_IDS = ['aspen', 'cottonwood', 'willow', 'birch', 'red', 'big', 'heart', 'cone', 'granite', 'dam', 'tufa', 'eyes', 'track', 'obsidian'] as const;
export type SpecimenId = (typeof SPECIMEN_IDS)[number];

export type SpecimenProps = {
  id: SpecimenId | string;
  /** false: a clean outline to look for. true: full fall color. */
  found?: boolean;
  className?: string;
  /** Accessible name; decorative (aria-hidden) when omitted. */
  label?: string;
};

export function Specimen({ id, found = false, className = '', label }: SpecimenProps) {
  const uid = 's' + useId().replace(/[^a-zA-Z0-9]/g, '');
  let body: ReactNode = null;
  switch (id) {
    case 'aspen':
    case 'cottonwood':
    case 'willow':
    case 'birch':
    case 'red':
    case 'heart':
      body = <LeafArt shape={SHAPES[id]} pal={LEAF[id]} found={found} uid={uid} />;
      break;
    case 'big':
      body = <Big found={found} uid={uid} />;
      break;
    case 'cone':
      body = <Cone found={found} uid={uid} />;
      break;
    case 'granite':
      body = <Granite found={found} uid={uid} />;
      break;
    case 'dam':
      body = <Dam found={found} uid={uid} />;
      break;
    case 'tufa':
      body = <Tufa found={found} uid={uid} />;
      break;
    case 'eyes':
      body = <Eyes found={found} uid={uid} />;
      break;
    case 'track':
      body = <Track found={found} />;
      break;
    case 'obsidian':
      body = <Obsidian found={found} uid={uid} />;
      break;
  }
  return (
    <svg viewBox="0 0 96 96" width="100%" height="100%" className={`specimen ${found ? 'art' : ''} ${className}`} data-found={found || undefined} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} overflow="visible">
      {body}
    </svg>
  );
}

/**
 * The outline of a specimen as path data (96 × 96 units), for particles and
 * masks ("found" bursts use the exact silhouette).
 */
export function specimenSilhouette(id: SpecimenId | string): string {
  switch (id) {
    case 'aspen':
    case 'cottonwood':
    case 'willow':
    case 'birch':
    case 'red':
    case 'heart':
    case 'big':
      return SHAPES[id].outline;
    case 'cone':
      return CONE_PATH;
    case 'granite':
      return GRANITE.d;
    case 'dam':
      return 'M10 68 Q48 30 86 68 Z';
    case 'tufa':
      return TUFA.d;
    case 'eyes':
      return 'M30 4 Q27 48 29 92 L67 92 Q69 48 66 4Z';
    case 'track':
      return TRACK_BLOB;
    case 'obsidian':
      return 'M16 64 L30 30 L52 18 L78 34 L84 60 L62 78 L32 80 Z';
  }
  return SHAPES.aspen.outline;
}

/**
 * An aspen leaf in one pigment state, for the "why leaves change" explainer:
 *   green  chlorophyll (summer)
 *   gold   carotenoids (what aspens show in fall)
 *   red    anthocyanins (made fresh in fall)
 */
export function Leaf({ pigment = 'gold', className = '', label }: { pigment?: 'green' | 'gold' | 'red'; className?: string; label?: string }) {
  const uid = 'l' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const pal = pigment === 'green' ? LEAF.green : pigment === 'red' ? LEAF.red : LEAF.aspen;
  return (
    <svg viewBox="0 0 96 96" width="100%" height="100%" className={`specimen art ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} overflow="visible">
      <LeafArt shape={SHAPES.explainer} pal={pal} found uid={uid} />
    </svg>
  );
}

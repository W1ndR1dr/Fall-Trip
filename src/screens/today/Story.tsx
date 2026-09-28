// The route story: a scroll-driven map of the weekend on real terrain.
//
// A tall track scrolls past a sticky stage. Scroll progress (smoothed with a
// spring) becomes `p`, 0..8: the overview, then eight chapters. Everything
// runs off `p` as motion values, so scrolling never re-renders React:
//   - the Terrain camera frames each chapter (a compositor transform);
//   - the route draws (pathLength) with a glowing head leading it;
//   - stops pop in as the head passes; labels fade with their chapter;
//   - a veil over the high country lifts as the drive climbs;
//   - light follows the clock (golden hour, dusk, New Moon stars, Sunday
//     sunrise from the east, which is the top of this map);
//   - an elevation profile tracks the head from sea level to 9,945 ft.
// Reduced motion: each chapter snaps to its framing with a short cross-fade.
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MapLabel, RouteLine, StopDot, Terrain, WaterLabel, useTerrain } from '@/art/Terrain';
import { FRIDAY_DRIVE, REGIONS, project, stop, stopFeet, type Crop, type Pt, type StopKey } from '@/art/geo';
import { Pressable, fade, spring, useCalm, usePageScroll } from '@/ui';
import { ArrowDown, ArrowUp, CaretRight } from '@/ui/icons';
import { CHAPTERS } from './chapters';

const BASE: Crop = [0, 0, REGIONS.route.width, REGIONS.route.height];
const S = (k: StopKey) => stop('route', k)!;
const N = CHAPTERS.length - 1; // p runs 0..N

// ---------------------------------------------------------------------------
// Geometry: the Friday spline (same construction as splinePath) and the
// Saturday loop as a polyline, both sampled into length tables.

type Table = { x: Float32Array; y: Float32Array; len: Float32Array; total: number; knots: number[] };

function splineTable(pts: readonly Pt[], per = 32): Table {
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  const xs = [pts[0][0]], ys = [pts[0][1]], ls = [0];
  const knots = [0];
  let L = 0;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    let px = p1[0], py = p1[1];
    for (let s = 1; s <= per; s++) {
      const t = s / per, u = 1 - t;
      const x = u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0];
      const y = u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1];
      L += Math.hypot(x - px, y - py);
      xs.push(x), ys.push(y), ls.push(L);
      px = x, py = y;
    }
    knots.push(L);
  }
  return { x: Float32Array.from(xs), y: Float32Array.from(ys), len: Float32Array.from(ls), total: L, knots: knots.map((k) => k / L) };
}

function polyTable(pts: readonly Pt[]): Table {
  const xs = [pts[0][0]], ys = [pts[0][1]], ls = [0], knots = [0];
  let L = 0;
  for (let i = 1; i < pts.length; i++) {
    L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    xs.push(pts[i][0]), ys.push(pts[i][1]), ls.push(L), knots.push(L);
  }
  return { x: Float32Array.from(xs), y: Float32Array.from(ys), len: Float32Array.from(ls), total: L, knots: knots.map((k) => k / L) };
}

function pointAt(t: Table, frac: number): Pt {
  const target = Math.max(0, Math.min(1, frac)) * t.total;
  let lo = 0, hi = t.len.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (t.len[mid] < target) lo = mid;
    else hi = mid;
  }
  const span = t.len[hi] - t.len[lo] || 1;
  const f = (target - t.len[lo]) / span;
  return [t.x[lo] + (t.x[hi] - t.x[lo]) * f, t.y[lo] + (t.y[hi] - t.y[lo]) * f];
}

// Friday: FRIDAY_DRIVE = bayarea, oakdale, groveland, craneflat, olmsted,
// tenaya, tuolumne, tioga, leevining, two US-395 waypoints, mammoth.
const FRI = splineTable(FRIDAY_DRIVE);
const FRI_STOPS: StopKey[] = ['bayarea', 'oakdale', 'groveland', 'craneflat', 'olmsted', 'tenaya', 'tuolumne', 'tioga', 'leevining'];
const friAt = (k: StopKey) => (k === 'mammoth' ? 1 : FRI.knots[FRI_STOPS.indexOf(k)]);
// Elevation (ft) along Friday's drive at each knot; waypoints interpolate.
const FRI_FEET = (() => {
  const known = [...FRI_STOPS.map((k) => stopFeet(k)), NaN, NaN, stopFeet('mammoth')].map((v) => Math.max(0, v));
  known[9] = known[8] + (known[11] - known[8]) * (FRI.knots[9] - FRI.knots[8]) / (1 - FRI.knots[8]);
  known[10] = known[8] + (known[11] - known[8]) * (FRI.knots[10] - FRI.knots[8]) / (1 - FRI.knots[8]);
  return known;
})();
function friFeet(frac: number) {
  const k = FRI.knots;
  for (let i = 1; i < k.length; i++) if (frac <= k[i]) return FRI_FEET[i - 1] + ((FRI_FEET[i] - FRI_FEET[i - 1]) * (frac - k[i - 1])) / (k[i] - k[i - 1] || 1);
  return FRI_FEET[FRI_FEET.length - 1];
}

// Saturday: Mammoth north on US-395 to Lee Vining, up to Lundy Canyon, Conway
// Summit, back to Lee Vining for lunch, South Tufa, then home to Mammoth.
// Schematic (the terrain file has stops, not road geometry).
const JCT = project('route', 38.035, -119.14); // Lundy Lake Rd at US-395
const TUFA_RD = project('route', 37.95, -119.07); // CA-120 east toward the lake

/** Points along a quadratic curve a → b bowed through `via` (or a gentle bow). */
function curve(a: Pt, b: Pt, via?: Pt, n = 10): Pt[] {
  const c: Pt = via ?? [(a[0] + b[0]) / 2 - (b[1] - a[1]) * 0.12, (a[1] + b[1]) / 2 + (b[0] - a[0]) * 0.12];
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, u = 1 - t;
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]] as Pt;
  });
}
/** Friday's own spline between two fractions, so shared roads overlap exactly. */
function friStretch(from: number, to: number, n = 36): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => pointAt(FRI, from + ((to - from) * i) / n));
}

// Saturday, as driven: Mammoth north on US-395 to Lee Vining, up Lundy
// Canyon, Conway Summit, back to Lee Vining for lunch, South Tufa, then home.
// The terrain file has stops, not road geometry, so the side roads are
// gentle curves between real stop positions.
const SAT_BUILD = (() => {
  const pts: Pt[] = [];
  const feet: number[] = [];
  const marks: Record<string, number> = {};
  const add = (seg: Pt[], f0: number, f1: number, mark?: string) => {
    seg.forEach((pt, i) => {
      if (pts.length && i === 0) return;
      pts.push(pt);
      feet.push(f0 + ((f1 - f0) * i) / Math.max(1, seg.length - 1));
    });
    if (mark) marks[mark] = pts.length - 1;
  };
  const lv = friAt('leevining');
  const ft = (k: StopKey) => stopFeet(k);
  const toLV = friStretch(1, lv);
  toLV.forEach((pt, i) => {
    pts.push(pt);
    feet.push(friFeet(1 - ((1 - lv) * i) / (toLV.length - 1)));
  });
  const jFt = (ft('leevining') + ft('lundy')) / 2;
  const lvJ = curve(S('leevining'), JCT);
  const jLundy = curve(JCT, S('lundy'));
  const jConway = curve(JCT, S('conway'));
  const lvTufa = curve(S('leevining'), S('southtufa'), TUFA_RD, 14);
  add(lvJ, ft('leevining'), jFt);
  add(jLundy, jFt, ft('lundy'), 'lundy');
  add([...jLundy].reverse(), ft('lundy'), jFt);
  add(jConway, jFt, ft('conway'), 'conway');
  add([...jConway].reverse(), ft('conway'), jFt);
  add([...lvJ].reverse(), jFt, ft('leevining'));
  add(lvTufa, ft('leevining'), ft('southtufa'), 'tufa');
  add([...lvTufa].reverse(), ft('southtufa'), ft('leevining'));
  const home = friStretch(lv, 1);
  home.forEach((pt, i) => {
    if (i === 0) return;
    pts.push(pt);
    feet.push(friFeet(lv + ((1 - lv) * i) / (home.length - 1)));
  });
  return { pts, feet, marks };
})();
const SAT = polyTable(SAT_BUILD.pts);
const SAT_D = 'M' + SAT_BUILD.pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L');
const SAT_LUNDY = SAT.knots[SAT_BUILD.marks.lundy];
const SAT_CONWAY = SAT.knots[SAT_BUILD.marks.conway];
const SAT_TUFA = SAT.knots[SAT_BUILD.marks.tufa];
function satFeet(frac: number) {
  const k = SAT.knots, f = SAT_BUILD.feet;
  for (let i = 1; i < k.length; i++) if (frac <= k[i]) return f[i - 1] + ((f[i] - f[i - 1]) * (frac - k[i - 1])) / (k[i] - k[i - 1] || 1);
  return f[f.length - 1];
}

// ---------------------------------------------------------------------------
// The story as functions of p (0..N).

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** Chapter-to-chapter keyframes, eased so the story dwells on each chapter. */
function keyed(p: number, keys: readonly number[]) {
  const i = Math.max(0, Math.min(keys.length - 2, Math.floor(p)));
  const f = smooth(clamp01(p - i));
  return keys[i] + (keys[i + 1] - keys[i]) * f;
}

// Head position along Friday (fri) or Saturday (sat), per chapter.
const FRI_HEAD = [0, 0, friAt('oakdale'), friAt('tenaya'), 1, 1, 1, 1, 0];
const SAT_HEAD = [0, 0, 0, 0, 0, SAT_CONWAY, SAT_TUFA, 1, 1];

type Head = { leg: 'fri' | 'sat'; frac: number; pt: Pt; feet: number };
function headAt(p: number): Head {
  if (p > 4 && p < 7) {
    const frac = keyed(p, SAT_HEAD);
    return { leg: 'sat', frac, pt: pointAt(SAT, frac), feet: satFeet(frac) };
  }
  const frac = keyed(p, FRI_HEAD);
  return { leg: 'fri', frac, pt: pointAt(FRI, frac), feet: friFeet(frac) };
}
const friDrawn = (p: number) => (p <= 1 ? 0 : p >= 4 ? 1 : keyed(p, FRI_HEAD));
const satDrawn = (p: number) => (p <= 4 ? 0 : p >= 7 ? 1 : keyed(p, SAT_HEAD));

// Light per chapter: golden (west, bottom), dusk, night, morning (east, top).
const LIGHT = {
  golden: [0, 0, 0.25, 1, 0.35, 0, 0, 0, 0],
  dusk: [0, 0, 0, 0, 0.7, 0, 0, 0.1, 0],
  night: [0, 0, 0, 0, 0.2, 0, 0, 1, 0],
  morning: [0, 0, 0, 0, 0, 0.45, 0.1, 0, 0.6],
} as const;

// Stops: where each sits on its leg, and the p at which the head reaches it.
type StopDef = { key: StopKey; kind: 'minor' | 'major'; leg: 'fri' | 'sat'; at: number; preview?: boolean };
const STOPS: StopDef[] = [
  ...FRI_STOPS.map((k) => ({ key: k, kind: (k === 'bayarea' || k === 'tioga' ? 'major' : 'minor') as 'minor' | 'major', leg: 'fri' as const, at: friAt(k), preview: k === 'tioga' || k === 'leevining' })),
  { key: 'mammoth', kind: 'major', leg: 'fri', at: 1, preview: true },
  { key: 'lundy', kind: 'minor', leg: 'sat', at: SAT_LUNDY },
  { key: 'conway', kind: 'minor', leg: 'sat', at: SAT_CONWAY },
  { key: 'southtufa', kind: 'minor', leg: 'sat', at: SAT_TUFA },
];
const REVEAL: number[] = STOPS.map((s) => {
  for (let p = 0; p <= N; p += 0.005) if ((s.leg === 'fri' ? friDrawn(p) : satDrawn(p)) >= s.at - 1e-4 && (s.leg === 'sat' ? p > 4 : p >= 1)) return p;
  return N;
});

// Labels: which chapters each shows in, and where it sits (clear of the route).
type LabelDef = { key: StopKey; title: string; sub?: string; subAccent?: string; side?: 'right' | 'left' | 'above' | 'below'; offset?: [number, number]; leader?: boolean; from: number; to: number; size?: 'sm' | 'md' | 'lg' };
const TIOGA_FT = `${stopFeet('tioga').toLocaleString('en-US')} ft`;
const LABELS: LabelDef[] = [
  { key: 'bayarea', title: 'Bay Area', sub: 'Leave at noon', side: 'right', from: 1, to: 1 },
  { key: 'oakdale', title: 'Oakdale', sub: '2:10 pm', side: 'right', from: 1.6, to: 2 },
  { key: 'groveland', title: 'Groveland', sub: '3:40 pm', side: 'left', from: 2, to: 2.4 },
  { key: 'craneflat', title: 'Crane Flat', sub: 'Last gas · 4:35 pm', side: 'right', from: 2.6, to: 3 },
  { key: 'olmsted', title: 'Olmsted Point', sub: '5:40 pm', side: 'right', offset: [10, 14], leader: true, from: 3, to: 3 },
  { key: 'tenaya', title: 'Tenaya Lake', sub: '6:00 pm', side: 'left', offset: [-4, -8], from: 3, to: 3 },
  { key: 'tioga', title: 'Tioga Pass', subAccent: TIOGA_FT, sub: '6:50 pm', side: 'right', from: 0, to: 0 },
  { key: 'tioga', title: 'Tioga Pass', subAccent: TIOGA_FT, sub: '6:50 pm', side: 'right', from: 3.6, to: 4 },
  { key: 'leevining', title: 'Lee Vining', sub: '7:15 pm', side: 'left', from: 0, to: 0 },
  { key: 'leevining', title: 'Lee Vining', sub: '7:15 pm', side: 'left', from: 3.8, to: 4 },
  { key: 'leevining', title: 'Lee Vining', sub: 'Lunch 11:45 am', side: 'right', offset: [2, 6], from: 6, to: 6 },
  { key: 'mammoth', title: 'Mammoth Lakes', sub: '8:00 pm', side: 'right', size: 'lg', from: 0, to: 0 },
  { key: 'mammoth', title: 'Mammoth Lakes', sub: '8:00 pm', side: 'right', size: 'lg', from: 4, to: 4 },
  { key: 'mammoth', title: 'Mammoth Lakes', sub: 'Stargazing 7:30 pm', side: 'right', size: 'lg', from: 7, to: 7 },
  { key: 'mammoth', title: 'Mammoth Lakes', sub: 'Leave 9:30 am', side: 'right', size: 'lg', from: 8, to: 8 },
  { key: 'bayarea', title: 'Home', sub: 'About 6 pm', side: 'right', from: 8, to: 8 },
  { key: 'tioga', title: 'Tioga Pass', subAccent: TIOGA_FT, side: 'right', from: 8, to: 8 },
  { key: 'lundy', title: 'Lundy Canyon', sub: '9:15 am', side: 'below', from: 5, to: 5 },
  { key: 'conway', title: 'Conway Summit', sub: '11:00 am', side: 'left', from: 5, to: 5 },
  { key: 'southtufa', title: 'South Tufa', sub: '12:45 pm', side: 'right', from: 6, to: 6 },
];

// Framings: the box each chapter must show, in route map units [x0, y0, x1, y1].
const FRAMES: [number, number, number, number][] = [
  [40, 70, 300, 560], // overview: Groveland over Tioga to Mammoth
  [196, 860, 372, 1180], // leave home: the Bay Area, Oakdale ahead
  [120, 500, 250, 790], // Oakdale to Groveland
  [128, 240, 222, 405], // Tioga Road: Crane Flat to Tenaya Lake
  [66, 66, 330, 236], // over the pass to Mammoth
  [26, 124, 128, 204], // the aspens: Lundy, Conway
  [70, 92, 170, 166], // Mono Lake: Lee Vining, South Tufa
  [196, 40, 292, 150], // New Moon over Mammoth
  [30, 56, 350, 1180], // Sunday: the whole way home
];

// ---------------------------------------------------------------------------

type Geo = { w: number; h: number; top: number; bottom: number };

/** Camera {x, y, zoom} that fits `box` into the visible map area of the stage. */
function frameCamera(box: readonly number[], g: Geo) {
  const k0 = Math.max(g.w / BASE[2], g.h / BASE[3]);
  const visW = g.w - 40;
  const bottom = g.bottom - 56; // the scrim starts above the profile
  const visH = Math.max(80, bottom - g.top - 16);
  const k = Math.min(visW / (box[2] - box[0]), visH / (box[3] - box[1]));
  const zoom = Math.max(0.3, Math.min(3.2, k / k0));
  const cx = (box[0] + box[2]) / 2;
  const cy = (box[1] + box[3]) / 2;
  const vy = (g.top + bottom) / 2; // where the box center should land on screen
  return { x: cx, y: cy + (g.h / 2 - vy) / (k0 * zoom), zoom };
}

export default function Story() {
  const calm = useCalm();
  const scroller = usePageScroll();
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo>({ w: 390, h: 760, top: 96, bottom: 470 });
  const [vh, setVh] = useState(760);

  // Stage = the scroller's viewport; the map shows between the nav bar and
  // the bottom stack (elevation strip + chapter card).
  useLayoutEffect(() => {
    const sc = scroller.current, st = stage.current, bt = bottom.current;
    if (!sc || !st || !bt) return;
    const measure = () => {
      setVh(sc.clientHeight);
      const nav = sc.querySelector('.navbar') as HTMLElement | null;
      setGeo({ w: st.clientWidth, h: st.clientHeight, top: (nav?.offsetHeight ?? 52) + 4, bottom: bt.offsetTop });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sc);
    ro.observe(st);
    ro.observe(bt);
    return () => ro.disconnect();
  }, [scroller]);

  const { scrollYProgress } = useScroll({ container: scroller, target: track, offset: ['start start', 'end end'] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });
  const p = useMotionValue(0);
  const stageO = useMotionValue(1);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);

  const toChapter = (i: number) => {
    if (i !== idxRef.current) {
      idxRef.current = i;
      setIdx(i);
    }
  };
  useMotionValueEvent(smoothP, 'change', (v) => {
    if (calm) return;
    p.set(v * N);
    toChapter(Math.round(v * N));
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!calm) return;
    const i = Math.round(v * N);
    if (i === idxRef.current) return;
    toChapter(i);
    // Snap to the chapter's framing behind a quick cross-fade.
    stageO.jump(0.25);
    p.jump(i);
    animate(stageO, 1, fade.base);
  });
  useEffect(() => {
    const v = scrollYProgress.get() * N;
    p.jump(calm ? Math.round(v) : v);
    toChapter(Math.round(v));
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera: interpolate chapter framings (log-space zoom).
  const cams = useMemo(() => FRAMES.map((b) => frameCamera(b, geo)), [geo]);
  const cam = (pp: number) => {
    const i = Math.max(0, Math.min(N - 1, Math.floor(pp)));
    const f = smooth(clamp01(pp - i));
    const a = cams[i], b = cams[i + 1];
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * f) };
  };
  const camRef = useRef(cam);
  camRef.current = cam;
  const camX = useTransform(p, (v) => camRef.current(v).x);
  const camY = useTransform(p, (v) => camRef.current(v).y);
  const camZ = useTransform(p, (v) => camRef.current(v).zoom);
  // Re-frame when the stage size changes.
  useEffect(() => {
    const c = cam(p.get());
    camX.set(c.x), camY.set(c.y), camZ.set(c.zoom);
  }, [cams]); // eslint-disable-line react-hooks/exhaustive-deps
  const camera = useMemo(() => ({ x: camX, y: camY, zoom: camZ }), [camX, camY, camZ]);

  // Stops pop in as the head passes (state changes only at crossings).
  const [reached, setReached] = useState(() => REVEAL.map((r) => r <= 0));
  const [overview, setOverview] = useState(true);
  const [sunday, setSunday] = useState(false);
  useMotionValueEvent(p, 'change', (v) => {
    const next = REVEAL.map((r) => v >= r - 0.02);
    setReached((prev) => (prev.every((x, i) => x === next[i]) ? prev : next));
    const ov = v < 0.5;
    setOverview((o) => (o === ov ? o : ov));
    const su = v > 7.5;
    setSunday((o) => (o === su ? o : su));
  });

  const friProgress = useTransform(p, friDrawn);
  const satProgress = useTransform(p, satDrawn);
  const satO = useTransform(p, [7, 7.6], [1, 0]);
  const head = useTransform(p, headAt);
  const headX = useTransform(head, (h) => h.pt[0]);
  const headY = useTransform(head, (h) => h.pt[1]);
  const headO = useTransform(p, [0, 0.6, 7.6, 8], [0, 1, 1, 1]);
  const feetMV = useTransform(head, (h) => h.feet);
  const feetText = useTransform(feetMV, (f) => `${Math.round(f / 10) * 10 >= 9940 ? '9,945' : (Math.round(f / 10) * 10).toLocaleString('en-US')} ft`);
  const profileFrac = useTransform(p, (v) => (v > 4 && v < 7 ? 1 : keyed(v, FRI_HEAD)));
  const profileO = useTransform(p, [0, 0.5, 4.2, 4.6, 6.6, 7.2], [0.55, 1, 1, 0.45, 0.45, 1]);

  // Veil over the high country, lifting as the drive climbs.
  const fogO = useTransform(p, (v) => {
    if (v < 0.35 || v > 4.3) return 0;
    const inO = clamp01((v - 0.35) / 0.6);
    const h = headAt(v);
    const m = h.feet / 3.28084;
    return inO * clamp01((2750 - m) / 1700) * 0.6;
  });

  const light = {
    golden: useTransform(p, (v) => keyed(v, LIGHT.golden)),
    dusk: useTransform(p, (v) => keyed(v, LIGHT.dusk)),
    night: useTransform(p, (v) => keyed(v, LIGHT.night)),
    morning: useTransform(p, (v) => keyed(v, LIGHT.morning)),
  };

  // Visible map rect in map units (for screen-aligned light layers).
  const view = (v: number) => {
    const c = camRef.current(v);
    const k0 = Math.max(geo.w / BASE[2], geo.h / BASE[3]);
    const s = k0 * c.zoom;
    return { x: c.x - geo.w / 2 / s, y: c.y - geo.h / 2 / s, w: geo.w / s, h: geo.h / s };
  };
  const viewRef = useRef(view);
  viewRef.current = view;
  const vX = useTransform(p, (v) => viewRef.current(v).x);
  const vY = useTransform(p, (v) => viewRef.current(v).y);
  const vW = useTransform(p, (v) => viewRef.current(v).w);
  const vH = useTransform(p, (v) => viewRef.current(v).h);
  useEffect(() => {
    const r = view(p.get());
    vX.set(r.x), vY.set(r.y), vW.set(r.w), vH.set(r.h);
  }, [geo]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = Math.round(vh * 0.62);
  const trackH = vh + step * N;
  const ch = CHAPTERS[idx];

  const goTo = (i: number) => {
    const sc = scroller.current, tr = track.current;
    if (!sc || !tr) return;
    const top = tr.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
    const target = i > N ? top + trackH - vh + 40 : top + (i / N) * (trackH - vh);
    sc.scrollTo({ top: target, behavior: calm ? 'auto' : 'smooth' });
  };

  return (
    <div className="td-story" ref={track} style={{ height: trackH }}>
      <div className="td-story-stage" ref={stage} style={{ height: vh }}>
        <motion.div className="td-story-map" style={{ opacity: stageO }}>
          <Terrain region="route" crop={BASE} camera={camera} fade="none" className="td-story-terrain" style={{ height: '100%' }} underlay={<Feather />}>
            <StoryOverlays p={p} light={light} fogO={fogO} headY={headY} view={{ x: vX, y: vY, w: vW, h: vH }} />
            <RouteLine points={FRIDAY_DRIVE} variant="muted" />
            <motion.g style={{ opacity: satO }}>
              <RouteLine d={SAT_D} progress={satProgress} width={2.2} />
            </motion.g>
            <RouteLine points={FRIDAY_DRIVE} progress={friProgress} />
            <WaterLabels p={p} />
            {STOPS.map((s, i) => (
              <PopStop key={s.key} at={S(s.key)} kind={s.kind} on={(reached[i] && !(sunday && s.leg === 'sat')) || (overview && !!s.preview)} />
            ))}
            <HeadDot x={headX} y={headY} o={headO} />
            {LABELS.map((l, i) => (
              <StoryLabel key={i} def={l} p={p} reveal={revealFor(l.key)} />
            ))}
          </Terrain>
          <Stars o={light.night} />
          {/* The map settles into the page behind the profile and card. */}
          <div className="td-story-scrim" style={{ top: Math.max(0, geo.bottom - 64) }} />
        </motion.div>

        <div className="td-story-bottom" ref={bottom}>
          <Profile frac={profileFrac} o={profileO} feet={feetText} feetO={headO} />
          <motion.div className="td-chapter" layout={!calm} transition={spring.glide}>
            <div className="td-chapter-top">
              <span className="t-eyebrow td-chapter-when">{ch.when}</span>
              <Ticks idx={idx} />
            </div>
            <div className="td-chapter-body">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={idx}
                  className="td-chapter-text"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                  transition={{ type: 'spring', visualDuration: 0.35, bounce: 0 }}
                >
                  <h3 className="td-chapter-title">{ch.title}</h3>
                  <p className="t-callout td-chapter-copy">{ch.text}</p>
                  <Pressable href={ch.link[0]} className="td-chapter-link" scale={0.96}>
                    {ch.link[1]}
                    <CaretRight size={13} weight="bold" aria-hidden="true" />
                  </Pressable>
                </motion.div>
              </AnimatePresence>
              <Pressable className="td-chapter-next" onClick={() => goTo(idx >= N ? -1 : idx + 1)} scale={0.92} aria-label={idx >= N ? 'Back to the start of the drive' : `Next: ${CHAPTERS[idx + 1].title}`}>
                {idx >= N ? <ArrowUp size={18} weight="bold" aria-hidden="true" /> : <ArrowDown size={18} weight="bold" aria-hidden="true" />}
              </Pressable>
            </div>
          </motion.div>
        </div>
      </div>
      {/* The whole story as text, for screen readers. */}
      <ol className="sr-only">
        {CHAPTERS.map((c) => (
          <li key={c.title}>
            {c.when}. {c.title}. {c.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

function revealFor(key: StopKey) {
  const i = STOPS.findIndex((s) => s.key === key);
  return i < 0 ? 0 : REVEAL[i];
}

// ---------------------------------------------------------------------------
// Pieces drawn inside the terrain (map units).

/** Feathers the relief's own edges into the page when the camera pulls back. */
function Feather() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const W = BASE[2], H = BASE[3], f = 46;
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id={`${id}l`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--bg)' }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)', stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--bg)' }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)', stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--bg)' }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)', stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--bg)' }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <rect x={-1} y={-40} width={f} height={H + 80} fill={`url(#${id}l)`} />
      <rect x={W - f + 1} y={-40} width={f} height={H + 80} fill={`url(#${id}r)`} />
      <rect x={-40} y={-1} width={W + 80} height={f} fill={`url(#${id}t)`} />
      <rect x={-40} y={H - f + 1} width={W + 80} height={f} fill={`url(#${id}b)`} />
    </g>
  );
}

type LightMV = { golden: MotionValue<number>; dusk: MotionValue<number>; night: MotionValue<number>; morning: MotionValue<number> };
type ViewMV = { x: MotionValue<number>; y: MotionValue<number>; w: MotionValue<number>; h: MotionValue<number> };

/** Veil over the high country + time-of-day light, under the route and labels. */
function StoryOverlays({ light, fogO, headY, view }: { p: MotionValue<number>; light: LightMV; fogO: MotionValue<number>; headY: MotionValue<number>; view: ViewMV }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fogH = useTransform(headY, (y) => Math.max(0, y - 40 + 400));
  const rect = { x: view.x, y: view.y, width: view.w, height: view.h };
  return (
    <g className="td-story-light" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}fog`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--bg)', stopOpacity: 0.95 }} />
          <stop offset="0.82" style={{ stopColor: 'var(--bg)', stopOpacity: 0.7 }} />
          <stop offset="1" style={{ stopColor: 'var(--bg)', stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={`${id}gold`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--td-sun)', stopOpacity: 0.05 }} />
          <stop offset="0.45" style={{ stopColor: 'var(--td-sun)', stopOpacity: 0.14 }} />
          <stop offset="0.72" style={{ stopColor: 'var(--td-sun)', stopOpacity: 0.36 }} />
          <stop offset="1" style={{ stopColor: 'var(--td-sun)', stopOpacity: 0.4 }} />
        </linearGradient>
        <linearGradient id={`${id}dusk`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--td-dusk-hi)', stopOpacity: 0.5 }} />
          <stop offset="0.3" style={{ stopColor: 'var(--td-dusk-lo)', stopOpacity: 0.3 }} />
          <stop offset="0.7" style={{ stopColor: 'var(--td-dusk-lo)', stopOpacity: 0.08 }} />
          <stop offset="1" style={{ stopColor: 'var(--td-dusk-lo)', stopOpacity: 0.14 }} />
        </linearGradient>
        <linearGradient id={`${id}night`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--td-nightsky)', stopOpacity: 1 }} />
          <stop offset="0.3" style={{ stopColor: 'var(--td-nightsky)', stopOpacity: 0.78 }} />
          <stop offset="0.62" style={{ stopColor: 'var(--td-nightsky)', stopOpacity: 0.34 }} />
          <stop offset="1" style={{ stopColor: 'var(--td-nightsky)', stopOpacity: 0.3 }} />
        </linearGradient>
        <linearGradient id={`${id}morn`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--td-sun)', stopOpacity: 0.5 }} />
          <stop offset="0.45" style={{ stopColor: 'var(--td-sun)', stopOpacity: 0.08 }} />
          <stop offset="1" style={{ stopColor: 'var(--td-sun)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <motion.rect x={-600} y={-400} width={1620} height={fogH} fill={`url(#${id}fog)`} style={{ opacity: fogO }} />
      <motion.rect {...rect} fill={`url(#${id}gold)`} style={{ opacity: light.golden }} />
      <motion.rect {...rect} fill={`url(#${id}morn)`} style={{ opacity: light.morning }} />
      <motion.rect {...rect} fill={`url(#${id}dusk)`} style={{ opacity: light.dusk }} />
      <motion.rect {...rect} fill={`url(#${id}night)`} style={{ opacity: light.night }} />
    </g>
  );
}

/** Mono Lake's name, with the chapters that show it. */
function WaterLabels({ p }: { p: MotionValue<number> }) {
  const o = useTransform(p, (v) => {
    const on = (a: number, b: number) => clamp01(Math.min(v - (a - 0.5), b + 0.5 - v) / 0.35);
    return Math.max(on(0, 0), on(4, 6));
  });
  const m = S('monolake');
  return (
    <motion.g style={{ opacity: o }}>
      <WaterLabel at={[m[0] - 4, m[1] + 4]}>Mono Lake</WaterLabel>
    </motion.g>
  );
}

function PopStop({ at, kind, on }: { at: Pt; kind: 'minor' | 'major'; on: boolean }) {
  const calm = useCalm();
  const g = useRef<SVGGElement>(null);
  const sc = useMotionValue(on ? 1 : 0);
  useEffect(() => {
    if (calm) {
      sc.jump(on ? 1 : 0);
      return;
    }
    const ctl = animate(sc, on ? 1 : 0, on ? { type: 'spring', stiffness: 500, damping: 25 } : { duration: 0.15 });
    return () => ctl.stop();
  }, [on, calm, sc]);
  useLayoutEffect(() => {
    const apply = (v: number) => {
      const el = g.current;
      if (!el) return;
      el.setAttribute('transform', `translate(${at[0]} ${at[1]}) scale(${Math.max(0.001, v)}) translate(${-at[0]} ${-at[1]})`);
      el.style.opacity = String(Math.min(1, v * 1.4));
    };
    apply(sc.get());
    return sc.on('change', apply);
  }, [sc, at]);
  return (
    <g ref={g}>
      <StopDot at={at} kind={kind} />
    </g>
  );
}

/** The route's glowing head (constant screen size while the camera moves). */
function HeadDot({ x, y, o }: { x: MotionValue<number>; y: MotionValue<number>; o: MotionValue<number> }) {
  const { k, iz, theme } = useTerrain();
  const r = useTransform(iz, (z) => (6.5 / k) * z);
  const halo = useTransform(iz, (z) => (15 / k) * z);
  const ring = useTransform(iz, (z) => (2.5 / k) * z);
  return (
    <motion.g className="td-head" style={{ opacity: o }}>
      <motion.circle cx={x} cy={y} r={halo} fill="var(--accent-soft)" />
      {theme === 'dark' && <motion.circle className="map-glow" cx={x} cy={y} r={halo} fill="var(--accent-mark)" opacity={0.28} />}
      <motion.circle cx={x} cy={y} r={r} fill="var(--accent-mark)" stroke="var(--stop-ring)" strokeWidth={ring} />
    </motion.g>
  );
}

function StoryLabel({ def, p, reveal }: { def: LabelDef; p: MotionValue<number>; reveal: number }) {
  const o = useTransform(p, (v) => {
    const range = clamp01(Math.min(v - (def.from - 0.45), def.to + 0.45 - v) / 0.3);
    const shown = def.from === 0 && def.to === 0 ? 1 : clamp01((v - (reveal - 0.1)) / 0.15);
    return Math.min(range, shown);
  });
  const vis = useTransform(o, (x) => (x < 0.01 ? 'hidden' : 'visible'));
  return (
    <motion.g style={{ opacity: o, visibility: vis }}>
      <MapLabel at={S(def.key)} title={def.title} sub={def.sub} subAccent={def.subAccent} side={def.side} offset={def.offset} leader={def.leader} size={def.size ?? 'md'} />
    </motion.g>
  );
}

// ---------------------------------------------------------------------------
// Screen-space pieces.

const STAR_FIELD = (() => {
  // Deterministic scatter, denser toward the top (the eastern sky).
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 140 }, () => {
    const y = Math.pow(rnd(), 1.6) * 62;
    return { x: rnd() * 100, y, r: 0.35 + Math.pow(rnd(), 3) * 1.1, o: 0.35 + rnd() * 0.65 };
  });
})();

function Stars({ o }: { o: MotionValue<number> }) {
  const op = useTransform(o, (v) => clamp01((v - 0.35) / 0.55));
  const vis = useTransform(op, (x) => (x < 0.01 ? 'hidden' : 'visible'));
  return (
    <motion.svg className="td-stars" style={{ opacity: op, visibility: vis }} aria-hidden="true">
      {STAR_FIELD.map((st, i) => (
        <circle key={i} cx={`${st.x}%`} cy={`${st.y}%`} r={st.r} fill="var(--td-star)" opacity={st.o} />
      ))}
    </motion.svg>
  );
}

/** Elevation along Friday's drive: sea level to 9,945 ft at Tioga Pass. */
const PW = 300, PH = 40, PTOP = 4;
const PMAX = stopFeet('tioga');
const profY = (f: number) => PH - (Math.max(0, friFeet(f)) / PMAX) * (PH - PTOP);
const PROFILE_LINE = 'M' + Array.from({ length: 161 }, (_, i) => `${((i / 160) * PW).toFixed(1)} ${profY(i / 160).toFixed(2)}`).join(' L');
const PROFILE_AREA = `${PROFILE_LINE} L${PW} ${PH} L0 ${PH} Z`;

function Profile({ frac, o, feet, feetO }: { frac: MotionValue<number>; o: MotionValue<number>; feet: MotionValue<string>; feetO: MotionValue<number> }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipW = useTransform(frac, (f) => f * PW);
  const left = useTransform(frac, (f) => `${f * 100}%`);
  const top = useTransform(frac, (f) => profY(f));
  const tioga = friAt('tioga') * 100;
  return (
    <motion.div className="td-profile" style={{ opacity: o }} aria-hidden="true">
      <div className="td-profile-head">
        <span className="t-caption td-profile-label">Elevation</span>
        <motion.span className="td-profile-feet num" style={{ opacity: feetO }}>
          {feet}
        </motion.span>
      </div>
      <div className="td-profile-plot">
        <svg className="td-profile-svg" viewBox={`0 0 ${PW} ${PH}`} preserveAspectRatio="none">
          <defs>
            <clipPath id={`${id}c`}>
              <motion.rect x={0} y={-4} height={PH + 8} width={clipW} />
            </clipPath>
          </defs>
          <path d={PROFILE_AREA} fill="var(--fill-2)" />
          <path d={PROFILE_LINE} fill="none" stroke="var(--line-2)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
          <g clipPath={`url(#${id}c)`}>
            <path d={PROFILE_AREA} fill="var(--accent-soft)" />
            <path d={PROFILE_LINE} fill="none" stroke="var(--accent-mark)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
        <span className="td-profile-tioga" style={{ left: `${tioga}%` }} />
        <motion.span className="td-profile-dot" style={{ left, top }} />
      </div>
      <div className="td-profile-axis t-caption num">
        <span>Sea level</span>
        <span className="td-profile-peak" style={{ left: `${tioga}%` }}>
          {PMAX.toLocaleString('en-US')} ft
        </span>
        <span>Mammoth</span>
      </div>
    </motion.div>
  );
}

function Ticks({ idx }: { idx: number }) {
  return (
    <span className="td-ticks" aria-hidden="true">
      {CHAPTERS.map((_, i) => (
        <span key={i} className="td-tick" data-on={i <= idx || undefined}>
          {i === idx && <motion.span layoutId="today-story-tick" className="td-tick-pill" transition={spring.indicator} />}
        </span>
      ))}
    </span>
  );
}


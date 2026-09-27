// Home scrollytelling: the route draws itself across a hand-painted map as
// you scroll, stop by stop, and the view pans to follow it.
// All motion is JavaScript, tied to scroll; reduced motion snaps per chapter.
import { reducedMotion } from './ui.js';

// Map coordinates (east is up) must match art/paintings.mjs MAP.stops.
export const STOPS = {
  home: [252, 712], oakdale: [196, 612], groveland: [176, 522], craneflat: [162, 456], olmsted: [150, 392], tenaya: [142, 362],
  tuolumne: [132, 314], tioga: [122, 262], leevining: [112, 206], monolake: [96, 128], southtufa: [128, 150], lundy: [60, 214],
  conway: [36, 228], junelake: [198, 196], mammoth: [282, 214], convict: [334, 206],
};
const ROUTE = ['home', 'oakdale', 'groveland', 'craneflat', 'olmsted', 'tenaya', 'tuolumne', 'tioga', 'leevining', 'junelake', 'mammoth'];
const LABELS = {
  home: ['Home', 12, 16], oakdale: ['Oakdale', 12, 4], groveland: ['Groveland', 12, 4], craneflat: ['Crane Flat · last gas', 12, 4],
  olmsted: ['Olmsted Pt.', -76, 4], tenaya: ['Tenaya Lake', 12, 6], tioga: ['Tioga Pass 9,945′', 12, 4], leevining: ['Lee Vining', 10, 18],
  southtufa: ['South Tufa', 10, -6], lundy: ['Lundy Canyon', -50, 30], junelake: ['June Lake', -18, -12], mammoth: ['Mammoth', -22, 30], monolake: ['MONO LAKE', -60, -18],
};

// Smooth path through points (Catmull-Rom → cubic Bézier), with a little
// hand wobble so it never looks ruler-straight.
function smoothPath(pts) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function overlaySVG() {
  const pts = ROUTE.map((k) => STOPS[k]);
  const d = smoothPath(pts);
  const side = `M${STOPS.leevining[0]} ${STOPS.leevining[1]} C 96 214 76 214 ${STOPS.lundy[0]} ${STOPS.lundy[1]} M${STOPS.leevining[0]} ${STOPS.leevining[1]} C 118 186 124 170 ${STOPS.southtufa[0]} ${STOPS.southtufa[1]}`;
  const dots = Object.entries(LABELS).map(([k, [txt, dx, dy]]) => {
    const [x, y] = STOPS[k];
    const lake = k === 'monolake';
    return `<g class="stop" data-stop="${k}" opacity="0">
      ${lake ? '' : `<circle cx="${x}" cy="${y}" r="4" fill="#fffcf6" stroke="#2a241d" stroke-width="1.5"/>`}
      <text x="${x + dx}" y="${y + dy}" font-family="Instrument Sans, system-ui, sans-serif" font-weight="${lake ? 650 : 600}" font-size="${lake ? 9.5 : 10.5}" fill="#2a241d" stroke="#f5f0e6" stroke-width="3" paint-order="stroke" stroke-linejoin="round" ${lake ? 'letter-spacing="2.5"' : ''}>${txt}</text></g>`;
  }).join('');
  return `<svg class="map-ink" viewBox="0 0 400 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <image href="img/art/map-base.webp" x="0" y="0" width="400" height="760" style="mix-blend-mode:var(--art-blend)"/>
    <path class="route-shadow" d="${d}" fill="none" stroke="#f3ead7" stroke-width="7" stroke-linecap="round" opacity=".7"/>
    <path class="route" d="${d}" fill="none" stroke="#a8461f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="side" d="${side}" fill="none" stroke="#a8461f" stroke-width="1.8" stroke-dasharray="3 5" stroke-linecap="round" opacity="0"/>
    ${dots}
    <g class="car" opacity="0"><circle r="9" fill="#fffcf6" stroke="#2a241d" stroke-width="1.2"/><path d="M-5 2 l1.4 -4 h7.2 l1.4 4 z M-6 2 h12 v3 h-12 z" fill="#a8461f"/></g>
  </svg>`;
}

// chapter → how far along the route (stop key) and which stops/sides to show
export const CHAPTER_ROUTE = {
  packed: { to: 'home' },
  orchard: { to: 'oakdale' },
  granite: { to: 'olmsted' },
  tioga: { to: 'tioga' },
  tufa: { to: 'leevining', side: true, extra: ['southtufa', 'monolake'] },
  aspens: { to: 'mammoth', side: true, extra: ['lundy', 'southtufa', 'monolake'] },
  night: { to: 'mammoth', side: true, extra: ['lundy', 'southtufa', 'monolake'] },
  home: { to: 'mammoth', side: true, extra: ['lundy', 'southtufa', 'monolake'], back: true },
};

export function mountStory(root, chapters) {
  const stage = root.querySelector('.story-stage');
  stage.insertAdjacentHTML('beforeend', overlaySVG());
  const svg = stage.querySelector('svg.map-ink');
  const route = svg.querySelector('.route'), shadow = svg.querySelector('.route-shadow'), side = svg.querySelector('.side'), car = svg.querySelector('.car');
  const stops = Object.fromEntries([...svg.querySelectorAll('.stop')].map((g) => [g.dataset.stop, g]));
  const L = route.getTotalLength();

  // Route length at each stop (sample the path to find the nearest point).
  const at = {};
  const samples = 600;
  const pts = Array.from({ length: samples + 1 }, (_, i) => { const p = route.getPointAtLength((L * i) / samples); return [p.x, p.y, (L * i) / samples]; });
  for (const k of ROUTE) {
    const [x, y] = STOPS[k];
    let best = Infinity, len = 0;
    for (const p of pts) { const dd = (p[0] - x) ** 2 + (p[1] - y) ** 2; if (dd < best) { best = dd; len = p[2]; } }
    at[k] = len;
  }
  at.home = 0;
  const steps = [...root.querySelectorAll('.story-step')];
  const plans = chapters.map((c) => CHAPTER_ROUTE[c.route] || { to: 'home' });

  function render(pos) {
    const i = Math.max(0, Math.min(plans.length - 1, Math.floor(pos)));
    const j = Math.min(plans.length - 1, i + 1);
    const t = Math.max(0, Math.min(1, pos - i));
    const e = t * t * (3 - 2 * t);
    const a = at[plans[i].to], b = at[plans[j].to];
    const len = a + (b - a) * e;
    for (const p of [route, shadow]) { p.style.strokeDasharray = `${L} ${L}`; p.style.strokeDashoffset = (L - len).toFixed(1); }
    // car rides the tip of the ink (or heads home on the last chapter)
    const back = plans[i].back || (plans[j].back && e > 0.5);
    const carLen = back ? Math.max(0, len * (1 - (plans[j].back ? e : 1))) : len;
    const p = route.getPointAtLength(Math.max(0.01, carLen));
    car.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    // Phone camera: pan so the pen tip sits in the upper, uncovered part.
    if (!wide) {
      const viewH = 400 * (stage.clientHeight / Math.max(1, stage.clientWidth));
      const visH = viewH * 0.52;
      const tipY = route.getPointAtLength(Math.max(0.01, len)).y;
      const y0 = Math.max(0, Math.min(760 - visH, tipY - visH * 0.55));
      svg.setAttribute('viewBox', `0 ${y0.toFixed(1)} 400 ${viewH.toFixed(1)}`);
    }
    car.setAttribute('opacity', '1');
    // stop labels fade in as the ink passes them
    for (const k of ROUTE) if (stops[k]) stops[k].setAttribute('opacity', len >= at[k] - 2 ? '1' : '0');
    const extra = new Set([...(plans[i].extra || []), ...(e > 0.5 ? plans[j].extra || [] : [])]);
    for (const k of ['southtufa', 'lundy', 'monolake']) stops[k] && stops[k].setAttribute('opacity', extra.has(k) ? '1' : '0');
    side.setAttribute('opacity', plans[i].side || (plans[j].side && e > 0.5) ? '0.9' : '0');
  }

  let ticking = false, current = -1;
  function measure() {
    ticking = false;
    const mid = window.innerHeight * 0.6;
    let pos = 0;
    for (let k = 0; k < steps.length; k++) {
      const r = steps[k].getBoundingClientRect();
      const c = r.top + r.height * 0.55;
      if (c <= mid) pos = k;
      else {
        if (k > 0) {
          const pr = steps[k - 1].getBoundingClientRect();
          const pc = pr.top + pr.height * 0.55;
          pos = k - 1 + Math.max(0, Math.min(1, (mid - pc) / (c - pc)));
        }
        break;
      }
    }
    if (reducedMotion()) pos = Math.round(pos);
    render(pos);
    const snapped = Math.round(pos);
    if (snapped !== current) {
      current = snapped;
      steps.forEach((s, k) => s.classList.toggle('active', k === snapped));
    }
  }

  // Phones: fill the screen (crop the edges). Wide screens: fit the whole
  // map on the left, cards on the right.
  let wide = false;
  function fit() {
    wide = stage.clientWidth / Math.max(1, stage.clientHeight) > 0.75;
    svg.setAttribute('preserveAspectRatio', wide ? 'xMinYMid meet' : 'xMidYMin slice');
    if (wide) svg.setAttribute('viewBox', '0 0 400 760');
    root.classList.toggle('map-wide', wide);
  }
  fit();

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(measure);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  const onResize = () => { fit(); onScroll(); };
  window.addEventListener('resize', onResize);
  fit();
  render(0);
  measure();
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}

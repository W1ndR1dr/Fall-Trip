// Every hand-painted illustration in the app. Baked by scripts/paint.mjs.
import { svgDoc, wash, bloom, ink, rng, dry, pencil, spatter, blob } from './paint.js';
import { leaf } from './leafshape.js';
import { tufaScene } from './lab2.mjs';

const P = {}; // name -> { svg, scale }
const add = (name, svg, scale = 2) => (P[name] = { svg, scale });

// ------------------------------------------------------------------ leaves
function leafPainting({ seed, shape, colors, stem = [100, 162, 98, 216], stemW = 2, w = 200, h = 230, extra = '' }) {
  const L = leaf({ ...shape, seed });
  const inner = leaf({ ...shape, W: shape.W * 0.82, L: shape.L * 0.86, teeth: 0, cx: (shape.cx || 100) + 4, base: (shape.base || 160) - 4, seed });
  return svgDoc(w, h, `
    ${pencil(leaf({ ...shape, teeth: 0, W: shape.W * 1.04, L: shape.L * 1.03, seed: seed + 1 }).d)}
    ${wash(L.d, colors[0], { opacity: 0.82, seed, dx: 3, dy: -2 })}
    <g opacity=".6">${wash(inner.d, colors[1], { opacity: 0.5, layers: 1, seed: seed + 3, dx: 7, dy: 3 })}</g>
    ${colors[2] ? dry(`M${(shape.cx || 100) - shape.W * 0.5} ${(shape.base || 160) - shape.L * 0.25} Q${shape.cx || 100} ${(shape.base || 160) - shape.L * 0.35} ${(shape.cx || 100) + shape.W * 0.5} ${(shape.base || 160) - shape.L * 0.22}`, colors[2], { opacity: 0.32, w: 6 }) : ''}
    ${ink(L.d, { w: 0.9, opacity: 0.8, seed })}
    ${ink(L.midrib, { w: 0.9, opacity: 0.6, breaks: false })}
    ${ink(L.veins, { w: 0.6, opacity: 0.42, breaks: false })}
    ${ink(`M${stem[0]} ${stem[1]} C ${stem[0] - 1} ${stem[1] + 18} ${stem[2] + 3} ${stem[3] - 18} ${stem[2]} ${stem[3]}`, { w: stemW, opacity: 0.85, breaks: false })}
    ${extra}
  `, seed);
}

add('spec-aspen', leafPainting({ seed: 2, shape: { cx: 100, base: 160, L: 118, W: 58, p: 0.55, teeth: 22, depth: 0.035, bend: 5 }, colors: ['#f6c945', '#eea23a', '#c7682a'], extra: spatter(152, 62, '#e8a33a', { seed: 9 }) }));
const ASPEN = { cx: 100, base: 160, L: 118, W: 58, p: 0.55, teeth: 22, depth: 0.035, bend: 5 };
add('sci-green', leafPainting({ seed: 2, shape: ASPEN, colors: ['#7fae4a', '#4f8a3a', '#3f6e2e'] }));
add('sci-red', leafPainting({ seed: 2, shape: ASPEN, colors: ['#e8883a', '#c8412c', '#8f2a24'] }));
add('spec-cottonwood', leafPainting({ seed: 5, shape: { cx: 100, base: 176, L: 150, W: 44, p: 0.72, teeth: 26, depth: 0.03, bend: 7 }, colors: ['#f0d55a', '#b9b34a'], stem: [100, 178, 99, 222] }));
add('spec-willow', leafPainting({ seed: 8, shape: { cx: 100, base: 196, L: 172, W: 15, p: 0.95, teeth: 30, depth: 0.04, bend: 14 }, colors: ['#c9c35a', '#8d9a4a'], stem: [100, 197, 100, 216], stemW: 1.4 }));
add('spec-birch', leafPainting({ seed: 11, shape: { cx: 100, base: 150, L: 96, W: 40, p: 0.68, teeth: 14, depth: 0.1, double: true, bend: 4 }, colors: ['#eda23b', '#c55d2a'], stem: [100, 152, 99, 190], stemW: 1.6 }));
add('spec-big', leafPainting({ seed: 14, shape: { cx: 100, base: 172, L: 150, W: 76, p: 0.6, teeth: 22, depth: 0.03, bend: 6 }, colors: ['#e9a238', '#d7702c', '#9c4a22'], stem: [100, 174, 98, 224] }));

// Rocky Mountain maple: three lobes, red.
function maple(seed = 17) {
  const d = 'M100 178 L94 150 C74 158 52 152 38 134 C52 128 58 120 58 110 C44 102 34 88 34 70 C54 76 68 76 78 86 C78 66 86 44 100 26 C114 44 122 66 122 86 C132 76 146 76 166 70 C166 88 156 102 142 110 C142 120 148 128 162 134 C148 152 126 158 106 150 Z';
  return svgDoc(200, 230, `
    ${pencil('M100 178 L100 30 M100 140 L46 92 M100 140 L154 92')}
    ${wash(d, '#d2452f', { opacity: 0.85, seed, dx: 2, dy: -2 })}
    <g opacity=".55">${wash('M100 150 C80 140 70 110 84 90 C92 110 108 110 116 90 C130 110 120 140 100 150Z', '#8f2a24', { opacity: 0.6, layers: 1, seed: seed + 2 })}</g>
    ${wash('M60 120 C54 108 66 100 74 108 Z', '#e89a3a', { opacity: 0.5, layers: 1, seed: seed + 4 })}
    ${ink(d, { w: 0.9, opacity: 0.8, seed })}
    ${ink('M100 176 L100 34 M100 140 L50 94 M100 140 L150 94 M100 158 L52 136 M100 158 L148 136', { w: 0.7, opacity: 0.5, breaks: false })}
    ${ink('M100 178 C 99 194 101 206 98 218', { w: 2, opacity: 0.85, breaks: false })}
    ${spatter(50, 50, '#c8412c', { seed: 3 })}
  `, seed);
}
add('spec-red', maple());

function heartLeaf(seed = 19) {
  const d = 'M100 184 C78 164 40 140 38 100 C36 74 54 56 74 56 C88 56 96 64 100 76 C104 64 112 56 126 56 C146 56 164 74 162 100 C160 140 122 164 100 184 Z';
  return svgDoc(200, 230, `
    ${pencil('M100 184 C80 166 44 142 42 102 C40 76 56 60 74 60 M100 78 V180')}
    ${wash(d, '#e0582f', { opacity: 0.8, seed, dx: 2, dy: -2 })}
    <g opacity=".6">${wash('M100 170 C84 150 70 120 80 96 C92 104 108 104 120 96 C130 120 116 150 100 170 Z', '#b2332b', { opacity: 0.55, layers: 1, seed: seed + 1 })}</g>
    ${ink(d, { w: 0.9, opacity: 0.8, seed })}
    ${ink('M100 180 V80 M100 120 L66 92 M100 120 L134 92 M100 146 L62 126 M100 146 L138 126', { w: 0.65, opacity: 0.45, breaks: false })}
    ${ink('M100 184 C 99 198 101 210 99 222', { w: 2, opacity: 0.85, breaks: false })}
  `, seed);
}
add('spec-heart', heartLeaf());

// ------------------------------------------------------------------ things
function pinecone(seed = 23) {
  const r = rng(seed);
  const outline = 'M100 30 C132 50 146 110 132 168 C124 196 76 196 68 168 C54 110 68 50 100 30 Z';
  let scales = '', scaleInk = '';
  for (let row = 0; row < 11; row++) {
    const y = 48 + row * 12.5;
    const half = 22 + 30 * Math.sin(Math.PI * (row + 1) / 12);
    for (let c = -2; c <= 2; c++) {
      const x = 100 + c * half * 0.42 + (row % 2 ? 6 : -4);
      const d = `M${x - 11} ${y} Q${x - 2} ${y + 14} ${x + 11} ${y + 1} Q${x + 1} ${y + 5} ${x - 11} ${y} Z`;
      scales += `<path d="${d}"/>`;
      scaleInk += `M${x - 11} ${y} Q${x - 2} ${y + 14} ${x + 11} ${y + 1} `;
    }
  }
  return svgDoc(200, 230, `
    <clipPath id="cone"><path d="${outline}"/></clipPath>
    ${wash(outline, '#9a6a3a', { opacity: 0.8, seed, dx: 2 })}
    <g clip-path="url(#cone)" filter="url(#wash)" fill="#c28a52" opacity=".75">${scales}</g>
    <g clip-path="url(#cone)">${wash('M100 30 L150 30 L150 200 L100 200 Z', '#5e3a1e', { opacity: 0.35, layers: 1, seed: seed + 2 })}</g>
    <g clip-path="url(#cone)">${ink(scaleInk, { w: 0.8, opacity: 0.6, breaks: false })}</g>
    ${ink(outline, { w: 0.9, opacity: 0.7, seed })}
    ${ink('M100 30 C 102 20 99 12 101 4', { w: 2.4, opacity: 0.85, breaks: false })}
  `, seed);
}
add('spec-cone', pinecone());

function granite(seed = 29) {
  const d = blob(100, 132, 78, 52, { lumps: 5, amp: 0.12, seed });
  const r = rng(seed);
  let flecks = '';
  for (let i = 0; i < 70; i++) {
    const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 0.85;
    const x = 100 + Math.cos(a) * 74 * rr, y = 132 + Math.sin(a) * 48 * rr;
    flecks += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + r() * 2.4).toFixed(1)}" fill="${r() < 0.6 ? '#2d2a28' : '#e8e2d8'}" opacity="${(0.4 + r() * 0.5).toFixed(2)}"/>`;
  }
  const sparkle = (x, y, s) => `<path d="M${x} ${y - s} L${x + s * 0.25} ${y - s * 0.25} L${x + s} ${y} L${x + s * 0.25} ${y + s * 0.25} L${x} ${y + s} L${x - s * 0.25} ${y + s * 0.25} L${x - s} ${y} L${x - s * 0.25} ${y - s * 0.25} Z" fill="#f2c14e"/>`;
  return svgDoc(200, 230, `
    ${wash(d, '#bdb6aa', { opacity: 0.85, seed })}
    ${wash(blob(118, 150, 50, 28, { seed: seed + 3 }), '#8f887c', { opacity: 0.4, layers: 1, seed: seed + 4 })}
    <g filter="url(#ink)">${flecks}</g>
    ${ink(d, { w: 1, opacity: 0.75, seed })}
    <g opacity=".95">${sparkle(78, 110, 9)}${sparkle(130, 96, 6)}${sparkle(150, 60, 11)}</g>
  `, seed);
}
add('spec-granite', granite());

const svig = `<mask id="sv"><rect width="200" height="230" fill="black"/><ellipse cx="100" cy="150" rx="92" ry="70" fill="white" filter="url(#bloom)"/></mask>`;
function beaverDam(seed = 31) {
  const r = rng(seed);
  let sticks = '';
  for (let i = 0; i < 26; i++) {
    const x = 30 + r() * 140, y = 120 + r() * 50, l = 26 + r() * 40, a = (r() - 0.5) * 0.9;
    sticks += `M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)} `;
  }
  return svgDoc(200, 230, `<g mask="url(#sv)">
    ${wash('M-10 150 H210 V230 H-10Z', '#6aa3c0', { opacity: 0.6, seed })}
    ${wash('M-10 110 C40 120 60 116 100 112 C140 108 170 116 210 110 L210 150 L-10 150Z', '#8fb7cc', { opacity: 0.45, seed: seed + 1 })}
    ${wash('M20 170 C40 120 80 100 100 104 C130 100 170 126 184 170 Z', '#7a5a3a', { opacity: 0.8, seed: seed + 2 })}
    ${dry(sticks, '#4a3222', { opacity: 0.75, w: 3.2 })}
    ${ink(sticks, { w: 1.1, opacity: 0.6, breaks: false })}
    ${ink('M14 196 q16 -3 32 0 t32 0 M110 206 q18 -3 36 0 t36 0', { w: 0.8, opacity: 0.5, color: '#2c4a5a', breaks: false })}
    ${ink('M150 92 c4 -8 12 -8 16 0 c-4 4 -12 4 -16 0 z M166 92 l8 -2', { w: 1, opacity: 0.6, breaks: false })}
  </g>`, seed, svig);
}
add('spec-dam', beaverDam());

function tufaTower(seed = 37) {
  const r = rng(seed);
  const ph = [r() * 6, r() * 6];
  let L = [], R = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, y = 196 - t * 150;
    const base = 36 * (1 - t * 0.5) * (t > 0.85 ? 1 - (t - 0.85) * 2.6 : 1);
    L.push(`${(100 - base - Math.max(0, Math.sin(t * 17 + ph[0])) * 8).toFixed(1)} ${y.toFixed(1)}`);
    R.push(`${(100 + base + Math.max(0, Math.sin(t * 15 + ph[1])) * 8).toFixed(1)} ${y.toFixed(1)}`);
  }
  const d = 'M' + L.join('L') + 'L' + R.reverse().join('L') + 'Z';
  let pits = '';
  for (let k = 0; k < 14; k++) { const y = 190 - r() * 130, x = 100 + (r() - 0.5) * 40; pits += `M${x.toFixed(1)} ${y.toFixed(1)} q2 3 5 1 `; }
  const tv = `<mask id="tv"><rect width="200" height="230" fill="black"/><rect x="0" y="0" width="200" height="186" fill="white"/><ellipse cx="100" cy="200" rx="90" ry="26" fill="white" filter="url(#bloom)"/></mask>`;
  return svgDoc(200, 230, `<g mask="url(#tv)">
    ${wash('M-10 190 H210 V230 H-10Z', '#6aa3c0', { opacity: 0.55, seed })}
    ${wash(d, '#e4d8bd', { opacity: 0.95, seed: seed + 1 })}
    <clipPath id="tt"><path d="${d}"/></clipPath><g clip-path="url(#tt)">${wash('M104 30 H170 V200 H104Z', '#9c8762', { opacity: 0.45, layers: 1, seed: seed + 2 })}</g>
    ${ink(d, { w: 0.8, opacity: 0.65, seed })}
    ${ink(pits, { w: 0.6, opacity: 0.5, breaks: false })}
    ${ink('M20 208 q16 -3 32 0 t32 0 M120 214 q16 -3 32 0 t32 0', { w: 0.8, opacity: 0.5, color: '#2c4a5a', breaks: false })}
  </g>`, seed, tv);
}
add('spec-tufa', tufaTower());

function aspenBark(seed = 41) {
  const r = rng(seed);
  let eyes = '';
  const eye = (x, y, s) => `M${x - s} ${y} Q${x} ${y - s * 0.55} ${x + s} ${y} Q${x} ${y + s * 0.55} ${x - s} ${y} Z`;
  for (let i = 0; i < 5; i++) eyes += eye(82 + r() * 36, 50 + i * 34 + r() * 10, 9 + r() * 6);
  return svgDoc(200, 230, `
    ${wash('M66 10 C64 80 70 160 64 226 L136 226 C130 150 138 80 134 10 Z', '#efe9dc', { opacity: 0.95, seed })}
    ${wash('M114 10 C116 80 112 160 118 226 L136 226 C130 150 138 80 134 10 Z', '#b9c49a', { opacity: 0.4, layers: 1, seed: seed + 1 })}
    ${wash(eyes, '#3b3026', { opacity: 0.8, layers: 1, seed: seed + 2 })}
    ${dry('M76 30 V210 M126 20 V220', '#8e8a78', { opacity: 0.3, w: 5 })}
    ${ink('M66 10 C64 80 70 160 64 226 M134 10 C138 80 130 150 136 226', { w: 1, opacity: 0.65, seed })}
    ${ink('M92 120 h12 M88 160 h8', { w: 0.7, opacity: 0.4, breaks: false })}
  `, seed);
}
add('spec-eyes', aspenBark());

function obsidian(seed = 43) {
  const d = 'M52 160 L66 108 L98 84 L140 92 L158 128 L146 166 L104 178 Z';
  return svgDoc(200, 230, `
    ${wash(d, '#2a2830', { opacity: 0.92, seed })}
    ${wash('M70 110 L98 88 L112 120 L80 140 Z', '#6f6a86', { opacity: 0.55, layers: 1, seed: seed + 1 })}
    ${wash('M118 96 L138 94 L150 124 L128 118 Z', '#8e8aa8', { opacity: 0.45, layers: 1, seed: seed + 2 })}
    ${ink(d + ' M98 84 L112 120 L146 166 M66 108 L112 120 L104 178', { w: 0.9, opacity: 0.75, seed })}
    <path d="M84 104 l10 -8 M124 104 l8 4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
  `, seed);
}
add('spec-obsidian', obsidian());

// ------------------------------------------------------------------ tracks (ink prints)
function print(seed, shapes) {
  return svgDoc(120, 120, `<g filter="url(#stampink)">${shapes.map((d) => `<path d="${d}" fill="#3a2a1e" opacity=".9"/>`).join('')}</g>`, seed);
}
const oval = (cx, cy, rx, ry, rot = 0) => { const pts = []; for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; const x = Math.cos(a) * rx, y = Math.sin(a) * ry; const c = Math.cos(rot), s = Math.sin(rot); pts.push(`${(cx + x * c - y * s).toFixed(1)} ${(cy + x * s + y * c).toFixed(1)}`); } return 'M' + pts.join('L') + 'Z'; };
add('track-deer', print(51, ['M54 22 C42 34 38 66 44 92 C48 100 58 98 58 88 C58 66 58 42 54 22Z', 'M66 22 C78 34 82 66 76 92 C72 100 62 98 62 88 C62 66 62 42 66 22Z']));
add('track-coyote', print(53, [oval(46, 30, 7, 10, -0.15), oval(74, 30, 7, 10, 0.15), oval(32, 54, 6.5, 9, -0.4), oval(88, 54, 6.5, 9, 0.4), 'M60 58 C46 58 42 72 46 82 C50 90 70 90 74 82 C78 72 74 58 60 58Z']));
add('track-bear', print(55, [oval(24, 40, 7, 8), oval(40, 28, 7.5, 8.5), oval(60, 24, 8, 9), oval(80, 28, 7.5, 8.5), oval(96, 40, 7, 8), 'M18 58 C26 50 94 50 102 58 C106 74 92 96 76 100 C66 103 54 103 44 100 C28 96 14 74 18 58Z']));
add('track-beaver', print(57, ['M28 34 Q40 60 44 76 L76 76 Q80 60 92 34 Q80 44 70 20 Q60 44 50 20 Q40 44 28 34Z', oval(24, 30, 6, 9, -0.5), oval(40, 16, 6, 9, -0.2), oval(60, 13, 6, 9), oval(80, 16, 6, 9, 0.2), oval(96, 30, 6, 9, 0.5), 'M60 110 C44 110 40 94 42 82 C44 72 76 72 78 82 C80 94 76 110 60 110Z']));
add('track-squirrel', print(59, [oval(34, 24, 4, 7, -0.2), oval(46, 18, 4, 7.5), oval(58, 20, 4, 7, 0.2), oval(67, 27, 4, 7, 0.5), 'M34 38 C44 32 60 34 66 42 C68 52 56 58 46 56 C36 54 30 46 34 38Z', oval(46, 76, 3.4, 6, -0.3), oval(57, 72, 3.4, 6), oval(68, 74, 3.4, 6, 0.3), 'M50 84 C58 80 72 82 76 88 C74 98 62 100 56 98 C50 96 48 90 50 84Z']));
add('track-bird', svgDoc(120, 120, ink('M60 100 V58 M60 58 L36 20 M60 58 L60 14 M60 58 L84 20 M60 70 L60 100', { w: 5, opacity: 0.85, breaks: false, color: '#3a2a1e' })));
add('track-gull', print(61, ['M60 102 L26 32 Q44 44 60 40 Q76 44 94 32 Z']));
add('track-raccoon', print(63, ['M40 70 C36 56 46 48 60 48 C74 48 84 56 80 70 C76 84 44 84 40 70Z', 'M40 54 L22 32 L28 28 L46 50Z', 'M50 48 L42 18 L49 16 L56 46Z', 'M60 47 L62 14 L69 15 L66 47Z', 'M70 49 L82 20 L88 23 L76 52Z', 'M78 56 L98 40 L102 46 L82 62Z']));

// ------------------------------------------------------------------ vignettes (story chapters)
const vig = `<mask id="vig"><rect width="400" height="260" fill="black"/><path d="M40 40 C120 10 300 14 370 44 C404 90 398 190 360 226 C260 250 120 252 42 224 C8 180 6 90 40 40Z" fill="white" filter="url(#bloom)"/></mask>`;

function orchard(seed = 71) {
  const r = rng(seed);
  let trees = '', trunks = '', apples = '';
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) {
    const x = 50 + i * 60 + (row % 2) * 30, y = 150 + row * 30, s = 22 + row * 4;
    trees += wash(blob(x, y - s * 0.8, s, s * 0.8, { lumps: 7, amp: 0.14, seed: seed + row * 10 + i }), row === 2 ? '#6f9448' : '#86a656', { opacity: 0.8, layers: 1, seed: seed + i + row });
    trunks += `M${x} ${y} v${10 + row * 3} `;
    for (let k = 0; k < 4; k++) apples += `<circle cx="${(x + (r() - 0.5) * s * 1.3).toFixed(1)}" cy="${(y - s * 0.8 + (r() - 0.5) * s).toFixed(1)}" r="2.6"/>`;
  }
  return svgDoc(400, 260, `<g mask="url(#vig)">
    ${bloom('M-20 -20 H420 V140 H-20Z', '#b6d4e6', 0.7)}
    ${bloom('M-20 70 H420 V150 H-20Z', '#f4dca8', 0.5)}
    ${wash('M0 120 C80 104 180 116 260 106 C320 100 370 110 400 104 V150 H0Z', '#a8b98a', { opacity: 0.55, seed: seed + 2 })}
    ${wash('M-10 130 H410 V270 H-10Z', '#d9c38a', { opacity: 0.7, seed: seed + 3 })}
    ${trees}
    ${ink(trunks, { w: 1.6, opacity: 0.7, breaks: false })}
    <g fill="#c8412c" filter="url(#wash)" opacity=".9">${apples}</g>
    ${wash('M300 210 H370 V236 H300Z', '#e9d7b0', { opacity: 0.9, seed: seed + 5 })}
    ${wash('M292 212 L335 188 L378 212 Z', '#a8461f', { opacity: 0.8, seed: seed + 6 })}
    ${ink('M300 210 H370 V236 H300Z M292 212 L335 188 L378 212', { w: 0.9, opacity: 0.7 })}
    ${[312, 330, 350].map((x, i) => wash(blob(x, 244, 9, 7, { seed: seed + 20 + i }), '#e8742a', { opacity: 0.9, layers: 1, seed: seed + 30 + i })).join('')}
  </g>`, seed, vig);
}
add('vig-orchard', orchard());

function granite2(seed = 73) {
  return svgDoc(400, 260, `<g mask="url(#vig)">
    ${bloom('M-20 -20 H420 V160 H-20Z', '#f3c79a', 0.55)}
    ${bloom('M-20 -20 H420 V90 H-20Z', '#9fc3de', 0.6)}
    ${pencil('M40 190 C60 120 110 90 160 110 C190 70 230 60 250 70 L262 170')}
    ${wash('M0 200 C40 150 70 110 120 104 C150 100 170 108 190 120 C200 90 222 64 250 62 C262 60 270 66 272 76 L276 150 C310 140 360 150 410 170 V270 H0Z', '#d8cfc2', { opacity: 0.95, seed })}
    ${wash('M250 62 C262 60 270 66 272 76 L276 150 L262 152 Z', '#8d8479', { opacity: 0.55, layers: 1, seed: seed + 1 })}
    ${wash('M0 200 C40 150 70 110 120 104 C130 150 90 190 0 220Z', '#f0b27a', { opacity: 0.35, layers: 1, seed: seed + 2 })}
    ${ink('M0 200 C40 150 70 110 120 104 C150 100 170 108 190 120 C200 90 222 64 250 62 C262 60 270 66 272 76 L276 150 C310 140 360 150 410 170', { w: 1, opacity: 0.7, seed })}
    ${[40, 70, 330, 356, 380].map((x, i) => { const h = 50 + (i % 2) * 14; return wash(`M${x} ${230 - h} l-12 ${h * 0.35} h7 l-12 ${h * 0.35} h8 l-13 ${h * 0.32} h40 l-13 -${h * 0.32} h8 l-12 -${h * 0.35} h7 z`, '#39584a', { opacity: 0.85, layers: 1, seed: seed + 10 + i }); }).join('')}
    ${ink('M150 150 c20 -6 40 -2 60 2 M110 170 c30 -8 60 -6 90 0', { w: 0.7, opacity: 0.4, breaks: false })}
  </g>`, seed, vig);
}
add('vig-granite', granite2());
add('vig-tufa', tufaScene(3));

function aspens(seed = 79) {
  const r = rng(seed);
  let crowns = '', trunks = '', trunkInk = '', eyes = '';
  const cols = ['#f6c945', '#f0b43c', '#e89a34', '#f5d35c', '#e0822e'];
  for (let i = 0; i < 11; i++) {
    const x = 20 + i * 36 + r() * 12, top = 40 + r() * 50, h = 250 - top;
    crowns += wash(blob(x, top + 18, 18 + r() * 8, 34 + r() * 12, { lumps: 8, amp: 0.2, seed: seed + i }), cols[i % cols.length], { opacity: 0.8, layers: 2, seed: seed + 40 + i });
    trunks += `M${x - 3} ${top + 40} L${x - 3.5} 262 L${x + 3.5} 262 L${x + 3} ${top + 40} Z `;
    trunkInk += `M${x - 3} ${top + 40} L${x - 3.5} 262 M${x + 3} ${top + 44} L${x + 3.5} 262 `;
    for (let k = 0; k < 3; k++) eyes += `M${x - 2} ${top + 70 + k * 40 + r() * 10} h4 `;
  }
  return svgDoc(400, 260, `<g mask="url(#vig)">
    ${bloom('M-20 -20 H420 V200 H-20Z', '#a9cde3', 0.6)}
    ${wash('M0 120 L60 70 L110 96 L170 50 L230 90 L290 60 L350 96 L400 76 V180 H0Z', '#9ea3bd', { opacity: 0.45, seed: seed + 1 })}
    ${wash('M-10 200 C100 190 200 206 300 196 C360 190 400 198 410 196 V270 H-10Z', '#b9a55a', { opacity: 0.7, seed: seed + 2 })}
    ${wash(trunks, '#f3efe6', { opacity: 1, layers: 1, seed: seed + 3 })}
    ${ink(trunkInk, { w: 0.7, opacity: 0.5, breaks: false })}
    ${ink(eyes, { w: 1.6, opacity: 0.7, breaks: false })}
    ${crowns}
    ${spatter(80, 60, '#f2b233', { seed: seed + 5, n: 12, spread: 50 })}
    ${spatter(300, 80, '#e58a2b', { seed: seed + 6, n: 10, spread: 40 })}
  </g>`, seed, vig);
}
add('vig-aspens', aspens());

function night(seed = 83) {
  const r = rng(seed);
  let stars = '';
  for (let i = 0; i < 120; i++) stars += `<circle cx="${(r() * 400).toFixed(1)}" cy="${(r() * 170).toFixed(1)}" r="${(0.4 + r() * r() * 1.8).toFixed(2)}"/>`;
  return svgDoc(400, 260, `<g mask="url(#vig)">
    ${wash('M-20 -20 H420 V280 H-20Z', '#1f2a4a', { opacity: 0.95, seed })}
    ${bloom('M-40 200 C80 120 200 70 440 -20 L440 30 C220 100 90 170 -40 240Z', '#8f86b8', 0.45)}
    <g fill="#fff8e6" opacity=".9">${stars}</g>
    <circle cx="300" cy="70" r="4" fill="#f2d08a" filter="url(#wash)"/>
    ${wash('M0 220 L60 180 L110 200 L170 160 L230 196 L290 172 L350 200 L400 186 V270 H0Z', '#0f1428', { opacity: 0.95, seed: seed + 1 })}
    ${wash('M180 206 L210 184 L240 206 V230 H180Z', '#2a1e1a', { opacity: 0.95, layers: 1, seed: seed + 2 })}
    <rect x="192" y="210" width="10" height="9" fill="#ffcb6b" filter="url(#wash)"/><rect x="218" y="210" width="10" height="9" fill="#ffcb6b" filter="url(#wash)"/>
    ${bloom('M170 200 C190 190 230 190 250 200 C240 230 180 230 170 200Z', '#ffcb6b', 0.25)}
  </g>`, seed, vig);
}
add('vig-night', night());

function packed(seed = 89) {
  return svgDoc(400, 260, `<g mask="url(#vig)">
    ${bloom('M-20 -20 H420 V160 H-20Z', '#f6d9aa', 0.55)}
    ${wash('M-10 170 H410 V270 H-10Z', '#b9c49a', { opacity: 0.55, seed })}
    ${wash('M90 150 C96 124 110 112 140 110 L250 110 C276 110 292 124 300 150 L310 150 C324 150 330 158 330 170 L330 190 L70 190 L70 170 C70 158 78 150 90 150Z', '#b5512a', { opacity: 0.9, seed: seed + 1 })}
    ${wash('M120 146 L134 120 L186 120 L186 146Z M196 146 L196 120 L246 120 L264 146Z', '#cfe3ee', { opacity: 0.85, layers: 1, seed: seed + 2 })}
    ${wash('M110 96 H270 V110 H110Z', '#6b4a32', { opacity: 0.85, layers: 1, seed: seed + 3 })}
    ${wash(blob(150, 88, 22, 10, { seed: seed + 4 }), '#3f7391', { opacity: 0.8, layers: 1, seed: seed + 5 })}
    ${wash(blob(210, 86, 26, 12, { seed: seed + 6 }), '#d9a441', { opacity: 0.8, layers: 1, seed: seed + 7 })}
    ${wash(blob(128, 190, 18, 18, { lumps: 3, amp: 0.04, seed: seed + 8 }), '#2b2724', { opacity: 0.95, layers: 1 })}
    ${wash(blob(276, 190, 18, 18, { lumps: 3, amp: 0.04, seed: seed + 9 }), '#2b2724', { opacity: 0.95, layers: 1 })}
    ${ink('M90 150 C96 124 110 112 140 110 L250 110 C276 110 292 124 300 150 L310 150 C324 150 330 158 330 170 L330 190 L70 190 L70 170 C70 158 78 150 90 150Z M120 146 L134 120 L186 120 L186 146Z M196 146 L196 120 L246 120 L264 146Z', { w: 1, opacity: 0.7, seed })}
    ${ink('M60 70 c-6 -10 4 -16 0 -26 M72 70 c-6 -10 4 -16 0 -26', { w: 1, opacity: 0.5, breaks: false })}
    ${wash('M40 78 H90 V120 C90 130 40 130 40 120Z', '#8a3326', { opacity: 0.85, layers: 1, seed: seed + 10 })}
    ${ink('M40 78 H90 V120 C90 130 40 130 40 120Z M90 90 c14 0 14 20 0 20', { w: 1, opacity: 0.7 })}
  </g>`, seed, vig);
}
add('vig-packed', packed());

function homeward(seed = 97) {
  return svgDoc(400, 260, `<g mask="url(#vig)">
    ${bloom('M-20 -20 H420 V120 H-20Z', '#f4a259', 0.6)}
    ${bloom('M-20 60 H420 V170 H-20Z', '#fbd9a0', 0.6)}
    <circle cx="280" cy="140" r="26" fill="#f7c873" opacity=".85" filter="url(#wash)"/>
    ${wash('M0 170 C80 150 160 160 240 148 C300 140 350 150 400 144 V200 H0Z', '#a38a9a', { opacity: 0.55, seed })}
    ${wash('M-10 188 C100 176 200 196 300 184 C360 178 400 186 410 184 V270 H-10Z', '#8aa06a', { opacity: 0.7, seed: seed + 1 })}
    ${wash('M200 270 C196 240 204 214 214 194 L222 194 C226 214 240 240 250 270Z', '#6b645c', { opacity: 0.55, layers: 1, seed: seed + 2 })}
    ${ink('M200 270 C196 240 204 214 214 194 M250 270 C240 240 226 214 222 194', { w: 0.9, opacity: 0.6 })}
    ${[100, 116, 130, 144, 156].map((x, i) => { const h = [30, 34, 22, 20, 26][i]; return wash(blob(x, 186 - h / 2, 5, h / 2, { lumps: 2, amp: 0.05, seed: seed + 10 + i }), '#3a2a22', { opacity: 0.85, layers: 1, seed: seed + 20 + i }); }).join('')}
  </g>`, seed, vig);
}
add('vig-home', homeward());

// ------------------------------------------------------------------ the route map (east is up)
// Stop coordinates are exported for the live ink layer (story.js).
export const MAP = {
  w: 400, h: 760,
  stops: {
    home: [252, 712], oakdale: [196, 612], groveland: [176, 522], craneflat: [162, 456], olmsted: [150, 392], tenaya: [142, 362],
    tuolumne: [132, 314], tioga: [122, 262], leevining: [112, 206], monolake: [96, 128], southtufa: [128, 150], lundy: [60, 214],
    conway: [36, 228], junelake: [198, 196], mammoth: [282, 214], convict: [334, 206],
  },
};
function routeMap(seed = 101) {
  const s = MAP.stops;
  const r = rng(seed);
  // Hand-drawn mountain: a lumpy peak with hachure strokes on the shaded side.
  const mtn = (x, y, w, h, snow) => {
    const L = `M${x - w} ${y} C${x - w * 0.6} ${y - h * 0.5} ${x - w * 0.25} ${y - h} ${x} ${y - h} C${x + w * 0.3} ${y - h} ${x + w * 0.6} ${y - h * 0.45} ${x + w} ${y}`;
    let hat = '';
    for (let k = 1; k <= 4; k++) { const t = k / 5; hat += `M${(x + w * t * 0.9).toFixed(1)} ${(y - h * (1 - t) * 0.9).toFixed(1)} l${(w * 0.12).toFixed(1)} ${(h * 0.28).toFixed(1)} `; }
    const cap = snow ? `M${x - w * 0.28} ${y - h * 0.62} C${x - w * 0.1} ${y - h * 0.9} ${x + w * 0.12} ${y - h * 0.92} ${x + w * 0.3} ${y - h * 0.6} L${x + w * 0.12} ${y - h * 0.66} L${x} ${y - h * 0.58} L${x - w * 0.14} ${y - h * 0.66} Z` : '';
    return { L, hat, cap, fill: `${L} Z` };
  };
  const chain = [];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) {
    const x = 18 + i * 46 + (row % 2) * 22 + (r() - 0.5) * 10, y = 300 + row * 22 + (r() - 0.5) * 8, w = 20 + r() * 8, h = 22 + r() * 18 - row * 3;
    chain.push(mtn(x, y, w, h, row === 0 && r() < 0.6));
  }
  const pine = (x, y, k = 1) => `M${x} ${y - 11 * k} L${x - 5 * k} ${y - 2 * k} L${x - 2 * k} ${y - 3 * k} L${x - 6 * k} ${y + 4 * k} L${x + 6 * k} ${y + 4 * k} L${x + 2 * k} ${y - 3 * k} L${x + 5 * k} ${y - 2 * k} Z M${x} ${y + 4 * k} v${4 * k}`;
  let pines = '';
  for (let i = 0; i < 46; i++) { const x = 20 + r() * 360, y = 372 + r() * 170; if (Math.hypot(x - s.olmsted[0], y - s.olmsted[1]) < 30) continue; pines += pine(Math.round(x), Math.round(y), 0.8 + r() * 0.4) + ' '; }
  let orchard = '';
  for (let row = 0; row < 4; row++) for (let i = 0; i < 7; i++) orchard += `<circle cx="${(150 + i * 17 + row * 4).toFixed(0)}" cy="${(630 + row * 15).toFixed(0)}" r="5.2"/>`;
  let aspen = '';
  for (const [cx, cy, n] of [[s.lundy[0], s.lundy[1], 7], [s.conway[0] + 6, s.conway[1] + 6, 5], [s.junelake[0] + 10, s.junelake[1] + 6, 7], [s.mammoth[0] + 20, s.mammoth[1] + 18, 5], [s.convict[0] - 8, s.convict[1] + 16, 4]])
    for (let i = 0; i < n; i++) aspen += `<circle cx="${(cx + (r() - 0.5) * 34).toFixed(0)}" cy="${(cy + (r() - 0.5) * 24).toFixed(0)}" r="${(3.5 + r() * 2.5).toFixed(1)}"/>`;
  const river = `M${s.tuolumne[0] - 8} ${s.tuolumne[1] + 6} C 100 360 70 380 84 420 C 96 456 60 480 70 520 C 78 560 40 590 20 640`;
  const lake = blob(s.monolake[0], s.monolake[1], 74, 48, { lumps: 4, amp: 0.08, seed: seed + 5 });
  const bayShore = 'M-10 620 C30 630 52 650 50 690 C48 720 60 740 70 780';
  const compass = (x, y) => `
    <g transform="translate(${x} ${y}) rotate(-90)">
      ${ink('M0 -26 L6 0 L0 26 L-6 0 Z M-26 0 L0 -5 L26 0 L0 5 Z', { w: 0.9, opacity: 0.75, breaks: false })}
      <path d="M0 -26 L6 0 L0 0 Z M0 26 L-6 0 L0 0 Z" fill="#4a3222" opacity=".7"/>
      ${ink('M0 -30 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0', { w: 0.6, opacity: 0.4, breaks: false })}
    </g>`;
  return svgDoc(MAP.w, MAP.h, `
    ${bloom('M-30 600 C20 610 48 640 46 690 C44 730 60 760 64 800 L-30 800Z', '#8fbcd4', 0.85)}
    ${bloom('M40 560 C140 540 300 566 440 530 L440 800 L70 800 C60 740 60 640 40 560Z', '#ebd49a', 0.5)}
    ${bloom('M-30 390 C80 400 280 380 440 372 L440 560 C300 570 120 560 -30 590Z', '#b9c894', 0.5)}
    ${bloom('M40 330 C120 340 220 320 300 340 C330 380 280 440 180 450 C100 460 30 420 40 330Z', '#cfc8ba', 0.55)}
    ${bloom('M-30 40 C100 50 300 30 440 20 L440 286 C300 296 100 296 -30 286Z', '#e3d3a4', 0.45)}
    ${chain.map((m, i) => wash(m.fill, i % 3 ? '#b8b2c4' : '#a8a2b8', { opacity: 0.55, layers: 1, seed: seed + 30 + i })).join('')}
    ${chain.map((m) => m.cap ? `<path d="${m.cap}" fill="#fbf6ea" opacity=".85"/>` : '').join('')}
    ${ink(chain.map((m) => m.L).join(' '), { w: 0.9, opacity: 0.7, breaks: false })}
    ${ink(chain.map((m) => m.hat).join(' '), { w: 0.6, opacity: 0.5, breaks: false })}
    ${ink('M136 402 C140 384 150 376 160 378 C170 380 174 392 172 404 M176 410 C178 398 186 394 194 398 C200 402 200 410 198 416', { w: 0.9, opacity: 0.65, breaks: false })}
    ${wash(lake, '#5f98b8', { opacity: 0.8, seed: seed + 5 })}
    ${wash(blob(80, 118, 12, 7, { seed: seed + 6 }), '#4a4650', { opacity: 0.8, layers: 1, seed: seed + 6 })}
    ${wash(blob(112, 104, 16, 8, { seed: seed + 7 }), '#efe8d8', { opacity: 0.9, layers: 1, seed: seed + 7 })}
    ${ink(lake, { w: 1, opacity: 0.65, breaks: false })}
    ${ink('M70 150 q8 -3 16 0 t16 0 M96 88 q7 -3 14 0 t14 0', { w: 0.7, opacity: 0.5, color: '#2c4a5a', breaks: false })}
    ${wash(blob(210, 202, 12, 6, { seed: seed + 8 }), '#5f98b8', { opacity: 0.8, layers: 1, seed: seed + 8 })}
    ${wash(blob(s.tenaya[0] + 12, s.tenaya[1] - 6, 11, 6, { seed: seed + 9 }), '#5f98b8', { opacity: 0.85, layers: 1, seed: seed + 9 })}
    ${wash(blob(s.convict[0] + 4, s.convict[1] - 6, 9, 6, { seed: seed + 10 }), '#4f8fae', { opacity: 0.85, layers: 1, seed: seed + 10 })}
    ${ink(river, { w: 1.1, opacity: 0.55, color: '#2c5a72', breaks: false })}
    ${ink(bayShore, { w: 1.1, opacity: 0.6, color: '#2c5a72', breaks: false })}
    ${ink('M4 700 q8 -3 16 0 M10 740 q8 -3 16 0', { w: 0.7, opacity: 0.5, color: '#2c4a5a', breaks: false })}
    ${wash(pines, '#4f7a5c', { opacity: 0.7, layers: 1, seed: seed + 11 })}
    ${ink(pines, { w: 0.6, opacity: 0.55, breaks: false })}
    <g fill="#86a656" filter="url(#wash)" opacity=".85">${orchard}</g>
    <g fill="#f0b43c" filter="url(#wash)" opacity=".92">${aspen}</g>
    ${compass(350, 700)}
    ${spatter(330, 590, '#d9a441', { seed: seed + 13, n: 8, spread: 30 })}
  `, seed);
}
add('map-base', routeMap(), 2);

export const paintings = P;

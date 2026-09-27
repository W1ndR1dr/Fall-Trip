import { svgDoc, wash, bloom, ink, rng, dry, pencil, spatter, blob } from './paint.js';
import { leaf } from './leafshape.js';

export function aspenLeaf(seed = 2) {
  const L = leaf({ cx: 100, base: 160, L: 118, W: 58, p: 0.55, teeth: 22, depth: 0.035, bend: 5, seed });
  const inner = leaf({ cx: 104, base: 156, L: 104, W: 50, p: 0.55, teeth: 0, bend: 5, seed });
  return svgDoc(200, 230, `
    ${pencil(leaf({ cx: 98, base: 162, L: 122, W: 60, teeth: 0, seed: seed + 1 }).d)}
    ${wash(L.d, '#f6c945', { opacity: 0.8, seed, dx: 3, dy: -2 })}
    <g opacity=".6">${wash(inner.d, '#eea23a', { opacity: 0.45, layers: 1, seed: seed + 3, dx: 8, dy: 4 })}</g>
    ${dry('M70 130 Q100 118 128 132', '#c7682a', { opacity: 0.35, w: 7 })}
    ${ink(L.d, { w: 0.9, opacity: 0.8, seed })}
    ${ink(L.midrib, { w: 0.9, opacity: 0.6, breaks: false })}
    ${ink(L.veins, { w: 0.6, opacity: 0.42, breaks: false })}
    ${ink('M100 162 C 99 180 101 198 98 216', { w: 2.0, opacity: 0.85, breaks: false })}
    ${spatter(150, 60, '#e8a33a', { seed: 9 })}
  `, seed);
}

export function tufaScene(seed = 3) {
  const r = rng(seed);
  // Knobby tufa: one silhouette whose edges bulge in irregular knobs.
  const tower = (x, h, w, s) => {
    const rr = rng(s);
    const ph = [rr() * 6, rr() * 6, rr() * 6];
    const edge = (side, t) => {
      const base = w * (1 - t * 0.5) * (t > 0.85 ? 1 - (t - 0.85) * 3.2 : 1);
      const knob = Math.max(0, Math.sin(t * 19 + ph[side]) ) * w * 0.22 + Math.sin(t * 43 + ph[2]) * w * 0.05;
      return base + knob;
    };
    let L = [], R = [];
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const t = i / N, y = 196 - t * h;
      L.push(`${(x - edge(0, t)).toFixed(1)} ${y.toFixed(1)}`);
      R.push(`${(x + edge(1, t)).toFixed(1)} ${y.toFixed(1)}`);
    }
    return { d: 'M' + L.join('L') + 'L' + R.reverse().join('L') + 'Z', x, h, w };
  };
  const T = [tower(118, 104, 20, 100), tower(162, 62, 14, 200), tower(252, 128, 24, 300), tower(298, 56, 12, 400)];
  const mask = `<mask id="vig"><rect width="400" height="260" fill="black"/><path d="M40 40 C120 10 300 14 370 44 C404 90 398 190 360 226 C260 250 120 252 42 224 C8 180 6 90 40 40Z" fill="white" filter="url(#bloom)"/></mask>`;
  return svgDoc(400, 260, `<g mask="url(#vig)">
    ${bloom('M-20 -20 H420 V140 H-20Z', '#a9cde3', 0.75)}
    ${bloom('M-20 90 H420 V165 H-20Z', '#f6dcaa', 0.6)}
    ${pencil('M0 152 L46 122 L84 134 L132 104 L172 126 L222 96 L272 124 L322 110 L362 128 L400 114')}
    ${wash('M0 152 L46 122 L84 134 L132 104 L172 126 L222 96 L272 124 L322 110 L362 128 L400 114 L400 168 L0 168Z', '#9a97bd', { opacity: 0.55, seed: 11 })}
    ${wash('M64 162 C 92 150 124 152 152 162 Z', '#55525e', { opacity: 0.7, seed: 12 })}
    ${wash('M226 164 C 258 152 300 152 334 164 Z', '#efe8d8', { opacity: 0.9, seed: 13 })}
    ${wash('M-10 162 H410 V270 H-10Z', '#6aa3c0', { opacity: 0.65, seed: 14 })}
    ${T.map((t, i) => wash(t.d, '#e4d8bd', { opacity: 0.95, seed: 20 + i, dx: 1 })).join('')}
    ${T.map((t, i) => `<clipPath id="tc${i}"><path d="${t.d}"/></clipPath><g clip-path="url(#tc${i})">${wash(`M${t.x} 60 H${t.x + 60} V200 H${t.x}Z`, '#9c8762', { opacity: 0.45, layers: 1, seed: 50 + i })}</g>`).join('')}
    ${T.map((t, i) => ink(t.d, { w: 0.75, opacity: 0.6, seed: 40 + i })).join('')}
    ${T.map((t, i) => { const rr = rng(70 + i); let m = ''; for (let k = 0; k < t.h / 10; k++) { const y = 190 - rr() * t.h * 0.9, x = t.x + (rr() - 0.5) * t.w; m += `M${x.toFixed(1)} ${y.toFixed(1)} q2 ${(2 + rr() * 3).toFixed(1)} ${(3 + rr() * 4).toFixed(1)} 1`; } return ink(m, { w: 0.6, opacity: 0.45, breaks: false }); }).join('')}
    ${ink('M24 214 q 20 -3 40 0 t 40 0 M154 230 q 22 -3 44 0 t 44 0 M284 216 q 18 -3 36 0 t 36 0', { w: 0.8, opacity: 0.5, color: '#2c4a5a', breaks: false })}
    ${ink('M296 52 q6 -6 12 0 q6 -6 12 0 M326 72 q5 -5 10 0 q5 -5 10 0', { w: 1.1, opacity: 0.8, breaks: false })}
  </g>`, seed, mask);
}

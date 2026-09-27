import { svgDoc, wash, bloom, ink, rng } from './paint.js';
import { leaf } from './leafshape.js';
const INK = '#3b2a1c';

function aspenLeaf(seed = 1) {
  const L = leaf({ cx: 100, base: 160, L: 118, W: 58, p: 0.55, teeth: 18, depth: 0.045, bend: 5, seed });
  return svgDoc(200, 230, `
    ${wash(L.d, '#f2c14e', { opacity: 0.75, seed })}
    ${wash(L.d, '#e8962e', { opacity: 0.35, layers: 2, jitter: 8, seed: seed + 1 })}
    <g transform="translate(6 -4) scale(.9)" opacity=".5">${wash(leaf({ cx: 104, base: 150, L: 80, W: 30, seed: seed + 4 }).d, '#d9a441', { opacity: 0.5, layers: 1, seed })}</g>
    ${ink(L.d, { w: 1.3, opacity: 0.75 })}
    ${ink(L.midrib, { w: 1.2, opacity: 0.7 })}
    ${ink(L.veins, { w: 0.8, opacity: 0.5 })}
    ${ink('M100 162 C 99 180 101 198 99 214', { w: 2.4, opacity: 0.85 })}
  `, seed);
}

function tufaScene(seed = 3) {
  const r = rng(seed);
  const tower = (x, h, w) => {
    let d = `M${x - w} 200 `;
    const steps = 9;
    for (let i = 1; i <= steps; i++) { const y = 200 - (h * i) / steps; const ww = w * (1 - i / steps * 0.55) + (r() - 0.5) * 6; d += `L${(x - ww).toFixed(1)} ${y.toFixed(1)} `; }
    d += `Q${x} ${200 - h - 10} ${x + w * 0.45} ${200 - h} `;
    for (let i = steps; i >= 1; i--) { const y = 200 - (h * i) / steps; const ww = w * (1 - i / steps * 0.55) + (r() - 0.5) * 6; d += `L${(x + ww).toFixed(1)} ${y.toFixed(1)} `; }
    return d + `L${x + w} 200Z`;
  };
  const t1 = tower(120, 110, 26), t2 = tower(170, 70, 18), t3 = tower(250, 130, 30), t4 = tower(300, 60, 16);
  return svgDoc(400, 260, `
    ${bloom('M-20 -20 H420 V150 H-20Z', '#9cc3dc', 0.55)}
    ${bloom('M-20 60 H420 V170 H-20Z', '#f3d9a6', 0.35)}
    ${wash('M0 150 L40 120 L80 132 L130 104 L170 124 L220 98 L270 122 L320 108 L360 126 L400 112 L400 170 L0 170Z', '#8d8fb4', { opacity: 0.5, seed: 11 })}
    ${wash('M60 160 C 90 150 120 152 150 160 Z', '#4a4a52', { opacity: 0.55, seed: 12 })}
    ${wash('M230 162 C 260 150 300 150 330 162 Z', '#e8e2d2', { opacity: 0.8, seed: 13 })}
    ${wash('M-10 160 H410 V260 H-10Z', '#6d9fb8', { opacity: 0.55, seed: 14 })}
    ${[t1, t2, t3, t4].map((t, i) => wash(t, '#d8ccb2', { opacity: 0.85, seed: 20 + i }) + wash(t, '#a89878', { opacity: 0.25, layers: 1, jitter: 10, seed: 30 + i })).join('')}
    ${[t1, t2, t3, t4].map((t) => ink(t, { w: 1.2, opacity: 0.7 })).join('')}
    ${ink('M20 212 q 20 -4 40 0 t 40 0 M150 226 q 22 -4 44 0 t 44 0 M280 214 q 18 -4 36 0 t 36 0', { w: 1, opacity: 0.5, color: '#2c4a5a' })}
    ${ink('M300 50 q6 -6 12 0 q6 -6 12 0 M330 70 q5 -5 10 0 q5 -5 10 0', { w: 1.3, opacity: 0.8 })}
  `, seed);
}

export const paintings = { aspen: aspenLeaf(2), tufa: tufaScene(3) };

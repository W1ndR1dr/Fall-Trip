import { rng } from './paint.js';
const f = (n) => Math.round(n * 10) / 10;

// Organic leaf outline: width profile along a slightly curved midrib, with
// serrations and a little asymmetry so no two leaves are identical.
export function leaf({ cx = 100, base = 170, L = 130, W = 62, p = 0.58, teeth = 16, depth = 0.05, bend = 6, asym = 0.08, seed = 1, double = false } = {}) {
  const r = rng(seed);
  const N = 120, right = [], left = [];
  const aL = 1 + (r() - 0.5) * asym * 2, aR = 1 + (r() - 0.5) * asym * 2;
  const mid = (t) => [cx + Math.sin(t * Math.PI) * bend * (t - 0.2), base - t * L];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    let w = W * Math.sin(Math.PI * Math.pow(t, p));
    if (teeth && t > 0.05 && t < 0.97) {
      // Rounded (crenate) teeth rather than a saw blade.
      const s = 1 - depth * (1 - Math.abs(Math.sin(Math.PI * t * teeth)));
      const s2 = double ? 1 - depth * 0.5 * (1 - Math.abs(Math.sin(Math.PI * t * teeth * 2.1))) : 1;
      w *= s * s2;
    }
    const [mx, my] = mid(t);
    // normal to the midrib (approx): mostly horizontal
    right.push([mx + w * aR, my]);
    left.push([mx - w * aL, my]);
  }
  const pts = [...right, ...left.reverse()];
  const d = 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
  // veins
  let v = `M${cx} ${base + 2}`;
  for (let i = 1; i <= 24; i++) { const [x, y] = mid(i / 24 * 0.95); v += `L${f(x)} ${f(y)}`; }
  const veins = [];
  const n = 5;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1.3);
    const [mx, my] = mid(t);
    const t2 = Math.min(0.97, t + 0.16);
    const reach = 0.78 * W * Math.sin(Math.PI * Math.pow(t2, p));
    const [, ey] = mid(t2);
    veins.push(`M${f(mx)} ${f(my)} Q${f(mx + reach * 0.5)} ${f(my - (my - ey) * 0.3)} ${f(mx + reach * aR)} ${f(ey)}`);
    veins.push(`M${f(mx)} ${f(my)} Q${f(mx - reach * 0.5)} ${f(my - (my - ey) * 0.3)} ${f(mx - reach * aL)} ${f(ey)}`);
  }
  return { d, midrib: v, veins: veins.join(' ') };
}

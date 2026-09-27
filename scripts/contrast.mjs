// WCAG 2.x contrast for the token pairs the UI actually uses, in every theme.
// Reads src/ui/tokens.css; alpha colors are composited over their real
// backdrop. Usage: node scripts/contrast.mjs   (exits 1 on any failure)
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/ui/tokens.css', import.meta.url), 'utf8');
function block(sel) {
  const i = css.indexOf(sel);
  const body = css.slice(css.indexOf('{', i) + 1, css.indexOf('\n}', i));
  const vars = {};
  for (const m of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}
const themes = {
  light: block("[data-theme='light'] {"),
  dark: block("[data-theme='dark'] {"),
  night: block("[data-theme='night'] {"),
};

function parse(c, vars) {
  c = c.trim();
  const ref = c.match(/^var\(--([\w-]+)\)$/);
  if (ref) return parse(vars[ref[1]], vars);
  if (c.startsWith('#')) return [...[1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)), 1];
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(',').map(Number);
    return [p[0], p[1], p[2], p[3] ?? 1];
  }
  throw new Error('cannot parse ' + c);
}
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = (rgb) => {
  const c = rgb.slice(0, 3).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background(s) composited bottom-up, minimum]
const TEXT = 4.5, UI = 3;
const pairs = [
  ['text', ['bg'], TEXT], ['text', ['bg-2'], TEXT], ['text', ['bg-3'], TEXT],
  ['text-2', ['bg'], TEXT], ['text-2', ['bg-2'], TEXT], ['text-2', ['bg-2', 'fill-2'], TEXT],
  ['text-3', ['bg'], TEXT], ['text-3', ['bg-2'], TEXT], ['text-3', ['bg-2', 'fill'], TEXT],
  ['accent-text', ['bg'], TEXT], ['accent-text', ['bg-2'], TEXT], ['accent-text', ['bg-2', 'accent-soft'], TEXT],
  ['on-accent', ['accent'], TEXT],
  ['ember', ['bg-2'], TEXT], ['ember', ['bg-2', 'ember-soft'], TEXT],
  ['night', ['bg-2'], TEXT], ['night', ['bg-2', 'night-soft'], TEXT],
  ['ok', ['bg'], TEXT], ['ok', ['bg-2'], TEXT], ['danger', ['bg-2'], TEXT],
  ['water-text', ['water'], TEXT],
  ['accent-mark', ['bg'], UI], ['accent-mark', ['bg-2'], UI],
  ['text-3', ['bg-2', 'fill-2'], UI],
  ['kid-1-ink', ['kid-1-fill'], TEXT], ['kid-2-ink', ['kid-2-fill'], TEXT], ['kid-3-ink', ['kid-3-fill'], TEXT],
  ['kid-1', ['bg-2'], UI], ['kid-2', ['bg-2'], UI], ['kid-3', ['bg-2'], UI],
  ['kid-1-text', ['bg'], TEXT], ['kid-2-text', ['bg'], TEXT], ['kid-3-text', ['bg'], TEXT],
  ['kid-1-text', ['bg-2'], TEXT], ['kid-2-text', ['bg-2'], TEXT], ['kid-3-text', ['bg-2'], TEXT],
  ['text', ['bg', 'glass'], TEXT], ['text-2', ['bg', 'glass'], TEXT],
  ['focus', ['bg'], UI], ['focus', ['bg-2'], UI],
];
// The light sky tint at the top of pages: marks must hold on it too. `bloom`
// is the strongest point of the live card's warm radial bloom (--live-bloom's
// first stop), composited over the card.
const extra = {
  light: { sky: '#efe2d1', bloom: 'rgba(255, 190, 110, 0.24)' },
  dark: { sky: '#170e08', bloom: 'rgba(255, 160, 70, 0.1)' },
  night: { sky: '#050202', bloom: 'rgba(0, 0, 0, 0)' },
};
pairs.push(['accent-mark', ['sky'], UI], ['text-3', ['sky'], TEXT], ['accent-text', ['sky'], TEXT]);
// Chips and tags on the page, and on the live card's bloom corner (LeaveBy,
// "Last gas", "Open", night tags, the live pill).
pairs.push(
  ['ember', ['bg', 'ember-soft'], TEXT], ['ember', ['bg-2', 'bloom', 'ember-soft'], TEXT],
  ['ok', ['bg', 'ok-soft'], TEXT], ['night', ['bg', 'night-soft'], TEXT],
  ['accent-text', ['bg-2', 'bloom', 'accent-soft'], TEXT], ['text', ['bg-2', 'bloom'], TEXT],
  ['text-3', ['bg-2', 'bloom'], TEXT],
);

let fails = 0;
for (const [th, vars0] of Object.entries(themes)) {
  const vars = { ...vars0, ...extra[th] };
  console.log(`\n${th}`);
  for (const [fg, bgs, min] of pairs) {
    let bg = parse(vars[bgs[0]], vars);
    for (const b of bgs.slice(1)) bg = over(parse(vars[b], vars), bg);
    const f = over(parse(vars[fg], vars), bg);
    const r = ratio(f, bg);
    const ok = r >= min;
    if (!ok) fails++;
    console.log(`  ${ok ? ' ' : '✗'} ${fg.padEnd(12)} on ${bgs.join(' + ').padEnd(22)} ${r.toFixed(2).padStart(5)}:1  (min ${min})`);
  }
}
console.log(fails ? `\n${fails} pair(s) below minimum` : '\nAll pairs pass');
process.exit(fails ? 1 : 0);

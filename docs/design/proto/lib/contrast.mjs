// WCAG 2.x contrast for the token pairs actually used. Alpha colours are
// composited over their real backdrop first.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = (fg, a, bg) => fg.map((v, i) => Math.round(v * a + bg[i] * (1 - a)));
const lum = (rgb) => { const c = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const T = {
  dark: { bg: '#0E0A07', bg2: '#17110D', text: '#F8EFE6', text2: '#C4B3A1', text3: '#9A8876', accentText: '#FFC578', accent: '#FFB44F', mark: '#FFB44F', onAccent: '#1E1004', night: '#A9B1FF', ok: '#9ED49A', softA: [255, 170, 80, 0.14], nightSoft: [150, 160, 255, 0.14] },
  light: { bg: '#FAF6F0', bg2: '#FFFFFF', text: '#1D140D', text2: '#5C4B3B', text3: '#7A6653', accentText: '#A34F06', accent: '#F29A2E', mark: '#C0620A', onAccent: '#1E1004', night: '#4A50C4', ok: '#2F7A3A', softA: [242, 154, 46, 0.14], nightSoft: [74, 80, 196, 0.10] },
};
const rows = [];
for (const [th, t] of Object.entries(T)) {
  const bg = hex(t.bg), bg2 = hex(t.bg2);
  const soft = over(t.softA.slice(0, 3), t.softA[3], bg2);
  const nsoft = over(t.nightSoft.slice(0, 3), t.nightSoft[3], bg2);
  const pairs = [
    ['text / bg', t.text, bg], ['text / bg-2 (card)', t.text, bg2],
    ['text-2 / bg', t.text2, bg], ['text-2 / bg-2', t.text2, bg2],
    ['text-3 / bg', t.text3, bg], ['text-3 / bg-2', t.text3, bg2],
    ['accent-text / bg', t.accentText, bg], ['accent-text / bg-2', t.accentText, bg2], ['accent-text / accent-soft', t.accentText, soft],
    ['on-accent / accent (button)', t.onAccent, hex(t.accent)],
    ['night / bg-2', t.night, bg2], ['night / night-soft', t.night, nsoft],
    ['ok / bg', t.ok, bg],
    ['accent fill (with on-accent ink) / bg', t.accent, bg],
    ['accent-mark (pips, progress, live dot) / bg', t.mark, bg], ['accent-mark / bg-2', t.mark, bg2],
  ];
  for (const [name, fg, b] of pairs) rows.push([th, name, fg, ratio(hex(fg), b)]);
}
if ((process.argv[1] || '').endsWith('contrast.mjs')) {
  for (const [th, n, fg, r] of rows) console.log(`| ${th} | ${n} | ${fg} | ${r.toFixed(2)}:1 | ${r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large / UI' : 'FAIL'} |`);
}
export { rows };

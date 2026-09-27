// Original SVG illustrations. Colors come from CSS custom properties so the
// art follows the light/dark theme. Leaf outlines are generated from a
// width profile along the midrib plus a serration function, which keeps
// the botanical silhouettes honest (aspen = round with a short point,
// willow = long and narrow, birch = doubly toothed) in very little code.

const f = (n) => Math.round(n * 10) / 10;

function leafPath({ L = 70, W = 30, p = 0.6, teeth = 0, depth = 0, double = false, baseY = 82 }) {
  const N = 90;
  const right = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    let w = W * Math.sin(Math.PI * Math.pow(t, p));
    if (teeth) {
      const saw = 1 - depth * ((t * teeth) % 1);
      const saw2 = double ? 1 - depth * 0.5 * ((t * teeth * 2) % 1) : 1;
      w *= t > 0.04 && t < 0.97 ? saw * saw2 : 1;
    }
    right.push([50 + w, baseY - t * L]);
  }
  const left = right.map(([x, y]) => [100 - x, y]).reverse();
  const pts = [...right, ...left];
  return 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
}

function veins({ L = 70, W = 30, p = 0.6, baseY = 82, n = 4 }) {
  let d = `M50 ${baseY}V${f(baseY - L * 0.94)}`;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1.2);
    const y = baseY - t * L;
    const t2 = Math.min(t + 0.14, 0.98);
    const dx = 0.72 * W * Math.sin(Math.PI * Math.pow(t2, p)); // stays inside the blade
    d += `M50 ${f(y)}L${f(50 + dx)} ${f(baseY - t2 * L)}M50 ${f(y)}L${f(50 - dx)} ${f(baseY - t2 * L)}`;
  }
  return d;
}

function leafSVG(shape, { fill = 'var(--leaf-gold)', stem = 16, flatStem = false, label = '' } = {}) {
  const baseY = shape.baseY ?? 82;
  const stemPath = flatStem
    ? `<path d="M48.6 ${baseY}h2.8v${stem}h-2.8z" fill="var(--bark)"/>`
    : `<path d="M50 ${baseY}v${stem}" stroke="var(--bark)" stroke-width="2.6" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 100 ${baseY + stem + 2}" role="img" aria-label="${label}"><path d="${leafPath(
    shape
  )}" fill="${fill}" stroke="var(--leaf-edge)" stroke-width="1.6" stroke-linejoin="round"/><path d="${veins(
    shape
  )}" stroke="var(--leaf-edge)" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".75"/>${stemPath}</svg>`;
}

export const leaves = {
  aspen: (o = {}) =>
    leafSVG({ L: 62, W: 34, p: 0.55, teeth: 14, depth: 0.05, baseY: 72 }, { stem: 24, flatStem: true, label: 'Quaking aspen leaf', ...o }),
  cottonwood: (o = {}) =>
    leafSVG({ L: 80, W: 25, p: 0.75, teeth: 18, depth: 0.04 }, { fill: 'var(--leaf-yellow)', label: 'Black cottonwood leaf', ...o }),
  willow: (o = {}) =>
    leafSVG({ L: 84, W: 9, p: 0.95, teeth: 22, depth: 0.05 }, { fill: 'var(--leaf-olive)', stem: 8, label: 'Willow leaf', ...o }),
  birch: (o = {}) =>
    leafSVG({ L: 52, W: 22, p: 0.7, teeth: 9, depth: 0.12, double: true, baseY: 66 }, { fill: 'var(--leaf-orange)', stem: 12, label: 'Water birch leaf', ...o }),
  big: (o = {}) =>
    leafSVG({ L: 84, W: 40, p: 0.6, teeth: 12, depth: 0.04, baseY: 88 }, { fill: 'var(--leaf-orange)', stem: 10, label: 'The biggest leaf', ...o }),
};

// Rocky Mountain maple (Acer glabrum) grows in Eastern Sierra canyons and
// often turns red: a three-lobed leaf.
leaves.red = () => `<svg viewBox="0 0 100 100" role="img" aria-label="Red leaf">
<path d="M50 86 L46 70 C34 74 22 72 14 62 C22 58 26 54 26 48 C18 44 12 36 12 26 C24 30 32 30 38 36 C38 26 42 14 50 6 C58 14 62 26 62 36 C68 30 76 30 88 26 C88 36 82 44 74 48 C74 54 78 58 86 62 C78 72 66 74 54 70 Z" fill="var(--leaf-red)" stroke="var(--leaf-edge)" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M50 84V12M50 60L22 34M50 60L78 34M50 66L20 62M50 66L80 62" stroke="var(--leaf-edge)" stroke-width="1.2" fill="none" opacity=".7"/>
<path d="M50 86v12" stroke="var(--bark)" stroke-width="2.6" stroke-linecap="round"/></svg>`;

leaves.heart = () => `<svg viewBox="0 0 100 100" role="img" aria-label="Heart-shaped leaf">
<path d="M50 86 C34 72 12 58 12 38 C12 24 22 16 32 16 C40 16 46 20 50 28 C54 20 60 16 68 16 C78 16 88 24 88 38 C88 58 66 72 50 86Z" fill="var(--leaf-red)" stroke="var(--leaf-edge)" stroke-width="1.6"/>
<path d="M50 84V30M50 50L30 34M50 50L70 34M50 64L28 52M50 64L72 52" stroke="var(--leaf-edge)" stroke-width="1.2" fill="none" opacity=".7"/>
<path d="M50 86v12" stroke="var(--bark)" stroke-width="2.6" stroke-linecap="round"/></svg>`;

export const things = {
  pinecone: () => {
    // Scales: a diamond lattice of little arcs clipped to the cone outline.
    const cone = 'M50 8 C74 22 78 60 62 86 Q50 96 38 86 C22 60 26 22 50 8Z';
    let scales = '';
    for (let r = 0; r < 10; r++) {
      const y = 14 + r * 8;
      for (let c = -4; c <= 4; c++) {
        const x = 50 + c * 12 + (r % 2 ? 6 : 0);
        scales += `<path d="M${x - 6} ${y} Q${x} ${y + 9} ${x + 6} ${y}"/>`;
      }
    }
    return `<svg viewBox="0 0 100 100" role="img" aria-label="Pinecone"><defs><clipPath id="cone-clip"><path d="${cone}"/></clipPath></defs><path d="${cone}" fill="var(--cone)"/><g clip-path="url(#cone-clip)" fill="var(--cone-scale)" stroke="var(--bark)" stroke-width="1.4">${scales}</g><path d="${cone}" fill="none" stroke="var(--bark)" stroke-width="1.8"/><path d="M50 8V2" stroke="var(--bark)" stroke-width="3" stroke-linecap="round"/></svg>`;
  },
  granite: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Granite with sparkles">
<path d="M12 78 L20 44 L44 28 L74 34 L90 60 L82 80 Z" fill="var(--granite)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>
<g fill="var(--ink)" opacity=".55"><circle cx="34" cy="56" r="2.4"/><circle cx="58" cy="48" r="1.8"/><circle cx="66" cy="66" r="2.6"/><circle cx="42" cy="70" r="1.6"/><circle cx="74" cy="52" r="1.5"/></g>
<g fill="#fff" opacity=".9"><circle cx="48" cy="60" r="1.5"/><circle cx="28" cy="66" r="1.2"/><circle cx="60" cy="72" r="1.3"/></g>
<g fill="var(--sparkle)"><path d="M52 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M78 20l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z"/><path d="M26 36l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></g></svg>`,
  beaverDam: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Beaver dam">
<path d="M0 62 H100 V100 H0Z" fill="var(--water)"/>
<path d="M0 70 Q25 66 50 70 T100 70" stroke="#fff" stroke-width="1.5" fill="none" opacity=".5"/>
<path d="M8 64 Q50 30 92 64 Z" fill="var(--mud)" stroke="var(--ink)" stroke-width="1.6"/>
<g stroke="var(--bark)" stroke-width="3" stroke-linecap="round"><path d="M14 60L40 40"/><path d="M30 60L62 38"/><path d="M50 60L86 52"/><path d="M22 52L70 46"/><path d="M60 42L80 58"/><path d="M36 48L58 60"/></g>
<g fill="var(--bark)"><circle cx="40" cy="40" r="2"/><circle cx="62" cy="38" r="2"/></g></svg>`,
  tufa: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Tufa tower">
<path d="M0 74 H100 V100 H0Z" fill="var(--water)"/>
<path d="M30 76 C28 60 34 56 32 46 C30 36 38 34 40 26 C42 18 50 16 54 22 C58 30 56 34 62 40 C66 46 62 54 66 62 C68 68 70 72 72 76 Z" fill="var(--tufa)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
<g fill="var(--ink)" opacity=".35"><circle cx="40" cy="44" r="2.2"/><circle cx="52" cy="34" r="1.8"/><circle cx="58" cy="54" r="2.4"/><circle cx="44" cy="62" r="1.6"/></g>
<path d="M8 82 Q24 78 40 82 T72 82 T100 82" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5"/>
<path d="M76 30 q4-4 8 0 q4-4 8 0" stroke="var(--ink)" stroke-width="1.5" fill="none"/></svg>`,
  pumpkin: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Pumpkin">
<path d="M50 28 C24 24 12 44 14 60 C16 80 34 88 50 84 C66 88 84 80 86 60 C88 44 76 24 50 28Z" fill="var(--pumpkin)" stroke="var(--ink)" stroke-width="1.8"/>
<path d="M50 30 C38 40 38 76 50 84 M50 30 C62 40 62 76 50 84 M32 30 C22 46 26 76 38 84 M68 30 C78 46 74 76 62 84" stroke="var(--ink)" stroke-width="1.4" fill="none" opacity=".5"/>
<path d="M48 30 C48 22 50 16 56 12" stroke="var(--pine)" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M56 18 C64 12 72 16 70 22 C64 22 60 22 56 18Z" fill="var(--leaf-olive)"/></svg>`,
  cocoa: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Mug of cocoa">
<path d="M22 40 H70 V76 Q70 88 58 88 H34 Q22 88 22 76 Z" fill="var(--ember)" stroke="var(--ink)" stroke-width="1.8"/>
<path d="M70 48 Q86 48 84 62 Q82 72 70 72" stroke="var(--ink)" stroke-width="5" fill="none"/>
<ellipse cx="46" cy="40" rx="24" ry="5" fill="var(--cocoa-top)" stroke="var(--ink)" stroke-width="1.6"/>
<g stroke="var(--ink)" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55" class="steam"><path d="M36 30 q-4-6 0-12 q4-6 0-12"/><path d="M48 30 q-4-6 0-12 q4-6 0-12"/><path d="M60 30 q-4-6 0-12 q4-6 0-12"/></g>
<path d="M36 60 c0-5 7-5 7 0 c0-5 7-5 7 0 c0 5-7 9-7 11 c0-2-7-6-7-11z" fill="var(--paper)" opacity=".8"/></svg>`,
  apple: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Caramel apple">
<path d="M50 30 C34 22 16 30 18 54 C20 76 36 90 50 84 C64 90 80 76 82 54 C84 30 66 22 50 30Z" fill="var(--leaf-red)" stroke="var(--ink)" stroke-width="1.8"/>
<path d="M19 52 C30 60 40 50 50 58 C60 50 70 60 81 52 C82 44 78 34 72 30 C64 26 56 28 50 30 C44 28 36 26 28 30 C22 34 18 42 19 52Z" fill="var(--caramel)" stroke="var(--ink)" stroke-width="1.6"/>
<path d="M50 30 V4" stroke="var(--bark)" stroke-width="4" stroke-linecap="round"/></svg>`,
  book: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Open book">
<path d="M50 30 C40 22 24 22 12 26 V78 C24 74 40 74 50 82 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.8"/>
<path d="M50 30 C60 22 76 22 88 26 V78 C76 74 60 74 50 82 Z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.8"/>
<g stroke="var(--ink)" stroke-width="1.3" opacity=".4"><path d="M20 38 Q32 35 42 40M20 48 Q32 45 42 50M20 58 Q32 55 42 60M58 40 Q68 35 80 38M58 50 Q68 45 80 48M58 60 Q68 55 80 58"/></g>
<path d="M66 22 l6 -16 l6 16" fill="var(--leaf-gold)" stroke="var(--ink)" stroke-width="1.4"/></svg>`,
  moon: (illum = 0.5, waxing = true) => {
    // Terminator drawn as an ellipse; illum 0..1.
    const k = 1 - 2 * illum; // +1 new, -1 full
    const rx = Math.abs(k) * 40;
    const lit = waxing ? 1 : 0;
    const sweepOuter = waxing ? 1 : 0;
    const sweepInner = k > 0 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
    return `<svg viewBox="0 0 100 100" role="img" aria-label="Moon, ${Math.round(illum * 100)} percent lit">
<circle cx="50" cy="50" r="40" fill="var(--moon-dark)"/>
<path d="M50 10 A40 40 0 0 ${sweepOuter} 50 90 A${f(rx)} 40 0 0 ${sweepInner} 50 10Z" fill="var(--moon)" data-lit="${lit}"/>
<circle cx="50" cy="50" r="40" fill="none" stroke="var(--ink)" stroke-width="1.2" opacity=".35"/></svg>`;
  },
};

// Animal tracks of the Eastern Sierra, drawn roughly to relative shape.
const toe = (x, y, rx = 5, ry = 7, rot = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})"/>`;
export const tracks = {
  deer: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Mule deer track"><g fill="var(--ink)">
<path d="M46 20 C36 30 32 56 36 76 C40 84 48 82 48 74 C48 56 48 36 46 20Z"/><path d="M54 20 C64 30 68 56 64 76 C60 84 52 82 52 74 C52 56 52 36 54 20Z"/></g></svg>`,
  coyote: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Coyote track"><g fill="var(--ink)">
${toe(38, 26, 6, 9, -8)}${toe(62, 26, 6, 9, 8)}${toe(26, 46, 5.5, 8, -20)}${toe(74, 46, 5.5, 8, 20)}
<path d="M50 50 C38 50 34 62 38 70 C42 76 58 76 62 70 C66 62 62 50 50 50Z"/>
<path d="M38 16 l-2 -6 M62 16 l2 -6" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/></g></svg>`,
  bear: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Black bear track"><g fill="var(--ink)">
${toe(20, 34, 6, 7)}${toe(34, 24, 6.5, 7.5)}${toe(50, 20, 7, 8)}${toe(66, 24, 6.5, 7.5)}${toe(80, 34, 6, 7)}
<path d="M16 50 C22 44 78 44 84 50 C88 62 76 80 62 84 C54 86 46 86 38 84 C24 80 12 62 16 50Z"/></g></svg>`,
  beaver: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Beaver hind track, big and webbed"><g fill="var(--ink)">
<path d="M22 30 Q30 50 36 62 L64 62 Q70 50 78 30 Q66 40 58 18 Q50 38 42 18 Q34 40 22 30Z" opacity=".45"/>
${toe(20, 26, 5, 8, -30)}${toe(34, 14, 5, 8, -12)}${toe(50, 12, 5, 8)}${toe(66, 14, 5, 8, 12)}${toe(80, 26, 5, 8, 30)}
<path d="M50 94 C36 94 32 80 34 66 C36 56 64 56 66 66 C68 80 64 94 50 94Z"/></g></svg>`,
  squirrel: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Squirrel and chipmunk tracks"><g fill="var(--ink)">
${toe(28, 20, 3.5, 6, -10)}${toe(38, 14, 3.5, 7)}${toe(48, 16, 3.5, 6.5, 10)}${toe(56, 22, 3.5, 6, 25)}${toe(20, 30, 3, 5, -30)}
<path d="M26 34 C34 30 48 30 54 36 C56 44 46 50 38 48 C28 46 22 40 26 34Z"/>
${toe(40, 62, 3, 5, -15)}${toe(50, 58, 3, 5)}${toe(60, 60, 3, 5, 15)}${toe(68, 66, 3, 5, 30)}
<path d="M42 70 C50 66 62 68 66 74 C64 82 54 84 48 82 C42 80 40 76 42 70Z"/></g></svg>`,
  bird: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Songbird track"><g stroke="var(--ink)" stroke-width="4" stroke-linecap="round" fill="none">
<path d="M50 88 V50 M50 50 L30 18 M50 50 L50 12 M50 50 L70 18"/></g></svg>`,
  gull: () => `<svg viewBox="0 0 100 100" role="img" aria-label="California gull track, webbed">
<path d="M50 86 L22 26 Q36 38 50 34 Q64 38 78 26 Z" fill="var(--ink)" opacity=".8"/>
<g stroke="var(--ink)" stroke-width="4" stroke-linecap="round" fill="none"><path d="M50 86 L22 26 M50 86 L50 16 M50 86 L78 26"/></g></svg>`,
  raccoon: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Raccoon track, like a tiny hand"><g fill="var(--ink)">
<path d="M34 60 C30 48 38 40 50 40 C62 40 70 48 66 60 C62 72 38 72 34 60Z"/>
<path d="M36 44 L20 24" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/><path d="M44 40 L36 14" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>
<path d="M52 40 L54 12" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/><path d="M60 42 L70 16" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>
<path d="M65 48 L82 32" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/></g></svg>`,
};

// Decorative scenery.
export const scenery = {
  aspenGrove: () => `<svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMax slice" aria-hidden="true" class="grove">
<path d="M0 150 L60 70 L100 110 L170 30 L230 100 L270 72 L330 120 L400 60 V180 H0Z" fill="var(--mtn-far)"/>
<path d="M150 58 L170 30 L190 56 L180 52 L170 60 L160 52Z" fill="var(--snow)"/>
<path d="M0 170 L80 120 L150 150 L240 110 L320 150 L400 118 V180 H0Z" fill="var(--mtn-near)"/>
${[30, 70, 118, 300, 342, 382]
  .map((x, i) => {
    const h = [120, 96, 132, 110, 128, 92][i];
    const c = ['var(--leaf-gold)', 'var(--leaf-yellow)', 'var(--leaf-orange)', 'var(--leaf-gold)', 'var(--leaf-yellow)', 'var(--leaf-orange)'][i];
    const top = 180 - h;
    return `<rect x="${x - 3}" y="${top + 20}" width="6" height="${h - 20}" fill="var(--trunk)"/>
<g fill="var(--bark)" opacity=".7"><rect x="${x - 3}" y="${top + 48}" width="4" height="2"/><rect x="${x - 1}" y="${top + 78}" width="4" height="2"/><rect x="${x - 3}" y="${top + 100}" width="3" height="2"/></g>
<ellipse cx="${x}" cy="${top + 18}" rx="${h * 0.17}" ry="${h * 0.24}" fill="${c}"/>`;
  })
  .join('')}</svg>`,
};

// Icon set for UI (stroke-based, 24px grid).
const I = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}${extra}</svg>`;
export const icons = {
  today: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  plan: I('<path d="M4 5h16M4 12h16M4 19h10"/><circle cx="18" cy="19" r="2"/>'),
  explore: I('<path d="M3 20l6-12 4 7 3-4 5 9z"/><circle cx="17" cy="5" r="2"/>'),
  kids: I('<path d="M12 21c-5-4-8-7-8-11a4 4 0 018-1 4 4 0 018 1c0 4-3 7-8 11z"/>'),
  faith: I('<path d="M12 3v18M7 8h10"/>'),
  map: I('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
  car: I('<path d="M5 16l1.5-5A2 2 0 018.4 9.5h7.2a2 2 0 011.9 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><circle cx="7.5" cy="20" r="1"/><circle cx="16.5" cy="20" r="1"/>'),
  walk: I('<circle cx="13" cy="4" r="2"/><path d="M11 21l2-6-3-3 1-5 4 3 3 1M8 12l-2 4"/>'),
  wc: I('<circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/><path d="M5 22v-6H4l1.5-7h3L10 16H9v6M15 22v-8h-1V9h6v5h-1v8"/>'),
  clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>'),
  sunset: I('<path d="M4 18h16M7 14a5 5 0 0110 0M12 4v4M9 7l3 3 3-3"/>'),
  check: I('<path d="M5 12l5 5 9-10"/>'),
  back: I('<path d="M15 5l-7 7 7 7"/>'),
  ext: I('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>'),
  gear: I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/>'),
  star: I('<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'),
  leaf: I('<path d="M12 21v-6M12 15C6 15 4 10 5 4c5 0 12 1 12 8a3 3 0 01-5 3z"/>'),
  cup: I('<path d="M4 8h12v6a5 5 0 01-5 5H9a5 5 0 01-5-5z"/><path d="M16 10h2a2 2 0 010 4h-2M8 3v2M12 3v2"/>'),
  pack: I('<rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 7V5a3 3 0 016 0v2M5 13h14"/>'),
  list: I('<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>'),
  info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
  share: I('<path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  speaker: I('<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6"/>'),
  sparkle: I('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
  eye: I('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  moon: I('<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>'),
  signal: I('<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>'),
};

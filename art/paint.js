// Ink-and-watercolor painting toolkit (SVG). Used by scripts/paint.mjs to bake
// illustrations into images, so every device shows identical, cheap art.

// Seeded RNG so every painting is reproducible.
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Shared filter defs: watercolor wash, granulation, wobbly ink, paper.
export function defs(seed = 7) {
  return `
<filter id="wash" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="${seed}" result="n1"/>
  <feDisplacementMap in="SourceGraphic" in2="n1" scale="10" xChannelSelector="R" yChannelSelector="G" result="shape"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="${seed + 21}" result="n2"/>
  <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.55" result="blotch"/>
  <feComposite in="shape" in2="blotch" operator="in" result="blotched"/>
  <feColorMatrix in="shape" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .5 0" result="base"/>
  <feMorphology in="shape" operator="erode" radius="2.6" result="inner"/>
  <feGaussianBlur in="inner" stdDeviation="3" result="innerSoft"/>
  <feComposite in="shape" in2="innerSoft" operator="out" result="rim"/>
  <feGaussianBlur in="rim" stdDeviation=".6" result="rimSoft"/>
  <feColorMatrix in="rimSoft" type="matrix" values=".72 0 0 0 0  0 .68 0 0 0  0 0 .66 0 0  0 0 0 .7 0" result="rimDark"/>
  <feMerge><feMergeNode in="base"/><feMergeNode in="blotched"/><feMergeNode in="rimDark"/></feMerge>
</filter>
<filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${seed + 9}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" result="w"/>
  <feGaussianBlur in="w" stdDeviation="5"/>
</filter>
<filter id="ink" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed + 5}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="w"/>
  <feGaussianBlur in="w" stdDeviation="0.35"/>
</filter>
<filter id="dry" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${seed + 17}" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.1" result="ga"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="${seed + 18}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G" result="w"/>
  <feComposite in="w" in2="ga" operator="in"/>
</filter>
<filter id="stampink" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="2" seed="${seed + 23}" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.55" result="ga"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="${seed + 24}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" result="w"/>
  <feComposite in="w" in2="ga" operator="in"/>
</filter>
<filter id="pencil" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="${seed + 11}" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2 1.6" result="ga"/>
  <feComposite in="SourceGraphic" in2="ga" operator="in"/>
</filter>`;
}

// A watercolor wash: the shape painted in 2–3 translucent, offset layers so
// pigment pools and edges wander, like a real brush pass.
export function wash(d, color, { opacity = 0.8, layers = 2, jitter = 4, seed = 1, dx = 0, dy = 0 } = {}) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < layers; i++) {
    const ox = dx + (r() - 0.5) * jitter * (i ? 1 : 0.3), oy = dy + (r() - 0.5) * jitter * (i ? 1 : 0.3);
    const op = (opacity * (i === 0 ? 1 : 0.4)).toFixed(2);
    out += `<path d="${d}" fill="${color}" opacity="${op}" transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})"/>`;
  }
  return `<g filter="url(#wash)">${out}</g>`;
}

// A soft background bloom (sky, hills) with blurry wet edges.
export function bloom(d, color, opacity = 0.45) {
  return `<path d="${d}" fill="${color}" opacity="${opacity}" filter="url(#bloom)" style="mix-blend-mode:multiply"/>`;
}

// Ink line drawn twice, slightly offset, for the lively look of a dip pen.
export function ink(d, { w = 1.1, color = '#4a3222', opacity = 0.85, fill = 'none', breaks = true, seed = 3 } = {}) {
  const r = rng(seed);
  const dash = breaks ? `stroke-dasharray="${Array.from({ length: 8 }, () => `${(40 + r() * 140).toFixed(0)} ${(1.5 + r() * 3).toFixed(1)}`).join(' ')}"` : '';
  return `<g filter="url(#ink)" opacity="${opacity}"><path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${dash}/>
<path d="${d}" fill="none" stroke="${color}" stroke-width="${(w * 0.5).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" transform="translate(0.7 0.5)" opacity=".4"/></g>`;
}

// Hatching inside a clip (for shadows), like quick pen strokes.
export function hatch(clipId, x, y, w, h, { step = 5, angle = -35, color = '#2a211a', opacity = 0.35, seed = 2 } = {}) {
  const r = rng(seed);
  let lines = '';
  for (let i = -h; i < w + h; i += step) {
    const j = (r() - 0.5) * 1.5;
    lines += `<path d="M${x + i + j} ${y + h} l${h} ${-h}" />`;
  }
  return `<g clip-path="url(#${clipId})" filter="url(#ink)" stroke="${color}" stroke-width=".8" opacity="${opacity}" transform="rotate(${angle + 35} ${x + w / 2} ${y + h / 2})">${lines}</g>`;
}

// Dry-brush strokes: pigment skipping over the paper's tooth.
export function dry(d, color, { opacity = 0.6, w = 10 } = {}) {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="${opacity}" filter="url(#dry)"/>`;
}

// Faint graphite underdrawing, like the sketch under a painting.
export function pencil(d, { opacity = 0.28, w = 0.7 } = {}) {
  return `<path d="${d}" fill="none" stroke="#6b645c" stroke-width="${w}" stroke-linecap="round" opacity="${opacity}" filter="url(#pencil)"/>`;
}

// A few paint spatters.
export function spatter(x, y, color, { n = 7, spread = 26, seed = 5, opacity = 0.55 } = {}) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = r() * spread;
    out += `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d).toFixed(1)}" r="${(0.6 + r() * r() * 3).toFixed(2)}"/>`;
  }
  return `<g fill="${color}" opacity="${opacity}" filter="url(#ink)">${out}</g>`;
}

// Lumpy organic outline around a center (rocks, tufa knobs, tree crowns).
export function blob(cx, cy, rx, ry, { lumps = 9, amp = 0.18, seed = 1, pts = 48 } = {}) {
  const r = rng(seed);
  const ph = Array.from({ length: 3 }, () => r() * Math.PI * 2);
  let d = '';
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const k = 1 + amp * (Math.sin(a * lumps + ph[0]) * 0.6 + Math.sin(a * (lumps * 0.5 + 1) + ph[1]) * 0.3 + (r() - 0.5) * 0.35);
    const x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k;
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d + 'Z';
}

export const svgDoc = (w, h, body, seed = 7, extraDefs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs(seed)}${extraDefs}</defs>${body}</svg>`;

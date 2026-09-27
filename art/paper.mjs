// Paper textures (seamless tiles) rendered from SVG turbulence.
export function paperSVG({ size = 512, base = '#f4ecdb', dark = false, seed = 4 } = {}) {
  const fib = [];
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 140; i++) {
    const x = r() * size, y = r() * size, l = 4 + r() * 14, a = r() * Math.PI;
    fib.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)} q${(Math.cos(a) * l / 2 + (r() - .5) * 3).toFixed(1)} ${(Math.sin(a) * l / 2 + (r() - .5) * 3).toFixed(1)} ${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}"/>`);
  }
  const fibColor = dark ? '#ffffff' : '#7a6448';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<defs>
 <filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${seed}" stitchTiles="stitch"/>
  <feColorMatrix type="matrix" values="0 0 0 0 ${dark ? 1 : 0.35}  0 0 0 0 ${dark ? 1 : 0.28}  0 0 0 0 ${dark ? 1 : 0.2}  0 0 0 ${dark ? -0.9 : -1.1} ${dark ? 0.62 : 0.72}"/>
 </filter>
 <filter id="mottle" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="${seed + 2}" stitchTiles="stitch"/>
  <feColorMatrix type="matrix" values="0 0 0 0 ${dark ? 0.9 : 0.55}  0 0 0 0 ${dark ? 0.75 : 0.42}  0 0 0 0 ${dark ? 0.5 : 0.25}  0 0 0 ${dark ? 0.35 : 0.5} ${dark ? -0.12 : -0.16}"/>
 </filter>
</defs>
<rect width="${size}" height="${size}" fill="${base}"/>
<rect width="${size}" height="${size}" filter="url(#mottle)"/>
<rect width="${size}" height="${size}" filter="url(#grain)" opacity="${dark ? 0.1 : 0.16}"/>
<g stroke="${fibColor}" stroke-width=".4" fill="none" opacity="${dark ? 0.05 : 0.09}">${fib.join('')}</g>
</svg>`;
}

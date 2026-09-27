// Surface textures: page paper (light/dark), slip paper, cloth cover, kraft.
import { paperSVG } from './paper.mjs';

export function linenSVG({ size = 512, base = '#2f4a3a', seed = 3 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
<defs>
 <filter id="weft" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.03" numOctaves="2" seed="${seed}" stitchTiles="stitch"/>
  <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.4 0.95"/></filter>
 <filter id="warp" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.03 0.9" numOctaves="2" seed="${seed + 1}" stitchTiles="stitch"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 0.95"/></filter>
 <filter id="mot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed="${seed + 2}" stitchTiles="stitch"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0.05  0 0 0 0 0  0 0 0 .6 -.2"/></filter>
</defs>
<rect width="${size}" height="${size}" fill="${base}"/>
<rect width="${size}" height="${size}" filter="url(#weft)" opacity=".13"/>
<rect width="${size}" height="${size}" filter="url(#warp)" opacity=".22"/>
<rect width="${size}" height="${size}" filter="url(#mot)"/>
</svg>`;
}

export const textures = {
  'paper': [paperSVG({ base: '#f3ead7', seed: 4 }), 'jpg'],
  'paper-slip': [paperSVG({ base: '#fbf6ea', seed: 9 }), 'jpg'],
  'paper-kraft': [paperSVG({ base: '#d4b88c', seed: 12 }), 'jpg'],
  'paper-dark': [paperSVG({ base: '#1d1e27', dark: true, seed: 6 }), 'jpg'],
  'paper-dark-slip': [paperSVG({ base: '#272632', dark: true, seed: 8 }), 'jpg'],
  'linen': [linenSVG({}), 'jpg'],
};

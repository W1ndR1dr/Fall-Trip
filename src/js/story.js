// Scrollytelling: a sticky SVG landscape whose sky, light, and layers are
// interpolated in JavaScript from scroll position. Each chapter is a set of
// target values; between chapters we blend. With reduced motion the scene
// simply snaps to the chapter in view (no continuous animation).
import { reducedMotion } from './ui.js';

const hex = (h) => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

// Layer ids: home, orchard, granite, lake, aspen, night, west
const LAYERS = ['home', 'orchard', 'granite', 'lake', 'aspen', 'night', 'west'];

// Seeded random so the stars are the same every visit.
function seeded(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

function sceneSVG() {
  const r = seeded(42);
  let stars = '';
  for (let i = 0; i < 200; i++) {
    const x = -400 + r() * 1200, y = r() * 170, s = r() < 0.12 ? 1.4 : 0.7 + r() * 0.5;
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(2)}"/>`;
  }
  let orchard = '';
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 9; i++) {
      const x = 14 + i * 46 + (row % 2) * 22, y = 206 + row * 22, s = 12 + row * 3;
      orchard += `<rect x="${x - 1.5}" y="${y}" width="3" height="${s * 0.8}" fill="var(--bark)"/>
<circle cx="${x}" cy="${y - 2}" r="${s}" fill="var(--orchard)"/>
<circle cx="${x - s * 0.4}" cy="${y - s * 0.3}" r="1.8" fill="var(--apple)"/><circle cx="${x + s * 0.35}" cy="${y + 1}" r="1.8" fill="var(--apple)"/><circle cx="${x + 2}" cy="${y - s * 0.6}" r="1.6" fill="var(--apple)"/>`;
    }
  }
  let aspens = '';
  const ar = seeded(7);
  for (let i = 0; i < 16; i++) {
    const x = 8 + i * 25 + ar() * 10, h = 70 + ar() * 60, top = 262 - h;
    aspens += `<rect x="${(x - 2.4).toFixed(1)}" y="${top + 16}" width="4.8" height="${h}" fill="var(--trunk)"/>
<rect x="${(x - 2.4).toFixed(1)}" y="${(top + 40 + ar() * 30).toFixed(1)}" width="3" height="1.6" fill="var(--bark)" opacity=".7"/>
<ellipse cx="${x.toFixed(1)}" cy="${top + 14}" rx="${(h * 0.16).toFixed(1)}" ry="${(h * 0.26).toFixed(1)}" class="crown" data-k="${(ar()).toFixed(2)}"/>`;
  }
  return `<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
<defs>
 <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" id="sky0"/><stop offset="1" id="sky1"/></linearGradient>
 <radialGradient id="sunglow"><stop offset="0" stop-color="#fff6d8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
 <linearGradient id="milky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#e8e4ff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
 <linearGradient id="lakeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--lake-top)"/><stop offset="1" stop-color="var(--lake-bot)"/></linearGradient>
</defs>
<rect x="-800" width="2000" height="300" fill="url(#skyg)"/>
<g id="stars" fill="#fff">${stars}<path d="M-420 250 C-100 150 220 60 820 -60 L830 -30 C230 90 -90 180 -410 280Z" fill="url(#milky)"/></g>
<g id="sun"><circle r="46" fill="url(#sunglow)"/><circle r="13" fill="#FFE6A3"/></g>
<g id="world"><path id="far" d="M0 190 L30 160 L52 172 L84 128 L110 150 L140 112 L168 140 L196 104 L222 134 L250 118 L280 146 L310 110 L340 138 L372 120 L400 142 V300 H0Z" />
<path id="snowcaps" d="M84 128 L92 138 L98 134 L104 142 L110 150 M140 112 L148 122 L154 118 L160 128 M196 104 L204 116 L210 112 L216 124 M310 110 L318 122 L324 118 L330 128" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"/>

<g class="layer" data-layer="home">
 <path d="M0 214 C60 196 110 204 160 214 C220 226 300 200 400 208 V300 H0Z" fill="var(--hill-far)"/>
 <path d="M0 236 C80 222 150 244 230 232 C300 222 350 236 400 230 V300 H0Z" fill="var(--hill-near)"/>
 <g fill="#fff" opacity=".55" class="fog"><ellipse cx="90" cy="222" rx="120" ry="9"/><ellipse cx="300" cy="214" rx="140" ry="8"/></g>
</g>
<g class="layer" data-layer="orchard">
 <path d="M0 196 H400 V300 H0Z" fill="var(--valley)"/>
 ${orchard}
 <g transform="translate(262 262)"><rect x="-26" y="-22" width="52" height="22" fill="var(--stand)" stroke="var(--ink)" stroke-width="1.2"/><path d="M-32 -22 L0 -38 L32 -22Z" fill="var(--ember)" stroke="var(--ink)" stroke-width="1.2"/>
 <circle cx="-14" cy="4" r="7" fill="var(--pumpkin)"/><circle cx="2" cy="6" r="6" fill="var(--pumpkin)"/><circle cx="16" cy="5" r="7.5" fill="var(--pumpkin)"/></g>
</g>
<g class="layer" data-layer="granite">
 <path d="M0 250 L0 200 C30 170 60 150 90 160 C110 120 150 110 170 150 C190 170 210 180 240 176 C250 130 262 104 290 100 L292 150 C320 150 360 170 400 180 V300 H0Z" fill="var(--granite-rock)"/>
 <path d="M90 160 C110 120 150 110 170 150" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>
 <path d="M262 108 C270 102 282 100 290 100 L292 150" stroke="#fff" stroke-width="2" fill="none" opacity=".45"/>
 ${[86, 110, 300, 322, 346].map((x, i) => `<path d="M${x} ${262 - 40 - i * 3} l-10 22 h6 l-9 18 h7 l-8 16 h28 l-8 -16 h7 l-9 -18 h6z" fill="var(--pine)"/>`).join('')}
</g>
<g class="layer" data-layer="lake">
 <path d="M0 206 H400 V300 H0Z" fill="url(#lakeg)"/>
 <path d="M120 206 C140 196 170 194 190 206Z" fill="var(--island-dark)"/><path d="M230 206 C250 198 290 197 312 206Z" fill="var(--island-light)"/>
 ${[92, 122, 148, 256, 284, 312].map((x, i) => {
   const h = [58, 40, 70, 50, 76, 44][i];
   return `<path d="M${x - 12} 262 C${x - 14} ${262 - h * 0.5} ${x - 6} ${262 - h * 0.6} ${x - 8} ${262 - h * 0.8} C${x - 6} ${262 - h} ${x + 6} ${262 - h} ${x + 6} ${262 - h * 0.8} C${x + 10} ${262 - h * 0.6} ${x + 8} ${262 - h * 0.4} ${x + 12} 262Z" fill="var(--tufa)"/>`;
 }).join('')}
 <g stroke="var(--ink)" stroke-width="1.3" fill="none" opacity=".6"><path d="M200 150 q5-5 10 0 q5-5 10 0"/><path d="M236 166 q4-4 8 0 q4-4 8 0"/></g>
</g>
<g class="layer" data-layer="aspen">
 <path d="M0 230 C100 216 200 236 300 224 C340 220 370 226 400 222 V300 H0Z" fill="var(--meadow)"/>
 ${aspens}
 <path d="M0 280 C80 270 140 288 220 276 C300 266 350 282 400 272 V300 H0Z" fill="var(--creek)" opacity=".85"/>
</g>
<g class="layer" data-layer="night">
 <path d="M0 236 L60 200 L110 220 L170 180 L230 214 L290 190 L350 218 L400 204 V300 H0Z" fill="var(--night-ridge)"/>
 <g transform="translate(214 236)"><path d="M-30 0 L0 -26 L30 0Z" fill="var(--night-cabin)"/><rect x="-24" y="0" width="48" height="26" fill="var(--night-cabin)"/>
 <rect x="-12" y="6" width="10" height="9" fill="#FFCB6B" class="window"/><rect x="4" y="6" width="10" height="9" fill="#FFCB6B" class="window"/>
 <rect x="16" y="-22" width="6" height="12" fill="var(--night-cabin)"/></g>
 <g fill="var(--night-ridge)">${[40, 64, 330, 360].map((x) => `<path d="M${x} 222 l-9 22 h5 l-8 16 h24 l-8 -16 h5z"/>`).join('')}</g>
</g>
<g class="layer" data-layer="west">
 <path d="M0 220 C80 206 160 214 240 204 C300 196 350 206 400 200 V300 H0Z" fill="var(--hill-far)"/>
 <path d="M0 246 C90 232 170 250 260 238 C320 230 360 240 400 236 V300 H0Z" fill="var(--hill-near)"/>
</g>

<g id="road"><path d="M0 286 H400" stroke="var(--road)" stroke-width="16"/><path d="M0 286 H400" stroke="var(--road-line)" stroke-width="1.6" stroke-dasharray="10 12"/></g>
</g>
<use href="#world" transform="scale(-1 1)"/><use href="#world" transform="translate(800 0) scale(-1 1)"/>
<g id="car"><g transform="translate(-22 -18)">
 <rect x="2" y="8" width="44" height="12" rx="4" fill="var(--car)"/><path d="M10 8 L16 0 H34 L40 8Z" fill="var(--car)"/>
 <path d="M18 2 H25 V8 H13Z M27 2 H33 L37 8 H27Z" fill="#cfe6f2"/>
 <circle cx="13" cy="21" r="4.4" fill="#2b2a26"/><circle cx="36" cy="21" r="4.4" fill="#2b2a26"/>
 <rect x="10" y="-4" width="26" height="4" rx="1.5" fill="var(--bark)"/></g></g>
</svg>`;
}

// Chapter targets. sky0/sky1: gradient; sun: [x,y] in scene units (y>300 hides);
// stars: 0..1; far: mountain fill; gold: aspen crown gold-ness 0..1; car: 0..1.
export const CHAPTER_LOOKS = {
  home:    { sky0: '#F7D9A8', sky1: '#FBEFD9', sun: [120, 176], stars: 0, far: '#B9B7C9', layer: 'home', gold: 0.2, car: 0.06 },
  orchard: { sky0: '#8FC3E3', sky1: '#F6E7BE', sun: [150, 64], stars: 0, far: '#A9B8C8', layer: 'orchard', gold: 0.3, car: 0.2 },
  granite: { sky0: '#4F95D0', sky1: '#CFE6F2', sun: [210, 46], stars: 0, far: '#8FA6BA', layer: 'granite', gold: 0.4, car: 0.36 },
  lake:    { sky0: '#6FA6CF', sky1: '#F4D9B0', sun: [272, 84], stars: 0, far: '#8E97AE', layer: 'lake', gold: 0.5, car: 0.52 },
  aspen:   { sky0: '#8CC4E6', sky1: '#FFF1C9', sun: [130, 56], stars: 0, far: '#97A9BA', layer: 'aspen', gold: 1, car: 0.68 },
  night:   { sky0: '#0B1026', sky1: '#27305A', sun: [200, 360], stars: 1, far: '#1B2140', layer: 'night', gold: 1, car: 0.8 },
  west:    { sky0: '#F4A259', sky1: '#FBD9A0', sun: [276, 186], stars: 0, far: '#B48C8C', layer: 'west', gold: 1, car: 0.97 },
};

export function mountStory(root, chapters, { onChapter } = {}) {
  const stage = root.querySelector('.story-stage');
  stage.innerHTML = sceneSVG();
  const svg = stage.querySelector('svg');
  const q = (s) => svg.querySelector(s);
  const sky0 = q('#sky0'), sky1 = q('#sky1'), sun = q('#sun'), stars = q('#stars'), far = q('#far'), car = q('#car'), snow = q('#snowcaps');
  const layers = Object.fromEntries(LAYERS.map((id) => [id, svg.querySelector(`[data-layer="${id}"]`)]));
  const crowns = [...svg.querySelectorAll('.crown')];
  const steps = [...root.querySelectorAll('.story-step')];
  const looks = chapters.map((c) => CHAPTER_LOOKS[c.look]);
  const green = '#8DB255';
  const golds = ['#F2C14E', '#F4D56A', '#E58A2B', '#F2C14E'];

  function render(pos) {
    // pos is a float chapter index.
    const i = Math.max(0, Math.min(looks.length - 1, Math.floor(pos)));
    const j = Math.min(looks.length - 1, i + 1);
    const t = smooth(Math.max(0, Math.min(1, pos - i)));
    const A = looks[i], B = looks[j];
    sky0.setAttribute('stop-color', mix(A.sky0, B.sky0, t));
    sky1.setAttribute('stop-color', mix(A.sky1, B.sky1, t));
    far.setAttribute('fill', mix(A.far, B.far, t));
    const sx = lerp(A.sun[0], B.sun[0], t), sy = lerp(A.sun[1], B.sun[1], t);
    sun.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`);
    stars.setAttribute('opacity', lerp(A.stars, B.stars, t).toFixed(3));
    snow.setAttribute('opacity', (0.85 * (1 - lerp(A.stars, B.stars, t) * 0.7)).toFixed(2));
    for (const id of LAYERS) {
      const a = A.layer === id ? 1 - t : 0;
      const b = B.layer === id ? t : 0;
      const o = i === j ? (A.layer === id ? 1 : 0) : a + b;
      const el = layers[id];
      el.setAttribute('opacity', o.toFixed(3));
      el.setAttribute('transform', `translate(0 ${((1 - o) * 26).toFixed(1)})`);
      el.style.display = o < 0.01 ? 'none' : '';
    }
    const g = lerp(A.gold, B.gold, t);
    crowns.forEach((c, n) => {
      const k = Math.min(1, Math.max(0, g * 1.25 - +c.dataset.k * 0.25));
      c.setAttribute('fill', mix(green, golds[n % golds.length], k));
    });
    const cx = 96 + lerp(A.car, B.car, t) * 208; // stays inside the phone crop
    car.setAttribute('transform', `translate(${cx.toFixed(1)} 280)`);
  }

  // Wide screens: widen the viewBox (mirrored terrain fills the sides) so the
  // whole sky-to-road height always shows. Narrow screens: crop the sides.
  function fit() {
    const r = svg.getBoundingClientRect();
    const A = r.width / Math.max(1, r.height);
    if (A > 4 / 3) {
      const W = Math.min(1200, 300 * A);
      svg.setAttribute('viewBox', `${(200 - W / 2).toFixed(1)} 0 ${W.toFixed(1)} 300`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    } else {
      svg.setAttribute('viewBox', '0 0 400 300');
      svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    }
  }
  fit();

  let current = -1;
  let ticking = false;
  function measure() {
    ticking = false;
    const vh = window.innerHeight;
    const mid = vh * 0.55;
    let pos = 0;
    for (let k = 0; k < steps.length; k++) {
      const r = steps[k].getBoundingClientRect();
      const center = r.top + r.height / 2;
      if (center <= mid) pos = k;
      if (center > mid && k > 0) {
        const prev = steps[k - 1].getBoundingClientRect();
        const pc = prev.top + prev.height / 2;
        pos = k - 1 + Math.max(0, Math.min(1, (mid - pc) / (center - pc)));
        break;
      }
    }
    const snapped = Math.round(pos);
    if (reducedMotion()) pos = snapped;
    render(pos);
    if (snapped !== current) {
      current = snapped;
      steps.forEach((s, k) => s.classList.toggle('active', k === snapped));
      onChapter && onChapter(chapters[snapped], snapped);
    }
  }
  const onResize = () => { fit(); onScroll(); };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(measure);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  measure();
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}

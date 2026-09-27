// Real terrain for the route map: fetch Terrarium elevation tiles (AWS Open
// Data, public domain / various open licenses, see research-notes), build an
// elevation grid, and trace contour lines with d3-contour.
//
//   node scripts/topo.mjs            → art/topo/*.json (+ previews in art/.out/)
//
// Output coordinates are rotated so EAST IS UP (the route runs bottom → top on
// a phone): x = north→south across the width, y = east→west down the height.
// A small JSON of projected stop positions is written alongside, so the app
// can place labels and the route on the same coordinate system.
import { contours } from 'd3-contour';
import { PNG } from 'pngjs';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';

const OUT = 'art/topo';
const CACHE = 'art/.out/tiles';
mkdirSync(OUT, { recursive: true });
mkdirSync(CACHE, { recursive: true });

// Stops (lat, lon). "home" is a generic Bay Area point, not an address.
export const STOPS = {
  bayarea: [37.45, -122.0],
  oakdale: [37.767, -120.847],
  groveland: [37.839, -120.232],
  craneflat: [37.753, -119.801],
  olmsted: [37.811, -119.486],
  tenaya: [37.829, -119.456],
  tuolumne: [37.873, -119.358],
  tioga: [37.911, -119.258],
  leevining: [37.957, -119.122],
  monolake: [38.01, -119.02],
  southtufa: [37.938, -119.027],
  lundy: [38.027, -119.24],
  conway: [38.087, -119.185],
  junelake: [37.781, -119.075],
  mammoth: [37.648, -118.972],
  convict: [37.593, -118.853],
  hotcreek: [37.661, -118.826],
  bishopcreek: [37.24, -118.6],
};

function lon2tile(lon, z) { return ((lon + 180) / 360) * 2 ** z; }
function lat2tile(lat, z) { const r = (lat * Math.PI) / 180; return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z; }

async function tile(z, x, y) {
  const f = `${CACHE}/${z}-${x}-${y}.png`;
  let buf;
  if (existsSync(f)) buf = readFileSync(f);
  else {
    const r = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`);
    if (!r.ok) throw new Error(`tile ${z}/${x}/${y}: ${r.status}`);
    buf = Buffer.from(await r.arrayBuffer());
    writeFileSync(f, buf);
  }
  return PNG.sync.read(buf);
}

async function region(name, { west, east, south, north, z, W, levels, simplify = 0.6 }) {
  const x0 = Math.floor(lon2tile(west, z)), x1 = Math.floor(lon2tile(east, z));
  const y0 = Math.floor(lat2tile(north, z)), y1 = Math.floor(lat2tile(south, z));
  const tiles = new Map();
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) tiles.set(`${x},${y}`, await tile(z, x, y));
  const elev = (lat, lon) => {
    const fx = lon2tile(lon, z), fy = lat2tile(lat, z);
    const tx = Math.floor(fx), ty = Math.floor(fy);
    const t = tiles.get(`${tx},${ty}`);
    const px = Math.min(255, Math.floor((fx - tx) * 256)), py = Math.min(255, Math.floor((fy - ty) * 256));
    const i = (py * 256 + px) * 4;
    return t.data[i] * 256 + t.data[i + 1] + t.data[i + 2] / 256 - 32768;
  };
  // East-up grid: columns run north→south (x), rows run east→west (y).
  const kx = Math.cos((((north + south) / 2) * Math.PI) / 180);
  const latSpan = north - south, lonSpan = (east - west) * kx;
  const H = Math.round((W * lonSpan) / latSpan);
  const values = new Float64Array(W * H);
  for (let r = 0; r < H; r++) {
    const lon = east - ((r + 0.5) / H) * (east - west);
    for (let c = 0; c < W; c++) {
      const lat = north - ((c + 0.5) / W) * latSpan;
      values[r * W + c] = elev(lat, lon);
    }
  }
  const proj = ([lat, lon]) => [+(((north - lat) / latSpan) * W).toFixed(1), +(((east - lon) / (east - west)) * H).toFixed(1)];
  const gen = contours().size([W, H]).smooth(true).thresholds(levels);
  const polys = gen(values);
  // Douglas–Peucker to keep the file small.
  const dp = (pts, eps) => {
    if (pts.length < 3) return pts;
    let dmax = 0, idx = 0;
    const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
    const L = Math.hypot(bx - ax, by - ay);
    for (let i = 1; i < pts.length - 1; i++) {
      const d = L < 1e-9 ? Math.hypot(pts[i][0] - ax, pts[i][1] - ay)
        : Math.abs((by - ay) * pts[i][0] - (bx - ax) * pts[i][1] + bx * ay - by * ax) / L;
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (dmax <= eps) return [pts[0], pts[pts.length - 1]];
    return [...dp(pts.slice(0, idx + 1), eps).slice(0, -1), ...dp(pts.slice(idx), eps)];
  };
  const layers = polys.map((p) => {
    const d = p.coordinates.flatMap((poly) => poly.map((ring) => {
      const s = dp(ring, simplify);
      if (s.length < 4) return '';
      return 'M' + s.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
    })).join('');
    return { level: p.value, d };
  }).filter((l) => l.d);
  const inside = ([lat, lon]) => lat >= south && lat <= north && lon >= west && lon <= east;
  const within = Object.entries(STOPS).filter(([, v]) => inside(v));
  const stops = Object.fromEntries(within.map(([k, v]) => [k, proj(v)]));
  const stopElev = Object.fromEntries(within.map(([k, v]) => [k, Math.round(elev(...v))]));
  const json = { name, width: W, height: H, orientation: 'east-up', bounds: { west, east, south, north }, levels, layers, stops, stopElevation: stopElev };
  writeFileSync(`${OUT}/${name}.json`, JSON.stringify(json));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="100%" height="100%" fill="#f5f0e6"/>
${layers.map((l) => `<path d="${l.d}" fill="none" stroke="${l.level <= 0 ? '#4a6b7a' : '#6b5d4d'}" stroke-opacity="${l.level % 1000 === 0 ? 0.55 : 0.28}" stroke-width="${l.level % 1000 === 0 ? 0.9 : 0.5}"/>`).join('\n')}
</svg>`;
  mkdirSync("art/.out", { recursive: true });
  writeFileSync(`art/.out/${name}.preview.svg`, svg);
  console.log(`${name}: ${W}×${H}, ${layers.length} levels, ${(JSON.stringify(json).length / 1024).toFixed(0)} KB`);
}

const step = (a, b, s) => Array.from({ length: Math.floor((b - a) / s) + 1 }, (_, i) => a + i * s);

// Whole drive: the Bay to the Eastern Sierra. East is up.
await region('route', { west: -122.25, east: -118.7, south: 37.25, north: 38.2, z: 9, W: 420, levels: [0, ...step(100, 4200, 150)], simplify: 0.45 });
// Detail: Tioga Pass, Mono Basin, June Lake, Mammoth. East is up.
await region('eastside', { west: -119.55, east: -118.78, south: 37.55, north: 38.15, z: 11, W: 520, levels: step(1900, 4000, 60), simplify: 0.4 });

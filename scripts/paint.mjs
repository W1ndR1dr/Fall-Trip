// Bake the hand-painted illustrations and textures into images.
//   node scripts/paint.mjs            (needs Playwright's Chromium + Python Pillow)
// Paintings are SVG with watercolor/ink filters (art/*.mjs). Rendering them
// once to images keeps them identical on every device and costs nothing at
// runtime, which matters on an iPhone in a canyon.
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright/index.mjs');
const { textures } = await import(join(root, 'art/textures.mjs'));
const { paintings } = await import(join(root, 'art/paintings.mjs'));
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;

const tmp = join(root, 'art/.out');
await rm(tmp, { recursive: true, force: true });
await mkdir(tmp, { recursive: true });
await mkdir(join(root, 'src/img/art'), { recursive: true });
await mkdir(join(root, 'src/img/tex'), { recursive: true });

const browser = await chromium.launch();
const jobs = [];
for (const [name, [svg]] of Object.entries(textures)) jobs.push({ name, svg, dir: 'tex', scale: 1, opaque: true });
for (const [name, p] of Object.entries(paintings)) jobs.push({ name, svg: p.svg, dir: 'art', scale: p.scale || 2, opaque: false });

for (const j of jobs) {
  if (only && !only.test(j.name)) continue;
  const m = j.svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || j.svg.match(/width="([\d.]+)" height="([\d.]+)"/);
  const w = Math.round(+m[1]), h = Math.round(+m[2]);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: j.scale });
  await page.setContent(`<html><body style="margin:0;background:transparent">${j.svg.replace('<svg ', `<svg width="${w}" height="${h}" `)}</body></html>`);
  await page.waitForTimeout(80);
  const png = join(tmp, `${j.dir}-${j.name}.png`);
  await page.screenshot({ path: png, omitBackground: !j.opaque, clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  const out = join(root, 'src/img', j.dir, `${j.name}.webp`);
  execFileSync('python3', ['-c', `from PIL import Image; im=Image.open(${JSON.stringify(png)}); im.save(${JSON.stringify(out)}, 'WEBP', quality=${j.opaque ? 80 : 86}, method=6)`]);
  console.log('painted', j.dir + '/' + j.name + '.webp', `${w}x${h}@${j.scale}x`);
}
await browser.close();
await rm(tmp, { recursive: true, force: true });

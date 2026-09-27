// Offline test: load once online, let the service worker precache, then cut
// the network and visit every route. Fails loudly on any error, blank screen,
// failed font, or image that can't be served from the cache.
// Usage: node scripts/test-offline.mjs [baseUrl]
//   default: builds nothing; serves ./dist on http://localhost:4173/ itself.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const { chromium, devices } = await import(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright/index.mjs');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain' };
let server;
let base = process.argv[2];
if (!base) {
  // Serve dist under /Fall-Trip/ to mirror GitHub Pages' project subpath.
  server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!p.startsWith('/Fall-Trip/')) { res.writeHead(404).end(); return; }
    p = p.slice('/Fall-Trip'.length);
    if (p.endsWith('/')) p += 'index.html';
    const file = normalize(join('dist', p));
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(body);
    } catch { res.writeHead(404).end('not found'); }
  }).listen(4173);
  base = 'http://localhost:4173/Fall-Trip/';
}

const routes = ['/', '/plan', '/plan/fri', '/plan/sat', '/plan/sun', '/route/route-tioga', '/route/route-sonora', '/pack', '/before',
  '/explore', '/do/lundy', '/do/southtufa', '/color', '/food',
  '/kids', '/kids/hunt', '/kids/leaves', '/kids/tracks', '/kids/rocks', '/kids/sky', '/kids/games', '/kids/draw', '/kids/photos', '/kids/cozy',
  '/faith', '/faith/fri', '/faith/sat', '/faith/sun', '/faith/m-granite', '/faith/m-springs', '/faith/m-beasts', '/faith/m-trees', '/faith/m-stars', '/faith/b-lilies',
  '/faith/verse', '/faith/journal', '/faith/lookback', '/settings', '/about', '/install'];

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(base);
await page.evaluate(async () => { await navigator.serviceWorker.ready; });
await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(async () => {
  // First load: generateSW doesn't claim clients until reload.
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
});
const cached = await page.evaluate(async () => {
  let n = 0;
  for (const k of await caches.keys()) n += (await (await caches.open(k)).keys()).length;
  return n;
});
console.log('SW controlling:', await page.evaluate(() => !!navigator.serviceWorker.controller), '| cached entries:', cached);

await ctx.setOffline(true);
let failures = 0;
await page.reload(); // cold reload with no network
for (const r of routes) {
  await page.goto(base + '#' + r).catch((e) => errors.push(`${r}: ${e.message}`));
  await page.waitForTimeout(250);
  const h1 = await page.evaluate(() => (document.querySelector('main h1') || {}).textContent || '');
  if (!h1.trim()) { failures++; console.log('NO <main><h1>', r); }
  const badFonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family);
  });
  if (badFonts.length) { failures++; console.log('FONTS FAILED', r, badFonts); }
  // Every image on the page must be servable offline, including lazy ones.
  const broken = await page.evaluate(async () => {
    const srcs = [...new Set([...document.images].map((i) => i.currentSrc || i.src).filter(Boolean))];
    const bad = [];
    for (const s of srcs) { try { const res = await fetch(s); if (!res.ok) bad.push(s); } catch { bad.push(s); } }
    return bad;
  });
  if (broken.length) { failures++; console.log('BROKEN IMAGES', r, broken); }
}
// The terrain rasters (SVG <image>, not <img>) must be cached too, every theme.
const relief = await page.evaluate(async () => {
  const bad = [];
  for (const r of ['route', 'eastside']) for (const t of ['light', 'dark', 'night']) {
    const u = `img/topo/relief-${r}-${t}.webp`;
    try { if (!(await fetch(u)).ok) bad.push(u); } catch { bad.push(u); }
  }
  return bad;
});
if (relief.length) { failures++; console.log('RELIEF NOT CACHED', relief); }

// Offline persistence: a hunt find survives a reload.
await page.goto(base + '#/kids/hunt');
const item = page.locator('[data-hunt-item="aspen"]').first();
if (await item.count()) {
  await item.click();
  await page.waitForTimeout(400);
  await page.reload();
  await page.waitForTimeout(400);
  const kept = await page.locator('[data-hunt-item="aspen"]').first().getAttribute('aria-pressed');
  if (kept !== 'true') { failures++; console.log('HUNT STATE NOT PERSISTED'); }
} else {
  failures++; console.log('HUNT ITEM [data-hunt-item="aspen"] NOT FOUND');
}
await ctx.setOffline(false);
await browser.close();
server?.close();

if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
console.log(failures || errors.length ? `FAIL (${failures} failures, ${errors.length} errors)` : `PASS: ${routes.length} routes work offline, fonts load, images cached, state persists`);
process.exit(failures || errors.length ? 1 : 0);

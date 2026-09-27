// Offline test: load once online, let the service worker precache, then cut
// the network and visit every route. Fails loudly on any error or blank page.
// Usage: node scripts/test-offline.mjs [baseUrl]   (default http://localhost:5173/)
const { chromium, devices } = await import(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright/index.mjs');
const base = process.argv[2] || 'http://localhost:5173/';
const routes = ['/', '/plan', '/plan/sat', '/plan/sun', '/route/route-tioga', '/route/route-sonora', '/pack', '/before', '/explore', '/do/lundy', '/do/southtufa', '/color', '/food',
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
// Wait until the SW controls the page (clients.claim) and precache completed.
await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
const cached = await page.evaluate(async () => {
  const keys = await caches.keys();
  const c = await caches.open(keys.find((k) => k.startsWith('fall-trip-')));
  return (await c.keys()).length;
});
console.log('SW controlling:', await page.evaluate(() => !!navigator.serviceWorker.controller), '| precached files:', cached);

await ctx.setOffline(true);
let failures = 0;
await page.reload(); // cold reload with no network
for (const r of routes) {
  await page.goto(base + '#' + r).catch((e) => errors.push(`${r}: ${e.message}`));
  await page.waitForTimeout(150);
  const h1 = await page.evaluate(() => (document.querySelector('main h1') || {}).textContent || '');
  const fonts = await page.evaluate(() => document.fonts.check('16px Atkinson') && document.fonts.check('16px "Young Serif"'));
  if (!h1.trim()) { failures++; console.log('BLANK', r); }
  if (!fonts) { failures++; console.log('FONTS MISSING', r); }
}
// Offline persistence: check a hunt item and journal survive a reload.
await page.goto(base + '#/kids/hunt');
await page.click('.hunt-item[data-id="aspen"]');
await page.reload();
const kept = await page.getAttribute('.hunt-item[data-id="aspen"]', 'aria-pressed');
if (kept !== 'true') { failures++; console.log('STATE NOT PERSISTED'); }
await ctx.setOffline(false);
await browser.close();

if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
console.log(failures || errors.length ? `FAIL (${failures} failures, ${errors.length} errors)` : `PASS: ${routes.length} routes work offline, fonts load, state persists`);
process.exit(failures || errors.length ? 1 : 0);

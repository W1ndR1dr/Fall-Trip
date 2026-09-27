// Screenshot routes in every theme at iPhone and iPad sizes.
//   npm run build && npx vite preview --port 4173 --strictPort &   (or npm run dev)
//   node scripts/shoot.mjs /kids/hunt /_kit            → shots/<route>-<theme>-<device>.png
// Options (env): BASE=http://localhost:4173/  OUT=shots  THEMES=light,dark,night
//   DEVICES=phone,ipad  FULL=1 (full page)  WAIT=600 (ms after load)
//   NOW=2026-10-10T09:30:00-07:00 (preview trip time via the debugNow key)
import { mkdirSync } from 'node:fs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright/index.mjs');
const BASE = process.env.BASE || 'http://localhost:4173/';
const OUT = process.env.OUT || 'shots';
const THEMES = (process.env.THEMES || 'light,dark,night').split(',');
const DEVICES = (process.env.DEVICES || 'phone,ipad').split(',');
const WAIT = Number(process.env.WAIT || 700);
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const SIZES = { phone: { width: 390, height: 844 }, ipad: { width: 820, height: 1180 } };

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const device of DEVICES) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({
      viewport: SIZES[device],
      deviceScaleFactor: 2,
      isMobile: device === 'phone',
      hasTouch: true,
      colorScheme: theme === 'light' ? 'light' : 'dark',
      reducedMotion: 'reduce',
    });
    await ctx.addInitScript(([t, now]) => {
      localStorage.setItem('falltrip:theme', JSON.stringify(t === 'light' ? 'light' : 'dark'));
      localStorage.setItem('falltrip:nightVision', JSON.stringify(t === 'night'));
      if (now) localStorage.setItem('falltrip:debugNow', JSON.stringify(now));
    }, [theme, process.env.NOW || '']);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log('pageerror', e.message));
    page.on('console', (m) => m.type() === 'error' && console.log('console', m.text()));
    for (const r of routes) {
      await page.goto(BASE + '#' + r);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(WAIT);
      const name = `${OUT}/${(r.replace(/^\//, '').replace(/\//g, '-') || 'today')}-${theme}-${device}.png`;
      if (process.env.FULL) {
        // Pages scroll inside .page: expand it so the full page is captured.
        const h = await page.evaluate(() => document.querySelector('.frame .page')?.scrollHeight || 0);
        await page.setViewportSize({ width: SIZES[device].width, height: Math.max(SIZES[device].height, h) });
        await page.waitForTimeout(200);
      }
      await page.screenshot({ path: name });
      if (process.env.FULL) await page.setViewportSize(SIZES[device]);
      console.log('wrote', name);
    }
    await ctx.close();
  }
}
await browser.close();

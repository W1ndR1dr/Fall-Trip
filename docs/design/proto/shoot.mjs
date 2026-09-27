// Screenshots every frame at 390x844 @2x (each frame rendered alone), plus
// light/dark contact sheets. Run: node shoot.mjs [frameId]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ROOT = new URL('.', import.meta.url).pathname;
const only = process.argv[2];
const FRAMES = ['today-before', 'today-during', 'plan-sat', 'kids-hunt', 'devotion-sat'];
fs.mkdirSync(ROOT + 'shots', { recursive: true });
const b = await chromium.launch({ args: (process.env.GL || '').split(' ').filter(Boolean) });

for (const th of ['light', 'dark']) {
  for (const f of FRAMES) {
    if (only && f !== only) continue;
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: th });
    const page = await ctx.newPage();
    await page.goto(`file://${ROOT}index.html#frame=${f}-${th}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${ROOT}shots/${f}-${th}.png` });
    await ctx.close();
  }
}

if (!only) {
  const sheet = await b.newPage({ viewport: { width: 2170, height: 1010 }, deviceScaleFactor: 1 });
  const labels = ['Today · before', 'Today · during', 'Plan · Saturday', 'Kids · Leaf hunt', 'Devotions · Saturday'];
  for (const th of ['light', 'dark']) {
    const imgs = FRAMES.map((f) => 'data:image/png;base64,' + fs.readFileSync(`${ROOT}shots/${f}-${th}.png`).toString('base64'));
    await sheet.setContent(`<html><body style="margin:0;background:${th === 'dark' ? '#050403' : '#E9E2D8'};font:500 14px system-ui;color:${th === 'dark' ? '#9a8b7d' : '#6d5e50'}">
      <div style="display:flex;gap:30px;padding:40px 40px 0">${imgs.map((src, i) => `<div><img src="${src}" style="width:390px;height:844px;border-radius:44px;display:block;box-shadow:0 0 0 1px ${th === 'dark' ? 'rgba(255,230,200,.10)' : 'rgba(60,35,15,.10)'},0 30px 60px -20px rgba(0,0,0,${th === 'dark' ? '.8' : '.25'})"><div style="margin-top:18px;text-align:center;letter-spacing:.02em">${labels[i]}</div></div>`).join('')}</div></body></html>`);
    await sheet.waitForTimeout(200);
    await sheet.screenshot({ path: `${ROOT}shots/contact-${th}.png` });
  }
}
await b.close();
console.log('shots done');

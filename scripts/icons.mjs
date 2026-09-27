// Render src/icons/icon.svg to the PNG sizes iOS and the manifest need.
// Uses the preinstalled Playwright Chromium; run: node scripts/icons.mjs
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright/index.mjs');
const svg = await readFile(join(root, 'src/icons/icon.svg'), 'utf8');

const targets = [
  ['apple-touch-icon.png', 180, 1],
  ['icon-192.png', 192, 1],
  ['icon-512.png', 512, 1],
  ['icon-maskable-512.png', 512, 0.8], // leaf inside the maskable safe zone
];

const browser = await chromium.launch();
for (const [name, size, scale] of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const inner = svg.replace('<g transform="rotate(-14 256 256)">', `<g transform="translate(256 256) scale(${scale}) translate(-256 -256) rotate(-14 256 256)">`);
  await page.setContent(`<html><body style="margin:0">${inner.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: join(root, 'src/icons', name), clip: { x: 0, y: 0, width: size, height: size } });
  await page.close();
  console.log('wrote', name);
}
await browser.close();

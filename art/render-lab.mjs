import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { aspenLeaf, tufaScene } from './lab2.mjs';
import { paperSVG } from './paper.mjs';
const paper = 'data:image/svg+xml;base64,' + Buffer.from(paperSVG()).toString('base64');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 420 }, deviceScaleFactor: 2 });
await p.setContent(`<body style="margin:0;background:url('${paper}');display:flex;gap:30px;padding:20px;align-items:center">
<div style="mix-blend-mode:multiply">${aspenLeaf()}</div><div style="mix-blend-mode:multiply">${tufaScene()}</div></body>`);
await p.waitForTimeout(400);
await p.screenshot({ path: '/tmp/claude-0/-home-user-Fall-Trip/d2f1237e-ef4a-5ce9-95b8-ee6f79055070/scratchpad/lab2.png' });
await b.close();

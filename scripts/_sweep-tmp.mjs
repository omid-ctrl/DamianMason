import { chromium } from 'playwright';
import fs from 'node:fs';
const targets = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const widths = process.argv[3].split(',').map(Number);
const fn = fs.readFileSync(process.argv[4], 'utf8');
const b = await chromium.launch();
for (const w of widths) {
  const c = await b.newContext({ viewport: { width: w, height: w < 500 ? 844 : 1000 }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500, reducedMotion: 'reduce' });
  for (const t of targets) {
    const p = await c.newPage();
    await p.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.evaluate(() => document.fonts?.ready);
    await p.waitForTimeout(250);
    const out = await p.evaluate(`(${fn})()`);
    if (Array.isArray(out) ? out.length : out && Object.keys(out).length)
      console.log(`--- ${t.name} @${w}\n` + JSON.stringify(out));
    await p.close();
  }
  await c.close();
}
await b.close();

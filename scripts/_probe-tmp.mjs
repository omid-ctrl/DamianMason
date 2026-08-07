import fs from 'node:fs';
import { chromium } from 'playwright';

const url = process.argv[2];
const width = Number(process.argv[3] ?? 1440);
const fnPath = process.argv[4];
const src = fs.readFileSync(fnPath, 'utf8');

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height: 1000 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts?.ready);
await page.evaluate(async () => {
  await new Promise((r) => {
    let y = 0;
    const step = () => {
      window.scrollBy(0, window.innerHeight);
      y += window.innerHeight;
      if (y < document.body.scrollHeight + window.innerHeight) requestAnimationFrame(step);
      else { window.scrollTo(0, 0); r(); }
    };
    step();
  });
});
await page.waitForTimeout(500);
const out = await page.evaluate(`(${src.trim().replace(/;+$/, '')})()`);
console.log(JSON.stringify(out, null, 1));
await browser.close();

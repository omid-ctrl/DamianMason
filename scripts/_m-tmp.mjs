/* Ad-hoc measurement probe. node probe.mjs <url> <width> <expr-file> */
import { chromium } from 'playwright';
import fs from 'node:fs';

const [url, widthStr, exprFile, shotPath, clipSel] = process.argv.slice(2);
const width = Number(widthStr);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height: width < 500 ? 844 : 1000 },
  deviceScaleFactor: 2,
  isMobile: width < 500,
  hasTouch: width < 500,
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
await page.evaluate(() => document.fonts?.ready);
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = () => {
      window.scrollBy(0, window.innerHeight);
      y += window.innerHeight;
      if (y < document.body.scrollHeight + window.innerHeight) requestAnimationFrame(step);
      else { window.scrollTo(0, 0); resolve(); }
    };
    step();
  });
});
await page.waitForTimeout(600);

if (exprFile && exprFile !== '-') {
  const fn = fs.readFileSync(exprFile, 'utf8');
  const out = await page.evaluate(`(${fn})()`);
  console.log(JSON.stringify(out, null, 2));
}
if (shotPath && shotPath !== '-') {
  if (clipSel) {
    const el = await page.$(clipSel);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await el.screenshot({ path: shotPath });
  } else {
    await page.screenshot({ path: shotPath, fullPage: true });
  }
}
await browser.close();

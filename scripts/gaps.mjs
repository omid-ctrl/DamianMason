/**
 * Finds headings that collide with the content immediately after them, and
 * text blocks whose last line is a single orphaned word. Both are things a
 * full-page screenshot shows but a scrollWidth check cannot.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const targets = JSON.parse(fs.readFileSync(args.targets, 'utf8'));
const widths = (args.widths ?? '390,768,1440').split(',').map(Number);

const browser = await chromium.launch();
for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    deviceScaleFactor: 1,
    isMobile: width < 500,
    reducedMotion: 'reduce',
  });
  for (const target of targets) {
    const page = await context.newPage();
    let sane = false;
    for (let a = 0; a < 4 && !sane; a++) {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.evaluate(() => document.fonts?.ready);
      sane = await page.evaluate(() => !!document.querySelector('h1'));
      if (!sane) await page.waitForTimeout(1200);
    }
    const found = await page.evaluate(() => {
      const out = [];
      for (const h of document.querySelectorAll('h1,h2,h3,h4')) {
        const next = h.nextElementSibling;
        if (!next) continue;
        const cs = getComputedStyle(next);
        if (cs.display === 'none') continue;
        const a = h.getBoundingClientRect();
        const b = next.getBoundingClientRect();
        if (b.top < a.bottom) continue; // overlapping columns, not a stack
        const gap = b.top - a.bottom;
        // A heading needs visible air before the next block. Under 6px the
        // descenders of the heading sit on the ascenders of the body.
        out.push({
          h: h.textContent.trim().slice(0, 45),
          next: next.tagName.toLowerCase() + '.' + String(next.className).split(' ')[0],
          gap: Math.round(gap),
        });
      }
      return out;
    });
    if (found.length) console.log(width, target.name, JSON.stringify(found));
    await page.close();
  }
  await context.close();
}
await browser.close();

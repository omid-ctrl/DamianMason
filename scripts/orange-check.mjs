/**
 * Orange budget compliance check.
 *
 *   node scripts/orange-check.mjs [--base http://localhost:3100] [--width 1440]
 *
 * The rule (DESIGN_SYSTEM.md section 5.1): at most ONE filled-orange field may
 * be visible in any single viewport. A "field" is an element painting
 * background-color #FF5325 = rgb(255,83,37) at or above 24x16, which is the
 * size at which orange stops reading as a rule or a glyph and starts reading as
 * a button. Orange used as TEXT ink (--ink-accent, #A8330E on bone) is excluded
 * by design: it is a different token doing a different job.
 *
 * Counts the FIRST VIEWPORT at scroll position 0, and separately reports the
 * worst window found while scrolling, since the masthead is sticky and travels.
 */
import { chromium } from 'playwright';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const BASE = args.base ?? 'http://localhost:3100';
const WIDTH = Number(args.width ?? 1440);

const ROUTES = (args.routes ?? '/,/about/,/keynote/,/reviews/,/contact-us/').split(',');

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});

const ORANGE = 'rgb(255, 83, 37)';
let worstFirst = 0;
const rows = [];

for (const route of ROUTES) {
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60_000 });
  // Guard against a cold dev compile serving an unstyled first paint, which
  // reports zero orange on a page full of it.
  await page.waitForFunction(
    () => getComputedStyle(document.documentElement)
      .getPropertyValue('--brand-orange').trim().length > 0,
    { timeout: 30_000 },
  );
  await page.evaluate(() => document.fonts?.ready);

  const scan = await page.evaluate((ORANGE) => {
    const inView = (r) => r.bottom > 0 && r.top < window.innerHeight &&
      r.right > 0 && r.left < window.innerWidth && r.width > 0 && r.height > 0;
    const fields = [];
    const other = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.1) continue;
      const r = el.getBoundingClientRect();
      if (!inView(r)) continue;
      const label = el.tagName.toLowerCase() +
        (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') +
        ' :: "' + (el.textContent || '').trim().slice(0, 40) + '"' +
        ' [' + Math.round(r.width) + 'x' + Math.round(r.height) + ']';
      if (cs.backgroundColor === ORANGE) {
        if (r.width >= 24 && r.height >= 16) fields.push(label);
        else other.push('bar ' + label);
      }
      if (cs.borderColor?.includes(ORANGE) && parseFloat(cs.borderTopWidth) + parseFloat(cs.borderLeftWidth) > 0) {
        other.push('border ' + label);
      }
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (hasText && cs.color === ORANGE) other.push('text-ink ' + label);
      if (el instanceof SVGElement && (cs.fill === ORANGE || cs.stroke === ORANGE)) other.push('svg ' + label);
    }
    return { fields, other };
  }, ORANGE);

  // Worst window across the whole page, third-of-viewport steps.
  const worst = await page.evaluate((ORANGE) => {
    const step = Math.round(window.innerHeight / 3);
    let max = 0; let at = 0;
    const total = document.body.scrollHeight;
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y);
      let n = 0;
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (cs.backgroundColor !== ORANGE) continue;
        if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.1) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight && r.width >= 24 && r.height >= 16) n++;
      }
      if (n > max) { max = n; at = y; }
    }
    window.scrollTo(0, 0);
    return { max, at };
  }, ORANGE);

  worstFirst = Math.max(worstFirst, scan.fields.length);
  rows.push({ route, firstViewportFields: scan.fields.length, worstAnyViewport: worst.max, worstAtY: worst.at, fields: scan.fields, other: scan.other });

  console.log(`${route.padEnd(30)} firstViewport:${scan.fields.length}  worstWindow:${worst.max} (y=${worst.at})  otherOrange:${scan.other.length}`);
  for (const f of scan.fields) console.log('    FIELD  ' + f);
  for (const o of scan.other) console.log('    -      ' + o);
  await page.close();
}

await browser.close();
const over = rows.filter((r) => r.firstViewportFields > 1 || r.worstAnyViewport > 1);
console.log(`\nRoutes over budget: ${over.length}`);
for (const o of over) console.log('  ' + o.route + ' first=' + o.firstViewportFields + ' worst=' + o.worstAnyViewport);
process.exit(over.length ? 1 : 0);

/**
 * Exercises the three things a static full-page screenshot cannot reach: the
 * mobile menu sheet, an opened FAQ answer, and the newsletter form. Each is
 * captured and measured for overflow and target size in its OPEN state.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const outDir = args.out;
const widths = (args.widths ?? '390,768,1440').split(',').map(Number);
fs.mkdirSync(outDir, { recursive: true });

const overflowIn = (page, w) =>
  page.evaluate((vw) => {
    const noise = /sr-only|honeypot/;
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const cls = typeof el.className === 'string' ? el.className : '';
      if (noise.test(cls) || noise.test(el.id || '')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        out.push({ sel: el.tagName.toLowerCase() + '.' + String(cls).split(' ')[0], right: Math.round(r.right), left: Math.round(r.left) });
      }
      if (el.scrollWidth - el.clientWidth > 2 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') {
        out.push({ sel: el.tagName.toLowerCase() + '.' + String(cls).split(' ')[0], clippedBy: el.scrollWidth - el.clientWidth, text: (el.textContent || '').trim().slice(0, 50) });
      }
    }
    return {
      doc: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      offenders: out.slice(0, 12),
    };
  }, w);

const smallTargets = (page, scope) =>
  page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return null;
    return [...root.querySelectorAll('a,button,input,select,textarea,summary')]
      .filter((el) => {
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && !/honeypot/.test(el.id || '');
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { t: (el.textContent || el.getAttribute('aria-label') || el.id || '').trim().slice(0, 32), w: Math.round(r.width), h: Math.round(r.height) };
      })
      .filter((x) => (x.w > 0 || x.h > 0) && (x.w < 44 || x.h < 44));
  }, scope);

const browser = await chromium.launch();
const report = [];

/** The dev-server overlay injects its own 32px button and a portal element.
 *  Neither ships, so neither may show up in a screenshot or a target census. */
const HIDE_DEV_OVERLAY = 'nextjs-portal { display: none !important; }';

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    deviceScaleFactor: 1,
    isMobile: width < 500,
    hasTouch: width < 500,
    reducedMotion: 'reduce',
  });

  // ---- 1. mobile menu sheet -------------------------------------------------
  {
    const page = await context.newPage();
    await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
    const toggle = page.locator('button.dm-masthead__menu').first();
    if (await toggle.count()) {
      // A dev-server recompile can leave the bar unstyled for a moment, which
      // reads as "not visible" and fails the click for no real reason.
      // The sheet only exists below 1280: at desktop the trigger is display:none
      // and there is nothing to open. That is correct, not a failure.
      if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outDir, `menu-open-${width}.png`) });
      report.push({ case: 'mobile-menu', width, overflow: await overflowIn(page, width), smallTargets: await smallTargets(page, '.dm-menu, .dm-masthead') });
      }
    }
    await page.close();
  }

  // ---- 2. FAQ, every answer open -------------------------------------------
  {
    const page = await context.newPage();
    await page.goto('http://localhost:3100/meeting-coordinators/', { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
    await page.evaluate(() => document.querySelectorAll('details.dm-faq__item').forEach((d) => (d.open = true)));
    await page.waitForTimeout(300);
    const box = await page.locator('.dm-faq').first().boundingBox();
    if (box) {
      await page.screenshot({ path: path.join(outDir, `faq-open-${width}.png`), clip: { x: 0, y: box.y, width, height: Math.min(box.height, 2600) }, fullPage: true });
    }
    report.push({ case: 'faq-open', width, overflow: await overflowIn(page, width), smallTargets: await smallTargets(page, '.dm-faq') });
    await page.close();
  }

  // ---- 3. newsletter form ---------------------------------------------------
  {
    const page = await context.newPage();
    await page.goto('http://localhost:3100/join-the-conversation/', { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
    const box = await page.locator('.dm-form').first().boundingBox();
    if (box) {
      await page.evaluate((y) => window.scrollTo(0, y - 60), box.y);
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(outDir, `form-${width}.png`), clip: { x: 0, y: box.y - 40, width, height: Math.min(box.height + 90, 1500) }, fullPage: true });
    }
    report.push({ case: 'newsletter-form', width, overflow: await overflowIn(page, width), smallTargets: await smallTargets(page, '.dm-form') });
    await page.close();
  }

  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, 'interactive.json'), JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(
    `${String(r.width).padStart(4)} ${r.case.padEnd(16)} docOverflow:${r.overflow.doc} offenders:${r.overflow.offenders.length} smallTargets:${r.smallTargets ? r.smallTargets.length : 'n/a'}`,
  );
  for (const o of r.overflow.offenders) console.log('        ', JSON.stringify(o));
  for (const s of r.smallTargets ?? []) console.log('      TAP', JSON.stringify(s));
}

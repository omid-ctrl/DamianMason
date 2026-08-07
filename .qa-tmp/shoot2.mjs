import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = '/Users/omidebrahimi/Desktop/Projects/DamianMason/docs/qa/screenshots/round-1-mobile';
const BASE = 'http://localhost:3100';

const ROUTES = [
  ['01-home', '/'], ['02-about', '/about/'], ['03-speaking', '/speaking/'],
  ['04-keynote', '/keynote/'], ['05-reviews', '/reviews/'],
  ['06-meeting-coordinators', '/meeting-coordinators/'],
  ['07-collaboration-opportunities', '/collaboration-opportunities/'],
  ['08-boasg', '/boasg/'], ['09-podcasts', '/podcasts/'],
  ['10-the-business-of-agriculture', '/the-business-of-agriculture/'],
  ['11-do-business-better-podcast', '/do-business-better-podcast/'],
  ['12-xtreme-ag', '/xtreme-ag/'], ['13-blog-news', '/blog-news/'],
  ['14-acres-tv', '/acres-tv/'], ['15-blog', '/blog/'],
  ['16-contact-us', '/contact-us/'], ['17-join-the-conversation', '/join-the-conversation/'],
  ['18-post-eggflation', '/blog/eggflation-gives-producers-record-profits/'],
  ['19-post-climate', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],
];

const WIDTHS = [
  { w: 390, h: 844, scale: 2 },
  { w: 768, h: 1024, scale: 1.5 },
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

for (const cfg of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width: cfg.w, height: cfg.h },
    deviceScaleFactor: cfg.scale,
    isMobile: cfg.w < 700, hasTouch: true,
  });
  const page = await ctx.newPage();

  for (const [slug, route] of ROUTES) {
    let ok = false;
    for (let a = 0; a < 8 && !ok; a++) {
      try { await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 }); ok = true; }
      catch (e) { await page.waitForTimeout(3000); }
    }
    if (!ok) { console.log('FAILED', slug); continue; }
    await page.waitForTimeout(400);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const n = Math.ceil(H / cfg.h);
    for (let i = 0; i < n; i++) {
      const y = i * cfg.h;
      await page.evaluate(v => window.scrollTo(0, v), y);
      // release any reveal still armed at this scroll position, then settle
      await page.waitForTimeout(300);
      await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.setAttribute('data-reveal-state', 'shown')));
      await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(OUT, `${slug}-${cfg.w}-t${String(i + 1).padStart(2, '0')}.png`) });
    }
    console.log(`${slug} ${cfg.w} h=${H} tiles=${n}`);
  }

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('button[aria-label*="enu" i], button:has-text("Menu")').first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `00-navsheet-${cfg.w}.png`) });
  await page.evaluate(() => { const m = document.querySelector('.dm-menu'); if (m) m.scrollTop = m.scrollHeight; });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `00-navsheet-bottom-${cfg.w}.png`) });
  await ctx.close();
}
await browser.close();

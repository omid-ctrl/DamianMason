import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = '/Users/omidebrahimi/Desktop/Projects/DamianMason/docs/qa/screenshots/round-1-mobile';
const BASE = 'http://localhost:3100';

const ROUTES = [
  ['01-home', '/'],
  ['02-about', '/about/'],
  ['03-speaking', '/speaking/'],
  ['04-keynote', '/keynote/'],
  ['05-reviews', '/reviews/'],
  ['06-meeting-coordinators', '/meeting-coordinators/'],
  ['07-collaboration-opportunities', '/collaboration-opportunities/'],
  ['08-boasg', '/boasg/'],
  ['09-podcasts', '/podcasts/'],
  ['10-the-business-of-agriculture', '/the-business-of-agriculture/'],
  ['11-do-business-better-podcast', '/do-business-better-podcast/'],
  ['12-xtreme-ag', '/xtreme-ag/'],
  ['13-blog-news', '/blog-news/'],
  ['14-acres-tv', '/acres-tv/'],
  ['15-blog', '/blog/'],
  ['16-contact-us', '/contact-us/'],
  ['17-join-the-conversation', '/join-the-conversation/'],
  ['18-post-eggflation', '/blog/eggflation-gives-producers-record-profits/'],
  ['19-post-climate', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],
];

const WIDTHS = [
  { w: 390, h: 844, scale: 2, tile: 844 },
  { w: 768, h: 1024, scale: 1.5, tile: 1024 },
];

fs.mkdirSync(OUT, { recursive: true });
const heights = {};

const browser = await chromium.launch();

for (const cfg of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width: cfg.w, height: cfg.h },
    deviceScaleFactor: cfg.scale,
    isMobile: cfg.w < 700,
    hasTouch: true,
    userAgent: cfg.w < 700
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('REQFAIL ' + r.url()));

  for (const [slug, route] of ROUTES) {
    if (fs.existsSync(path.join(OUT, `${slug}-${cfg.w}-t01.png`))) { console.log('skip', slug, cfg.w); continue; }
    let ok = false;
    for (let a = 0; a < 8 && !ok; a++) {
      try { await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 }); ok = true; }
      catch (e) { console.log('retry', slug, a, e.message.slice(0, 60)); await page.waitForTimeout(4000); }
    }
    if (!ok) { console.log('FAILED', slug); continue; }
    // force lazy images
    await page.evaluate(async () => {
      await new Promise(r => {
        let y = 0;
        const step = () => {
          window.scrollTo(0, y);
          y += 600;
          if (y < document.body.scrollHeight) setTimeout(step, 30);
          else { window.scrollTo(0, 0); setTimeout(r, 400); }
        };
        step();
      });
    });
    await page.waitForTimeout(500);
    // The reveal observer can be raced by a programmatic scroll. Force every
    // target to its final shown state so no tile is falsely blank.
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => { el.setAttribute('data-reveal-state', 'shown'); });
    });
    await page.waitForTimeout(700);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    heights[`${slug}-${cfg.w}`] = H;
    const n = Math.ceil(H / cfg.tile);
    for (let i = 0; i < n; i++) {
      const y = i * cfg.tile;
      const h = Math.min(cfg.tile, H - y);
      if (h < 40) continue;
      await page.screenshot({
        path: path.join(OUT, `${slug}-${cfg.w}-t${String(i + 1).padStart(2, '0')}.png`),
        fullPage: true,
        clip: { x: 0, y, width: cfg.w, height: h },
      });
    }
    console.log(`${slug} ${cfg.w} h=${H} tiles=${n} errors=${errors.length}`);
    errors.length = 0;
  }

  // nav sheet open
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const trig = page.locator('button[aria-label*="enu" i], button:has-text("Menu")').first();
  await trig.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, `00-navsheet-${cfg.w}.png`) });
  const menuScroll = await page.evaluate(() => {
    const m = document.querySelector('.dm-menu');
    if (!m) return null;
    return { scrollHeight: m.scrollHeight, clientHeight: m.clientHeight };
  });
  console.log('navsheet', cfg.w, JSON.stringify(menuScroll));
  await page.evaluate(() => { const m = document.querySelector('.dm-menu'); if (m) m.scrollTop = m.scrollHeight; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `00-navsheet-bottom-${cfg.w}.png`) });

  await ctx.close();
}

fs.writeFileSync('/private/tmp/claude-501/-Users-omidebrahimi-Desktop-Projects-DamianMason/f31ff1f7-a7ba-41b5-898b-561b9ce2cbed/scratchpad/heights.json', JSON.stringify(heights, null, 2));
console.log(JSON.stringify(heights, null, 2));
await browser.close();

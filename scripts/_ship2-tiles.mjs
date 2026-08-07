/**
 * Ship-2 desktop presentation pass: tile every route into readable slices.
 * Temp tooling, writes to /tmp only.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, x, i, arr) => {
    if (x.startsWith('--')) a.push([x.slice(2), arr[i + 1]]);
    return a;
  }, []),
);

const W = +args.w || 1440;
const TILE = +args.tile || 1500;
const OUT = args.out || '/tmp/ship2-desktop';
const BASE = 'http://localhost:3100';

const ROUTES = [
  ['home', '/'],
  ['about', '/about/'],
  ['acres-tv', '/acres-tv/'],
  ['blog', '/blog/'],
  ['blog-news', '/blog-news/'],
  ['boasg', '/boasg/'],
  ['collaboration', '/collaboration-opportunities/'],
  ['contact-us', '/contact-us/'],
  ['dbb-podcast', '/do-business-better-podcast/'],
  ['join', '/join-the-conversation/'],
  ['keynote', '/keynote/'],
  ['meeting-coordinators', '/meeting-coordinators/'],
  ['podcasts', '/podcasts/'],
  ['reviews', '/reviews/'],
  ['speaking', '/speaking/'],
  ['boa', '/the-business-of-agriculture/'],
  ['xtreme-ag', '/xtreme-ag/'],
  ['post-eggflation', '/blog/eggflation-gives-producers-record-profits/'],
  ['post-climate', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],
];

mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: W, height: TILE },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const p = await ctx.newPage();
await p.route('**/*', (r) => {
  const u = new URL(r.request().url());
  const ok = u.hostname === 'localhost' || u.hostname.endsWith('ytimg.com');
  return ok ? r.continue() : r.abort();
});

const report = [];
for (const [name, route] of ROUTES) {
  await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(500);
  // trigger every reveal
  await p.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(700);
  const height = await p.evaluate(() => document.documentElement.scrollHeight);
  const tiles = Math.ceil(height / TILE);
  for (let i = 0; i < tiles; i++) {
    const y = Math.min(i * TILE, Math.max(0, height - TILE));
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(220);
    await p.screenshot({
      path: `${OUT}/${name}-${W}-${String(i + 1).padStart(2, '0')}.png`,
    });
  }
  report.push({ name, route, height, tiles });
  console.log(name, W, height, tiles);
}
await b.close();
console.log(JSON.stringify(report));

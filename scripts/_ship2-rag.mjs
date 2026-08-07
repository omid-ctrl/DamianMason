/** Ship-2: extract per-line text of every H1/H2 at several widths, to find rags,
 *  widows, orphans and bad breaks in display type. Temp tooling. */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3100';
const WIDTHS = [1024, 1200, 1280, 1380, 1440];
const ROUTES = [
  '/', '/about/', '/acres-tv/', '/blog/', '/blog-news/', '/boasg/',
  '/collaboration-opportunities/', '/contact-us/', '/do-business-better-podcast/',
  '/join-the-conversation/', '/keynote/', '/meeting-coordinators/', '/podcasts/',
  '/reviews/', '/speaking/', '/the-business-of-agriculture/', '/xtreme-ag/',
  '/blog/eggflation-gives-producers-record-profits/',
  '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/',
];

const b = await chromium.launch();
const out = {};
for (const W of WIDTHS) {
  const ctx = await b.newContext({ viewport: { width: W, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.route('**/*', (r) => {
    const u = new URL(r.request().url());
    return u.hostname === 'localhost' ? r.continue() : r.abort();
  });
  for (const route of ROUTES) {
    await p.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(350);
    const rows = await p.evaluate(() => {
      // Split a heading into visual lines using Range rects per word.
      function lines(el) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const words = [];
        let n;
        while ((n = walker.nextNode())) {
          const t = n.textContent;
          let i = 0;
          while (i < t.length) {
            while (i < t.length && /\s/.test(t[i])) i++;
            const s = i;
            while (i < t.length && !/\s/.test(t[i])) i++;
            if (i > s) {
              const r = document.createRange();
              r.setStart(n, s);
              r.setEnd(n, i);
              const rect = r.getBoundingClientRect();
              if (rect.width) words.push({ y: Math.round(rect.top), x: rect.left, r: rect.right, w: t.slice(s, i) });
            }
          }
        }
        const rowsMap = new Map();
        for (const w of words) {
          let key = [...rowsMap.keys()].find((k) => Math.abs(k - w.y) < 8);
          if (key === undefined) key = w.y;
          if (!rowsMap.has(key)) rowsMap.set(key, []);
          rowsMap.get(key).push(w);
        }
        return [...rowsMap.entries()]
          .sort((a, c) => a[0] - c[0])
          .map(([, ws]) => ({
            text: ws.map((x) => x.w).join(' '),
            width: Math.round(Math.max(...ws.map((x) => x.r)) - Math.min(...ws.map((x) => x.x))),
          }));
      }
      const main = document.querySelector('#main');
      return [...main.querySelectorAll('h1, h2')].map((h) => {
        const cs = getComputedStyle(h);
        return {
          tag: h.tagName,
          fs: Math.round(parseFloat(cs.fontSize)),
          box: Math.round(h.getBoundingClientRect().width),
          wrap: cs.textWrap || cs.textWrapStyle || '',
          lines: lines(h),
        };
      });
    });
    (out[route] ||= {})[W] = rows;
  }
  await ctx.close();
  console.error('width done', W);
}
await b.close();
console.log(JSON.stringify(out));

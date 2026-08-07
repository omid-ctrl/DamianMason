import { chromium } from 'playwright';

const routes = [
  '/', '/about/', '/acres-tv/', '/blog-news/', '/blog/',
  '/blog/eggflation-gives-producers-record-profits/',
  '/boasg/', '/collaboration-opportunities/', '/contact-us/',
  '/do-business-better-podcast/', '/join-the-conversation/', '/keynote/',
  '/meeting-coordinators/', '/podcasts/', '/reviews/', '/speaking/',
  '/the-business-of-agriculture/', '/xtreme-ag/',
];

const widths = [1440, 390];
const out = [];

const b = await chromium.launch();
for (const w of widths) {
  const ctx = await b.newContext({
    viewport: { width: w, height: 1000 },
    deviceScaleFactor: w < 500 ? 3 : 2,
    reducedMotion: 'reduce',
    isMobile: w < 500,
    hasTouch: w < 500,
  });
  const p = await ctx.newPage();
  await p.route('**/*', (r) => {
    const u = new URL(r.request().url());
    return u.hostname === 'localhost' ? r.continue() : r.abort();
  });
  for (const route of routes) {
    await p.goto('http://localhost:3100' + route, { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(1500);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(900);
    const imgs = await p.evaluate(() => {
      return [...document.querySelectorAll('img')].map((img) => {
        const r = img.getBoundingClientRect();
        const cs = getComputedStyle(img);
        // decode the underlying source path out of a next/image url
        let src = img.currentSrc || img.src;
        try {
          const u = new URL(src, location.href);
          if (u.pathname.startsWith('/_next/image')) src = decodeURIComponent(u.searchParams.get('url') || src);
        } catch {}
        return {
          src,
          rw: Math.round(r.width), rh: Math.round(r.height),
          nw: img.naturalWidth, nh: img.naturalHeight,
          fit: cs.objectFit, pos: cs.objectPosition,
          loading: img.loading,
          alt: img.alt,
          sizes: img.sizes || '',
        };
      });
    });
    for (const i of imgs) out.push({ route, vw: w, dpr: w < 500 ? 3 : 2, ...i });
  }
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(out, null, 0));

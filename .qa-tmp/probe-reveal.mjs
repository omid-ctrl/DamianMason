import { chromium } from 'playwright';
const ROUTES = ['/', '/about/', '/speaking/', '/keynote/', '/reviews/', '/meeting-coordinators/', '/collaboration-opportunities/', '/boasg/', '/podcasts/', '/the-business-of-agriculture/', '/do-business-better-podcast/', '/xtreme-ag/', '/blog-news/', '/acres-tv/', '/blog/', '/contact-us/', '/join-the-conversation/'];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
for (const r of ROUTES) {
  await p.goto('http://localhost:3100' + r, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  // slow, human-paced scroll: one viewport at a time with a real pause
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(260);
  }
  await p.waitForTimeout(900);
  const bad = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const st = el.getAttribute('data-reveal-state');
      const kids = [...el.children];
      const invisible = el.getAttribute('data-reveal') === 'stagger'
        ? kids.filter(k => getComputedStyle(k).opacity === '0').length
        : (getComputedStyle(el).opacity === '0' ? 1 : 0);
      if (invisible > 0) out.push({ cls: el.className.toString().slice(0, 60), state: st, hidden: invisible, of: kids.length, text: (el.innerText || '').replace(/\s+/g, ' ').slice(0, 70) });
    });
    return out;
  });
  console.log(r, bad.length ? JSON.stringify(bad) : 'ok');
}
await b.close();

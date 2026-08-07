import { chromium } from 'playwright';
const [url, width, out, scrollTo] = process.argv.slice(2);
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: Number(width), height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const p = await c.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts?.ready);
await p.click('.dm-masthead__menu');
await p.waitForTimeout(500);
if (scrollTo) await p.evaluate((y) => { const sc = document.querySelector('.dm-menu__body'); sc.scrollTop = y === 'bottom' ? 99999 : Number(y); }, scrollTo);
await p.waitForTimeout(400);
const info = await p.evaluate(() => {
  const m = document.querySelector('.dm-menu__body');
  const foot = document.querySelector('.dm-menu__foot');
  const body = document.querySelector('.dm-menu__body');
  const fb = foot.getBoundingClientRect();
  const rows = [...document.querySelectorAll('.dm-menu__list > li')].map((li) => {
    const r = li.getBoundingClientRect();
    return [li.querySelector('.dm-menu__link').textContent.trim(), Math.round(r.top), Math.round(r.bottom)];
  });
  return { scrollHeight: m.scrollHeight, clientHeight: m.clientHeight, scrollTop: m.scrollTop,
    foot: [Math.round(fb.top), Math.round(fb.bottom)], footBg: getComputedStyle(foot).backgroundColor,
    bodyPad: getComputedStyle(body).padding, footMarginTop: getComputedStyle(foot).marginBlockStart, rows };
});
console.log(JSON.stringify(info, null, 1));
await p.screenshot({ path: out });
await b.close();

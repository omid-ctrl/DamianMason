import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const failed = [];
p.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure()?.errorText)));
p.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
// human-paced scroll
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 600) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(220); }
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(1500);
const imgs = await p.evaluate(() => [...document.images].map(i => ({
  src: i.currentSrc.split('?')[0].slice(-70),
  loading: i.loading,
  complete: i.complete,
  nw: i.naturalWidth,
  nh: i.naturalHeight,
  w: Math.round(i.getBoundingClientRect().width),
  h: Math.round(i.getBoundingClientRect().height),
  alt: (i.alt || '').slice(0, 40),
})));
console.log('TOTAL', imgs.length);
console.log('BROKEN/UNLOADED:', JSON.stringify(imgs.filter(i => !i.complete || i.nw === 0), null, 1));
console.log('ZERO-BOX:', JSON.stringify(imgs.filter(i => i.w === 0 || i.h === 0), null, 1));
console.log('LOGOWALL:', JSON.stringify(await p.evaluate(() => {
  const g = document.querySelector('.dm-logowall__grid');
  if (!g) return null;
  const cells = [...g.children];
  return { cells: cells.length, sample: cells.slice(0, 4).map(c => { const im = c.querySelector('img'); const cs = im && getComputedStyle(im); return { html: c.innerHTML.slice(0, 120), imgW: im && Math.round(im.getBoundingClientRect().width), imgH: im && Math.round(im.getBoundingClientRect().height), nw: im && im.naturalWidth, op: cs && cs.opacity, blend: cs && cs.mixBlendMode, filter: cs && cs.filter }; }) };
}), null, 1));
console.log('FIG03:', JSON.stringify(await p.evaluate(() => {
  const figs = [...document.querySelectorAll('figure')];
  return figs.map(f => { const im = f.querySelector('img'); const cs = im && getComputedStyle(im); return { cut: (f.innerText||'').replace(/\s+/g,' ').slice(0,60), src: im && im.currentSrc.split('?')[0].slice(-50), nw: im && im.naturalWidth, w: im && Math.round(im.getBoundingClientRect().width), h: im && Math.round(im.getBoundingClientRect().height), op: cs && cs.opacity, blend: cs && cs.mixBlendMode, filter: cs && cs.filter }; });
}), null, 1));
console.log('NETFAIL:', JSON.stringify(failed, null, 1));
await b.close();

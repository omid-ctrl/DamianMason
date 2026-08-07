import { chromium } from 'playwright';
const [url, width, out, sel] = process.argv.slice(2);
const b = await chromium.launch();
const c = await b.newContext({ javaScriptEnabled: false, viewport: { width: Number(width), height: 1000 }, deviceScaleFactor: 2 });
const p = await c.newPage();
await p.goto(url, { waitUntil: 'load' });
await p.waitForTimeout(1500);
const el = sel ? await p.$(sel) : null;
if (el) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await el.screenshot({ path: out }); }
else await p.screenshot({ path: out, fullPage: false });
const info = await p.evaluate(() => [...document.querySelectorAll('.dm-video')].map((f) => {
  const a = f.querySelector('a.dm-video__facade');
  const btn = f.querySelector('button.dm-video__facade');
  const r = a ? a.getBoundingClientRect() : null;
  return { href: a?.getAttribute('href') ?? null, name: a?.textContent?.trim().slice(0,70) ?? null,
    anchorBox: r ? [Math.round(r.width), Math.round(r.height)] : null,
    buttonDisplay: btn ? getComputedStyle(btn).display : 'none-present' };
}));
console.log(JSON.stringify(info, null, 1));
await b.close();

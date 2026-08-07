import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { await new Promise(r => { let y=0; const s=()=>{window.scrollTo(0,y); y+=600; if(y<document.body.scrollHeight) setTimeout(s,25); else {window.scrollTo(0,0); setTimeout(r,500);} }; s(); }); });
await p.waitForTimeout(600);
const info = await p.evaluate(() => {
  const out = [];
  const sec = document.querySelector('.dm-statrow');
  const list = document.querySelector('.dm-statrow__list');
  const cs = getComputedStyle(list);
  out.push({ what: 'section', rect: sec.getBoundingClientRect().toJSON() });
  out.push({ what: 'list', rect: list.getBoundingClientRect().toJSON(), display: cs.display, cols: cs.gridTemplateColumns, opacity: cs.opacity, transform: cs.transform, visibility: cs.visibility });
  [...list.children].forEach((li, i) => {
    const c = getComputedStyle(li);
    out.push({ what: 'li'+i, text: li.innerText, rect: li.getBoundingClientRect().toJSON(), opacity: c.opacity, transform: c.transform, visibility: c.visibility });
  });
  return out;
});
console.log(JSON.stringify(info, null, 1));
await p.screenshot({ path: '/Users/omidebrahimi/Desktop/Projects/DamianMason/.qa-tmp/zoom-statrow-390.png', fullPage: true, clip: { x: 0, y: 1330, width: 390, height: 600 } });
await b.close();

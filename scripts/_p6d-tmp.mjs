import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:768,height:1000}, reducedMotion:'reduce' });
const p = await ctx.newPage();
await p.goto('http://localhost:3100/collaboration-opportunities/', {waitUntil:'networkidle'});
console.log(JSON.stringify(await p.evaluate(() => {
  const out = [];
  for (const g of document.querySelectorAll('.dm-btn--ghost')) {
    const gb = g.getBoundingClientRect();
    const cs = getComputedStyle(g);
    // nearest ancestor that also contains a <p>
    let card = g.parentElement, para = null;
    while (card && !para) { para = card.querySelector('p'); if (!para) card = card.parentElement; }
    out.push({ text: g.textContent.trim().slice(0,30), cls: g.className,
      boxLeft: Math.round(gb.left),
      textLeft: Math.round(gb.left + parseFloat(cs.paddingInlineStart) + parseFloat(cs.borderLeftWidth)),
      paraLeft: para ? Math.round(para.getBoundingClientRect().left) : null,
      padStart: cs.paddingInlineStart, marginStart: cs.marginInlineStart, ta: cs.textAlign, jc: cs.justifyContent });
  }
  return out;
}), null, 1));
await b.close();

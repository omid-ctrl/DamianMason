import { chromium } from 'playwright';
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:390,height:900},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await c.newPage();
await p.goto('http://localhost:3100/podcasts/',{waitUntil:'networkidle'});
const v=await p.evaluate(()=>{
  const l=document.querySelector('.dm-statrow__list');
  const out={cols:getComputedStyle(l).gridTemplateColumns, items:[]};
  [...l.children].forEach(it=>{
    const st=it.querySelector('.dm-stat')||it.firstElementChild;
    const kids=[...st.children].map(k=>{const r=k.getBoundingClientRect();return{cls:k.className.toString().slice(0,28),txt:k.textContent.trim().slice(0,26),x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),right:Math.round(r.right)};});
    const ir=it.getBoundingClientRect();
    out.items.push({item:[Math.round(ir.left),Math.round(ir.width)], kids, scrollW:st.scrollWidth, clientW:st.clientWidth});
  });
  return out;
});
console.log(JSON.stringify(v,null,1));
const el=await p.$('.dm-statrow');
await el.scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
await el.screenshot({path:'/Users/omidebrahimi/Desktop/Projects/DamianMason/docs/qa/screenshots/round-1-mobile/zz-podcasts-ledger-390.png'});
await b.close();

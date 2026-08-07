import { chromium } from 'playwright';
const b=await chromium.launch();
for (const w of [390,768]) {
const c=await b.newContext({viewport:{width:w,height:w<700?844:1024},deviceScaleFactor:2,isMobile:w<700,hasTouch:true});
const p=await c.newPage();
await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'networkidle'});
const s=await p.$$('.dm-faq__summary');
console.log('summaries',s.length,'w',w);
await s[0].scrollIntoViewIfNeeded(); await s[0].click(); await p.waitForTimeout(300);
await s[1].click(); await p.waitForTimeout(800);
await s[0].scrollIntoViewIfNeeded(); await p.evaluate(()=>window.scrollBy(0,-140)); await p.waitForTimeout(400);
await p.screenshot({path:`/Users/omidebrahimi/Desktop/Projects/DamianMason/docs/qa/screenshots/round-1-mobile/zz-faq-open-${w}.png`});
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.dm-faq__summary')].slice(0,4).map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent.trim().slice(0,26),w:Math.round(r.width),h:Math.round(r.height)};}))));
await c.close();
}
await b.close();

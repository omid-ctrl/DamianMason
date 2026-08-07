import { chromium } from 'playwright';
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const p=await c.newPage();
await p.goto('http://localhost:3100/keynote/',{waitUntil:'networkidle'});
const v=await p.evaluate(()=>{
  const panels=[...document.querySelectorAll('.dm-faq [role="region"], .dm-faq [id*="panel"], .dm-faq div')].slice(0,6);
  return panels.map(e=>({cls:e.className.toString().slice(0,30),hidden:e.hasAttribute('hidden'),disp:getComputedStyle(e).display,h:Math.round(e.getBoundingClientRect().height),vis:getComputedStyle(e).visibility,txt:(e.textContent||'').trim().slice(0,30)}));
});
console.log(JSON.stringify(v,null,1));
// tap target of FAQ triggers
console.log('TRIGGERS', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.dm-faq button')].slice(0,4).map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent.trim().slice(0,28),w:Math.round(r.width),h:Math.round(r.height)};}))));
await b.close();

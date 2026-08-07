import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({viewport:{width:768,height:1024},deviceScaleFactor:1,reducedMotion:'reduce'});
const p = await ctx.newPage();
await p.goto('http://localhost:3100/join-the-conversation/',{waitUntil:'networkidle'});
const r = await p.evaluate(()=>{
  return [...document.querySelectorAll('input,form,button')].map(e=>{
    const b=e.getBoundingClientRect();
    const cs=getComputedStyle(e);
    return {tag:e.tagName,type:e.type,name:e.name,cls:String(e.className).slice(0,80),x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height),right:Math.round(b.right),display:cs.display,pos:cs.position,vis:cs.visibility,clip:cs.clipPath,parentCls:String(e.parentElement.className).slice(0,80),parentOverflow:getComputedStyle(e.parentElement).overflow};
  });
});
console.log(JSON.stringify(r,null,1));
await b.close();

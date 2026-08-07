import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:320,height:800}, deviceScaleFactor:1, isMobile:true, hasTouch:true, reducedMotion:'reduce' });
const p = await ctx.newPage();
await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'networkidle',timeout:60000});
await p.evaluate(()=>document.fonts?.ready);
await p.waitForTimeout(400);
const d = await p.evaluate(()=>{
  const de=document.documentElement;
  const cw=de.clientWidth;
  const maxRight=[];
  const selfOverflow=[];
  for(const el of document.querySelectorAll('*')){
    const r=el.getBoundingClientRect();
    if(r.width===0&&r.height===0) continue;
    maxRight.push({tag:el.tagName, cls:(el.className?.toString?.()||'').slice(0,80), right:+r.right.toFixed(3), w:+r.width.toFixed(3)});
    if(el.scrollWidth>el.clientWidth+0.5 && el.clientWidth>0){
      const cs=getComputedStyle(el);
      selfOverflow.push({tag:el.tagName, cls:(el.className?.toString?.()||'').slice(0,80), scrollW:el.scrollWidth, clientW:el.clientWidth, overflowX:cs.overflowX, text:(el.textContent||'').trim().slice(0,60)});
    }
  }
  maxRight.sort((a,b)=>b.right-a.right);
  return {cw, scrollWidth:de.scrollWidth, top5Right:maxRight.slice(0,5), selfOverflow:selfOverflow.slice(0,10)};
});
console.log(JSON.stringify(d,null,2));
await b.close();

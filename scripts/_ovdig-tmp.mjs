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
  const out=[];
  for(const el of document.querySelectorAll('*')){
    const r=el.getBoundingClientRect();
    if(r.width===0&&r.height===0) continue;
    if(r.right>cw+0.01){
      out.push({tag:el.tagName, cls:(el.className?.toString?.()||'').slice(0,90), right:+r.right.toFixed(2), left:+r.left.toFixed(2), w:+r.width.toFixed(2), text:(el.textContent||'').trim().slice(0,50)});
    }
  }
  return {cw, scrollWidth:de.scrollWidth, bodyScroll:document.body.scrollWidth, count:out.length, out:out.slice(0,15)};
});
console.log(JSON.stringify(d,null,2));
await b.close();

import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
const p=await ctx.newPage();
await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'networkidle',timeout:60000});
await p.evaluate(()=>document.fonts?.ready);
await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
await p.waitForTimeout(1500);
const d=await p.evaluate(()=>{
  const img=[...document.images].find(i=>/microphones/.test(i.currentSrc||i.src));
  if(!img) return null;
  const sec=img.closest('section');
  const r=(sec||img).getBoundingClientRect();
  const m=(img.currentSrc||'').match(/[?&]w=(\d+)/);
  return {y:Math.round(r.top+window.scrollY),h:Math.round(r.height),served:m?+m[1]:null,cssW:Math.round(img.getBoundingClientRect().width),nat:img.naturalWidth+'x'+img.naturalHeight};
});
console.log(JSON.stringify(d));
if(d) await p.screenshot({path:'docs/qa/screenshots/final/mc-mediaband-1440.png',fullPage:true,clip:{x:0,y:d.y,width:1440,height:d.h}});
await b.close();

import { chromium } from 'playwright';
import fs from 'node:fs';
const targets=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const b=await chromium.launch();
const bad=[];
for(const w of [1440]){
 const ctx=await b.newContext({viewport:{width:w,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
 for(const t of targets){
  const p=await ctx.newPage();
  await p.goto(t.url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(700);
  const rows=await p.evaluate(()=>[...document.images].map(i=>{
    const r=i.getBoundingClientRect();
    const m=(i.currentSrc||'').match(/[?&]w=(\d+)/);
    return {src:decodeURIComponent((i.currentSrc||i.src).replace(/^.*url=/,'').split('&')[0]).split('/').pop(),
      served:m?+m[1]:null, cssW:Math.round(r.width), cssH:Math.round(r.height),
      nat:i.naturalWidth, sizes:i.sizes||'', dpr:window.devicePixelRatio};
  }));
  for(const r of rows){
    if(r.cssW>0 && r.served && r.served < r.cssW*0.9) bad.push({page:t.name,...r});
  }
  await p.close();
 }
 await ctx.close();
}
await b.close();
console.log(bad.length?JSON.stringify(bad,null,1):'no undersized images at 1440 dpr1');

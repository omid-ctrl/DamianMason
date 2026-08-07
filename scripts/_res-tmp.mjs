import { chromium } from 'playwright';
import fs from 'node:fs';
const targets=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const b=await chromium.launch();
const bad=[];
const ctx=await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
for(const t of targets){
  const p=await ctx.newPage();
  await p.goto(t.url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(1200);
  const rows=await p.evaluate(()=>[...document.images].filter(i=>i.complete&&i.naturalWidth>0).map(i=>{
    const r=i.getBoundingClientRect();
    return {src:(i.currentSrc||i.src).replace(/^.*?url=/,'').split('&')[0],
      cssW:Math.round(r.width),cssH:Math.round(r.height),nat:i.naturalWidth,natH:i.naturalHeight};
  }));
  for(const r of rows){
    if(r.cssW<20) continue;
    const needed=r.cssW*2; // dpr2
    const ratio=r.nat/needed;
    if(ratio<0.75) bad.push({page:t.name,file:decodeURIComponent(r.src).split('/').pop(),cssW:r.cssW,nat:r.nat,needed,pctOfIdeal:Math.round(ratio*100)});
  }
  await p.close();
}
await ctx.close(); await b.close();
bad.sort((a,b)=>a.pctOfIdeal-b.pctOfIdeal);
console.log(bad.length?JSON.stringify(bad,null,1):'every image has >=75% of the pixels a 2x display wants');

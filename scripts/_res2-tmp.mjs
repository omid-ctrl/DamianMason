import { chromium } from 'playwright';
import fs from 'node:fs';
const targets=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const dims=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const b=await chromium.launch();
const rows=[];
const ctx=await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
for(const t of targets){
  const p=await ctx.newPage();
  await p.goto(t.url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(600);
  const imgs=await p.evaluate(()=>[...document.images].map(i=>{
    const r=i.getBoundingClientRect();
    return {src:decodeURIComponent((i.currentSrc||i.src).replace(/^.*?url=/,'').split('&')[0]),cssW:Math.round(r.width),cssH:Math.round(r.height)};
  }));
  for(const im of imgs){
    if(im.cssW<24) continue;
    const f=im.src.split('/').pop();
    const d=dims[f]; if(!d) continue;
    rows.push({page:t.name,file:f,cssW:im.cssW,srcW:d.w,needed:im.cssW*2,pct:Math.round(d.w/(im.cssW*2)*100)});
  }
  await p.close();
}
await ctx.close(); await b.close();
const seen=new Map();
for(const r of rows){const k=r.page+'|'+r.file+'|'+r.cssW; if(!seen.has(k))seen.set(k,r);}
const all=[...seen.values()].sort((a,b)=>a.pct-b.pct);
console.log('placements checked:',all.length);
console.log('\n--- below 100% of 2x ideal ---');
for(const r of all.filter(r=>r.pct<100)) console.log(String(r.pct).padStart(3)+'%  src '+String(r.srcW).padStart(4)+'px  needs '+String(r.needed).padStart(4)+'px  '+r.file.slice(0,42).padEnd(42)+' ('+r.page+')');
console.log('\nbelow 50% of 2x:',all.filter(r=>r.pct<50).length,'| below 100%:',all.filter(r=>r.pct<100).length,'| at/above 100%:',all.filter(r=>r.pct>=100).length);

import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
for(const [url,pat] of [['http://localhost:3100/meeting-coordinators/','microphones'],['http://localhost:3100/keynote/','keynote-stage-podium'],['http://localhost:3100/about/','portrait-dark-blazer']]){
  const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(1500);
  const d=await p.evaluate((pat)=>{
    const i=[...document.images].find(x=>new RegExp(pat).test(x.currentSrc||x.src));
    if(!i) return {miss:pat};
    const r=i.getBoundingClientRect();
    return {pat, sizes:i.sizes, loading:i.loading, cssW:Math.round(r.width), nat:i.naturalWidth,
      current:decodeURIComponent(i.currentSrc).slice(0,120),
      srcsetWidths:(i.srcset||'').split(',').map(s=>s.trim().split(' ').pop()).join(' ')};
  },pat);
  console.log(JSON.stringify(d,null,1));
  await p.close();
}
await b.close();

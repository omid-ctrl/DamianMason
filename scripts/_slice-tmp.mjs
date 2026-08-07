import { chromium } from 'playwright';
import fs from 'node:fs';
const targets=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const W=Number(process.argv[3]); const H=Number(process.argv[4]); const N=Number(process.argv[5]||3);
const OUT='docs/qa/screenshots/final/slices';
fs.mkdirSync(OUT,{recursive:true});
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:W<500,hasTouch:W<500,reducedMotion:'reduce'});
for(const t of targets){
  const p=await ctx.newPage();
  await p.goto(t.url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(700);
  const total=await p.evaluate(()=>document.body.scrollHeight);
  const n=Math.min(N,Math.ceil(total/H));
  for(let i=0;i<n;i++){
    const y=Math.round(i*(total-H)/Math.max(1,n-1));
    await p.evaluate((y)=>window.scrollTo(0,y),y);
    await p.waitForTimeout(350);
    await p.screenshot({path:`${OUT}/${t.name}-${W}-v${i+1}.png`});
  }
  console.log(t.name,W,'slices',n,'of total',total);
  await p.close();
}
await ctx.close(); await b.close();

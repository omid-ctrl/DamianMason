import { chromium } from 'playwright';
const b=await chromium.launch();
const OUT='docs/qa/screenshots/final';
async function crop(url,w,sel,idx,name,pad=20){
  const ctx=await b.newContext({viewport:{width:w,height:1000},deviceScaleFactor:2,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(600);
  const els=await p.$$(sel);
  if(!els[idx]){console.log('MISS',name,sel,'have',els.length);await ctx.close();return;}
  const box=await els[idx].boundingBox();
  await p.screenshot({path:`${OUT}/${name}.png`, fullPage:true, clip:{x:Math.max(0,box.x-pad),y:Math.max(0,box.y-pad),width:Math.min(w,box.width+pad*2),height:box.height+pad*2}});
  console.log('ok',name,JSON.stringify(box));
  await ctx.close();
}
await crop('http://localhost:3100/keynote/',1440,'figure',6,'keynote-fig04-1440');
await crop('http://localhost:3100/keynote/',390,'figure',6,'keynote-fig04-390');
await crop('http://localhost:3100/keynote/',768,'.dm-ctaband',0,'ctaband-768-crop');
await crop('http://localhost:3100/keynote/',1024,'.dm-ctaband',0,'ctaband-1024-crop');
await crop('http://localhost:3100/','390','.dm-logo-wall, .dm-logowall, ul.dm-logo-grid',0,'logowall-390-crop');
await b.close();

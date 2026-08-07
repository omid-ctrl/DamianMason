import { chromium } from 'playwright';
const b=await chromium.launch();
const OUT='docs/qa/screenshots/final';
async function crop(url,w,sel,name,pad=40){
  const ctx=await b.newContext({viewport:{width:w,height:1000},deviceScaleFactor:2,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(600);
  const el=await p.$(sel);
  if(!el){console.log('MISS',name,sel);await ctx.close();return;}
  const box=await el.boundingBox();
  await p.screenshot({path:`${OUT}/${name}.png`, fullPage:true, clip:{x:Math.max(0,box.x-pad),y:Math.max(0,box.y-pad),width:Math.min(w,box.width+pad*2),height:Math.min(box.height+pad*2, 4000)}});
  console.log('ok',name, JSON.stringify(box));
  await ctx.close();
}
// about books section
await crop('http://localhost:3100/about/',1440,'#books','about-books-crop-1440');
await crop('http://localhost:3100/about/',768,'#books','about-books-crop-768');
await crop('http://localhost:3100/about/',390,'#books','about-books-crop-390');
await b.close();

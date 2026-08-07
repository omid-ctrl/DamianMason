import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
const p=await ctx.newPage();
await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'networkidle',timeout:60000});
await p.evaluate(()=>document.fonts?.ready);
await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
await p.waitForTimeout(700);
const info=await p.evaluate(()=>{
  const out=[];
  for(const el of document.querySelectorAll('section,div')){
    const img=el.querySelector(':scope > img, :scope > picture > img');
    const cs=getComputedStyle(el);
    if(el.className && /band|bleed|media/i.test(el.className.toString())){
      const r=el.getBoundingClientRect();
      out.push({cls:el.className.toString().slice(0,70),y:Math.round(r.top),h:Math.round(r.height),bg:cs.backgroundColor});
    }
  }
  const imgs=[...document.querySelectorAll('img')].map(i=>{const r=i.getBoundingClientRect();return{src:i.src.split('/').pop().slice(0,55),w:Math.round(r.width),h:Math.round(r.height),y:Math.round(r.top),op:getComputedStyle(i).opacity,filter:getComputedStyle(i).filter.slice(0,60)};});
  return {bands:out,imgs};
});
console.log(JSON.stringify(info,null,1).slice(0,3000));
// crop the dark band
const el=await p.$('.dm-photoband, .dm-band, [class*="mediaBand"], [class*="photoBand"]');
if(el){const box=await el.boundingBox(); await p.screenshot({path:'docs/qa/screenshots/final/mc-mediaband-1440.png',fullPage:true,clip:{x:0,y:box.y,width:1440,height:box.height}}); console.log('cropped',JSON.stringify(box));}
else console.log('no band selector matched');
await b.close();

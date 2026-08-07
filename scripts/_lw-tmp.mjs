import { chromium } from 'playwright';
const b=await chromium.launch();
for(const w of [390,768]){
const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:2,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
const p=await ctx.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle',timeout:60000});
await p.evaluate(()=>document.fonts?.ready);
await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
await p.waitForTimeout(800);
const d=await p.evaluate(()=>{const el=document.querySelector('.dm-logo-cell')?.closest('ul');if(!el)return null;const r=el.getBoundingClientRect();return{y:Math.round(r.top+window.scrollY),h:Math.round(r.height),cols:getComputedStyle(el).gridTemplateColumns};});
console.log(w,JSON.stringify(d));
if(d) await p.screenshot({path:`docs/qa/screenshots/final/logowall-${w}-crop.png`,fullPage:true,clip:{x:0,y:d.y-10,width:w,height:Math.min(d.h+20,3000)}});
await ctx.close();
}
await b.close();

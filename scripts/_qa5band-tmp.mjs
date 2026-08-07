import { chromium } from 'playwright';
const b=await chromium.launch();
for(const w of [390,768,1024,1440]){
const ctx=await b.newContext({viewport:{width:w,height:w<500?844:1024},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
const p=await ctx.newPage();
await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'networkidle'});
const d=await p.evaluate(()=>{
  const band=[...document.querySelectorAll('section,div')].find(e=>e.textContent.includes('Get your date') && e.className.includes('ctaband'));
  const out={};
  document.querySelectorAll('[class*=ctaband]').forEach(e=>{const r=e.getBoundingClientRect();out[e.className]= `${Math.round(r.x)},${Math.round(r.y+scrollY)} ${Math.round(r.width)}x${Math.round(r.height)} z=${getComputedStyle(e).zIndex} pos=${getComputedStyle(e).position}`;});
  return out;
});
console.log('==',w); console.log(JSON.stringify(d,null,1));
await p.close(); await ctx.close();
}
await b.close();

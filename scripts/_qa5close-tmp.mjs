import { chromium } from 'playwright';
const B='http://localhost:3100';
const routes=['/','/about/','/speaking/','/keynote/','/reviews/','/meeting-coordinators/','/collaboration-opportunities/','/boasg/','/podcasts/','/the-business-of-agriculture/','/do-business-better-podcast/','/xtreme-ag/','/blog-news/','/acres-tv/','/blog/','/blog/eggflation-gives-producers-record-profits/','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/','/contact-us/','/join-the-conversation/'];
const b=await chromium.launch();
for(const w of [390,768]){
const ctx=await b.newContext({viewport:{width:w,height:w<500?844:1024},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
for(const r of routes){
  const p=await ctx.newPage();
  await p.goto(B+r,{waitUntil:'networkidle',timeout:60000});
  const d=await p.evaluate(()=>[...document.querySelectorAll('.dm-section-close')].map(e=>{const b=e.getBoundingClientRect();const cs=getComputedStyle(e);
    const kids=[...e.querySelectorAll('a,button')].map(k=>{const kb=k.getBoundingClientRect();return Math.round(kb.width)+'x'+Math.round(kb.height);});
    return {x:Math.round(b.x),w:Math.round(b.width),mt:cs.marginBlockStart,pt:cs.paddingBlockStart,ai:cs.alignItems,kids};}));
  if(d.length) console.log(w,r,JSON.stringify(d));
  await p.close();
}
await ctx.close();
}
await b.close();

import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.route('**/*',r=>new URL(r.request().url()).hostname==='localhost'?r.continue():r.abort());
await p.goto('http://localhost:3100/podcasts/',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(700);
console.log(JSON.stringify(await p.evaluate(()=>{
 const img=document.querySelector('.dm-hero__figure .dm-photo__img');
 const sec=document.querySelector('.dm-hero');
 return {objPos:getComputedStyle(img).objectPosition, secCls:sec.className,
  figParentCls:img.closest('section')?.className};
}),null,1));
await b.close();

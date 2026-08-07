import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.route('**/*',r=>new URL(r.request().url()).hostname==='localhost'?r.continue():r.abort());
await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(600);
console.log(JSON.stringify(await p.evaluate(()=>{
 const h=[...document.querySelectorAll('#main h2')].find(x=>x.textContent.includes('Co-Creation'));
 if(!h) return 'not found';
 const r=h.getBoundingClientRect();
 const cs=getComputedStyle(h);
 // client rects of the whole text node
 const w=document.createTreeWalker(h,NodeFilter.SHOW_TEXT); const n=w.nextNode();
 const rg=document.createRange(); rg.selectNodeContents(h);
 return {text:h.textContent, boxW:Math.round(r.width), parentW:Math.round(h.parentElement.getBoundingClientRect().width),
   maxW:cs.maxInlineSize||cs.maxWidth, rects:[...rg.getClientRects()].map(x=>Math.round(x.width)), cls:h.className};
}),null,1));
await b.close();

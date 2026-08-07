/**
 * Reports any heading word that breaks across lines, at the five widths where
 * the hero type track is narrowest relative to its content.
 *
 *   node scripts/hyph.mjs [--base http://localhost:3100]
 *
 * This is the gate for --fs-6xl-hero. That token is fitted to the longest
 * single word in any H1, and "fitted" has to mean measured: a display face
 * swap changes every glyph advance on the site, so the old ceiling is evidence
 * about the old face and nothing more. Zero reported breaks is the bar.
 *
 * --base exists because the production server is what should be measured. The
 * dev server compiles on demand and its first paint can be a different layout.
 */
import { chromium } from 'playwright';
const BASE=(process.argv.find((a,i,arr)=>arr[i-1]==='--base'))??'http://localhost:3100';
const ROUTES=['/','/about/','/acres-tv/','/blog/','/blog-news/','/boasg/','/collaboration-opportunities/','/contact-us/','/do-business-better-podcast/','/join-the-conversation/','/keynote/','/meeting-coordinators/','/podcasts/','/reviews/','/speaking/','/the-business-of-agriculture/','/xtreme-ag/'];
const b=await chromium.launch();
for(const W of [1024,1200,1280,1380,1440]){
 const ctx=await b.newContext({viewport:{width:W,height:900}});
 const p=await ctx.newPage();
 await p.route('**/*',r=>new URL(r.request().url()).hostname==='localhost'?r.continue():r.abort());
 for(const route of ROUTES){
  await p.goto(BASE+route,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(280);
  const hits=await p.evaluate(()=>{
   const out=[];
   document.querySelectorAll('#main h1,#main h2,#main h3').forEach(h=>{
    const w=document.createTreeWalker(h,NodeFilter.SHOW_TEXT); let n;
    while((n=w.nextNode())){
     const t=n.textContent; let i=0;
     while(i<t.length){
      while(i<t.length&&/\s/.test(t[i]))i++;
      const s=i; while(i<t.length&&!/\s/.test(t[i]))i++;
      if(i>s){const r=document.createRange();r.setStart(n,s);r.setEnd(n,i);
       if(r.getClientRects().length>1) out.push({tag:h.tagName,word:t.slice(s,i),head:h.textContent.trim().slice(0,60)});}
     }
    }
   });
   return out;
  });
  hits.forEach(h=>console.log(W,route,h.tag,'BREAKS:',JSON.stringify(h.word),'in',JSON.stringify(h.head)));
 }
 await ctx.close();
}
await b.close();

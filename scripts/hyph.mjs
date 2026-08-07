import { chromium } from 'playwright';
const ROUTES=['/','/about/','/acres-tv/','/blog/','/blog-news/','/boasg/','/collaboration-opportunities/','/contact-us/','/do-business-better-podcast/','/join-the-conversation/','/keynote/','/meeting-coordinators/','/podcasts/','/reviews/','/speaking/','/the-business-of-agriculture/','/xtreme-ag/'];
const b=await chromium.launch();
for(const W of [1024,1200,1280,1380,1440]){
 const ctx=await b.newContext({viewport:{width:W,height:900}});
 const p=await ctx.newPage();
 await p.route('**/*',r=>new URL(r.request().url()).hostname==='localhost'?r.continue():r.abort());
 for(const route of ROUTES){
  await p.goto('http://localhost:3100'+route,{waitUntil:'domcontentloaded'});
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

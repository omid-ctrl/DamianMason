import { chromium } from 'playwright';
const B='http://localhost:3100';
const routes=['/','/about/','/speaking/','/keynote/','/reviews/','/meeting-coordinators/','/collaboration-opportunities/','/boasg/','/podcasts/','/the-business-of-agriculture/','/do-business-better-podcast/','/xtreme-ag/','/blog-news/','/acres-tv/','/blog/','/blog/eggflation-gives-producers-record-profits/','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/','/contact-us/','/join-the-conversation/'];
const b=await chromium.launch();
for(const w of [390,768,1024,1440]){
const ctx=await b.newContext({viewport:{width:w,height:w<500?844:1024},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
for(const r of routes){
  const p=await ctx.newPage();
  await p.goto(B+r,{waitUntil:'networkidle',timeout:60000});
  const d=await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('.dm-ctaband__grid').forEach(g=>{
      const body=g.querySelector('.dm-ctaband__body'), panel=g.querySelector('.dm-ctaband__panel');
      if(!body||!panel) return;
      const bb=body.getBoundingClientRect(), pb=panel.getBoundingClientRect();
      const sameRow = !(bb.bottom<=pb.top+1 || pb.bottom<=bb.top+1);
      const ov = Math.round(bb.right - pb.left);
      if(sameRow && ov>0) out.push(`OVERLAP ${ov}px body ${Math.round(bb.x)}+${Math.round(bb.width)} panel ${Math.round(pb.x)}`);
      // also check actual text overflow past panel left
      const cols=getComputedStyle(g).gridTemplateColumns;
      if(sameRow&&ov>0) out.push('cols='+cols);
    });
    return out;
  });
  if(d.length) console.log(w, r, JSON.stringify(d));
  await p.close();
}
await ctx.close();
}
await b.close();
console.log('band sweep done');

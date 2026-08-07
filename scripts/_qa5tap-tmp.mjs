import { chromium } from 'playwright';
const B='http://localhost:3100';
const routes=['/','/about/','/speaking/','/keynote/','/reviews/','/meeting-coordinators/','/collaboration-opportunities/','/boasg/','/podcasts/','/the-business-of-agriculture/','/do-business-better-podcast/','/xtreme-ag/','/blog-news/','/acres-tv/','/blog/','/blog/eggflation-gives-producers-record-profits/','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/','/contact-us/','/join-the-conversation/'];
const b = await chromium.launch();
for (const width of [390,768]) {
const ctx = await b.newContext({viewport:{width,height:width<500?844:1024},deviceScaleFactor:1,isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
for (const r of routes) {
  const p = await ctx.newPage();
  await p.goto(B+r,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,document.body.scrollHeight);await new Promise(x=>setTimeout(x,400));window.scrollTo(0,0);});
  const bad = await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('a[href],button,summary,input,select,textarea,[role=button]').forEach(e=>{
      const rc=e.getBoundingClientRect();
      if(rc.width===0||rc.height===0) return;
      const cs=getComputedStyle(e);
      if(cs.display==='inline') return; // WCAG 2.5.8 inline exception
      if(e.closest('.sr-only')) return;
      const w=Math.round(rc.width),h=Math.round(rc.height);
      if(w<24||h<24) out.push(`${e.tagName}${e.className?'.'+String(e.className).slice(0,40):''} "${e.textContent.trim().slice(0,25)}" ${w}x${h}`);
    });
    return out;
  });
  if(bad.length) console.log(width, r, JSON.stringify(bad));
  await p.close();
}
await ctx.close();
}
await b.close();
console.log('tap done');

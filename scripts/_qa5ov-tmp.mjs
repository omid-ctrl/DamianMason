import { chromium } from 'playwright';
const B='http://localhost:3100';
const routes=['/','/about/','/speaking/','/keynote/','/reviews/','/meeting-coordinators/','/collaboration-opportunities/','/boasg/','/podcasts/','/the-business-of-agriculture/','/do-business-better-podcast/','/xtreme-ag/','/blog-news/','/acres-tv/','/blog/','/blog/eggflation-gives-producers-record-profits/','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/','/contact-us/','/join-the-conversation/'];
const b=await chromium.launch();
for(const w of [390,768,820]){
const ctx=await b.newContext({viewport:{width:w,height:w<500?844:1024},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
for(const r of routes){
  const p=await ctx.newPage();
  await p.goto(B+r,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(async()=>{await document.fonts.ready;const H=document.documentElement.scrollHeight,vh=innerHeight;for(let y=0;y<H;y+=vh){scrollTo(0,y);await new Promise(x=>setTimeout(x,80));}scrollTo(0,0);});
  const d=await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('*').forEach(c=>{
      const cs=getComputedStyle(c);
      if(!cs.display.includes('grid')&&!cs.display.includes('flex')) return;
      const kids=[...c.children].filter(k=>{const s=getComputedStyle(k);return s.position!=='absolute'&&s.position!=='fixed'&&k.getBoundingClientRect().width>0;});
      for(let i=0;i<kids.length;i++)for(let j=i+1;j<kids.length;j++){
        const a=kids[i].getBoundingClientRect(),bb=kids[j].getBoundingClientRect();
        const ox=Math.min(a.right,bb.right)-Math.max(a.left,bb.left);
        const oy=Math.min(a.bottom,bb.bottom)-Math.max(a.top,bb.top);
        if(ox>4&&oy>4){
          const ta=(kids[i].innerText||'').trim().slice(0,30), tb=(kids[j].innerText||'').trim().slice(0,30);
          if(ta&&tb) out.push(`${String(c.className).slice(0,40)} :: [${ta}] x [${tb}] ov ${Math.round(ox)}x${Math.round(oy)}`);
        }
      }
    });
    return [...new Set(out)];
  });
  if(d.length) console.log('###',w,r,'\n  '+d.join('\n  '));
  await p.close();
}
await ctx.close();
}
await b.close();
console.log('overlap sweep done');

import { chromium } from 'playwright';
const B='http://localhost:3100';
const ROUTES=['/','/about/','/speaking/','/keynote/','/reviews/','/meeting-coordinators/','/collaboration-opportunities/','/boasg/','/podcasts/','/the-business-of-agriculture/','/do-business-better-podcast/','/xtreme-ag/','/blog-news/','/acres-tv/','/blog/','/contact-us/','/join-the-conversation/'];
const b=await chromium.launch();
for (const w of [390,768]) {
  const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<700,hasTouch:true});
  const p=await c.newPage();
  console.log('\n===== width '+w+' =====');
  for (const r of ROUTES) {
    await p.goto(B+r,{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(250);
    const v=await p.evaluate(()=>[...document.querySelectorAll('.dm-statrow__list')].map(l=>{
      const items=[...l.children];
      // detect overlap between figure and label boxes inside each item
      let overlaps=0; const detail=[];
      items.forEach(it=>{
        const parts=[...it.querySelectorAll('*')].filter(e=>e.children.length===0 && e.textContent.trim());
        for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){
          const a=parts[i].getBoundingClientRect(), bb=parts[j].getBoundingClientRect();
          const ox=Math.min(a.right,bb.right)-Math.max(a.left,bb.left);
          const oy=Math.min(a.bottom,bb.bottom)-Math.max(a.top,bb.top);
          if(ox>4&&oy>4){overlaps++; detail.push([parts[i].textContent.trim().slice(0,18),parts[j].textContent.trim().slice(0,18),Math.round(ox),Math.round(oy)]);}
        }
      });
      return {count:l.getAttribute('data-count'), cols:getComputedStyle(l).gridTemplateColumns, itemW:Math.round(items[0].getBoundingClientRect().width), overlaps, detail:detail.slice(0,4)};
    }));
    if(v.length) console.log(r, JSON.stringify(v));
  }
  await c.close();
}
await b.close();

import { chromium } from 'playwright';
const B='http://localhost:3100';
const R=['/','/about/','/speaking/','/keynote/','/reviews/','/meeting-coordinators/','/collaboration-opportunities/','/boasg/','/podcasts/','/the-business-of-agriculture/','/do-business-better-podcast/','/xtreme-ag/','/blog-news/','/acres-tv/','/blog/','/contact-us/','/join-the-conversation/','/blog/eggflation-gives-producers-record-profits/','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'];
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const p=await c.newPage();
let tot=0;
console.log('--- H1 line breaks @390 + straight apostrophes ---');
for (const r of R) {
  await p.goto(B+r,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(200);
  const v=await p.evaluate(()=>{
    const h1=document.querySelector('h1');
    // per-line extraction via Range
    const lines=[]; 
    const walk=document.createTreeWalker(h1,NodeFilter.SHOW_TEXT);
    let n; const rng=document.createRange();
    while(n=walk.nextNode()){
      let start=0;
      for(let i=1;i<=n.length;i++){
        rng.setStart(n,start); rng.setEnd(n,i);
        const rects=rng.getClientRects();
        if(rects.length>1){ rng.setEnd(n,i-1); lines.push(rng.toString()); start=i-1; }
      }
      rng.setStart(n,start); rng.setEnd(n,n.length); if(rng.toString()) lines.push(rng.toString());
    }
    const straight=(document.querySelector('main').innerText.match(/[A-Za-z]'[A-Za-z]/g)||[]);
    return {h1:h1.innerText.replace(/\s+/g,' '), lines:lines.map(s=>s.trim()).filter(Boolean), straight:straight.length, sample:straight.slice(0,3)};
  });
  tot+=v.straight;
  console.log(r.padEnd(62), 'straight='+v.straight, '| lines:', JSON.stringify(v.lines));
}
console.log('\nTOTAL straight apostrophes in <main> across 19 routes:', tot);
await b.close();

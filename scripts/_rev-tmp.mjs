import { chromium } from 'playwright';
const b = await chromium.launch();
for(const w of [1440,1280,1024,768,390]){
  const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto('http://localhost:3100/reviews/',{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const s=()=>{window.scrollBy(0,window.innerHeight);y+=window.innerHeight;if(y<document.body.scrollHeight+window.innerHeight)requestAnimationFrame(s);else{window.scrollTo(0,0);r();}};s();});});
  await p.waitForTimeout(500);
  const d=await p.evaluate(()=>{
    const grid=document.querySelector('.dm-video-grid--4');
    if(!grid) return {err:'no .dm-video-grid--4'};
    const cs=getComputedStyle(grid);
    const items=[...grid.children].map(li=>{
      const r=li.getBoundingClientRect();
      const frame=li.querySelector('.dm-video-embed__frame,button,img,video,iframe');
      const img=li.querySelector('img');
      const fr=frame?frame.getBoundingClientRect():null;
      const ir=img?img.getBoundingClientRect():null;
      const ics=img?getComputedStyle(img):null;
      return {liW:Math.round(r.width),liH:Math.round(r.height),liY:Math.round(r.top),
        frameW:fr?Math.round(fr.width):null,frameH:fr?Math.round(fr.height):null,
        imgW:ir?Math.round(ir.width):null,imgH:ir?Math.round(ir.height):null,
        imgNat:img?img.naturalWidth+'x'+img.naturalHeight:null,
        objFit:ics?ics.objectFit:null,
        fillW:(ir&&fr)?+(ir.width/fr.width).toFixed(3):null,
        fillH:(ir&&fr)?+(ir.height/fr.height).toFixed(3):null,
        ratio:fr?+(fr.width/fr.height).toFixed(3):null};
    });
    return {cols:cs.gridTemplateColumns,count:items.length,rows:new Set(items.map(i=>i.liY)).size,items};
  });
  console.log('=== width',w,'===');
  console.log(JSON.stringify(d,null,1));
  await ctx.close();
}
await b.close();

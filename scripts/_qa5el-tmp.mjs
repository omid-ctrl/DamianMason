import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
const p = await ctx.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,document.body.scrollHeight);await new Promise(r=>setTimeout(r,800));window.scrollTo(0,0);await new Promise(r=>setTimeout(r,300));});
const r = await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('figure, img, video, picture, .dm-figure, [class*=figure]').forEach(e=>{
    const b=e.getBoundingClientRect();
    const y=b.y+scrollY;
    if(y>4200&&y<4800) out.push({tag:e.tagName,cls:String(e.className).slice(0,90),y:Math.round(y),w:Math.round(b.width),h:Math.round(b.height),src:e.currentSrc||e.src||'',bg:getComputedStyle(e).backgroundColor,loading:e.loading,natural:e.naturalWidth});
  });
  return out;
});
console.log(JSON.stringify(r,null,1));
await b.close();

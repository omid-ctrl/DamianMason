import { chromium } from 'playwright';
import sharp from 'sharp';
const b=await chromium.launch();
for(const [r,name] of [['/meeting-coordinators/','mc'],['/acres-tv/','acres']]){
for(const w of [390,768,1440]){
  const ctx=await b.newContext({viewport:{width:w,height:w<500?844:1024},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto('http://localhost:3100'+r,{waitUntil:'networkidle'});
  await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;const H=document.documentElement.scrollHeight,vh=innerHeight;for(let y=0;y<H;y+=vh*0.8){scrollTo(0,y);await new Promise(x=>setTimeout(x,120));}scrollTo(0,0);await new Promise(x=>setTimeout(x,500));await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const im=await p.evaluate(()=>{const i=[...document.querySelectorAll('.dm-mediaband img, [class*=mediaband] img, [class*=band] img')][0]; if(!i)return null; const rc=i.getBoundingClientRect(); return {x:Math.round(rc.x+scrollX),y:Math.round(rc.y+scrollY),w:Math.round(rc.width),h:Math.round(rc.height),src:(i.currentSrc||'').split('/').pop().slice(0,40)};});
  if(!im){console.log(name,w,'no band img'); await p.close(); await ctx.close(); continue;}
  const buf=await p.screenshot({fullPage:true});
  const st=await sharp(buf).extract({left:Math.max(0,im.x),top:Math.max(0,im.y),width:im.w,height:im.h}).greyscale().stats();
  const c=st.channels[0];
  console.log(name,w,im.w+'x'+im.h,'mean='+c.mean.toFixed(1),'max='+c.max,'sd='+c.stdev.toFixed(1));
  await p.close(); await ctx.close();
}}
await b.close();

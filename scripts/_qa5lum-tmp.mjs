import { chromium } from 'playwright';
import sharp from 'sharp';
const B='http://localhost:3100';
const routes=[['home','/'],['about','/about/'],['speaking','/speaking/'],['keynote','/keynote/'],['reviews','/reviews/'],['meeting-coordinators','/meeting-coordinators/'],['collab','/collaboration-opportunities/'],['boasg','/boasg/'],['podcasts','/podcasts/'],['boa','/the-business-of-agriculture/'],['dbb','/do-business-better-podcast/'],['xtreme-ag','/xtreme-ag/'],['blog-news','/blog-news/'],['acres-tv','/acres-tv/'],['blog','/blog/'],['eggflation','/blog/eggflation-gives-producers-record-profits/'],['climate','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],['contact','/contact-us/'],['join','/join-the-conversation/']];
const b = await chromium.launch();
for (const width of [390,768]) {
const ctx = await b.newContext({viewport:{width,height:width<500?844:1024},deviceScaleFactor:1,isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
for (const [name,path] of routes) {
  const p = await ctx.newPage();
  await p.goto(B+path,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(async()=>{await document.fonts.ready; window.scrollTo(0,document.body.scrollHeight); await new Promise(r=>setTimeout(r,600)); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,300));});
  const imgs = await p.evaluate(()=>[...document.querySelectorAll('img')].map((i,idx)=>{const r=i.getBoundingClientRect();return{idx,src:(i.currentSrc||i.src).split('/').pop().slice(0,50),x:Math.round(r.x+scrollX),y:Math.round(r.y+scrollY),w:Math.round(r.width),h:Math.round(r.height)};}).filter(o=>o.w>40&&o.h>40));
  const buf = await p.screenshot({fullPage:true});
  const meta = await sharp(buf).metadata();
  for (const im of imgs) {
    const left=Math.max(0,im.x), top=Math.max(0,im.y);
    const w=Math.min(im.w, meta.width-left), h=Math.min(im.h, meta.height-top);
    if(w<10||h<10) continue;
    const st = await sharp(buf).extract({left,top,width:w,height:h}).greyscale().stats();
    const c=st.channels[0];
    if (c.mean < 30 || c.max < 90 || c.stdev < 8)
      console.log(`${width} ${name} ${im.src} ${im.w}x${im.h} mean=${c.mean.toFixed(1)} max=${c.max} min=${c.min} sd=${c.stdev.toFixed(1)}`);
  }
  await p.close();
}
await ctx.close();
}
await b.close();
console.log('scan done');

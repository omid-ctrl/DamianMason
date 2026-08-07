import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT=process.argv[2];
const B='http://localhost:3100';
const routes=[['01-home','/'],['02-about','/about/'],['03-speaking','/speaking/'],['04-keynote','/keynote/'],['05-reviews','/reviews/'],['06-meeting-coordinators','/meeting-coordinators/'],['07-collab','/collaboration-opportunities/'],['08-boasg','/boasg/'],['09-podcasts','/podcasts/'],['10-boa','/the-business-of-agriculture/'],['11-dbb','/do-business-better-podcast/'],['12-xtreme-ag','/xtreme-ag/'],['13-blog-news','/blog-news/'],['14-acres-tv','/acres-tv/'],['15-blog','/blog/'],['16-eggflation','/blog/eggflation-gives-producers-record-profits/'],['17-climate','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],['18-contact','/contact-us/'],['19-join','/join-the-conversation/']];
fs.mkdirSync(OUT,{recursive:true});
const b = await chromium.launch();
for (const width of [390,768]) {
const ctx = await b.newContext({viewport:{width,height:width<500?844:1024},deviceScaleFactor:1,isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
for (const [name,path] of routes) {
  const p = await ctx.newPage();
  await p.goto(B+path,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(async()=>{
    document.querySelectorAll('img').forEach(i=>{i.loading='eager'; i.setAttribute('decoding','sync');});
    await document.fonts.ready;
    const H=document.documentElement.scrollHeight, vh=window.innerHeight;
    for(let y=0;y<H;y+=Math.floor(vh*0.8)){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));}
    window.scrollTo(0,H); await new Promise(r=>setTimeout(r,500));
    window.scrollTo(0,0); await new Promise(r=>setTimeout(r,300));
    await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
    await new Promise(r=>setTimeout(r,400));
  });
  const bad = await p.evaluate(()=>[...document.images].filter(i=>i.naturalWidth===0).map(i=>(i.currentSrc||i.src)));
  if(bad.length) console.log('UNPAINTED',width,name,bad);
  await p.screenshot({path:`${OUT}/${name}-${width}.png`,fullPage:true});
  await p.close();
}
await ctx.close();
}
await b.close();
console.log('done');

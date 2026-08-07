import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT='/tmp/dm-video-frames2'; fs.mkdirSync(OUT,{recursive:true});
const jobs=[
  {name:'innovation',file:'/video/dm-innovation-720p.mp4',times:[12,16,26,30,34,36,44,48,52,56,64,70,76,86,90,93.8]},
  {name:'labor',file:'/video/dm-labor-720p.mp4',times:[8,18,22,26,36,44,54,58,64,67]},
  {name:'food-waste',file:'/video/dm-food-waste-720p.mp4',times:[2,4,6,11,18,26,36,44,58,64,76,84]},
];
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});
const p=await ctx.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'load'});
for(const j of jobs){
  await p.evaluate(async(src)=>{
    document.querySelectorAll('#probe-video').forEach(n=>n.remove());
    const v=document.createElement('video'); v.id='probe-video'; v.src=src; v.muted=true; v.preload='auto';
    v.style.cssText='position:fixed;inset:0;z-index:99999;width:1280px;height:720px;background:#000';
    document.body.appendChild(v);
    await new Promise(r=>{v.onloadedmetadata=r;});
  },j.file);
  for(const t of j.times){
    await p.evaluate(async(t)=>{const v=document.getElementById('probe-video');v.currentTime=t;await new Promise(r=>{v.onseeked=r;});await new Promise(r=>setTimeout(r,120));},t);
    await p.locator('#probe-video').screenshot({path:`${OUT}/${j.name}-${String(t).padStart(5,'0')}.png`});
  }
  await p.evaluate(()=>document.getElementById('probe-video')?.remove());
}
await b.close(); console.log('ok');

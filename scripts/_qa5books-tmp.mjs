import { chromium } from 'playwright';
import sharp from 'sharp';
const b = await chromium.launch();
for (const w of [390,768,1024,1440]) {
  const ctx = await b.newContext({viewport:{width:w,height:w<500?844:1024},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p = await ctx.newPage();
  await p.goto('http://localhost:3100/about/',{waitUntil:'networkidle'});
  await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;const H=document.documentElement.scrollHeight,vh=innerHeight;for(let y=0;y<H;y+=vh*0.8){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);await new Promise(r=>setTimeout(r,400));await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const imgs = await p.evaluate(()=>[...document.querySelectorAll('[class*=ookCover] img, [class*=ook] img')].map(i=>{const r=i.getBoundingClientRect();return{alt:i.alt.slice(0,40),src:(i.currentSrc||'').split('/').pop().slice(0,60),x:Math.round(r.x+scrollX),y:Math.round(r.y+scrollY),w:Math.round(r.width),h:Math.round(r.height)};}));
  const buf = await p.screenshot({fullPage:true});
  const meta = await sharp(buf).metadata();
  const out=[];
  for(const im of imgs){
    const {data,info} = await sharp(buf).extract({left:im.x,top:im.y,width:Math.min(im.w,meta.width-im.x),height:Math.min(im.h,meta.height-im.y)}).raw().toBuffer({resolveWithObject:true});
    // find bbox of non-background pixels (bg = the page ground, sample corner)
    const ch=info.channels; const bg=[data[0],data[1],data[2]];
    let minX=1e9,maxX=-1,minY=1e9,maxY=-1;
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const o=(y*info.width+x)*ch;
      if(Math.abs(data[o]-bg[0])>12||Math.abs(data[o+1]-bg[1])>12||Math.abs(data[o+2]-bg[2])>12){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
    out.push(`${im.alt.padEnd(30)} box ${im.w}x${im.h} @${im.x},${im.y}  painted ${maxX-minX+1}x${maxY-minY+1}`);
  }
  console.log('=== '+w); console.log(out.join('\n'));
  await p.close(); await ctx.close();
}
await b.close();

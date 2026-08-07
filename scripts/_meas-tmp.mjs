import { chromium } from 'playwright';
const b = await chromium.launch();
const out={};

async function shot(url,w,h,fn,name){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.waitForTimeout(400);
  out[name]=await p.evaluate(fn);
  await ctx.close();
}

// 1. CTA band overlap at 768
for(const w of [768,1024,1280]){
  await shot('http://localhost:3100/keynote/',w,900,()=>{
    const band=document.querySelector('.dm-ctaband'); if(!band) return 'no ctaband';
    const kids=[...band.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim());
    const boxes=kids.map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent.trim().slice(0,30),x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),b:Math.round(r.bottom),r:Math.round(r.right)};});
    // detect overlaps between sibling text boxes
    const ov=[];
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const A=boxes[i],B=boxes[j];
      const ix=Math.min(A.r,B.r)-Math.max(A.x,B.x);
      const iy=Math.min(A.b,B.b)-Math.max(A.y,B.y);
      if(ix>2&&iy>2) ov.push({a:A.t,b:B.t,ix,iy});
    }
    const cs=getComputedStyle(band);
    return {bandW:Math.round(band.getBoundingClientRect().width),boxes,overlaps:ov};
  },'ctaband-'+w);
}

// 2. reviews video figures
await shot('http://localhost:3100/reviews/',1440,900,()=>{
  const figs=[...document.querySelectorAll('figure')].filter(f=>f.querySelector('iframe,video,img'));
  return figs.map(f=>{const r=f.getBoundingClientRect();const m=f.querySelector('iframe,video,img');const mr=m.getBoundingClientRect();
    return {figW:Math.round(r.width),figH:Math.round(r.height),figY:Math.round(r.top),mediaW:Math.round(mr.width),mediaH:Math.round(mr.height),tag:m.tagName,fillW:+(mr.width/r.width).toFixed(3),fillH:+(mr.height/r.height).toFixed(3)};});
},'reviews-figs');

// 3. about book covers
await shot('http://localhost:3100/about/',1440,900,()=>{
  const imgs=[...document.querySelectorAll('img')].filter(i=>/book|cover|jacket|food-fear|do-business/i.test(i.src+i.alt));
  return imgs.map(i=>{const r=i.getBoundingClientRect();return{alt:i.alt.slice(0,40),src:i.src.split('/').pop().slice(0,50),w:Math.round(r.width),h:Math.round(r.height),y:Math.round(r.top),optical:Math.round(Math.sqrt(r.width*r.height))};});
},'about-books');

// 4. keynote fig 04
await shot('http://localhost:3100/keynote/',1440,900,()=>{
  const figs=[...document.querySelectorAll('figure')];
  return figs.map((f,idx)=>{const img=f.querySelector('img');if(!img)return null;const r=img.getBoundingClientRect();const cs=getComputedStyle(img);
    return {idx,alt:img.alt.slice(0,50),src:img.src.split('/').pop().slice(0,45),objectFit:cs.objectFit,objectPosition:cs.objectPosition,w:Math.round(r.width),h:Math.round(r.height),natural:img.naturalWidth+'x'+img.naturalHeight,cutline:(f.querySelector('figcaption')?.textContent||'').trim().slice(0,60)};}).filter(Boolean);
},'keynote-figs');

// 5. logo wall at 390
await shot('http://localhost:3100/',390,844,()=>{
  const imgs=[...document.querySelectorAll('.dm-logo-cell__img, .dm-logo-cell img')];
  const m=imgs.map(i=>{const r=i.getBoundingClientRect();return{alt:i.alt.slice(0,28),w:+r.width.toFixed(1),h:+r.height.toFixed(1),opt:+Math.sqrt(r.width*r.height).toFixed(1)};});
  const opts=m.map(x=>x.opt).filter(x=>x>0);
  return {count:m.length,minOpt:Math.min(...opts),maxOpt:Math.max(...opts),spread:+(Math.max(...opts)/Math.min(...opts)).toFixed(3),minH:Math.min(...m.map(x=>x.h)),maxH:Math.max(...m.map(x=>x.h)),items:m};
},'logowall-390');

await b.close();
console.log(JSON.stringify(out,null,2));

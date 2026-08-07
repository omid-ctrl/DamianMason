import { chromium } from 'playwright';
const OUT=process.argv[2];
const b = await chromium.launch();
for (const [w,h] of [[390,844],[390,667],[768,1024],[360,780]]) {
  const ctx = await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p = await ctx.newPage();
  await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
  await p.getByRole('button',{name:/menu/i}).first().click();
  await p.waitForTimeout(600);
  const scrollers = await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('*').forEach(e=>{
      if(e.scrollHeight>e.clientHeight+2){const cs=getComputedStyle(e);out.push({cls:String(e.className).slice(0,60),tag:e.tagName,sh:e.scrollHeight,ch:e.clientHeight,oy:cs.overflowY});}
    });
    return out;
  });
  const before = await p.evaluate(()=>{const g=t=>{const a=[...document.querySelectorAll('.dm-menu a')].find(x=>x.textContent.trim()===t); if(!a)return null; const r=a.getBoundingClientRect(); return {y:Math.round(r.y),bottom:Math.round(r.bottom),vh:window.innerHeight};}; return {About:g('About'),Contact:g('Contact Us'),footTop:(()=>{const f=document.querySelector('.dm-menu__foot,[class*=menu][class*=foot]');return f?Math.round(f.getBoundingClientRect().top):null;})()};});
  // try wheel over the list
  await p.mouse.move(w/2, h/2);
  await p.mouse.wheel(0, 800);
  await p.waitForTimeout(500);
  const after = await p.evaluate(()=>{const g=t=>{const a=[...document.querySelectorAll('.dm-menu a')].find(x=>x.textContent.trim()===t); if(!a)return null; const r=a.getBoundingClientRect(); return {y:Math.round(r.y),bottom:Math.round(r.bottom)};}; return {About:g('About'),Contact:g('Contact Us')};});
  console.log(`--- ${w}x${h} scrollers=${JSON.stringify(scrollers)}`);
  console.log('  before',JSON.stringify(before));
  console.log('  afterWheel',JSON.stringify(after));
  await p.screenshot({path:`${OUT}/nav2-${w}x${h}.png`});
  await p.close(); await ctx.close();
}
await b.close();

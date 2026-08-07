import { chromium } from 'playwright';
const args = Object.fromEntries(process.argv.slice(2).reduce((a,x,i,arr)=>{if(x.startsWith('--'))a.push([x.slice(2),arr[i+1]]);return a;},[]));
const b = await chromium.launch();
const ctx = await b.newContext({viewport:{width:+args.w||1440,height:+args.h||1000},deviceScaleFactor:1,reducedMotion:'reduce',isMobile:(+args.w||1440)<500,hasTouch:(+args.w||1440)<500});
const p = await ctx.newPage();
await p.route('**/*',(r)=>{const u=new URL(r.request().url()); return u.hostname==='localhost'?r.continue():r.abort();});
await p.goto(args.url,{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForTimeout(1200);
if (args.sel) {
  const el = p.locator(args.sel).first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  await el.screenshot({path:args.out});
} else {
  await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));} window.scrollTo(0,0);});
  await p.waitForTimeout(600);
  await p.screenshot({path:args.out,fullPage:args.full==='true'});
}
await b.close();
console.log('shot',args.out);

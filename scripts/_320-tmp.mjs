import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:320,height:700},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
const p=await ctx.newPage();
await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'networkidle',timeout:60000});
await p.evaluate(()=>document.fonts?.ready); await p.waitForTimeout(400);
await p.screenshot({path:'docs/qa/screenshots/final/meeting-coordinators-320-hero.png'});
await b.close();

import { chromium } from 'playwright';
const b = await chromium.launch();
const OUT='docs/qa/screenshots/final';
for(const [w,h,tag] of [[390,664,'390x664'],[390,844,'390x844'],[360,640,'360x640']]){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto('http://localhost:3100/',{waitUntil:'networkidle',timeout:60000});
  await p.evaluate(()=>document.fonts?.ready);
  await p.waitForTimeout(300);
  // open the menu
  const btn = await p.$('.dm-masthead__menu, [aria-controls*="menu"], button[aria-expanded]');
  if(!btn){ console.log(tag,'NO MENU BUTTON'); await ctx.close(); continue; }
  await btn.click();
  await p.waitForTimeout(600);
  await p.screenshot({path:`${OUT}/mobile-nav-open-${tag}.png`});
  const d=await p.evaluate(()=>{
    const sheet=document.querySelector('.dm-mobile-nav, [role="dialog"], .dm-masthead__sheet');
    if(!sheet) return {err:'no sheet'};
    const sr=sheet.getBoundingClientRect();
    const vh=window.innerHeight;
    // top-level rows
    const rows=[...sheet.querySelectorAll('a,button')].map(e=>{
      const r=e.getBoundingClientRect();
      return {t:(e.textContent||'').trim().slice(0,34),y:Math.round(r.top),b:Math.round(r.bottom),h:Math.round(r.height),
        visibleAtRest: r.top>=0 && r.bottom<=vh+0.5, tag:e.tagName,
        expanded:e.getAttribute('aria-expanded')};
    });
    return {vh, sheetH:Math.round(sr.height), sheetScrollH:sheet.scrollHeight, sheetClientH:sheet.clientHeight,
      scrolls: sheet.scrollHeight>sheet.clientHeight+1, rows};
  });
  console.log('=== ',tag,' ===');
  console.log('viewportH',d.vh,'sheetH',d.sheetH,'scrollH',d.sheetScrollH,'clientH',d.sheetClientH,'scrolls',d.scrolls);
  console.log('rows visible at rest:', d.rows.filter(r=>r.visibleAtRest).length,'/',d.rows.length);
  for(const r of d.rows) console.log('   ',r.visibleAtRest?'OK ':'OFF', String(r.y).padStart(5), r.tag.padEnd(7), r.t, r.expanded?('aria-expanded='+r.expanded):'');
  await ctx.close();
}
await b.close();

import { chromium } from 'playwright';
const OUT=process.argv[2];
const b = await chromium.launch();
for (const w of [390,768]) {
  const ctx = await b.newContext({viewport:{width:w,height:w<500?844:1024},deviceScaleFactor:2,isMobile:w<500,hasTouch:w<500,reducedMotion:'reduce'});
  const p = await ctx.newPage();
  await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
  await p.getByRole('button',{name:/menu/i}).first().click();
  await p.waitForTimeout(700);
  const info = await p.evaluate(()=>{
    const panel = document.querySelector('#site-menu, [class*=menu][class*=panel], .dm-menu') || document.querySelector('[role=dialog]');
    const links=[...document.querySelectorAll('a,button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent.trim().slice(0,40),href:e.getAttribute('href'),y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),inView:r.bottom<=window.innerHeight&&r.top>=0};});
    const sc = panel?{cls:panel.className,scrollH:panel.scrollHeight,clientH:panel.clientHeight,overflowY:getComputedStyle(panel).overflowY}:null;
    return {links,sc,bodyOverflow:getComputedStyle(document.body).overflow};
  });
  console.log('=== width',w, JSON.stringify(info.sc), 'bodyOverflow',info.bodyOverflow);
  console.log(info.links.map(l=>`${l.inView?' ':'X'} ${String(l.h).padStart(3)}h ${String(l.w).padStart(3)}w y=${String(l.y).padStart(5)} ${l.t} -> ${l.href}`).join('\n'));
  // scroll the panel to bottom
  await p.evaluate(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+5 && getComputedStyle(e).overflowY!=='visible' && e.clientHeight>200); if(el) el.scrollTop=el.scrollHeight;});
  await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/nav-scrolled-${w}.png`});
  await p.close(); await ctx.close();
}
await b.close();

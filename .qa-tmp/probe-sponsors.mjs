import { chromium } from 'playwright';
const b=await chromium.launch();
for (const w of [390,768]) {
const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<700,hasTouch:true});
const p=await c.newPage();
await p.goto('http://localhost:3100/the-business-of-agriculture/',{waitUntil:'networkidle'});
await p.evaluate(async()=>{const H=document.documentElement.scrollHeight;for(let y=0;y<H;y+=600){window.scrollTo(0,y);await new Promise(s=>setTimeout(s,110));}});
await p.waitForTimeout(800);
const v=await p.evaluate(()=>{const g=[...document.querySelectorAll('.dm-logowall__grid')].pop();
 return {cols:getComputedStyle(g).gridTemplateColumns,n:g.children.length,marks:[...g.children].map(cl=>{const i=cl.querySelector('img');const r=i.getBoundingClientRect();const cr=cl.getBoundingClientRect();return{a:i.alt.slice(0,26),rw:Math.round(r.width),rh:Math.round(r.height),cell:[Math.round(cr.width),Math.round(cr.height)]};})};});
console.log('@'+w, v.cols, 'n='+v.n);
v.marks.forEach(m=>console.log('  ',m.a.padEnd(28), (m.rw+'x'+m.rh).padEnd(9), 'cell', m.cell.join('x')));
await c.close();
}
await b.close();

import { chromium } from 'playwright';
const b=await chromium.launch();
const res=[];
for(let w=760; w<=1100; w+=20){
  const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto('http://localhost:3100/meeting-coordinators/',{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>document.fonts.ready);
  const d=await p.evaluate(()=>{
    const g=document.querySelector('.dm-ctaband__grid');
    const body=g.querySelector('.dm-ctaband__body'), panel=g.querySelector('.dm-ctaband__panel');
    const bb=body.getBoundingClientRect(), pb=panel.getBoundingClientRect();
    const sameRow=!(bb.bottom<=pb.top+1||pb.bottom<=bb.top+1);
    return {ov:Math.round(bb.right-pb.left), sameRow, panelW:Math.round(pb.width)};
  });
  res.push(`${w}: sameRow=${d.sameRow} overlap=${d.ov} panelW=${d.panelW}`);
  await p.close(); await ctx.close();
}
console.log(res.join('\n'));
await b.close();

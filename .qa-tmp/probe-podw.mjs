import { chromium } from 'playwright';
const b=await chromium.launch();
for (const w of [320,360,375,390,414,430,600,700,767,768]) {
  const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<700,hasTouch:true});
  const p=await c.newPage();
  await p.goto('http://localhost:3100/podcasts/',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(200);
  const v=await p.evaluate(()=>{
    const l=document.querySelector('.dm-statrow__list');
    const it=l.children[0]; const st=it.querySelector('.dm-stat');
    const fig=st.querySelector('.dm-stat__figure'), lab=st.querySelector('.dm-stat__label');
    return {cols:getComputedStyle(l).gridTemplateColumns, itemW:Math.round(it.getBoundingClientRect().width),
      figRight:Math.round(fig.getBoundingClientRect().right), itemRight:Math.round(it.getBoundingClientRect().right),
      labelW:Math.round(lab.getBoundingClientRect().width), overflow:st.scrollWidth-st.clientWidth};
  });
  console.log(w, JSON.stringify(v));
  await c.close();
}
await b.close();

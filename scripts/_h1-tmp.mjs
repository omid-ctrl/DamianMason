import { chromium } from 'playwright';
import fs from 'node:fs';
const targets = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const b = await chromium.launch();
const bad=[];
for (const w of [1024,1100,1200,1280,1366,1440,1536,1600]) {
  const ctx = await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  for (const t of targets) {
    const p = await ctx.newPage();
    await p.goto(t.url,{waitUntil:'domcontentloaded',timeout:60000});
    await p.evaluate(()=>document.fonts?.ready);
    await p.waitForTimeout(200);
    const d = await p.evaluate(()=>{
      const h1=document.querySelector('h1'); if(!h1) return null;
      const cs=getComputedStyle(h1);
      // detect hyphenation / mid-word break: compare rendered line count vs word-boundary wrap
      const r=h1.getBoundingClientRect();
      const txt=h1.textContent.trim();
      // measure each word; if any single word is wider than the box, it must break mid-word
      const probe=document.createElement('span');
      probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;';
      probe.style.font=cs.font; probe.style.fontFamily=cs.fontFamily; probe.style.fontSize=cs.fontSize;
      probe.style.fontWeight=cs.fontWeight; probe.style.letterSpacing=cs.letterSpacing;
      document.body.appendChild(probe);
      let widest=0,widestWord='';
      for(const word of txt.split(/\s+/)){ probe.textContent=word; const ww=probe.getBoundingClientRect().width; if(ww>widest){widest=ww;widestWord=word;} }
      probe.remove();
      return {txt, boxW:+r.width.toFixed(1), contentW:h1.scrollWidth, clientW:h1.clientWidth,
              hyphens:cs.hyphens, wordBreak:cs.wordBreak, overflowWrap:cs.overflowWrap,
              widestWord, widestWordW:+widest.toFixed(1), overflows:h1.scrollWidth>h1.clientWidth+0.5};
    });
    if(d && (d.overflows || d.widestWordW > d.clientW)) bad.push({name:t.name,w,...d});
    await p.close();
  }
  await ctx.close();
}
await b.close();
console.log(bad.length? JSON.stringify(bad,null,2):'No H1 overflow or mid-word break risk at 1024-1600');

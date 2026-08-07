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
      // Walk the text node's client rects = one rect per rendered line.
      const walker=document.createTreeWalker(h1,NodeFilter.SHOW_TEXT);
      const lines=[];
      while(walker.nextNode()){
        const n=walker.currentNode;
        if(!n.textContent.trim()) continue;
        const rng=document.createRange();
        // find character index at each line start by measuring per-character rects
        rng.selectNodeContents(n);
        const rects=[...rng.getClientRects()];
        // reconstruct text per line by char offsets
        const txt=n.textContent;
        let cur=null;
        for(let i=0;i<txt.length;i++){
          const r2=document.createRange(); r2.setStart(n,i); r2.setEnd(n,i+1);
          const rr=r2.getBoundingClientRect();
          if(!cur || Math.abs(rr.top-cur.top)>2){ cur={top:rr.top,chars:''}; lines.push(cur); }
          cur.chars+=txt[i];
        }
      }
      const src=h1.textContent;
      const breaks=[];
      for(let i=0;i<lines.length-1;i++){
        const endsWith=lines[i].chars.replace(/\s+$/,'').slice(-1);
        const nextStart=lines[i+1].chars.replace(/^\s+/,'').slice(0,1);
        const lineEndTrim=lines[i].chars.trim();
        // mid-word break: line ends with a hyphen that is NOT present in the source at that position,
        // or line ends with a letter and next line starts with a letter with no space between them in source
        const joined=lineEndTrim+nextStart;
        if(endsWith==='-' && !src.includes(lineEndTrim.slice(-6))) breaks.push({line:i,ends:lineEndTrim.slice(-12),next:lines[i+1].chars.trim().slice(0,12),reason:'soft-hyphen'});
        else if(/[A-Za-z]/.test(endsWith) && /[A-Za-z]/.test(nextStart)){
          const a=lineEndTrim.slice(-8), bnext=lines[i+1].chars.trim().slice(0,8);
          if(src.includes(a+bnext)) breaks.push({line:i,ends:a,next:bnext,reason:'no-space-split'});
        }
      }
      return {txt:src.trim(), lineCount:lines.length, lines:lines.map(l=>l.chars), breaks, overflows:h1.scrollWidth>h1.clientWidth+0.5};
    });
    if(d && (d.breaks.length || d.overflows)) bad.push({name:t.name,w,txt:d.txt,lines:d.lines,breaks:d.breaks,overflows:d.overflows});
    await p.close();
  }
  await ctx.close();
  console.log('w',w,'done');
}
await b.close();
console.log(bad.length? JSON.stringify(bad,null,2):'CLEAN: no H1 mid-word break or overflow at 1024/1100/1200/1280/1366/1440/1536/1600');

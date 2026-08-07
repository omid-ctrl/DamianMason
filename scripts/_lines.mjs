import { chromium } from 'playwright';
const b = await chromium.launch();
const targets = JSON.parse(process.argv[2]);
const sel = process.argv[3] || '.dm-hero__title';
for (const [url,name] of targets) {
  for (const w of [1024,1200,1300,1440,1600]) {
    const ctx = await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    const p = await ctx.newPage();
    await p.route('**/*',(r)=>{const u=new URL(r.request().url()); return u.hostname==='localhost'?r.continue():r.abort();});
    await p.goto('http://localhost:3100'+url,{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(350);
    const lines = await p.evaluate((sel)=>{
      const h1=document.querySelector(sel); if(!h1) return null;
      const r=document.createRange();
      const walker=document.createTreeWalker(h1,NodeFilter.SHOW_TEXT);
      const out=[]; let cur=null;
      while(walker.nextNode()){ const n=walker.currentNode;
        for(let i=0;i<n.length;i++){ r.setStart(n,i); r.setEnd(n,i+1);
          const rect=r.getBoundingClientRect(); if(!rect.height) continue;
          const top=Math.round(rect.top);
          if(!cur||Math.abs(cur.top-top)>4){cur={top,text:'',w:0};out.push(cur);}
          cur.text+=n.data[i]; cur.w=Math.max(cur.w, Math.round(rect.right));
        } }
      const box=h1.getBoundingClientRect();
      return {track:Math.round(box.width), fs:getComputedStyle(h1).fontSize, lines: out.map(l=>l.text.trim()+' ['+Math.round(l.w-box.left)+']')};
    }, sel);
    console.log(name.padEnd(12), w, JSON.stringify(lines));
    await ctx.close();
  }
}
await b.close();

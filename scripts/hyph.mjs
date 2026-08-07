/**
 * Reports any heading word that breaks across lines, at the five widths where
 * the hero type track is narrowest relative to its content.
 *
 *   node scripts/hyph.mjs [--base http://localhost:3100]
 *
 * This is the gate for --fs-6xl-hero. That token is fitted to the longest
 * single word in any H1, and "fitted" has to mean measured: a display face
 * swap changes every glyph advance on the site, so the old ceiling is evidence
 * about the old face and nothing more.
 *
 * Reports two kinds and exits non-zero on only one of them. A CHOP is a word
 * split with no hyphen to justify it, and that is the gate: it must be 0. A
 * HYPHEN is a token breaking at a real hyphen it already contained, which is
 * correct typography and is printed for review rather than failed.
 *
 * Conflating the two is what made this tool over-report for the project's whole
 * life: it counted whitespace-delimited tokens spanning more than one client
 * rect, so "Co-Creation," setting as "Co-" / "Creation," looked identical to a
 * headline being chopped in half.
 *
 * --base exists because the production server is what should be measured. The
 * dev server compiles on demand and its first paint can be a different layout.
 */
import { chromium } from 'playwright';
const BASE=(process.argv.find((a,i,arr)=>arr[i-1]==='--base'))??'http://localhost:3100';
const ROUTES=['/','/about/','/acres-tv/','/blog/','/blog-news/','/boasg/','/collaboration-opportunities/','/contact-us/','/do-business-better-podcast/','/join-the-conversation/','/keynote/','/meeting-coordinators/','/podcasts/','/reviews/','/speaking/','/the-business-of-agriculture/','/xtreme-ag/'];
let chops=0,hyphens=0;
const b=await chromium.launch();
for(const W of [1024,1200,1280,1380,1440]){
 const ctx=await b.newContext({viewport:{width:W,height:900}});
 const p=await ctx.newPage();
 await p.route('**/*',r=>new URL(r.request().url()).hostname==='localhost'?r.continue():r.abort());
 for(const route of ROUTES){
  await p.goto(BASE+route,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(280);
  const hits=await p.evaluate(()=>{
   const out=[];
   document.querySelectorAll('#main h1,#main h2,#main h3').forEach(h=>{
    const w=document.createTreeWalker(h,NodeFilter.SHOW_TEXT); let n;
    while((n=w.nextNode())){
     const t=n.textContent; let i=0;
     while(i<t.length){
      while(i<t.length&&/\s/.test(t[i]))i++;
      const s=i; while(i<t.length&&!/\s/.test(t[i]))i++;
      if(i>s){const r=document.createRange();r.setStart(n,s);r.setEnd(n,i);
       const rects=r.getClientRects();
       if(rects.length>1){
        /* CLASSIFY THE BREAK, because "this token spans two lines" and "this
           word was chopped in half" are not the same finding and only one of
           them is a defect.

           A token containing a real hyphen is SUPPOSED to be breakable there:
           "Co-Creation," setting as "Co-" / "Creation," is correct typography.
           A token with no hyphen splitting across lines, or one splitting
           anywhere other than at its hyphen, is a chop.

           Measure where the first rect ends and compare it against the width of
           the text up to and including each hyphen. Reporting these as one
           number is what made this tool over-report for the whole project. */
        const word=t.slice(s,i);
        let atHyphen=false;
        for(let k=0;k<word.length;k++){
         if(word[k]!=='-'&&word[k]!=='‐')continue;
         const rg=document.createRange();rg.setStart(n,s);rg.setEnd(n,s+k+1);
         const cr=rg.getClientRects();
         const wUpToHyphen=cr.length?cr[0].width:0;
         if(Math.abs(wUpToHyphen-rects[0].width)<1.5){atHyphen=true;break;}
        }
        out.push({tag:h.tagName,word,head:h.textContent.trim().slice(0,60),kind:atHyphen?'HYPHEN':'CHOP'});
       }}
     }
    }
   });
   return out;
  });
  hits.forEach(h=>{
  if(h.kind==='CHOP')chops++;else hyphens++;
  console.log(W,route,h.tag,h.kind,JSON.stringify(h.word),'in',JSON.stringify(h.head));
 });
 }
 await ctx.close();
}
await b.close();
console.log(`\nCHOP ${chops}   (mid-word breaks. THE GATE. Must be 0.)`);
console.log(`HYPHEN ${hyphens}   (breaks at a real hyphen. Correct typography, reported for review.)`);
process.exit(chops>0?1:0);

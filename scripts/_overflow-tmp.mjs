import { chromium } from 'playwright';
const routes=['/','/about/','/acres-tv/','/blog-news/','/blog/','/boasg/','/collaboration-opportunities/','/contact-us/','/do-business-better-podcast/','/join-the-conversation/','/keynote/','/meeting-coordinators/','/podcasts/','/reviews/','/speaking/','/the-business-of-agriculture/','/xtreme-ag/'];
const b=await chromium.launch(); let bad=0;
for(const w of [320,390,768,1024,1440]){
 const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1,reducedMotion:'reduce',isMobile:w<500,hasTouch:w<500});
 const p=await ctx.newPage();
 await p.route('**/*',(r)=>{const u=new URL(r.request().url());return u.hostname==='localhost'?r.continue():r.abort();});
 for(const r of routes){
  await p.goto('http://localhost:3100'+r,{waitUntil:'load',timeout:90000});
  await p.waitForTimeout(500);
  const res=await p.evaluate((vw)=>{
    const doc=document.documentElement;
    const over=[...document.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.right>vw+1||b.left<-1);}).slice(0,4).map(e=>e.tagName+'.'+(typeof e.className==='string'?e.className.slice(0,50):''));
    return {sw:doc.scrollWidth, cw:doc.clientWidth, over};
  },w);
  if(res.sw>res.cw+1||res.over.length){bad++;console.log('OVERFLOW',w,r,res.sw,res.cw,JSON.stringify(res.over));}
 }
 await ctx.close();
}
await b.close();
console.log(bad===0?'NO HORIZONTAL OVERFLOW at 320/390/768/1024/1440':'FAILURES: '+bad);

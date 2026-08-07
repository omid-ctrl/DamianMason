import { chromium } from 'playwright';
const routes=['/','/about/','/acres-tv/','/blog-news/','/blog/','/boasg/','/collaboration-opportunities/','/contact-us/','/do-business-better-podcast/','/join-the-conversation/','/keynote/','/meeting-coordinators/','/podcasts/','/reviews/','/speaking/','/the-business-of-agriculture/','/xtreme-ag/'];
const b=await chromium.launch(); let bad=0;
for(const w of [320,390,768,1024,1440]){
 const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1,reducedMotion:'reduce',isMobile:w<500,hasTouch:w<500});
 const p=await ctx.newPage();
 await p.route('**/*',(r)=>{const u=new URL(r.request().url());return u.hostname==='localhost'?r.continue():r.abort();});
 for(const r of routes){
  await p.goto('http://localhost:3100'+r,{waitUntil:'load',timeout:90000});
  await p.waitForTimeout(1200);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0);});
  await p.waitForTimeout(600);
  const res=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bsw:document.body.scrollWidth}));
  if(res.sw>res.cw+1){bad++;console.log('OVERFLOW',w,r,JSON.stringify(res));}
 }
 await ctx.close();
}
await b.close();
console.log(bad===0?'PASS: no document horizontal overflow at 320/390/768/1024/1440':'FAILURES: '+bad);

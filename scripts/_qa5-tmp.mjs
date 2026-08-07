import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2];
const B='http://localhost:3100';
const routes = [
 ['01-home','/'],
 ['02-about','/about/'],
 ['03-speaking','/speaking/'],
 ['04-keynote','/keynote/'],
 ['05-reviews','/reviews/'],
 ['06-meeting-coordinators','/meeting-coordinators/'],
 ['07-collab','/collaboration-opportunities/'],
 ['08-boasg','/boasg/'],
 ['09-podcasts','/podcasts/'],
 ['10-boa','/the-business-of-agriculture/'],
 ['11-dbb','/do-business-better-podcast/'],
 ['12-xtreme-ag','/xtreme-ag/'],
 ['13-blog-news','/blog-news/'],
 ['14-acres-tv','/acres-tv/'],
 ['15-blog','/blog/'],
 ['16-blog-eggflation','/blog/eggflation-gives-producers-record-profits/'],
 ['17-blog-climate','/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],
 ['18-contact','/contact-us/'],
 ['19-join','/join-the-conversation/'],
];
fs.mkdirSync(OUT,{recursive:true});
const browser = await chromium.launch();
const report=[];
for (const width of [390,768]) {
  const ctx = await browser.newContext({viewport:{width,height:width<500?844:1024},deviceScaleFactor:1,isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
  for (const [name,path] of routes) {
    const page = await ctx.newPage();
    const errs=[],fails=[];
    page.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200));});
    page.on('requestfailed',r=>fails.push(`FAIL ${r.url()}`));
    page.on('response',r=>{if(r.status()>=400)fails.push(`${r.status()} ${r.url()}`);});
    let status='ok';
    try{
      const res=await page.goto(B+path,{waitUntil:'networkidle',timeout:60000});
      if(res&&res.status()>=400) status='http '+res.status();
      await page.evaluate(async()=>{await document.fonts.ready; window.scrollTo(0,document.body.scrollHeight); await new Promise(r=>setTimeout(r,600)); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,400));});
      await page.screenshot({path:`${OUT}/${name}-${width}.png`,fullPage:true});
      const m = await page.evaluate(()=>({
        h1: [...document.querySelectorAll('h1')].map(e=>e.textContent.trim()),
        docW: document.documentElement.scrollWidth,
        winW: window.innerWidth,
        overflow: [...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.right > window.innerWidth+1 || r.left < -1);}).slice(0,10).map(e=>`${e.tagName}.${e.className&&e.className.baseVal===undefined?String(e.className).slice(0,50):''} r=${Math.round(e.getBoundingClientRect().right)} l=${Math.round(e.getBoundingClientRect().left)}`),
        brokenImgs: [...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc||i.src),
        height: document.documentElement.scrollHeight,
      }));
      report.push({name,width,status,errs,fails,...m});
    }catch(e){report.push({name,width,status:'ERR '+e.message});}
    await page.close();
  }
  await ctx.close();
}
// nav sheet open at 390
{
  const ctx = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  for (const w of [390,768]) {
    const c2 = w===390?ctx:await browser.newContext({viewport:{width:768,height:1024},deviceScaleFactor:1,reducedMotion:'reduce'});
    const page = await c2.newPage();
    await page.goto(B+'/',{waitUntil:'networkidle'});
    const btn = await page.$('button[aria-controls], button[aria-expanded]');
    const info = await page.evaluate(()=>[...document.querySelectorAll('button')].map(b=>({t:b.textContent.trim().slice(0,40),ac:b.getAttribute('aria-controls'),ae:b.getAttribute('aria-expanded'),vis:b.getBoundingClientRect().width>0})));
    fs.writeFileSync(`${OUT}/nav-buttons-${w}.json`,JSON.stringify(info,null,2));
    try{
      await page.getByRole('button',{name:/menu/i}).first().click();
      await page.waitForTimeout(700);
    }catch(e){ console.log('menu click fail',w,e.message); }
    await page.screenshot({path:`${OUT}/nav-open-${w}.png`,fullPage:false});
    await page.screenshot({path:`${OUT}/nav-open-full-${w}.png`,fullPage:true});
    await page.close();
    if(w!==390) await c2.close();
  }
  await ctx.close();
}
fs.writeFileSync(`${OUT}/report.json`,JSON.stringify(report,null,2));
await browser.close();
console.log('done');

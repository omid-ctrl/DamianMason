import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:1000}, deviceScaleFactor:1, reducedMotion:'reduce' });
const p = await ctx.newPage();
await p.route('**/*',(r)=>{const u=new URL(r.request().url());return u.hostname==='localhost'?r.continue():r.abort();});
for (const v of ['50% 22%','58% 22%','63% 22%','68% 22%']) {
  await p.goto('http://localhost:3100/podcasts/',{waitUntil:'load',timeout:90000});
  await p.waitForTimeout(1200);
  await p.addStyleTag({content:`.dm-photo--portrait .dm-photo__img{object-position:${v} !important}`});
  await p.waitForTimeout(400);
  const el = p.locator('.dm-photo--portrait').first();
  await el.screenshot({path:`/tmp/dm-photo-qa/focal-${v.replace(/[% ]/g,'')}.png`});
}
await b.close();
console.log('ok');

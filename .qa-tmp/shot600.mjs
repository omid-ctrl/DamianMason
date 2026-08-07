import { chromium } from 'playwright';
const b=await chromium.launch();
for (const w of [600,767]) {
  const c=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:2});
  const p=await c.newPage();
  await p.goto('http://localhost:3100/podcasts/',{waitUntil:'networkidle'});
  const el=await p.$('.dm-statrow'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await el.screenshot({path:`/Users/omidebrahimi/Desktop/Projects/DamianMason/docs/qa/screenshots/round-1-mobile/zz-podcasts-ledger-${w}.png`});
  await c.close();
}
await b.close();

import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1200 }, reducedMotion: 'reduce' });
const p = await ctx.newPage();
await p.goto('http://localhost:3100/about/#books', { waitUntil: 'networkidle' });
await p.evaluate(() => document.querySelector('#books').scrollIntoView());
await p.waitForTimeout(1500);
await (await p.$('#books')).screenshot({ path: '/private/tmp/claude-501/-Users-omidebrahimi-Desktop-Projects-DamianMason/f31ff1f7-a7ba-41b5-898b-561b9ce2cbed/scratchpad/books-1440.png' });
await b.close();

import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://localhost:3210/speaking/', { waitUntil: 'load' });
console.log('JS OFF /speaking/', JSON.stringify(await p.evaluate(() => ({
  stateTiles: [...document.querySelectorAll('.dm-coverage__tile')].filter(t => t.textContent.trim()).length,
  blankTiles: document.querySelectorAll('.dm-coverage__tile--blank').length,
  tilePainted: getComputedStyle(document.querySelector('.dm-coverage__tile')).borderTopWidth,
  cutlineVisible: document.querySelector('.dm-coverage__figure figcaption').getBoundingClientRect().height > 0,
  sectorRows: document.querySelectorAll('.dm-sectors__row').length,
  sectorCounts: [...document.querySelectorAll('.dm-sectors__count')].map(n => n.textContent).join(','),
}))));
await p.goto('http://localhost:3210/about/', { waitUntil: 'load' });
console.log('JS OFF /about/  ', JSON.stringify(await p.evaluate(() => ({
  spineItems: document.querySelectorAll('.dm-spine__item').length,
  spineRulePainted: getComputedStyle(document.querySelector('.dm-spine__list')).borderInlineStartWidth,
  tickPainted: getComputedStyle(document.querySelector('.dm-spine__rail'), '::before').inlineSize,
  registerVisible: document.querySelector('.dm-spine__undated-body').getBoundingClientRect().height > 0,
}))));
await b.close();

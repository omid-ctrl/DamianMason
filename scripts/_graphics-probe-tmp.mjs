import { chromium } from 'playwright';
const b = await chromium.launch();
for (const width of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3210/speaking/', { waitUntil: 'load' });
  const cov = await p.evaluate(() => {
    const plot = document.querySelector('.dm-coverage__plot');
    const tiles = [...document.querySelectorAll('.dm-coverage__tile')].filter(t => t.textContent.trim());
    const blank = document.querySelectorAll('.dm-coverage__tile--blank').length;
    const t0 = tiles[0]?.getBoundingClientRect();
    return {
      role: plot?.getAttribute('role'),
      label: plot?.getAttribute('aria-label')?.slice(0, 60),
      labelled: tiles.length,
      blank,
      srItems: document.querySelectorAll('.dm-coverage__figure .sr-only li').length,
      tile: t0 ? `${t0.width.toFixed(1)}x${t0.height.toFixed(1)}` : null,
      gridW: document.querySelector('.dm-coverage__grid')?.getBoundingClientRect().width.toFixed(1),
      cutline: document.querySelector('.dm-coverage__figure figcaption')?.textContent.trim().slice(0, 50),
    };
  });
  const sec = await p.evaluate(() => ({
    rows: document.querySelectorAll('.dm-sectors__row').length,
    counts: [...document.querySelectorAll('.dm-sectors__count')].map(n => n.textContent),
    labels: [...document.querySelectorAll('.dm-sectors__label')].map(n => n.textContent),
  }));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.goto('http://localhost:3210/about/', { waitUntil: 'load' });
  const spine = await p.evaluate(() => ({
    items: document.querySelectorAll('.dm-spine__item').length,
    rails: [...document.querySelectorAll('.dm-spine__rail')].map(n => n.textContent.trim()),
    times: [...document.querySelectorAll('.dm-spine__rail time')].map(n => n.getAttribute('datetime')),
    listTag: document.querySelector('.dm-spine__list')?.tagName,
    undated: document.querySelector('.dm-spine__undated-body')?.textContent.trim(),
  }));
  const overflow2 = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(JSON.stringify({ width, cov, sec, overflowSpeaking: overflow, spine, overflowAbout: overflow2 }, null, 1));
  await ctx.close();
}
await b.close();

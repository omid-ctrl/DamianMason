import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [390, 768, 1024, 1440]) {
  const ctx = await b.newContext({ viewport:{width:w,height:w<500?844:1000}, isMobile:w<500, hasTouch:w<500, reducedMotion:'reduce' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3100/podcasts/', {waitUntil:'networkidle'});
  const r = await p.evaluate(() => {
    const list = document.querySelector('.dm-statrow__list');
    if (!list) return {err:'no list'};
    const cs = getComputedStyle(list);
    const items = [...list.querySelectorAll('.dm-statrow__item')].map(li => {
      const box = li.getBoundingClientRect();
      const fig = li.querySelector('.dm-stat__figure');
      const lab = li.querySelector('.dm-stat__label');
      const fb = fig.getBoundingClientRect(), lb = lab.getBoundingClientRect();
      return {
        item: [Math.round(box.left), Math.round(box.right), Math.round(box.top), Math.round(box.bottom)],
        figure: [Math.round(fb.left), Math.round(fb.right)],
        label: [Math.round(lb.left), Math.round(lb.right)],
        figOverflowsItem: Math.round(fb.right - box.right),
        figOverlapsLabel: fb.left < lb.right && fb.right > lb.left,
        text: fig.textContent.trim() + ' / ' + lab.textContent.trim(),
      };
    });
    return { count: list.dataset.count, cols: cs.gridTemplateColumns, items };
  });
  console.log('=== width', w, '===');
  console.log(JSON.stringify(r, null, 1));
  await ctx.close();
}
await b.close();

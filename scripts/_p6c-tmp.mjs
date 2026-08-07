import { chromium } from 'playwright';
const B = 'http://localhost:3100';
const b = await chromium.launch();

async function at(w, url, fn) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 500 ? 844 : 1000 }, isMobile: w < 500, hasTouch: w < 500, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(B + url, { waitUntil: 'networkidle' });
  const r = await p.evaluate(fn);
  await ctx.close();
  return r;
}

// Lines from the in-flow content box only: sr-only spans are position:absolute
// and so contribute nothing to the flow height.
const btnFn = () => {
  const visibleText = (el) => {
    let s = '';
    for (const n of el.querySelectorAll('*')) {
      const cs = getComputedStyle(n);
      if (cs.position === 'absolute' || cs.clip !== 'auto') continue;
    }
    const clone = el.cloneNode(true);
    for (const n of [...clone.querySelectorAll('*')]) {
      // sr-only markers used on this site
      if (/sr-only|visually-hidden|dm-sr/.test(n.className || '')) n.remove();
    }
    s = clone.textContent.trim().replace(/\s+/g, ' ');
    return s;
  };
  return [...document.querySelectorAll('.dm-btn')].map((el) => {
    const cs = getComputedStyle(el);
    const box = el.getBoundingClientRect();
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    const contentH = box.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth);
    const lines = Math.max(1, Math.round(contentH / lh));
    return { text: visibleText(el).slice(0, 50), cls: el.className, w: Math.round(box.width), h: Math.round(box.height), lines, ta: cs.textAlign, ls: cs.letterSpacing };
  });
};

const routes = ['/', '/speaking/', '/keynote/', '/meeting-coordinators/', '/acres-tv/', '/boasg/', '/xtreme-ag/', '/collaboration-opportunities/', '/the-business-of-agriculture/', '/do-business-better-podcast/', '/reviews/', '/contact-us/', '/podcasts/', '/blog-news/', '/about/', '/join-the-conversation/', '/blog/'];

for (const w of [390, 768]) {
  console.log(`\n########## MULTI-LINE BUTTON LABELS @ ${w} ##########`);
  for (const rt of routes) {
    const res = await at(w, rt, btnFn);
    const bad = res.filter((x) => x.lines > 1 && !x.cls.includes('masthead__menu'));
    if (bad.length) { console.log(`-- ${rt}`); bad.forEach((x) => console.log(`   [${x.lines}L ${x.w}x${x.h} ta:${x.ta}] "${x.text}"  ${x.cls}`)); }
  }
}
await b.close();

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

const lineCount = `(el) => { const cs = getComputedStyle(el); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize)*1.2; return Math.round(el.getBoundingClientRect().height / lh); }`;

// --- 2/3: button label wrapping at 390 and 768
const btnFn = () => {
  const lines = (el) => { const cs = getComputedStyle(el); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; const r = document.createRange(); r.selectNodeContents(el); const n = r.getClientRects().length; return { lh: Math.round(lh), rects: n }; };
  return [...document.querySelectorAll('.dm-btn')].map((el) => {
    const box = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    // count text lines via Range rects on the text content
    const r = document.createRange(); r.selectNodeContents(el);
    const rects = [...r.getClientRects()].filter((x) => x.height > 2);
    const rows = new Set(rects.map((x) => Math.round(x.top))).size;
    return { text: el.textContent.trim().slice(0, 46), cls: el.className, w: Math.round(box.width), h: Math.round(box.height), rows, ta: cs.textAlign, ls: cs.letterSpacing };
  });
};

const routes = ['/', '/speaking/', '/keynote/', '/meeting-coordinators/', '/acres-tv/', '/boasg/', '/xtreme-ag/', '/collaboration-opportunities/', '/the-business-of-agriculture/', '/do-business-better-podcast/', '/reviews/', '/contact-us/', '/podcasts/', '/blog-news/', '/about/', '/join-the-conversation/', '/blog/'];

for (const w of [390, 768]) {
  console.log(`\n########## BUTTON WRAPS @ ${w} ##########`);
  for (const rt of routes) {
    const res = await at(w, rt, btnFn);
    const bad = res.filter((x) => x.rows > 1);
    if (bad.length) { console.log(`-- ${rt}`); bad.forEach((x) => console.log(`   [${x.rows} lines ${x.w}x${x.h}] "${x.text}"  ${x.cls}`)); }
  }
}

// --- 4: small tap targets
console.log('\n########## TAP TARGETS < 24px (standalone) @ 390 ##########');
for (const rt of routes) {
  const res = await at(390, rt, () => {
    const out = [];
    for (const el of document.querySelectorAll('a[href], button')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.height >= 24 && r.width >= 24) continue;
      const par = el.parentElement;
      const inline = par && [...par.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
      out.push({ t: el.textContent.trim().slice(0, 44), w: Math.round(r.width), h: Math.round(r.height), inline: !!inline, cls: el.className.slice(0, 40) });
    }
    return out;
  });
  const bad = res.filter((x) => !x.inline);
  if (bad.length) { console.log(`-- ${rt}`); bad.forEach((x) => console.log(`   ${x.w}x${x.h}  "${x.t}"  ${x.cls}`)); }
}

// --- 6: heading sizes on /meeting-coordinators/
console.log('\n########## /meeting-coordinators/ HEADINGS @ 390 ##########');
console.log(JSON.stringify(await at(390, '/meeting-coordinators/', () => [...document.querySelectorAll('h1,h2')].map((h) => {
  const r = h.getBoundingClientRect(); const cs = getComputedStyle(h);
  const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
  return { tag: h.tagName, fs: cs.fontSize, h: Math.round(r.height), lines: Math.round(r.height / lh), t: h.textContent.trim().slice(0, 54) };
})), null, 1));

// --- 5: blog-news link affordance
console.log('\n########## /blog-news/ AFFORDANCE @ 390 ##########');
console.log(JSON.stringify(await at(390, '/blog-news/', () => {
  const eyebrows = [...document.querySelectorAll('.dm-eyebrow')].slice(0, 4).map((e) => ({ t: e.textContent.trim().slice(0, 30), color: getComputedStyle(e).color, cls: e.className, inLink: !!e.closest('a') }));
  const heads = [...document.querySelectorAll('h3 a')].slice(0, 4).map((a) => ({ t: a.textContent.trim().slice(0, 34), color: getComputedStyle(a).color, deco: getComputedStyle(a).textDecorationLine }));
  const prose = [...document.querySelectorAll('.dm-prose a, p a')].slice(0, 3).map((a) => ({ t: a.textContent.trim().slice(0, 24), color: getComputedStyle(a).color, deco: getComputedStyle(a).textDecorationLine }));
  return { eyebrows, heads, prose };
}), null, 1));

// --- 9: chars per line at 768
console.log('\n########## CPL @ 768 ##########');
for (const rt of ['/do-business-better-podcast/', '/the-business-of-agriculture/']) {
  const res = await at(768, rt, () => {
    const out = [];
    for (const p of document.querySelectorAll('p')) {
      const txt = p.textContent.trim(); if (txt.length < 120) continue;
      const r = p.getBoundingClientRect(); const cs = getComputedStyle(p);
      const lh = parseFloat(cs.lineHeight) || 20; const lines = Math.round(r.height / lh);
      out.push({ cpl: Math.round(txt.length / lines), lines, w: Math.round(r.width), cls: p.className.slice(0, 40), t: txt.slice(0, 40) });
    }
    return out;
  });
  console.log(`-- ${rt}`);
  res.filter((x) => x.cpl > 80).forEach((x) => console.log(`   cpl:${x.cpl} lines:${x.lines} w:${x.w} ${x.cls} :: ${x.t}`));
}

// --- 8: reviews voids at 768
console.log('\n########## /reviews/ GRID VOIDS @ 768 ##########');
console.log(JSON.stringify(await at(768, '/reviews/', () => {
  const grid = document.querySelector('.dm-testimonials--2') || document.querySelector('[class*=testimonial]');
  if (!grid) return { err: 'no grid' };
  const cs = getComputedStyle(grid);
  const kids = [...grid.children].map((k) => { const r = k.getBoundingClientRect(); const inner = [...k.querySelectorAll('*')].reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0); return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), contentBottom: Math.round(inner), void: Math.round(r.bottom - inner) }; });
  return { cols: cs.gridTemplateColumns, n: kids.length, kids };
}), null, 1));

await b.close();

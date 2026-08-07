import { chromium } from 'playwright';
const B = 'http://localhost:3100';
const b = await chromium.launch();

async function ctx(w, h) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 700, hasTouch: true });
  return c;
}
const log = (t, v) => console.log('\n### ' + t + '\n' + JSON.stringify(v, null, 1));

// ---------- 1. video facade geometry + play control centring ----------
{
  const c = await ctx(390, 844); const p = await c.newPage();
  const out = {};
  for (const r of ['/', '/reviews/', '/collaboration-opportunities/', '/blog-news/', '/keynote/', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/']) {
    await p.goto(B + r, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 700) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 120)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(900);
    out[r] = await p.evaluate(() => [...document.querySelectorAll('.dm-video__facade')].map(f => {
      const st = f.closest('.dm-video__stage') || f.parentElement;
      const img = f.querySelector('img'); const play = f.querySelector('.dm-video__play');
      const fr = f.getBoundingClientRect(), sr = st.getBoundingClientRect();
      const ir = img && img.getBoundingClientRect(), pr = play && play.getBoundingClientRect();
      return {
        stage: [Math.round(sr.width), Math.round(sr.height)],
        img: ir ? [Math.round(ir.width), Math.round(ir.height)] : null,
        imgFit: img && getComputedStyle(img).objectFit,
        play: pr ? [Math.round(pr.width), Math.round(pr.height)] : null,
        // offset of play centre from facade centre
        dx: pr ? Math.round((pr.left + pr.width / 2) - (fr.left + fr.width / 2)) : null,
        dy: pr ? Math.round((pr.top + pr.height / 2) - (fr.top + fr.height / 2)) : null,
        clipped: pr ? (pr.top < sr.top - 1 || pr.bottom > sr.bottom + 1) : null,
      };
    }));
  }
  log('VIDEO FACADES @390', out);
  await c.close();
}

// ---------- 2. contact email line boxes ----------
{
  const c = await ctx(390, 844); const p = await c.newPage();
  await p.goto(B + '/contact-us/', { waitUntil: 'networkidle' });
  const v = await p.evaluate(() => [...document.querySelectorAll('a[href^="mailto:"]')].map(a => {
    const r = [...a.getClientRects()].map(x => [Math.round(x.width), Math.round(x.height)]);
    return { text: a.textContent.trim(), lines: r.length, rects: r, fs: getComputedStyle(a).fontSize, ow: getComputedStyle(a).overflowWrap, box: Math.round(a.getBoundingClientRect().width) };
  }));
  log('CONTACT MAILTO @390', v);
  await c.close();
}

// ---------- 3. standalone action link tap targets ----------
{
  const c = await ctx(390, 844); const p = await c.newPage();
  const out = {};
  for (const r of ['/', '/meeting-coordinators/', '/blog/', '/blog/eggflation-gives-producers-record-profits/', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/', '/speaking/', '/keynote/', '/podcasts/', '/reviews/', '/about/', '/contact-us/', '/join-the-conversation/', '/acres-tv/', '/xtreme-ag/', '/blog-news/', '/boasg/', '/the-business-of-agriculture/', '/do-business-better-podcast/', '/collaboration-opportunities/']) {
    await p.goto(B + r, { waitUntil: 'networkidle' });
    const bad = await p.evaluate(() => {
      const res = [];
      document.querySelectorAll('main a, main button').forEach(a => {
        const par = a.parentElement;
        const own = (a.textContent || '').trim();
        const parTxt = (par.textContent || '').trim();
        // standalone = the parent holds no text besides this control
        if (parTxt !== own) return;
        const rect = a.getBoundingClientRect();
        if (rect.width === 0) return;
        if (rect.height < 24) res.push({ t: own.slice(0, 46), w: Math.round(rect.width), h: Math.round(rect.height), cls: a.className.toString().slice(0, 40) });
      });
      return res;
    });
    if (bad.length) out[r] = bad;
  }
  log('SUB-24px STANDALONE CONTROLS @390', out);
  await c.close();
}

// ---------- 4. logo wall cells ----------
{
  for (const w of [390, 768]) {
    const c = await ctx(w, 900); const p = await c.newPage();
    await p.goto(B + '/', { waitUntil: 'networkidle' });
    await p.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 700) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 110)); } });
    await p.waitForTimeout(900);
    const v = await p.evaluate(() => {
      const g = document.querySelector('.dm-logowall__grid');
      const cells = [...g.children];
      return { cols: getComputedStyle(g).gridTemplateColumns, n: cells.length, marks: cells.map(cl => { const i = cl.querySelector('img'); const r = i.getBoundingClientRect(); const cr = cl.getBoundingClientRect(); return { a: i.alt.slice(0, 34), rw: Math.round(r.width), rh: Math.round(r.height), cell: [Math.round(cr.width), Math.round(cr.height)], scale: +(r.width / i.naturalWidth).toFixed(2) }; }) };
    });
    log('LOGO WALL @' + w, v);
    await c.close();
  }
}

// ---------- 5. reviews grid row balance @768 ----------
{
  const c = await ctx(768, 1024); const p = await c.newPage();
  await p.goto(B + '/reviews/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 700) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 110)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const v = await p.evaluate(() => {
    const g = document.querySelector('.dm-testimonials, [class*="testimonial"]');
    const grids = [...document.querySelectorAll('ul,div')].filter(e => getComputedStyle(e).display === 'grid' && e.children.length > 2 && e.querySelector('blockquote'));
    return grids.map(gr => {
      const rows = {};
      [...gr.children].forEach(ch => { const r = ch.getBoundingClientRect(); const k = Math.round(r.top); (rows[k] ||= []).push(Math.round(r.height)); });
      return { cols: getComputedStyle(gr).gridTemplateColumns, rows: Object.entries(rows).map(([k, v]) => ({ y: +k, h: v, spread: Math.max(...v) - Math.min(...v) })) };
    });
  });
  log('REVIEWS GRID @768', v);
  await c.close();
}

// ---------- 6. nav sheet ----------
{
  for (const [w, h] of [[390, 844], [768, 1024]]) {
    const c = await ctx(w, h); const p = await c.newPage();
    await p.goto(B + '/', { waitUntil: 'networkidle' });
    await p.locator('button[aria-label*="enu" i], button:has-text("Menu")').first().click();
    await p.waitForTimeout(600);
    const v = await p.evaluate(() => {
      const m = document.querySelector('.dm-menu');
      const foot = document.querySelector('.dm-menu__foot');
      const fr = foot && foot.getBoundingClientRect();
      const small = [];
      m.querySelectorAll('a,button').forEach(e => { const r = e.getBoundingClientRect(); if (r.height < 24 && r.width > 0) small.push({ t: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }); });
      return { scrollH: m.scrollHeight, clientH: m.clientHeight, footTop: fr && Math.round(fr.top), footBottom: fr && Math.round(fr.bottom), footPos: foot && getComputedStyle(foot).position, viewportH: innerHeight, subCount: m.querySelectorAll('a,button').length, sub24: small };
    });
    log('NAV SHEET @' + w, v);
    await c.close();
  }
}
await b.close();

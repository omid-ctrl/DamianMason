import { chromium } from 'playwright';
const B = 'http://localhost:3100';
const ROUTES = ['/', '/about/', '/speaking/', '/keynote/', '/reviews/', '/meeting-coordinators/', '/collaboration-opportunities/', '/boasg/', '/podcasts/', '/the-business-of-agriculture/', '/do-business-better-podcast/', '/xtreme-ag/', '/blog-news/', '/acres-tv/', '/blog/', '/contact-us/', '/join-the-conversation/', '/blog/eggflation-gives-producers-record-profits/', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'];
const b = await chromium.launch();

for (const w of [390, 768]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 700, hasTouch: true });
  const p = await c.newPage();
  console.log('\n================ WIDTH ' + w + ' ================');
  for (const r of ROUTES) {
    await p.goto(B + r, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 700) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 90)); } window.scrollTo(0, 0); });
    await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.setAttribute('data-reveal-state', 'shown')));
    await p.waitForTimeout(400);
    const res = await p.evaluate((VW) => {
      const out = { hOverflow: [], selfOverflow: [], overlaps: [], tiny: [], narrowCol: [] };
      // horizontal page overflow
      if (document.documentElement.scrollWidth > VW + 1) out.hOverflow.push('doc scrollWidth ' + document.documentElement.scrollWidth);
      document.querySelectorAll('main *').forEach(e => {
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        // element painting outside the viewport horizontally
        if (r.right > VW + 1.5 || r.left < -1.5) {
          if (cs.overflow === 'visible' && e.children.length === 0)
            out.hOverflow.push({ t: (e.textContent || '').trim().slice(0, 40), l: Math.round(r.left), rt: Math.round(r.right), cls: e.className.toString().slice(0, 40) });
        }
        // content wider than its own clipping box
        if (e.scrollWidth > e.clientWidth + 2 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll' && e.clientWidth > 0) {
          out.selfOverflow.push({ t: (e.textContent || '').trim().slice(0, 40), sw: e.scrollWidth, cw: e.clientWidth, cls: e.className.toString().slice(0, 40) });
        }
        // very small live text
        const fs = parseFloat(cs.fontSize);
        if (e.children.length === 0 && (e.textContent || '').trim() && fs < 11) out.tiny.push({ t: e.textContent.trim().slice(0, 30), fs, cls: e.className.toString().slice(0, 30) });
      });
      // overlapping sibling leaf text nodes
      const leaves = [...document.querySelectorAll('main *')].filter(e => e.children.length === 0 && (e.textContent || '').trim() && getComputedStyle(e).position !== 'absolute');
      for (let i = 0; i < leaves.length; i++) {
        for (let j = i + 1; j < Math.min(i + 6, leaves.length); j++) {
          const a = leaves[i].getBoundingClientRect(), bb = leaves[j].getBoundingClientRect();
          if (a.width === 0 || bb.width === 0) continue;
          if (leaves[i].contains(leaves[j]) || leaves[j].contains(leaves[i])) continue;
          const ox = Math.min(a.right, bb.right) - Math.max(a.left, bb.left);
          const oy = Math.min(a.bottom, bb.bottom) - Math.max(a.top, bb.top);
          if (ox > 6 && oy > 6) out.overlaps.push({ a: leaves[i].textContent.trim().slice(0, 24), b: leaves[j].textContent.trim().slice(0, 24), ox: Math.round(ox), oy: Math.round(oy) });
        }
      }
      // paragraphs at a punishing measure
      document.querySelectorAll('main p, main li').forEach(e => {
        if (e.children.length && !e.textContent.trim()) return;
        const r = e.getBoundingClientRect();
        const txt = (e.textContent || '').trim();
        if (txt.length > 60 && r.width > 0 && r.width < 190) out.narrowCol.push({ t: txt.slice(0, 34), w: Math.round(r.width) });
      });
      return out;
    }, w);
    const parts = [];
    if (res.hOverflow.length) parts.push('H-OVERFLOW ' + JSON.stringify(res.hOverflow.slice(0, 3)));
    if (res.selfOverflow.length) parts.push('SELF-OVERFLOW ' + JSON.stringify(res.selfOverflow.slice(0, 4)));
    if (res.overlaps.length) parts.push('OVERLAP ' + JSON.stringify(res.overlaps.slice(0, 4)));
    if (res.tiny.length) parts.push('TINY ' + JSON.stringify(res.tiny.slice(0, 4)));
    if (res.narrowCol.length) parts.push('NARROW ' + JSON.stringify(res.narrowCol.slice(0, 4)));
    console.log(r + (parts.length ? '\n   ' + parts.join('\n   ') : '  ok'));
  }
  await c.close();
}
await b.close();

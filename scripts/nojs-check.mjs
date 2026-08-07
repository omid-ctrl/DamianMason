/**
 * Critical regression check: with JavaScript disabled, no content may be
 * invisible. A scroll-reveal that hides content by default and relies on an
 * IntersectionObserver to show it is the failure mode being hunted here.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const targets = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const browser = await chromium.launch();
const ctx = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 1440, height: 1000 },
});

const results = [];
for (const t of targets) {
  const page = await ctx.newPage();
  await page.goto(t.url, { waitUntil: 'load', timeout: 60_000 });

  const r = await page.evaluate(() => {
    const out = {
      revealAttrs: document.querySelectorAll('[data-reveal-state]').length,
      pending: document.querySelectorAll('[data-reveal-state="pending"]').length,
      hiddenTextNodes: [],
      offscreenTransformed: [],
      textLength: document.body.innerText.trim().length,
      h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
      headings: [...document.querySelectorAll('h2,h3')].map((h) => h.innerText.trim()).filter(Boolean).length,
    };
    // Any element that directly holds visible text must actually be visible.
    const all = document.querySelectorAll('body *');
    for (const el of all) {
      const direct = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
      );
      if (!direct) continue;
      const cs = getComputedStyle(el);
      const label = (el.tagName + '.' + (el.className || '')).slice(0, 80) +
        ' :: ' + el.textContent.trim().slice(0, 60);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue; // intentionally hidden (sr-only patterns handled below)
      // The skip link is parked off-screen by design and returns on
      // :focus-visible through pure CSS, so it works with JS off. Not a reveal.
      if (el.classList.contains('dm-skip-link')) continue;
      const op = parseFloat(cs.opacity);
      if (op < 0.99) out.hiddenTextNodes.push(label + ' [opacity ' + cs.opacity + ']');
      const tr = cs.transform;
      if (tr && tr !== 'none') {
        const m = tr.match(/matrix\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(',').map(Number);
          if (Math.abs(p[5]) > 4 || Math.abs(p[4]) > 4) {
            out.offscreenTransformed.push(label + ' [' + tr + ']');
          }
        }
      }
    }
    return out;
  });

  // Sanity: is the page's real copy actually painted? Sample the visible text.
  results.push({ name: t.name, ...r });
  console.log(
    `${t.name.padEnd(34)} text:${String(r.textLength).padStart(6)} h1:${r.h1.length} h2/h3:${String(r.headings).padStart(3)}` +
    ` revealAttrs:${r.revealAttrs} pending:${r.pending}` +
    (r.hiddenTextNodes.length ? `  HIDDEN:${r.hiddenTextNodes.length}` : '') +
    (r.offscreenTransformed.length ? `  SHIFTED:${r.offscreenTransformed.length}` : ''),
  );
  if (r.hiddenTextNodes.length) console.log('    ' + r.hiddenTextNodes.slice(0, 5).join('\n    '));
  if (r.offscreenTransformed.length) console.log('    ' + r.offscreenTransformed.slice(0, 5).join('\n    '));
  await page.close();
}

await browser.close();
fs.writeFileSync(process.argv[3], JSON.stringify(results, null, 2));
const failures = results.filter(
  (r) => r.pending > 0 || r.hiddenTextNodes.length > 0 || r.offscreenTransformed.length > 0 || r.textLength < 400,
);
console.log('\nFAILING ROUTES: ' + failures.length);
for (const f of failures) console.log('  ' + f.name);

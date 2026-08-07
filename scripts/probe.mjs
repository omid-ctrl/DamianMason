/**
 * Slice each route into readable viewport-height chunks at DPR 1 so the
 * screenshots can actually be looked at, plus a deep overflow probe that finds
 * the specific elements wider than the viewport (including ones clipped by an
 * ancestor, which the document-level scrollWidth check cannot see).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);

const targets = JSON.parse(fs.readFileSync(args.targets, 'utf8'));
const outDir = args.out;
const widths = (args.widths ?? '390,768,1440').split(',').map(Number);
const only = args.only ? args.only.split(',') : null;
const chunkH = Number(args.chunk ?? 1300);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const probes = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    deviceScaleFactor: 1,
    isMobile: width < 500,
    hasTouch: width < 500,
    reducedMotion: 'reduce',
  });

  for (const target of targets) {
    if (only && !only.includes(target.name)) continue;
    const page = await context.newPage();
    // A dev-server recompile can hand back a shell with no content. Retry until
    // the page actually has an h1 and a real height, so a blank capture can
    // never be mistaken for a clean result.
    let sane = false;
    for (let attempt = 0; attempt < 4 && !sane; attempt++) {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.evaluate(() => document.fonts?.ready);
      sane = await page.evaluate(
        () => !!document.querySelector('h1') && document.documentElement.scrollHeight > 1200,
      );
      if (!sane) await page.waitForTimeout(1500);
    }
    if (!sane) throw new Error(`blank render: ${target.name} @ ${width}`);
    // The dev overlay injects a 32px button and a portal that never ship.
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = () => {
          window.scrollBy(0, window.innerHeight);
          y += window.innerHeight;
          if (y < document.body.scrollHeight + window.innerHeight) requestAnimationFrame(step);
          else { window.scrollTo(0, 0); resolve(); }
        };
        step();
      });
    });
    await page.waitForTimeout(500);

    // ---- deep overflow probe -------------------------------------------------
    const probe = await page.evaluate((vw) => {
      const out = { offenders: [], smallTaps: [], docOverflow: 0 };
      out.docOverflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
      // Deliberately visually-hidden boxes: an sr-only span, the Mailchimp
      // honeypot and the mono "Menu" label are all 1px clipped wrappers whose
      // inner text legitimately overflows them. They are not layout defects.
      const noise = /sr-only|honeypot|menu-label/;
      const desc = (el) => {
        const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 4).join('.') : '';
        return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls ? '.' + cls : ''}`;
      };
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (noise.test(typeof el.className === 'string' ? el.className : '') || noise.test(el.id || '')) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        // element box itself pokes past the viewport
        if (r.right > vw + 1 || r.left < -1) {
          out.offenders.push({
            sel: desc(el), kind: 'box',
            left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
            text: (el.textContent || '').trim().slice(0, 60),
          });
        }
        // element scrolls internally wider than its own box (clipped overflow)
        if (el.scrollWidth - el.clientWidth > 2 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') {
          out.offenders.push({
            sel: desc(el), kind: 'clipped',
            over: el.scrollWidth - el.clientWidth, w: Math.round(r.width),
            text: (el.textContent || '').trim().slice(0, 60),
          });
        }
      }
      // tap targets
      for (const el of document.querySelectorAll('a,button,input,select,textarea,summary,[role="button"],[role="tab"]')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (noise.test(el.id || '')) continue;
        // An inline link inside a sentence is exempt from the target-size
        // floor (WCAG 2.2 SC 2.5.8). Only standalone controls are counted.
        if (el.tagName === 'A' && cs.display.startsWith('inline') && cs.display !== 'inline-flex' && cs.display !== 'inline-block') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.height < 44 || r.width < 44) {
          out.smallTaps.push({
            sel: desc(el), w: Math.round(r.width), h: Math.round(r.height),
            text: (el.textContent || '').trim().slice(0, 40),
          });
        }
      }
      // dedupe offenders by selector+kind
      const seen = new Set();
      out.offenders = out.offenders.filter((o) => {
        const k = o.sel + o.kind + (o.over ?? o.right);
        if (seen.has(k)) return false; seen.add(k); return true;
      });
      const seenT = new Set();
      out.smallTaps = out.smallTaps.filter((o) => {
        const k = o.sel + o.w + o.h; if (seenT.has(k)) return false; seenT.add(k); return true;
      });
      return out;
    }, width);
    probes.push({ name: target.name, width, ...probe });

    // ---- sliced screenshots --------------------------------------------------
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const n = Math.ceil(h / chunkH);
    for (let i = 0; i < n; i++) {
      const y = i * chunkH;
      await page.screenshot({
        path: path.join(outDir, `${target.name}-${width}-p${String(i + 1).padStart(2, '0')}.png`),
        clip: { x: 0, y, width, height: Math.min(chunkH, h - y) },
        fullPage: true,
      });
    }
    console.log(`${String(width).padStart(4)} ${target.name.padEnd(32)} ${n} slices  doc-overflow:${probe.docOverflow}  offenders:${probe.offenders.length}  smallTaps:${probe.smallTaps.length}`);
    await page.close();
  }
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, 'probe.json'), JSON.stringify(probes, null, 2));
console.log('wrote probe.json');

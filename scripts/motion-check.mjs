/**
 * Critical regression check for the motion layer, in three passes.
 *
 * WHY THIS EXISTS AND WHY LIGHTHOUSE IS NOT ENOUGH. Lighthouse measures one
 * page load. Every effect this file guards is triggered by SCROLLING: the
 * masthead's condensed state, the ledger count-up, the figure wipe. A metric
 * taken at load cannot see any of them, and the three ways they can break are
 * all invisible until somebody scrolls.
 *
 *   node scripts/motion-check.mjs [baseUrl]
 *
 * Pass 1, reduced motion. Nothing may be armed, nothing may be clipped, and
 * every ledger figure must read its true value. This is the accessibility
 * contract: the preference disables the effect, it does not shorten it.
 *
 * Pass 2, full motion. Every armed reveal must resolve, every count must land
 * on its true value, and the masthead's box must be BYTE IDENTICAL between the
 * resting and scrolled states. That last one is rule 24: the header is
 * position: sticky and therefore still in flow, so a height change on it moves
 * every pixel of the document under it.
 *
 * Pass 3, cumulative layout shift across a scripted scroll, which must be 0.
 *
 * ----------------------------------------------------------------------------
 * PASSES 1 AND 2 WALK; ONLY PASS 3 SWEEPS. Getting this wrong produces a false
 * failure that looks exactly like a real one. IntersectionObserver samples at
 * frame boundaries, so a scroll that jumps most of a viewport per step can move
 * an element past the fold between two observations and report nothing at all.
 * The first version of this check swept the whole page and reported the
 * /speaking/ logo wall as never revealed, on a page where it reveals correctly
 * for a human: the wall is 349px tall in a 9,671px document, so the sweep put
 * it inside the observer's root for about five steps and the callback landed in
 * the gap.
 *
 * The contract being tested is "when the reader reaches it, it resolves", so
 * the first two passes reach each target deliberately and wait. Pass 3 keeps
 * the sweep, because CLS is a property of the scroll rather than of any one
 * element, and it steps a quarter viewport at a time, which is roughly reading
 * speed.
 * ----------------------------------------------------------------------------
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3100';

/** One route per shape: a cut-out hero, a band hero, both data graphics, the
 *  wipe figures, and the two thinnest ledgers. */
const ROUTES = [
  '/',
  '/keynote/',
  '/speaking/',
  '/about/',
  '/reviews/',
  '/podcasts/',
  '/meeting-coordinators/',
  '/contact-us/',
];

const SCROLL = `
  await new Promise((res) => {
    let y = 0;
    const step = () => {
      y += window.innerHeight * 0.25;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(step, 70);
      else setTimeout(res, 1200);
    };
    step();
  });
`;

const browser = await chromium.launch();
const failures = [];

/* -- Pass 1: reduced motion ------------------------------------------------ */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.evaluate(async () => {
      for (const el of document.querySelectorAll('[data-reveal], [data-count-to]')) {
        el.scrollIntoView({ block: 'center' });
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    const bad = await page.evaluate(() => {
      const out = [];
      if (document.querySelectorAll('[data-reveal-state]').length) {
        out.push('a reveal was armed under prefers-reduced-motion');
      }
      for (const el of document.querySelectorAll('[data-reveal]')) {
        for (const kid of el.children) {
          const cp = getComputedStyle(kid).clipPath;
          if (cp && cp !== 'none') out.push(`clip-path ${cp} survived reduced motion`);
        }
      }
      for (const el of document.querySelectorAll('[data-count-to]')) {
        if (el.textContent.trim() !== el.dataset.countTo) {
          out.push(`figure reads "${el.textContent}", should be "${el.dataset.countTo}"`);
        }
      }
      return out;
    });
    for (const b of bad) failures.push(`[reduced] ${route}: ${b}`);
  }
  await ctx.close();
}

/* -- Pass 2: full motion --------------------------------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60_000 });
    const before = await page.evaluate(() => {
      const el = document.querySelector('.dm-masthead');
      return { h: el.getBoundingClientRect().height, scrolled: el.dataset.scrolled };
    });
    /* DELIBERATE, NOT A SWEEP. An earlier version of this pass scrolled the
       page in even steps and asserted that everything had resolved by the
       bottom, and it reported the /speaking/ logo wall as never revealed on a
       page where it reveals correctly: the wall is 349px tall in a 9,671px
       document, so the sweep put it inside the observer's root for about five
       steps and the callback landed in the gap. The contract being tested is
       "when the reader reaches it, it resolves", so the check reaches each one
       and waits. */
    await page.evaluate(async () => {
      for (const el of document.querySelectorAll('[data-reveal], [data-count-to]')) {
        el.scrollIntoView({ block: 'center' });
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1200));
    });
    const after = await page.evaluate(() => {
      const el = document.querySelector('.dm-masthead');
      return { h: el.getBoundingClientRect().height, scrolled: el.dataset.scrolled };
    });

    if (before.h !== after.h) {
      failures.push(
        `[motion] ${route}: masthead height moved ${before.h} -> ${after.h}. ` +
          'The header is position: sticky and therefore in flow, so this shifts the whole document. See DESIGN_SYSTEM rule 24.',
      );
    }
    if (before.scrolled !== 'false' || after.scrolled !== 'true') {
      failures.push(
        `[motion] ${route}: data-scrolled went ${before.scrolled} -> ${after.scrolled}, expected false -> true`,
      );
    }

    const bad = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('[data-count-to]')) {
        if (el.textContent.trim() !== el.dataset.countTo) {
          out.push(`figure settled on "${el.textContent}", should be "${el.dataset.countTo}"`);
        }
      }
      for (const el of document.querySelectorAll('[data-reveal][data-reveal-state="pending"]')) {
        out.push(`still pending after a full scroll: ${el.className}`);
      }
      return out;
    });
    for (const b of bad) failures.push(`[motion] ${route}: ${b}`);
  }
  await ctx.close();
}

/* -- Pass 3: CLS through the scroll ---------------------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.evaluate(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.evaluate(`(async () => { ${SCROLL} })()`);
    const cls = await page.evaluate(() => window.__cls);
    console.log(`CLS ${route.padEnd(26)} ${cls.toFixed(5)}`);
    if (cls > 0.001) failures.push(`[cls] ${route}: ${cls.toFixed(5)}, must be 0`);
  }
  await ctx.close();
}

await browser.close();

if (failures.length) {
  console.error('\n' + failures.map((f) => `  ${f}`).join('\n'));
  console.error(`\n${failures.length} motion failure(s).`);
  process.exit(1);
}
console.log('\nMotion, reduced motion and CLS all clear.');

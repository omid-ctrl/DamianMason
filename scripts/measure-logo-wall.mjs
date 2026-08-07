/**
 * measure-logo-wall.mjs
 *
 * Measures what a visitor actually sees on the two logo walls: the rendered
 * box of every mark, at real viewport widths, in Chromium, after the reveal
 * stagger has settled.
 *
 *   node scripts/measure-logo-wall.mjs [--base http://localhost:3100] [--widths 1440,390]
 *
 * Reports three spreads per wall per width:
 *
 *   height   max/min rendered block-size. The number round 3 measured. It is
 *            NOT the normalization target: with equal optical area the height
 *            spread floors at sqrt(aspect_max / aspect_min), which for the 21
 *            client marks is 2.39x. Reported so the before and after are
 *            comparable to the round-3 evidence file.
 *   width    max/min rendered inline-size. Same caveat in the other axis.
 *   optical  max/min of sqrt(width x height), the apparent visual weight of a
 *            mark. This is what the wall is normalized on and the number that
 *            should read 1.0x.
 */
import { chromium } from 'playwright';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);

const base = args.base ?? 'http://localhost:3100';
const widths = (args.widths ?? '1440,390').split(',').map(Number);

/** Which wall lives where. Both walls are on their own route so neither
 *  measurement is contaminated by the other's cell geometry. */
const WALLS = [
  { label: 'client wall', url: `${base}/`, selector: '.dm-logowall--cols-7 .dm-logowall__grid' },
  {
    label: 'sponsor wall',
    url: `${base}/the-business-of-agriculture/`,
    selector: '.dm-logowall--cols-5 .dm-logowall__grid',
  },
];

const browser = await chromium.launch();
const out = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    deviceScaleFactor: 1,
    isMobile: width < 500,
    hasTouch: width < 500,
    // The wall reveals on scroll. Reduced motion makes the end state the
    // first state, so nothing is measured mid-transition.
    reducedMotion: 'reduce',
  });

  for (const wall of WALLS) {
    const page = await context.newPage();
    // Both walls sit on routes that also carry YouTube facades, whose posters
    // come from i.ytimg.com. Off the network those requests never settle and
    // `load` never fires, so third-party hosts are refused outright and the
    // wait is `domcontentloaded` plus the explicit decode below, which is what
    // actually gates the numbers. Nothing measured here is remote.
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.hostname === 'localhost' || url.protocol === 'data:') return route.continue();
      return route.abort();
    });
    await page.goto(wall.url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const grid = page.locator(wall.selector).first();
    const count = await grid.count();
    if (!count) {
      await page.close();
      continue;
    }
    await grid.scrollIntoViewIfNeeded();
    // The marks are lazy, so decoding has to be waited on explicitly. Bounded,
    // because a mark whose request was refused above never resolves and an
    // unbounded wait here is how this harness hung twice.
    await page
      .waitForFunction(
        (sel) =>
          Array.from(document.querySelector(sel).querySelectorAll('img')).every(
            (i) => i.complete,
          ),
        wall.selector.split(',')[0].trim(),
        { timeout: 15_000 },
      )
      .catch(() => {});
    await page.waitForTimeout(600);
    process.stderr.write(`  measured ${wall.label} @ ${width}\n`);

    const marks = await grid.evaluate((el) =>
      Array.from(el.querySelectorAll('img')).map((img) => {
        const r = img.getBoundingClientRect();
        return {
          name: img.alt,
          w: Math.round(r.width * 10) / 10,
          h: Math.round(r.height * 10) / 10,
          cell: Math.round(img.closest('li').getBoundingClientRect().width * 10) / 10,
        };
      }),
    );
    await page.close();

    const span = (key) => {
      const v = marks.map((m) => (key === 'optical' ? Math.sqrt(m.w * m.h) : m[key]));
      const min = Math.min(...v);
      const max = Math.max(...v);
      const sorted = [...v].sort((a, b) => a - b);
      return { min, max, ratio: max / min, median: sorted[Math.floor(sorted.length / 2)] };
    };

    out.push({ width, wall: wall.label, marks, h: span('h'), w: span('w'), o: span('optical') });
  }
  await context.close();
}

await browser.close();

const f = (n) => n.toFixed(1).padStart(6);
for (const r of out) {
  console.log(`\n=== ${r.wall} @ ${r.width} (${r.marks.length} marks, cell ${r.marks[0].cell}px)`);
  console.log('       w       h  optical  mark');
  for (const m of [...r.marks].sort((a, b) => a.h - b.h)) {
    console.log(`  ${f(m.w)}  ${f(m.h)}  ${f(Math.sqrt(m.w * m.h))}  ${m.name}`);
  }
  console.log(
    `  height  ${r.h.min.toFixed(1)} to ${r.h.max.toFixed(1)} (${r.h.ratio.toFixed(2)}x, median ${r.h.median.toFixed(1)})`,
  );
  console.log(`  width   ${r.w.min.toFixed(1)} to ${r.w.max.toFixed(1)} (${r.w.ratio.toFixed(2)}x)`);
  console.log(
    `  OPTICAL ${r.o.min.toFixed(1)} to ${r.o.max.toFixed(1)} (${r.o.ratio.toFixed(2)}x, median ${r.o.median.toFixed(1)})`,
  );
}

if (args.json) {
  const fs = await import('node:fs');
  fs.writeFileSync(args.json, JSON.stringify(out, null, 2) + '\n');
}

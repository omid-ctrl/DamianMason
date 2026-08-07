/**
 * Screenshot harness. Used twice: to shoot the Phase 1 design comps for the
 * judge panel, and to shoot every route at three breakpoints for Phase 6
 * visual QA.
 *
 *   node scripts/shoot.mjs --targets <file.json> --out <dir> [--widths 390,768,1440] [--dpr 2]
 *
 * targets.json is [{ "name": "home", "url": "http://localhost:3000/" }, ...]
 * A `file://` url works too, which is how the standalone comps get shot.
 *
 * Full-page by default. Waits for fonts and lazy images so a screenshot never
 * catches a half-painted page, which is the usual way visual QA produces
 * confident nonsense.
 *
 * --dpr defaults to 2 and every existing call keeps its behaviour. It exists
 * because 2x is exactly the density at which the defect this project's display
 * face was chosen to avoid becomes invisible: a hairline that falls under one
 * device pixel at 1x still has two to land on at 2x. Every screenshot this repo
 * has ever taken was 2x, so that whole class of defect has never once been
 * photographed. Shoot type comps at 1 as well as 2.
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
const fullPage = args.viewportOnly !== 'true';
const dpr = Number(args.dpr ?? 2);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const report = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    deviceScaleFactor: dpr,
    isMobile: width < 500,
    hasTouch: width < 500,
    reducedMotion: 'reduce',
  });

  for (const target of targets) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300));
    });
    page.on('requestfailed', (r) => failedRequests.push(`${r.url()} :: ${r.failure()?.errorText}`));
    page.on('response', (r) => {
      if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
    });

    let status = 'ok';
    try {
      const res = await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60_000 });
      if (res && res.status() >= 400) status = `http ${res.status()}`;

      await page.evaluate(() => document.fonts?.ready);
      // Scroll the full height so lazy images and scroll-reveal animations resolve.
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
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(outDir, `${target.name}-${width}.png`),
        fullPage,
      });
    } catch (err) {
      status = `error: ${err.message.slice(0, 200)}`;
    }

    // A blank-looking screenshot is usually a broken image, so record what the
    // page actually rendered rather than trusting the pixels alone.
    let meta = {};
    try {
      meta = await page.evaluate(() => ({
        title: document.title,
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
        headings: document.querySelectorAll('h1,h2,h3').length,
        images: document.images.length,
        brokenImages: [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
        emptyHrefs: [...document.querySelectorAll('a')]
          .filter((a) => { const h = a.getAttribute('href'); return h === null || h === '' || h === '#'; })
          .map((a) => a.textContent.trim().slice(0, 60)),
        wpengineRefs: document.documentElement.outerHTML.includes('wpengine.com'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
    } catch { /* page already errored; meta stays empty */ }

    report.push({
      name: target.name,
      width,
      status,
      ...meta,
      horizontalOverflow: meta.scrollWidth > meta.clientWidth ? meta.scrollWidth - meta.clientWidth : 0,
      consoleErrors,
      failedRequests: [...new Set(failedRequests)],
    });
    console.log(
      `${String(width).padStart(4)}  ${target.name.padEnd(42)} ${status}` +
      `${meta.brokenImages?.length ? `  BROKEN-IMG:${meta.brokenImages.length}` : ''}` +
      `${meta.emptyHrefs?.length ? `  EMPTY-HREF:${meta.emptyHrefs.length}` : ''}` +
      `${meta.scrollWidth > meta.clientWidth ? `  OVERFLOW:${meta.scrollWidth - meta.clientWidth}px` : ''}` +
      `${consoleErrors.length ? `  CONSOLE-ERR:${consoleErrors.length}` : ''}`,
    );
    await page.close();
  }
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
console.log(`\nWrote ${report.length} shots + report.json to ${outDir}`);

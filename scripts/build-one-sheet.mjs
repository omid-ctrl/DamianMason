/**
 * Generates public/docs/damian-mason-speaker-one-sheet.pdf FROM the
 * /speaker-one-sheet/ route.
 *
 *   node scripts/build-one-sheet.mjs [--base http://localhost:3200]
 *                                    [--check]
 *
 * ----------------------------------------------------------------------------
 * WHY IT IS GENERATED AND NOT DESIGNED.
 *
 * A hand-made PDF looks better than this one for exactly one edit. After that
 * somebody changes a fee answer, or a client joins the wall, or the coverage
 * count moves, and the PDF a meeting planner forwarded to a committee says
 * something the website does not, with nothing anywhere to catch it. The old
 * site's Media Kit is the worked example: a .zip on a staging host whose
 * contents nobody could describe.
 *
 * Generating it from the page makes drift structurally impossible. The page is
 * itself composed entirely out of content/, so there is one copy of every fact
 * and the chain from the data to the PDF has no retyping in it.
 *
 * playwright is already a devDependency and scripts/shoot.mjs already drives
 * it, so this costs no new dependency.
 * ----------------------------------------------------------------------------
 * WHAT `--check` IS FOR.
 *
 * It re-extracts the text of the committed PDF and asserts that every figure
 * the page states is present in it. That is the guard the repo's house style
 * asks for: content/client-sectors.ts and content/coverage.ts both carry
 * build-time throws for the same reason, because a number that only a human
 * verifies is a number that silently goes wrong.
 *
 * Run it in CI, or before a deploy, against a served production build.
 * ----------------------------------------------------------------------------
 */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'docs', 'damian-mason-speaker-one-sheet.pdf');
const ROUTE = '/speaker-one-sheet/';

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:3200';
const checkOnly = args.includes('--check');

/**
 * Every figure the page states, and the phone number and email a committee
 * needs. If one of these is missing from the extracted text, the PDF and the
 * page disagree and the build should stop.
 */
const MUST_CONTAIN = [
  '2,400',
  '50',
  '1994',
  '40,000',
  '25',
  '888.304.0702',
  'damianmasonoffice@gmail.com',
  'Damian Mason',
];

/**
 * Print styles, injected rather than shipped.
 *
 * They live here and not in a `@media print` block in the stylesheet because
 * they are not a print stylesheet for the site: they are the transform from one
 * scrolling page into one document. Chrome's print pipeline drops the sticky
 * masthead's stickiness on its own; what it does not do is remove the chrome, or
 * stop a 736px hero figure from taking most of page one.
 */
const PRINT_CSS = `
  .dm-masthead, .dm-footer, .dm-skip-link { display: none !important; }
  .dm-section { padding-block: 1.25rem !important; }
  .dm-hero__figure .dm-photo { max-block-size: 8cm; }
  .dm-section { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  figure, .dm-card, .dm-stat, .dm-sectors__row { break-inside: avoid; }
  /* The reveal never armed anything here, because nothing scrolled, but a
     print run must not depend on that being true. */
  [data-reveal] > *, [data-reveal] { opacity: 1 !important; clip-path: none !important; transform: none !important; }
`;

/**
 * Reads the text back out of the PDF that was just written.
 *
 * `pdftotext` (poppler) if it is on PATH, which is the honest way to do this:
 * it reads the real content streams and the real ToUnicode maps, so it fails
 * when the PDF is broken rather than when the parser is.
 *
 * IT RETURNS null RATHER THAN GUESSING when poppler is absent. A check that
 * silently degrades into "no news is good news" is worse than no check: this
 * exists to catch a PDF that disagrees with the page, and a stub that always
 * passes would hide exactly that. The caller warns and exits 0, because a
 * missing local tool is not a broken build.
 *
 * Not Chrome: it downloads a file:// PDF rather than rendering it, so
 * page.goto() on one throws ERR_ABORTED. Tried, and that is what happened.
 */
function extractText(file) {
  const probe = spawnSync('pdftotext', ['-v'], { encoding: 'utf8' });
  if (probe.error) return null;
  const run = spawnSync('pdftotext', ['-layout', file, '-'], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  if (run.status !== 0) {
    console.error(run.stderr || 'pdftotext failed');
    process.exit(1);
  }
  return run.stdout;
}

if (!checkOnly) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1200, height: 1600 } });
  const page = await context.newPage();

  const target = base.replace(/\/$/, '') + ROUTE;
  await page.goto(target, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.addStyleTag({ content: PRINT_CSS });
  /* Scroll the whole page once so every lazy image has decoded. print() does
     not trigger IntersectionObserver, and a PDF with four empty logo cells in
     it is worse than no PDF. */
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 120);
        else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 600);
        }
      };
      step();
    });
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
  });
  await browser.close();

  const size = fs.statSync(OUT).size;
  console.log(`wrote ${path.relative(ROOT, OUT)}  ${(size / 1024).toFixed(0)}KB`);
}

if (!fs.existsSync(OUT)) {
  console.error(`MISSING: ${path.relative(ROOT, OUT)}. Run without --check first.`);
  process.exit(1);
}

const text = extractText(OUT);
if (text === null) {
  console.warn(
    'pdftotext is not on PATH, so the PDF text was NOT verified against the page. ' +
      'Install poppler (brew install poppler) to make this check real. ' +
      'The PDF was still written.',
  );
  process.exit(0);
}
const missing = MUST_CONTAIN.filter((needle) => !text.includes(needle));

if (missing.length) {
  console.error('\nThe PDF and the page disagree. Missing from the PDF:');
  for (const m of missing) console.error(`  ${m}`);
  console.error('\nRegenerate it: node scripts/build-one-sheet.mjs');
  process.exit(1);
}

console.log(`checked ${MUST_CONTAIN.length} facts against the PDF text. All present.`);

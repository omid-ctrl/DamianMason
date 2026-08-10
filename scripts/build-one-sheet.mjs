/**
 * Generates a real one-page, tagged speaker sheet from the compact semantic
 * article rendered by /speaker-one-sheet/.
 *
 *   node scripts/build-one-sheet.mjs [--base http://localhost:3200]
 *                                    [--check]
 *
 * The public web route remains the complete planner resource. Its hidden print
 * article reads the same content objects but is composed for one Letter page;
 * the script reveals only that article, then asserts page count, tagging, and
 * source-backed facts against the PDF it wrote.
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

const MUST_CONTAIN = [
  'Straight-Forward Agriculture Dialogue',
  'The “Ations” of Agriculture',
  '2,400+',
  '50 states',
  '7 foreign countries',
  '1994',
  '40,000+',
  '15 verified written testimonials',
  '888.304.0702',
  'damianmasonoffice@gmail.com',
  'Damian Mason',
];

const MUST_NOT_CONTAIN = [
  'Download the one-sheet',
  'This page, as a one-sheet',
  'Do You Have Any Questions?',
];

const PRINT_CSS = String.raw`
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
  html, body { inline-size: 8.5in; block-size: 11in; margin: 0 !important; overflow: hidden; }
  body { background: #f4f0e7 !important; color: #17273a !important; }
  .dm-masthead, .dm-footer, .dm-skip-link { display: none !important; }
  main { display: block !important; min-block-size: 0 !important; }
  main > :not(.dm-one-sheet-print) { display: none !important; }

  .dm-one-sheet-print {
    background: #f4f0e7 !important;
    color: #17273a !important;
    display: grid !important;
    font-family: var(--font-archivo), Arial, sans-serif;
    grid-template-rows: auto auto auto minmax(0, 1fr) auto;
    block-size: 11in;
    inline-size: 8.5in;
    padding: 0.38in 0.43in 0.34in;
  }
  .dm-one-sheet-print h1,
  .dm-one-sheet-print h2,
  .dm-one-sheet-print h3,
  .dm-one-sheet-print p,
  .dm-one-sheet-print ul,
  .dm-one-sheet-print blockquote,
  .dm-one-sheet-print dl,
  .dm-one-sheet-print dd { margin: 0; }
  .dm-one-sheet-print ul { padding: 0; }

  .dm-one-sheet-print__mast {
    border-block-start: 0.11in solid #e15b2b;
    border-block-end: 1px solid #17273a;
    display: grid;
    gap: 0.22in;
    grid-template-columns: minmax(0, 1fr) 1.35in;
    padding-block: 0.14in 0.17in;
  }
  .dm-one-sheet-print__kicker {
    color: #5c6670;
    font-family: var(--font-ibm-plex-mono), monospace;
    font-size: 6.6pt;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .dm-one-sheet-print__name {
    font-family: var(--font-oswald), Arial Narrow, sans-serif;
    font-size: 12pt;
    font-weight: 600;
    letter-spacing: 0.04em;
    margin-block-start: 0.06in !important;
    text-transform: uppercase;
  }
  .dm-one-sheet-print .dm-one-sheet-print__title {
    font-family: var(--font-source-serif), Georgia, serif;
    font-size: 29pt;
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 0.94;
    margin-block-start: 0.1in;
    max-inline-size: 5.8in;
  }
  .dm-one-sheet-print__lead {
    font-family: var(--font-source-serif), Georgia, serif;
    font-size: 9.6pt;
    line-height: 1.25;
    margin-block-start: 0.09in !important;
    max-inline-size: 5.65in;
  }
  .dm-one-sheet-print__portrait {
    align-self: stretch;
    block-size: 1.62in;
    inline-size: 1.35in;
    object-fit: cover;
    object-position: 50% 18%;
  }

  .dm-one-sheet-print__stats {
    background: #17273a !important;
    color: #f4f0e7 !important;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    list-style: none;
  }
  .dm-one-sheet-print__stats li {
    border-inline-end: 1px solid #657180;
    min-block-size: 0.64in;
    padding: 0.11in 0.12in 0.09in;
  }
  .dm-one-sheet-print__stats li:last-child { border-inline-end: 0; }
  .dm-one-sheet-print__stat {
    display: block;
    font-family: var(--font-source-serif), Georgia, serif;
    font-size: 17pt;
    font-weight: 700;
    line-height: 1;
  }
  .dm-one-sheet-print__stat-label {
    color: #d8d5cd;
    display: block;
    font-family: var(--font-ibm-plex-mono), monospace;
    font-size: 5.6pt;
    letter-spacing: 0.07em;
    line-height: 1.25;
    margin-block-start: 0.04in;
    text-transform: uppercase;
  }

  .dm-one-sheet-print__body {
    display: grid;
    gap: 0.24in;
    grid-template-columns: minmax(0, 1.47fr) minmax(0, 0.83fr);
    min-block-size: 0;
    padding-block: 0.2in 0.16in;
  }
  .dm-one-sheet-print__column {
    display: flex;
    flex-direction: column;
    gap: 0.14in;
    min-block-size: 0;
  }
  .dm-one-sheet-print__panel {
    border-block-start: 2px solid #17273a;
    padding-block-start: 0.09in;
  }
  .dm-one-sheet-print__panel--accent { border-block-start-color: #e15b2b; }
  .dm-one-sheet-print h2 {
    font-family: var(--font-source-serif), Georgia, serif;
    font-size: 14.5pt;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .dm-one-sheet-print h3 {
    font-family: var(--font-oswald), Arial Narrow, sans-serif;
    font-size: 7.3pt;
    font-weight: 600;
    letter-spacing: 0.06em;
    line-height: 1.1;
    text-transform: uppercase;
  }
  .dm-one-sheet-print__copy {
    font-size: 7.7pt;
    line-height: 1.31;
    margin-block-start: 0.07in !important;
  }
  .dm-one-sheet-print__credentials {
    display: grid;
    gap: 0.09in 0.16in;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    list-style: none;
    margin-block-start: 0.09in !important;
  }
  .dm-one-sheet-print__credentials ul {
    font-size: 6.8pt;
    line-height: 1.27;
    list-style: none;
    margin-block-start: 0.04in !important;
  }
  .dm-one-sheet-print__credentials li li::before { content: '• '; color: #e15b2b; }
  .dm-one-sheet-print__clients {
    font-size: 6.4pt;
    line-height: 1.34;
    margin-block-start: 0.07in !important;
  }
  .dm-one-sheet-print blockquote {
    font-family: var(--font-source-serif), Georgia, serif;
    font-size: 10pt;
    font-style: italic;
    line-height: 1.25;
  }
  .dm-one-sheet-print cite {
    display: block;
    font-family: var(--font-ibm-plex-mono), monospace;
    font-size: 5.8pt;
    font-style: normal;
    letter-spacing: 0.06em;
    line-height: 1.3;
    margin-block-start: 0.07in;
    text-transform: uppercase;
  }
  .dm-one-sheet-print__facts {
    font-size: 7pt;
    line-height: 1.35;
    list-style: none;
    margin-block-start: 0.07in !important;
  }
  .dm-one-sheet-print__facts li {
    border-block-end: 1px solid #c8c4ba;
    padding-block: 0.045in;
  }

  .dm-one-sheet-print__stage {
    border-block-start: 2px solid #e15b2b;
    display: grid;
    margin: 0;
    min-block-size: 0;
    overflow: hidden;
    position: relative;
  }
  .dm-one-sheet-print__stage img {
    block-size: 100%;
    filter: grayscale(0.72) contrast(1.08);
    grid-area: 1 / 1;
    inline-size: 100%;
    object-fit: cover;
    object-position: 50% 38%;
  }
  .dm-one-sheet-print__stage figcaption {
    align-self: end;
    background: #17273a !important;
    color: #f4f0e7 !important;
    font-family: var(--font-ibm-plex-mono), monospace;
    font-size: 5.8pt;
    grid-area: 1 / 1;
    letter-spacing: 0.04em;
    line-height: 1.25;
    padding: 0.055in 0.1in;
    text-transform: uppercase;
    z-index: 1;
  }

  .dm-one-sheet-print__contact {
    align-items: center;
    background: #17273a !important;
    color: #f4f0e7 !important;
    display: grid;
    gap: 0.18in;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 0.13in 0.16in;
  }
  .dm-one-sheet-print__contact h2 { color: inherit !important; font-size: 13pt; }
  .dm-one-sheet-print__contact p {
    color: #d8d5cd !important;
    font-size: 6.6pt;
    line-height: 1.3;
    margin-block-start: 0.035in !important;
  }
  .dm-one-sheet-print__contact dl {
    display: grid;
    font-family: var(--font-ibm-plex-mono), monospace;
    font-size: 7pt;
    gap: 0.035in;
    text-align: end;
  }
  .dm-one-sheet-print__contact dt { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; }
  .dm-one-sheet-print a { color: inherit !important; text-decoration: none !important; }
`;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} exited ${result.status}`);
  }
  return result.stdout;
}

function verifyPdf() {
  if (!fs.existsSync(OUT)) throw new Error(`Missing ${path.relative(ROOT, OUT)}.`);

  const info = run('pdfinfo', [OUT]);
  const pages = info.match(/^Pages:\s+(\d+)$/m)?.[1];
  const tagged = info.match(/^Tagged:\s+(\S+)$/m)?.[1]?.toLowerCase();
  if (pages !== '1') throw new Error(`Speaker one-sheet is ${pages ?? 'an unknown number of'} pages, not 1.`);
  if (tagged !== 'yes') throw new Error('Speaker one-sheet is not tagged.');

  const text = run('pdftotext', ['-layout', OUT, '-']);
  const normalizedText = text.replace(/\s+/g, ' ').trim().toLowerCase();
  const normalize = (value) => value.replace(/\s+/g, ' ').trim().toLowerCase();
  const missing = MUST_CONTAIN.filter((needle) => !normalizedText.includes(normalize(needle)));
  const forbidden = MUST_NOT_CONTAIN.filter((needle) => normalizedText.includes(normalize(needle)));
  if (missing.length || forbidden.length) {
    throw new Error(
      [
        missing.length ? `Missing: ${missing.join(', ')}` : '',
        forbidden.length ? `Forbidden: ${forbidden.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  return { info, text };
}

if (!checkOnly) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
    const target = base.replace(/\/$/, '') + ROUTE;
    const response = await page.goto(target, { waitUntil: 'networkidle', timeout: 60_000 });
    if (!response?.ok()) throw new Error(`Could not load ${target}: ${response?.status() ?? 'no response'}`);

    const printSheet = page.locator('.dm-one-sheet-print');
    if ((await printSheet.count()) !== 1) {
      throw new Error(`${ROUTE} must render exactly one .dm-one-sheet-print article.`);
    }

    await page.addStyleTag({ content: PRINT_CSS });
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.querySelectorAll('.dm-one-sheet-print img')].map(async (image) => {
          const printSource = image.getAttribute('data-pdf-src');
          if (printSource) image.setAttribute('src', printSource);
          if (!image.complete || image.naturalWidth === 0) {
            await new Promise((resolve, reject) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener(
                'error',
                () => reject(new Error(`Could not load PDF image: ${printSource ?? image.src}`)),
                { once: true },
              );
            });
          }
          await image.decode?.();
        }),
      );
    });

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    await page.pdf({
      path: OUT,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
      outline: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser.close();
  }
}

const { info } = verifyPdf();
const size = fs.statSync(OUT).size;
console.log(
  `${checkOnly ? 'checked' : 'wrote'} ${path.relative(ROOT, OUT)} ` +
    `(${(size / 1024).toFixed(0)}KB, ${info.match(/^Pages:.*$/m)?.[0]}, ` +
    `${info.match(/^Tagged:.*$/m)?.[0]}).`,
);

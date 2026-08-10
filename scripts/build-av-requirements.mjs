/**
 * Builds the meeting-coordinator A/V and room setup brief from the retained
 * first-party requirements.
 *
 *   node scripts/build-av-requirements.mjs
 *   node scripts/build-av-requirements.mjs --check
 *
 * The output is intentionally generated from semantic HTML. Chromium can then
 * preserve the document hierarchy in its tagged PDF output while the script
 * verifies that every source requirement survived the print pipeline.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'public', 'docs', 'av-and-room-setup-requirements.pdf');
const RENDER_DIR = path.join(ROOT, 'tmp', 'pdfs', 'av-requirements');
const RENDER_PREFIX = path.join(RENDER_DIR, 'av-and-room-setup-requirements');
const WORDMARK = path.join(ROOT, 'public', 'img', 'brand', 'wordmark-white.png');
const checkOnly = process.argv.includes('--check');

const TITLE = 'A/V and Room SET UP Requirements for Damian Mason';
const SUBTITLE = 'These will help set the stage for a successful event.';

// Verbatim from the retained first-party PDF. Do not paraphrase these items.
const REQUIREMENTS = [
  'Standard items requested are: A Lectern on stage and a cordless lapel microphone (preferred), or a cordless handheld microphone (second choice).',
  'A projector and screen may be required that can be connected to a Mac Computer, which is determined by the program requested. Professional technical assistance must be available to troubleshoot any issues that may arise.',
  'Lighting requirements: Stage should be fully illuminated. Audience portion of the room should be at least 50% lit.',
  'An introduction for Damian will be provided and may be read by a member of your organization.',
  'If this is a meal function, introduce Damian after the audience is finished eating.',
  'We request the wait staff to depart prior to Damian’s presentation to eliminate distraction and noise.',
  'Please do not announce a ‘quick break’ or schedule a ‘5 minute stretch’ immediately prior to Damian taking the stage. This creates havoc when trying to regroup and gives people permission to leave or otherwise ‘check out’ from the program.',
  'Keep your audience in close proximity to the stage or front of room (within 6-8 feet). Guide your people to the front tables and chairs. Use RESERVED signs on tables in the BACK of the room to fill front tables. The reason for this is large open spaces kill crowd interaction, and audience energy. Huge venues with lots of empty seats make meeting planners and speakers both look bad! Select a room that adequately fits your audience size and do not overset the number of chairs and tables. Better to have the attendees ‘comfortably close.’',
  'I respectfully request that children do not attend. If children are attending, let’s talk.',
];

const ACKNOWLEDGMENT =
  'Please acknowledge that you have read and understand the above requirements for a successful program and agree to the requirements by signing below and returning a copy to us.';
const THANK_YOU = 'Thank you! We look forward to your event.';

function htmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function listItems(items) {
  return items.map((item) => `<li>${htmlEscape(item)}</li>`).join('\n');
}

function imageDataUrl(file) {
  return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
}

function documentHtml() {
  const wordmark = imageDataUrl(WORDMARK);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="author" content="Damian Mason" />
    <meta name="description" content="A/V and room setup requirements for a Damian Mason speaking engagement." />
    <title>${htmlEscape(TITLE)}</title>
    <style>
      @page { size: Letter; margin: 0; }

      * { box-sizing: border-box; }

      html,
      body {
        width: 8.5in;
        height: 11in;
        margin: 0;
        padding: 0;
      }

      body {
        background: #f7f3e9;
        color: #06283e;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      main {
        display: grid;
        grid-template-rows: 1.85in 1fr auto 0.24in;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #f7f3e9;
        border-top: 0.08in solid #ff5325;
      }

      .masthead {
        display: grid;
        grid-template-columns: 1fr 1.65in;
        align-content: start;
        gap: 0.09in 0.35in;
        padding: 0.24in 0.48in 0.18in;
        background: #06283e;
        color: #fdfefc;
      }

      .wordmark {
        display: block;
        width: 1.75in;
        height: auto;
      }

      .document-type {
        align-self: start;
        margin: 0.03in 0 0;
        color: #ffb39c;
        font-size: 7.3pt;
        font-weight: 700;
        letter-spacing: 0.13em;
        line-height: 1.25;
        text-align: right;
        text-transform: uppercase;
      }

      h1 {
        grid-column: 1 / -1;
        max-width: 6.7in;
        margin: 0;
        color: #fdfefc;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 21pt;
        font-weight: 700;
        letter-spacing: -0.025em;
        line-height: 1.04;
      }

      .subtitle {
        grid-column: 1 / -1;
        margin: -0.02in 0 0;
        color: #d3e0e8;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 9.4pt;
        font-style: italic;
        line-height: 1.25;
      }

      .requirements {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        padding: 0.28in 0.48in 0.17in;
        background: #fdfefc;
      }

      .section-heading {
        display: flex;
        align-items: center;
        gap: 0.14in;
        margin: 0 0 0.18in;
        color: #094d78;
        font-size: 7.2pt;
        font-weight: 800;
        letter-spacing: 0.14em;
        line-height: 1;
        text-transform: uppercase;
      }

      .section-heading::after {
        flex: 1;
        height: 1px;
        background: #b7cedd;
        content: '';
      }

      .requirement-columns {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 0.36in;
        min-height: 0;
      }

      ol {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0;
        padding-left: 0.25in;
      }

      ol + ol {
        padding-left: 0.39in;
        border-left: 1px solid #d3dbd0;
      }

      li {
        margin: 0;
        padding-left: 0.045in;
        color: #17232b;
        font-size: 9.1pt;
        line-height: 1.34;
      }

      li:last-child { margin-bottom: 0; }

      li::marker {
        color: #a8330e;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7.4pt;
        font-weight: 800;
      }

      .acknowledgment {
        margin: 0 0.48in 0.22in;
        padding: 0.18in 0.24in 0.19in;
        background: #e9ede8;
        border-left: 0.055in solid #ff5325;
      }

      .acknowledgment h2 {
        margin: 0 0 0.06in;
        color: #094d78;
        font-size: 7.2pt;
        font-weight: 800;
        letter-spacing: 0.14em;
        line-height: 1;
        text-transform: uppercase;
      }

      .acknowledgment p {
        margin: 0;
        color: #17232b;
        font-size: 7.9pt;
        line-height: 1.25;
      }

      .acknowledgment .thanks {
        margin-top: 0.055in;
        color: #06283e;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 8.1pt;
        font-style: italic;
        font-weight: 700;
      }

      .signature-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.32in;
        margin-top: 0.15in;
      }

      .signature-field {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: end;
        gap: 0.08in;
        color: #06283e;
        font-size: 7.3pt;
        font-weight: 700;
      }

      .signature-line {
        min-height: 0.13in;
        border-bottom: 1px solid #5f6e5c;
      }

      .footer-rule {
        background:
          linear-gradient(90deg, #06283e 0 78%, #094d78 78% 92%, #ff5325 92% 100%);
      }
    </style>
  </head>
  <body>
    <main>
      <header class="masthead">
        <img class="wordmark" src="${wordmark}" alt="Damian Mason, Business and Agriculture" />
        <p class="document-type">Event production brief</p>
        <h1>${htmlEscape(TITLE)}</h1>
        <p class="subtitle">${htmlEscape(SUBTITLE)}</p>
      </header>

      <section class="requirements" aria-labelledby="requirements-heading">
        <h2 class="section-heading" id="requirements-heading">Production requirements</h2>
        <div class="requirement-columns">
          <ol>
            ${listItems(REQUIREMENTS.slice(0, 5))}
          </ol>
          <ol start="6">
            ${listItems(REQUIREMENTS.slice(5))}
          </ol>
        </div>
      </section>

      <section class="acknowledgment" aria-labelledby="acknowledgment-heading">
        <h2 id="acknowledgment-heading">Acknowledgment</h2>
        <p>${htmlEscape(ACKNOWLEDGMENT)}</p>
        <p class="thanks">${htmlEscape(THANK_YOU)}</p>
        <div class="signature-row">
          <div class="signature-field"><span>Name:</span><span class="signature-line" aria-hidden="true"></span></div>
          <div class="signature-field"><span>Signature:</span><span class="signature-line" aria-hidden="true"></span></div>
        </div>
      </section>

      <div class="footer-rule" aria-hidden="true"></div>
    </main>
  </body>
</html>`;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });

  if (result.error) {
    throw new Error(`${command} is required to build and verify this PDF: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} exited with status ${result.status}.`);
  }

  return result.stdout;
}

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

async function build() {
  if (!fs.existsSync(WORDMARK)) {
    throw new Error(`Missing retained wordmark: ${path.relative(ROOT, WORDMARK)}`);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
    await page.setContent(documentHtml(), { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: OUTPUT,
      format: 'Letter',
      printBackground: true,
      tagged: true,
      outline: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
  } finally {
    await browser.close();
  }
}

function verify() {
  if (!fs.existsSync(OUTPUT)) {
    throw new Error(`Missing output: ${path.relative(ROOT, OUTPUT)}`);
  }

  const info = run('pdfinfo', [OUTPUT]);
  if (!/^Pages:\s+1\s*$/m.test(info)) {
    throw new Error(`Expected exactly one page.\n${info}`);
  }
  if (!/^Tagged:\s+yes\s*$/im.test(info)) {
    throw new Error(`Expected a tagged PDF.\n${info}`);
  }

  // Use the PDF's logical text flow here. `-layout` reconstructs physical
  // rows and interleaves the two columns, which makes intact list items look
  // discontinuous even though their tagged structure is correct.
  const extracted = normalizeText(run('pdftotext', [OUTPUT, '-']));
  const requiredText = [
    TITLE,
    SUBTITLE,
    ...REQUIREMENTS,
    ACKNOWLEDGMENT,
    THANK_YOU,
    'Name:',
    'Signature:',
  ];
  const missing = requiredText.filter(
    (value) => !extracted.includes(normalizeText(value)),
  );

  if (missing.length > 0) {
    throw new Error(
      `The generated PDF is missing retained text:\n${missing.map((item) => `- ${item}`).join('\n')}`,
    );
  }

  fs.mkdirSync(RENDER_DIR, { recursive: true });
  run('pdftoppm', [
    '-png',
    '-r',
    '150',
    '-f',
    '1',
    '-l',
    '1',
    '-singlefile',
    OUTPUT,
    RENDER_PREFIX,
  ]);

  const render = `${RENDER_PREFIX}.png`;
  if (!fs.existsSync(render) || fs.statSync(render).size < 10_000) {
    throw new Error(`Rendered preview is missing or unexpectedly small: ${render}`);
  }

  const sizeKb = Math.round(fs.statSync(OUTPUT).size / 1024);
  console.log(
    `${checkOnly ? 'checked' : 'built'} ${path.relative(ROOT, OUTPUT)} ` +
      `(${sizeKb}KB, 1 page, tagged, ${REQUIREMENTS.length}/9 requirements verified).`,
  );
  console.log(`rendered ${path.relative(ROOT, render)}`);
}

if (!checkOnly) await build();
verify();

#!/usr/bin/env node
/**
 * normalize-logo-ink.mjs
 *
 * Normalizes the INK of every logo-wall mark, not just its cell box.
 *
 *     node scripts/normalize-logo-ink.mjs            # rewrite the files
 *     node scripts/normalize-logo-ink.mjs --report   # measure only, write nothing
 *
 * THE PROBLEM THIS SOLVES
 *
 * The wall gives every mark an identical cell and caps the <img> on both axes,
 * so the boxes are equal. That is not the same as the marks being equal. A
 * supplied file whose artwork sits inside a wide baked-in margin spends most of
 * its capped box on white, so it renders as a speck beside a mark that was
 * cropped tight. Measured in the real wall at 1440 before this pass ran, the
 * client marks ranged from 13.1px of ink (claas, ink is 18% of the file's
 * height) to 72.0px (california-farm-bureau, ink is 100%), and the sponsors
 * from 15.6px (life-scientific) to 69.8px (newfields-ag). That is a 5.5x and a
 * 4.5x spread inside cells that are the same size to the pixel.
 *
 * The margin is dead pixels, so it comes off here rather than being chased in
 * CSS. Per-logo height overrides would need hand tuning for all 31 marks and
 * would have to be redone on the next logo drop.
 *
 * WHAT IT DOES, per mark
 *
 *   1. Finds the real ink bounding box: the outermost row and column that
 *      carries actual artwork. Robust to JPEG speckle and to a stray one-pixel
 *      rule, because a row only counts once it holds MIN_INK_RUN ink pixels.
 *   2. Crops to that box.
 *   3. Scales the ink to a common target size so every file carries enough
 *      resolution for the largest box the wall can give it at DPR 3, and no
 *      more. Never upscales past MAX_UPSCALE, because past that a lanczos
 *      resample is inventing detail that is not in the supplied artwork.
 *   4. Re-pads by PAD, the same fraction on both axes, so the canvas aspect
 *      ratio equals the ink aspect ratio and every mark is discounted by the
 *      identical 1/(1 + 2*PAD).
 *
 *   5. Emits src/styles/logo-optical.css, one custom property per mark, which
 *      is how the wall then SIZES the mark. See the next section.
 *
 * WHY A HEIGHT CAP IS NOT ENOUGH, AND WHAT REPLACED IT
 *
 * Trimming the ink makes the canvas aspect equal the mark's aspect. That was
 * necessary and it is not sufficient, because a single cell cannot hand equal
 * height AND equal width to marks whose aspect ratios run from 0.97:1 to
 * 5.68:1. Under the old dual cap a wide logotype hit max-inline-size and never
 * came near the height cap, while a square badge hit max-block-size and filled
 * it. Measured on the live wall at 1440 after the trim: claas 158.8 x 28.6,
 * california-farm-bureau 72.0 x 72.0. A 2.52x height spread, and at 390 it was
 * 4.49x with claas down at 17.8px, which is not legible.
 *
 * Chasing equal height is the wrong target. Two marks read as the same size
 * when they carry the same amount of ink, not when they are the same number of
 * pixels tall, which is why a designer sets a wide wordmark wider and shorter
 * than a square badge and the pair still look like peers. The standard
 * approximation of that judgement is to hold the geometric mean of the rendered
 * box constant: sqrt(width x height) is the side of the square with the same
 * area, so equal geometric mean is equal apparent visual weight.
 *
 * So each mark carries one number, --logo-ar-sqrt = sqrt(width / height), and
 * the wall sets
 *
 *     inline-size: calc(var(--logo-optical) * var(--logo-ar-sqrt))
 *
 * with block-size auto. That yields width = G x sqrt(a) and height = G / sqrt(a)
 * for a target G, so sqrt(w x h) = G for every mark on the wall, whatever its
 * aspect. The cell caps stay as a safety net and, at the values in
 * src/styles/tokens.css, nothing reaches them.
 *
 * The residual height spread after this is sqrt(aspect_max / aspect_min), which
 * for the 21 client marks is 2.39x. That number is not a defect to be driven
 * down: it is the amount by which a 5.68:1 logotype is genuinely wider than it
 * is tall. Driving it to 1.0x would mean rendering claas at the same height as
 * a square badge, which is 2.4x its correct visual weight and the loudest thing
 * on the wall.
 *
 * IDEMPOTENT, and by refusing to work rather than by hoping the arithmetic
 * round trips. A second run measures each file, finds it already sitting at the
 * planned size with the planned pad, and leaves the bytes alone. Without that
 * guard a jpeg mark drifts: every re-encode lays down a new ring of near-white
 * artefacts along the ink, the next trim reads them as artwork, and
 * iowa-farm-bureau walked 222 -> 221 -> 208px tall over three runs in testing.
 *
 * Side effects: rewrites public/img/clients/*, public/img/sponsors/* and their
 * webp/png siblings, updates the width and height on the matching row of
 * content/clients.ts and content/sponsors.ts, and writes
 * src/styles/logo-optical.css.
 *
 * scripts/normalize-assets.mjs calls normalizeLogoInk() at the end of its run,
 * because that script regenerates these same files from the supplied folders
 * and would otherwise put the margins straight back.
 */

import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

// This pass reads a file, overwrites it, and reads it back to confirm what
// landed. sharp's operation cache is keyed on the path and would hand back the
// bytes from before the write, which silently reported nano-yield at its old
// 640x342 while the file on disk was already 445x234.
sharp.cache(false);

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

/** The two walls, and the content file whose dimensions each one owns. */
const WALLS = [
  { dir: 'clients', content: 'clients.ts' },
  { dir: 'sponsors', content: 'sponsors.ts' },
];

/**
 * A pixel is ink when it is opaque enough to paint AND is either darker than
 * INK_LUM or carries more chroma than INK_CHROMA. The chroma half matters:
 * a pale yellow or a light cyan can sit above the luminance line and still be
 * artwork, and the wall's grayscale filter would render it as visible grey.
 */
const INK_ALPHA = 16;
const INK_LUM = 240;
const INK_CHROMA = 16;

/**
 * A row or column only counts as reaching the ink once it holds this many ink
 * pixels, so JPEG ringing along a file edge does not defeat the trim. Two
 * pixels, or half a percent of the span, whichever is larger. tidal-grow.jpg
 * needs this: its ink bounding box measured the full 200px width on a naive
 * threshold, entirely on encoder noise in the first column.
 */
const minInkRun = (span) => Math.max(2, Math.round(span * 0.005));

/**
 * Target ink size, in file pixels, sized off what the wall can actually ask
 * for. The widest cell on the site is the sponsor wall at 1440, whose content
 * box is 202.5 CSS px, and the tallest a mark may render is --logo-box-h, 72
 * CSS px. 440 by 220 covers both past DPR 3 with nothing to spare, which keeps
 * a flat two-colour logotype in the low tens of kilobytes.
 */
const TARGET_INK_W = 440;
const TARGET_INK_H = 220;

/**
 * Past 2x, resampling a small supplied file is inventing detail. Nine of the
 * 31 marks arrive with less ink than the target; they keep their own resolution
 * and are simply displayed at their honest size. This changes file resolution
 * only. It cannot change how large the mark renders, because the pad below is
 * proportional.
 */
const MAX_UPSCALE = 2;

/** Breathing room, as a fraction of the ink on each axis, on all four sides. */
const PAD = 0.03;

/**
 * Where this pass records what it wrote, so a second run can tell "already
 * normalized" from "happens to be tightly cropped" by hashing rather than by
 * guessing from pixels. Guessing does not work: a lossy re-encode moves the
 * measured ink edge by a few pixels in either direction, and every heuristic
 * that reads that back either rewrites a settled file, and drifts, or declares
 * a raw file settled and leaves the defect in place. The ledger has neither
 * failure mode. It is a build artefact, like _source/asset-map.json, and it is
 * safe to delete: a missing or stale entry just means the mark gets normalized
 * again from whatever is on disk.
 */
const LEDGER = path.join(ROOT, '_source', 'logo-ink.json');

/**
 * Reference geometry for the report only, measured off the live wall at 1440
 * with scripts/measure-logo-wall.mjs. Nothing in the pipeline reads these;
 * they exist so the before and after numbers in the log are the numbers a
 * person would get by measuring the rendered page.
 *
 * contentW is the cell's content box after the inline padding dropped to
 * --space-3 at the lg breakpoint: 191.8 and 268.6 of cell, less 12px of
 * padding on each side and the 1px inline-start hairline.
 *
 * `optical` is the G that src/styles/tokens.css targets at that width. It is
 * the largest value at which no mark on either wall touches either cap, and it
 * is bound by claas at 5.55:1 (69 x sqrt(5.55) = 162.6, inside the 166.8 the
 * client cell offers) and by newfields-ag at 0.86:1 (69 / sqrt(0.86) = 74.4,
 * inside the 76px --logo-box-h). Raise either constraint and G can rise with
 * it; raise G alone and marks start clamping, which puts the spread back.
 */
const REFERENCE_CELLS = {
  clients: { label: 'client wall @1440', contentW: 166.8, capH: 76, optical: 69 },
  sponsors: { label: 'sponsor wall @1440', contentW: 243.6, capH: 76, optical: 69 },
};

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

/**
 * The real ink bounding box of a file, plus the canvas it sits on.
 * Returns null when the file holds no ink at all.
 */
async function inkBox(file) {
  const { data, info } = await sharp(file)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isInk = (i) => {
    if (data[i + 3] < INK_ALPHA) return false;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (r * 299 + g * 587 + b * 114) / 1000;
    if (lum < INK_LUM) return true;
    return Math.max(r, g, b) - Math.min(r, g, b) > INK_CHROMA;
  };

  const rowCount = new Uint32Array(height);
  const colCount = new Uint32Array(width);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isInk((y * width + x) * channels)) continue;
      rowCount[y]++;
      colCount[x]++;
    }
  }

  const span = (counts, threshold) => {
    let lo = -1;
    let hi = -1;
    for (let i = 0; i < counts.length; i++) {
      if (counts[i] < threshold) continue;
      if (lo === -1) lo = i;
      hi = i;
    }
    return lo === -1 ? null : { lo, hi };
  };

  const rows = span(rowCount, minInkRun(width));
  const cols = span(colCount, minInkRun(height));
  if (!rows || !cols) return null;

  return {
    width,
    height,
    left: cols.lo,
    top: rows.lo,
    inkW: cols.hi - cols.lo + 1,
    inkH: rows.hi - rows.lo + 1,
  };
}

/**
 * How tall the ink renders, in CSS px, in a reference cell. This is the wall's
 * own math: contain inside a box that is capped on both axes, then take the
 * ink's share of the file's height.
 */
function renderedInkHeight(box, cell) {
  const aspect = box.width / box.height;
  const boxH = Math.min(cell.capH, cell.contentW / aspect);
  return boxH * (box.inkH / box.height);
}

// ---------------------------------------------------------------------------
// Rewrite
// ---------------------------------------------------------------------------

/** Encode `pipeline` to `ext`. Matches scripts/normalize-assets.mjs exactly. */
function encode(pipeline, ext) {
  if (ext === '.png') return pipeline.png({ compressionLevel: 9, effort: 10 });
  if (ext === '.webp') return pipeline.webp({ quality: 90, effort: 6 });
  return pipeline.jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' });
}

/** The canvas this mark should end up on, given where its ink currently is. */
function plan(box) {
  const scale = Math.min(TARGET_INK_W / box.inkW, TARGET_INK_H / box.inkH, MAX_UPSCALE);
  const inkW = Math.max(1, Math.round(box.inkW * scale));
  const inkH = Math.max(1, Math.round(box.inkH * scale));
  const padX = Math.round(inkW * PAD);
  const padY = Math.round(inkH * PAD);
  return { scale, inkW, inkH, padX, padY, width: inkW + padX * 2, height: inkH + padY * 2 };
}

/** Ledger key: the path a reader would recognise, e.g. clients/claas.png. */
const ledgerKey = (dir, file) => `${dir}/${path.basename(file)}`;

// ---------------------------------------------------------------------------
// Optical sizing
// ---------------------------------------------------------------------------

/** Where the per-mark optical factors land. Generated, never hand edited. */
const OPTICAL_CSS = path.join(ROOT, 'src', 'styles', 'logo-optical.css');

/**
 * The slug the wall marks a cell with, and the one this file keys on. It is
 * the file stem, which is already unique across both walls and is what a
 * reader sees in the markup, so a rule here can be traced to a file on disk
 * without a lookup table.
 */
const slugOf = (stem) => stem;

/**
 * One declaration per mark: sqrt(width / height) of the normalized canvas,
 * which after the ink trim above is also sqrt of the ink's aspect ratio.
 *
 * Four decimal places. At the widest cell on the site a rounding error of
 * 1e-4 moves the rendered mark by 0.02px, which is two orders of magnitude
 * below anything a subpixel raster can show.
 *
 * Deterministic and therefore idempotent: the same files produce the same
 * bytes, so a second run rewrites this file with identical content.
 */
function opticalStylesheet(rows) {
  const body = rows
    .slice()
    .sort((a, b) => (a.wall === b.wall ? a.stem.localeCompare(b.stem) : a.wall.localeCompare(b.wall)))
    .map((r) => {
      const ratio = (r.canvasW / r.canvasH).toFixed(4);
      return (
        `  .dm-logo-cell__img[data-logo="${slugOf(r.stem)}"] { --logo-ar-sqrt: ${Math.sqrt(
          r.canvasW / r.canvasH,
        ).toFixed(4)}; }  /* ${r.wall}, ${r.canvasW}x${r.canvasH}, aspect ${ratio} */`
      );
    })
    .join('\n');

  return `/* ============================================================================
   DAMIAN MASON / BUSINESS AGRICULTURE
   Per-mark optical sizing for the two logo walls.

   GENERATED by scripts/normalize-logo-ink.mjs. Do not hand edit: the next run
   of that script overwrites this file, and the numbers are derived from the
   real pixel dimensions of the files in public/img/clients and
   public/img/sponsors, so hand editing them would only make them wrong.

   Each mark carries sqrt(width / height) of its normalized canvas. The wall
   multiplies that by --logo-optical to set the mark's inline-size, which makes
   sqrt(rendered width x rendered height) the same for every mark on the wall:
   equal apparent visual weight rather than equal height. The sizing rule lives
   in src/styles/sections-core.css under LOGO WALL; the reasoning lives in the
   header of scripts/normalize-logo-ink.mjs.

   ${rows.length} marks.
   ============================================================================ */

@layer components {
${body}
}
`;
}

/**
 * Report-only view of what the emitted factors do to the two spreads that
 * matter, computed against a reference cell. The browser measurement in
 * scripts/measure-logo-wall.mjs is the authority; this is the sanity check
 * that runs without a browser.
 */
function opticalReport(rows, wall, cell, target) {
  const mine = rows.filter((r) => r.wall === wall);
  const sized = mine.map((r) => {
    const arSqrt = Math.sqrt(r.canvasW / r.canvasH);
    let w = target * arSqrt;
    let h = target / arSqrt;
    // The same two caps the stylesheet keeps as a safety net, applied in the
    // same order the browser applies them.
    if (w > cell.contentW) {
      w = cell.contentW;
      h = w / (r.canvasW / r.canvasH);
    }
    if (h > cell.capH) {
      h = cell.capH;
      w = h * (r.canvasW / r.canvasH);
    }
    return { stem: r.stem, w, h, optical: Math.sqrt(w * h) };
  });
  const range = (key) => {
    const v = sized.map((s) => s[key]);
    return { min: Math.min(...v), max: Math.max(...v), ratio: Math.max(...v) / Math.min(...v) };
  };
  return { sized, h: range('h'), w: range('w'), optical: range('optical') };
}

const sha1 = (buffer) => crypto.createHash('sha1').update(buffer).digest('hex');

async function readLedger() {
  try {
    return JSON.parse(await fsp.readFile(LEDGER, 'utf8'));
  } catch {
    return {};
  }
}

/**
 * Crop to the ink, rescale to the common target, re-pad proportionally.
 * Returns a lossless PNG buffer, so the caller can write every sibling from
 * one decode.
 */
async function normalizedBuffer(file, box, planned) {
  // flatten to white before the crop: the wall composites with
  // mix-blend-mode: multiply over a light cell, which needs an opaque pure white
  // ground, and DESIGN_SYSTEM section 7 requires every file in these two
  // folders to carry one.
  return sharp(file)
    .rotate()
    .flatten({ background: '#ffffff' })
    .extract({ left: box.left, top: box.top, width: box.inkW, height: box.inkH })
    .resize({ width: planned.inkW, height: planned.inkH, kernel: 'lanczos3', fit: 'fill' })
    .extend({
      top: planned.padY,
      bottom: planned.padY,
      left: planned.padX,
      right: planned.padX,
      background: '#ffffff',
    })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
}

/** Every raster that belongs to one mark: the primary plus its sibling. */
function siblingsOf(dir, basename) {
  const abs = (f) => path.join(ROOT, 'public', 'img', dir, f);
  const stem = basename.replace(/\.[^.]+$/, '');
  return fs
    .readdirSync(path.join(ROOT, 'public', 'img', dir))
    .filter((f) => f.replace(/\.[^.]+$/, '') === stem && /\.(png|jpe?g|webp)$/i.test(f))
    .map(abs);
}

/** Write one output file from the normalized PNG buffer. */
async function writeSibling(file, buffer) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.webp') {
    // Same choice normalize-assets.mjs makes: encode both and keep the smaller.
    // A flat brand mark usually wins with lossless.
    const [lossless, lossy] = await Promise.all([
      sharp(buffer).webp({ lossless: true, effort: 6 }).toBuffer(),
      sharp(buffer).webp({ quality: 90, effort: 6 }).toBuffer(),
    ]);
    await fsp.writeFile(file, lossless.length < lossy.length ? lossless : lossy);
    return;
  }
  await encode(sharp(buffer), ext === '.jpeg' ? '.jpg' : ext).toFile(file);
}

/**
 * Update the width and height on the row of a content file that points at
 * `logoPath`. Rewrites the numbers in place and leaves everything else, so the
 * generated header, the ordering and the hand-written notes survive.
 */
function updateContentDims(source, logoPath, width, height) {
  const needle = `logo: '${logoPath}'`;
  const lines = source.split('\n');
  let hit = false;
  const out = lines.map((line) => {
    if (!line.includes(needle)) return line;
    hit = true;
    return line
      .replace(/width: \d+/, `width: ${width}`)
      .replace(/height: \d+/, `height: ${height}`);
  });
  return { source: out.join('\n'), hit };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

/**
 * @param {{ write?: boolean, log?: (line: string) => void }} options
 * @returns {Promise<{ before: object, after: object }>} the ink-height spread
 *          per wall, before and after.
 */
export async function normalizeLogoInk({ write = true, log = console.log } = {}) {
  const result = { before: {}, after: {} };
  const ledger = await readLedger();
  const nextLedger = {};

  for (const wall of WALLS) {
    const dir = path.join(ROOT, 'public', 'img', wall.dir);
    const contentFile = path.join(ROOT, 'content', wall.content);
    let content = await fsp.readFile(contentFile, 'utf8');

    // One entry per mark, keyed on the stem, so a png and its webp sibling are
    // handled together and neither is measured twice.
    const stems = [
      ...new Set(
        fs
          .readdirSync(dir)
          .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
          .map((f) => f.replace(/\.[^.]+$/, '')),
      ),
    ].sort();

    const cell = REFERENCE_CELLS[wall.dir];
    const rows = [];

    for (const stem of stems) {
      const files = siblingsOf(wall.dir, stem);
      // Measure on whichever sibling the content file points at, falling back
      // to the first raster on disk.
      const primary =
        files.find((f) => content.includes(`/img/${wall.dir}/${path.basename(f)}`)) ?? files[0];

      // Already normalized when every sibling is byte for byte what this pass
      // last wrote. Nothing is inferred from the pixels.
      const settled = files.every((f) => {
        const recorded = ledger[ledgerKey(wall.dir, f)];
        return recorded && recorded.sha1 === sha1(fs.readFileSync(f));
      });

      const before = await inkBox(primary);
      if (!before) {
        log(`  SKIP ${stem}: no ink found`);
        continue;
      }
      const beforeH = renderedInkHeight(before, cell);
      const planned = plan(before);

      let after = before;
      if (!settled) {
        const buffer = await normalizedBuffer(primary, before, planned);
        if (write) {
          for (const f of files) await writeSibling(f, buffer);
          // Re-measure from disk, not from the buffer: a jpeg mark picks up
          // encoder artefacts on the way out and that is what a reader gets.
          after = await inkBox(primary);
        } else {
          after = await inkBox(buffer);
        }
      }

      if (write) {
        for (const f of files) {
          nextLedger[ledgerKey(wall.dir, f)] = {
            sha1: sha1(fs.readFileSync(f)),
            width: after.width,
            height: after.height,
          };
          const next = updateContentDims(
            content,
            `/img/${wall.dir}/${path.basename(f)}`,
            after.width,
            after.height,
          );
          if (next.hit) content = next.source;
        }
      }

      rows.push({
        stem,
        canvasW: after.width,
        canvasH: after.height,
        settled,
        beforeH,
        afterH: renderedInkHeight(after, cell),
        beforeFrac: before.inkH / before.height,
        afterFrac: after.inkH / after.height,
        aspect: after.inkW / after.inkH,
        dims: `${after.width}x${after.height}`,
        scale: planned.scale,
      });
    }

    if (write) await fsp.writeFile(contentFile, content);

    const spread = (key) => {
      const v = rows.map((r) => r[key]);
      return { min: Math.min(...v), max: Math.max(...v), ratio: Math.max(...v) / Math.min(...v) };
    };
    const b = spread('beforeH');
    const a = spread('afterH');
    result.before[wall.dir] = b;
    result.after[wall.dir] = a;

    log(`\n=== ${cell.label} (${rows.length} marks) ${write ? '' : '[report only]'}`);
    log('    ink height, CSS px      ink as % of file');
    log('    before   after          before  after   aspect  file       scale');
    for (const r of rows.sort((x, y) => x.afterH - y.afterH)) {
      log(
        `  ${r.beforeH.toFixed(1).padStart(6)}  ${r.afterH.toFixed(1).padStart(6)}` +
          `        ${(r.beforeFrac * 100).toFixed(0).padStart(4)}%  ${(r.afterFrac * 100).toFixed(0).padStart(4)}%` +
          `   ${r.aspect.toFixed(2).padStart(5)}  ${r.dims.padEnd(9)}  ${r.scale.toFixed(2)}x  ${r.stem}` +
          `${r.settled ? '  [already normalized, untouched]' : ''}`,
      );
    }
    log(
      `  spread ${b.min.toFixed(1)} to ${b.max.toFixed(1)} px (${b.ratio.toFixed(2)}x)` +
        `  ->  ${a.min.toFixed(1)} to ${a.max.toFixed(1)} px (${a.ratio.toFixed(2)}x)`,
    );
    result.rows = [...(result.rows ?? []), ...rows.map((r) => ({ wall: wall.dir, ...r }))];
  }

  // ------------------------------------------------------------------------
  // The optical pass. Reads the canvases the trim above settled on and emits
  // one factor per mark. Nothing here touches a raster.
  // ------------------------------------------------------------------------
  if (write) {
    await fsp.writeFile(OPTICAL_CSS, opticalStylesheet(result.rows));
    log(`\nwrote ${path.relative(ROOT, OPTICAL_CSS)} (${result.rows.length} marks)`);
  }

  for (const wall of WALLS) {
    const cell = REFERENCE_CELLS[wall.dir];
    const before = opticalReport(result.rows, wall.dir, cell, Infinity);
    const after = opticalReport(result.rows, wall.dir, cell, cell.optical);
    result.optical = result.optical ?? {};
    result.optical[wall.dir] = { before, after };
    log(`\n--- ${cell.label}, optical sizing at G=${cell.optical}px (predicted)`);
    log(
      `    height   ${before.h.min.toFixed(1)} to ${before.h.max.toFixed(1)} (${before.h.ratio.toFixed(2)}x)` +
        `  ->  ${after.h.min.toFixed(1)} to ${after.h.max.toFixed(1)} (${after.h.ratio.toFixed(2)}x)`,
    );
    log(
      `    OPTICAL  ${before.optical.min.toFixed(1)} to ${before.optical.max.toFixed(1)} (${before.optical.ratio.toFixed(2)}x)` +
        `  ->  ${after.optical.min.toFixed(1)} to ${after.optical.max.toFixed(1)} (${after.optical.ratio.toFixed(2)}x)`,
    );
  }

  if (write) {
    await fsp.writeFile(LEDGER, JSON.stringify(nextLedger, null, 2) + '\n');
  }

  return result;
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (invokedDirectly) {
  const write = !process.argv.includes('--report');
  normalizeLogoInk({ write }).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

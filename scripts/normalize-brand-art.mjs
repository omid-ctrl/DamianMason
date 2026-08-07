#!/usr/bin/env node
/**
 * normalize-brand-art.mjs
 *
 * The same ink normalization scripts/normalize-logo-ink.mjs performs on the two
 * logo walls, applied to the handful of supplied brand marks that are placed on
 * the site AS MARKS.
 *
 *     node scripts/normalize-brand-art.mjs            # rewrite the files
 *     node scripts/normalize-brand-art.mjs --report   # measure only, write nothing
 *
 * TWO DEFECTS, ONE PASS
 *
 * 1. BOX, NOT INK. Every mark here is placed in a box the page sizes, and a
 *    supplied file whose artwork sits inside a baked-in margin spends that box
 *    on nothing. Measured before this pass: the-granary.png carries its ink in
 *    77% of its width and 59% of its height, so in a 76px box the mark rendered
 *    45px tall beside an xtreme-ag.jpg that rendered 54, in cells the eye reads
 *    as a pair. Trimming to the ink makes the canvas aspect the MARK's aspect,
 *    which is the precondition for anything downstream sizing it correctly.
 *
 * 2. THE GHOST. business-of-agriculture.png ships a soft grey rectangle to the
 *    upper right of the badge, left over from whatever composition it was
 *    exported from: about 10,500 pixels of grey 127 to 191 sitting at alpha 1
 *    to 8. At full opacity that would be obvious; at 2% it is invisible in the
 *    source file and survives review. It does not stay invisible. The mark is
 *    served through the Next image optimizer at q=75, and a lossy encoder does
 *    not preserve the colour of near-transparent pixels, so the ghost is
 *    amplified into a visible dirty rectangle beside the leaf. Confirmed by
 *    screenshotting the rendered page at 1440 and cropping the lockup.
 *
 *    The fix is to delete the data rather than to hide it. Any pixel under
 *    GHOST_ALPHA is written fully transparent, and every transparent pixel gets
 *    TRANSPARENT_RGB laid under it, so there is nothing left for an encoder to
 *    rebuild the rectangle out of. See the note on that constant: deleting the
 *    alpha alone was not enough, because the optimizer's AVIF reinvented the
 *    rectangle from the teal the exporter had left in the RGB channels of the
 *    transparent region. Real antialiasing along a glyph edge sits far above
 *    GHOST_ALPHA and is untouched.
 *
 * WHAT IS AND IS NOT IN THE ALLOWLIST
 *
 * MARKS is explicit, not a directory scan, because public/img/brand also holds
 * files that must not be trimmed:
 *
 *   - The two podcast COVER ARTS are square by specification. Platforms require
 *     a square, and business-of-agriculture-podcast.jpg is also the PodcastSeries
 *     image in lib/schema.ts. Its white margin is part of the cover, not a
 *     defect. The /podcasts/ row equalizes those two against the XtremeAg
 *     wordmark in CSS instead, by optical area, which needs no file change.
 *   - The wordmark is site chrome on every route and its spacing is the
 *     header's, not this script's.
 *   - The avatar, the icon and the monogram are favicon and embed sources at
 *     fixed sizes.
 *
 * Adding a file here changes how it renders everywhere it is placed, so the
 * declared width and height at every placement has to move with it. The
 * placements are listed against each entry below.
 *
 * IDEMPOTENT the same way its sibling is, and for the same reason: by a sha1
 * ledger rather than by re-reading the pixels. A lossy re-encode moves the
 * measured ink edge a few pixels either way, so any heuristic that infers
 * "already normalized" from the pixels either rewrites a settled file and
 * drifts, or declares a raw file settled and leaves the defect in place.
 */

import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

// This pass reads a file, overwrites it and reads it back. sharp's operation
// cache is keyed on the path and would hand back the pre-write bytes.
sharp.cache(false);

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'img', 'brand');
const LEDGER = path.join(ROOT, '_source', 'brand-art-ink.json');

/**
 * @typedef {{ stem: string, ground: 'transparent' | 'white', placements: string[] }} Mark
 * @type {Mark[]}
 */
const MARKS = [
  {
    stem: 'business-of-agriculture',
    ground: 'transparent',
    placements: ['app/the-business-of-agriculture/page.tsx, the subscribe band lockup'],
  },
  {
    stem: 'the-granary',
    ground: 'transparent',
    placements: [
      'app/the-business-of-agriculture/page.tsx, the partner row',
      'app/xtreme-ag/page.tsx, the partner row',
    ],
  },
  {
    stem: 'xtreme-ag',
    ground: 'white',
    placements: ['app/the-business-of-agriculture/page.tsx, the partner row'],
  },
  {
    stem: 'xtreme-ag-transparent',
    ground: 'transparent',
    placements: [
      'app/podcasts/page.tsx, the show row',
      'app/xtreme-ag/page.tsx, the show mark',
    ],
  },
  /* Added in the desktop presentation pass. This one was missed when the list
     was first written and it was the worst offender on the site: the seal
     carried its ink in 66% of the canvas width and 65% of the height, against
     92% to 96% for every other entry here. It is placed as the whole right
     column of the /boasg/ hero, so at --size-brand-art-max the box measured
     352 by 352 and the visible mark measured about 232, sitting inside a
     hairline frame 493 wide. The frame read as an empty box with a small stamp
     in the middle rather than as a mark on the page.

     It is a mark, not a cover art: the two podcast covers are excluded above
     because a platform requires their square margin, and nothing requires this
     one. See the placement note below for the declared dimensions that move
     with the trim. */
  {
    stem: 'boasg-white',
    ground: 'white',
    placements: ['app/boasg/page.tsx, the hero badge'],
  },
];

/** Under this, a pixel is treated as ghost data and deleted outright. */
const GHOST_ALPHA = 24;

/**
 * The colour written UNDER every transparent pixel, and it is not cosmetic.
 *
 * A transparent pixel still carries RGB, and every supplied file here carried
 * the exporter's leftovers: (76,105,113), a mid teal. Nothing composites it, so
 * it is invisible in the file and in any lossless copy. It is not invisible
 * downstream. These marks are served through the Next image optimizer, which
 * emits AVIF with a LOSSY alpha channel, and a lossy alpha channel does not
 * reproduce zero exactly. Fetching the optimizer's own output for the lockup
 * and profiling it: the region that should be fully transparent came back at
 * alpha 6 to 7 carrying grey 146, which over the bone ground darkens the paper
 * by about 7 levels in a rectangle the size of the deleted ghost. That is the
 * dirty rectangle, rebuilt by the encoder out of data the file did not need to
 * be carrying.
 *
 * White is the answer rather than black or a bleed of the nearest opaque
 * neighbour, because every one of these marks was drawn on white and is placed
 * on bone or on a bright plate. If the encoder leaks a few percent of it, it
 * lightens the paper by well under one level and cannot be seen. A black or
 * teal leak is the defect this pass exists to remove.
 */
const TRANSPARENT_RGB = 255;

/**
 * PNG save options, and the missing `effort` is the point.
 *
 * sharp's PNG writer treats effort >= 7 as permission to quantize to a palette,
 * and a palette has no concept of "the colour under a transparent pixel": every
 * fully transparent pixel is reassigned to whatever palette entry the quantizer
 * picked, which on these files is the exporter's teal. So `effort: 10` silently
 * put back the exact RGB that TRANSPARENT_RGB exists to remove, and the first
 * version of this pass wrote clean pixels and saved dirty ones. Verified by
 * encoding the same cleaned buffer four ways and reading the transparent region
 * back: plain and compressionLevel 9 both returned 255,255,255,0; effort 10 and
 * compressionLevel 9 plus effort 10 both returned 76,105,113,0.
 *
 * The cost is about 4KB per mark across four marks. The mark is served as AVIF
 * by the image optimizer anyway, so no visitor downloads these bytes.
 */
const PNG_OPTIONS = { compressionLevel: 9 };

/**
 * Ledger format version. Bumping it makes a file that settled under an older
 * pass eligible for the parts of this pass it has not had, without making it
 * eligible for the trim, which must never run twice on the same canvas: a
 * second trim would take another 3% off the pad and the mark would walk.
 */
const PASS_VERSION = 3;

/** A pixel on a white ground is ink when it is darker or more chromatic than
 *  the paper. Same thresholds as scripts/normalize-logo-ink.mjs. */
const INK_LUM = 240;
const INK_CHROMA = 16;

/** A row or column reaches the ink once it holds this many ink pixels, so
 *  encoder ringing along a file edge does not defeat the trim. */
const minInkRun = (span) => Math.max(2, Math.round(span * 0.005));

/** Breathing room, as a fraction of the ink on each axis, on all four sides.
 *  Identical to the logo walls', so a brand mark and a client mark placed in
 *  the same size box carry the same discount. */
const PAD = 0.03;

/** Longest edge of the normalized ink, in file pixels. These marks render at
 *  most 224 CSS px wide, so 480 covers DPR 2 with headroom and never upscales
 *  a supplied file past its own resolution. */
const TARGET_INK_LONG = 480;

const sha1 = (buffer) => crypto.createHash('sha1').update(buffer).digest('hex');

/** Every raster belonging to one mark: the primary plus its webp sibling. */
function siblingsOf(stem) {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.replace(/\.[^.]+$/, '') === stem && /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => path.join(DIR, f));
}

/** The file the page points at, which is the one that defines the geometry. */
function primaryOf(stem, ground) {
  const files = siblingsOf(stem);
  const wanted = ground === 'transparent' ? /\.png$/i : /\.jpe?g$/i;
  return files.find((f) => wanted.test(f)) ?? files[0];
}

/**
 * The ink bounding box, plus the de-ghosted RGBA buffer it was measured on.
 *
 * On a transparent ground, ink is alpha. On a white ground, ink is anything
 * darker or more saturated than the paper.
 */
async function analyse(file, ground) {
  const { data, info } = await sharp(file)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const clean = Buffer.from(data);

  const isInk = (i) => {
    const a = clean[i + 3];
    if (ground === 'transparent') return a >= GHOST_ALPHA;
    if (a < GHOST_ALPHA) return false;
    const r = clean[i];
    const g = clean[i + 1];
    const b = clean[i + 2];
    if ((r * 299 + g * 587 + b * 114) / 1000 < INK_LUM) return true;
    return Math.max(r, g, b) - Math.min(r, g, b) > INK_CHROMA;
  };

  const rowCount = new Uint32Array(height);
  const colCount = new Uint32Array(width);
  let ghosts = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      // Delete the ghost before measuring, so a 2%-alpha rectangle can never
      // define the ink box either, and lay white under everything transparent
      // so a lossy alpha channel downstream has nothing to rebuild it from.
      if (clean[i + 3] < GHOST_ALPHA) {
        if (clean[i + 3] > 0) ghosts++;
        clean[i] = TRANSPARENT_RGB;
        clean[i + 1] = TRANSPARENT_RGB;
        clean[i + 2] = TRANSPARENT_RGB;
        clean[i + 3] = 0;
        continue;
      }
      if (!isInk(i)) continue;
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
    clean,
    width,
    height,
    channels,
    ghosts,
    left: cols.lo,
    top: rows.lo,
    inkW: cols.hi - cols.lo + 1,
    inkH: rows.hi - rows.lo + 1,
  };
}

/** The canvas this mark should land on. */
function plan(box) {
  const scale = Math.min(TARGET_INK_LONG / Math.max(box.inkW, box.inkH), 1);
  const inkW = Math.max(1, Math.round(box.inkW * scale));
  const inkH = Math.max(1, Math.round(box.inkH * scale));
  const padX = Math.round(inkW * PAD);
  const padY = Math.round(inkH * PAD);
  return { inkW, inkH, padX, padY, width: inkW + padX * 2, height: inkH + padY * 2 };
}

/**
 * Crop to the ink, rescale, re-pad. Returns a lossless PNG buffer so every
 * sibling is written from one decode.
 *
 * `trim: false` keeps the canvas exactly as it is and only carries the cleaned
 * pixels through, which is the path a file that has already been trimmed by an
 * earlier run takes. Trimming a trimmed canvas would take another PAD off it
 * every run and the mark would walk.
 */
async function normalizedBuffer(box, planned, ground, trim = true) {
  const background =
    ground === 'transparent'
      ? { r: TRANSPARENT_RGB, g: TRANSPARENT_RGB, b: TRANSPARENT_RGB, alpha: 0 }
      : { r: 255, g: 255, b: 255, alpha: 1 };
  let pipeline = sharp(box.clean, {
    raw: { width: box.width, height: box.height, channels: box.channels },
  });
  if (ground === 'white') pipeline = pipeline.flatten({ background: '#ffffff' });
  if (!trim) return pipeline.png(PNG_OPTIONS).toBuffer();
  return pipeline
    .extract({ left: box.left, top: box.top, width: box.inkW, height: box.inkH })
    .resize({ width: planned.inkW, height: planned.inkH, kernel: 'lanczos3', fit: 'fill' })
    .extend({
      top: planned.padY,
      bottom: planned.padY,
      left: planned.padX,
      right: planned.padX,
      background,
    })
    .png(PNG_OPTIONS)
    .toBuffer();
}

async function writeSibling(file, buffer, ground) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.webp') {
    // A mark with transparency is always written lossless, for the same reason
    // PNG_OPTIONS drops `effort`: a lossy encoder does not preserve the colour
    // under a transparent pixel, and that colour is load-bearing here.
    if (ground === 'transparent') {
      await sharp(buffer).webp({ lossless: true, effort: 6 }).toFile(file);
      return;
    }
    const [lossless, lossy] = await Promise.all([
      sharp(buffer).webp({ lossless: true, effort: 6 }).toBuffer(),
      sharp(buffer).webp({ quality: 90, effort: 6 }).toBuffer(),
    ]);
    await fsp.writeFile(file, lossless.length < lossy.length ? lossless : lossy);
    return;
  }
  if (ext === '.png') {
    await sharp(buffer).png(PNG_OPTIONS).toFile(file);
    return;
  }
  // A jpeg cannot carry the transparent pad, so it is flattened to the paper
  // white the mark was drawn on. Only the `white` ground marks take this path.
  await sharp(buffer)
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(file);
  if (ground === 'transparent') throw new Error(`refusing to flatten ${file}`);
}

async function readLedger() {
  try {
    return JSON.parse(await fsp.readFile(LEDGER, 'utf8'));
  } catch {
    return {};
  }
}

export async function normalizeBrandArt({ write = true, log = console.log } = {}) {
  const ledger = await readLedger();
  const next = {};
  const rows = [];

  for (const mark of MARKS) {
    const files = siblingsOf(mark.stem);
    if (files.length === 0) {
      log(`  SKIP ${mark.stem}: no raster on disk`);
      continue;
    }
    const primary = primaryOf(mark.stem, mark.ground);

    /**
     * Three states, not two.
     *   done    this pass at this version already wrote these exact bytes.
     *   trimmed an earlier version trimmed the canvas. The geometry is final
     *           and must not be touched again, but the newer cleaning steps
     *           still have to run over it.
     *   raw     never seen. Gets the whole pass.
     */
    const bytesMatch = files.every((f) => {
      const recorded = ledger[path.basename(f)];
      return recorded && recorded.sha1 === sha1(fs.readFileSync(f));
    });
    const atVersion = files.every(
      (f) => (ledger[path.basename(f)]?.v ?? 1) >= PASS_VERSION,
    );
    const state = bytesMatch ? (atVersion ? 'done' : 'trimmed') : 'raw';

    const box = await analyse(primary, mark.ground);
    if (!box) {
      log(`  SKIP ${mark.stem}: no ink found`);
      continue;
    }
    const planned = plan(box);

    if (state !== 'done' && write) {
      const buffer = await normalizedBuffer(box, planned, mark.ground, state === 'raw');
      for (const f of files) await writeSibling(f, buffer, mark.ground);
    }

    const after =
      state === 'raw'
        ? { width: planned.width, height: planned.height }
        : { width: box.width, height: box.height };

    if (write) {
      for (const f of files) {
        next[path.basename(f)] = { v: PASS_VERSION, sha1: sha1(fs.readFileSync(f)), ...after };
      }
    }

    rows.push({
      stem: mark.stem,
      state,
      before: `${box.width}x${box.height}`,
      inkFrac: `${Math.round((box.inkW / box.width) * 100)}% x ${Math.round((box.inkH / box.height) * 100)}%`,
      after: `${after.width}x${after.height}`,
      ghosts: box.ghosts,
      placements: mark.placements,
    });
  }

  if (write) await fsp.writeFile(LEDGER, JSON.stringify(next, null, 2) + '\n');

  log(`\n=== brand marks (${rows.length}) ${write ? '' : '[report only]'}`);
  log('  before      ink of canvas   after       ghost px   mark');
  for (const r of rows) {
    log(
      `  ${r.before.padEnd(11)} ${r.inkFrac.padEnd(15)} ${r.after.padEnd(11)} ${String(r.ghosts).padStart(8)}   ${r.stem}` +
        `${r.settled ? '  [already normalized, untouched]' : ''}`,
    );
  }
  log('\n  Declared width and height to keep in step with the numbers above:');
  for (const r of rows) {
    for (const p of r.placements) log(`    ${r.after.padEnd(11)} ${r.stem} -> ${p}`);
  }

  return rows;
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (invokedDirectly) {
  const write = !process.argv.includes('--report');
  normalizeBrandArt({ write }).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

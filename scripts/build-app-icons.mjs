/**
 * Build the two derived app icons from the master, app/icon.png.
 *
 *   node scripts/build-app-icons.mjs [--check]
 *
 * WHY THIS IS A REAL SCRIPT AND NOT SCRATCH
 * Phase 0 shipped the create-next-app scaffold favicon, Vercel's white triangle
 * in a black circle, on all 20 routes, so every browser tab and bookmark for
 * damianmason.com carried the framework vendor's logo. The replacement is the
 * client's own DM monogram, cut from _source/media/cropped-favicon.jpg (the
 * favicon the old site served) by way of public/img/brand/dm-monogram.jpg. That
 * cut is committed as app/icon.png and is the master; nothing here re-cuts it,
 * because the crop was made by eye and re-deriving it from the JPEG would
 * silently change the artwork.
 *
 * What this script does own is the other two files, which are pure resizes and
 * must never drift from the master:
 *
 *   app/apple-icon.png  180x180, the iOS home-screen icon
 *   app/favicon.ico     16/32/48 PNG frames in an ICO container
 *
 * Both were previously produced by a file named `_ico-tmp.mjs`, i.e. by
 * something every later pass was entitled to delete, which would have left the
 * shipped .ico with no way back. That is the fragility this file removes.
 *
 * A modern .ico permits a raw PNG payload per frame, which is why the frames go
 * in as PNG rather than BMP.
 *
 * --check verifies the committed files still match what the master produces and
 * exits non-zero if they do not. Nothing is written in that mode.
 *
 * Next.js picks all three up from app/ by filename convention and emits the
 * <link rel="icon"> and <link rel="apple-touch-icon"> tags itself. There is no
 * hand-written link tag anywhere and there is no web manifest. See the icon row
 * in docs/CONTENT_MANIFEST.md.
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const MASTER = 'app/icon.png';
const APPLE = 'app/apple-icon.png';
const ICO = 'app/favicon.ico';
/** The frame sizes a browser actually asks an .ico for. */
const ICO_SIZES = [16, 32, 48];
/** Apple's home-screen size. One file, not a ladder: iOS downsamples fine. */
const APPLE_SIZE = 180;

const check = process.argv.includes('--check');

/** `cover` rather than `contain`: the master is already square, so this is a
 *  straight resample and can never letterbox the mark onto a new ground. */
const resize = (size) =>
  sharp(MASTER)
    .resize(size, size, { fit: 'cover' })
    .ensureAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer();

/** ICO container: a 6 byte header, then one 16 byte directory entry per frame,
 *  then the frame payloads. Every offset is absolute from the start of file. */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved, always 0
  header.writeUInt16LE(1, 2); // type 1 = icon (2 would be cursor)
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + 16 * frames.length;
  const dir = [];
  for (const f of frames) {
    const e = Buffer.alloc(16);
    // 0 means 256 in this field, which is why it is not a plain write.
    e.writeUInt8(f.size === 256 ? 0 : f.size, 0);
    e.writeUInt8(f.size === 256 ? 0 : f.size, 1);
    e.writeUInt8(0, 2); // palette entries: none, this is truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(f.png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += f.png.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...frames.map((f) => f.png)]);
}

if (!fs.existsSync(MASTER)) {
  console.error(`missing master ${MASTER}. Nothing can be derived without it.`);
  process.exit(1);
}

const apple = await resize(APPLE_SIZE);
const frames = [];
for (const size of ICO_SIZES) frames.push({ size, png: await resize(size) });
const ico = buildIco(frames);

const outputs = [
  { path: APPLE, buffer: apple, note: `${APPLE_SIZE}x${APPLE_SIZE}` },
  { path: ICO, buffer: ico, note: `frames ${ICO_SIZES.join('/')}` },
];

let drifted = 0;
for (const o of outputs) {
  const current = fs.existsSync(o.path) ? fs.readFileSync(o.path) : null;
  const same = current !== null && current.equals(o.buffer);
  if (check) {
    console.log(`${same ? 'ok   ' : 'DRIFT'} ${o.path.padEnd(22)} ${o.note}`);
    if (!same) drifted += 1;
    continue;
  }
  if (same) {
    console.log(`unchanged ${o.path.padEnd(22)} ${o.note}`);
    continue;
  }
  fs.writeFileSync(o.path, o.buffer);
  console.log(`wrote     ${o.path.padEnd(22)} ${o.buffer.length} bytes, ${o.note}`);
}

if (check && drifted) {
  console.error(`\n${drifted} derived icon(s) no longer match ${MASTER}. Run without --check to rebuild.`);
  process.exit(1);
}

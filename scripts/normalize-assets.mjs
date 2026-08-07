#!/usr/bin/env node
/**
 * normalize-assets.mjs
 *
 * Repeatable, idempotent normalization of every supplied and mirrored image
 * asset into public/img/. Run from the repo root:
 *
 *     node scripts/normalize-assets.mjs
 *
 * Sources
 *   Client Logos/                                 -> public/img/clients/
 *   Website - List of Podcast Sponsors - Logos/   -> public/img/sponsors/
 *   Damian Mason Logos/                           -> public/img/brand/
 *   _source/media/                                -> public/img/{brand,logos,photos}/
 *
 * Rules enforced here
 *   - Output names are kebab-case, lowercase, no spaces, no parentheses, and
 *     are derived from the BRAND name rather than the incoming filename.
 *   - Logos are capped at LOGO_MAX px on the longest side. Photos are capped at
 *     PHOTO_MAX px on the longest side. Nothing is ever upscaled.
 *   - Every logo also gets a .webp sibling at identical pixel dimensions. Both
 *     lossless and quality 90 are encoded and the smaller file wins, which is
 *     what "lossless for flat color if that is smaller" resolves to.
 *   - EXIF is stripped. Orientation is baked in first via rotate() so that
 *     camera originals do not end up sideways once the tag is gone.
 *   - LOGO-REVISION-B-A-F-01 copy.png is never read and never written. The
 *     client asked for that mark to be omitted from the site.
 *
 * Side effects: writes public/img/**, content/clients.ts, content/sponsors.ts,
 * content/brand-assets.ts, and _source/asset-map.json.
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const PUBLIC_IMG = path.join(ROOT, 'public', 'img');
const CONTENT = path.join(ROOT, 'content');

/** Longest side, in px, for a display logo. */
const LOGO_MAX = 800;
/** Longest side, in px, for a photograph or screenshot. */
const PHOTO_MAX = 2000;

const SRC_CLIENTS = 'Client Logos';
const SRC_SPONSORS = 'Website - List of Podcast Sponsors - Logos';
const SRC_BRAND = 'Damian Mason Logos';
const SRC_MEDIA = '_source/media';

/**
 * Files that must never be processed, whatever else the walker finds.
 * Matched against the basename.
 */
const FORBIDDEN = new Set(['LOGO-REVISION-B-A-F-01 copy.png']);

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------
// Each entry: { src, dir, base, kind, name?, url?, ext? }
//   src  - path relative to repo root
//   dir  - subfolder under public/img
//   base - output basename without extension
//   kind - 'logo' (capped at LOGO_MAX, gets a webp sibling) or 'photo'
//   ext  - override the output raster extension; defaults to the source's

/** @type {{name: string, src: string, base: string}[]} */
const CLIENTS = [
  { name: 'AgFirst Farm Credit', src: 'AgFirst FC Logo.png', base: 'agfirst-farm-credit' },
  { name: 'Agromark', src: 'Agromark.jpeg', base: 'agromark' },
  { name: 'Almond Alliance', src: 'Almond Alliance logo.png', base: 'almond-alliance' },
  { name: 'California Farm Bureau', src: 'CA Farm Bureau.png', base: 'california-farm-bureau' },
  { name: 'Cargill', src: 'Cargill logo.png', base: 'cargill' },
  { name: 'CLAAS', src: 'Claas logo.png', base: 'claas' },
  { name: 'Compeer Financial', src: 'Compeer.jpeg', base: 'compeer-financial' },
  { name: 'Egg Farmers', src: 'Egg Farmers Logo.jpg', base: 'egg-farmers' },
  { name: 'Farm Credit Services of America', src: 'FCS of America Logo.png', base: 'farm-credit-services-of-america' },
  { name: 'Hudson Insurance', src: 'Hudson Insurance.png', base: 'hudson-insurance' },
  { name: 'Indiana Farm Bureau', src: 'Indiana Farm Bureau.jpeg', base: 'indiana-farm-bureau' },
  { name: 'Iowa Farm Bureau', src: 'Iowa Farm Bureau.jpeg', base: 'iowa-farm-bureau' },
  { name: "Land O'Lakes Purina", src: 'Land OLakes Purina.png', base: 'land-olakes-purina' },
  { name: 'Merck', src: 'Merck Logo.png', base: 'merck' },
  { name: 'North Dakota Grain Dealers Association', src: 'NDGrain Dealers.jpeg', base: 'north-dakota-grain-dealers-association' },
  { name: 'Pioneer Seeds', src: 'Pioneer Seeds.png', base: 'pioneer-seeds' },
  { name: 'Prairie Oat Growers Association', src: 'Prairie Oat Growers logo.jpeg', base: 'prairie-oat-growers-association' },
  { name: 'South Dakota Soybean Association', src: 'SD Soybean Association.png', base: 'south-dakota-soybean-association' },
  { name: 'Superior Livestock Auction', src: 'Superior Livestock Auction.png', base: 'superior-livestock-auction' },
  { name: 'USAEDC', src: 'USAEDC-logo.png', base: 'usaedc' },
  { name: 'Wilbur-Ellis', src: 'Wilbur Ellis .jpeg', base: 'wilbur-ellis' },
];

/**
 * Sponsor URLs were each verified against the company's live site rather than
 * inferred from the brand name. See the note block in content/sponsors.ts.
 */
const SPONSORS = [
  { name: 'AgView Solutions', src: 'Agview solutions logo.jpeg', base: 'agview-solutions', url: 'https://agviewsolutions.com' },
  { name: 'EarthOptics', src: 'EarthOptics.png', base: 'earthoptics', url: 'https://earthoptics.com' },
  { name: 'Good Agriculture', src: 'Good Agriculture logo.png', base: 'good-agriculture', url: 'https://goodagriculture.com' },
  { name: 'Harvest Returns', src: 'Harvest Returns.jpeg', base: 'harvest-returns', url: 'https://harvestreturns.com' },
  { name: 'Heads Up Plant Protectants', src: 'Heads Up logo.jpg', base: 'heads-up-plant-protectants', url: 'https://headsupst.com' },
  { name: 'Life Scientific', src: 'Life Scientific.jpeg', base: 'life-scientific', url: 'https://lifescientific.com' },
  { name: 'Nano-Yield', src: 'Nano-Yield- logo.webp', base: 'nano-yield', url: 'https://nano-yield.com' },
  { name: 'NewFields Ag', src: 'NewFields Ag.jpg', base: 'newfields-ag', url: 'https://newfieldsag.com' },
  { name: 'Redox Bio', src: 'Redox Bio logo.png', base: 'redox-bio', url: 'https://redoxgrows.com' },
  { name: 'Tidal Grow', src: 'Tidal Grow.jpeg', base: 'tidal-grow', url: 'https://tidalgrowag.com' },
];

/** Damian's own marks, from both the supplied folder and the mirror. */
const BRAND = [
  { src: `${SRC_BRAND}/BOASG-BRAND-LOGO-FINAL-LINKSHARE.jpg`, base: 'boasg' },
  { src: `${SRC_BRAND}/BOASG-BRAND-LOGO-FINAL-WHITE.jpg`, base: 'boasg-white-flat' },
  { src: `${SRC_BRAND}/Business of AG-STACKED-black.png`, base: 'business-of-agriculture' },
  { src: `${SRC_BRAND}/DM-BIZ-AG-PODCAST-LOGO (1).jpg`, base: 'business-of-agriculture-podcast' },
  { src: `${SRC_BRAND}/The Granary 3x png@3x.PNG`, base: 'the-granary' },
  { src: `${SRC_BRAND}/XAF logo.jpeg`, base: 'xtreme-ag' },

  { src: `${SRC_MEDIA}/LOGO-DM-BLUE-ORANGE-2000px-transparent.png`, base: 'wordmark' },
  { src: `${SRC_MEDIA}/LOGO-DM-WHITE-2000px-transparent.png`, base: 'wordmark-white' },
  { src: `${SRC_MEDIA}/BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png`, base: 'boasg-white' },
  { src: `${SRC_MEDIA}/DBB-LOGO.png`, base: 'do-business-better-podcast' },
  { src: `${SRC_MEDIA}/THE-BIZ-OF-AGRICULTURE-PODCAST-GRAPHIC.png`, base: 'business-of-agriculture-lockup' },
  { src: `${SRC_MEDIA}/biz-of-ag-podcast-icon-white.png`, base: 'business-of-agriculture-icon-white' },
  { src: `${SRC_MEDIA}/avatars-000339569153-fp12nh-t500x500.png`, base: 'business-of-agriculture-avatar' },
  { src: `${SRC_MEDIA}/xtremelogo.png`, base: 'xtreme-ag-transparent' },
  { src: `${SRC_MEDIA}/cropped-favicon.jpg`, base: 'dm-monogram' },
];

/**
 * Third-party marks that were on the old site but are not part of the curated
 * 21 client logos. They live in their own folder so public/img/clients stays a
 * one to one match for content/clients.ts.
 */
const THIRD_PARTY_LOGOS = [
  { src: `${SRC_MEDIA}/19225_IPPA_Alliance_Logo_4C-scaled-1.jpg`, base: 'iowa-pork-alliance' },
  { src: `${SRC_MEDIA}/BASF-Logo_bw.svg_.png`, base: 'basf' },
  { src: `${SRC_MEDIA}/John_Deere_logo.svg_.png`, base: 'john-deere' },
  { src: `${SRC_MEDIA}/lo-helenalogo.png`, base: 'helena' },
  { src: `${SRC_MEDIA}/FCSAmerica-logo-400x192-1.jpg`, base: 'farm-credit-services-of-america' },
  { src: `${SRC_MEDIA}/merck-logo.png`, base: 'merck' },
  { src: `${SRC_MEDIA}/acres-tv.png`, base: 'acres-tv' },
];

/** Photographs, portraits, book covers, collages, and press or episode stills. */
const PHOTOS = [
  { src: `${SRC_MEDIA}/2-background-microphones-on-a-stand-2022-11-16-19-05-19-utc-scaled.jpg`, base: 'microphones-background' },
  { src: `${SRC_MEDIA}/331668334_973198694086419_2283442893014987447_n.jpeg`, base: 'book-signing-table' },
  { src: `${SRC_MEDIA}/332503780_161776152950398_8554729294588018579_n.jpeg`, base: 'keynote-stage-xtremeag' },
  { src: `${SRC_MEDIA}/458B0C93-D40F-4CF5-B0CC-BC1C89816092.jpeg`, base: 'breakout-session-audience' },
  { src: `${SRC_MEDIA}/DM-audience-230102.jpg`, base: 'speaking-to-audience' },
  { src: `${SRC_MEDIA}/DM-image0-1.jpeg`, base: 'keynote-stage-podium' },
  { src: `${SRC_MEDIA}/DSC_7312-scaled.jpg`, base: 'portrait-office-seated' },
  { src: `${SRC_MEDIA}/DSC_7419-scaled.jpg`, base: 'portrait-light-jacket' },
  { src: `${SRC_MEDIA}/DSC_7639.jpg`, base: 'portrait-black-suit' },
  { src: `${SRC_MEDIA}/Damian-Collab-crop-scaled.jpg`, base: 'portrait-dark-blazer' },
  { src: `${SRC_MEDIA}/IMG_3597-rotated.jpg`, base: 'keynote-stage-wide' },
  { src: `${SRC_MEDIA}/book-signing-IMG_2446.png`, base: 'book-signing-xtremeag' },
  { src: `${SRC_MEDIA}/dbb-online-store.png`, base: 'do-business-better-book-cover' },
  { src: `${SRC_MEDIA}/FOOD-FEAR-AUDIOBOOK-STORE.png`, base: 'food-fear-audiobook-cover' },
  { src: `${SRC_MEDIA}/FoodFear-Mockup-Online-Store.png`, base: 'food-fear-book-cover' },
  { src: `${SRC_MEDIA}/Forbes.png`, base: 'forbes-feature' },
  { src: `${SRC_MEDIA}/TODD-THURMAN-CROPPED.png`, base: 'todd-thurman' },
  { src: `${SRC_MEDIA}/WEB-COLLAGE-2.png`, base: 'speaking-collage' },
  { src: `${SRC_MEDIA}/acres-tv-screenshot.png`, base: 'acres-tv-episode-grid' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-13-at-12.43.38-PM.png`, base: 'acres-tv-arlan-suderman' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-18-at-5.52.49-PM.png`, base: 'field-day-panel' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-18-at-5.55.45-PM.png`, base: 'xtremeag-cutting-the-curve-1' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-19-at-11.40.07-AM.png`, base: 'xtremeag-video-interview' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-19-at-11.46.37-AM.png`, base: 'xtremeag-cutting-the-curve-2' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-19-at-12.16.28-PM.png`, base: 'cheddar-news-food-supply' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-20-at-3.38.16-PM.png`, base: 'agrigold-panel' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-20-at-3.38.42-PM-1.png`, base: 'xtremeag-cornfield-team' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-10.51.10-AM.png`, base: 'news-interview-cal-maine' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-10.52.49-AM.png`, base: 'food-inflation-episode' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-10.56.20-AM.png`, base: 'cheddar-news-fertilizer-shortage' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-2.44.31-PM.png`, base: 'green-screen-studio' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-9.17.26-AM.png`, base: 'equipment-factory-tour' },
  { src: `${SRC_MEDIA}/Screenshot-2024-08-21-at-11.48.25 AM.png`, base: 'san-interview-1' },
  { src: `${SRC_MEDIA}/Screenshot-2024-08-21-at-11.49.00 AM.png`, base: 'san-interview-2' },
];

/**
 * Everything deliberately left out of public/, with the reason recorded so the
 * decision is auditable rather than silent.
 */
const SKIPPED = [
  {
    src: `${SRC_BRAND}/LOGO-REVISION-B-A-F-01 copy.png`,
    reason: 'Client explicitly asked for this mark to be omitted from the site. Not read, not copied, not referenced.',
  },

  // Divi / theme icon set. Generic orange line icons, not brand assets.
  { src: `${SRC_MEDIA}/add-ons.png`, reason: 'Divi theme icon (generic line art), UI furniture.' },
  { src: `${SRC_MEDIA}/content-contributor.png`, reason: 'Divi theme icon (generic line art), UI furniture.' },
  { src: `${SRC_MEDIA}/custom_message.png`, reason: 'Divi theme icon (generic line art), UI furniture.' },
  { src: `${SRC_MEDIA}/influencer.png`, reason: 'Divi theme icon (generic line art), UI furniture.' },
  { src: `${SRC_MEDIA}/podcast.png`, reason: 'Divi theme icon (generic line art), UI furniture.' },
  { src: `${SRC_MEDIA}/process.png`, reason: 'Divi theme icon (generic line art), UI furniture.' },
  { src: `${SRC_MEDIA}/success.png`, reason: 'Divi theme icon (generic line art), UI furniture.' },

  // Divi decorative shapes: section dividers, pull quote glyphs, background rings.
  { src: `${SRC_MEDIA}/company-67-a-pr-14.png`, reason: 'Decorative pull quote glyph from the page builder.' },
  { src: `${SRC_MEDIA}/company-67-a-pr-16.png`, reason: 'Decorative chevron section divider from the page builder.' },
  { src: `${SRC_MEDIA}/company-67-a-pr-18.png`, reason: 'Decorative chevron section divider from the page builder.' },
  { src: `${SRC_MEDIA}/company-67-a-pr-22.png`, reason: 'Decorative background ring from the page builder.' },
  { src: `${SRC_MEDIA}/company-67-a-pr-23.png`, reason: 'Decorative pull quote glyph, 69x49, from the page builder.' },
  { src: `${SRC_MEDIA}/orange-background-2.png`, reason: 'Decorative section background shape from the page builder.' },

  // Redundant copies.
  {
    src: `${SRC_MEDIA}/458B0C93-D40F-4CF5-B0CC-BC1C89816092-scaled.jpeg`,
    reason: 'WordPress auto-generated 2560px copy of 458B0C93-D40F-4CF5-B0CC-BC1C89816092.jpeg. The 4032px original is used instead.',
  },
  {
    src: `${SRC_MEDIA}/DSC_7639-scaled.jpg`,
    reason: 'WordPress auto-generated 2560px copy of DSC_7639.jpg. The 2400x3600 original is used instead.',
  },
  {
    src: `${SRC_MEDIA}/BOASG-BRAND-LOGO-FINAL-WHITE.jpg`,
    reason: 'Lower resolution (1000px) duplicate of the supplied Damian Mason Logos/BOASG-BRAND-LOGO-FINAL-WHITE.jpg (1500px), which is used instead.',
  },

  // Not images.
  { src: `${SRC_MEDIA}/dm_-_food_waste-1080p.mp4`, reason: 'Video, not an image. Out of scope for this pass.' },
  { src: `${SRC_MEDIA}/dm_-_innovation-1080p.mp4`, reason: 'Video, not an image. Out of scope for this pass.' },
  { src: `${SRC_MEDIA}/dm_-_labor-1080p.mp4`, reason: 'Video, not an image. Out of scope for this pass.' },
  { src: `${SRC_MEDIA}/VisionTechMgmt.mp3`, reason: 'Audio, not an image. Out of scope for this pass.' },
];

// ---------------------------------------------------------------------------
// Processing
// ---------------------------------------------------------------------------

/**
 * Resolve a manifest path to a real file on disk.
 *
 * Two of the mirrored screenshots contain a narrow no-break space (U+202F)
 * where a plain space looks like it should be, and macOS stores filenames
 * decomposed (NFD) while the manifest above is composed (NFC). Rather than
 * paste invisible characters into the manifest, fall back to a directory scan
 * that compares names with all Unicode whitespace folded to a plain space and
 * both sides normalized. Returns null when nothing matches.
 */
const dirCache = new Map();
function resolveSrc(rel) {
  const abs = path.join(ROOT, rel);
  if (fs.existsSync(abs)) return abs;

  const dir = path.dirname(abs);
  if (!fs.existsSync(dir)) return null;
  if (!dirCache.has(dir)) dirCache.set(dir, fs.readdirSync(dir));

  const fold = (s) => s.normalize('NFC').replace(/\s+/gu, ' ');
  const want = fold(path.basename(rel));
  const hit = dirCache.get(dir).find((f) => fold(f) === want);
  return hit ? path.join(dir, hit) : null;
}

/** Normalize a source extension to the raster extension we will emit. */
function rasterExt(src) {
  const e = path.extname(src).toLowerCase();
  if (e === '.jpeg' || e === '.jpg') return '.jpg';
  if (e === '.png') return '.png';
  if (e === '.webp') return '.webp';
  throw new Error(`Unhandled source extension for ${src}`);
}

/** Encode `pipeline` to `ext`, tuned for the asset kind. */
function encode(pipeline, ext, kind) {
  if (ext === '.png') {
    return pipeline.png({ compressionLevel: 9, effort: 10 });
  }
  if (ext === '.webp') {
    return pipeline.webp({ quality: 90, effort: 6 });
  }
  // JPEG. Logos keep full chroma so edges and flat brand color stay crisp.
  return pipeline.jpeg({
    quality: kind === 'logo' ? 92 : 86,
    mozjpeg: true,
    chromaSubsampling: kind === 'logo' ? '4:4:4' : '4:2:0',
  });
}

/**
 * Build the resize+orient pipeline for one source.
 * rotate() bakes EXIF orientation into pixels; sharp then drops all metadata
 * on write, which is the "strip EXIF" requirement.
 */
function base(src, cap) {
  return sharp(src)
    .rotate()
    .resize({ width: cap, height: cap, fit: 'inside', withoutEnlargement: true });
}

/**
 * Process one manifest entry. Returns { out: string[], w, h }.
 */
async function process(entry) {
  const name = path.basename(entry.src);
  if (FORBIDDEN.has(name)) {
    throw new Error(`Refusing to process forbidden asset: ${entry.src}`);
  }
  const absSrc = resolveSrc(entry.src);
  if (!absSrc) throw new Error(`Source not found: ${entry.src}`);

  const isLogo = entry.kind === 'logo';
  const cap = isLogo ? LOGO_MAX : PHOTO_MAX;
  const outDir = path.join(PUBLIC_IMG, entry.dir);
  await fsp.mkdir(outDir, { recursive: true });

  const ext = entry.ext ?? rasterExt(entry.src);
  const rasterPath = path.join(outDir, entry.base + ext);
  const info = await encode(base(absSrc, cap), ext, entry.kind).toFile(rasterPath);

  const out = [`/img/${entry.dir}/${entry.base}${ext}`];

  if (isLogo) {
    // Same pixel dimensions as the raster. Try lossless and quality 90, keep
    // whichever is smaller. Flat-color marks usually win with lossless.
    if (ext === '.webp') {
      // Source was already webp, so the raster IS the webp sibling. Emit a PNG
      // fallback so every sponsor has a non-webp raster available.
      const pngPath = path.join(outDir, entry.base + '.png');
      await base(absSrc, cap).png({ compressionLevel: 9, effort: 10 }).toFile(pngPath);
      out.push(`/img/${entry.dir}/${entry.base}.png`);
    } else {
      const webpPath = path.join(outDir, entry.base + '.webp');
      const [lossless, lossy] = await Promise.all([
        base(absSrc, cap).webp({ lossless: true, effort: 6 }).toBuffer(),
        base(absSrc, cap).webp({ quality: 90, effort: 6 }).toBuffer(),
      ]);
      await fsp.writeFile(webpPath, lossless.length < lossy.length ? lossless : lossy);
      out.push(`/img/${entry.dir}/${entry.base}.webp`);
    }
  }

  return { out, w: info.width, h: info.height };
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function header(lines) {
  return ['/**', ...lines.map((l) => (l ? ` * ${l}` : ' *')), ' */', ''].join('\n');
}

async function main() {
  const entries = [
    ...CLIENTS.map((c) => ({ src: `${SRC_CLIENTS}/${c.src}`, dir: 'clients', base: c.base, kind: 'logo', name: c.name })),
    ...SPONSORS.map((s) => ({ src: `${SRC_SPONSORS}/${s.src}`, dir: 'sponsors', base: s.base, kind: 'logo', name: s.name, url: s.url })),
    ...BRAND.map((b) => ({ ...b, dir: 'brand', kind: 'logo' })),
    ...THIRD_PARTY_LOGOS.map((l) => ({ ...l, dir: 'logos', kind: 'logo' })),
    ...PHOTOS.map((p) => ({ ...p, dir: 'photos', kind: 'photo' })),
  ];

  // Fail loudly on a missing or misnamed source rather than silently emitting
  // a short manifest.
  const missing = entries.filter((e) => resolveSrc(e.src) === null);
  if (missing.length) {
    for (const m of missing) console.error(`MISSING SOURCE: ${m.src}`);
    throw new Error(`${missing.length} source file(s) not found`);
  }

  const map = {};
  const dims = new Map();

  for (const entry of entries) {
    const res = await process(entry);
    map[entry.src] = res;
    dims.set(entry.src, res);
    console.log(`${entry.src}  ->  ${res.out.join(', ')}  (${res.w}x${res.h})`);
  }

  map.skipped = SKIPPED;

  // Completeness audit. Every file in every source folder must be either
  // processed or explicitly skipped, so a new drop of client assets shows up
  // as a loud failure instead of quietly going missing.
  const fold = (s) => s.normalize('NFC').replace(/\s+/gu, ' ');
  const accounted = new Set([...entries.map((e) => e.src), ...SKIPPED.map((s) => s.src)].map(fold));
  const unaccounted = [];
  for (const dir of [SRC_CLIENTS, SRC_SPONSORS, SRC_BRAND, SRC_MEDIA]) {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      if (f.startsWith('.')) continue;
      if (!accounted.has(fold(`${dir}/${f}`))) unaccounted.push(`${dir}/${f}`);
    }
  }
  if (unaccounted.length) {
    for (const u of unaccounted) console.error(`UNACCOUNTED SOURCE: ${u}`);
    throw new Error(`${unaccounted.length} source file(s) neither processed nor skipped`);
  }

  // The omitted mark must not have leaked into any output path.
  const leaked = Object.entries(map)
    .filter(([k]) => k !== 'skipped')
    .flatMap(([, v]) => v.out)
    .filter((p) => /b-a-f/i.test(p));
  if (leaked.length) throw new Error(`Omitted mark leaked into public/: ${leaked.join(', ')}`);

  // -- _source/asset-map.json ----------------------------------------------
  await fsp.writeFile(path.join(ROOT, '_source', 'asset-map.json'), JSON.stringify(map, null, 2) + '\n');

  // -- content/clients.ts ---------------------------------------------------
  const clientRows = CLIENTS.map((c) => {
    const d = dims.get(`${SRC_CLIENTS}/${c.src}`);
    return { ...c, logo: d.out[0], w: d.w, h: d.h };
  }).sort((a, b) => a.name.localeCompare(b.name, 'en'));

  const clientsTs =
    header([
      'Client logos for the credibility strip.',
      '',
      'Generated by scripts/normalize-assets.mjs from the supplied "Client Logos"',
      'folder. Do not hand edit the width and height values, they are the real',
      'output dimensions of the files in public/img/clients and they exist so',
      'next/image can reserve space without a layout shift.',
      '',
      'Every entry also has a .webp sibling at identical dimensions, so',
      "swapping '.png' for '.webp' on any logo path resolves to a real file.",
      '',
      'Display names were checked one by one against both the source filename',
      'and the artwork itself.',
      '',
      'OPEN ITEM: the Egg Farmers artwork actually reads "get cracking. Egg',
      'Farmers of Ontario", so the full legal name is Egg Farmers of Ontario,',
      'not Alberta and not Canada. The short form "Egg Farmers" is used here',
      'because that is what was specified, but confirm with the client whether',
      'the strip should say Egg Farmers of Ontario instead.',
    ]) +
    '\nexport type Client = {\n' +
    '  name: string;\n' +
    '  logo: string;\n' +
    '  width: number;\n' +
    '  height: number;\n' +
    '};\n\n' +
    'export const clients: Client[] = [\n' +
    clientRows
      .map((c) => `  { name: ${q(c.name)}, logo: ${q(c.logo)}, width: ${c.w}, height: ${c.h} },`)
      .join('\n') +
    '\n];\n';
  await fsp.writeFile(path.join(CONTENT, 'clients.ts'), clientsTs);

  // -- content/sponsors.ts --------------------------------------------------
  const sponsorRows = SPONSORS.map((s) => {
    const d = dims.get(`${SRC_SPONSORS}/${s.src}`);
    return { ...s, logo: d.out[0], w: d.w, h: d.h };
  }).sort((a, b) => a.name.localeCompare(b.name, 'en'));

  const sponsorsTs =
    header([
      'Podcast sponsors for The Business of Agriculture.',
      '',
      'Generated by scripts/normalize-assets.mjs from the supplied',
      '"Website - List of Podcast Sponsors - Logos" folder. Width and height are',
      'the real output dimensions of the files in public/img/sponsors.',
      '',
      'Four URLs were supplied by the client: Heads Up Plant Protectants, Tidal',
      'Grow, Nano-Yield, and Good Agriculture. The other six were each looked up',
      'and matched to a live official site rather than inferred from the brand',
      'name, so none of them is a guess:',
      '  AgView Solutions, farm transition planning, Rowley Iowa.',
      '  EarthOptics, soil data mapping, Minneapolis.',
      '  Harvest Returns, agriculture investment platform, Fort Worth.',
      '  Life Scientific, crop protection, Dublin.',
      '  NewFields Ag, liquid biologicals and seed treatments, Grand Mound Iowa.',
      '  Redox Bio, plant bio-nutrition, Burley Idaho, trading as redoxgrows.com.',
      '',
      'Nano-Yield is the one logo whose source was already .webp, so its raster',
      'is .webp and a .png fallback sits beside it.',
    ]) +
    '\nexport type Sponsor = {\n' +
    '  name: string;\n' +
    '  logo: string;\n' +
    '  url: string;\n' +
    '  width: number;\n' +
    '  height: number;\n' +
    '};\n\n' +
    'export const sponsors: Sponsor[] = [\n' +
    sponsorRows
      .map((s) => `  { name: ${q(s.name)}, logo: ${q(s.logo)}, url: ${q(s.url)}, width: ${s.w}, height: ${s.h} },`)
      .join('\n') +
    '\n];\n';
  await fsp.writeFile(path.join(CONTENT, 'sponsors.ts'), sponsorsTs);

  // -- content/brand-assets.ts ---------------------------------------------
  const b = (base) => {
    const hit = BRAND.find((x) => x.base === base);
    return dims.get(hit.src).out[0];
  };

  const brandTs =
    header([
      "Damian's own marks. Paths only, so a component can reference a logo",
      'without knowing which folder or file extension it landed in.',
      '',
      'Generated by scripts/normalize-assets.mjs. Every entry has a .webp',
      'sibling at identical pixel dimensions in public/img/brand.',
      '',
      'One supplied mark is deliberately absent from this file and from public/',
      'entirely. The client asked for it to be dropped, so it is neither',
      'processed nor referenced anywhere. See the skipped list in',
      '_source/asset-map.json.',
    ]) +
    '\nexport const brandAssets = {\n' +
    `  wordmark: ${q(b('wordmark'))}, // site header and footer, all pages\n` +
    `  wordmarkWhite: ${q(b('wordmark-white'))}, // header over dark hero imagery, footer on the dark band\n` +
    `  boasg: ${q(b('boasg'))}, // /boasg/ hero and the join CTA, plus social share cards\n` +
    `  boasgWhite: ${q(b('boasg-white'))}, // /boasg/ badge placed over photography or a dark section\n` +
    `  businessOfAgriculture: ${q(b('business-of-agriculture'))}, // /podcast/ masthead and the home page podcast block\n` +
    `  businessOfAgriculturePodcast: ${q(b('business-of-agriculture-podcast'))}, // /podcast/ episode artwork and the feed cover\n` +
    `  granary: ${q(b('the-granary'))}, // /the-granary/ hero\n` +
    `  xtremeAg: ${q(b('xtreme-ag'))}, // /the-granary/ and /podcast/, the XtremeAg partnership credit\n` +
    '} as const;\n\n' +
    header([
      'Secondary marks that ship alongside the primary set. They are kept out of',
      'brandAssets so that object stays a short, stable contract, but the files',
      'are real and available if a page needs them.',
    ]) +
    '\nexport const brandAssetsExtra = {\n' +
    `  boasgWhiteFlat: ${q(b('boasg-white-flat'))}, // /boasg/, opaque white background variant for print or email\n` +
    `  doBusinessBetterPodcast: ${q(b('do-business-better-podcast'))}, // /about/#books and any Do Business Better cross promo\n` +
    `  businessOfAgricultureLockup: ${q(b('business-of-agriculture-lockup'))}, // /podcast/ alternate lockup on a dark panel\n` +
    `  businessOfAgricultureIconWhite: ${q(b('business-of-agriculture-icon-white'))}, // /podcast/ leaf icon over dark sections, favicon-scale use\n` +
    `  businessOfAgricultureAvatar: ${q(b('business-of-agriculture-avatar'))}, // /podcast/ square avatar for feed and player embeds\n` +
    `  xtremeAgTransparent: ${q(b('xtreme-ag-transparent'))}, // /the-granary/, transparent version for placing on color\n` +
    `  dmMonogram: ${q(b('dm-monogram'))}, // favicon and app icon source, site wide\n` +
    '} as const;\n\n' +
    'export type BrandAssetKey = keyof typeof brandAssets;\n';
  await fsp.writeFile(path.join(CONTENT, 'brand-assets.ts'), brandTs);

  console.log(`\nProcessed ${entries.length} assets. Skipped ${SKIPPED.length}.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

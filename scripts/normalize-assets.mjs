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
 *   _source/media-kit/                            -> public/img/photos/
 *
 * Rules enforced here
 *   - Output names are kebab-case, lowercase, no spaces, no parentheses, and
 *     are derived from the BRAND name rather than the incoming filename.
 *   - Logos are capped at LOGO_MAX px on the longest side. Photos are capped at
 *     PHOTO_MAX px on the longest side. Nothing is upscaled in this script; the
 *     one place anything is, and only up to 2x, is the ink pass noted below.
 *   - Every logo also gets a .webp sibling at identical pixel dimensions. Both
 *     lossless and quality 90 are encoded and the smaller file wins, which is
 *     what "lossless for flat color if that is smaller" resolves to.
 *   - EXIF is stripped. Orientation is baked in first via rotate() so that
 *     camera originals do not end up sideways once the tag is gone.
 *   - LOGO-REVISION-B-A-F-01 copy.png is never read and never written. The
 *     client asked for that mark to be omitted from the site.
 *   - The 31 logo-wall marks then go through scripts/normalize-logo-ink.mjs,
 *     which trims each one to its real ink and re-pads it so the wall scales on
 *     the artwork rather than on the margin the supplier baked around it. That
 *     pass runs from here, at the end of main(), because this script rewrites
 *     the same files from source and would otherwise put the margins back.
 *
 * Side effects: writes public/img/**, content/clients.ts, content/sponsors.ts,
 * content/brand-assets.ts, and _source/asset-map.json.
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { normalizeLogoInk } from './normalize-logo-ink.mjs';

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
 * Photography recovered from the client's own WordPress media library on
 * 2026-08-07, before the old hosting was switched off. Inventoried file by
 * file, with source URLs and SHA-256s, in _source/media-kit/PROVENANCE.md.
 *
 * IT IS A SECOND SOURCE FOLDER RATHER THAN MORE FILES IN _source/media, AND
 * THAT IS NOT TIDINESS. _source/media is a dated crawl artifact: manifest.json
 * records `crawledAt` and asserts `gate.actual.mediaAssets: 70`, and three
 * documents reason from that number. Adding 2026 rescues to it would
 * retroactively falsify a record the whole audit trail rests on.
 *
 * FLAT, NO SUBDIRECTORIES. The completeness audit at the foot of this file
 * uses a non-recursive readdirSync, so a subfolder would appear as one
 * unaccounted entry and everything inside it would escape the gate entirely.
 */
const SRC_MEDIA_KIT = '_source/media-kit';

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

/**
 * The client wall.
 *
 * `from` overrides the source folder for the four marks that were on the old
 * site's wall but are NOT in the "Client Logos" folder the client supplied.
 * They live in the crawl of the old site instead. Copying their bytes into the
 * supplied folder would falsify what the client actually sent, which is a
 * record docs/OPEN-ITEMS.md item 2 reasons from, so the manifest points at
 * where each file really is.
 *
 * @type {{name: string, src: string, base: string, from?: string}[]}
 */
const CLIENTS = [
  { name: 'AgFirst Farm Credit', src: 'AgFirst FC Logo.png', base: 'agfirst-farm-credit' },
  { name: 'Agromark', src: 'Agromark.jpeg', base: 'agromark' },
  { name: 'Almond Alliance', src: 'Almond Alliance logo.png', base: 'almond-alliance' },
  { name: 'California Farm Bureau', src: 'CA Farm Bureau.png', base: 'california-farm-bureau' },
  { name: 'BASF', src: 'BASF-Logo_bw.svg_.png', base: 'basf', from: SRC_MEDIA },
  { name: 'Cargill', src: 'Cargill logo.png', base: 'cargill' },
  { name: 'CLAAS', src: 'Claas logo.png', base: 'claas' },
  { name: 'Compeer Financial', src: 'Compeer.jpeg', base: 'compeer-financial' },
  { name: 'Egg Farmers', src: 'Egg Farmers Logo.jpg', base: 'egg-farmers' },
  { name: 'Farm Credit Services of America', src: 'FCS of America Logo.png', base: 'farm-credit-services-of-america' },
  { name: 'Helena Agri-Enterprises', src: 'lo-helenalogo.png', base: 'helena', from: SRC_MEDIA },
  { name: 'Hudson Insurance', src: 'Hudson Insurance.png', base: 'hudson-insurance' },
  { name: 'Indiana Farm Bureau', src: 'Indiana Farm Bureau.jpeg', base: 'indiana-farm-bureau' },
  { name: 'Iowa Farm Bureau', src: 'Iowa Farm Bureau.jpeg', base: 'iowa-farm-bureau' },
  /* OPEN QUESTION, and it is on the wall where a screen reader will read it.
     The file is 19225_IPPA_Alliance_Logo_4C-scaled-1.jpg and the artwork reads
     "Iowa Pork Producers Association" over "Iowa Pork Alliance". OPEN-ITEMS
     item 2 calls it "Iowa Pork Alliance (IPPA)". The artwork's own primary line
     is used here; confirm with the client, in the same breath as the Egg
     Farmers of Ontario question. */
  { name: 'Iowa Pork Producers Association', src: '19225_IPPA_Alliance_Logo_4C-scaled-1.jpg', base: 'iowa-pork-alliance', from: SRC_MEDIA },
  { name: 'John Deere', src: 'John_Deere_logo.svg_.png', base: 'john-deere', from: SRC_MEDIA },
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
  // The apex harvestreturns.com has no A record, so the bare domain resolves
  // to nothing and the tile would land on a browser error page. Only the www
  // host is published. Verified with dig against both 8.8.8.8 and 1.1.1.1.
  { name: 'Harvest Returns', src: 'Harvest Returns.jpeg', base: 'harvest-returns', url: 'https://www.harvestreturns.com' },
  { name: 'Heads Up Plant Protectants', src: 'Heads Up logo.jpg', base: 'heads-up-plant-protectants', url: 'https://headsupst.com' },
  { name: 'Life Scientific', src: 'Life Scientific.jpeg', base: 'life-scientific', url: 'https://lifescientific.com' },
  /* The one supplied mark that arrived as .webp, and the `ext` override is
     what makes it behave like the other thirty.

     Without it the emitted raster is .webp, so content/sponsors.ts names the
     .webp as `logo`, LogoWall puts that in the <img src>, and webpSibling()
     returns null for a .webp source. The .png beside it was therefore
     unreachable by construction: no <source> pointed at it and no <img> could
     fall back to it. It was 30KB of dead weight that looked like a fallback.

     Forcing the raster to .png sends this mark down the ordinary branch below,
     which emits a real .webp sibling, and the pair then behaves exactly like
     every other tile. */
  { name: 'Nano-Yield', src: 'Nano-Yield- logo.webp', base: 'nano-yield', url: 'https://nano-yield.com', ext: '.png' },
  { name: 'NewFields Ag', src: 'NewFields Ag.jpg', base: 'newfields-ag', url: 'https://newfieldsag.com' },
  { name: 'Redox Bio', src: 'Redox Bio logo.png', base: 'redox-bio', url: 'https://redoxgrows.com' },
  { name: 'Tidal Grow', src: 'Tidal Grow.jpeg', base: 'tidal-grow', url: 'https://tidalgrowag.com' },
];

/** Damian's own marks, from both the supplied folder and the mirror. */
const BRAND = [
  { src: `${SRC_BRAND}/BOASG-BRAND-LOGO-FINAL-LINKSHARE.jpg`, base: 'boasg' },
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
  { src: `${SRC_MEDIA}/FCSAmerica-logo-400x192-1.jpg`, base: 'farm-credit-services-of-america' },
  { src: `${SRC_MEDIA}/merck-logo.png`, base: 'merck' },
  { src: `${SRC_MEDIA}/acres-tv.png`, base: 'acres-tv' },
];

/** Photographs, portraits, book covers, collages, and press or episode stills. */
const PHOTOS = [
  { src: `${SRC_MEDIA}/2-background-microphones-on-a-stand-2022-11-16-19-05-19-utc-scaled.jpg`, base: 'microphones-background' },
  { src: `${SRC_MEDIA}/331668334_973198694086419_2283442893014987447_n.jpeg`, base: 'book-signing-table' },
  { src: `${SRC_MEDIA}/458B0C93-D40F-4CF5-B0CC-BC1C89816092.jpeg`, base: 'breakout-session-audience' },
  { src: `${SRC_MEDIA}/DM-audience-230102.jpg`, base: 'speaking-to-audience' },
  { src: `${SRC_MEDIA}/DM-image0-1.jpeg`, base: 'keynote-stage-podium' },
  { src: `${SRC_MEDIA}/DSC_7312-scaled.jpg`, base: 'portrait-office-seated' },
  { src: `${SRC_MEDIA}/DSC_7419-scaled.jpg`, base: 'portrait-light-jacket' },
  { src: `${SRC_MEDIA}/DSC_7639.jpg`, base: 'portrait-black-suit' },
  { src: `${SRC_MEDIA}/Damian-Collab-crop-scaled.jpg`, base: 'portrait-dark-blazer' },
  { src: `${SRC_MEDIA}/dbb-online-store.png`, base: 'do-business-better-book-cover' },
  { src: `${SRC_MEDIA}/FOOD-FEAR-AUDIOBOOK-STORE.png`, base: 'food-fear-audiobook-cover' },
  { src: `${SRC_MEDIA}/FoodFear-Mockup-Online-Store.png`, base: 'food-fear-book-cover' },
  { src: `${SRC_MEDIA}/Forbes.png`, base: 'forbes-feature' },
  { src: `${SRC_MEDIA}/TODD-THURMAN-CROPPED.png`, base: 'todd-thurman' },
  /* One source, three outputs. The composite itself is NOT emitted: see
     SKIPPED. Two panels are harvested out of it by CROPS, and the entry shape
     already supports a repeated src, so this is a manifest change rather than a
     pipeline change. */
  { src: `${SRC_MEDIA}/WEB-COLLAGE-2.png`, base: 'speaking-closeup' },
  { src: `${SRC_MEDIA}/WEB-COLLAGE-2.png`, base: 'tradeshow-floor-audience' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-13-at-12.43.38-PM.png`, base: 'acres-tv-arlan-suderman' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-18-at-5.52.49-PM.png`, base: 'field-day-panel' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-18-at-5.55.45-PM.png`, base: 'xtremeag-cutting-the-curve-1' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-19-at-11.40.07-AM.png`, base: 'xtremeag-video-interview' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-19-at-12.16.28-PM.png`, base: 'cheddar-news-food-supply' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-20-at-3.38.16-PM.png`, base: 'agrigold-panel' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-20-at-3.38.42-PM-1.png`, base: 'xtremeag-cornfield-team' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-10.51.10-AM.png`, base: 'news-interview-cal-maine' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-10.52.49-AM.png`, base: 'food-inflation-episode' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-10.56.20-AM.png`, base: 'cheddar-news-fertilizer-shortage' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-2.44.31-PM.png`, base: 'green-screen-studio' },
  { src: `${SRC_MEDIA}/Screenshot-2023-04-25-at-9.17.26-AM.png`, base: 'equipment-factory-tour' },
  { src: `${SRC_MEDIA}/Screenshot-2024-08-21-at-11.49.00 AM.png`, base: 'san-interview-2' },

  /* ---------------------------------------------------------------------
     THE RECOVERED MEDIA KIT.

     Sixteen photographs that were sitting in the client's WordPress media
     library, referenced by no page and therefore invisible to a crawl that
     walked pages. docs/OPEN-ITEMS.md items 3, 4 and 12 all rest on the
     assumption that this material did not exist.

     Five of the six studio portraits are frames the site has never had. Five
     more are professional live-stage photographs, which is the one thing the
     old archive had none of: OPEN-ITEMS item 4 asks the client to commission
     exactly these, "live-event photography from the back of the room, showing
     you on stage with the audience in frame", and audience-from-the-back is
     that photograph.

     DSC_7639 is NOT in this list, and its absence is a finding rather than an
     oversight. It is byte-identical to _source/media/DSC_7639.jpg, which
     already ships as portrait-black-suit, and PHOTO_MAX is 2000, so the
     2400x3600 "original" emits the same 1333x2000 the site already has. There
     was no resolution to recover. See PROVENANCE.md.
     --------------------------------------------------------------------- */
  { src: `${SRC_MEDIA_KIT}/studio-portrait-window.jpg`, base: 'portrait-window-light' },
  { src: `${SRC_MEDIA_KIT}/studio-portrait-dark-jacket.jpg`, base: 'portrait-charcoal-jacket' },
  { src: `${SRC_MEDIA_KIT}/studio-portrait-check-jacket.jpg`, base: 'portrait-check-jacket' },
  { src: `${SRC_MEDIA_KIT}/studio-portrait-headshot.jpg`, base: 'portrait-headshot' },
  { src: `${SRC_MEDIA_KIT}/studio-portrait-boardroom.jpg`, base: 'portrait-boardroom' },
  { src: `${SRC_MEDIA_KIT}/stage-milk-cartons.jpg`, base: 'stage-dairy-case' },
  { src: `${SRC_MEDIA_KIT}/stage-close-gesture.jpg`, base: 'stage-mid-sentence' },
  { src: `${SRC_MEDIA_KIT}/stage-labor-slide.jpg`, base: 'stage-labor-slide' },
  { src: `${SRC_MEDIA_KIT}/stage-crop-protection-slide.jpg`, base: 'stage-crop-protection-slide' },
  { src: `${SRC_MEDIA_KIT}/stage-audience-from-back.jpg`, base: 'audience-from-the-back' },
  { src: `${SRC_MEDIA_KIT}/stage-mueller-walking.jpg`, base: 'stage-walking-the-front' },
  { src: `${SRC_MEDIA_KIT}/stage-mueller-white-wall.jpg`, base: 'stage-white-wall' },
  { src: `${SRC_MEDIA_KIT}/stage-blue-jacket.jpg`, base: 'stage-blue-jacket' },
  { src: `${SRC_MEDIA_KIT}/studio-podcast-desk.jpg`, base: 'podcast-desk' },
  { src: `${SRC_MEDIA_KIT}/studio-green-screen.jpg`, base: 'green-screen-setup' },
  { src: `${SRC_MEDIA_KIT}/food-fear-hardback-table.jpg`, base: 'food-fear-hardback' },

  /* The cut-out, and it is the only entry in this file that needs either of
     the two per-entry options below.

     `max` because it never renders wider than about 491 CSS px, so a 1400px
     raster is already 2.8x, and a 2000px one is dead weight in a format that
     cannot drop its alpha channel.

     `deghost` because 49.0% of this file is fully transparent and every one of
     those 1,654,970 pixels carries RGB (71, 112, 76), a mid green, uniformly.
     Nothing composites it, so it is invisible in the file and in any lossless
     copy. It is not invisible downstream: these are served through the Next
     image optimizer, which emits AVIF with a LOSSY alpha channel, and a lossy
     alpha channel does not reproduce zero exactly. This is the same defect
     scripts/normalize-brand-art.mjs measures for the brand marks, where the
     optimizer rebuilt a deleted ghost at alpha 6 to 7 carrying grey 146. Here
     it would rebuild a green rectangle over half the frame, in production and
     nowhere else. Measured with a raw-buffer walk, not assumed. */
  {
    src: `${SRC_MEDIA_KIT}/portrait-cutout.png`,
    base: 'portrait-cutout',
    max: 1400,
    deghost: true,
  },
  /* The same cut-out at card scale, and it is a second output rather than a
     resize at render time because app/opengraph-image.tsx cannot resize
     anything: Satori has no image pipeline, it decodes what it is handed.

     Handed the 1400px master it fails outright, with "Input buffer contains
     unsupported image format", which is what a decoder says when it gives up
     rather than when the file is wrong: the PNG is a perfectly ordinary 8-bit
     RGBA non-interlaced image and the wordmark beside it loads fine. The card
     renders it 380px tall, so the master was 3.7x oversized before it was
     base64'd into every social-card render.

     520 is 380 times the 1.37 device-pixel headroom a 1200x630 card gets when
     a platform re-encodes it, rounded to a round number. */
  {
    src: `${SRC_MEDIA_KIT}/portrait-cutout.png`,
    base: 'portrait-cutout-card',
    max: 520,
    deghost: true,
  },
];

/**
 * Four supplied marks arrive with a ground the logo wall cannot composite
 * away. The wall sets `mix-blend-mode: multiply` over a bone cell, which
 * erases white and leaves anything darker standing as a visible box around
 * the mark, so the ground has to come off the pixels here rather than be
 * special-cased in CSS for four files.
 *
 * Keyed by output basename. Both steps are optional and `crop` runs first,
 * because a drawn-in frame would otherwise wall the flood off from the edge.
 *
 *   crop  - pixels shaved off each edge, for a frame baked into the artwork.
 *   flood - walks the ground in from the four edges and repaints it white.
 *           `step` is the largest luminance change one pixel of ground may
 *           make, which lets the walk follow a gradient without climbing an
 *           anti-aliased edge into the mark. `chromaMax` keeps it out of any
 *           colored ink. Both have defaults; only override with a measured
 *           reason.
 */
const GROUND_FIXES = {
  // A 1px grey rule down column 0 and column 256. Rows 0 and 147 are clean,
  // so the frame is two vertical lines, not a box.
  'land-olakes-purina': { crop: { left: 1, right: 1 } },
  // Ground is 244,243,241, near white but not white, against a 253,251,247 cell.
  'iowa-farm-bureau': { flood: {} },
  // Ground is a grey radial gradient running 157 at the corners to 177 at the
  // mid edges. A single tolerance cannot span it, a per-step one can.
  'heads-up-plant-protectants': { flood: {} },
  // The shield is cut out of a solid black square, so the ground is 0,0,0.
  'newfields-ag': { flood: {} },
};

/**
 * PHOTO CROPS, keyed by OUTPUT basename.
 *
 * WHY THIS LIVES HERE AND NOT IN ITS OWN SCRIPT. This file rewrites every
 * output in public/img/photos/ on each run. A separate crop pass would be
 * silently reverted the next time anyone touched an asset, with no error, and
 * the frame with the play button in it would quietly come back.
 *
 * RECTANGLES ARE FRACTIONS OF THE FRAME, not pixels, so an entry survives a
 * change to PHOTO_MAX or a re-export at a different size. `expect` is the
 * emitted pixel size, asserted after the run: a rectangle that drifts fails
 * loudly instead of shipping.
 *
 * The crop runs BEFORE the resize, and after the rotate, so EXIF orientation
 * is baked before the rectangle means anything and no resolution is thrown
 * away twice.
 */
const CROPS = {
  // The four-panel collage. It shipped for seven phases and rendered on zero
  // routes, because CONTENT_MANIFEST recorded it as "4 wide room shots" and
  // nobody opened it. Two of the four panels are the best unused frames in the
  // repo and exist nowhere else in the archive.
  //
  // Panel bounds measured off the 1152x1500 source. The panels OVERLAP, so
  // each rectangle is the largest clean area of its own panel rather than the
  // panel's full extent: panel 4 intrudes on panel 2 from x>=750, y>=790, and
  // both rectangles below stay clear of it.
  'speaking-closeup': {
    from: 'speaking-collage',
    rect: { left: 246 / 1152, top: 470 / 1500, width: 502 / 1152, height: 452 / 1500 },
    expect: [502, 452],
    why: 'Panel 2. A tight three-quarter close-up, mid-gesture, clicker in hand. Tighter than any standalone photograph on this site.',
  },
  'tradeshow-floor-audience': {
    from: 'speaking-collage',
    rect: { left: 56 / 1152, top: 933 / 1500, width: 640 / 1152, height: 498 / 1500 },
    expect: [640, 498],
    why: 'Panel 3. A trade-show floor session seen from BEHIND a seated audience. docs/OPEN-ITEMS.md item 4 asks the client for exactly this and records that the site does not have it. It did.',
  },

  // --- player chrome off the broadcast frames -------------------------------
  // Five frame grabs captured with a YouTube player still on screen. Every
  // bottom edge below was found by profiling per-row mean and standard
  // deviation down the source, not by eye: chrome is uniform across the width
  // and the video is not, so the row where sd collapses is the row the player
  // starts. The SCRUB HANDLE is the part that gets missed. It is a disc that
  // rides five or six rows ABOVE the progress bar, so a rectangle cut at the
  // bar leaves a coloured dot on the bottom edge of the plate. Each height
  // below is the first row of the handle, not the first row of the bar.
  'news-interview-cal-maine': {
    rect: { left: 0, top: 0, width: 1998 / 2002, height: 1014 / 1130 },
    expect: [1998, 1014],
    why: 'Progress bar at y=1019, scrub handle from y=1014, control bar to y=1124, then 5 rows of page white. 4 columns of browser edge come off the right. The EGGFLATION kicker, the CAL-MAINE headline and both lower thirds survive whole.',
  },
  'food-inflation-episode': {
    rect: { left: 0, top: 0, width: 1, height: 1012 / 1124 },
    expect: [1996, 1012],
    why: 'Scrub handle from y=1012, progress bar y=1017. The HIGH FOOD PRICES kicker and the headline survive whole.',
  },
  'cheddar-news-fertilizer-shortage': {
    rect: { left: 0, top: 0, width: 1, height: 920 / 1030 },
    expect: [1828, 920],
    why: 'This one is 16:9 to within 2 rows, so the player is drawn OVER the video rather than beside it and the progress bar lands on the lower third. Cutting at the bar clipped the headline; the bar is 255,255,125 and the lower third under it is 0,0,0, so the real boundary is y=920 and the headline survives whole.',
  },
  'san-interview-2': {
    rect: { left: 0, top: 0, width: 1, height: 478 / 530 },
    expect: [952, 478],
    why: 'Both name plates end at y=477, the scrub handle starts at y=481. 3 rows of margin is all there is here.',
  },
  'xtremeag-video-interview': {
    rect: { left: 2 / 1800, top: 1 / 1014, width: 1798 / 1800, height: 853 / 1014 },
    expect: [1798, 853],
    why: 'A 1px dark row on top and 2 dark columns on the left come off with the chrome. The bottom is cut at y=853 rather than at the control bar at y=934, because the "Presented by Loveland" credit runs y=858 to y=918 and the hover chip starts at y=906: the two overlap, so the credit cannot be kept whole and a half-cut sponsor mark reads as a mistake. The frame ends on clean ground instead.',
  },

  // --- edge trims -----------------------------------------------------------
  // Not chrome, just the capture's own border. Both are 1 to 2 device pixels
  // and both sit on a --surface-plate figure, where a dark hairline down one
  // side reads as a rule the design system did not draw.
  'equipment-factory-tour': {
    rect: { left: 0, top: 2 / 1014, width: 1798 / 1800, height: 1012 / 1014 },
    expect: [1798, 1012],
    why: '2 dark rows on top, 2 dark columns on the right. Left and bottom are clean.',
  },
  'green-screen-studio': {
    rect: { left: 1 / 730, top: 0, width: 728 / 730, height: 1 },
    expect: [728, 414],
    why: '1 dark column on the left, 1 flat 162,162,162 column on the right. Top and bottom are clean.',
  },
};

/**
 * Everything deliberately left out of public/, with the reason recorded so the
 * decision is auditable rather than silent.
 */
const SKIPPED = [
  {
    src: `${SRC_BRAND}/LOGO-REVISION-B-A-F-01 copy.png`,
    reason: 'Client explicitly asked for this mark to be omitted from the site. Not read, not copied, not referenced.',
  },
  {
    src: `${SRC_MEDIA}/WEB-COLLAGE-2.png (as a composite)`,
    reason:
      'The four-up composite itself is not emitted. It is barred from a hero or a band by DESIGN_SYSTEM 6.4, and as a figure it is four small frames where the site wants one. Two of its four panels ARE emitted, harvested by CROPS: speaking-closeup and tradeshow-floor-audience. Panel 1 is a wider take on a stage frame already covered; panel 4 duplicates the shipping keynote-stage-xtremeag-portrait.jpg.',
  },

  /* ---------------------------------------------------------------------
     The recovered media kit, part two: what came back and did not ship.

     Every one of these was fetched on 2026-08-07 and is inventoried with its
     source URL and SHA-256 in _source/media-kit/PROVENANCE.md. They are held
     rather than deleted because the folder they came from is being switched
     off, and "we had this and chose not to use it" is a different fact from
     "we never had it". That distinction is the entire reason this rescue was
     necessary in the first place.
     --------------------------------------------------------------------- */
  {
    src: `${SRC_MEDIA_KIT}/PROVENANCE.md`,
    reason:
      'The inventory itself. Source URLs, dimensions, byte sizes and SHA-256s for every file in both recovered archives, including the ones not kept. It is documentation living beside the thing it documents, not a pipeline input.',
  },
  {
    src: `${SRC_MEDIA_KIT}/logo-bayer.png`,
    reason:
      'Recovered from the WordPress library, where it sat unreferenced by any page. It is NOT in the "Client Logos" folder the client supplied, and OPEN-ITEMS item 2 records the decision to treat that folder as the definitive list. Putting a company on a wall captioned "some of Damian\'s clients" is a claim about a commercial relationship, and it is not ours to make. Held pending a one-line answer.',
  },
  {
    src: `${SRC_MEDIA_KIT}/logo-agco.png`,
    reason: 'Same as logo-bayer.png: recovered, unreferenced, not in the supplied client folder.',
  },
  {
    src: `${SRC_MEDIA_KIT}/logo-boehringer-ingelheim.png`,
    reason: 'Same as logo-bayer.png: recovered, unreferenced, not in the supplied client folder.',
  },
  {
    src: `${SRC_MEDIA_KIT}/logo-fast-genetics.png`,
    reason: 'Same as logo-bayer.png: recovered, unreferenced, not in the supplied client folder.',
  },
  {
    src: `${SRC_MEDIA_KIT}/logo-cpda.jpeg`,
    reason:
      'Same as logo-bayer.png, plus one of its own: at 367x208 it is the smallest mark in the rescue and it would land under the wall\'s optical floor even if the relationship were confirmed.',
  },

  {
    src: `${SRC_BRAND}/BOASG-BRAND-LOGO-FINAL-WHITE.jpg`,
    reason:
      'The opaque duplicate of BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png, which ships as boasg-white and is placed on /boasg/. Two files for one mark, and the transparent one is strictly more useful. It shipped as an "unplaced extra" for seven phases; reviewed 2026-08-07 and dropped rather than carried.',
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

  // Frames that were transcoded into public/img/photos/ for seven phases,
  // referenced by no route, and are now deleted from public/ as well as
  // dropped from the manifest. Each one is either a duplicate of a frame that
  // already ships or a frame with no placement the design system permits.
  // The originals stay in _source/media/ in every case.
  {
    src: `${SRC_MEDIA}/book-signing-IMG_2446.png`,
    reason: 'The same 1512x1209 StoneX book-signing frame that already ships as photos/book-signing-stonex.jpg, which /reviews/ carries. Mean absolute difference between the two is 3.2 of 255, which is JPEG quantisation and nothing else. It was also misnamed: there is no XtremeAg in the frame.',
  },
  {
    src: `${SRC_MEDIA}/Screenshot-2024-08-21-at-11.48.25 AM.png`,
    reason: 'The same Straight Arrow News two-shot as Screenshot-2024-08-21-at-11.49.00 AM.png, 35 seconds earlier on the same clock (0:51 against 0:53) with the same two lower thirds. That one is cropped and placed; this one is the second take.',
  },
  {
    src: `${SRC_MEDIA}/Screenshot-2023-04-19-at-11.46.37-AM.png`,
    reason: 'A second Cutting the Curve player capture beside Screenshot-2023-04-18-at-5.55.45-PM.png. Same show, same two-panel layout, same player chrome, and no route needs a second one.',
  },
  {
    src: `${SRC_MEDIA}/IMG_3597-rotated.jpg`,
    reason: 'A wide XtremeAg stage frame, 1500x2000, roughly half ballroom carpet, with Damian about 200px tall. That is the failure DESIGN_SYSTEM 6.3 demotes out of a hero and out of a plate.',
  },
  {
    src: `${SRC_MEDIA}/332503780_161776152950398_8554729294588018579_n.jpeg`,
    reason: 'The other frame of the same moment as IMG_3597-rotated.jpg, shot seconds apart. The tight crop of it, photos/keynote-stage-xtremeag-portrait.jpg, is what ships on /xtreme-ag/ and it is committed rather than generated, so nothing is lost by dropping the wide frame. Nothing in the wide frame is absent from the crop.',
  },
  {
    src: `${SRC_MEDIA}/acres-tv-screenshot.png`,
    reason: 'A streaming-service episode grid: a UI screenshot of somebody else\'s catalogue page, poster tiles and all. DESIGN_SYSTEM 6.4 bars it from a hero, a band and the fold, and rule 2 sends the slot to a ruled card, which is what /acres-tv/ already carries. There is no placement left for it.',
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
 * Write a transparent PNG with nothing hiding under its transparency.
 *
 * WHY THIS EXISTS. A fully transparent pixel still carries RGB. Nothing
 * composites it, so it is invisible in the file and in every lossless copy of
 * it, and it stops being invisible the moment the Next image optimizer
 * re-encodes to AVIF: a lossy alpha channel does not reproduce zero exactly,
 * so whatever colour was hiding comes back as a tinted rectangle at a few
 * percent alpha, in production and nowhere else.
 * scripts/normalize-brand-art.mjs measured that on the brand marks, where the
 * region came back at alpha 6 to 7 carrying grey 146. The cut-out portrait
 * arrived carrying RGB (71, 112, 76), a mid green, under 1,654,970 pixels,
 * which is 49.0% of the frame.
 *
 * WHITE, for the same reason that file gives: this asset stands on bone, so a
 * few percent of leaked white lightens the paper by well under one level and
 * cannot be seen, while a few percent of leaked green is the defect the pass
 * exists to remove.
 *
 * TWO ORDERING TRAPS, BOTH MEASURED, BOTH SILENT.
 *
 *   1. It has to run AFTER the resize, not before. sharp premultiplies alpha
 *      to resize an image with one, so every transparent pixel's RGB is
 *      multiplied by an alpha of zero and un-premultiplied by dividing by it.
 *      A pass that paints white first hands the resizer white and gets back
 *      (0, 0, 0), which on a light ground is worse than the green it replaced.
 *      That is why this takes a pipeline and not a buffer.
 *
 *   2. It has to encode WITHOUT `effort`. sharp treats png effort >= 7 as
 *      permission to quantize to a palette, and a palette has no concept of
 *      "the colour under a transparent pixel": every one is reassigned to
 *      whatever entry the quantizer picked. With effort 10 the emitted file
 *      came back carrying (76, 105, 113) under the transparency, which is the
 *      exporter teal, not anything this pass wrote.
 *
 *   3. The `info` object that comes back from a resized pipeline carries
 *      `premultiplied: true`. Handing it straight back as the raw input
 *      descriptor tells sharp the buffer is premultiplied, so it un-premultiplies
 *      on the way in, which divides by an alpha of zero and writes (0, 0, 0)
 *      over every pixel this pass just painted white. Black under transparency
 *      on a bone ground is the worst of the three outcomes. Only width, height
 *      and channels are passed through.
 *
 * All three were verified by reading the transparent region back out of the
 * emitted PNG, not by reasoning about it. The cost is a few KB on one file, and
 * the optimizer serves AVIF anyway, so no visitor downloads them.
 */
async function writeDeghosted(pipeline, rasterPath) {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] === 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
  const raw = { width: info.width, height: info.height, channels: info.channels };
  return sharp(data, { raw }).png({ compressionLevel: 9 }).toFile(rasterPath);
}

/**
 * Build the resize+orient pipeline for one source.
 * rotate() bakes EXIF orientation into pixels; sharp then drops all metadata
 * on write, which is the "strip EXIF" requirement.
 *
 * `input` is a path for most entries and a lossless PNG buffer for the four
 * that went through groundFixedSource() first.
 */
function base(input, cap) {
  return sharp(input)
    .rotate()
    .resize({ width: cap, height: cap, fit: 'inside', withoutEnlargement: true });
}

/**
 * Repaint the ground white, in place, on a raw RGB(A) buffer.
 *
 * Region growing seeded from all four edges. A pixel joins the ground when it
 * is close in luminance to the ground pixel it was reached from and carries
 * almost no chroma. The per-step luminance bound is what makes this work on a
 * gradient: the ground drifts a level or two per pixel and the walk follows
 * it, while an anti-aliased edge into a mark drops tens of levels in one pixel
 * and stops it. The chroma bound is the second wall, so colored ink is never a
 * candidate however light it is.
 *
 * Returns the fraction of the image repainted, which main() prints so a bad
 * threshold shows up as a number rather than as a quietly gutted logo.
 */
function floodGroundToWhite(data, width, height, channels, { step = 10, chromaMax = 24 } = {}) {
  const lum = (i) => (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
  const chroma = (i) =>
    Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);

  const seen = new Uint8Array(width * height);
  const stack = [];

  /** `fromLum` is null for a seed on the edge, which has nothing to compare to. */
  const visit = (x, y, fromLum) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (seen[p]) return;
    const i = p * channels;
    if (chroma(i) > chromaMax) return;
    if (fromLum !== null && Math.abs(lum(i) - fromLum) > step) return;
    seen[p] = 1;
    stack.push(p);
  };

  for (let x = 0; x < width; x++) {
    visit(x, 0, null);
    visit(x, height - 1, null);
  }
  for (let y = 0; y < height; y++) {
    visit(0, y, null);
    visit(width - 1, y, null);
  }

  while (stack.length) {
    const p = stack.pop();
    const x = p % width;
    const y = (p - x) / width;
    const l = lum(p * channels);
    visit(x - 1, y, l);
    visit(x + 1, y, l);
    visit(x, y - 1, l);
    visit(x, y + 1, l);
  }

  let painted = 0;
  for (let p = 0; p < width * height; p++) {
    if (!seen[p]) continue;
    painted++;
    const i = p * channels;
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
  }
  return painted / (width * height);
}

/**
 * Apply a GROUND_FIXES entry and hand back a lossless PNG buffer, so the
 * normal pipeline below is unchanged and nothing is encoded twice lossily.
 * Also returns the repainted fraction for the log line, or null when the
 * entry only crops.
 */
async function groundFixedSource(absSrc, fix) {
  const raw = async (pipeline) => {
    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
    return { data, meta: { width: info.width, height: info.height, channels: info.channels } };
  };

  // flatten() first: a fix is only ever applied to a mark that is opaque
  // already, and it guarantees three channels for the flood arithmetic.
  let { data, meta } = await raw(sharp(absSrc).rotate().flatten({ background: '#ffffff' }));

  if (fix.crop) {
    const { left = 0, top = 0, right = 0, bottom = 0 } = fix.crop;
    ({ data, meta } = await raw(
      sharp(data, { raw: meta }).extract({
        left,
        top,
        width: meta.width - left - right,
        height: meta.height - top - bottom,
      }),
    ));
  }

  let painted = null;
  if (fix.flood) {
    painted = floodGroundToWhite(data, meta.width, meta.height, meta.channels, fix.flood);
  }

  return { buffer: await sharp(data, { raw: meta }).png().toBuffer(), painted };
}

/**
 * Process one manifest entry. Returns { out: string[], w, h, ground? }.
 */
async function process(entry) {
  const name = path.basename(entry.src);
  if (FORBIDDEN.has(name)) {
    throw new Error(`Refusing to process forbidden asset: ${entry.src}`);
  }
  const absSrc = resolveSrc(entry.src);
  if (!absSrc) throw new Error(`Source not found: ${entry.src}`);

  const isLogo = entry.kind === 'logo';
  /* Per-entry override, because one asset in the manifest is not like the
     others: a transparent PNG cannot drop its alpha channel, so the usual
     "cap generously, the encoder will sort it out" reasoning does not apply
     and the cap has to be set from how wide the thing actually renders. Only
     set `max` with that kind of measured reason. */
  const cap = entry.max ?? (isLogo ? LOGO_MAX : PHOTO_MAX);
  const outDir = path.join(PUBLIC_IMG, entry.dir);
  await fsp.mkdir(outDir, { recursive: true });

  // A ground fix replaces the source with an equivalent lossless buffer, so
  // everything downstream of here is identical for a fixed and an unfixed mark.
  const fix = GROUND_FIXES[entry.base];
  let ground;
  let input = absSrc;
  if (fix) {
    const fixed = await groundFixedSource(absSrc, fix);
    input = fixed.buffer;
    ground = fixed.painted === null ? 'cropped' : `${(fixed.painted * 100).toFixed(1)}% ground repainted`;
  }

  // A photo crop. Runs on the ORIGINAL, before the resize below, so no
  // resolution is discarded twice, and after rotate() so EXIF orientation is
  // baked before the rectangle means anything. Fractional, then rounded once.
  const cropSpec = CROPS[entry.base];
  if (cropSpec) {
    const src = await sharp(input).rotate().toBuffer();
    const m = await sharp(src).metadata();
    const r = cropSpec.rect;
    input = await sharp(src)
      .extract({
        left: Math.round(r.left * m.width),
        top: Math.round(r.top * m.height),
        width: Math.round(r.width * m.width),
        height: Math.round(r.height * m.height),
      })
      .png()
      .toBuffer();
  }

  const ext = entry.ext ?? rasterExt(entry.src);
  const rasterPath = path.join(outDir, entry.base + ext);
  const info = entry.deghost
    ? await writeDeghosted(base(input, cap), rasterPath)
    : await encode(base(input, cap), ext, entry.kind).toFile(rasterPath);

  const out = [`/img/${entry.dir}/${entry.base}${ext}`];

  if (isLogo) {
    // Same pixel dimensions as the raster. Try lossless and quality 90, keep
    // whichever is smaller. Flat-color marks usually win with lossless.
    if (ext === '.webp') {
      // Source was already webp AND no `ext` override sent it down the normal
      // branch. Nothing in the manifest reaches this today, because the one
      // .webp source carries ext: '.png' for the reason recorded beside it.
      // Kept as a guard rather than deleted: a future .webp drop that forgets
      // the override should emit SOMETHING non-webp rather than nothing.
      const pngPath = path.join(outDir, entry.base + '.png');
      await base(input, cap).png({ compressionLevel: 9, effort: 10 }).toFile(pngPath);
      out.push(`/img/${entry.dir}/${entry.base}.png`);
    } else {
      const webpPath = path.join(outDir, entry.base + '.webp');
      const [lossless, lossy] = await Promise.all([
        base(input, cap).webp({ lossless: true, effort: 6 }).toBuffer(),
        base(input, cap).webp({ quality: 90, effort: 6 }).toBuffer(),
      ]);
      await fsp.writeFile(webpPath, lossless.length < lossy.length ? lossless : lossy);
      out.push(`/img/${entry.dir}/${entry.base}.webp`);
    }
  }

  // A crop that no longer emits what it claims is a silent defect: the whole
  // point of a rectangle is that it excludes something, and if it drifts the
  // thing it excluded comes back with no error. Assert, do not hope.
  if (cropSpec?.expect) {
    const [ew, eh] = cropSpec.expect;
    if (info.width !== ew || info.height !== eh) {
      throw new Error(
        `CROPS.${entry.base} expected ${ew}x${eh} but emitted ${info.width}x${info.height}. ` +
          `Re-measure the rectangle against the source; do not just update the expectation.`,
      );
    }
  }

  return { out, w: info.width, h: info.height, ...(ground ? { ground } : {}) };
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
    ...CLIENTS.map((c) => ({ src: `${c.from ?? SRC_CLIENTS}/${c.src}`, dir: 'clients', base: c.base, kind: 'logo', name: c.name })),
    ...SPONSORS.map((s) => ({ src: `${SRC_SPONSORS}/${s.src}`, dir: 'sponsors', base: s.base, kind: 'logo', name: s.name, url: s.url, ext: s.ext })),
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
    /* Recorded under BOTH keys, on purpose.
       One source can now yield several outputs (the collage yields two
       panels), and keying only by src meant the second overwrote the first:
       the asset map would have recorded one panel and silently lost the other.
       dir/base is unique per output and fixes that.
       The src key stays because three emitters below still look up clients,
       sponsors and brand marks by source path, and for those one source is one
       output so the key was never ambiguous. Changing them would be a bigger
       edit than the defect warrants. */
    const key = `${entry.dir}/${entry.base}`;
    map[key] = res;
    dims.set(key, res);
    dims.set(entry.src, res);
    console.log(
      `${entry.src}  ->  ${res.out.join(', ')}  (${res.w}x${res.h})${res.ground ? `  [ground fix: ${res.ground}]` : ''}`,
    );
  }

  map.skipped = SKIPPED;

  // Completeness audit. Every file in every source folder must be either
  // processed or explicitly skipped, so a new drop of client assets shows up
  // as a loud failure instead of quietly going missing.
  const fold = (s) => s.normalize('NFC').replace(/\s+/gu, ' ');
  const accounted = new Set([...entries.map((e) => e.src), ...SKIPPED.map((s) => s.src)].map(fold));
  const unaccounted = [];
  for (const dir of [SRC_CLIENTS, SRC_SPONSORS, SRC_BRAND, SRC_MEDIA, SRC_MEDIA_KIT]) {
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
    const d = dims.get(`${c.from ?? SRC_CLIENTS}/${c.src}`);
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
      '  Harvest Returns, agriculture investment platform, Fort Worth. The www',
      '    host is the live one: the apex has no A record at all.',
      '  Life Scientific, crop protection, Dublin.',
      '  NewFields Ag, liquid biologicals and seed treatments, Grand Mound Iowa.',
      '  Redox Bio, plant bio-nutrition, Burley Idaho, trading as redoxgrows.com.',
      '',
      'Nano-Yield is the one logo whose SOURCE is already .webp. Its raster is',
      'emitted as .png anyway, via an `ext` override in the manifest, so that it',
      'gets a real .webp sibling and behaves like the other thirty marks. Left',
      'alone, the .webp would be the <img src>, webpSibling() returns null for a',
      '.webp source, and the .png beside it would be unreachable by construction.'
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
    `  wordmark: ${q(b('wordmark'))}, // site header and footer on every route, plus the OG card and the Organization logo in lib/schema.ts\n` +
    `  wordmarkWhite: ${q(b('wordmark-white'))}, // not placed anywhere: the wordmark never reverses. See DESIGN_SYSTEM section 10 rule 4\n` +
    `  boasg: ${q(b('boasg'))}, // /boasg/ share card\n` +
    `  boasgWhite: ${q(b('boasg-white'))}, // /boasg/ badge\n` +
    `  businessOfAgriculture: ${q(b('business-of-agriculture'))}, // /the-business-of-agriculture/, the stacked lockup leading the subscribe band\n` +
    `  businessOfAgriculturePodcast: ${q(b('business-of-agriculture-podcast'))}, // /the-business-of-agriculture/ and /podcasts/ cover art, and the PodcastSeries image\n` +
    `  granary: ${q(b('the-granary'))}, // /the-business-of-agriculture/ and /xtreme-ag/, the Granary show mark\n` +
    `  xtremeAg: ${q(b('xtreme-ag'))}, // /the-business-of-agriculture/, the XtremeAg partnership credit\n` +
    '} as const;\n\n' +
    header([
      'Secondary marks that ship alongside the primary set. They are kept out of',
      'brandAssets so that object stays a short, stable contract, but the files',
      'are real and available if a page needs them.',
      '',
      'REVIEWED 2026-08-07. "Unplaced" was doing two different jobs here: some of',
      'these had no home YET, and some have no home BY DECISION and should never',
      'get one. Those are different facts, and a maintainer looking for something',
      'to place should not have to guess which is which, so each one says.',
    ]) +
    '\nexport const brandAssetsExtra = {\n' +
    `  doBusinessBetterPodcast: ${q(b('do-business-better-podcast'))}, // /podcasts/ and /do-business-better-podcast/ cover art, and the PodcastSeries image\n` +
    `  xtremeAgTransparent: ${q(b('xtreme-ag-transparent'))}, // /podcasts/ and /xtreme-ag/, the transparent XtremeAg mark for placing on color\n` +
    '\n' +
    '  /* DELIBERATELY NEVER PLACED. Each is available and each is the wrong\n' +
    '     answer to the slot it looks like it fits. */\n' +
    `  businessOfAgricultureLockup: ${q(b('business-of-agriculture-lockup'))}, // the horizontal alternate. This site has no wide lockup slot: the show is named in a heading or shown as square artwork. Placing it means inventing the slot first\n` +
    `  businessOfAgricultureIconWhite: ${q(b('business-of-agriculture-icon-white'))}, // the leaf alone. A mark without its wordmark identifies nothing to a reader who has not already learned it, and this site names the show in full everywhere\n` +
    `  businessOfAgricultureAvatar: ${q(b('business-of-agriculture-avatar'))}, // the 218x217 SoundCloud avatar. Both player embeds draw it themselves, so a copy beside one is the same picture twice\n` +
    `  dmMonogram: ${q(b('dm-monogram'))}, // not a shipped image at all: the SOURCE the site icons were cut from. See app/icon.png and scripts/build-app-icons.mjs\n` +
    '} as const;\n\n' +
    header([
      'ALSO IN THE ASSET LIBRARY AND DELIBERATELY NOT IN THIS FILE.',
      '',
      'boasg-white-flat.jpg was an "unplaced" extra here for seven phases. It is',
      'the opaque duplicate of boasgWhite, which ships and is placed, so it was',
      'two files for one mark. Dropped from the pipeline 2026-08-07; the reason',
      'is recorded in the skipped list in _source/asset-map.json.',
      '',
      'wordmark-white.png is the one people reach for and the one to refuse.',
      'DESIGN_SYSTEM rule 4 forbids reversing the wordmark, and the file was',
      're-examined pixel by pixel during the amplification pass: every opaque',
      'pixel in it is pure white, so the orange rule across the bottom third of',
      'the art is simply absent from it. It is a flat knockout, not a reversed',
      'lockup. Inside a dark region the wordmark sits on a paper plate instead,',
      'which is what the footer does.',
    ]) +
    'export type BrandAssetKey = keyof typeof brandAssets;\n';
  await fsp.writeFile(path.join(CONTENT, 'brand-assets.ts'), brandTs);

  // -- ink normalization ----------------------------------------------------
  // The two walls only. Everything above this line is faithful to the supplied
  // file; this is the one pass that changes the artwork's framing, and it is
  // the difference between 31 equal cells and 31 equal marks.
  console.log('\nNormalizing logo-wall ink.');
  await normalizeLogoInk();

  console.log(`\nProcessed ${entries.length} assets. Skipped ${SKIPPED.length}.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

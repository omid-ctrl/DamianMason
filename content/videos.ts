/**
 * Every video on the old damianmason.com.
 *
 * COUNT: 16, made of 13 YouTube embeds plus 3 self-hosted MP4 demo reels.
 * This matches `_source/manifest.json` totals.videos = 16 and the Corrections
 * table in docs/build/STATE.md, which overrides the plan's figure of 11.
 * All 13 YouTube IDs were confirmed distinct by grepping every embed URL in
 * the 28 raw HTML mirrors. None of them is site chrome and none is repeated on
 * a second page: the header, footer and utility bar carry no video at all.
 *
 * Per page: home 4, reviews 4, collaboration-opportunities 2, blog-news 3,
 * keynote 3 MP4s, and the innovation MP4 again on
 * collaboration-opportunities.
 *
 * `onPages` holds NEW-site route paths. Each one maps 1:1 to the old page the
 * video was harvested from.
 *
 * TITLES come from the source pages. Three source defects were corrected:
 *   - The fourth reviews iframe title was double-escaped in the markup and
 *     rendered on the live page as the literal string `Ag&apos;s Future`.
 *     Written properly below, with typographic quotes in place of the raw
 *     `&quot;` pair, which is how the same phrase is set in the FAQ copy.
 *   - The keynote label for the food waste reel had a trailing no-break space.
 *   - No title existed for the three demo reels beyond a one-word H3 label, so
 *     each carries a plain written `description` in addition to that label.
 * Nothing else was reworded. One title keeps an em dash, see the note on it.
 *
 * MP4 NOTES:
 *   - All three reels were re-encoded to 720p H.264 at CRF 25 with a faststart
 *     atom, taking the set from 106MB to 21MB with the duration, framing and
 *     audio of the originals intact. The 1080p sources are gone from the repo.
 *   - Each one now carries a real `poster` frame grabbed four seconds in, so a
 *     mobile visitor sees Damian on stage rather than the black rectangle the
 *     old site shipped.
 *   - POSTER SIZING, and do not undo it: `preload="none"` suppresses the video
 *     bytes but there is no lazy equivalent for the `poster` attribute, so
 *     Chrome fetches every poster on the page during the initial load, however
 *     far below the fold the reel sits. The three keynote posters shipped as
 *     1280x720 JPEGs totalling 136KB for frames that render at 370x208 on
 *     mobile and about 420px wide on desktop, which cost /keynote/ 0.9s of
 *     mobile LCP and six Lighthouse performance points. They are now 640x360
 *     WebP totalling 39KB, which is the displayed size at the mobile device
 *     pixel ratio. Regenerate with:
 *       cwebp -q 78 -resize 640 360 -m 6 <frame>.jpg -o dm-<name>.webp
 *     Combined with `preload="none"`, a reel now costs 6KB to 18KB until
 *     someone presses play.
 *   - None of the three is captioned yet. `VideoEmbed` takes a `captions` prop
 *     and the VTT is still owed.
 *
 * `file` and `poster` are BOTH root-relative URLs served from `public/`. They
 * are the paths that actually ship, so a route renders a reel by handing the
 * record straight to VideoEmbed. Do not reintroduce a per-route filename map:
 * the one that used to live in /keynote/ silently left the same reel broken on
 * /collaboration-opportunities/, which never applied it.
 */

/**
 * The shape of the SOURCE recording, which is not always the shape of the
 * frame it is served in.
 *
 * `wide`     a 16:9 recording. Everything on the site except the four below.
 * `vertical` a 9:16 recording, shot on a phone. YouTube still serves its
 *            hqdefault still as a 480x360 4:3 file, and it fills the space
 *            either side of a vertical frame with a blown-up copy of that same
 *            frame rather than with black bars. Dropped into a 16:9 stage the
 *            result is three mismatched panels: a narrow real frame between
 *            two enormous duplicates of itself. Marking the source lets the
 *            stage take the recording's own shape, at which point the crop
 *            lands exactly on the real frame and the duplicate never paints.
 */
export type VideoFraming = 'wide' | 'vertical';

export type Video =
  | {
      id: string;
      kind: 'youtube';
      youtubeId: string;
      title: string;
      description?: string;
      /** Defaults to 'wide'. */
      framing?: VideoFraming;
      onPages: string[];
    }
  | {
      id: string;
      kind: 'mp4';
      file: string;
      title: string;
      poster?: string;
      description?: string;
      /** Defaults to 'wide'. */
      framing?: VideoFraming;
      onPages: string[];
    };

export const videos: Video[] = [
  // == home page: four video testimonials
  {
    id: 'life-changing',
    kind: 'youtube',
    youtubeId: 'yL33iAIS2K4',
    title: 'Life Changing!',
    onPages: ['/'],
  },
  {
    id: 'rocked-it-in-saskatchewan',
    kind: 'youtube',
    youtubeId: 'Tk8dPv_8Zo0',
    title: 'Rocked It In Saskatchewan!',
    onPages: ['/'],
  },
  {
    id: 'mfa-emerging-leaders-conference',
    kind: 'youtube',
    youtubeId: 'xmwijvcK1wY',
    title: 'MFA Emerging Leaders Conference',
    onPages: ['/'],
  },
  {
    id: 'do-business-better-lindsay-corporation',
    kind: 'youtube',
    youtubeId: 'jQAaQfcamVs',
    title: 'Do Business Better for Lindsay Corporation',
    onPages: ['/'],
  },

  // == /reviews/: four video testimonials
  // All four were shot vertically by the person speaking, which is why all four
  // carry framing: 'vertical'. The round-3 QA pass profiled the column
  // luminance of each rendered facade and found hard seams at 29% and 71% of
  // the width on every one, with a mirror test ruling out a mirror (MAE 49.9
  // about the seam against a 14.0 baseline). Those seams put the real frame at
  // 42% of the 480px hqdefault, which is 202 columns: 9:16 to the pixel. What
  // sits either side of it is a scaled copy of the same frame, not black bars.
  // Removing any one of these lines puts that copy back on the page.
  {
    id: 'hardwood-lumbermens-association',
    kind: 'youtube',
    youtubeId: 'iZ85SxLyykA',
    title: 'Hardwood Lumbermen’s Association recommends Damian Mason',
    framing: 'vertical',
    onPages: ['/reviews/'],
  },
  {
    id: 'farm-credit-emerging-entrepreneurs',
    kind: 'youtube',
    youtubeId: 't3iCvSKEyx0',
    title: 'Farm Credit Emerging Entrepreneurs Conference & Damian Mason',
    framing: 'vertical',
    onPages: ['/reviews/'],
  },
  {
    id: 'nutrien-a-successful-meeting',
    kind: 'youtube',
    youtubeId: 'e79QDYxpJOE',
    title: 'Nutrien - a successful meeting!',
    framing: 'vertical',
    onPages: ['/reviews/'],
  },
  {
    id: 'ations-of-agriculture',
    kind: 'youtube',
    youtubeId: 't6BkS7Eb9pE',
    title: 'The “Ations” of Agriculture & Ag’s Future',
    framing: 'vertical',
    onPages: ['/reviews/'],
  },

  // == /collaboration-opportunities/: two content-partnership samples
  {
    // FLAGGED: this title is verbatim from the source iframe and it contains
    // an em dash (U+2014). It is kept because the rule is that verbatim source
    // content keeps its punctuation. A later phase should decide whether to
    // replace the dash with a colon, since this is a title and not a quote.
    id: 'managing-for-the-future',
    kind: 'youtube',
    youtubeId: 'M01PxhzRVFg',
    title:
      'Managing For The Future: A Candid Conversation with a 30 Year Old, 4th Gen Farmer',
    onPages: ['/collaboration-opportunities/'],
  },
  {
    id: 'survival-strategies-for-small-business',
    kind: 'youtube',
    youtubeId: 'csEaUJ52p3I',
    title: 'Survival Strategies For Small Business',
    onPages: ['/collaboration-opportunities/'],
  },

  // == /blog-news/: three press appearances
  {
    id: 'cheddar-climate-food-shortage',
    kind: 'youtube',
    youtubeId: '5FUIE6Ks0Ok',
    title: 'Damian Mason Discussing Climate & Food Shortage Truth on CheddarNews',
    onPages: ['/blog-news/'],
  },
  {
    // The ID starts with a hyphen. Do not strip it.
    id: 'eagle-country-95-9-interview',
    kind: 'youtube',
    youtubeId: '-cmL21M1XF0',
    title: 'Interview with Eagle Country 95.9',
    onPages: ['/blog-news/'],
  },
  {
    id: 'newsmax-wheat-and-inflation',
    kind: 'youtube',
    youtubeId: 'Ngfdu0YdBY8',
    title: 'Damian Mason Discussing Wheat and Inflation of Food Prices on NewsmaxTV',
    onPages: ['/blog-news/'],
  },

  // == self-hosted demo reels
  {
    id: 'demo-food-waste',
    kind: 'mp4',
    file: '/video/dm-food-waste-720p.mp4',
    poster: '/img/video-posters/dm-food-waste.webp',
    title: 'Food Waste',
    description: 'A short cut from a live keynote on what the food waste argument gets wrong.',
    onPages: ['/keynote/'],
  },
  {
    id: 'demo-labor',
    kind: 'mp4',
    file: '/video/dm-labor-720p.mp4',
    poster: '/img/video-posters/dm-labor.webp',
    title: 'Labor',
    description: 'A short cut from a live keynote on where farm and food labor is headed.',
    onPages: ['/keynote/'],
  },
  {
    // The only asset on the old site used by two pages.
    id: 'demo-innovation',
    kind: 'mp4',
    file: '/video/dm-innovation-720p.mp4',
    poster: '/img/video-posters/dm-innovation.webp',
    title: 'Innovation',
    description: 'A short cut from a live keynote on ag innovation and who pays for it.',
    onPages: ['/keynote/', '/collaboration-opportunities/'],
  },
];

/** Every video placed on a given route, in file order. */
export const videosFor = (page: string): Video[] =>
  videos.filter((video) => video.onPages.includes(page));

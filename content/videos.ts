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
 * MP4 NOTES for a later phase:
 *   - `dm_-_innovation-1080p.mp4` is 39MB, uncompressed, and it is the only
 *     media asset on the old site used on two pages (/keynote/ and
 *     /collaboration-opportunities/, where it was labelled "Live Keynote
 *     Segment on Ag Innovation"). It must be compressed or moved to a
 *     streaming host before it ships.
 *   - The other two reels are 31MB and 35MB and want the same treatment.
 *   - No poster frame exists for any of the three. The old site shipped three
 *     bare `<video controls>` elements with no `poster`, no `<track>` and no
 *     `preload` hint, so a mobile visitor saw three black rectangles. `poster`
 *     is left undefined here until real frames are exported.
 *
 * `file` is the filename exactly as it exists in `_source/media/`.
 */

export type Video =
  | {
      id: string;
      kind: 'youtube';
      youtubeId: string;
      title: string;
      description?: string;
      onPages: string[];
    }
  | {
      id: string;
      kind: 'mp4';
      file: string;
      title: string;
      poster?: string;
      description?: string;
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
  {
    id: 'hardwood-lumbermens-association',
    kind: 'youtube',
    youtubeId: 'iZ85SxLyykA',
    title: 'Hardwood Lumbermen’s Association recommends Damian Mason',
    onPages: ['/reviews/'],
  },
  {
    id: 'farm-credit-emerging-entrepreneurs',
    kind: 'youtube',
    youtubeId: 't3iCvSKEyx0',
    title: 'Farm Credit Emerging Entrepreneurs Conference & Damian Mason',
    onPages: ['/reviews/'],
  },
  {
    id: 'nutrien-a-successful-meeting',
    kind: 'youtube',
    youtubeId: 'e79QDYxpJOE',
    title: 'Nutrien - a successful meeting!',
    onPages: ['/reviews/'],
  },
  {
    id: 'ations-of-agriculture',
    kind: 'youtube',
    youtubeId: 't6BkS7Eb9pE',
    title: 'The “Ations” of Agriculture & Ag’s Future',
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
    file: 'dm_-_food_waste-1080p.mp4',
    title: 'Food Waste',
    description: 'A short cut from a live keynote on what the food waste argument gets wrong.',
    onPages: ['/keynote/'],
  },
  {
    id: 'demo-labor',
    kind: 'mp4',
    file: 'dm_-_labor-1080p.mp4',
    title: 'Labor',
    description: 'A short cut from a live keynote on where farm and food labor is headed.',
    onPages: ['/keynote/'],
  },
  {
    // 39MB. Needs compression. Used on two pages, and it is the only asset on
    // the old site that was.
    id: 'demo-innovation',
    kind: 'mp4',
    file: 'dm_-_innovation-1080p.mp4',
    title: 'Innovation',
    description: 'A short cut from a live keynote on ag innovation and who pays for it.',
    onPages: ['/keynote/', '/collaboration-opportunities/'],
  },
];

/** Every video placed on a given route, in file order. */
export const videosFor = (page: string): Video[] =>
  videos.filter((video) => video.onPages.includes(page));

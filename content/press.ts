/**
 * Press and media appearances, harvested verbatim from /blog-news/ on the old
 * damianmason.com.
 *
 * COUNT: 9. That matches `_source/manifest.json` totals.pressItems = 9 and the
 * plan. The old page rendered these as eleven Divi sections, but two of them
 * are empty: an empty video module above the first item and a completely
 * empty trailing section. Neither is content.
 *
 * TITLES are verbatim, including the heading case the old site used, which was
 * inconsistent item to item. Two of the nine duplicate the two blog posts in
 * content/posts.ts under differently cased titles, which is how the old site
 * shipped. That duplication is recorded rather than resolved here, because
 * deciding whether the post or the press item wins is a page-build decision.
 *
 * URLS are the real outbound hrefs pulled from `_source/html/blog-news.html`.
 * Six items link to an article. The other three had no outbound link at all:
 * they were YouTube iframes, so their `url` is the canonical watch URL for the
 * embedded video, which is the only destination the old page offered.
 *
 * DATES: the old page showed no date on any of the nine items, which is why
 * `date` is set only where the source itself carries one. The Forbes article's
 * publication date is in its own URL path. Everything else needs the client to
 * supply a date before this list can be sorted chronologically.
 *
 * `type` classifies the appearance, not the medium of the link:
 *   - article: a written piece Damian is quoted in or wrote for.
 *   - tv: a broadcast segment, even where the only surviving copy is on
 *     YouTube.
 *   - podcast: an audio interview, here a live radio spot.
 *   - video: reserved, unused by the current nine.
 *
 * IMAGES. The old page's six were raw macOS captures with empty alt text,
 * three of them loading from the staging host, and two with a raw U+202F
 * narrow no-break space inside the filename. None of that carries over.
 *
 * What does carry over is `thumb`, on five of the nine, and only on five. Each
 * of those five is a broadcast frame whose burned-in headline is the headline
 * of the row it sits beside: EGGFLATION over the Cal-Maine row, HIGH FOOD
 * PRICES over the food-prices row, GLOBAL FERTILIZER SHORTAGE GETTING EVEN
 * WORSE over the fertilizer row. That match is the whole reason the thumb is
 * defensible under DESIGN_SYSTEM 6.4 rule 3, and it is why the other four rows
 * get nothing rather than something.
 *
 * THE FORBES ROW GETS NOTHING ON PURPOSE. `forbes-feature.png` exists and is
 * about the right article, but it is a promo card with a READ ARTICLE button
 * drawn into the pixels. A button that cannot be clicked, one line above a
 * link that can, is worse than no picture.
 */

/**
 * An optional square frame for a row's left rail. `width` and `height` are the
 * real dimensions of the file in public/; re-measure them if CROPS in
 * scripts/normalize-assets.mjs ever moves a rectangle.
 */
export type PressThumb = {
  src: string;
  width: number;
  height: number;
  /**
   * The inline description, for a file whose only call site is this list.
   *
   * LEAVE IT OUT for a file that content/image-alt.ts owns, and do not retype
   * the string here: that file's first rule is that a shared file may not have
   * two descriptions. PressList reads it from there instead.
   */
  alt?: string;
};

export type PressItem = {
  id: string;
  outlet: string;
  title: string;
  url: string;
  date?: string;
  type: 'article' | 'podcast' | 'video' | 'tv';
  thumb?: PressThumb;
};

export const press: PressItem[] = [
  {
    id: 'san-soybeans-incredible-year',
    outlet: 'Straight Arrow News',
    title: 'Soybeans are having an incredible year. That’s bad for prices.',
    url: 'https://san.com/cc/soybeans-are-having-an-incredible-year-thats-bad-for-prices/',
    type: 'article',
    // Straight Arrow News, 21 August 2024, which is the month this piece ran.
    // Same two-shot and the same correspondent as the Eggflation appearance,
    // two years later.
    thumb: {
      src: '/img/photos/san-interview-2.png',
      width: 952,
      height: 478,
      alt: 'Damian Mason in a ball cap at his podcast desk, opposite Straight Arrow News correspondent Simone Del Rosario, both named on screen, his plate reading THE BUSINESS OF AGRICULTURE.',
    },
  },
  {
    id: 'san-bird-flu-egg-prices',
    outlet: 'Straight Arrow News',
    title: 'Just as inflation cools, bird flu is driving up the price of eggs',
    url: 'https://san.com/cc/just-as-inflation-cools-bird-flu-is-driving-up-the-price-of-eggs/',
    type: 'article',
  },
  {
    // Heading verbatim. It is the only item on the old page with a real text
    // CTA, and the only one whose heading was an H1, which gave the page a
    // second H1. The linked article is "AGCO-Trimble Joint Venture Aims At
    // Accelerating Smart Farming Development" by Jim Vinoski.
    id: 'forbes-agco-trimble',
    outlet: 'Forbes',
    title: 'Damian Quoted In Forbes',
    url: 'https://www.forbes.com/sites/jimvinoski/2023/10/16/agco-trimble-joint-venture-aims-at-accelerating-smart-farming-development/',
    date: '2023-10-16',
    type: 'article',
  },
  {
    // Same article as the blog post at /blog/eggflation-gives-producers-record-profits/.
    id: 'san-eggflation-record-profits',
    outlet: 'Straight Arrow News',
    title:
      '‘Eggflation’ gives producers record profits while internet mocks outrageous prices',
    url: 'https://straightarrownews.com/cc/eggflation-gives-producers-record-profits-while-internet-mocks-outrageous-prices/',
    type: 'article',
    // The frame carries the word EGGFLATION, which is the word in this row's
    // own title. Alt is in content/image-alt.ts: the blog post at
    // /blog/eggflation-gives-producers-record-profits/ carries the same file.
    thumb: { src: '/img/photos/news-interview-cal-maine.png', width: 1998, height: 1014 },
  },
  {
    id: 'san-high-food-prices-persist',
    outlet: 'Straight Arrow News',
    title: 'Why high food prices will persist even when inflation eases elsewhere',
    url: 'https://straightarrownews.com/cc/why-high-food-prices-will-persist-even-when-inflation-eases-elsewhere/',
    type: 'article',
    thumb: {
      src: '/img/photos/food-inflation-episode.png',
      width: 1996,
      height: 1012,
      alt: 'Damian Mason on Straight Arrow News in front of a Business of Agriculture backdrop, under a HIGH FOOD PRICES kicker and the headline WHEN WILL FOOD INFLATION GO DOWN?',
    },
  },
  {
    // Embed only on the old page. Same segment as the blog post at
    // /blog/how-the-climate-crisis-is-causing-food-shortages-globally/.
    id: 'cheddar-climate-food-shortages',
    outlet: 'Cheddar News',
    title: 'How the climate crisis is causing food shortages globally',
    url: 'https://www.youtube.com/watch?v=5FUIE6Ks0Ok',
    type: 'tv',
    // Alt is in content/image-alt.ts: the blog post at
    // /blog/how-the-climate-crisis-is-causing-food-shortages-globally/
    // carries the same file.
    thumb: { src: '/img/photos/cheddar-news-food-supply.png', width: 2000, height: 1124 },
  },
  {
    // "Bison Ag Supply And Service" capitalizes "And" on the live page.
    // Verbatim. The "upcoming event" it refers to is years past.
    id: 'eagle-country-bison-ag-supply',
    outlet: 'Eagle Country 95.9',
    title:
      'Damian joins Eagle Country 95.9 to discuss his upcoming event with Bison Ag Supply And Service',
    url: 'https://www.youtube.com/watch?v=-cmL21M1XF0',
    type: 'podcast',
  },
  {
    id: 'cheddar-global-fertilizer-shortage',
    outlet: 'Cheddar News',
    title:
      'Global fertilizer shortage prompts farmers to consider more sustainable practices',
    url: 'https://cheddar.com/media/global-fertilizer-shortage-prompts-farmers-to-consider-more-sustainable-practices',
    type: 'tv',
    thumb: {
      src: '/img/photos/cheddar-news-fertilizer-shortage.png',
      width: 1828,
      height: 920,
      alt: 'Damian Mason in an XtremeAg polo opposite a Cheddar News anchor in Washington, under the headline GLOBAL FERTILIZER SHORTAGE GETTING EVEN WORSE.',
    },
  },
  {
    // The on-page heading spells it "NewsMaxTV" and the iframe title spells it
    // "NewsmaxTV". The heading is used here, which is what a visitor read.
    //
    // `outlet` drops the "TV" because PressList prints the outlet in an eyebrow
    // and the type label in the badge beside it, so "Newsmax TV" rendered as
    // "Newsmax TV   TV". The medium is still on the row, in the badge, and the
    // title below still carries the verbatim "NewsMaxTV" from the source
    // heading, so nothing is lost.
    id: 'newsmax-wheat-food-price-inflation',
    outlet: 'Newsmax',
    title: 'Damian Mason discussing wheat and inflation of food prices on NewsMaxTV',
    url: 'https://www.youtube.com/watch?v=Ngfdu0YdBY8',
    type: 'tv',
  },
];

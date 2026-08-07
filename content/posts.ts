/**
 * The two blog posts from the old damianmason.com.
 *
 * COUNT: 2. `_source/manifest.json` totals.blogPosts = 2, and the Corrections
 * table in docs/build/STATE.md settles the plan's "3 posts": /blog/ is the post
 * archive, not a post.
 *
 * READ THIS BEFORE BUILDING /blog/. Both post bodies are real and both are
 * almost empty. The Eggflation post is seven words plus a byline. The climate
 * post is five words. Verified twice against the raw HTML: in each case the
 * `entry-content` div holds exactly one paragraph. `body` below reproduces
 * that paragraph and nothing else, because there is nothing else to migrate.
 * These posts need to be written or replaced, and that is a client decision,
 * not something this file may invent.
 *
 * SLUGS. The Eggflation post is WordPress post ID 1: the stock "Hello world!"
 * seed post, edited in place and never re-slugged, so it shipped and got
 * indexed at /hello-world/. It gets a real slug here and a 301 from the old
 * one. The climate post keeps its slug and moves under /blog/.
 *
 * AUTHOR. The live byline on both posts is `damianmasonstg`, a raw WordPress
 * staging username, linked to /author/damianmasonstg/. That is a defect, not a
 * name, so `author` is "Damian Mason" on both.
 *
 * EXCERPTS. The old excerpts are unusable. One truncates mid-phrase because
 * the body is four words long, and the other collapses a `<br>` and reads
 * "Damian featured in Straight Arrow NewsBy Simone Del Rosario" with no space.
 * The excerpts below are written fresh against VOICE.md. They are the only
 * copy in this file that is not verbatim from the source, and they are marked
 * as such on each entry.
 *
 * WHAT WAS DELIBERATELY LEFT OUT:
 *   - The stock WordPress seed comment on the Eggflation post, live on a
 *     client site since 2022 and linking out to wpengine.com.
 *   - The comment forms, which post to a WP Engine specific endpoint.
 *   - The "Uncategorized" category on both posts.
 *   - The og:description on the Eggflation post. It reads like a real excerpt,
 *     but it is the lede of somebody else's Straight Arrow News article and
 *     must not be republished as Damian's copy.
 *
 * `heroImage` is the filename as it exists in `_source/media/`. Both are raw
 * macOS screenshots of another publisher's page, so both want replacing.
 * `sourceUrl` is the outbound piece the post is about. Neither post linked to
 * it on the old site, which is the single biggest defect on both.
 */

export type Post = {
  slug: string;
  title: string;
  /**
   * The `<title>` for the post, when the headline is too long to survive a
   * SERP. Both headlines here run past 55 characters before the site suffix is
   * even added, so both carry one. It is the headline cut down, never a
   * different claim. Falls back to `title` when absent.
   */
  seoTitle?: string;
  /** ISO date, from the WordPress `datePublished` in the page's JSON-LD. */
  date: string;
  excerpt: string;
  author: string;
  /** Full body copy, verbatim from the source, as markdown. */
  body: string;
  heroImage?: string;
  heroAlt?: string;
  sourceUrl?: string;
};

export const posts: Post[] = [
  {
    slug: 'eggflation-gives-producers-record-profits',
    title:
      '‘Eggflation’ Gives Producers Record Profits While Internet Mocks Outrageous Prices',
    seoTitle: '‘Eggflation’ Gives Producers Record Profits',
    date: '2022-12-16',
    // Written for the rebuild. Not from the source.
    excerpt:
      'Damian talked eggs with Straight Arrow News. Record 2022 egg prices handed producers record profits while the internet turned the grocery aisle into a meme.',
    author: 'Damian Mason',
    // Verbatim and complete. The two trailing spaces are a markdown hard line
    // break, standing in for the `<br>` that separated the two lines on the
    // live page.
    body: 'Damian featured in Straight Arrow News  \nBy Simone Del Rosario',
    heroImage: 'Screenshot-2023-04-19-at-11.40.07-AM.png',
    heroAlt: 'Straight Arrow News',
    sourceUrl:
      'https://straightarrownews.com/cc/eggflation-gives-producers-record-profits-while-internet-mocks-outrageous-prices/',
  },
  {
    slug: 'how-the-climate-crisis-is-causing-food-shortages-globally',
    title: 'How the Climate Crisis is Causing Food Shortages Globally',
    seoTitle: 'Climate Crisis and Global Food Shortages',
    date: '2023-04-19',
    // Written for the rebuild. Not from the source.
    excerpt:
      'Cheddar News called in April 2023 to ask how climate pressure turns into real food shortages. Damian took the question on camera. Watch the segment here.',
    author: 'Damian Mason',
    // Verbatim and complete. A whole Divi section, row, column and text module
    // were built to hold this one sentence.
    body: 'Damian Mason featured in Cheddar News',
    heroImage: 'Screenshot-2023-04-19-at-12.16.28-PM.png',
    heroAlt: 'Damian Mason on Cheddar News',
    // The segment itself. It lived on /blog-news/ as a YouTube embed while
    // this post showed only a still frame of it.
    sourceUrl: 'https://www.youtube.com/watch?v=5FUIE6Ks0Ok',
  },
];

/** Newest first, for the /blog/ index. */
export const postsByDate = (): Post[] =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const postBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.slug === slug);

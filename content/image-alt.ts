/**
 * ONE ALT STRING PER FILE.
 *
 * Every image that appears on more than one route resolves its alt text here.
 * A route may not retype a description for a file listed below, and a file
 * listed below may not have two descriptions.
 *
 * WHY. Round 1 reconciled three photographs by hand and the rest kept drifting.
 * By round 2, `/img/photos/portrait-black-suit.jpg` carried three different
 * descriptions on three routes, one of them naming a window that is not in the
 * frame and another calling a woven charcoal jacket a "dark suit jacket".
 * `/img/brand/the-granary.png` was "The Granary" on one route and "The Granary,
 * an XtremeAg show" on another. Hand-copied strings cannot be kept in sync, so
 * they are not hand-copied any more.
 *
 * THE PHOTOGRAPH STRINGS WERE WRITTEN AGAINST THE FILES, not against the copy
 * around them. Each one was opened and described.
 *
 * THE LOGO CONVENTION IS THE BRAND NAME, not a description of the artwork. A
 * mark's accessible name is what it identifies, so `xtreme-ag-transparent.png`
 * is "XtremeAg" and not "a green and blue bolt struck through a black X": a
 * screen-reader user needs the name of the company, and a sighted user is not
 * being told about the bolt either. Podcast cover art is named the same way,
 * with "Cover art for" in front of it because the page around it is about the
 * show and the picture is the artwork rather than the show itself.
 *
 * Single-route images are not in here. They have exactly one call site and
 * cannot diverge.
 */

export const imageAlt = {
  /* --- Photographs ---------------------------------------------------- */

  /** /, /boasg/, /speaking/. Charcoal woven jacket, open white collar, arms
   *  folded, leaning on a white door jamb. There is no window in the frame. */
  '/img/photos/portrait-black-suit.jpg':
    'Damian Mason with his arms folded, in a charcoal woven jacket and an open white collar, leaning against a white door jamb.',

  /** /about/, /meeting-coordinators/, /collaboration-opportunities/. */
  '/img/photos/portrait-dark-blazer.jpg':
    'Damian Mason in a charcoal blazer and jeans, one hand in a pocket, leaning against a whitewashed brick window frame.',

  /** /keynote/, /join-the-conversation/. The coat is a grey plaid. */
  '/img/photos/portrait-light-jacket.jpg':
    'Damian Mason in a grey plaid sport coat and open collar shirt, holding his reading glasses, outside a brick building.',

  /** /, /about/, /keynote/, /collaboration-opportunities/. He is photographed
   *  from behind, which two routes used to get wrong. */
  '/img/photos/speaking-to-audience.jpg':
    'Damian Mason, seen from behind in a tan sport coat, working a room of growers seated at long banquet tables, several of them grinning back at him.',

  /** /, /meeting-coordinators/. A hotel ballroom at round tables, Damian at the
   *  front in a tan sport coat beside a lit projection screen. */
  '/img/photos/breakout-session-audience.jpg':
    'Damian Mason in a tan sport coat speaking beside a lit projection screen to a hotel ballroom seated at round tables.',

  /** /keynote/, /speaking/. The lectern is named because it is in the frame and
   *  because /speaking/'s cutline turns on it. */
  '/img/photos/keynote-stage-podium.jpg':
    'Damian Mason on stage beside a lectern at the InSite CDM 2023 Winter Forum, one arm out toward the audience.',

  /** /acres-tv/, /meeting-coordinators/. Stock, and the alt says only what is
   *  in the frame. */
  '/img/photos/microphones-background.jpg':
    'Two studio microphones on boom stands in front of a dark stage.',

  /** /about/#books, /do-business-better-podcast/. Wiley and the Larry Winget
   *  foreword are both printed on the jacket. */
  '/img/photos/do-business-better-book-cover.png':
    'Cover of Do Business Better by Damian Mason, published by Wiley, with a foreword by Larry Winget.',

  /* --- Broadcast frames ------------------------------------------------ */
  /* Two frames that a blog post and a media row both carry, which is what put
     them in here. The burned-in headline is named in each string, because on
     these two the headline is the reason the frame is on the page at all. */

  /** /blog/, both post routes, /blog-news/. The kicker and the headline are
   *  Straight Arrow News's own, set into the broadcast graphic. */
  '/img/photos/news-interview-cal-maine.png':
    'Damian Mason and Simone Del Rosario in a two-box Straight Arrow News interview, both named on screen, under an EGGFLATION kicker and the headline CAL-MAINE SEES PROFIT INCREASE 165X.',

  /** /blog/, both post routes, /blog-news/. */
  '/img/photos/cheddar-news-food-supply.png':
    'Damian Mason on Cheddar News in a red polo, opposite an anchor in a New York studio, under the headline HOW MUCH OF THE U.S. FOOD SUPPLY IS AT RISK with a market ticker running below it.',

  /* --- Marks and cover art -------------------------------------------- */

  /** /the-business-of-agriculture/, /podcasts/. */
  '/img/brand/business-of-agriculture-podcast.jpg':
    'Cover art for The Business of Agriculture Podcast with Damian Mason.',

  /** /do-business-better-podcast/, /podcasts/. */
  '/img/brand/do-business-better-podcast.png':
    'Cover art for the Do Business Better podcast with Damian Mason.',

  /** /xtreme-ag/, /the-business-of-agriculture/. Brand name, not artwork. */
  '/img/brand/the-granary.png': 'The Granary',

  /** /xtreme-ag/, /podcasts/. Brand name, not artwork. */
  '/img/brand/xtreme-ag-transparent.png': 'XtremeAg',

  /** /the-business-of-agriculture/. Same brand, different file. */
  '/img/brand/xtreme-ag.jpg': 'XtremeAg',
} as const;

export type SharedImagePath = keyof typeof imageAlt;

/**
 * The description this object owns for `src`.
 *
 * A component that renders a path out of the content layer cannot know at the
 * type level whether that path is in here, so it asks. THIS THROWS rather than
 * returning undefined: every call site is a server component rendered at build
 * time, so a missing entry stops the build instead of shipping an image with
 * an empty alt, which is the failure mode this whole file exists to prevent.
 */
export function sharedImageAlt(src: string): string {
  const alt = (imageAlt as Record<string, string | undefined>)[src];
  if (!alt) {
    throw new Error(
      `No shared alt for ${src}. Either add it to content/image-alt.ts, or, if this is the file's only call site, pass the alt inline.`,
    );
  }
  return alt;
}

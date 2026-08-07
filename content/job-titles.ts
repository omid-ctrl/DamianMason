/**
 * The nine job titles, once.
 *
 * `_source/pages/keynote.md:180` and
 * `_source/pages/collaboration-opportunities.md:121` both carry the identical
 * H2, word for word:
 *
 *   "Damian Mason is a Businessman, Agriculturist, Speaker, Podcaster, Media
 *    Guest, Ag Personality, Influencer, Author, and Consultant."
 *
 * The rebuild hand-typed it three times and it drifted: /keynote/, the one
 * route whose own source file carries the full list, was rendering five of the
 * nine. Same root cause as the four credential pillars before they moved into
 * `content/credentials.ts`. The list lives here now and the routes import it,
 * so it cannot drift again.
 *
 * WHO RENDERS IT, AND WHY:
 *   /keynote/                      source-verbatim, keynote.md:180
 *   /collaboration-opportunities/  source-verbatim, collaboration-opportunities.md:121
 *
 * Two routes, both with their own source claim to the sentence, which is what
 * makes the repeat parity rather than a tic. /about/ rendered a third copy and
 * has no source page of its own, so it yielded: see the No. 01 heading there.
 * Do not add a fourth site.
 *
 * Capitalization: the source sets every title in title case because it is a
 * heading. Rendered mid-sentence the site sentence-cases all of them except
 * "Ag", which VOICE.md records as a proper noun Damian capitalizes.
 */

/** Title case, exactly as the two source headings set them. */
export const jobTitles = [
  'Businessman',
  'Agriculturist',
  'Speaker',
  'Podcaster',
  'Media Guest',
  'Ag Personality',
  'Influencer',
  'Author',
  'Consultant',
] as const;

/**
 * Sentence case for running prose. Every word lowercases except "Ag", which
 * VOICE.md section 3 records as a capitalization habit of Damian's own, backed
 * by 15 instances of capitalized Agriculture in the source corpus.
 */
export const jobTitlesLower: readonly string[] = jobTitles.map((title) =>
  title.toLowerCase().replace(/^ag\b/, 'Ag'),
);

/**
 * The whole list as one serial-comma sentence, with no leading subject, so a
 * route can put its own subject in front of it:
 *
 *   `Damian Mason is a ${jobTitleList()}.`
 */
export function jobTitleList(): string {
  const items = jobTitlesLower;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

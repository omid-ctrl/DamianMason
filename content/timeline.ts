/**
 * The dated record, for the spine on /about/.
 *
 * House style follows content/sponsors.ts: every entry traces to the file it
 * was harvested from, in a comment on the entry itself.
 *
 * THE POINT OF THIS FILE IS THAT `year` IS OPTIONAL.
 *
 * Nine things are worth putting on a career spine for this speaker. Grepped
 * across `_source/extracted/` and `_source/pages/`, exactly two of them carry a
 * year anywhere in the old site, and one more is a running total with no as-of
 * date on it:
 *
 *   1994   "I quit my Fortune 500 job in 1994 to pursue a life and business of
 *          my choice."                     do-business-better-podcast.txt:79
 *   2023   "Beginning in 2023 Damian titled the program The 'Ations' of
 *          Agriculture"                    _source/pages/keynote.md:88
 *   today  "over 2,400 audiences in all 50 states and 7 foreign countries",
 *          stated with no date attached    keynote.txt:116
 *
 * The Purdue degree, Second City, the Screen Actors Guild card, both books and
 * all three podcasts are undated in every file we hold. A search of the whole
 * extracted mirror turns up five years total: 1994, 2016 (a pixel dimension in
 * a JSON-LD blob), 1978 (a beer brand in an episode description), 2022 and 2023
 * (WordPress publish dates on the pages themselves, which date the CMS entry
 * and not the event).
 *
 * SO NOTHING HERE INVENTS A DATE. An undated entry has no `year`, gets no
 * position on the spine, and is named in the register underneath it instead.
 * The moment the client supplies a year, adding it to an entry promotes that
 * entry onto the spine with no change to any component. Logged for the client
 * as docs/OPEN-ITEMS.md item 23.
 *
 * A NOTE ON THE 2023 ENTRY. `_source/pages/keynote.md:88` reads "Beginning in
 * 2023" and `home.txt:143` reads "Beginning 2023". Same sentence, one of them
 * missing a word, which is a source typo and not two different claims.
 */

export type Milestone = {
  id: string;
  /**
   * Four digits, and present ONLY where a source states the year in words. It
   * is what the `<time datetime>` attribute carries, so an invented value would
   * be a machine-readable lie as well as a printed one.
   */
  year?: string;
  /**
   * The one entry that is a standing state rather than a dated event. It sits
   * at the end of the spine and prints "Today" on the rail. It deliberately
   * carries no `<time>`: the source states the total without ever saying as of
   * when, and a datetime attribute would supply that missing date.
   */
  standing?: boolean;
  title: string;
  detail: string;
  /**
   * The short form, used when an undated entry is named in the register. These
   * read as one sentence in series, so they are lower case and start with an
   * article where the sentence needs one.
   */
  short: string;
};

export const timeline: Milestone[] = [
  {
    /* `_source/extracted/do-business-better-podcast.txt:79`, his own words, in
       the first person, on the podcast page's opening paragraph. The same
       sentence is in that page's meta description and its JSON-LD. */
    id: 'quit',
    year: '1994',
    title: 'He quit the Fortune 500 job.',
    detail:
      'His words, still on the podcast page: I quit my Fortune 500 job in 1994 to pursue a life and business of my choice.',
    short: 'the year he quit',
  },
  {
    /* `_source/pages/keynote.md:88`, repeated in `home.txt:143` and
       `meeting-coordinators.txt:107`. The six subjects the name refers to are
       set out on /speaking/, which owns them, so this entry names the program
       and stops. */
    id: 'ations',
    year: '2023',
    title: 'The keynote got a name.',
    detail: 'He titled the program The “Ations” of Agriculture.',
    short: 'the year the keynote got its name',
  },
  {
    /* `_source/extracted/keynote.txt:116` for the count, `content/books.ts` for
       the two titles, `content/site.ts` for the three shows, and keynote.txt:117
       for the farm. The figures themselves are not restated here: the biography
       above this section carries the source sentence and the ledger below it
       carries the four glyphs, and a spine that repeats both is furniture. */
    id: 'today',
    standing: true,
    title: 'Still all of it at once.',
    detail: 'The stage, the two books, the three shows, and the farm. The podcast goes out on Mondays.',
    short: 'where it stands today',
  },

  /* ------------------------------------------------------------------------
     UNDATED. Everything below this line is true, sourced, and carries no year
     in any file we hold. Do not add one to make the spine look fuller.
     ------------------------------------------------------------------------ */
  {
    /* `_source/extracted/keynote.txt:117` and the credential bar at
       keynote.txt:66. Neither states a graduation year. */
    id: 'purdue',
    title: 'Purdue University.',
    detail: 'A degree in Agriculture Economics.',
    short: 'the Purdue degree',
  },
  {
    /* `_source/extracted/keynote.txt:117`: "He studied comedy writing and
       improvisation at The Second City – Chicago". No year, and no indication
       whether it came before or after the Fortune 500 job. */
    id: 'second-city',
    title: 'The Second City, Chicago.',
    detail: 'Comedy writing and improvisation.',
    short: 'Second City',
  },
  {
    /* `_source/extracted/keynote.txt:117`, same sentence. Membership is stated
       in the present tense and never dated. */
    id: 'sag',
    title: 'The Screen Actors Guild.',
    detail: 'He carries the card.',
    short: 'the Guild card',
  },
  {
    /* `content/books.ts`, harvested from the retired WooCommerce product page
       at `_source/extracted/product__food-fear-*.txt`. No publication date
       appears on that page, in its JSON-LD, or anywhere else in the mirror. */
    id: 'food-fear',
    title: 'Food Fear.',
    detail: 'The book about what fear did to dinner.',
    short: 'Food Fear',
  },
  {
    /* `content/books.ts`, from
       `_source/extracted/product__do-business-better-*.txt`. Undated, and its
       description also stops mid-word on the old site: docs/OPEN-ITEMS.md
       item 8. */
    id: 'do-business-better',
    title: 'Do Business Better.',
    detail: 'The book about success on your own terms.',
    short: 'Do Business Better',
  },
  {
    /* `content/site.ts` and /podcasts/. The Business of Agriculture, Do
       Business Better, and Cutting the Curve with XtremeAg. The old site gave
       no launch date for any of the three: the only dates near them are
       WordPress publish stamps on the pages that describe them. */
    id: 'podcasts',
    title: 'Three podcasts.',
    detail: 'He hosts all three.',
    short: 'all three podcasts',
  },
];

/** The spine. Dated events in order, then the standing entry that closes it. */
export const datedMilestones: Milestone[] = timeline.filter(
  (entry) => entry.year !== undefined || entry.standing === true,
);

/** The register. Everything the record leaves without a year. */
export const undatedMilestones: Milestone[] = timeline.filter(
  (entry) => entry.year === undefined && entry.standing !== true,
);

/* A spine with no dated entry left on it is not a spine, and an empty register
   would mean somebody had quietly dated the six. Either is a content error
   worth failing a build over rather than rendering an empty rule. */
if (datedMilestones.length === 0) {
  throw new Error('content/timeline.ts: the spine has no dated entries left on it.');
}

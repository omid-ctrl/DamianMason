/**
 * The four-pillar credential bar.
 *
 * Source: `_source/pages/keynote.md` section 2, verbatim, including the Title
 * Case and the numeral in "3 Decades of Business Ownership". VOICE.md section 3
 * records the capitalization as a real habit, so it is reproduced rather than
 * normalized.
 *
 * WHY THIS FILE EXISTS. The same list was hand-copied inline into
 * `app/keynote/page.tsx` and `app/about/page.tsx`, and the two copies drifted:
 * /keynote/ recased every bullet and spelled the numeral out, so a visitor one
 * nav click away read the same eight bullets set two different ways. One
 * definition, two consumers, no drift.
 *
 * NOT IN HERE: the list on `/collaboration-opportunities/`
 * (INFORMED / PROFESSIONAL / HILARIOUS / RELATABLE). That is a genuinely
 * different list on the old site, verbatim from
 * `_source/pages/collaboration-opportunities.md` section 5, and it stays where
 * it is. Do not fold it in.
 */

export type CredentialPillar = {
  title: string;
  items: string[];
};

/** The source bar, exactly as `/keynote/` rendered it. */
export const credentialPillars: CredentialPillar[] = [
  {
    title: 'Knowledgeable',
    items: ['Degree in Ag Econ from Purdue University', 'Educated on Current Events'],
  },
  {
    title: 'Professional',
    items: ['Corporate Background', 'Author', 'Podcast Host'],
  },
  {
    title: 'Exceptionally funny',
    items: ['Professional Comedian', 'Studied at Second City in Chicago'],
  },
  {
    title: 'Relatable',
    items: ['Farm Raised', 'Farm Owner', '3 Decades of Business Ownership'],
  },
];

/**
 * The same bar with one addition for `/about/`: "Member of the Screen Actors
 * Guild", which the keynote bio paragraph states in running text and which
 * belongs with the professional credentials. /about/ is the page that owns the
 * biography, so it is the page that gets the extra bullet.
 */
export const aboutCredentialPillars: CredentialPillar[] = credentialPillars.map((pillar) =>
  pillar.title === 'Professional'
    ? { ...pillar, items: [...pillar.items, 'Member of the Screen Actors Guild'] }
    : pillar,
);

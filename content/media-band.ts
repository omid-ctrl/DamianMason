/**
 * The "leading voice" closing band, shared by `/acres-tv/` and `/xtreme-ag/`.
 *
 * Section 4 of `_source/pages/acres-tv.md` and section 4 of
 * `_source/pages/xtreme-ag.md` are byte-identical on the old site, and so is
 * the mailing-list button in section 5 of both. The rebuild hand-copied all of
 * it into two route files and the two copies drifted: /acres-tv/ sentence-cased
 * the eyebrow and the button label and shortened the mailing-list label, so a
 * client clicking between the two Media pages met the same closing band worded
 * three ways.
 *
 * The strings below are the source rendering, which is Title Case with the
 * ampersand. Two normalizations are carried over from the route comments and
 * are the only edits: the source H4 had a no-break space plus a regular space
 * after "As a", set here as one space; and the source button read "Click Here
 * to Inquire About Working With Damian", where "Click Here" is not link text,
 * so the verb leads.
 *
 * If a third route wants this band, it imports from here. Do not retype it.
 */

export const mediaBand = {
  eyebrow:
    'As a Leading Voice in the Industry, Damian is Sought After for Conversations & Commentary on Hot Topics',
  heading: 'If it’s Agriculture, it Needs Damian.',
  inquireLabel: 'Inquire About Working With Damian',
  /** Source section 5 of both pages, the same button on both. */
  mailingListLabel: 'Sign Up for Damian’s Mailing List',
} as const;

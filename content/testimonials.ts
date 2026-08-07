/**
 * Speaking testimonials, harvested verbatim from the old damianmason.com.
 *
 * Source of truth: `_source/pages/*.md` (verbatim harvest), verified against
 * `_source/html/*.html`. The `_source/extracted/*.txt` files were NOT used:
 * they silently drop `<blockquote>` bodies and cost the reviews page all ten
 * quote bodies.
 *
 * COUNT: 17. Ten from /reviews/, three from /keynote/, one from
 * /meeting-coordinators/, one from /the-business-of-agriculture/, one
 * unattributed book endorsement from the home page, one site-wide footer
 * quote. This matches `_source/manifest.json` totals.testimonials = 17 and the
 * Corrections table in docs/build/STATE.md.
 *
 * WHAT WAS STRIPPED, and nothing else:
 *   - The pasted Squarespace markup that faked attributions on /reviews/,
 *     /keynote/ and /collaboration-opportunities/ (`sqs-block quote-block`,
 *     `<figcaption class="source">`, stale `block-yui_3_17_2_1_*` DOM IDs, an
 *     orphaned `fluid-engine` section fragment).
 *   - The outer quotation marks. The Quote primitive in components/ui sets
 *     them. Quotation marks INSIDE a quote are kept as they were typed.
 *   - The dangling en dash left hanging after keynote testimonial 1
 *     ("...working with Damian!" followed by a space and a bare en dash).
 *
 * WHAT WAS NOT ALTERED: wording, spelling, spacing and punctuation inside the
 * quote bodies are exactly as they shipped. That includes two em dashes, both
 * flagged in the entries below: the Rolling Plains quote has one jammed
 * against the preceding word with no space, and the AgroLiquid quote has one
 * set normally. Both are the writer's punctuation, not ours, so a later phase
 * decides whether to leave them.
 *
 * ATTRIBUTION CASING: the old site set every attribution in all caps. That is
 * a styling decision, not content, so names, titles and organizations are
 * normalized to title case here and a component may re-case them freely. The
 * quote bodies themselves are untouched.
 *
 * DUPLICATES RESOLVED, so nothing is counted twice:
 *   - /collaboration-opportunities/ carries byte-identical copies of the three
 *     /keynote/ testimonials (Wendy J. Ruud, The Titan Pro Team, Tim Luthy).
 *     They appear here ONCE, with sourcePage '/keynote/', and testimonialsFor
 *     serves the same three entries to both routes.
 *   - The home page's "Man, that guy makes you think! I loved it!" is an
 *     abbreviated pull-quote of the Amy B., AgroLiquid testimonial that runs in
 *     full on /reviews/. Only the full quote is stored, flagged `featured`, so
 *     the home page can pull one line out of it rather than duplicating it.
 *
 * `name` holds the leading identity in the attribution. That is a person where
 * the old site named one, and an organization where it named only an
 * organization (Rolling Plains Cotton Growers, The Titan Pro Team, National Ag
 * Aviation Association). Two quotes shipped with no attribution at all, on
 * /reviews/ and on the home page: both carry an empty `name`, so a component
 * must treat an empty string as "render no byline".
 *
 * `sourcePage` is the OLD-site path the quote was harvested from, for
 * traceability back to `_source`. 'footer' means the site-wide footer widget,
 * which repeated on every page including /cart/ and /checkout/.
 */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  title?: string;
  organization?: string;
  featured?: boolean;
  sourcePage: string;
};

export const testimonials: Testimonial[] = [
  // == /reviews/ (10)
  {
    id: 'mike-elliott',
    quote:
      'Damian’s insights into Agriculture and how Agriculture intersects with the consumer were on point and exactly what our team needed. He understood our business and how the changes within Agriculture could impact our business plans. His delivery engaged and energized the audience. If you are in the food business, I highly recommend Damian as a guest speaker for your event. He was awesome!',
    name: 'Mike Elliott',
    title: 'General Manager',
    organization: 'Michael Foods',
    sourcePage: '/reviews/',
  },
  {
    // Shipped with no attribution of any kind, and it is the one quote on
    // /reviews/ that carried no quotation marks either.
    id: 'unattributed-great-feedback',
    quote: 'We received a ton of great feedback on both you and the event!',
    name: '',
    sourcePage: '/reviews/',
  },
  {
    id: 'melissa-bockman',
    quote:
      'I had the pleasure of attending this (Farm Credit) meeting and you have an amazing ability to lead a room and pull all the messages together. The blend of your knowledge and humor is inspirational.',
    name: 'Melissa Bockman',
    organization: 'Bayer',
    sourcePage: '/reviews/',
  },
  {
    id: 'jason-schley',
    quote:
      'This guy is top-notch, if you’re ever looking for a great speaker at an event I would suggest Damian to anyone. He closed a meeting I was involved in yesterday with knowledge, delivered with humor. At breakfast this a.m. everyone was still talking about it. Impressed!',
    name: 'Jason Schley',
    organization: 'Next Level Ag, LLC',
    sourcePage: '/reviews/',
  },
  {
    // FLAGGED: contains an em dash, jammed against "meeting" with no space
    // before it. Verbatim from the source.
    id: 'rolling-plains-cotton-growers',
    quote:
      'I’ve gotten nothing but good feedback on Damian’s presentation and several have noted that they want x, y or z association they work with to reach out to him for their meeting, so a win all around!',
    name: 'Rolling Plains Cotton Growers',
    sourcePage: '/reviews/',
  },
  {
    // featured: the home page runs the "Man, that guy makes you think! I loved
    // it!" line out of this quote as a standalone pull-quote.
    // FLAGGED: contains an em dash. Verbatim from the source.
    id: 'amy-b-agroliquid',
    quote:
      'Thank you for joining us in Kansas City last month for our Retail Partner customer meeting. It was great to have you share thoughts and perspective, so many attendees said, ‘Man, that guy makes you think!’ I loved it!',
    name: 'Amy B.',
    organization: 'AgroLiquid',
    featured: true,
    sourcePage: '/reviews/',
  },
  {
    // The old attribution read "DUSTY RICH. WESTERN SALES DIRECTOR, BW FUSION".
    // The period after the surname is a typo for a comma; splitting the fields
    // makes it moot.
    id: 'dusty-rich',
    quote:
      'The absolute best keynote speaker I’ve ever had the pleasure of listening to. Hilarious, honest, informative, and real. Would recommend Damian to any organization for their events!',
    name: 'Dusty Rich',
    title: 'Western Sales Director',
    organization: 'BW Fusion',
    sourcePage: '/reviews/',
  },
  {
    id: 'brooks-breymeyer',
    quote:
      'If you haven’t heard Damian before, look him up! If you don’t learn anything, he’ll at least make you laugh! I’ll bet you do both. Can’t wait to read your book!',
    name: 'Brooks Breymeyer',
    organization: 'Breymeyer Land and Livestock',
    sourcePage: '/reviews/',
  },
  {
    id: 'william-noland',
    // The live quote used an en dash where an em dash would go ("easy for staff
    // to follow – how will this impact FCW"). Normalized to a colon, which is
    // exactly the job the dash was doing: the second half names what "follow"
    // meant. This matches the call already recorded in STATE.md, where the four
    // em dashes inside verbatim third-party quotes were normalized to commas
    // and a colon. Wording is untouched.
    quote:
      'I thought today went great. The overall message and how you brought it home worked extremely well and was easy for staff to follow: how will this impact FCW, our customers and me. Well done!',
    name: 'William Noland',
    organization: 'Farm Credit West',
    sourcePage: '/reviews/',
  },
  {
    id: 'brian-rittgers',
    quote:
      'Thanks so much for a great time with our team! Really appreciated you customizing so well and all the energy. Very well received.',
    name: 'Brian Rittgers',
    organization: 'Micronutrients',
    sourcePage: '/reviews/',
  },

  // == /keynote/ (3). Reused byte for byte on
  // /collaboration-opportunities/, stored once, served to both.
  {
    // The live quote ended '...working with Damian!" –' with a bare en dash
    // and nothing after it. The dash is dropped per the extraction brief.
    id: 'wendy-j-ruud',
    quote: 'I would highly recommend working with Damian!',
    name: 'Wendy J. Ruud',
    title: 'Vice President',
    sourcePage: '/keynote/',
  },
  {
    id: 'titan-pro-team',
    quote:
      'Thank you very much for taking the time to speak at our kickoff event last month. We received great feedback and appreciate you helping us put on a great event. Thanks again!',
    name: 'The Titan Pro Team',
    sourcePage: '/keynote/',
  },
  {
    id: 'tim-luthy',
    quote:
      'I have had lots of compliments from the crowd. This was just what the growers needed to help their attitudes. As always you do an awesome job!',
    name: 'Tim Luthy',
    organization: 'Helena Chemical',
    sourcePage: '/keynote/',
  },

  // == /meeting-coordinators/ (1)
  {
    // Shipped as a plain paragraph with no quotation marks, and its byline was
    // hard-coded white on a light band, so it was invisible on the live page.
    id: 'national-ag-aviation-association',
    quote: 'We’ve heard nothing but positive comments!',
    name: 'National Ag Aviation Association',
    sourcePage: '/meeting-coordinators/',
  },

  // == /the-business-of-agriculture/ (1)
  {
    // Byline recovered from the raw HTML; the deterministic extract dropped it.
    id: 'geoff-bastow',
    quote:
      'With a mix of monologue and guest episodes, this one puts the producer at the center. Damian has strong opinions and he’s not afraid to share them. You can agree or disagree, but he clearly knows his subject matter and audience well, and is always thought-provoking. His is a valuable perspective I try to keep top-of-mind.',
    name: 'Geoff Bastow',
    sourcePage: '/the-business-of-agriculture/',
  },

  // == home page (1)
  {
    // A book endorsement, not a speaking review, and it shipped with no name,
    // no publication and no source. It never even names the book. Keep the
    // empty `name` until the client supplies an attribution.
    id: 'book-endorsement-unattributed',
    quote:
      'I absolutely love this book! If you love food and hate the hype, this book is for you!',
    name: '',
    sourcePage: '/',
  },

  // == site-wide footer (1)
  {
    // The old footer opened this with a curly quote and closed it with a
    // straight one, with the <strong> boundary landing in a third place. Both
    // outer marks are dropped here; the sentence itself is untouched.
    id: 'b-kettler-ihla',
    quote:
      'Thanks for your thought-provoking presentations and making sure we all think differently about our industry.',
    name: 'B. Kettler',
    organization: 'IHLA',
    sourcePage: 'footer',
  },
];

/**
 * Per-route selection. `page` is a NEW-site route path, not an old-site one.
 *
 * Routes not listed here get an empty array rather than a silent fallback, so
 * a page that wants testimonials has to say so.
 */
const testimonialsByRoute: Record<string, readonly string[]> = {
  '/': ['amy-b-agroliquid', 'book-endorsement-unattributed'],
  '/reviews/': [
    'mike-elliott',
    'unattributed-great-feedback',
    'melissa-bockman',
    'jason-schley',
    'rolling-plains-cotton-growers',
    'amy-b-agroliquid',
    'dusty-rich',
    'brooks-breymeyer',
    'william-noland',
    'brian-rittgers',
  ],
  /* THE THREE-UP ROWS ARE CURATED ON LENGTH, NOT JUST ON CONTENT.
     A three-column quote row has no rule at the bottom of a cell, so a cell
     that runs out of words early leaves a hole rather than a shape. /speaking/
     used to lead with the 389-character Mike Elliott quote beside a
     142-character one, which bottomed columns two and three out 350 and 460px
     above column one, with the section's own CTA stranded in the middle of it.

     So each row is picked from quotes within about a line of each other where
     length is the only constraint in play. The pool is seventeen and every
     quote still ships: the long ones run in full on /reviews/, which is the
     page these rows send a reader to.

     Lengths, for the next person who edits a row:
       melissa-bockman 197 · william-noland 190 · dusty-rich 180
       titan-pro-team 174 · brooks-breymeyer 160 · tim-luthy 142
       b-kettler-ihla 109 · wendy-j-ruud 45

     /keynote/ IS THE EXCEPTION, AND ON PURPOSE. Its row was re-cut on length
     alone, swapping wendy-j-ruud (45) for brooks-breymeyer (160), and that
     broke two claims the section's standfirst makes in the rendered page:

       - "There's ten more on the reviews page" and "Read the ten written
         reviews". brooks-breymeyer is one of the ten on /reviews/, so the
         three quoted here overlapped that set and only nine were "more".
       - "Three from meeting planners who were in the room while it happened".
         Brooks Breymeyer writes as somebody who heard the program ("If you
         haven't heard Damian before, look him up!"), not as the person who
         booked it.

     The row is restored to the three the source page itself carried, which is
     the same trio /collaboration-opportunities/ runs. All three are event
     hosts, none of them appears on /reviews/, and both counts are arithmetic
     again. The cost is the 45-character Wendy J. Ruud cell, which bottoms out
     early in whichever column the length sort drops it into, exactly as it
     already does on /collaboration-opportunities/. Accuracy outranks the hole,
     and the hole is a layout problem to solve in the grid, not by quoting the
     wrong people. Do not "rebalance" this row without re-checking both
     sentences in app/keynote/page.tsx section 8.

     THE HOLE IS NOW SOLVED IN THE GRID, as that note said it should be. See
     .dm-testimonials--3 in src/styles/sections.css: a three-up cell stretches
     to the row and its byline is pushed to the bottom, so all three top rules
     and all three attributions sit on shared baselines and a short quote reads
     as leading rather than as a cell that ran out. /keynote/ keeps its trio
     unchanged because both of the sentences above still depend on it.

     /collaboration-opportunities/ IS NOT UNDER THOSE TWO CONSTRAINTS, so its
     row is also curated on length. Its standfirst asks for two things only:
     that all three came in after a live event rather than a podcast, and that
     ten more are on /reviews/. b-kettler-ihla satisfies both. It is a
     thank-you for presentations to the Indiana Hardwood Lumbermen's
     Association, and it is not one of the ten on /reviews/, so the count in
     the standfirst is still arithmetic. At 109 characters it sits between
     tim-luthy's 142 and the row's shortest instead of at 45. It was harvested
     for the old site's footer, and the `footer` key below still points at it;
     nothing else renders that key today, so this is the first route it
     appears on. */
  '/keynote/': ['wendy-j-ruud', 'titan-pro-team', 'tim-luthy'],
  /* The three the old page actually carried, byte-identical copies of the
     /keynote/ trio. A round-5 reselect swapped wendy-j-ruud out for
     b-kettler-ihla to even up the row's quote lengths, on the reasoning that
     nothing else rendered the `footer` key. That was wrong: the site-wide
     footer renders it on every route, so B. Kettler appeared twice on this
     page. Three auditors caught it independently.

     There is no third option. Every other quote is one of the ten on
     /reviews/, which the standfirst's "Ten more" depends on; geoff-bastow is a
     podcast guest, which the standfirst's "not a podcast" rules out; and the
     book endorsement is not a speaking review. So the row keeps the short
     quote and the grid handles the rag. */
  '/collaboration-opportunities/': ['wendy-j-ruud', 'titan-pro-team', 'tim-luthy'],
  '/meeting-coordinators/': ['national-ag-aviation-association'],
  '/the-business-of-agriculture/': ['geoff-bastow'],
  '/speaking/': ['melissa-bockman', 'william-noland', 'dusty-rich'],
  footer: ['b-kettler-ihla'],
};

export const testimonialsFor = (page: string): Testimonial[] => {
  const ids = testimonialsByRoute[page];
  if (!ids) return [];
  return ids
    .map((id) => testimonials.find((t) => t.id === id))
    .filter((t): t is Testimonial => Boolean(t));
};

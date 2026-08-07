# Open items for the client

Everything on this list is a question the rebuild could not answer from the
source harvest, or a decision the rebuild made and the client is entitled to
overturn. Nothing here blocks launch. Each item names the file to change.

Started during the copy and parity QA pass. Append, do not renumber.

---

## 1. Sponsor URLs, six of ten

`content/sponsors.ts`

Four sponsor URLs came from the client: Heads Up Plant Protectants, Tidal Grow,
Nano-Yield, Good Agriculture. The old `/the-business-of-agriculture/` page named
only those four. The other six logos arrived as image files with no URL, and the
build matched each one to a live official site by company name and business
line:

| Sponsor | URL used | How it was matched |
|---|---|---|
| AgView Solutions | `https://agviewsolutions.com` | farm transition planning, Rowley Iowa |
| EarthOptics | `https://earthoptics.com` | soil data mapping, Minneapolis |
| Harvest Returns | `https://www.harvestreturns.com` | agriculture investment platform, Fort Worth |
| Life Scientific | `https://lifescientific.com` | crop protection, Dublin |
| NewFields Ag | `https://newfieldsag.com` | liquid biologicals and seed treatments, Grand Mound Iowa |
| Redox Bio | `https://redoxgrows.com` | plant bio-nutrition, Burley Idaho |

**Ask the client to confirm all six**, because only they know which company each
supplied logo belongs to.

Note on Harvest Returns: the apex domain `harvestreturns.com` has no DNS A
record and does not resolve. The `www` host does. The `www` URL is what ships.
If the client supplies a different Harvest Returns entity, this one changes.

## 2. The inquiry form is gone, site-wide

`app/collaboration-opportunities/page.tsx`, `app/contact-us/page.tsx`

Source section 7 of `/collaboration-opportunities/` carried a Divi form with
four fields: Email, Full Name, Phone, Message. It POSTed to a WordPress nonce
endpoint. This build has no server and no form service, so that backend does not
exist and a re-drawn copy of the form would submit nowhere.

**Decision taken: lead capture is mailto-only.** The collaboration page closes
on "Contact Damian" and "Email the office". `/contact-us/` No. 02 spells out the
five lines to put in a first email, which is the Message field's job done in
prose. Nothing on the site now takes a typed message.

The only `<form>` elements on the site are the Mailchimp newsletter signups on
`/contact-us/` and `/join-the-conversation/`. Those are subscription, not
inquiry.

**If the client wants a real inquiry form back**, it needs a hosted form
endpoint (Formspree, Basin, a Vercel function, or the Mailchimp equivalent).
That is a decision about a service and a cost, not a markup change.

## 3. The one FAQ answer that points at a document nobody can reach

`content/faq.ts`, item `technology-requirements`

The answer is verbatim: "Refer to Damian's AV/and Room Setup Requirements." That
document is not linked anywhere on the old site and does not exist anywhere on
the new one, so a meeting planner following the instruction has nowhere to go.
It is the only answer on the site that asks the reader to do something
impossible.

**Two ways out.** Send the AV one-sheet and it gets linked from the answer. Or
approve the reword: "Damian's office will send the AV and room setup
requirements with the contract." `/meeting-coordinators/` already says the same
thing in its own words, so the second option is consistent.

## 4. Foreign countries: 7 or 8

`app/about/page.tsx`, plus every route carrying the figure

The old `/boasg/` biography said "in all 50 states, 8 foreign countries and in
every segment of Ag", verbatim. Every other page on the old site said 7. The
rebuild normalized to 7 on frequency and on recency: `/keynote/` carried
`article:modified_time 2024-08-05` against boasg's 2023-08-01.

**This was a build-time decision on a verbatim biography and the client should
confirm it.** If the real count is 8, one string on `/about/` and every other 7
on the site move together.

## 5. Two different 40,000s

`app/join-the-conversation/page.tsx`, `components/layout` footer, `content/site.ts`

Both figures are in the harvest and they are not obviously the same people:

- "his weekly audience of more than 40,000 subscribers" (`join-mailing-list.md:23`)
- "more than 40,000 listeners per month" (`collaboration-opportunities.md:38`)

The rebuild scopes them per route so no page shows both. What that costs, and
where each figure now lives:

- **Subscribers, 40,000.** `/join-the-conversation/` only: the hero deck, the
  stat panel, and that route's meta description. It is the page that owns the
  list.
- **Listeners, 40,000 a month.** The podcast, speaking and collaboration routes,
  plus the four-figure credibility ledger in `components/sections/StatRow.tsx`,
  which renders on `/`, `/about/`, `/keynote/` and `/speaking/`.
- **The site-wide footer carries neither.** It used to say "More than 40,000
  subscribers get Damian's read on..." and it renders on all 19 routes, so the
  subscriber figure was landing on every page that already stated the listener
  figure. Six routes were showing both meanings of one number to the same
  reader. The footer now makes the same pitch without a figure: "Damian's read
  on the business of food, fuel, and fiber, plus a note when a new episode
  posts." If the two 40,000s turn out to be one number, the figure can go back
  into the footer.

**Are the mailing list subscribers and the monthly podcast listeners the same
40,000 people?** If they are, the site should say so once and stop counting it
twice, and the footer gets its number back. If they are not, the current
scoping stands and only the client can say which is which. Neither figure has a
source in the old site beyond the sentences above.

## 6. The Granary: what is the show?

`app/xtreme-ag/page.tsx`, section 4

Net-new copy. Nothing about The Granary exists on the old `/xtreme-ag/` or
anywhere else in the mirror except one cross-promo link on
`/the-business-of-agriculture/`. Three facts are known and the copy is written
from exactly those three: it is filmed with XtremeAg, it is filmed in a granary
turned tavern on Damian's Indiana farm, and it lives at
`xtremeag.farm/the-granary`.

What ships is those three facts, one dry line about the room, and a
second-person turn ("If you haven't seen it, that's where to start.") that
claims nothing. An earlier draft said the show was where "growers say it out
loud" about "what a top operation actually does". Both of those are assertions
about format and subject that no source supports, and they are gone. The
cross-promo card on `/the-business-of-agriculture/` said "filmed with the
XtremeAg crew"; nothing says a crew exists, so it now matches this page.

**We need one sentence on the format from the client.** The reader currently
learns the room and not the programme.

## 7. Professional photography

`app/xtreme-ag/page.tsx` Fig. 02, and PLAN.md item 4

`/img/photos/xtremeag-cornfield-team.png` is a frame grab off an XtremeAg
broadcast, not a photograph. It carries a burned-in "DAMIAN MASON / CUTTING THE
CURVE PODCAST" lower third in the bottom right. It ships because it is the only
asset on file of Damian with the XtremeAg growers.

**Either crop out the lower third or supply a real photograph.** This belongs
with the standing professional-photography item.

## 8. Playback left the site on /do-business-better-podcast/

`app/do-business-better-podcast/page.tsx`

The source page had a native `<audio>` element playing episode 144 from a 33MB
self-hosted MP3. The MP3 is not carried over: the show's own host serves it and
33MB in the deploy bundle for one episode is not a trade worth making.

**Nothing replaces it in place.** Every listen on this route now leaves for
SoundCloud. This is the site's only deliberate functional reduction. A
facade-loaded SoundCloud oEmbed player, built the same way `VideoEmbed` is,
would restore playback without the download. Say the word.

## 9. Testimonials: /reviews/ holds ten of thirteen

`app/reviews/page.tsx`, `content/testimonials.ts`

Three written testimonials are quoted only on `/keynote/`, `/speaking/` and
`/collaboration-opportunities/` and appear nowhere on `/reviews/`: Wendy J. Ruud
(Vice President), The Titan Pro Team, and Tim Luthy (Helena Chemical). The
cross-route link labels were changed to "Read the ten written reviews" so
nothing implies `/reviews/` is the complete set.

**If the client wants one page with every testimonial on it**, the three move
onto `/reviews/` and its deck goes from ten to thirteen.

## 10. Captions on the three demo reels

`content/videos.ts`, `public/video/`

Carried from the accessibility pass. All three self-hosted MP4s render with zero
text tracks, which fails WCAG SC 1.2.2 Captions (Level A). `VideoEmbed` already
accepts a captions prop, so this is a transcription job, not a code gap. It is
the only known WCAG failure on the site.

## 11. Photograph identification

`app/page.tsx` Fig. 03, `app/meeting-coordinators/page.tsx` Fig. 03

`/img/photos/breakout-session-audience.jpg` is captioned on both routes as a
breakout session. Nothing in `_source/pages/*.md` identifies it. It is a hotel
ballroom with the audience at round banquet tables and Damian at the front
beside a projection screen, which the cutlines now describe as "at rounds".

**Confirm it is a breakout and not a general session.** If it is a general
session both cutlines change.

## 12. The Food Fear audiobook has no copy of its own

`content/books.ts`, `app/about/page.tsx` (`FORMAT_NOTE`)

The old audiobook product page pasted the paperback's description in word for
word. It never says "audiobook" anywhere in the body, and it names no narrator,
no runtime, and no retailer. Its own harvest note records the defect: "It says
'Food Fear:' not 'Food Fear (Audiobook)', and never mentions audio, narrator,
runtime, or format. A shopper cannot tell what they are buying."

On the old site that did not show, because the two descriptions lived on two
separate WooCommerce URLs. On `/about/#books` the two entries are one card
apart, so the same 55-word paragraph was printing twice inside one scroll.

**Decision taken: the audiobook keeps its own card and loses the borrowed
paragraph.** `content/books.ts` is untouched and still holds the verbatim
description, because that is where the parity obligation sits. The route renders
a one-line note in its place: "The same book as the print edition above, read
aloud." Nothing was invented to fill the space.

**Send one line of audiobook copy and it goes straight in.** The three facts
worth having are the narrator, the runtime, and where it is sold. Any of them is
enough to replace the note. If the client would rather the audiobook stop being
its own entry, it collapses into a second format label on the print edition and
the section heading drops from "Two books and an audiobook" to "Two books".

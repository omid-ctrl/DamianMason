import Image from 'next/image';
import type { Metadata } from 'next';

import { Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { CredentialBar } from '@/components/sections/CredentialBar';
import { StatRow } from '@/components/sections/StatRow';
import { Timeline } from '@/components/sections/Timeline';
import type { SectionActions } from '@/components/sections/types';
import { JsonLd } from '@/components/seo';
import { books } from '@/content/books';
import { aboutCredentialPillars } from '@/content/credentials';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

export const metadata: Metadata = buildMetadata({
  title: 'Ag Economist, Comedian, Farm Owner',
  description:
    // Not the Home deck. That line ("Purdue Ag Econ degree. Second City
    // Chicago...") belongs to /, and it used to run here too.
    //
    // Nor a table of contents. The version this replaces opened "The
    // biography, the four credentials, and the books", which named this page's
    // own section list in the SERP snippet. A description is read by someone
    // who has not seen the page, so it has to be about Damian.
    'Ag economist, comedian, and Indiana farm owner. Damian Mason has told Agriculture the truth about itself since 1994, with 2,400 audiences behind him.',
  path: '/about/',
  type: 'profile',
});

/* ==========================================================================
   Content
   Every string below is harvested from the old site. Sources, in order:
     bio prose        _source/pages/keynote.md section 7 and
                      _source/pages/boasg.md section 2
     credentials      _source/pages/keynote.md section 2, the four-pillar bar
     books            content/books.ts, which is verbatim from the retired
                      product pages
   Nothing here is invented biography.
   ========================================================================== */

const HERO_ACTIONS: SectionActions = [
  { label: 'Check your event date', href: '/contact-us/' },
  { label: 'See the keynote program', href: '/keynote/', variant: 'secondary' },
];

const CLOSING_ACTIONS: SectionActions = [
  { label: 'Book Damian', href: '/contact-us/' },
  { label: 'Hear the podcast', href: '/podcasts/', variant: 'secondary' },
];

/**
 * The four-pillar credential bar from `/keynote/`, verbatim, plus one addition
 * this route owns: "Member of the Screen Actors Guild", which is stated in the
 * keynote bio paragraph and belongs with the professional credentials rather
 * than buried in running text. Both renderings now come out of
 * `content/credentials.ts` so /keynote/ and /about/ cannot drift apart again.
 */
const PILLARS = aboutCredentialPillars;

/**
 * Cover art. `content/books.ts` stores the original `_source/media/` filenames,
 * so the route maps each title to the normalized copy that actually ships in
 * `public/img/photos/`, and supplies the alt text the old product pages never
 * had. Every cover file is 1200 by 1200.
 */
const COVERS: Record<string, { src: string; alt: string }> = {
  'food-fear': {
    src: '/img/photos/food-fear-book-cover.png',
    alt: 'Cover of Food Fear by Damian Mason: a tomato held in an open palm, casting the shadow of a monster.',
  },
  'food-fear-audiobook': {
    src: '/img/photos/food-fear-audiobook-cover.png',
    alt: 'Cover of the Food Fear audiobook, the print cover marked with a headphones and open book symbol.',
  },
  'do-business-better': {
    src: '/img/photos/do-business-better-book-cover.png',
    alt: imageAlt['/img/photos/do-business-better-book-cover.png'],
  },
};

const FORMAT_LABEL: Record<string, string> = {
  paperback: 'Print edition',
  audiobook: 'Audiobook',
};

/**
 * Which entries in `content/books.ts` get a card of their own.
 *
 * TWO CARDS FOR THREE ENTRIES, AND WHY. Food Fear ships in print and in audio
 * and the old site sold them as two WooCommerce products, so the harvest holds
 * two entries with the same title, the same subtitle and byte-identical
 * descriptions: the audiobook product page pasted the print edition's copy in
 * word for word and never mentioned audio.
 *
 * Rendering both as peers cost this shelf either a duplicated 55-word paragraph
 * or a two-line stub under a 350px cover, and it had both in successive rounds.
 * The stub left column two bottoming out 260px above its neighbours with no
 * rule to justify the rag.
 *
 * So Food Fear is one card that names both formats, which is what it is: one
 * book, two ways to take it in. `content/books.ts` stays verbatim, which is
 * where the parity obligation sits; the choice about what to render is made
 * here. Both jackets still ship, side by side in the card's cover slot, so the
 * audiobook art the client supplied is on the page and a reader can see at a
 * glance that there are two editions.
 *
 * Narrator, runtime and retailer are unknown for the audio edition. They are
 * logged for the client in docs/OPEN-ITEMS.md rather than invented, which is
 * the other reason it cannot carry a column of its own.
 */
const SHELF = books.filter((book) => book.slug !== 'food-fear-audiobook');

/**
 * The format line under a card, where an entry stands for more than one
 * edition. Every word of it is a fact the harvest already carries: two entries,
 * one paperback and one audiobook, same title, same subtitle.
 */
const FORMAT_LABEL_OVERRIDE: Record<string, string> = {
  'food-fear': 'Print edition and audiobook',
};

/** The second jacket a card carries, where the entry stands for two editions. */
const SECOND_COVER: Record<string, keyof typeof COVERS> = {
  'food-fear': 'food-fear-audiobook',
};

/**
 * One descriptor for every jacket on the shelf. The cover slot is one column
 * wide at every breakpoint and a card's jackets take a row each below 64rem,
 * so a paired jacket and a single jacket are laid out in boxes of the same
 * width and there is no second case to describe. The three steps are the
 * shelf's three arrangements: full-bleed column below 48rem, the 14rem cover
 * track beside the copy from 48 to 64rem, and the two-column shelf above it.
 */
const JACKET_SIZES = '(min-width: 64rem) 18rem, (min-width: 48rem) 12rem, 100vw';

/**
 * Splits a harvested description into paragraphs and drops any trailing
 * fragment that is not a complete sentence.
 *
 * This exists for one entry. The Do Business Better description was truncated
 * mid-word on the old site at "how to achieve i". As of Phase 4 the cut is made
 * in content/books.ts instead, so the broken fragment cannot reach a meta
 * description or a JSON-LD node the way it did on the old site. This guard
 * stays as a belt and braces for any description harvested later. Nothing is
 * invented to finish the sentence; it is logged as an open item for the client.
 */
function bookParagraphs(description: string): string[] {
  const lastStop = description.lastIndexOf('.');
  const complete = lastStop === -1 ? description : description.slice(0, lastStop + 1);
  return complete
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export default function AboutPage() {
  return (
    <>
      <Hero
        id="about"
        /* Was "Filed from the Indiana farm office", a newspaper dateline.
           Dropped in the Cool Modern Ag revision: it is the one piece of
           furniture on the site that is costume rather than biography. The
           Indiana farm is a real and load-bearing fact, and it is still stated
           on this page in prose, in the masthead rail as EST. 1994, INDIANA,
           and in the footer. What went is the pretence that a speaker's About
           page is a wire report. */
        eyebrow="Purdue Ag Econ, Second City Chicago, and a farm of his own"
        title="Ag economist, comedian, farm owner."
        /* Three decks have already been ruled out of this slot, and the comment
           records all three so a fourth attempt does not repeat any of them.
             1. The credential deck ("Purdue Ag Econ degree. Second City
                Chicago...") is the VOICE.md model line and it belongs to Home.
             2. "He quit his Fortune 500 job in 1994 and hasn't had a boss
                since" is the opening sentence of
                /do-business-better-podcast/, whose whole premise is that quit.
                Two routes cannot both open on it.
             3. "Below: the biography, the four credentials behind it, and the
                books" was a table of contents for this page. A visitor does
                not want the section list read back to them, and the same
                sentence had been copied into the meta description, so it was
                the SERP snippet too. Furniture is never the subject.
           This one is about the man and what he is like to hire: one industry,
           one date on the clock, and no employer standing between him and the
           room. The third sentence is the only survivor of the old deck. It is
           second person, it is in voice, and it tells a meeting planner which
           section of this page is theirs without listing the sections. */
        deck="One industry, since 1994, and nobody to answer to but the client. That’s why Damian will hand your growers the outlook and the uncomfortable half of it in the same hour."
        actions={HERO_ACTIONS}
        image={{
          src: '/img/photos/portrait-dark-blazer.jpg',
          alt: imageAlt['/img/photos/portrait-dark-blazer.jpg'],
          width: 1467,
          height: 2000,
          feature: true,
        }}
        cutline="Damian Mason. A Screen Actors Guild card and an Indiana farm, both in the same name."
      />

      {/* ================================================================
          No. 01, the biography

          THIS ROUTE OWNS THE BIOGRAPHY. The four paragraphs below are the
          only place on the site the full bio runs. /keynote/ carried the same
          three source paragraphs word for word and now carries a one-paragraph
          pointer instead; /boasg/ was cut back to its opening sentence in the
          same way. If a third route wants the bio, it links here.
          ================================================================ */}
      <Section id="biography" aria-labelledby="biography-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-7`}>
              <Eyebrow>Biography</Eyebrow>
              {/* NOT the nine-job-title sentence. That heading is verbatim
                  source on two routes (`_source/pages/keynote.md:180` and
                  `collaboration-opportunities.md:121`) and it now renders on
                  exactly those two, out of `content/job-titles.ts`. This route
                  has no source page of its own, so a third copy of it here was
                  the rebuild repeating itself rather than parity. The heading
                  below is drawn from the source bio's own first clause. */}
              <Heading level={2} id="biography-title">
                The two subjects he knows best.
              </Heading>
              <Prose>
                <p>
                  Damian Mason speaks on the two subjects he knows best: Business and Agriculture.
                  Since 1994, he has spoken to over 2,400 audiences in all 50 states and 7 foreign
                  countries.
                </p>
                {/* This paragraph used to open with the 23 words that are
                    verbatim source copy for /boasg/ ("Damian Mason is a leading
                    voice in the Agricultural industry, sought out by media,
                    podcasts, and publications for his tell-it-like-it-is style
                    of delivery"), so the same sentence introduced Damian on two
                    routes. `_source/pages/boasg.md:38` is the only place that
                    sentence exists in the source and /boasg/ still carries it,
                    so /boasg/ keeps it. The "(and Business of Ag Success Group
                    members)" aside went with it: it is a BoASG-specific
                    parenthetical and it read as a non-sequitur inside a general
                    biography. What is left is the half of the paragraph that is
                    about the biography, kept in the source's own words. */}
                {/* The "in all 50 states, 7 foreign countries" clause came out
                    of this sentence: the paragraph directly above it is the
                    source line that carries those counts, so the page was
                    stating them twice inside 80 words. */}
                {/* The sugar-coating sentence is not here any more. It is
                    verbatim source copy for /boasg/ (_source/pages/boasg.md
                    line 38), which owns it, and running it on both routes was
                    the one duplication the final sweep flagged. What /about/
                    keeps is the half of the source sentence /boasg/ does not
                    carry: who he has actually worked for. */}
                <p>
                  He has spoken and consulted with the biggest names in Agriculture, in every
                  segment of Ag.
                </p>
                <p>
                  Damian is a graduate of Purdue University with a degree in Agriculture Economics.
                  He studied comedy writing and improvisation at Second City in Chicago and is a
                  member of the Screen Actors Guild.
                </p>
                <p>
                  When he’s not traveling for work, Damian can be found on his Indiana farm with his
                  wife Lori or escaping from winter at their Arizona residence.
                </p>
              </Prose>
            </div>

            <figure
              className={`dm-figure ${styles.bioFigure} col-span-6 md:col-span-12 lg:col-span-5`}
            >
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/speaking-to-audience.jpg"
                  alt={imageAlt['/img/photos/speaking-to-audience.jpg']}
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 64rem) 32rem, 100vw"
                />
              </div>
              {/* The cutline used to close on "Since 1994 that's happened over
                  2,400 times", which restated the biography paragraph 80 words
                  to its left, under a ledger that carries the same figure a
                  third time. A cutline should carry what its own photograph
                  supports, and this one is grounded in the alt text: banquet
                  tables, growers, several of them grinning back at him. */}
              <figcaption className="dm-figure__caption">
                A room of growers at banquet tables, mid program. The ones grinning came for
                the market outlook.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ================================================================
          No. 02, the credentials
          ================================================================ */}
      {/* Green. The split is the one app/page.tsx already states at its
          podcast band: the section that talks about the man, the land or the
          work goes forest, and the band that asks for the booking stays navy.
          A biography is the first of those, and the dated spine reads better on
          a ground that is not the same ground as the ledger above it. */}
      <Section id="credentials" aria-labelledby="credentials-title" surface="forest">
        <Container>
          <div className={styles.stack}>
            <Eyebrow>Credentials</Eyebrow>
            <Heading level={2} id="credentials-title">
              Not your boring Ag speaker.
            </Heading>
            <Prose measure="wide">
              <p>
                An economist can quote you the number, and a farm owner can tell you what that
                number does to a family. A comedian can land both without the room getting heavy.
                Damian’s been all three since 1994, and you’re hiring all three.
              </p>
            </Prose>
          </div>

          {/* One component, shared with /keynote/. The words already came from
              content/credentials.ts; the markup used to be hand written here
              and there, and the two renderings drifted into an unmarked blue
              list on a loose rhythm and a dashed list on a tight one. */}
          <CredentialBar pillars={PILLARS} className={styles.credentials} data-reveal="stagger" />

          {/* The bar above says what he is. This says when, and it is here
              rather than in a section of its own because it is evidence for
              those four pillars rather than a subject beside them.

              IT IS DELIBERATELY SHORT, AND THE REGISTER UNDER IT IS A SENTENCE
              RATHER THAN A LIST. Nine things belong on a spine for this
              speaker and two of them carry a year anywhere in the source; see
              the header of content/timeline.ts, which records the grep. The
              other six are already printed on this page at full size: Purdue,
              Second City and the Guild card are in the biography prose AND in
              the bar directly above this, and both books get a card of their
              own in No. 03. Ticking them a third time with no date on them
              would be the page repeating itself with a rule drawn down the
              side of it, which is decoration wearing a graphic's clothes.
              Logged for the client as docs/OPEN-ITEMS.md item 23. */}
          <Timeline
            id="record"
            className={styles.spine}
            eyebrow="The dated record"
            title="How he got here."
          />
        </Container>
      </Section>

      {/* The ledger. No heading of its own: it is furniture under the
          credentials, and the restatement carries the claim in prose for a
          reader whose glyphs did not render.

          The restatement is overridden here. StatRow's default is "Since 1994,
          Damian has spoken to over 2,400 audiences in all 50 states and 7
          foreign countries", which is the source sentence the biography above
          opens on, so this route was printing it twice. This one says what the
          four figures are without restating the first paragraph. */}
      <StatRow
        /* Navy. See the note on the same prop in app/page.tsx: this route ran
           hero, biography, credentials and books across five bands and only
           changed ground once, at the closing CTA. */
        surface="deep-alt"
        restatement="Three figures describe Damian’s speaking record. The fourth describes the podcast audience." />

      {/* ================================================================
          No. 03, the books. This section is the redirect target for every
          retired commerce URL, so the #books anchor has to exist and has to
          stay. Cover, title, subtitle, description. No price, no cart, no
          purchase link: `buyUrl` is empty on every entry and an empty href
          renders nothing at all.
          ================================================================ */}
      <Section id="books" aria-labelledby="books-title" surface="sunken">
        <Container>
          <div className={styles.stack}>
            <Eyebrow>Books</Eyebrow>
            <Heading level={2} id="books-title">
              Two books and an audiobook.
            </Heading>
            {/* This paragraph used to run "What follows is the jacket copy,
                word for word, so it's the publisher's pitch and not ours."
                Two things were wrong with it. It told the visitor about the
                rebuild's own sourcing method in the rebuild's own vocabulary,
                which is a code comment and not copy. And it was no longer even
                true: the audiobook card renders a rebuild-written line, not
                jacket copy, so a reader took that line as the publisher's.

                The attribution itself is worth keeping, so it moved to a
                conventional per-card label on the two cards it is true of. See
                the "From the publisher" eyebrow below. */}
            <Prose measure="wide">
              <p>
                Two subjects: food and business. One argues that fear has wrecked the way
                you eat, the other that success looks different for every person chasing
                it. You don’t have to book Damian to read them.
              </p>
            </Prose>
          </div>

          {/* This list sits inside #books, which is the live redirect target
              for every retired commerce URL. The reveal controller measures
              against the post-hash scroll position, so arriving on the anchor
              finds the covers already shown rather than waiting on a scroll
              that has already happened. */}
          <ul className={styles.books} role="list" data-reveal="stagger">
            {SHELF.map((book) => {
              const cover = COVERS[book.slug];
              const second = SECOND_COVER[book.slug] ? COVERS[SECOND_COVER[book.slug]] : null;
              return (
                <li key={book.slug}>
                  <Card variant="ruled" className={styles.book}>
                    {cover ? (
                      <div
                        className={styles.bookCover}
                        data-covers={second ? 'two' : undefined}
                      >
                        <Image
                          src={cover.src}
                          alt={cover.alt}
                          width={1200}
                          height={1200}
                          loading="lazy"
                          /* Both jackets on a card get the same slot at every
                             width now (page.module.css, .bookCover), so both
                             Image tags carry the same descriptor. */
                          sizes={JACKET_SIZES}
                        />
                        {second ? (
                          <Image
                            src={second.src}
                            alt={second.alt}
                            width={1200}
                            height={1200}
                            loading="lazy"
                            sizes={JACKET_SIZES}
                          />
                        ) : null}
                      </div>
                    ) : null}
                    <div className={styles.bookHead}>
                      <Eyebrow>
                        {FORMAT_LABEL_OVERRIDE[book.slug] ?? FORMAT_LABEL[book.format]}
                      </Eyebrow>
                      <Heading level={3} size="lg">
                        {book.title}
                      </Heading>
                      {book.subtitle ? (
                        <p className={styles.bookSubtitle}>{book.subtitle}</p>
                      ) : null}
                    </div>
                    {/* One wrapper, so the card keeps exactly three children.
                        Between 768 and 1023 `.book` is a two-column grid with
                        the cover spanning both rows, and a fourth direct child
                        would push the description into the cover's column. */}
                    <div className={styles.bookBody}>
                      {/* Every body on this shelf is now the publisher's own
                          jacket copy, harvested word for word from the retired
                          product pages, so the label is unconditional. */}
                      <Eyebrow>From the publisher</Eyebrow>
                      <Prose measure="full">
                        {bookParagraphs(book.description).map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </Prose>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ================================================================
          No. 04, the close
          ================================================================ */}
      <CTABand
        id="book-damian"
        eyebrow="Next step"
        heading="Booking a date, or just curious?"
        /* The booking terms are not restated here. "First step: check the
           date", "a simple contract and a small deposit" and the travel
           arrangements were each running on six to nine routes, and this band
           was one of the sites. /meeting-coordinators/ and the verbatim FAQ
           carry the terms in full; this page is the biography, so its close
           asks the question the biography leaves a reader with. */
        copy="Two books, three podcasts, and a farm in Indiana. None of that gets your date held. Tell the office when you need him."
        actions={CLOSING_ACTIONS}
      />

      <JsonLd
        id="about-breadcrumbs"
        schema={buildBreadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about/' },
        ])}
      />
    </>
  );
}

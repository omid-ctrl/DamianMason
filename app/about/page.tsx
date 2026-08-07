import Image from 'next/image';
import type { Metadata } from 'next';

import { Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { StatRow } from '@/components/sections/StatRow';
import type { SectionActions } from '@/components/sections/types';
import { JsonLd } from '@/components/seo';
import { books } from '@/content/books';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Ag Economist, Comedian, Farm Owner',
  description:
    'Purdue Ag Econ degree. Second City Chicago. An Indiana farm of his own. The bio, the credentials, and the three books behind 2,400 audiences since 1994.',
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

type Pillar = {
  title: string;
  items: string[];
};

/**
 * The four-pillar credential bar from `/keynote/`, carried over verbatim with
 * one addition: "Member of the Screen Actors Guild", which is stated in the
 * keynote bio paragraph and belongs with the professional credentials rather
 * than buried in running text.
 */
const PILLARS: Pillar[] = [
  {
    title: 'Knowledgeable',
    items: ['Degree in Ag Econ from Purdue University', 'Educated on Current Events'],
  },
  {
    title: 'Professional',
    items: ['Corporate Background', 'Author', 'Podcast Host', 'Member of the Screen Actors Guild'],
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
    alt: 'Cover of Do Business Better by Damian Mason, published by Wiley, with a foreword by Larry Winget.',
  },
};

const FORMAT_LABEL: Record<string, string> = {
  paperback: 'Print edition',
  audiobook: 'Audiobook',
};

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
        eyebrow="Filed from the Indiana farm office"
        title="Ag economist, comedian, farm owner."
        deck="Purdue Ag Econ degree. Second City Chicago. An Indiana farm of his own. Since 1994 Damian has taken all three to 2,400 audiences in 50 states and 7 countries."
        actions={HERO_ACTIONS}
        image={{
          src: '/img/photos/portrait-dark-blazer.jpg',
          alt: 'Damian Mason in a charcoal blazer and jeans, one hand in a pocket, leaning against a whitewashed brick window frame.',
          width: 1467,
          height: 2000,
        }}
        cutlineFolio="Fig. 01"
        cutline="Damian Mason. A Screen Actors Guild card and an Indiana farm, both in the same name."
      />

      {/* ================================================================
          No. 01, the biography
          ================================================================ */}
      <Section id="biography" aria-labelledby="biography-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-7`}>
              <Eyebrow>Biography</Eyebrow>
              <Heading level={2} folio="No. 01" id="biography-title">
                Businessman, agriculturist, speaker, podcaster, media guest, Ag personality,
                influencer, author, and consultant.
              </Heading>
              <Prose>
                <p>
                  Damian Mason speaks on the two subjects he knows best: Business and Agriculture.
                  Since 1994, he has spoken to over 2,400 audiences in all 50 states and 7 foreign
                  countries.
                </p>
                <p>
                  Damian Mason is a leading voice in the Agricultural industry, sought out by media,
                  podcasts, and publications for his tell-it-like-it-is style of delivery. He gives
                  you the truth about Ag without sugar coating the message, helping to prepare his
                  listeners (and Business of Ag Success Group members) to navigate their way through
                  the rapidly changing, volatile industry. He has spoken and consulted with the
                  biggest names in Agriculture, in all 50 states, 7 foreign countries and in every
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
                  alt="Damian Mason speaking to a seated room of farmers in caps and event lanyards."
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 64rem) 32rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 02 </span>
                A room of growers, mid program. Since 1994 that’s happened over 2,400 times.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ================================================================
          No. 02, the credentials
          ================================================================ */}
      <Section id="credentials" aria-labelledby="credentials-title" surface="sunken">
        <Container>
          <div className={styles.stack}>
            <Eyebrow>Credentials</Eyebrow>
            <Heading level={2} folio="No. 02" id="credentials-title">
              Not your boring Ag speaker.
            </Heading>
            <Prose measure="wide">
              <p>
                An economist can quote you the number, and a farm owner can tell you what that
                number does to a family. A comedian can land both without the room getting heavy.
                Damian’s been all three since 1994.
              </p>
            </Prose>
          </div>

          <ul className={styles.credentials} role="list">
            {PILLARS.map((pillar) => (
              <li key={pillar.title}>
                <Card variant="ruled" className={styles.credential}>
                  <Heading level={3} size="md">
                    {pillar.title}
                  </Heading>
                  <ul className={styles.credentialList} role="list">
                    {pillar.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* The ledger. No heading of its own: it is furniture under the
          credentials, and the restatement carries the claim in prose. */}
      <StatRow />

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
            <Heading level={2} folio="No. 03" id="books-title">
              Two books and an audiobook.
            </Heading>
            <Prose measure="wide">
              <p>
                Three titles, two subjects: food and business. Here’s the long version of what
                your audience gets in 60 to 90 minutes from the stage.
              </p>
            </Prose>
          </div>

          <ul className={styles.books} role="list">
            {books.map((book) => {
              const cover = COVERS[book.slug];
              return (
                <li key={book.slug}>
                  <Card variant="ruled" className={styles.book}>
                    {cover ? (
                      <div className={styles.bookCover}>
                        <Image
                          src={cover.src}
                          alt={cover.alt}
                          width={1200}
                          height={1200}
                          loading="lazy"
                          sizes="(min-width: 48rem) 22rem, 100vw"
                        />
                      </div>
                    ) : null}
                    <div className={styles.bookHead}>
                      <Eyebrow>{FORMAT_LABEL[book.format]}</Eyebrow>
                      <Heading level={3} size="lg">
                        {book.title}
                      </Heading>
                      {book.subtitle ? (
                        <p className={styles.bookSubtitle}>{book.subtitle}</p>
                      ) : null}
                    </div>
                    <Prose measure="full">
                      {bookParagraphs(book.description).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </Prose>
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
        folio="No. 04"
        eyebrow="Next step"
        heading="Booking a date, or just curious?"
        copy="First step: check that Damian has your event date available. A simple contract and a small deposit hold it, and you’re on the calendar."
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

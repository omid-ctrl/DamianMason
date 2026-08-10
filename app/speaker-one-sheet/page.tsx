import Link from 'next/link';
import type { Metadata } from 'next';

import { ClientSectors } from '@/components/sections/ClientSectors';
import { CoverageGrid } from '@/components/sections/CoverageGrid';
import { CredentialBar } from '@/components/sections/CredentialBar';
import { CTABand } from '@/components/sections/CTABand';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { Hero } from '@/components/sections/Hero';
import { LogoWall } from '@/components/sections/LogoWall';
import { StatRow } from '@/components/sections/StatRow';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { JsonLd } from '@/components/seo';
import { Button, Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { credentialPillars } from '@/content/credentials';
import { clients } from '@/content/clients';
import { foreignCountryCount } from '@/content/coverage';
import { faq } from '@/content/faq';
import { imageAlt } from '@/content/image-alt';
import { contact } from '@/content/site';
import { testimonialsFor } from '@/content/testimonials';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

/* ============================================================================
   /speaker-one-sheet/

   THE ONE ROUTE ON THIS SITE WITH NO SOURCE PAGE BEHIND IT, and the reason it
   is allowed to exist is written in docs/OPEN-ITEMS.md item 3.

   The old site pointed at a "Media Kit" twice and delivered a speaker asset
   zero times: both links resolved to a .zip on the WP Engine staging host,
   which is not a media kit, it is a download of unknown contents on a URL that
   dies with the hosting. The client asked for the links to be removed, and they
   were, which left a real gap: there was no single thing a meeting planner
   could send to a committee.

   IT IS NOT CALLED A MEDIA KIT. The client's instruction was to remove that
   link, docs/QA_REPORT.md asserts zero rendered hits for the phrase, and a
   one-sheet is what this actually is.

   IT INVENTS NOTHING. Every figure, credential, sector, state, testimonial and
   FAQ answer on this page is read from content/, which is the same data the
   rest of the site renders, so this page cannot drift from the pages it
   summarises. The only new copy is the connective tissue, and it is marked.

   THE PDF IS GENERATED FROM THIS PAGE by scripts/build-one-sheet.mjs, not
   drawn separately. A hand-made PDF would look better for about one edit and
   then be wrong forever with nothing to catch it. See the header of that
   script.
   ============================================================================ */

const PATH = '/speaker-one-sheet/';
const PDF = '/docs/damian-mason-speaker-one-sheet.pdf';
/* The PDF source article is present in the public DOM but screen-hidden. A
   real `src` there still downloads, costing every web visit two full-size
   JPEGs. The generator promotes `data-pdf-src` into `src` before printing;
   browsers otherwise receive this valid one-pixel placeholder. */
const PDF_IMAGE_PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const PHOTO_ZIP = '/docs/damian-mason-speaker-photos.zip';
const MAILTO = `mailto:${contact.email}`;

/** The five topics a planner actually asks about, in the order they ask. */
const ONE_SHEET_FAQ_TOPICS = ['fees', 'booking', 'travel', 'technology', 'program'];

export const metadata: Metadata = buildMetadata({
  title: 'Speaker One-Sheet',
  description:
    'Everything a meeting planner needs on one page: the program, the credentials, the client roster, the fees and travel, and the booking contact. Download it as a PDF.',
  path: PATH,
  image: {
    url: '/img/photos/portrait-charcoal-jacket.jpg',
    width: 1333,
    height: 2000,
    alt: 'Damian Mason in a charcoal woven jacket, hands behind his back.',
  },
});

const schema = buildBreadcrumbListSchema([
  { name: 'Home', path: '/' },
  { name: 'Speaking', path: '/speaking/' },
  { name: 'Speaker One-Sheet', path: PATH },
]);

export default function SpeakerOneSheetPage() {
  const quotes = testimonialsFor(PATH);

  return (
    <>
      <JsonLd id="one-sheet-schema" schema={schema} />

      <Hero
        id="one-sheet"
        eyebrow="For meeting planners and committees"
        title="Damian Mason, on one page."
        titleSize="5xl"
        deck="The program, the credentials, the room he fills and the number to call. Everything below is on this site somewhere; this is the version you can send to the person who has to sign off."
        actions={[
          { label: 'Download the one-sheet (PDF)', href: PDF },
          { label: 'Check your event date', href: '/contact-us/', variant: 'secondary' },
        ] as const}
        image={{
          src: '/img/photos/portrait-charcoal-jacket.jpg',
          /* Same file as the /collaboration-opportunities/ hero, so the string
             moved into content/image-alt.ts the moment this became its second
             call site, per the rule at the head of that module. */
          alt: imageAlt['/img/photos/portrait-charcoal-jacket.jpg'],
          width: 1333,
          height: 2000,
          feature: true,
        }}
        cutline="One page, no bureau, and a phone number that reaches the office rather than a queue."
      />

      {/* The four figures, unchanged and unrestated. StatRow's own default is
          the credibility ledger, which is exactly right here. */}
      <StatRow
        id="record"
        surface="deep-alt"
        eyebrow="The record"
        title="Since 1994"
        restatement="Thirty years of the same job, in every state, in both halves of the commodity cycle. That is the argument, and the four numbers above are all of it."
      />

      {/* ---------------------------------------------------------------------
          The program. The answer is the FAQ's own `presentation-content` entry,
          verbatim, because it is the client's own description of his own
          keynote and there is no better sentence available for it anywhere on
          the site.
          --------------------------------------------------------------------- */}
      <Section id="program" aria-labelledby="program-title">
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>The program</Eyebrow>
              <Heading level={2} size="2xl" id="program-title">
                The &ldquo;Ations&rdquo; of Agriculture
              </Heading>
            </div>
            <div className="col-span-6 md:col-span-8">
              <Prose measure="wide">
                <p>{PROGRAM_ANSWER}</p>
              </Prose>
              <div className="dm-section-close">
                <Button href="/keynote/" variant="secondary">
                  See the full keynote page
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The four credential pillars, the same object /keynote/ and /about/
          render, so a change to the data reaches all three. */}
      <Section id="credentials" surface="forest" aria-labelledby="credentials-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Why he gets to be blunt</Eyebrow>
            <Heading level={2} size="2xl" id="credentials-title">
              Credentials
            </Heading>
          </div>
          <CredentialBar pillars={credentialPillars} />
        </Container>
      </Section>

      <LogoWall
        id="clients"
        surface="sunken"
        eyebrow="Client roster"
        title="Who has booked him"
        intro="John Deere, Cargill, BASF, Merck, Land O’Lakes Purina, CLAAS, Pioneer Seeds, and eighteen more."
      />

      {/* A SECOND HOME FOR content/client-sectors.ts, which had exactly one.
          A committee's real question is not "has he worked with big names", it
          is "has he worked with OUR kind of organisation", and this is the only
          object on the site that answers it. */}
      <Section
        id="sectors"
        surface="sunken"
        seam
        density="tight"
        aria-labelledby="sectors-title"
      >
        <Container>
          <ClientSectors
            titleId="sectors-title"
            eyebrow="The roster by kind"
            title="Sorted by what kind of business booked him"
            intro="Ten of the twenty-five are commodity groups, trade associations, or Farm Bureaus. The other fifteen are input suppliers, ag lenders and insurers, grain, livestock, and produce businesses, and equipment makers."
          />
        </Container>
      </Section>

      {/* A SECOND HOME FOR content/coverage.ts. On /speaking/ this is a claim a
          reader can count; on a page being forwarded to somebody who was not on
          the call, it is the answer to "will he travel to us". */}
      <CoverageGrid
        id="coverage"
        surface="deep-alt"
        density="tight"
        eyebrow="Where he works"
        title="All fifty. Count them."
        intro="Whichever state your meeting is in, Damian has already worked in it. Travel is a quoted flat fee, not an open expense line: the terms are on the meeting coordinators page."
        cutline="Seven countries beyond the United States, since 1994. Ask Damian’s office for the current list."
      />

      <Section id="said" surface="page" aria-labelledby="said-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>On the record</Eyebrow>
            <Heading level={2} size="2xl" id="said-title">
              What the last three committees said
            </Heading>
          </div>
          <TestimonialGrid items={quotes} columns={3} label="What committees said" />
          <div className="dm-section-close">
            <Button href="/reviews/" variant="secondary">
              Read all fifteen written testimonials
            </Button>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------------
          THE DOWNLOADS, AND THIS IS THE POINT OF THE ROUTE.

          content/faq.ts, item `promote-our-event`, promises in the client's own
          words: "Headshots and Bio are available for your use for your own
          marketing efforts as well." Until the media-kit rescue that promise
          could not be kept, because there was nothing to link. It can now.

          BOTH PDFs AND THE PHOTO ZIP ARE LINKED, NEVER EMBEDDED. next.config.ts sets
          object-src 'none' and a frame-src that permits only
          youtube-nocookie.com and play.libsyn.com, so an <iframe>, <object> or
          <embed> is blocked in production and works in a dev server with the
          header stripped. That failure is invisible until it is live.
          --------------------------------------------------------------------- */}
      <Section id="downloads" surface="sunken" aria-labelledby="downloads-title">
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>For your own marketing</Eyebrow>
              <Heading level={2} size="2xl" id="downloads-title">
                Take what you need
              </Heading>
              <Prose measure="narrow">
                <p>
                  The FAQ promises headshots and a bio for your own promotion.
                  Here they are. If you need something that is not on this list,
                  the office will send it.
                </p>
              </Prose>
            </div>

            <ul className={`${styles.downloads} col-span-6 md:col-span-8`} role="list">
              <li>
                <Card variant="ruled">
                  <Eyebrow>PDF, one page</Eyebrow>
                  <Heading level={3} size="lg">
                    <a href={PDF}>This page, as a one-sheet</a>
                  </Heading>
                  <Prose measure="narrow">
                    <p>
                      Generated from this page, so it says exactly what this page
                      says. Forward it to a committee.
                    </p>
                  </Prose>
                </Card>
              </li>
              <li>
                <Card variant="ruled">
                  <Eyebrow>PDF, one page</Eyebrow>
                  <Heading level={3} size="lg">
                    <a href="/docs/av-and-room-setup-requirements.pdf">
                      A/V and room setup requirements
                    </a>
                  </Heading>
                  <Prose measure="narrow">
                    <p>
                      Nine numbered items for whoever is running the room:
                      microphone, screen, lighting, and where to seat people.
                    </p>
                  </Prose>
                </Card>
              </li>
              <li>
                <Card variant="ruled">
                  <Eyebrow>ZIP, 10 photos</Eyebrow>
                  <Heading level={3} size="lg">
                    <a href={PHOTO_ZIP} download>
                      Download speaker photos
                    </a>
                  </Heading>
                  <Prose measure="narrow">
                    <p>
                      Four studio portraits, five stage photographs, one audience frame,
                      and a file of usage notes. If you need another size, email the office.
                    </p>
                  </Prose>
                </Card>
              </li>
              <li>
                <Card variant="ruled">
                  <Eyebrow>On this site</Eyebrow>
                  <Heading level={3} size="lg">
                    <Link href="/about/">The full biography</Link>
                  </Heading>
                  <Prose measure="narrow">
                    <p>
                      Purdue, Second City, the Screen Actors Guild card, the
                      Indiana farm, and the two books.
                    </p>
                  </Prose>
                </Card>
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* The five questions a planner asks, from the same faq.ts every other
          route reads. FAQAccordion filters by topic itself, which is why
          faqByTopic() was never needed. */}
      <Section id="faq" aria-labelledby="faq-title">
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>Before you ask</Eyebrow>
              <Heading level={2} size="2xl" id="faq-title">
                Fees, travel, and the contract
              </Heading>
            </div>
            <div className="col-span-6 md:col-span-8">
              {/* withSchema stays off. /keynote/, /meeting-coordinators/ and
                  / already emit FAQPage nodes for overlapping slices of the
                  same thirteen answers, and a fourth would put the same
                  question in the graph four times. */}
              <FAQAccordion
                items={faq}
                topics={ONE_SHEET_FAQ_TOPICS}
                idPrefix="one-sheet-faq"
                withSchema={false}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* THE CONTACT LEDGER, AND IT PRINTS THE ADDRESS RATHER THAN LINKING IT.

          scripts/build-one-sheet.mjs caught this the first time it ran: the
          page carried the email only as the LABEL of a mailto button ("Email
          the office"), so the generated PDF had no address anywhere in it. A
          one-sheet exists to be forwarded and printed, and a committee member
          holding a sheet of paper cannot click a mailto. The address and the
          number are set as visible text here, in a definition list, and the
          buttons below are the convenience rather than the content.

          The check now asserts both strings appear in the PDF, so this cannot
          quietly regress. */}
      <Section id="contact" surface="page" density="tight" aria-labelledby="contact-title">
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>Bookings</Eyebrow>
              <Heading level={2} size="2xl" id="contact-title">
                Who to call
              </Heading>
            </div>
            <dl className={`${styles.ledger} col-span-6 md:col-span-8`}>
              <div className={styles.ledgerRow}>
                <dt>Email</dt>
                <dd>
                  <a href={MAILTO}>{contact.email}</a>
                </dd>
              </div>
              <div className={styles.ledgerRow}>
                <dt>Phone</dt>
                <dd>
                  <a href={contact.phoneHref}>{contact.phone}</a>
                </dd>
              </div>
              <div className={styles.ledgerRow}>
                <dt>Who answers</dt>
                <dd>Damian, or his office manager Lori. Not a bureau.</dd>
              </div>
              <div className={styles.ledgerRow}>
                <dt>Reply time</dt>
                <dd>Typically within one business day.</dd>
              </div>
              <div className={styles.ledgerRow}>
                <dt>Based in</dt>
                <dd>Indiana. He books his own airfare and rental car.</dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>

      <CTABand
        id="book"
        eyebrow="Next step"
        heading="Check the date first."
        copy="Send the date, the city, the audience and roughly how many. Damian or Lori answers, usually inside a business day, and you will not be routed through a bureau."
        actions={[
          { label: 'Email the office', href: MAILTO, 'aria-label': `Email ${contact.email}` },
          { label: contact.phone, href: contact.phoneHref, 'aria-label': `Call ${contact.phone}` },
        ] as const}
      />

      {/* This article is screen-hidden and revealed only by
          scripts/build-one-sheet.mjs. It is semantic source material for a
          genuinely one-page tagged PDF, not a second web presentation. */}
      <article className="dm-one-sheet-print" style={{ display: 'none' }}>
        <header className="dm-one-sheet-print__mast">
          <div>
            <p className="dm-one-sheet-print__kicker">
              Agricultural keynote speaker · Podcaster · Author
            </p>
            <p className="dm-one-sheet-print__name">Damian Mason</p>
            {/* The public page already has its one H1. Chromium maps this
                print-only heading's explicit aria-level to H1 in the tagged
                PDF, while the hidden source DOM remains a valid H1 -> H2
                document for browser QA. */}
            <h2 className="dm-one-sheet-print__title" role="heading" aria-level={1}>
              Straight-Forward Agriculture Dialogue
            </h2>
            <p className="dm-one-sheet-print__lead">
              Purdue Ag Econ, Second City Chicago, and an Indiana farm of his own.
              Damian pairs current agricultural business insight with the timing of a
              professional comedian.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- this image
              exists only inside the PDF source article; the print generator
              owns its exact physical dimensions and waits for it to decode. */}
          <img
            className="dm-one-sheet-print__portrait"
            src={PDF_IMAGE_PLACEHOLDER}
            data-pdf-src="/img/photos/portrait-headshot.jpg"
            alt="Damian Mason in a light grey jacket, smiling at the camera."
            width="1333"
            height="2000"
          />
        </header>

        <ul className="dm-one-sheet-print__stats" aria-label="Damian Mason track record">
          <li>
            <span className="dm-one-sheet-print__stat">2,400+</span>
            <span className="dm-one-sheet-print__stat-label">Audiences addressed</span>
          </li>
          <li>
            <span className="dm-one-sheet-print__stat">50 states</span>
            <span className="dm-one-sheet-print__stat-label">
              Plus {foreignCountryCount} foreign countries
            </span>
          </li>
          <li>
            <span className="dm-one-sheet-print__stat">1994</span>
            <span className="dm-one-sheet-print__stat-label">Speaking since</span>
          </li>
          <li>
            <span className="dm-one-sheet-print__stat">40,000+</span>
            <span className="dm-one-sheet-print__stat-label">Monthly listeners</span>
          </li>
        </ul>

        <div className="dm-one-sheet-print__body">
          <div className="dm-one-sheet-print__column">
            <section className="dm-one-sheet-print__panel dm-one-sheet-print__panel--accent">
              <p className="dm-one-sheet-print__kicker">The keynote</p>
              <h2>The “Ations” of Agriculture</h2>
              <p className="dm-one-sheet-print__copy">{PROGRAM_ANSWER}</p>
            </section>

            <section className="dm-one-sheet-print__panel">
              <p className="dm-one-sheet-print__kicker">Credentials</p>
              <ul className="dm-one-sheet-print__credentials">
                {credentialPillars.map((pillar) => (
                  <li key={pillar.title}>
                    <h3>{pillar.title}</h3>
                    <ul>
                      {pillar.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            <section className="dm-one-sheet-print__panel">
              <p className="dm-one-sheet-print__kicker">Selected and verified roster</p>
              <h2>25 clients across agriculture</h2>
              <p className="dm-one-sheet-print__clients">
                {clients.map((client) => client.name).join(' · ')}
              </p>
            </section>
          </div>

          <aside className="dm-one-sheet-print__column" aria-label="Proof and booking facts">
            <section className="dm-one-sheet-print__panel dm-one-sheet-print__panel--accent">
              <p className="dm-one-sheet-print__kicker">On the record</p>
              {quotes[0] ? (
                <blockquote>
                  “{quotes[0].quote}”
                  <cite>
                    {quotes[0].name}
                    {quotes[0].organization ? ` · ${quotes[0].organization}` : ''}
                  </cite>
                </blockquote>
              ) : null}
            </section>

            <section className="dm-one-sheet-print__panel">
              <p className="dm-one-sheet-print__kicker">What a planner can verify</p>
              <ul className="dm-one-sheet-print__facts">
                <li>60 to 90 minute keynote, with an extended breakout available.</li>
                <li>Direct booking, a short contract, and a small deposit to hold the date.</li>
                <li>Quoted flat travel fee; Damian books his own airfare and rental car.</li>
                <li>{foreignCountryCount} foreign countries in addition to all 50 states.</li>
                <li>15 verified written testimonials, plus four source-page videos.</li>
                <li>
                  Host of The Business of Agriculture, Do Business Better, XtremeAg’s
                  Cutting the Curve, and UPROOTED.
                </li>
                <li>Author of Food Fear and Do Business Better.</li>
              </ul>
            </section>
          </aside>
        </div>

        <figure className="dm-one-sheet-print__stage">
          {/* eslint-disable-next-line @next/next/no-img-element -- same print-only
              contract as the portrait above; the PDF generator owns the crop. */}
          <img
            src={PDF_IMAGE_PLACEHOLDER}
            data-pdf-src="/img/photos/stage-crop-protection-slide.jpg"
            alt="Damian Mason speaking on stage beside a presentation slide about crop protection."
            width="1600"
            height="1067"
          />
          <figcaption>
            Agricultural business content, built for the room and the year in front of him.
          </figcaption>
        </figure>

        <footer className="dm-one-sheet-print__contact">
          <div>
            <h2>Check the date first.</h2>
            <p>Direct booking from Damian’s Indiana office. No speaker bureau in the middle.</p>
          </div>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{contact.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{contact.phone}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>damianmason.com</dd>
            </div>
          </dl>
        </footer>
      </article>
    </>
  );
}

/**
 * The program description, verbatim from content/faq.ts.
 *
 * Read out of the FAQ rather than retyped, because it is the client's own
 * account of his own keynote and this site has one copy of it. If the answer
 * ever changes, this page changes with it.
 */
const PROGRAM_ANSWER =
  faq.find((item) => item.id === 'presentation-content')?.answer ?? '';

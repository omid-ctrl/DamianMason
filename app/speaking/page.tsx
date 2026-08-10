import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import {
  Button,
  Card,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
  cx,
} from '@/components/ui';
// components/sections has no barrel file, so each section is imported directly.
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { ClientSectors } from '@/components/sections/ClientSectors';
import { CoverageGrid } from '@/components/sections/CoverageGrid';
import { LogoWall } from '@/components/sections/LogoWall';
import { StatRow } from '@/components/sections/StatRow';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { JsonLd } from '@/components/seo';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { contact } from '@/content/site';
import { testimonialsFor } from '@/content/testimonials';

import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

/**
 * /speaking/
 *
 * On the old site this route was a blank indexed stub: a Divi BLANK template
 * carrying the word "Speaking" in an h1, an empty `.entry-content`, a search
 * widget, no header and no footer. The nav parent that should have pointed at
 * it shipped with no href attribute at all.
 *
 * There is therefore nothing to carry over except the route itself. The page is
 * assembled from its four children, and every claim on it is harvested from
 * `_source/pages/keynote.md`, `reviews.md`, `meeting-coordinators.md` and
 * `collaboration-opportunities.md`.
 */

export const metadata: Metadata = buildMetadata({
  title: 'Hire an Agricultural Speaker',
  description:
    'The keynote program, the client reviews, the fees and travel, and the ways to work with Damian off the stage. Everything a meeting planner needs to decide.',
  path: '/speaking/',
});

const breadcrumbs = buildBreadcrumbListSchema([
  { name: 'Home', path: '/' },
  { name: 'Speaking', path: '/speaking/' },
]);

/**
 * The four child routes. Each description is written from that child's own
 * harvested source, not from a summary of it.
 */
const childRoutes = [
  {
    href: '/keynote/',
    title: 'Keynote',
    meta: 'Program, extensions, FAQ',
    body: (
      <>
        {/* "connects the dots from consumer issues to regulation to political
            movements to societal changes" is the source's own program
            description and it is verbatim on /keynote/. It also ran in the
            "Ations" section of this same page, so /speaking/ was printing it
            twice. The card names what the other page holds instead. */}
        60 to 90 minutes of forward looking Ag commentary, delivered with humor, plus
        three demo reels and the booking questions meeting planners work through before
        they sign. Keynote not enough? He’ll also do breakouts, luncheons, and panel
        discussions.
      </>
    ),
  },
  {
    href: '/reviews/',
    title: 'Testimonials',
    meta: 'Fifteen written, four videos',
    /* The client roll call belongs to /reviews/, whose deck and meta
       description both open on it. A card that sends the reader there does not
       need to be that page. */
    body: (
      <>
        Fifteen verified speaking testimonials in writing, plus four videos carried
        from the original reviews page. Read them before you decide what the hour is worth.
      </>
    ),
  },
  {
    href: '/meeting-coordinators/',
    title: 'Meeting Coordinators',
    meta: 'Contract, travel, technology',
    /* This card used to restate four booking facts that /meeting-coordinators/
       states in full and the FAQ block states verbatim: airfare, Lori, the
       contract and deposit, NET fees, and check the date. A card whose job is
       to send the reader to a page should not try to be that page. It names
       what is on the other end instead. */
    body: (
      <>
        The contract, the travel fee, the AV and room setup sheet, and what Damian will
        do to help you fill the room. Written for the person who has to take it to a
        committee.
      </>
    ),
  },
  {
    href: '/collaboration-opportunities/',
    title: 'Collaboration Opportunities',
    meta: 'Podcast, media, brand',
    body: (
      <>
        Three ways to work together off the stage: podcast guest or sponsor, news and media
        commentary, brand promotion. The project supplies ten Business of Agriculture
        sponsor marks, and Cheddar News, NewsmaxTV and Straight Arrow News have all put
        him on air.
      </>
    ),
  },
  {
    href: '/speaker-one-sheet/',
    title: 'Speaker One-Sheet',
    meta: 'One page, and a PDF',
    body: (
      <>
        The whole argument on one page: the program, the credentials, the client
        roster, the fees and travel, and the number to call. There is a PDF of it
        for the person on the committee who was not in the meeting.
      </>
    ),
  },
] as const;

/**
 * The signature program, titled in 2023. Six words, and the sixth one hides its
 * "ation" inside "nations", which is the joke the source never explains.
 */
const ations = [
  'Immigration',
  'Population',
  'Regulation',
  'Confrontation',
  'Inflation',
  'Threats from other nations',
] as const;

export default function SpeakingPage() {
  const reviews = testimonialsFor('/speaking/');

  return (
    <>
      <JsonLd schema={breadcrumbs} id="speaking-breadcrumbs" />

      <Hero
        id="speaking"
        eyebrow="Speaking"
        title="Hire a Speaker that Works for YOU."
        titleSize="5xl"
        /* NOT the biography's opening sentence. "Damian speaks on the two
           subjects he knows best: Business and Agriculture" is verbatim from
           `_source/pages/keynote.md:183` and /about/ owns the biography that
           sentence opens, so the same ten words were introducing Damian on two
           routes. The Fortune 500 quit is spoken for by
           /do-business-better-podcast/, whose whole premise is that quit.

           This route is the hub. Its job is routing, and the deck now does the
           routing job: what a meeting planner can settle here, and the promise
           that gets them to the four cards below. */
        deck="You have a date, a room, and a budget, and you need somebody who won’t bore the people in it. Damian has been that answer 2,400 times since 1994, and he works the program out with you before he writes a word of it."
        actions={[
          { label: 'Check your event date', href: '/contact-us/' },
          { label: 'See the keynote program', href: '/keynote/' },
        ]}
        image={{
          src: '/img/photos/portrait-black-suit.jpg',
          alt: imageAlt['/img/photos/portrait-black-suit.jpg'],
          width: 1333,
          height: 2000,
          feature: true,
        }}
        /* The cutline used to end on "Fees get quoted when you ask, and they're
           NET to him", which is one of three NET statements this 723-word route
           was making. The booking band at the foot of the page is the one that
           keeps it. A cutline should carry what its own photograph supports. */
        cutline="Damian Mason. Keynote, breakout, luncheon, or panel: four ways clients have booked him, and no tie in any of them."
      />

      <StatRow
        id="record"
        eyebrow="The record"
        title="Since 1994"
        /* Navy. Every route on this site closes on a `deep` CTA band, and
           most of them had no dark ground at all before it: the reader got two
           greys 1.11:1 apart for thousands of pixels and then one arrival. A
           ledger is the right block to punctuate with, because it is the one
           thing on a page that is pure proof, and `deep-alt` is a step off the
           closing band so the close still reads as an arrival rather than a
           repeat.

           It also moves the orange plus glyphs out of a documented exception:
           on a light ground --ink-hot measures 2.72:1 and only ships because it
           is aria-hidden, and in a deep scope it remaps to orange-400 at
           5.60:1, where the brand orange is legal as a letterform. */
        surface="deep-alt"
        /* This was a hand-typed near-copy of the shared default that / and
           /keynote/ were both rendering, so the same figures ran three times
           across three routes in almost the same words. It also restated the
           four glyphs directly above it, and this route already spends the
           2,400 count in its hero deck ("Damian has been that answer 2,400
           times since 1994"). This says what the record is evidence OF, which
           is what a hub page owes a reader deciding where to click. */
        restatement="Know the industry cold, then be funny about it. That order is the whole trick, and it’s the reason your growers stay in their seats."
      />

      {/* The proof of the ledger's second glyph, and the reason it rides the
          same navy band rather than opening a new one: "50 / STATES" is a
          number a reader has to take on trust, and this is the same claim laid
          out so it can be counted instead.

          It carries no folio deliberately. The numbered sections on this route
          are the five that a reader navigates between; this is a rider on the
          ledger above it, the same way the StatRow's own title is. */}
      <CoverageGrid
        id="coverage"
        /* Navy, and `seam`, because this graphic is a rider on the ledger
           above it rather than a band of its own: "50 / STATES" is a number a
           reader has to take on trust and this is the same claim laid out so it
           can be counted. Fifty hairline tiles in navy-450 carrying stone-100
           postal codes is also the best this component will ever look, which is
           the second reason it moved rather than the first. */
        surface="deep-alt"
        seam
        density="tight"
        eyebrow="Coverage"
        title="Fifty states. Count them."
        intro="Fifty squares, fifty states. He’s worked in all of them since 1994, so whichever state your meeting is in, Damian has already worked in it. Run a finger down a column and check."
        /* The honesty slot. Two true things next to each other, and stop:
           there are seven more countries, and not one file in the source names
           a single one of them. See docs/OPEN-ITEMS.md item 22. */
        cutline="Seven countries beyond the United States, since 1994. Ask Damian’s office for the current list."
      />

      <Section id="routes" aria-labelledby="routes-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>The speaking file</Eyebrow>
            <Heading level={2} size="2xl" id="routes-title">
              Start where your question is.
            </Heading>
          </div>

          <ul className={cx('dm-grid12', styles.cards)} role="list">
            {childRoutes.map((route) => (
              <li key={route.href} className="col-span-6">
                <Card variant="ruled" className={styles.card}>
                  <Eyebrow>{route.meta}</Eyebrow>
                  <Heading level={3} size="xl">
                    <Link className={cx('dm-link-bare', styles.cardLink)} href={route.href}>
                      {route.title}
                    </Link>
                  </Heading>
                  <Prose measure="full">
                    <p>{route.body}</p>
                  </Prose>
                </Card>
              </li>
            ))}
          </ul>

          {/* docs/OPEN-ITEMS.md item 4 asks the client for "live-event
              photography from the back of the room with the audience in
              frame", and records that the site runs on a handful of frames of
              it. The site already had one. It was panel 3 of
              speaking-collage.png, a four-up composite the content manifest
              described as "wide room shots", so for seven phases nobody
              opened it. Harvested by CROPS in scripts/normalize-assets.mjs.

              It belongs on this route because this is the page that answers
              "what is it like when he shows up", and a photograph taken from
              row four answers that in a way a stage portrait cannot: it shows
              the room, not the speaker. */}
          <figure className={cx('dm-figure', styles.roomFigure)}>
            <div className="dm-photo dm-photo--plate">
              <Image
                className="dm-photo__img"
                src="/img/photos/tradeshow-floor-audience.png"
                alt="A panel session on a trade show floor seen from behind a seated audience, five men on stools in front of a NACHURS booth, other exhibitors either side."
                width={640}
                height={498}
                loading="lazy"
                sizes="(min-width: 64rem) 84rem, 100vw"
              />
            </div>
            <figcaption className="dm-figure__caption">
              A trade show floor, seen from row four. Every one of those chairs was a
              decision somebody made about how to spend an hour.
            </figcaption>
          </figure>
        </Container>
      </Section>

      <Section id="ations" surface="sunken" aria-labelledby="ations-title">
        <Container>
          <div className={cx('dm-grid12', styles.ations)}>
            <div className={cx(styles.ationsBody, 'col-span-6 md:col-span-7')}>
              <Eyebrow>The signature program</Eyebrow>
              <Heading level={2} size="2xl" id="ations-title">
                The “Ations” of Agriculture
              </Heading>

              <Prose measure="full">
                {/* Two source sentences came out of this paragraph because
                    /keynote/ carries both verbatim: "Beginning in 2023 Damian
                    titled the program The 'Ations' of Agriculture" and the
                    "connects the dots from consumer issues to regulation to
                    political movements to societal changes" run. This route
                    links there; it does not need to be there. */}
                <p>
                  He named the program in 2023, and the name is the argument: the words
                  ending in “ation” that are going to decide what Agriculture looks like
                  next. Fast paced and humor infused, which is the only way anybody sits
                  through a list like this.
                </p>
              </Prose>

              <ul className={styles.ationsList} role="list">
                {ations.map((subject) => (
                  <li key={subject} className={styles.ationsItem}>
                    <span>{subject}</span>
                  </li>
                ))}
              </ul>

              <Prose measure="full">
                <p>
                  {/* The eating-and-clearing caveat is the source's own
                      sentence and it belongs to the FAQ, which /, /keynote/ and
                      /meeting-coordinators/ all carry verbatim. It was running
                      on five routes. This one is not a booking page. */}
                  Then he brings every one of them back to your crowd and makes it about
                  them. Presentations run 60 to 90 minutes, and he also delivers breakouts,
                  luncheons, and panel discussions.
                </p>
              </Prose>

              <div className={styles.actions}>
                <Button href="/keynote/" variant="secondary" size="lg">
                  See the keynote program
                </Button>
              </div>
            </div>

            <figure className={cx('dm-figure', styles.plate, 'col-span-6 md:col-span-5')}>
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/keynote-stage-podium.jpg"
                  alt={imageAlt['/img/photos/keynote-stage-podium.jpg']}
                  width={2000}
                  height={1500}
                  loading="lazy"
                  sizes="(min-width: 48rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                InSite CDM Winter Forum, 2023. The lectern is right there. He isn’t
                standing behind it.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      <Section id="reviews" aria-labelledby="reviews-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Reviews</Eyebrow>
            <Heading level={2} size="2xl" id="reviews-title">
              Three of them, in writing.
            </Heading>
            <Prose>
              <p>
                All fifteen written speaking testimonials and four source-page videos are
                on the testimonials page. Start with these three.
              </p>
            </Prose>
          </div>

          <TestimonialGrid items={reviews} columns={3} label="Speaking testimonials" />

          <div className={`${styles.actions} dm-section-close`}>
            <Button href="/reviews/" variant="secondary" size="lg">
              Read all fifteen written testimonials
            </Button>
          </div>
        </Container>
      </Section>

      <LogoWall
        id="clients"
        surface="sunken"
        eyebrow="Clients"
        title="Who hires him"
        /* The second sentence here used to read "That's 21 marks out of 2,400+
           audiences since 1994", which is precisely what the "25 OF 2,400+"
           counter glyph directly above the wall already says. Round 3 named
           that pattern on /podcasts/ (a prose restatement sitting under a glyph
           that already carries the figure) and the same rule applies here.
           Home's wall makes the point with the roster alone. What is kept is
           the Farm Bureau fact, which the glyph cannot carry. */
        intro="John Deere, Cargill, BASF, Merck, Land O’Lakes Purina, CLAAS, Pioneer Seeds, and Wilbur-Ellis have all booked him, and so have three state Farm Bureaus."
      />

      {/* The wall answers WHO. This answers what kind, and how many.

          25 marks in a grid tell a reader that 25 organisations booked him.
          What a meeting planner is actually deciding is whether THEIR kind of
          organisation booked him, and a grid of logos cannot answer that: it
          asks them to recognise 25 brands and do the sorting themselves. The
          ledger does the sorting and stays checkable, because it prints the
          members of every row.

          Every value is derived from content/clients.ts, the same generated
          list the wall renders, so the two cannot disagree. */}
      {/* aria-labelledby, not aria-label. The section used to carry an
          aria-label and no heading at all, so the ledger sat under a mono
          eyebrow doing a heading's job. See the note in ClientSectors.tsx. */}
      <Section
        id="sectors"
        surface="sunken"
        density="tight"
        aria-labelledby="sectors-title"
      >
        <Container>
          <ClientSectors
            titleId="sectors-title"
            eyebrow="The roster by kind"
            title="25 clients, six kinds of business."
            /* The finding, stated once, in the place a reader meets the ledger.
               It reports only the source-backed sector split and makes no
               inference about which clients hold annual meetings. */
            intro="The wall above answers who. This answers what kind. Ten of the 25 are commodity groups, trade associations, or Farm Bureaus. The other fifteen are input suppliers, ag lenders and insurers, grain, livestock, and produce businesses, and equipment makers."
          />
        </Container>
      </Section>

      <CTABand
        id="booking"
        eyebrow="Booking"
        heading="Check the date first."
        /* THE ONE BOOKING STATEMENT ON THIS ROUTE. The page carried three NET
           statements and two contract-and-deposit statements across 723 words,
           none of them the verbatim FAQ, which this route does not render. This
           band sits in the booking section and is the natural home, so the
           hero cutline, the Meeting Coordinators card and the "Ations" section
           all gave theirs up to it. Do not add a second one anywhere on this
           file. */
        copy="You sign a short contract, send a deposit to hold the date, and settle the rest on the day. Fees are quoted when you inquire, and they’re NET to him."
        actions={[
          { label: 'Check your event date', href: '/contact-us/' },
          {
            label: 'Email the office',
            href: `mailto:${contact.email}`,
            variant: 'secondary',
          },
        ]}
        panel={{
          eyebrow: 'Track record',
          value: '2,400',
          plus: true,
          label: 'Audiences since 1994',
          note: 'Repeat business is the hallmark of a professional like Damian.',
        }}
      />
    </>
  );
}

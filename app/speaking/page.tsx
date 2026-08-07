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
    meta: 'Ten written, four on video',
    /* The client roll call belongs to /reviews/, whose deck and meta
       description both open on it. A card that sends the reader there does not
       need to be that page. */
    body: (
      <>
        Ten notes in writing and four on camera, sent by the people who signed the
        contract. Read them before you decide what the hour is worth.
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
        commentary, brand promotion. Ten brands already sponsor the show, and Cheddar News,
        NewsmaxTV and Straight Arrow News have all put him on air.
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
        }}
        cutlineFolio="Fig. 01"
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
        surface="sunken"
        /* This was a hand-typed near-copy of the shared default that / and
           /keynote/ were both rendering, so the same figures ran three times
           across three routes in almost the same words. It also restated the
           four glyphs directly above it, and this route already spends the
           2,400 count in its hero deck ("Damian has been that answer 2,400
           times since 1994"). This says what the record is evidence OF, which
           is what a hub page owes a reader deciding where to click. */
        restatement="Know the industry cold, then be funny about it. That order is the whole trick, and it’s the reason your growers stay in their seats."
      />

      <Section id="routes" aria-labelledby="routes-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>The speaking file</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 01" id="routes-title">
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
        </Container>
      </Section>

      <Section id="ations" surface="sunken" aria-labelledby="ations-title">
        <Container>
          <div className={cx('dm-grid12', styles.ations)}>
            <div className={cx(styles.ationsBody, 'col-span-6 md:col-span-7')}>
              <Eyebrow>The signature program</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 02" id="ations-title">
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
                {ations.map((subject, index) => (
                  <li key={subject} className={styles.ationsItem}>
                    <span className={styles.ationsIndex} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
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
                <span className="dm-figure__folio">Fig. 02 </span>
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
            {/* "Meeting planners book Damian twice. Here's what they said the
                first time." is VOICE.md section 6, Pair 4, written for the
                /reviews/ intro. /reviews/ still opens on it. Two routes cannot
                both open on the same worked example. */}
            <Heading level={2} size="2xl" folio="No. 03" id="reviews-title">
              Three of them, in writing.
            </Heading>
            <Prose>
              <p>
                Ten written notes and four video testimonials are on the testimonials
                page. Start with these.
              </p>
            </Prose>
          </div>

          <TestimonialGrid items={reviews} columns={3} label="Speaking testimonials" />

          <div className={`${styles.actions} dm-section-close`}>
            {/* Not "all": /reviews/ carries the ten written notes and the four
                videos, and three more testimonials are quoted on /keynote/,
                /speaking/ and /collaboration-opportunities/. The label says
                what that page holds instead of implying it holds every one. */}
            <Button href="/reviews/" variant="secondary" size="lg">
              Read the ten written reviews
            </Button>
          </div>
        </Container>
      </Section>

      <LogoWall
        id="clients"
        surface="sunken"
        eyebrow="Clients"
        title="Who hires him"
        folio="No. 04"
        /* The second sentence here used to read "That's 21 marks out of 2,400+
           audiences since 1994", which is precisely what the "21 OF 2,400+"
           counter glyph directly above the wall already says. Round 3 named
           that pattern on /podcasts/ (a prose restatement sitting under a glyph
           that already carries the figure) and the same rule applies here.
           Home's wall makes the point with the roster alone. What is kept is
           the Farm Bureau fact, which the glyph cannot carry. */
        intro="Cargill, Merck, Land O’Lakes Purina, CLAAS, Pioneer Seeds, and Wilbur-Ellis have all booked him, and so have three state Farm Bureaus."
      />

      <CTABand
        id="booking"
        eyebrow="Booking"
        heading="Check the date first."
        folio="No. 05"
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
          eyebrow: 'Repeat business',
          value: '2,400',
          plus: true,
          label: 'Audiences since 1994',
          /* The bureau sentence is the FAQ's own answer and it is verbatim on
             /, /keynote/ and /meeting-coordinators/, plus /contact-us/ in
             prose. This panel's eyebrow is "Repeat business", so the note now
             carries the thing that number is evidence of. */
          note: 'The number that matters underneath it is how many of those rooms booked him a second time.',
        }}
      />
    </>
  );
}

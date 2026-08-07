import Image from 'next/image';
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
  title: 'Speaking',
  description:
    'Everything a meeting planner needs to book Damian Mason: the keynote program, client reviews, fees and travel, and the ways to work with him off the stage.',
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
        Sixty to ninety minutes of forward looking Ag commentary, delivered with humor. He
        connects the dots from consumer issues to regulation to political movements to
        societal changes, and what all of it means for your industry. Keynote not enough?
        He’ll also do breakouts, luncheons, and panel discussions.
      </>
    ),
  },
  {
    href: '/reviews/',
    title: 'Testimonials',
    meta: 'Ten written, four on video',
    body: (
      <>
        Reviews from Michael Foods, Bayer, Farm Credit West, AgroLiquid, Micronutrients and
        BW Fusion, plus four video testimonials. Meeting planners book Damian twice. Here’s
        what they said the first time.
      </>
    ),
  },
  {
    href: '/meeting-coordinators/',
    title: 'Meeting Coordinators',
    meta: 'Contract, travel, technology',
    body: (
      <>
        Damian books his own airfare and rental car. His office manager Lori handles
        everything after that. You’ll get a simple contract, a small deposit to hold the
        date, and fees that are NET to him. First step: check that he has your date open.
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
        commentary, brand promotion. More than 40,000 people listen every month, and they
        work in the business you sell into. If your brand belongs in front of them, let’s
        talk.
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
        deck="Damian speaks on the two subjects he knows best: Business and Agriculture. He quit a Fortune 500 job in 1994 to do it, and he hasn’t stopped since. He works directly with you on the mix of humor, content, and take-away value your crowd needs."
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
          { label: 'See the keynote', href: '/keynote/' },
        ]}
        image={{
          src: '/img/photos/portrait-black-suit.jpg',
          alt: 'Damian Mason in a dark suit jacket and open collar, arms folded, facing the camera.',
          width: 1333,
          height: 2000,
        }}
        cutlineFolio="Fig. 01"
        cutline="He wears the jacket for the headshot. He works the stage in jeans."
      />

      <StatRow
        id="record"
        eyebrow="The record"
        title="Since 1994"
        surface="sunken"
        restatement="Over 2,400 audiences in all 50 states and 7 foreign countries. Another 40,000 people listen to the podcast every month."
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
                    <a className={cx('dm-link-bare', styles.cardLink)} href={route.href}>
                      {route.title}
                    </a>
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
                <p>
                  Beginning in 2023 Damian titled the program The “Ations” of Agriculture.
                  The subject is what’s coming at the business of food, fuel, and fiber:
                  fast paced, humor infused, connecting the dots from consumer issues to
                  regulation to political movements to societal changes. Six words carry
                  it.
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
                  Then he brings every one of them back to your crowd and makes it about
                  them. Presentations run 60 to 90 minutes. He also delivers breakouts,
                  luncheons, and panel discussions, and he won’t speak while people are
                  eating or tables are being cleared.
                </p>
              </Prose>

              <div className={styles.actions}>
                <Button href="/keynote/" variant="secondary" size="lg">
                  Read the keynote page
                </Button>
              </div>
            </div>

            <figure className={cx('dm-figure', styles.plate, 'col-span-6 md:col-span-5')}>
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/keynote-stage-podium.jpg"
                  alt="Damian Mason on stage beside a lectern at the InSite CDM 2023 Winter Forum, one arm out toward the audience."
                  width={2000}
                  height={1500}
                  loading="lazy"
                  sizes="(min-width: 48rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 02 </span>
                InSite CDM Winter Forum, 2023. The lectern is right there. He is not
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
            <Heading level={2} size="2xl" folio="No. 03" id="reviews-title">
              Meeting planners book Damian twice.
            </Heading>
            <Prose>
              <p>Here’s what they said the first time.</p>
            </Prose>
          </div>

          <TestimonialGrid items={reviews} columns={3} label="Speaking testimonials" />

          <div className={styles.actions}>
            <Button href="/reviews/" variant="secondary" size="lg">
              Read all the reviews
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
        intro="Cargill, Merck, Land O’Lakes Purina, CLAAS, Pioneer Seeds, and Wilbur-Ellis have all booked him, and so have three state Farm Bureaus. That’s 21 marks out of 2,400 audiences since 1994."
      />

      <CTABand
        id="booking"
        eyebrow="Booking"
        heading="Check the date first."
        folio="No. 05"
        copy="Damian books most of his events directly with his clients. A simple contract and a small deposit hold your date, and the rest is due the day of the event. Fees are quoted when you inquire, and they’re NET to him."
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
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
          note: 'We do have a few bureaus we have worked with successfully over the years, but we do not endorse them. Booking direct works better.',
        }}
      />
    </>
  );
}

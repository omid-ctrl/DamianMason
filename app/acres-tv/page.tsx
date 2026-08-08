import type { Metadata } from 'next';
import Image from 'next/image';

// components/sections has no index.ts barrel yet, so these import by file.
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { StatRow, type StatRowItem } from '@/components/sections/StatRow';
import { JsonLd } from '@/components/seo';
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
import { mediaBand } from '@/content/media-band';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

/* ==========================================================================
   Constants
   ========================================================================== */

const ACRES_TV_URL = 'https://www.watchacrestv.com/damianmason';
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * The old page carried its entire episode listing inside one 1,692 by 1,852
 * macOS screenshot weighing 1.0 MB, so none of it was text: not to a screen
 * reader, not to a crawler, not to anybody on a phone. DESIGN_SYSTEM 6.4.2 says
 * to replace a screenshot slot with a typographic treatment, so every title,
 * guest and runtime below was transcribed from that same capture and nothing
 * was added to it. Two titles carried em dashes and are set with a colon, which
 * is the substitution recorded in docs/build/STATE.md.
 */
const episodes = [
  {
    index: '01',
    title: 'Are These Good Times For Real, And For How Long?',
    guest: 'Arlan Suderman',
    runtime: '42:01',
  },
  {
    index: '02',
    title: 'Online Ag Input Retailing: Is This Where We’re Headed?',
    guest: 'Lance Ramthun',
    runtime: '46:08',
  },
  {
    index: '03',
    title: 'The Future of Ag Is De-Globalized',
    guest: 'Todd Thurman',
    runtime: '54:17',
  },
  {
    index: '04',
    title: 'Why North American Ag Must Wean Itself Off China',
    guest: 'Damian Mason',
    runtime: '41:21',
  },
  {
    index: '05',
    title: 'Private Equity Focused on Funding Agriculture',
    guest: 'Jim Schultz',
    runtime: '46:28',
  },
  {
    index: '06',
    title:
      'Managing For The Future: A Candid Conversation with 30 Year Old 4th Gen Farmer',
    guest: 'Luke Roush',
    runtime: '48:06',
  },
] as const;

/* ==========================================================================
   Metadata
   ========================================================================== */

export const metadata: Metadata = buildMetadata({
  title: 'Acres TV: Business of Agriculture',
  description:
    'Acres TV is the streaming format built for Ag programming, and Business of Agriculture is a top-rated show on it. Six episodes run 41 to 54 minutes.',
  path: '/acres-tv/',
  image: {
    url: '/img/photos/acres-tv-arlan-suderman.png',
    width: 1320,
    height: 732,
    alt: 'Damian Mason and market analyst Arlan Suderman on a split screen, recording a Business of Agriculture episode for Acres TV.',
  },
});

/* ==========================================================================
   Page
   ========================================================================== */

/**
 * Derived from `episodes` above so the ledger and the list cannot disagree.
 * The guest count excludes Damian: episode 04 is him alone, which the source
 * capture records by naming him in the guest column, and counting the host as
 * a guest of his own show would be a small lie in a figure.
 */
const ACRES_STATS: StatRowItem[] = [
  { value: String(episodes.length), label: 'Episodes' },
  {
    value: String(new Set(episodes.map((e) => e.guest).filter((g) => g !== 'Damian Mason')).size),
    label: 'Guests',
  },
  {
    value: String(Math.min(...episodes.map((e) => Number(e.runtime.split(':')[0])))),
    label: 'Shortest, in minutes',
  },
  {
    value: String(Math.max(...episodes.map((e) => Number(e.runtime.split(':')[0])))),
    label: 'Longest, in minutes',
  },
];

export default function AcresTvPage() {
  return (
    <>
      {/* ------------------------------------------------------------------
          Hero. The source H1 was a 130 character sentence wrapped in <b>; the
          claim it carries is kept word for word in the deck and the heading is
          cut down to something a heading can actually be.

          THE STOCK PHOTOGRAPH IS GONE, and the note that used to sit here is
          the reason. It read: "the photograph is stock and it documents
          nothing, so the cutline makes no claim about it". That was an honest
          description of a defect, not a defence of one, and it stood only
          because the archive had nothing better. The media-kit rescue has a
          photograph of the actual apparatus: Damian at a desk, behind a boom
          microphone, lit for camera. That is what a streaming show is made on.

          The variant changes with it. `band` puts the frame full-bleed behind
          reversed type at the 0.62 veil, which tokens.css is explicit costs
          nothing "because both band consumers carry microphones-background.jpg
          and there is no colour in it to lose". A real colour frame in a band
          WOULD lose its colour, so this is a portrait plate at the 0.20 veil
          instead. microphones-background.jpg still ships and still runs on
          /meeting-coordinators/, where it is a mood band under a heading and
          not a claim about a room.
          ------------------------------------------------------------------ */}
      <Hero
        id="acres-tv"
        eyebrow="Media: Acres TV"
        title={
          <>Damian&rsquo;s Business of Agriculture streams on Acres&nbsp;TV.</>
        }
        deck={
          <>
            <p>
              It&rsquo;s a top-rated show on Acres TV, the streaming format
              dedicated to Agricultural programming. Episodes run 41 to 54
              minutes. You get the whole conversation, not a 90 second clip.
            </p>
          </>
        }
        actions={[
          {
            label: 'Find Damian on Acres TV',
            href: ACRES_TV_URL,
            ...EXTERNAL,
          },
          {
            label: 'Hear the podcast',
            href: '/the-business-of-agriculture/',
            variant: 'secondary',
          },
        ]}
        image={{
          src: '/img/photos/podcast-desk.jpg',
          alt: imageAlt['/img/photos/podcast-desk.jpg'],
          width: 2000,
          height: 1308,
          priority: true,
          feature: true,
        }}
        cutline="Damian and his guest talk for 41 to 54 minutes, and Acres TV carries all of it."
      />

      {/* ------------------------------------------------------------------
          No. 01 What Acres TV is. The old page never said, so this is the one
          section that adds prose, and it adds only what the platform and the
          source screenshot already state.
          ------------------------------------------------------------------ */}
      <Section id="what-it-is" aria-labelledby="what-it-is-title">
        <Container>
          <div className={cx('dm-grid12', styles.splitRow)}>
            {/* The heading leads in the DOM so the stacked mobile order reads
                title, prose, figure. `lg:order-first` puts the mark back on the
                left once there are two columns to play with. */}
            <div
              className={cx(
                styles.stack,
                'col-span-6 md:col-span-12 lg:col-span-7',
              )}
            >
              <Heading level={2} size="2xl" id="what-it-is-title">
                A streaming service for one industry.
              </Heading>
              <Prose>
                <p>
                  Acres TV streams Agricultural programming and nothing else.
                  Its tagline is &ldquo;Committed to Agriculture.&rdquo;
                  Damian&rsquo;s Business of Agriculture is one of the top-rated
                  shows on the platform, and the guest list runs from market
                  analyst Arlan Suderman to 30 year old fourth generation farmer
                  Luke Roush.
                </p>
                <p>
                  You don&rsquo;t need another Ag show reading you the weather
                  forecast. Technology does that. What you need is the
                  conversation that happens after it, and that&rsquo;s what the
                  show is.
                </p>
              </Prose>
            </div>

            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-5 lg:order-first" data-reveal="wipe">
              <Card variant="plate" className={styles.brandPlate}>
                <Image
                  src="/img/photos/acres-tv-lockup.png"
                  alt="Acres TV logo: the wordmark above a green rolling fields mark, with the tagline Committed to Agriculture."
                  width={670}
                  height={366}
                  loading="lazy"
                  sizes="(min-width: 64rem) 30rem, 100vw"
                />
              </Card>
              <figcaption className="dm-figure__caption">
                The Acres TV mark. Green fields, a black studio, and a tagline
                that leaves no doubt about the audience.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------
          No. 02 The episode ledger, transcribed out of the screenshot.
          ------------------------------------------------------------------ */}
      {/* Every figure here is arithmetic on the `episodes` array above, which
          was transcribed from the source screenshot, so the ledger cannot state
          anything the list does not. The runtime range is quoted in the prose
          two sections up and never shown; this is where it becomes a figure.

          Navy. This route had one dark ground and it was the hero's, which is
          now a light portrait plate, so without this it would run 4,894px of
          two greys into its closing band. */}
      <StatRow
        id="record"
        surface="deep-alt"
        eyebrow="What is up there"
        title="Six conversations, in full"
        items={ACRES_STATS}
        restatement="Long-form is the point. Nobody gets a straight answer out of a market analyst in ninety seconds, which is roughly the whole reason this show exists."
      />

      <Section id="episodes" surface="sunken" aria-labelledby="episodes-title">
        <Container>
          <div className={cx('dm-grid12', styles.splitRow)}>
            <div
              className={cx(
                styles.stack,
                'col-span-6 md:col-span-12 lg:col-span-7',
              )}
            >
              <Heading level={2} size="2xl" id="episodes-title">
                Episodes streaming now.
              </Heading>
              <Prose measure="wide">
                <p>
                  Every one of these streams on Acres TV. The shortest runs 41
                  minutes, the longest runs 54, and that&rsquo;s about how long
                  it takes to get a straight answer out of a market analyst or a
                  fourth generation farmer.
                </p>
              </Prose>
            </div>

            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-5" data-reveal="wipe">
              <div className={cx('dm-figure__media', styles.evidence)}>
                <Image
                  src="/img/photos/acres-tv-arlan-suderman.png"
                  alt="Damian Mason and market analyst Arlan Suderman on a split screen under a Business of Agriculture header, each captioned with their name."
                  width={1320}
                  height={732}
                  loading="lazy"
                  sizes="(min-width: 64rem) 30rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                Damian and market analyst Arlan Suderman, 42 minutes on whether the
                good times are real and how long they last.
              </figcaption>
            </figure>
          </div>

          <ul className={cx('dm-grid12', styles.ledger)}>
            {episodes.map((episode) => (
              <li
                key={episode.index}
                className="col-span-6 md:col-span-6 lg:col-span-4"
              >
                <Card variant="ruled" className={styles.episode}>
                  <p className={styles.episodeMeta}>
                    <Eyebrow inline tone="faint" aria-hidden="true">
                      {episode.index}
                    </Eyebrow>
                    <Eyebrow inline>Runs {episode.runtime}</Eyebrow>
                  </p>
                  <Heading level={3} size="lg">
                    {episode.title}
                  </Heading>
                  <Eyebrow>With {episode.guest}</Eyebrow>
                </Card>
              </li>
            ))}
          </ul>

          <div className={`${styles.ledgerAction} dm-section-close`}>
            <Button href={ACRES_TV_URL} variant="secondary" size="lg" {...EXTERNAL}>
              Watch every episode
            </Button>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------
          No. 03 Join the Conversation. Source section 5, with the href it
          already had. /xtreme-ag/ ships the same band with an empty href and
          this page is the reference for where it should point.
          ------------------------------------------------------------------ */}
      <Section id="join" density="tight" aria-labelledby="join-title">
        <Container>
          <div className={cx('dm-grid12', styles.splitRow)}>
            <div
              className={cx(
                styles.stack,
                'col-span-6 md:col-span-12 lg:col-span-7',
              )}
            >
              <Heading level={2} size="2xl" id="join-title">
                Join the Conversation
              </Heading>
              <Prose>
                <p>{mediaBand.mailingListBlurb}</p>
              </Prose>
              <Button href="/join-the-conversation/" variant="secondary" size="lg">
                {mediaBand.mailingListLabel}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------
          No. 04 The close. Source section 4, byte-identical to the same band on
          /xtreme-ag/, and now literally the same strings: both routes read them
          out of content/media-band.ts. This copy used to be typed out here in
          sentence case while /xtreme-ag/ carried the source's Title Case, so
          one band rendered two ways one nav click apart.
          ------------------------------------------------------------------ */}
      <CTABand
        id="inquire"
        eyebrow={mediaBand.eyebrow}
        heading={mediaBand.heading}
        actions={[
          {
            label: mediaBand.inquireLabel,
            href: '/contact-us/',
          },
        ]}
      />

      <JsonLd
        schema={buildBreadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Media', path: '/blog-news/' },
          { name: 'Acres TV', path: '/acres-tv/' },
        ])}
      />
    </>
  );
}

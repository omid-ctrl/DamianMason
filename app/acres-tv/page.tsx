import type { Metadata } from 'next';
import Image from 'next/image';

// components/sections has no index.ts barrel yet, so these import by file.
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
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

export default function AcresTvPage() {
  return (
    <>
      {/* ------------------------------------------------------------------
          No. 00 Hero. The source ran a stock "microphones on a stand" photo as
          the section background, so it stays, as the band image it always was.
          The source H1 was a 130 character sentence wrapped in <b>; the claim
          it carries is kept word for word in the deck and the heading is cut
          down to something a heading can actually be.

          The photograph is stock and it documents nothing, so the cutline makes
          no claim about it and the alt text says only what is in the frame. It
          used to ship alt="" beside a cutline that described the picture, which
          handed a screen reader a caption for an image it was told to ignore.
          Same alt string as the same file on /meeting-coordinators/.
          ------------------------------------------------------------------ */}
      <Hero
        variant="band"
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
          src: '/img/photos/microphones-background.jpg',
          alt: imageAlt['/img/photos/microphones-background.jpg'],
          width: 2000,
          height: 1334,
          priority: true,
        }}
        cutlineFolio="Fig. 01"
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
              <Heading level={2} size="2xl" folio="No. 01" id="what-it-is-title">
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

            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-5 lg:order-first">
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
                <span className="dm-figure__folio">Fig. 02 </span>
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
      <Section id="episodes" surface="sunken" aria-labelledby="episodes-title">
        <Container>
          <div className={cx('dm-grid12', styles.splitRow)}>
            <div
              className={cx(
                styles.stack,
                'col-span-6 md:col-span-12 lg:col-span-7',
              )}
            >
              <Heading level={2} size="2xl" folio="No. 02" id="episodes-title">
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

            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-5">
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
                <span className="dm-figure__folio">Fig. 03 </span>
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
              <Heading level={2} size="2xl" folio="No. 03" id="join-title">
                Join the Conversation
              </Heading>
              <Prose>
                <p>
                  Add yourself to the list and you&rsquo;ll hear when a new
                  episode posts, plus where Damian is speaking next. One email,
                  not five.
                </p>
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
        folio="No. 04"
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

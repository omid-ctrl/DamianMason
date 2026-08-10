import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Rule,
  Section,
} from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { EmbedFacade } from '@/components/sections/EmbedFacade';
import { EpisodeCard } from '@/components/sections/EpisodeCard';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { SponsorWall } from '@/components/sections/SponsorWall';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { JsonLd } from '@/components/seo';
import { brandAssets } from '@/content/brand-assets';
import { uprooted } from '@/content/current-media';
import { contact, podcasts, socials } from '@/content/site';
import { testimonialsFor } from '@/content/testimonials';
import {
  buildBreadcrumbListSchema,
  buildBusinessOfAgricultureSchema,
  buildPodcastEpisodeSchema,
} from '@/lib/schema';
import {
  getRecentBusinessOfAgricultureEpisodes,
  podcastEpisodeExcerpt,
} from '@/lib/podcast-feed';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

const ROUTE = '/the-business-of-agriculture/';

const show = podcasts.businessOfAgriculture;

/**
 * The old page linked two different Spotify shows from the same document:
 * 0UDXsogtCT4uNF4CpDpUae in the "Listen Now" row and 5rSDDoG9qMqkSo3gp6qFDq in
 * the "Start Listening Today!" row. Everything else matched across the two
 * rows. Consolidated here to the id that content/site.ts holds, and there is
 * exactly one platform row on this page instead of two.
 */
const youtubeHref = socials.find((social) => social.icon === 'youtube')?.href;

const platforms: { label: string; href: string }[] = [
  { label: 'Apple Podcasts', href: show.apple },
  { label: 'Spotify', href: show.spotify },
  ...(youtubeHref ? [{ label: 'YouTube', href: youtubeHref }] : []),
  { label: 'Every episode on Libsyn', href: show.showPage },
  { label: 'RSS feed', href: show.rss },
];

/**
 * The Libsyn embed, minus the two color parameters the old page carried. Those
 * hard-coded a green accent and a black font color that belong to nothing in
 * this design system, so the player is left on its own defaults.
 */
const LIBSYN_PLAYER =
  'https://play.libsyn.com/embed/destination/id/4323358/height/412/theme/modern/size/large/thumbnail/yes/playlist-height/200/direction/backward/download/yes';

/** The embed's own height, carried from the player URL so the box is reserved. */
const LIBSYN_PLAYER_HEIGHT = 412;

export const metadata: Metadata = buildMetadata({
  title: 'The Business of Agriculture Podcast',
  description:
    'Smart talk about the business of food, fuel, and fiber. New episodes every Monday, more than 40,000 listeners a month, and opinions Damian won’t soften.',
  path: ROUTE,
  image: {
    url: brandAssets.businessOfAgriculturePodcast,
    width: 800,
    height: 800,
    alt: imageAlt['/img/brand/business-of-agriculture-podcast.jpg'],
  },
});

export default async function BusinessOfAgriculturePage() {
  const listenerQuotes = testimonialsFor(ROUTE);
  const recentEpisodes = await getRecentBusinessOfAgricultureEpisodes(4);
  const latestEpisode = recentEpisodes[0];

  return (
    <>
      <JsonLd
        schema={[
          buildBusinessOfAgricultureSchema(),
          buildPodcastEpisodeSchema({
            name: latestEpisode.title,
            description: latestEpisode.description,
            url: latestEpisode.link,
            datePublished: latestEpisode.published,
            episodeNumber: latestEpisode.episodeNumber,
            duration: latestEpisode.duration,
            audioUrl: latestEpisode.enclosureUrl,
          }),
          buildBreadcrumbListSchema([
            { name: 'Home', path: '/' },
            { name: 'Podcasts', path: '/podcasts/' },
            { name: 'The Business of Agriculture', path: ROUTE },
          ]),
        ]}
      />

      {/* ==================================================================
          HERO
          The old hero pulled a CSS background from Podcaster-34c.png, a
          WP Engine staging URL that 404s and was never mirrored. It is not
          referenced here. The navy ground carries the reversed type on its
          own, which is what the near-black fallback was doing anyway.
          ================================================================== */}
      <Section
        id="podcast"
        aria-labelledby="podcast-title"
        surface="deep"
        density="loose"
        className="dm-hero"
      >
        <Container>
          <div className="dm-grid12 dm-hero__grid">
            <div className="dm-hero__type col-span-6 md:col-span-12 lg:col-span-7">
              <Eyebrow>New episodes every Monday</Eyebrow>

              <Heading level={1} display size="6xl" id="podcast-title">
                The Business of Agriculture Podcast
              </Heading>

              <Prose lead>
                <p>
                  Damian travels all over the globe talking to audiences about trends in the
                  business of food, fuel, and fiber. With his clever wit and down-to-earth
                  delivery, he has turned these topics into an interesting (and sometimes
                  controversial) podcast.
                </p>
                <p>
                  You don’t need more Ag people reading you the weather or the commodity
                  prices. Your phone does that. What you get here: named guests, real numbers,
                  and a host with strong opinions he isn’t afraid to share.
                </p>
              </Prose>

              <div className="dm-hero__actions">
                <Button
                  href={show.apple}
                  variant="secondary"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Listen on Apple Podcasts
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
                <Button
                  href={show.spotify}
                  variant="secondary"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Listen on Spotify
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              </div>
            </div>

            {/* The show art is a mark on an opaque white field, not a
                photograph, so it gets the bone plate rather than the duotone
                treatment. A mark inside a navy region sits on paper. */}
            <figure className={`${styles.artFigure} col-span-6 md:col-span-12 lg:col-span-5`}>
              <Section as="div" surface="paper" density="flush" className={styles.artPlate}>
                <Image
                  className={styles.art}
                  src={brandAssets.businessOfAgriculturePodcast}
                  alt={imageAlt['/img/brand/business-of-agriculture-podcast.jpg']}
                  width={800}
                  height={800}
                  preload
                  sizes="(min-width: 64rem) 32rem, (min-width: 48rem) 60vw, 100vw"
                />
              </Section>
              <figcaption className={`dm-figure__caption ${styles.artCutline}`}>
                Show art. A new episode lands every Monday.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ==================================================================
          RECENT EPISODES
          Hand-pasted on the old site and dated by the page's own JSON-LD.
          This is now a feed-backed discovery list: publication date, episode
          number, runtime, editorial summary and canonical link remain visible
          even before the optional archive player is loaded.
          ================================================================== */}
      <Section id="latest-episode" aria-labelledby="latest-episode-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.episodeRail} col-span-6 md:col-span-4`}>
              <Eyebrow>Live from the feed</Eyebrow>
              <Heading level={2} size="2xl" id="latest-episode-title">
                Recent episodes
              </Heading>
              <Prose measure="narrow">
                <p>
                  The newest conversations, with their publication dates, episode numbers,
                  runtimes, and summaries direct from Damian’s Libsyn feed.
                </p>
              </Prose>
              <Button
                href={show.showPage}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse the full archive
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            </div>

            <div className={`col-span-6 md:col-span-8 ${styles.episodeColumn}`}>
              <ol className={styles.episodeList} aria-label="Recent Business of Agriculture episodes">
                {recentEpisodes.map((episode, index) => (
                  <EpisodeCard
                    key={episode.link}
                    as="li"
                    title={episode.title}
                    href={episode.link}
                    date={episode.published}
                    duration={episode.duration}
                    episodeNumber={episode.episodeNumber}
                    show="The Business of Agriculture"
                    headingLevel={3}
                    layout="stacked"
                    description={
                      index === 0
                        ? episode.description
                        : podcastEpisodeExcerpt(episode.description)
                    }
                    platformLinks={[
                      { label: 'Episode details', href: episode.link },
                      ...(episode.enclosureUrl
                        ? [{ label: 'Direct MP3', href: episode.enclosureUrl }]
                        : []),
                    ]}
                  />
                ))}
              </ol>

              {/* The old page shipped "Episode Details" and "All Episodes" as
                  two buttons pointing at the identical URL. The canonical
                  episode links live above; the optional player exposes the
                  complete back catalog without JavaScript being required for
                  discovery. */}
              <div className={styles.player}>
                <EmbedFacade
                  src={LIBSYN_PLAYER}
                  title="The Business of Agriculture Podcast player"
                  height={LIBSYN_PLAYER_HEIGHT}
                  eyebrow="The full archive"
                  action="Load the player"
                >
                  Every episode, back to the first one.
                </EmbedFacade>
                <p className={`dm-figure__caption ${styles.playerCutline}`}>
                  The full archive, streaming straight from the Libsyn feed. Downloads are on.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ==================================================================
          WHERE TO LISTEN
          One platform row, not two, and every link has a real name. The old
          page shipped eight links whose only accessible name was "Follow".
          ================================================================== */}
      <Section
        id="listen"
        aria-labelledby="listen-title"
        surface="sunken"
      >
        <Container>
          {/* The stacked lockup, the second supplied Business of Agriculture
              mark. It is the show's name spelled out, which is the string the
              reader is about to search for, so it belongs on the subscribe
              band rather than next to the cover art it would duplicate. */}
          <Image
            className={styles.showLockup}
            src={brandAssets.businessOfAgriculture}
            alt="The Business of Agriculture Podcast with Damian Mason"
            /* 508x209 is what scripts/normalize-brand-art.mjs settled this file
               on. Do not restore 800x345: that canvas was 6 percent baked-in
               margin plus a 10,500 pixel grey ghost at 2 percent alpha, which
               the image optimizer amplified into a visible dirty rectangle
               beside the leaf. */
            width={508}
            height={209}
            loading="lazy"
            sizes="14rem"
          />

          <div className={styles.head}>
            <Eyebrow>Subscribe</Eyebrow>
            <Heading level={2} size="2xl" id="listen-title">
              Where to listen
            </Heading>
          </div>

          <Prose className={styles.intro}>
            <p>
              Find The Business of Agriculture Podcast with Damian Mason wherever you listen to
              your favorite podcasts. Pick your app, hit subscribe, and Monday takes care of
              itself.
            </p>
          </Prose>

          <ul className={styles.platforms} aria-label="Listen to The Business of Agriculture">
            {platforms.map((platform) => (
              <li key={platform.href}>
                <Button
                  href={platform.href}
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {platform.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ==================================================================
          SPONSORS
          The project supplies ten sponsor marks. The old page published four
          corresponding names as plain text links and showed no artwork.
          ================================================================== */}
      <SponsorWall
        id="sponsors"
        level={2}
        surface="deep-alt"
        meta={null}
        intro="Ten sponsor marks supplied for The Business of Agriculture, spanning crop protection, biologicals, farm data, transition planning, and agricultural investment."
      />

      {/* ==================================================================
          CROSS PROMO
          The old page's "Also, make sure to check out..." line. The self-link
          to www.damianmason.com is dropped: it pointed at the site the reader
          is already on, on the wrong host, guaranteeing a redirect hop.
          ================================================================== */}
      {/* Green. Same split as everywhere else: the band that talks about the
          shows and the land goes forest, the band that asks for the
          sponsorship stays navy. */}
      <Section id="elsewhere" aria-labelledby="elsewhere-title" surface="forest">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Elsewhere</Eyebrow>
            <Heading level={2} size="2xl" id="elsewhere-title">
              Also worth your time
            </Heading>
          </div>

          <Prose className={styles.intro}>
            <p>
              The Granary and Cutting The Curve are Damian’s work with XtremeAg. UPROOTED
              is his newer documentary-style series about the businesses, technology, and
              people changing farming.
            </p>
          </Prose>

          <ul className={styles.crossGrid}>
            <li className={styles.crossItem}>
              <div className={styles.crossMarkSlot}>
                <Image
                  className={styles.crossMark}
                  src={brandAssets.granary}
                  alt={imageAlt['/img/brand/the-granary.png']}
                  width={508}
                  height={388}
                  loading="lazy"
                  sizes="8rem"
                />
              </div>
              <Heading level={3} size="lg">
                The Granary
              </Heading>
              {/* "the XtremeAg crew" was an inference: no source says a crew
                  exists. The full sentence, "filmed with XtremeAg in a granary
                  turned tavern on Damian's Indiana farm", is /xtreme-ag/'s, and
                  that route states it twice already. This is a cross-promo
                  card, so it says who makes it and stops. */}
              <p>An XtremeAg show, shot on Damian’s Indiana farm.</p>
              <Button
                className={styles.crossAction}
                href={podcasts.xtremeAg.granary}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch at XtremeAg
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            </li>

            <li className={styles.crossItem}>
              <div className={styles.crossMarkSlot}>
                <Image
                  className={styles.crossMark}
                  src={brandAssets.xtremeAg}
                  alt={imageAlt['/img/brand/xtreme-ag.jpg']}
                  width={508}
                  height={242}
                  loading="lazy"
                  sizes="8rem"
                />
              </div>
              <Heading level={3} size="lg">
                The Cutting The Curve Podcast
              </Heading>
              <p>XtremeAg’s own show, and the obvious next listen if this feed suits you.</p>
              <Button
                className={styles.crossAction}
                href={`${podcasts.xtremeAg.site}/podcasts`}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen at XtremeAg
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            </li>

            <li className={styles.crossItem}>
              <div className={styles.crossMarkSlot}>
                <span className={styles.crossIndex}>Documentary series</span>
              </div>
              <Heading level={3} size="lg">
                {uprooted.name}
              </Heading>
              <p>
                Agriculture pulled apart from the roots up, with practical business context
                for why each change matters.
              </p>
              <Button
                className={styles.crossAction}
                href={uprooted.playlist}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch UPROOTED
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            </li>
          </ul>

          <Prose className={styles.crossFooter}>
            <p>
              Damian’s own work with XtremeAg has a page here: <Link href="/xtreme-ag/">XtremeAg</Link>.
            </p>
          </Prose>
        </Container>
      </Section>

      {/* ==================================================================
          LISTENER REVIEW
          The byline the old extractor dropped is back: Geoff Bastow.
          ================================================================== */}
      {listenerQuotes.length > 0 ? (
        <Section id="review" aria-labelledby="review-title">
          {/* align="start" keeps this narrow measure on the same left gutter as
              the episode sections above it. Centred, it started at x=320 while
              the rest of the page started at x=96. */}
          <Container width="narrow" align="start">
            <div className={styles.head}>
              <Eyebrow>Listener review</Eyebrow>
              <Heading level={2} size="2xl" id="review-title">
                What a listener said
              </Heading>
            </div>

            <TestimonialGrid items={listenerQuotes} variant="featured" />
          </Container>
        </Section>
      ) : null}

      {/* ==================================================================
          NEWSLETTER
          One form, not two. The old page rendered the identical Mailchimp
          form twice, with duplicate DOM ids and a label pointing at the
          wrong input, and both Subscribe buttons were anchor-only links that
          jumped to the top of the page. This one posts to Mailchimp.
          ================================================================== */}
      <Section id="subscribe" surface="sunken">
        <Container width="narrow" align="start">
          <NewsletterForm
            idPrefix="podcast-subscribe"
            headingLevel={2}
            title="New episodes every Monday."
            blurb="Subscribe to get notified when a new episode posts."
            submitLabel="Subscribe"
            submitVariant="secondary"
          />

          <Rule />

          {/* Verbatim rights statement, carried from the old page exactly as
              it shipped, missing space after the glyph included. */}
          <p className={styles.rights}>
            This content is protected. ©Damian Mason, all rights reserved. Not available for AI.
          </p>
        </Container>
      </Section>

      {/* ==================================================================
          SPONSORSHIP CTA
          Also where the page-body "Contact Us" email lands, as a real
          mailto instead of the plain text the old page shipped.
          ================================================================== */}
      <CTABand
        id="sponsor"
        eyebrow="Sponsorship"
        heading="Sponsor the show."
        copy={
          <>
            {/* THIS ROUTE OWNS THE OCCUPATION LIST. "Growers, ag lenders,
                agronomists" was running eight times on seven routes, and this
                is the show whose audience the source actually describes, so the
                full list stays here and the neighbours name a different slice
                each. Do not paste it onto a fourth route. */}
            <p>
              More than 40,000 listeners a month. Growers, ag lenders, agronomists, and the
              agribusiness people who sell to them. If your brand belongs in that feed, here’s
              where the details live.
            </p>
          </>
        }
        actions={[
          { label: 'Sponsorship options', href: '/collaboration-opportunities/' },
          {
            label: 'Email the office',
            href: `mailto:${contact.email}`,
            variant: 'secondary',
          },
        ]}
      />
    </>
  );
}

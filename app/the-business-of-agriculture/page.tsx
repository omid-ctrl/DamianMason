import type { Metadata } from 'next';
import Image from 'next/image';

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
import { EpisodeCard } from '@/components/sections/EpisodeCard';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { SponsorWall } from '@/components/sections/SponsorWall';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { JsonLd } from '@/components/seo';
import { brandAssets } from '@/content/brand-assets';
import { contact, podcasts, socials } from '@/content/site';
import { testimonialsFor } from '@/content/testimonials';
import {
  buildBreadcrumbListSchema,
  buildBusinessOfAgricultureSchema,
} from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

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
    alt: 'Cover art for The Business of Agriculture Podcast with Damian Mason.',
  },
});

export default function BusinessOfAgriculturePage() {
  const listenerQuotes = testimonialsFor(ROUTE);

  return (
    <>
      <JsonLd
        schema={[
          buildBusinessOfAgricultureSchema(),
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
                  alt="Cover art for The Business of Agriculture Podcast: a green and black leaf mark above the Damian Mason wordmark."
                  width={800}
                  height={800}
                  priority
                  sizes="(min-width: 64rem) 32rem, (min-width: 48rem) 60vw, 100vw"
                />
              </Section>
              <figcaption className={`dm-figure__caption ${styles.artCutline}`}>
                Show art. The feed is Libsyn 504653, and a new episode lands every Monday.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ==================================================================
          LATEST EPISODE
          Hand-pasted on the old site and dated by the page's own JSON-LD
          dateModified. The date is on the card here so a stale episode is
          visible as one rather than silently presented as this week's.
          ================================================================== */}
      <Section id="latest-episode" aria-labelledby="latest-episode-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>From the feed</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 01" id="latest-episode-title">
              Latest episode
            </Heading>
          </div>

          <EpisodeCard
            title="Will the Great American Cotton Plan Save U.S. Cotton?"
            date="2026-08-03"
            show="The Business of Agriculture"
            headingLevel={3}
            layout="stacked"
            description={
              <>
                <p>
                  $2.6 billion. That’s what U.S. cotton growers stand to lose this year
                  according to USDA, the fifth straight year of red ink for the industry. The
                  Great American Cotton Plan, announced in May 2026, aims to change the
                  economics of American cotton. In short, we’ve lost acres, we’ve lost
                  infrastructure, and the producers have lost money. Plains Cotton Growers CEO,
                  Kody Bessent joins cotton farmers Todd Kimbrell and Matt Miles. Along with
                  Damian, they discuss: cotton’s current financial condition, how they see the
                  new initiative impacting farmers, consumer apparel issues, and the promise of
                  renewed cotton demand’s effect on rural communities.
                </p>
                <p>
                  A major component of the new cotton promotion ties to the fiber’s
                  natural-ness. American consumers discard more than 70 pounds of apparel each
                  year, nearly three fourths of which is made from petroleum based material.
                  Will all this bode as a positive for one of America’s original cash crops?
                </p>
              </>
            }
            platformLinks={[{ label: 'Episode details on Libsyn', href: show.showPage }]}
          />

          {/* The old page shipped "Episode Details" and "All Episodes" as two
              buttons pointing at the identical URL. One link, one destination. */}
          <div className={styles.player}>
            <iframe
              className={styles.playerFrame}
              src={LIBSYN_PLAYER}
              title="The Business of Agriculture Podcast player"
              height={LIBSYN_PLAYER_HEIGHT}
              loading="lazy"
              scrolling="no"
              allowFullScreen
            />
            <p className={`dm-figure__caption ${styles.playerCutline}`}>
              The full archive, streaming straight from the Libsyn feed. Downloads are on.
            </p>
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
          <div className={styles.head}>
            <Eyebrow>Subscribe</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 02" id="listen-title">
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
          Net new. On the old site these companies were a bulleted list of
          plain text links with no artwork anywhere on the page.
          ================================================================== */}
      <SponsorWall
        id="sponsors"
        folio="No. 03"
        level={2}
        intro="Ten sponsors. Every mark below links straight to the company, and if you sell into Agriculture, they’re the ones already spending money to reach that crowd."
      />

      {/* ==================================================================
          CROSS PROMO
          The old page's "Also, make sure to check out..." line. The self-link
          to www.damianmason.com is dropped: it pointed at the site the reader
          is already on, on the wrong host, guaranteeing a redirect hop.
          ================================================================== */}
      <Section id="elsewhere" aria-labelledby="elsewhere-title" surface="sunken">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Elsewhere</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 04" id="elsewhere-title">
              Also worth your time
            </Heading>
          </div>

          <Prose className={styles.intro}>
            <p>
              Two more things from the XtremeAg crew. The Granary is filmed with them, and
              Cutting The Curve is their own podcast.
            </p>
          </Prose>

          <ul className={styles.crossGrid}>
            <li className={styles.crossItem}>
              <Image
                className={styles.crossMark}
                src={brandAssets.granary}
                alt="The Granary"
                width={800}
                height={800}
                loading="lazy"
                sizes="8rem"
              />
              <Heading level={3} size="lg">
                The Granary
              </Heading>
              <p>Filmed with the XtremeAg crew in a granary turned tavern on Damian’s Indiana farm.</p>
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
              <Image
                className={styles.crossMark}
                src={brandAssets.xtremeAg}
                alt="XtremeAg"
                width={800}
                height={480}
                loading="lazy"
                sizes="8rem"
              />
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
          </ul>

          <Prose className={styles.crossFooter}>
            <p>
              Damian’s own work with XtremeAg has a page here: <a href="/xtreme-ag/">XtremeAg</a>.
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
          <Container width="narrow">
            <div className={styles.head}>
              <Eyebrow>Listener review</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 05" id="review-title">
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
        <Container width="narrow">
          <NewsletterForm
            idPrefix="podcast-subscribe"
            headingLevel={2}
            title="New episodes every Monday."
            blurb="Subscribe and you’ll hear when an episode drops. No daily clutter, no pitches."
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
        folio="No. 06"
        copy={
          <>
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

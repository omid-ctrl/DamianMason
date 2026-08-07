import Image from 'next/image';
import type { Metadata } from 'next';

import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { StatRow } from '@/components/sections/StatRow';
import type { StatRowItem } from '@/components/sections/StatRow';
import { JsonLd } from '@/components/seo';
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
} from '@/components/ui';
import { brandAssets, brandAssetsExtra } from '@/content/brand-assets';
import { contact, podcasts } from '@/content/site';
import {
  buildBreadcrumbListSchema,
  buildBusinessOfAgricultureSchema,
  buildDoBusinessBetterSchema,
} from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

/**
 * /podcasts/
 *
 * This route did not exist on the old site. The "Podcasts" nav parent carried
 * no href at all, and /podcast-2/ was an empty chromeless stub that now 301s
 * here. The hub is assembled from the three child routes:
 * /the-business-of-agriculture/, /do-business-better-podcast/ and /xtreme-ag/.
 */

export const metadata: Metadata = buildMetadata({
  title: 'Podcasts',
  description:
    'Damian Mason hosts three shows: The Business of Agriculture every Monday, Do Business Better, and Cutting the Curve with the farmers of XtremeAg. More than 40,000 listeners a month.',
  path: '/podcasts/',
});

/* The two audience figures are the ones the old site published: "more than
   40,000 listeners per month" (collaboration-opportunities) and "More Than
   70,000 Views & Downloads Per Month" (home). They are quoted, not rounded. */
const AUDIENCE_STATS: StatRowItem[] = [
  { value: '40,000', plus: true, label: 'Monthly listeners' },
  { value: '70,000', plus: true, label: 'Monthly views and downloads' },
  { value: '3', label: 'Shows he hosts' },
];

type PlatformLink = {
  label: string;
  href: string;
};

type Show = {
  /** The route on this site. The card title links to it. */
  href: string;
  title: string;
  eyebrow: string;
  artwork: string;
  artworkAlt: string;
  /** Real pixel dimensions of the file in public/img/brand. */
  width: number;
  height: number;
  body: string;
  platforms: PlatformLink[];
};

const boa = podcasts.businessOfAgriculture;
const dbb = podcasts.doBusinessBetter;
const xag = podcasts.xtremeAg;

const SHOWS: Show[] = [
  {
    href: '/the-business-of-agriculture/',
    title: 'The Business of Agriculture',
    eyebrow: 'New episodes every Monday',
    artwork: brandAssets.businessOfAgriculturePodcast,
    artworkAlt:
      'The Business of Agriculture podcast cover: a green and black leaf mark above the words Damian Mason, The Business of Agriculture.',
    width: 800,
    height: 800,
    body:
      "Smart talk about the business of food, fuel, and fiber. Damian has strong opinions and he's not afraid to share them, and you can agree or disagree. One recent episode: $2.6 billion of cotton losses, the Great American Cotton Plan, and Plains Cotton Growers CEO Kody Bessent alongside two farmers who grow the crop.",
    platforms: [
      { label: 'Apple Podcasts', href: boa.apple },
      { label: 'Spotify', href: boa.spotify },
      { label: 'All episodes', href: boa.showPage },
      { label: 'RSS feed', href: boa.rss },
    ],
  },
  {
    href: '/do-business-better-podcast/',
    title: 'Do Business Better',
    eyebrow: 'The full archive on SoundCloud',
    artwork: brandAssetsExtra.doBusinessBetterPodcast,
    artworkAlt:
      'Do Business Better podcast cover: a yellow circle reading Do Business Better, a podcast to help you succeed, Damian Mason.',
    width: 800,
    height: 800,
    body:
      'This one is for you: the entrepreneur, business owner, solopreneur, self employed striver, or business person who wants to do it better. By better Damian means more profitably, more happily, and for as many years as you choose. Episode 142: Matt Roeder, an Iowa farm kid and plastics engineer who built a better closing wheel and kept it as his own.',
    platforms: [{ label: 'Listen on SoundCloud', href: dbb.soundcloud }],
  },
  {
    href: '/xtreme-ag/',
    title: 'XtremeAg',
    eyebrow: 'Cutting the Curve',
    artwork: brandAssetsExtra.xtremeAgTransparent,
    artworkAlt: 'The XtremeAg.farm logo: a green and blue bolt struck through a black X.',
    width: 242,
    height: 116,
    body:
      "XtremeAg is a group of high performing farmers from across the country who open up their own operations, numbers included. Damian hosts Cutting the Curve, produces video, and works their field days and trade shows. If you want to know what a top operation actually does, that's the show.",
    platforms: [
      { label: 'Cutting the Curve', href: `${xag.site}/podcasts` },
      { label: 'The Granary', href: xag.granary },
    ],
  },
];

export default function PodcastsPage() {
  return (
    <>
      <JsonLd
        schema={[
          buildBusinessOfAgricultureSchema(),
          buildDoBusinessBetterSchema(),
          buildBreadcrumbListSchema([
            { name: 'Home', path: '/' },
            { name: 'Podcasts', path: '/podcasts/' },
          ]),
        ]}
      />

      <Hero
        id="podcasts"
        eyebrow="Podcasts"
        title="Three shows. One host."
        titleSize="5xl"
        deck="The Business of Agriculture drops a new episode every Monday. Do Business Better is for the striver who wants to run the place better. On XtremeAg's Cutting the Curve, the growers talk. You won't get a weather forecast on any of them."
        actions={[
          {
            label: 'Latest episodes',
            href: '/the-business-of-agriculture/',
            variant: 'secondary',
          },
          {
            label: 'Work with Damian',
            href: '/collaboration-opportunities/',
            variant: 'secondary',
          },
        ]}
        image={{
          src: '/img/photos/portrait-office-seated.jpg',
          alt: 'Damian Mason in a checked sport coat and jeans, seated on the edge of a conference table in his office.',
          width: 2000,
          height: 1334,
        }}
        cutlineFolio="FIG. 01"
        cutline="At the office. New Business of Agriculture episodes land every Monday, and the weather forecast is still on your phone."
      />

      <StatRow
        id="audience"
        surface="sunken"
        eyebrow="The audience"
        title="Who is on the other end"
        items={AUDIENCE_STATS}
        restatement="More than 40,000 people listen every month. Add the video and the total tops 70,000 views and downloads. They're growers, ag lenders, agronomists, and business owners, and they work in the business you sell into."
      />

      <Section id="shows" aria-labelledby="shows-title">
        <Container>
          <Eyebrow>The shows</Eyebrow>
          <Heading level={2} size="2xl" id="shows-title">
            What each show is for
          </Heading>

          <ul className={styles.showGrid} role="list">
            {SHOWS.map((show) => (
              <Card
                key={show.href}
                as="li"
                variant="ruled"
                className={styles.show}
              >
                <div className={styles.showArt}>
                  <Image
                    className={styles.showArtImg}
                    src={show.artwork}
                    alt={show.artworkAlt}
                    width={show.width}
                    height={show.height}
                    loading="lazy"
                    sizes="160px"
                  />
                </div>

                <Eyebrow>{show.eyebrow}</Eyebrow>

                <Heading level={3} size="xl" className={styles.showTitle}>
                  <a className={`dm-link-bare ${styles.showLink}`} href={show.href}>
                    {show.title}
                  </a>
                </Heading>

                {/* The default 66ch measure. In the three across layout the
                    column is already narrower than that, and when the cards
                    stack it is what stops a full width line of text. */}
                <Prose className={styles.showBody}>
                  <p>{show.body}</p>
                </Prose>

                <ul className={styles.platforms} aria-label={`Listen to ${show.title}`}>
                  {show.platforms.map((platform) => (
                    <li key={platform.href}>
                      <Button
                        className="dm-link-bare"
                        href={platform.href}
                        variant="ghost"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      <CTABand
        id="collaborate"
        eyebrow="Guests and sponsors"
        heading="Pitch a guest. Or sponsor a show."
        copy="Damian books guests who have something to say and sponsors whose customers are already listening. More than 40,000 people hear the shows every month. If your brand belongs in front of growers, say so and we'll talk. We typically respond within one business day."
        actions={[
          { label: 'Work with Damian', href: '/collaboration-opportunities/' },
          {
            label: 'Email the office',
            href: `mailto:${contact.email}`,
            variant: 'secondary',
          },
        ]}
        panel={{
          eyebrow: 'The reach',
          value: '40,000',
          plus: true,
          label: 'Monthly listeners',
          note: 'Plus more than 70,000 views and downloads a month.',
        }}
      />
    </>
  );
}

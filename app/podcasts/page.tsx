import Image from 'next/image';
import Link from 'next/link';
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
import { imageAlt } from '@/content/image-alt';

/**
 * /podcasts/
 *
 * This route did not exist on the old site. The "Podcasts" nav parent carried
 * no href at all, and /podcast-2/ was an empty chromeless stub that now 301s
 * here. The hub is assembled from the three child routes:
 * /the-business-of-agriculture/, /do-business-better-podcast/ and /xtreme-ag/.
 */

export const metadata: Metadata = buildMetadata({
  title: 'Agriculture Podcasts',
  description:
    'Three shows, one host: The Business of Agriculture every Monday, Do Business Better, and Cutting the Curve with XtremeAg. Pick one and press play.',
  path: '/podcasts/',
});

/* The two audience figures are the ones the old site published: "more than
   40,000 listeners per month" (collaboration-opportunities) and "More Than
   70,000 Views & Downloads Per Month" (home). They are quoted, not rounded.

   The 70,000 is scoped. On the source page it sits directly under the line
   "THE BUSINESS OF AGRICULTURE:", so it belongs to that one show and not to all
   three, and the label says so. */
const AUDIENCE_STATS: StatRowItem[] = [
  { value: '40,000', plus: true, label: 'Monthly listeners' },
  { value: '70,000', plus: true, label: 'Business of Ag views and downloads' },
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
    artworkAlt: imageAlt['/img/brand/business-of-agriculture-podcast.jpg'],
    width: 800,
    height: 800,
    body:
      'Smart talk about the business of food, fuel, and fiber. Damian has strong opinions and he’s not afraid to share them, and you can agree or disagree. One recent episode: $2.6 billion of cotton losses, the Great American Cotton Plan, and Plains Cotton Growers CEO Kody Bessent alongside two farmers who grow the crop.',
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
    artworkAlt: imageAlt['/img/brand/do-business-better-podcast.png'],
    width: 800,
    height: 800,
    body:
      /* The "entrepreneur, business owner, solopreneur, self employed striver"
         sentence is Damian's own first-person paragraph and it runs verbatim on
         /do-business-better-podcast/, which is the page it was written for.
         This card summarizes rather than reprints it. */
      'Owners, solopreneurs, and anybody self employed who wants the place run better and kept that way for as long as they choose to run it. Episode 142: Matt Roeder, an Iowa farm kid and plastics engineer who built a better closing wheel and kept it as his own.',
    platforms: [{ label: 'Listen on SoundCloud', href: dbb.soundcloud }],
  },
  {
    href: '/xtreme-ag/',
    title: 'XtremeAg',
    eyebrow: 'Cutting the Curve',
    artwork: brandAssetsExtra.xtremeAgTransparent,
    artworkAlt: imageAlt['/img/brand/xtreme-ag-transparent.png'],
    // 256x122 is what scripts/normalize-brand-art.mjs settled this file on.
    width: 256,
    height: 122,
    body:
      /* "produces their video and works their field days and trade shows" is
         the /xtreme-ag/ hero cutline. That route owns the working relationship;
         this card is a menu entry and says what the show is. */
      'XtremeAg is a group of high performing farmers from across the country who open up their own operations and share what they’ve learned about turning a profit. Damian hosts Cutting the Curve. If you want to know what a top operation actually does, that’s the show.',
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
        className={styles.heroFocus}
        id="podcasts"
        eyebrow="Podcasts"
        title="Three shows. One host."
        titleSize="5xl"
        deck="The Business of Agriculture drops a new episode every Monday. Do Business Better is for the striver who wants to run the place better. On XtremeAg’s Cutting the Curve, the growers talk. You won’t get a weather forecast on any of them."
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
        /* The weather-forecast refusal is the site's most over-used joke: it
           was being retold in ten places across six routes. The verbatim source
           line stays on / and /join-the-conversation/. This route keeps one
           retelling, the hero deck's, and the cutline dropped its clause. */
        cutline="At the office. New Business of Agriculture episodes land every Monday."
      />

      <StatRow
        id="audience"
        surface="sunken"
        eyebrow="The audience"
        title="Who is on the other end"
        items={AUDIENCE_STATS}
        /* No "alone", and the 70,000 is not in this sentence at all. Views and
           downloads are not the same unit as listeners, and putting the two
           figures in one sentence with "alone" told the reader to compare them:
           it read as one of three shows out-performing all three together. The
           70,000 stays in the ledger above, where its own label disambiguates
           it, and in the closing panel's note. */
        /* The figure came out of this sentence. The ledger glyph immediately
           above it reads "40,000+ Monthly listeners" and the closing panel
           reads it again, so a 425-word page was stating one number three
           times. The same treatment was applied to
           /collaboration-opportunities/ in an earlier round and not here.
           What is left is the part a glyph cannot carry: who those people are.
           The occupation triplet went too. It was the same three jobs on seven
           routes, and this show's audience has a name of its own. */
        restatement="Growers, the bankers behind them, and the companies that sell to both. Nobody is making them listen."
      />

      <Section id="shows" aria-labelledby="shows-title">
        <Container>
          <Eyebrow>The shows</Eyebrow>
          <Heading level={2} size="2xl" id="shows-title">
            What each show is for
          </Heading>

          <ul className={styles.showGrid} role="list" data-reveal="stagger">
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
                    /* The row sizes its three marks by optical area, and the
                       per-mark factor lives in page.module.css keyed on this
                       attribute. It is the file stem, so a rule there can be
                       traced to a file in public/img/brand without a lookup. */
                    data-mark={show.artwork.slice(show.artwork.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '')}
                    src={show.artwork}
                    alt={show.artworkAlt}
                    width={show.width}
                    height={show.height}
                    loading="lazy"
                    /* The artwork column is --size-thumb, which tops out at
                       10rem. Stated in rem to match every other slot hint on
                       the site. */
                    sizes="10rem"
                  />
                </div>

                <Eyebrow>{show.eyebrow}</Eyebrow>

                <Heading level={3} size="xl" className={styles.showTitle}>
                  <Link className={`dm-link-bare ${styles.showLink}`} href={show.href}>
                    {show.title}
                  </Link>
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
        /* The figure came out of this paragraph: the panel two lines below it
           already reads 40,000+ monthly listeners, so the band was stating one
           number twice inside one band and the route was stating it three
           times. */
        /* "If your brand belongs in front of them, say so and we'll talk" is
           VOICE.md section 6, Pair 3. It was written as an illustration for one
           card on /collaboration-opportunities/ and had been copied onto this
           route and onto Home. The canonical instance stays where VOICE.md put
           it, and this band closes on what this page sells: three shows. */
        copy="Damian books guests who have something to say and sponsors whose customers are already listening. Tell him which of the three shows your people are on, and what you want them to hear."
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
          note: 'The Business of Agriculture runs more than 70,000 views and downloads a month.',
        }}
      />
    </>
  );
}

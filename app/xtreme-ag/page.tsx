import Image from 'next/image';
import type { Metadata } from 'next';

import { Button, Container, Eyebrow, Heading, Prose, Section, Card } from '@/components/ui';
import { Hero } from '@/components/sections/Hero';
import { PressList } from '@/components/sections/PressList';
import { CTABand } from '@/components/sections/CTABand';
import { JsonLd } from '@/components/seo';
import { buildMetadata } from '@/lib/seo';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { brandAssets, brandAssetsExtra } from '@/content/brand-assets';
import { podcasts } from '@/content/site';
import type { PressItem } from '@/content/press';

import styles from './page.module.css';

/**
 * /xtreme-ag/
 *
 * Source: `_source/pages/xtreme-ag.md`. Five sections, four images, seven CTAs.
 *
 * Three defects on the old page are fixed here rather than carried:
 *   1. "Sign Up for Damian's Mailing List" shipped with href="" and reloaded
 *      the page. The intended target is known from the identical button on
 *      /acres-tv/ and is wired to /join-the-conversation/ below.
 *   2. The copy promised "click a video below" and there were zero videos on
 *      the page. The two things below it were macOS screenshots linking to
 *      XtremeAg blog articles, so the sentence now says what they are.
 *   3. Both screenshots are dropped, per docs/DESIGN_SYSTEM.md 6.4: a raw
 *      screen capture is replaced with a typographic treatment, which is what
 *      the ruled press rows are.
 *
 * The Granary section is NET NEW. No Granary copy exists anywhere on the old
 * /xtreme-ag/, confirmed by the harvest and by the Corrections table in
 * docs/build/STATE.md. It is written from the only facts known and it needs
 * client review before launch.
 */

const XTREMEAG_PODCASTS = 'https://www.xtremeag.farm/podcasts';

export const metadata: Metadata = buildMetadata({
  title: 'XtremeAg: Cutting the Curve',
  description:
    'XtremeAg is farmers across the United States sharing what works on their own operations. Damian makes video, works field days, and hosts Cutting the Curve.',
  path: '/xtreme-ag/',
});

/**
 * The two featured items from the old page, as ruled rows. Both titles are
 * verbatim, including the multiplication sign in "2×2" and the ampersand in
 * "Biology & Balance". The old page's alt text disagreed with both headings;
 * the headings win, because they are what a reader was shown.
 *
 * Dates come from the article URLs, which is the only date the source carries.
 * The old page linked the first thumbnail and left the second one dead. Both
 * are links here.
 */
const featured: PressItem[] = [
  {
    id: 'xtremeag-johnny-verell-2x2',
    outlet: 'XtremeAg',
    title: 'Why did Johnny Verell Take the 2×2 off his planter?',
    url: 'https://www.xtremeag.farm/blog/xtremeag-blog/2023/04/17/why-did-johnny-verell-take-the-2x2-off-his-planters',
    date: '2023-04-17',
    type: 'article',
  },
  {
    id: 'xtremeag-rethinking-soil-fertility',
    outlet: 'XtremeAg',
    title: 'Re-Thinking Soil Fertility, Biology & Balance',
    url: 'https://www.xtremeag.farm/blog/xtremeag-blog/2023/04/12/re-thinking-soil-fertility-biology-balance',
    date: '2023-04-12',
    type: 'article',
  },
];

export default function XtremeAgPage() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Podcasts', path: '/podcasts/' },
          { name: 'XtremeAg', path: '/xtreme-ag/' },
        ])}
      />

      {/* SECTION 1. The old hero was a stock "microphones on a stand" photo
          behind an empty Divi section, plus a decorative chevron wedge. Both
          are dropped for a real photograph of the thing the page is about. */}
      <Hero
        id="xtreme-ag"
        eyebrow="XtremeAg, content creator and host"
        title="What’s XtremeAg, You Ask?"
        deck="In addition to his own business endeavors, Damian is a content creator and personality for XtremeAg. He produces videos, works trade shows and field days, and hosts the “Cutting the Curve” podcast."
        /* Secondary on purpose. The orange field goes on the action that earns
           money, which on this route is the contact band at the foot of the
           page, not an off-site link to a partner. */
        actions={[
          {
            label: 'Watch on XtremeAg',
            href: XTREMEAG_PODCASTS,
            variant: 'secondary',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ]}
        image={{
          /* A 4:5 crop of keynote-stage-xtremeag.jpg, cut to the hero ratio so
             the plate does not have to throw away half the frame. The uncropped
             original is a wide stage shot where Damian is a stamp, which is the
             exact failure docs/DESIGN_SYSTEM.md 6.3 demotes out of the hero. */
          src: '/img/photos/keynote-stage-xtremeag-portrait.jpg',
          alt: 'Damian Mason speaking on stage in front of a large illuminated XtremeAg X.',
          width: 880,
          height: 1100,
        }}
        cutlineFolio="Fig. 01"
        cutline="On stage for XtremeAg. Purdue Ag Econ degree, Second City Chicago, and an Indiana farm of his own. All three are working here."
      />

      {/* SECTION 2. Both source paragraphs, verbatim. On the old page they were
          bare <div>s with three hardcoded inline colors, pasted out of a Gmail
          message along with a source=gmail redirect wrapper and Gmail's own
          highlight class. All of that residue is gone. */}
      <Section surface="sunken" aria-labelledby="who-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-7`}>
              <div className={styles.head}>
                <Eyebrow>The partnership</Eyebrow>
                <Heading level={2} size="2xl" id="who-title">
                  Who’s Behind XtremeAg
                </Heading>
              </div>

              <Prose>
                <p>
                  XtremeAg is a community of highly successful farmers from across the United
                  States coming together to offer an Xtreme look into their personal farming
                  operations by sharing their accumulated knowledge around pursuing
                  profitability and success.
                </p>
                <p>
                  To see Damian and the forward-looking farmers of XtremeAg deliver actionable
                  Ag information, read the two articles below or go to{' '}
                  <a href={XTREMEAG_PODCASTS} target="_blank" rel="noopener noreferrer">
                    xtremeag.farm/podcasts
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  .
                </p>
              </Prose>
            </div>

            <Card
              variant="bright"
              className={`${styles.markPlate} col-span-6 md:col-span-5`}
            >
              <Image
                className={styles.mark}
                src={brandAssetsExtra.xtremeAgTransparent}
                alt="XtremeAg"
                width={242}
                height={116}
                loading="lazy"
              />
              <Eyebrow>Partner brand</Eyebrow>
            </Card>
          </div>
        </Container>
      </Section>

      {/* SECTION 3. The old page's two "featured" items were 812 KB and 776 KB
          macOS screen captures with the default capture filenames, one of them
          linked and one of them dead. Design system 6.4 rule 2: when a
          screenshot is the only asset for a slot, the slot becomes a ruled row
          carrying the real headline and a link. */}
      <Section aria-labelledby="featured-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>From the XtremeAg blog</Eyebrow>
            <Heading level={2} size="2xl" id="featured-title">
              Featured From XtremeAg
            </Heading>
          </div>

          <div className="dm-grid12">
            <div className={`${styles.spaced} col-span-6 md:col-span-7`}>
              <PressList
                items={featured}
                headingLevel={3}
                label="Featured articles on XtremeAg"
              />
            </div>

            <figure className={`dm-figure ${styles.spaced} col-span-6 md:col-span-5`}>
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/xtremeag-cornfield-team.png"
                  alt="Damian Mason and three XtremeAg farmers standing at the edge of a tall cornfield during filming."
                  width={1372}
                  height={776}
                  sizes="(min-width: 48rem) 30rem, 100vw"
                  loading="lazy"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 02 </span>
                Damian with XtremeAg growers in a standing cornfield. He’s the one in shorts.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* SECTION 4. NET NEW COPY, needs client review. Nothing about The
          Granary exists on the old /xtreme-ag/ or anywhere else on the old
          site except one cross-promo link on /the-business-of-agriculture/.
          Written from the only three facts known: it is filmed with XtremeAg,
          it is filmed in a granary turned tavern on Damian's Indiana farm, and
          it lives at xtremeag.farm/the-granary. */}
      <Section surface="deep" aria-labelledby="granary-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-7`}>
              <div className={styles.head}>
                <Eyebrow>Filmed on the Indiana farm</Eyebrow>
                <Heading level={2} size="2xl" id="granary-title">
                  The Granary
                </Heading>
              </div>

              <Prose>
                <p>
                  Damian turned a granary on his Indiana farm into a tavern. That’s where he
                  and the XtremeAg crew film The Granary. An Ag show, shot in a bar, in a
                  building that used to hold grain.
                </p>
              </Prose>

              <Button
                href={podcasts.xtremeAg.granary}
                variant="secondary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch The Granary
              </Button>
            </div>

            {/* A bone plate inside a deep section, per design system 3.3. The
                mark is black letterforms on a transparent ground and would
                vanish on navy. */}
            <Card
              variant="bright"
              data-surface="paper"
              className={`${styles.markPlate} col-span-6 md:col-span-5`}
            >
              <Image
                className={styles.markLarge}
                src={brandAssets.granary}
                alt="The Granary, an XtremeAg show"
                width={800}
                height={800}
                loading="lazy"
              />
              <Eyebrow>An XtremeAg show</Eyebrow>
            </Card>
          </div>
        </Container>
      </Section>

      {/* SECTION 5. Verbatim heading. The old button carried href="" and
          reloaded the page; the identical button on /acres-tv/ points at
          /join-the-conversation/, so that is where this one goes. */}
      <Section aria-labelledby="join-title">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-7">
              <Heading level={2} size="2xl" id="join-title">
                Join the Conversation
              </Heading>
            </div>
            <div className={`${styles.rowEnd} col-span-6 md:col-span-5`}>
              <Button href="/join-the-conversation/" variant="secondary" size="lg">
                Sign Up for Damian’s Mailing List
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* SECTION 6. Verbatim, and byte-identical to the same band on
          /acres-tv/. The source H4 carried a no-break space plus a regular
          space, which rendered as "As a  Leading Voice"; normalized to one
          space. The old label read "Click Here to Inquire About Working With
          Damian": "Click Here" is not link text, so it is gone and the verb
          leads. */}
      <CTABand
        id="work-with-damian"
        eyebrow="As a Leading Voice in the Industry, Damian is Sought After for Conversations & Commentary on Hot Topics"
        heading="If it’s Agriculture, it Needs Damian."
        actions={[
          {
            label: 'Inquire About Working With Damian',
            href: '/contact-us/',
          },
        ]}
        panel={{
          eyebrow: 'Reach',
          value: '40,000',
          plus: true,
          label: 'listeners a month',
          note: 'Growers, ag lenders, and agronomists, every month.',
        }}
      />
    </>
  );
}

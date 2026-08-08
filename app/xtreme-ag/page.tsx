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
import { mediaBand } from '@/content/media-band';
import { podcasts } from '@/content/site';
import type { PressItem } from '@/content/press';

import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

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
          /* A 4:5 crop, cut to the hero ratio so the plate does not have to
             throw away half the frame. The two wide originals it came from are
             stage shots where Damian is about 200px of a 2000px frame, which
             is the exact failure docs/DESIGN_SYSTEM.md 6.3 demotes out of a
             hero; both are now in SKIPPED in scripts/normalize-assets.mjs and
             off disk. This crop is committed rather than generated. */
          src: '/img/photos/keynote-stage-xtremeag-portrait.jpg',
          alt: 'Damian Mason speaking on stage in front of a large illuminated XtremeAg X.',
          width: 880,
          height: 1100,
        }}
        cutline="On stage for XtremeAg. He also produces their video and works their field days and trade shows."
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
                  These are working farmers, not analysts, and here’s how they describe
                  themselves.
                </p>
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

              {/* The deck three sections up claims Damian "works trade shows
                  and field days" and until now the page evidenced the stage,
                  the field day and the articles, but never the trade show
                  floor. This is it, and it is the only frame on file of it.
                  The XtremeAg watermark bottom right is theirs, burned in. */}
              <figure className={`dm-figure ${styles.stackFigure}`} data-reveal="wipe">
                {/* A role ratio here rather than --uncropped: this frame has no
                    burned-in headline to protect and the 3:2 crop tightens it
                    onto the three of them. */}
                <div className="dm-photo dm-photo--plate dm-photo--evidence">
                  <Image
                    className="dm-photo__img"
                    src="/img/photos/equipment-factory-tour.png"
                    alt="Damian Mason in a dark blazer talking with two exhibitors on a trade show floor, in front of a row of planter units and a Fendt stand."
                    width={1798}
                    height={1012}
                    sizes="(min-width: 48rem) 42rem, 100vw"
                    loading="lazy"
                  />
                </div>
                <figcaption className="dm-figure__caption">
                  Working a trade show floor for XtremeAg. The tractors have their headlights
                  on, indoors.
                </figcaption>
              </figure>
            </div>

            <Card
              variant="bright"
              className={`${styles.markPlate} ${styles.markPlateOnLight} ${styles.markPlateTop} col-span-6 md:col-span-5`}
            >
              <Image
                className={styles.mark}
                src={brandAssetsExtra.xtremeAgTransparent}
                alt={imageAlt['/img/brand/xtreme-ag-transparent.png']}
                width={256}
                height={122}
                loading="lazy"
                /* .mark caps the render at --logo-box-h, 72px, so the mark is
                   never wider than about 10rem. Without this the browser has
                   no width to reason about and pulls the 640px candidate. */
                sizes="10rem"
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
          carrying the real headline and a link.

          Fig. 03 is not a photograph either: it is a frame grab off an XtremeAg
          broadcast and it carries a burned-in "DAMIAN MASON / CUTTING THE CURVE
          PODCAST" lower third in the bottom right. It is the only asset on file
          of Damian with the XtremeAg growers, so it ships, and it is listed on
          the professional-photography open item in docs/OPEN-ITEMS.md along
          with PLAN.md item 4. Crop the lower third or replace the frame.

          Fig. 04 under it is the podcast the copy keeps pointing at. */}
      <Section aria-labelledby="featured-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>From the XtremeAg blog</Eyebrow>
            <Heading level={2} size="2xl" id="featured-title">
              Featured From XtremeAg
            </Heading>
            <Prose measure="wide">
              <p>
                Two from the XtremeAg blog. Neither one stops to explain what a 2×2 is,
                because you already know.
              </p>
            </Prose>
          </div>

          <div className="dm-grid12">
            <div className={`dm-rail ${styles.spaced} col-span-6 md:col-span-7`}>
              <PressList
                items={featured}
                headingLevel={3}
                label="Featured articles on XtremeAg"
              />
            </div>

            <div className={`${styles.spaced} col-span-6 md:col-span-5`}>
              <figure className="dm-figure">
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
                  Damian with XtremeAg growers in a standing cornfield. He’s the one in
                  shorts.
                </figcaption>
              </figure>

              {/* The podcast, evidenced. The copy above sends a reader to
                  xtremeag.farm/podcasts and the hero deck says he hosts
                  Cutting the Curve, and until now the page asserted both and
                  showed neither. Same hairline plate as Fig. 02: this is a
                  frame off the show, not a photograph. */}
              <figure className={`dm-figure ${styles.stackedFigure}`} data-reveal="wipe">
                {/* --uncropped, unlike Fig. 02: this frame is 2.11:1 and a 3:2
                    plate would take 29% off its width, which is both video
                    panels' outer edges and the show badge between them. */}
                <div className="dm-photo dm-photo--evidence dm-photo--uncropped">
                  <Image
                    className="dm-photo__img"
                    src="/img/photos/xtremeag-video-interview.png"
                    alt="A Cutting the Curve episode in progress: Damian Mason and a grower in two side by side video panels, over a standing corn backdrop."
                    width={1798}
                    height={853}
                    sizes="(min-width: 48rem) 30rem, 100vw"
                    loading="lazy"
                  />
                </div>
                <figcaption className="dm-figure__caption">
                  Cutting the Curve, mid-episode. Two men on a video call, in front of a
                  cornfield neither of them is standing in.
                </figcaption>
              </figure>
            </div>
          </div>
        </Container>
      </Section>

      {/* SECTION 4. NET NEW COPY, needs client review. Nothing about The
          Granary exists on the old /xtreme-ag/ or anywhere else on the old
          site except one cross-promo link on /the-business-of-agriculture/.
          Written from the only three facts known: it is filmed with XtremeAg,
          it is filmed in a granary turned tavern on Damian's Indiana farm, and
          it lives at xtremeag.farm/the-granary. Nothing here asserts who did
          the conversion, that a crew exists, who appears on the show, or what
          it is about, because no source says any of that. The copy names the
          room and then stops: the third sentence is a second-person turn that
          claims nothing. A draft that said "that's where growers say it out
          loud" and "what a top operation actually does" asserted a format and a
          subject on no evidence, and also restated the XtremeAg card on
          /podcasts/. One sentence on the show's format is still needed from the
          client and it is logged in docs/OPEN-ITEMS.md. */}
      {/* Forest rather than navy. The Granary is a building on Damian's own
          farm that the show is filmed in, so of the two dark grounds this is
          the one that belongs to it. The mark inside still sits on a paper
          plate: the wordmark rule is that it never reverses AND never sits on
          the green. */}
      <Section surface="forest" aria-labelledby="granary-title">
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
                  The Granary is filmed with XtremeAg in a granary turned tavern on Damian’s
                  Indiana farm. An Ag show, shot in a bar, in a building that used to hold
                  grain. If you haven’t seen it, that’s where to start.
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
                alt={imageAlt['/img/brand/the-granary.png']}
                width={508}
                height={388}
                loading="lazy"
                /* .markLarge caps this at --size-thumb, so 10rem is the widest
                   it ever paints. Unhinted, an 800px square was being served
                   as a 1920px render into a 160px box. */
                sizes="10rem"
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
            {/* The split engages at lg, not at md. At 768 `md:col-span-5` gave
                the button a 273px column and "Sign Up for Damian's Mailing
                List" broke to three centred lines beside 431px of empty band,
                which was the only three-line button on the site. The same
                control on /acres-tv/ runs full width until lg for the same
                reason. */}
            <div className="col-span-6 md:col-span-12 lg:col-span-7">
              <Heading level={2} size="2xl" id="join-title">
                Join the Conversation
              </Heading>
              {/* This section was a heading and a button with nothing between
                  them, which made it the thinnest block on the site. The body
                  is the one /acres-tv/ already carried, moved into
                  content/media-band.ts so the two routes cannot drift: the
                  source gives both pages the same section and the same button,
                  and one of them having prose was an accident of which route
                  was written first. */}
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

      {/* SECTION 6. Verbatim, and byte-identical to the same band on
          /acres-tv/, because both routes now read the strings out of
          content/media-band.ts. The normalizations (the source's no-break space
          after "As a", and dropping "Click Here to" from the button label) are
          documented there. */}
      <CTABand
        id="work-with-damian"
        eyebrow={mediaBand.eyebrow}
        heading={mediaBand.heading}
        actions={[
          {
            label: mediaBand.inquireLabel,
            href: '/contact-us/',
          },
        ]}
        panel={{
          eyebrow: 'Reach',
          value: '40,000',
          plus: true,
          label: 'listeners a month',
          /* Not the "growers, ag lenders, agronomists" triplet again.
             /the-business-of-agriculture/ owns that list. XtremeAg's own
             audience is the operators who run the trials and the people who
             turn up to watch them, which is what this show is about. */
          note: 'The people who run the trials, and the ones who come to the field days to see them.',
        }}
      />
    </>
  );
}

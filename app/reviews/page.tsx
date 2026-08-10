import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { LogoWall } from '@/components/sections/LogoWall';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { VideoGrid } from '@/components/sections/VideoGrid';
import { JsonLd } from '@/components/seo';
import { Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { imageAlt } from '@/content/image-alt';
import { testimonialsFor } from '@/content/testimonials';
import { videosFor } from '@/content/videos';
import { buildBreadcrumbListSchema, buildVideoObjectSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

const ROUTE = '/reviews/';

export const metadata: Metadata = buildMetadata({
  title: 'Speaker Reviews and Testimonials',
  description:
    'Fifteen verified written speaking testimonials, plus four videos carried from Damian’s original reviews page.',
  path: ROUTE,
});

/**
 * The complete set of fifteen verified speaking testimonials: ten from the old
 * reviews page, three from keynote, one from meeting coordinators, and one from
 * the old site-wide footer. "We received a ton of great feedback on both you
 * and the event!" shipped with no attribution of any kind. It is carried here
 * exactly as it shipped: TestimonialGrid reads its empty `name` as "render no
 * byline", so it becomes a <figure> with no <figcaption> rather than a
 * <figcaption> we invented.
 */
const written = testimonialsFor(ROUTE);

const reviewVideos = videosFor(ROUTE);

/**
 * Descriptions for the VideoObject nodes only. The old page had none, and
 * Google treats a bare name as an incomplete video result. Each one restates
 * what the title already claims and adds nothing that is not on the record.
 */
const VIDEO_DESCRIPTIONS: Record<string, string> = {
  'hardwood-lumbermens-association':
    'Video testimonial: the Hardwood Lumbermen’s Association recommends keynote speaker Damian Mason.',
  'farm-credit-emerging-entrepreneurs':
    'Video testimonial recorded at the Farm Credit Emerging Entrepreneurs Conference, where Damian Mason was the keynote speaker.',
  'nutrien-a-successful-meeting':
    'Video testimonial: Nutrien on a successful meeting with keynote speaker Damian Mason.',
  'ations-of-agriculture':
    'Damian Mason on The “Ations” of Agriculture and Ag’s future, the keynote program he began delivering in 2023.',
};

const schema = [
  buildBreadcrumbListSchema([
    { name: 'Home', path: '/' },
    { name: 'Speaking', path: '/speaking/' },
    { name: 'Testimonials', path: ROUTE },
  ]),
  ...reviewVideos.map((video) =>
    buildVideoObjectSchema({
      name: video.title,
      description: VIDEO_DESCRIPTIONS[video.id] ?? video.title,
      youtubeId: video.kind === 'youtube' ? video.youtubeId : undefined,
      contentUrl: video.kind === 'mp4' ? video.file : undefined,
      path: ROUTE,
    }),
  ),
];

export default function ReviewsPage() {
  return (
    <>
      <JsonLd schema={schema} id="reviews-schema" />

      {/* The masthead, and it has a photograph for the first time.

          THE OLD REASONING, AND WHY IT NO LONGER HOLDS. This route ran a
          type-only hero through two revisions on a stated ground: neither of
          its two photographs is a 4:5 portrait. The book signing is a wide
          two-person shot and the close-up harvested for the section below is
          502x452, so cropping either to a portrait at hero scale meant throwing
          away the half of the frame worth having, and section 6.3 demoted both
          to 3:2 plates rather than force it. That was correct about the two
          photographs it had.

          It was a type-only hero on the one page whose entire job is proof.
          The media-kit rescue supplies a real 2400x3600 studio portrait, so the
          argument is now moot rather than overruled, and the page opens on a
          face like every other route.

          The cutline slot still earns its keep. It is where the missing byline
          on quote two gets accounted for, in two true sentences, instead of
          being papered over with an attribution nobody sent.

          The header already carries the one filled orange field in this
          viewport, so the hero action is secondary. */}
      <Hero
        id="testimonials"
        eyebrow="Speaking, on the record"
        title="Testimonials"
        deck="Fifteen written testimonials from Michael Foods, Bayer, Farm Credit West, AgroLiquid, BW Fusion, Helena Chemical, and others, plus four videos carried from the original reviews page."
        image={{
          src: '/img/photos/portrait-headshot.jpg',
          /* Single call site, so the string lives here rather than in
             content/image-alt.ts, per the rule at the head of that module. */
          alt: 'Damian Mason in a charcoal suit and a white shirt, close, looking straight at the camera.',
          width: 1333,
          height: 2000,
          feature: true,
        }}
        cutline="Nobody writes a thank-you note to a speaker they forgot by the parking lot."
        actions={
          [{ href: '/contact-us/', label: 'Check your date', variant: 'secondary' }] as const
        }
      />

      {/* The written wall. The old page ran ten blockquotes with no heading of
          any level above them, so a screen reader met the whole section
          unlabelled. */}
      <Section id="written" aria-labelledby="written-title">
        <Container>
          <div className={styles.head}>
            <div className={styles.headText}>
              <Heading level={2} size="2xl" id="written-title">
                What they said, in writing
              </Heading>
            </div>
            <Eyebrow>15 written</Eyebrow>
          </div>

          {/* The largest block on this route was ten quotes and nothing else.
              A testimonials page should show the thing being reviewed, and the
              thing being reviewed is Damian working, not Damian posed.

              THE FRAME docs/OPEN-ITEMS.md ITEM 4 ASKED THE CLIENT TO COMMISSION,
              word for word: "live-event photography from the back of the room,
              showing you on stage with the audience in frame". It was in his own
              media library the whole time. Recovered 2026-08-07, see
              _source/media-kit/PROVENANCE.md.

              It replaces speaking-closeup.png, which was the best this route
              could do before: a 502x452 panel harvested out of a four-up
              composite, rendered up to 1344px wide, so it was being upscaled
              2.7x on the page whose job is to look credible. That file still
              ships and still has a home; it is simply no longer the best action
              frame in the archive.

              Above the quotes rather than below them, because it IS the
              evidence the quotes are about, and it is the strongest argument on
              the page: a room full of people, several of them laughing, and
              every written note below from somebody who was in one. Still lazy:
              it sits roughly 900px down and the hero above it is the LCP
              element. */}
          <figure className={`dm-figure ${styles.writtenFigure}`} data-reveal="wipe">
            <div className="dm-photo dm-photo--plate" data-photo="feature">
              <Image
                className="dm-photo__img"
                src="/img/photos/audience-from-the-back.jpg"
                alt={imageAlt['/img/photos/audience-from-the-back.jpg']}
                width={2000}
                height={1125}
                loading="lazy"
                sizes="(min-width: 64rem) 84rem, 100vw"
              />
            </div>
            <figcaption className="dm-figure__caption">
              Shot from the back of the room, which is where a meeting planner sits.
              The fifteen notes below document Damian&rsquo;s live speaking work.
            </figcaption>
          </figure>

          <TestimonialGrid items={written} columns={2} />
        </Container>
      </Section>

      <Section id="repeat-business" aria-labelledby="repeat-business-title" surface="sunken">
        <Container>
          <div className={`dm-grid12 ${styles.plateGrid}`}>
            <div className={`${styles.plateBody} col-span-6 md:col-span-12 lg:col-span-5`}>
              <div className={styles.plateHead}>
                <Heading level={2} size="2xl" id="repeat-business-title">
                  Repeat business is the hallmark
                </Heading>
              </div>
              <Prose>
                <p>
                  Repeat business is the hallmark of a professional like Damian. These
                  notes record what meeting planners, clients, and industry organizations
                  said after seeing him work.
                </p>
              </Prose>
            </div>

            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-7" data-reveal="wipe">
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/book-signing-stonex.jpg"
                  alt="Damian Mason standing beside a StoneX Ag and Dairy Market Outlook book signing sign, with a reader holding a copy of Food Fear and a stack of copies on the table behind them."
                  width={1512}
                  height={1209}
                  loading="lazy"
                  sizes="(min-width: 64rem) 44rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                Book signing at the StoneX Ag and Dairy Market Outlook. The book is{' '}
                <Link href="/books/#food-fear">
                  Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate
                  Eating
                </Link>
                .
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      <Section id="on-camera" aria-labelledby="on-camera-title">
        <Container>
          <div className={styles.head}>
            <div className={styles.headText}>
              <Heading level={2} size="2xl" id="on-camera-title">
                Four videos from the original reviews page
              </Heading>
            </div>
            <Eyebrow>Four videos. Press to play.</Eyebrow>
          </div>

          {/* Facades, not raw iframes: nothing loads from YouTube, and nothing
              plays, until a visitor presses one. */}
          {/* Four across, not two. All four of these were filmed vertically,
              so the column has to be the frame's shape or the frame is a strip
              with dead ground beside it. See .dm-video-grid--4. */}
          <VideoGrid videos={reviewVideos} columns={4} headingLevel={3} />
        </Container>
      </Section>

      <LogoWall
        id="clients"
        surface="sunken"
        title="Who books him"
        meta="25 of 2,400+"
      />

      <CTABand
        id="book"
        eyebrow="Booking"
        /* The heading used to spend the page's own figure ("Fourteen rooms on
           the record") and the band then ran with no panel, which left the
           right five columns of the close as empty navy. The figure moved into
           the panel, where it is a proof rather than a sentence, and the
           heading became the ask.

           This band used to recite four booking facts: check the date, 60 to 90
           minutes, airfare and travel fee, NET fees. None of them is what a
           visitor who has just read fifteen written testimonials is thinking about,
           and all four are stated on /meeting-coordinators/ and in the verbatim
           FAQ. The close runs on the page's own evidence instead. */
        heading="Send the office your date."
        copy="Every one of these came from somebody who had already watched Damian work a room like yours. Find out whether he can do it for yours."
        actions={
          [
            { href: '/contact-us/', label: 'Book Damian' },
            {
              href: '/join-the-conversation/',
              label: 'Join the mailing list',
              variant: 'secondary',
            },
          ] as const
        }
        /* Keep the verified testimonial count distinct from the four videos:
           the fourth video is a program clip, not a client testimonial. */
        panel={{
          eyebrow: 'On the record',
          value: '15',
          label: 'verified written speaking testimonials',
          note: 'Plus four videos from the original reviews page.',
        }}
      />
    </>
  );
}

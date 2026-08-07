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
import { testimonialsFor } from '@/content/testimonials';
import { videosFor } from '@/content/videos';
import { buildBreadcrumbListSchema, buildVideoObjectSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

const ROUTE = '/reviews/';

export const metadata: Metadata = buildMetadata({
  title: 'Speaker Reviews and Testimonials',
  description:
    'Ten written reviews and four on camera, from Michael Foods, Bayer, Farm Credit West, AgroLiquid and Micronutrients. Meeting planners book him twice.',
  path: ROUTE,
});

/**
 * The ten written quotes, in the order they ran on the old page. One of them,
 * "We received a ton of great feedback on both you and the event!", shipped
 * with no attribution of any kind. It is carried here exactly as it shipped:
 * TestimonialGrid reads its empty `name` as "render no byline", so it becomes a
 * <figure> with no <figcaption> rather than a <figcaption> we invented.
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

      {/* The masthead. No image here: the one photograph on this page is a wide
          two-person shot, which section 6.3 of the design system demotes to a
          3:2 editorial plate rather than forcing into a 4:5 portrait crop. The
          cutline slot still earns its keep. It is where the missing byline on
          quote two gets accounted for, in two true sentences, instead of being
          papered over with an attribution nobody sent.

          The header already carries the one filled orange field in this
          viewport, so the hero action is secondary. */}
      <Hero
        id="testimonials"
        eyebrow="Speaking, on the record"
        title="Testimonials"
        deck="Meeting planners book Damian twice. Here’s what they said the first time: ten written notes from Michael Foods, Bayer, Farm Credit West, AgroLiquid, BW Fusion, and five more, plus four on camera. Fourteen out of 2,400+ audiences since 1994."
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
              <Heading level={2} size="2xl" folio="No. 01" id="written-title">
                What they said, in writing
              </Heading>
            </div>
            <Eyebrow>10 of 2,400+</Eyebrow>
          </div>

          <TestimonialGrid items={written} columns={2} />
        </Container>
      </Section>

      <Section id="repeat-business" aria-labelledby="repeat-business-title" surface="sunken">
        <Container>
          <div className={`dm-grid12 ${styles.plateGrid}`}>
            <div className={`${styles.plateBody} col-span-6 md:col-span-12 lg:col-span-5`}>
              <div className={styles.plateHead}>
                <Heading level={2} size="2xl" folio="No. 02" id="repeat-business-title">
                  The second booking is the real review
                </Heading>
              </div>
              <Prose>
                {/* The career total came out of the middle of this paragraph.
                    "Since 1994 Damian has worked 2,400+ audiences in all 50
                    states and 7 foreign countries" is a paraphrase of the
                    source bio sentence at `_source/pages/keynote.md:183`, which
                    /about/ carries verbatim and owns, so the same nine words
                    ran on two routes. This page had also already spent the
                    figure 40 words earlier, in the hero deck's "Fourteen out of
                    2,400+ audiences since 1994", and it spends it twice more in
                    the two ratio eyebrows. A career total is not what proves
                    repeat business anyway: the callback is. */}
                <p>
                  A keynote gets graded twice: once in the room, and once when the meeting
                  planner calls back next year. Nobody books a speaker a second time to be
                  polite. That&rsquo;s the review that counts.
                </p>
              </Prose>
            </div>

            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-7">
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
                <span className="dm-figure__folio">Fig. 01 </span>
                Book signing at the StoneX Ag and Dairy Market Outlook. The book is{' '}
                <Link href="/about/#books">
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
              <Heading level={2} size="2xl" folio="No. 03" id="on-camera-title">
                And what four of them said on camera
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
        folio="No. 04"
        title="Who books him"
        meta="21 of 2,400+"
      />

      <CTABand
        id="book"
        eyebrow="Booking"
        folio="No. 05"
        /* The heading used to spend the page's own figure ("Fourteen rooms on
           the record") and the band then ran with no panel, which left the
           right five columns of the close as empty navy. The figure moved into
           the panel, where it is a proof rather than a sentence, and the
           heading became the ask.

           This band used to recite four booking facts: check the date, 60 to 90
           minutes, airfare and travel fee, NET fees. None of them is what a
           visitor who has just read fourteen testimonials is thinking about,
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
        /* The arithmetic this page already states in its hero deck, set as the
           proof it is. 10 written notes (No. 01) plus 4 on camera (No. 03).
           2,400+ is deliberately not repeated here: this route already spends
           it in the deck and in two section eyebrows. */
        panel={{
          eyebrow: 'On the record',
          value: '14',
          label: 'reviews in writing and on camera',
          note: 'Ten in writing, four on camera.',
        }}
      />
    </>
  );
}

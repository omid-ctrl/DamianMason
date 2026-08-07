import Image from 'next/image';
import type { Metadata } from 'next';

import {
  Button,
  Card,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
} from '@/components/ui';
// components/sections has no barrel file, so each section is imported by path.
import { CTABand } from '@/components/sections/CTABand';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { Hero } from '@/components/sections/Hero';
import { StatRow } from '@/components/sections/StatRow';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { VideoGrid } from '@/components/sections/VideoGrid';
import { JsonLd } from '@/components/seo';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { contact } from '@/content/site';
import { faq } from '@/content/faq';
import { testimonialsFor } from '@/content/testimonials';
import { videosFor, type Video } from '@/content/videos';

import styles from './page.module.css';

const ROUTE = '/keynote/';
const BOOKING_HREF = '/contact-us/';
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@DamianMasonChannel/videos';

export const metadata: Metadata = buildMetadata({
  title: 'Agricultural Keynote Speaker',
  description:
    'A forward looking futurist meets an Agricultural economist, for 60 to 90 minutes. Watch three demo reels, read the booking FAQ, then check your date.',
  path: ROUTE,
  image: {
    url: '/img/photos/keynote-stage-podium.jpg',
    width: 2000,
    height: 1500,
    alt: 'Damian Mason on stage at the InSite CDM 2023 Winter Forum, one arm out toward the audience.',
  },
});

/**
 * The three demo reels are self-hosted. `content/videos.ts` stores the bare
 * filename as it exists in `_source/media/`, so the route maps each one onto
 * the copy that actually ships from `public/video/`. The content file is owned
 * by another phase and is not edited here.
 *
 * All three are still the uncompressed 1080p originals, 31MB to 39MB, and none
 * of them has a poster frame or a caption track yet. `preload="none"` on the
 * VideoEmbed means nothing downloads until a visitor presses play.
 */
const REEL_FILES: Record<string, string> = {
  'demo-food-waste': '/video/dm-food-waste-1080p.mp4',
  'demo-labor': '/video/dm-labor-1080p.mp4',
  'demo-innovation': '/video/dm-innovation-1080p.mp4',
};

const demoReels: Video[] = videosFor(ROUTE).map((video) =>
  video.kind === 'mp4' && REEL_FILES[video.id]
    ? { ...video, file: REEL_FILES[video.id] }
    : video,
);

/**
 * The program description runs in full in the section that opens this page's
 * middle, so the FAQ item carrying the same paragraph is dropped from the
 * accordion. Every other question the old page asked is here, including the
 * technology question whose answer was an empty div on the live site.
 */
const bookingFaq = faq.filter((item) => item.id !== 'presentation-content');

const CREDENTIALS = [
  {
    title: 'Knowledgeable',
    points: ['Degree in Ag Econ from Purdue University', 'Educated on current events'],
  },
  {
    title: 'Professional',
    points: ['Corporate background', 'Author', 'Podcast host'],
  },
  {
    title: 'Exceptionally funny',
    points: ['Professional comedian', 'Studied at Second City in Chicago'],
  },
  {
    title: 'Relatable',
    points: ['Farm raised', 'Farm owner', 'Three decades of business ownership'],
  },
];

export default function KeynotePage() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Speaking', path: '/speaking/' },
          { name: 'Keynote', path: ROUTE },
        ])}
      />

      {/* == 1. Hero ========================================================= */}
      <Hero
        id="keynote"
        eyebrow="The keynote program"
        title="A Leading Agriculture Presenter Who Talks Candidly About Current Events."
        // 71 characters. At the 6xl masthead step this headline laddered into
        // seven lines and pushed the portrait and the action below the fold.
        // 4xl is the lowest step the Didone is legal at and the highest step
        // this sentence can carry.
        titleSize="4xl"
        deck={
          <>
            <p>
              Motivating and inspiring audiences in both &lsquo;good&rsquo; and
              &lsquo;bad&rsquo; Ag climates. Damian speaks to companies around the globe
              that have a role in the world&rsquo;s most important industry: Agriculture.
            </p>
            <p>Keynote not enough? No problem! He delivers breakouts and panel discussions too.</p>
          </>
        }
        actions={[
          // The masthead already spends this viewport's one filled orange field
          // on the identical action, so this one is the navy outline.
          { label: 'Book Damian', href: BOOKING_HREF, variant: 'secondary' },
        ]}
        image={{
          src: '/img/photos/portrait-light-jacket.jpg',
          alt: 'Damian Mason outside a brick building in a checked sport coat, holding his glasses.',
          width: 1334,
          height: 2000,
        }}
        cutlineFolio="Fig. 01"
        cutline="Damian Mason. He studied Ag Econ at Purdue and improv at Second City, and he uses both in the same hour."
      />

      {/* == 2. The ledger =================================================== */}
      <StatRow id="record" title="The record" surface="sunken" />

      {/* == 3. The four credentials ========================================= */}
      <Section id="credentials" aria-labelledby="credentials-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Not your boring Ag speaker</Eyebrow>
            <Heading level={2} size="2xl" id="credentials-title">
              Why the crowd stays with him
            </Heading>
            <Prose>
              <p>
                You&rsquo;re not hiring a motivational speaker who read one Ag article on
                the plane. Damian has the Purdue Ag Econ degree, the Second City training,
                and an Indiana farm of his own. Three decades of business ownership sit
                behind all of it.
              </p>
            </Prose>
          </div>

          <ul className={`${styles.pillars} dm-grid12`} role="list">
            {CREDENTIALS.map((pillar) => (
              <li key={pillar.title} className="col-span-6 md:col-span-6 lg:col-span-3">
                <Card variant="ruled" className={styles.pillar}>
                  <Heading level={3} size="lg">
                    {pillar.title}
                  </Heading>
                  <ul className={styles.pillarPoints} role="list">
                    {pillar.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* == 4. The program ================================================== */}
      <Section id="program" surface="sunken" aria-labelledby="program-title">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-12 lg:col-span-7">
              <div className={styles.headTight}>
                <Eyebrow>The signature program</Eyebrow>
                <Heading level={2} size="2xl" id="program-title">
                  The Business of Agriculture
                </Heading>
              </div>

              <Prose>
                <p>
                  Damian&rsquo;s presentation is a forward-looking outlook about issues in
                  the marketplace that will be impacting the business of Agriculture. It is
                  fast-paced, humor-infused Ag commentary where he connects the dots from
                  consumer issues to regulation to political movements to societal changes
                  and current events, and what it means for our industry.
                </p>
                <p>
                  Also, he puts in a bit of feel-good facts about the industry. And, he
                  provides business reality and opportunity coverage, always bringing the
                  issues back to the crowd and making it about them.
                </p>
                <p>
                  Beginning in 2023 Damian titled the program The &ldquo;Ations&rdquo; of
                  Agriculture: the words ending in &ldquo;ation&rdquo; that impact our
                  industry. Immigration, population, regulation, confrontation, inflation,
                  threats from other nations.
                </p>
              </Prose>

              <div className={styles.actions}>
                <Button href={BOOKING_HREF} variant="secondary" size="lg">
                  Check your event date
                </Button>
              </div>
            </div>

            <figure className={`${styles.plate} col-span-6 md:col-span-12 lg:col-span-5`}>
              <div className={'dm-photo dm-photo--plate'}>
                <Image
                  className="dm-photo__img"
                  src="/img/photos/speaking-to-audience.jpg"
                  alt="Damian Mason working the front of a packed meeting room, seen from behind as the audience watches."
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 64rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 02 </span>
                Mid-program, and every face in the room is pointed the same direction.
                Programs run 60 to 90 minutes.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* == 5. What you can book ============================================ */}
      <Section id="formats" aria-labelledby="formats-title">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-12 lg:col-span-7">
              <div className={styles.headTight}>
                <Heading level={2} size="2xl" id="formats-title">
                  What you can book
                </Heading>
              </div>

              <ul className={styles.formats} role="list">
                <li className={styles.format}>
                  <Heading level={3} size="lg">
                    Keynote
                  </Heading>
                  <Prose measure="wide">
                    <p>
                      Damian speaks to companies around the globe that have a role in the
                      world&rsquo;s most important industry: Agriculture. Growers, ag
                      lenders, agronomists, pork producers, association boards and the
                      allied industries that sell to all of them.
                    </p>
                  </Prose>
                </li>
                <li className={styles.format}>
                  <Heading level={3} size="lg">
                    Extensions
                  </Heading>
                  <Prose measure="wide">
                    <p>
                      Keynote not enough? No problem! Damian also delivers breakouts and
                      panel discussions. The one caveat: he will not speak while people are
                      eating or tables are being cleared.
                    </p>
                  </Prose>
                </li>
              </ul>
            </div>

            <figure className={`${styles.plate} col-span-6 md:col-span-12 lg:col-span-5`}>
              <div className={'dm-photo dm-photo--plate'}>
                <Image
                  className="dm-photo__img"
                  src="/img/photos/agrigold-panel.png"
                  alt="Damian Mason on an AgriGold set, moderating a seated panel of three growers."
                  width={1414}
                  height={798}
                  loading="lazy"
                  sizes="(min-width: 64rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 03 </span>
                Damian moderating a grower panel for AgriGold. Breakouts, luncheons, and
                panels book alongside the keynote, not instead of it.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* == 6. The demo reels =============================================== */}
      <Section id="demo-reels" surface="deep" aria-labelledby="demo-reels-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Three cuts from live programs</Eyebrow>
            <Heading level={2} size="2xl" id="demo-reels-title">
              Watch Damian in Action: Short Video Demos
            </Heading>
          </div>

          <VideoGrid
            videos={demoReels}
            columns={3}
            headingLevel={3}
            label="Keynote demo reels"
          />

          <div className={styles.actions}>
            <Button
              href={YOUTUBE_CHANNEL}
              variant="secondary"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              More clips on YouTube
            </Button>
          </div>
        </Container>
      </Section>

      {/* == 7. The photo band =============================================== */}
      {/* The source shipped a full-bleed parallax strip here with no rows, no
          columns and no content at all. It becomes a real captioned figure. */}
      <Section as="div" density="tight">
        <Container width="wide">
          <figure className={styles.band}>
            <div className={'dm-photo dm-photo--band'}>
              <Image
                className="dm-photo__img"
                src="/img/photos/keynote-stage-podium.jpg"
                alt="Damian Mason on stage at the InSite CDM 2023 Winter Forum, one arm out toward the audience."
                width={2000}
                height={1500}
                loading="lazy"
                sizes="100vw"
              />
            </div>
            <figcaption className="dm-figure__caption">
              <span className="dm-figure__folio">Fig. 04 </span>
              InSite CDM Winter Forum, 2023. One of over 2,400 rooms since 1994.
            </figcaption>
          </figure>
        </Container>
      </Section>

      {/* == 8. Reviews ====================================================== */}
      <Section id="reviews" surface="sunken" aria-labelledby="reviews-title">
        <Container>
          <div className={styles.head}>
            <Heading level={2} size="2xl" id="reviews-title">
              Reviews
            </Heading>
            <Prose>
              <p>
                Three from meeting planners who sat in the room while it happened. Ten
                more, plus four on video, are on the reviews page.
              </p>
            </Prose>
          </div>

          <TestimonialGrid
            items={testimonialsFor(ROUTE)}
            columns={3}
            label="What meeting planners said"
          />

          <div className={styles.actions}>
            <Button href="/reviews/" variant="ghost">
              Read every review
            </Button>
          </div>
        </Container>
      </Section>

      {/* == 9. Bio ========================================================== */}
      <Section id="about-damian" aria-labelledby="about-damian-title">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-12 lg:col-span-8">
              <div className={styles.headTight}>
                <Eyebrow>Filed from the Indiana farm office</Eyebrow>
                <Heading level={2} size="2xl" id="about-damian-title">
                  Damian Mason: businessman, agriculturist, speaker, podcaster, author.
                </Heading>
              </div>

              <Prose>
                <p>
                  Damian Mason speaks on the two subjects he knows best: Business and
                  Agriculture. Since 1994, he has spoken to over 2,400 audiences in all 50
                  states and 7 foreign countries.
                </p>
                <p>
                  Damian is a graduate of Purdue University with a degree in Agriculture
                  Economics. He studied comedy writing and improvisation at The Second
                  City, Chicago, and is a member of the Screen Actors Guild.
                </p>
                <p>
                  When he&rsquo;s not traveling for work, Damian can be found on his
                  Indiana farm with his wife Lori or escaping from winter at their Arizona
                  residence.
                </p>
              </Prose>

              <div className={styles.actions}>
                <Button href={BOOKING_HREF} variant="secondary" size="lg">
                  Book Damian for your event
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* == 10. FAQ ========================================================= */}
      <Section id="faq" surface="sunken" aria-labelledby="faq-title">
        <Container width="narrow">
          <div className={styles.head}>
            <Eyebrow>Booking</Eyebrow>
            <Heading level={2} size="2xl" id="faq-title">
              Questions meeting planners ask
            </Heading>
            <Prose>
              <p>
                Fees, travel, room setup, and what happens between the handshake and the
                stage. Damian books most of his events directly with his clients, so
                you’re asking the man who shows up.
              </p>
            </Prose>
          </div>

          <FAQAccordion
            items={bookingFaq}
            withSchema
            schemaPath={ROUTE}
            idPrefix="keynote-faq"
          />

          <div className={styles.actions}>
            <Button href={`mailto:${contact.email}`} variant="secondary" size="lg">
              Email the office
            </Button>
          </div>
        </Container>
      </Section>

      {/* == 11. The close =================================================== */}
      <CTABand
        id="book"
        eyebrow="First step"
        heading="Check your date, then let’s talk."
        copy="Contact Damian to make sure he has your event date available. A simple contract and a small deposit hold it. He books his own airfare and rental car, and his office manager Lori handles what’s left."
        actions={[
          { label: 'Book Damian', href: BOOKING_HREF },
          { label: 'Sign up for Damian’s email list', href: '/join-the-conversation/', variant: 'secondary' },
        ]}
      />
    </>
  );
}

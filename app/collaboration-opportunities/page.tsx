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
// components/sections has no barrel file, so every section imports from its
// own module.
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { StatRow } from '@/components/sections/StatRow';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { VideoGrid } from '@/components/sections/VideoGrid';
import { JsonLd } from '@/components/seo';
import { buildBreadcrumbListSchema, buildVideoObjectSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { contact } from '@/content/site';
import { testimonialsFor } from '@/content/testimonials';
import { videosFor } from '@/content/videos';

import styles from './page.module.css';

const ROUTE = '/collaboration-opportunities/';
const CONTACT = '/contact-us/';
/* One newsletter target site-wide. The old page pointed the same CTA at
   /join-mailing-list/ while /reviews/ pointed it at /join-the-conversation/. */
const NEWSLETTER = '/join-the-conversation/';
const OFFICE_MAILTO = `mailto:${contact.email}`;

export const metadata: Metadata = buildMetadata({
  title: 'Collaboration Opportunities',
  description:
    'Podcast guesting, episode sponsorship, media commentary and content partnerships with Damian Mason. More than 40,000 people hear the podcast every month, and they work in food, fuel, and fiber.',
  path: ROUTE,
  // The old page shipped no og:image at all, so every share of it rendered as
  // a bare link. The root opengraph-image does not cascade to this segment.
  image: {
    url: '/img/photos/speaking-to-audience.jpg',
    width: 2000,
    height: 1336,
    alt: 'Damian Mason speaking to a seated room of farmers and agribusiness people.',
  },
});

/* The three the content layer places on this route. They are the same three
   that run on /keynote/, stored once in content/testimonials.ts rather than
   copied. The section says so out loud instead of passing them off as
   collaboration reviews. */
const reviews = testimonialsFor(ROUTE);

/* Two YouTube conversations and the innovation keynote cut. The MP4 gets a
   real poster frame here: the source shipped a bare <video controls> with no
   poster, no captions and no preload hint, so a phone rendered a black
   rectangle. VideoEmbed sets preload="none" for every MP4 already. */
const collaborationVideos = videosFor(ROUTE);

const VIDEO_POSTERS = {
  'demo-innovation': '/img/photos/keynote-stage-podium.jpg',
} as const;

const CREDENTIALS = [
  {
    title: 'Informed',
    items: [
      'Degree in Agriculture Economics from Purdue University',
      'Knowledgeable on current events',
      'Three decades of business ownership',
    ],
  },
  {
    title: 'Professional',
    items: [
      'Author and podcast host',
      'Background in corporate America',
      'Professional speaker to over 2,400 audiences in 50 states and 7 countries',
    ],
  },
  {
    title: 'Hilarious',
    items: [
      'Studied comedy writing and improv at The Second City in Chicago',
      'Professional comedian and member of the Screen Actors Guild',
    ],
  },
  {
    title: 'Relatable',
    items: [
      'Farm raised',
      'Farm owner',
      'Real world business experience',
      'An audience favorite!',
    ],
  },
];

const COLLABORATIONS = [
  'Be a guest or sponsor of Damian’s agriculture or business podcast.',
  'Feature Damian as a guest speaker or co-host for your podcast, company meeting, webinar, or live event.',
  'Invite Damian on your news or media channel to provide insights and commentary.',
  'Hire Damian as an influencer or brand promoter.',
  'Join with Damian for a one-on-one or small group coaching or consulting session.',
  'Brainstorm other unique ways we can work together to connect with your audience and reach your goals.',
];

export default function CollaborationOpportunitiesPage() {
  return (
    <>
      <JsonLd
        schema={[
          buildBreadcrumbListSchema([
            { name: 'Home', path: '/' },
            { name: 'Speaking', path: '/speaking/' },
            { name: 'Collaboration Opportunities', path: ROUTE },
          ]),
          buildVideoObjectSchema({
            name: 'Managing For The Future: A Candid Conversation with a 30 Year Old, 4th Gen Farmer',
            description:
              'An episode of The Business of Agriculture. Damian talks with a fourth generation farmer in his thirties about running the operation for the next thirty years.',
            youtubeId: 'M01PxhzRVFg',
            path: ROUTE,
          }),
          buildVideoObjectSchema({
            name: 'Survival Strategies For Small Business',
            description:
              'An episode of Do Business Better on what keeps a small business alive when the market turns against it.',
            youtubeId: 'csEaUJ52p3I',
            path: ROUTE,
          }),
        ]}
      />

      {/* ====================================================================
          01. Hero. The old page put an H2 eyebrow above the H1 and set the
          standfirst as an <h6> inside a <blockquote>, giving it a heading
          order of H2, H6, H1. Here the eyebrow is a mono running head, the H1
          is the only H1 on the page, and the deck is prose.
          The portrait is the same photograph the old page used as a CSS
          background on the hero column, Damian-Collab-crop-scaled.jpg, already
          normalized into public/img/photos as portrait-dark-blazer.jpg. As a
          background it carried no alt text and no caption; here it is a figure
          with a cutline, which is what the system requires of every photograph.
          Orange in this viewport: the primary button, plus the two + glyphs in
          the ledger below. Three, which is the ceiling.
          ==================================================================== */}
      <Hero
        id="hero"
        eyebrow="Collaborate with Damian"
        title={
          <>
            If it’s Agriculture,
            <br />
            it needs Damian.
          </>
        }
        deck="Be a guest on the show. Sponsor an episode. Co-host a webinar, or put your brand in front of an Ag audience that buys. More than 40,000 people listen every month, and they’re the real-world agriculture people you’re trying to reach."
        actions={[{ label: 'Work with Damian', href: CONTACT }]}
        image={{
          src: '/img/photos/portrait-dark-blazer.jpg',
          alt: 'Damian Mason in a charcoal blazer and jeans, leaning against a brick window frame.',
          width: 1467,
          height: 2000,
          priority: true,
        }}
        cutlineFolio="Fig. 01"
        cutline="Purdue Ag Econ degree, Second City Chicago, and a farm in Indiana. The economist argues the numbers and the comedian keeps the room awake."
      />

      {/* ====================================================================
          02. The ledger. Every figure is on the source page: 40,000 monthly
          listeners from the INFLUENCER card, 2,400 audiences in 50 states and
          7 countries from the PROFESSIONAL bullets.
          ==================================================================== */}
      <StatRow
        surface="sunken"
        items={[
          { value: '40,000', plus: true, label: 'Monthly listeners' },
          { value: '2,400', plus: true, label: 'Audiences addressed' },
          { value: '50', label: 'States' },
          { value: '7', label: 'Countries' },
        ]}
        restatement="Since 1994 he’s worked 2,400 audiences in all 50 states and 7 foreign countries. Another 40,000 hear him on the podcast every month, and they work in the business you sell into."
      />

      {/* ====================================================================
          03. Three collaboration tracks.
          ==================================================================== */}
      <Section surface="page" aria-labelledby="tracks-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Ways in</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 01" id="tracks-title">
              Three ways to work together.
            </Heading>
          </div>

          <div className={`dm-grid12 ${styles.grid}`}>
            <Card
              as="article"
              variant="ruled"
              className={`${styles.card} col-span-6 md:col-span-4`}
            >
              <Heading level={3} size="xl">
                Podcast host and guest
              </Heading>
              <Prose measure="full">
                <p>
                  Damian hosts two podcasts and runs the{' '}
                  <a href="/boasg/">Business of Ag Success Group</a>. He books guests
                  every week, and he’ll say yes to other people’s shows too. Want your
                  story in front of an audience that already works in your business?
                </p>
              </Prose>
              <div className={styles.cardAction}>
                <Button href={CONTACT} variant="ghost">
                  Contact Damian today!
                </Button>
              </div>
            </Card>

            <Card
              as="article"
              variant="ruled"
              className={`${styles.card} col-span-6 md:col-span-4`}
            >
              <Heading level={3} size="xl">
                News and commentary
              </Heading>
              <Prose measure="full">
                <p>
                  A story breaks and you need someone who can say what it does to a
                  grower’s balance sheet. Look no further. Damian has done it on Cheddar
                  News, Newsmax TV, Straight Arrow News and Eagle Country 95.9, and he
                  doesn’t need a briefing packet first.
                </p>
              </Prose>
            </Card>

            <Card
              as="article"
              variant="ruled"
              className={`${styles.card} col-span-6 md:col-span-4`}
            >
              <Heading level={3} size="xl">
                Influencer and promoter
              </Heading>
              <Prose measure="full">
                <p>
                  More than 40,000 people listen every month, and they work in the
                  business you sell into. If your brand belongs in front of them, say so
                  and we’ll talk.
                </p>
              </Prose>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ====================================================================
          04. The guest-appearance band, carried over from the source.
          ==================================================================== */}
      <CTABand
        id="guest-appearance"
        eyebrow="Booking"
        heading="For your next guest appearance."
        copy="Tell us the show, the date and who’s listening. We answer within one business day."
        actions={[{ label: 'Contact Damian', href: CONTACT }]}
      />

      {/* ====================================================================
          05. The four credential blurbs. The source set each one as a single
          <p> with literal bullet characters and <br /> separators, four times
          over, with a decorative icon-font glyph and no accessible name. These
          are real lists and the glyphs are gone.
          ==================================================================== */}
      <Section surface="sunken" aria-labelledby="credentials-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>The collaborator</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 02" id="credentials-title">
              Who you’re actually booking.
            </Heading>
          </div>

          <div className={`dm-grid12 ${styles.grid}`}>
            {CREDENTIALS.map((group) => (
              <Card
                key={group.title}
                as="article"
                variant="ruled"
                className={`${styles.card} col-span-6 md:col-span-6 lg:col-span-3`}
              >
                <Heading level={3} size="lg">
                  {group.title}
                </Heading>
                <Prose measure="full">
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Prose>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ====================================================================
          06. Watch Damian in Action. Three items, one of them the 39MB
          innovation MP4, which now ships with a poster frame and preload="none"
          so nothing downloads until a visitor presses play.
          ==================================================================== */}
      <Section surface="page" aria-labelledby="video-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Samples</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 03" id="video-title">
              Watch Damian in action.
            </Heading>
          </div>
          <Prose className={styles.headIntro}>
            <p>
              Two full conversations and one cut from a live keynote. The first two come
              from The Business of Agriculture and Do Business Better. The third is the
              ag innovation segment, and it’s the version you’d get on your stage.
            </p>
          </Prose>

          <div className={styles.block}>
            <VideoGrid
              videos={collaborationVideos}
              columns={3}
              headingLevel={3}
              posters={VIDEO_POSTERS}
              label="Podcast and keynote samples"
            />
          </div>
        </Container>
      </Section>

      {/* ====================================================================
          07. The collaboration menu. The source ran two H2s inside one module
          and set the six items as six paragraphs, each opening with a
          <span class="hgKElc"> checkmark pasted out of a Google results page.
          One heading, one real list.
          ==================================================================== */}
      <Section surface="sunken" aria-labelledby="work-together-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>The menu</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 04" id="work-together-title">
              How can we work together?
            </Heading>
          </div>

          <div className={`dm-grid12 ${styles.split}`}>
            <div className="col-span-6 md:col-span-12 lg:col-span-7">
              <Prose lead measure="full">
                <p>
                  Damian Mason is a businessman, agriculturist, speaker, podcaster, media
                  guest, Ag personality, influencer, author, and consultant. His favorite
                  role? Getting to join forces with other visionaries on projects that
                  reach the real people of agriculture and business with content that
                  matters.
                </p>
              </Prose>
              <Prose measure="full" className={styles.checklist}>
                <p>As a collaborator with Damian, you could:</p>
                <ul>
                  {COLLABORATIONS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Prose>
              <div className={styles.actions}>
                <Button href={CONTACT} variant="primary" size="lg">
                  Contact Damian
                </Button>
                <Button href={OFFICE_MAILTO} variant="secondary" size="lg">
                  Email the office
                </Button>
              </div>
            </div>

            <figure
              className={`dm-figure ${styles.figure} col-span-6 md:col-span-12 lg:col-span-5`}
            >
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/speaking-to-audience.jpg"
                  alt="Damian Mason, seen from behind, speaking to a seated room of farmers and agribusiness people at banquet tables."
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 64rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">FIG. 02 </span>
                Growers, agronomists and ag lenders at a winter meeting. This is the room
                a collaboration puts you in front of. Damian is the one with his back to
                the camera.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ====================================================================
          08. Reviews. These three are the /keynote/ testimonials, and the
          source page carried byte-identical copies of them with no framing at
          all. They are stored once in content/testimonials.ts and the standfirst
          says where they came from rather than passing speaking reviews off as
          collaboration reviews.
          ==================================================================== */}
      <Section surface="page" aria-labelledby="reviews-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Reviews</Eyebrow>
            <Heading level={2} size="2xl" folio="No. 05" id="reviews-title">
              What they said after working with him.
            </Heading>
          </div>
          <Prose className={styles.headIntro}>
            <p>
              All three of these came in after a live event, not a podcast. It’s the same
              prep either way. More of them, including the video ones, are on the{' '}
              <a href="/reviews/">reviews page</a>.
            </p>
          </Prose>

          <div className={styles.block}>
            <TestimonialGrid
              items={reviews}
              columns={3}
              label="Client reviews"
            />
          </div>

          <div className={styles.actions}>
            <Button href={OFFICE_MAILTO} variant="secondary">
              Have a question? Email us!
            </Button>
          </div>
        </Container>
      </Section>

      {/* ====================================================================
          09. The newsletter close.
          ==================================================================== */}
      <CTABand
        id="join"
        eyebrow="The list"
        heading="Want to join the conversation?"
        copy="One email when there’s something worth your time: where Damian is speaking next, and what’s moving in the business of food, fuel, and fiber. No daily clutter."
        actions={[{ label: 'Sign up for Damian’s email list', href: NEWSLETTER }]}
      />
    </>
  );
}

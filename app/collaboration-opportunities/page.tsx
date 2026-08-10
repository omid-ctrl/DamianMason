import Image from 'next/image';
import Link from 'next/link';
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
import { jobTitleList } from '@/content/job-titles';
import { testimonialsFor } from '@/content/testimonials';
import { videosFor } from '@/content/videos';

import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

const ROUTE = '/collaboration-opportunities/';
const CONTACT = '/contact-us/';
/* One newsletter target site-wide. The old page pointed the same CTA at
   /join-mailing-list/ while /reviews/ pointed it at /join-the-conversation/. */
const NEWSLETTER = '/join-the-conversation/';
const OFFICE_MAILTO = `mailto:${contact.email}`;

export const metadata: Metadata = buildMetadata({
  title: 'Podcast Sponsorship and Collaboration',
  description:
    'Sponsor an episode, guest on one, or pitch a content partnership. The podcast reaches more than 40,000 listeners a month in food, fuel, and fiber.',
  path: ROUTE,
  // The old page shipped no og:image at all, so every share of it rendered as
  // a bare link. The root opengraph-image does not cascade to this segment.
  image: {
    url: '/img/photos/speaking-to-audience.jpg',
    width: 2000,
    height: 1336,
    alt: imageAlt['/img/photos/speaking-to-audience.jpg'],
  },
});

/* The three the content layer places on this route. They are the same three
   that run on /keynote/, stored once in content/testimonials.ts rather than
   copied. The section says so out loud instead of passing them off as
   collaboration reviews. */
const reviews = testimonialsFor(ROUTE);

/* Two YouTube conversations and the innovation keynote cut. The MP4 carries
   its own poster and its own shipping path in content/videos.ts now, so this
   route no longer patches either one. It used to patch neither, which is why
   the reel here pointed at a filename that does not exist in public/. */
const collaborationVideos = videosFor(ROUTE);

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
          /* The space before the break is load bearing. Without it the text
             node resolves to "If it's Agriculture,it needs Damian." and that
             is what the accessible name, the indexed text and a screen reader
             all get, however correctly the two lines render. */
          <>
            If it’s Agriculture,{' '}
            <br />
            it needs Damian.
          </>
        }
        /* The figure is gone from this deck. "More than 40,000 people listen
           every month" is the canonical sponsorship sentence and it belongs to
           the Influencer card in No. 01 below, which is VOICE.md Pair 3. It ran
           here as well, so the same eight words opened two blocks on one page,
           and the ledger restated the number a third time. */
        deck="Be a guest on one of Damian’s current shows. Sponsor an episode. Feature him on your podcast, company meeting, webinar, live event, news, or media channel."
        actions={[{ label: 'Work with Damian', href: CONTACT }]}
        image={{
          src: '/img/photos/portrait-charcoal-jacket.jpg',
          alt: imageAlt['/img/photos/portrait-charcoal-jacket.jpg'],
          width: 1333,
          height: 2000,
          preload: true,
          feature: true,
        }}
        cutline="Purdue Ag Econ degree, Second City Chicago, and a farm in Indiana. The economist argues the numbers and the comedian keeps the room awake."
      />

      {/* ====================================================================
          02. The ledger. Every figure is on the source page: 40,000 monthly
          listeners from the INFLUENCER card, 2,400 audiences in 50 states and
          7 countries from the PROFESSIONAL bullets.
          ==================================================================== */}
      <StatRow
        /* Navy. Every route on this site closes on a `deep` CTA band, and
           most of them had no dark ground at all before it: the reader got two
           greys 1.11:1 apart for thousands of pixels and then one arrival. A
           ledger is the right block to punctuate with, because it is the one
           thing on a page that is pure proof, and `deep-alt` is a step off the
           closing band so the close still reads as an arrival rather than a
           repeat.

           It also moves the orange plus glyphs out of a documented exception:
           on a light ground --ink-hot measures 2.72:1 and only ships because it
           is aria-hidden, and in a deep scope it remaps to orange-400 at
           5.60:1, where the brand orange is legal as a letterform. */
        surface="deep-alt"
        items={[
          { value: '40,000', plus: true, label: 'Monthly listeners' },
          { value: '2,400', plus: true, label: 'Audiences addressed' },
          { value: '50', label: 'States' },
          { value: '7', label: 'Countries' },
        ]}
        /* Not a restatement of the glyphs. The previous line ("Since 1994 he's
           worked 2,400 audiences in all 50 states and 7 foreign countries")
           repeated all four figures standing above it, and this route already
           carries that same claim as a PROFESSIONAL bullet further down
           ("Professional speaker to over 2,400 audiences in 50 states and 7
           countries"), so it ran twice on one page. The reader here is a
           prospective sponsor, so the prose says which figures they are
           actually buying. */
        restatement="The speaking record and monthly podcast audience are the two established channels available to prospective collaborators."
      />

      {/* ====================================================================
          03. Three collaboration tracks.
          ==================================================================== */}
      <Section surface="page" aria-labelledby="tracks-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Ways in</Eyebrow>
            <Heading level={2} size="2xl" id="tracks-title">
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
                  Damian&rsquo;s current podcast and video roster has four formats: The
                  Business of Agriculture, Do Business Better, XtremeAg, and UPROOTED. He
                  also runs the <Link href="/boasg/">Business of Ag Success Group</Link>,
                  books guests for his own programs, and joins other people&rsquo;s.
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
                  News, NewsmaxTV, Straight Arrow News, and Eagle Country 95.9, and he
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
                  More than 40,000 people listen every month. Featured guest,
                  sponsorship, and promotional opportunities can raise awareness of a
                  brand&rsquo;s message across Damian&rsquo;s programming.
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
        copy="Tell us the show, the date, and who’s listening. We typically answer within one business day."
        actions={[{ label: 'Contact Damian', href: CONTACT }]}
      />

      {/* ====================================================================
          05. The four credential blurbs. The source set each one as a single
          <p> with literal bullet characters and <br /> separators, four times
          over, with a decorative icon-font glyph and no accessible name. These
          are real lists and the glyphs are gone.
          ==================================================================== */}
      {/* Green. Four claims about the man, so it takes the ground the man's
          own sections take across the site. */}
      <Section surface="forest" aria-labelledby="credentials-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>The collaborator</Eyebrow>
            <Heading level={2} size="2xl" id="credentials-title">
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
            <Heading level={2} size="2xl" id="video-title">
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
            {/* The Innovation reel is the one asset the old site placed on two
                pages, so its description in content/videos.ts printed a
                byte-identical cutline here and on /keynote/. /keynote/ is
                selling the program, so there the cutline says what the clip is
                about. Here the reader is a prospective sponsor, so it says what
                the clip demonstrates about the room. */}
            <VideoGrid
              videos={collaborationVideos}
              columns={3}
              headingLevel={3}
              label="Podcast and keynote samples"
              /* All three, or none: DESIGN_SYSTEM 6.1. One captioned tile in a
                 row of three bottomed the row out 60px apart for a reason a
                 reader cannot see. The two podcast tiles are title-card
                 captures rather than photographs, so their cutlines say what
                 the title card says: the show, the guest, and the subject.
                 Nothing here is inferred from anything but the frame. */
              cutlines={{
                'managing-for-the-future':
                  'The Business of Agriculture, with Luke Roush. Managing for the future, from a thirty year old on the fourth generation of the same farm.',
                'survival-strategies-for-small-business':
                  'Do Business Better, with Brad McDonald. Survival strategies for small business, which is the half of Damian’s work that has nothing to do with a tractor.',
                'demo-innovation':
                  'Watch the room rather than the stage: this is an audience of growers being told who pays for innovation, and staying with it.',
              }}
            />
          </div>
        </Container>
      </Section>

      {/* ====================================================================
          07. The collaboration menu. The source ran two H2s inside one module
          and set the six items as six paragraphs, each opening with a
          <span class="hgKElc"> checkmark pasted out of a Google results page.
          One heading, one real list.

          THE INQUIRY FORM IS DELIBERATELY NOT CARRIED OVER. The source section
          shipped a Divi form with four fields (Email, Full Name, Phone,
          Message) that POSTed to a WordPress nonce endpoint. This build has no
          server and no form service, so that backend does not exist here and a
          re-drawn copy of the form would submit nowhere. Lead capture on this
          site is therefore mailto-only: the two actions below are the
          replacement, and /contact-us/ states what to put in a first email so
          the Message field's job is still done. This is the site's one
          intentional functional reduction and it is logged in
          docs/OPEN-ITEMS.md for the client to overturn if they want a hosted
          form. The Mailchimp form on /contact-us/ and
          /join-the-conversation/ is a newsletter signup, not this.
          ==================================================================== */}
      <Section surface="sunken" aria-labelledby="work-together-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>The menu</Eyebrow>
            <Heading level={2} size="2xl" id="work-together-title">
              How can we work together?
            </Heading>
          </div>

          <div className={`dm-grid12 ${styles.split}`}>
            <div className="col-span-6 md:col-span-12 lg:col-span-7">
              <Prose lead measure="full">
                {/* The nine titles come from content/job-titles.ts. This
                    sentence is verbatim source on this route
                    (`_source/pages/collaboration-opportunities.md:121`) and on
                    /keynote/ (`keynote.md:180`), and it was hand typed on three
                    routes with three different item counts. */}
                <p>
                  Damian Mason is a {jobTitleList()}. His favorite role? Getting to join
                  forces with other visionaries on projects that reach the real people of
                  agriculture and business with content that matters.
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
                  alt={imageAlt['/img/photos/speaking-to-audience.jpg']}
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 64rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                Damian speaking to a live audience. He is the one with his back to the
                camera.
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
            <Heading level={2} size="2xl" id="reviews-title">
              What they said after working with him.
            </Heading>
          </div>
          <Prose className={styles.headIntro}>
            <p>
              These three came in after live events, not podcasts. The{' '}
              <Link href="/reviews/">reviews page</Link> brings together all fifteen
              written speaking testimonials and the four videos carried on the original
              reviews page.
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
        /* Not the NewsletterForm's default blurb reworded. That component
           renders its own promise on /contact-us/ and elsewhere, and this band
           was saying the same thing in the same shape one route over. */
        copy="Sponsors and guests hear about the show before anybody else does, and so does everyone else on the list. It costs an email address."
        actions={[{ label: 'Sign up for Damian’s email list', href: NEWSLETTER }]}
      />
    </>
  );
}

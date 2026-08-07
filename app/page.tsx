import Image from 'next/image';
import Link from 'next/link';

import {
  Button,
  Card,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
} from '@/components/ui';
// components/sections has no barrel file, so every section is imported from
// its own module.
import { CTABand } from '@/components/sections/CTABand';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { Hero } from '@/components/sections/Hero';
import { LogoWall } from '@/components/sections/LogoWall';
import { StatRow } from '@/components/sections/StatRow';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { VideoGrid } from '@/components/sections/VideoGrid';
import { JsonLd } from '@/components/seo';
import { faq } from '@/content/faq';
import { contact } from '@/content/site';
import { testimonialsFor } from '@/content/testimonials';
import { videosFor } from '@/content/videos';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

/**
 * HOME.
 *
 * Source of truth: `_source/pages/home.md`, verified against
 * `_source/html/home.html`. Twelve sections of the old page are carried over
 * here; what was dropped and why is recorded in the pipeline return.
 *
 * Four things the old page shipped that this one does not, all of them
 * deliberate: the Media Kit download (client request, and it pointed at the
 * WP Engine staging host), the "Shop Now" button and its five star glyphs
 * (commerce is gone from this site), the dead full width click target whose
 * registered URL was the literal string "#", and the two FAQ panels that
 * loaded open on an empty item and on the words "Your Title Goes Here".
 */

export const metadata = buildMetadata({
  title: 'Damian Mason, Agricultural Keynote Speaker',
  description:
    'Since 1994 Damian Mason has spoken to over 2,400 audiences in all 50 states and 7 foreign countries. Book the keynote, or start with the Monday podcast.',
  path: '/',
  titleIsAbsolute: true,
});

const homeTestimonials = testimonialsFor('/');
const homeVideos = videosFor('/');

/** The four claims the old page set as four separate <h2> elements. */
const CLAIMS = ['Thought Provoking', 'Engaging', 'Enthusiastic', 'Hilarious'] as const;

/** Section 6 of the source: the four things a meeting planner is buying. */
const PLANNER_BENEFITS = [
  {
    title: 'Custom Messages',
    body: 'Material that’s fresh, new, and relevant for your audience. Damian writes to the year your growers are actually having.',
  },
  {
    title: 'Guaranteed Success',
    body: 'Your audience leaves entertained and holding immediate take-aways. That’s the whole job.',
  },
  {
    title: 'Flawless Process',
    body: 'A simple contract and a small deposit hold your date. The balance is due the day of the event.',
  },
  {
    title: 'Add-On Options',
    body: 'Keynote not enough? No problem! Add an in-depth, extended breakout session alongside it.',
  },
] as const;

/** Section 7 of the source: the three roles, as ruled cards rather than as the
 *  three macOS screenshots the old page used as marketing imagery. */
const ROLES = [
  {
    title: 'Podcast Host and Guest',
    body: 'The Business of Agriculture runs more than 70,000 views and downloads a month, and Damian guests on other shows in the business of food, fuel, and fiber.',
    href: '/the-business-of-agriculture/',
    linkLabel: 'Hear the podcast',
  },
  {
    title: 'News and Commentary',
    body: 'Cheddar News on climate and food shortages. NewsmaxTV on wheat and food price inflation. When a network needs the fertilizer shortage explained on camera, they call.',
    href: '/blog-news/',
    linkLabel: 'Watch the on-air clips',
  },
  {
    title: 'Influencer and Promoter',
    body: 'More than 40,000 people listen every month, and they work in the business you sell into. If your brand belongs in front of them, say so and we’ll talk.',
    href: '/collaboration-opportunities/',
    linkLabel: 'See collaboration options',
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd
        id="breadcrumb-home"
        schema={buildBreadcrumbListSchema([{ name: 'Home', path: '/' }])}
      />

      {/* == 1. Hero ========================================================
          Portrait variant at the 0.30 veil. The meeting planner is buying a
          man for a stage and has to see his face above the fold. The old
          hero's two decorative chevron PNGs with empty alt are not carried
          over: they carried no information and no cutline could be written
          for them. */}
      <Hero
        id="hero"
        eyebrow="Keynote Speaker • Media Guest • Podcaster • Author"
        title="Straight-Forward Agriculture Dialogue"
        deck="Purdue Ag Econ degree. Second City Chicago. An Indiana farm of his own. Since 1994 Damian has taken all three to 2,400 audiences in 50 states and 7 countries."
        // The masthead already carries a persistent orange "Book Damian", so
        // the hero's own primary is labelled for the first thing a meeting
        // planner actually does rather than repeating the chrome word for
        // word: "First step: contact Damian to make sure he has your event
        // date available."
        actions={[
          { label: 'Check Your Event Date', href: '/contact-us/' },
          { label: 'See the Keynote', href: '/keynote/' },
        ]}
        image={{
          src: '/img/photos/portrait-black-suit.jpg',
          alt: 'Damian Mason, arms folded, in a dark blazer beside a window.',
          width: 1333,
          height: 2000,
          priority: true,
        }}
        cutlineFolio="Fig. 01"
        cutline="Damian books his own airfare and rental car. His office manager Lori handles everything after that."
      />

      {/* == 2. The ledger ================================================== */}
      <StatRow surface="sunken" eyebrow="Track record" title="Three Decades on Stage" />

      {/* == 3. Not Your Boring Ag Speaker ==================================
          On the old page each of the four claims below was its own <h2>,
          which put five H2s on the page before the first real section head.
          The section gets one real heading here and the claims become the
          list they always were. */}
      <Section id="not-boring" aria-labelledby="not-boring-title">
        <Container>
          <div className={`dm-grid12 ${styles.sectionGrid}`}>
            <div className={`${styles.head} col-span-6 md:col-span-9`}>
              <Eyebrow>What you’re booking</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 01" id="not-boring-title">
                Not Your Boring Ag Speaker
              </Heading>
            </div>

            <ul className={`${styles.claims} col-span-6 md:col-span-5`}>
              {CLAIMS.map((claim, index) => (
                <li key={claim} className={styles.claim}>
                  <span className={styles.claimIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.claimTerm}>{claim}</span>
                </li>
              ))}
            </ul>

            <div className={`${styles.stack} col-span-6 md:col-span-7`}>
              <Prose>
                <p>
                  Damian Mason has an exceptional understanding of the Agriculture industry,
                  he’s been involved in it his entire life. He reads the research, tracks
                  current events, and calls the industry leaders who tell him what’s actually
                  coming. Your growers get the outlook, not the forecast.
                </p>
                <p>
                  And he does it without draining the room. Damian has an uncanny ability to
                  stir up feelings of dignity and pride for people working in the most
                  important industry in the world. That’s the take-away meeting planners book
                  him twice for.
                </p>
              </Prose>
              <div className={styles.actions}>
                <Button href="/keynote/" variant="secondary">
                  See the Keynote Program
                </Button>
              </div>
            </div>

            <figure className={`dm-figure ${styles.plate} col-span-6 md:col-span-8`}>
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/speaking-to-audience.jpg"
                  alt="Damian Mason, seen from behind in a tan sport coat, working a room of growers seated at long banquet tables, several of them grinning back at him."
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 48rem) 56rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 02 </span>
                Damian runs 60 to 90 minutes. He won’t speak while people are eating or
                tables are being cleared.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* == 4. A win, win, win ============================================
          The old section leaned on WEB-COLLAGE-2.png, a stack of event photos
          flattened into one 1152x1500 PNG, plus four 256px Divi icons. The
          collage is not responsive and none of its photographs is separately
          addressable, so a real photograph and a mono index carry the section
          instead. */}
      <Section id="win-win-win" surface="sunken" aria-labelledby="win-win-win-title">
        <Container>
          <div className={`dm-grid12 ${styles.sectionGrid}`}>
            <div className={`${styles.head} col-span-6 md:col-span-9`}>
              <Eyebrow>For meeting planners</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 02" id="win-win-win-title">
                A Win, Win, Win for Event Planners, Organizers, and Audience Attendees
              </Heading>
            </div>

            <ul className={`${styles.cardList} dm-grid12 col-span-6 md:col-span-12`}>
              {PLANNER_BENEFITS.map((benefit, index) => (
                <li key={benefit.title} className="col-span-6 md:col-span-3">
                  <Card variant="ruled" className={styles.cardBody}>
                    <span className={styles.cardIndex} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Heading level={3} size="lg">
                      {benefit.title}
                    </Heading>
                    <Prose measure="narrow">
                      <p>{benefit.body}</p>
                    </Prose>
                  </Card>
                </li>
              ))}
            </ul>

            <figure className={`dm-figure ${styles.plate} col-span-6 md:col-span-7`}>
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/breakout-session-audience.jpg"
                  alt="Damian Mason presenting to a ballroom of attendees seated at round tables, a slide on the screen behind him."
                  width={2000}
                  height={1500}
                  loading="lazy"
                  sizes="(min-width: 48rem) 48rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 03 </span>
                A breakout session in the round. Extended sessions get booked alongside the
                keynote, not instead of it.
              </figcaption>
            </figure>

            <div className={`${styles.stack} col-span-6 md:col-span-5`}>
              <Prose measure="narrow">
                <p>
                  Booking a date, sizing up a program, or working out the travel line item?
                  The meeting coordinators page has the contract terms, the travel fee, and
                  the room setup.
                </p>
              </Prose>
              <div className={styles.actions}>
                <Button href="/meeting-coordinators/" variant="secondary">
                  See Fees, Travel, and AV
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* == 5. The client wall =============================================
          All 21 marks the client supplied, replacing the six the old page
          shipped at resolutions running from 400px to 2560px wide with three
          of them carrying no alt text at all and a fourth carrying the wrong
          alt text. */}
      <LogoWall
        id="clients"
        eyebrow="Client roster"
        title="Some of Damian’s Clients"
        folio="No. 03"
        intro="Cargill, Merck, Land O’Lakes Purina, CLAAS, Pioneer, and 16 more."
      />

      {/* == 6. If it’s Agriculture, it Needs Damian ======================== */}
      <Section id="roles" surface="sunken" aria-labelledby="roles-title">
        <Container>
          <div className={`dm-grid12 ${styles.sectionGrid}`}>
            <div className={`${styles.head} col-span-6 md:col-span-9`}>
              <Eyebrow>A leading voice in the industry, sought after for commentary</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 04" id="roles-title">
                If it’s Agriculture, it Needs Damian.
              </Heading>
            </div>

            <ul className={`${styles.cardList} dm-grid12 col-span-6 md:col-span-12`}>
              {ROLES.map((role) => (
                <li key={role.title} className="col-span-6 md:col-span-4">
                  <Card variant="ruled" className={styles.cardBody}>
                    <Heading level={3} size="lg">
                      {role.title}
                    </Heading>
                    <Prose measure="narrow">
                      <p>{role.body}</p>
                    </Prose>
                    <p className={styles.cardLink}>
                      <Link href={role.href}>{role.linkLabel}</Link>
                    </p>
                  </Card>
                </li>
              ))}
            </ul>

            <div className={`${styles.actions} col-span-6 md:col-span-12`}>
              <Button href="/contact-us/" variant="secondary">
                Inquire About Working With Damian
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* == 7. The podcast band ===========================================
          The old page made these two destinations clickable with a Divi
          et_link_options_data entry rather than an anchor, so neither was
          focusable, crawlable or visible as a link. Both are real buttons
          here.

          Both actions are secondary on purpose. The masthead carries a
          persistent orange "Book Damian" field, so the only page-level
          primaries on this route are the hero and the close. A third filled
          field mid-page would spend the orange budget on an action that is not
          the one that earns money. */}
      <CTABand
        id="podcast"
        folio="No. 05"
        eyebrow="Connect the dots"
        heading="Connecting people of the world’s most important industry."
        copy="You don’t need anyone telling you the weather forecast or the commodity prices, technology does that for you! What you need is a connection with real-world agriculture people and topics that inform, educate, and help you grow."
        actions={[
          {
            label: 'Hear the Podcast',
            href: '/the-business-of-agriculture/',
            variant: 'secondary',
          },
          { label: 'Join the Success Group', href: '/boasg/', variant: 'secondary' },
        ]}
        panel={{
          eyebrow: 'The Business of Agriculture',
          value: '70,000',
          plus: true,
          label: 'Views and downloads a month',
          note: 'Podcast by Damian Mason',
        }}
      />

      {/* == 8. What people are saying ====================================== */}
      <Section id="reviews" aria-labelledby="reviews-title">
        <Container>
          <div className={`dm-grid12 ${styles.sectionGrid}`}>
            <div className={`${styles.head} col-span-6 md:col-span-9`}>
              <Eyebrow>Rave reviews</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 06" id="reviews-title">
                What People Are Saying
              </Heading>
            </div>

            <div className="col-span-6 md:col-span-5">
              <TestimonialGrid
                items={homeTestimonials}
                variant="featured"
                featuredId="amy-b-agroliquid"
              />
            </div>

            <div className={`${styles.stack} col-span-6 md:col-span-7`}>
              <VideoGrid
                videos={homeVideos}
                columns={2}
                headingLevel={3}
                label="Video testimonials from Damian Mason’s clients"
              />
              <div className={styles.actions}>
                <Button href="/reviews/" variant="secondary">
                  More Reviews
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* == 9. The books ==================================================
          The old page ran this endorsement under a five star graphic built
          from five separate Divi icon modules and closed it with a "Shop Now"
          button into the WooCommerce store. The store is gone, so the quote
          points at the books section of the About page instead. No price, no
          rating, no cart. */}
      <Section id="books" surface="sunken" aria-labelledby="books-title">
        <Container>
          <div className={`dm-grid12 ${styles.sectionGrid}`}>
            <div className={`${styles.head} col-span-6 md:col-span-9`}>
              <Eyebrow>Also in print</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 07" id="books-title">
                He Writes the Books, Too
              </Heading>
            </div>

            <div className="col-span-6 md:col-span-5">
              <TestimonialGrid
                items={homeTestimonials}
                variant="featured"
                featuredId="book-endorsement-unattributed"
              />
            </div>

            <div className={`${styles.stack} col-span-6 md:col-span-7`}>
              <Prose>
                <p>
                  Two titles: <em>Food Fear</em>, on why the hype around your dinner is wrong,
                  and <em>Do Business Better</em>, on defining success on your own terms.
                  Damian wrote the second one after speaking to companies such as Merck, Land
                  O’Lakes, and Cargill.
                </p>
              </Prose>
              <div className={styles.actions}>
                <Button href="/about/#books" variant="secondary">
                  See the Books
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* == 10. FAQ =======================================================
          Thirteen real questions. Nothing opens by default, there is no
          placeholder item, and the products question the client asked to have
          removed is not in content/faq.ts to begin with. */}
      <Section id="faq" aria-labelledby="faq-title">
        <Container>
          <div className={`dm-grid12 ${styles.sectionGrid}`}>
            <div className={`${styles.stackTight} col-span-6 md:col-span-4`}>
              <Eyebrow>Booking questions</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 08" id="faq-title">
                Do You Have Any Questions?
              </Heading>
              <Prose measure="narrow">
                <p>
                  Not finding the answer to your question?{' '}
                  <a href={`mailto:${contact.email}`}>Email us</a> and we’ll answer it.
                </p>
              </Prose>
            </div>

            <div className="col-span-6 md:col-span-8">
              <FAQAccordion items={faq} withSchema schemaPath="/" idPrefix="home-faq" />
            </div>
          </div>
        </Container>
      </Section>

      {/* == 11. The close =================================================
          The old page's "Join the Conversation" section was a heading and one
          button to the mailing list, sitting on its own band. It is folded in
          here as the secondary action so the page closes on one ask rather
          than two. */}
      <CTABand
        id="book"
        eyebrow="Next step"
        heading="Book Damian for Your Next Event"
        copy="First step: contact Damian to make sure he has your event date available. A simple contract and a small deposit hold it."
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
          { label: 'Sign Up for Damian’s Mailing List', href: '/join-the-conversation/' },
        ]}
      />
    </>
  );
}

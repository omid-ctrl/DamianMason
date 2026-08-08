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
import { imageAlt } from '@/content/image-alt';
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
    body: 'A simple contract and a small deposit hold your date. What’s left is due the day of the event.',
  },
  {
    title: 'Add-On Options',
    body: 'Keynote not enough? No problem! Add an in-depth, extended breakout session alongside it.',
  },
] as const;

/** Section 7 of the source: the three roles, as ruled cards rather than as the
 *  three macOS screenshots the old page used as marketing imagery. */
/** The two print jackets, for section No. 07. The audiobook cover is
 *  deliberately absent: see the note at the rail. */
const HOME_JACKETS = [
  {
    src: '/img/photos/food-fear-book-cover.png',
    alt: 'Cover of Food Fear by Damian Mason: a tomato held in an open palm, casting the shadow of a monster.',
  },
  {
    src: '/img/photos/do-business-better-book-cover.png',
    alt: imageAlt['/img/photos/do-business-better-book-cover.png'],
  },
] as const;

const ROLES = [
  {
    title: 'Podcast Host and Guest',
    /* The weather-forecast refusal runs verbatim from the source in this
       page's own No. 05 band. It ran twice more on this route, here and in the
       No. 01 body, which made Home say it three times. This card and that
       paragraph now carry their own facts. */
    /* The 70,000 figure and its wording belong to /podcasts/, where the closing
       panel's note carries it under a ledger that labels the unit. This card
       says what the show is. */
    body: 'The Business of Agriculture drops every Monday, and he guests on other people’s shows in between. Smart talk about food, fuel, and fiber, and strong opinions you are free to disagree with.',
    href: '/the-business-of-agriculture/',
    linkLabel: 'Hear the podcast',
  },
  {
    title: 'News and Commentary',
    /* The "he doesn't need a briefing packet first" close is the same eight
       words that end the News and Commentary card on
       /collaboration-opportunities/, which is the route that sells the media
       booking. This card names the segments instead. */
    body: 'Cheddar News on climate and food shortages. NewsmaxTV on wheat and food price inflation. Straight Arrow News on the egg market. Three networks, three subjects, one phone call each.',
    href: '/blog-news/',
    linkLabel: 'Watch the on-air clips',
  },
  {
    /* The 40,000 listeners sentence is the canonical sponsorship pitch and it
       lives on /collaboration-opportunities/, the page that owns the ask. This
       card carries a different fact so a visitor moving Home to Speaking to
       Collaboration isn't read the same 27 words three times. */
    /* "If your brand belongs in front of them, say so and we'll talk" is
       VOICE.md section 6, Pair 3, written as an illustration for ONE card on
       /collaboration-opportunities/. It had been copied onto this route and
       onto /podcasts/, which is a worked example becoming a site tic. The
       canonical instance stays where VOICE.md put it. This card closes on
       what this route sells. */
    title: 'Influencer and Promoter',
    body: 'Ten brands already sponsor The Business of Agriculture, from soil data to crop protection. Their customers are the people who are already listening on Monday morning.',
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
          Cut-out variant. The meeting planner is buying a man for a stage and
          has to see him above the fold, and until the media-kit rescue the
          strongest way to do that was a 4:5 plate capped at 32rem, which
          rendered 492x615 at 1440 and used about a third of the viewport.
          portrait-cutout.png is the same shoot with a real alpha channel, so
          he can stand at 491x736 on the page ground with no box, no crop and
          no veil: twenty per cent taller, at full chroma, standing on the
          closing rule. Same argument, more of it.

          The old hero's two decorative chevron PNGs with empty alt are still
          not carried over: they carried no information and no cutline could be
          written for them. */}
      <Hero
        id="hero"
        variant="cutout"
        eyebrow="Keynote Speaker • Media Guest • Podcaster • Author"
        /* KNOWN, MEASURED, AND NOT FIXABLE HERE: this H1 breaks at the hyphen
           in "Straight-Forward" at every width from about 1030 up. Holding the
           compound together with white-space: nowrap was tried and reverted,
           because it does not fit and cannot be made to. Measured in Chromium
           at the shipped type scale, the word sets at 702px against a 535px
           track at 1024 and at 840px against a 708px track at 1440. Nowrap
           therefore overflows the type column and slides the word under the
           portrait, which is a worse defect than the break.

           The only geometry that fits it is a hero step about 23 percent
           smaller on this route alone, which would make the homepage masthead
           visibly smaller than every other route's. The copy is verbatim from
           _source/pages/home.md line 23 and the hyphen is in the source, so
           rewording is not available either. `.dm-display` in app/globals.css
           already sets text-wrap: balance, which evens the rag as far as it
           can be evened when every line is one word; the break itself stays.
           See the note on --fs-6xl-hero in src/styles/tokens.css, where the
           two H1s that COULD be fitted were fitted. */
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
          src: '/img/photos/portrait-cutout.png',
          /* One alt string per asset, from content/image-alt.ts. */
          alt: imageAlt['/img/photos/portrait-cutout.png'],
          width: 933,
          height: 1400,
          priority: true,
        }}
        /* The airfare-and-Lori pair is VOICE.md section 6, Pair 2, and its home
           on this route is the Flawless Process card in section 6 below, which
           is the card that model rewrite was written for. It ran here as well,
           and "books his own airfare and rental car" was on six routes and ten
           times sitewide. A hero cutline should carry what its own photograph
           supports. */
        cutline="Damian Mason. There is no lectern in the photograph, and there usually isn’t one on the stage either."
      />

      {/* == 2. The ledger ==================================================
          The prose under the row is written for this route. It used to come
          from a shared default in StatRow.tsx that /keynote/ also took, so the
          two routes rendered the same 25 words, and those 25 words re-read the
          four glyphs directly above them AND repeated this page's own hero
          line ("Since 1994 Damian has taken all three to 2,400 audiences in 50
          states and 7 countries"). The default is gone; see the note in
          StatRow.tsx. This line interprets the fourth figure instead of
          reciting any of them. */}
      <StatRow
        /* NAVY, AND IT IS THE HIGHEST-VALUE ONE-WORD CHANGE ON THE PAGE.

           Two things. First the rhythm: eight of eleven bands here were one of
           two light greys 1.11:1 apart, so a reader got two changes of ground
           in 11,502px. A dark ledger at one sixth of the scroll gives the page
           a spine, and it is a step off --surface-deep so the closing CTA band
           still reads as an arrival rather than as a repeat.

           Second, and this is the part that is not taste: it removes an
           @allow-fail. --ink-hot is the orange plus glyph, and on `sunken` it
           measures 2.72:1 and only ships because it is aria-hidden and rides
           the documented exemption. In a deep scope it remaps to orange-400 at
           5.60:1, where tokens.css says plainly that the brand orange is legal
           as text and only there. Two of the site's orange letterforms become
           legitimately legal for the first time.

           Orange budget is unchanged at the ceiling, not over it: two plus
           glyphs here and one filled field in the hero above is three. */
        surface="deep-alt"
        eyebrow="Track record"
        title="Three Decades on Stage"
        restatement="The fourth number is what keeps the other three honest. He’s in the argument every week on the podcast, so what your growers hear is this year’s read and not a rerun."
      />

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
              <Heading level={2} size="2xl" id="not-boring-title">
                Not Your Boring Ag Speaker
              </Heading>
            </div>

            <ul className={`${styles.claims} col-span-6 md:col-span-5`}>
              {CLAIMS.map((claim, index) => (
                <li key={claim} className={styles.claim}>
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
                  coming. Your growers get the outlook, not a recap of what they already
                  know.
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

            <figure className={`dm-figure ${styles.plate} col-span-6 md:col-span-8`} data-reveal="wipe">
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/speaking-to-audience.jpg"
                  /* One alt string per asset, from content/image-alt.ts. */
                  alt={imageAlt['/img/photos/speaking-to-audience.jpg']}
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 48rem) 56rem, 100vw"
                />
              </div>
              {/* The eating-and-clearing caveat is answered verbatim in this
                  page's own FAQ block, so the cutline was saying it twice on
                  one route. It was on five routes and nine times sitewide. */}
              <figcaption className="dm-figure__caption">
                Damian runs 60 to 90 minutes. The grins coming back at him are the part a
                meeting planner is buying.
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
              <Heading level={2} size="2xl" id="win-win-win-title">
                A Win, Win, Win for Event Planners, Organizers, and Audience Attendees
              </Heading>
            </div>

            {/* 2-up at 768, 4-up at 1024. Four columns inside a 704px container
                gives each card 151px, which ran the body copy at 16 characters
                a line and broke every one of the four headings in two. The
                same content reads correctly as a 2 by 2 at 768. */}
            <ul className={`${styles.cardList} dm-grid12 col-span-6 md:col-span-12`}>
              {PLANNER_BENEFITS.map((benefit, index) => (
                <li key={benefit.title} className="col-span-6 md:col-span-6 lg:col-span-3">
                  <Card variant="ruled" className={styles.cardBody}>
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

            <figure className={`dm-figure ${styles.plate} col-span-6 md:col-span-7`} data-reveal="wipe">
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/breakout-session-audience.jpg"
                  alt={imageAlt['/img/photos/breakout-session-audience.jpg']}
                  width={2000}
                  height={1500}
                  loading="lazy"
                  sizes="(min-width: 48rem) 48rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                {/* "A breakout session at rounds, one screen." also opened the
                    FIG. 03 cutline on /meeting-coordinators/, which uses the
                    same photograph. Two cutlines on one asset are fine; two
                    cutlines that open on the same seven words are not. The
                    other one keeps that sentence because it is the logistics
                    page and the room layout is its subject. */}
                A hotel ballroom, round tables, one lit screen. Extended sessions get
                booked alongside the keynote, not instead of it.
              </figcaption>
            </figure>

            <div className={`dm-balance ${styles.stack} col-span-6 md:col-span-5`}>
              <Prose measure="narrow">
                <p>
                  Booking a date, sizing up a program, or working out the travel line item?
                  It’s all on the meeting coordinators page: the contract terms, the travel
                  fee, and the room setup.
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
          All 25 marks: the 21 the client supplied plus the four that were on the
          old wall and not in the folder, replacing the six the old page
          shipped at resolutions running from 400px to 2560px wide with three
          of them carrying no alt text at all and a fourth carrying the wrong
          alt text. */}
      <LogoWall
        id="clients"
        /* Joins section 4 into one sage run rather than starting a fourth
           band. The wall's own hairline grid is what separates it from the
           cards above; it does not need a change of ground as well, and the
           page needs its light bands grouped into runs of two so the rhythm
           stops being a metronome. */
        surface="sunken"
        seam
        eyebrow="Client roster"
        title="Some of Damian’s Clients"
        intro="John Deere, Cargill, BASF, Merck, Land O’Lakes Purina, CLAAS, Pioneer, and 18 more."
      />

      {/* == 6. If it’s Agriculture, it Needs Damian ======================== */}
      <Section id="roles" aria-labelledby="roles-title">
        <Container>
          <div className={`dm-grid12 ${styles.sectionGrid}`}>
            <div className={`${styles.head} col-span-6 md:col-span-9`}>
              <Eyebrow>A leading voice in the industry, sought after for commentary</Eyebrow>
              <Heading level={2} size="2xl" id="roles-title">
                If it’s Agriculture, it Needs Damian.
              </Heading>
            </div>

            <ul className={`${styles.cardList} dm-grid12 col-span-6 md:col-span-12`}>
              {ROLES.map((role) => (
                <li key={role.title} className="dm-rail col-span-6 md:col-span-4">
                  <Card variant="ruled" className={styles.cardBody}>
                    <Heading level={3} size="lg">
                      {role.title}
                    </Heading>
                    <Prose measure="narrow">
                      <p>{role.body}</p>
                    </Prose>
                    <p className={styles.cardLink}>
                      <Link className="dm-action-link" href={role.href}>
                        {role.linkLabel}
                      </Link>
                    </p>
                  </Card>
                </li>
              ))}
            </ul>

            {/* field-day-panel.png shipped in public/ for seven phases and was
                rendered by zero routes, because the content manifest recorded
                the whole batch as unusable. It is a clean broadcast frame grab
                with no player chrome anywhere in it, which is a different thing
                from the macOS screenshots DESIGN_SYSTEM 6.4 bars, and it is the
                most agricultural asset in the archive: a sunflower field day,
                four men round a cocktail table, everybody talking.

                It belongs to THIS section and not another. No. 04 is "If it's
                Agriculture, it Needs Damian", and this is the only frame on the
                site that shows him inside a crop rather than on a stage in
                front of one. It also earns its keep now in a way it could not
                before: under grayscale(1) a field of sunflowers was grey. */}
            <figure className={`dm-figure ${styles.rolesFigure} col-span-6 md:col-span-12`} data-reveal="wipe">
              <div className="dm-photo dm-photo--band">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/field-day-panel.png"
                  /* Inline, not in content/image-alt.ts: that registry exists
                     for assets with more than one call site, which cannot be
                     allowed to diverge. This has one. */
                  alt="Damian Mason talking with three other men around a cocktail table at an outdoor field day, a stand of flowering sunflowers and event tents behind them."
                  width={1406}
                  height={1008}
                  loading="lazy"
                  sizes="(min-width: 64rem) 84rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                A field day, four men and a cocktail table in a stand of sunflowers.
                Nobody is holding a microphone and everybody is talking.
              </figcaption>
            </figure>
          </div>

          {/* Outside .sectionGrid, not inside it. .dm-section-close owns the
              interval between a section's last content and its closing rule
              (--space-9, src/styles/sections-core.css) and .sectionGrid sets a
              row-gap of the same token, so as a grid item this row spent the
              interval twice: MEASURED 128px at 390 and at 768 against 64px on
              /speaking/, /keynote/ and /acres-tv/, which read as a hole rather
              than as a close. As a sibling of the grid it takes the interval
              from the shared rule alone, and full container width is what
              col-span-12 was asking for anyway. */}
          <div className={`${styles.actions} dm-section-close`}>
            <Button href="/contact-us/" variant="secondary">
              Inquire About Working With Damian
            </Button>
          </div>
        </Container>

        {/* THE ONE FULL-BLEED PLATE ON THIS ROUTE, and it is outside the
            Container on purpose: the picture leaves the grid, the caption comes
            back to it. See .dm-bleed in sections-core.css for why this is
            allowed at all and why there is only ever one.

            It earns the exception on the argument it makes rather than on being
            the biggest file. This section is "If it's Agriculture, it Needs
            Damian", and everything above it is Damian talking. This is the
            room listening back: shot from the seat a meeting planner would be
            sitting in, at 2,033px, and it is the frame docs/OPEN-ITEMS.md item
            4 asked the client to go out and commission. It was in his own media
            library the whole time.

            A plate with a caption, never a band with a heading over it. Rule 17:
            at the 0.62 veil reversed type needs, this photograph would lose the
            thing that makes it worth running. */}
        <figure className="dm-figure dm-bleed" data-reveal="wipe">
          <div className="dm-photo dm-photo--band" data-photo="feature">
            <Image
              className="dm-photo__img"
              src="/img/photos/audience-from-the-back.jpg"
              alt={imageAlt['/img/photos/audience-from-the-back.jpg']}
              width={2000}
              height={1125}
              loading="lazy"
              sizes="100vw"
            />
          </div>
          <figcaption className="dm-figure__caption dm-bleed__caption">
            The view from the seat you would be sitting in. Every written review
            further down this page was written by somebody in a room like it.
          </figcaption>
        </figure>
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
      {/* Green, not navy. This route carries two dark bands: this one and the
          close. Rendering both in the same navy is what made a 21,000px scroll
          read as one column with two identical interruptions in it. The forest
          scope exists for exactly this, and the split is not arbitrary: the
          band that talks about agriculture is the green one, and the band that
          asks for the booking stays navy, so the ground still tells you which
          kind of thing you are looking at. */}
      <CTABand
        id="podcast"
        surface="forest"
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
              <Heading level={2} size="2xl" id="reviews-title">
                What People Are Saying
              </Heading>
            </div>

            {/* The 5/7 split waits for 1024. At 768 it put a two-column video
                grid inside a 400px track and rendered the four facades at
                182x102, smaller than the same four are at 390: the media got
                smaller as the viewport got larger. */}
            <div className="dm-balance col-span-6 md:col-span-12 lg:col-span-5">
              <TestimonialGrid
                items={homeTestimonials}
                variant="featured"
                featuredId="amy-b-agroliquid"
              />
            </div>

            <div className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-7`}>
              <VideoGrid
                videos={homeVideos}
                columns={2}
                headingLevel={3}
                label="Video testimonials from Damian Mason’s clients"
              />
            </div>

          </div>

          {/* The section's own closing row, at the section's left gutter.
              Parked inside the video column it sat under the first of two
              thumbnails with the whole left half of the section empty above
              it, which made the section read as truncated. It sits outside
              .sectionGrid for the reason recorded at section 04's close: as a
              grid item it drew the interval twice. */}
          <div className={`${styles.actions} dm-section-close`}>
            <Button href="/reviews/" variant="secondary">
              More Reviews
            </Button>
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
              <Heading level={2} size="2xl" id="books-title">
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

            <div className={`dm-rail ${styles.stack} col-span-6 md:col-span-4`}>
              {/* The "after speaking to companies such as Merck, Land O'Lakes,
                  and Cargill" clause came out of this paragraph. It is verbatim
                  jacket copy in content/books.ts, so it already runs on /about/
                  as a quotation, and /do-business-better-podcast/ restates it
                  in the rebuild's own words because that route is named for the
                  book. Three routes for one clause was two too many. This page
                  also names Cargill, Merck and Land O'Lakes in the logo-wall
                  intro seven sections up, so the clause was a within-route
                  repeat here as well. */}
              <Prose>
                <p>
                  Two titles: <em>Food Fear</em>, on why the hype around your dinner is wrong,
                  and <em>Do Business Better</em>, on defining success on your own terms.{' '}
                  <em>Food Fear</em> is on audio as well. Neither one is a keynote handout.
                </p>
              </Prose>
            </div>

            {/* The section discussed two books and an audiobook and showed
                none of them, while all three jacket files sat unreferenced in
                public/. That is the cheapest imagery on the site.

                TWO JACKETS, NOT THREE. The audiobook cover is the print cover
                with a headphones badge on it, so a third slot here would read
                as a rendering bug rather than a third book. The two-format
                story is already told properly on /about/#books, and the
                paragraph beside this rail already says Food Fear is on audio.

                ARTWORK, NOT PHOTOGRAPHY, so DESIGN_SYSTEM 6.5 applies and 6.2
                does not: it keeps its colour, takes no --photo-filter, gets a
                hairline rather than a plate of its own, and carries no cutline,
                because a cutline belongs to a photograph. mix-blend-mode:
                multiply resolves each jacket's own white ground into the sage
                band behind it, which is why there is no visible edge where the
                two whites would otherwise meet. */}
            <ul className={`${styles.jackets} col-span-6 md:col-span-3`} role="list">
              {HOME_JACKETS.map((jacket) => (
                <li key={jacket.src}>
                  <Image
                    src={jacket.src}
                    alt={jacket.alt}
                    width={1200}
                    height={1200}
                    loading="lazy"
                    sizes="(min-width: 48rem) 16rem, 40vw"
                  />
                </li>
              ))}
            </ul>

          </div>

          {/* Same closing row as section 06, for the same reason. */}
          <div className={`${styles.actions} dm-section-close`}>
            <Button href="/about/#books" variant="secondary">
              See the Books
            </Button>
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
            <div className={`dm-rail ${styles.stackTight} col-span-6 md:col-span-4`}>
              <Eyebrow>Booking questions</Eyebrow>
              <Heading level={2} size="2xl" id="faq-title">
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
        /* The contract-and-deposit sentence lives in the Flawless Process card
           in section 6 of this page, which is the card VOICE.md section 6,
           Pair 2 was written for. It ran here too, and the "First step: check
           the date" formula was on nine routes. The band asks for the date
           without reciting the terms a visitor read four sections ago. */
        copy="Send the date, the city, and who is in the room. If the calendar is open you’ll know inside a business day, and if it isn’t you’ll know that just as fast."
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
          { label: 'Sign Up for Damian’s Mailing List', href: '/join-the-conversation/' },
        ]}
      />
    </>
  );
}

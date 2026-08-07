import Image from 'next/image';
import type { Metadata } from 'next';

import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
} from '@/components/ui';
// components/sections has no barrel file, so each section is imported by path.
import { CTABand } from '@/components/sections/CTABand';
import { CredentialBar } from '@/components/sections/CredentialBar';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { Hero } from '@/components/sections/Hero';
import { StatRow } from '@/components/sections/StatRow';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { VideoGrid } from '@/components/sections/VideoGrid';
import { JsonLd } from '@/components/seo';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { contact } from '@/content/site';
import { credentialPillars } from '@/content/credentials';
import { faq } from '@/content/faq';
import { jobTitleList } from '@/content/job-titles';
import { testimonialsFor } from '@/content/testimonials';
import { videosFor, type Video } from '@/content/videos';

import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

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
    alt: imageAlt['/img/photos/keynote-stage-podium.jpg'],
  },
});

/**
 * The three demo reels are self-hosted. `content/videos.ts` now carries the
 * path that actually ships from `public/video/` plus a real poster frame, so
 * this route hands the records straight to VideoEmbed. The filename map that
 * used to live here was applied on this page and nowhere else, which left the
 * same innovation reel pointing at a 404 on /collaboration-opportunities/.
 *
 * All three are 720p H.264, about 7MB each, and `preload="none"` on VideoEmbed
 * means only the poster loads until a visitor presses play.
 */
const demoReels: Video[] = videosFor(ROUTE);

/**
 * The program description runs in full in the section that opens this page's
 * middle, so the FAQ item carrying the same paragraph is dropped from the
 * accordion. Every other question the old page asked is here, including the
 * technology question whose answer was an empty div on the live site.
 */
const bookingFaq = faq.filter((item) => item.id !== 'presentation-content');

/**
 * The four-pillar bar now comes from `content/credentials.ts`. It used to be
 * hand-copied here and on /about/, and this copy had been recased ("Educated on
 * current events", "Three decades of business ownership") away from the source,
 * so the two routes rendered the same eight bullets two different ways. The
 * Screen Actors Guild bullet is deliberately not on this list: the source bar
 * does not carry it and /about/ owns the biography that does.
 */
const CREDENTIALS = credentialPillars;

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
        /* Both source blurbs live here, word for word. The old Divi page also
           held them in a pair of service cards, and the rebuild shipped both
           copies. Section 5 now carries only what distinguishes the keynote
           from the extensions. See the note above that list. */
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
          alt: imageAlt['/img/photos/portrait-light-jacket.jpg'],
          width: 1334,
          height: 2000,
        }}
        cutlineFolio="Fig. 01"
        cutline="Damian Mason. He studied Ag Econ at Purdue and improv at Second City, and he uses both in the same hour."
      />

      {/* == 2. The ledger ===================================================
          Written for this route. This slot used to fall back to a shared
          default in StatRow.tsx, which meant / and /keynote/ carried the same
          25 words, and those words simply read the four glyphs back. What the
          count of audiences means on the PROGRAM page is that the program has
          survived both halves of the commodity cycle, which is the hero
          eyebrow's own "good and bad Ag climates" claim stated as a fact. */}
      <StatRow
        id="record"
        title="The record"
        surface="sunken"
        restatement="Some of those rooms met in a good year. Plenty met in a bad one. Damian works both the same way: your growers get the truth, and they get to laugh at it."
      />

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
                You&rsquo;re not hiring a motivational speaker who&rsquo;s read one Ag
                article on the plane. Damian&rsquo;s got the Purdue Ag Econ degree, the
                Second City training, and an Indiana farm of his own, and there&rsquo;s
                three decades of business ownership behind all of it. Your growers will
                know inside two minutes which one of those he&rsquo;s drawing on.
              </p>
            </Prose>
          </div>

          {/* One component, shared with /about/. See CredentialBar for why the
              markup moved out of the two routes that render it. */}
          <CredentialBar pillars={CREDENTIALS} className={styles.pillars} />
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
                  alt={imageAlt['/img/photos/speaking-to-audience.jpg']}
                  width={2000}
                  height={1336}
                  loading="lazy"
                  sizes="(min-width: 64rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 02 </span>
                Mid-program, and every face in the room is pointed the same direction.
                That&rsquo;s what 60 to 90 minutes buys you.
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

              {/* RULING ON THE SOURCE'S OWN DUPLICATION, recorded so a later
                  agent does not re-litigate it. `_source/pages/keynote.md`
                  carries the KEYNOTE blurb at lines 25 and 29 and the
                  EXTENSIONS hook at lines 27 and 30, because the old Divi page
                  held a hero blurb and a service card containing the same text.
                  The rebuild shipped both, so a visitor read the same two
                  sentences twice inside about 2,000 characters.

                  Decision: the hero keeps both blurbs word for word, which is
                  where the source's own emphasis sits and where parity is
                  therefore preserved. These two cards carry only what
                  distinguishes one format from the other. The counterpart note
                  is on the hero deck.

                  The "he will not speak while people are eating" caveat came
                  out of the Extensions card for a different reason: it is
                  verbatim in this route's own FAQ, five sections down, so the
                  page was stating it twice. */}
              <ul className={styles.formats} role="list">
                <li className={styles.format}>
                  <Heading level={3} size="lg">
                    Keynote
                  </Heading>
                  <Prose measure="wide">
                    <p>
                      One general session, built for the room you actually have: growers,
                      ag lenders, agronomists, pork producers, association boards, and the
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
                      Breakouts, luncheons, and panels. He moderates as well as presents, so
                      an extension can be a working session for your board rather than a
                      second speech.
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

          <div className={`${styles.actions} dm-section-close`}>
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
                alt={imageAlt['/img/photos/keynote-stage-podium.jpg']}
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
            {/* Not "four of them": the four videos on /reviews/ are in addition
                to the ten written notes, not four of the ten. /speaking/ and
                /collaboration-opportunities/ already had the arithmetic right. */}
            <Prose>
              <p>
                Three from meeting planners who were in the room while it happened.
                There&rsquo;s ten more on the reviews page, plus four on video.
              </p>
            </Prose>
          </div>

          <TestimonialGrid
            items={testimonialsFor(ROUTE)}
            columns={3}
            label="What meeting planners said"
          />

          <div className={`${styles.actions} dm-section-close`}>
            {/* Not "every". Ten written reviews live on /reviews/, and the
                three quoted above this button are not among them: they are the
                trio this route's own source page carried, which is why the
                standfirst can say "ten more". The label says what that page
                holds, so it stays a flat count and does not have to move when a
                row is re-cut. /speaking/ quotes three that ARE drawn from the
                ten, and its own copy is written for that ("Ten written notes
                and four video testimonials are on the testimonials page"), so
                the two routes do not share a sentence. See the /keynote/ note
                in content/testimonials.ts before touching either row.

                Secondary, not ghost. Ghost carries the same inline padding
                without the border that explains it, so this label alone sat
                13px inside the left axis every other closing action is on, and
                the misalignment was visible against the hairline above it. */}
            <Button href="/reviews/" variant="secondary" size="lg">
              Read the ten written reviews
            </Button>
          </div>
        </Container>
      </Section>

      {/* == 9. Bio ==========================================================
          /about/ OWNS THE BIOGRAPHY. The three-paragraph bio from
          `_source/pages/keynote.md` section 7 ran here AND on /about/ word for
          word, roughly 90 contiguous identical words including the Arizona
          sentence, so a client clicking Keynote then About read the same
          biography twice. Both routes are one nav click apart and both link to
          each other. The paragraphs stay verbatim on /about/, which is the page
          the site built to hold them and the page the nav label names.

          What is left here is the part /about/ does not carry and section 3 of
          this page does not either. Section 3 already spends the Purdue degree,
          the Second City training, the Indiana farm and the three decades of
          ownership in prose, so restating them here would duplicate this page
          on itself. That is also why the farm is not in the paragraph below any
          more: "the Indiana farm he goes home to between dates" was three
          sections under "an Indiana farm of his own".

          The heading is the full nine-title sentence from
          `_source/pages/keynote.md:180`, which is this route's own source line.
          It rendered as five titles here for three rounds because it was hand
          typed. It comes out of `content/job-titles.ts` now, the way the four
          credential pillars come out of `content/credentials.ts`.

          The eyebrow moved off "Filed from the Indiana farm office" because
          that is the /about/ hero's running head. /blog/ and /contact-us/ were
          also flying it and now have their own, so the statement is true of the
          site that ships, not just of this file.
          ==================================================================== */}
      <Section id="about-damian" aria-labelledby="about-damian-title">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-12 lg:col-span-8">
              <div className={styles.headTight}>
                <Eyebrow>The short version</Eyebrow>
                <Heading level={2} size="2xl" id="about-damian-title">
                  Damian Mason is a {jobTitleList()}.
                </Heading>
              </div>

              <Prose>
                <p>
                  He carries a Screen Actors Guild card, he has written a book about food
                  and a book about business, and he hosts three podcasts between dates.
                </p>
              </Prose>

              <div className={styles.actions}>
                <Button href="/about/" variant="secondary" size="lg">
                  Read the full biography
                </Button>
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
        {/* The standard container, not the narrow one. A narrow container
            centres itself, which put this section's eyebrow and H2 on a 320px
            axis while every other head on the route sat at 96, so a reader
            scrolling the page watched the spine jog 224px and come back. The
            reading measure is a property of the ANSWER column, not of the
            section, so it moves onto the grid, the same way DESIGN_SYSTEM 7.1.1
            took the logo wall's head off the wide container. This is the
            arrangement Home's FAQ already uses. */}
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.head} col-span-6 md:col-span-4`}>
            <Eyebrow>Booking</Eyebrow>
            <Heading level={2} size="2xl" id="faq-title">
              Questions meeting planners ask
            </Heading>
            <Prose>
              <p>
                {/* "Damian books most of his events directly with his clients"
                    is the opening line of the last item in the accordion below,
                    verbatim from the source, so the standfirst was quoting the
                    answer before the visitor got to the question. */}
                Fees, travel, room setup, and what happens between the handshake and the
                stage. If it isn&rsquo;t answered here, the office will answer it.
              </p>
            </Prose>
          </div>

            <div className="col-span-6 md:col-span-8">
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
            </div>
          </div>
        </Container>
      </Section>

      {/* == 11. The close =================================================== */}
      <CTABand
        id="book"
        eyebrow="Booking"
        heading="Check your date, then let’s talk."
        /* This band used to restate four booking facts that the FAQ directly
           above it already answers in the client's own words: check the date,
           contract and deposit, airfare and rental car, and Lori. The FAQ is
           source-verbatim and it is on this page, so the band was the page
           telling a visitor something they had just finished reading. It asks
           for the date instead and points at the route that holds the terms in
           full. */
        copy="Send the date and the city and you’ll know inside a business day whether the calendar is open. Everything a committee will want to see first is written out for meeting coordinators."
        actions={[
          { label: 'Book Damian', href: BOOKING_HREF },
          { label: 'Sign up for Damian’s email list', href: '/join-the-conversation/', variant: 'secondary' },
        ]}
      />
    </>
  );
}

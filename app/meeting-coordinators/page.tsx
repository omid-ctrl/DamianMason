import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { Button, Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { Hero } from '@/components/sections/Hero';
import { TestimonialGrid } from '@/components/sections/TestimonialGrid';
import { JsonLd } from '@/components/seo';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { faq } from '@/content/faq';
import { contact } from '@/content/site';
import { testimonialsFor } from '@/content/testimonials';

const ROUTE = '/meeting-coordinators/';
const MAILTO = `mailto:${contact.email}`;
const YOUTUBE = 'https://www.youtube.com/@DamianMasonChannel/videos';

export const metadata: Metadata = buildMetadata({
  title: 'Meeting Coordinators: How to Book',
  description:
    'Fees, travel, AV and room setup, the contract and the deposit, answered before you ask. Damian and his office manager Lori do the rest. Call 888.304.0702.',
  path: ROUTE,
});

/**
 * The four things Damian learns before an event. The old page set these as four
 * sibling <h2><strong> elements inside one text module, which is why its
 * outline ran H1, H4, H2, H4, H2. They are a list, so they are a list.
 */
const KNOWS = ['The Technology', 'The Material', 'The Audience', 'The Industry'];

/**
 * The four benefit blurbs. The old "Flawless Process" body leaned on an
 * adjective VOICE.md bans and on a claim the reader cannot check, so it is
 * replaced with the three facts the site's own FAQ already states about how a
 * booking actually runs.
 */
const BENEFITS = [
  {
    title: 'Custom Messages',
    body: "Material that's fresh, new, and relevant for your audience.",
  },
  {
    title: 'Guaranteed Success',
    body: 'Your audience leaves entertained and with immediate take-aways.',
  },
  {
    title: 'Flawless Process',
    body: 'A simple contract and a small deposit hold your date. Damian books his own airfare and rental car. Lori handles everything after that.',
  },
  {
    title: 'Add-On Options',
    body: 'Keynote not enough? Add an in-depth, extended breakout session.',
  },
];

/** The practical column. Every sentence here restates a fact from the FAQ. */
const LOGISTICS = [
  {
    title: 'The date and the contract',
    body: "First step: check the date. Fees are quoted at the time of your inquiry and they're NET to Damian. A simple contract and a small fraction of the fee confirm the date, and the balance is due at the event.",
  },
  {
    title: 'Travel and hotel',
    body: "Damian books all of his own airfare and car rental. A set Travel Fee covers those expenses, gratuity, and meals, and it's quoted up front. You book and pay for the hotel. He travels wherever your event is scheduled.",
  },
  {
    title: 'AV and room setup',
    body: "Ask the office for Damian's AV and room setup requirements before you lock the run of show. One rule never moves: he will not speak while people are eating or tables are being cleared. Record it or photograph it, as long as he gets a copy.",
  },
  {
    title: 'Promoting the event',
    body: "Yes, Damian will help you fill the room. Local radio interviews are welcome, he'll guest on your podcast, and short intro videos can be pre-recorded for your event. Headshots and a bio are yours to use.",
  },
];

export default function MeetingCoordinatorsPage() {
  const breadcrumbs = buildBreadcrumbListSchema([
    { name: 'Home', path: '/' },
    { name: 'Speaking', path: '/speaking/' },
    { name: 'Meeting Coordinators', path: ROUTE },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbs} id="meeting-coordinators-breadcrumbs" />

      {/* ================================================================== */}
      {/* The masthead. The phone number is a hero action, not a footer note: */}
      {/* a planner with a date in hand should not have to scroll to call.    */}
      {/* ================================================================== */}
      <Hero
        id="meeting-coordinators"
        eyebrow="Hire a Speaker that Works for YOU"
        title="Meeting Coordinators"
        deck="Book direct. When you hire Damian you get a proven professional speaker and showman who works with you, not through a bureau. He builds the right mix of humor, content, and take-away value for your audience, and he's done it for 2,400 audiences since 1994."
        actions={
          [
            { label: 'Booking Inquiry', href: '/contact-us/' },
            {
              label: `Call ${contact.phone}`,
              href: contact.phoneHref,
              variant: 'secondary',
              'aria-label': `Call the Damian Mason office at ${contact.phone}`,
            },
          ] as const
        }
        image={{
          src: '/img/photos/portrait-dark-blazer.jpg',
          alt: 'Damian Mason in a charcoal blazer and jeans, leaning against a brick window frame.',
          width: 1467,
          height: 2000,
          priority: true,
        }}
        cutlineFolio="FIG. 01"
        cutline="Damian Mason, agricultural economist. All 50 states and 7 foreign countries so far, and he booked the flights himself."
      />

      {/* ================================================================== */}
      {/* No. 01 Damian knows. The testimonial that was hard coded white on a */}
      {/* light ground now comes from content/testimonials.ts, so its         */}
      {/* attribution takes the muted ink token and cannot go invisible again.*/}
      {/* ================================================================== */}
      <Section surface="sunken" aria-labelledby="damian-knows-title">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-12 lg:col-span-7 flex flex-col items-start gap-6">
              <Eyebrow>Damian Knows</Eyebrow>
              <Heading level={2} size="2xl" id="damian-knows-title">
                Four things he learns before your event
              </Heading>
              <Prose>
                <p>
                  Meeting planners book Damian twice. He and his office manager Lori do the
                  research, the prep, and the follow-up on every engagement, and that&rsquo;s why the
                  second call comes.
                </p>
                <ul>
                  {KNOWS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  First step: call the office and make sure Damian has your date. It&rsquo;s a simple
                  contract and a small deposit from there. The rest is about your audience.
                </p>
              </Prose>
              <Button href={MAILTO} variant="secondary">
                Email the Office
              </Button>
            </div>

            <div className="col-span-6 md:col-span-12 lg:col-span-5">
              <TestimonialGrid
                items={testimonialsFor(ROUTE)}
                variant="featured"
                barred
                featuredId="national-ag-aviation-association"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ================================================================== */}
      {/* No. 02 A win, win, win. The four Divi blurb icons are gone: 256 pixel*/}
      {/* clip art with inconsistent alt text was carrying no information the */}
      {/* headings do not already carry.                                      */}
      {/* ================================================================== */}
      <Section aria-labelledby="win-win-win-title">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-12 lg:col-span-7 flex flex-col items-start gap-6">
              <Eyebrow>A Win / Win / Win For</Eyebrow>
              <Heading level={2} size="2xl" id="win-win-win-title">
                Event Planners, Organizers, and Audience Attendees
              </Heading>

              <ul className="dm-grid12 w-full">
                {BENEFITS.map((benefit) => (
                  <Card
                    as="li"
                    variant="ruled"
                    key={benefit.title}
                    className="col-span-6 md:col-span-6 gap-3"
                  >
                    <Heading level={3} size="lg">
                      {benefit.title}
                    </Heading>
                    <Prose measure="narrow">
                      <p>{benefit.body}</p>
                    </Prose>
                  </Card>
                ))}
              </ul>

              <Button href="/contact-us/" variant="secondary">
                Check Your Event Date
              </Button>
            </div>

            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-5">
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/book-signing-table.jpg"
                  alt="Attendees queued at a signing table stacked with copies of Food Fear while Damian Mason signs one."
                  width={2000}
                  height={1500}
                  loading="lazy"
                  sizes="(min-width: 64rem) 34rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">FIG. 02 </span>
                Attendees waiting for a signed copy of{' '}
                <Link href="/about/#books">Food Fear</Link> after a keynote. Nobody went
                straight to the parking lot.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ================================================================== */}
      {/* No. 03 The practical column. This is the section the old page never */}
      {/* had: fees, travel, AV and promotion in one place instead of buried  */}
      {/* in an accordion behind two Lorem Ipsum toggles.                     */}
      {/* ================================================================== */}
      <Section surface="sunken" aria-labelledby="logistics-title">
        <Container>
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>Before the Event</Eyebrow>
            <Heading level={2} size="2xl" id="logistics-title">
              What Damian needs from you
            </Heading>
            <Prose>
              <p>
                There&rsquo;s no bureau in the middle. Damian books most of his events directly with
                his clients, so what you read here comes from the man who shows up.
              </p>
            </Prose>
          </div>

          <ul className="dm-grid12 mt-10">
            {LOGISTICS.map((item) => (
              <Card
                as="li"
                variant="ruled"
                key={item.title}
                className="col-span-6 md:col-span-6 lg:col-span-3 gap-3"
              >
                <Heading level={3} size="lg">
                  {item.title}
                </Heading>
                <Prose measure="narrow">
                  <p>{item.body}</p>
                </Prose>
              </Card>
            ))}
          </ul>

          <div className="dm-grid12 mt-10">
            {/* Eight of twelve. A 3:2 plate across the full broadsheet width is
                896 pixels tall at 1440 and swallows the section it belongs to. */}
            <figure className="dm-figure col-span-6 md:col-span-8">
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/breakout-session-audience.jpg"
                  alt="Damian Mason speaking beside a projection screen to a hotel ballroom seated at round tables."
                  width={2000}
                  height={1500}
                  loading="lazy"
                  sizes="(min-width: 64rem) 54rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">FIG. 03 </span>
                A breakout session at rounds, one screen. Damian won’t speak while the tables
                are being cleared.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ================================================================== */}
      {/* No. 04 The leading voice band. The old page put a raw macOS         */}
      {/* screenshot here at full width. It is dropped and the stock          */}
      {/* microphone photograph carries the band on its own.                  */}
      {/* ================================================================== */}
      <Hero
        variant="band"
        id="leading-voice"
        level={2}
        titleSize="4xl"
        eyebrow="When it comes to Agriculture, Damian is the leading voice"
        title="Available for Media Appearances, Content Co-Creation, Sponsorships, and Guest Appearances."
        deck="Well Spoken. Highly Educated. Enthusiastic. Opinionated."
        actions={[{ label: 'Inquire About Working With Damian', href: '/contact-us/' }] as const}
        image={{
          src: '/img/photos/microphones-background.jpg',
          alt: '',
          width: 2000,
          height: 1334,
          priority: false,
        }}
        cutlineFolio="FIG. 04"
        cutline="A stand of press microphones. Cheddar News, NewsmaxTV, Straight Arrow News, and Eagle Country 95.9 have all put him on."
      />

      {/* ================================================================== */}
      {/* No. 05 The FAQ. One accordion, 13 real questions from               */}
      {/* content/faq.ts, nothing open by default, no Lorem Ipsum, and no    */}
      {/* dead press-kit button with nothing behind it.                      */}
      {/* ================================================================== */}
      <Section aria-labelledby="faq-title">
        <Container width="narrow">
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>FAQ</Eyebrow>
            <Heading level={2} size="2xl" id="faq-title">
              Questions meeting planners actually ask
            </Heading>
          </div>

          <FAQAccordion
            className="mt-10"
            items={faq}
            withSchema
            schemaPath={ROUTE}
            idPrefix="mc-faq"
          />

          <Prose className="mt-10">
            <p>
              Want to see him work before you sign? Every clip is on{' '}
              <a href={YOUTUBE} target="_blank" rel="noopener noreferrer">
                Damian&rsquo;s YouTube channel
              </a>
              . If your question isn’t answered above, email the office at{' '}
              <a href={MAILTO}>{contact.email}</a>.
            </p>
          </Prose>
        </Container>
      </Section>

      {/* ================================================================== */}
      {/* No. 06 The close. The old page's two booking buttons both shipped an */}
      {/* empty href. Both resolve here.                                     */}
      {/* ================================================================== */}
      <CTABand
        id="book-damian"
        eyebrow="Booking"
        heading="Get your date on the calendar"
        copy={
          <p>
            Damian books most of his events directly with his clients, so you&rsquo;ll be talking to
            the people who run them. Email <a href={MAILTO}>{contact.email}</a> or call the office
            and check your date first.
          </p>
        }
        actions={
          [
            { label: 'Booking Inquiry', href: '/contact-us/' },
            {
              label: 'Join the Conversation',
              href: '/join-the-conversation/',
              variant: 'secondary',
            },
          ] as const
        }
        panel={{
          eyebrow: 'Call the office',
          value: contact.phone,
          label: 'Direct line',
          note: <a href={contact.phoneHref}>Tap to call</a>,
        }}
      />
    </>
  );
}

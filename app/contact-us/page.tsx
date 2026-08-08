import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import {
  Card,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
  SocialIcon,
} from '@/components/ui';
import { ContactForm } from '@/components/sections/ContactForm';
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { JsonLd } from '@/components/seo';
import { contact, socials } from '@/content/site';
import { buildMetadata, SITE_LANGUAGE, absoluteUrl, canonicalUrl } from '@/lib/seo';
import { buildBreadcrumbListSchema, schemaIds, type JsonLdDocument } from '@/lib/schema';

import styles from './page.module.css';

/* ============================================================================
   /contact-us/

   The old page shipped five paragraphs in one Divi text module, no <h1>, no
   meta description, no tel: link, and an email link whose href was
   "damianmasonoffice@gmail.com" with the mailto: scheme missing, so it
   resolved to /contact-us/damianmasonoffice@gmail.com and 404ed. All of that
   is fixed here: one h1, a real mailto, a real tel:, and the booking facts the
   old page made a meeting planner hunt for across three other pages.

   THE FORM AT No. 03 posts to app/api/contact/route.ts, the one server route
   on the site. Everything else here still prerenders. It is deliberately NOT
   the loudest thing on the page: email and phone come first at No. 01 and
   again in the ledger, because they are the paths that cannot fail. When the
   endpoint has no delivery provider in its environment it answers 501 and the
   form replaces itself with that same address and number, so the worst case
   is a slower route to the same inbox rather than a message that goes nowhere.

   This is also where the retired inquiry form from
   /collaboration-opportunities/ lands: that form had four fields (Email, Full
   Name, Phone, Message) and POSTed to a WordPress nonce endpoint that does not
   exist in this build. No. 02 spells out what to put in the message so the
   old Message field's job is still done. The other <form> on this route is the
   Mailchimp newsletter signup at No. 05 and it is not an inquiry form.

   REPLY TIME. The source says "We typically respond within one business day."
   The hedge is the client's and it stays: this route states the promise twice,
   in the hero deck and in the ledger, and both carry "typically". It is not
   restated a third time anywhere on the page.
   ============================================================================ */

const PATH = '/contact-us/';
const MAILTO = `mailto:${contact.email}`;

const OG_IMAGE = {
  url: '/img/photos/portrait-office-seated.jpg',
  width: 2000,
  height: 1334,
  alt: 'Damian Mason seated on the edge of a conference table in his office.',
};

export const metadata: Metadata = buildMetadata({
  title: 'Contact and Booking',
  description:
    'Email damianmasonoffice@gmail.com or call 888.304.0702. Bookings run direct through the Indiana office, and we typically answer within one business day.',
  path: PATH,
  image: OG_IMAGE,
});

/**
 * ContactPage is not in lib/schema's builder set, so the node is written here
 * against the exported JsonLdDocument type and points at the standing Person,
 * Organization and WebSite nodes by @id rather than restating them.
 */
const contactPageSchema: JsonLdDocument = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${canonicalUrl(PATH)}#contactpage`,
  name: 'Contact Damian Mason',
  description:
    'Booking, collaboration and press contact for Damian Mason: email, phone, what to send in a first inquiry, and how a date gets held.',
  url: canonicalUrl(PATH),
  inLanguage: SITE_LANGUAGE,
  isPartOf: { '@id': schemaIds.website },
  about: { '@id': schemaIds.person },
  mainEntity: { '@id': schemaIds.organization },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: absoluteUrl(OG_IMAGE.url),
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    caption: OG_IMAGE.alt,
  },
};

const breadcrumbSchema = buildBreadcrumbListSchema([
  { name: 'Home', path: '/' },
  { name: 'Contact Us', path: PATH },
]);

export default function ContactUsPage() {
  return (
    <>
      <JsonLd id="contact-us-schema" schema={[contactPageSchema, breadcrumbSchema]} />

      <Hero
        id="contact"
        /* "Filed from the Indiana farm office" was flying on three routes at
           once while a comment on /keynote/ asserted it belonged to one. It
           came off this route first, and off the site entirely in the Cool
           Modern Ag revision. This eyebrow says the thing the route is actually
           promising: a person on the other end. */
        eyebrow="Booking, press, and partnerships"
        title="Get in Touch"
        deck="Booking a date, pitching a collaboration, or just curious about the program? Email the office or call. We typically answer within one business day, and you’ll be talking to Damian or to Lori, not to a bureau."
        actions={[
          {
            label: 'Email the office',
            href: MAILTO,
            'aria-label': `Email ${contact.email}`,
          },
          {
            label: `Call ${contact.phone}`,
            href: contact.phoneHref,
          },
        ] as const}
        /* This route ran a type-only hero because the archive had no portrait
           left to give it: five photographs were covering eleven hero slots and
           four of them were doing double duty. The media-kit rescue supplies
           five studio frames the site had never seen, so the page that asks a
           stranger to make contact now opens on the face they would be
           contacting. */
        image={{
          src: '/img/photos/portrait-window-light.jpg',
          /* Single call site, so the string lives here rather than in
             content/image-alt.ts, per the rule at the head of that module. */
          alt: 'Damian Mason in a charcoal jacket and jeans, one hand in a pocket, standing in a whitewashed brick corridor.',
          width: 1333,
          height: 2000,
          feature: true,
        }}
        cutline="Two people read this inbox. Neither of them is a booking agency."
      />

      {/* --- The two ways in -------------------------------------------------
          NAVY, and on this route it is not only rhythm. The ledger in this
          section holds the email address, the phone number and the reply-time
          promise, which is the entire reason a stranger opens this page. It was
          the second of two near-identical greys; it is now the one block on the
          route a reader cannot scroll past. */}
      <Section surface="deep-alt" aria-labelledby="reach-title">
        <Container>
          <div className={`dm-grid12 ${styles.rowTop}`}>
            <div className="col-span-6 md:col-span-7">
              <Eyebrow>Two ways in</Eyebrow>
              <Heading level={2} id="reach-title" className={styles.sectionHeading}>
                Email is the fastest. The phone works too.
              </Heading>
              <Prose>
                {/* The third sentence used to run "Either way the reply comes
                    from Damian or from his office manager Lori, not from a
                    bureau", which is the hero deck's own promise ("you'll be
                    talking to Damian or to Lori, not to a bureau") restated
                    about 200 characters later with the nouns swapped. This
                    route states the no-bureau fact three times; the hero owns
                    it, and the No. 05 band carries the source FAQ's fuller
                    version ("There are a few bureaus we have worked with
                    successfully over the years. We don't endorse them."). What
                    is left here is the only thing this paragraph is for: which
                    channel to use, and why. */}
                <p>
                  Email gets you a written record of the date, the fee, and the room, which is
                  what your committee will ask for. Call if the date is close and you
                  don&rsquo;t want to wait on a reply.
                </p>
                <p>
                  Press, podcast producers and brands looking at a partnership use the same
                  address. So do meeting planners who just want to know whether a Tuesday in
                  March is open. See{' '}
                  <Link href="/meeting-coordinators/">what past clients booked him for</Link>, or
                  read the{' '}
                  <Link href="/keynote/">keynote program and the full booking FAQ</Link>.
                </p>
              </Prose>
            </div>

            <Card variant="bright" className="col-span-6 md:col-span-5">
              <dl className={styles.ledger}>
                <div className={styles.ledgerRow}>
                  <dt>
                    <Eyebrow>Email</Eyebrow>
                  </dt>
                  <dd>
                    <a className={`${styles.ledgerValue} dm-link-bare`} href={MAILTO}>
                      {contact.email}
                    </a>
                  </dd>
                </div>

                <div className={styles.ledgerRow}>
                  <dt>
                    <Eyebrow>Phone</Eyebrow>
                  </dt>
                  <dd>
                    <a className={`${styles.ledgerValue} dm-link-bare`} href={contact.phoneHref}>
                      {contact.phone}
                    </a>
                  </dd>
                </div>

                <div className={styles.ledgerRow}>
                  <dt>
                    <Eyebrow>Reply time</Eyebrow>
                  </dt>
                  <dd>
                    <span className={styles.ledgerValue}>One business day</span>
                    <p className={styles.ledgerNote}>Typically. Email is the faster of the two.</p>
                  </dd>
                </div>

                <div className={styles.ledgerRow}>
                  <dt>
                    <Eyebrow>Based in</Eyebrow>
                  </dt>
                  <dd>
                    <span className={styles.ledgerValue}>Indiana</span>
                    <p className={styles.ledgerNote}>
                      He travels wherever the client&rsquo;s event is scheduled: 50 states and 7
                      foreign countries so far.
                    </p>
                  </dd>
                </div>
              </dl>

              <Heading level={3} size="lg" className={styles.socialHeading}>
                Elsewhere
              </Heading>
              <ul className={styles.socialList}>
                {socials.map((social) => (
                  <li key={social.href}>
                    <a
                      className={`${styles.socialLink} dm-link-bare`}
                      href={social.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SocialIcon name={social.icon} />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- No. 02, what to send ------------------------------------------- */}
      <Section aria-labelledby="inquiry-title">
        {/* Standard container, not narrow. A narrow container centres itself,
            which put this head on a 320px axis while the heads above and below
            it sat at 96. The reading measure belongs to the content column. */}
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
          <Eyebrow>Before you write</Eyebrow>
          <Heading level={2} id="inquiry-title" className={styles.sectionHeading}>
            What to put in the first email
          </Heading>
            </div>
            <div className="col-span-6 md:col-span-8">
          <Prose>
            <p>
              First step: make sure he has your date. Send these five lines and you get a real
              answer back instead of a call to collect them.
            </p>
            <ul>
              <li>The date, the city, and the name of the event.</li>
              {/* "growers, ag lenders, agronomists" was the same triplet on
                  seven routes. Naming the reader's own people is the point of
                  this bullet, so it names the reader's people instead. */}
              <li>
                Who is in the room, and roughly how many: your members, your dealers, your
                borrowers, your own staff.
              </li>
              <li>
                The slot you are filling: keynote, break-out, luncheon, or panel. Programs
                typically run 60 to 90 minutes.
              </li>
              <li>What you want that room walking out with.</li>
              <li>
                Your budget. Fees are quoted at the time of the inquiry, and Damian&rsquo;s fees
                are NET to him.
              </li>
            </ul>
            {/* No closing caveat here any more. It read "Damian won't speak
                while people are eating or tables are being cleared", which is
                the FAQ's own sentence and belongs to the three routes that
                carry the FAQ verbatim: /, /keynote/ and /meeting-coordinators/.
                It was on five routes and nine times sitewide. The paragraph
                above the list already lands this section. */}
          </Prose>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- No. 03, the form ------------------------------------------------
          Same grid as No. 05 below: head in a 4-column stack, the panel in the
          remaining 8. Surface stays `page` rather than alternating, because a
          second sunken band here would run straight into No. 04's. The bright
          card is what separates this section from No. 02 above it, which is
          exactly the job it does for the newsletter panel at No. 05. */}
      <Section aria-labelledby="form-title">
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>Or use the form</Eyebrow>
              <Heading level={2} id="form-title" className={styles.sectionHeading}>
                Send it from here
              </Heading>
            </div>
            <Card variant="bright" className="col-span-6 md:col-span-8">
              <ContactForm idPrefix="contact-inquiry" labelledBy="form-title" />
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- No. 04, what happens next -------------------------------------- */}
      <Section surface="sunken" aria-labelledby="process-title">
        <Container>
          <div className={`dm-grid12 ${styles.rowTop}`}>
            <figure className={`dm-figure ${styles.figureColumn} col-span-6 md:col-span-7`} data-reveal="wipe">
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/portrait-office-seated.jpg"
                  alt="Damian Mason in a checked sport coat and jeans, seated on the edge of a conference table in his office."
                  width={2000}
                  height={1334}
                  sizes="(min-width: 48rem) 46rem, 100vw"
                  loading="lazy"
                />
              </div>
              <figcaption className="dm-figure__caption">
                In the office, between dates. The email goes to Damian. The calendar belongs to
                Lori.
              </figcaption>
            </figure>

            <div className="col-span-6 md:col-span-5">
              <Eyebrow>After you write</Eyebrow>
              <Heading level={2} id="process-title" className={styles.sectionHeading}>
                How a date gets held
              </Heading>
              <Prose measure="narrow">
                {/* Trimmed to the two facts this page needs and the one it
                    owns. "Damian books most of his events directly" was on five
                    routes, and the full travel arrangement belongs to
                    /meeting-coordinators/, which states it once and links here.
                    What is left is the sequence a visitor who just wrote the
                    email actually wants. */}
                <p>
                  There is a contract to sign and a deposit to send, and the balance settles
                  the day of the event. Travel is one fee, quoted up front, and you book the
                  hotel. After that the date is on Lori&rsquo;s calendar and off your list.
                </p>
                <p className={styles.asideNote}>
                  There are a few bureaus we have worked with successfully over the years. We
                  don&rsquo;t endorse them. Booking direct has worked better for the client and
                  for us.
                </p>
              </Prose>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- No. 05, the list ------------------------------------------------ */}
      <Section aria-labelledby="newsletter-title">
        {/* Standard container, not narrow. A narrow container centres itself,
            which put this head on a 320px axis while the heads above and below
            it sat at 96. The reading measure belongs to the content column. */}
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>Not booking today</Eyebrow>
              <Heading level={2} id="newsletter-title">
                Get the list instead
              </Heading>
            </div>
            <Card variant="bright" className={`${styles.asideNote} col-span-6 md:col-span-8`}>
              <NewsletterForm
                idPrefix="contact-newsletter"
                title={null}
                submitVariant="secondary"
              />
            </Card>
          </div>
        </Container>
      </Section>

      <CTABand
        id="book"
        eyebrow="Bookings"
        heading="Have a date in mind?"
        copy="Send the date and the city. If it’s open, we talk about the room, the program, and the fee. If not, you’ll hear that back just as fast."
        actions={[
          {
            label: 'Email the office',
            href: MAILTO,
            'aria-label': `Email ${contact.email}`,
          },
          {
            label: contact.phone,
            href: contact.phoneHref,
            'aria-label': `Call ${contact.phone}`,
          },
        ] as const}
        panel={{
          eyebrow: 'Since 1994',
          value: '2,400',
          plus: true,
          label: 'audiences addressed',
          note: 'In all 50 states and 7 foreign countries.',
        }}
      />
    </>
  );
}

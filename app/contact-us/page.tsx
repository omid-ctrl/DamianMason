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

   There is no contact form. This build has no server and no form service, so a
   form here would post nowhere. Email and phone are the real paths and they
   are the loudest things on the page.
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
    'Email damianmasonoffice@gmail.com or call 888.304.0702. Bookings run direct through the Indiana office, and every inquiry gets an answer in one business day.',
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
        eyebrow="Filed from the Indiana farm office"
        title="Get in Touch"
        deck="Booking a date, pitching a collaboration, or just curious about the program? Email the office or call. We answer within one business day, and you'll be talking to Damian or to Lori, not to a bureau."
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
      />

      {/* --- No. 01, the two ways in ---------------------------------------- */}
      <Section surface="sunken" aria-labelledby="reach-title">
        <Container>
          <div className={`dm-grid12 ${styles.rowTop}`}>
            <div className="col-span-6 md:col-span-7">
              <Eyebrow>Two ways in</Eyebrow>
              <Heading level={2} folio="No. 01" id="reach-title">
                Email is the fastest. The phone works too.
              </Heading>
              <Prose>
                <p>
                  Email gets you a written record of the date, the fee, and the room, which is
                  what your committee will ask for. Call if the date is close. Either way you
                  get a reply from Damian or from his office manager Lori inside one business
                  day, not from a bureau.
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
        <Container width="narrow">
          <Eyebrow>Before you write</Eyebrow>
          <Heading level={2} folio="No. 02" id="inquiry-title">
            What to put in the first email
          </Heading>
          <Prose>
            <p>
              First step: make sure he has your date. Send these five lines and you get a real
              answer back instead of a call to collect them.
            </p>
            <ul>
              <li>The date, the city, and the name of the event.</li>
              <li>
                Who is in the room, and roughly how many: growers, ag lenders, agronomists,
                association members.
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
            <p>
              One caveat, stated up front: Damian won&rsquo;t speak while people are eating or
              tables are being cleared.
            </p>
          </Prose>
        </Container>
      </Section>

      {/* --- No. 03, what happens next -------------------------------------- */}
      <Section surface="sunken" aria-labelledby="process-title">
        <Container>
          <div className={`dm-grid12 ${styles.rowTop}`}>
            <figure className={`dm-figure ${styles.figureColumn} col-span-6 md:col-span-7`}>
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
                <span className="dm-figure__folio">Fig. 01 </span>
                In the office, between dates. The email goes to Damian. The calendar belongs to
                Lori.
              </figcaption>
            </figure>

            <div className="col-span-6 md:col-span-5">
              <Eyebrow>After you write</Eyebrow>
              <Heading level={2} folio="No. 03" id="process-title">
                How a date gets held
              </Heading>
              <Prose measure="narrow">
                <p>
                  Damian books most of his events directly with the client. A simple contract and
                  a small deposit hold your date, and the balance is due the day of the event. He
                  books his own airfare and rental car against one travel fee, quoted up front.
                  You book the hotel. After that the date is on Lori&rsquo;s calendar and off
                  your list.
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

      {/* --- No. 04, the list ------------------------------------------------ */}
      <Section aria-labelledby="newsletter-title">
        <Container width="narrow">
          <Eyebrow>Not booking today</Eyebrow>
          <Heading level={2} folio="No. 04" id="newsletter-title">
            Get the list instead
          </Heading>
          <Card variant="bright" className={styles.asideNote}>
            <NewsletterForm
              idPrefix="contact-newsletter"
              title={null}
              submitVariant="secondary"
            />
          </Card>
        </Container>
      </Section>

      <CTABand
        id="book"
        eyebrow="Bookings"
        folio="No. 05"
        heading="Have a date in mind?"
        copy="Send the date and the city. If it's open, we talk about the room, the program, and the fee. If not, you'll know inside one business day."
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

import Link from 'next/link';
import type { Metadata } from 'next';

import Image from 'next/image';

import { Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { PressList } from '@/components/sections/PressList';
import { JsonLd } from '@/components/seo';
import { imageAlt } from '@/content/image-alt';
import { press } from '@/content/press';
import { contact } from '@/content/site';
import { buildMetadata, SITE_LANGUAGE, absoluteUrl, canonicalUrl } from '@/lib/seo';
import { buildBreadcrumbListSchema, schemaIds, type JsonLdDocument } from '@/lib/schema';

import styles from './page.module.css';

/* ============================================================================
   /join-the-conversation/

   Two old URLs collapse here. `/join-the-conversation/` was a raw Mailchimp
   embed pasted into the classic editor: no prose, no value proposition, a
   hard-coded 600 pixel form width, and an og:description generated from the
   field labels that read "Subscribe * indicates required First Name Last Name
   Email Address *". `/join-mailing-list/` carried the only pitch copy on
   either page and 301s here, so that copy is carried over below.

   The form is the page. It posts to the same Mailchimp audience with the same
   FNAME / LNAME / EMAIL field names and the same honeypot, all from
   content/site.ts, so no subscriber and no automation on the list changes.

   Deliberate omission: no send frequency is stated anywhere on this route. The
   only cadence signal in the source is the phrase "his weekly audience of more
   than 40,000 subscribers", which describes an audience rather than a schedule
   and conflicts with the site's own "more than 40,000 listeners per month".
   Inventing a cadence here would be a promise the office has to keep.

   ONE 40,000 PER ROUTE. Both figures are in the harvest: 40,000 subscribers
   (join-mailing-list.md:23) and 40,000 listeners per month
   (collaboration-opportunities.md:38). This route preserves the source
   subscriber figure in its hero and closing panel; the listener figure is off
   this page entirely. Whether the two 40,000s
   are the same 40,000 people is a question only the client can answer and it
   is logged in docs/OPEN-ITEMS.md.
   ============================================================================ */

const PATH = '/join-the-conversation/';
const MAILTO = `mailto:${contact.email}`;

const HERO_IMAGE = {
  src: '/img/photos/portrait-check-jacket.jpg',
  /* Single call site, so the string lives here rather than in
     content/image-alt.ts, per the rule at the head of that module. */
  alt:
    'Damian Mason in a grey check sport coat over a white shirt and navy trousers, one hand in a pocket, grinning.',
  width: 1333,
  height: 2000,
  feature: true,
};

export const metadata: Metadata = buildMetadata({
  title: 'Ag Newsletter and Mailing List',
  description:
    'Subscribe for new podcast releases and Damian Mason’s commentary on recent trends in the business of food, fuel, and fiber.',
  path: PATH,
  image: {
    url: HERO_IMAGE.src,
    width: HERO_IMAGE.width,
    height: HERO_IMAGE.height,
    alt: HERO_IMAGE.alt,
  },
});

/**
 * A WebPage node whose mainEntity is the sign-up action itself. It points at
 * the standing Person and WebSite nodes by @id rather than restating them.
 */
const pageSchema: JsonLdDocument = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${canonicalUrl(PATH)}#webpage`,
  name: 'Join the Conversation',
  /* U+2019. This string is crawler-reachable in the served HTML, and the
     <meta name="description"> for the same route already uses the curly form,
     so a straight apostrophe here put two descriptions of one page in two
     typographic styles. */
  description:
    'Subscribe to Damian Mason’s mailing list for new podcast episodes and his commentary on trends in the business of food, fuel, and fiber.',
  url: canonicalUrl(PATH),
  inLanguage: SITE_LANGUAGE,
  isPartOf: { '@id': schemaIds.website },
  about: { '@id': schemaIds.person },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: absoluteUrl(HERO_IMAGE.src),
    width: HERO_IMAGE.width,
    height: HERO_IMAGE.height,
    caption: HERO_IMAGE.alt,
  },
  potentialAction: {
    '@type': 'SubscribeAction',
    name: 'Join the mailing list',
    target: canonicalUrl(PATH),
  },
};

const breadcrumbSchema = buildBreadcrumbListSchema([
  { name: 'Home', path: '/' },
  { name: 'Join the Conversation', path: PATH },
]);

export default function JoinTheConversationPage() {
  return (
    <>
      <JsonLd id="join-the-conversation-schema" schema={[pageSchema, breadcrumbSchema]} />

      <Hero
        id="join"
        eyebrow="The mailing list"
        title="Join the Conversation"
        deck="Subscribe to get notified of new podcast releases and follow Damian’s commentary on recent trends in the business of food, fuel, and fiber."
        actions={[
          {
            label: 'Add yourself to the list',
            href: '#signup',
            variant: 'secondary',
          },
        ] as const}
        image={HERO_IMAGE}
        cutline="Damian Mason, speaker, author, and host of The Business of Agriculture."
      />

      {/* --- No. 01, what you get, and the form ----------------------------- */}
      <Section id="signup" surface="sunken" aria-labelledby="signup-title">
        <Container>
          <div className={`dm-grid12 ${styles.rowTop}`}>
            <div className="col-span-6 md:col-span-7">
              <Eyebrow>What to expect</Eyebrow>
              <Heading level={2} id="signup-title" className={styles.sectionHeading}>
                What the list carries
              </Heading>
              <Prose>
                <ul>
                  <li>
                    Notifications of new podcast releases from Damian Mason.
                  </li>
                  <li>
                    Commentary on recent trends in the business of food, fuel, and fiber.
                  </li>
                </ul>
                <p>
                  Email is required. First and last name are optional.
                </p>
              </Prose>
            </div>

            <Card variant="bright" className="col-span-6 md:col-span-5">
              {/* Not "join": the Hero above is id="join" and names its h1
                  "join-title", so that prefix put the same id on the h1 and on
                  this form's h3. The form's aria-labelledby then resolved to
                  the page title instead of its own heading. */}
              <NewsletterForm
                idPrefix="join-signup"
                headingLevel={3}
                title="Add yourself to the list."
                blurb="Email is required. First and last name are optional."
              />
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- What actually landed -------------------------------------------
          THE BEST VALUE-PER-WORD FILL AVAILABLE ON THIS ROUTE, and it adds not
          one new fact.

          Three real press rows show the public commentary described by the
          source pitch. They are examples of Damian's current work, not a claim
          that every appearance is sent to the list.

          A second home for that module, which had exactly one consumer.
          Navy, because this route ran 3,674px of a single grey with three
          images on it, which was the thinnest page on the site by every measure
          worth taking. */}
      <Section id="recent" surface="deep-alt" aria-labelledby="recent-title">
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>Recently</Eyebrow>
              <Heading level={2} id="recent-title" className={styles.sectionHeading}>
                Commentary behind the list
              </Heading>
              <Prose measure="narrow">
                <p>
                  Three recent public appearances showing Damian&rsquo;s commentary on food,
                  fuel, and fiber.
                </p>
              </Prose>
            </div>
            <div className="col-span-6 md:col-span-8">
              <PressList
                items={press}
                limit={3}
                headingLevel={3}
                label="Recent coverage"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- Direct alternatives --------------------------------------------- */}
      <Section aria-labelledby="not-title">
        {/* Standard container, not narrow. A narrow container centres itself,
            which put this head on a 320px axis while every other head on the
            route sat at 96. The reading measure belongs to the content column,
            not to the section. */}
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
          <Eyebrow>Go straight to the source</Eyebrow>
          <Heading level={2} id="not-title" className={styles.sectionHeading}>
            Listen or read without joining
          </Heading>
            </div>
            <div className="col-span-6 md:col-span-8">
          <Prose>
            <p>
              The form is optional. New episodes remain available through the{' '}
              <Link href="/podcasts/">podcast hub</Link>, and Damian&rsquo;s published media
              appearances remain available through <Link href="/blog-news/">Media &amp; News</Link>.
            </p>
            <p>
              Join only if a direct notification is more useful than checking those pages
              yourself.
            </p>
          </Prose>

          {/* The one place on the site that shows the newsletter and the two
              podcasts being MADE rather than described. It closes the route on
              the same argument the copy above makes: a person writes this. */}
          <figure className={`dm-figure ${styles.deskFigure}`} data-reveal="wipe">
            <div className="dm-photo dm-photo--plate" data-photo="feature">
              <Image
                className="dm-photo__img"
                src="/img/photos/podcast-desk.jpg"
                alt={imageAlt['/img/photos/podcast-desk.jpg']}
                width={2000}
                height={1308}
                loading="lazy"
                sizes="(min-width: 48rem) 56rem, 100vw"
              />
            </div>
            <figcaption className="dm-figure__caption">
              One desk, one microphone, one laptop. Everything on this list is
              written at it.
            </figcaption>
          </figure>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        id="book"
        eyebrow="Bookings"
        heading="Need a speaker, not an inbox?"
        /* "from Damian or from his office manager Lori" is /contact-us/'s own
           promise about who replies, and it ran here word for word. */
        copy="Growers, ag lenders, association directors: if you have a date and a room, send both to the office. A mailing list won’t book anybody, and one email will."
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
          eyebrow: 'The list',
          value: '40,000',
          plus: true,
          label: 'subscribers',
          /* Not the occupation triplet, which /the-business-of-agriculture/
             owns, and not the same list this route's own CTA copy uses two
             lines above. A subscriber list is defined by what it does, not by
             a job title. */
          note: 'Published mailing-list figure; the current total awaits Damian’s confirmation.',
        }}
      />
    </>
  );
}

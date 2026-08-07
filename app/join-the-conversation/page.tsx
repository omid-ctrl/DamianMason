import Link from 'next/link';
import type { Metadata } from 'next';

import { Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { JsonLd } from '@/components/seo';
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
   ============================================================================ */

const PATH = '/join-the-conversation/';
const MAILTO = `mailto:${contact.email}`;

const HERO_IMAGE = {
  src: '/img/photos/portrait-light-jacket.jpg',
  alt: 'Damian Mason in a grey plaid sport coat and open collar shirt, holding his reading glasses, outside a brick building.',
  width: 1334,
  height: 2000,
};

export const metadata: Metadata = buildMetadata({
  title: 'Ag Newsletter and Mailing List',
  description:
    'More than 40,000 subscribers get Damian’s read on the trends in food, fuel, and fiber. Free to join, unsubscribe any time. Add yourself to the list.',
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
  description:
    "Subscribe to Damian Mason's mailing list for new podcast episodes and his commentary on trends in the business of food, fuel, and fiber.",
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
        deck="New podcast episodes, plus Damian's read on the trends behind them: the business of food, fuel, and fiber. Free to join. If it stops earning its place in your inbox, there's an unsubscribe link at the bottom of every email."
        actions={[
          {
            label: 'Add yourself to the list',
            href: '#signup',
            variant: 'secondary',
          },
        ] as const}
        image={HERO_IMAGE}
        cutline="Purdue Ag Econ degree, Second City Chicago, and a farm in Indiana. All three show up in the writing."
      />

      {/* --- No. 01, what you get, and the form ----------------------------- */}
      <Section id="signup" surface="sunken" aria-labelledby="signup-title">
        <Container>
          <div className={`dm-grid12 ${styles.rowTop}`}>
            <div className="col-span-6 md:col-span-7">
              <Eyebrow>What you get</Eyebrow>
              <Heading level={2} folio="No. 01" id="signup-title">
                Three things land in your inbox
              </Heading>
              <Prose>
                <ul>
                  <li>
                    New episodes of{' '}
                    <Link href="/the-business-of-agriculture/">The Business of Agriculture</Link>{' '}
                    and <Link href="/do-business-better-podcast/">Do Business Better</Link>.
                  </li>
                  <li>
                    Damian&rsquo;s commentary on recent trends in the business of food, fuel, and
                    fiber. Same wit he uses on stage, in writing.
                  </li>
                  <li>
                    Whatever else he has put his name on lately: an{' '}
                    <Link href="/acres-tv/">Acres TV</Link> segment, an{' '}
                    <Link href="/xtreme-ag/">XtremeAg</Link> field report, a{' '}
                    <Link href="/blog-news/">news interview</Link> about the price of food.
                  </li>
                </ul>
                <p>
                  One address, one list. Unsubscribe from the bottom of any email.
                </p>
              </Prose>
            </div>

            <Card variant="bright" className="col-span-6 md:col-span-5">
              <NewsletterForm
                idPrefix="join"
                headingLevel={3}
                title="Add yourself to the list."
                blurb="Email address is the only field the list actually needs. The names just mean Damian knows who he's talking to."
              />
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- No. 02, the refusal -------------------------------------------- */}
      <Section aria-labelledby="not-title">
        <Container width="narrow">
          <Eyebrow>What you won&rsquo;t get</Eyebrow>
          <Heading level={2} folio="No. 02" id="not-title">
            No weather forecast, no commodity prices
          </Heading>
          <Prose>
            <p>
              You don&rsquo;t need anyone telling you the weather forecast or the commodity prices,
              technology does that for you. What you need is a connection with real-world
              Agriculture people and topics that inform, educate, and help you grow. The list
              carries exactly that.
            </p>
            <p>
              More than 40,000 people listen to the podcast every month. If you&rsquo;d rather
              skip the inbox and just listen, start at the{' '}
              <Link href="/podcasts/">podcast hub</Link>.
            </p>
          </Prose>
        </Container>
      </Section>

      <CTABand
        id="book"
        eyebrow="Bookings"
        folio="No. 03"
        heading="Need a speaker, not an inbox?"
        copy="Growers, ag lenders, association directors: if you have a date and a room, send both to the office. You'll have an answer inside one business day, from Damian or from his office manager Lori."
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
          eyebrow: 'Podcast reach',
          value: '40,000',
          plus: true,
          label: 'listeners per month',
          note: 'The list is how a lot of them hear an episode posted.',
        }}
      />
    </>
  );
}

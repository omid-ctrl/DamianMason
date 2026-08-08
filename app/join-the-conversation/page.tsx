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
   (collaboration-opportunities.md:38). This route's metadata and the site-wide
   footer both say subscribers, so the listener figure is off this page
   entirely and the stat panel is scoped to the list. Whether the two 40,000s
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
        deck="New podcast episodes, plus Damian’s read on the trends behind them: the business of food, fuel, and fiber. Free to join, and more than 40,000 people already have."
        actions={[
          {
            label: 'Add yourself to the list',
            href: '#signup',
            variant: 'secondary',
          },
        ] as const}
        image={HERO_IMAGE}
        cutline="One list, one address. There’s an unsubscribe link at the bottom of every email, and it works."
      />

      {/* --- No. 01, what you get, and the form ----------------------------- */}
      <Section id="signup" surface="sunken" aria-labelledby="signup-title">
        <Container>
          <div className={`dm-grid12 ${styles.rowTop}`}>
            <div className="col-span-6 md:col-span-7">
              <Eyebrow>What you get</Eyebrow>
              <Heading level={2} id="signup-title" className={styles.sectionHeading}>
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
              {/* Not "join": the Hero above is id="join" and names its h1
                  "join-title", so that prefix put the same id on the h1 and on
                  this form's h3. The form's aria-labelledby then resolved to
                  the page title instead of its own heading. */}
              <NewsletterForm
                idPrefix="join-signup"
                headingLevel={3}
                title="Add yourself to the list."
                blurb="Email address is the only field the list actually needs. The names just mean Damian knows who he’s talking to."
              />
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- What actually landed -------------------------------------------
          THE BEST VALUE-PER-WORD FILL AVAILABLE ON THIS ROUTE, and it adds not
          one new fact.

          The bulleted list above already claims, in prose, that the list
          carries "an Acres TV segment, an XtremeAg field report, a news
          interview about the price of food". That is an assertion. Three real
          press rows directly under it turn the same sentence into evidence,
          and every row is already in content/press.ts with a verified outbound
          link.

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
                The kind of thing that lands
              </Heading>
              <Prose measure="narrow">
                <p>
                  Not a newsletter about a newsletter. Three of the last places
                  Damian turned up, which is the sort of item the list carries a
                  link to on the week it runs.
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

      {/* --- The refusal ----------------------------------------------------- */}
      <Section aria-labelledby="not-title">
        {/* Standard container, not narrow. A narrow container centres itself,
            which put this head on a 320px axis while every other head on the
            route sat at 96. The reading measure belongs to the content column,
            not to the section. */}
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
          <Eyebrow>What you won&rsquo;t get</Eyebrow>
          <Heading level={2} id="not-title" className={styles.sectionHeading}>
            No weather forecast, no commodity prices
          </Heading>
            </div>
            <div className="col-span-6 md:col-span-8">
          <Prose>
            {/* This paragraph used to be the source's weather-forecast refusal
                re-typed with the exclamation point softened and a tail bolted
                on: 39 words that ran word for word against the No. 05 band on
                Home. That paragraph is verbatim source copy at
                `_source/pages/home.md:206` and Home is the only route with a
                claim to it, so Home keeps it. The refusal itself is this
                section's whole point and it is already made by the heading
                above, so what the prose owes the reader is the other half of
                the trade: what the list actually sends. */}
            <p>
              Your phone already has the forecast and the close. What it doesn&rsquo;t have is
              somebody telling you which of this week&rsquo;s Ag stories is going to cost you
              money, and that&rsquo;s the only reason worth handing over an email address for.
            </p>
            <p>
              If you&rsquo;d rather skip the inbox and just listen, start at the{' '}
              <Link href="/podcasts/">podcast hub</Link>. The list is how a lot of people hear
              that an episode posted.
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
          note: 'People who would rather read it than be sold it.',
        }}
      />
    </>
  );
}

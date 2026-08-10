import type { Metadata } from 'next';
import Link from 'next/link';

import { RequestedPath } from './_components/RequestedPath';
import { CTABand } from '@/components/sections/CTABand';
import { Card, Container, Eyebrow, Heading, Prose, Rule, Section } from '@/components/ui';
import { contact } from '@/content/site';
import { buildMetadata } from '@/lib/seo';

import styles from './not-found.module.css';

/* ============================================================================
   404.

   The old WordPress site had no custom 404, which matters more here than it
   usually would: next.config.ts permanently redirects eleven old addresses,
   the store is gone entirely, and the store's long tail (`/product/*`
   variants, `?add-to-cart=`, category archives) is exactly what stale search
   results and old newsletters still point at. Any one of those that a redirect
   rule misses lands here.

   So this page does three jobs, in order:
     1. Says plainly that the address is dead, without blaming the reader.
     2. Echoes the address back and, when it looks like a store URL, says the
        store closed. That is the single most likely reason anyone is here.
     3. Offers the four real destinations rather than one "go home" link.
        Speaking is what gets booked, Podcasts is what most of the traffic came
        for, Blog and News is the media shelf, Contact is the office.

   ORANGE BUDGET. The masthead already ships one filled orange field, the
   persistent Book Damian button. Nothing on this page is `primary`: the CTA
   band's actions are both overridden to `secondary`, so the viewport carries
   exactly one filled orange, which is the rule.
   ============================================================================ */

const MAILTO = `mailto:${contact.email}`;

/**
 * `not-found.tsx` inherits the root layout's title and description unless it
 * sets its own, and that description is 172 characters, the only one on the
 * site outside the 140 to 165 window Google will render whole. It is also
 * wrong here: a 404 is not the site's positioning statement.
 *
 * `noIndex` is the other half. A soft 404 that Google is invited to index is a
 * duplicate-content problem across every dead store URL at once.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Page Not Found',
    description:
      'That address is not on this site. The online store is closed. Working paths to speaking, the podcasts, the writing and the booking office are below.',
    path: '/404/',
    noIndex: true,
  }),
  /**
   * `buildMetadata` writes a self-referential canonical, which every real route
   * wants and this one must not have: /404/ is not a served URL, and pointing
   * every dead store address at one canonical is how a soft 404 gets indexed.
   * The noindex directive does the work instead.
   */
  alternates: {},
};

/**
 * NOTE FOR THE SEO SWEEP: the served head carries two `meta name="robots"`
 * tags, `noindex` and `noindex, nofollow`. The first is Next's own, emitted
 * automatically for the not-found boundary; the second is ours. They agree, so
 * the directive is unambiguous, and the duplicate is kept on purpose. Dropping
 * `noIndex` from the call above would make `buildMetadata` emit `index, follow`
 * instead, which would contradict Next's tag rather than repeat it.
 */

type Destination = {
  href: string;
  label: string;
  /** What is actually behind the link. No link ships without one. */
  blurb: string;
};

const DESTINATIONS: readonly Destination[] = [
  {
    href: '/speaking/',
    label: 'Speaking',
    blurb:
      'Topics, the keynote program, what 2,400 audiences have said, and the answers a meeting coordinator needs before signing anything.',
  },
  {
    href: '/podcasts/',
    label: 'Podcasts',
    blurb:
      'The Business of Agriculture, Do Business Better, XtremeAg and Acres TV. Every episode is free and none of them require an account.',
  },
  {
    href: '/blog-news/',
    label: 'Media',
    blurb:
      'Press, columns, broadcast clips, and appearances, kept together on one media shelf.',
  },
  {
    href: '/contact-us/',
    label: 'Contact',
    blurb: `Email ${contact.email} or call ${contact.phone}. Bookings run direct through the Indiana office.`,
  },
] as const;

export default function NotFound() {
  return (
    <>
      <Section aria-labelledby="not-found-title">
        <Container>
          <Eyebrow as="p" tone="accent">
            Error 404
          </Eyebrow>
          <Heading level={1} display size="4xl" id="not-found-title" className={styles.title}>
            There is nothing at this address
          </Heading>
          <Prose lead className={styles.lead}>
            <p>
              This site was rebuilt, and a handful of pages moved or closed when it was. The link
              you followed points at one of them. Nothing here is broken on your end.
            </p>
          </Prose>

          {/* Fills in after mount. See the comment in RequestedPath.tsx for why
              a server component cannot know the path. */}
          <RequestedPath />
        </Container>
      </Section>

      <Section surface="sunken" aria-labelledby="not-found-where">
        <Container>
          <Eyebrow as="p">Four addresses that work</Eyebrow>
          <Heading level={2} size="2xl" id="not-found-where" className={styles.title}>
            Where to go instead
          </Heading>
          <Rule tone="structural" weight="thick" className={styles.headRule} />

          <ul className={styles.destinations}>
            {DESTINATIONS.map((destination, index) => (
              <li key={destination.href} className={styles.destination}>
                <Card variant="ruled" className={styles.card}>
                  {/* The index is ornament. A screen reader should hear the
                      link, not a number, so it is faint and hidden. */}
                  <Eyebrow tone="faint" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </Eyebrow>
                  <h3 className={styles.cardTitle}>
                    <Link href={destination.href} className={styles.cardLink}>
                      {destination.label}
                    </Link>
                  </h3>
                  <p className={styles.cardBlurb}>{destination.blurb}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CTABand
        id="not-found-cta"
        eyebrow="The office"
        heading="If none of those is what you were after, ask"
        copy="Tell us what you were looking for and where the link came from. A dead link we hear about is a dead link that gets fixed, and every inquiry gets an answer in one business day."
        actions={[
          { label: 'Email the office', href: MAILTO, variant: 'secondary' },
          { label: `Call ${contact.phone}`, href: contact.phoneHref, variant: 'ghost' },
        ]}
        surface="deep"
      />
    </>
  );
}

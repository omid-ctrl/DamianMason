import type { ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Container, Eyebrow, Heading, Prose, Quote, Rule, Section, cx } from '@/components/ui';
import { site } from '@/content/site';
import { FooterContact } from './FooterContact';
import { FooterNav } from './FooterNav';
import { FooterSocial } from './FooterSocial';

export type FooterProps = {
  className?: string;
} & Omit<ComponentPropsWithoutRef<'footer'>, 'className'>;

/**
 * The site footer, and the single most broken region of the old site. What it
 * shipped: six navigation links pointing at the WP Engine staging hostname as
 * raw query-string page ids, a "Home" link on an insecure mixed-case bare
 * hostname, two entirely empty widgets, an unlinked logo, no social icons, no
 * contact details, no newsletter, and a bottom bar that rendered completely
 * empty where the copyright and the social row were supposed to be.
 *
 * Every route in here is a site-relative path resolved from content/site.ts,
 * and the commerce links the client asked to have removed are absent.
 *
 * Orange budget for this viewport: one, the bar on the testimonial. The
 * newsletter call to action is deliberately `secondary`, because every route
 * ends in a navy CTA band that owns the one primary button, and two orange
 * fields on screen at once means neither of them is the action.
 */
export function Footer({ className, ...rest }: FooterProps) {
  // Server component, so this is evaluated when the page is rendered. The old
  // footer had no copyright line of any kind.
  const year = new Date().getFullYear();

  return (
    <Section
      as="footer"
      surface="deepest"
      density="tight"
      className={cx('dm-footer', className)}
      {...rest}
    >
      <Container>
        <div className="dm-footer__stack">
          <div className="dm-grid12">
            {/* Five of twelve between 768 and 1024 so the email address gets a
                column wider than the address is, and four above it. */}
            <div className="col-span-6 md:col-span-5 lg:col-span-4 dm-footer__brand">
              {/* The footer mark IS a link, and it does not reverse to white.
                  Inside a navy plane it sits on a bone plate, which is what the
                  paper scope exists for. */}
              <Link
                className="dm-footer__plate"
                href="/"
                data-surface="paper"
                aria-label={`${site.name}, home`}
              >
                <Image
                  className="dm-footer__wordmark"
                  src="/img/brand/wordmark.png"
                  alt=""
                  width={800}
                  height={199}
                  sizes="(min-width: 48rem) 14rem, 10rem"
                />
              </Link>

              <FooterContact />
              <FooterSocial />
            </div>

            <FooterNav className="col-span-6 md:col-span-7 lg:col-span-8" />
          </div>

          <Rule />

          <div className="dm-grid12">
            <Quote
              className="col-span-6 md:col-span-6"
              wide
              barred
              attribution="B. Kettler, IHLA"
            >
              Thanks for your thought-provoking presentations and making sure we all think
              differently about our industry.
            </Quote>

            <div className="col-span-6 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8 dm-footer__signup">
              <Eyebrow>The mailing list</Eyebrow>
              <Heading level={2} size="lg">
                Join the conversation
              </Heading>
              <Prose measure="narrow">
                {/* No send cadence is claimed here. The only cadence word in
                    the source is "his weekly audience of more than 40,000
                    subscribers" (join-mailing-list), which describes the
                    audience, not the schedule, and /join-the-conversation/
                    deliberately states none for that reason. "Notified of new
                    podcast releases and more" is that page's own subhead. */}
                <p>
                  More than 40,000 subscribers get Damian{'’'}s read on the business of food,
                  fuel, and fiber, plus a note when a new episode posts. Add yourself to the
                  list.
                </p>
              </Prose>
              {/* The Mailchimp form itself lives on the destination route and in
                  the NewsletterForm component. The footer only points at it. */}
              <Button href="/join-the-conversation/" variant="secondary">
                Join the list
              </Button>
            </div>
          </div>

          <Rule />

          <div className="dm-footer__bottom">
            <p className="dm-footer__copyright">
              {'©'} {year} {site.legalName}. All rights reserved.
            </p>
            <Eyebrow as="p" className="dm-footer__folio">
              {site.tagline}
            </Eyebrow>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Footer;

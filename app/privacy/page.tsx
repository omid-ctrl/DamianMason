import type { Metadata } from 'next';
import Link from 'next/link';

import { Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { JsonLd } from '@/components/seo';
import { contact } from '@/content/site';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

const ROUTE = '/privacy/';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Notice',
  description:
    'A plain-language account of what DamianMason.com sends when you use the inquiry form, newsletter, podcast player, or video player.',
  path: ROUTE,
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: ROUTE },
        ])}
      />

      <Section aria-labelledby="privacy-title">
        <Container>
          <Eyebrow>Privacy notice</Eyebrow>
          <Heading level={1} display size="5xl" id="privacy-title">
            What this site sends, and when.
          </Heading>
          <Prose lead measure="wide">
            <p>
              This site does not run analytics or advertising trackers. Information leaves the
              page only when you submit a form or choose to load third-party media.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="sunken" aria-labelledby="privacy-details-title">
        <Container>
          <Heading level={2} size="2xl" id="privacy-details-title">
            The details
          </Heading>
          <Prose>
            <h3>Inquiry form</h3>
            <p>
              The form asks for an inquiry type, name, email address, and message. Phone,
              organization, and a relevant date are optional. On submission, those fields are
              sent to Damian Mason’s office through the delivery provider configured for this
              site. If no provider is configured, the site refuses the submission and gives you
              an email draft instead of accepting a message it cannot deliver.
            </p>

            <h3>Newsletter</h3>
            <p>
              The newsletter form posts the name and email fields you enter directly to
              Mailchimp. Mailchimp opens its confirmation in a new tab. This website does not
              make a second copy of that submission.
            </p>

            <h3>Podcast and video players</h3>
            <p>
              The YouTube privacy-enhanced player and the Libsyn podcast player do not load on
              initial page view. They load only after you activate the player. At that point,
              your browser connects to the selected service under that service’s own policies.
            </p>

            <h3>Questions</h3>
            <p>
              Email <a href={`mailto:${contact.email}`}>{contact.email}</a> with a privacy
              question, or use the <Link href="/contact-us/">contact page</Link>.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  );
}

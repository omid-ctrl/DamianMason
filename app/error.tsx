'use client';

import { useEffect } from 'react';

import { Button, Container, Eyebrow, Heading, Prose, Rule, Section } from '@/components/ui';
import { contact } from '@/content/site';

import styles from './error.module.css';

/* ============================================================================
   The route error boundary.

   Next renders this in place of the page's content when a segment below the
   root layout throws. The header, the footer and the skip link all survive,
   which is the whole reason this file exists rather than only global-error:
   a reader who hits it still has the full navigation and does not need this
   page to rebuild it.

   `reset` re-renders the segment. It is a real button, not a link, because it
   does not navigate. Everything that does navigate is an anchor.

   ORANGE BUDGET. The masthead already carries the one filled orange field on
   screen, so `Try that again` is secondary. An error page is not the place to
   spend the site's one loudest mark.
   ============================================================================ */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what ties this render to a server log line. Nothing else
    // on the page can, so it goes to the console whether or not it is shown.
    console.error('Route error boundary caught:', error);
  }, [error]);

  return (
    <Section aria-labelledby="error-title">
      <Container>
        <Eyebrow as="p" tone="accent">
          Something broke
        </Eyebrow>
        <Heading level={1} display size="4xl" id="error-title" className={styles.title}>
          This page did not load
        </Heading>
        <Prose lead className={styles.lead}>
          <p>
            The fault is on this end, not yours. Loading it again clears most of these. If it does
            not clear, the rest of the site is still working and the office still answers email.
          </p>
        </Prose>

        {error.digest ? (
          <p className={styles.digest}>
            {/* Mono, because it is a reference number and not prose. Quoting it
                in an email is what lets the error be found in the log. */}
            <span className={styles.digestLabel}>Reference</span>
            {error.digest}
          </p>
        ) : null}

        <Rule tone="structural" className={styles.rule} />

        <div className={styles.actions}>
          <Button variant="secondary" size="lg" onClick={reset}>
            Try that again
          </Button>
          <Button variant="ghost" size="lg" href="/">
            Back to the front page
          </Button>
        </div>

        <p className={styles.aside}>
          If it keeps happening, email <a href={`mailto:${contact.email}`}>{contact.email}</a> or
          call <a href={contact.phoneHref}>{contact.phone}</a>, and say which page you were on.
        </p>
      </Container>
    </Section>
  );
}

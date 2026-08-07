'use client';

import { useEffect } from 'react';

/* The root layout is what failed, so this file has to import the stylesheet
   itself. Nothing else pulls it in at this point in the tree. */
import './globals.css';

import { Button, Container, Eyebrow, Heading, Prose, Rule, Section } from '@/components/ui';
import { contact } from '@/content/site';

import styles from './error.module.css';

/* ============================================================================
   The global error boundary.

   This one replaces the root layout, not just the page, so it owns <html> and
   <body> and there is no Header, no Footer and no skip link to lean on. It
   only renders when the layout itself throws, which in this build means the
   fonts, the schema block or the chrome. Next ships an unstyled default
   otherwise: a bare white page with black Times, on a site whose entire
   argument is typographic.

   FONTS. The four next/font families are wired up as CSS variables on the
   <html> element in app/layout.tsx, and that element is gone here. This is
   deliberate rather than an oversight: src/styles/tokens.css declares every
   family as `var(--font-x, "Real Name"), <system stack>`, so the type falls
   back cleanly on its own. Re-declaring the loaders in this file would put a
   second copy of four families into the build to serve a page almost nobody
   will see. The color, the scale, the rules and the spacing are all tokens and
   all survive, which is what actually makes the page look like the site.

   Everything here is duplicated from app/error.tsx on purpose. A shared
   component between the two would be one more module that has to load
   correctly at the exact moment the tree is already failing.
   ============================================================================ */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        {/* React hoists both of these into <head>. There is no metadata export
            on a global-error boundary, so this is the only way to keep the tab
            from reading as the raw URL and to keep the page out of the index. */}
        <title>Something Went Wrong | Damian Mason</title>
        <meta name="robots" content="noindex, nofollow" />

        <Section as="main" id="main" className="flex-1" aria-labelledby="global-error-title">
          <Container>
            <Eyebrow as="p" tone="accent">
              Something broke
            </Eyebrow>
            <Heading level={1} display size="4xl" id="global-error-title" className={styles.title}>
              This site did not load
            </Heading>
            <Prose lead className={styles.lead}>
              <p>
                The fault is on this end, not yours. Loading it again clears most of these. If it
                does not, the phone and the email address below both still work.
              </p>
            </Prose>

            {error.digest ? (
              <p className={styles.digest}>
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
              Damian Mason, Business Agriculture. Email{' '}
              <a href={`mailto:${contact.email}`}>{contact.email}</a> or call{' '}
              <a href={contact.phoneHref}>{contact.phone}</a>.
            </p>
          </Container>
        </Section>
      </body>
    </html>
  );
}

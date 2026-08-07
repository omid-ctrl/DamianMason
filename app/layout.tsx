import type { Metadata, Viewport } from 'next';
import { Archivo, Bodoni_Moda, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { Footer, Header } from '@/components/layout';
import { RevealController } from '@/components/motion';
import { JsonLd } from '@/components/seo';
import { buildSiteBaseSchema } from '@/lib/schema';

/**
 * Four families, loaded with next/font/google so they are self-hosted and
 * inlined at build time. No render-blocking stylesheet from fonts.googleapis.
 *
 * Each exposes a CSS variable that src/styles/tokens.css reads through a
 * var() fallback, so the token file stays valid on its own.
 */

/** Display only, and only at --fs-4xl and above. Variable optical size, left
 *  on automatic so the browser matches the opsz master to the used size.
 *
 *  Roman only. The italic master was being preloaded on all 19 routes at
 *  29.5KB and nothing on the site sets the Didone in italic: the one italic
 *  rule in the build is .dm-quote__body, which is --family-serif, and the only
 *  two <em> elements sit inside Prose, which is --family-body. */
const bodoniModa = Bodoni_Moda({
  variable: '--font-bodoni',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal'],
});

/** Every serif job below 40px: proof figures, pull quotes, section headings. */
const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

/** Running text, UI, navigation, forms. */
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

/** The broadsheet furniture: eyebrows, folios, labels, cutlines, buttons. */
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'Damian Mason, Business Agriculture',
    template: '%s | Damian Mason',
  },
  description:
    'Damian Mason is an agricultural economist, keynote speaker, podcaster and author. Since 1994 he has spoken to over 2,400 audiences in all 50 states and 7 foreign countries.',
  metadataBase: new URL('https://damianmason.com'),
};

/**
 * The old site pinned the maximum scale and disabled user scaling, which blocks
 * pinch zoom and fails WCAG 2.1 SC 1.4.4. Neither key is carried over, and
 * neither may be reintroduced. Leaving both unset is what lets a reader zoom to
 * 500 percent, which is the requirement.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${sourceSerif.variable} ${archivo.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main" className="dm-skip-link">
          Skip to content
        </a>
        <Header />
        {/* The skip link's target. Every route renders its content in here, so
            the main landmark exists exactly once per page. */}
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* The scroll reveal. Renders nothing. It is the only thing on the site
            that may hide content, it only ever hides what is already below the
            fold, and with JavaScript off it never runs at all, which is why
            every route is fully readable without it. */}
        <RevealController />
        {/* Person, Organization and WebSite apply site-wide. Page-specific
            graphs (FAQPage, PodcastSeries, BreadcrumbList) are emitted by the
            routes that own them. */}
        <JsonLd schema={buildSiteBaseSchema()} />
      </body>
    </html>
  );
}

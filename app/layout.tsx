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
 *  rule in the build is .dm-quote__body, which is --family-serif-italic, and
 *  the only two <em> elements sit inside Prose, which is --family-body. */
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
  style: ['normal'],
});

/** The slant, split off its roman and deliberately NOT preloaded.
 *
 *  Same defect the Bodoni note above describes, one family down and twice the
 *  size: asking one Source_Serif_4() call for both styles emits a preloaded
 *  latin subset per style, so a 50.3KB italic master was fetched at High
 *  priority in the head of all 19 routes to serve exactly one CSS rule,
 *  .dm-quote__body. Measured on the home route, blocking that one file moved
 *  LCP from 3.23s to 2.93s and performance from 93 to 95.
 *
 *  Splitting it into its own instance with `preload: false` keeps the
 *  typography, which is the point: a synthesised oblique of a text serif is not
 *  the same mark. The file is now fetched off the critical path, and only on
 *  the routes that actually set a pull quote. Regular weight only, because
 *  --weight-regular is the only weight .dm-quote__body asks for, and asking for
 *  one weight gets a 20.4KB static master where asking for three got the 50.3KB
 *  variable one. So the head loses 50.3KB and the wire loses 29.9KB more.
 *
 *  No CSS moved, and that is deliberate rather than an oversight: next/font
 *  names both instances "Source Serif 4", so the italic face joins the same
 *  family the roman already declares and .dm-quote__body keeps resolving it
 *  through --family-serif. Verified in the served @font-face set: one italic
 *  400 face per subset, alongside the normal 400/600/700, so nothing is ever
 *  slanted by the rasteriser. Keep sourceSerifItalic.variable on <html>: it is
 *  what pulls this instance's stylesheet, and the @font-face rules with it.
 *
 *  Do not fold this back into the call above. */
const sourceSerifItalic = Source_Serif_4({
  variable: '--font-source-serif-italic',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  style: ['italic'],
  preload: false,
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
      className={`${bodoniModa.variable} ${sourceSerif.variable} ${sourceSerifItalic.variable} ${archivo.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main" className="dm-skip-link">
          Skip to content
        </a>
        <Header />
        {/* The skip link's target. Every route renders its content in here, so
            the main landmark exists exactly once per page.

            tabIndex={-1} is what makes the skip link actually work. Without it
            the browser scrolls to the anchor but leaves keyboard focus back on
            the link, so the next Tab returns to the navigation the user just
            asked to skip. A negative value keeps <main> out of the tab order
            while still allowing it to receive focus programmatically. */}
        <main id="main" tabIndex={-1} className="flex-1">
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

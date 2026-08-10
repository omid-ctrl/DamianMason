import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Oswald, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { Footer, Header } from '@/components/layout';
import { CountController, MastheadState } from '@/components/motion';
import { JsonLd } from '@/components/seo';
import { site } from '@/content/site';
import { buildSiteBaseSchema } from '@/lib/schema';

/**
 * Four families, loaded with next/font/google so they are self-hosted and
 * inlined at build time. No render-blocking stylesheet from fonts.googleapis.
 *
 * Each exposes a CSS variable that src/styles/tokens.css reads through a
 * var() fallback, so the token file stays valid on its own.
 */

/** The masthead voice.
 *
 *  Oswald is Vernon Adams' reworking of ATF Alternate Gothic, which is the
 *  actual American newspaper and poster gothic lineage rather than something
 *  gothic-adjacent. It replaced Bodoni Moda in the Cool Modern Ag revision for
 *  three reasons, in order of how much they mattered.
 *
 *  1. REGISTER. A Didone is Vogue and Harper's: refinement and distance. The
 *     H1 underneath it reads "Straight-Forward Agriculture Dialogue" and the
 *     buyer is a farm credit executive. The face was arguing with the copy.
 *
 *  2. FIT. The home page H1 broke mid-word at 1024, 1200, 1280, 1380 and 1440,
 *     measured, and app/page.tsx called it "NOT FIXABLE HERE". It was not
 *     fixable in a Didone. Oswald's lowercase advance is 0.441 against Bodoni's
 *     0.539, so the flagship word fits.
 *
 *  3. DIFFERENTIATION FROM THE BODY FACE. This is the one that is easy to get
 *     wrong: Archivo is already a grotesk, and two grotesks that look alike
 *     muddy every page. Oswald separates on TWO independent axes at once, width
 *     (0.441 against Archivo's 0.540, -18%) and cap height (0.810 against
 *     0.686, +18%). Libre Franklin was carried through the bake-off precisely
 *     to test whether weight alone would do it. It would not: at 800 it is
 *     wider than Bodoni, it breaks "Straight-Forward" at the hyphen, and next
 *     to Archivo it reads as one face in two weights.
 *
 *  ONE WEIGHT, deliberately. .dm-display is the only rule that sets this face
 *  and it sets 600. Asking for one weight gets a 12.4KB static instance where
 *  asking for the range gets the variable master, the same mechanism the
 *  Source Serif italic note below documents. Half of Bodoni's 25.2KB.
 *
 *  DO NOT PASS axes:. Oswald has no opsz and no wdth, so there is nothing to
 *  request, and passing axes: would force weight: 'variable' and pull the full
 *  variable font for nothing. Big Shoulders lost the bake-off on exactly this:
 *  its static instance is the opsz-10 TEXT master, and getting the display
 *  master costs 56.9KB on the file that gates LCP on 17 routes.
 *
 *  preload stays on. This face renders the H1, which is the LCP element on
 *  desktop for most routes. */
const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  display: 'swap',
  weight: ['600'],
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
 *  priority in the head of all 20 routes to serve exactly one CSS rule,
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

/** The broadsheet furniture: eyebrows, labels, cutlines, buttons. */
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
  // Built from content/site.ts, which reads NEXT_PUBLIC_SITE_URL and falls back
  // to the production domain. This was hard coded, which meant the one origin
  // Next resolves every relative metadata URL against could silently disagree
  // with the origin lib/seo.ts writes into canonicals and Open Graph tags.
  metadataBase: new URL(site.url),
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
      className={`${oswald.variable} ${sourceSerif.variable} ${sourceSerifItalic.variable} ${archivo.variable} ${plexMono.variable} h-full`}
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
        {/* The masthead's scrolled treatment is state, while the count-up is
            optional motion. Both render nothing; neither ever hides content. */}
        <MastheadState />
        <CountController />
        {/* Person, Organization and WebSite apply site-wide. Page-specific
            graphs (FAQPage, PodcastSeries, BreadcrumbList) are emitted by the
            routes that own them. */}
        <JsonLd schema={buildSiteBaseSchema()} />
      </body>
    </html>
  );
}

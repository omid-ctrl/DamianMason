import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { brandAssets } from '@/content/brand-assets';
import { site } from '@/content/site';

/**
 * The default social card for every route that does not ship art of its own.
 *
 * The old site's og:image was a 2.4MB unresized DSC_7312-scaled.jpg that never
 * appeared on any page. This replaces it with the masthead: bone stock, navy
 * ink, the real wordmark, the name and the line.
 *
 * ---------------------------------------------------------------------------
 * THE ONE PLACE RAW HEX IS ALLOWED.
 *
 * `next/og` renders through Satori, which resolves neither CSS custom
 * properties nor Tailwind. Every value below is a literal copy of a token and
 * MUST be kept in sync with `src/styles/tokens.css` by hand. If a token moves,
 * move it here too. This exception applies to this file and to no other.
 * ---------------------------------------------------------------------------
 */
const TOKENS = {
  /** --surface-page / --palette-stone-200. The page ground. */
  ground: '#f7f8f6',
  /** --ink-primary / --palette-navy-950. 16.94:1 on the ground. */
  ink: '#041826',
  /** --ink-brand / --palette-navy-700, the wordmark navy. 8.41:1. */
  inkBrand: '#094d78',
  /** --ink-muted / --palette-stone-800. 5.76:1. */
  inkMuted: '#566654',
  /** --rule-structural / --palette-stone-650. 3.47:1. */
  ruleStructural: '#788a73',
  /** --brand-orange. A field or a rule only, never a letterform on a light ground. */
  orange: '#ff5325',
} as const;

export const alt = `${site.name}, ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Reads the wordmark off disk and inlines it as a data URI. Satori cannot
 * fetch, and pointing it at a URL would mean a network round trip during the
 * build. Wrapped so a missing file degrades to a typographic lockup instead of
 * failing the build.
 */
async function loadWordmark(): Promise<string | null> {
  try {
    const file = await readFile(join(process.cwd(), 'public', brandAssets.wordmark));
    return `data:image/png;base64,${file.toString('base64')}`;
  } catch {
    return null;
  }
}

/**
 * The cut-out portrait, inlined the same way and for the same reason.
 *
 * WHY THE CARD NOW HAS A FACE ON IT. Every route on this site shared one
 * typographic card, so nothing Damian or a meeting planner ever shared carried
 * a photograph of the man being booked. The card is the only part of this site
 * most people see before they decide whether to click, and a speaker's card
 * with no speaker on it is the one place the restraint was costing something
 * real.
 *
 * The cut-out is the only asset that can do this. Any other portrait is a
 * rectangle, and a rectangle inside a 1200x630 card is a photo pasted onto a
 * layout; a transparent subject stands ON the card's own ground, which is the
 * same gesture the home hero makes.
 *
 * THE CARD-SCALE DERIVATIVE, NOT THE MASTER. Satori has no image pipeline: it
 * decodes what it is handed and cannot resize. Handed the 1400px master it
 * fails outright with "Input buffer contains unsupported image format", which
 * is a decoder giving up rather than a malformed file. See the note on the
 * `portrait-cutout-card` entry in scripts/normalize-assets.mjs.
 *
 * Degrades to the typographic card if the file is missing, exactly as the
 * wordmark does. Nothing here can fail a build.
 */
async function loadCutout(): Promise<string | null> {
  try {
    const file = await readFile(
      join(process.cwd(), 'public', 'img', 'photos', 'portrait-cutout-card.png'),
    );
    return `data:image/png;base64,${file.toString('base64')}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [wordmark, cutout] = await Promise.all([loadWordmark(), loadCutout()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: TOKENS.ground,
          color: TOKENS.ink,
          padding: '56px 72px',
        }}
      >
        {/* Masthead rail: the wordmark, and the dateline that only this site has. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
            paddingBottom: 24,
            borderBottom: `2px solid ${TOKENS.ruleStructural}`,
          }}
        >
          {wordmark ? (
            // Satori renders a plain img from the inlined data URI. next/image
            // has no meaning inside an ImageResponse. The mark is decorative
            // here because the `alt` export above already names the card.
            <img src={wordmark} width={360} height={90} alt="" />
          ) : (
            <div style={{ fontSize: 46, letterSpacing: -1, color: TOKENS.inkBrand }}>
              {site.name}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontSize: 20,
              letterSpacing: 4,
              color: TOKENS.inkMuted,
            }}
          >
            <div>EST. 1994</div>
            <div>INDIANA</div>
          </div>
        </div>

        {/* The argument, in two lines and one orange rule, with the man beside
            it. Satori has no grid, so this is a row and the type column takes
            the remaining width. */}
        <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', gap: 40 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexGrow: 1,
            paddingTop: 40,
          }}
        >
          <div style={{ fontSize: 96, letterSpacing: -3, lineHeight: 1.05, color: TOKENS.ink }}>
            {site.name}
          </div>
          {/* The single orange element on the card. A rule, not a letterform. */}
          <div
            style={{
              display: 'flex',
              width: 132,
              height: 10,
              backgroundColor: TOKENS.orange,
              marginTop: 30,
              marginBottom: 30,
            }}
          />
          <div style={{ fontSize: 42, letterSpacing: -0.5, color: TOKENS.inkBrand }}>
            {site.tagline}
          </div>
        </div>

          {/* Bottom-aligned and slightly over-height, so he stands on the
              folio rule rather than floating above it. 2:3, the file's own
              ratio, so nothing is squashed. */}
          {/* Bottom-aligned and slightly over-height, so he stands on the
              standing line rather than floating above it. 347x520 is the
              card-scale derivative's own size, so nothing is squashed. */}
          {cutout ? (
            <img src={cutout} width={253} height={380} alt="" />
          ) : null}
        </div>

        {/* The standing line. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: 22,
            borderTop: `1px solid ${TOKENS.ruleStructural}`,
            fontSize: 20,
            letterSpacing: 3,
            color: TOKENS.inkMuted,
          }}
        >
          <div>KEYNOTE SPEAKER · PODCASTER · AUTHOR</div>
          <div>DAMIANMASON.COM</div>
        </div>
      </div>
    ),
    {
      ...size,
      // No `fonts` key on purpose. next/og ships a bundled default face, so the
      // card renders with zero network access at build time. Fetching Bodoni or
      // Archivo from a CDN here would put a third-party request in the build.
    },
  );
}

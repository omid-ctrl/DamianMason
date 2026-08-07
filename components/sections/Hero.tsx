import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
  cx,
} from '@/components/ui';
import type { DisplaySize, HeadingLevel, HeadingSize, SectionDensity, Surface } from '@/components/ui';
import type { SectionActions } from './types';

export type HeroVariant = 'portrait' | 'band';

export type HeroImage = {
  src: string;
  /** Real alt text. If the photograph is purely atmospheric, pass an empty
   *  string and let the cutline carry the meaning. */
  alt: string;
  width: number;
  height: number;
  /**
   * The hero portrait is the only eager image on any page, so this defaults to
   * true. Set it false when a route puts a Hero below the fold.
   */
  priority?: boolean;
};

type HeroBase = {
  /**
   * portrait the type sits beside a 4:5 plate at the 0.30 veil, because a
   *          meeting planner is buying a person and has to see his face.
   * band     the image runs full-bleed behind reversed type at the 0.62 veil.
   */
  variant?: HeroVariant;
  /** Anchor target, and the stem of the heading id used by aria-labelledby. */
  id?: string;
  /** The mono running head. Never a substitute for the heading. */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Rank, independent of size. A hero is the page's one h1 unless a route
   *  genuinely needs otherwise. */
  level?: HeadingLevel;
  /**
   * The Didone only exists at --fs-4xl and above, which the type signature of
   * Heading enforces. `portrait` defaults to the full masthead step, `band`
   * one step down because the type is competing with a photograph.
   *
   * A step BELOW 4xl is legal here and it drops the title out of the Didone
   * into the serif, which is the only correct setting when the source gives a
   * band a sentence rather than a title. The guardrail is kept, not bypassed:
   * `display` is passed to Heading only for a size the Didone is allowed at.
   * See the note at the /meeting-coordinators/ media band.
   */
  titleSize?: DisplaySize | HeadingSize;
  /** The standfirst under the H1. A string is wrapped in a paragraph. */
  deck?: ReactNode;
  /** At most two. The first is rendered primary, which is the one filled
   *  orange field this viewport is allowed. */
  actions?: SectionActions;
  /** "FIG. 01", when the page carries more than one image. */
  cutlineFolio?: string;
  surface?: Surface;
  density?: SectionDensity;
  className?: string;
};

/**
 * The cutline is a standing structural slot, not an optional garnish. Every
 * photograph on this site is a <figure> with one, the hero included, so an
 * image cannot be passed without it. It is also where the dry humor lives:
 * state two true things next to each other and stop.
 */
export type HeroProps = HeroBase &
  (
    | { image: HeroImage; cutline: ReactNode }
    | { image?: undefined; cutline?: ReactNode }
  );

const DEFAULT_TITLE_SIZE: Record<HeroVariant, DisplaySize> = {
  portrait: '6xl',
  band: '5xl',
};

/** The three steps the Didone is permitted at, as a value, so the render can
 *  decide whether this title is a display line or a serif one. */
const DISPLAY_SIZES: DisplaySize[] = ['4xl', '5xl', '6xl'];

/** A band carries reversed type, so it defaults to the navy ground. */
const DEFAULT_SURFACE: Record<HeroVariant, Surface> = {
  portrait: 'page',
  band: 'deep',
};

function Deck({ deck }: { deck: ReactNode }) {
  return (
    <Prose lead measure="default">
      {typeof deck === 'string' ? <p>{deck}</p> : deck}
    </Prose>
  );
}

function Actions({ actions }: { actions: SectionActions }) {
  if (actions.length === 0) return null;
  return (
    <div className="dm-hero__actions">
      {actions.map((action, index) => (
        <Button
          key={action.href + action.label}
          href={action.href}
          variant={action.variant ?? (index === 0 ? 'primary' : 'secondary')}
          size="lg"
          rel={action.rel}
          target={action.target}
          aria-label={action['aria-label']}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function Cutline({ folio, children }: { folio?: string; children: ReactNode }) {
  return (
    <>
      {folio ? <span className="dm-figure__folio">{folio} </span> : null}
      {children}
    </>
  );
}

/**
 * The page-opening section, in two variants and no third.
 *
 * Orange budget: the primary action is the one filled orange field. If the
 * route also puts a stat ledger in the first viewport, its two plus glyphs
 * bring the total to three, which is the ceiling. Do not add a fourth.
 */
export function Hero(props: HeroProps) {
  const {
    variant = 'portrait',
    id,
    eyebrow,
    title,
    level = 1,
    titleSize,
    deck,
    actions = [] as const,
    image,
    cutline,
    cutlineFolio,
    surface,
    density,
    className,
  } = props;

  const size = titleSize ?? DEFAULT_TITLE_SIZE[variant];
  const headingId = id ? `${id}-title` : undefined;
  const band = variant === 'band';
  const isDisplay = DISPLAY_SIZES.includes(size as DisplaySize);

  const type = (
    // Full width at 390 and at 768, where a 7-column masthead H1 would ladder
    // into five lines and a 5-column plate would shrink the face to a stamp.
    // The two-up split starts at 1024, where both fit at full strength.
    <div
      className={cx(
        'dm-hero__type',
        band ? 'col-span-6 md:col-span-9' : 'col-span-6 md:col-span-12 lg:col-span-7',
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {isDisplay ? (
        <Heading
          level={level}
          display
          size={size as DisplaySize}
          id={headingId}
          className="dm-hero__title"
        >
          {title}
        </Heading>
      ) : (
        <Heading level={level} size={size} id={headingId} className="dm-hero__title">
          {title}
        </Heading>
      )}
      {deck ? <Deck deck={deck} /> : null}
      <Actions actions={actions} />
    </div>
  );

  return (
    <Section
      id={id}
      aria-labelledby={headingId}
      surface={surface ?? DEFAULT_SURFACE[variant]}
      density={density ?? (band ? 'loose' : 'default')}
      className={cx('dm-hero', band ? 'dm-hero--band' : 'dm-hero--portrait', className)}
    >
      <Container className={band ? 'dm-hero__inner' : undefined}>
        <div className="dm-grid12 dm-hero__grid">
          {type}

          {!band && image ? (
            <figure className="dm-figure dm-hero__figure col-span-6 md:col-span-12 lg:col-span-5">
              <div className="dm-photo dm-photo--portrait">
                <Image
                  className="dm-photo__img"
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority={image.priority ?? true}
                  /* `priority` and `fetchPriority` are two different things in
                     Next 16 and this element wants both. `priority` maps to
                     preload only (get-img-props.js), while the hint itself is a
                     separate prop, so without this line no <img> on the site
                     emits fetchpriority and lcp-discovery-insight scores 0 on
                     every route where an image is LCP. Measured on a production
                     build, adding it flips that audit to 1 and moves /keynote/
                     desktop LCP from 803ms to 712ms. */
                  fetchPriority="high"
                  sizes="(min-width: 48rem) 32rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <Cutline folio={cutlineFolio}>{cutline}</Cutline>
              </figcaption>
            </figure>
          ) : null}

          {/* A cutline with no photograph still earns its place: it is one of
              the three standing slots the dry humor lives in. */}
          {!image && cutline ? (
            <p
              className={cx(
                'dm-figure__caption',
                band ? 'col-span-6 md:col-span-9' : 'col-span-6 md:col-span-12 lg:col-span-5',
              )}
            >
              <Cutline folio={cutlineFolio}>{cutline}</Cutline>
            </p>
          ) : null}
        </div>
      </Container>

      {band && image ? (
        <figure className="dm-hero__figure--band">
          <div className="dm-hero__media dm-photo dm-photo--veil-band">
            <Image
              className="dm-photo__img"
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority={image.priority ?? true}
              /* Same pairing as the portrait above. The band photograph is the
                 LCP element on /acres-tv/ at mobile. */
              fetchPriority="high"
              sizes="100vw"
            />
            {/* The 0.62 veil handles the photograph. This handles the one thing
                a uniform veil cannot: a blown highlight sitting exactly under a
                line of reversed type. --surface-scrim exists for precisely this
                and it fades out before it touches the right of the frame. */}
            <span className="dm-hero__scrim" aria-hidden="true" />
          </div>
          <figcaption className="dm-hero__cutline--band">
            <span className="dm-figure__caption">
              <Cutline folio={cutlineFolio}>{cutline}</Cutline>
            </span>
          </figcaption>
        </figure>
      ) : null}
    </Section>
  );
}

export default Hero;

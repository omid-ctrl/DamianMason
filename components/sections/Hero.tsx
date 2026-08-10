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

export type HeroVariant = 'portrait' | 'band' | 'cutout';

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
  preload?: boolean;
  /**
   * Take the feature grade instead of the wash. The test is the FILE, not the
   * placement: shot on purpose, by a professional, at 2000px or better. A
   * broadcast frame grab in a hero is still a frame grab. DESIGN_SYSTEM 6.2.1.
   *
   * Ignored on `band`, where the 0.62 veil is computed for reversed type and
   * outranks it. The stylesheet enforces that rather than trusting source
   * order, so setting it there is a no-op and a defect in review.
   */
  feature?: boolean;
};

type HeroBase = {
  /**
   * portrait the type sits beside a 4:5 plate at the 0.30 veil, because a
   *          meeting planner is buying a person and has to see his face.
   * band     the image runs full-bleed behind reversed type at the 0.62 veil.
   * cutout   a transparent subject stands at full height beside the type, on
   *          no plate, with no crop and no veil, on a rule. It is the same
   *          argument as `portrait` made at twenty per cent more scale and at
   *          full chroma, and it is only available to a file with a real alpha
   *          channel. See .dm-hero--cutout in sections-core.css for why it
   *          takes none of .dm-photo.
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
  cutout: '6xl',
};

/** The steps the masthead voice is permitted at, as a value, so the render can
 *  decide whether this title is a display line or a serif one. 3xl joined the
 *  list when the Didone left: the old floor existed because a Didone sheds
 *  strokes below 40px, and a condensed gothic does not. */
const DISPLAY_SIZES: DisplaySize[] = ['3xl', '4xl', '5xl', '6xl'];

/** A band carries reversed type, so it defaults to the navy ground.
 *
 *  A cut-out stays on `page` and that is not a default so much as a
 *  requirement. The masthead ground is --surface-page in every scope it can
 *  appear in, so a hero continuing it is the only one with no seam under the
 *  wordmark. A cut-out on `deep` is wrong twice over: a charcoal jacket on navy
 *  loses the silhouette that is the entire point of a cut-out, and it puts
 *  reversed type in the first viewport of the flagship route. */
const DEFAULT_SURFACE: Record<HeroVariant, Surface> = {
  portrait: 'page',
  band: 'deep',
  cutout: 'page',
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
    surface,
    density,
    className,
  } = props;

  const size = titleSize ?? DEFAULT_TITLE_SIZE[variant];
  const headingId = id ? `${id}-title` : undefined;
  const band = variant === 'band';
  const cutout = variant === 'cutout';
  const preloadImage = image?.preload ?? true;
  /* A Hero speaks in the masthead voice only when it IS the page's H1.
     The size check alone was not the rule, it was a proxy for it that happened
     to hold: the one level-2 Hero on the site (the /meeting-coordinators/
     media band) is also the one with a non-display size, so nothing enforced
     the part that actually matters. Making rank explicit here means a future
     level-2 band cannot quietly become a second masthead by picking a bigger
     size, and it is what lets Heading's type gate narrow. */
  const isDisplay = level === 1 && DISPLAY_SIZES.includes(size as DisplaySize);

  const type = (
    // Full width at 390 and at 768, where a 7-column masthead H1 would ladder
    // into five lines and a 5-column plate would shrink the face to a stamp.
    // The two-up split starts at 1024, where both fit at full strength.
    <div
      className={cx(
        'dm-hero__type',
        band
          ? 'col-span-6 md:col-span-9'
          : /* The explicit lg placement is only on the cut-out, and it is
               required rather than tidy: its figure IS explicitly placed, and
               CSS sparse auto-placement will not put an auto-placed item on the
               same row as one that named its column. The track itself is
               unchanged at 7 of 12, so --fs-6xl-hero keeps the exact 708px at
               1440 and 535px at 1024 it was fitted against. */
            cx(
              'col-span-6 md:col-span-12 lg:col-span-7',
              cutout && 'lg:col-start-1 lg:row-start-1',
            ),
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
      className={cx(
        'dm-hero',
        band && 'dm-hero--band',
        cutout && 'dm-hero--cutout',
        !band && !cutout && 'dm-hero--portrait',
        className,
      )}
    >
      <Container className={band ? 'dm-hero__inner' : undefined}>
        <div className="dm-grid12 dm-hero__grid">
          {type}

          {cutout && image ? (
            <figure className="dm-figure dm-hero__figure--cutout col-span-6 md:col-span-12 lg:col-span-5 lg:col-start-8 lg:row-start-1">
              {/* THE CUTLINE COMES FIRST, and the HTML spec allows it:
                  <figcaption> may be the figure's first OR its last child. It
                  is first because from 1024 the picture runs to the section's
                  own bottom edge, so a caption after it would either sit
                  outside the section it belongs to or force the figure to stop
                  short of the rule it is standing on. At the head of the column
                  it sits level with the eyebrow and reads as a marginal note,
                  which is what a broadsheet cutline beside a masthead is.
                  Section 6.1 is satisfied either way: every photograph is a
                  <figure> with a cutline, and this is one. */}
              <figcaption className="dm-figure__caption">
                {cutline}
              </figcaption>
              <div className="dm-hero__cutout">
                <Image
                  className="dm-hero__cutout-img"
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  preload={preloadImage}
                  /* 31rem is --size-cutout-max-h times 2/3, the widest this
                     ever renders. */
                  sizes="(min-width: 64rem) 31rem, (min-width: 48rem) 22rem, 100vw"
                />
              </div>
            </figure>
          ) : null}

          {!band && !cutout && image ? (
            <figure className="dm-figure dm-hero__figure col-span-6 md:col-span-12 lg:col-span-5">
              <div
                className="dm-photo dm-photo--portrait"
                data-photo={image.feature ? 'feature' : undefined}
              >
                <Image
                  className="dm-photo__img"
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  preload={preloadImage}
                  sizes="(min-width: 48rem) 32rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                {cutline}
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
              {cutline}
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
              preload={preloadImage}
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
              {cutline}
            </span>
          </figcaption>
        </figure>
      ) : null}
    </Section>
  );
}

export default Hero;

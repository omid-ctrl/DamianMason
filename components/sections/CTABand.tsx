import type { ReactNode } from 'react';
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
  Stat,
  cx,
} from '@/components/ui';
import type { ContainerWidth, HeadingLevel, SectionDensity, Surface } from '@/components/ui';
import type { SectionActions } from './types';

/**
 * The optional side panel: one proof figure, on a navy-800 plate.
 *
 * The plus glyph measures 3.74:1 against that plate, which is short of the
 * 4.5:1 body-text floor and clear of the 3:1 large-text and non-text floor. It
 * renders at --fs-figure and it is aria-hidden, so it is legal on both counts.
 * Do not move a small orange letterform onto this ground.
 */
export type CTABandPanel = {
  eyebrow?: ReactNode;
  /** The figure and only the figure. */
  value: string;
  plus?: boolean;
  label: string;
  note?: ReactNode;
};

export type CTABandProps = {
  id?: string;
  eyebrow?: ReactNode;
  /** Required: every route closes on a specific ask, not a generic one. */
  heading: ReactNode;
  /** Rank, independent of size. Defaults to h2. */
  level?: HeadingLevel;
  /** The numbered prefix, e.g. "No. 07", rendered inside the heading. */
  folio?: string;
  copy?: ReactNode;
  /** At most two. The first is the one filled orange field in this viewport. */
  actions?: SectionActions;
  panel?: CTABandPanel;
  /** Deep by default. `deepest` when the band sits directly on the footer. */
  surface?: Surface;
  density?: SectionDensity;
  /**
   * The container the band's own content sits in. `max` on the seventeen
   * routes that lay out against the 12-column grid, which is why it is the
   * default and why nothing else passes this.
   *
   * The two blog posts are the exception and the reason this prop exists. They
   * set every other section in `text`, so the breadcrumb, the h1, the body, the
   * figures and the "More from the blog" heading all hang at x=400 at 1440,
   * and the band closing the page opened at x=96: a 304px jog at the foot of
   * an article whose whole layout is one narrow measure. A reader meets one
   * page at a time, so the page's axis wins over the site's.
   */
  containerWidth?: ContainerWidth;
  className?: string;
};

/**
 * The deep navy close. Every route ends in one.
 *
 * The ground is set with data-surface="deep" through Section, so ink, rules,
 * actions and the focus ring all remap. Nothing in this file writes a
 * light-on-dark value by hand, which is the entire reason the scope exists.
 */
export function CTABand({
  id,
  eyebrow,
  heading,
  level = 2,
  folio,
  copy,
  actions = [] as const,
  panel,
  surface = 'deep',
  density,
  containerWidth = 'max',
  className,
}: CTABandProps) {
  const headingId = id ? `${id}-title` : undefined;

  /* The buttons, rendered in one of two slots.
     With a panel they close the body column, beside the proof plate.
     Without one they hang off the section-close hairline below, which is the
     only way the band declares its full width when nothing occupies the right
     of the grid. See .dm-ctaband__grid--solo. */
  const actionsRow =
    actions.length > 0 ? (
      <div className="dm-ctaband__actions">
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
    ) : null;

  return (
    <Section
      id={id}
      aria-labelledby={headingId}
      surface={surface}
      density={density}
      className={cx('dm-ctaband', className)}
    >
      <Container width={containerWidth}>
        {/* Every route ends in one of these, so this is the reveal that every
            route gets. The ask and the proof panel arrive one beat apart. */}
        <div
          className={cx('dm-grid12 dm-ctaband__grid', !panel && 'dm-ctaband__grid--solo')}
          data-reveal="stagger"
        >
          {/* The panelled split waits for lg, not md. At md (48rem) the panel's
              5-column track is 293px while the stat plate's own content floors
              it at 322px, so `justify-self: end` pushed its left edge 15px back
              into the body's column and painted the plate over the paragraph,
              clipping words mid-character. Measured on /meeting-coordinators/
              at 768: panel x=414..736 against a paragraph running x=32..429.
              Below lg the two stack full width, which is the convention the
              rest of the site already uses for a body-and-plate pair. */}
          <div
            className={cx(
              'dm-ctaband__body',
              panel ? 'col-span-6 md:col-span-12 lg:col-span-7' : 'col-span-6 md:col-span-8',
            )}
          >
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <Heading level={level} size="3xl" folio={folio} id={headingId}>
              {heading}
            </Heading>
            {copy ? (
              <Prose>{typeof copy === 'string' ? <p>{copy}</p> : copy}</Prose>
            ) : null}
            {panel ? actionsRow : null}
          </div>

          {panel ? (
            <Card
              variant="plate"
              className="dm-ctaband__panel col-span-6 md:col-span-12 lg:col-span-5"
            >
              {panel.eyebrow ? <Eyebrow>{panel.eyebrow}</Eyebrow> : null}
              <Stat value={panel.value} plus={panel.plus} label={panel.label} note={panel.note} />
            </Card>
          ) : null}

          {!panel && actionsRow ? (
            <div className="dm-section-close dm-ctaband__close col-span-6 md:col-span-12">
              {actionsRow}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export default CTABand;

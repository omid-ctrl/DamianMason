import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Every step of the scale, so a heading's rank and its size stay independent. */
export type HeadingSize =
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

/**
 * The sizes the masthead voice is allowed at.
 *
 * This gate used to exist for legibility: the Didone it was written for shed
 * strokes below --fs-4xl because its hairlines fall under one device pixel at
 * 1x. A condensed gothic has no hairlines to lose, so that reason is gone.
 *
 * The gate is NOT gone, because it was quietly doing a second job that has
 * nothing to do with rasterisation: it is the only thing preventing the
 * masthead voice from reaching the section-head step and flattening the
 * ladder. So the floor drops one step, to 3xl, and stops at 3xl rather than
 * disappearing, because 2xl IS the section H2 step.
 *
 * What relaxing it buys, concretely: the /meeting-coordinators/ media band was
 * forced out of the display face because an 89-character sentence at 4xl ran
 * eight lines and 40% of the viewport at 390. In a face 18% narrower it fits
 * at 3xl, and it gets its rank back.
 */
export type DisplaySize = Extract<HeadingSize, '3xl' | '4xl' | '5xl' | '6xl'>;

/** Full class strings, never built by template literal, so Tailwind's scanner
 *  actually sees them. */
const SIZE_CLASS: Record<HeadingSize, string> = {
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
};

type HeadingBase = {
  level: HeadingLevel;
  /** Sets the heading in the wordmark navy rather than the body ink. */
  brand?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'h2'>, 'className' | 'children'>;

/**
 * `display: true` additionally requires `level: 1`.
 *
 * The size floor stops the masthead voice colliding with the section-head
 * step; this stops it appearing twice on a page. "The masthead voice is the
 * page's own name for itself" is only true if exactly one element per document
 * gets to speak in it, and nothing else in the system enforced that.
 *
 * It costs nothing today: every existing `display` call site is already
 * level 1. The one `level={2}` Hero on the site, the /meeting-coordinators/
 * band, is already non-display.
 */
export type HeadingProps = HeadingBase &
  (
    | { display: true; level: 1; size: DisplaySize }
    | { display?: false; size?: HeadingSize }
  );

export function Heading(props: HeadingProps) {
  const { level, brand = false, className, children, ...rest } = props;
  const display = props.display === true;
  const size = props.size ?? '2xl';
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  // `display` and `size` are part of the union, not valid DOM attributes.
  const domProps = { ...rest } as Omit<HeadingBase, 'level' | 'brand' | 'className' | 'children'>;
  delete (domProps as Record<string, unknown>).display;
  delete (domProps as Record<string, unknown>).size;

  return (
    <Tag
      className={cx(
        display ? 'dm-display' : 'dm-heading',
        SIZE_CLASS[size],
        brand && (display ? 'dm-display--brand' : 'dm-heading--brand'),
        className,
      )}
      {...domProps}
    >
      {children}
    </Tag>
  );
}

export default Heading;

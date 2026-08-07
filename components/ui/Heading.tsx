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
 * The only sizes the Didone is allowed at. Below --fs-4xl its hairlines fall
 * under one device pixel at 1x and the glyphs shed strokes, which is exactly
 * what destroyed the proof figures in the original comp. The type system is
 * the guardrail: `display` cannot be combined with a smaller size.
 */
export type DisplaySize = Extract<HeadingSize, '4xl' | '5xl' | '6xl'>;

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
  /**
   * The numbered prefix from the broadsheet section-head pattern, for example
   * "No. 01". It renders inside the heading element so the document outline
   * carries it, and it is read aloud. It is not a decorative folio.
   */
  folio?: string;
  /** Sets the heading in the wordmark navy rather than the body ink. */
  brand?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'h2'>, 'className' | 'children'>;

export type HeadingProps = HeadingBase &
  (
    | { display: true; size: DisplaySize }
    | { display?: false; size?: HeadingSize }
  );

export function Heading(props: HeadingProps) {
  const { level, folio, brand = false, className, children, ...rest } = props;
  const display = props.display === true;
  const size = props.size ?? '2xl';
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  // `display` and `size` are part of the union, not valid DOM attributes.
  const domProps = { ...rest } as Omit<HeadingBase, 'level' | 'folio' | 'brand' | 'className' | 'children'>;
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
      {folio ? <span className="dm-heading__folio">{folio}</span> : null}
      {children}
    </Tag>
  );
}

export default Heading;

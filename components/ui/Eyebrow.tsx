import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type EyebrowTone = 'muted' | 'accent' | 'brand' | 'faint';

export type EyebrowProps = {
  /**
   * muted  the default. 5.74:1 on bone, so it is legal as real content.
   * accent the deepened print orange, 5.63:1. For a section number or a folio.
   * brand  the wordmark navy, 7.56:1.
   * faint  3.89:1. Decorative indices only, and pair it with aria-hidden.
   */
  tone?: EyebrowTone;
  /** Renders inline, for a running head that sits beside a rule. */
  inline?: boolean;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'span'>, 'className' | 'children'>;

const TONE_CLASS: Record<EyebrowTone, string> = {
  muted: '',
  accent: 'dm-eyebrow--accent',
  brand: 'dm-eyebrow--brand',
  faint: 'dm-eyebrow--faint',
};

/**
 * The mono running head, dateline, folio and section label. This is one of the
 * three standing slots the dry humor lives in, alongside the photo cutline and
 * the section metadata. Write two true things next to each other and stop.
 *
 * Never a substitute for a heading. If it is naming a section, the section
 * still needs a real <h2> under it.
 */
export function Eyebrow({
  tone = 'muted',
  inline = false,
  as: Tag = 'span',
  className,
  children,
  ...rest
}: EyebrowProps) {
  return (
    <Tag
      className={cx('dm-eyebrow', TONE_CLASS[tone], inline && 'dm-eyebrow--inline', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Eyebrow;

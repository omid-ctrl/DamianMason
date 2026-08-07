import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type QuoteProps = {
  /** The quoted text, without the quotation marks. The component sets them. */
  children: ReactNode;
  /** "Amy B., AgroLiquid" or "Amy B., AgroLiquid, client since 2019". */
  attribution?: ReactNode;
  /** Adds the orange bar on the leading edge. Counts against the orange
   *  budget, so at most one per viewport. */
  barred?: boolean;
  /** Relaxes the measure from 28ch to 46ch, for a testimonial long enough that
   *  28ch would ladder it into six lines. */
  wide?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'figure'>, 'className' | 'children'>;

/**
 * Set at --fs-xl, exactly one step BELOW a section heading at --fs-2xl. A pull
 * quote never outranks the heading it sits under. That inversion is the single
 * defect that got direction 3 marked down and it does not come back.
 */
export function Quote({
  children,
  attribution,
  barred = false,
  wide = false,
  className,
  ...rest
}: QuoteProps) {
  /**
   * A `<figure>` exists to bind a caption to its content. An unattributed
   * quote has no caption, so the figure would enter the accessibility tree as
   * a nameless "figure" group wrapping a blockquote that already carries the
   * meaning: pure announcement noise. Same box, same classes, neutral element.
   */
  const Wrapper = attribution ? 'figure' : 'div';

  return (
    <Wrapper className={cx('dm-quote', barred && 'dm-quote--barred', className)} {...rest}>
      <blockquote className={cx('dm-quote__body', wide && 'dm-quote__body--wide')}>
        {'“'}
        {children}
        {'”'}
      </blockquote>
      {attribution ? (
        <figcaption className="dm-quote__attribution">{attribution}</figcaption>
      ) : null}
    </Wrapper>
  );
}

export default Quote;

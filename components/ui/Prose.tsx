import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type ProseMeasure = 'default' | 'narrow' | 'wide' | 'full';

export type ProseProps = {
  /**
   * default 66ch. Running text, dead centre of the readable band.
   * narrow  46ch. Sidebars, cutlines, footnotes, stat notes.
   * wide    76ch. The absolute ceiling, for a two-up editorial block only.
   * full    no cap. Only when a parent grid column is already doing the job.
   *
   * There is no multi-column variant and there will not be one. CSS
   * multicolumn forces the reader to the bottom of column one and back up to
   * the top of column two, which is unusable at 1,200 words.
   */
  measure?: ProseMeasure;
  /** Larger, lighter opening paragraph. One per page. */
  lead?: boolean;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;

const MEASURE_CLASS: Record<ProseMeasure, string> = {
  default: '',
  narrow: 'dm-prose--narrow',
  wide: 'dm-prose--wide',
  full: 'dm-prose--full',
};

export function Prose({
  measure = 'default',
  lead = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: ProseProps) {
  return (
    <Tag
      className={cx('dm-prose', MEASURE_CLASS[measure], lead && 'dm-prose--lead', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Prose;

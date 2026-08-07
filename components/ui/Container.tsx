import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type ContainerWidth = 'max' | 'wide' | 'narrow' | 'text';

export type ContainerProps = {
  /**
   * max    84rem (1344 CSS pixels), the broadsheet width. The default, and what a section grid uses.
   * wide   96rem, for the client wall and full-bleed-adjacent bands.
   * narrow 56rem, for a single-column list or a FAQ.
   * text   46rem, for a blog post or a legal page.
   */
  width?: ContainerWidth;
  /** Drops the gutter, for a child that manages its own inline padding. */
  flush?: boolean;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;

const WIDTH_CLASS: Record<ContainerWidth, string> = {
  max: '',
  wide: 'dm-container--wide',
  narrow: 'dm-container--narrow',
  text: 'dm-container--text',
};

export function Container({
  width = 'max',
  flush = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cx('dm-container', WIDTH_CLASS[width], flush && 'dm-container--flush', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Container;

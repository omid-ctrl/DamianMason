import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type CardVariant = 'raised' | 'bright' | 'ruled' | 'plate';

export type CardProps = {
  /**
   * raised the default. A light card with a hairline border.
   * bright the whitest surface in the system. Logo cells, form panels.
   * ruled  no box at all: a 2 unit rule across the top and nothing else. This is
   *        the broadsheet default for an episode row, a press item or a list.
   * plate  the ground a photograph sits on, so a transparent or short image
   *        never leaves a hole.
   */
  variant?: CardVariant;
  /** Removes the padding, for a card whose first child is a full-bleed image. */
  flush?: boolean;
  /** Adds a hover ground. Only for a card that is entirely a link. */
  interactive?: boolean;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;

const VARIANT_CLASS: Record<CardVariant, string> = {
  raised: '',
  bright: 'dm-card--bright',
  ruled: 'dm-card--ruled',
  plate: 'dm-card--plate',
};

export function Card({
  variant = 'raised',
  flush = false,
  interactive = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cx(
        'dm-card',
        VARIANT_CLASS[variant],
        flush && 'dm-card--flush',
        interactive && 'dm-card--interactive',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Card;

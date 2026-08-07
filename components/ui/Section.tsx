import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

/**
 * The grounds the system knows about. Setting `surface` writes the matching
 * `data-surface` attribute, which remaps every ink, rule, action, form and
 * media token inside the subtree. Nothing below a Section ever needs a
 * light-on-dark override.
 *
 * page     cool stone. The default, and where most routes live.
 * sunken   the sage band one step darker, for alternating rhythm.
 * deep     full-bleed navy. The CTA band, the podcast band, the footer lead-in.
 * deepest  the footer plane sitting under a deep band.
 * forest   full-bleed green. The second dark ground, so a long page alternates
 *          light, sage, navy, light, GREEN rather than resolving every dark band
 *          to the same navy.
 * paper    a light plate INSIDE a dark section. Also how the wordmark appears in
 *          a navy or forest region, because the wordmark never reverses to white
 *          and never sits on the green.
 */
export type Surface = 'page' | 'sunken' | 'deep' | 'deepest' | 'forest' | 'paper';

export type SectionDensity = 'default' | 'tight' | 'loose' | 'flush';

export type SectionProps = {
  surface?: Surface;
  density?: SectionDensity;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'section'>, 'className' | 'children'>;

const DENSITY_CLASS: Record<SectionDensity, string> = {
  default: '',
  tight: 'dm-section--tight',
  loose: 'dm-section--loose',
  flush: 'dm-section--flush',
};

export function Section({
  surface = 'page',
  density = 'default',
  as: Tag = 'section',
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag
      data-surface={surface === 'page' ? undefined : surface}
      className={cx('dm-section', DENSITY_CLASS[density], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Section;

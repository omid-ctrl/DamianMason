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
 * deep-alt the second navy register, one step lighter in the grounds and
 *          identical in the ink. Every route closes on `deep`, so a dark band
 *          earlier in the page has to be a step off that one or the close stops
 *          reading as an arrival.
 * deepest  the footer plane sitting under a deep band.
 * forest   full-bleed green. The second dark ground, so a long page alternates
 *          light, sage, navy, light, GREEN rather than resolving every dark band
 *          to the same navy.
 * paper    a light plate INSIDE a dark section. Also how the wordmark appears in
 *          a navy or forest region, because the wordmark never reverses to white
 *          and never sits on the green.
 */
export type Surface = 'page' | 'sunken' | 'deep' | 'deep-alt' | 'deepest' | 'forest' | 'paper';

export type SectionDensity = 'default' | 'tight' | 'loose' | 'flush';

export type SectionProps = {
  surface?: Surface;
  density?: SectionDensity;
  /**
   * The section above this one is on the same ground. Drops this section's own
   * block-start interval, so the pair reads as one band with a break in it
   * rather than as two bands with a hole between them.
   *
   * OPT-IN, NOT A SIBLING SELECTOR. `[data-surface="sunken"] + [data-surface="sunken"]`
   * expresses this in one rule and then silently changes every route that
   * already abuts, which on this site is five of them. A prop is greppable, it
   * is decided per placement, and it cannot act at a distance.
   */
  seam?: boolean;
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
  seam = false,
  as: Tag = 'section',
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag
      data-surface={surface === 'page' ? undefined : surface}
      className={cx('dm-section', DENSITY_CLASS[density], seam && 'dm-section--seam', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Section;

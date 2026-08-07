import type { ReactNode } from 'react';
import { sponsors } from '@/content/sponsors';
import { cx } from '@/components/ui';
import type { HeadingLevel, SectionDensity, Surface } from '@/components/ui';
import { LogoWall } from './LogoWall';
import type { LogoItem } from './types';

export type SponsorItem = {
  name: string;
  logo: string;
  width: number;
  height: number;
  /** Missing or empty renders an unlinked cell. A dead link is worse than no
   *  link, and the old site had six of them in the footer alone. */
  url?: string;
};

export type SponsorWallProps = {
  /** Defaults to the 10 normalized podcast sponsor marks. */
  items?: SponsorItem[];
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  level?: HeadingLevel;
  folio?: string;
  /** The mono metadata line. Pass null to drop it. */
  meta?: ReactNode;
  intro?: ReactNode;
  surface?: Surface;
  density?: SectionDensity;
  className?: string;
};

/**
 * The podcast sponsor wall. Net new: on the old site these ten companies were
 * plain text links with no artwork at all.
 *
 * Same normalization engine as the client wall, so a 132 by 132 square and an
 * 800 by 205 banner land at the same optical weight. Two differences: the
 * column count is 5 and 2, the only counts that divide 10 with no dead cells,
 * and every mark that has a URL is a cell-sized link that opens off site with
 * rel="noopener noreferrer".
 */
export function SponsorWall({
  items,
  eyebrow = 'The Business of Agriculture',
  title = 'Podcast sponsors',
  meta,
  className,
  ...rest
}: SponsorWallProps) {
  const marks: LogoItem[] = (items ?? sponsors).map((sponsor) => ({
    name: sponsor.name,
    logo: sponsor.logo,
    width: sponsor.width,
    height: sponsor.height,
    url: sponsor.url ? sponsor.url : undefined,
  }));

  const metaLine = meta !== undefined ? meta : `${marks.length} sponsors, 40,000+ listeners a month`;

  return (
    <LogoWall
      {...rest}
      items={marks}
      columns={5}
      linked
      eyebrow={eyebrow}
      title={title}
      meta={metaLine}
      className={cx('dm-sponsorwall', className)}
    />
  );
}

export default SponsorWall;

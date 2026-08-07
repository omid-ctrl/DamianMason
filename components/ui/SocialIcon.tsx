import type { ReactNode, SVGProps } from 'react';
import type { SocialLink } from '@/content/site';
import { cx } from './cx';

/**
 * The icon key is taken straight off the SocialLink type in content/site.ts, so
 * adding a profile there and forgetting the glyph here is a type error rather
 * than a silently missing icon.
 */
export type SocialIconName = SocialLink['icon'];

export type SocialIconProps = {
  name: SocialIconName;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, 'className' | 'name'>;

/**
 * Every glyph is drawn on a 24 unit grid out of primitives whose fill is
 * unambiguous: separate filled subpaths where shapes overlap, and an explicit
 * evenodd rule where a shape has to be knocked out of another. Nothing here
 * depends on subpath winding order resolving the way a copied path string
 * happened to be authored.
 *
 * The SVG carries no color of its own. It inherits currentColor from the link
 * that wraps it, which is how the same icon works in the bone scope and in the
 * deep scope with no second stylesheet.
 */
const GLYPH: Record<SocialIconName, ReactNode> = {
  facebook: (
    <path d="M13.55 21.75V13.6h3.05l.45-3.5h-3.5V7.85c0-1.01.28-1.7 1.73-1.7h1.87V3.02c-.32-.04-1.43-.14-2.72-.14-2.69 0-4.53 1.64-4.53 4.65v2.57H6.8v3.5h3.05v8.15Z" />
  ),
  x: (
    <>
      {/* Two crossing bars as separate filled paths. Same winding, no counter. */}
      <path d="M3.2 2.4h3.55L20.8 21.6h-3.55Z" />
      <path d="M17.25 2.4h3.55L6.75 21.6H3.2Z" />
    </>
  ),
  linkedin: (
    <>
      <circle cx="4.53" cy="4.6" r="2.23" />
      <path d="M2.6 8.6h3.85v12.8H2.6Z" />
      <path d="M8.9 8.6h3.69v1.75h.05c.51-.97 1.77-2 3.64-2 3.89 0 4.61 2.56 4.61 5.89v7.16h-3.85v-6.35c0-1.51-.03-3.46-2.11-3.46-2.11 0-2.43 1.65-2.43 3.35v6.46H8.9Z" />
    </>
  ),
  youtube: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 4.6h14a3 3 0 0 1 3 3v8.8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7.6a3 3 0 0 1 3-3Zm5.1 3.9v7L16 12Z"
    />
  ),
  instagram: (
    <>
      <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
        <rect x="2.95" y="2.95" width="18.1" height="18.1" rx="5.1" />
        <circle cx="12" cy="12" r="4.2" />
      </g>
      <circle cx="17.45" cy="6.55" r="1.25" />
    </>
  ),
};

/**
 * The glyph is decoration: it is marked aria-hidden and removed from the tab
 * order, and the link that wraps it carries the accessible name. An icon that
 * announces itself twice is worse than an icon that does not announce at all.
 */
export function SocialIcon({ name, className, ...rest }: SocialIconProps) {
  return (
    <svg
      className={cx('dm-social-icon', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {GLYPH[name]}
    </svg>
  );
}

export default SocialIcon;

import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { Heading, cx } from '@/components/ui';
import { footerOnlyNav, nav, type NavItem } from '@/content/site';
import { hubChildren } from './navRoutes';

export type FooterNavProps = {
  className?: string;
} & Omit<ComponentPropsWithoutRef<'nav'>, 'className'>;

type FooterNavGroup = {
  label: string;
  /** Absent on the group that collects the top-level items with no children. */
  href?: string;
  items: NavItem[];
};

const hasChildren = (item: NavItem): boolean => (item.children?.length ?? 0) > 0;

/**
 * The main columns are derived from the same `nav` tree the header reads, so
 * the footer cannot drift from the header the way the old one did. Its "The
 * Business of Ag" was the header's "The Business of Agriculture", and all six
 * of its links pointed at a staging host with unrewritten query URLs.
 *
 * Submenus come from the same hubChildren helper the header dropdown uses, so
 * the two chrome regions cannot disagree about what is under a hub. It drops a
 * child that resolves to its own parent's route: the Media group ships one on
 * the live site, a submenu item labelled "Media" under a parent labelled
 * "Media", both landing on /blog-news/.
 *
 * `footerOnlyNav` adds library destinations to the existing "More" register
 * without widening the desktop masthead. It remains content data rather than
 * component markup, and this is its only rendering path.
 */
function buildGroups(): FooterNavGroup[] {
  const parents: FooterNavGroup[] = nav.filter(hasChildren).map((parent) => ({
    label: parent.label,
    href: parent.href,
    items: hubChildren(parent),
  }));

  const standalone = [...nav.filter((item) => !hasChildren(item)), ...footerOnlyNav];

  return standalone.length > 0
    ? [...parents, { label: 'More', items: standalone }]
    : parents;
}

/**
 * A real <nav> landmark with a real heading over every column. The old footer
 * had neither: both link lists were bare <ul>s inside generic widget divs.
 */
export function FooterNav({ className, ...rest }: FooterNavProps) {
  const groups = buildGroups();

  return (
    <nav className={cx('dm-footer__nav', className)} aria-label="Footer" {...rest}>
      <ul className="dm-grid12 dm-footer__nav-groups">
        {/* Two across on the 6-column mobile grid and on the 12-column grid up
            to 1024, four across above it, all from the one shared grid. */}
        {groups.map((group) => (
          <li
            key={group.label}
            className="col-span-3 md:col-span-6 lg:col-span-3 dm-footer__nav-group"
          >
            <Heading level={2} size="md" className="dm-footer__nav-title">
              {group.href ? (
                <Link className="dm-footer__nav-title-link dm-link-bare" href={group.href}>
                  {group.label}
                </Link>
              ) : (
                group.label
              )}
            </Heading>

            <ul className="dm-footer__nav-list">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link className="dm-footer__link dm-link-bare" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default FooterNav;

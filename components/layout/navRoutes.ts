import type { NavItem } from '@/content/site';

/**
 * Route helpers shared by the desktop nav and the mobile sheet. Pure functions,
 * no React, so both a server and a client module can import them.
 */

/**
 * `trailingSlash: true` is set in next.config.ts, so `usePathname()` returns
 * `/keynote/` and the hrefs in content/site.ts carry the same slash. Comparing
 * normalized values anyway means a future config change cannot silently break
 * `aria-current`.
 */
export function normalizeRoute(href: string): string {
  const path = href.split('#')[0].split('?')[0].toLowerCase();
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** True when this href is the page the reader is on. */
export function isCurrentRoute(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return normalizeRoute(pathname) === normalizeRoute(href);
}

/**
 * The submenu as it should render.
 *
 * The old header's Media dropdown repeated its own parent: a child labelled
 * "Media" pointing at `/blog-news/`, which is the same route the parent hub
 * resolves to. A child that lands on its parent's route is a dead entry, so it
 * is dropped here by route rather than special cased by label. Nothing is lost:
 * the parent is a real link to that hub.
 */
export function hubChildren(item: NavItem): NavItem[] {
  const parent = normalizeRoute(item.href);
  return (item.children ?? []).filter((child) => normalizeRoute(child.href) !== parent);
}

/** True when the current page sits under this hub, parent included. */
export function containsCurrentRoute(pathname: string | null, item: NavItem): boolean {
  if (!pathname) return false;
  if (isCurrentRoute(pathname, item.href)) return true;
  return hubChildren(item).some((child) => isCurrentRoute(pathname, child.href));
}

import type { MetadataRoute } from 'next';

import manifest from '@/_source/manifest.json';
import { canonicalUrl } from '@/lib/seo';

/**
 * The sitemap is generated from `_source/manifest.json`'s `routeMap`, which is
 * the same object the redirect map and the page pipeline read. Adding a route
 * there puts it in the sitemap; there is no second list to forget to update.
 *
 * The old site had no sitemap at all beyond the Yoast default, which indexed
 * the WooCommerce cart, checkout and four product pages. Commerce is gone, so
 * those paths are filtered out below as a standing guard rather than trusted
 * to stay absent.
 */

const REMOVED_CONTENT_ROUTES = ['/blog/', '/blog/[slug]'] as const;

/** Anything the store used to own. None of it comes back. */
const REMOVED_COMMERCE_PREFIXES = [
  '/shop',
  '/cart',
  '/checkout',
  '/my-account',
  '/product/',
  '/product-category/',
  '/damian-mason-online-shop',
] as const;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
type RouteWeight = { changeFrequency: ChangeFrequency; priority: number };

const DEFAULT_WEIGHT: RouteWeight = { changeFrequency: 'monthly', priority: 0.7 };

/**
 * Priority is a hint about relative importance within this site, nothing more.
 * The two routes that earn money, booking and the keynote program, sit at the
 * top with the home page.
 */
const ROUTE_WEIGHTS: Record<string, RouteWeight> = {
  '/': { changeFrequency: 'weekly', priority: 1 },
  '/keynote/': { changeFrequency: 'monthly', priority: 0.9 },
  '/contact-us/': { changeFrequency: 'yearly', priority: 0.9 },
  '/speaking/': { changeFrequency: 'monthly', priority: 0.9 },
  /* Booking-critical, and the page a meeting planner is most likely to send to
     somebody else, so it sits with the other three that earn money. Yearly,
     because the facts on it are a thirty-year record and a phone number. */
  '/speaker-one-sheet/': { changeFrequency: 'yearly', priority: 0.9 },
  '/about/': { changeFrequency: 'monthly', priority: 0.8 },
  '/reviews/': { changeFrequency: 'monthly', priority: 0.8 },
  '/boasg/': { changeFrequency: 'monthly', priority: 0.8 },
  '/the-business-of-agriculture/': { changeFrequency: 'weekly', priority: 0.8 },
  '/podcasts/': { changeFrequency: 'monthly', priority: 0.7 },
  '/blog-news/': { changeFrequency: 'weekly', priority: 0.7 },
  '/collaboration-opportunities/': { changeFrequency: 'monthly', priority: 0.9 },
  '/privacy/': { changeFrequency: 'yearly', priority: 0.4 },
  '/join-the-conversation/': { changeFrequency: 'yearly', priority: 0.6 },
};

function isCommerceRoute(route: string): boolean {
  return REMOVED_COMMERCE_PREFIXES.some(
    (prefix) => route === prefix || route === `${prefix}/` || route.startsWith(prefix),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routeMap: Record<string, { from: string[]; note: string }> = manifest.routeMap;

  // The crawl date, not the build date. Stamping every URL with `new Date()`
  // would tell a crawler the whole site changed on every deploy.
  const lastModified = new Date(manifest.crawledAt);

  const staticRoutes = [...Object.keys(routeMap), '/privacy/']
    .filter((route, index, routes) => routes.indexOf(route) === index)
    .filter((route) => !REMOVED_CONTENT_ROUTES.includes(route as (typeof REMOVED_CONTENT_ROUTES)[number]))
    .filter((route) => !route.includes('['))
    .filter((route) => !isCommerceRoute(route));

  return staticRoutes.map((route) => {
    const weight = ROUTE_WEIGHTS[route] ?? DEFAULT_WEIGHT;
    return {
      url: canonicalUrl(route),
      lastModified,
      changeFrequency: weight.changeFrequency,
      priority: weight.priority,
    };
  });
}

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

/** `routeMap` keys are route patterns, not URLs. `/blog/[slug]` is expanded. */
const BLOG_POST_ROUTE = '/blog/[slug]';

/**
 * The two posts, in the order the manifest lists their source slugs. The first
 * shipped on WordPress's default `hello-world` slug and is re-slugged here; the
 * matching 301s live in `next.config.ts`.
 */
const BLOG_POST_SLUGS = [
  'eggflation-gives-producers-record-profits',
  'how-the-climate-crisis-is-causing-food-shortages-globally',
] as const;

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
  '/blog/': { changeFrequency: 'weekly', priority: 0.7 },
  '/join-the-conversation/': { changeFrequency: 'yearly', priority: 0.6 },
};

const BLOG_POST_WEIGHT: RouteWeight = { changeFrequency: 'yearly', priority: 0.5 };

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

  const postSourceCount = routeMap[BLOG_POST_ROUTE]?.from.length ?? 0;
  if (postSourceCount !== BLOG_POST_SLUGS.length) {
    throw new Error(
      `Sitemap drift: _source/manifest.json lists ${postSourceCount} source posts for "${BLOG_POST_ROUTE}" but app/sitemap.ts declares ${BLOG_POST_SLUGS.length} slugs. Update BLOG_POST_SLUGS in app/sitemap.ts.`,
    );
  }

  const staticRoutes = Object.keys(routeMap)
    .filter((route) => route !== BLOG_POST_ROUTE)
    .filter((route) => !route.includes('['))
    .filter((route) => !isCommerceRoute(route));

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const weight = ROUTE_WEIGHTS[route] ?? DEFAULT_WEIGHT;
    return {
      url: canonicalUrl(route),
      lastModified,
      changeFrequency: weight.changeFrequency,
      priority: weight.priority,
    };
  });

  for (const slug of BLOG_POST_SLUGS) {
    entries.push({
      url: canonicalUrl(`/blog/${slug}/`),
      lastModified,
      changeFrequency: BLOG_POST_WEIGHT.changeFrequency,
      priority: BLOG_POST_WEIGHT.priority,
    });
  }

  return entries;
}

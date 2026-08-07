import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

/**
 * Everything is crawlable.
 *
 * The old robots.txt carried the WooCommerce boilerplate: Disallow /cart/,
 * /checkout/, /my-account/ and /wp-admin/. The store is gone and there is no
 * wp-admin, so none of it is carried over. There is nothing on this site a
 * crawler should not see.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    // No trailing slash: the Host directive takes an origin, not a URL path.
    host: site.url,
  };
}

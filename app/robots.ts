import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { shouldPreventIndexing } from '@/lib/seo';

/**
 * Review deployments are blocked at this route as well as by page metadata
 * and the X-Robots-Tag response header. A Vercel release becomes crawlable
 * only when SITE_ALLOW_INDEXING=true is set for the approved domain cutover.
 *
 * The old robots.txt carried the WooCommerce boilerplate: Disallow /cart/,
 * /checkout/, /my-account/ and /wp-admin/. The store is gone and there is no
 * wp-admin, so none of it is carried over. There is nothing on this site a
 * crawler should not see.
 */
export default function robots(): MetadataRoute.Robots {
  if (shouldPreventIndexing()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

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

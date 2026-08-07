import type { NextConfig } from 'next';

/**
 * Every URL the old WordPress site had indexed either still resolves or 301s
 * somewhere sensible. Commerce is gone, so the shop funnel points at the books
 * section of /about/, which is where the titles now live as credibility.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Commerce removed: the client is not selling books moving forward.
      { source: '/shop', destination: '/about/#books', permanent: true },
      { source: '/damian-mason-online-shop', destination: '/about/#books', permanent: true },
      { source: '/cart', destination: '/about/#books', permanent: true },
      { source: '/checkout', destination: '/about/#books', permanent: true },
      { source: '/my-account', destination: '/about/#books', permanent: true },
      // The BOASG "product" was a membership, not a book. Specific rule must be
      // declared before the /product/* wildcard so it wins.
      { source: '/product/business-of-ag-success-group', destination: '/boasg/', permanent: true },
      { source: '/product/:slug*', destination: '/about/#books', permanent: true },
      { source: '/product-category/:slug*', destination: '/about/#books', permanent: true },

      // Orphaned podcast stub now resolves to the real hub.
      { source: '/podcast-2', destination: '/podcasts/', permanent: true },

      // Two newsletter routes collapsed into one.
      { source: '/join-mailing-list', destination: '/join-the-conversation/', permanent: true },

      // Both posts move under /blog/. The first shipped on WordPress's default
      // slug and was never renamed.
      {
        source: '/hello-world',
        destination: '/blog/eggflation-gives-producers-record-profits/',
        permanent: true,
      },
      {
        source: '/how-the-climate-crisis-is-causing-food-shortages-globally',
        destination: '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

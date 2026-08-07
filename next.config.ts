import type { NextConfig } from 'next';

/**
 * Set by `npm run build:qa`. Empty for a normal build, a normal dev server and
 * every deploy, so the stock `.next` is what ships.
 */
const qaDistDir = process.env.NEXT_DIST_DIR;

/**
 * Every URL the old WordPress site had indexed either still resolves or 301s
 * somewhere sensible. Commerce is gone, so the shop funnel points at the books
 * section of /about/, which is where the titles now live as credibility.
 */
const nextConfig: NextConfig = {
  /**
   * A build and a dev server may not share one output directory. Turbopack
   * keeps a persistent cache under it, and a `next build` run while `next dev`
   * is writing the same directory corrupts that cache: the build then dies
   * before compiling anything, with "Failed to open database / Loading
   * persistence directory failed / invalid digit found in string", and the only
   * cure is deleting the directory, which takes the dev server down with it.
   * That is exactly what happened during QA, where the brief's claim that
   * `next build` was clean could not be reproduced from the working tree.
   *
   * `npm run build:qa` sets NEXT_DIST_DIR so a verification build lands in its
   * own tree and leaves a running `next dev` alone. .gitignore already ignores
   * /.next-*\/ for this.
   *
   * The second key is the price of the first. `next build` writes generated
   * route types into its distDir and then appends that path to the include list
   * in tsconfig.json, so an alternate distDir leaves the checked-in tsconfig
   * carrying two copies of the same generated types, and every later
   * `npx tsc --noEmit` fails on duplicate LayoutProps. Turning Next's own type
   * check off for the QA build stops it editing tsconfig at all; build:qa runs
   * `tsc --noEmit` itself, first, so nothing is checked less than before.
   *
   * Unset, both keys are the stock defaults, the type check runs inside
   * `next build` as usual, and nothing about a deploy changes.
   */
  distDir: qaDistDir || '.next',
  ...(qaDistDir ? { typescript: { ignoreBuildErrors: true } } : {}),
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Commerce removed: the client is not selling books moving forward.
      { source: '/shop', destination: '/about/#books', statusCode: 301 },
      { source: '/damian-mason-online-shop', destination: '/about/#books', statusCode: 301 },
      { source: '/cart', destination: '/about/#books', statusCode: 301 },
      { source: '/checkout', destination: '/about/#books', statusCode: 301 },
      { source: '/my-account', destination: '/about/#books', statusCode: 301 },
      // The BOASG "product" was a membership, not a book. Specific rule must be
      // declared before the /product/* wildcard so it wins.
      { source: '/product/business-of-ag-success-group', destination: '/boasg/', statusCode: 301 },
      { source: '/product/:slug*', destination: '/about/#books', statusCode: 301 },
      { source: '/product-category/:slug*', destination: '/about/#books', statusCode: 301 },

      // Orphaned podcast stub now resolves to the real hub.
      { source: '/podcast-2', destination: '/podcasts/', statusCode: 301 },

      // Two newsletter routes collapsed into one.
      { source: '/join-mailing-list', destination: '/join-the-conversation/', statusCode: 301 },

      // Both posts move under /blog/. The first shipped on WordPress's default
      // slug and was never renamed.
      {
        source: '/hello-world',
        destination: '/blog/eggflation-gives-producers-record-profits/',
        statusCode: 301,
      },
      {
        source: '/how-the-climate-crisis-is-causing-food-shortages-globally',
        destination: '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/',
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

/**
 * Set by `npm run build:qa`. Empty for a normal build, a normal dev server and
 * every deploy, so the stock `.next` is what ships.
 */
const qaDistDir = process.env.NEXT_DIST_DIR;

/**
 * `next dev` needs looser rules than a deploy does, and only for the two things
 * the dev server itself needs: Turbopack's HMR client evaluates code strings,
 * and it holds a websocket back to the dev server. Neither is true of a build.
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * ---------------------------------------------------------------------------
 * CONTENT SECURITY POLICY
 *
 * Every origin below is one this site actually contacts. They are, in full:
 *
 *   i.ytimg.com                  YouTube's poster stills, behind the video
 *                                facade in components/sections/VideoEmbed.tsx.
 *   www.youtube-nocookie.com     The player iframe, mounted only after a
 *                                visitor presses play.
 *   play.libsyn.com              The podcast player on
 *                                /the-business-of-agriculture/.
 *   damianmason.us13.list-manage.com
 *                                Where the newsletter form POSTs. Mailchimp,
 *                                the same audience the old site used.
 *
 * Nothing else is reachable. No analytics, no tag manager, no font CDN: the
 * four families are self-hosted by next/font, which is why font-src is 'self'.
 *
 * WHY script-src CARRIES 'unsafe-inline'.
 *
 * Next streams its RSC payload through inline <script> tags whose contents
 * change on every build, so they can be allowed by nonce or not at all. A nonce
 * has to be minted per request, which means routing every response through
 * middleware, which means every one of the 27 pages stops being a static file
 * on the CDN and becomes a function invocation. That is a real cost paid
 * against a modest gain, because this site renders no user input anywhere:
 * there is no search, no comments, no query parameter that reaches the DOM, and
 * the only dangerouslySetInnerHTML calls hold build-time constants that are
 * escaped before they are written. 'unsafe-inline' is recorded here as a
 * deliberate trade, not an oversight.
 *
 * The directive still earns its place without it. script-src 'self' means no
 * third-party origin can serve script to this site at all, which is the attack
 * this site is actually exposed to.
 * ---------------------------------------------------------------------------
 */
const CSP_DIRECTIVES: Array<[string, string[]]> = [
  ['default-src', ["'self'"]],
  // Nothing may rewrite the document base and re-point every relative URL.
  ['base-uri', ["'self'"]],
  ['object-src', ["'none'"]],
  // The modern half of X-Frame-Options. Both ship; see SECURITY_HEADERS.
  ['frame-ancestors', ["'none'"]],
  // The newsletter is the only form on the site, and Mailchimp is the only
  // place it may post to.
  ['form-action', ["'self'", 'https://damianmason.us13.list-manage.com']],
  ['script-src', ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])]],
  // next/font and the two <noscript> style blocks in VideoEmbed are inline.
  ['style-src', ["'self'", "'unsafe-inline'"]],
  // data: covers the wordmark that app/opengraph-image.tsx inlines.
  ['img-src', ["'self'", 'data:', 'blob:', 'https://i.ytimg.com', 'https://i9.ytimg.com']],
  ['font-src', ["'self'"]],
  // The three self-hosted demo reels in public/video.
  ['media-src', ["'self'"]],
  ['frame-src', ['https://www.youtube-nocookie.com', 'https://play.libsyn.com']],
  ['connect-src', ["'self'", ...(isDev ? ['ws:', 'wss:'] : [])]],
  ['upgrade-insecure-requests', []],
];

const contentSecurityPolicy = CSP_DIRECTIVES.map(([name, values]) =>
  values.length ? `${name} ${values.join(' ')}` : name,
).join('; ');

/**
 * ---------------------------------------------------------------------------
 * PERMISSIONS POLICY
 *
 * Deny by default, then hand back exactly what the two embeds need. The YouTube
 * iframe asks for autoplay, encrypted-media, picture-in-picture and fullscreen
 * in its own `allow` attribute, and a delegated permission can never exceed
 * what the top-level document holds. Denying autoplay here would silently
 * break the one behaviour the facade exists to deliver: a visitor presses play
 * once and the video starts.
 *
 * Only feature names Chrome recognises are listed. An unrecognised one is
 * ignored by the spec but logged as a console error, and this build holds
 * console errors at zero.
 * ---------------------------------------------------------------------------
 */
const EMBED_ORIGINS = '"https://www.youtube-nocookie.com" "https://play.libsyn.com"';
const permissionsPolicy = [
  'accelerometer=()',
  `autoplay=(self ${EMBED_ORIGINS})`,
  'browsing-topics=()',
  'camera=()',
  'display-capture=()',
  `encrypted-media=(self ${EMBED_ORIGINS})`,
  `fullscreen=(self ${EMBED_ORIGINS})`,
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'payment=()',
  `picture-in-picture=(self ${EMBED_ORIGINS})`,
  'usb=()',
].join(', ');

/**
 * Applied to every response. Vercel serves the whole site over HTTPS with a
 * managed certificate, so HSTS is safe to assert from the first deploy.
 *
 * Two deliberate omissions on Strict-Transport-Security:
 *   - no `preload`. Submitting to the browser preload list is close to
 *     irreversible and is the domain owner's call, not the build's.
 *   - `includeSubDomains` IS set, which commits every subdomain of the
 *     production domain to HTTPS for two years. Confirm there is no plain-HTTP
 *     subdomain still in service before the first production deploy. Removing
 *     it later does not un-commit a browser that already cached the header.
 */
const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  // Stops a browser guessing a type the server did not send, which is how an
  // uploaded .txt becomes an executed .js.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Full URL to same-origin, bare origin to anyone else, nothing over plain
  // HTTP. Keeps referral analytics working without leaking page paths outward.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Redundant with frame-ancestors for any current browser, and the only
  // clickjacking defence an old one understands. It costs 24 bytes.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: permissionsPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

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
    /**
     * YouTube's poster host.
     *
     * Today nothing here needs it: the posters in
     * components/sections/VideoEmbed.tsx are plain <img> tags, chosen because
     * the facade already fixes the frame with aspect-ratio so there is no
     * layout shift for next/image to buy back, and verified as such rather
     * than assumed. An `<Image src="https://i.ytimg.com/...">` without this
     * entry does not degrade, it throws: the optimizer answers 400 and the
     * poster is simply gone in production while looking fine in a dev server
     * that was started before the URL was added.
     *
     * The entry is here so that swapping one of those tags for next/image
     * later is a one-line change that works, instead of a one-line change that
     * ships a broken page. It permits reading two paths on one host and
     * nothing else.
     */
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'i9.ytimg.com', pathname: '/vi/**' },
    ],
  },
  /**
   * Set on every response, including the static HTML Vercel serves from its
   * CDN. See SECURITY_HEADERS above for what each one buys.
   *
   * `source: '/:path*'` matches the root as well as every nested path, which
   * `/:path+` would not.
   */
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
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

      /* The two WordPress archives. Both were linked from three old pages, the
         blog index and both posts, so they are in Google's index and in any
         link Damian has ever shared from a post footer. The site has one author
         and one category, so neither archive has a destination of its own: the
         author is the man, and the category was WordPress's untouched default.
         No trailing slash on `source`, matching every rule above, because
         trailingSlash: true handles it. */
      { source: '/author/damianmasonstg', destination: '/about/', statusCode: 301 },
      { source: '/category/uncategorized', destination: '/blog/', statusCode: 301 },

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

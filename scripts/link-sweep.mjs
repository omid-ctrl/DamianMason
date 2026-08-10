/**
 * Phase 6 link + asset sweep.
 *
 *   node scripts/link-sweep.mjs [--base http://localhost:3100] [--out docs/qa/link-report.json]
 *
 * Renders all 21 live routes in Chromium (so client-rendered hrefs and CSS
 * background images are included, not just the server HTML), then:
 *
 *   - collects every href, every src, every srcset candidate, every CSS url()
 *     (stylesheet rules + computed backgrounds/masks) and every <source>/<track>
 *   - requests every INTERNAL url and records the full redirect chain
 *   - requests every EXTERNAL url HEAD-then-GET with a real user agent
 *   - measures naturalWidth on every rendered <img>
 *   - flags 404 / 5xx / empty href / "#" href / wpengine / bare http:// /
 *     internal links missing the trailing slash / zero-width images
 *   - extracts every JSON-LD block for validation
 *
 * Writes the whole thing to docs/qa/link-report.json. It changes nothing.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);

const BASE = (args.base ?? 'http://localhost:3100').replace(/\/$/, '');
const OUT = path.resolve(args.out ?? 'docs/qa/link-report.json');
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const EXT_TIMEOUT = 25_000;

/** Live URLs. Static routes come from the manifest routeMap and the two
 *  posts come from the same slug list app/sitemap.ts declares. Set semantics
 *  keep the purpose-built one-sheet route present without ever crawling it
 *  twice if the source manifest also contains it. */
const manifest = JSON.parse(fs.readFileSync('_source/manifest.json', 'utf8'));
const BLOG_POST_SLUGS = [
  'eggflation-gives-producers-record-profits',
  'how-the-climate-crisis-is-causing-food-shortages-globally',
];
const ROUTES = [...new Set([
  ...Object.keys(manifest.routeMap).filter((r) => !r.includes('[')),
  '/speaker-one-sheet/',
  ...BLOG_POST_SLUGS.map((s) => `/blog/${s}/`),
])];

/** Legacy paths that must still resolve. Kept in sync with next.config.ts by
 *  hand; the point of the check is to catch it when they drift. */
const LEGACY_REDIRECTS = [
  ['/shop', '/books/'],
  ['/damian-mason-online-shop', '/books/'],
  ['/cart', '/books/'],
  ['/checkout', '/books/'],
  ['/my-account', '/books/'],
  ['/product/business-of-ag-success-group', '/boasg/'],
  [
    '/product/do-business-better-traits-habits-and-actions-to-help-you-succeed-limited-supply',
    '/books/#do-business-better',
  ],
  [
    '/product/food-fear-audiobook-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating',
    '/books/#food-fear-audiobook',
  ],
  [
    '/product/food-fear-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating',
    '/books/#food-fear',
  ],
  ['/product-category/books', '/books/'],
  ['/podcast-2', '/podcasts/'],
  ['/join-mailing-list', '/join-the-conversation/'],
  ['/hello-world', '/blog/eggflation-gives-producers-record-profits/'],
  [
    '/how-the-climate-crisis-is-causing-food-shortages-globally',
    '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/',
  ],
];

const isInternal = (u) => u.startsWith(BASE + '/') || u === BASE;
/** The canonical production origin. Not deployed during QA, so a non-200 there
 *  is expected and is recorded, not flagged. */
const PROD_ORIGIN = 'https://damianmason.com';
const isProdOrigin = (u) => u.startsWith(PROD_ORIGIN);
const norm = (u) => u.split('#')[0];

/**
 * The Next dev server closes keep-alive sockets aggressively under concurrency,
 * which surfaces as `SocketError: other side closed` and would otherwise be
 * reported as a dead link. Wrap the global so every request in this file,
 * including body reads, gets retried before we believe a failure.
 */
const rawFetch = globalThis.fetch;
globalThis.fetch = async (url, opts = {}) => {
  let last;
  const tries = opts.signal ? 1 : 4;
  for (let i = 0; i < tries; i++) {
    try {
      return await rawFetch(url, opts);
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw last;
};

const stage = (s) => console.error(`  ... ${s}`);

/* ------------------------------------------------------------------ crawl */

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  userAgent: UA,
});

const pages = [];
const consoleErrors = [];

for (const route of ROUTES) {
  const url = BASE + route;
  const page = await context.newPage();
  const errs = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(m.text());
  });
  page.on('pageerror', (e) => errs.push(String(e)));

  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  try {
    await page.evaluate(() => document.fonts.ready);
  } catch {}

  const title = await page.title();

  const harvested = await page.evaluate(() => {
    const abs = (u) => {
      try {
        return new URL(u, document.baseURI).href;
      } catch {
        return null;
      }
    };

    const anchors = [...document.querySelectorAll('a')].map((a) => ({
      raw: a.getAttribute('href'),
      resolved: a.getAttribute('href') ? abs(a.getAttribute('href')) : null,
      text: (a.textContent || '').trim().slice(0, 80),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
      ariaLabel: a.getAttribute('aria-label'),
      inNav: !!a.closest('nav'),
      inFooter: !!a.closest('footer'),
    }));

    const imgs = [...document.querySelectorAll('img')].map((img) => ({
      raw: img.getAttribute('src'),
      resolved: img.currentSrc || (img.getAttribute('src') ? abs(img.getAttribute('src')) : null),
      srcset: img.getAttribute('srcset'),
      alt: img.getAttribute('alt'),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loading: img.getAttribute('loading'),
      complete: img.complete,
    }));

    const mediaSrcs = [];
    for (const el of document.querySelectorAll(
      'source, video, audio, iframe, track, embed, object, script[src], link[href]',
    )) {
      // A <video> that carries its file on a child <source> still has a poster
      // worth requesting, so read the poster before bailing on a missing src.
      if (el.getAttribute('poster')) {
        mediaSrcs.push({
          tag: el.tagName.toLowerCase() + '[poster]',
          raw: el.getAttribute('poster'),
          resolved: abs(el.getAttribute('poster')),
        });
      }
      const u =
        el.getAttribute('src') ||
        el.getAttribute('href') ||
        el.getAttribute('data') ||
        el.getAttribute('srcset');
      if (!u) continue;
      mediaSrcs.push({
        tag: el.tagName.toLowerCase(),
        raw: u,
        resolved: abs(u.split(',')[0].trim().split(' ')[0]),
        poster: el.getAttribute('poster') ? abs(el.getAttribute('poster')) : null,
        rel: el.getAttribute('rel'),
      });
      if (el.getAttribute('srcset')) {
        for (const cand of el.getAttribute('srcset').split(',')) {
          const u2 = cand.trim().split(/\s+/)[0];
          if (u2) mediaSrcs.push({ tag: el.tagName.toLowerCase() + '[srcset]', raw: u2, resolved: abs(u2) });
        }
      }
    }
    // srcset candidates on <img>
    for (const img of document.querySelectorAll('img[srcset]')) {
      for (const cand of img.getAttribute('srcset').split(',')) {
        const u2 = cand.trim().split(/\s+/)[0];
        if (u2) mediaSrcs.push({ tag: 'img[srcset]', raw: u2, resolved: abs(u2) });
      }
    }

    // CSS url() from computed styles on every element
    const cssUrls = new Set();
    const props = [
      'backgroundImage',
      'borderImageSource',
      'maskImage',
      'webkitMaskImage',
      'listStyleImage',
      'content',
      'cursor',
    ];
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      for (const p of props) {
        const v = cs[p];
        if (!v || v === 'none' || v === 'normal') continue;
        for (const m of v.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) cssUrls.add(m[2]);
      }
      for (const pseudo of ['::before', '::after']) {
        const ps = getComputedStyle(el, pseudo);
        for (const p of ['backgroundImage', 'content', 'maskImage']) {
          const v = ps[p];
          if (!v || v === 'none' || v === 'normal') continue;
          for (const m of v.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) cssUrls.add(m[2]);
        }
      }
    }
    // CSS url() from stylesheet rules (catches rules not currently matched)
    // Rule text carries relative urls like `../media/x.woff2`. They resolve
    // against the STYLESHEET, not the document, or every font on /blog/ looks
    // like a 404 at /blog/media/x.woff2.
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      const sheetBase = sheet.href || document.baseURI;
      const walk = (rs) => {
        for (const r of rs) {
          if (r.cssRules) walk(r.cssRules);
          const t = r.cssText || '';
          for (const m of t.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
            const u = m[2];
            if (u.startsWith('data:')) continue;
            try {
              cssUrls.add(new URL(u, sheetBase).href);
            } catch {
              cssUrls.add(u);
            }
          }
        }
      };
      walk(rules);
    }

    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent,
    );

    const videos = [...document.querySelectorAll('video')].map((v) => ({
      poster: v.getAttribute('poster'),
      preload: v.getAttribute('preload'),
      sources: [...v.querySelectorAll('source')].map((s) => s.getAttribute('src')),
      tracks: v.querySelectorAll('track').length,
    }));

    // Assets a page names in <head> rather than in the body. og:image and
    // twitter:image are real deliverables (a social scraper fetches them) and
    // several routes override the generated card with a photograph, so an
    // asset can be live on the site while appearing nowhere in the DOM.
    const metaAssets = [];
    for (const m of document.querySelectorAll(
      'meta[property^="og:image"], meta[name^="twitter:image"], link[rel~="icon"], link[rel~="apple-touch-icon"], link[rel="manifest"]',
    )) {
      const key = m.getAttribute('property') ?? m.getAttribute('name') ?? m.getAttribute('rel');
      // The og:image family also carries width, height, type and alt. Only
      // these four keys hold a URL; the rest are numbers or prose.
      const urlKeys = ['og:image', 'og:image:url', 'og:image:secure_url', 'twitter:image', 'twitter:image:src'];
      const isLink = m.tagName === 'LINK';
      if (!isLink && !urlKeys.includes(key)) continue;
      const v = m.getAttribute('content') ?? m.getAttribute('href');
      if (!v) continue;
      metaAssets.push({ key, raw: v, resolved: abs(v) });
    }

    return {
      anchors,
      imgs,
      mediaSrcs,
      videos,
      metaAssets,
      cssUrls: [...cssUrls].map((u) => ({ raw: u, resolved: u.startsWith('data:') ? u : abs(u) })),
      jsonLd,
      hasBooksAnchor: !!document.getElementById('books'),
      ids: [...document.querySelectorAll('[id]')].map((e) => e.id),
      h1Count: document.querySelectorAll('h1').length,
      canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
    };
  });

  pages.push({
    route,
    url,
    status: resp?.status() ?? null,
    title,
    consoleErrors: errs,
    ...harvested,
  });
  if (errs.length) consoleErrors.push({ route, errs });
  await page.close();
}

await browser.close();

/* ---------------------------------------------------------------- checking */

const seen = new Map(); // url -> result

/** The dev server drops keep-alive sockets under concurrency, which reads as a
 *  fetch failure and would otherwise be reported as a dead link. Retry before
 *  believing it. */
async function fetchRetry(url, opts, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await rawFetch(url, opts);
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw last;
}

async function checkInternal(url) {
  const chain = [];
  let cur = url;
  let status = null;
  for (let hop = 0; hop < 10; hop++) {
    let r;
    try {
      r = await fetchRetry(cur, { redirect: 'manual', headers: { 'user-agent': UA } });
    } catch (e) {
      return { url, ok: false, status: null, error: String(e), chain };
    }
    status = r.status;
    const loc = r.headers.get('location');
    chain.push({ url: cur, status, location: loc ?? null });
    if (status >= 300 && status < 400 && loc) {
      cur = new URL(loc, cur).href;
      continue;
    }
    break;
  }
  return { url, ok: status >= 200 && status < 400, status, final: cur, hops: chain.length - 1, chain };
}

async function checkExternal(url) {
  const opts = {
    headers: {
      'user-agent': UA,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  };
  for (const method of ['HEAD', 'GET']) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), EXT_TIMEOUT);
    try {
      const r = await fetch(url, { ...opts, method, signal: ac.signal });
      clearTimeout(t);
      if (method === 'HEAD' && [400, 403, 404, 405, 406, 429, 501].includes(r.status))
        continue;
      return { url, ok: r.ok, status: r.status, method, final: r.url };
    } catch (e) {
      clearTimeout(t);
      if (method === 'GET') return { url, ok: false, status: null, method, error: String(e.message ?? e) };
    }
  }
  return { url, ok: false, status: null, error: 'unreachable' };
}

async function check(url) {
  if (seen.has(url)) return seen.get(url);
  const p = isInternal(url) ? checkInternal(url) : checkExternal(url);
  seen.set(url, p);
  return p;
}

// Gather every URL worth requesting, tagged with its source routes.
const sources = new Map(); // url -> [{route, kind, text}]
const record = (url, entry) => {
  if (!url) return;
  if (url.startsWith('data:') || url.startsWith('blob:')) return;
  if (!sources.has(url)) sources.set(url, []);
  sources.get(url).push(entry);
};

const findings = [];
const flag = (severity, route, type, detail) => findings.push({ severity, route, type, ...detail });

for (const p of pages) {
  for (const a of p.anchors) {
    const raw = a.raw;
    if (raw === null) {
      flag('high', p.route, 'href-attribute-absent', { text: a.text });
      continue;
    }
    if (raw.trim() === '') {
      flag('high', p.route, 'empty-href', { text: a.text });
      continue;
    }
    if (raw.trim() === '#') {
      flag('high', p.route, 'hash-only-href', { text: a.text });
      continue;
    }
    if (/wpengine\.com/i.test(raw)) flag('high', p.route, 'wpengine-reference', { href: raw, text: a.text });
    if (/^http:\/\//i.test(raw)) flag('high', p.route, 'insecure-http-link', { href: raw, text: a.text });
    if (raw.startsWith('#')) continue; // same-page anchor, validated separately
    if (raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
    const abs = a.resolved;
    if (!abs) continue;
    if (isInternal(abs)) {
      const u = new URL(abs);
      const isFile = /\.[a-z0-9]{2,5}$/i.test(u.pathname);
      if (!u.pathname.endsWith('/') && !isFile)
        flag('low', p.route, 'internal-link-missing-trailing-slash', { href: raw, text: a.text });
    }
    record(norm(abs), { route: p.route, kind: 'a', text: a.text, raw, inNav: a.inNav, inFooter: a.inFooter });
  }

  for (const img of p.imgs) {
    if (!img.raw || img.raw.trim() === '')
      flag('high', p.route, 'empty-img-src', { alt: img.alt });
    if (img.raw && /wpengine\.com/i.test(img.raw))
      flag('high', p.route, 'wpengine-reference', { src: img.raw });
    if (img.naturalWidth === 0)
      flag('high', p.route, 'image-natural-width-zero', {
        src: img.resolved ?? img.raw,
        alt: img.alt,
        loading: img.loading,
        complete: img.complete,
      });
    record(img.resolved, { route: p.route, kind: 'img', alt: img.alt });
  }

  for (const m of p.mediaSrcs) {
    if (m.raw && /wpengine\.com/i.test(m.raw))
      flag('high', p.route, 'wpengine-reference', { src: m.raw, tag: m.tag });
    record(m.resolved, { route: p.route, kind: m.tag });
    if (m.poster) record(m.poster, { route: p.route, kind: m.tag + '[poster]' });
  }

  for (const c of p.cssUrls) record(c.resolved, { route: p.route, kind: 'css-url', raw: c.raw });

  for (const m of p.metaAssets ?? []) {
    // og:image points at the production origin, which is not deployed during
    // QA. Rewrite it onto the base under test so the file itself is checked,
    // and keep the advertised URL in the entry so a bad path is still visible.
    const local = m.resolved?.startsWith(PROD_ORIGIN)
      ? BASE + m.resolved.slice(PROD_ORIGIN.length)
      : m.resolved;
    record(local, { route: p.route, kind: 'meta:' + m.key, advertised: m.resolved });
  }

  // same-page anchor targets
  for (const a of p.anchors) {
    if (a.raw && a.raw.startsWith('#') && a.raw.length > 1) {
      const id = decodeURIComponent(a.raw.slice(1));
      if (!p.ids.includes(id)) flag('high', p.route, 'dangling-fragment', { href: a.raw, text: a.text });
    }
  }
}

// Cross-route fragments. `/books/#food-fear` linked from another route is only
// live if /books/ actually renders id="food-fear". The same-page pass cannot
// see that, so resolve every internal href carrying a hash against the id list
// harvested from the route it points at.
const idsByRoute = new Map(pages.map((p) => [p.route, new Set(p.ids)]));
for (const p of pages) {
  for (const a of p.anchors) {
    const raw = a.raw;
    if (!raw || raw.startsWith('#') || !a.resolved) continue;
    const u = new URL(a.resolved);
    if (!isInternal(a.resolved) || !u.hash || u.hash.length < 2) continue;
    const target = u.pathname;
    const id = decodeURIComponent(u.hash.slice(1));
    const ids = idsByRoute.get(target);
    if (!ids) {
      flag('medium', p.route, 'cross-route-fragment-target-not-crawled', {
        href: raw,
        target,
        text: a.text,
      });
    } else if (!ids.has(id)) {
      flag('high', p.route, 'cross-route-dangling-fragment', { href: raw, target, id, text: a.text });
    }
  }
}
// Same for redirect destinations that carry a fragment (known products ->
// their edition anchors on /books/).
for (const [, dest] of LEGACY_REDIRECTS.map((r) => r)) void dest;

stage('checking urls');
const results = {};
const urls = [...sources.keys()];
const CONC = 4;
for (let i = 0; i < urls.length; i += CONC) {
  process.stderr.write(`\r  ... url ${i}/${urls.length}`);
  const batch = urls.slice(i, i + CONC);
  const res = await Promise.all(batch.map((u) => check(u)));
  res.forEach((r, j) => (results[batch[j]] = r));
}

for (const [url, r] of Object.entries(results)) {
  const srcs = sources.get(url);
  const routes = [...new Set(srcs.map((s) => s.route))];
  const internal = isInternal(url);
  if (isProdOrigin(url)) {
    // Canonicals, JSON-LD @ids and og urls all point at the not-yet-live prod
    // origin. Only a real user-facing <a> to it matters here.
    if (srcs.some((s) => s.kind === 'a'))
      flag('medium', routes.join(', '), 'anchor-hardcodes-production-origin', { url, sources: srcs });
    continue;
  }
  if (r.status === 404)
    flag(internal ? 'high' : 'medium', routes.join(', '), '404', { url, sources: srcs.slice(0, 3) });
  else if (r.status >= 500)
    flag(internal ? 'high' : 'medium', routes.join(', '), '5xx', { url, status: r.status, sources: srcs.slice(0, 3) });
  else if (!r.ok)
    flag(internal ? 'high' : 'medium', routes.join(', '), 'unreachable', {
      url,
      status: r.status,
      error: r.error,
      sources: srcs.slice(0, 3),
    });
  if (internal && r.hops > 0)
    flag('low', routes.join(', '), 'internal-extra-hop', { url, chain: r.chain });
  if (/^http:\/\//i.test(url) && !url.startsWith(BASE))
    flag('medium', routes.join(', '), 'insecure-http-asset', { url });
}

/* ------------------------------------------------------- separate verifies */

const verify = {};

// 1. legacy redirects
stage('legacy redirects');
verify.legacyRedirects = [];
for (const [from, expectPrefix] of LEGACY_REDIRECTS) {
  const r = await checkInternal(BASE + from);
  const finalPath = r.final ? new URL(r.final).pathname + (new URL(r.final).hash || '') : null;
  const firstRedirect = r.chain.find((c) => c.status >= 300 && c.status < 400);
  verify.legacyRedirects.push({
    from,
    expectPrefix,
    finalStatus: r.status,
    final: r.final,
    finalPath,
    hops: r.hops,
    chain: r.chain,
    landsOn200: r.status === 200,
    lands: finalPath?.startsWith(expectPrefix) ?? false,
    firstHopStatus: firstRedirect?.status ?? null,
  });
}

// 2. The retained compact shelf and the full edition destination.
const aboutPage = pages.find((p) => p.route === '/about/');
verify.aboutBooksAnchor = {
  present: aboutPage?.hasBooksAnchor ?? false,
};
const booksPage = pages.find((p) => p.route === '/books/');
const booksPageIds = new Set(booksPage?.ids ?? []);
verify.booksEditionAnchors = {
  present: Boolean(booksPage),
  foodFear: booksPageIds.has('food-fear'),
  foodFearAudiobook: booksPageIds.has('food-fear-audiobook'),
  doBusinessBetter: booksPageIds.has('do-business-better'),
};

// 3. sitemap
stage('sitemap');
const sitemapRes = await fetchRetry(BASE + '/sitemap.xml', { headers: { 'user-agent': UA } });
const sitemapXml = await sitemapRes.text();
const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
verify.sitemap = {
  status: sitemapRes.status,
  contentType: sitemapRes.headers.get('content-type'),
  parses: /^<\?xml/.test(sitemapXml.trim()) && sitemapLocs.length > 0,
  count: sitemapLocs.length,
  locs: sitemapLocs,
  commerceUrls: sitemapLocs.filter((u) =>
    /(shop|cart|checkout|my-account|\/product\/|product-category)/i.test(u),
  ),
  missingRoutes: ROUTES.filter((r) => !sitemapLocs.some((l) => new URL(l).pathname === r)),
  extraLocs: sitemapLocs.filter((l) => !ROUTES.includes(new URL(l).pathname)),
  nonHttps: sitemapLocs.filter((l) => !l.startsWith('https://')),
};

// 4. robots
stage('robots');
const robotsRes = await fetchRetry(BASE + '/robots.txt', { headers: { 'user-agent': UA } });
const robotsTxt = await robotsRes.text();
verify.robots = {
  status: robotsRes.status,
  body: robotsTxt,
  hasSitemap: /Sitemap:\s*\S+/i.test(robotsTxt),
  sitemapLine: robotsTxt.match(/Sitemap:\s*(\S+)/i)?.[1] ?? null,
  hasUserAgent: /User-Agent:/i.test(robotsTxt),
  disallowAll: /Disallow:\s*\/\s*$/im.test(robotsTxt),
};
if (verify.robots.sitemapLine) {
  const sm = verify.robots.sitemapLine;
  verify.robots.sitemapLineMatchesActual = sm.endsWith('/sitemap.xml');
}

// 5. OG image
stage('og image');
// Probe both the URL the metadata actually advertises and the trailing-slash
// form `trailingSlash: true` redirects it to. A failure in either is a finding,
// not a reason to abort the sweep.
const ogProbe = {};
for (const p of ['/opengraph-image', '/opengraph-image/']) {
  try {
    const r = await rawFetch(BASE + p, { headers: { 'user-agent': UA }, redirect: 'manual' });
    const b = Buffer.from(await r.arrayBuffer());
    ogProbe[p] = { status: r.status, location: r.headers.get('location'), bytes: b.length,
      contentType: r.headers.get('content-type') };
  } catch (e) {
    ogProbe[p] = { error: String(e.cause?.message ?? e.message ?? e) };
  }
}
let ogRes = { status: null, url: null, headers: { get: () => null } };
let ogBuf = Buffer.alloc(0);
try {
  ogRes = await fetchRetry(BASE + '/opengraph-image', { headers: { 'user-agent': UA }, redirect: 'follow' });
  ogBuf = Buffer.from(await ogRes.arrayBuffer());
} catch (e) {
  flag('high', 'site-wide', 'og-image-unfetchable', {
    url: BASE + '/opengraph-image',
    error: String(e.cause?.message ?? e.message ?? e),
    probe: ogProbe,
  });
}
const isPng = ogBuf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
let ogDims = null;
if (isPng) ogDims = { width: ogBuf.readUInt32BE(16), height: ogBuf.readUInt32BE(20) };
verify.ogImage = {
  requested: '/opengraph-image',
  probe: ogProbe,
  status: ogRes.status,
  finalUrl: ogRes.url,
  contentType: ogRes.headers.get('content-type'),
  bytes: ogBuf.length,
  isPng,
  dims: ogDims,
};
// also the per-page og:image the metadata actually emits
const homeHtml = await (await fetchRetry(BASE + '/', { headers: { 'user-agent': UA } })).text();
const ogMeta = [...homeHtml.matchAll(/<meta[^>]+property="og:image[^"]*"[^>]+content="([^"]+)"/g)].map(
  (m) => m[1],
);
verify.ogImage.metaTags = ogMeta;

// 6. JSON-LD
stage('json-ld');
verify.jsonLd = [];
for (const p of pages) {
  for (const [i, block] of p.jsonLd.entries()) {
    const entry = { route: p.route, index: i, bytes: block?.length ?? 0 };
    try {
      const parsed = JSON.parse(block);
      entry.parses = true;
      const nodes = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
      entry.types = nodes.map((n) => n?.['@type'] ?? null);
      entry.missingType = entry.types.some((t) => !t);
      entry.missingContext = !parsed['@context'] && !nodes.every((n) => n?.['@context']);
      // any http(s) urls inside get link-checked too
      const found = [...block.matchAll(/"(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
      entry.urls = [...new Set(found)];
    } catch (e) {
      entry.parses = false;
      entry.error = String(e.message);
      flag('high', p.route, 'jsonld-parse-error', { index: i, error: String(e.message) });
    }
    if (entry.missingType) flag('high', p.route, 'jsonld-missing-type', { index: i });
    verify.jsonLd.push(entry);
  }
}

// check urls referenced inside JSON-LD
const ldUrls = [...new Set(verify.jsonLd.flatMap((e) => e.urls ?? []))].filter(
  (u) => !/^https?:\/\/schema\.org/.test(u),
);
verify.jsonLdUrlChecks = [];
for (let i = 0; i < ldUrls.length; i += CONC) {
  const batch = ldUrls.slice(i, i + CONC);
  const res = await Promise.all(
    batch.map((u) => (isInternal(u) ? checkInternal(u) : checkExternal(u))),
  );
  verify.jsonLdUrlChecks.push(...res);
}
for (const r of verify.jsonLdUrlChecks) {
  if (isProdOrigin(r.url)) continue;
  if (!r.ok) flag(isInternal(r.url) ? 'high' : 'medium', 'json-ld', 'jsonld-dead-url', { url: r.url, status: r.status, error: r.error });
}

// 7. known-removed routes should 404 or redirect, never 200
stage('removed routes');
verify.removedRoutes = [];
for (const p of ['/books/', '/media/', '/podcast/', '/speaking-stub/']) {
  const r = await checkInternal(BASE + p);
  verify.removedRoutes.push({ path: p, status: r.status, final: r.final });
}

// 7b. Which server answered. Two checks in this file behave differently on
//     `next dev` than on `next start`, so record the environment rather than
//     leaving a reader to guess why a run has findings the last one did not.
//
//     `/opengraph-image/` is the known one: the dev server closes the socket
//     with a zero-byte reply, while a production build serves the real
//     1200x630 PNG. Anything og-image-shaped in a dev run must be re-checked
//     against `NEXT_DIST_DIR=.next-qa npx next start` before it is believed.
stage('environment');
const envProbe = await fetchRetry(BASE + '/', { headers: { 'user-agent': UA } });
const isDevServer = !envProbe.headers.get('x-nextjs-cache') && !envProbe.headers.get('etag');
verify.environment = {
  base: BASE,
  looksLikeDevServer: isDevServer,
  ogImageServedHere: verify.ogImage?.probe?.['/opengraph-image/']?.status === 200,
  note: isDevServer
    ? 'Generated against a dev server. /opengraph-image/ is served only by a production build; re-verify any og-image finding with `NEXT_DIST_DIR=.next-qa npx next start`.'
    : 'Generated against a production server. Every check in this file is authoritative.',
};

// 8. every file in public/ that no rendered route requests. Catches art that
//    was harvested and normalized but never actually placed on a page.
stage('unreferenced public assets');
const referenced = new Set();
for (const u of Object.keys(results)) {
  if (!isInternal(u)) continue;
  const parsed = new URL(u);
  if (parsed.pathname.startsWith('/_next/image')) {
    const inner = parsed.searchParams.get('url');
    if (inner) referenced.add(inner);
  } else {
    referenced.add(parsed.pathname);
  }
}
const walkPublic = (dir, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkPublic(full, acc);
    else acc.push('/' + path.relative('public', full).split(path.sep).join('/'));
  }
  return acc;
};
const onDisk = walkPublic('public');
const stem = (f) => f.replace(/\.(png|jpe?g|webp|avif)$/i, '');
const referencedStems = new Set([...referenced].map(stem));
verify.publicAssets = {
  onDisk: onDisk.length,
  referenced: [...referenced].filter((u) => !u.startsWith('/_next')).length,
  // A raw sibling of a referenced webp/png is deliberate, so it is listed
  // separately from art that is simply not on the site at all.
  unreferencedFormatSiblings: onDisk.filter(
    (f) => !referenced.has(f) && referencedStems.has(stem(f)),
  ),
  unreferenced: onDisk
    .filter((f) => !referenced.has(f) && !referencedStems.has(stem(f)))
    .map((f) => ({ file: f, bytes: fs.statSync(path.join('public', f)).size })),
};

/* ------------------------------------------------------------------ output */

const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  routesCrawled: ROUTES.length,
  routes: ROUTES,
  pageTitles: pages.map((p) => ({ route: p.route, title: p.title, status: p.status, h1Count: p.h1Count, canonical: p.canonical })),
  videos: pages.filter((p) => p.videos.length).map((p) => ({ route: p.route, videos: p.videos })),
  mailto: [...new Set(pages.flatMap((p) => p.anchors.map((a) => a.raw).filter((h) => h && h.startsWith('mailto:'))))],
  tel: [...new Set(pages.flatMap((p) => p.anchors.map((a) => a.raw).filter((h) => h && h.startsWith('tel:'))))],
  blankWithoutNoopener: pages.flatMap((p) =>
    p.anchors
      .filter((a) => a.target === '_blank' && !/noopener|noreferrer/.test(a.rel ?? ''))
      .map((a) => ({ route: p.route, href: a.raw, text: a.text })),
  ),
  totals: {
    uniqueUrlsChecked: urls.length,
    internal: urls.filter(isInternal).length,
    external: urls.filter((u) => !isInternal(u)).length,
    anchors: pages.reduce((n, p) => n + p.anchors.length, 0),
    images: pages.reduce((n, p) => n + p.imgs.length, 0),
    cssUrls: pages.reduce((n, p) => n + p.cssUrls.length, 0),
    jsonLdBlocks: verify.jsonLd.length,
  },
  findings,
  verify,
  consoleErrors,
  urlResults: results,
  sources: Object.fromEntries([...sources.entries()].map(([k, v]) => [k, v])),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

const bySeverity = findings.reduce((a, f) => ((a[f.severity] = (a[f.severity] ?? 0) + 1), a), {});
console.log(`routes: ${ROUTES.length}  urls: ${urls.length}  findings:`, bySeverity);
for (const f of findings) console.log(` [${f.severity}] ${f.type} @ ${f.route} :: ${JSON.stringify(f).slice(0, 220)}`);
console.log('\nwrote', OUT);

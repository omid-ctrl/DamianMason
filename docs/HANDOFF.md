# Handoff: damianmason.com

Written for two readers. Sections 1, 2 and 6 are for anyone. Everything else
assumes a developer who has never opened this repo before.

---

## 1. What this is

This repository is a complete rebuild of `damianmason.com`. It replaces a
stock-Divi WordPress site hosted on WP Engine.

The old site is gone in the sense that none of its software survives. What
survives is its content: every page, every heading, every testimonial, every FAQ
answer, every video and every image from the old site was harvested word for
word before anything new was written, and it lives in `_source/pages/*.md`. The
new site was built against that harvest, not against memory.

What changed, at the level a non-technical reader cares about:

- The store is gone. No Shop, Cart, Checkout, My Account or product pages. The
  three books appear on `/about/` as credibility, with no prices and no cart.
- Two nav parents that used to link nowhere (`Speaking`, `Podcasts`) now open
  real pages, and a third (`Media`) resolves to the existing media page.
- The blank `/speaking/` page that Google had indexed is now a real page.
- Roughly 250 defects found on the live site were fixed and none were carried
  over. That includes the unedited "Your Title Goes Here" and Lorem Ipsum FAQ
  entries, a broken email link on Contact Us, three buttons that went nowhere, a
  missing hero image on the flagship podcast page, six footer links pointing at
  the WP Engine staging domain, and a setting that blocked pinch-zoom on phones.
- Every page now has its own title and search-engine description. The old site
  had almost none.
- The site scores 100 on accessibility and 100 on SEO in Lighthouse on every
  audited route, desktop and mobile. Performance is 100 on desktop and 93 to 95
  on mobile everywhere except `/podcasts/`, which sits at 86.

### 1.1 Deploy story

- **Framework:** Next.js 16, App Router, React 19, TypeScript, Tailwind v4.
- **Node:** 24. The build machine ran 24.14.0. Node 20 or newer will work, but 24
  is what was tested.
- **Rendering:** every route is prerendered to static HTML at build time. The
  build output shows `○ (Static)` on 25 routes and `● (SSG)` on the two blog
  posts. There is no database, no API route, no server action, no `cookies()`,
  no `headers()` and no incremental revalidation anywhere in the app.
- **What that means:** the site can be deployed to Vercel with zero
  configuration, and it is close to `output: 'export'` static-friendly. The only
  Next feature that wants a running Node process is the built-in image optimizer
  (`next/image` with AVIF and WebP, configured in `next.config.ts`), plus the
  301 redirects in the same file. On Vercel both are handled for you. On a pure
  static host you would need to add `output: 'export'`, set
  `images.unoptimized: true`, and move the redirect table into the host's own
  config, because a static host cannot run `redirects()`.
- **Recommended:** Vercel. Connect the repo, accept the defaults, set the
  production domain. Nothing else is required. There are no environment
  variables. There are no secrets in this repo.

---

## 2. Setup, dev, build, start

```bash
npm install                # installs deps; no postinstall steps, no native build
npx next dev -p 3100       # dev server, http://localhost:3100
npm run build              # production build into .next
npm start                  # serves the production build on :3000
```

### Why port 3100 and not 3000

`npm run dev` is the stock `next dev`, which binds port 3000. **On the machine
this site was built on, port 3000 is permanently occupied by an unrelated Next
15 project.** Every QA harness in `scripts/` therefore defaults to
`http://localhost:3100`, and every screenshot, link sweep, accessibility run and
Lighthouse target in `docs/qa/` was captured against 3100.

This matters more than it sounds. If you start the dev server on 3000 while the
other project is running, Next silently moves you to 3001, your browser shows
somebody else's site, and every QA script keeps pointing at 3100 and finds
nothing. Two hours of the build were lost to exactly that.

**Sanity check, every time:** load the dev server and confirm the browser tab
reads a Damian Mason title. On the home page it is
`Damian Mason, Agricultural Keynote Speaker`. If it says anything else, you are
on the wrong port.

On a machine where 3000 is free, `npm run dev` is fine. Pass `--base` to the QA
scripts if you do that.

### Building while the dev server is running

Do not run `npm run build` with `next dev` running. Turbopack keeps a persistent
cache inside the output directory and the two processes cannot share one. The
build dies before it compiles anything with `Failed to open database / Loading
persistence directory failed / invalid digit found in string`, and the only cure
is deleting `.next`, which takes the dev server down with it.

Use this instead:

```bash
npm run build:qa                                # builds into .next-qa
NEXT_DIST_DIR=.next-qa npx next start -p 3200   # serve it on :3200
```

`scripts/build-qa.mjs` runs `tsc --noEmit` itself before building, so nothing is
type-checked less than a normal build. It also restores `tsconfig.json`
afterwards, because `next build` rewrites the include list when it is pointed at
an alternate output directory. `.gitignore` already carries `/.next-*/`.

A production build is required for any performance measurement. Lighthouse
numbers taken against a dev server are meaningless.

---

## 3. Repo map

```
app/                    One directory per route. Each holds page.tsx plus its own
                        page.module.css. Route-specific copy lives inside page.tsx
                        as named consts at the top of the file.
  layout.tsx            Root layout: fonts, header, footer, site-wide JSON-LD.
  sitemap.ts            Generated from _source/manifest.json routeMap.
  robots.ts             robots.txt.
  opengraph-image.tsx   The default social share card, generated at build time.
  icon.png              Master favicon (the DM monogram). See scripts/build-app-icons.
  not-found.tsx         404 page.
  error.tsx             Route-level error boundary.
  global-error.tsx      Root error boundary.

components/
  ui/                   Primitives. Button, Card, Container, Eyebrow, Heading,
                        Prose, Quote, Rule, Section, SocialIcon, Stat, cx.
  sections/             Repeatable page blocks. Hero, LogoWall, SponsorWall,
                        TestimonialGrid, VideoGrid, VideoEmbed, EmbedFacade,
                        FAQAccordion, NewsletterForm, CTABand, StatRow,
                        CredentialBar, EpisodeCard, PressList.
  layout/               Header (with dropdowns and the mobile sheet) and Footer.
                        Both read the same nav tree from content/site.ts so they
                        cannot drift apart.
  motion/               RevealController. The single scroll-reveal observer.
  seo/                  JsonLd. Renders the structured-data objects lib/schema
                        builds.

content/                *** ALL EDITABLE CONTENT LIVES HERE. ***
                        Typed TypeScript files, one per kind of thing. This is
                        the layer a CMS would replace. See docs/CMS-READY.md.
  site.ts               Contact details, socials, nav tree, podcast IDs,
                        Mailchimp form config, proof points.
  clients.ts            The 21 client logos.
  sponsors.ts           The 10 podcast sponsor logos and their URLs.
  testimonials.ts       17 testimonials, plus the route-to-testimonial map.
  faq.ts                13 FAQ items with topic tags.
  videos.ts             16 videos (13 YouTube, 3 self-hosted MP4).
  posts.ts              The 2 blog posts.
  press.ts              9 press and media appearances.
  books.ts              The 3 book entries.
  brand-assets.ts       Paths to the brand marks. Generated by the asset script.
  image-alt.ts          One alt string per image file, for images used on more
                        than one route. Prevents alt text drifting.
  credentials.ts        The four-pillar credential bar.
  job-titles.ts         The nine job titles, defined once.
  media-band.ts         The closing band shared by /acres-tv/ and /xtreme-ag/.
  pages/                Empty. Reserved. Per-page copy stayed in the route files.

lib/
  seo.ts                buildMetadata(). Every page's title, description,
                        canonical, OG and Twitter tags come from this one call.
  schema.ts             Typed JSON-LD builders (Person, Organization, WebSite,
                        PodcastSeries, FAQPage, BreadcrumbList, VideoObject,
                        Article). All facts sourced from content/site.ts.
  links.ts              One outbound-link convention: new tab, rel="noopener
                        noreferrer", plus a screen-reader note.

src/styles/
  tokens.css            The design system. Colors, type scale, spacing, radii,
                        shadows, motion. Changing the palette or the font pair
                        here changes the whole site.
  sections-core.css     Structural rules for the section components.
  sections.css          Presentation rules for the section components.
  motion.css            Scroll-reveal and micro-interaction rules.
  logo-optical.css      Per-logo optical scaling. GENERATED. Do not hand edit.

public/
  img/brand/            Brand marks (wordmark, podcast art, BoASG badge, etc).
  img/clients/          The 21 client logos, PNG or JPG plus a WebP sibling.
  img/sponsors/         The 10 sponsor logos, same convention.
  img/photos/           37 photographs and cover images.
  img/logos/            Marks mirrored from the OLD site that are not in the
                        supplied folders. See open item 2.
  img/video-posters/    Poster frames for the three MP4 demo reels.
  video/                The three demo reels, 720p H.264, 22MB total.

scripts/                Asset pipeline and QA harnesses. See section 5.
                        Files prefixed with an underscore are throwaway probes
                        from the build and can be deleted.

docs/
  HANDOFF.md            This file.
  CMS-READY.md          What a CMS migration would involve.
  OPEN-ITEMS.md         *** Read this one first. Questions for the client. ***
  DESIGN_SYSTEM.md      The design system, in full.
  VOICE.md              How Damian writes. Read before editing any copy.
  CONTENT_MANIFEST.md   Every piece of old-site content and where it landed,
                        including what was deliberately dropped and why.
  build/PLAN.md         The original build spec and the client checklist.
  build/STATE.md        Phase log, plus the Corrections table that binds.
  qa/                   Every QA artifact: axe reports, Lighthouse runs, link
                        sweeps, duplication reports, screenshots at three
                        breakpoints for every route.

_source/                The harvested mirror of the old WordPress site.
  pages/*.md            *** The parity baseline. Verbatim copy, per page. ***
  html/                 Raw HTML, for verification. Git-ignored.
  extracted/            *** LOSSY. NEVER USE. See gotchas. ***
  media/                Every image the old site referenced.
  manifest.json         Counts, route map, redirect map, dead assets.

Client Logos/                                Supplied originals. Inputs to the
Website - List of Podcast Sponsors - Logos/  asset pipeline. Not deployed.
Damian Mason Logos/
```

### What owns what

- **A route owns its own copy.** Page-specific strings sit as named consts at
  the top of `app/<route>/page.tsx`, next to a comment explaining where they
  came from in `_source`.
- **`content/` owns anything that appears on more than one route.** If a string,
  a logo, a quote or a number shows up twice, it lives in `content/` and both
  routes import it. This is not tidiness. Six separate QA findings were caused by
  the same fact being hand-typed twice and the two copies drifting.
- **`content/site.ts` owns every contact detail and the nav tree.** Header,
  footer, JSON-LD and the mailto links all read from it.
- **`src/styles/tokens.css` owns every color, size and duration.** No component
  contains a raw hex value or an arbitrary pixel value.
- **`scripts/normalize-assets.mjs` owns `public/img/`, `content/clients.ts`,
  `content/sponsors.ts` and `content/brand-assets.ts`.** Hand edits to the
  `width` and `height` fields in those files will be overwritten.

---

## 4. How to change the things that actually change

Every recipe below is a real file path. After any change, run `npm run build` and
confirm it exits clean before deploying.

### Recipe 1: Add a client logo

1. Put the image file into the `Client Logos/` folder at the repo root. Any
   common format. It does not need to be resized, renamed or cleaned up.
2. From the repo root, run `node scripts/normalize-assets.mjs`.
3. That script writes a kebab-case PNG or JPG plus a WebP sibling into
   `public/img/clients/`, then adds a row to `content/clients.ts` with the real
   output dimensions, then hands off to `scripts/normalize-logo-ink.mjs`, which
   trims the new mark to its actual ink and re-pads it so it sits at the same
   optical weight as the other 21 on the wall.
4. Open `content/clients.ts` and check the `name` on the new row. The script
   derives it from the filename and it is often wrong or abbreviated. This string
   is the logo's alt text, so it is what a screen reader announces.
5. Three places carry a hard count of the logos in visible prose. If the wall is
   no longer 21 marks, they are now wrong:
   - `app/page.tsx`, the `LogoWall` `intro` prop, which ends "and 16 more."
   - `app/speaking/page.tsx`, the `LogoWall` `intro` prop.
   - `app/reviews/page.tsx`, the `LogoWall` `meta` prop, currently "21 of 2,400+".
6. `npm run build`.

### Recipe 2: Remove a client logo

1. Delete the row from `content/clients.ts`.
2. Delete the matching files from `public/img/clients/` (both the PNG or JPG and
   the WebP sibling).
3. Delete the original from the `Client Logos/` folder, otherwise the next run of
   `normalize-assets.mjs` puts it straight back.
4. Update the three prose counts listed in step 5 of recipe 1.
5. `npm run build`.

### Recipe 3: Add a podcast sponsor

1. Put the logo into the `Website - List of Podcast Sponsors - Logos/` folder.
2. Run `node scripts/normalize-assets.mjs`.
3. Open `content/sponsors.ts` and fill in the `url` field on the new row. The
   script cannot know it and leaves it empty. **A sponsor with no URL renders as
   a logo with no link, which is correct behavior, not a bug.** Confirm the URL
   resolves before shipping it.
4. Check the `name` field, same reason as recipe 1 step 4.
5. `app/the-business-of-agriculture/page.tsx` carries the `SponsorWall` `intro`
   prop, which currently opens "Ten sponsors." That count is now wrong.
6. `npm run build`.

### Recipe 4: Add a testimonial

1. Open `content/testimonials.ts`. Add an entry to the `testimonials` array:
   ```ts
   {
     id: 'jane-doe-acme',          // unique, kebab-case, never reused
     quote: 'The quote body, without surrounding quotation marks.',
     name: 'Jane Doe',             // empty string renders no byline
     title: 'Director of Events',  // optional
     organization: 'Acme Ag',      // optional
     sourcePage: '/reviews/',      // where it came from, for traceability
   }
   ```
   The `Quote` component supplies the outer quotation marks. Do not type them.
2. A testimonial in the array does not render anywhere until a route asks for it.
   Add the new `id` to the route's list in `testimonialsByRoute`, at the bottom of
   the same file. `/reviews/` is the main page and currently holds ten.
3. **Before adding an id to a route, check two things.** The site-wide footer
   hard-codes the `b-kettler-ihla` quote in `components/layout/Footer.tsx`, so
   putting that id on any route renders it twice on that page. And several routes
   have standfirst copy that states a count ("Ten more on the reviews page"), so
   changing the size of `/reviews/` breaks arithmetic elsewhere. Both of these
   have already caused shipped defects.
4. `npm run build`.

### Recipe 5: Add an FAQ item

1. Open `content/faq.ts`. Add an entry to the `faq` array:
   ```ts
   {
     id: 'travel-from-where',           // unique, kebab-case
     question: 'Where does Damian travel from?',
     answer: 'Plain text. No markup.',
     topics: ['travel'],                // booking, travel, technology,
                                        // program, audience, fees
   }
   ```
2. `topics` controls where it appears. `/` and `/meeting-coordinators/` render
   the whole list. `/keynote/` renders everything except one item. Adding an item
   with no topics still shows it on the pages that render the full list.
3. If the answer needs a link, do not put a URL in `answer`. The `answer` string
   is serialized verbatim into the FAQPage structured data that Google reads, and
   markup there is a defect. Add a `links` array instead:
   ```ts
   links: [{ match: 'exact text from the answer', href: '...', label: 'what the reader clicks' }]
   ```
   `match` must appear in `answer` exactly once.
4. `npm run build`.

### Recipe 6: Add a blog post

1. Open `content/posts.ts`. Add an entry to the `posts` array:
   ```ts
   {
     slug: 'kebab-case-url-segment',    // becomes /blog/<slug>/
     title: 'The headline',
     seoTitle: 'Shorter headline',      // optional, used when title is too long
                                        // for a search result
     date: '2026-08-07',                // ISO
     excerpt: 'One or two sentences for the card on /blog/.',
     author: 'Damian Mason',
     authorRole: 'wrote',               // 'wrote' or 'posted'. 'posted' means
                                        // somebody else wrote it and the byline
                                        // reads "Posted by".
     body: 'Full body, as markdown.',
     heroImage: '/img/photos/...',      // optional
     heroAlt: '...',                    // required if heroImage is set
     sourceUrl: 'https://...',          // optional outbound piece
   }
   ```
2. **Second file, easy to miss.** Open `app/sitemap.ts` and add the new slug to
   the `BLOG_POST_SLUGS` array. Without this the post exists and is reachable but
   is absent from the sitemap.
3. The route itself needs no changes. `generateStaticParams` in
   `app/blog/[slug]/page.tsx` reads `posts` directly, so the page is prerendered
   automatically on the next build.
4. `npm run build`.

### Recipe 7: Change the phone number or the email address

1. Open `content/site.ts`. There is exactly one place:
   ```ts
   export const contact = {
     email: 'damianmasonoffice@gmail.com',
     phone: '888.304.0702',
     phoneHref: 'tel:+18883040702',
   } as const;
   ```
2. Change all three if the phone number changes. `phone` is what a visitor reads,
   `phoneHref` is what a phone dials, and they are separate because the readable
   form uses periods and the dialable form needs `+1` and no punctuation.
3. Nothing else needs touching. The footer, the contact page, the BoASG join
   button, the mailto links and the structured data all read from this object.
4. `npm run build`.

### Recipe 8: Swap a photograph

1. Put the new file in `public/img/photos/`. Match the existing naming style
   (lowercase, hyphens, no spaces). Keep it under about 2000px on the longest
   side.
2. Find every reference:
   ```bash
   grep -rn "old-filename" app/ components/ content/
   ```
3. For each hit, update the `src`, and update the `width` and `height` props on
   the same `next/image` tag to the new file's real pixel dimensions. **These are
   not decorative.** They are what stops the page jumping while the image loads,
   and the site currently measures a cumulative layout shift of exactly zero.
   Get them from `sips -g pixelWidth -g pixelHeight <file>` on macOS.
4. Alt text lives in one of two places. If the image appears on more than one
   route, its alt string is in `content/image-alt.ts`, keyed by path. Rename the
   key and rewrite the description. If it appears on one route only, the alt is
   inline at the call site.
5. Alt text must describe the new photograph, not the old one. `content/image-alt.ts`
   exists because three routes once carried three different descriptions of the
   same file, one of them naming a window that was not in the frame.
6. Delete the old file from `public/img/photos/`.
7. `npm run build`.

### Recipe 9: Change a page's title and meta description

1. Open `app/<route>/page.tsx`. Near the top, every route has:
   ```ts
   export const metadata: Metadata = buildMetadata({
     title: 'Ag Economist, Comedian, Farm Owner',
     description: '...',
     path: '/about/',
   });
   ```
2. `title` is the page name only. `buildMetadata` appends `| Damian Mason`
   automatically. Keep the combined length under about 60 characters or Google
   truncates it. The 19 current titles are all under 62.
3. `description` should run 140 to 160 characters. The current 19 all sit between
   146 and 158. Under 120 and Google writes its own; over 160 and it gets cut.
4. Every title and every description on the site is unique. Keep it that way:
   duplicates are one of the few SEO faults that a search console will flag
   directly.
5. For the two blog posts, the title comes from `content/posts.ts` (`title`, or
   `seoTitle` when present) and the description from `excerpt`. There is no
   `buildMetadata` call to edit.
6. `npm run build`.

---

## 5. The scripts

Run everything from the repo root. Everything that talks to a browser needs a
server already running, and defaults to `http://localhost:3100`.

`playwright` is a dev dependency but its browser binaries are not. Run
`npx playwright install chromium` once before using any of the browser harnesses.

### Asset pipeline

| Script | What it does |
|---|---|
| `scripts/normalize-assets.mjs` | The main pipeline. Reads the three supplied logo folders and `_source/media/`, writes kebab-case images plus WebP siblings into `public/img/`, caps logos at 800px and photos at 2000px, strips EXIF, and rewrites `content/clients.ts`, `content/sponsors.ts` and `content/brand-assets.ts`. Deliberately never reads `LOGO-REVISION-B-A-F-01 copy.png`, which the client asked to be omitted. Calls the ink pass below at the end of its run. |
| `scripts/normalize-logo-ink.mjs` | Trims each of the 31 logo-wall marks to its real ink and re-pads it, so the wall scales on the artwork rather than on whatever margin the supplier baked in. Writes `src/styles/logo-optical.css`. `--report` measures without writing. |
| `scripts/normalize-brand-art.mjs` | The same treatment for the handful of brand marks placed as marks (the Granary, XtremeAg, the BoASG badge). `--report` measures without writing. |
| `scripts/build-app-icons.mjs` | Derives `app/apple-icon.png` (180x180) and `app/favicon.ico` from the master `app/icon.png`. `npm run build:icons` writes, `npm run check:icons` verifies they are in sync. The master is a hand-made crop and is never regenerated. |
| `scripts/transcode-video.sh` | Transcodes the three demo reels to 720p H.264 at CRF 25. Took the set from 110MB to 22MB. Needs ffmpeg, which is not installed globally on the build machine; the header comment gives the one-liner that provides it without touching this project's `package.json`. |

### QA harnesses

| Script | What it does |
|---|---|
| `scripts/a11y.mjs` | axe-core over all 19 routes at 1440 and 390, tagged `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and nothing else. Writes a JSON report and a readable summary. Exits 1 on any violation, so it can gate a build. Last run: 0 violations across 38 runs. |
| `scripts/a11y-manual.mjs` | The eight checks axe cannot make, driven through a real browser with real key events: skip link, tab order, focus visibility, keyboard traps, header dropdown keyboard behavior, mobile sheet focus trap and restore, landmarks, form control names, text spacing, 200 percent zoom, and alt-text quality. |
| `scripts/lighthouse.mjs` | Lighthouse in mobile and desktop form factors, three runs per route, median reported. **Point it at a production server, not the dev server.** Writes per-run category scores, Core Web Vitals, the LCP element per route, and every opportunity worth more than 0.2s. |
| `scripts/link-sweep.mjs` | Renders every route in Chromium and collects every href, src, srcset candidate, CSS `url()`, `<source>` and `<track>`. Requests all of them, internal and external, and records full redirect chains. Flags 404s, 5xx, empty hrefs, `#` hrefs, any surviving `wpengine.com` URL, bare `http://`, internal links missing a trailing slash, and zero-width images. Extracts every JSON-LD block. Changes nothing. |
| `scripts/dupe-check.mjs` | Finds repeated copy. Takes the visible text of `<main>` on all 19 routes, strips the parts that are supposed to repeat, and reports every word run of 8 or more words that occurs twice, on one route or across two. The site's recurring copy defect was repetition, and three rounds of manual review only moved it around. This measures it. |
| `scripts/nojs-check.mjs` | Loads every route with JavaScript disabled and asserts that no content is hidden and no video is unreachable. Catches two specific regressions: a scroll-reveal that hides content by default, and a video facade whose play button is dead without scripting. |
| `scripts/orange-check.mjs` | Enforces the design system's one-field rule: at most one filled-orange element of button size may be visible in any single viewport. Counts at scroll position 0 and reports the worst window found while scrolling, because the masthead is sticky. |
| `scripts/measure-logo-wall.mjs` | Measures what a visitor actually sees on both logo walls: the rendered box of every mark at real viewport widths, after the reveal stagger settles. Reports height spread, width spread, and optical spread. Optical is the one that should read 1.0x. |
| `scripts/shoot.mjs` | Screenshot harness. `--targets <file.json> --out <dir> [--widths 390,768,1440]`. Waits for fonts and lazy images so it never catches a half-painted page. |
| `scripts/probe.mjs` | Slices each route into readable viewport-height chunks at DPR 1, plus a deep overflow probe that finds elements wider than the viewport including ones clipped by an ancestor, which a document-level `scrollWidth` check cannot see. |
| `scripts/interactive.mjs` | Exercises the three things a static screenshot cannot reach: the open mobile menu, an opened FAQ answer, and the newsletter form. Measures each in its open state. |
| `scripts/gaps.mjs` | Finds headings colliding with the content below them, and text blocks ending in a single orphaned word. |
| `scripts/build-qa.mjs` | The isolated production build described in section 2. `npm run build:qa`. |

Files in `scripts/` beginning with an underscore are throwaway probes written
during specific QA rounds. They are not part of the pipeline and can be deleted.

---

## 6. The 301 redirect map

All of these live in `next.config.ts` under `redirects()`. Every URL the old
WordPress site had indexed either still resolves or redirects somewhere sensible.
Order matters in one place, noted below.

| Old URL | Goes to | Why |
|---|---|---|
| `/shop` | `/about/#books` | The store is gone. The books still exist as credibility, so the shop funnel lands where the titles now live. |
| `/damian-mason-online-shop` | `/about/#books` | Second indexed name for the same store page. |
| `/cart` | `/about/#books` | WooCommerce cart. Removed with the store. |
| `/checkout` | `/about/#books` | WooCommerce checkout. Removed with the store. |
| `/my-account` | `/about/#books` | WooCommerce account page. There are no accounts now. |
| `/product/business-of-ag-success-group` | `/boasg/` | This one WooCommerce "product" was not a book, it was the BoASG membership. It gets its own rule so it does not fall into the books bucket. **This rule must stay declared before the `/product/:slug*` wildcard below it, or the wildcard wins and the membership page becomes unreachable from its old URL.** |
| `/product/:slug*` | `/about/#books` | Every remaining product page. Three of the four were book listings. |
| `/product-category/:slug*` | `/about/#books` | WooCommerce category archives. |
| `/podcast-2` | `/podcasts/` | An orphaned WordPress stub that Google had indexed. It now lands on the real podcast hub, which did not exist before. |
| `/join-mailing-list` | `/join-the-conversation/` | Two newsletter routes on the old site did the same job. They collapsed into one. |
| `/hello-world` | `/blog/eggflation-gives-producers-record-profits/` | The first blog post shipped on WordPress's default sample-post slug and was never renamed. It has a real slug now. |
| `/how-the-climate-crisis-is-causing-food-shortages-globally` | `/blog/how-the-climate-crisis-is-causing-food-shortages-globally/` | Both posts moved under `/blog/`. Same slug, new parent. |

All twelve are 301 (permanent), which is what tells a search engine to move its
index. The build originally emitted 308s and they were changed deliberately.

One known wrinkle: a legacy URL typed without a trailing slash takes two hops,
a 308 to add the slash and then the 301. Both terminate at 200 at the correct
destination. This is inherent to the `trailingSlash: true` convention and is not
worth disabling that convention over.

---

## 7. Gotchas

### 7.1 `_source/extracted/` is lossy. Never read it.

`_source/` contains three views of the old site. Two are trustworthy and one is
not.

- `_source/pages/*.md` is the **parity baseline**. Verbatim copy, harvested by
  hand from raw HTML. This is the source of truth for what the old site said.
- `_source/html/*.html` is the raw markup, for verification.
- `_source/extracted/*.txt` **silently drops content.** It loses `<blockquote>`
  bodies nested inside Divi text modules. In practice that cost the reviews page
  all ten testimonial quote bodies, the BoASG biography paragraph, the keynote
  program description and the footer testimonial. It does not error, it does not
  warn, it just produces a shorter file that looks complete.

Anyone verifying a copy question, or restoring something believed missing, reads
`_source/pages/*.md`. The extracts exist only because they were an intermediate
artifact and deleting them mid-build would have broken a script. Treat them as
deleted.

### 7.2 The logo pipeline is idempotent, and must be re-run after adding a logo

`normalize-logo-ink.mjs` and `normalize-brand-art.mjs` are safe to run twice.
They achieve that by refusing to work rather than by hoping the arithmetic round
trips: a second run measures each file, finds it already at the planned size with
the planned padding, and leaves the bytes alone.

That guard is load-bearing. Without it a JPEG mark drifts, because every
re-encode lays down a fresh ring of near-white artifacts along the ink, the next
trim reads those artifacts as artwork, and the mark shrinks a little every run.
`iowa-farm-bureau` walked 222 to 221 to 208 pixels tall over three runs during
testing.

Two consequences:

1. **A newly added logo is not finished until the pipeline has run.** Dropping a
   file into `Client Logos/` and copying it into `public/img/clients/` by hand
   gives you a mark that is sized by whatever margin the supplier baked around
   it, which on this wall reads as one logo that is mysteriously smaller than
   its neighbors. Run `node scripts/normalize-assets.mjs`.
2. **`normalize-assets.mjs` calls the ink pass itself, at the end of its run.**
   That is not redundancy. `normalize-assets.mjs` regenerates the same files from
   the supplied originals and would otherwise put the margins straight back.

Both scripts need `sharp`. It is present in `node_modules` because Next 16 depends
on it, but it is not declared in this project's `package.json`, so a future Next
upgrade that drops that dependency will break the asset pipeline with a confusing
module-not-found error. If that happens, `npm install --save-dev sharp`.

### 7.3 Do not write the build's own reasoning into visitor-facing copy

This is the single largest defect class the project produced, and it is worth
understanding before anyone edits a string.

Across six QA rounds, the finding count went 80, 27, 45, 49, 9, 3. Rounds 3 and 4
went **up**, because the agents fixing round 2 introduced 6 new defects and the
agents fixing round 3 introduced 16. Almost all of that damage was one thing:
implementation notes leaking into rendered prose.

Real examples that shipped and had to be removed:

- On `/about/`: "Read the credentials first if you're the one signing the
  contract." A reading instruction. It survived three separate fix attempts.
- On `/the-business-of-agriculture/`: "Libsyn's player brings about 2.5MB of its
  own code and artwork with it, so it waits here until you want it." A
  performance-engineering rationale, in megabytes, told to a visitor.
- On `/blog-news/` and a blog post: "Nothing loads from YouTube until you press
  play." An explanation of the site's own lazy-loading behavior.
- On `/about/`: "What follows is the jacket copy, word for word, so it's the
  publisher's pitch and not ours." A sourcing disclosure.
- On `/reviews/`: a panel labelled "Testimonials on this page", the only proof
  panel on the site that described the website instead of the world.

**The test:** would Damian say this sentence out loud to a meeting planner? If it
describes the website, the build, the data or the reading order rather than
describing the world, it does not belong in rendered output. Put it in a code
comment. The code comments in this repo are unusually long precisely because that
is where this material is supposed to live.

The second half of the same lesson: **do not rewrite prose you were not asked to
touch.** Round 5 froze copy entirely and the finding count collapsed from 49 to
9. Most rewrites in rounds 3 and 4 were improvements in isolation and regressions
in aggregate, because a route's copy is load-bearing for other routes: a
standfirst says "ten more on the reviews page", a heading says "Two books and an
audiobook", an intro says "and 16 more". Changing one number in one place breaks
arithmetic somewhere the editor never looked.

Before editing any copy, read `docs/VOICE.md`. Before editing copy that states a
count, run `grep` for the count first.

### 7.4 Other things worth knowing

- **No em dashes, anywhere.** Client instruction. Four appeared inside verbatim
  third-party quotes and were normalized to commas and a colon, which is recorded
  in `docs/build/STATE.md` because it alters direct quotes. Grepping `content/`,
  `app/` and `components/` for U+2014 must return nothing:
  `grep -rnP "\x{2014}" content/ app/ components/`
- **Curly apostrophes only in copy.** The old site had mixed apostrophe styles on
  three pages and it was logged as a defect. `grep -rnP "[A-Za-z]'[A-Za-z]" app/ content/ components/ --include='*.tsx' --include='*.ts'` should return only comment lines.
- **`public/photos/` is empty and unused.** All photographs live in
  `public/img/photos/`. The empty directory is a leftover.
- **`content/pages/` is empty.** The plan reserved it for per-page copy files;
  per-page copy stayed in the route files instead. Harmless.
- **`public/img/logos/` is not the client wall.** It holds seven marks mirrored
  from the old site that are not in the supplied folders, including John Deere,
  BASF, Helena and the Iowa Pork Alliance. They render nowhere. See open item 2.
- **`app/icon.png` is a hand-made crop and is the master.** Never regenerate it
  from the JPEG source; re-deriving it would silently change the artwork. The
  other two icon files are pure resizes owned by `build-app-icons.mjs`.
- **The three demo reels have no captions.** This is the only known WCAG failure
  on the site. It needs transcripts, not code. See open item 10.

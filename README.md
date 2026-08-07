# damianmason.com

The website of Damian Mason: agricultural economist, keynote speaker, podcaster
and author.

This repository is a ground-up rebuild. It replaces a stock-Divi WordPress site
that ran on WP Engine, and none of that software survives. The content does:
every page, heading, testimonial, FAQ answer, video and image from the old site
was harvested word for word before anything new was written, and that harvest
lives in `_source/pages/*.md`. It is the parity baseline. When you need to know
what the old site said, read those files, not `_source/extracted/`, which is a
lossy machine dump kept only for cross-referencing.

Commerce is not carried over. There is no shop, cart, checkout or account. The
three books appear on `/about/` as credibility, with no prices. The old store
URLs are answered by permanent redirects in `next.config.ts` so nothing that
Google indexed returns a 404.

---

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16.3, App Router, Turbopack |
| UI | React 19.2, TypeScript 5, strict mode |
| Styling | Tailwind v4, CSS-first. There is no `tailwind.config.js`. Tokens live in `src/styles/tokens.css` and are mapped in `app/globals.css` |
| Fonts | `next/font`, four families, self-hosted. No font CDN |
| Content | Typed TypeScript modules under `content/`. No CMS, no database |
| Hosting | Vercel |

There is no analytics, no tag manager, no cookie banner and no client-side
router beyond Next's own. Third-party code appears in exactly three places: a
YouTube embed, a Libsyn podcast player and a Mailchimp signup form, and all
three are described under [Security headers](#security-headers) below.

---

## Local setup

You need Node 24. The version is pinned in `package.json` under `engines`, both
so Vercel picks the right runtime and so `npm install` warns you if your local
Node is older.

```bash
git clone https://github.com/omid-ctrl/DamianMason.git
cd DamianMason
npm install        # no postinstall steps, nothing native to compile
npm run dev        # http://localhost:3100
```

### Why port 3100

`npm run dev` is `next dev -p 3100`, not the stock port 3000. On the machine
this site was built on, port 3000 is permanently held by an unrelated Next
project, and every QA harness in `scripts/` defaults to `http://localhost:3100`
for that reason.

The failure mode is quiet and expensive. Start on 3000 while the other project
is running and Next moves you to 3001 without stopping, your browser shows
somebody else's site, and every QA script keeps aiming at 3100 and finds
nothing.

**Check the tab title every time you start the server.** The home page reads
`Damian Mason, Agricultural Keynote Speaker`. If it says anything else you are
looking at the wrong port.

### Build and serve

```bash
npm run build      # production build into .next
npm start          # serves that build on http://localhost:3000
```

Any performance measurement has to be taken against a production build.
Lighthouse numbers from a dev server mean nothing.

### Building while the dev server is running

Do not. Turbopack keeps a persistent cache inside the output directory and two
processes cannot share one. The build dies before it compiles anything, with
`Failed to open database / Loading persistence directory failed`, and the only
cure is deleting `.next`, which takes the dev server down with it.

Use a separate output directory instead:

```bash
npm run build:qa                                 # builds into .next-qa
NEXT_DIST_DIR=.next-qa npx next start -p 3200    # serve it on :3200
```

`scripts/build-qa.mjs` runs `tsc --noEmit` first, so nothing is checked less
than a normal build, and it restores `tsconfig.json` afterwards, because
`next build` rewrites the include list whenever it is pointed at an alternate
output directory. `.gitignore` already carries `/.next-*/`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3100 |
| `npm run build` | Production build into `.next` |
| `npm start` | Serves the production build |
| `npm run build:qa` | Type-checks, then builds into `.next-qa` without touching `.next` |
| `npm run lint` | ESLint, flat config in `eslint.config.mjs` |
| `npm run build:icons` | Regenerates `app/icon.png` and `app/apple-icon.png` from the master monogram |
| `npm run check:icons` | Fails if the generated icons have drifted from the master |

`scripts/` also holds the QA harnesses used during the build: Lighthouse runs,
axe accessibility sweeps, link sweeps, screenshot capture and asset
normalisation. They are development tools, not part of the deploy. Files there
named `_*-tmp.mjs` are throwaway probes from individual QA rounds.

---

## Repo map

```
app/                One directory per route, each holding page.tsx plus its own
                    page.module.css. Route-specific copy sits at the top of
                    page.tsx as named consts.
  layout.tsx        Root layout: fonts, header, footer, site-wide JSON-LD,
                    metadataBase.
  sitemap.ts        sitemap.xml, generated from _source/manifest.json
  robots.ts         robots.txt
  opengraph-image.tsx   The default social card, rendered at build time
  icon.png          Master favicon, the DM monogram
  not-found.tsx     404
  error.tsx         Route-level error boundary
  global-error.tsx  Root error boundary
  api/contact/      The only server endpoint. See "Environment variables"

components/
  layout/           Header, primary nav, mobile menu, footer
  sections/         Hero, testimonials, logo walls, video and podcast embeds,
                    newsletter form, FAQ accordion, stat ledger
  ui/               Token-driven primitives: Button, Card, Heading, Section
  motion/           The scroll reveal controller
  seo/              JSON-LD emitter

content/            All copy and data. See below
lib/                seo helpers, canonical URLs, schema.org builders,
                    contact-form validation
src/styles/         Design tokens and the component CSS layers
public/             Images, video, brand assets
_source/            The harvested old site. Reference material, never deploy
                    input. manifest.json is the exception: sitemap.ts imports it
docs/               Design system, voice guide, content manifest, QA reports
scripts/            QA harnesses and asset pipelines
```

---

## Where content lives

Everything a CMS would own is in `content/`, as plain typed TypeScript. There
is no fetch, no markdown parser and no build step between these files and the
page.

| File | Holds |
| --- | --- |
| `content/site.ts` | Site name, tagline, production URL, contact details, socials, the nav tree |
| `content/testimonials.ts` | Client quotes and attributions |
| `content/videos.ts` | Every video on the site, YouTube ID or local file, plus framing and poster notes |
| `content/posts.ts` | The two blog posts |
| `content/clients.ts`, `sponsors.ts` | The two logo walls |
| `content/books.ts`, `credentials.ts`, `press.ts`, `faq.ts` | About page material |
| `content/brand-assets.ts`, `media-band.ts`, `job-titles.ts` | Brand art, the press band, the audience descriptors |
| `content/image-alt.ts` | Alt text, kept in one place so it can be reviewed as a set |

Route-specific copy that only one page uses lives at the top of that page's
`app/<route>/page.tsx` as named consts, not in `content/`.

`docs/CMS-READY.md` describes what swapping any of these for a real CMS would
involve. `docs/CONTENT_MANIFEST.md` maps every route to its source page in
`_source/pages/` and records every deliberate difference from the old site.

---

## Environment variables

The site builds and runs with none of these set. Copy `.env.example` to
`.env.local` if you need to override something locally.

| Variable | Required | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | The production origin. Defaults to `https://damianmason.com`. Every canonical URL, Open Graph URL, JSON-LD URL, `robots.txt` and `sitemap.xml` entry is built from it. Set it if the site ever moves. A trailing slash is stripped for you |
| `RESEND_API_KEY` | No | Enables email delivery from `/api/contact` via Resend. Must be paired with `CONTACT_TO_EMAIL` |
| `CONTACT_TO_EMAIL` | No | Where a contact submission is delivered |
| `CONTACT_FROM_EMAIL` | No | The From address. Defaults to Resend's shared sender, which works with no DNS setup. Point it at a verified address on the domain once Resend has verified it |
| `CONTACT_WEBHOOK_URL` | No | Fallback delivery. Posts the submission as JSON to any endpoint that accepts JSON: Formspree, Web3Forms, Zapier, Make |
| `CONTACT_WEBHOOK_TOKEN` | No | Sent as a Bearer token with the webhook post |
| `CONTACT_WEBHOOK_ACCESS_KEY` | No | Web3Forms' `access_key`, added to the payload when set |

`NEXT_PUBLIC_SITE_URL` carries the `NEXT_PUBLIC_` prefix because the navigation
components are client components that import `content/site.ts`, so the value has
to survive into the client bundle. It is read at build time, which means
changing it on Vercel requires a redeploy, not just a restart.

Vercel's own `VERCEL_URL` is deliberately never consulted. It names the
per-deployment hostname, so canonicals on a preview would point at a throwaway
origin. Previews already ship `X-Robots-Tag: noindex` from the platform, so
pointing their canonicals at production is both correct and stable.

`/api/contact` refuses to accept a message it cannot deliver. With no provider
configured it answers `501 no-provider-configured` rather than swallowing the
submission. Nothing in that handler logs a message body or a sender's address.

---

## Deploying

Vercel, from the GitHub repository, on the platform defaults.

1. Import `omid-ctrl/DamianMason` in Vercel. The framework preset detects as
   Next.js. Leave the build command, output directory and install command
   alone.
2. Node 24 is Vercel's current default and `engines.node` in `package.json`
   pins it explicitly, so the runtime needs no dashboard change.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://damianmason.com` for Production once
   the domain is attached. Until then the built-in default already points there.
4. Attach the domain. Confirm there is no plain-HTTP subdomain of
   `damianmason.com` still in service before the first production deploy: the
   HSTS header ships with `includeSubDomains` and a two-year max-age, and a
   browser that has cached it cannot be told to forget.
5. Add the contact-form variables only when a provider is chosen. The form
   degrades honestly without them.

There is no `vercel.json` and no `vercel.ts`, deliberately. Everything the
platform needs is already expressed in `next.config.ts`, which Vercel reads:
the redirect table, the security headers, `trailingSlash` and the image
optimizer's remote-host allowlist. Adding a platform config file would create a
second place for the same facts to live and drift.

Nothing sets `runtime = 'edge'`. `/api/contact` declares `runtime = 'nodejs'`
because its in-memory rate limiter wants the longer-lived instance, and Fluid
Compute serves it well.

### What the deploy produces

Twenty-seven routes prerender to static HTML at build time. One route,
`/api/contact`, is a Node function. Nothing else needs a running server:
there is no database, no server action, no `cookies()`, no `headers()` and no
incremental revalidation anywhere in the app.

`trailingSlash: true` is on, so every canonical URL ends in a slash and Next
issues a 308 to add one when it is missing.

---

## Security headers

Set on every response from `next.config.ts`, including the static HTML Vercel
serves from its CDN.

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | Locked to `'self'` plus the four origins the site actually contacts |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains`. No `preload`: submitting to the browser preload list is close to irreversible and is the domain owner's call |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY`, backing up `frame-ancestors 'none'` for older browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Deny by default, with autoplay, fullscreen, encrypted-media and picture-in-picture handed back to the two embed origins that need them |

The four origins the CSP allows, and nothing else:

- `i.ytimg.com` and `i9.ytimg.com` for YouTube poster stills
- `www.youtube-nocookie.com` for the player iframe, mounted only after a
  visitor presses play
- `play.libsyn.com` for the podcast player on `/the-business-of-agriculture/`
- `damianmason.us13.list-manage.com`, the only place the newsletter form may
  post to

`script-src` carries `'unsafe-inline'` as a recorded trade, not an oversight.
Next streams its RSC payload through inline scripts whose contents change every
build, so they can be allowed by nonce or not at all, and minting a nonce per
request means routing every response through middleware, which turns all
twenty-seven static pages into function invocations. The site renders no user
input anywhere, so the exposure that buys back is small. `script-src 'self'`
still means no third-party origin can serve script to this site at all, which
is the attack it is actually exposed to. The full reasoning is in the comment
block at the top of `next.config.ts`.

---

## Documentation

| Document | For |
| --- | --- |
| [`docs/HANDOFF.md`](docs/HANDOFF.md) | Start here. What was built, what changed from the old site, how to run and extend it |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Binding. Tokens, type scale, spacing, colour, every rule the CSS obeys |
| [`docs/VOICE.md`](docs/VOICE.md) | Binding. How this site is allowed to sound |
| [`docs/CONTENT_MANIFEST.md`](docs/CONTENT_MANIFEST.md) | Route by route parity against `_source/pages/`, with every deliberate difference recorded |
| [`docs/CMS-READY.md`](docs/CMS-READY.md) | What adding a CMS would involve |
| [`docs/QA_REPORT.md`](docs/QA_REPORT.md) | Six QA rounds: Lighthouse, axe, link sweeps, responsive checks |
| [`docs/OPEN-ITEMS.md`](docs/OPEN-ITEMS.md) | Everything knowingly left undone, and why |
| [`docs/design/DECISION.md`](docs/design/DECISION.md) | The three explored design directions and why this one won |

Before writing code, read `docs/DESIGN_SYSTEM.md` and `docs/VOICE.md`. They are
treated as binding by everything in this repo: no raw hex values, no arbitrary
pixel values, one `h1` per route, every value resolving to a token.

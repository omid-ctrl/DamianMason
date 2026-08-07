# DamianMason.com — Full Visual Rebuild

## Context

`damianmason.com` is a stock-Divi WordPress site on WP Engine for Damian Mason: ag-economics keynote speaker, podcaster, author, farm owner. The client wants a complete rebuild — same information architecture and page flow, dramatically better UI/UX and SEO, all existing content carried over, plus updated client logos, new podcast sponsor logos, and the correct brand logos placed on their respective pages.

The live site audit found the visual layer is generic Divi with real production defects: unedited "Your Title Goes Here" and Lorem Ipsum FAQ items live on the homepage and Meeting Coordinators, a broken `mailto:` (missing the `mailto:` prefix) on Contact Us, three empty-`href` CTAs, a 404 hero background on the flagship podcast page, macOS screenshot files used as marketing images, a blank indexed `/speaking/` stub, an orphaned `/podcast-2/`, footer links pointing at the old `damianmason.wpengine.com` staging domain, `user-scalable=0` blocking pinch-zoom, missing meta descriptions on most pages, no H1 on Contact, and no social icons or copyright anywhere in the footer.

This build is **front-end only — no CMS, no backend**. Content lives in typed files so a CMS becomes a data-layer swap later, not a rebuild.

**Delivery model:** one long autonomous session. A `/loop` driver reads a state file and runs each phase as an ultracode Workflow with subagent fan-out, with no human prompting between phases. It stops when final QA reports zero open findings.

---

## Decisions (assumptions — each is cheap to reverse)

| # | Decision | Rationale | How to reverse |
|---|---|---|---|
| 1 | **Design direction: "Editorial Heritage."** Evolve the existing navy + orange into a premium editorial system — deep navy ground, one disciplined orange accent, warm bone paper, harvest gold + deep green as property accents. Editorial serif display + clean grotesk body, large type scale, generous whitespace, real photography over screenshots. | The client explicitly keeps the current navy/orange **Damian Mason — Business Agriculture** wordmark. A green/bone or all-dark system would fight the logo. This delivers the "giant facelift" without orphaning the brand mark. | Everything routes through `src/styles/tokens.css`. Swapping palette + font pair changes the whole site from one file. |
| 2 | **Stack: Next.js (App Router) + TypeScript + Tailwind v4.** Content in typed TS/MDX under `/content`. Static-exportable. | Best SEO + image tooling; CMS retrofit is a data-layer change only. | — |
| 3 | **All commerce removed.** No Shop, Cart, Checkout, My Account, or product pages. Books appear as credibility on `/about/` with cover art and outbound purchase links — no prices, no cart. | Client: *"We are not selling product (books) moving forward."* | Flip `content/books.ts` `forSale` flag and restore a `/books/` route. |
| 4 | **BOASG:** the `$99/month` **Join Today** button (currently a WooCommerce checkout that will no longer exist) becomes a `mailto:damianmasonoffice@gmail.com` with a pre-filled subject/body. The separate "Sign Up for Damian's Mailing List" button stays pointed at the newsletter page. | Client: *"On the BOASG page: The Sign up Link…. We need to change the link to my email address (with some appropriate wording)."* The membership join is the link that **must** change once checkout is gone. Which of the two buttons they meant is the one genuinely ambiguous instruction — both are handled sensibly and it is logged as an open item. | One line in `content/pages/boasg.ts`. |
| 5 | **Contact email: `damianmasonoffice@gmail.com`** (confirmed by user), phone `888.304.0702`. Used for the BOASG join CTA and every other contact point. | Confirmed — not an assumption. | One constant in `content/site.ts`. |
| 6 | **Net-new pages:** `/about/`, `/speaking/` (real hub, replacing the blank stub), `/podcasts/` (real hub — the nav parent currently links nowhere). | Additive only; no existing page or content is lost. Fixes two dead nav parents and one indexed blank page. | Delete the route + redirect. |
| 7 | **Client logo wall = the 21 logos in `Client Logos/`**, replacing the 6 currently shown. | Client: *"Update client logos with logos in folder."* | — |

**Do not replicate any of the live-site defects listed in Context.** They are a fix list, not a spec.

---

## Information architecture

Same flow and accessibility as today. Dropdown parents that currently link nowhere now resolve to real hubs.

```
/                            Home
/about/                      NEW — bio, credentials, author/books, farm
/speaking/                   NEW hub (was a blank indexed stub)
  /keynote/
  /reviews/                  Testimonials
  /meeting-coordinators/
  /collaboration-opportunities/
/boasg/                      Business of Ag Success Group
/podcasts/                   NEW hub (nav parent had no link)
  /the-business-of-agriculture/
  /do-business-better-podcast/
  /xtreme-ag/                incl. The Granary
/media/  (slug stays /blog-news/, label "Media")
/acres-tv/
/blog/  +  /blog/[slug]
/contact-us/
/join-the-conversation/      Newsletter
```

**301 redirects:** `/shop/`, `/damian-mason-online-shop/`, `/cart/`, `/checkout/`, `/my-account/`, `/product/*` → `/about/#books` · `/podcast-2/` → `/podcasts/` · `/join-mailing-list/` → `/join-the-conversation/` · `/hello-world/` → the real post slug.

---

## Repo structure

```
app/                         routes (one dir per IA entry above)
components/
  ui/                        Button, Container, Section, Eyebrow, Heading, Card, Prose
  sections/                  Hero, LogoWall, SponsorWall, TestimonialGrid, VideoGrid,
                             FAQAccordion, NewsletterForm, CTABand, StatRow, EpisodeCard
  layout/                    Header (dropdown + mobile), Footer
content/
  site.ts                    contact, socials, nav, redirects
  pages/*.ts                 per-page copy, typed
  testimonials.ts  faq.ts  clients.ts  sponsors.ts  videos.ts  books.ts  press.ts
public/img/
  brand/  clients/  sponsors/  photos/  og/
docs/
  build/PLAN.md  build/STATE.md      loop driver reads these
  VOICE.md  DESIGN_SYSTEM.md  CONTENT_MANIFEST.md  QA_REPORT.md  HANDOFF.md
_source/                     harvested originals — reference only, git-ignored from deploy
  pages/*.md   media/   manifest.json
```

---

## Execution harness

**Prerequisite:** set `/config` → **Dynamic workflow size → large** (phases below exceed the default 15-agent guideline).

**Kickoff command in the fresh session (verbatim):**

```
/loop Execute the DamianMason rebuild per /Users/omidebrahimi/.claude/plans/lese-read-the-website-peaceful-cupcake.md.
Read docs/build/STATE.md for progress. Run the next incomplete phase as an ultracode Workflow with
subagent fan-out, mark it complete in STATE.md with a one-line result, and continue.
Stop the loop only when Phase 7 reports zero open QA findings.
```

The very first loop iteration writes `docs/build/PLAN.md` (a copy of this file) and `docs/build/STATE.md` (phase checklist, all unchecked) into the repo, so the loop is resumable if the session dies. Each phase commits on completion.

### Phase 0 — Foundation & content harvest (~12 agents)
Scaffold Next.js + TS + Tailwind v4. Then fan out:
- **6 harvest agents**, ~3 pages each across all 21 live URLs → `_source/pages/<slug>.md` with **verbatim** copy, every heading, every CTA label + href, every image URL, every video ID, every form field.
- **1 media agent** — mirror every referenced `wp-content/uploads` asset into `_source/media/`, normalizing the `damianmason.wpengine.com` URLs to canonical. Skip the known 404 (`Podcaster-34c.png`). Flag the two filenames containing literal spaces.
- **1 asset agent** — normalize the three supplied logo folders into `public/img/{clients,sponsors,brand}` as kebab-case, generate WebP + retina sizes, downscale `The Granary 3x png@3x.PNG` from 12801px, and **delete `LOGO-REVISION-B-A-F-01 copy.png` from the pipeline** (client: omit the Business·Agriculture·Food logo).
- **1 voice agent** → `docs/VOICE.md` from Damian's own bio and podcast-description paragraphs.

**Gate:** `_source/manifest.json` enumerates every page, image, video, testimonial and FAQ item. Nothing proceeds until the count matches the crawl.

### Phase 1 — Design system (~8 agents)
3 direction agents each produce a full token set + a rendered hero/section comp inside the Editorial Heritage brief → 3 judge agents score on distinctiveness, brand fit, and legibility → 1 synthesis agent writes `src/styles/tokens.css`, the Tailwind theme, `docs/DESIGN_SYSTEM.md`, and the `components/ui` primitives. Type scale, spacing scale, radii, shadows, and motion durations are all tokens; **no raw hex or arbitrary px in components.**

### Phase 2 — Global chrome & shared sections (~6 agents)
Header (dropdown + real mobile nav), Footer (fixing every gap: social icons, copyright, contact block, newsletter), SEO infrastructure (per-page metadata, JSON-LD for Person / Organization / PodcastSeries / FAQPage / BreadcrumbList, sitemap, robots, generated OG images), and the shared section components. `user-scalable=0` is not carried over.

### Phase 3 — Page build (pipeline, ~17 agents — one per route)
Each agent receives its `_source/pages/<slug>.md`, `docs/DESIGN_SYSTEM.md`, and `docs/VOICE.md`, builds the route, then self-verifies against its own source manifest before the item leaves the pipeline. Pages are built in parallel, not in lockstep.

### Phase 4 — Copy & SEO (~6 agents)
Expand and sharpen copy **in Damian's voice** per `docs/VOICE.md` — plainspoken, contraction-heavy, hard numbers over adjectives, dry humor in the juxtaposition rather than punchlines. **No em dashes. No "in today's fast-paced world", "delve", "landscape", "unlock", "elevate", "seamless", "robust".** Then: unique title + meta description per page (the live site has almost none), descriptive alt text on every image, internal linking pass, heading hierarchy flattened to one H1 per page.

### Phase 5 — Motion, responsive, a11y, performance (~6 agents)
Scroll-reveal and micro-interaction pass (restrained, `prefers-reduced-motion` respected), 390 / 768 / 1440 responsive pass, WCAG 2.1 AA contrast and keyboard/focus pass, image optimization and Core Web Vitals.

### Phase 6 — QA round 1, then fix-until-dry (~12 agents, up to 3 rounds)
- **Content-parity agents** — old page vs new page, line by line: every paragraph, testimonial, FAQ, video, image, and CTA accounted for or explicitly justified as removed.
- **Client-requirement agent** — the checklist below, item by item.
- **Visual QA** — dev server + Playwright screenshots at 3 breakpoints for every route, reviewed by vision agents against `docs/DESIGN_SYSTEM.md`.
- **Link/asset sweep** — zero 404s, zero broken images, zero empty `href`, zero `wpengine.com` URLs.
- **A11y + Lighthouse** — targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.

Findings feed fix agents, then re-verify. Repeat until two consecutive rounds surface nothing new.

### Phase 7 — Final QA & handoff
Full-site re-verification, clean `next build`, `docs/QA_REPORT.md`, `docs/HANDOFF.md`, `docs/CMS-READY.md` (where each content file maps to a future CMS collection), and `docs/OPEN-ITEMS.md`. Loop stops.

---

## Client requirement checklist (Phase 6 gate — every line must pass)

- [ ] All 21 logos from `Client Logos/` on the client wall, replacing the current 6
- [ ] All 10 logos from `Website - List of Podcast Sponsors - Logos/` on the podcast page (today the sponsors are plain text links, no artwork)
- [ ] `LOGO-REVISION-B-A-F-01 copy.png` (Business · Agriculture · Food) **appears nowhere**
- [ ] Header/footer wordmark is the current-site **Damian Mason — Business Agriculture** navy/orange logo
- [ ] Business of Agriculture logos on `/the-business-of-agriculture/`; BoASG badge on `/boasg/`; XtremeAg + The Granary on `/xtreme-ag/`
- [ ] No Shop / Cart / Checkout / product pages anywhere; no prices; no "Add to cart"
- [ ] FAQ item **"Do you have any products for sale?"** removed
- [ ] **Media Kit** link removed (both instances)
- [ ] BOASG join CTA is a `mailto:` with appropriate wording
- [ ] Every page, section and image from the old site carried over or explicitly justified
- [ ] Same IA and page flow; nothing became harder to reach
- [ ] Copy reads as Damian, not as AI; **zero em dashes**
- [ ] Every live-site defect from Context is fixed, none reproduced

---

## Reference data (harvested — saves the execution session a re-crawl)

- **Contact:** `damianmasonoffice@gmail.com` · `888.304.0702`
- **Socials:** facebook.com/DamianPMason · x.com/DamianPMason · linkedin.com/in/damianmason · youtube.com/@DamianMasonChannel · instagram.com/DamianPMason
- **Business of Agriculture podcast:** Libsyn show `504653` · RSS `feeds.libsyn.com/504653/rss` · Apple `id1291008696` · Spotify `0UDXsogtCT4uNF4CpDpUae` (**two conflicting Spotify IDs exist on the live page — consolidate to this one**) · show page `thebusinessofagriculture.libsyn.com`
- **Do Business Better:** SoundCloud `soundcloud.com/dobusinessbetter` (live page wrongly links the *other* show's SoundCloud, plus two `href="#"` placeholders)
- **Newsletter:** Mailchimp `damianmason.us13.list-manage.com` list `6456b31ef4`, fields FNAME/LNAME/EMAIL
- **Podcast sponsors** (link the supplied logos to these): Heads Up Plant Protectants `headsupst.com` · Tidal Grow `tidalgrowag.com` · Nano-Yield `nano-yield.com` · Good Agriculture `goodagriculture.com`
- **The Granary:** show filmed with XtremeAg in a granary-turned-tavern on Damian's Indiana farm → `xtremeag.farm/the-granary`
- **Proof points to feature:** 2,400+ audiences · 50 states · 7–8 countries · speaking since 1994 · Purdue Ag Econ · Second City Chicago · SAG member · 40,000+ monthly listeners · 70,000+ monthly podcast views/downloads
- **Signature keynote:** *The "Ations" of Agriculture* — immigration, population, regulation, confrontation, inflation, threats from other nations
- **Content volumes to preserve:** 15-item FAQ (minus the products question) · 10 written testimonials on `/reviews/` + 5 more across other pages · 11 videos (8 YouTube + 3 self-hosted MP4 demo reels: Food Waste, Labor, Innovation) · 9 press items on Media · 2 blog posts

---

## Open items for the client (collected in `docs/OPEN-ITEMS.md`)

1. Which BOASG button did they mean — the `$99/month` **Join Today** or the **mailing list** button? Both are handled sensibly; confirm before launch.
2. John Deere, BASF, Helena, and IPPA are on the current client wall but **not** in the supplied folder. Drop them or keep them?
3. No real Media Kit asset exists (the current link is a raw `.zip` on a staging domain, and is being removed per instruction). Want a proper speaker one-sheet built?
4. Professional photography is the single biggest remaining quality ceiling — several current images are literal macOS screenshots. New photography would lift the result further.

---

## Verification

Run from the repo root after the loop stops:

```bash
npm run build          # must exit clean, zero type errors
npm run dev            # then walk every route in the IA above
```

Then confirm by hand:
- `docs/QA_REPORT.md` shows zero open findings and every checklist line above passing
- Playwright screenshots in `docs/qa/screenshots/` at 390 / 768 / 1440 for every route
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100
- `grep -rn "—" content/ app/ components/` returns nothing (no em dashes)
- `grep -rn "wpengine.com" .` returns nothing
- `grep -rn 'href=""' app/ components/` returns nothing

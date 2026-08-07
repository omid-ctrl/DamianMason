# Build State — DamianMason.com Rebuild

**Spec:** `docs/build/PLAN.md` (read it in full before running any phase)
**Rule:** run the next unchecked phase, then check it off here with a one-line result and commit. Never skip a gate.

---

## Phases

- [x] **Phase 0 — Foundation & content harvest** (~12 agents)
      Scaffold Next.js + TS + Tailwind v4. 6 harvest agents over all 21 live URLs → `_source/pages/*.md` (verbatim).
      1 media agent mirrors `wp-content/uploads` → `_source/media/`. 1 asset agent normalizes the three supplied
      logo folders → `public/img/{clients,sponsors,brand}`. 1 voice agent → `docs/VOICE.md`.
      **Gate:** `_source/manifest.json` counts match the crawl (21 pages, 15 FAQ items, 15 testimonials, 11 videos, 9 press items, 2 posts).
      Result: **PASS (10 agents).** 28 pages harvested verbatim + `_global-chrome.md`; 70 media assets mirrored;
      21 client / 10 sponsor / 15 brand logos normalized to `public/img/` with WebP siblings; B-A-F logo confirmed
      absent; `docs/VOICE.md` built from a 2,098-word corpus of Damian's own prose. Gate corrected four plan counts
      with evidence: **16 videos** (13 YouTube + 3 MP4), not 11; **14 distinct FAQ questions** (45 raw toggles, 5 of
      them junk), 13 carry over after removing the products item; **17 testimonials** (15 speaking + 1 book
      endorsement + 1 footer quote); split is 22 pages + 2 posts + 4 products. See `## Corrections` below.

- [x] **Phase 1 — Design system** (~8 agents)
      3 direction agents → 3 judge agents → 1 synthesis agent. Outputs `src/styles/tokens.css`, Tailwind theme,
      `docs/DESIGN_SYSTEM.md`, `components/ui` primitives.
      **Gate:** no raw hex and no arbitrary px anywhere in components.
      Result: **PASS (7 agents).** Winner: **Direction 1, Editorial Broadsheet** (bone paper ground, navy as ink,
      Bodoni Moda display / Archivo body / IBM Plex Mono furniture). Took brand-fit 9 and execution 8; lost
      legibility 3, and every one of that lens's objections was a token value, all repaired. Tied direction 3 on
      raw score, won 2 of 3 lenses, no judge overridden. Grafted 15 ideas from the losers, notably direction 3's
      ledger stat row and duotone portrait and direction 2's `[data-surface="paper"]` scope. `tsc` clean,
      `next build` clean, zero raw hex in components, zero em dashes, `user-scalable` absent.

- [x] **Phase 2 — Global chrome & shared sections** (~6 agents)
      Header (dropdown + mobile), Footer (socials, copyright, contact, newsletter), SEO infra (metadata, JSON-LD,
      sitemap, robots, OG images), shared section components.
      **Gate:** `user-scalable=0` absent; every nav parent resolves to a real route.
      Result: **PASS (6 agents).** Header with masthead rail, keyboard-operable dropdowns, real mobile sheet with
      focus trap; all three href-less nav parents now resolve to `/speaking/`, `/podcasts/`, `/blog-news/`. Footer
      rebuilt from nothing: socials, copyright, contact, nav columns generated from the same `nav` tree so header
      and footer cannot drift. SEO infra (metadata builder, 8 JSON-LD builders, sitemap, robots, OG image).
      11 shared sections + 5 typed content files (17 testimonials, 13 FAQ, 16 videos, 9 press, 2 posts).
      `tsc` + `next build` clean.

- [ ] **Phase 3 — Page build** (pipeline, ~17 agents, one per route)
      Each agent gets `_source/pages/<slug>.md` + `docs/DESIGN_SYSTEM.md` + `docs/VOICE.md`, builds its route,
      self-verifies against its source manifest before leaving the pipeline.
      **Gate:** every route in the IA renders; every source item accounted for.
      Result:

- [ ] **Phase 4 — Copy & SEO** (~6 agents)
      Voice-consistent copy, unique title + meta description per page, alt text, internal linking, one H1 per page.
      **Gate:** zero em dashes; zero banned AI phrases.
      Result:

- [ ] **Phase 5 — Motion, responsive, a11y, performance** (~6 agents)
      Restrained motion honoring `prefers-reduced-motion`; 390/768/1440 responsive; WCAG 2.1 AA; image + CWV optimization.
      Result:

- [ ] **Phase 6 — QA + fix-until-dry** (~12 agents, up to 3 rounds)
      Content-parity (old vs new, line by line) · client-requirement checklist · Playwright visual QA at 3 breakpoints
      reviewed by vision agents · link/asset 404 sweep · a11y + Lighthouse.
      **Gate:** two consecutive rounds surface nothing new.
      Result:

- [ ] **Phase 7 — Final QA & handoff**
      Full re-verify, clean `next build`, write `docs/QA_REPORT.md`, `docs/HANDOFF.md`, `docs/CMS-READY.md`, `docs/OPEN-ITEMS.md`.
      **Gate:** zero open findings → stop the loop.
      Result:

---

## Client requirement checklist (Phase 6 gate — every line must pass)

- [ ] All 21 logos from `Client Logos/` on the client wall, replacing the current 6
- [ ] All 10 logos from `Website - List of Podcast Sponsors - Logos/` on the podcast page
- [ ] `LOGO-REVISION-B-A-F-01 copy.png` (Business · Agriculture · Food) appears nowhere
- [ ] Header/footer wordmark is the current-site Damian Mason — Business Agriculture navy/orange logo
- [ ] Business of Agriculture logos on `/the-business-of-agriculture/`; BoASG badge on `/boasg/`; XtremeAg + The Granary on `/xtreme-ag/`
- [ ] No Shop / Cart / Checkout / product pages; no prices; no "Add to cart"
- [ ] FAQ item "Do you have any products for sale?" removed
- [ ] Media Kit link removed (both instances)
- [ ] BOASG join CTA is `mailto:damianmasonoffice@gmail.com` with appropriate wording
- [ ] Every page, section and image from the old site carried over or explicitly justified
- [ ] Same IA and page flow; nothing became harder to reach
- [ ] Copy reads as Damian, not as AI; zero em dashes
- [ ] Every live-site defect listed in PLAN.md Context is fixed and none reproduced

---

## Corrections to PLAN.md (established by the Phase 0 gate, evidence in `_source/manifest.json`)

Later phases must build against these numbers, not the plan's.

| Plan said | Actually | Evidence |
|---|---|---|
| 11 videos (8 YT + 3 MP4) | **16** (13 YT + 3 MP4) | 13 distinct YouTube IDs, none site chrome, none repeated across pages |
| 15 FAQ items | **14 distinct**, 13 carried over | 45 raw toggles across 3 pages; 5 are junk (1 empty, 1 "Your Title Goes Here", 2 Lorem Ipsum, 1 with no answer) |
| 15 testimonials | **17** | 15 speaking + 1 unattributed book endorsement (home) + 1 footer quote (B. Kettler, IHLA, site-wide) |
| 21 pages + 3 posts + 4 products | **22 + 2 + 4** | `/blog/` is the archive, not a post |
| The Granary lives on `/xtreme-ag/` | **No source copy exists** | "granary" appears only on `/the-business-of-agriculture/` as a cross-promo link. The badge still goes on `/xtreme-ag/` per the client checklist, but the copy must be written |
| `/product/*` → `/about/#books` | BOASG is a **membership** → `/boasg/` | Specific redirect declared before the wildcard |

**Source-of-truth rule:** `_source/extracted/*.txt` is LOSSY. It silently drops `<blockquote>` bodies nested in
Divi text modules, which cost the reviews page all 10 testimonial quote bodies, the BOASG bio paragraph, the
keynote program description, and the footer testimonial. Harvest agents recovered every one from raw HTML.
**Downstream phases read `_source/pages/*.md` as truth and `_source/html/*.html` for verification. Never the extracts.**

**Defect count found on the live site: 250+ across 28 pages.** Highlights beyond the plan's list: a live
open-by-default FAQ panel reading "Your Title Goes Here", a second accordion opening on a completely empty item,
two byte-identical Lorem Ipsum toggles on Meeting Coordinators, **three** empty-href dropdown parents (Speaking,
Podcasts and Media, all with the attribute absent entirely), all six footer links pointing at
`damianmason.wpengine.com/?page_id=NNN`, a "Home" link on bare `http://DamianMason.com`, pasted Squarespace
markup faking testimonial attributions on three pages, Google SERP classes (`hgKElc`) pasted into
Collaboration Opportunities, a 39MB uncompressed self-hosted MP4, an invisible white-on-light attribution, and a
dead invisible full-width clickable row on the homepage.

---

## Build notes

**Dev server port: 3100.** Port 3000 on this machine is occupied by an unrelated Next 15 project. Always run
`npx next dev -p 3100` and point QA targets at `http://localhost:3100`, or screenshots will silently capture
someone else's site.

**Em dashes in quoted source content:** four appeared inside verbatim third-party quotes (2 testimonials, 1 FAQ
answer, 1 video title). The client asked for none on the site, so the punctuation was normalized to commas and a
colon. Meaning is unchanged; this is a deliberate editorial call, recorded here because it alters direct quotes.

---

## Log

_(append one line per completed phase: date, phase, agent count, outcome)_

- 2026-08-06 · Phase 0 · 10 agents · PASS. 28 pages harvested, 70 assets mirrored, 46 logos normalized, VOICE.md written, gate reconciled 6 plan discrepancies.
- 2026-08-06 · Phase 2 · 6 agents · PASS. Chrome + SEO + 11 sections + content layer; footer agent fixed a data-surface token bug that rendered navy on navy.
- 2026-08-06 · Phase 1 · 7 agents · PASS. Editorial Broadsheet wins 2 of 3 lenses; 15 ideas grafted from losers; all contrast failures repaired; tsc + next build clean.

# QA Report, damianmason.com rebuild

**Written at the close of Phase 7.** Covers the whole build, not just the last pass.

Audience: the client, and whoever maintains this site next. Section 7 is the one to read if you
are picking this up cold.

All measurements in this report were taken against the code in this repository at commit
`a685c5d`, served from a clean production build. Where a number is disputed or uncertain, the
report says so rather than picking the flattering one.

---

## 1. Verdict

**The site is ready to ship.** Every gate in `docs/build/PLAN.md` passes, every one of the 13
client checklist lines passes, and the final verification pass found no blocker and no major
finding across three independent audits.

The hard numbers:

| Gate | Target | Result |
|---|---|---|
| `npx tsc --noEmit` from a clean tree | exit 0 | **exit 0** |
| `npx next build` from a clean tree | exit 0 | **exit 0**, 27 static pages, 21 prerendered HTML files |
| Lighthouse Performance | 90 or better | **93 to 95** mobile, **100** desktop, on all 13 audited routes |
| Lighthouse Accessibility | 95 or better | **100** on all 13 routes, both form factors |
| Lighthouse Best Practices | 95 or better | **100** on 12 of 13; `/blog-news/` mobile at 96 |
| Lighthouse SEO | 100 | **100** on all 13 routes, both form factors |
| axe WCAG 2.1 A and AA | 0 violations | **0** across 19 routes x 2 widths |
| Internal 404s | 0 | **0** of 390 internal URLs |
| Broken images | 0 | **0** |
| Empty `href`, `href="#"`, `wpengine.com`, `user-scalable` | 0 | **0** in all 21 prerendered pages |
| Horizontal overflow at 360 and above | 0 routes | **0** of 19 routes at 6 widths, 114 checks |
| Cumulative Layout Shift | under 0.1 | **0.000** on every route, mobile and desktop |
| Client checklist | 13 of 13 | **13 of 13 PASS** |

### What is not done

Four things, none of which blocks launch, and one of which is a genuine accessibility failure.

1. **The three self-hosted demo reels have no caption track.** This fails WCAG 2.1 Success
   Criterion 1.2.2 Captions at **Level A**. It is the only known WCAG failure on the site, and no
   automated tool can see it, which is why the axe result of zero violations in section 4 must not
   be read as full AA conformance. It needs a transcript, which is a content job, not a code job.
   Detail in section 6.1.
2. **The mobile nav sheet has no scroll affordance at very short viewports.** At 360px tall
   content areas and below the link list scrolls, every destination is reachable, and nothing is
   trapped, but a user cannot tell by looking that the list continues. Detail in section 6.2.
3. **One route overflows its viewport by 1 pixel at 320px wide.** `/meeting-coordinators/`, caused
   by the unbreakable word "Coordinators" at the hero display size. Re-confirmed by hand at the end
   of Phase 7 and still present. 18 of 19 routes are clean at 320, and all 19 are clean at 360 and
   above. Detail in section 6.3.
4. **Twelve open questions for the client** are logged in `docs/OPEN-ITEMS.md`. They are questions
   the rebuild could not answer from the old site, plus decisions the rebuild made that the client
   is entitled to overturn. Six sponsor URLs were matched by company name and need confirming; the
   "7 or 8 foreign countries" conflict in Damian's own biography was normalized to 7 and needs
   confirming. Summarised in section 6.6.

Three further items are cosmetic or performance headroom rather than defects, and are recorded in
section 6 so nobody rediscovers them: a stale code comment downgrading the `/keynote/` hero call to
action, YouTube thumbnails hotlinked with no fallback, and a render-blocking stylesheet costing
about 600ms on throttled mobile.

**Housekeeping note.** The working tree currently has 18 uncommitted deletions, all of them
throwaway `scripts/_*-tmp.mjs` QA harnesses that were committed by earlier phases and cleaned up
during Phase 7. No source, content, style or configuration file is modified. Commit the deletions
or restore them; either is fine, but the tree should not be handed over dirty.

---

## 2. The six QA rounds, and why the count rose before it fell

Phase 6 was specified as "up to 3 rounds, stop when two consecutive rounds surface nothing new."
It took **six rounds and 60 agents**. This is the most useful part of the report for whoever
maintains this next, because the reason it took six is not that the site was bad.

| Round | Findings | Blockers | Of which were regressions caused by the previous round's fixes |
|---|---|---|---|
| 1 | **80** | 4 | n/a, this was the first audit |
| 2 | **27** | 1 | not separately tracked |
| 3 | **45** | 2 | **6** |
| 4 | **49** | 2 | **16** |
| 5 | **9** | 0 | 4, all four being the same defect reported by four different agents |
| 6 | **3** | 0 | 0 |

Rounds 1 and 2 behaved normally: 80 findings, fixed, then 27. Then the count went **up** twice,
from 27 to 45 and from 45 to 49. The site was not getting worse in the way that pattern suggests.
The fixes were.

### The regression class

Almost all of the damage in rounds 3 and 4 was one class of failure, and it has two faces:

**Face one: agents wrote the build's own reasoning into visitor-facing copy.** Fix agents were
given a finding, a source file and a design system, and they narrated their working into the page.
Actual examples pulled from `docs/qa/round-3-findings.json` and `round-4-findings.json`:

- `/about/`, books section, rendered to visitors: *"What follows is the jacket copy, word for
  word, so it's the publisher's..."*. That is a sourcing note explaining the rebuild's parity
  method. A reader who wants a book does not need to be told which paragraphs were copied verbatim.
- `/about/`, hero deck: a table of contents for the page, followed by a reading instruction telling
  the visitor what order to read the sections in. This one was flagged in round 3, "fixed" in round
  4 by deleting it from `/about/`, and **reappeared on `/boasg/`** in the same round, now listing
  `/about/`'s sections instead of its own. It was the single blocker of round 4.
- `/reviews/`: a closing panel labelled "Testimonials on this page", which made it the only proof
  panel on the site that counts the website's own contents instead of stating a fact about the
  business.
- `/keynote/`: a section that opened by narrating the page's own layout.

**Face two: agents rewrote prose they were not asked to touch.** A finding about a book cover's
rendered size came back with the surrounding paragraph rewritten. A de-duplication fix on
`/keynote/` left an unlinked "it's written up on the About page" pointer three lines above a real
button that went to exactly that page. A testimonial reselect on `/collaboration-opportunities/`
put the site-wide footer quote into the page's own quote row, so B. Kettler's testimonial rendered
twice on one page, verbatim.

Both faces have the same root cause. An agent handed a narrow finding and write access to a copy
file will improve the copy, because improving copy is what it is good at, and it has no way to know
that the sentence beside the defect was signed off three phases ago.

### What was done about it

**Round 5 froze copy.** Fix agents were given the finding and permission to change layout,
component props, CSS and data selection, and no permission at all to rewrite prose. Findings fell
from 49 to **9**, and 4 of those 9 were four different agents independently reporting the same
duplicated testimonial.

**Round 6 permitted no agent to edit anything.** It was pure verification. Four of the five audit
areas came back clean, including the full client checklist and the whole content-parity audit. The
last 3 findings were fixed by hand by the orchestrator rather than by an agent.

**Phase 7 kept the freeze.** All three verification agents ran read-only. Two copy problems were
found and are reported in section 6 rather than edited. The one Phase 7 code change, the
`/acres-tv/` image crop described in section 6.4, was made by hand.

The honest summary: this build shipped clean, and the two rounds where it went backwards were
caused entirely by the fixing process, not by the site. If you take one thing from this report into
the next project, take the copy freeze. It was worth more than any individual fix.

---

## 3. Client requirement checklist

All 13 lines from `docs/build/PLAN.md`, verified against the **rendered** site in Chromium, not
against source code, across all 19 routes at 1440, 768 and 390.

| # | Requirement | Verdict | Evidence |
|---|---|---|---|
| 1 | All 21 logos from `Client Logos/` on the client wall, replacing the current 6 | **PASS** | 21 of 21 marks render with correct alt names on `/`, `/speaking/` **and** `/reviews/`, matching the 21 files in `Client Logos/` one to one. 0 broken. Files on disk: 21 in `public/img/clients/`. |
| 2 | All 10 logos from `Website - List of Podcast Sponsors - Logos/` on the podcast page | **PASS** | 10 of 10 render on `/the-business-of-agriculture/`, matching the supplied folder one to one, 0 broken. The old site listed sponsors as plain text with no artwork. |
| 3 | `LOGO-REVISION-B-A-F-01 copy.png` (Business, Agriculture, Food) appears nowhere | **PASS** | Absent from `public/img/brand/` (30 files enumerated), zero code references anywhere in `app/`, `components/`, `content/`, `public/`. Recorded in `_source/asset-map.json` under `skipped` with the client's reason. It was never read, never copied, never referenced by the asset pipeline. |
| 4 | Header and footer wordmark is the current-site Damian Mason navy and orange logo | **PASS** | `public/img/brand/wordmark.png` inspected visually: navy "Damian Mason" over orange "BUSINESS, AGRICULTURE" rules. Served from `Header.tsx:95` and `Footer.tsx:60` on all 19 routes. |
| 5 | Business of Agriculture logos on `/the-business-of-agriculture/`; BoASG badge on `/boasg/`; XtremeAg and The Granary on `/xtreme-ag/` | **PASS** | `business-of-agriculture.png` and `business-of-agriculture-podcast.jpg` render on the podcast page; `boasg.jpg` and `boasg-white.png` on `/boasg/`; `xtreme-ag-transparent.png` and `the-granary.png` on `/xtreme-ag/`. |
| 6 | No Shop, Cart, Checkout or product pages; no prices; no "Add to cart" | **PASS** | Commerce grep over every rendered page for `add to cart`, `/cart`, `/checkout`, `my-account`, `woocommerce`, `$NN.NN`, `shop now`, `buy now`: **0 hits**. All 6 legacy commerce URLs plus `/product/*` return 301 to `/about/#books`, and `/product/business-of-ag-success-group/` returns 301 to `/boasg/`. |
| 7 | FAQ item "Do you have any products for sale?" removed | **PASS** | The phrase "products for sale" returns **0 rendered hits**. It is still present in 3 of the harvested source pages, which is what proves the removal is real rather than the question never having existed. |
| 8 | Media Kit link removed, both instances | **PASS** | `media.?kit` returns **0 rendered hits**. Present in both `_source/pages/home.md` and `meeting-coordinators.md`, so both instances are confirmed gone. |
| 9 | BOASG join CTA is a `mailto:` with appropriate wording | **PASS** | `mailto:damianmasonoffice@gmail.com` with subject "BoASG: I want in" and a prefilled body. The separate mailing-list button still points at `/join-the-conversation/`, per the plan. Which of the two buttons the client meant remains open item #1. |
| 10 | Every page, section and image from the old site carried over or explicitly justified | **PASS** | Content layer holds 17 testimonials, 13 FAQ items, 16 videos (13 YouTube, 3 MP4), 9 press items, 2 posts, 21 clients, 10 sponsors, every number matching `_source/manifest.json`. Reachability was verified by searching rendered HTML for each item's own quote, question, YouTube ID, file path, title or slug: **17 of 17, 13 of 13, 16 of 16, 9 of 9, 2 of 2**. Everything deliberately dropped is itemised with a reason in `docs/CONTENT_MANIFEST.md` and summarised in section 5 below. |
| 11 | Same IA and page flow; nothing became harder to reach | **PASS** | 43 distinct internal hrefs, all 200. 15 nav entries plus the wordmark, footer newsletter link and 2 posts reach all 19 routes. The 3 dropdown parents that had no `href` at all on the old site now resolve to `/speaking/`, `/podcasts/` and `/blog-news/`. One route did get one step harder to reach and it is disclosed rather than hidden: `/blog/` moved from a top-level nav item to the third child of the Media dropdown, because on the old nav it sat directly beside a Media parent whose only real child was the other blog-ish page. That is recorded in `CONTENT_MANIFEST.md`. |
| 12 | Copy reads as Damian, not as AI; zero em dashes | **PASS** | **0** U+2014 in rendered visible text and 0 in `content/`, `app/`, `components/`. Only 3 en dashes site-wide, all of them the numeric range "60 to 90 minutes" inside a verbatim FAQ answer where an en dash is correct typography. 0 straight apostrophes in copy. Banned-phrase grep clean. Separately, a full read of all 1,562 lines of body copy across 19 routes plus a grep for 33 build-vocabulary terms (`verbatim`, `source copy`, `harvest`, `wordpress`, `divi`, `phase N`, `QA round`, `fix agent`, `orchestrator`, `content parity`, `design system`, `placeholder`, `TODO`, `lorem`, and reading-order phrasing such as "read this first" and "as noted earlier") returned **zero hits**. The round 3 and 4 regression class described in section 2 is confirmed gone from the shipped site. |
| 13 | Every live-site defect listed in PLAN.md Context is fixed and none reproduced | **PASS** | Checked one by one against the rendered site: "Your Title Goes Here" 0, Lorem Ipsum 0, contact `mailto:` carries its prefix, `href="#"` 0, `href=""` 0, `wpengine.com` 0, `user-scalable` 0, exactly one `<h1>` on every one of 19 routes including Contact which previously had none, footer carries social icons and a copyright line, `/speaking/` is a real hub rather than a blank indexed stub, `/podcast-2/` returns 301, pasted Squarespace and Google SERP residue (`hgKElc`, `BNeawe`) 0, a single Spotify show ID `0UDXsogtCT4uNF4CpDpUae` rather than the two conflicting ones, SoundCloud corrected to `/dobusinessbetter`, Libsyn `504653` and Apple `id1291008696` correct, Mailchimp list `6456b31ef4` correct. |

**A note on the four "hits" you will get if you run the greps yourself.** `grep -rn "wpengine.com"`
returns 2 lines and `grep -rn 'href=""'` returns 2 lines. All four are **code comments** in
`content/posts.ts`, `lib/seo.ts` and `app/xtreme-ag/page.tsx` that document the old-site defect
being fixed at that spot. None is shipped markup. The prerendered HTML contains zero of either.

### Count claims

Every numeric and word-number claim in the visible copy was enumerated and checked against the
content files, because a rebuild that says "Ten brands" beside nine logos is worse than one that
says nothing. **28 count claims checked, 0 false.** Examples: "21 of 2,400+" appears three times
and `clients.length` is 21; "Ten brands", "Ten sponsors" and "10 sponsors" appear four times and
`sponsors.length` is 10; "Nine appearances, five outlets" matches 9 press items across exactly 5
distinct outlets; "Three episodes to start with, 144, 142, and 141" matches the page data; "Six
episodes, 41 to 54 minutes" matches 6 entries whose runtimes run 41:21 to 54:17. The country count
is 7 in all 12 places it appears, with zero instances of 8. The 40,000 and 70,000 audience figures
are verbatim from the harvested source and are not invented, though the two different 40,000s are
open item #5.

---

## 4. The measured numbers

### 4.1 Lighthouse

Lighthouse 13.4.1, run against a production build served by `next start` on port 3200, 13 routes x
2 form factors x 3 passes, median of 3. Targets from `PLAN.md`: Performance 90, Accessibility 95,
Best Practices 95, SEO 100.

**Mobile** (throttled, Moto G Power class):

| Route | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 93 | 100 | 100 | 100 | 3.16s | 0.000 | 23ms |
| `/about/` | 93 | 100 | 100 | 100 | 3.09s | 0.000 | 5ms |
| `/speaking/` | 93 | 100 | 100 | 100 | 3.09s | 0.000 | 7ms |
| `/keynote/` | 93 | 100 | 100 | 100 | 3.08s | 0.000 | 2ms |
| `/reviews/` | 95 | 100 | 100 | 100 | 2.86s | 0.000 | 2ms |
| `/meeting-coordinators/` | 94 | 100 | 100 | 100 | 3.01s | 0.000 | 1ms |
| `/collaboration-opportunities/` | 93 | 100 | 100 | 100 | 3.16s | 0.000 | 33ms |
| `/boasg/` | 94 | 100 | 100 | 100 | 3.01s | 0.000 | 29ms |
| `/podcasts/` | **93** (see note) | 100 | 100 | 100 | 3.02s | 0.000 | 4ms |
| `/the-business-of-agriculture/` | 94 | 100 | 100 | 100 | 3.01s | 0.000 | 5ms |
| `/blog-news/` | 95 | 100 | **96** | 100 | 2.86s | 0.000 | 4ms |
| `/contact-us/` | 95 | 100 | 100 | 100 | 2.78s | 0.000 | 4ms |
| `/acres-tv/` | 94 | 100 | 100 | 100 | 2.93s | 0.000 | 4ms |

**Desktop**: **100 / 100 / 100 / 100 on all 13 routes.** LCP 0.63s to 0.81s. CLS 0.000 everywhere.
TBT 0 to 2ms.

**Routes below any target: 0.**

Two honest caveats on this table.

- **`/podcasts/` is noisy and the stored artifact disagrees with the table.**
  `docs/qa/lighthouse-final.json` records `/podcasts/` mobile Performance at **86**, from a 3-run
  median of 86, 94 and 73. That is below the target. It was re-run alone with 9 passes and the
  median came back **93**, from runs of 89, 94, 94, 94, 93, 92, 94, 93, 90. Eight of nine runs are
  at or above 90 and the ninth is 89. The 73 and 86 were CPU contention from a parallel agent
  working in the same repository during the batch. **93 is the real number**, but the JSON on disk
  still says 86 and has not been overwritten, so anyone reading the artifact should read this
  paragraph with it. If a CI performance gate is ever added, run it on an idle machine with at
  least 5 passes, because a 3-run median on this route can land anywhere from 73 to 94.
- **`/blog-news/` mobile Best Practices is 96, not 100.** The target is 95, so it passes, but it is
  the only score on the site that is not a perfect number and it is worth knowing it exists.

### 4.2 Accessibility, axe

`@axe-core/playwright`, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Best-practice rules were
excluded deliberately: the target is WCAG 2.1 AA, and folding opinions into the count hides the
real number.

**19 routes x 2 widths (1440 and 390) = 38 runs.**

| Impact | Nodes |
|---|---|
| critical | **0** |
| serious | **0** |
| moderate | **0** |
| minor | **0** |
| **total** | **0** |

Structural checks outside axe, all clean across all 19 routes: exactly one `<h1>` per route,
exactly one `<main>` per route, no heading level skips, no image without an `alt` attribute, no
form control without an accessible name, no horizontal overflow, no nav landmark missing or sharing
a label, no page load errors.

**Read section 6.1 before quoting the zero.** A missing caption track is invisible to axe and to
Lighthouse. Zero axe violations is a true statement about what axe can see. It is not a claim of
full WCAG 2.1 AA conformance, and the site does not currently have full conformance.

### 4.3 Contrast

Every colour pair on the site was computed with the WCAG 2.x relative-luminance formula and is
recorded in `docs/DESIGN_SYSTEM.md` section 4. No pair ships that is not in that table. Thresholds
are 4.5:1 for text under 24px, 3:1 for large text and UI boundaries.

Representative pairs, bone paper ground `#F2EBDE`:

| Pair | Ratio | Verdict |
|---|---|---|
| body copy and headings `#041826` | **15.22** | AAA |
| secondary prose `#07395A` | **10.17** | AAA |
| display type, proof figures `#094D78` | **7.56** | AAA |
| captions, folios, labels `#625A4B` | **5.74** | AA |
| orange as text, links `#A8330E` | **5.63** | AA |
| decorative indices, disabled `#6A6252` | **5.09** | AA |
| structural rules `#857C69` | **3.48** | passes the 3:1 floor |
| primary button, navy on orange | **5.60** | AA |
| secondary button, navy on bone | **15.22** | AAA |

Navy ground `#041826`:

| Pair | Ratio | Verdict |
|---|---|---|
| body `#F8F3E9` | **16.32** | AAA |
| secondary `#D3E0E8` | **13.40** | AAA |
| muted `#8FB2C7` | **8.04** | AAA |
| brand orange as text `#FF5325` | **5.60** | AA, and this is the only ground where orange is legal as text |
| focus ring `#FF8154` | **7.32** | passes the 3:1 floor |

Two deliberate exceptions, both documented and both correct: `--rule-decorative` at 1.33 on bone
and 1.50 on navy is ornament only, and deleting it must lose no information; the brand orange
`#FF5325` at 2.72 on bone is barred from being text there and is used only for filled fields, rules
and `aria-hidden` marks. Phase 5 moved `--ink-faint` from `#7E7460` to `#6A6252` specifically so
that decorative indices clear 4.5:1 anyway, on the grounds that WCAG's "pure decoration" exemption
is too soft a thing to rest 90 nodes on.

### 4.4 The logo wall

This was the client's most concrete request, and it took three passes to get right. The problem was
never the files, it was that 21 marks with aspect ratios from 0.97:1 to 5.55:1 were being dropped
into identically sized cells, so a wide wordmark hit the cell's width limit and rendered tiny while
a square badge filled the height.

Progression on mobile at 390px, which was the worst case:

| Stage | Smallest mark | Height spread | Optical spread |
|---|---|---|---|
| Round 1, as built | 14px | about **5x** | not measured |
| Round 3, ink trimmed | 18px (CLAAS) | **4.44x** | 2.11x |
| Round 4, normalized on optical area | **27.2px** (CLAAS) | 2.38x | **1.00x** |

The fix was to stop normalizing height and start normalizing **optical area**. Each mark carries
`sqrt(width / height)` of its own trimmed canvas, generated per file by
`scripts/normalize-logo-ink.mjs` into `src/styles/logo-optical.css`, and the wall sets
`inline-size: calc(var(--logo-optical) * var(--logo-ar-sqrt))` with `block-size: auto`. Width lands
on `G x sqrt(a)` and height on `G / sqrt(a)`, so `sqrt(w x h)` lands on `G` for every mark whatever
its shape. `G` is 69px from 768 up and 64px below.

Final measurement, all four walls (client wall on `/`, `/speaking/` and `/reviews/`; sponsor wall on
`/the-business-of-agriculture/`):

| | client 1440 | sponsor 1440 | client 768 | sponsor 768 | client 390 | sponsor 390 |
|---|---|---|---|---|---|---|
| optical spread | **1.00x** | **1.00x** | **1.00x** | **1.00x** | **1.00x** | **1.00x** |
| optical range | 68.9 to 69.0 | 69.0 to 69.0 | 68.9 to 69.0 | 69.0 to 69.0 | 63.9 to 64.0 | 63.9 to 64.0 |
| smallest mark | 29.3px | 29.0px | 29.3px | 29.0px | 27.2px | 26.9px |
| height spread | 2.39x | 2.57x | 2.39x | 2.57x | 2.38x | 2.57x |

CLAAS, the mark this whole exercise was written about, went from 99.0 x 17.8 to **150.8 x 27.2** on
a phone, 53% larger in both dimensions, and it is legible.

**The remaining 2.39x height spread is correct, not a residual defect.** Under equal optical area
the height spread is exactly `sqrt(aspect_max / aspect_min)`, which for these 21 marks is
`sqrt(5.55 / 0.97)` = 2.39x. It is a floor, not a failure. Driving it to 1.0x would mean rendering a
5.55:1 logotype at the same height as a square badge, at 2.4x its correct visual weight, as the
loudest object on the page.

One structural change: below 768 the client wall is two across, not three. Three across leaves 99px
of usable cell and no sizing rule can make a 5.55:1 mark legible in 99px. Two across offers 157px.
21 is odd, so the twenty-first cell spans both columns and the grid closes with no dead cells.

**One number in this section is genuinely disputed, and the report is not going to pretend
otherwise.** The 1.00x above is the **rendered box** optical spread, and it is reproducible: three
separate audits measured it and got the same answer. The question is what happens when you also
account for how much of each box is actually ink.

- A Phase 6 auditor measured true ink optical spread at **1.06x**.
- A Phase 7 auditor measured it at **1.80x** on the client wall and 1.85x on the sponsors, by
  computing each file's ink **fill fraction**, the share of pixels that are dark and opaque, which
  ranges from 21.1% to 68.3% across the 21 marks.
- The orchestrator settled it at about **1.02x** by measuring each source file with
  `sharp.trim({threshold: 12})`, which returns the content bounding box, and finding every client
  logo between 0.926 and 0.946 trimmed fill, a 1.022x ratio.

The 1.80x figure was **not actioned** and the settlement is recorded in
`docs/qa/logo-wall-measurement.md`. The honest reading is that the two methods measure different
quantities: trim-box fill asks "how much dead margin is around the mark", and pixel fill fraction
asks "how dense is the mark". Both are legitimate definitions of "ink" and they will never agree,
because a thin-stroke wordmark is genuinely less dense than a solid badge no matter how you crop it.
The two measurements that share a method agree on roughly 1.02x to 1.06x, so that is the number to
quote. What is not in dispute: every mark renders at the same box area, every mark clears 26.9px on
a phone, all 31 files were confirmed to have opaque white corners and 0.0% transparency so no mark
ships a visible background rectangle, and the wall reads as a peer set. If a future pass wants to
chase density as well, the mechanism exists: `scripts/normalize-logo-ink.mjs` would divide each
mark's `--logo-ar-sqrt` companion by `sqrt(fill)`. It is not recommended, for the reason section 2
gives.

### 4.5 Video payload

| | Before | After |
|---|---|---|
| Three self-hosted demo reels | **106 MB** (31 + 39 + 36), uncompressed 1080p | **21.02 MB**, 720p H.264 |

Transcoded in Phase 5 with the macOS `avconvert` tool, since there is no ffmpeg on this machine.
Poster frames were generated for all three and the originals were deleted. All three carry
`preload="none"`, so no visitor downloads any of them unprompted and no page is slow because of
them, but they are 21.02 MB of the 38.20 MB deploy bundle and that is an accepted trade rather than
an oversight.

### 4.6 Layout, overflow and the mobile nav

- **CLS: 0.000** on every route, mobile and desktop, in Lighthouse, and 0.00000 across 10 separate
  full-scroll runs in Phase 5.
- **Horizontal overflow: 0 failures** across 19 routes x 6 widths (320, 360, 390, 768, 1024, 1440),
  **114 checks**, each page scrolled top to bottom to settle lazy layout before measuring
  `documentElement.scrollWidth` against `clientWidth`. A separate visual pass tested 9 widths (320,
  360, 390, 414, 768, 1024, 1280, 1440, 1600) and found exactly one failure, the 1px on
  `/meeting-coordinators/` at 320 described in section 6.3.
- **H1 line breaking:** 19 routes x 8 widths from 1024 to 1600, reconstructing rendered lines from
  per-character client rects. **Zero** soft-hyphen breaks, zero no-space splits, zero H1 overflow.
- **Mobile nav sheet:** 4 viewports (320x568, 360x640, 390x664, 390x715), with touch emulation, menu
  opened, checked three independent ways. The sheet's scroll container does not overflow, all six
  top-level rows are fully inside the viewport, and every row is hit-testable at its own centre via
  `elementFromPoint`, which also proves the decorative fade never covers a row. **4 of 4 passing**,
  tightest headroom 181px. The affordance caveat is section 6.2.
- **CTA band text overlap:** 0 overlapping text-box pairs at 768, 1024 and 1280, measured pairwise
  across every leaf text node in the band.

### 4.7 Links, redirects and crawlability

`scripts/link-sweep.mjs` against the production build, with every flagged URL independently
re-checked by hand under a real browser user agent.

| | |
|---|---|
| Unique URLs checked | **461** (390 internal, 71 external) |
| Anchors scanned | 1,335 |
| Images scanned | 172 |
| Status histogram | 456x 200, 3x 404, 1x 400, 1x 999 |
| **Internal 404s** | **0** |
| Empty `href` | **0** |
| `href="#"` | **0** |
| `wpengine.com` references | **0** |
| Redirect chains over 1 hop | **0** |
| `target="_blank"` without `rel="noopener"` | **0** |
| Legacy redirects | **12 of 12** return 301 in canonical trailing-slash form and land on 200 |
| Sitemap | 200, parses, 19 URLs |
| Robots | 200, sitemap line matches the actual sitemap |
| OG image | 200, `image/png`, 1200x630, 66,901 bytes |

**The three 404s are expected and are not defects.** They are
`https://damianmason.com/about/`, `/podcasts/` and
`/blog/eggflation-gives-producers-record-profits/`, all with an empty sources array, meaning they
come from canonical tags and JSON-LD absolute URLs rather than from any clickable link. Those are
the three routes that are **new in this rebuild**, so they do not yet exist on the old WordPress
site currently answering that hostname. They resolve to 200 the moment this build is deployed.
Re-run the sweep once after deploy to confirm.

The 400 is `facebook.com/DamianPMason` and the 999 is `linkedin.com/in/damianmason`. Both persist
under a real Chrome user agent and are standard anti-bot responses from those two platforms.
Spotify, X, YouTube and Instagram all return 200 under the same user agent. Both links work in a
browser.

The sweep also raised 5 "image natural width is zero" flags on `/reviews/` and
`/collaboration-opportunities/`. All 5 are **false positives**: the URLs are YouTube poster
thumbnails, all 5 return HTTP 200 with real bytes (5.2 KB to 36.5 KB), and after a full scroll both
routes report 0 zero-width images out of 28 and 7 respectively. The tool measures `naturalWidth`
before lazy images enter the viewport. Teaching `link-sweep.mjs` to scroll first would stop this
recurring.

**Slashless legacy URLs take two hops**, a 308 to append the trailing slash then the 301. All
terminate at 200 at the correct destination. This is inherent to `trailingSlash: true` and is not
worth disabling that convention over.

### 4.8 No-JavaScript

`scripts/nojs-check.mjs` renders all 19 routes with `javaScriptEnabled: false`.

| | |
|---|---|
| Routes passing | **19 of 19** |
| Content hidden without JS | **0** |
| Videos unreachable without JS | **0** (18 of 18 reachable) |
| H1 per route | 1 |

This matters more than it sounds. Every video on this site sits behind a facade: a `<button>` that
swaps in the real player on click. With scripting off, that button is a dead control covering the
whole frame. Ten of the thirteen YouTube embeds originally shipped that way, with no anchor and no
`<noscript>`, so the video simply did not exist for a visitor without JavaScript. Every `.dm-video`
now offers a real route to its file, either an `<a href>` or a `<video controls>`, both of which a
browser parses out of `<noscript>`.

### 4.9 Copy duplication

`scripts/dupe-check.mjs` renders all 19 routes, takes the visible text of `<main>` only, strips the
parts that are supposed to repeat (site chrome, `.sr-only` strings, CTA labels), and finds every
word run of 8 words or longer occurring more than once.

| | Baseline | Final |
|---|---|---|
| Prose words measured | | 8,777 |
| Repeated runs of 8+ words | 27 | **28** |
| Cross-route repeats | 25 | **26** |
| Within-route repeats | | 2 |
| Source-mandated repeats | | 2 |
| Raw repeated n-grams | 657 | **672** |

The count went **up by one** against the last recorded baseline, and the cause is known and
accepted. Diffing the two reports isolates exactly one new repeat: the 12-word run *"he gives you
the truth about ag without sugar coating the message"*, appearing on both `/about/` and `/boasg/`.
The `/boasg/` instance is **verbatim source parity**, from `_source/pages/boasg.md` line 38, and it
came back when the orchestrator restored that biography by hand at the end of round 6. The `/about/`
instance is discretionary, on a page that has no source file because it is net-new.

This was **reported and deliberately not fixed**, and the reasoning is section 2: rounds 3 and 4
regressed precisely because agents rewrote prose to resolve findings of this shape. One repeated
sentence across two pages is a smaller cost than reopening the copy. It is recorded as a deliberate
parity-over-deduplication trade.

### 4.10 Deploy payload

| | |
|---|---|
| `public/` total | **38.20 MB** across 149 files |
| Video | 21.02 MB (3 mp4) |
| PNG | 12.15 MB (56) |
| JPG | 4.32 MB (34) |
| WebP | 0.71 MB (56) |
| Requested at runtime | 85 of 149 |
| Never requested | 40 files, 0.65 MB, **1.7%** |
| Truly orphaned | **0** |

Every one of the 149 files is referenced by exact path in either source or build output, so nothing
is an orphan. The 40 unrequested files are **redundant format siblings**, caused by two different
image strategies coexisting: the client and sponsor walls reference `.webp` directly, so their
`.png` and `.jpg` masters are never fetched, while brand art goes through `next/image` from `.png`,
so its hand-made `.webp` siblings are never fetched. Largest unrequested files:
`brand/do-business-better-podcast.webp` 56 KB, `brand/boasg-white.webp` 36 KB,
`brand/wordmark.webp` 35 KB.

This is worth a line in the handoff mainly so that nobody deletes a logo master by mistake while
tidying up. The originals are the useful fallback masters.

---

## 5. What was removed from the old site, and why

Summarised from `docs/CONTENT_MANIFEST.md`, which is the full itemised record. **Every item below
is deliberate.** Anything from the old site that is not on this list has a route on the new one.

**Commerce, all of it** (client instruction: *"We are not selling product (books) moving
forward."*). `/shop/`, `/damian-mason-online-shop/` (a byte-for-byte duplicate of `/shop/` at a
second indexed URL, a duplicate-content defect on a page being deleted anyway), `/cart/`,
`/checkout/` and `/my-account/`, all four WooCommerce product pages, every price string ($99.00 and
three at $19.95), every "Add to cart" button, the quantity spinners, product categories,
breadcrumbs, "Related products" cross-sells, and the hard-coded `0 Items` cart counter that shipped
in the server-rendered HTML of every page. Two of those pages inlined live Stripe and WooPayments
configuration into the page HTML. The book cover art and descriptions survive on `/about/#books` as
credibility, with no prices and no cart. All six URLs plus `/product/*` return 301.

**The `$99/month` BOASG figure.** It is the one hard number from the old site that the new site does
not carry anywhere. On the old page it was set as a second `<h1>` directly above a "Join Today"
button that went to a WooCommerce product page. The client checklist says "no prices", so the figure
came off with the commerce it was attached to. **If the client reads their own instruction as "no
purchase actions" rather than "no figures", the fee goes back as plain prose in the "What you get"
block.** Flagged here because it is a judgement call, not an oversight.

**The products FAQ item**, "DO YOU HAVE PRODUCTS FOR SALE?", explicit client requirement. It
appeared three times on the live site and is removed from all three. This is what takes the FAQ from
14 distinct questions to 13.

**Both Media Kit links**, explicit client requirement. The first pointed at a raw `.zip` on the
**staging** domain and was almost certainly already a 404. The second, on
`/meeting-coordinators/`, was worse: it carried Divi's clickable class but had no `href` and no
`data-link` at all, so it looked like a button and did nothing. No real Media Kit asset exists.
Building a proper speaker one-sheet is open item #3.

**The B, A, F logo**, explicit client instruction. Never read, never copied, never referenced.

**Lorem Ipsum and placeholder content.** Two byte-identical Latin filler accordions on
`/meeting-coordinators/`, both of which rendered **open by default**. "Your Title Goes Here" on the
homepage, also open by default, the single most visible defect on the old site. An empty FAQ toggle
on the homepage that loaded with a blank expanded panel. An empty answer on `/keynote/` whose toggle
opened onto nothing.

**Two 404 assets that could not be carried over.** `Podcaster-34c.png`, the hero background of the
flagship podcast page, which returns 404 so the page currently renders a near-black fallback and
nothing else. And `life-coach-03.jpg` on `/keynote/`, which turns out to be a leftover Divi "Life
Coach" demo-layout asset, so there was nothing of Damian's to preserve.

**Both contact forms, and this is the one deliberate functional reduction worth arguing about.** The
Divi form on `/collaboration-opportunities/` POSTed to a WordPress nonce endpoint with no reusable
equivalent. **This build is static and has no backend**, so a redrawn form would be a set of inputs
with nowhere to send anything: it would look like a working inquiry channel, collect a meeting
planner's date and budget, and drop them. That is strictly worse than no form. What ships instead on
both routes is a real `mailto:`, a real `tel:`, and the source's own "We typically respond within
one business day" promise. `/contact-us/` additionally spells out the five lines to send, which is
the Message field's job done in prose. The original field list and DOM order are preserved verbatim
in `_source/pages/collaboration-opportunities.md` section 7 for whoever builds the real one. This is
open item #2.

**Playback on `/do-business-better-podcast/`.** The old page had a native `<audio>` element serving
a 33 MB self-hosted MP3 of one episode. It is not carried over: the show's own host serves it, and
33 MB in the deploy bundle for a single episode is not a trade worth making. Every listen on that
route now leaves for SoundCloud. This is open item #8, and a facade-loaded SoundCloud player would
restore playback without the download.

**Sixteen macOS screenshots used as marketing imagery**, with default filenames like
`Screenshot-2023-04-25-at-10.51.10-AM.png`, several with browser chrome and player UI still visible,
two with a raw narrow no-break space inside the filename. Thirteen of the sixteen are unreferenced by
any route. They are retained in `_source/media/` because for several subjects they are the only
artwork that exists, but every one is a quality ceiling. Real photography is open item #7 and it is
the single largest remaining quality gap on the site.

**Wrong and stale links, corrected rather than carried.** A second, stale Spotify show ID on
`/the-business-of-agriculture/` (one page linking two different shows), consolidated to
`0UDXsogtCT4uNF4CpDpUae`. The SoundCloud link on `/do-business-better-podcast/` that pointed at
Damian's *other* podcast. Two empty-`href` mailing list buttons, one empty-`href` inquiry button,
and three `href="#"` placeholders, each either given its real destination or removed.

**Structural junk.** Every `damianmason.wpengine.com` URL and every `?page_id=NNN` footer link. The
`user-scalable=0` viewport meta that disabled pinch-zoom site-wide, itself a WCAG 2.1 SC 1.4.4
failure. Six empty structural elements including an empty clickable row on the homepage targeting
the literal string `#`. Three empty widgets shipped to production. The stock WordPress seed comment
on the first blog post, dated 2022-12-16, live for four years, with an outbound link to the host.
The `damianmasonstg` staging username shown to visitors as an author byline. Pasted-in wrapper markup
from six different sources accumulated over four years: Squarespace, SoundCloud, Libsyn, Gmail,
Google SERP classes, and Claude chat CSS classes on all five `/contact-us/` paragraphs. The words
were kept; the containers were dropped.

**Four client logos with no supplied replacement**: John Deere, BASF, Helena and IPPA. The 21
supplied logos replace the current 6, but only Merck and FCS of America overlap. Whether to keep the
other four is **open item #2 in PLAN.md** and they are held out of the wall until the client answers.
Their files are kept on disk so that answering is a one-line change.

**Three photographs replaced for specific reasons**, each recorded: two near-identical wide stage
frames superseded by a tighter crop of the same moment; a "book signing at XtremeAg" image that is
not an XtremeAg photograph at all but a duplicate of the StoneX signing under a wrong name; and a
Forbes promo card with a **READ ARTICLE** button drawn into the pixels, which was replaced with the
real headline and a real link, because a baked-in button that cannot be clicked is worse than no
button.

---

## 6. Known remaining issues

Stated plainly. None of these blocks launch. Two of them (6.1 and 6.2) are the ones a client should
be told about before signing off.

### 6.1 The three demo reels have no captions. This fails WCAG SC 1.2.2 at Level A.

**This is the only known WCAG failure on the site.**

Confirmed at runtime: all three self-hosted MP4s render with `tracks: 0`. Neither axe nor Lighthouse
can detect a missing caption track, which is why section 4.2 reports zero violations and section 4.1
reports Accessibility 100 while this failure is real and present. **Do not read the zero as
conformance.**

`VideoEmbed` already accepts a `captions` prop, so there is no code to write. Somebody has to
transcribe three videos and produce WebVTT files. That is a content dependency on the client.
Logged as open item #10 in `docs/OPEN-ITEMS.md`. Files: `content/videos.ts`, `public/video/`.

Until captions exist, a deaf or hard-of-hearing visitor cannot access the content of the three demo
reels, which are the pieces of the site whose entire job is to show what Damian is like on stage. A
transcript alone would satisfy the criterion at Level A and is the cheaper path if captioning is not
practical.

### 6.2 The mobile nav sheet has no scroll affordance at very short viewports

Measured directly rather than eyeballed. `.dm-menu__body` is a real scroll container and it has
scrollable distance at every phone size tested:

| Viewport | Body height | Content height | Scrollable | Links visible at rest |
|---|---|---|---|---|
| 390x844 | 631px | 718px | 87px | 13 of 15 |
| 360x740 | 527px | 718px | 191px | 11 of 15 |
| 320x568 | 387px | 718px | 331px | 8 of 15 |

Scrolling the body brings every remaining link into view, Contact Us included. Nothing is trapped
and nothing is unreachable. Separately, all **six top-level rows** are fully inside the viewport at
rest at 320x568, 360x640, 390x664 and 390x715, and every one is hit-testable at its own centre.

**The genuine weakness is that at 360px and below there is no visual cue that the list continues.**
A user who does not try scrolling may believe they are seeing the whole menu. This is a real polish
item and it was deliberately **not** fixed at this stage, for the reason section 2 documents: late
cosmetic fixes on this build have a demonstrated history of introducing regressions, and the nav is
functional. It is a good first task for whoever picks this up next, in a context where there is time
to re-verify.

An earlier round-6 audit reported that the sheet "hides Contact Us entirely". That was measured and
found to be **overstated**: what the auditor read as hidden were the items at the *top* of the list,
which leave the viewport once you scroll down. That is how a scrolling list behaves. Recorded so
nobody reopens it on the strength of the stronger claim.

### 6.3 One route overflows by 1 pixel at 320px wide

`/meeting-coordinators/`. At 320x700, `documentElement.scrollWidth` is 321 against a `clientWidth`
of 320. Re-confirmed by hand at the close of Phase 7 and still present.

**18 of 19 routes are clean at 320, and all 19 are clean at 360, 390, 414, 768, 1024, 1280, 1440 and
1600.** 320px is a 2016-era iPhone SE; the smallest widely-current phone is 360.

The cause is text ink, not a box, which is why an earlier rect-based sweep reported zero: no
element's bounding rect exceeds 320. The hero `<h1>` has `scrollWidth` 301 against `clientWidth`
280, a 21px internal overflow, and the column starts at the 20px gutter, so 20 + 301 = 321. The word
"Coordinators" is a single unbreakable word and cannot wrap at the display size in a 280px column.
The trailing "s" clips at the viewport edge. Visible in
`docs/qa/screenshots/final/meeting-coordinators-320-hero.png`.

**Fix, when someone takes it:** step the hero H1 down one size below 360px, or allow hyphenation on
the hero title at that breakpoint. It is a type-size change in `app/meeting-coordinators/page.tsx`.
**Do not change the copy.** "Meeting Coordinators" is the page's name.

### 6.4 Reported and not actioned, or actioned by hand

Four items surfaced in the final verification pass. Recorded with their disposition so the next
reader does not have to re-litigate them.

**Fixed by hand during Phase 7:** `/acres-tv/` was still shipping a screen capture of the Acres TV
listing page as photography, complete with a padlock glyph over the byline and the episode title
baked in twice. Six macOS screenshots were dropped in Phase 3 for exactly this reason; this one
survived because it also contained a legitimate video still. It was cropped to that still, the
two-shot of Damian and market analyst Arlan Suderman, and the dimensions, alt text and cutline were
all updated to describe what the image now shows. Verified: the rendered image is now 480x266 with
alt text describing the two-shot. Commit `a685c5d`.

**Disproven and not actioned:** the claim that `next build` fails from the working tree, raised in
round 4. It does not reproduce in either condition. Building into `.next` *while the dev server was
live on 3100 sharing that directory* returned exit 0, and the literal clean-tree sequence
`rm -rf .next && npx tsc --noEmit && npx next build` returned exit 0 on both commands, compiling in
2.3s and generating 27 static pages. `git diff` was empty afterwards and `tsconfig.json` was
byte-identical, so the stock `distDir` does not rewrite the checked-in tsconfig. The failure round 4
observed is a real but transient Turbopack persistent-cache corruption that occurs only when a build
and a dev server share one `distDir`. It is documented and already mitigated by `npm run build:qa`,
which builds into `.next-qa`. **This build is deployable.**

**Reported, not edited, per the copy freeze:** the `/about/` and `/boasg/` duplicated sentence
described in section 4.9.

**Open, code-only, not taken this phase:**

- **`/keynote/` hero call to action is downgraded on the strength of a stale comment.**
  `app/keynote/page.tsx:115-118` sets the hero's "Book Damian" to `variant: 'secondary'` with the
  justification *"The masthead already spends this viewport's one filled orange field on the
  identical action."* Phase 5 made that false: the masthead booking control is now secondary at
  every breakpoint on every route, and `DESIGN_SYSTEM.md` section 5.1 says the one permitted orange
  field belongs to the page's own primary action. Measured consequence: `scripts/orange-check.mjs`
  reports `/keynote/` with **0** orange fields in the first viewport at both 1440 and 390, and the
  page's first orange does not appear until y=7500. The flagship booking page has no orange call to
  action above the fold. This is the only route in the build carrying that comment and the only hero
  whose money action is explicitly downgraded. The fix is deleting the `variant` override and the
  comment, which is a code change with no copy impact, and it should be re-verified against the
  orange budget afterwards.
- **YouTube poster images are hotlinked with no fallback.** `components/sections/VideoEmbed.tsx:63`
  builds each facade poster as `https://i.ytimg.com/vi/{id}/hqdefault.jpg` and emits it as a plain
  `<img>` with no `onerror` and no CSS background fallback. `next/image` is bypassed here
  deliberately, to avoid a `remotePatterns` dependency. When the host is unreachable the frame
  paints as bare navy with the browser's broken-image glyph in it. The CDN is healthy (200 in 52ms
  on retry) so this is not a broken URL; it is an unguarded third-party dependency whose observed
  failure mode is a visibly broken image rather than a graceful placeholder, and it will reproduce
  on any network that filters `ytimg`, which is common on corporate and school wifi and with several
  ad blockers. Fix: an `onerror` that hides the `<img>` and lets the navy ground stand, or self-host
  the 13 stills in `public/img/video/`. Self-hosting also lifts them from 480x360 to something the
  660px columns can actually use, and removes the third-party dependency entirely.

### 6.5 Performance headroom, not a gate failure

Every performance target passes. These are the only levers left.

- **A render-blocking request costing about 600ms appears on every mobile route** (450ms on
  `/meeting-coordinators/`). It is the single systemic performance item on the site. Mobile LCP sits
  at 2.78s to 3.16s against the 2.5s "good" threshold, and Largest Contentful Paint is the only
  weighted audit losing meaningful points anywhere. On `/podcasts/` the LCP image's own subparts
  total roughly 87ms, so the time is critical-path stall, not image weight. Desktop is 100 across
  the board with LCP under 0.81s, so this is throttled-mobile only. Inlining or preloading the
  render-blocking stylesheet would move mobile LCP under 2.5s and lift mobile Performance from the
  low 90s toward 100.
- **`/podcasts/` carries the only route-specific JavaScript opportunities**: 29 KB of unused
  JavaScript and 13 KB of legacy JavaScript.
- **Seven of 81 image placements are below the pixels a retina display wants.** All seven are source
  asset ceilings, not code bugs. Worst is 65% (`todd-thurman`, a 500px source in a 384px slot), none
  is below 50%, and 74 of 81 meet 2x. The thirteen YouTube stills are hotlinked 480x360 files
  rendering into 660px columns.

### 6.6 Open questions for the client

Twelve items are written up in full in `docs/OPEN-ITEMS.md`, each naming the file to change. The
ones that matter most:

1. **Six of the ten sponsor URLs were matched by company name**, not supplied. AgView Solutions,
   EarthOptics, Harvest Returns, Life Scientific, NewFields Ag and Redox Bio. Only the client knows
   which company each supplied logo belongs to. Please confirm all six.
2. **"7 or 8 foreign countries."** The old `/boasg/` biography says 8, verbatim. Every other page on
   the old site says 7. The rebuild normalized to 7 on frequency and recency. **This was a
   build-time edit to a verbatim biography and the client should confirm it.**
3. **Two different 40,000s.** "More than 40,000 subscribers" and "more than 40,000 listeners per
   month" are both in the harvest and are not obviously the same people. They are now scoped one per
   route so no page shows both, and the footer carries neither. If they are one number, say it once.
4. **Which BOASG button did the client mean?** The `$99/month` Join Today or the mailing list button.
   Both are handled sensibly; confirm before launch.
5. **One FAQ answer points at a document nobody can reach**: "Refer to Damian's AV/and Room Setup
   Requirements." That document is not linked on the old site and does not exist on the new one. It
   is the only answer on the site that asks the reader to do something impossible. Send the
   one-sheet, or approve the reword.
6. **The Granary needs one sentence on the format.** Nothing about the show exists in the source
   except a cross-promo link. The copy is written from the only three known facts. The reader
   currently learns the room and not the programme.
7. **Professional photography is the single biggest remaining quality ceiling.** The three studio
   portraits carry the site; the archive material does not.

---

## 7. How to re-run every check

All commands run from the repository root:
`/Users/omidebrahimi/Desktop/Projects/DamianMason`.

### 7.0 The two things to know before you run anything

**Port 3100, never 3000.** Port 3000 on this machine belongs to an unrelated project titled
"Aware". Screenshots and audits pointed at 3000 will silently capture someone else's site. Confirm
before trusting any result:

```bash
curl -s http://localhost:3100/ | grep -o '<title>[^<]*</title>'
# must print: <title>Damian Mason, Agricultural Keynote Speaker</title>
```

**Never run `next build` into `.next` while a dev server is using it.** Turbopack keeps a persistent
cache under the output directory and the two will corrupt each other. Use `npm run build:qa`, which
builds into `.next-qa` and restores `tsconfig.json` byte for byte afterwards. This is the entire
reason that script exists.

### 7.1 Build and type check

```bash
# Clean-tree build. Stop any dev server first.
rm -rf .next
npx tsc --noEmit          # must exit 0
npx next build            # must exit 0, 27 static pages, 21 prerendered HTML

# Or, safely, without taking the dev server down:
npm run build:qa          # builds into .next-qa
```

### 7.2 Serve for QA

Every audit below except the screenshot pass should run against a **production** build, not the dev
server, or the numbers are meaningless.

```bash
# Production server for auditing, port 3200
npx next start -p 3200
# or, against the QA build directory:
NEXT_DIST_DIR=.next-qa npx next start -p 3200

# Dev server, for visual work only
npx next dev -p 3100
```

### 7.3 Lighthouse

```bash
node scripts/lighthouse.mjs --base http://localhost:3200 --out docs/qa/lighthouse.json
```

**Known gap.** The committed script's `ROUTES` array covers **10** routes. The Phase 7 audit used a
copy carrying all 13 (the 10 plus `/reviews/`, `/meeting-coordinators/` and `/podcasts/`). If you
want the full 13, add those three to `ROUTES` at `scripts/lighthouse.mjs:32`. They were left out of
the committed script rather than added late, on the copy-freeze principle in section 2.

Run it on an **idle machine**. A parallel process in the same repository moved `/podcasts/` from 93
to 86 in one batch. Use at least 5 passes if you are gating on the result.

### 7.4 Accessibility, axe

```bash
node scripts/a11y.mjs --base http://localhost:3200 --widths 1440,390
# 19 routes x 2 widths = 38 runs. Writes docs/qa/a11y-report.json and a markdown summary.
```

Tags checked: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Best-practice rules are excluded on
purpose. Remember that a missing video caption track is invisible to this tool (section 6.1).

### 7.5 Links, images and redirects

```bash
node scripts/link-sweep.mjs --base http://localhost:3200
```

Then verify the redirects by hand, in both forms, because the slashless form takes two hops:

```bash
for p in /shop /damian-mason-online-shop /cart /checkout /my-account \
         /product/business-of-ag-success-group /product/food-fear /podcast-2 \
         /join-mailing-list /hello-world; do
  echo "== $p"; curl -sI -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "http://localhost:3200$p/"
done
```

Re-run the whole sweep **once after deploy**. The only three 404s are canonical and JSON-LD URLs
pointing at `https://damianmason.com/about/`, `/podcasts/` and the eggflation post, which are the
three routes that are new in this rebuild and do not exist on the site currently answering that
hostname. They resolve on deploy.

### 7.6 No-JavaScript

```bash
node scripts/nojs-check.mjs scripts/_targets-tmp.json docs/qa/nojs-report.json
```

The first argument is a JSON array of `{name, url}` targets, one per route. `scripts/_targets-tmp.json`
is committed and holds all 19 pointed at port 3100; edit the port in it if you are auditing 3200.

### 7.7 Copy duplication

```bash
node scripts/dupe-check.mjs --base http://localhost:3200 --out docs/qa/dupe-report.json --min 8 --max 12
```

Compare against `docs/qa/dupe-report-final.json`: 28 repeats, 26 cross-route, 672 raw n-grams,
8,777 prose words. A rise means new duplication was introduced. See section 4.9 for why the current
number is one higher than the previous baseline and why that is accepted.

### 7.8 Logo walls

```bash
node scripts/measure-logo-wall.mjs --widths 1440,768,390
```

Expect optical spread **1.00x** on all four walls at all three widths, optical range 68.9 to 69.0
above 768 and 63.9 to 64.0 below, and a smallest mark of 26.9px or better. The height spread of
2.39x (clients) and 2.57x (sponsors) is the aspect-ratio floor and is correct. Read section 4.4
before treating any of these as a defect.

### 7.9 Screenshots and visual review

```bash
node scripts/shoot.mjs --base http://localhost:3100 --widths 390,768,1440 --out docs/qa/screenshots/final
```

57 full-page PNGs, 19 routes x 3 widths. **Full-page shots at 390 run up to 29,478px tall and
downscale to about 53px wide when read**, so they are useless for judging detail. Shoot viewport
slices or targeted crops for anything you actually need to look at.

Two things in the mobile screenshots that look like defects and are not, recorded so nobody reopens
them: the dark circular "N" badge at bottom-left of every mobile shot is the **Next.js dev-mode
indicator**, not site furniture, and does not exist in a production build; and any broken
`i.ytimg.com` thumbnails are sandbox DNS flakes, since the same URLs load at other widths and the
CDN returns 200 on retry.

### 7.10 Orange budget

```bash
node scripts/orange-check.mjs --base http://localhost:3200
```

The design system permits exactly **one** filled orange field per viewport and it must belong to
the page's own primary action. Expect 0 routes over budget at 1440 and 390. Note that `/keynote/`
currently reports **0** fields in its first viewport, which is the finding in section 6.4.

### 7.11 The PLAN.md hand greps

```bash
grep -rnP "\x{2014}" content/ app/ components/         # em dashes: expect 0
grep -rn "wpengine.com" app/ components/ content/      # expect 2, both code comments
grep -rn 'href=""' app/ components/                    # expect 2, both code comments
grep -rnP "[A-Za-z]'[A-Za-z]" app/ content/ components/ --include='*.tsx' --include='*.ts'
                                                       # expect comment lines only, no copy
```

The straight-apostrophe grep is the only check that catches mixed apostrophe styles, which the
source harvest logged as a live-site defect on three pages. The em dash grep does not catch it.

For a check on what actually ships rather than on source, grep the prerendered HTML in
`.next/server/app/**/*.html` instead, where all four of the above return zero.

---

## 8. Artifact index

Everything cited in this report is on disk.

| Artifact | Path |
|---|---|
| Spec and client checklist | `docs/build/PLAN.md` |
| Phase log and binding corrections table | `docs/build/STATE.md` |
| Full removal record, item by item | `docs/CONTENT_MANIFEST.md` |
| Colour, type, spacing and contrast tables | `docs/DESIGN_SYSTEM.md` |
| Voice rules and banned phrases | `docs/VOICE.md` |
| Open questions for the client | `docs/OPEN-ITEMS.md` |
| Round 2 to 5 findings, with a `isRegressionFromFix` flag on each | `docs/qa/round-{2,3,4,5}-findings.json` |
| Lighthouse, 13 routes x 2 form factors | `docs/qa/lighthouse-final.json` |
| axe, 38 runs | `docs/qa/a11y-final.json`, `a11y-final-summary.md` |
| Link sweep, 461 URLs | `docs/qa/link-report-final.json` |
| No-JavaScript, 19 routes | `docs/qa/nojs-final.json` |
| Duplication, 8,777 prose words | `docs/qa/dupe-report-final.json` |
| Overflow, 114 checks | `docs/qa/overflow-final.json` |
| Mobile nav, 4 viewports | `docs/qa/mobilenav-final.json` |
| Logo wall history and the settled dispute | `docs/qa/logo-wall-measurement.md` |
| 57 full-page screenshots plus slices | `docs/qa/screenshots/final/` |
| Parity baseline, verbatim old-site copy | `_source/pages/*.md` (**never** `_source/extracted/`, which is lossy) |
| Counts the whole build is verified against | `_source/manifest.json` |

**One rule for anyone continuing this work.** `_source/extracted/*.txt` silently drops
`<blockquote>` bodies nested in Divi text modules. That cost the reviews page all ten testimonial
quote bodies, the BOASG biography paragraph, the keynote program description and the footer
testimonial before it was caught. **Read `_source/pages/*.md` as truth and `_source/html/*.html` for
verification. Never the extracts.**

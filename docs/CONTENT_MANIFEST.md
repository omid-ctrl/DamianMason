# Content Manifest — DamianMason.com rebuild

Phase 0 gate artifact. Machine-readable twin: `_source/manifest.json`.

- **Crawled:** 2026-08-06
- **Source pages harvested:** 28 of 28 (22 pages + 2 posts + 4 WooCommerce product pages)
- **Harvest files:** `_source/pages/*.md` (28 + `_global-chrome.md`) · **Extracts:** `_source/extracted/*.txt` (28) · **Raw mirrors:** `_source/html/*.html` (28) · **Media:** `_source/media/` (70 files)
- **Gate:** PASS. Every source page has a harvest file, an extract, a raw mirror and a disposition. Every count discrepancy against `docs/build/PLAN.md` is resolved and explained below.

---

## Totals

| Item | Plan expected | Actually found | Status |
|---|---|---|---|
| Source pages | 28 | 28 | match (page/post split differs — see discrepancies) |
| FAQ items (distinct real questions) | 15 | **14** | discrepancy — explained |
| FAQ toggles rendered on-page | — | 45 (across 3 pages, 5 of them junk) | — |
| Testimonials | 15 | **17** | discrepancy — explained (15 page testimonials + 2 the plan missed) |
| Videos | 11 (8 YouTube + 3 MP4) | **16 (13 YouTube + 3 MP4)** | discrepancy — explained |
| Press items on Media | 9 | 9 | match |
| Blog posts | 2 | 2 | match |
| Client logos supplied | 21 | 21 | match |
| Podcast sponsor logos supplied | 10 | 10 | match |
| Brand logos normalized | — | 15 (6 supplied + 9 from the mirror; B·A·F excluded) | — |
| Mirrored media assets | — | 70 | — |

---

## Every source page

Counts are per-page as rendered on the live site, including duplicates and defective items. `FAQ` counts raw accordion toggles, so it includes the placeholder and empty entries that will not carry over. `Test.` counts written testimonials only (video testimonials are counted under `Vid`).

| # | Source slug | Live URL | Disposition | New route | Sec | Para | Img | Vid | CTA | Test. | FAQ | Defects |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `home` | `/` | keep | `/` | 12 | 13 | 27 | 4 | 14 | 2 | 16 | 25 |
| 2 | `keynote` | `/keynote/` | keep | `/keynote/` | 8 | 13 | 5 | 3 | 6 | 3 | 13 | 20 |
| 3 | `reviews` | `/reviews/` | keep | `/reviews/` | 4 | 1 | 3 | 4 | 1 | 10 | 0 | 16 |
| 4 | `speaking` | `/speaking/` | new-route | `/speaking/` | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 7 |
| 5 | `meeting-coordinators` | `/meeting-coordinators/` | keep | `/meeting-coordinators/` | 8 | 8 | 11 | 0 | 8 | 1 | 16 | 23 |
| 6 | `collaboration-opportunities` | `/collaboration-opportunities/` | keep | `/collaboration-opportunities/` | 9 | 5 | 2 | 3 | 6 | 3 | 0 | 27 |
| 7 | `boasg` | `/boasg/` | keep | `/boasg/` | 5 | 8 | 4 | 0 | 3 | 0 | 0 | 19 |
| 8 | `the-business-of-agriculture` | `/the-business-of-agriculture/` | keep | `/the-business-of-agriculture/` | 9 | 8 | 2 | 0 | 19 | 1 | 0 | 26 |
| 9 | `do-business-better-podcast` | `/do-business-better-podcast/` | keep | `/do-business-better-podcast/` | 5 | 6 | 1 | 0 | 10 | 0 | 0 | 21 |
| 10 | `xtreme-ag` | `/xtreme-ag/` | keep | `/xtreme-ag/` | 5 | 2 | 5 | 0 | 7 | 0 | 0 | 19 |
| 11 | `blog-news` | `/blog-news/` | keep | `/blog-news/` | 11 | 1 | 6 | 3 | 7 | 0 | 0 | 18 |
| 12 | `acres-tv` | `/acres-tv/` | keep | `/acres-tv/` | 5 | 0 | 5 | 0 | 4 | 0 | 0 | 15 |
| 13 | `blog` | `/blog/` | keep | `/blog/` | 5 | 4 | 2 | 0 | 8 | 0 | 0 | 12 |
| 14 | `hello-world` | `/hello-world/` | keep | `/blog/eggflation-gives-producers-record-profits/` | 7 | 4 | 2 | 0 | 7 | 0 | 0 | 15 |
| 15 | `how-the-climate-crisis-is-causing-food-shortages-globally` | `/how-the-climate-crisis-is-causing-food-shortages-globally/` | keep | `/blog/how-the-climate-crisis-is-causing-food-shortages-globally/` | 6 | 3 | 1 | 0 | 4 | 0 | 0 | 14 |
| 16 | `contact-us` | `/contact-us/` | keep | `/contact-us/` | 1 | 5 | 0 | 0 | 1 | 0 | 0 | 7 |
| 17 | `join-the-conversation` | `/join-the-conversation/` | keep | `/join-the-conversation/` | 2 | 1 | 0 | 0 | 1 | 0 | 0 | 8 |
| 18 | `join-mailing-list` | `/join-mailing-list/` | redirect | `/join-the-conversation/` | 2 | 2 | 0 | 0 | 1 | 0 | 0 | 11 |
| 19 | `podcast-2` | `/podcast-2/` | redirect | `/podcasts/` | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 8 |
| 20 | `shop` | `/shop/` | redirect | `/about/#books` | 2 | 0 | 4 | 0 | 4 | 0 | 0 | 10 |
| 21 | `damian-mason-online-shop` | `/damian-mason-online-shop/` | redirect | `/about/#books` | 2 | 0 | 4 | 0 | 4 | 0 | 0 | 10 |
| 22 | `cart` | `/cart/` | redirect | `/about/#books` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 4 |
| 23 | `checkout` | `/checkout/` | redirect | `/about/#books` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 4 |
| 24 | `my-account` | `/my-account/` | redirect | `/about/#books` | 1 | 0 | 0 | 0 | 3 | 0 | 0 | 5 |
| 25 | `product__business-of-ag-success-group` | `/product/business-of-ag-success-group/` | redirect | `/boasg/` | 5 | 2 | 1 | 0 | 6 | 0 | 0 | 19 |
| 26 | `product__do-business-better-traits-habits-and-actions-to-help-you-succeed-limited-supply` | `/product/do-business-better-traits-habits-and-actions-to-help-you-succeed-limited-supply/` | redirect | `/about/#books` | 5 | 2 | 4 | 0 | 8 | 0 | 0 | 13 |
| 27 | `product__food-fear-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating` | `/product/food-fear-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating/` | redirect | `/about/#books` | 5 | 4 | 4 | 0 | 8 | 0 | 0 | 12 |
| 28 | `product__food-fear-audiobook-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating` | `/product/food-fear-audiobook-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating/` | redirect | `/about/#books` | 6 | 2 | 4 | 0 | 9 | 0 | 0 | 15 |

**Totals across all 28 pages:** 136 sections · 96 paragraphs · 97 image placements · 17 video embeds · 151 CTAs · 20 testimonial placements · 45 FAQ toggles · 403 recorded defects.

Those are *placements*, not distinct items. Distinct items are in the Totals table above: images repeat across pages, `/collaboration-opportunities/` reuses the three `/keynote/` testimonials verbatim, the home page carries an abbreviated pull-quote of a `/reviews/` testimonial, and 12 of the 14 real FAQ answers appear on two or three pages at once.

### SEO metadata inventory

Only 3 of the 28 pages have a meta description at all. That is the single largest SEO gap in the harvest.

| Page | SEO title | Meta description |
|---|---|---|
| `home` | Damian Mason \| The Business of Agriculture | Damian Mason is the #1 Agricultural Speaker with a track record of massive success with audiences all over the… |
| `keynote` | Keynote - Damian Mason Keynote Speaker | **MISSING** |
| `reviews` | Testimonials - Damian Mason Keynote Speaker | **MISSING** |
| `speaking` | Speaking - Damian Mason Keynote Speaker | **MISSING** |
| `meeting-coordinators` | Meeting Coordinators - Damian Mason Keynote Speaker | **MISSING** |
| `collaboration-opportunities` | Join Damian Mason as a Memorable Podcast Guest | Unlock exciting collaboration opportunities as a podcast guest with The Business of Agriculture's Damian Mason… |
| `boasg` | The Business of Ag Success Group - Damian Mason Keynote Speaker | **MISSING** |
| `the-business-of-agriculture` | The Business of Agriculture Podcast - Damian Mason Keynote Speaker | Looking for smart talk with entertaining commentary about the business of food, fuel, and fiber? You've found … |
| `do-business-better-podcast` | Podcast \| Do Business Better - Damian Mason Keynote Speaker | This podcast is for you: the entrepreneur, business owner, solopreneur, self employed striver, or business per… |
| `xtreme-ag` | XtremeAg - Damian Mason Keynote Speaker | **MISSING** |
| `blog-news` | Media - Damian Mason Keynote Speaker | **MISSING** |
| `acres-tv` | Acres TV - Damian Mason Keynote Speaker | **MISSING** |
| `blog` | Blog - Damian Mason Keynote Speaker | **MISSING** |
| `hello-world` | 'Eggflation' Gives Producers Record Profits While Internet Mocks Outrageous Prices - Damian Mason Keynote Speaker | **MISSING** |
| `how-the-climate-crisis-is-causing-food-shortages-globally` | How the Climate Crisis is Causing Food Shortages Globally - Damian Mason Keynote Speaker | **MISSING** |
| `contact-us` | Contact Us - Damian Mason Keynote Speaker | **MISSING** |
| `join-the-conversation` | Join The Conversation! - Damian Mason Keynote Speaker | **MISSING** |
| `join-mailing-list` | Join Mailing List - Damian Mason Keynote Speaker | **MISSING** |
| `podcast-2` | Podcasts - Damian Mason Keynote Speaker | **MISSING** |
| `shop` | Shop - Damian Mason Keynote Speaker | **MISSING** |
| `damian-mason-online-shop` | Damian Mason - Online Shop - Damian Mason Keynote Speaker | **MISSING** |
| `cart` | Cart - Damian Mason Keynote Speaker | **MISSING** |
| `checkout` | Cart - Damian Mason Keynote Speaker | **MISSING** |
| `my-account` | My account - Damian Mason Keynote Speaker | **MISSING** |
| `product__business-of-ag-success-group` | Business of Ag Success Group - Damian Mason Keynote Speaker | **MISSING** |
| `product__do-business-better-traits-habits-and-actions-to-help-you-succeed-limited-supply` | Do Business Better: Traits, Habits, and Actions to Help You Succeed (Limited Supply) - Damian Mason Keynote Speaker | **MISSING** |
| `product__food-fear-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating` | Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate Eating - Damian Mason Keynote Speaker | **MISSING** |
| `product__food-fear-audiobook-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating` | Food Fear (Audiobook) How Fear is Ruining Your Dinner and Why You Should Celebrate Eating - Damian Mason Keynote Speaker | **MISSING** |

---

## Route map

| New route | Built from | Note |
|---|---|---|
| `/` | `home` | Home. Rebuild without the Divi placeholder FAQ, the empty accordion item, the dead '#' click row and the Shop Now commerce CTA. Client logo wall grows from 6 to the 21 supplied logos. |
| `/about/` | `keynote`, `product__do-business-better-traits-habits-and-actions-to-help-you-succeed-limited-supply`, `product__food-fear-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating`, `product__food-fear-audiobook-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating`, `shop`, `damian-mason-online-shop` | NEW route. Bio and credentials lifted from the /keynote/ bio block; the #books anchor carries the three book covers and descriptions as credibility only, with no prices and no cart. Destination of every commerce 301. |
| `/speaking/` | `speaking` | NEW hub replacing the blank indexed stub. Fronts Keynote, Reviews, Meeting Coordinators and Collaboration Opportunities - the four items the old header nested under an href-less 'Speaking' parent. |
| `/keynote/` | `keynote` | Keeps the program description, the four-pillar credential bar, the three MP4 demo reels and the FAQ. The 404 life-coach-03.jpg background is dropped. |
| `/reviews/` | `reviews` | Ten written testimonials plus four video testimonials. Nav label stays 'Testimonials', slug stays /reviews/. |
| `/meeting-coordinators/` | `meeting-coordinators` | Both Lorem Ipsum FAQ placeholders, the dead Media Kit blurb and the two empty-href CTAs are removed. |
| `/collaboration-opportunities/` | `collaboration-opportunities` | Keeps the three collaboration tracks, the credential blurbs, the video row and the contact form (form needs a new backend). |
| `/boasg/` | `boasg`, `product__business-of-ag-success-group` | The $99/month Join Today CTA becomes a mailto: to damianmasonoffice@gmail.com. The accurate membership copy from the WooCommerce product page's Description tab is merged in. |
| `/podcasts/` | `podcast-2` | NEW hub. The old /podcast-2/ stub carried no content; this hub fronts the three podcast pages that the old header nested under an href-less 'Podcasts' parent. |
| `/the-business-of-agriculture/` | `the-business-of-agriculture` | Spotify consolidated to show 0UDXsogtCT4uNF4CpDpUae. The ten supplied sponsor logos replace the plain text sponsor links. Content-protection notice carried verbatim. |
| `/do-business-better-podcast/` | `do-business-better-podcast` | SoundCloud corrected to soundcloud.com/dobusinessbetter; the two href='#' social placeholders are fixed or dropped; the duplicated Latest Episode block collapses to one. |
| `/xtreme-ag/` | `xtreme-ag` | XtremeAg and The Granary brand marks placed here. The empty-href mailing-list CTA resolves to /join-the-conversation/. Screenshots replaced with real embeds or links. |
| `/blog-news/` | `blog-news` | Label 'Media' in the nav, slug stays /blog-news/. Nine press items carried over. |
| `/acres-tv/` | `acres-tv` | Needs real body copy - the old page has zero paragraphs. Shares the Leading Voice and Join the Conversation bands with /xtreme-ag/ as one component. |
| `/blog/` | `blog` | Post index. Gains an H1, drops the empty pagination and sidebar widgets, and drops the 'damianmasonstg' byline and 'Uncategorized' category. |
| `/blog/[slug]` | `hello-world`, `how-the-climate-crisis-is-causing-food-shortages-globally` | Two posts, both currently 5-7 words of body copy. Comments and the stock WordPress seed comment are dropped. /hello-world/ is re-slugged to /blog/eggflation-gives-producers-record-profits/. |
| `/contact-us/` | `contact-us` | Gains a real H1, a working mailto:, a tel: link and (new) a contact form. |
| `/join-the-conversation/` | `join-the-conversation`, `join-mailing-list` | Canonical newsletter route. The headline and pitch copy that existed only on /join-mailing-list/ are merged in before that URL is retired. |

## 301 redirects

| Old path | New destination |
|---|---|
| `/shop/` | `/about/#books` |
| `/damian-mason-online-shop/` | `/about/#books` |
| `/cart/` | `/about/#books` |
| `/checkout/` | `/about/#books` |
| `/my-account/` | `/about/#books` |
| `/product/*` | `/about/#books` |
| `/product/business-of-ag-success-group/` | `/boasg/` |
| `/podcast-2/` | `/podcasts/` |
| `/join-mailing-list/` | `/join-the-conversation/` |
| `/hello-world/` | `/blog/eggflation-gives-producers-record-profits/` |
| `/how-the-climate-crisis-is-causing-food-shortages-globally/` | `/blog/how-the-climate-crisis-is-causing-food-shortages-globally/` |

The `/product/business-of-ag-success-group/` rule is deliberately more specific than the `/product/*` wildcard and must be evaluated first. That product is the $99/month membership, not a book, so it belongs on `/boasg/`.

---

## Video inventory (16)

Verified by grepping every `youtube.com/embed/` and `.mp4` reference in all 28 raw HTML mirrors. All 13 YouTube IDs are distinct, none is site chrome, and none is repeated on a second page.

| # | ID / file | Kind | Title | On page(s) |
|---|---|---|---|---|
| 1 | `yL33iAIS2K4` | youtube | Life Changing! | `home` |
| 2 | `Tk8dPv_8Zo0` | youtube | Rocked It In Saskatchewan! | `home` |
| 3 | `xmwijvcK1wY` | youtube | MFA Emerging Leaders Conference | `home` |
| 4 | `jQAaQfcamVs` | youtube | Do Business Better for Lindsay Corporation | `home` |
| 5 | `iZ85SxLyykA` | youtube | Hardwood Lumbermen's Association recommends Damian Mason | `reviews` |
| 6 | `t3iCvSKEyx0` | youtube | Farm Credit Emerging Entrepreneurs Conference & Damian Mason | `reviews` |
| 7 | `e79QDYxpJOE` | youtube | Nutrien - a successful meeting! | `reviews` |
| 8 | `t6BkS7Eb9pE` | youtube | The "Ations" of Agriculture & Ag's Future | `reviews` |
| 9 | `M01PxhzRVFg` | youtube | Managing For The Future - A Candid Conversation with a 30 Year Old, 4th Gen Farmer | `collaboration-opportunities` |
| 10 | `csEaUJ52p3I` | youtube | Survival Strategies For Small Business | `collaboration-opportunities` |
| 11 | `5FUIE6Ks0Ok` | youtube | Damian Mason Discussing Climate & Food Shortage Truth on CheddarNews | `blog-news` |
| 12 | `-cmL21M1XF0` | youtube | Interview with Eagle Country 95.9 | `blog-news` |
| 13 | `Ngfdu0YdBY8` | youtube | Damian Mason Discussing Wheat and Inflation of Food Prices on NewsmaxTV | `blog-news` |
| 14 | `dm_-_food_waste-1080p.mp4` | mp4 | Food Waste | `keynote` |
| 15 | `dm_-_labor-1080p.mp4` | mp4 | Labor | `keynote` |
| 16 | `dm_-_innovation-1080p.mp4` | mp4 | Innovation (labelled "Live Keynote Segment on Ag Innovation" on /collaboration-opportunities/) | `keynote`, `collaboration-opportunities` |

Not videos, but adjacent and easy to miss: `/the-business-of-agriculture/` embeds a Libsyn audio player iframe (destination id `4323358`), and `/do-business-better-podcast/` self-hosts a **33 MB** MP3 (`VisionTechMgmt.mp3`). Both need a decision — neither should be self-hosted on the new site.

---

## Dead assets (404)

| Asset | Status | Used on | What it was |
|---|---|---|---|
| `…/2023/02/Podcaster-34c.png` | 404 | `the-business-of-agriculture` | The hero background for the flagship podcast page, declared `!important` in the head CSS. Only the `#060717` fallback colour survives, and every white text block on that page is designed against it. Needs a replacement image. |
| `…/2023/02/life-coach-03.jpg` | 404 | `keynote` | A leftover Divi **"Life Coach" premade-layout demo asset** referenced as a section background. The section was never re-photographed. Drop it. |

Both requests point at the `damianmason.wpengine.com` staging host, and neither file exists in `_source/media/`.

---

## Content that will NOT carry over

Every item below is deliberately dropped. Nothing else from the old site is being removed — everything not on this list has a route in the map above.

### Commerce (client instruction: "We are not selling product (books) moving forward.")

| Removed | Why |
|---|---|
| `/shop/` | Product grid with four priced WooCommerce items and zero marketing copy. Commerce is removed; the book covers survive on `/about/#books` with no prices. |
| `/damian-mason-online-shop/` | Byte-for-byte duplicate of `/shop/` at a second indexed URL — a duplicate-content defect on top of a page that is being deleted anyway. |
| `/cart/` | Stock WooCommerce empty-cart shell. Zero brand content, and it inlines live Stripe/WooPayments configuration into the page HTML. |
| `/checkout/` | Serves the Cart page with an empty cart; canonical, title and JSON-LD all say "Cart". No unique content, live payment keys inlined. |
| `/my-account/` | Stock WooCommerce login template. Every word is WordPress boilerplate. |
| `/product/food-fear-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating/` | Product page deleted; the cover art and the description paragraph move to `/about/#books` as credibility, with no price and no cart. |
| `/product/food-fear-audiobook-…/` | Same. Its description is the paperback's copy pasted verbatim and never mentions audio — it needs rewriting before reuse. |
| `/product/do-business-better-…-limited-supply/` | Same. "(Limited Supply)" is inventory status baked into the title and is dropped. Its description **ends mid-word** ("…shows you how to achieve i") — the client must supply the closing sentence before this copy ships. |
| `/product/business-of-ag-success-group/` | The membership sold as merchandise. Redirects to `/boasg/`, where the join CTA becomes a `mailto:`. Its short description is the wrong copy entirely (the Do Business Better book blurb) and is discarded. |
| Every price string: `$99.00`, `$19.95` ×3 | No prices anywhere on the new site. |
| "Add to cart" buttons, quantity spinners, product categories, breadcrumbs, "Related products" cross-sells, single-tab "Description" tab strips | WooCommerce furniture with no counterpart on a brochure site. |
| The `0 Items` cart counter in the top utility bar | The cart no longer exists. It was also hard-coded into the server-rendered HTML on every page, including `/cart/` itself. |

### The products FAQ item

| Removed | Why |
|---|---|
| **"DO YOU HAVE PRODUCTS FOR SALE?"** — *"Books may be pre-ordered/ pre-purchased for your event. (Let's talk about bulk pricing!) Also, individuals may visit Damian's website to purchase books."* | Explicit client requirement. The answer describes a purchase flow that will not exist. It appears three times on the live site (`/`, `/keynote/`, `/meeting-coordinators/`) and is removed from all three. This is what takes the FAQ from 14 distinct questions to **13**. |

### The Media Kit link

| Removed | Why |
|---|---|
| Media Kit blurb on `/` → `https://damianmason.wpengine.com/wp-content/uploads/2023/04/AG-MEDIA-KIT-3.zip` | Explicit client requirement ("Media Kit link removed, both instances"). It is also a raw `.zip` on the **staging** domain, opens in a new tab, and was never mirrored — almost certainly a 404. |
| Media Kit blurb on `/meeting-coordinators/` | Second instance. This one is worse: the blurb carries Divi's `et_clickable` class but has **no `href` and no `data-link` at all** — it looks like a button and does nothing. There is no Media Kit asset behind it. |

A real speaker one-sheet does not exist. Building one is open item #3 for the client.

### The B·A·F logo

| Removed | Why |
|---|---|
| `Damian Mason Logos/LOGO-REVISION-B-A-F-01 copy.png` (Business · Agriculture · Food) | Explicit client instruction to omit this mark. It is recorded in `_source/asset-map.json` under `skipped` and was **not read, not copied and not referenced** by the asset pipeline. It must appear nowhere on the new site. |

### The two 404 assets

| Removed | Why |
|---|---|
| `Podcaster-34c.png` (hero background, `/the-business-of-agriculture/`) | Returns 404 and is not in the mirror. The page's near-black `#060717` fallback is all that renders today. Cannot be carried over — a replacement hero image is needed for the flagship podcast page. |
| `life-coach-03.jpg` (section background, `/keynote/`) | Returns 404 and is not in the mirror. It is a leftover **Divi "Life Coach" demo-layout asset** from the original template, so there is nothing of Damian's to preserve. Dropped outright. |

### Lorem Ipsum and placeholder content

| Removed | Why |
|---|---|
| "Incidunt ut labore et dolore magnam?" / "Quis autem vel eum iure reprehenderit…" on `/meeting-coordinators/` — **twice** | Divi's untouched default Lorem Ipsum. Both copies are byte-identical, and in **both** accordions the placeholder is the item rendered `et_pb_toggle_open`, so the live page greets visitors with Latin filler in both columns. |
| "Your Title Goes Here" / "Your content goes here. Edit or remove this text inline or in the module Content settings…" on `/` | Unedited Divi placeholder, also rendered open by default. The single most visible defect on the home page. |
| The empty FAQ toggle on `/` (empty `<h5>` title, empty content div, rendered open) | An accordion that loads with a blank expanded panel. |
| The empty answer to "WHAT ARE THE TECHNOLOGY REQUIREMENTS?" on `/keynote/` | The toggle opens onto nothing. The home/meeting-coordinators wording of the same question **does** have an answer, so the surviving FAQ uses that one. |

### Other content deliberately dropped

These are not on the brief's removal list but have no defensible place on the new site. Recorded here so the Phase 6 content-parity agents do not flag them as losses.

| Removed | Why |
|---|---|
| The stock WordPress seed comment on `/hello-world/` ("Hi, this is a comment. To get started with moderating…", dated 2022-12-16, author link → `wpengine.com`) | WordPress boilerplate live on a client production page for four years, with an outbound link to the host. Comments are dropped entirely on the new site. |
| Both WordPress comment forms and the Akismet honeypot | They post to `wp-comments-post.php?wpe-comment-post=damianmason`, a WP Engine-specific endpoint that breaks on any other host. No CMS, no comments. |
| The `damianmasonstg` author byline and the `Uncategorized` category on both posts | A raw staging username and WordPress's default category, shown to visitors. |
| The empty `/speaking/` and `/podcast-2/` stubs | Both are a single H1 and nothing else, on the Divi **blank** template — no header, no footer, no navigation, no branding — and both are indexable. They are replaced by real hubs at `/speaking/` and `/podcasts/`. |
| `/join-mailing-list/` as a separate URL | Identical Mailchimp embed to `/join-the-conversation/` (same account, list and form ids). **Its headline and pitch copy carry over** to the surviving route before the URL is retired — that copy exists nowhere else. |
| Six empty structural elements: `et_pb_section_3` on `/` (spacer only), `et_pb_row_17` on `/` (empty clickable row targeting the literal string `#`), `et_pb_section_5` on `/keynote/` (parallax band with no modules), `et_pb_section_3` on `/collaboration-opportunities/` (parallax band with no modules), `et_pb_section_1` on `/blog-news/` (zero rows), and the five empty `<h1><strong></strong></h1>` spacers above the Forbes item | Dead markup used for vertical rhythm. |
| The empty Divi video module above the Soybeans image on `/blog-news/` | Renders as a blank gap. |
| Empty sidebar widget `block-3` (`<h2 class="wp-block-heading"></h2>`) and the two empty footer widgets `block-5` / `block-8` | Widgets started and never filled in, shipped to production on every page that renders them. |
| Both empty-`href` "Sign Up for Damian's Mailing List" buttons (`/meeting-coordinators/`, `/xtreme-ag/`), the empty-`href` "Fill Out Inquiry Request" button (`/meeting-coordinators/`), and the three `href="#"` social/newsletter placeholders (`/do-business-better-podcast/`, `/the-business-of-agriculture/`) | Buttons that go nowhere. Each is either given its real destination (the correct mailing-list target is known from `/acres-tv/`) or removed. |
| The stale Spotify show `5rSDDoG9qMqkSo3gp6qFDq` on `/the-business-of-agriculture/` | One page linking two different Spotify shows. Consolidated to `0UDXsogtCT4uNF4CpDpUae`. |
| The wrong SoundCloud link on `/do-business-better-podcast/` (`soundcloud.com/thebusinessofagriculture`) | Points at Damian's *other* podcast. Corrected to `soundcloud.com/dobusinessbetter`. |
| The duplicated "Latest Episode" block on `/do-business-better-podcast/` | The entire section repeats verbatim as item 1 of "Latest 3 Episodes" directly below it. Same copy twice within one screen. |
| Every pasted-in third-party wrapper: Squarespace (`sqs-block quote-block`, `figcaption.source`, `fluid-engine`, `block-yui_*`), SoundCloud (`infoStats__description`, `truncatedUserDescription m-collapsed`), Libsyn/Redactor (`post_body_wrapper`, `body_text redactor-styles`), Gmail (`data-saferedirecturl`, `<span class="il">`), Google SERP (`hgKElc`), and Claude chat (`font-claude-response-body break-words whitespace-normal leading-[1.7]` on all five `/contact-us/` paragraphs) | Copy was pasted from six different sources over four years and the wrapper markup was never stripped. Keep the words, drop the containers. |
| Every `damianmason.wpengine.com` URL and every `?page_id=NNN` footer link | Staging-host leakage site-wide. The footer's "Home" link is also plain `http://DamianMason.com`. |
| `maximum-scale=1.0, user-scalable=0` in the viewport meta | Disables pinch-zoom site-wide — a WCAG 2.1 SC 1.4.4 failure. |
| The four current client logos with no supplied replacement — John Deere, BASF, Helena, IPPA | The 21 supplied logos replace the current 6, but only Merck and FCS of America overlap. Whether to keep the other four is **open item #2** for the client; they are held out of the wall until that is answered. |
| The 14 macOS screenshots used as marketing imagery | Raw screen captures with default filenames (`Screenshot-2023-04-25-at-10.51.10-AM.png` and friends), several with browser chrome and player UI still visible, two with a raw U+202F narrow no-break space inside the filename. They are retained in `_source/media/` and mapped in `_source/asset-map.json` because several are the only artwork that exists for their subject, but every one is a quality ceiling. Real photography is **open item #4**. |

---

## Gate discrepancies

All eleven are resolved or explicitly explained. None blocks Phase 1.

**1. VIDEOS**

Plan expected 11 (8 YouTube + 3 MP4). ACTUAL is 16 (13 YouTube + 3 MP4). All 13 YouTube IDs were verified distinct by grepping every embed URL in the 28 raw HTML mirrors: home has 4 (yL33iAIS2K4, Tk8dPv_8Zo0, xmwijvcK1wY, jQAaQfcamVs), reviews has 4 (iZ85SxLyykA, t3iCvSKEyx0, e79QDYxpJOE, t6BkS7Eb9pE), collaboration-opportunities has 2 (M01PxhzRVFg, csEaUJ52p3I), blog-news has 3 (5FUIE6Ks0Ok, -cmL21M1XF0, Ngfdu0YdBY8). NONE is site chrome and NONE is repeated on a second page - the header, footer and utility bar contain no video at all. The plan's 8 undercounts by 5. RESOLVED: build for 13 YouTube embeds plus the 3 MP4 demo reels. dm_-_innovation-1080p.mp4 is the only asset reused across pages (keynote and collaboration-opportunities), which is probably where the '8' came from if MP4 reuse was double-counted.

**2. FAQ ITEMS**

Plan expected 15. ACTUAL is 14 distinct real questions. Raw on-page toggles total 45 across three pages (home 16, keynote 13, meeting-coordinators 16), of which 5 are junk: 1 completely empty toggle on home, 1 unedited Divi 'Your Title Goes Here' placeholder on home, 2 byte-identical Lorem Ipsum placeholders on meeting-coordinators, and 1 real question on keynote with an empty answer. The union of real questions is 14. Two of the 14 appear with divergent wording between pages ('HOW DO YOU MANAGE BOOKING AND TRAVEL AND TRAVEL EXPENSES?' on home vs 'HOW DO YOU MANAGE BOOKING TRAVEL & TRAVEL EXPENSES?' on keynote vs 'HOW DO YOU MANAGE BOOKING TRAVEL AND TRAVEL EXPENSES?' on meeting-coordinators; and 'WHAT ARE YOUR TECHNOLOGY REQUIREMENTS?' on home/meeting-coordinators vs 'WHAT ARE THE TECHNOLOGY REQUIREMENTS?' on keynote, where the keynote copy has no answer at all). The plan's 15 most likely counted those two wording variants as separate items. RESOLVED: 14 distinct, minus the 'DO YOU HAVE PRODUCTS FOR SALE?' item the client asked to remove, leaves 13 FAQ entries to carry over.

**3. TESTIMONIALS**

Plan expected 15 (10 on /reviews/ plus 5 across other pages). That is EXACTLY right for page testimonials: /reviews/ has 10 written, /keynote/ has 3 (Wendy J. Ruud, The Titan Pro Team, Tim Luthy), /meeting-coordinators/ has 1 (National Ag Aviation Association) and /the-business-of-agriculture/ has 1 (Geoff Bastow). ACTUAL total distinct quotes is 17, because the plan did not count two more: the unattributed book endorsement on the home page ('I absolutely love this book!...') and the site-wide footer quote (B. Kettler, IHLA) which appears in the chrome on every page including /cart/ and /checkout/. Also note /collaboration-opportunities/ carries a byte-identical copy of the three /keynote/ testimonials (already counted once, not twice), and the home page's 'Man, that guy makes you think! I loved it!' is an abbreviated pull-quote of the Amy B., AgroLiquid testimonial that appears in full on /reviews/ (counted once). RESOLVED: 15 speaking testimonials + 1 book endorsement + 1 footer quote = 17.

**4. PAGE / POST SPLIT**

Plan expected '21 live page URLs plus 3 posts and 4 product pages = 28'. The total of 28 is correct and every one is harvested, but the split is wrong. ACTUAL is 22 pages + 2 posts + 4 products = 28. There are only two WordPress posts (/hello-world/ and /how-the-climate-crisis-is-causing-food-shortages-globally/); /blog/ is the post archive, not a post. RESOLVED: no content is missing, only the plan's arithmetic.

**5. THE GRANARY**

The plan places The Granary on /xtreme-ag/. It is NOT there. A case-insensitive search of all 28 raw HTML mirrors finds 'granary' only in the-business-of-agriculture.html, as a cross-promo link to xtremeag.farm/the-granary. RESOLVED: the supplied 'The Granary 3x png@3x.PNG' brand mark still belongs on /xtreme-ag/ per the client requirement checklist, but there is no source copy to carry over - it must be written.

**6. SPOTIFY**

/the-business-of-agriculture/ links two different Spotify shows from one page (0UDXsogtCT4uNF4CpDpUae in the 'Listen Now:' row, 5rSDDoG9qMqkSo3gp6qFDq in the 'Start Listening Today!' row). RESOLVED per plan: consolidate to 0UDXsogtCT4uNF4CpDpUae.

**7. BOASG PRODUCT REDIRECT**

The plan's blanket rule is /product/* -> /about/#books. The BOASG product page is a membership, not a book, so it is redirected to /boasg/ instead. The specific rule wins over the wildcard. RESOLVED and recorded in the redirect map.

**8. HELLO-WORLD SLUG**

The plan says '/hello-world/ -> the real post slug' without naming it. The post's real title is "'Eggflation' Gives Producers Record Profits While Internet Mocks Outrageous Prices". RESOLVED: slug chosen is /blog/eggflation-gives-producers-record-profits/. The second post moves under /blog/ too, so /how-the-climate-crisis-is-causing-food-shortages-globally/ needs its own 301 that the plan did not list - added.

**9. CLIENT LOGO OVERLAP**

The 21 supplied client logos include Merck and FCS of America, which are already on the live wall, but do NOT include John Deere, BASF, Helena or IPPA, which are. Only Merck and Farm Credit Services survive the swap; the other four current logos have no supplied replacement. This is already open item #2 in the plan - flagged here, not silently resolved.

**10. MEDIA ASSET MIRROR GAPS (not counted as dead assets)**

The Media Kit ZIP (AG-MEDIA-KIT-3.zip on the staging host) was never mirrored and is being removed per client instruction anyway. Several WordPress -1080x675 / -1024x577 / -300x300 derivatives referenced by srcset and og:image were not mirrored either - only the full-size originals were. Neither blocks the rebuild since the new site regenerates its own derivatives.

**11. MEETING-COORDINATORS ACCORDION SPLIT**

The harvest file's prose says the two accordions hold 9 and 7 items, but its own verbatim list enumerates 8 and 8 (16 total, which both agree on). RESOLVED: the verbatim list is authoritative; the total of 16 is unaffected.

---

## Gate result

**PASS.**

- 28 of 28 source pages have a harvest file in `_source/pages/`, a deterministic extract in `_source/extracted/`, a raw mirror in `_source/html/` and an explicit disposition. Zero missing harvest files.
- 16 dispositions are `keep`, 1 is `new-route` (`/speaking/`, an empty stub rebuilt as a real hub), 11 are `redirect`.
- Every count that diverges from `docs/build/PLAN.md` is recorded above with the evidence that produced the real number. No count was adjusted to match the plan.

Four harvest-fidelity warnings for downstream agents, because the deterministic extracts are lossy in specific places and must not be treated as complete:

- `_source/extracted/keynote.txt` silently drops the `<blockquote>` program description in section 3.
- `_source/extracted/boasg.txt` silently drops the entire Damian Mason bio paragraph (an unclosed `<p class="">` breaks the extractor).
- `_source/extracted/the-business-of-agriculture.txt` drops the testimonial byline "– Geoff Bastow" and the bottom blockquote H3.
- `_source/extracted/home.txt` drops the footer testimonial blockquote entirely.

In all four cases the copy was recovered from the raw HTML and is present in the `_source/pages/*.md` harvest files. **Build from `_source/pages/`, not from `_source/extracted/`.**

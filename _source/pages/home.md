# Straight-Forward Agriculture Dialogue

- **Source URL:** https://damianmason.com/
- **Slug:** home
- **SEO title:** Damian Mason | The Business of Agriculture
- **Meta description:** Damian Mason is the #1 Agricultural Speaker with a track record of massive success with audiences all over the world.
- **OG image:** https://damianmason.com/wp-content/uploads/2023/05/DSC_7312-scaled.jpg
- **Disposition:** keep

> Page build notes: Divi page builder, `page-id-99`, 11 `et_pb_section` blocks (`et_pb_section_0` …
> `et_pb_section_10`). Section background colors/images for this page live in the **deferred** stylesheet
> `wp-content/et-cache/99/et-divi-dynamic-99.css`, which was **not mirrored** — so the mirrored HTML contains
> no section background bindings for home. Several sections are marked `et_pb_with_background`
> (sections 0, 5, 6, 7, 8) and at least two carry white text, so a rebuilder must assume dark/orange fills
> there and re-derive them from screenshots. The og:image `DSC_7312-scaled.jpg` is **never rendered on the
> page** (it exists in `_source/media/`).

## Sections

### 1. Hero — Straight-Forward Agriculture Dialogue
- **Type:** hero
- **Eyebrow:** Keynote Speaker • Media Guest • Podcaster • Author  (H6, bold, forced `color: #000000`)
- **Heading:** Straight-Forward Agriculture Dialogue  (H1, forced `color: #000000`)
- **Subheading:** -
- **Body:**
  A Powerhouse in the Agriculture industry, Damian Mason travels the globe to speak about the industry he loves.
- **List items:**
  -
- **CTAs:**
  - "Book Now" -> https://damianmason.com/contact-us/
  - "Learn More" -> https://damianmason.com/keynote/
- **Images:**
  - `company-67-a-pr-18.png` | alt="" | role: decorative | 770×287 dark-navy (#111827-ish) double-chevron / mountain shape, no alt text
  - `company-67-a-pr-16.png` | alt="" | role: decorative | 1150×427 orange (#F4511E-ish) double-chevron / mountain shape, no alt text; module has `et_pb_image_sticky`
- **Videos:**
  -
- **Notes:** Section class is `et_pb_section_0 company-67a-sc-hero-hed et_pb_with_background`. Immediately
  after the H1 there is an **empty paragraph** `<p><span style="color: #000000;">&nbsp;</span></p>` used as a
  spacer. The section also contains a Divi *Code* module (`et_pb_code_0`) with inline CSS:
  `.company-67a-sc-hero-hed .et_pb_button_module_wrapper { display: inline-block; }` — that is the only thing
  putting the two buttons side by side. Both buttons have Divi entrance animations (`slideBottom`, 900ms,
  1000ms delay). The eyebrow uses `•` (U+2022) as separator with spaces on both sides.

### 2. Not Your Boring Ag Speaker — copy column
- **Type:** copy
- **Eyebrow:** Not Your Boring Ag Speaker, Damian is:  (H4)
- **Heading:** ✓ Thought Provoking  (H2, bold)
- **Subheading:** -
- **Body:**
  Damian Mason has an exceptional understanding of the Agriculture industry, he’s been involved in it his entire life. That, combined with his passion to stay one step ahead of what’s looming for the industry, he works tirelessly to stay up to date with current trends, research current events and news, and connect with industry leaders. He provides immediate take-aways, future outlooks, and insights, to his audiences, but most importantly, Damian has an uncanny ability to stir up feelings of dignity and pride for people working in the most important industry in the world.
- **List items:**
  - ✓ Thought Provoking  (H2, bold)
  - ✓ Engaging  (H2, bold)
  - ✓ Enthusiastic  (H2, bold)
  - ✓ Hilarious  (H2, bold)
- **CTAs:**
  - "Explore Keynotes" -> https://damianmason.com/keynote/
- **Images:**
  -
- **Videos:**
  -
- **Notes:** These four "list items" are **four separate `<h2>` elements** stacked inside one text module
  (`et_pb_text_4`), each wrapped in `<strong>`, each prefixed with the literal character `✓` (U+2713) followed
  by a space. This is the source of four of the page's H2s. Left half (`et_pb_column_1_2`) of
  `et_pb_section_1`; the column has a `fade` entrance animation. The apostrophes in "he’s" and "what’s" are
  curly (U+2019).

### 3. Testimonial + video column
- **Type:** testimonial-grid
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  Man, that guy makes you think! I loved it!

  Amy B., AgroLiquid
- **List items:**
  -
- **CTAs:**
  -
- **Images:**
  - `company-67-a-pr-14.png` | alt="" | role: decorative | 128×128 — renders as an all-white / near-invisible quotation-mark glyph on a white canvas; used twice (above and below the video)
  - `company-67-a-pr-14.png` | alt="" | role: decorative | same file repeated as `et_pb_image_3`
- **Videos:**
  - youtube:yL33iAIS2K4 — "Life Changing!"
- **Notes:** Right half of `et_pb_section_1`, column animation `transformAnim`. Order inside the column is:
  quote paragraph → quote-mark image → attribution → Divi divider (`et_pb_divider_0`, spacer) → YouTube video
  → quote-mark image again. **The attribution "Amy B., AgroLiquid" is hard-coded `color: #ffffff`** — white
  text. The section background is not present in the mirrored CSS, so on a white background this attribution
  is invisible. Iframe is `https://www.youtube.com/embed/yL33iAIS2K4?feature=oembed`, 1080×608.

### 4. Photo trio
- **Type:** gallery
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  -
- **Images:**
  - `Screenshot-2023-04-20-at-3.38.42-PM-1.png` | alt="" | role: inline | 1372×776 — **macOS screenshot used as a marketing image** (WP title "Screenshot 2023-04-20 at 3.38.42 PM"), no alt text
  - `Screenshot-2023-04-25-at-9.17.26-AM.png` | alt="" | role: inline | 1800×1014 — **macOS screenshot used as a marketing image**, no alt text
  - `332503780_161776152950398_8554729294588018579_n.jpeg` | alt="" | role: inline | 1536×2048 — filename is a raw Facebook/Instagram CDN export, portrait orientation, no alt text
- **Videos:**
  -
- **Notes:** `et_pb_section_2` — two columns (two stacked landscape screenshots on the left, one tall portrait
  photo on the right). No copy at all in this section. `et_pb_section_3` (which follows) contains **nothing
  but a Divi divider/spacer** (`et_pb_divider_1`) — an empty section that exists only for vertical rhythm.

### 5. Client logo wall
- **Type:** logo-wall
- **Eyebrow:** -
- **Heading:** Some of Damian’s Clients:  (H4)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  -
- **Images:**
  - `John_Deere_logo.svg_.png` | alt="John Deere Logo" | role: logo | 1200×803
  - `lo-helenalogo.png` | alt="" | role: logo | 500×240 — Helena; **no alt text**
  - `FCSAmerica-logo-400x192-1.jpg` | alt="Farm Credit Services Logo" | role: logo | 400×192 — lowest-resolution asset in the wall
  - `merck-logo.png` | alt="" | role: logo | 225×225 — **no alt text**
  - `19225_IPPA_Alliance_Logo_4C-scaled-1.jpg` | alt="cpda logo" | role: logo | 2560×1246 — **alt text is wrong**: the file is the IPPA (Indiana Pork Producers) Alliance logo but the alt says "cpda logo"
  - `BASF-Logo_bw.svg_.png` | alt="" | role: logo | 2560×925 — **no alt text**; 2560px-wide asset rendered in a 1/6 column
- **Videos:**
  -
- **Notes:** `et_pb_section_4`. Six `et_pb_column_1_6` columns in one row. Heading uses a curly apostrophe
  (U+2019) in "Damian’s". Asset sizes are wildly inconsistent (400px → 2560px wide) with no normalization.

### 6. A Win/Win/Win for… Event Planners, Organizers and Audience Attendees
- **Type:** stat-row
- **Eyebrow:** A Win/Win/Win for…  (H4)
- **Heading:** Event Planners, Organizers and Audience Attendees  (H2)
- **Subheading:** -
- **Body:**
  Material that is fresh, new and relevant for your audience.

  Leaves audiences thoroughly entertained and with immediate take-aways.

  From inquiry to the day of event the process is seamless.

  Added value with in-depth, extended breakout sessions
- **List items:**
  - **Custom Messages** (H4) — Material that is fresh, new and relevant for your audience.
  - **Guaranteed Success** (H4) — Leaves audiences thoroughly entertained and with immediate take-aways.
  - **Flawless Process** (H4) — From inquiry to the day of event the process is seamless.
  - **Add-On Options** (H4) — Added value with in-depth, extended breakout sessions
- **CTAs:**
  - "Go To Meeting Coordinators Page" -> https://damianmason.com/meeting-coordinators/
- **Images:**
  - `WEB-COLLAGE-2.png` | alt="Damian Mason Photos" | role: inline | 1152×1500 — a **pre-baked photo collage flattened into a single PNG** (multiple event photos composited in an image editor); not responsive, not individually addressable
  - `custom_message.png` | alt="Custom Message" | role: decorative | 256×256 icon
  - `success.png` | alt="success" | role: decorative | 256×256 icon
  - `process.png` | alt="" | role: decorative | 256×256 icon — **no alt text**
  - `add-ons.png` | alt="" | role: decorative | 256×256 icon — **no alt text**
- **Videos:**
  -
- **Notes:** `et_pb_section_5`, a Divi **specialty section** (`et_section_specialty`) with
  `et_pb_with_background`. Left column = eyebrow + H2 + collage. Right column = a 2×2 grid of icon/heading/copy
  blocks (`et_pb_row_inner_0` and `et_pb_row_inner_1`, both `zoomLeft` animation, 1000ms, 500ms delay) plus a
  centered button row. The eyebrow ends with a real ellipsis character `…` (U+2026, from `&#8230;`), not three
  periods. "Added value with in-depth, extended breakout sessions" has **no terminating period** while the
  other three do.

### 7. If it’s Agriculture, it Needs Damian.
- **Type:** video-grid
- **Eyebrow:** As a  Leading Voice in the Industry, Damian is Sought After for Conversations & Commentary on Hot Topics  (H4)
- **Heading:** If it’s Agriculture, it Needs Damian.  (H2)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  - Podcast Host & Guest  (H4, blurb header)
  - News & Commentary  (H4, blurb header)
  - Influencer & Promoter  (H4, blurb header)
- **CTAs:**
  - "Click Here to Inquire About Working With Damian" -> https://damianmason.com/contact-us/
- **Images:**
  - `Screenshot-2023-04-18-at-5.55.45-PM.png` | alt="" | role: inline | 1798×1008 — **macOS screenshot used as a marketing image**, no alt text
  - `podcast.png` | alt="podcast guest and host" | role: decorative | 512×512 icon
  - `Screenshot-2023-04-19-at-12.16.28-PM.png` | alt="Damian Mason on Cheddar News" | role: inline | 2118×1190 — **macOS screenshot of a Cheddar News segment**, used as marketing imagery
  - `content-contributor.png` | alt="content contributor" | role: decorative | 512×512 icon
  - `Screenshot-2023-04-25-at-2.44.31-PM.png` | alt="" | role: inline | 730×414 — **macOS screenshot used as a marketing image**, no alt text, lowest resolution of the three (730px wide)
  - `influencer.png` | alt="" | role: decorative | 512×512 icon — **no alt text**
- **Videos:**
  -
- **Notes:** `et_pb_section_6 company-67-a-galsc et_pb_with_background`. Three equal columns, each = screenshot
  image + blurb (icon left, H4 right). The blurb headers contain a literal `&` (ampersand), not "and".
  **The eyebrow H4 contains a double space: "As a  Leading Voice"** — kept verbatim above. Each of the three
  columns repeats the same Divi Code module with inline CSS
  `.company-67-a-galsc .et_pb_image img { object-fit: cover; }` — i.e. **the same `<style>` block is emitted
  three times** on the page. Columns have staggered `zoomBottom` animations (500 / 750 / 1000ms delay).

### 8. Connecting people of the world’s most important industry.
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** Connecting people of the world’s most important industry.  (H2)
- **Subheading:** -
- **Body:**
  You don’t need anyone telling you the weather forecast or the commodity prices, technology does that for you! What you need is a connection with real-world agriculture people and topics that inform, educate, and help you grow.

  THE BUSINESS OF AGRICULTURE:

  More Than 70,000 Views & Downloads Per Month

  Podcast by Damian Mason
- **List items:**
  - Podcast  (H4, bordered clickable blurb, arrow icon U+F061)
  - Success Group  (H4, bordered clickable blurb, arrow icon U+F061)
  - The Business of Agriculture  (H4, blurb header) / Podcast by Damian Mason (blurb description)
- **CTAs:**
  - "Podcast" (whole blurb `et_pb_blurb_3` is clickable) -> https://damianmason.com/the-business-of-agriculture/  <!-- flag: module-level click target, not a real <a> — no keyboard focus, no visible link -->
  - "Success Group" (whole blurb `et_pb_blurb_4` is clickable) -> https://damianmason.com/boasg/  <!-- flag: module-level click target, not a real <a> -->
- **Images:**
  - `Screenshot-2023-04-18-at-5.52.49-PM.png` | alt="XTREME AG 1" | role: inline | 1406×1008 — **macOS screenshot of the XtremeAg site/video used as a marketing image**
  - `biz-of-ag-podcast-icon-white.png` | alt="biz of ag icon" | role: logo | 380×380 podcast cover icon
- **Videos:**
  -
- **Notes:** Rows 10–11 of `et_pb_section_7` (`et_pb_with_background`). "THE BUSINESS OF AGRICULTURE:" is a
  **paragraph in bold with `color: #000000`**, not a heading, and it is immediately followed by an **empty
  `<p><strong></strong></p>`**. The two clickable blurbs get their URLs from the page-level JS array
  `et_link_options_data`, **not** from anchor tags — meaning they are invisible to screen readers, crawlers,
  and keyboard users. "More Than 70,000 Views & Downloads Per Month" is an unsourced stat presented as plain
  body copy. Row `et_pb_row_11` has a `transformAnim` entrance animation.

### 9. RAVE REVIEWS — What People Are Saying…
- **Type:** video-grid
- **Eyebrow:** RAVE REVIEWS  (H4)
- **Heading:** What People Are Saying…  (H2)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  - "More Reviews" -> https://damianmason.com/reviews/
- **Images:**
  -
- **Videos:**
  - youtube:Tk8dPv_8Zo0 — "Rocked It In Saskatchewan!"
  - youtube:xmwijvcK1wY — "MFA Emerging Leaders Conference"
  - youtube:jQAaQfcamVs — "Do Business Better for Lindsay Corporation"
- **Notes:** Rows 12–14 of the same `et_pb_section_7`. Three equal columns, one YouTube iframe each
  (1080×608, `?feature=oembed`). **The video titles are the only text identifying each testimonial** — there
  is no speaker name, organization, or transcript on the page. Heading ends with a real ellipsis `…` (U+2026).

### 10. Join the Conversation
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** Join the Conversation  (H2, `text-align: center`)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  - "Sign Up for Damian's Mailing List" -> https://damianmason.com/join-the-conversation/  <!-- label uses a STRAIGHT apostrophe (&#039; / U+0027), unlike every other apostrophe on the page -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** `et_pb_section_8 et_pb_with_background`. Two unequal columns (3/5 heading, 2/5 button). There is
  **no email input on this page** — it is a link to `/join-the-conversation/`, not a signup form.

### 11. Book endorsement / Shop Now
- **Type:** testimonial
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  I absolutely love this book! If you love food and hate the hype, this book is for you!
- **List items:**
  -
- **CTAs:**
  - "Shop Now" -> https://damianmason.com/damian-mason-online-shop/  <!-- flag: commerce; opens in target="_blank" -->
- **Images:**
  - `company-67-a-pr-23.png` | alt="" | role: decorative | **69×49** orange opening-quotation-mark glyph — extremely low resolution, no alt text
- **Videos:**
  -
- **Notes:** `et_pb_section_9`. Order: quote-mark image → quote paragraph → **five `et_pb_icon` modules, each
  rendering FontAwesome U+F005 (solid star)** = a 5-star rating graphic built from five separate Divi modules
  → "Shop Now" button. **The quote has no attribution at all** — no name, no publication, no source. The book
  it refers to (*Food Fear*) is never named in this section. Immediately after, `et_pb_row_17` is an
  **entirely empty clickable row** (`et_clickable`, `et_pb_column_empty`) whose `et_link_options_data` URL is
  the literal string `"#"` — a dead, invisible, full-width click target left in the page.

### 12. Do You Have Any Questions? — FAQ
- **Type:** faq
- **Eyebrow:** -
- **Heading:** Do You Have Any Questions?  (H2)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  - Media Kit  (H4, clickable blurb, check-circle icon U+F058)
- **CTAs:**
  - "Media Kit" (whole blurb `et_pb_blurb_6` is clickable) -> https://damianmason.wpengine.com/wp-content/uploads/2023/04/AG-MEDIA-KIT-3.zip  <!-- flag: wpengine.com URL — points at the staging host, target="_blank", and the .zip is NOT in _source/media -->
  - "Not Finding the Answer to Your Question? Email Us!" -> mailto:damianmasonoffice@gmail.com
  - "https://www.youtube.com/@DamianMasonChannel/videos" -> https://www.youtube.com/@DamianMasonChannel/videos  <!-- inline link inside a FAQ answer -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** `et_pb_section_10`. Three columns: (1) H2 + Media Kit blurb, (2) `et_pb_accordion_0` with 8 toggle
  items, (3) `et_pb_accordion_1` with 8 toggle items. Full verbatim Q&A is under "Verbatim FAQ" below.
  **Accordion 1, item 0 is completely empty** — `<h5 class="et_pb_toggle_title"></h5>` and
  `<div class="et_pb_toggle_content"></div>` — and it carries `et_pb_toggle_open`, so the accordion loads with
  a blank open panel. **Accordion 2, item 0 is the unedited Divi placeholder** ("Your Title Goes Here" /
  "Your content goes here. Edit or remove this text inline or in the module Content settings…") and it too is
  `et_pb_toggle_open`. Columns 33/34 have `slideLeft` / `slideRight` entrance animations. Several answers
  contain **double spaces after sentence periods** and **trailing spaces** — preserved verbatim below.

## Full item inventory
- Paragraphs: 13 body paragraphs (excludes the 14 non-empty FAQ answers, the 1 empty spacer `<p>` in the hero, and the 1 empty `<p><strong></strong></p>` in section 8)
- Testimonials: 2 text (Amy B., AgroLiquid; unattributed book quote) + 4 video testimonials (YouTube)
- FAQ items: 16 accordion toggles — 14 real Q&A, 1 completely empty, 1 unedited Divi placeholder
- Images: 27 `<img>` elements in MAIN (24 unique files — `company-67-a-pr-14.png` appears twice)
- Videos: 4 (all YouTube iframes; no self-hosted video on this page)
- CTAs: 14 total — 9 styled buttons, 1 inline text link, 4 module-level `et_link_options_data` click targets (`et_pb_blurb_3`, `et_pb_blurb_4`, `et_pb_blurb_6`, `et_pb_row_17`)
- Forms: 0

## Defects observed on the live page
- **Unedited Divi placeholder text shipped to production.** FAQ accordion 2 opens on
  "Your Title Goes Here" / "Your content goes here. Edit or remove this text inline or in the module Content
  settings. You can also style every aspect of this content in the module Design settings and even apply
  custom CSS to this text in the module Advanced settings." This is the single most visible defect on the page.
- **Empty FAQ accordion item.** FAQ accordion 1, `et_pb_accordion_item_0` — empty `<h5>` title and empty
  content div, rendered `et_pb_toggle_open`, so an empty panel is expanded on load.
- **Dead invisible click target.** `et_pb_row_17` is an empty, full-width `et_clickable` row whose registered
  URL is the literal string `"#"`.
- **wpengine.com staging URLs in production.** Every single `<img src>` in MAIN points at
  `https://damianmason.wpengine.com/...` (the `srcset` values correctly point at `damianmason.com`, so the
  browser usually loads the canonical host — but the fallback `src` is the staging host). The Media Kit
  download also resolves to `https://damianmason.wpengine.com/wp-content/uploads/2023/04/AG-MEDIA-KIT-3.zip`.
- **Media Kit ZIP not mirrored / likely 404.** `AG-MEDIA-KIT-3.zip` is not present in `_source/media/`.
- **Five macOS screenshots used as marketing imagery.** `Screenshot-2023-04-20-at-3.38.42-PM-1.png`,
  `Screenshot-2023-04-25-at-9.17.26-AM.png`, `Screenshot-2023-04-18-at-5.55.45-PM.png`,
  `Screenshot-2023-04-19-at-12.16.28-PM.png`, `Screenshot-2023-04-25-at-2.44.31-PM.png` — all carry WordPress
  titles of the form "Screenshot 2023-04-20 at 3.38.42 PM". `Screenshot-2023-04-25-at-2.44.31-PM.png` is only
  730px wide.
- **Wrong alt text.** `19225_IPPA_Alliance_Logo_4C-scaled-1.jpg` (the IPPA Alliance logo) has `alt="cpda logo"`.
- **11 of 27 images have empty alt text**, including 3 of the 6 client logos (Helena, Merck, BASF) and all
  three decorative screenshots in section 7.
- **Invisible / near-invisible assets.** `company-67-a-pr-14.png` (used twice) is a white quotation-mark glyph
  with no visible content when rendered on a light background.
- **White text with no guaranteed dark background.** The testimonial attribution "Amy B., AgroLiquid" is
  hard-coded `color: #ffffff` inside a section whose background is only defined in the non-mirrored
  `et-cache/99/*.css`.
- **Extremely low-resolution asset.** `company-67-a-pr-23.png` is 69×49 px and is scaled up as a display graphic.
- **Duplicated inline `<style>` block.** `.company-67-a-galsc .et_pb_image img { object-fit: cover; }` is
  emitted three times (once per column) via three separate Divi Code modules.
- **Content duplication across pages.** 12 of the 14 real FAQ answers are byte-for-byte duplicates of the FAQ
  on `/keynote/`. Two of them diverge in wording between the two pages (see keynote.md): home says
  "forward looking outlook … fast paced, humor infused … feel good facts … Beginning 2023", keynote says
  "forward-looking outlook … fast-paced, humor-infused … feel-good facts … Beginning in 2023". Home's question
  is "HOW DO YOU MANAGE BOOKING AND TRAVEL AND TRAVEL EXPENSES?" (the word "TRAVEL" appears twice —
  almost certainly a typo); keynote's is "HOW DO YOU MANAGE BOOKING TRAVEL & TRAVEL EXPENSES?".
- **Typo: "HOW DO YOU MANAGE BOOKING AND TRAVEL AND TRAVEL EXPENSES?"** — reads as a duplicated word.
- **Double space inside a heading.** "As a  Leading Voice in the Industry…" (H4 in section 7).
- **Double spaces and trailing spaces throughout the FAQ answers** (pasted from an email/Word source).
- **Mixed quotation styles in one sentence.** The FAQ answer about presentation content contains
  `The “Ations” of Agriculture — addressing the words ending in “ation”` where the first pair comes from
  `&#8220;/&#8221;` entities and the second pair are literal U+201C/U+201D characters — plus a literal em dash.
- **Mixed apostrophe styles.** Every apostrophe on the page is curly (U+2019) except the "Sign Up for Damian's
  Mailing List" button, which uses a straight apostrophe (`&#039;`).
- **Unattributed testimonial.** "I absolutely love this book! If you love food and hate the hype, this book is
  for you!" has no name, no title, no organization, and does not name the book.
- **Unsourced statistic.** "More Than 70,000 Views & Downloads Per Month" — no date, no source, no methodology.
- **Non-semantic click targets.** Three blurbs and one row are made clickable by JavaScript
  (`et_link_options_data`) rather than by `<a>` elements — not focusable, not crawlable, no visible affordance.
- **Heading hierarchy is broken.** The page has one H1, but H2s are used for the four "✓" checklist bullets
  and H4s are used as eyebrows *above* H2s (sections 6, 7, 9). Five H2s and one H4 appear before some H2s.
- **`maximum-scale=1.0, user-scalable=0` in the viewport meta** — pinch-zoom is disabled site-wide
  (WCAG 1.4.4 failure).
- **Two empty structural elements.** `et_pb_section_3` contains nothing but a spacer divider;
  `et_pb_row_17`'s column is `et_pb_column_empty`.
- **Empty paragraphs used as spacers.** One in the hero (`&nbsp;`), one in section 8 (`<p><strong></strong></p>`).
- **Section backgrounds unrecoverable from the mirror.** All page-specific Divi styling lives in the deferred,
  un-mirrored `wp-content/et-cache/99/et-divi-dynamic-99.css`.

## Verbatim testimonials

> "Man, that guy makes you think! I loved it!"
> — Amy B., AgroLiquid

> "I absolutely love this book! If you love food and hate the hype, this book is for you!"
> — (no attribution on the page)

Video testimonials (title text only — no on-page attribution):
> youtube:yL33iAIS2K4 — "Life Changing!"
> youtube:Tk8dPv_8Zo0 — "Rocked It In Saskatchewan!"
> youtube:xmwijvcK1wY — "MFA Emerging Leaders Conference"
> youtube:jQAaQfcamVs — "Do Business Better for Lindsay Corporation"

## Verbatim FAQ

Accordion 1 (`et_pb_accordion_0`), in DOM order:

**Q: (empty — `<h5 class="et_pb_toggle_title"></h5>`)**
A: (empty — `<div class="et_pb_toggle_content clearfix"></div>`; this item is the one rendered OPEN)

**Q: WHAT ARE YOUR SPEAKING FEES?**
A: Fees are quoted at the time of the inquiry. Damian’s fees are NET to him. Damian has been speaking to audiences for almost 30 years. He is well known and appreciated in the Agribusiness industry. His fees reflect that experience and attention to detail. *(trailing space in source)*

**Q: HOW DO YOU MANAGE BOOKING AND TRAVEL AND TRAVEL EXPENSES?**
A: Damian books all of his airfare and car rental. Damian charges a set Travel Fee to cover these travel expenses, gratuity and meals which is quoted up front. His hotel stay is booked and paid for by the client.

**Q: WHERE DO YOU TRAVEL?**
A: Wherever the client’s event is scheduled. *(trailing space in source)*

**Q: HOW LONG IS YOUR PRESENTATION?**
A: Presentations typically run between 60 – 90 minutes in length. *(en dash U+2013)*

**Q: ARE YOU AVAILABLE FOR MULTI-DAY EVENTS?**
A: Yes. Rates may vary depending on time/date of the events.

**Q: HOW WOULD YOU DESCRIBE YOUR PRESENTATION CONTENT?**
A: Damian’s presentation is a forward looking outlook about issues in the marketplace that will be impacting the business of Agriculture.  It is fast paced, humor infused Ag commentary where he connects the dots from consumer issues to regulation to political movements to societal changes and current events and what it means for our industry.  Also, he puts in a bit of feel good facts about the industry.  And, he provides business reality and opportunity coverage, always bringing the issues back to the crowd and making it about them. Beginning 2023 Damian titled the program The “Ations” of Agriculture — addressing the words ending in “ation” that impact our industry:  Immigration, population, regulation, confrontation, inflation, threats from other nations. *(double spaces after sentences and two trailing spaces are in the source)*

**Q: CAN WE GET A SAMPLE/PREVIEW OF YOUR PRESENTATION?**
A: Yes, video links may be found on Damian’s Youtube channel (https://www.youtube.com/@DamianMasonChannel/videos), or viewed on his website. *(the URL is a live link, `target="_blank" rel="noopener"`, and carries a leftover Gmail `data-saferedirecturl` attribute; the anchor text is split by a `<wbr />` after the `@`)*

Accordion 2 (`et_pb_accordion_1`), in DOM order:

**Q: Your Title Goes Here**
A: Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings. *(unedited Divi placeholder; this item is the one rendered OPEN)*

**Q: HOW WOULD YOU DESCRIBE YOUR PRESENTATION DELIVERY STYLE?**
A: A forward looking futurist meets an agricultural economist – delivered with humor. Damian’s style makes his presentation entertaining, informative and memorable for your audience. *(en dash U+2013)*

**Q: WHAT ARE YOUR TECHNOLOGY REQUIREMENTS?**
A: Refer to Damian’s AV/and Room Setup Requirements. *(the phrase "AV/and" appears to be a typo; the referenced document is not linked anywhere on the page)*

**Q: CAN WE RECORD OR PHOTOGRAPH YOUR PRESENTATION?**
A: Yes, as long as Damian receives a copy of the content to use as well. *(trailing space in source)*

**Q: ARE YOU AVAILABLE FOR BREAK-OUTS, LUNCHEONS, OR PANEL DISCUSSIONS?**
A: Absolutely. The only caveat is that Damian will not speak while people are eating or tables are being cleared. *(trailing space in source)*

**Q: WILL YOU HELP US PROMOTE OUR EVENT?**
A: Yes, Damian will work with you to help you make it a success. For example: Local Radio interviews are welcomed, Podcast guests, and short introductory videos may be pre recorded for your event. Headshots and Bio are available for your use for your own marketing efforts as well. *("pre recorded" is unhyphenated in the source)*

**Q: DO YOU HAVE PRODUCTS FOR SALE?**
A: Books may be pre-ordered/ pre-purchased for your event. (Let’s talk about bulk pricing!) Also, individuals may visit Damian’s website to purchase books. *(the space placement in "pre-ordered/ pre-purchased" is verbatim)*

**Q: SHOULD I BOOK DIRECTLY OR THROUGH A BUREAU?**
A: Damian books most of his events directly with his clients. A simple contract and small fraction of the total fee is required as a deposit to confirm the contracted date. The remaining fee is due at the time of the event. We do have a few bureaus whom we have successfully worked with over the years, but we do not endorse them. We find great success in booking directly with the client.

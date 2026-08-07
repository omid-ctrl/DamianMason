# Damian’s Business of Agriculture is a top-rated show on AcresTV — the streaming format dedicated to Agricultural programming.

- **Source URL:** https://damianmason.com/acres-tv/
- **Slug:** acres-tv
- **SEO title:** Acres TV - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** https://damianmason.com/wp-content/uploads/2023/04/Screenshot-2023-04-13-at-12.43.38-PM.png
- **Disposition:** keep

## Sections

### 1. Decorative section top
- **Type:** hero
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
  - `company-67-a-pr-18.png` | alt="" | role: decorative | 770×287 flat near-black chevron/mountain-peak wedge, section shape divider; `class=wp-image-14`
  - `company-67-a-pr-16.png` | alt="" | role: decorative | 1150×427 companion shape divider; `class=wp-image-15`, module carries `et_pb_image_sticky` (sticky-positioned decoration)
- **Videos:**
  -
- **Notes:** Divi section `et_pb_section_0 company-67a-sc-hero-hed et_animated et_pb_with_background`. Section CSS background is `2-background-microphones-on-a-stand-2022-11-16-19-05-19-utc-scaled.jpg` (stock "microphones on a stand" photo; `-scaled` = WordPress big-image downscale). Two stacked decorative shapes with empty alt — same shared assets as `/xtreme-ag/`, which uses only the first of the two.

### 2. Acres TV intro
- **Type:** intro
- **Eyebrow:** -
- **Heading:** Damian’s Business of Agriculture is a top-rated show on AcresTV — the streaming format dedicated to Agricultural programming. (H1, wrapped in `<b>`)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  - "Find Damian on Acres TV" -> https://www.watchacrestv.com/damianmason
- **Images:**
  - `acres-tv.png` | alt="" | role: logo | 670×366 — Acres TV brand lockup on a dark studio backdrop: wordmark "Acres TV" over the green rolling-fields mark, with the tagline "COMMITTED TO AGRICULTURE" beneath. `class=wp-image-260`. Alt is empty despite carrying real brand text.
- **Videos:**
  -
- **Notes:** Left column of a 1/2 + 1/2 row. **The page has no body paragraphs at all** — the H1 is the only prose. Immediately after the H1 the markup contains an empty leftover `<div><div dir="auto"></div></div>` (a `dir="auto"` remnant of a paste from a rich-text editor, most likely mobile Gmail). A `et_pb_code` module here injects only a `<style>` rule (`.company-67a-sc-hero-hed .et_pb_button_module_wrapper { display: inline-block; }`) and no content. Note the page uses "AcresTV" (closed) in the H1 but "Acres TV" (open) in the button label, page title, og:title, and nav.

### 3. Acres TV screenshot
- **Type:** gallery
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  - "(image link, no text)" -> https://www.watchacrestv.com/damianmason
- **Images:**
  - `acres-tv-screenshot.png` | alt="Acres TV" | role: inline | **macOS screenshot** — 1692×1852 portrait, **1.0 MB**, default macOS capture filename retained. `class=wp-image-261`. Wrapped in `<a target="_blank">` with no `rel="noopener"`.
- **Videos:**
  -
- **Notes:** Right column of the hero row — the entire column is this one screenshot. It is a capture of the Acres TV web player/listing page for Damian, standing in for actual episode artwork or a real embed. Unusual portrait aspect (taller than wide) at nearly 1.7k × 1.9k in a half-width column.

### 4. Leading Voice CTA band
- **Type:** cta-band
- **Eyebrow:** As a  Leading Voice in the Industry, Damian is Sought After for Conversations & Commentary on Hot Topics (H4)
- **Heading:** If it’s Agriculture, it Needs Damian. (H2)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  - "Click Here to Inquire About Working With Damian" -> https://damianmason.com/contact-us/
- **Images:**
  -
- **Videos:**
  -
- **Notes:** Divi section `et_pb_section_1 company-67-a-galsc et_pb_with_background`. Byte-identical to the same band on `/xtreme-ag/` — shared component, build once. The H4 contains a non-breaking space plus a regular space after "As a", producing a visible **double space**: "As a  Leading Voice". Heading order is inverted (H4 label above the H2 it introduces).

### 5. Join the Conversation
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** Join the Conversation (H2, centered)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  - "Sign Up for Damian's Mailing List" -> https://damianmason.com/join-the-conversation/
- **Images:**
  -
- **Videos:**
  -
- **Notes:** 3/5 + 2/5 row: heading left, button right. Same band as `/xtreme-ag/`, but here the href is correctly populated — this page is the reference for what `/xtreme-ag/`'s empty-href version should point to. Label uses a straight apostrophe (`&#039;`) in "Damian's" while the page's other copy uses curly apostrophes (`’`).

## Full item inventory
- Paragraphs: 0
- Testimonials: 0
- FAQ items: 0
- Images: 4  (+1 CSS background image)
- Videos: 0
- CTAs: 4
- Forms: 0

## Defects observed on the live page
- **Missing meta description.** No `<meta name="description">`. The schema WebPage node also emits no `description`.
- **No body copy whatsoever.** The page contains zero `<p>` elements in MAIN. The H1 sentence plus three CTA labels is the entire text of the page — thin content for something that ranks as a nav-level destination.
- **H1 is a full sentence used as body copy.** "Damian’s Business of Agriculture is a top-rated show on AcresTV — the streaming format dedicated to Agricultural programming." is a 130-character paragraph promoted to H1 and additionally wrapped in `<b>` (redundant bolding of a heading). It is not a page title in any usable sense.
- **Screenshot used as marketing image.** `acres-tv-screenshot.png` is a raw macOS screen capture — default filename retained, `title="acres-tv-screenshot"` — at 1692×1852 and 1.0 MB, serving as the page's primary visual.
- **OG image is a screenshot that is not on the page.** `og:image` and schema `primaryImageOfPage` both point to `Screenshot-2023-04-13-at-12.43.38-PM.png` (856×584, macOS capture filename, caption "Acres TV"). That file is **never rendered anywhere in the page body** — the social share card shows an image no visitor sees. It is mirrored at `_source/media/Screenshot-2023-04-13-at-12.43.38-PM.png`.
- **Empty alt on a logo carrying text.** `acres-tv.png` renders the "Acres TV" wordmark and the tagline "COMMITTED TO AGRICULTURE" but has `alt=""`, so that content is invisible to assistive tech.
- **Empty alt on both decorative shapes** is correct, but they are `<img>` elements rather than CSS backgrounds — two unnecessary HTTP requests for pure ornament.
- **Orphan empty markup.** `<div><div dir="auto"></div></div>` sits directly after the H1 — a leftover node from a rich-text/mobile-email paste.
- **Empty `et_pb_code` module** that outputs only a `<style>` block — layout CSS smuggled into page content.
- **Broken heading hierarchy.** Order down the page is H1 → H4 → H2 → H2. The H4 eyebrow precedes the H2 it labels, and no H2/H3 sits between the H1 and the H4.
- **Missing `rel="noopener"`** on the `target="_blank"` screenshot anchor. (The "Find Damian on Acres TV" button also uses `target="_blank"` without `rel`.)
- **Redundant destination.** The button and the screenshot both link to exactly the same URL, `https://www.watchacrestv.com/damianmason`, and are the only two outbound paths on the page.
- **Brand-name inconsistency:** "AcresTV" (H1) vs "Acres TV" (button, `<title>`, og:title, nav, image alt) vs "watchacrestv" (domain).
- **Double space in copy:** "As a  Leading Voice in the Industry…" (non-breaking space + regular space).
- **Mixed apostrophe styles.** Curly `’` in the H1 ("Damian’s") and the CTA band ("it’s"), straight `'` in "Sign Up for Damian's Mailing List".
- **Duplicated section across pages.** Sections 4 and 5 are byte-identical to `/xtreme-ag/` sections 4 and 5 (except `/xtreme-ag/`'s mailing-list href is empty) — content maintained by copy-paste in two places.
- **Site-wide, visible on this page:** header nav "Speaking", "Podcasts" and "Media" top-level items all have `href=""` (empty). Header logo, the section background image, and every footer link resolve to `damianmason.wpengine.com` (staging host); footer links use `?page_id=NNN` query URLs instead of pretty permalinks, and footer "Home" is plain `http://DamianMason.com` (no HTTPS).

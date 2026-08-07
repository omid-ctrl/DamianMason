# WHAT’S XTREMEAG YOU ASK?

- **Source URL:** https://damianmason.com/xtreme-ag/
- **Slug:** xtreme-ag
- **SEO title:** XtremeAg - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** https://damianmason.com/wp-content/uploads/2023/04/Screenshot-2023-04-19-at-11.46.37-AM-1024x577.png
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
  - `company-67-a-pr-18.png` | alt="" | role: decorative | 770×287 flat near-black chevron/mountain-peak wedge used as a section shape divider; `class=wp-image-14`, purely ornamental
- **Videos:**
  -
- **Notes:** Divi section `et_pb_section_0 company-67a-sc-hero-hed et_animated et_pb_with_background`. The section's CSS background is `2-background-microphones-on-a-stand-2022-11-16-19-05-19-utc-scaled.jpg` (a stock "microphones on a stand" photo, `-scaled` suffix = WordPress big-image downscale). Note the reused site-wide shape asset lives in the 2022/12 upload folder and is shared with other pages.

### 2. XtremeAg intro
- **Type:** intro
- **Eyebrow:** -
- **Heading:** WHAT’S XTREMEAG YOU ASK? (H1, bold, all-caps as typed)
- **Subheading:** In addition to his own business endeavors, Damian is a content creator and personality for XtremeAg. He produces videos, works trade shows and field days, and hosts the “Cutting the Curve” podcast. (H3, above the H1)
- **Body:**
  XtremeAg is a community of highly successful farmers from across the United States coming together to offer an Xtreme look into their personal farming operations by sharing their accumulated knowledge around pursuing profitability and success.

  To see Damian and the forward-looking farmers of XtremeAg deliver actionable Ag information, click a video below or go to https://www.xtremeag.farm/podcasts
- **List items:**
  -
- **CTAs:**
  - "https://www.xtremeag.farm/podcasts" -> https://www.xtremeag.farm/podcasts  <!-- inline link whose visible label is the raw URL; contains a <wbr> break hint mid-URL -->
  - "View More" -> https://www.xtremeag.farm/podcasts
- **Images:**
  - `xtremelogo.png` | alt="XTREME AG Logo" | role: logo | 242×116, `class=wp-image-253` — the XtremeAg partner brand mark
- **Videos:**
  -
- **Notes:** Left column of a 1/2 + 1/2 row. **Both body paragraphs are marked up as `<div>`, not `<p>`** — with inline `<span style="color: #3d3d3d;">` and `<span style="color: #050505;">` hardcoded text colors, plus `<span class="il">` wrappers around "Damian" (a Gmail search-highlight class). The copy was pasted out of a Gmail message: the inline URL also carries `data-saferedirecturl="https://www.google.com/url?q=https://www.xtremeag.farm/podcasts&source=gmail&ust=1682004608394000&usg=AOvVaw2gakwLXeSTH45FsRM2bnbn"`. That `source=gmail` redirect wrapper must be stripped on rebuild. The H3 uses non-breaking spaces between several words ("to&nbsp;his", "endeavors,&nbsp;Damian&nbsp;is", "hosts&nbsp;the&nbsp;“Cutting") and ends with a trailing space + non-breaking space; it is followed by an empty `<p>&nbsp;</p>`. The two body divs are separated by a spacer `<div><span>&nbsp;</span></div>`. A `et_pb_code` module here injects only a `<style>` rule (`.company-67a-sc-hero-hed .et_pb_button_module_wrapper { display: inline-block; }`) — no content.

### 3. Featured XtremeAg content
- **Type:** video-grid
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  -
- **List items:**
  - Why did Johnny Verell Take the 2×2 off his planter? (H5, bold + underlined link)
  - Re-Thinking Soil Fertility, Biology & Balance (H4, bold + underlined link)
- **CTAs:**
  - "(image link, no text)" -> https://www.xtremeag.farm/blog/xtremeag-blog/2023/04/17/why-did-johnny-verell-take-the-2x2-off-his-planters
  - "Why did Johnny Verell Take the 2×2 off his planter?" -> https://www.xtremeag.farm/blog/xtremeag-blog/2023/04/17/why-did-johnny-verell-take-the-2x2-off-his-planters
  - "Re-Thinking Soil Fertility, Biology & Balance" -> https://www.xtremeag.farm/blog/xtremeag-blog/2023/04/12/re-thinking-soil-fertility-biology-balance
- **Images:**
  - `Screenshot-2023-04-19-at-11.40.07-AM.png` | alt="WHY DID JOHNNY VERELL TAKE THE 2X2 OFF HIS PLANTERS?" | role: inline | **macOS screenshot** — 1800×1014, 812 KB, filename is the raw macOS screen-capture default. `class=wp-image-317`. Wrapped in an `<a target="_blank">`.
  - `Screenshot-2023-04-19-at-11.46.37-AM.png` | alt="Re-Thinking Soil Fertility, Biology and Balance" | role: inline | **macOS screenshot** — 1806×1018, 776 KB, raw macOS capture filename. `class=wp-image-320`. NOT wrapped in a link (unlike the first one).
- **Videos:**
  - (none — the copy says "click a video below" but there is no video element, iframe, or embed anywhere on this page. Both items are static screenshots that link out to XtremeAg **blog articles**, not videos.)
- **Notes:** Right column of the hero row. This is the closest thing the page has to a "video grid" and it is entirely faked with screenshots. The two items are structurally inconsistent: item 1 is image-linked + H5, item 2 is unlinked image + H4 — so a user can click the first thumbnail but not the second. Heading levels skip (H5 above H4). Both `target="_blank"` with `rel="noopener"` on the headings but only `target="_blank"` (no `rel`) on the image anchor. **These are almost certainly screenshots of XtremeAg video players**, which is why the copy promises videos — the rebuild should embed the real videos or link to `xtremeag.farm/podcasts`.

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
- **Notes:** Divi section `et_pb_section_1 company-67-a-galsc et_pb_with_background`. This band is byte-identical to the same band on `/acres-tv/` — shared component, build it once. The H4 contains a non-breaking space followed by a regular space after "As a", producing a visible **double space**: "As a  Leading Voice". Heading order is inverted (H4 label sits above the H2 it introduces). The button is the only one on the page without `target="_blank"`.

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
  - "Sign Up for Damian's Mailing List" -> (EMPTY HREF)  <!-- flag: EMPTY HREF — href="" renders as a link that reloads the current page -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** 3/5 + 2/5 row: heading left, button right. Same band appears on `/acres-tv/` where the identical button **does** point to `https://damianmason.com/join-the-conversation/` — so this page's empty href is a straightforward omission and the intended target is known. Label uses a straight apostrophe (`&#039;`) in "Damian's", whereas the rest of the page uses curly apostrophes (`’`).

## Full item inventory
- Paragraphs: 2  (plus 1 empty `<p>&nbsp;</p>` and 1 `<div><span>&nbsp;</span></div>` spacer)
- Testimonials: 0
- FAQ items: 0
- Images: 4  (+1 CSS background image)
- Videos: 0
- CTAs: 7
- Forms: 0

## Defects observed on the live page
- **Missing meta description.** No `<meta name="description">` at all. Yoast/schema emits no `description` for this WebPage node either.
- **Screenshots used as marketing images.** Both featured items are raw macOS screen captures (`Screenshot-2023-04-19-at-11.40.07-AM.png`, `Screenshot-2023-04-19-at-11.46.37-AM.png`), retaining default macOS filenames and `title` attributes ("Screenshot 2023-04-19 at 11.40.07 AM"). 812 KB and 776 KB PNGs where compressed JPEGs/WebP would be a fraction of the size.
- **OG image is a screenshot.** `og:image` is the 1024×577 resize of `Screenshot-2023-04-19-at-11.46.37-AM.png` — a macOS screenshot is the social share card for this page.
- **Copy promises videos that do not exist.** "click a video below" — there are zero videos, iframes, or embeds on the page. The two things "below" are static screenshots linking to XtremeAg **blog posts** (`/blog/xtremeag-blog/...`), not videos.
- **Empty href.** "Sign Up for Damian's Mailing List" has `href=""` — clicking reloads `/xtreme-ag/`. The correct target is known: `/join-the-conversation/` (used by the identical button on `/acres-tv/`).
- **Gmail paste residue in the markup.** `data-saferedirecturl="https://www.google.com/url?q=...&source=gmail&ust=1682004608394000&usg=AOvVaw2gakwLXeSTH45FsRM2bnbn"` on the inline XtremeAg link, plus `<span class="il">` (Gmail search-highlight class) wrapped around each occurrence of "Damian". The body copy was pasted out of an email.
- **Body copy is not in paragraphs.** Both body blocks are bare `<div>` elements with hardcoded inline colors (`#3d3d3d`, `#050505`) rather than `<p>` with themed color. Third hardcoded color (`#333333`) on the H3.
- **Raw URL used as link text.** "https://www.xtremeag.farm/podcasts" is shown to users as the literal URL, with a `<wbr />` inserted mid-string ("xtremeag.farm/<wbr />podcasts").
- **Redundant link.** The raw-URL inline link and the "View More" button immediately below it point to the exact same destination.
- **Inconsistent linking between the two featured items.** Item 1's thumbnail is clickable; item 2's thumbnail is not. Users will reasonably try to click both.
- **Alt text does not match visible heading.** Image alt is "WHY DID JOHNNY VERELL TAKE THE 2X2 OFF HIS PLANTERS?" (all caps, plural "PLANTERS", letter `X`) while the heading reads "Why did Johnny Verell Take the 2×2 off his planter?" (singular, multiplication sign `×`, `&#215;`). Second item likewise: alt says "Biology and Balance", heading says "Biology & Balance".
- **Broken heading hierarchy.** H3 appears above the H1; the featured items go H5 then H4; the CTA band goes H4 then H2. Reading order of levels down the page: H3 → H1 → H5 → H4 → H4 → H2 → H2.
- **Double space in copy:** "As a  Leading Voice in the Industry…" (non-breaking space + regular space).
- **Stray whitespace nodes:** trailing `&nbsp;` at the end of the H3, an empty `<p>&nbsp;</p>` after it, and a `<div><span>&nbsp;</span></div>` spacer between the body divs.
- **Mixed apostrophe styles.** Curly `’` throughout the copy but a straight `'` in the "Sign Up for Damian's Mailing List" button label.
- **Empty `et_pb_code` module** that outputs only a `<style>` block — layout CSS smuggled into page content.
- **Missing `rel="noopener"`** on the `target="_blank"` image anchor (the heading anchors have it).
- **`Screenshot-2023-04-19-at-11.46.37-AM.png` is 1806×1018 but rendered in a half-width column** — served at roughly 3× the needed resolution.
- **Site-wide, visible on this page:** header nav "Speaking", "Podcasts" and "Media" top-level items all have `href=""` (empty). Header logo, the section background image, and every footer link resolve to `damianmason.wpengine.com` (staging host); footer links use `?page_id=NNN` query URLs instead of pretty permalinks, and footer "Home" is plain `http://DamianMason.com` (no HTTPS).

## Verbatim testimonials

_(none in the page's own MAIN content. The only quote in the document is in the site-wide FOOTER widget, reproduced here once for reference and NOT to be re-documented per page:)_

> "**“Thanks for your thought-provoking presentations and making sure we all think differently about our industry.**"
> — B. Kettler, IHLA

_Note the mismatched quotation marks in the source: it opens with a curly `“` inside `<strong>` and closes with a straight `"` outside the `<strong>`, so the closing quote is unbolded and the quotation is never properly closed. Attribution is in a `<cite>` with no title/organization split._

## Verbatim FAQ

_(none — the page has no FAQ. The H1 "WHAT’S XTREMEAG YOU ASK?" is phrased as a question but is a section title, not a Q&A item.)_

---

### Note on "The Granary"

The harvest brief asked for "The Granary" content on this page. **There is no Granary content on `/xtreme-ag/`.** A case-insensitive search of the full raw HTML for this page returns zero matches, and a search across all 29 mirrored pages finds "granary" only in `_source/html/the-business-of-agriculture.html`. Whoever owns that page should capture it; nothing was omitted here.

# The Business of Ag Success Group

- **Source URL:** https://damianmason.com/boasg/
- **Slug:** boasg
- **SEO title:** The Business of Ag Success Group - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** https://damianmason.com/wp-content/uploads/2023/04/BOASG-BRAND-LOGO-FINAL-WHITE.jpg
- **Disposition:** keep

## Sections

### 1. Hero — membership offer + BOASG brand logo
- **Type:** hero
- **Eyebrow:** EXCLUSIVE MONTHLY MEMBERSHIP
- **Heading:** The Business of Ag Success Group (H1)
- **Subheading:** $99/month (H1 — marked up as a second H1, not a subheading tag)
- **Body:**
  The Business of Ag Success Group is an information-packed community of ag professionals that span the industry – from pig farmers to beet growers, to ag finance and planning. Together, we gather bi-monthly in an incredible information exchange, led by world recognized Agriculturist, Damian Mason and International Swine Management Consultant Todd Thurman. If you’re looking for a community to join where you get take-aways at every turn, this is it.
- **List items:** -
- **CTAs:**
  - "Join Today" -> https://damianmason.com/product/business-of-ag-success-group/  <!-- flag: commerce (WooCommerce product page) -->
- **Images:**
  - `company-67-a-pr-16.png` | alt="" | role: decorative | 1150×427 flat-orange zigzag/mountain shape pinned to the top of the hero (Divi `et_pb_image_sticky`); src points at damianmason.wpengine.com
  - `BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png` | alt="The Business of Ag Success Group" | role: logo | 1000×1000 transparent PNG; src points at damianmason.wpengine.com. Note the og:image / JSON-LD primaryimage uses the *non*-transparent `BOASG-BRAND-LOGO-FINAL-WHITE.jpg` instead.
- **Videos:** -
- **Notes:** Divi section `et_pb_section_0` with body classes `company-67a-sc-hero-hed et_animated et_pb_with_background`. Two-column row: left = eyebrow + H1 + intro + `$99/month` H1 + Join Today button; right = BOASG logo. An inline `<style>` block is embedded in the column (`.company-67a-sc-hero-hed .et_pb_button_module_wrapper { display: inline-block; }`). The eyebrow is a plain `<p>`, not a styled label element.

### 2. What you get / What you won’t get + Damian Mason bio
- **Type:** copy
- **Eyebrow:** -
- **Heading:** The Business of Ag Success Group (BoASG) is a Business Outlook, Advisory, and Networking Community for Ag Professionals. (H3, wrapped in `<strong>`)
- **Subheading:** What you get: (H2) / What you won’t get: (H2)
- **Body:**
  Damian Mason Expertise:

  • Ag Current Events• Ag Economics• The Future of American and International Ag• Business• Consumer Behavior• Global Trends• Finance and Money• Sales and Training

  Damian Mason is a leading voice in the Agricultural industry, sought out by media, podcasts, and publications for his tell-it-like-it-is style of delivery. He gives you the truth about Ag without sugar coating the message, helping to prepare his listeners (and BOASG members) to navigate their way through the rapidly changing, volatile industry. He has spoken and consulted with the biggest names in Agriculture, in all 50 states, 8 foreign countries and in every segment of Ag.
- **List items:**
  (under H2 "What you get:")
  - Bi-monthly online programs addressing Business and Agricultural topics
  - Guest presenters delivering pertinent information and implementable ideas
  - Special promotions
  - Networking opportunities within the group
  (under H2 "What you won’t get:")
  - High-pressure sales tactics or constant pitches
  - Multiple emails each day clogging up your inbox
  - Unusable fluff
- **CTAs:** -
- **Images:**
  - `DSC_7639-scaled.jpg` | alt="Damian Mason" | role: portrait | 1707×2560 vertical portrait (Nikon D850 original, EXIF intact); src points at damianmason.wpengine.com
- **Videos:** -
- **Notes:** Divi section `et_pb_section_1` (`company-67-a-galsc`). One row, two half-width columns: left = all the copy above; right = the Damian portrait. IMPORTANT for rebuilders: (a) the "Damian Mason Expertise:" label is a **bolded `<p>`**, while its counterpart "Todd Thurman Expertise:" in section 3 is an **`<h3>`** — inconsistent semantics for visually parallel elements; (b) the expertise list is NOT a `<ul>` — it is one paragraph of `•` glyphs separated by `<br />`, indented with `padding-left: 40px`, so the extract renders it as a single run-on line with no spaces before the bullets; (c) "What you get:" is split across TWO separate `<ul>` elements (first bullet alone in list 1, remaining three in list 2); (d) the Damian bio paragraph is present in the live HTML but **missing from `_source/extracted/boasg.txt`** — an unclosed `<p class="">` immediately before it breaks the extractor. Copy above was taken from the raw HTML. (e) The markup here is pasted-in Squarespace leftovers (`row sqs-row`, `sqs-block html-block`, `id="yui_3_17_2_1_1681408764027_128"`) living inside Divi text modules.

### 3. Todd Thurman bio
- **Type:** copy
- **Eyebrow:** -
- **Heading:** Todd Thurman Expertise: (H3)
- **Subheading:** -
- **Body:**
  • Animal Performance• Animal Productivity• Business Planning• Predictive analytics & outlook• System Design• Global Protein Markets• International Business• Training and Talent Development

  Todd Thurman is an International Swine Management Consultant and Founder of SwineTex Consulting Services. He draws on his 20+ years of Industry experience to help large scale pork production companies and allied industries improve the efficiency and profitability of their operations.
- **List items:** -
- **CTAs:** -
- **Images:**
  - `TODD-THURMAN-CROPPED.png` | alt="Todd Thurman" | role: portrait | 500×750 PNG (small — will soften if displayed large); src points at damianmason.wpengine.com
- **Videos:** -
- **Notes:** Same Divi section as #2, preceded by an `et_pb_divider` spacer. Row is 1/4 image (left) + 3/4 text (right) — the inverse column ratio of section 2. The expertise list is again a `<br />`-separated `•` paragraph, not a real list. "Predictive analytics & outlook" is the only entry in either expertise list that is not title-cased. Same Squarespace leftover wrappers.

### 4. Schedule footnote + second Join Today
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  *Online, Every other Friday at 11am Eastern. Time and dates are subject to change. Programs will be approximately 60-90 minutes including an interactive Q&A session. Recordings are always available to members.
- **List items:** -
- **CTAs:**
  - "Join Today" -> https://damianmason.com/product/business-of-ag-success-group/  <!-- flag: commerce (WooCommerce product page); duplicate of the hero CTA -->
- **Videos:** -
- **Notes:** The footnote is wrapped in `<em>` (rendered italic) and starts with a literal asterisk that has no matching reference marker anywhere on the page. Note the copy conflict: hero says "we gather **bi-monthly**" and the bullet says "**Bi-monthly** online programs", but this footnote says "Every other Friday" (i.e. every two weeks / semi-monthly). Button uses Divi `data-icon="&#xf101;"` (double-chevron).

### 5. Join the Conversation
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** Join the Conversation (H2, centered)
- **Subheading:** -
- **Body:** -
- **List items:** -
- **CTAs:**
  - "Sign Up for Damian's Mailing List" -> https://damianmason.com/join-the-conversation/
- **Images:** -
- **Videos:** -
- **Notes:** Divi section `et_pb_section_2`, solid orange band — `background-color:#f94d1c` plus a redundant `background-image:linear-gradient(180deg, rgba(249,77,28,0.83) 0%, rgba(249,77,28,0.83) 100%)` (a flat 83%-opacity gradient of the same orange over the same orange, i.e. it does nothing but lighten the band). Section padding 77px top/bottom. Layout is 3/5 heading + 2/5 button. Label uses a straight apostrophe (`Damian&#039;s`), unlike the curly apostrophes used elsewhere on the page.

## Full item inventory
- Paragraphs: 8
- Testimonials: 0
- FAQ items: 0
- Images: 4
- Videos: 0
- CTAs: 3
- Forms: 0

## Defects observed on the live page
- Missing meta description entirely — no `<meta name="description">` in `<head>`.
- Duplicate H1: "The Business of Ag Success Group" and "$99/month" are both `<h1>`. A price is not a page title.
- Every image `src` points at the WP Engine staging host `https://damianmason.wpengine.com/...` instead of `https://damianmason.com/...` (4 of 4 images). Only the `srcset` entries use the production domain — so browsers pick the production URL at most widths but the `src` fallback is a staging URL.
- Broken HTML: an unclosed, empty `<p class="">` sits directly before the Damian Mason bio block. This is what causes `_source/extracted/boasg.txt` to silently drop the entire Damian Mason bio paragraph.
- Inconsistent heading semantics for parallel content: "Damian Mason Expertise:" is a bolded `<p>` while "Todd Thurman Expertise:" is an `<h3>`.
- Both expertise lists are fake lists — `•` characters separated by `<br />` inside one paragraph, not `<ul>`/`<li>`. No spacing between bullets, so they extract as a single run-on string.
- The "What you get:" list is split across two separate `<ul>` elements (bullet 1 in its own list, bullets 2–4 in a second), producing an extra gap after the first bullet.
- Brand capitalization conflict: the H3 says "BoASG" but the Damian bio says "BOASG"; page title/nav use the full "The Business of Ag Success Group".
- Cadence copy conflict: hero + bullets say "bi-monthly", the footnote says "Every other Friday". "Bi-monthly" is ambiguous (twice a month vs every two months) and the two statements do not agree.
- Pasted-in Squarespace markup left inside Divi text modules — `class="row sqs-row"`, `class="sqs-block html-block sqs-block-html"`, `data-block-type="2"`, and machine ids like `id="yui_3_17_2_1_1681408764027_128"`. Dead classes with no matching CSS.
- Hero decorative image has `alt=""` AND `title=""` (empty title attribute serves no purpose).
- Orphan footnote marker: the schedule note begins with `*` but nothing on the page carries a matching asterisk.
- Redundant no-op gradient on the orange CTA band (linear-gradient from `rgba(249,77,28,0.83)` to the identical `rgba(249,77,28,0.83)` layered over `#f94d1c`).
- Inline `<style>` shipped inside page content via a Divi code module (`.company-67a-sc-hero-hed .et_pb_button_module_wrapper{display:inline-block;}`).
- Mixed apostrophe styles: curly `’` in body copy ("If you’re", "won’t"), straight `'` in the mailing-list button label.
- The og:image / JSON-LD `primaryImageOfPage` is `BOASG-BRAND-LOGO-FINAL-WHITE.jpg` (opaque white JPG), but the page itself renders `BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png`. Two copies of the same asset.
- Both "Join Today" CTAs are identical and go to the same WooCommerce product page — no secondary/lower-commitment action anywhere on the page.
- `<meta name="viewport">` is `maximum-scale=1.0, user-scalable=0`, which blocks pinch-zoom (accessibility failure — site-wide, but it applies here).
- Site-wide footer links (documented once elsewhere) resolve to `https://damianmason.wpengine.com/?page_id=…` staging URLs.

# Blog

- **Source URL:** https://damianmason.com/blog/
- **Slug:** blog
- **SEO title:** Blog - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** keep

## Sections

### 1. Post index
- **Type:** list
- **Eyebrow:** -
- **Heading:** -  (NO H1 anywhere on this page — the post titles are H2s and nothing labels the page)
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  -
- **Images:**
  -
- **Videos:**
  -
- **Notes:** Default Divi blog archive (`#left-area` + `#sidebar`, `et_right_sidebar`). Exactly two posts, newest first. No page title, no intro copy, no category filters, no post count. JSON-LD types it as `CollectionPage` with `datePublished: 2026-01-09T21:50:39+00:00`.

### 2. Post card 1 — How the Climate Crisis is Causing Food Shortages Globally
- **Type:** list
- **Eyebrow:** -
- **Heading:** How the Climate Crisis is Causing Food Shortages Globally  (H2, `entry-title`)
- **Subheading:** -
- **Body:**
  by damianmasonstg | Apr 19, 2023 | Uncategorized

  Damian Mason featured in Cheddar…
- **List items:**
  -
- **CTAs:**
  - "(featured image link, no text)" -> https://damianmason.com/how-the-climate-crisis-is-causing-food-shortages-globally/
  - "How the Climate Crisis is Causing Food Shortages Globally" -> https://damianmason.com/how-the-climate-crisis-is-causing-food-shortages-globally/
  - "damianmasonstg" -> https://damianmason.com/author/damianmasonstg/
  - "Uncategorized" -> https://damianmason.com/category/uncategorized/
- **Images:**
  - `Screenshot-2023-04-19-at-12.16.28-PM.png` | alt="How the Climate Crisis is Causing Food Shortages Globally" | role: inline | live page requests `Screenshot-2023-04-19-at-12.16.28-PM-1080x675.png`, which is NOT in `_source/media` — only the 2118x1190 original was mirrored. `srcset` also names `-980x551` and `-480x270`. macOS screenshot of a Cheddar News broadcast, not a purpose-shot image.
- **Videos:**
  -
- **Notes:** The excerpt is the WordPress auto-excerpt of a 4-word post body, so it truncates mid-phrase to "Damian Mason featured in Cheddar…" (rendered as `Damian Mason featured in Cheddar...` in source, an ASCII triple-dot). There is no "Read more" link. Author byline is the raw WordPress username `damianmasonstg` (a staging account name), not "Damian Mason". Category is literally "Uncategorized".

### 3. Post card 2 — ‘Eggflation’ Gives Producers Record Profits While Internet Mocks Outrageous Prices
- **Type:** list
- **Eyebrow:** -
- **Heading:** ‘Eggflation’ Gives Producers Record Profits While Internet Mocks Outrageous Prices  (H2, `entry-title`)
- **Subheading:** -
- **Body:**
  by damianmasonstg | Dec 16, 2022 | Uncategorized

  Damian featured in Straight Arrow NewsBy Simone Del Rosario
- **List items:**
  -
- **CTAs:**
  - "(featured image link, no text)" -> https://damianmason.com/hello-world/
  - "‘Eggflation’ Gives Producers Record Profits While Internet Mocks Outrageous Prices" -> https://damianmason.com/hello-world/
  - "damianmasonstg" -> https://damianmason.com/author/damianmasonstg/
  - "Uncategorized" -> https://damianmason.com/category/uncategorized/
- **Images:**
  - `Screenshot-2023-04-19-at-11.40.07-AM.png` | alt="‘Eggflation’ Gives Producers Record Profits While Internet Mocks Outrageous Prices" | role: inline | live page requests `Screenshot-2023-04-19-at-11.40.07-AM-1080x675.png`, which is NOT in `_source/media` — only the 1800x1014 original was mirrored. `srcset` also names `-980x552` and `-480x270`. macOS screenshot of the Straight Arrow News article page.
- **Videos:**
  -
- **Notes:** The excerpt strips the `<br>` from the post body, so the two lines run together with no space: "Damian featured in Straight Arrow NewsBy Simone Del Rosario". Verbatim, and it is broken. The post URL is still the WordPress default `/hello-world/` — the slug was never changed to match the title.

### 4. Pagination
- **Type:** copy
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
  -
- **Videos:**
  -
- **Notes:** `<div class="pagination clearfix">` renders with two empty child divs (`alignleft`, `alignright`) — no prev/next links because there is only one page of posts. Dead markup.

### 5. Sidebar
- **Type:** form
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
  -
- **Videos:**
  -
- **Notes:** Right sidebar contains exactly two widgets: (1) a WordPress core search block — label "Search", `<input type="search" name="s">` with empty placeholder, submit button labelled "Search", form GET to https://damianmason.com/; (2) `block-3`, a group block containing a single EMPTY `<h2 class="wp-block-heading"></h2>` — a widget that was started and never filled in. Nothing else. No categories, no archives, no recent posts, no author bio.

## Full item inventory
- Paragraphs: 4
- Testimonials: 0
- FAQ items: 0
- Images: 2
- Videos: 0
- CTAs: 8
- Forms: 1

## Defects observed on the live page
- No H1 on the page at all — the highest heading is the first post title (H2), and nothing identifies the page as "Blog".
- Missing meta description; no OG image.
- Only two posts exist, the newest from April 2023 — the blog reads as abandoned.
- Both posts are filed under "Uncategorized"; that is also the only category.
- Author byline is the raw staging username `damianmasonstg`, not a human name.
- Excerpt 2 is visibly broken: "Damian featured in Straight Arrow NewsBy Simone Del Rosario" — the `<br>` is stripped and the two sentences collide with no space.
- Excerpt 1 truncates mid-phrase ("Damian Mason featured in Cheddar…") because the underlying post body is four words long.
- No "Read more" affordance on either card.
- Post 2's permalink is still the WordPress default `/hello-world/` despite a title about Eggflation.
- Empty pagination block (`.pagination` with two empty child divs) renders as dead markup.
- Sidebar widget `block-3` is an empty `<h2 class="wp-block-heading"></h2>` — a blank widget shipped to production.
- Both featured images are macOS screenshots and are requested at a `-1080x675` size that is not in the mirrored media set.
- Site-wide (noted once): footer links resolve to `https://damianmason.wpengine.com/?page_id=...` staging URLs; header "Speaking", "Podcasts" and "Media" top-level items have EMPTY HREFs.

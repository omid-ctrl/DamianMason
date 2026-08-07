# Speaking

- **Source URL:** https://damianmason.com/speaking/
- **Slug:** speaking
- **SEO title:** Speaking - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** new-route  (page is empty today; rebuild `/speaking/` as a real hub fronting Keynote, Testimonials, Meeting Coordinators and Collaboration Opportunities — the four items the header already nests under a "Speaking" parent whose href is empty)

## Sections

### 1. Page title
- **Type:** hero
- **Eyebrow:** -
- **Heading:** Speaking  (H1, `class="main_title"`)
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
- **Notes:** This heading is the entire page. `<article id="post-102">` contains the H1 and then `<div class="entry-content">` — which is EMPTY (whitespace only, verified in the raw HTML). WordPress page ID 102, published 2022-12-20T16:38:23+00:00, modified 2022-12-20T17:24:41+00:00 — created and abandoned the same afternoon, untouched since.

### 2. Sidebar
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
- **Notes:** Right sidebar with the same two widgets as /blog/: a core search block (label "Search", `input type=search name=s` with empty placeholder, button "Search", GET to https://damianmason.com/) and `block-3`, an empty `<h2 class="wp-block-heading"></h2>`. On this page the sidebar is the only thing with any content in it, which makes the search box the visual centre of the page.

## Full item inventory
- Paragraphs: 0
- Testimonials: 0
- FAQ items: 0
- Images: 0
- Videos: 0
- CTAs: 0
- Forms: 1

## Defects observed on the live page
- The page is EMPTY. `<div class="entry-content">` contains nothing but whitespace. The only content is the word "Speaking" in an H1.
- It uses the Divi BLANK page template (`page-template-page-template-blank`), so it renders with NO SITE HEADER and NO SITE FOOTER — a visitor who lands here gets an unbranded white page with the word "Speaking", a search box, and no navigation whatsoever and no way back to the site except the browser back button.
- Because there is no header, the site logo is absent — the page carries zero branding.
- Indexable: `<meta name="robots" content="index, follow, max-image-preview:large...">`. An empty, chromeless page is open to search engines and is in the JSON-LD breadcrumb trail as Home > Speaking.
- Missing meta description; no OG image.
- The header's top-level "Speaking" nav item has an EMPTY HREF, so nothing in the site navigation points here — the page is orphaned but still indexed and still linked from the sitemap/breadcrumbs.
- Sidebar widget `block-3` is an empty `<h2 class="wp-block-heading"></h2>`.
- Created and last modified on the same day (2022-12-20), 46 minutes apart, and never revisited.

# Podcasts

- **Source URL:** https://damianmason.com/podcast-2/
- **Slug:** podcast-2
- **SEO title:** Podcasts - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** redirect -> /podcasts/  (301; the page is empty and carries nothing worth migrating. The real podcast content lives at /the-business-of-agriculture/, /do-business-better-podcast/ and /xtreme-ag/, which the header already nests under an empty-href "Podcasts" parent.)

## Sections

### 1. Page title
- **Type:** hero
- **Eyebrow:** -
- **Heading:** Podcasts  (H1, `class="main_title"`)
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
- **Notes:** This heading is the entire page. `<article id="post-103">` contains the H1 and then `<div class="entry-content">` — which is EMPTY (whitespace only, verified in the raw HTML). WordPress page ID 103, published 2022-12-20T16:39:07+00:00, modified 2022-12-20T17:24:23+00:00 — created and abandoned the same afternoon, untouched since. Note the slug is `podcast-2` (singular + a WordPress collision suffix) while the title and `og:title` are "Podcasts".

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
- **Notes:** Right sidebar with the same two widgets as /blog/: a core search block (label "Search", `input type=search name=s` with empty placeholder, button "Search", GET to https://damianmason.com/) and `block-3`, an empty `<h2 class="wp-block-heading"></h2>`. Byte-for-byte the same markup as /speaking/ — the two pages' bodies are both 1585 characters and differ only in the page id and the H1 text.

## Full item inventory
- Paragraphs: 0
- Testimonials: 0
- FAQ items: 0
- Images: 0
- Videos: 0
- CTAs: 0
- Forms: 1

## Defects observed on the live page
- The page is EMPTY. `<div class="entry-content">` contains nothing but whitespace. The only content is the word "Podcasts" in an H1.
- It uses the Divi BLANK page template (`page-template-page-template-blank`), so it renders with NO SITE HEADER and NO SITE FOOTER — a visitor who lands here gets an unbranded white page with the word "Podcasts", a search box, and no navigation whatsoever and no way back to the site except the browser back button.
- Because there is no header, the site logo is absent — the page carries zero branding.
- Slug/title mismatch: the URL is `/podcast-2/` — singular, plus WordPress's automatic `-2` duplicate-slug suffix — while the page is titled "Podcasts". The `-2` implies another `podcast` page was created first.
- Indexable: `<meta name="robots" content="index, follow, max-image-preview:large...">`. An empty, chromeless page is open to search engines and is in the JSON-LD breadcrumb trail as Home > Podcasts.
- Missing meta description; no OG image.
- The header's top-level "Podcasts" nav item has an EMPTY HREF, so nothing in the site navigation points here — the page is orphaned but still indexed and still linked from the sitemap/breadcrumbs.
- Sidebar widget `block-3` is an empty `<h2 class="wp-block-heading"></h2>`.
- Created and last modified on the same day (2022-12-20), 45 minutes apart, and never revisited.
- Duplicate of /speaking/ in every respect except the H1 text — the same abandoned stub shipped twice.

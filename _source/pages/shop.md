# Shop

- **Source URL:** https://damianmason.com/shop/
- **Slug:** shop
- **SEO title:** Shop - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** redirect -> /about/#books (commerce is being removed from the new site; the only surviving content is the book credibility block on /about/#books)

## Sections

### 1. Page title
- **Type:** hero
- **Eyebrow:** -
- **Heading:** Shop  (H1)
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
- **Notes:** The H1 is a standalone Divi text module (`et_pb_text_0`, center-aligned) containing only `<h1>Shop</h1>`. No intro copy, no subheading, no lede. The page is literally a title plus a WooCommerce product grid.

### 2. Product grid (WooCommerce shop loop)
- **Type:** gallery
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  -
- **List items:**
  - Business of Ag Success Group $99.00
  - Do Business Better: Traits, Habits, and Actions to Help You Succeed (Limited Supply) $19.95
  - Food Fear (Audiobook) How Fear is Ruining Your Dinner and Why You Should Celebrate Eating $19.95
  - Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate Eating $19.95
- **CTAs:**
  - "Business of Ag Success Group $99.00" -> https://damianmason.com/product/business-of-ag-success-group/  <!-- flag: commerce -->
  - "Do Business Better: Traits, Habits, and Actions to Help You Succeed (Limited Supply) $19.95" -> https://damianmason.com/product/do-business-better-traits-habits-and-actions-to-help-you-succeed-limited-supply/  <!-- flag: commerce -->
  - "Food Fear (Audiobook) How Fear is Ruining Your Dinner and Why You Should Celebrate Eating $19.95" -> https://damianmason.com/product/food-fear-audiobook-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating/  <!-- flag: commerce -->
  - "Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate Eating $19.95" -> https://damianmason.com/product/food-fear-how-fear-is-ruining-your-dinner-and-why-you-should-celebrate-eating/  <!-- flag: commerce -->
- **Images:**
  - `BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png` | alt="The Business of Ag Success Group" | role: logo | live page serves the `-300x300` crop; full-size original is in `_source/media/`. This is a white transparent logo, so it is invisible on a white background.
  - `dbb-online-store.png` | alt="Do Business Better Book" | role: inline | live page serves the `-300x300` crop
  - `FOOD-FEAR-AUDIOBOOK-STORE.png` | alt="Food Fear (Audiobook) How Fear is Ruining Your Dinner and Why You Should Celebrate Eating" | role: inline | live page serves the `-300x300` crop
  - `FoodFear-Mockup-Online-Store.png` | alt="Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate Eating From the history of food production to today’s food fights to the future of eating, FOOD FEAR is the lively dinner conversation we all need to have. Damian Mason combines his farm background, Agricultural education, and industry expertise with wit and edge. The result: a food book that is factual, informative, and entertaining." | role: inline | live page serves the `-300x300` crop; alt text is the entire product description pasted into the alt attribute
- **Videos:**
  -
- **Notes:** Rendered by the Divi `et_pb_shop` module in `et_pb_shop_grid` / `columns-3` layout, but there are four products, so the fourth wraps to a second row. Each product title is an `<h2 class="woocommerce-loop-product__title">`; the price is a sibling `<span class="price">`, and the whole card (image + title + price) is wrapped in one `<a>`. Products are ordered alphabetically by title, not curated. Every price on this grid must be stripped on the new site.

## Full item inventory
- Paragraphs: 0
- Testimonials: 0
- FAQ items: 0
- Images: 4
- Videos: 0
- CTAs: 4
- Forms: 0

## Defects observed on the live page
- No meta description on the page (`og:title` is set, but there is no meta description and no `og:image`).
- No page copy at all: an H1 reading "Shop" and nothing else. Zero paragraphs of body content.
- Four product cards render into a `columns-3` grid, so the layout is a 3 + 1 orphan row.
- Product H2s inside the loop create a heading hierarchy with no H2 section label above them.
- `BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png` is a white logo on a transparent background used as a product thumbnail on a white page. It is effectively invisible.
- The Food Fear paperback thumbnail's `alt` attribute is the entire product description (4 sentences, 400+ characters) rather than a description of the image. Accessibility defect.
- The Business of Ag Success Group is sold here as a $99.00 WooCommerce product even though it is a membership, not merchandise. It duplicates the /boasg/ page.
- This page is a byte-for-byte content duplicate of /damian-mason-online-shop/ (two live URLs, same H1, same grid, same four products). Duplicate-content SEO defect.
- Header logo `<img>` and every footer link point at the staging host `damianmason.wpengine.com` rather than the production domain.
- Site-wide header nav has empty `href=""` on the "Speaking", "Podcasts" and "Media" top-level items.
- price on old site: $99.00 for Business of Ag Success Group (must NOT appear on new site)
- price on old site: $19.95 for Do Business Better: Traits, Habits, and Actions to Help You Succeed (Limited Supply) (must NOT appear on new site)
- price on old site: $19.95 for Food Fear (Audiobook) How Fear is Ruining Your Dinner and Why You Should Celebrate Eating (must NOT appear on new site)
- price on old site: $19.95 for Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate Eating (must NOT appear on new site)
- Secondary bar above the header exposes a live cart counter ("0 Items" -> /cart/) and a raw Gmail address (damianmasonoffice@gmail.com) as the business contact.

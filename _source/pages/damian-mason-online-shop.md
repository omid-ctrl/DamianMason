# Shop

- **Source URL:** https://damianmason.com/damian-mason-online-shop/
- **Slug:** damian-mason-online-shop
- **SEO title:** Damian Mason - Online Shop - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** https://damianmason.com/wp-content/uploads/2023/04/FoodFear-Mockup-Online-Store.png
- **Disposition:** redirect -> /about/#books (commerce is being removed; this page is also a straight duplicate of /shop/)

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
- **Notes:** The visible H1 is "Shop" even though the `<title>` and `og:title` say "Damian Mason - Online Shop". Same standalone Divi text module as /shop/. No intro copy.

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
  - `BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png` | alt="The Business of Ag Success Group" | role: logo | live page serves the `-300x300` crop; white transparent logo, invisible against the white page background
  - `dbb-online-store.png` | alt="Do Business Better Book" | role: inline | live page serves the `-300x300` crop
  - `FOOD-FEAR-AUDIOBOOK-STORE.png` | alt="Food Fear (Audiobook) How Fear is Ruining Your Dinner and Why You Should Celebrate Eating" | role: inline | live page serves the `-300x300` crop
  - `FoodFear-Mockup-Online-Store.png` | alt="Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate Eating From the history of food production to today’s food fights to the future of eating, FOOD FEAR is the lively dinner conversation we all need to have. Damian Mason combines his farm background, Agricultural education, and industry expertise with wit and edge. The result: a food book that is factual, informative, and entertaining." | role: inline | live page serves the `-300x300` crop; alt text is the whole product description
- **Videos:**
  -
- **Notes:** Identical `et_pb_shop` grid to /shop/, identical four products, identical order. Only differences between the two pages are the WordPress page ID (411 vs 409), the sidebar body class (`et_no_sidebar` here, `et_right_sidebar` on /shop/), the `<title>`, and the presence of an `og:image` here. No content differs.

## Full item inventory
- Paragraphs: 0
- Testimonials: 0
- FAQ items: 0
- Images: 4
- Videos: 0
- CTAs: 4
- Forms: 0

## Defects observed on the live page
- Duplicate page. This is the same content as https://damianmason.com/shop/ served at a second URL, with a different `<title>` and canonical. Classic duplicate-content SEO defect.
- H1 ("Shop") does not match the `<title>` or `og:title` ("Damian Mason - Online Shop").
- No meta description.
- No page copy at all: an H1 and a product grid, zero paragraphs.
- Four products in a `columns-3` grid, producing a 3 + 1 orphan row.
- `BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png` is a white-on-transparent logo used as a product thumbnail on a white background. Effectively invisible.
- Food Fear paperback thumbnail `alt` is the full product description rather than an image description.
- The Business of Ag Success Group membership is merchandised here as a product, duplicating /boasg/.
- The page's `og:image` is the Food Fear book mockup, so social shares of the shop index look like a Food Fear book share.
- Header logo `<img>` and all footer links resolve to `damianmason.wpengine.com` (staging host) instead of the production domain.
- Site-wide header nav has empty `href=""` on "Speaking", "Podcasts" and "Media".
- price on old site: $99.00 for Business of Ag Success Group (must NOT appear on new site)
- price on old site: $19.95 for Do Business Better: Traits, Habits, and Actions to Help You Succeed (Limited Supply) (must NOT appear on new site)
- price on old site: $19.95 for Food Fear (Audiobook) How Fear is Ruining Your Dinner and Why You Should Celebrate Eating (must NOT appear on new site)
- price on old site: $19.95 for Food Fear: How Fear is Ruining Your Dinner and Why You Should Celebrate Eating (must NOT appear on new site)
- Secondary bar exposes a live cart counter ("0 Items" -> /cart/) and a raw Gmail address (damianmasonoffice@gmail.com).

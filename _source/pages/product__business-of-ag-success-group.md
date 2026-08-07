# Business of Ag Success Group

- **Source URL:** https://damianmason.com/product/business-of-ag-success-group/
- **Slug:** product__business-of-ag-success-group
- **SEO title:** Business of Ag Success Group - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description; og:description is present and is the WRONG COPY, pasted from the Do Business Better book: "After speaking to companies such as Merck, Land O’Lakes, and Cargill, and 2,000 audiences across the world, Damian Mason, successful businessman, agriculturalist, podcaster, and writer, wants to help you achieve your entrepreneurial goals and live a better life. While other business books claim to tell you how to reach success, they fall short because they don’t address the fact that success is different for each of us. Do Business Better helps you define success on your terms, then shows you how to achieve i")
- **OG image:** https://damianmason.com/wp-content/uploads/2023/04/BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png
- **Disposition:** redirect -> /boasg/ (NOT a book. This "product" is the monthly membership, so it maps to the join CTA on /boasg/, not to /about/#books)

## Sections

### 1. Breadcrumb
- **Type:** list
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  -
- **List items:**
  - Home
  - Uncategorized
  - Business of Ag Success Group
- **CTAs:**
  - "Home" -> https://damianmason.com
  - "Uncategorized" -> https://damianmason.com/product-category/uncategorized/  <!-- flag: commerce, and the breadcrumb literally reads "Uncategorized" -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** The middle breadcrumb crumb is the WordPress default category name "Uncategorized", shown to visitors. Two conflicting BreadcrumbList JSON-LD blocks exist (Yoast: Home > Shop > product; commerce block: Home > Uncategorized > product).

### 2. Product image
- **Type:** gallery
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  -
- **List items:**
  -
- **CTAs:**
  - "(no text)" -> https://damianmason.com/wp-content/uploads/2023/04/BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png  <!-- flag: lightbox link to a raw uploads file -->
- **Images:**
  - `BOASG-BRAND-LOGO-FINAL-WHITE-transparent.png` | alt="The Business of Ag Success Group" | role: logo | 1000x1000 original; page serves the `-600x600` crop. This is a WHITE logo on a TRANSPARENT background used as the product image on a white page, so it renders effectively invisible. A dark-background variant exists in `_source/media/` as `BOASG-BRAND-LOGO-FINAL-WHITE.jpg`; use that one, or place the transparent PNG on a dark surface.
- **Videos:**
  -
- **Notes:** Unlike the three book pages, this page renders only ONE `<img>` (no duplicated gallery thumbnail).

### 3. Product summary (title, price, short description, add to cart)
- **Type:** copy
- **Eyebrow:** -
- **Heading:** Business of Ag Success Group  (H1)
- **Subheading:** -
- **Body:**
  After speaking to companies such as Merck, Land O’Lakes, and Cargill, and 2,000 audiences across the world, Damian Mason, successful businessman, agriculturalist, podcaster, and writer, wants to help you achieve your entrepreneurial goals and live a better life. While other business books claim to tell you how to reach success, they fall short because they don’t address the fact that success is different for each of us. Do Business Better helps you define success on your terms, then shows you how to achieve i
- **List items:**
  - Categories: Membership, Uncategorized
- **CTAs:**
  - "Add to cart" -> (form POST to https://damianmason.com/product/business-of-ag-success-group/; the form holds a `number` input named `quantity` with a screen-reader-only label reading "Business of Ag Success Group quantity")  <!-- flag: commerce, must be removed; replace with the /boasg/ join CTA -->
  - "Membership" -> https://damianmason.com/product-category/membership/  <!-- flag: commerce -->
  - "Uncategorized" -> https://damianmason.com/product-category/uncategorized/  <!-- flag: commerce -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** MAPPING NOTE: this is a membership, not a book. It must NOT appear in `content/books.ts` or on /about/#books. It maps to the join CTA on /boasg/. The short description shown here is the WRONG COPY: it is the Do Business Better BOOK description pasted onto the membership product, truncated mid-word at "how to achieve i", and it describes a book rather than a membership. In the raw HTML "Do Business Better" is wrapped in `<em>` and surrounded by non-breaking spaces (`&nbsp;`). Do not carry any of this copy forward. Price displayed as `$99.00`, described in the tab below as monthly.

### 4. Description tab
- **Type:** copy
- **Eyebrow:** -
- **Heading:** Description  (H2)
- **Subheading:** Are you an Ag professional who could benefit from outside perspectives, ideas, insights, and vision? Join Damian and a team of experts in a new business outlook, advisory, and networking community for Ag professionals:  (H2)
- **Body:**
  Monthly Exclusive Membership for Agriculture
- **List items:**
  - Description
- **CTAs:**
  - "Description" -> #tab-description  <!-- flag: single-tab tab strip -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** This is the only accurate membership copy on the page and the only content worth carrying to /boasg/. Structure in source order: `<h2>Description</h2>` (WooCommerce boilerplate), then `<p>Monthly Exclusive Membership for Agriculture</p>`, then a long `<h2 id="yui_3_17_2_1_1682437249394_2336">` question, then `<h1><strong>THE BUSINESS OF AGRICULTURE SUCCESS GROUP</strong></h1>`. The `yui_3_17_2_1_...` id is leftover markup pasted out of a Yahoo/rich-text editor. Note the naming inconsistency: the H1 says "THE BUSINESS OF AGRICULTURE SUCCESS GROUP" while the product title, the nav item and the logo all say "Business of Ag Success Group" / "The Business of Ag Success Group".

### 5. Trailing brand lockup
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** THE BUSINESS OF AGRICULTURE SUCCESS GROUP  (H1)
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
- **Notes:** This is a SECOND H1 on the page (the first is the product title "Business of Ag Success Group"). It sits inside the Description tab panel and is bold-wrapped. It reads as the payoff line of the question above it but there is no CTA button attached to it, so the copy builds to an invitation and then dead-ends with nothing to click except the Add to cart button further up the page. On the new site this becomes the /boasg/ join CTA.

## Full item inventory
- Paragraphs: 2
- Testimonials: 0
- FAQ items: 0
- Images: 1
- Videos: 0
- CTAs: 6
- Forms: 1

## Defects observed on the live page
- price on old site: $99.00 (must NOT appear on new site)
- WRONG COPY: the short description above the Add to cart button is the Do Business Better BOOK description, pasted onto a membership product. It describes a business book, mentions "other business books", and italicizes the book title. It has nothing to do with an Ag membership community.
- That wrong copy is also TRUNCATED MID-WORD, ending "then shows you how to achieve i" with no punctuation, and the same broken string is baked into the `Product` JSON-LD `description` and the `og:description`.
- DUPLICATE H1: the page has two `<h1>` elements. "Business of Ag Success Group" (product title) and "THE BUSINESS OF AGRICULTURE SUCCESS GROUP" (inside the Description tab).
- Naming inconsistency for the same offering across one page: "Business of Ag Success Group", "The Business of Ag Success Group" (image alt), "THE BUSINESS OF AGRICULTURE SUCCESS GROUP" (H1).
- Product is filed under "Membership" AND "Uncategorized", and "Uncategorized" is what visitors see in the breadcrumb.
- Leftover rich-text-editor markup in the source: `<h2 id="yui_3_17_2_1_1682437249394_2336">`, plus `&nbsp;` characters around "Do Business Better".
- The product image is a white logo on a transparent background displayed on a white page. Effectively invisible.
- An `<h2>` is used to carry a 200-character marketing question, which is body copy styled as a heading.
- The copy builds to "THE BUSINESS OF AGRICULTURE SUCCESS GROUP" and then offers no join CTA. The only action available is the WooCommerce Add to cart button.
- No meta description.
- The page never states the billing period in the pricing area. "Monthly" appears only inside the Description tab body copy, while the price near the button reads a bare "$99.00".
- A membership is sold through the same WooCommerce cart as physical books, and the product carries a `shipping-taxable` class.
- The membership is offered with a quantity spinner (`min="1"`, `step="1"`, no max), so a visitor can add several copies of a single-person monthly membership to the cart.
- Two conflicting `BreadcrumbList` JSON-LD blocks (Home > Shop vs Home > Uncategorized).
- Single-tab tab strip ("Description") with nothing to switch to.
- `Product` JSON-LD hardcodes `priceValidUntil` / `validThrough` of 2027-12-31 and `availability: InStock`.
- This page duplicates and competes with the dedicated /boasg/ page.
- WooCommerce/Stripe payment scaffolding inlined into the page (WooPay express checkout, Stripe express-checkout element, live Stripe publishable key).
- Header logo `<img>` and all footer links point at `damianmason.wpengine.com` (staging host).
- Site-wide header nav has empty `href=""` on "Speaking", "Podcasts" and "Media".
- Secondary bar exposes a live cart counter ("0 Items" -> /cart/) and a raw Gmail address (damianmasonoffice@gmail.com).

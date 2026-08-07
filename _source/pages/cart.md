# Cart

- **Source URL:** https://damianmason.com/cart/
- **Slug:** cart
- **SEO title:** Cart - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** redirect -> /about/#books  (WooCommerce shell being deleted)

## Sections

### 1. Empty WooCommerce cart shell
- **Type:** copy
- **Eyebrow:** -
- **Heading:** Cart (H1 — `h1.entry-title.main_title`)
- **Subheading:** -
- **Body:**
  There is no unique marketing content on this page worth carrying to the new site. The entire body is the stock WooCommerce empty-cart state: an H1 "Cart", the notice "Your cart is currently empty." and a "Return to shop" button pointing at /shop/. No copy, no images, no video, no testimonials, nothing brand-specific. The store is being removed, so this route should redirect to /about/#books, where book sales are handled.
- **List items:**
  -
- **CTAs:**
  - "Return to shop" -> https://damianmason.com/shop/  <!-- flag: commerce — /shop/ is also being removed -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** `article id="post-281"`, body classes `woocommerce-cart woocommerce-page`, `et_full_width_page`.
  The empty-cart notice lives in `div.wc-empty-cart-message > div.cart-empty.woocommerce-info[role=status]`
  and was not picked up by the extractor — the verbatim string is "Your cart is currently empty."

## Full item inventory
- Paragraphs: 1  (the empty-cart notice)
- Testimonials: 0
- FAQ items: 0
- Images: 0
- Videos: 0
- CTAs: 1
- Forms: 0

## Defects observed on the live page
- **No meta description** (page is `noindex, follow`, so low impact).
- The mirror was captured with an empty cart, so the populated cart table/coupon form/totals were never
  rendered. Not a defect to fix — noted so nobody assumes the cart template has no line-item UI.
- Live WooCommerce/Stripe/WooPayments configuration (live publishable keys, WooPay session blobs, Klarna
  config) is inlined in the page HTML — another reason to delete the commerce stack rather than port it.

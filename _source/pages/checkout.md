# Cart

- **Source URL:** https://damianmason.com/checkout/
- **Slug:** checkout
- **SEO title:** Cart - Damian Mason Keynote Speaker  <!-- the checkout URL serves the Cart page's title -->
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** redirect -> /about/#books  (WooCommerce shell being deleted)

## Sections

### 1. Empty WooCommerce checkout — served as the cart shell
- **Type:** copy
- **Eyebrow:** -
- **Heading:** Cart (H1 — `h1.entry-title.main_title`)
- **Subheading:** -
- **Body:**
  There is no unique marketing content on this page worth carrying to the new site. Requesting /checkout/ with an empty cart makes WooCommerce serve the Cart page instead, so the mirrored file is byte-identical to cart.html apart from per-request Stripe/WooPay nonces: same `article id="post-281"`, same canonical `https://damianmason.com/cart/`, same H1 "Cart", same "Your cart is currently empty." notice and the same "Return to shop" button. The real checkout form (billing fields, payment methods) was never rendered and therefore was never captured. The store is being removed, so this route should redirect to /about/#books, where book sales are handled.
- **List items:**
  -
- **CTAs:**
  - "Return to shop" -> https://damianmason.com/shop/  <!-- flag: commerce — /shop/ is also being removed -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** Body classes on the captured document are `page-id-281 woocommerce-cart woocommerce-page`
  (the Cart page, not the Checkout page). The inline `wc_stripe_express_checkout_params` object confirms it:
  `"is_checkout_page":""`, `"is_cart_page":"1"`. Billing fields configured on the store (from
  `wcpayConfig.enabledBillingFields`, not rendered on the page): `billing_email`, `billing_first_name`,
  `billing_last_name`, `billing_company` (optional), `billing_country`, `billing_address_1`,
  `billing_address_2` (optional), `billing_city`, `billing_state`, `billing_postcode`, `billing_phone`.

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
- **Duplicate/conflicting identity:** /checkout/ returns the Cart page — canonical points at
  `https://damianmason.com/cart/`, `<title>` is "Cart", og:title is "Cart", and the JSON-LD `WebPage`/
  breadcrumb both say "Cart" while the requested URL is /checkout/. Two URLs serving one document.
- Live WooCommerce/Stripe/WooPayments configuration (live publishable keys `pk_live_…`, account id, WooPay
  session blobs, Sift beacon key, Klarna config) is inlined in the page HTML — another reason to delete the
  commerce stack rather than port it.

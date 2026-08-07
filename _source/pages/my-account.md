# My account

- **Source URL:** https://damianmason.com/my-account/
- **Slug:** my-account
- **SEO title:** My account - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** redirect -> /about/#books  (WooCommerce shell being deleted)

## Sections

### 1. WooCommerce account login shell
- **Type:** form
- **Eyebrow:** -
- **Heading:** My account (H1) / Login (H2)
- **Subheading:** -
- **Body:**
  There is no unique marketing content on this page worth carrying to the new site. It is the stock WooCommerce `my-account` template: a theme-rendered H1 "My account", a WooCommerce H2 "Login", and the default login form (`username` text, `password` password, `rememberme` checkbox, "Log in" submit, plus a "Lost your password?" link to /my-account/lost-password/ and hidden `woocommerce-login-nonce` / `_wp_http_referer` fields). The right sidebar shows the default WordPress search widget and an empty heading block. Every word on the page is WooCommerce/WordPress boilerplate — no copy, no images, no video, no testimonials. The store is being removed, so this route should redirect to /about/#books, where book sales are handled.
- **List items:**
  -
- **CTAs:**
  - "Log in" -> (form submit, `<button name="login" value="Log in">`, form has empty action = self-post)  <!-- flag: commerce -->
  - "Lost your password?" -> https://damianmason.com/my-account/lost-password/  <!-- flag: commerce -->
  - "Search" -> GET https://damianmason.com/ (sidebar search widget, `name="s"`)
- **Images:**
  -
- **Videos:**
  -
- **Notes:** `article id="post-283"`, body classes `woocommerce-account woocommerce-page`, `et_right_sidebar`.
  Field labels verbatim (raw markup, then how they flatten as visible text):
  - `<label for="username">Username or email address&nbsp;<span class="required" aria-hidden="true">*</span><span class="screen-reader-text">Required</span></label>` -> "Username or email address *Required"
  - `<label for="password">Password&nbsp;<span class="required" aria-hidden="true">*</span><span class="screen-reader-text">Required</span></label>` -> "Password *Required"
  - `<label …woocommerce-form-login__rememberme>` wrapping the checkbox -> "Remember me", immediately followed by the submit "Log in", so the flattened text reads "Remember me Log in"
  - sidebar widget `<label class="wp-block-search__label">Search</label>` + `<button aria-label="Search">Search</button>`
  Hidden fields: `woocommerce-login-nonce` (value `fa59c36f12`), `_wp_http_referer` (value `/my-account/`).

## Full item inventory
- Paragraphs: 0  (no prose — all text is form labels/boilerplate)
- Testimonials: 0
- FAQ items: 0
- Images: 0
- Videos: 0
- CTAs: 3
- Forms: 2  (WooCommerce login + sidebar search widget)

## Defects observed on the live page
- **No meta description** (page is `noindex, follow`, so low impact).
- **Empty heading in sidebar:** `<h2 class="wp-block-heading"></h2>` renders with no content (block-3 widget).
- **Empty form action:** the login form has `action=""` (self-posting) — flagged only because it means the
  route cannot be statically mirrored.
- Live WooCommerce/Stripe/WooPayments configuration (live publishable keys, WooPay session blobs) is inlined
  in the page HTML — another reason to delete the commerce stack rather than port it.

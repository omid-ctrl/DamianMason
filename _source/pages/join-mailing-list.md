# Join the List Today!

- **Source URL:** https://damianmason.com/join-mailing-list/
- **Slug:** join-mailing-list
- **SEO title:** Join Mailing List - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** (none)
- **Disposition:** redirect -> /join-the-conversation/

> Disposition note: this page and `/join-the-conversation/` embed the **identical** Mailchimp form (same
> action URL, same user id, same list id, same field names). Per the harvest brief this URL redirects to
> `/join-the-conversation/`. **The marketing copy below lives only on THIS page** — carry it over to the
> surviving `/join-the-conversation/` route before deleting, or it is lost.

## Sections

### 1. Join the List Today! — intro
- **Type:** intro
- **Eyebrow:** -
- **Heading:** Join the List Today!  (H1 — entire heading wrapped in `<strong>`: `<h1><strong>Join the List Today!</strong></h1>`)
- **Subheading:** Subscribe to get notified of new podcast releases and more from Damian Mason.  (H3)
- **Body:**
  Follow Damian as he delivers insightful commentary on recent trends in the business of food, fuel, and fiber. With clever wit and down-to-earth delivery, he makes these topics both interesting and entertaining for his weekly audience of more than 40,000 subscribers. Add yourself to the list:
- **List items:**
  -
- **CTAs:**
  -
- **Images:**
  -
- **Videos:**
  -
- **Notes:** Divi text module `et_pb_text_0` inside `et_pb_section_0` / `et_pb_row_0`. An **empty `<h3></h3>`**
  sits between the H1 and the real H3. The paragraph is wrapped in a bare `<span>`. Heading order jumps
  H1 -> H3 (no H2 in this module); the H2 appears later, inside the form. The paragraph ends with a colon
  ("Add yourself to the list:") that leads directly into the form below.

### 2. Mailchimp subscribe form
- **Type:** form
- **Eyebrow:** -
- **Heading:** Join the Conversation!  (H2 — `<h2>Join the Conversation!</h2>` inside `#mc_embed_signup_scroll`)
- **Subheading:** -
- **Body:**
  * indicates required
- **List items:**
  -
- **CTAs:**
  - "Subscribe" -> POST https://damianmason.us13.list-manage.com/subscribe/post?u=f08e63fefabed3435c6d1f97f&id=6456b31ef4&f_id=007b92e2f0  <!-- flag: external form target, opens in target="_blank" -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** Divi code module `et_pb_code_0` holding a verbatim Mailchimp "classic-071822" embed. Form
  attributes: `id="mc-embedded-subscribe-form"`, `name="mc-embedded-subscribe-form"`, `class="validate"`,
  `method="post"`, `target="_blank"`, `novalidate`. Because it sits in a Divi **code** module (not the
  classic editor), the markup here is well-formed — unlike the same embed on `/join-the-conversation/`.
  The form's H2 ("Join the Conversation!") is also the *page title* of the other newsletter page — another
  sign the two pages were duplicated.

## Mailchimp form contract (verbatim)

- **Action URL:** `https://damianmason.us13.list-manage.com/subscribe/post?u=f08e63fefabed3435c6d1f97f&id=6456b31ef4&f_id=007b92e2f0`
  (in source the `&` are HTML-encoded as `&#038;`)
- **Method:** post
- **Mailchimp data center:** us13
- **Account / user id (`u`):** `f08e63fefabed3435c6d1f97f`
- **List id (`id`):** `6456b31ef4`
- **Form id (`f_id`):** `007b92e2f0`
- **Honeypot field name:** `b_f08e63fefabed3435c6d1f97f_6456b31ef4`

### Fields (verbatim name / type / label)

| # | name | type | id | label (verbatim, whitespace preserved) | required |
|---|------|------|----|-----------------------------------------|----------|
| 1 | `FNAME` | text | `mce-FNAME` | `First Name ` (trailing space) | no |
| 2 | `LNAME` | text | `mce-LNAME` | `Last Name ` (trailing space) | no |
| 3 | `EMAIL` | email | `mce-EMAIL` | `Email Address  *` (two spaces before the asterisk; the `*` is `<span class="asterisk">`) | yes (`required`, `class="required email"`) |
| 4 | `b_f08e63fefabed3435c6d1f97f_6456b31ef4` | text | (none) | (none — honeypot, `tabindex="-1"`, wrapped in `<div style="position: absolute; left: -5000px;" aria-hidden="true">`) | no |
| 5 | `subscribe` | submit | `mc-embedded-subscribe` | value=`Subscribe`, `class="button"` | — |

Helper-text spans present and empty: `mce-FNAME-HELPERTEXT`, `mce-LNAME-HELPERTEXT`, `mce-EMAIL-HELPERTEXT`.
Response containers present and hidden: `#mce-responses` > `#mce-error-response`, `#mce-success-response`.

Merge-field map declared by the embed script (`window.fnames` / `window.ftypes`) — identical to
`/join-the-conversation/`; most are not rendered on the page:
`EMAIL`/email, `FNAME`/text, `LNAME`/text, `MMERGE3`/radio, `MMERGE4`/text, `MMERGE5`/text, `MMERGE6`/text,
`PHONEYUI_`/phone, `TEXTYUI_3`/text, `TEXTAREAY`/text, `CHECKBOXY`/text.

External assets the embed pulls in:
- `//cdn-images.mailchimp.com/embedcode/classic-071822.css` (protocol-relative stylesheet)
- `//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js` (protocol-relative script, requires jQuery)
- Inline `<style>` hard-coding `#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif;  width:600px;}`

## Full item inventory
- Paragraphs: 2  (1 prose paragraph + the form microcopy "* indicates required")
- Testimonials: 0
- FAQ items: 0
- Images: 0
- Videos: 0
- CTAs: 1
- Forms: 1

## Defects observed on the live page
- **Empty heading.** `<h3></h3>` renders with no content between the H1 and the real H3.
- **H1 wrapped in `<strong>`.** `<h1><strong>Join the List Today!</strong></h1>` — redundant emphasis markup
  inside a heading.
- **Broken heading order.** H1 -> (empty H3) -> H3 -> H2. No H2 before the H3s.
- **No meta description.**
- **Duplicate content.** Identical Mailchimp embed to `/join-the-conversation/`; two indexable URLs, one
  list. The form's own H2 here ("Join the Conversation!") duplicates the other page's H1.
- **Inconsistent naming.** Page H1 says "Join the List Today!", `<title>`/og:title say "Join Mailing List",
  and the form heading says "Join the Conversation!" — three different names for one action.
- **Unverified hard-coded stat.** "more than 40,000 subscribers" is baked into the copy (page last modified
  2023-05-18) with no source or date.
- **Hard-coded 600px form width** in an inline `<style>` — not responsive.
- **Render-blocking third-party CSS/JS** over protocol-relative `//` URLs (cdn-images.mailchimp.com,
  s3.amazonaws.com).
- **`target="_blank"` + `novalidate`** — the subscriber leaves the site to a Mailchimp confirmation page in
  a new tab; no on-site success state, native validation disabled.
- **Label whitespace artifacts:** `First Name ` / `Last Name ` trailing spaces; `Email Address  *` double
  space before the asterisk.
- No privacy/consent line, no "we won't spam you" reassurance, no GDPR/CAN-SPAM notice next to the submit.

# Get in Touch

- **Source URL:** https://damianmason.com/contact-us/
- **Slug:** contact-us
- **SEO title:** Contact Us - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** https://damianmason.com/wp-content/uploads/2023/05/DSC_7312-scaled.jpg
- **Disposition:** keep

> Note on the title above: the page has **no `<h1>` at all**. "Get in Touch" is a bolded paragraph
> (`<p><strong>Get in Touch</strong></p>`) inside a single Divi text module. It is used here as the best
> available title. The `<title>` tag and og:title say "Contact Us".

## Sections

### 1. Get in Touch — contact details block
- **Type:** copy
- **Eyebrow:** -
- **Heading:** Get in Touch  (NOT a heading element — bolded paragraph, page has no H1)
- **Subheading:** -
- **Body:**
  Get in Touch

  Want to book Damian for your next event, explore a partnership, or just say hello? We’d love to hear from you.

  Email: damianmasonoffice@gmail.com

  Phone: 888.304.0702

  We typically respond within one business day.
- **List items:**
  -
- **CTAs:**
  - "damianmasonoffice@gmail.com" -> damianmasonoffice@gmail.com  <!-- flag: broken mailto — href is missing the "mailto:" prefix, so it resolves as a relative URL to https://damianmason.com/contact-us/damianmasonoffice@gmail.com -->
- **Images:**
  -
- **Videos:**
  -
- **Notes:** This is the entire page body — one Divi text module (`et_pb_text_0`) inside one row inside one
  section (`et_pb_section_0`). "Email: " and "Phone:" are `<strong>` runs inside their paragraphs. The phone
  number 888.304.0702 is plain text with no `tel:` link. `We’d` uses a curly apostrophe (U+2019). There is no
  section background image and no featured image rendered on the page (the og:image / JSON-LD primaryimage
  `DSC_7312-scaled.jpg` exists in `_source/media/` but is never displayed on-page).

## Form fields (verbatim)

**There is no form on this page.** The raw HTML for `/contact-us/` contains zero `<form>`, `<input>`,
`<textarea>`, `<select>`, `<label>` and zero `<button>` elements inside the MAIN region. The only contact
mechanisms are the plain-text email address (with a broken link) and the plain-text phone number. A rebuilder
adding a contact form is adding new functionality, not porting existing functionality.

## Full item inventory
- Paragraphs: 5
- Testimonials: 0
- FAQ items: 0
- Images: 0
- Videos: 0
- CTAs: 1
- Forms: 0

## Defects observed on the live page
- **No H1.** The document has no `<h1>` element anywhere in MAIN. "Get in Touch" is `<p><strong>` only, so
  the page has no heading hierarchy at all (no h1–h6 in the page body).
- **Broken mailto.** `<a href="damianmasonoffice@gmail.com">damianmasonoffice@gmail.com</a>` — the `mailto:`
  scheme is missing, so the link 404s to `https://damianmason.com/contact-us/damianmasonoffice@gmail.com`
  instead of opening a mail client.
- **No meta description.** No `<meta name="description">` in `<head>`.
- **No contact form on the Contact page.** A "Contact Us" page with no way to submit an inquiry.
- **AI-chat CSS classes left in production markup.** All five paragraphs carry
  `class="font-claude-response-body break-words whitespace-normal leading-&#091;1.7&#093;"` — i.e.
  `font-claude-response-body break-words whitespace-normal leading-[1.7]`. This copy was pasted directly out
  of a Claude chat window into the WordPress editor and the response wrapper classes were never stripped.
  5 occurrences. The classes are dead (no matching CSS is loaded) but they leak the authoring process.
- Phone number is not a `tel:` link.
- No physical/mailing address, no booking-agent contact, no social links in the page body.

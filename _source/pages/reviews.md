# Reviews

- **Source URL:** https://damianmason.com/reviews/
- **Slug:** reviews
- **SEO title:** Testimonials - Damian Mason Keynote Speaker
- **Meta description:** (none — live site has no meta description)
- **OG image:** https://damianmason.com/wp-content/uploads/2023/04/book-signing-IMG_2446-1024x819.png
- **Disposition:** keep

## Sections

### 1. Hero — page title, book-signing photo, intro line
- **Type:** hero
- **Eyebrow:** -
- **Heading:** Reviews  (H1)
- **Subheading:** -
- **Body:**
  From the keynote stage to podcast host, to promoter and guest content contributor, Damian gets rave reviews everywhere he appears. Hear what some of his audience members, meeting planners, and fans have to say!

- **List items:** -
- **CTAs:** -
- **Images:**
  - `book-signing-IMG_2446.png` | alt="Damian Mason Book Signing" | role: inline | 1512×1209 PNG, 896 KB — a photograph saved as PNG; convert to JPG/WebP on rebuild
- **Videos:** -
- **Notes:** Divi `et_pb_section_0` carries classes `company-67a-sc-hero-hed et_animated et_pb_with_background` but no background-image rule resolves — it is effectively a plain white two-column band, not a real hero. Intro paragraph is wrapped in `<strong>` in the source. The section also holds the first testimonial (Mike Elliott) in the left column and the un-attributed "We received a ton…" quote plus two 128px quote-mark icons in the right column; those are documented in section 2 with the rest of the wall.

### 2. Testimonial wall (10 written testimonials)
- **Type:** testimonial-grid
- **Eyebrow:** -
- **Heading:** - (no heading of any level introduces the testimonial wall)
- **Subheading:** -
- **Body:**
  (see "Verbatim testimonials" below — every quote is inside a `<blockquote>` in a Divi Text module; there is no other body copy)

- **List items:** -
- **CTAs:** -
- **Images:**
  - `company-67-a-pr-14.png` | alt="" | role: decorative | 128×128 PNG, 4 KB — quote-mark/ornament glyph, rendered TWICE back-to-back (`et_pb_image_1` and `et_pb_image_2`) with identical src and empty alt
- **Videos:** -
- **Notes:** Testimonials are spread across two Divi sections. Modules `et_pb_text_2` and `et_pb_text_3` sit in `et_pb_section_0` (with the hero); `et_pb_text_4` through `et_pb_text_11` sit in `et_pb_section_1`. Markup is inconsistent per testimonial: some attributions are Squarespace `<figcaption class="source">` remnants, some are plain `<p>`. Several testimonials contain leftover Squarespace `sqs-block quote-block`, `sqs-row`, `sqs-col-9 span-9`, `horizontalrule-block` and `data-block-type` markup pasted inside the Divi text modules, plus one orphaned `<section data-test="page-section" …>` / `fluid-engine` fragment ahead of the Mike Elliott quote. None of that markup should be carried forward.

### 3. Video testimonials
- **Type:** video-grid
- **Eyebrow:** -
- **Heading:** - (no heading introduces the video row)
- **Subheading:** -
- **Body:** -
- **List items:** -
- **CTAs:** -
- **Images:** -
- **Videos:**
  - youtube:iZ85SxLyykA — "Hardwood Lumbermen’s Association recommends Damian Mason"
  - youtube:t3iCvSKEyx0 — "Farm Credit Emerging Entrepreneurs Conference & Damian Mason"
  - youtube:e79QDYxpJOE — "Nutrien - a successful meeting!"
  - youtube:t6BkS7Eb9pE — "The "Ations" of Agriculture & Ag&apos;s Future"
- **Notes:** Four `et_pb_video` modules in `et_pb_section_2`, each an oembed iframe at 1080×608. The fourth iframe's `title` attribute contains a raw, double-escaped entity: `The &quot;Ations&quot; of Agriculture &amp; Ag&amp;apos;s Future` — it renders literally as `Ag&apos;s` on the page.

### 4. Join the Conversation CTA band
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** Join the Conversation  (H2)
- **Subheading:** -
- **Body:** -
- **List items:** -
- **CTAs:**
  - "Sign Up for Damian's Mailing List" -> https://damianmason.com/join-the-conversation/
- **Images:** -
- **Videos:** -
- **Notes:** `et_pb_section_3` is a solid orange band: `background-color:#f94d1c` with an overlaid `linear-gradient(180deg, rgba(249,77,28,0.83) 0%, rgba(249,77,28,0.83) 100%)`. Note the target here is `/join-the-conversation/`, whereas the same-labelled CTA on collaboration-opportunities points at `/join-mailing-list/` — two different mailing-list pages.

## Full item inventory
- Paragraphs: 1
- Testimonials: 10
- FAQ items: 0
- Images: 3 (2 unique files; the 128px ornament is placed twice)
- Videos: 4
- CTAs: 1
- Forms: 0

## Defects observed on the live page
- No meta description on the page.
- H1 is "Reviews" but the `<title>`, `og:title`, JSON-LD `name` and the site nav all call the page "Testimonials" — inconsistent naming.
- One testimonial has NO attribution at all: "We received a ton of great feedback on both you and the event!" (`et_pb_text_3`) — orphan quote.
- The un-attributed quote above is also the only one with no curly quotation marks around it, while every other quote is wrapped in `“ ”`.
- Large blocks of leftover Squarespace markup pasted inside Divi Text modules: `sqs-block quote-block`, `sqs-row`, `sqs-col-9 span-9`, `sqs-block horizontalrule-block`, `data-block-type="31"`, `data-block-type="47"`, `block-yui_3_17_2_1_*` IDs, `figure class="block-animation-none"`, plus a full orphaned `<section data-test="page-section" … data-fluid-engine-section>` / `fluid-engine fe-630fc41f04af2318d9423aa6` fragment with its serialized `data-current-styles` / `data-current-context` JSON.
- Duplicate DOM IDs / stale IDs inherited from that pasted markup (e.g. `block-yui_3_17_2_1_1643727449027_68706`) — meaningless on a WordPress page.
- The same 128×128 ornament `company-67-a-pr-14.png` is output twice in a row as two separate image modules with empty alt.
- Empty `<blockquote>` elements used purely to hold horizontal rules (after the Mike Elliott quote and after the Brooks Breymeyer quote) — semantic misuse.
- Empty `<p>` elements inside `et_pb_text_1` and `et_pb_text_11`.
- Inconsistent attribution dash: nine testimonials use an em dash (`—`), the Farm Credit West one uses an en dash (`– WILLIAM NOLAND | FARM CREDIT WEST`).
- Mixed quote glyphs: the Farm Credit West quote uses straight-typed curly quotes inline, all others use `<span>“</span>` … `<span>”</span>` wrappers.
- Typo/spacing defect in the Rolling Plains quote: `for their meeting— so a win all around!` (em dash jammed against the preceding word with no space).
- "DUSTY RICH." attribution uses a period rather than a comma after the surname: `— DUSTY RICH. WESTERN SALES DIRECTOR, BW FUSION`.
- Video iframe title contains double-escaped HTML: `Ag&amp;apos;s Future` renders as `Ag&apos;s Future`.
- All image `src` values point at the staging host `https://damianmason.wpengine.com/...` while `srcset` points at `https://damianmason.com/...` — the page ships mixed staging/production URLs.
- Header logo and every footer link also point at `damianmason.wpengine.com` / `?page_id=NNN` (site-wide, not page-specific).
- `book-signing-IMG_2446.png` is a 1512×1209 photograph delivered as an 896 KB PNG.
- Testimonial wall has no heading — a screen reader hits ten blockquotes with no section label.
- No form and no direct booking CTA anywhere on the page except the mailing-list button.

## Verbatim testimonials

> “Damian’s insights into Agriculture and how Agriculture intersects with the consumer were on point and exactly what our team needed. He understood our business and how the changes within Agriculture could impact our business plans. His delivery engaged and energized the audience. If you are in the food business, I highly recommend Damian as a guest speaker for your event. He was awesome!”
> — MIKE ELLIOTT, GENERAL MANAGER – MICHAEL FOODS

> We received a ton of great feedback on both you and the event!
> — (no attribution on the live page)

> “I had the pleasure of attending this (Farm Credit) meeting and you have an amazing ability to lead a room and pull all the messages together. The blend of your knowledge and humor is inspirational.”
> — MELISSA BOCKMAN, BAYER

> “This guy is top-notch, if you’re ever looking for a great speaker at an event I would suggest Damian to anyone. He closed a meeting I was involved in yesterday with knowledge, delivered with humor. At breakfast this a.m. everyone was still talking about it. Impressed!”
> — JASON SCHLEY, NEXT LEVEL AG, LLC

> “I’ve gotten nothing but good feedback on Damian’s presentation and several have noted that they want x, y or z association they work with to reach out to him for their meeting— so a win all around!”
> — ROLLING PLAINS COTTON GROWERS

> “Thank you for joining us in Kansas City last month for our Retail Partner customer meeting. It was great to have you share thoughts and perspective — so many attendees said, ‘Man, that guy makes you think!’ I loved it!”
> — AMY B., AGROLIQUID

> “The absolute best keynote speaker I’ve ever had the pleasure of listening to. Hilarious, honest, informative, and real. Would recommend Damian to any organization for their events!”
> — DUSTY RICH. WESTERN SALES DIRECTOR, BW FUSION

> “If you haven’t heard Damian before, look him up! If you don’t learn anything, he’ll at least make you laugh! I’ll bet you do both. Can’t wait to read your book!”
> — BROOKS BREYMEYER, BREYMEYER LAND AND LIVESTOCK

> “I thought today went great. The overall message and how you brought it home worked extremely well and was easy for staff to follow – how will this impact FCW, our customers and me. Well done!”
> – WILLIAM NOLAND | FARM CREDIT WEST

> “Thanks so much for a great time with our team! Really appreciated you customizing so well and all the energy. Very well received.”
> — BRIAN RITTGERS, MICRONUTRIENTS

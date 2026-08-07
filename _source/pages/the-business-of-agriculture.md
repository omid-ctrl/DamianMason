# The Business of Agriculture Podcast

- **Source URL:** https://damianmason.com/the-business-of-agriculture/
- **Slug:** the-business-of-agriculture
- **SEO title:** The Business of Agriculture Podcast - Damian Mason Keynote Speaker
- **Meta description:** Looking for smart talk with entertaining commentary about the business of food, fuel, and fiber? You’ve found it. This podcast offers tips for success, ideas for self betterment, and mental stimulation for people who make Agriculture their Business. Damian Mason is an agriculturist, entrepreneur, speaker, writer, and funny man. As he says, “You don’t need any more Ag people discussing weather or commodity prices, you have that information on your phone!”
- **OG image:** https://damianmason.com/wp-content/uploads/2023/05/THE-BIZ-OF-AGRICULTURE-PODCAST-GRAPHIC.png
- **Disposition:** keep

## Sections

### 1. Hero — podcast title, show art, newsletter signup
- **Type:** hero
- **Eyebrow:** -
- **Heading:** The Business of Agriculture Podcast (H1, centered)
- **Subheading:** New episodes every Monday. Subscribe to get notified of news and special updates. (H3, right column)
- **Body:** -
- **List items:** -
- **CTAs:**
  - "Subscribe" -> #  <!-- flag: EMPTY HREF (anchor-only `#`; Divi newsletter module submits via AJAX) -->
- **Images:**
  - `avatars-000339569153-fp12nh-t500x500.png` | alt="" | role: logo | HERO SHOW ART. Filename claims `t500x500` but the file is actually **218×217** — a downscaled SoundCloud avatar. Rendered at its natural 218px; low quality, will not survive being scaled up. `alt` is empty and `title="avatars-000339569153-fp12nh-t500x500"`. src points at damianmason.wpengine.com.
  - **HERO BACKGROUND (CSS, not an `<img>`):** `https://damianmason.wpengine.com/wp-content/uploads/2023/02/Podcaster-34c.png` | role: hero-bg | **DOES NOT RESOLVE LOCALLY — this file was NOT mirrored into `_source/media/` (no `Podcaster-34c.png` anywhere in `_source/`).** Bound in the head `<style>` as `div.et_pb_section.et_pb_section_0{background-position:center bottom 0px;background-image:url(…Podcaster-34c.png)!important}` over `background-color:#060717`. Rebuilders must source or re-shoot this asset; the near-black `#060717` is the fallback and is what all the white text on this page is designed against.
- **Videos:** -
- **Notes:** Divi `et_pb_section_0`, `et_pb_with_background`, `padding-right:0px`. Two columns: 3/5 (H1 + show art) and 2/5 (H3 + newsletter form). Form is Divi `et_pb_signup_0`: `<form method="post">` with no action, one text input `et_pb_signup_email` (placeholder "Email", visually-hidden `<label>Email</label>`), an `<a href="#">Subscribe</a>` button, and hidden inputs `et_pb_signup_provider=mailchimp`, `et_pb_signup_list_id=6456b31ef4`, `et_pb_signup_account_name=Damian Mason`, `et_pb_signup_ip_address=true`, `et_pb_signup_checksum=00e011118bea84e3c5c4303c919909b2`. A hidden success state renders `<h2>Success!</h2>` (this is why the extract shows a stray "## Success!").

### 2. Latest Episode
- **Type:** copy
- **Eyebrow:** Latest Episode (H4)
- **Heading:** Will the Great American Cotton Plan Save U.S. Cotton? (H1 — second H1 on the page)
- **Subheading:** -
- **Body:**
  $2.6 billion. That’s what U.S. cotton growers stand to lose this year according to USDA, the fifth straight year of red ink for the industry. The Great American Cotton Plan, announced in May 2026, aims to change the economics of American cotton. In short, we’ve lost acres, we’ve lost infrastructure, and the producers have lost money. Plains Cotton Growers CEO, Kody Bessent joins cotton farmers Todd Kimbrell and Matt Miles. Along with Damian, they discuss: cotton’s current financial condition, how they see the new initiative impacting farmers, consumer apparel issues, and the promise of renewed cotton demand’s effect on rural communities. A major component of the new cotton promotion ties to the fiber’s natural-ness. American consumers discard more than 70 pounds of apparel each year, nearly three fourths of which is made from petroleum based material. Will all this bode as a positive for one of America’s original cash crops?
- **List items:** -
- **CTAs:** -
- **Images:** -
- **Videos:** -
- **Notes:** This block is hand-pasted per episode — there is no dynamic feed. The episode title and body are white text (`color:#ffffff`) on the dark hero section. The body paragraph is buried ten divs deep in leftover Libsyn/redactor markup (`post_body_wrapper > post-body-container > post-body-renderer-component post_body > post-body-content > body_text redactor-styles redactor-in`), and that entire wrapper stack is duplicated (nested inside itself twice). Page `dateModified` in JSON-LD is 2026-08-03, matching this episode. A rebuilder should replace this with a real "latest episode" fetch from the Libsyn RSS feed (`https://feeds.libsyn.com/504653/rss`).

### 3. Sponsors + episode buttons
- **Type:** list
- **Eyebrow:** -
- **Heading:** The Business of Agriculture Podcast with Damian Mason is Sponsored by: (bolded `<p>`, not a heading tag)
- **Subheading:** -
- **Body:**
  Also, make sure to check out DamianMason.com, XtremeAg’s The Cutting The Curve Podcast and The Granary.
- **List items:**
  - Heads Up Plant Protectants
  - Tidal Grow Agriscience
  - Nano-Yield
  - Good Agriculture
- **CTAs:**
  (sponsor list — plain text links, NO logo artwork anywhere on this page)
  - "Heads Up Plant Protectants" -> https://headsupst.com/
  - "Tidal Grow Agriscience" -> https://www.tidalgrowag.com/
  - "Nano-Yield" -> https://www.nano-yield.com/
  - "Good Agriculture" -> https://goodagriculture.com/
  (inline cross-promo links inside the "Also, make sure to check out…" paragraph)
  - "DamianMason.com" -> https://www.damianmason.com/  <!-- flag: self-link to the site you are already on, via the www. host -->
  - "XtremeAg’s The Cutting The Curve Podcast" -> https://www.xtremeag.farm/podcasts
  - "The Granary" -> https://www.xtremeag.farm/the-granary
  (buttons, right-hand columns)
  - "Episode Details" -> https://thebusinessofagriculture.libsyn.com/  (target="_blank")
  - "All Episodes" -> https://thebusinessofagriculture.libsyn.com/  (target="_blank")  <!-- flag: identical href to "Episode Details" -->
- **Images:** -
- **Videos:** -
- **Notes:** Row layout is 1/2 sponsor copy + 1/4 "Episode Details" button + 1/4 "All Episodes" button. Every link is force-styled `color:#ffffff` inline, so sponsor links are visually indistinguishable from surrounding body text except by underline. The sponsor `<ul>` has no bullets styled off, so it renders as a plain bulleted list. Trailing `&nbsp;` (U+00A0) after "Tidal Grow Agriscience", after "Nano-Yield", and at the very end of the "Also, make sure to check out…" paragraph. Sponsor logo art exists elsewhere in the harvest (`_source/media` has BASF, John Deere, Merck, Helena, FCS America, IPPA logos) but none of it is used here — this page is text-only sponsors. Rebuild opportunity: a real logo wall.

### 4. Listen Now — podcast platform links (set A)
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** Listen Now: (H1, bold — third H1 on the page)
- **Subheading:** -
- **Body:** -
- **List items:** -
- **CTAs:**
  (Divi social-follow row `et_pb_social_media_follow_0`; every link's visible text is the word "Follow" — the platform name lives only in `title` / the icon class. All `target="_blank"`.)
  - "Follow" (title="Follow on Youtube", class `et-social-youtube`) -> https://www.youtube.com/@DamianMasonChannel
  - "Follow" (title="Follow on Spotify", class `et-social-spotify`) -> https://open.spotify.com/show/0UDXsogtCT4uNF4CpDpUae  <!-- flag: CONFLICTING SPOTIFY SHOW ID — see Defects -->
  - "Follow" (title="Follow on iTunes", class `et-social-itunes`) -> https://podcasts.apple.com/us/podcast/the-business-of-agriculture-podcast/id1291008696
  - "Follow" (title="Follow on RSS", class `et-social-rss`) -> https://feeds.libsyn.com/504653/rss
- **Images:** -
- **Videos:** -
- **Notes:** Row is 1/2 "Listen Now:" heading + 1/2 right-aligned icon row. Icons are Divi's built-in social glyphs (no image files). Full platform inventory for the whole page: **YouTube** `https://www.youtube.com/@DamianMasonChannel`; **Spotify** (two different show IDs, see Defects); **Apple Podcasts** `https://podcasts.apple.com/us/podcast/the-business-of-agriculture-podcast/id1291008696`; **RSS / Libsyn feed** `https://feeds.libsyn.com/504653/rss`; **Libsyn show site** `https://thebusinessofagriculture.libsyn.com/`; **Libsyn embed player destination id** `4323358`. There is no Amazon Music, iHeart, Pandora, Overcast, or Pocket Casts link on the page.

### 5. Libsyn embed player
- **Type:** embed
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:** -
- **List items:** -
- **CTAs:** -
- **Images:** -
- **Videos:**
  - iframe (audio, not video): `https://play.libsyn.com/embed/destination/id/4323358/height/412/theme/modern/size/large/thumbnail/yes/custom-color/6cc441/playlist-height/200/direction/backward/download/yes/font-color/000000` — title="Embed Player", height=412, width=100%, scrolling=no, allowfullscreen
- **Notes:** Shipped through a Divi code module (`et_pb_code_0`), full-width row, `style="border: none;"`. Player accent color is `custom-color/6cc441` (green — matches the show-art green, not the site orange `#f94d1c`). `playlist-height/200`, `direction/backward`, `download/yes` (downloads enabled). Third-party iframe: it will not render in an offline/CSP-restricted rebuild.

### 6. Content-protection notice
- **Type:** copy
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  This content is protected. ©Damian Mason, all rights reserved. Not available for AI.
- **List items:** -
- **CTAs:** -
- **Images:** -
- **Videos:** -
- **Notes:** Centered, italic, white. Must be carried over verbatim to any rebuild — it is a rights statement. Note there is no space after the `©` glyph.

### 7. Testimonial
- **Type:** testimonial-grid
- **Eyebrow:** -
- **Heading:** -
- **Subheading:** -
- **Body:**
  With a mix of monologue and guest episodes, this one puts the producer at the center. Damian has strong opinions and he’s not afraid to share them. You can agree or disagree, but he clearly knows his subject matter and audience well, and is always thought-provoking. His is a valuable perspective I try to keep top-of-mind.
- **List items:** -
- **CTAs:** -
- **Images:** -
- **Videos:** -
- **Notes:** Single Divi testimonial module (`et_pb_testimonial_0`), centered, dark layout, `background-color:#000000`, `width:90%`, quote at 26px/600/italic, author at 19px/normal. Flanked above and below by `et_pb_divider` spacers. Marked `et_pb_testimonial_no_image` yet still carries `.et_pb_testimonial_portrait{width:1px!important;height:1px!important}` — a 1×1px hidden portrait slot. The `<p class="et_pb_testimonial_meta">` (title/organization) is **empty**. IMPORTANT: the author byline is present in the live HTML (`<span class="et_pb_testimonial_author">– Geoff Bastow</span>`) but is **missing from `_source/extracted/the-business-of-agriculture.txt`** — taken from the raw HTML.

### 8. Start Listening Today — about the show, platform links (set B), newsletter #2
- **Type:** cta-band
- **Eyebrow:** -
- **Heading:** Start Listening Today! (H2)
- **Subheading:** New releases every Monday. Subscribe to get notified of news and special updates. (H3, wrapped in a `<blockquote>`, right column)
- **Body:**
  Damian travels all over the globe talking to audiences about trends in the business of food, fuel, and fiber. With his clever wit and down-to-earth delivery, he has turned these topics into an interesting (and sometimes controversial) podcast.

  Find The Business Of Agriculture Podcast with Damian Mason wherever you listen to your favorite podcasts.
- **List items:** -
- **CTAs:**
  (Divi social-follow row `et_pb_social_media_follow_1` — a SECOND platform row, different order and a different Spotify URL from section 4. All `target="_blank"`, all visible text "Follow".)
  - "Follow" (title="Follow on Youtube", class `et-social-youtube`) -> https://www.youtube.com/@DamianMasonChannel
  - "Follow" (title="Follow on iTunes", class `et-social-itunes`) -> https://podcasts.apple.com/us/podcast/the-business-of-agriculture-podcast/id1291008696
  - "Follow" (title="Follow on Spotify", class `et-social-spotify`) -> https://open.spotify.com/show/5rSDDoG9qMqkSo3gp6qFDq  <!-- flag: CONFLICTING SPOTIFY SHOW ID — see Defects -->
  - "Follow" (title="Follow on RSS", class `et-social-rss`) -> https://feeds.libsyn.com/504653/rss
  - "Subscribe" -> #  <!-- flag: EMPTY HREF (second, identical newsletter form) -->
- **Images:** -
- **Videos:** -
- **Notes:** Divi `et_pb_section_1`, `et_pb_with_background` — but **no background rule is emitted for `et_pb_section_1` anywhere in the CSS**, so the "with background" class is a no-op. Columns: 2/3 (H2 + 2 paragraphs + social row) and 1/3 (blockquote H3 + newsletter form). The two body paragraphs are wrapped in leftover SoundCloud profile markup (`infoStats__description`, `truncatedUserDescription m-collapsed`, `truncatedUserDescription__wrapper`, `truncatedUserDescription__content`) plus an empty `<div class="web-profiles"><div class="sc-truncate"></div></div>` — copy was lifted from a SoundCloud artist bio. Newsletter form `et_pb_signup_1` is byte-identical to the hero form (same Mailchimp list id `6456b31ef4`, same checksum `00e011118bea84e3c5c4303c919909b2`, same hidden `<h2>Success!</h2>`).

### 9. Contact Us
- **Type:** copy
- **Eyebrow:** -
- **Heading:** Contact Us (H4)
- **Subheading:** -
- **Body:**
  damianmasonoffice@gmail.com
- **List items:** -
- **CTAs:** -
- **Images:** -
- **Videos:** -
- **Notes:** Last row of the article, `et_pb_row_8 et_pb_equal_columns`: an **empty 2/3 column** (`et_pb_column_empty`) followed by a 1/3 column holding the H4 and the address. The email is **plain text — not a `mailto:` link** (unlike the identical address in the site-wide top bar, which is linked). This is page content, inside `<article>`, before the `<footer>` marker.

## Full item inventory
- Paragraphs: 8
- Testimonials: 1
- FAQ items: 0
- Images: 2 (1 `<img>` + 1 CSS hero background; the CSS background asset is missing from the mirror)
- Videos: 0 (1 audio `<iframe>` — Libsyn embed player)
- CTAs: 19 (2 buttons + 4 sponsor links + 3 cross-promo links + 8 social "Follow" links + 2 "Subscribe" buttons)
- Forms: 2

## Defects observed on the live page
- **CONFLICTING SPOTIFY SHOW IDs — two different Spotify shows are linked from the same page.** Section 4 ("Listen Now:", `et_pb_social_media_follow_0`, network_1) links `https://open.spotify.com/show/0UDXsogtCT4uNF4CpDpUae`. Section 8 ("Start Listening Today!", `et_pb_social_media_follow_1`, network_6) links `https://open.spotify.com/show/5rSDDoG9qMqkSo3gp6qFDq`. Every other platform (YouTube, Apple `id1291008696`, RSS `504653`) is identical across both rows — only Spotify diverges. One of these is stale/wrong and must be resolved before rebuild; do not silently pick one.
- **Hero background image does not resolve in the mirror.** `https://damianmason.wpengine.com/wp-content/uploads/2023/02/Podcaster-34c.png` is referenced with `!important` in the head CSS but the file is absent from `_source/media/` (a `find` across all of `_source/` for `*odcaster*`/`*34c*` returns nothing). It is also a WP Engine **staging-domain** URL, not `damianmason.com`. Only the `#060717` background-color survives.
- Triple H1: "The Business of Agriculture Podcast", "Will the Great American Cotton Plan Save U.S. Cotton?", and "Listen Now:" are all `<h1>`. "Listen Now:" as an H1 is the worst offender.
- Hero show art is misrepresented at the filename level: `avatars-000339569153-fp12nh-t500x500.png` is actually **218×217**, not 500×500. It is a scraped SoundCloud avatar (`avatars-…-fp12nh-t500x500`), served at ~218px with only 100px and 150px thumbnails in `srcset`. Too low-res for any retina or larger rendering.
- Hero show art has `alt=""` — the podcast's own logo is hidden from screen readers, while `title` is the raw filename `avatars-000339569153-fp12nh-t500x500`.
- All 8 podcast-platform links have the identical visible/accessible name "Follow". Screen-reader users hear "Follow, Follow, Follow, Follow" twice over; the platform is only in the `title` attribute and the icon font class.
- Both newsletter "Subscribe" buttons are `<a href="#">` — anchor-only hrefs that jump to the top of the page if JS fails.
- Both newsletter `<form>` elements have no `action` attribute.
- Mailchimp list id (`6456b31ef4`), account name, and a signup checksum (`00e011118bea84e3c5c4303c919909b2`) are exposed in page source (twice).
- The exact same newsletter signup form is rendered twice on one page, with duplicate `id="et_pb_signup_email"` and duplicate `<label for="et_pb_signup_email">` — **duplicate DOM ids**, so the second label points at the first input.
- Near-duplicate subhead with inconsistent wording: hero says "New **episodes** every Monday…", the bottom column says "New **releases** every Monday…". Same promise, two phrasings.
- The bottom subhead is an `<h3>` wrapped in a `<blockquote>` — it is not a quotation; blockquote is being used purely for indent styling.
- "Episode Details" and "All Episodes" are two separate buttons pointing at the identical URL `https://thebusinessofagriculture.libsyn.com/`. One of them is meant to deep-link to the current episode and does not.
- Sponsors are plain text links with no artwork — no logo wall, no sizing, no `rel`. All four sponsor links, plus the three cross-promo links, are force-styled `color:#ffffff` inline, making them near-indistinguishable from body copy.
- Broken/nested inline markup on the sponsor lead-in: `<strong>Th<span style="color: #ffffff;">e Business of Agriculture Podcast with Damian Mason is Sponsored by:</span></strong>` — the first two characters are split out of the span (a Divi/WYSIWYG editing artifact).
- Stray non-breaking spaces (U+00A0) after "Tidal Grow Agriscience", after "Nano-Yield", inside "check out&nbsp;DamianMason.com,&nbsp;", and trailing the paragraph.
- "DamianMason.com" links to `https://www.damianmason.com/` — a self-link to the site the visitor is already on, and via the `www.` host while the canonical is non-`www` (`https://damianmason.com/the-business-of-agriculture/`). Guaranteed redirect hop.
- Testimonial has no attribution metadata: `et_pb_testimonial_meta` is empty, so "– Geoff Bastow" has no title and no organization. The byline itself is prefixed with an en dash inside the author span rather than being styled.
- Testimonial module is flagged `et_pb_testimonial_no_image` yet still emits a `1px × 1px` portrait element.
- The "Latest Episode" block is hardcoded HTML, not fed from the RSS feed — it will silently go stale. Currently pinned to the episode published around 2026-08-03.
- Massive leftover third-party markup pasted into Divi text modules: SoundCloud (`infoStats__description`, `truncatedUserDescription`, `web-profiles`, `sc-truncate`) and Libsyn/Redactor (`post_body_wrapper`, `post-body-renderer-component`, `body_text redactor-styles redactor-in`) — and the Libsyn wrapper stack is nested inside itself twice for a single paragraph.
- `et_pb_section_1` carries the class `et_pb_with_background` but no background rule is generated for it — dead class.
- Meta description is ~440 characters (og:description is the same string) — roughly 3× the length Google will render; it will be truncated mid-sentence.
- og:image `THE-BIZ-OF-AGRICULTURE-PODCAST-GRAPHIC.png` (500×500) is a different, higher-quality piece of show art than the 218×217 avatar actually displayed on the page, and it appears nowhere in the page body.
- Contact email `damianmasonoffice@gmail.com` is rendered as plain text with no `mailto:` link in the page-body Contact Us block.
- Site-wide: `<meta name="viewport" … maximum-scale=1.0, user-scalable=0>` blocks pinch-zoom; footer links resolve to `https://damianmason.wpengine.com/?page_id=…` staging URLs.
- Extraction gaps worth knowing (defects in `_source/extracted/…`, not on the live page): the testimonial byline "– Geoff Bastow" and the bottom blockquote H3 "New releases every Monday. Subscribe to get notified of news and special updates." are both absent from the extract. Both were recovered from `_source/html/the-business-of-agriculture.html`.

## Verbatim testimonials
> "With a mix of monologue and guest episodes, this one puts the producer at the center. Damian has strong opinions and he’s not afraid to share them. You can agree or disagree, but he clearly knows his subject matter and audience well, and is always thought-provoking. His is a valuable perspective I try to keep top-of-mind."
> — Geoff Bastow
> (live markup renders the byline as "– Geoff Bastow" with an en dash; no title and no organization are given — `et_pb_testimonial_meta` is empty)

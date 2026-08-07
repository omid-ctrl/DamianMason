# Global chrome — site-wide header, utility bar, and footer

Harvested verbatim from `_source/extracted/home.txt` and, where the extract was incomplete, from
`_source/html/home.html`. **Verified byte-identical on `/keynote/`** (same markup, same IDs, same hrefs).
This chrome is emitted by the Divi theme (`et_header_style_left`, `et_fixed_nav`, `et_secondary_nav_enabled`,
`et_pb_footer_columns4`) on every page of the site.

---

## Document head — items a rebuilder must carry over

- **Viewport meta (verbatim):**
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  ```
  **DEFECT:** `maximum-scale=1.0, user-scalable=0` disables pinch-zoom on every page of the site.
  This is a WCAG 2.1 SC 1.4.4 (Resize Text) failure. Do not carry it forward.

- **Favicons:**
  - `https://damianmason.com/wp-content/uploads/2022/12/cropped-favicon-32x32.jpg` (32×32)
  - `https://damianmason.com/wp-content/uploads/2022/12/cropped-favicon-192x192.jpg` (192×192)
  - Source file mirrored as `_source/media/cropped-favicon.jpg`.
  - **DEFECT:** the favicon is a **JPEG**, not a PNG/ICO/SVG — no transparency.

- **Organization `sameAs` (JSON-LD only — these social profiles exist in structured data but are NOT
  linked anywhere in the visible header or footer):**
  - https://www.facebook.com/DamianPMason
  - https://x.com/DamianPMason
  - https://www.linkedin.com/in/damianmason/
  - https://www.youtube.com/DamianMasonChannel
  - https://www.instagram.com/DamianPMason/

- **JSON-LD Organization logo:**
  `https://i0.wp.com/damianmason.com/wp-content/uploads/2023/04/LOGO-DM-BLUE-ORANGE-600px-white.jpg?fit=600%2C149&ssl=1`
  (600×149, caption "Damian Mason Keynote Speaker") — a **Jetpack/Photon CDN URL** pointing at a **`.jpg`**
  version of the wordmark that is **not** the file actually used in the header.

- **Site name / description from JSON-LD `WebSite`:**
  - name: `Damian Mason Keynote Speaker`
  - description: `The Leading Voice in Agriculture`  ← this tagline appears **nowhere in the visible chrome**.

---

## 1. Top utility bar  (`#top-header` → `.container.clearfix`)

Markup, verbatim:

```html
<div id="top-header">
  <div class="container clearfix">
    <div id="et-info">
      <span id="et-info-phone">888.304.0702</span>
      <a href="mailto:damianmasonoffice@gmail.com"><span id="et-info-email">damianmasonoffice@gmail.com</span></a>
    </div>
    <div id="et-secondary-menu">
      <a href="https://damianmason.com/cart/" class="et-cart-info">
        <span>0 Items</span>
      </a>
    </div>
  </div>
</div>
```

| Item | Verbatim label | href | Notes |
|---|---|---|---|
| Phone | `888.304.0702` | *(none)* | **Plain `<span>`, not a `tel:` link.** Not tappable on mobile. |
| Email | `damianmasonoffice@gmail.com` | `mailto:damianmasonoffice@gmail.com` | Working mailto. (Note: the `/contact-us/` page's copy of this address has a **broken** href with the `mailto:` prefix missing — see `contact-us.md`.) |
| Cart | `0 Items` | `https://damianmason.com/cart/` | WooCommerce cart counter. |

**Defects in the utility bar**
- The phone number is not a `tel:` link.
- **The cart count is hard-coded into the server-rendered HTML as `0 Items`** on every mirrored page. The
  string is templated from `var DIVI = {"item_count":"%d Item","items_count":"%d Items"};`.
- The **only** business email on the entire site is a **`@gmail.com` address** for a professional speaking
  business — no branded domain email.
- There is a live WooCommerce cart in the global chrome, but no cart icon, no price total, and no link to
  `/my-account/` or `/checkout/` anywhere in the chrome.
- No search field anywhere in the chrome, despite JSON-LD advertising a `SearchAction` at
  `https://damianmason.com/?s={search_term_string}`.

---

## 2. Header  (`<header id="main-header" data-height-onload="114">`)

### Wordmark

```html
<div class="logo_container">
  <span class="logo_helper"></span>
  <a href="https://damianmason.com/">
    <img src="https://damianmason.wpengine.com/wp-content/uploads/2023/04/LOGO-DM-BLUE-ORANGE-2000px-transparent.png"
         width="2000" height="498" alt="Damian Mason Keynote Speaker" id="logo" data-height-percentage="57" />
  </a>
</div>
```

- **Wordmark image filename:** `LOGO-DM-BLUE-ORANGE-2000px-transparent.png`
  (mirrored at `_source/media/LOGO-DM-BLUE-ORANGE-2000px-transparent.png`, **2000×498**)
- **alt:** `Damian Mason Keynote Speaker`
- **Wraps a link to:** `https://damianmason.com/`  (the anchor itself has no text — the `[LINK] "(no text)"`
  entry in the extract)
- **DEFECT:** the `src` is on the **`damianmason.wpengine.com` staging host**, and there is **no `srcset`** —
  a 2000×498 PNG is served to every device at every breakpoint for a logo rendered at ~57% of a 114px header.

### Primary nav tree  (`<nav id="top-menu-nav"> <ul id="top-menu" class="nav">`)

Every label and href, in DOM order. **Indented entries are `<ul class="sub-menu">` children.**

| # | Label (verbatim) | href | menu-item id | Flag |
|---|---|---|---|---|
| 1 | **Speaking** | **(EMPTY HREF)** | `menu-item-376` | ⚠️ **DROPDOWN PARENT WITH NO `href` ATTRIBUTE AT ALL** — the markup is literally `<a>Speaking</a>`. Not a link, not a button, not focusable, no `aria-expanded`. Keyboard and screen-reader users cannot open this menu. |
| 1a | ↳ Keynote | `https://damianmason.com/keynote/` | `menu-item-237` | |
| 1b | ↳ Testimonials | `https://damianmason.com/reviews/` | `menu-item-250` | Label says "Testimonials", URL is `/reviews/` — **label ≠ slug**. |
| 1c | ↳ Meeting Coordinators | `https://damianmason.com/meeting-coordinators/` | `menu-item-185` | |
| 1d | ↳ Collaboration Opportunities | `https://damianmason.com/collaboration-opportunities/` | `menu-item-468` | |
| 2 | The Business of Ag Success Group | `https://damianmason.com/boasg/` | `menu-item-270` | Top-level, no children. Label ≠ slug (`/boasg/`). |
| 3 | **Podcasts** | **(EMPTY HREF)** | `menu-item-377` | ⚠️ **SECOND DROPDOWN PARENT WITH NO `href`** — `<a>Podcasts</a>`. Same accessibility failure. |
| 3a | ↳ The Business of Agriculture | `https://damianmason.com/the-business-of-agriculture/` | `menu-item-122` | |
| 3b | ↳ Do Business Better | `https://damianmason.com/do-business-better-podcast/` | `menu-item-209` | |
| 3c | ↳ XtremeAg | `https://damianmason.com/xtreme-ag/` | `menu-item-265` | Label is one word "XtremeAg", slug is hyphenated `/xtreme-ag/`. |
| 4 | **Media** | **(EMPTY HREF)** | `menu-item-378` | ⚠️ **THIRD** parent with no `href` — `<a>Media</a>`. |
| 4a | ↳ Media | `https://damianmason.com/blog-news/` | `menu-item-193` | ⚠️ **The child has the SAME LABEL as its parent** ("Media" → "Media"), and its URL is `/blog-news/`. |
| 4b | ↳ Acres TV | `https://damianmason.com/acres-tv/` | `menu-item-263` | |
| 5 | Blog | `https://damianmason.com/blog/` | `menu-item-1230` | Top-level, no children. **Sits alongside `/blog-news/` under "Media" — two separate blog-ish destinations.** |
| 6 | Contact Us | `https://damianmason.com/contact-us/` | `menu-item-192` | |

> **Note on the brief's "two dropdown parents":** there are in fact **THREE** empty-href dropdown parents —
> **Speaking**, **Podcasts**, and **Media**. All three are `menu-item-type-custom menu-item-object-custom
> menu-item-has-children` and all three render as a bare `<a>` with **no `href` attribute whatsoever**
> (not `href=""`, not `href="#"` — the attribute is absent).

**Nav items NOT in the header** (pages that exist in the mirror but are unreachable from the primary nav):
`/shop/`, `/damian-mason-online-shop/`, `/cart/`, `/checkout/`, `/my-account/`, `/join-the-conversation/`,
`/join-mailing-list/`, `/speaking/`, `/podcast-2/`, and all four `product/*` pages. The shop is reachable only
from a "Shop Now" button on the home page and the cart link in the utility bar.

### Mobile nav

```html
<div id="et_mobile_nav_menu">
  <div class="mobile_nav closed">
    <span class="select_page">Select Page</span>
    <span class="mobile_menu_bar mobile_menu_bar_toggle"></span>
  </div>
</div>
```

- Trigger label is the Divi default **`Select Page`** — never customized.
- The hamburger is a `<span>` with a CSS-icon; **no `<button>`, no `aria-expanded`, no `aria-controls`,
  no accessible name.**
- `#et-top-navigation` carries `data-height="114" data-fixed-height="40"` (fixed/shrinking header).

**Header defects, consolidated**
- Three dropdown parents with **no `href` attribute** (Speaking / Podcasts / Media).
- A submenu item whose label **duplicates its parent's label** (Media → Media).
- Logo `src` on the **wpengine.com staging host**, 2000px wide, **no `srcset`**.
- The logo anchor has no accessible text of its own (relies entirely on the `<img alt>`).
- Divi default mobile label "Select Page" left in production.
- No skip-to-content link.
- Nav labels and URL slugs disagree in four places (Testimonials→/reviews/, The Business of Ag Success
  Group→/boasg/, Media→/blog-news/, XtremeAg→/xtreme-ag/).
- No search UI despite the site declaring a `SearchAction` in JSON-LD.

---

## 3. Footer  (`<footer id="main-footer">`)

Four widget columns (`et_pb_footer_columns4`), then an **empty** `#footer-bottom`.
Full verbatim markup:

```html
<footer id="main-footer">
<div class="container">
  <div id="footer-widgets" class="clearfix">

    <div class="footer-widget">
      <div id="block-5" class="fwidget et_pb_widget widget_block">
        <div class="wp-block-group is-layout-flow wp-block-group-is-layout-flow"></div>
      </div>
      <div id="block-6" class="fwidget et_pb_widget widget_block">
        <div class="wp-block-group is-layout-flow wp-block-group-is-layout-flow">
          <ul class="wp-block-list">
            <li><a href="https://damianmason.wpengine.com/?page_id=219" data-type="page" data-id="219">Keynote</a></li>
            <li><a href="https://damianmason.wpengine.com/?page_id=188" data-type="page" data-id="188">Contact Us</a></li>
            <li><a href="http://DamianMason.com" data-type="URL" data-id="DamianMason.com">Home</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-widget">
      <div id="block-9" class="fwidget et_pb_widget widget_block widget_media_image">
        <figure class="wp-block-image alignleft size-large is-resized">
          <img loading="lazy" decoding="async"
               src="https://damianmason.wpengine.com/wp-content/uploads/2023/04/LOGO-DM-WHITE-2000px-transparent-1024x255.png"
               alt="Damian Mason Logo" class="wp-image-373" width="256" height="64"/>
        </figure>
      </div>
    </div>

    <div class="footer-widget">
      <div id="block-8" class="fwidget et_pb_widget widget_block">
        <ul class="wp-block-list"></ul>
      </div>
      <div id="block-10" class="fwidget et_pb_widget widget_block">
        <blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
          <p class="wp-block-paragraph"><strong>“Thanks for your thought-provoking presentations and making sure we all think differently about our industry.</strong>"</p>
          <cite>B. Kettler, IHLA</cite>
        </blockquote>
      </div>
    </div>

    <div class="footer-widget">
      <div id="block-12" class="fwidget et_pb_widget widget_block">
        <ul class="wp-block-list">
          <li><a href="https://damianmason.wpengine.com/?page_id=115" data-type="page" data-id="115">The Business of Ag</a></li>
          <li><a href="https://damianmason.wpengine.com/?page_id=206" data-type="page" data-id="206">Do Business Better</a></li>
          <li><a href="https://damianmason.wpengine.com/?page_id=264" data-type="page" data-id="264">XtremeAg</a></li>
        </ul>
      </div>
    </div>

  </div>
</div>

<div id="footer-bottom">
  <div class="container clearfix">
  </div>
</div>
</footer>
```

### Column 1 — link list (`block-5` + `block-6`)

`block-5` is an **empty** `wp-block-group` (renders nothing).
`block-6` holds a `<ul class="wp-block-list">`:

| Label (verbatim) | href | Flag |
|---|---|---|
| Keynote | `https://damianmason.wpengine.com/?page_id=219` | ⚠️ **wpengine.com staging host + raw `?page_id=` query URL** (should be `https://damianmason.com/keynote/`) |
| Contact Us | `https://damianmason.wpengine.com/?page_id=188` | ⚠️ **wpengine.com + `?page_id=`** (should be `/contact-us/`) |
| Home | `http://DamianMason.com` | ⚠️ **`http://` not `https://`**, **mixed-case host**, **no trailing slash**, and a bare hostname rather than a site-relative link |

### Column 2 — logo widget (`block-9`)

| Asset | Detail |
|---|---|
| Filename | `LOGO-DM-WHITE-2000px-transparent-1024x255.png` |
| Full-size file in mirror | `_source/media/LOGO-DM-WHITE-2000px-transparent.png` (2000×498) — **only the full-size original was mirrored; the `-1024x255` WordPress derivative referenced by the footer is not present in `_source/media/`** |
| alt | `Damian Mason Logo` |
| Rendered size | `width="256" height="64"` (`is-resized`) |
| Host | ⚠️ `damianmason.wpengine.com` |
| Flag | ⚠️ **The footer logo is NOT a link** — it is a bare `<figure><img>` with no anchor. Clicking it does nothing. (The header logo *is* linked.) |

### Column 3 — empty list + testimonial quote (`block-8` + `block-10`)

`block-8` is an **entirely empty `<ul class="wp-block-list"></ul>`** — a list widget with zero items,
shipped to production.

`block-10` is a `<blockquote>`:

> **“Thanks for your thought-provoking presentations and making sure we all think differently about our industry.**"
> — B. Kettler, IHLA

Verbatim reproduction of the punctuation, which is broken:
- Opens with a **curly** left double-quote `“` (U+201C) **inside** the `<strong>`.
- Closes with a **straight** double-quote `"` (U+0022) **outside** the `<strong>`.
- **There is no closing curly quote**, and the `<strong>` boundary and the quotation boundary do not line up,
  so the sentence renders bold up to "industry." and then a lone un-bolded straight quote mark.
- The sentence has **no terminating period before the quote mark** other than the one inside "industry."
- Attribution is a `<cite>`: `B. Kettler, IHLA`.
- ⚠️ **This blockquote was omitted entirely by the deterministic extract** (`_source/extracted/home.txt`
  jumps from the logo image straight to column 4). Recovered from `_source/html/home.html`.

### Column 4 — link list (`block-12`)

| Label (verbatim) | href | Flag |
|---|---|---|
| The Business of Ag | `https://damianmason.wpengine.com/?page_id=115` | ⚠️ **wpengine.com + `?page_id=`** (should be `/the-business-of-agriculture/`). Label is also **shorter than the header's** label for the same page ("The Business of Agriculture"). |
| Do Business Better | `https://damianmason.wpengine.com/?page_id=206` | ⚠️ **wpengine.com + `?page_id=`** (should be `/do-business-better-podcast/`) |
| XtremeAg | `https://damianmason.wpengine.com/?page_id=264` | ⚠️ **wpengine.com + `?page_id=`** (should be `/xtreme-ag/`) |

### `#footer-bottom` — EMPTY

```html
<div id="footer-bottom">
  <div class="container clearfix">
  </div>
</div>
```

The Divi footer-bottom container renders with **nothing inside it**.

---

## What the footer is MISSING (explicit)

- ❌ **NO social icons.** There is no `<ul class="et-social-icons">`, no Facebook / X / LinkedIn / YouTube /
  Instagram links, and no social markup of any kind in the footer — even though all five profiles are declared
  in the page's JSON-LD `Organization.sameAs`. **Divi renders social icons in `#footer-bottom` by default;
  that block is empty here.**
- ❌ **NO copyright line.** No `<p id="footer-info">`, no "© 2025", no "Designed by Elegant Themes | Powered
  by WordPress", no year, no rights statement anywhere in the footer.
- ❌ **NO footer navigation menu** (`#et-footer-nav` / `.bottom-nav` is absent).
- ❌ **NO contact information in the footer** — no email, no phone, no mailing address, no booking contact.
  (The email and phone appear only in the top utility bar.)
- ❌ **NO newsletter block / no email-capture form.** There is no `<form>`, `<input>`, or `<button>` anywhere
  in the footer. The site's mailing-list signup exists only as a button on individual pages linking to
  `/join-the-conversation/`.
- ❌ **NO privacy policy, terms, accessibility statement, or cookie notice link** — notable given the site runs
  WooCommerce and collects payments.
- ❌ **NO shop / cart / my-account links** in the footer.
- ❌ **NO link to the podcast platforms** (Apple/Spotify/etc.).

## Footer defects, consolidated

1. **All six footer navigation links point at `https://damianmason.wpengine.com/?page_id=NNN`** — the
   WP Engine staging hostname *and* unrewritten `?page_id=` query URLs. They rely on a host redirect to
   resolve; they are not canonical, they leak the staging domain, and they defeat pretty permalinks.
2. **The "Home" link is `http://DamianMason.com`** — insecure scheme, mixed-case host, bare hostname.
3. **Two completely empty widgets shipped to production:** `block-5` (empty `wp-block-group`) and `block-8`
   (empty `<ul>`). Column 1 and column 3 each begin with a widget that renders nothing.
4. **`#footer-bottom` is empty** — the entire bottom bar (social + copyright, Divi's default contents)
   is blank.
5. **The footer logo is not clickable** and its `-1024x255` derivative is not in the mirror.
6. **Broken quotation punctuation** in the footer testimonial (curly open, straight close, mismatched
   `<strong>` boundary).
7. **Label drift between header and footer** for the same page: header "The Business of Agriculture" vs.
   footer "The Business of Ag".
8. **The footer testimonial is the only testimonial on the site with no page context** — "B. Kettler, IHLA"
   appears on every page including `/cart/` and `/checkout/`.
9. **No `<nav>` landmark** around either footer link list; both are bare `<ul>`s inside generic widget divs.

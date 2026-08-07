# Design system

DamianMason.com rebuild. This file is the contract. Every phase that writes markup writes against it.

- Tokens: `src/styles/tokens.css`
- Tailwind theme map and base layer: `app/globals.css`
- Primitives: `components/ui/`
- Decision record: `docs/design/DECISION.md`
- Voice: `docs/VOICE.md`

---

## 1. The direction, and why

**Editorial Broadsheet.** A warm bone paper ground, printing-ink navy, hairline rules doing structural work, a mono running-head system, and one orange that only ever appears where a decision gets made.

Three vision judges scored three directions. Directions 1 and 3 tied at 20 points. Direction 1 won the brand-fit lens 9 to 7 and the execution lens 8 to 5; direction 3 won the legibility lens 8 to 3. I broke the tie toward direction 1 and I did not override any judge.

The argument in four lines:

1. **It is the only direction that cannot be re-skinned for another client.** Its identity is biographical: an "EST. 1994, INDIANA" masthead rail, a phone number in the chrome, numbered running heads, a dateline that says "FILED FROM THE INDIANA FARM OFFICE", section metadata reading "21 of 2,400+", and a photo cutline that mentions that Damian books his own rental car and his office manager Lori handles everything after that. Direction 2's hero becomes a Series B SaaS homepage with no other edits. Direction 3's becomes a farm credit annual report.
2. **It is the only direction that never needs a reversed wordmark.** Every ground the mark touches is the bone paper it was drawn for, and the proof figures are set in the wordmark navy exactly, which reserves that navy as the color of the evidence.
3. **It wins the two things that will actually hurt this build:** 21 ragged client logos and mediocre photography. Its logo wall is 7 by 3, the only column counts that divide 21 evenly, with every mark legible. Its photography architecture puts the persuasion in the mono cutline rather than in the image, which is the only one of the three that survives a weak source.
4. **It is the only direction with a shared layout primitive and a section-head component** that transfers across all 17 routes rather than being re-authored per section.

The legibility lens was right about every one of its findings and every one is a value in a token file. All of them are fixed here, and the fixes are listed in `docs/design/DECISION.md`. The best ideas from the two runners-up were grafted in: direction 3's stat ledger, portrait treatment, orange primary button, numeric tokens and dark-scope logo math; direction 2's paper scope, orange-on-deep-only rule, heading ladder discipline and lazy loading.

---

## 2. Typefaces

Four families, all Google Fonts, all loaded with `next/font/google` in `app/layout.tsx` so nothing render-blocks from an external host.

| Token | Family | Job | Hard rule |
|---|---|---|---|
| `--family-display` | Bodoni Moda | The masthead voice. H1, and band titles only. | **Only at `--fs-4xl` (40px at 390, 60px at 1440) and above.** `font-optical-sizing: auto`, never a pinned `font-variation-settings`. |
| `--family-serif` / `--family-figure` | Source Serif 4 | Every serif job below 40px: proof figures, pull quotes, section headings, the claims checklist, article decks. | Tabular lining figures on by default. |
| `--family-body` | Archivo | Running text, UI, navigation, forms, buttons. | Body copy never drops below `--fs-base`. |
| `--family-mono` | IBM Plex Mono | The broadsheet furniture: eyebrows, running heads, folios, section numbers, stat labels, photo cutlines, form labels, datelines, button labels. | Never used for reading copy. Never below `--fs-2xs`. |

**Why the Didone has a floor.** Bodoni Moda's hairlines fall under one device pixel at 1x below about 40px. In the original comp the axis was pinned at `opsz 96` while the figures rendered at 44 to 60px, and "2,400+" rasterized as "2.100" and "40,000+" as "10.000" in the shipped screenshot. The numbers are the entire brand argument. They do not get to be the most fragile marks on the page. The `Heading` component's type signature enforces the floor: `display: true` will not typecheck with a size below `4xl`.

---

## 3. Color

### 3.1 The two fixed values

```
--brand-navy   #094D78   wordmark type
--brand-orange #FF5325   wordmark accent
```

Neither is altered anywhere. Every ramp is built outward from them.

`--palette-navy-700` **is** `#094D78`, unmodified, and it is what `--ink-brand` points at. It is the color of headlines and proof figures and of nothing else at large scale. The brand orange is never tinted, muddied or deepened when it is used as a field or a mark. Where orange must be a letterform on bone, that is a different, named token (`--ink-accent`, `#A8330E`), and the naming is the guardrail.

### 3.2 Layers

Surfaces (`--surface-*`), ink (`--ink-*`), rules (`--rule-*`), actions (`--action-*`), links, status, and fields. Components consume these and nothing else. The `--palette-*` ramps exist only as targets and must never be referenced from a component, a page, or a utility.

### 3.3 Scopes

Setting `data-surface` on any element remaps the whole semantic layer for its subtree. Use the `Section` component's `surface` prop.

| Scope | Ground | For |
|---|---|---|
| default | `#F2EBDE` bone | 15 of 17 routes |
| `sunken` | `#E8DFCE` | an alternating band on bone stock |
| `deep` | `#041826` navy | the CTA band, the podcast band, full-bleed photo bands |
| `deepest` | `#041826` with darker raised steps | the footer, sitting under a deep band |
| `paper` | `#F2EBDE` bone | a bone card or plate **inside** a deep section |

`paper` is grafted from direction 2 and it is not optional. Every route ends in a navy CTA band, several want a light card floating on navy, and without an explicit light scope that card becomes hand-written light-on-dark overrides.

---

## 4. WCAG 2.1 AA contrast table

Every pair below was computed with the WCAG 2.x relative-luminance formula. No pair ships that is not in this table.

Thresholds: **4.5:1** for text under 24px (or under 18.66px bold), **3:1** for large text, UI component boundaries and meaningful graphics (SC 1.4.11), and no floor for pure decoration or disabled controls.

### 4.1 Bone scope, ground `--surface-page` `#F2EBDE`

| Token | Value | Ratio | Verdict | Permitted use |
|---|---|---|---|---|
| `--ink-primary` | `#041826` | **15.22** | AAA | body copy, headings |
| `--ink-secondary` | `#07395A` | **10.17** | AAA | decks, secondary prose |
| `--ink-brand` | `#094D78` | **7.56** | AAA | display type, proof figures |
| `--ink-muted` | `#625A4B` | **5.74** | AA | captions, folios, labels, running heads, stat labels |
| `--ink-accent` | `#A8330E` | **5.63** | AA | orange as text, links, section numbers |
| `--ink-gold` | `#6F4E12` | **6.38** | AA | secondary property accent |
| `--ink-green` | `#2F5638` | **7.06** | AAA | success text |
| `--ink-faint` | `#6A6252` | **5.09** | AA | decorative indices, disabled text. **Never prose** |
| `--rule-structural` | `#857C69` | **3.48** | 3:1 pass | any rule that conveys structure |
| `--rule-decorative` | `#D8CDB8` | 1.33 | decoration only | ornament. Deleting it must lose nothing |
| `--ink-hot` | `#FF5325` | 2.72 | **not text here** | fields, rules, `aria-hidden` marks only |
| `--focus-ring-color` | `#A8330E` | **5.63** | 3:1 pass | focus indicator |
| `--link-ink` | `#A8330E` | **5.63** | AA | in-prose links, always underlined |

### 4.2 Bone scope, other grounds

| Pair | Ground | Ratio | Verdict |
|---|---|---|---|
| `--ink-muted` `#625A4B` | raised `#F8F3E9` | **6.16** | AA |
| `--ink-faint` `#6A6252` | raised `#F8F3E9` | **5.45** | AA |
| `--ink-faint` `#6A6252` | bright `#FDFBF7` | **5.84** | AA |
| `--rule-structural` `#857C69` | raised `#F8F3E9` | **3.73** | 3:1 pass |
| `--ink-primary` `#041826` | sunken `#E8DFCE` | **13.64** | AAA |
| `--ink-brand` `#094D78` | sunken `#E8DFCE` | **6.77** | AA |
| `--ink-muted` `#625A4B` | sunken `#E8DFCE` | **5.15** | AA |
| `--ink-accent` `#A8330E` | sunken `#E8DFCE` | **5.05** | AA |
| `--ink-faint` `#6A6252` | sunken `#E8DFCE` | **4.56** | AA |
| `--rule-structural` `#857C69` | sunken `#E8DFCE` | **3.12** | 3:1 pass |
| `--focus-ring-color` `#A8330E` | sunken `#E8DFCE` | **5.05** | 3:1 pass |
| `--ink-muted` `#625A4B` | bright `#FDFBF7` | **6.59** | AA |
| `--rule-structural` `#857C69` | bright `#FDFBF7` | **4.00** | 3:1 pass |

### 4.3 Actions, bone scope

| Pair | Ratio | Verdict |
|---|---|---|
| primary: `#041826` on `#FF5325` | **5.60** | AA |
| primary hover: `#041826` on `#F94D1C` | **5.25** | AA |
| primary active: `#041826` on `#E8511F` | **4.84** | AA |
| secondary: `#041826` on `#F2EBDE`, `#041826` outline | **15.22** | AAA |
| secondary hover: `#041826` on `#E8DFCE` | **13.64** | AAA |
| ghost: `#07395A` on `#F2EBDE` | **10.17** | AAA |
| disabled: `#857C69` on `#E8DFCE` | 3.12 | exempt (SC 1.4.3), still above 3:1 |

### 4.4 Status, bone scope

| Pair | Ratio | Verdict |
|---|---|---|
| success `#2F5638` on `#DDEADF` | **6.74** | AA |
| warning `#6F4E12` on `#F1DFB8` | **5.76** | AA |
| danger `#8E1F16` on `#F7DED8` | **6.95** | AA |
| info `#094D78` on `#D3E0E8` | **6.65** | AA |

### 4.5 Forms, bone scope, field `#FDFBF7`

| Pair | Ratio | Verdict |
|---|---|---|
| `--field-ink` `#041826` | **17.46** | AAA |
| `--field-placeholder-ink` `#625A4B` | **6.59** | AA |
| `--field-label-ink` `#07395A` on page | **10.17** | AAA |
| `--field-help-ink` `#625A4B` on page | **5.74** | AA |
| `--field-rule` `#857C69` | **4.00** | 3:1 pass |
| `--field-rule-focus` `#A8330E` | **6.46** | 3:1 pass |
| `--field-error-ink` `#8E1F16` on `#F7DED8` | **6.95** | AA |
| `--field-required-ink` `#A8330E` on page | **5.63** | AA |

### 4.6 Deep scope, ground `--surface-deep` `#041826`

| Token | Value | Ratio | Verdict |
|---|---|---|---|
| `--ink-primary` | `#F8F3E9` | **16.32** | AAA |
| `--ink-secondary` | `#D3E0E8` | **13.40** | AAA |
| `--ink-muted` | `#8FB2C7` | **8.04** | AAA |
| `--ink-faint` | `#7CA6C4` | **6.97** | AA |
| `--ink-accent` / `--ink-hot` | `#FF5325` | **5.60** | AA (the brand orange as text, legal only here) |
| `--ink-gold` | `#E0BE7A` | **10.15** | AAA |
| `--ink-green` | `#7BA98A` | **6.77** | AA |
| `--rule-structural` | `#6197B8` | **5.69** | 3:1 pass |
| `--rule-decorative` | `#07395A` | 1.50 | decoration only |
| `--focus-ring-color` | `#FF8154` | **7.32** | 3:1 pass |
| `--link-ink` | `#FF8154` | **7.32** | AA |
| selection `#041826` on `#E0BE7A` | | **10.15** | AAA |

### 4.7 Deep scope, other grounds

| Pair | Ground | Ratio | Verdict |
|---|---|---|---|
| `--ink-primary` `#F8F3E9` | deep-alt `#06283E` | **13.75** | AAA |
| `--ink-muted` `#8FB2C7` | deep-alt `#06283E` | **6.78** | AA |
| `--ink-accent` `#FF5325` | deep-alt `#06283E` | **4.72** | AA |
| `--rule-structural` `#6197B8` | deep-alt `#06283E` | **4.80** | 3:1 pass |
| `--focus-ring-color` `#FF8154` | deep-alt `#06283E` | **6.17** | 3:1 pass |
| `--ink-primary` `#F8F3E9` | deep-raised `#07395A` | **10.90** | AAA |
| `--ink-secondary` `#D3E0E8` | deep-raised `#07395A` | **8.95** | AAA |
| `--ink-muted` `#8FB2C7` | deep-raised `#07395A` | **5.37** | AA |
| `--ink-faint` `#7CA6C4` | deep-raised `#07395A` | **4.65** | AA |
| `--ink-gold` `#E0BE7A` | deep-raised `#07395A` | **6.78** | AA |
| `--ink-green` `#7BA98A` | deep-raised `#07395A` | **4.53** | AA |
| `--rule-structural` `#6197B8` | deep-raised `#07395A` | **3.80** | 3:1 pass |
| `--focus-ring-color` `#FF8154` | deep-raised `#07395A` | **4.89** | 3:1 pass |
| `#FF5325` | deep-raised `#07395A` | 3.74 | **large text and UI only. Not body text on a navy-800 card** |

### 4.8 Forms, deep scope, field `#07395A`

| Pair | Ratio | Verdict |
|---|---|---|
| `--field-ink` `#F8F3E9` | **10.90** | AAA |
| `--field-placeholder-ink` `#B7CEDD` | **7.40** | AAA |
| `--field-rule` `#6197B8` | **3.80** | 3:1 pass |
| `--field-rule-focus` `#FF8154` | **4.89** | 3:1 pass |
| `--field-error-ink` `#FFB39C` on `#041826` | **10.47** | AAA |
| `--field-error-ink` `#FFB39C` on `#07395A` | **6.99** | AA |

### 4.9 Paper scope

Identical to the bone scope by definition. Section 4.1 through 4.5 apply unchanged.

**Total pairs checked: 76.** Three pairs are documented as failing and are named, restricted and enforced rather than shipped: `#FF5325` as text on bone (2.72), `--rule-decorative` on bone (1.33) and on deep (1.50). The first is restricted to `aria-hidden` marks and to fields and rules. The other two are ornament by definition.

---

## 5. The orange discipline rule

The wordmark has two colors and the site is built so both of them still mean something.

**The budget: at most three orange elements in any one viewport, and at most one of them may be a filled field.**

Qualifying as an orange element:

- a filled `#FF5325` field of any size (a primary button, a solid band, a plate)
- an orange rule, bar or underline
- an orange letterform, glyph or mark, including the `+` in a proof figure
- an orange icon

Not counting against the budget:

- the wordmark itself, which is fixed art
- the focus ring, which is a transient state
- `--ink-accent` `#A8330E` used as link or label text. It is a deepened print orange, not the brand orange, and it is a text ink

**Where the orange goes, in priority order.** If there is only one orange element on the page, it is the primary button. Then, in order: the `+` glyphs in the stat ledger, the section-number folio, the accent rule under a masthead eyebrow, the bar on a pull quote.

**Where it never goes.** Body text on bone. Headings. Hover states on links in prose. Icon washes. Anything that is orange because orange is the brand color rather than because a decision is being asked for.

**One primary button per viewport.** Not per page: per viewport. Two orange buttons visible at once make neither of them the action.

### 5.1 The one filled field belongs to the page body, never to the pinned chrome

Resolved in phase 5. This settles the conflict phase 3 escalated and it is binding on every route.

**The rule, stated once:**

> The masthead booking control is `secondary` at every breakpoint and on every route. The single filled orange field a viewport is allowed belongs to the page's own primary action: the first action of a `Hero` or a `CTABand`, or an explicitly `primary` `Button` in the page body. `Hero` and `CTABand` keep rendering their first action as `primary` by default.

It is not conditional. The masthead does not change appearance depending on what the page under it renders.

**Why the masthead is the one that yields.** The bar is `position: sticky`, so a filled field in it is not "one orange field in the first viewport", it is one orange field in *every* viewport of *every* route, forever. It spends the entire budget before a page has said anything. Measured before the fix, all 18 routes carried two filled orange fields in at least one viewport at 1440 and at 390, and on eight of them the two fields were the same words, `Book Damian`, pointing at the same route, `/contact-us/`, one pinned above the other. That is not emphasis. It is a duplicate control competing with itself.

**Why the page body is the one that keeps it.** A meeting planner scans, and what they are scanning for is the point at which the argument stops and an action starts. That point is the close of the page, after the proof figures and the testimonials, not the chrome they scrolled past. Orange marks the place where a decision gets asked for, which is section 5's whole premise, and the chrome asks for nothing: it is always there whether or not you were about to act.

**Findability does not suffer.** The masthead control is found by position and by persistence, not by hue. It is the rightmost item in a bar that never leaves the screen, it carries the same three words on all 18 routes, and as `secondary` it is navy on bone at **15.22:1**, which is a higher contrast ratio than the orange field it replaced (5.60:1). It also lets the wordmark's own orange rule read again instead of being out-shouted by a field ten times its area two inches to the right.

**The rejected alternatives, and why.**

- *Hero and CTABand stop defaulting to `primary`, masthead keeps the orange.* Rejected. It inverts the hierarchy this system is built on: the page's revenue action ends up quieter than a navigation affordance, and every route's close becomes a hairline outline on navy. It also throws away the one ground where `#FF5325` is both legal as a large field and at its best, the deep navy `CTABand`.
- *The masthead is orange only when the page has no other primary action.* Rejected on two counts. It is architecturally fragile: in the App Router the layout renders without knowledge of the page beneath it, so this needs a hand-maintained route map that silently goes stale the first time someone adds a `Hero` action. And it is wrong even when it works, because persistent chrome that changes appearance between routes stops being learnable, which is the only thing persistent chrome is for.

**The single exception, and it is the only one.** The mobile menu sheet keeps `primary` on its `Book Damian`. The sheet is a modal that fully occludes the page, so it *is* its own viewport, and that button is the only orange field inside it. Nothing else in the chrome gets this exception.

**How to check compliance.** Count filled orange fields visible together, not per section. Walk the page in half-viewport steps at 1440 and at 390 and count elements whose computed `background-color` is `rgb(255, 83, 37)` and which measure at least 24 by 16. The ceiling is one field and three orange elements of any kind, at every scroll position, including the ones where sticky chrome overlaps a band.

---

## 6. Photography

Assume several source images are mediocre, one is a macOS screenshot, and the archive skews toward wide stage shots where Damian is 45 pixels tall. The system is built so the caption persuades and the image supports, not the other way round.

### 6.1 The rule that makes it work

**Every photograph is a `<figure>` with a cutline.** No exceptions, including the hero. The cutline is set in `--family-mono` at `--fs-2xs`, `--ink-muted`, under a `--rule-structural` hairline, capped at `--measure-narrow`. It carries a `FIG. 01` style folio where the page has more than one image.

The cutline is also one of the three standing slots the dry humor lives in, per VOICE.md trait 4. State two true things next to each other and stop. The model is already written: "On stage, 2024. Damian books his own airfare and rental car. His office manager Lori handles everything after that."

### 6.2 The duotone recipe

```
filter:            grayscale(1) contrast(1.08) brightness(1.02);   /* --photo-filter */
shadow layer:      #06283E, mix-blend-mode: multiply               /* --duotone-shadow */
highlight layer:   #F8F3E9, mix-blend-mode: screen                 /* --duotone-highlight */
```

Cool navy only. **The warm gold duotone is banned.** It turned the podium shot olive-khaki in direction 3 and looked like a faded photocopy. `--duotone-highlight` in the deep scope remaps to `#B7CEDD`, still cool.

Veil opacities are role-specific:

- `--photo-veil-opacity` `0.30` for a portrait plate. The face must read. This is the single reason direction 1 lost the meeting-planner argument and it is not repeated.
- `--photo-veil-opacity-band` `0.62` for a full-bleed band carrying reversed type over it.

### 6.3 Crops and focal points

| Role | Ratio | Focal point | Notes |
|---|---|---|---|
| Hero portrait | `--ratio-portrait` 4:5 | `--photo-focus-portrait` 50% 22% | `portrait-dark-blazer.jpg`. The meeting planner is buying a person and needs to see his face above the fold. |
| Editorial plate | `--ratio-plate` 3:2 | 50% 40% | A captioned figure lower on the page. `keynote-stage-wide.jpg` lives here, demoted from the hero. |
| Full-bleed band | `--ratio-band` 21:8, `--ratio-band-mobile` 4:3 | `--photo-focus-band` 50% 40% | Reversed type over the band. Ships with the 0.62 veil. |
| Card thumbnail | `--ratio-square` 1:1 | 50% 30% | Episode and video grids. |

### 6.4 The screenshot

`speaking-collage.png`, the Acres TV episode grid and the browser-chrome captures are screenshots, not photographs. Rules:

1. A screenshot never appears in a hero, a band, or above the fold.
2. If a screenshot is the only asset for a slot, replace the slot with a typographic treatment: a `Card` in the `ruled` variant carrying the title, a mono folio and a link. A ruled card with a real headline beats a blurry rectangle every time.
3. If a screenshot must appear as evidence, crop it to remove all browser and OS chrome, place it inside a `--surface-plate` figure with a hairline, and give it a cutline that says what it is.

### 6.5 Loading

`loading="lazy"` on every image below the fold and on all 21 logo-wall marks. Explicit `width` and `height` on every image so nothing shifts. The hero portrait is the only eager image on any page.

---

## 7. The logo wall

21 ragged client marks and 10 sponsor marks. Aspect ratios run from 1.00 (california-farm-bureau, 148 by 148) to 3.55 (usaedc, 423 by 119). Every file has an opaque white or near-white background: every JPEG by definition, and the PNGs are palette mode with white corners.

### 7.1 Normalization

```css
.logo-cell        { background: var(--logo-cell-bg);
                    border: var(--border-hairline) solid var(--logo-cell-rule);
                    min-block-size: var(--logo-cell-min-h);   /* 116px */
                    padding: var(--logo-cell-pad);            /* 16px */
                    display: grid; place-items: center; }
.logo-cell img    { max-inline-size: 100%;                    /* the guard direction 1 forgot */
                    max-block-size: var(--logo-box-h);        /* 72px */
                    inline-size: auto; block-size: auto;
                    object-fit: contain;
                    filter: var(--logo-filter);
                    mix-blend-mode: var(--logo-blend);
                    opacity: var(--logo-opacity); }
```

Both a width cap and a height cap. With only `max-height` and `width: auto`, usaedc.png computes to roughly 295px inside a 160px cell. A square mark is height-constrained at 72px, a 3.55:1 mark is width-constrained, and both land at the same optical weight.

Marks wider than 3:1 take `--logo-scale-wide` `0.86` so they do not visually dominate the row.

### 7.2 Column counts are locked

21 divides evenly by 1, 3, 7 and 21. 10 divides evenly by 1, 2, 5 and 10. Any other count leaves a ragged tail of dead cells at exactly the width a meeting planner on a laptop sees.

| Set | 1024px and up | 768 to 1023 | below 768 |
|---|---|---|---|
| Clients (21) | **7** | **3** | **3** |
| Sponsors (10) | **5** | **2** | **2** |

No 4-across, no 5-across for clients, no 3-across for sponsors.

### 7.3 The dark ground

On a deep surface the light-scope math destroys the marks: brightening a white-backed logo and then multiplying drops both the mark and its background into the navy. The deep scope therefore inverts and screens:

```
--logo-filter: grayscale(1) contrast(1.1) invert(1);
--logo-blend:  screen;
--logo-opacity: 0.72;
--logo-cell-bg: transparent;
```

This is grafted from direction 3, which was the only comp that worked the math out.

### 7.4 Indices

If the wall carries `01` through `21` corner indices, they are `--ink-faint` and `aria-hidden="true"`. They are decoration and a screen reader should read the logo's alt text, not a number.

---

## 8. Primitives

All in `components/ui/`, all server components, all typed, all forwarding `className`. None contains a hex value, an arbitrary pixel value, or an inline style.

### `Container`

Width and gutter only. `width`: `max` (1344px, default), `wide` (1536), `narrow` (896), `text` (736). `flush` removes the gutter for a child managing its own inline padding.

Use `text` for a blog post or a legal page, `narrow` for a FAQ or a single-column list, `wide` for the client wall, `max` for everything else.

### `Section`

Owns the ground and the vertical rhythm. `surface`: `page` | `sunken` | `deep` | `deepest` | `paper`, which writes `data-surface` and remaps the whole semantic layer for the subtree. `density`: `default` | `tight` | `loose` | `flush`.

Never nest two Sections with the same surface. Never write a light-on-dark color by hand: put the subtree in a `deep` Section and let the tokens do it.

### `Heading`

`level` (the semantics) and `size` (the appearance) are independent, always. `display: true` sets the Didone and is only accepted with `size` `4xl`, `5xl` or `6xl`; the type signature is the guardrail.

`folio` renders the numbered prefix ("No. 01") **inside** the heading element, so the document outline carries it. That is the corrected form of direction 1's best idea. Do not put a section number in a sibling `Eyebrow` and call the section headed.

The ladder, at 1440: H1 `6xl` 120px, hero secondary `5xl` 80px, band title `3xl` 50px, section H2 `2xl` 40px, H3 `xl` 30px, H4 `lg` 23px. No two adjacent steps are within 20% of each other. Exactly one H1 per page.

### `Eyebrow`

The mono running head, dateline, folio, section label. `tone`: `muted` (default, 5.74:1, legal as content), `accent`, `brand`, `faint` (3.89:1, decorative only, pair with `aria-hidden`).

**An Eyebrow is never a substitute for a heading.** If it is naming a section, the section still needs a real `Heading`. This is the document-outline failure that cost direction 3 its editorial section.

One of the three standing humor slots, with the photo cutline and the section metadata line.

### `Button`

Renders `<a>` when `href` is present and `<button>` otherwise. A thing that navigates is a link.

- `primary`: an orange field with navy type, 5.60:1. **One per viewport, and it belongs to the page body, never to the pinned masthead.** It goes on the action that earns money: Book Damian, Contact, Join. See section 5.1.
- `secondary`: a navy hairline outline with navy type. Everything else, including the masthead booking control.
- `ghost`: type only, for a tertiary or in-card action.

`size` `default` or `lg`. `block` fills the container, which is how a 44px target gets its width at 390. Every variant carries `min-block-size: var(--size-tap-target)` (44px) already.

### `Prose`

`measure`: `default` (66ch), `narrow` (46ch), `wide` (76ch), `full` (uncapped, only when a grid column is already doing the job). `lead` for the opening paragraph, one per page.

**There is no multi-column mode and there will not be one.** CSS multicolumn forces the reader to the bottom of column one and back to the top of column two, which is unusable past a few paragraphs and produced a 37-character measure in the original comp.

### `Card`

`variant`: `raised` (default, bone with a hairline), `bright` (the whitest surface, for logo cells and form panels), `ruled` (no box, just a 2px rule across the top, and the broadsheet default for an episode row, a press item or a list), `plate` (the ground a photograph sits on). `flush` removes padding for a full-bleed first child. `interactive` adds a hover ground, only for a card that is entirely a link.

Cards do not get shadows.

### `Rule`

`tone`: `structural` (default, clears 3:1 in every scope, for any rule that conveys information such as a table boundary, a ledger column, a section head or a list divider), `strong`, `brand`, `accent` (counts against the orange budget), `decorative` (ornament only, below 3:1 on purpose).

If deleting a rule would lose meaning, it is structural. Choosing `decorative` for a rule that carries structure is a bug.

`weight`: `hairline` | `thin` | `thick`. `length`: `full` | `short` | `medium`.

### `Stat`

The proof figure. `index` (decorative, auto `aria-hidden`), `value` (the figure only, never with the plus baked in), `plus` (renders an `aria-hidden` orange `+`, so a screen reader says "2,400" and the glyph is exempt from the text contrast floor while still meaning "more than"), `label`, `note`.

The figure is Source Serif 4 at `--fs-figure` with `tabular-nums lining-nums`, in `--ink-brand`. Never the Didone.

Under a ledger row, restate the claim in prose: "Since 1994, he has spoken to over 2,400 audiences in all 50 states and 7 foreign countries." If a glyph ever fails, the sentence still carries the argument. Set that line in the body face at `--fs-xs`, capped at `--measure-narrow`, never in mono.

### `Quote`

Fixed at `--fs-xl` (30px at 1440), exactly one step **below** a section `Heading` at `--fs-2xl` (40px). A pull quote never outranks the heading it sits under.

`attribution` is mono and uppercase. `barred` adds the orange leading bar and counts against the orange budget. `wide` relaxes the measure from 28ch to 46ch for a long testimonial.

---

## 9. Layout, motion and chrome

### The grid

`.dm-grid12` is a shared 12-column grid (6 columns below 768px). Sections place children with span utilities against it. Do not author a bespoke `grid-template-columns` per section; that is a tax paid on every one of 17 routes.

### Header, for phase 2

- The masthead rail carries `EST. 1994, INDIANA`, `THE BUSINESS OF FOOD, FUEL, AND FIBER`, and the phone number at desktop, all in `--ink-muted` at `--fs-2xs`.
- The phone number appears at **both** breakpoints. At 390 it is a 44px target inside the menu sheet.
- A persistent **Book Damian** button sits to the right of the nav, in the `secondary` variant. Because the bar is sticky, a filled orange field here would spend the whole viewport budget on every route at every scroll position, so the masthead carries **no** field-sized orange and the page's own primary action carries it instead. Section 5.1 is the binding statement of this rule; the only exception is the mobile sheet, which is a modal and therefore its own viewport.
- The wordmark sits at `--size-wordmark-w` between two hairlines. It does not reverse.

### Motion

Nothing slides in from off screen. Things resolve in place. Durations `80` / `140` / `220` / `380` / `620` ms with the four easings in tokens. `prefers-reduced-motion: reduce` collapses every duration token to 1ms and the base layer additionally clamps `transition-duration` and `animation-duration` globally.

**Only `opacity` and `transform` are ever animated.** Nothing in the motion layer can move a neighbour, so nothing in it can contribute to CLS or force a layout pass mid scroll. Measured CLS is 0 on every route at 390 and 1440.

**The scroll reveal, and the one rule it cannot break.** The implementation is `src/styles/motion.css` plus `components/motion/RevealController.tsx`, and the markup contract is two attributes: `data-reveal="fade"` on a block, or `data-reveal="stagger"` on a container whose direct children arrive one `--duration-instant` beat apart, capped at five beats. The container is what gets observed, never the cells, so a 21 mark logo wall costs one observer entry.

*Nothing is hidden by default.* No selector hides anything on its own. The hidden state is `data-reveal-state="pending"`, it is written only by the controller, and only for an element the controller has measured as sitting entirely below the fold. JavaScript off, bundle failed, `IntersectionObserver` missing, reduced motion requested, observer never reporting: every one of those paths ends with the attribute never written and the page fully visible. A reveal that hides content by default and depends on JavaScript to show it is the failure mode this design exists to make impossible. Do not invert it.

Because an element already on screen is never armed, the fold never flashes and no LCP candidate is ever left waiting on a callback.

*Reduced motion disables it, it does not shorten it.* The controller returns before arming anything, and `motion.css` carries an unlayered `prefers-reduced-motion` block that forces the final state and sets `transition-property: none` on everything the file touches. Verified in Chrome with the preference emulated: no element armed, no transform, no transition. State that happens to be expressed as a transform (the nav caret's rotate on an open panel, the skip link's parked position) survives, because that is state, not motion.

`content-visibility` is deliberately **not** used anywhere. `/about/#books` is the live redirect target for every retired commerce URL and the anchor has to land exactly, at `scroll-padding-block-start: var(--header-height)`. Nothing was worth risking that for.

### Focus

`:focus-visible` gets a 3px ring at `--focus-ring-color` with a 2px offset, in the orange family in both scopes, clearing 3:1 against every ground it can land on. Never remove the indicator, only replace it.

### Skip link

`.dm-skip-link` is rendered in `app/layout.tsx` above `{children}` and targets `#main`. Every page must have `id="main"` on its main landmark.

---

## 10. What NOT to do

1. **Do not pin `font-variation-settings`.** Especially not `"opsz"`. Use `font-optical-sizing: auto`. Pinning the 96pt Bodoni master at 44 to 60px is what rendered "2,400+" as "2.100".
2. **Do not set the Didone below `--fs-4xl`.** Use `--family-serif` for every serif job under 40px.
3. **Do not set a proof figure in the Didone at any size.** Figures are Source Serif 4, tabular, always.
4. **Do not reverse the wordmark.** `wordmark-white.png` exists in the asset library and this system does not use it. A mark inside a navy region sits on a `surface="paper"` plate.
5. **Do not use `#FF5325` as a letterform on bone.** It is 2.72:1. Use `--ink-accent` `#A8330E`, or put the type on navy.
6. **Do not exceed the orange budget.** Three orange elements per viewport, one filled field. Two primary buttons on screen at once means neither is the action. **And do not put the filled field in the sticky masthead**: it is `secondary` there, permanently, because sticky chrome spends the budget in every viewport of every route. Section 5.1.
7. **Do not use `--ink-faint` for prose.** It is for decorative indices and disabled text. Pair it with `aria-hidden` when it is an index. Phase 5 moved it from `#7E7460` to `#6A6252` so it clears 4.5:1 on every light ground: an `aria-hidden` index is still visible text to a low-vision reader, and WCAG's "pure decoration" exemption is too soft a thing to rest 90 nodes on.
8. **Do not use `--rule-decorative` for a rule that carries structure.** If deleting it would lose meaning, it is `structural`.
9. **Do not use `columns` for prose.** There is no multicolumn token and no multicolumn class.
10. **Do not put type below `--fs-2xs`.** The floor is 12px at 390 and it applies to every mono label, folio and button on the site.
11. **Do not let an `Eyebrow` do a heading's job.** A mono label above a section is not a section heading, in the outline or in the render.
12. **Do not let a pull quote outrank the heading it sits under.** `Quote` is one full step below `Heading`.
13. **Do not carry over `maximum-scale=1.0, user-scalable=0`.** The old site shipped it and it fails SC 1.4.4. `app/layout.tsx` sets `width=device-width, initial-scale=1` and nothing else.
14. **Do not reference a `--palette-*` token from a component.** Use the semantic layer.
15. **Do not write a hex value, an `rgba()`, an arbitrary pixel value, or an inline style in a component.** The Tailwind namespaces are reset, so `bg-blue-500` does not exist by construction.
16. **Do not hand-write a light-on-dark override.** Put the subtree in a `Section` with `surface="deep"`.
17. **Do not use the warm gold duotone on photography.** Cool navy only.
18. **Do not put a screenshot in a hero, a band, or above the fold.**
19. **Do not ship a logo grid at a column count that does not divide the set.** 7 or 3 for the 21 clients, 5 or 2 for the 10 sponsors.
20. **Do not put a shadow on a card, an image or a button.** Shadows exist for the nav dropdown, the mobile sheet and the sticky header, and for nothing else.
21. **Do not remove a focus indicator.** Replace it if you must.
22. **Do not write an em dash.** Not in copy, not in alt text, not in a comment. Period, comma or colon. The colon is the in-voice substitute and Damian already uses it constantly.

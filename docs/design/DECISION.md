# Design direction decision

> **Read this as a dated record, not as the current spec.** The values quoted
> below are the phase-1 resolutions as they stood at the decision, and several
> have moved since: `--ink-faint`, `--ink-muted`, `--ink-accent` and
> `--rule-structural` all shifted in the Cool Modern Ag revision, and the hero
> photograph changed again in the amplification pass. The shipped values live in
> `docs/DESIGN_SYSTEM.md` section 4 and are generated from
> `src/styles/tokens.css` by `scripts/contrast-table.mjs`. Where the two
> disagree, the generated table is the truth.


Phase 1, Damian Mason rebuild. Three directions, three vision judges, one production system.

## Scores

| Direction | Brand fit | Legibility and a11y | Execution | Total |
|---|---|---|---|---|
| 1. Editorial Broadsheet | **9** (winner) | 3 | **8** (winner) | **20** |
| 2. Keynote Stage | 4 | 7 | 7 | 18 |
| 3. Ledger and Land | 7 | **8** (winner) | 5 | **20** |

## Winner: Direction 1, Editorial Broadsheet

Directions 1 and 3 tie at 20. Direction 1 wins two of the three lenses, and the lens it lost is the one whose objections are entirely repairable in a token file. I looked at all six screenshots before deciding, and I agree with the majority.

The tiebreak, stated plainly:

1. **Direction 1 is the only one that fails the swap test.** Its identity is biographical, not decorative. The masthead rail reading "EST. 1994, INDIANA / THE BUSINESS OF FOOD, FUEL, AND FIBER / 888.304.0702", the numbered running heads, the "FILED FROM THE INDIANA FARM OFFICE" dateline, the section metadata "21 of 2,400+", and the 11px mono photo cutline about Lori none of it transfers to another client. Direction 2's hero re-skins to a Series B SaaS homepage with zero other edits. Direction 3's hero re-skins to a farm credit annual report.

2. **It is the only comp that never reverses the wordmark.** `grep -c wordmark-white` returns 0 for direction 1 and 1 for both others. The mark sits at 240px between navy hairlines as a real masthead, and the stat figures are set in #094D78 exactly, so the wordmark navy is reserved as the color of the proof points.

3. **It wins the two things that will actually hurt this build.** The logo wall is 7 columns by 3 rows, which are the only column counts that divide 21 evenly, with zero dead cells and all 21 marks legible. Direction 3 shipped 16 of 21 into cells where no mark can fill more than 44% of the height. And direction 1's photography architecture puts the persuasion in the mono cutline rather than in the image, which is the only one of the three that survives a mediocre source or a macOS screenshot.

4. **It is the only direction with a shared layout primitive** (`.grid12`, 14 span placements) and a section-head component that transfers to all 17 routes.

**The legibility lens was right about every defect and wrong about the conclusion.** Its objections to direction 1 are: `--ink-muted` at 2.72:1, `--ink-faint` at 1.75:1, `--ink-accent` at 4.32:1, a focus ring at 2.72:1, links with no working non-color cue, an H2 typographically identical to the list under it, a 37-character measure from `columns: 2`, 22 declarations at 10 to 12px, and a pinned optical-size axis destroying the numerals. Every one of those is a value in a token file or a single rule, and all of them are fixed below. Direction 3's defects are geometric and conceptual: a logo grid that cannot hold its own content, a warm duotone that turns the podium shot olive, four separate implementations of one numbered-row idea, and no humor anywhere on a page for a Second City alum.

**No judge was overridden.** The aggregate is a tie and I broke it toward the direction that two of three lenses chose.

## Grafted from the losing directions

### From direction 3 (Ledger and Land)

| Grafted | Where it lives now |
|---|---|
| The ledger stat row wholesale: text-serif figures, mono `01` to `04` indices, mono label under the figure, hairline row, and a prose restatement of the numbers below | `Stat.tsx`, `.dm-stat*` in `globals.css`, `--fs-figure` |
| Figures set in Source Serif 4, not the Didone, with the `+` glyph in brand orange and `aria-hidden` | `.dm-stat__figure` / `.dm-stat__plus` |
| The duotone navy portrait as the hero image *(2026-08-07: read this as "the wash", DESIGN_SYSTEM 6.2, which replaced the duotone.)*, plus the FIG numbering convention for captions | Photography rules in `DESIGN_SYSTEM.md`, `.dm-figure__folio` |
| The solid orange primary button with navy type, replacing direction 1's solid navy block | `--action-primary-*`, `.dm-btn--primary` |
| `--numeric-tabular` and `--numeric-proportional` as first-class tokens | tokens.css section 11, applied by default in the base layer |
| The dark-scope logo math: `grayscale(1) contrast(1.1) invert(1)` with `mix-blend-mode: screen` | `[data-surface="deep"]` logo tokens |
| `min-height: var(--size-tap-target)` on every button | `.dm-btn` |
| The mobile ledger collapse and the `--size-wordmark-*` token triple | `--size-wordmark-w`, `-compact`, `-footer` |

### From direction 2 (Keynote Stage)

| Grafted | Where it lives now |
|---|---|
| `[data-surface="paper"]`, an explicit light scope for a bone card inside a navy section | tokens.css, `Section` prop `surface="paper"` |
| The rule that brand orange is text only on deep ground, never on bone, encoded as two separately named tokens with the measured ratio in the comment | `--ink-hot` vs `--ink-accent` |
| The heading-ladder discipline: no two levels within 20%, and a pull quote deliberately set below the H2 it sits inside | `--fs-*` scale, `Quote` at `--fs-xl` vs `Heading` at `--fs-2xl` |
| Container and section modifier vocabulary | `Container` width prop, `Section` density prop |
| `loading="lazy"` on the logo wall, and byte discipline between the token file and what ships | Logo wall rules in `DESIGN_SYSTEM.md`. There is now exactly one token file and no comp mirror to drift from |
| A persistent booking action in the masthead | Header spec in `DESIGN_SYSTEM.md` for phase 2 |

### From direction 1's own losing lens

The numbered section-head pattern is kept, but implemented as a real `<h2>` carrying a mono folio prefix inside it (`Heading` `folio` prop), not as three equal-weight mono strings flanking a small centered line. The pattern was the best idea in direction 1 and the execution is what made the H2 read as a caption.

## Must-fix resolution

### Lens 1, brand fit and distinctiveness

| Must-fix | Resolution |
|---|---|
| Re-set the proof figures. The opsz 96 pin at weight 500 in #094D78 on bone sheds the comma, the plus, and the thin strokes of the 4 | Figures are set in Source Serif 4 at `--fs-figure` with `font-optical-sizing: auto`, weight 600, and `tabular-nums lining-nums`. The Didone is barred below `--fs-4xl` by the `Heading` type signature. `font-variation-settings` appears nowhere in the system |
| Replace or supplement the hero photo. Damian is a 45px figure in a 430px-tall wide shot | `portrait-dark-blazer.jpg` at 4:5 with the cool duotone *(2026-08-07: there is no duotone. The wash in DESIGN_SYSTEM 6.2 replaced it, and the home hero is now a transparent cut-out with no crop and no veil at all.)* is the hero. `keynote-stage-wide.jpg` is demoted to a captioned figure lower on the page where the mono cutline does its work |
| Give the dry humor a repeating structural slot | Three standing carriers, documented and componentized: the photo cutline (`.dm-figure__caption`, required on every photograph), the section metadata line, and the `Eyebrow` running head. The rule is written into `DESIGN_SYSTEM.md` and into the `Eyebrow` and figure component comments |
| Codify "the wordmark never reverses" as an explicit system rule | Written into tokens.css at the head of the deep scope, and into `DESIGN_SYSTEM.md` under What NOT to do. The deep scope ships no white-wordmark path. A mark inside a navy region sits on a `surface="paper"` plate |
| Give the orange one high-value solid application | The primary button is a solid `#FF5325` field with `#041826` type, 5.60:1. That is the wordmark's two colors doing a job, and it is the only field-sized orange permitted per viewport |

### Lens 2, legibility, hierarchy and accessibility

| Must-fix | Resolution |
|---|---|
| Add a skip-to-content link | `.dm-skip-link` in the base layer, rendered in `app/layout.tsx` above `{children}`, targeting `#main` |
| Fix `--ink-faint` | Now `#7E7460`, 3.89:1 on bone, 4.17 on raised, 3.49 on sunken. Clears the 3:1 non-text floor everywhere, and the token comment restricts it to decorative indices and disabled text. `Eyebrow` `tone="faint"` documents the `aria-hidden` pairing, and `Stat` sets `aria-hidden` on the index automatically |
| Fix `--ink-hot` and its wrong comment | `--ink-hot` is `#FF5325` and its comment now states the measured 2.72:1 on bone and forbids letterforms there. In `[data-surface="deep"]` it remaps to the same value at 5.60:1, where it is legal as text. The only bone-scope consumer is `.dm-stat__plus`, which is `aria-hidden` |
| Give the editorial section a real `<h2>` | `Eyebrow` carries an explicit warning that it is never a substitute for a heading, and `Heading` takes the numbered `folio` inside the heading element so the outline is correct |
| Break the display-size inversion | `Quote` is fixed at `--fs-xl` (30px at 1440). A section `Heading` is `--fs-2xl` (40px). The quote cannot outrank its heading |
| Reset the ledger footnote off mono, or cap it | `.dm-stat__note` is the body face at `--fs-xs`, capped at `--measure-narrow` (46ch) |
| Raise the hairline off 1.28:1 | Split into two named tokens. `--rule-structural` is `#857C69`, 3.48:1 on bone and 3.12:1 on sunken, and it carries every rule that conveys information. `--rule-decorative` may sit below 3:1 and is ornament only. `Rule` defaults to structural |
| Put the phone number in the header at both breakpoints | Header spec in `DESIGN_SYSTEM.md`: the masthead rail carries the phone at desktop, and the mobile sheet carries it as a 44px target, alongside a persistent orange Book Damian |

### Lens 3, execution and production readiness

| Must-fix | Resolution |
|---|---|
| Delete the `opsz` pin, set `font-optical-sizing: auto` | Done globally in the base layer for every heading, blockquote, `.dm-display` and `.dm-figure`. `font-variation-settings` is not used anywhere and is on the do-not list |
| Fix the three contrast tokens | `--ink-muted` `#625A4B` at 5.74:1, `--ink-accent` `#A8330E` at 5.63:1, `--ink-faint` `#7E7460` at 3.89:1 and barred from prose |
| Sync tokens.css to the comp | There is no comp any more and no mirror to drift from. `src/styles/tokens.css` is the single file, `app/globals.css` imports it, and every value flows into Tailwind through `@theme inline`. `--logo-blend`, `--logo-opacity` and the photo veil opacities are all declared here. `--size-wordmark-w`, `-compact` and `-footer` close the last raw-value gap |
| Add `max-width: 100%` to the logo image, lock the columns to 7 and 3 | Logo wall spec: `max-inline-size: 100%; max-block-size: var(--logo-box-h); object-fit: contain`. Responsive columns are locked to 7, then 3, then 3 for the 21 clients, and 5, then 2, then 2 for the 10 sponsors. No step leaves a ragged tail |
| Ban `columns: 2` from long-form routes and ship a single-column variant | There is no multicolumn token and no multicolumn class. `Prose` has four measures and no column mode, and the component doc says so |
| Author a form token group | tokens.css section 9: field surface, hover, disabled, ink, placeholder, rule, rule-hover, rule-focus, rule-error, label, help, error ink, error surface, required mark, height and radius. Every one is remapped in the deep scope so the form works inside the navy CTA band |
| Add `loading="lazy"` to the logo wall and every below-fold photo | Written into the logo wall and photography rules |

## What did not survive

- Direction 1's `--ink-muted #9A8E77`, `--ink-faint #BFB39C`, `--ink-accent #C63E12`, orange focus ring on bone, `columns: 2`, the 10 and 11px type steps, the solid navy primary button, and the distant hero photograph.
- Direction 2's near-black ground, the 120px grotesk hero, and the gold focus ring at 1.70:1.
- Direction 3's warm gold duotone, its logo cell geometry, its 16-of-21 logo set, and its missing section headings.


---

## Phase 7 amendment: amplification

**Dated 2026-08-07. The direction is unchanged and the bake-off is not reopened.**

The client brief asked for "a giant improvement" and the owner's read was that the
site felt underwhelming next to the Divi build it replaces. That read was correct
and the cause was specific: the direction had been executed as *austere* rather
than as *broadsheet*. Real editorial design runs enormous photography, saturated
colour fields and violent scale contrast; this build had one photograph per page
at a third of the viewport, thirteen of seventeen routes with no dark band
anywhere in the body, and one 8px fade as its entire motion vocabulary.

**What changed.**

1. **Band rhythm.** `deep-alt` was promoted from a declared-but-unused token to a
   real scope, every stat ledger moved onto it, and `Section` gained a `seam`
   prop so light bands can group into runs instead of alternating like a
   metronome. See DESIGN_SYSTEM 3.4.
2. **The cut-out hero.** A transparent studio portrait recovered from the client's
   own media library, standing on the page at 491x736 against the 4:5 plate's
   492x615, with no box, no crop and no veil. See 6.3 and `.dm-hero--cutout`.
3. **The feature grade.** `--photo-filter` is fitted to eighteen mixed sources and
   the professional frames were paying for that fit. A closed list of files now
   takes a grade instead of a correction. See 6.2.1.
4. **Six motion items**, all craft level: a masthead that acknowledges the scroll,
   a ledger that counts up, figures that wipe, a poster that brightens when you
   reach for it, a primary button that sweeps, and a nav panel that arrives
   instead of appearing. Zero new dependencies, zero `@keyframes`, and CLS still
   measured 0 on every route.

**What was rejected, and why it is written down.**

- **An orange scope.** Section 5 counts a solid field as the one filled field a
  viewport gets, and a band is thousands of times a button's area. The focus ring
  cannot survive it either: neither orange-700 nor orange-300 clears 3:1 on an
  orange ground. See rule 6.
- **A bigger H1.** `--fs-6xl-hero` is 109px against a measured 111.5px limit on
  this route's binding word. A 2% margin is not headroom, and exceeding it
  reintroduces the mid-word break the Oswald swap was made to fix. The perceived
  scale came from the photograph instead.
- **Darkening the sage band.** `--ink-faint` measures 4.58 on it against a 4.5
  floor and `--rule-structural` 3.12 against 3.0. Both are one step from failing
  the gate. The monotony was broken by adding dark bands.
- **Reversing the wordmark.** Re-examined on evidence and the rule held: the white
  file is a flat knockout with the brand's orange rule deleted from it. See
  rule 4.

# Design system

DamianMason.com rebuild. This file is the contract. Every phase that writes markup writes against it.

- Tokens: `src/styles/tokens.css`
- Tailwind theme map and base layer: `app/globals.css`
- Primitives: `components/ui/`
- Decision record: `docs/design/DECISION.md`
- Voice: `docs/VOICE.md`

---

## 1. The direction, and why

**Editorial Broadsheet.** Originally a warm bone paper ground with printing-ink navy; now a cool stone ground, two dark grounds, hairline rules doing structural work, a mono running-head system, and one orange that only ever appears where a decision gets made.

Three vision judges scored three directions. Directions 1 and 3 tied at 20 points. Direction 1 won the brand-fit lens 9 to 7 and the execution lens 8 to 5; direction 3 won the legibility lens 8 to 3. I broke the tie toward direction 1 and I did not override any judge.

The argument in four lines:

1. **It is the only direction that cannot be re-skinned for another client.** Its identity is biographical: an "EST. 1994, INDIANA" masthead rail, a phone number in the chrome, numbered running heads, a dateline that says "FILED FROM THE INDIANA FARM OFFICE", section metadata reading "21 of 2,400+", and a photo cutline that mentions that Damian books his own rental car and his office manager Lori handles everything after that. Direction 2's hero becomes a Series B SaaS homepage with no other edits. Direction 3's becomes a farm credit annual report.
2. **It is the only direction that never needs a reversed wordmark.** Every ground the mark touches is light, and the proof figures are set in the wordmark navy exactly, which reserves that navy as the color of the evidence.
3. **It wins the two things that will actually hurt this build:** 21 ragged client logos and mediocre photography. Its logo wall is 7 by 3, the only column counts that divide 21 evenly, with every mark legible. Its photography architecture puts the persuasion in the mono cutline rather than in the image, which is the only one of the three that survives a weak source.
4. **It is the only direction with a shared layout primitive and a section-head component** that transfers across all 17 routes rather than being re-authored per section.

The legibility lens was right about every one of its findings and every one is a value in a token file. All of them are fixed here, and the fixes are listed in `docs/design/DECISION.md`. The best ideas from the two runners-up were grafted in: direction 3's stat ledger, portrait treatment, orange primary button, numeric tokens and dark-scope logo math; direction 2's paper scope, orange-on-deep-only rule, heading ladder discipline and lazy loading.

---

## 2. Typefaces

Four families, all Google Fonts, all loaded with `next/font/google` in `app/layout.tsx` so nothing render-blocks from an external host.

| Token | Family | Job | Hard rule |
|---|---|---|---|
| `--family-display` | Oswald 600 | The masthead voice. A page's `h1`, and nothing else. | **`display: true` requires `level: 1`**, and a size of `3xl` or above. Both enforced by the type signature. |
| `--family-serif` / `--family-figure` | Source Serif 4 | Every serif job: proof figures, pull quotes, section headings, the claims checklist, article decks. | Tabular lining figures on by default. |
| `--family-body` | Archivo | Running text, UI, navigation, forms, buttons. | Body copy never drops below `--fs-base`. |
| `--family-mono` | IBM Plex Mono | The furniture: eyebrows, folios, section numbers, stat labels, photo cutlines, form labels, button labels. | Never used for reading copy. Never below `--fs-2xs`. |

The pairing in one line: **a condensed gothic for the masthead, a text serif for the proof, a grotesk for the reading, a mono for the machinery.** Four families on four *independent* axes of separation: display by width, serif by contrast, body by normal width, mono by rhythm.

That independence is the point, and it is why the display face is condensed. Archivo is already a grotesk, and two grotesks that look alike muddy every page. Oswald's lowercase advance is 0.441 against Archivo's 0.540 and its cap height is 0.810 against 0.686, so it separates on **width and cap height at once**. Libre Franklin was carried through the bake-off specifically to test whether weight alone would do it. It would not. See `docs/design/type/DECISION.md`.

**The rule is rank, not size.** The old rule was a size floor, written because a Didone sheds strokes below 40px. A condensed gothic has no hairlines to lose, so that reason is gone. But the floor was quietly doing a second job: keeping the masthead voice off the section-head step. So `display` now requires `level: 1`, and the size floor drops one step to `3xl` rather than vanishing, because `2xl` **is** the H2 step. `Hero` decides `isDisplay` on rank as well as size, so a level-2 band cannot become a second masthead by picking a bigger size.

**Do not set a proof figure in the display face**, and the reason is better than the one this rule used to have. It is not "the Didone's hairlines are fragile", which was an accident of one face. It is that **no condensed gothic on Google Fonts has working tabular figures**: Oswald, Big Shoulders, Anton, Libre Franklin, Antonio, Saira Condensed and Archivo Narrow all leave figures proportional even when asked for `tabular-nums`. A ledger column that does not align is not a ledger. That applies to every future display face.

**`font-optical-sizing` is not used, and never worked.** `next/font/google` only requests a non-`wght` axis if you pass `axes:`, and this app does not, so the Bodoni file that shipped had no optical-size master to drive and five `font-optical-sizing: auto` declarations were controlling nothing. Oswald has no `opsz` axis at all, so the question is closed rather than silently unanswered. If a future face has one, requesting it means `weight: 'variable'` and the full variable font: measure the byte cost before deciding.

---

## 3. Color

### 3.1 The two fixed values

```
--brand-navy   #094D78   wordmark type
--brand-orange #FF5325   wordmark accent
```

Neither is altered anywhere. Every ramp is built outward from them.

`--palette-navy-700` **is** `#094D78`, unmodified, and it is what `--ink-brand` points at. It is the color of headlines and proof figures and of nothing else at large scale. The brand orange is never tinted, muddied or deepened when it is used as a field or a mark. Where orange must be a letterform on a light ground, that is a different, named token (`--ink-accent`, `#A8330E`), and the naming is the guardrail.

### 3.2 Layers

Surfaces (`--surface-*`), ink (`--ink-*`), rules (`--rule-*`), actions (`--action-*`), links, status, and fields. Components consume these and nothing else. The `--palette-*` ramps exist only as targets and must never be referenced from a component, a page, or a utility.

### 3.3 Scopes

Setting `data-surface` on any element remaps the whole semantic layer for its subtree. Use the `Section` component's `surface` prop.

| Scope | Ground | For |
|---|---|---|
| default | `#F7F8F6` cool stone | most routes |
| `sunken` | `#E9EDE8` sage | the alternating band |
| `deep` | `#041826` navy | the closing CTA band on every route, and full-bleed photo bands |
| `deepest` | `#041826` with darker raised steps | the footer, sitting under a deep band |
| `forest` | `#12231B` green | the second dark ground |
| `paper` | `#F7F8F6` cool stone | a light card or plate **inside** a dark section |

`paper` is grafted from direction 2 and it is not optional. Every route ends in a dark CTA band, several want a light card floating on it, and without an explicit light scope that card becomes hand-written light-on-dark overrides.

**Two dark grounds, and the split carries meaning.** Before the Cool Modern Ag revision every dark band was navy, so a page's rhythm was light, light, light, navy, and on Home that meant a 21,000px scroll with two identical interruptions. The rule: **the band that talks about agriculture is green, the band that asks for the booking is navy.** So the ground still tells a reader which kind of thing they are looking at, and green does not simply become the new monotony. Two routes use it today.

`--palette-forest-*` is **luminance-matched to the navy ramp step for step, to within 4%**, which is why a whole new scope arrives carrying zero new contrast risk: every pair already measured against navy transfers unchanged. The one step deliberately not matched is the ground, which sits 72% brighter than navy-950 because a luminance-matched green ground reads as near-black and the entire point is that it reads as green.

**The wordmark never reverses, and it never sits on green.** A mark inside any dark region sits on a `surface="paper"` plate.

---

## 4. WCAG 2.1 AA contrast table

Generated. Do not hand-edit between the markers: run `node scripts/contrast-table.mjs --write`.

This section used to be 76 pairs computed by hand, under an assertion that no pair ships that
is not in the table. That is fine until the palette moves, and then it is 76 chances to write
down a number that is not what the browser will render. It is now derived from the token file
itself, per scope, and the build fails on any pair below the floor it claims. The intent lives
as `@on` annotations on the declarations in `src/styles/tokens.css`, so a token cannot be
repointed without the person doing it seeing the floor it has to clear.

<!-- CONTRAST:BEGIN -->

_This section is generated by `node scripts/contrast-table.mjs --write`. Do not hand-edit it._

Every pair below was computed with the WCAG 2.x relative-luminance formula against the
resolved token values, per scope. Thresholds: **4.5:1** for text under 24px, **3:1** for
large text, UI component boundaries and meaningful graphics (SC 1.4.11), and no floor for
pure decoration or a disabled control.

### Default scope (the page ground)

| Token | Value | Against | Ratio | Verdict |
|---|---|---|---|---|
| `--ink-primary` | `#041826` | page `#f7f8f6` | **16.94** | AAA |
| `--ink-primary` | `#041826` | sunken `#e9ede8` | **15.25** | AAA |
| `--ink-secondary` | `#07395a` | page `#f7f8f6` | **11.32** | AAA |
| `--ink-brand` | `#094d78` | page `#f7f8f6` | **8.41** | AAA |
| `--ink-brand` | `#094d78` | sunken `#e9ede8` | **7.57** | AAA |
| `--ink-muted` | `#566654` | page `#f7f8f6` | **5.76** | AA |
| `--ink-muted` | `#566654` | raised `#fafbf8` | **5.90** | AA |
| `--ink-muted` | `#566654` | bright `#fdfefc` | **6.06** | AA |
| `--ink-muted` | `#566654` | sunken `#e9ede8` | **5.18** | AA |
| `--ink-faint` | `#5f6e5c` | page `#f7f8f6` | **5.09** | AA |
| `--ink-faint` | `#5f6e5c` | raised `#fafbf8` | **5.22** | AA |
| `--ink-faint` | `#5f6e5c` | bright `#fdfefc` | **5.36** | AA |
| `--ink-faint` | `#5f6e5c` | sunken `#e9ede8` | **4.58** | AA |
| `--ink-accent` | `#a8330e` | page `#f7f8f6` | **6.27** | AA |
| `--ink-accent` | `#a8330e` | sunken `#e9ede8` | **5.64** | AA |
| `--ink-hot` | `#ff5325` | page `#f7f8f6` | **3.03** | 3:1 pass |
| `--ink-hot` | `#ff5325` | sunken `#e9ede8` | **2.72** | documented exception (the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.) |
| `--ink-gold` | `#6f4e12` | page `#f7f8f6` | **7.11** | AAA |
| `--ink-green` | `#2b5039` | page `#f7f8f6` | **8.54** | AAA |
| `--rule-structural` | `#788a73` | page `#f7f8f6` | **3.47** | 3:1 pass |
| `--rule-structural` | `#788a73` | raised `#fafbf8` | **3.56** | 3:1 pass |
| `--rule-structural` | `#788a73` | bright `#fdfefc` | **3.65** | 3:1 pass |
| `--rule-structural` | `#788a73` | sunken `#e9ede8` | **3.12** | 3:1 pass |
| `--rule-decorative` | `#d3dbd0` | page `#f7f8f6` | **1.33** | documented exception (ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.) |
| `--focus-ring-color` | `#a8330e` | page `#f7f8f6` | **6.27** | 3:1 pass |
| `--focus-ring-color` | `#a8330e` | sunken `#e9ede8` | **5.64** | 3:1 pass |
| `--focus-ring-color` | `#a8330e` | bright `#fdfefc` | **6.60** | 3:1 pass |
| `--link-ink` | `#a8330e` | page `#f7f8f6` | **6.27** | AA |
| `--link-ink` | `#a8330e` | sunken `#e9ede8` | **5.64** | AA |
| `--link-ink-hover` | `#8c2a0b` | page `#f7f8f6` | **8.04** | AAA |
| `--action-primary-ink` | `#041826` | primary button `#ff5325` | **5.60** | AA |
| `--action-primary-ink` | `#041826` | primary hover `#f94d1c` | **5.25** | AA |
| `--action-primary-ink` | `#041826` | primary active `#e8511f` | **4.84** | AA |
| `--action-secondary-ink` | `#041826` | secondary hover `#e9ede8` | **15.25** | AAA |
| `--selection-ink` | `#041826` | selection `#ffb39c` | **10.47** | AAA |
| `--status-success-ink` | `#2b5039` | status success `#dfeae1` | **7.36** | AAA |
| `--status-warning-ink` | `#6f4e12` | status warning `#f1dfb8` | **5.76** | AA |
| `--status-danger-ink` | `#8e1f16` | status danger `#f7ded8` | **6.95** | AA |
| `--status-info-ink` | `#094d78` | status info `#d3e0e8` | **6.65** | AA |
| `--field-ink` | `#041826` | field text `#fdfefc` | **17.84** | AAA |
| `--field-placeholder-ink` | `#566654` | field placeholder `#fdfefc` | **6.06** | AA |
| `--field-rule` | `#788a73` | field rule `#fdfefc` | **3.65** | 3:1 pass |
| `--field-rule-focus` | `#a8330e` | field rule, focused `#fdfefc` | **6.60** | 3:1 pass |
| `--field-error-ink` | `#8e1f16` | field error `#f7ded8` | **6.95** | AA |
| `--state-disabled-ink` | `#788a73` | disabled, exempt SC 1.4.3 `#e9ede8` | **3.12** | exempt |

### Sunken scope (the alternating band)

| Token | Value | Against | Ratio | Verdict |
|---|---|---|---|---|
| `--ink-primary` | `#041826` | page `#e9ede8` | **15.25** | AAA |
| `--ink-primary` | `#041826` | sunken `#e9ede8` | **15.25** | AAA |
| `--ink-secondary` | `#07395a` | page `#e9ede8` | **10.19** | AAA |
| `--ink-brand` | `#094d78` | page `#e9ede8` | **7.57** | AAA |
| `--ink-brand` | `#094d78` | sunken `#e9ede8` | **7.57** | AAA |
| `--ink-muted` | `#566654` | page `#e9ede8` | **5.18** | AA |
| `--ink-muted` | `#566654` | raised `#fafbf8` | **5.90** | AA |
| `--ink-muted` | `#566654` | bright `#fdfefc` | **6.06** | AA |
| `--ink-muted` | `#566654` | sunken `#e9ede8` | **5.18** | AA |
| `--ink-faint` | `#5f6e5c` | page `#e9ede8` | **4.58** | AA |
| `--ink-faint` | `#5f6e5c` | raised `#fafbf8` | **5.22** | AA |
| `--ink-faint` | `#5f6e5c` | bright `#fdfefc` | **5.36** | AA |
| `--ink-faint` | `#5f6e5c` | sunken `#e9ede8` | **4.58** | AA |
| `--ink-accent` | `#a8330e` | page `#e9ede8` | **5.64** | AA |
| `--ink-accent` | `#a8330e` | sunken `#e9ede8` | **5.64** | AA |
| `--ink-hot` | `#ff5325` | page `#e9ede8` | **2.72** | documented exception (the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.) |
| `--ink-hot` | `#ff5325` | sunken `#e9ede8` | **2.72** | documented exception (the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.) |
| `--ink-gold` | `#6f4e12` | page `#e9ede8` | **6.40** | AA |
| `--ink-green` | `#2b5039` | page `#e9ede8` | **7.68** | AAA |
| `--rule-structural` | `#788a73` | page `#e9ede8` | **3.12** | 3:1 pass |
| `--rule-structural` | `#788a73` | raised `#fafbf8` | **3.56** | 3:1 pass |
| `--rule-structural` | `#788a73` | bright `#fdfefc` | **3.65** | 3:1 pass |
| `--rule-structural` | `#788a73` | sunken `#e9ede8` | **3.12** | 3:1 pass |
| `--rule-decorative` | `#a6b6a1` | page `#e9ede8` | **1.81** | documented exception (ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.) |
| `--focus-ring-color` | `#a8330e` | page `#e9ede8` | **5.64** | 3:1 pass |
| `--focus-ring-color` | `#a8330e` | sunken `#e9ede8` | **5.64** | 3:1 pass |
| `--focus-ring-color` | `#a8330e` | bright `#fdfefc` | **6.60** | 3:1 pass |
| `--link-ink` | `#a8330e` | page `#e9ede8` | **5.64** | AA |
| `--link-ink` | `#a8330e` | sunken `#e9ede8` | **5.64** | AA |
| `--link-ink-hover` | `#8c2a0b` | page `#e9ede8` | **7.24** | AAA |
| `--action-primary-ink` | `#041826` | primary button `#ff5325` | **5.60** | AA |
| `--action-primary-ink` | `#041826` | primary hover `#f94d1c` | **5.25** | AA |
| `--action-primary-ink` | `#041826` | primary active `#e8511f` | **4.84** | AA |
| `--action-secondary-ink` | `#041826` | secondary hover `#e9ede8` | **15.25** | AAA |
| `--selection-ink` | `#041826` | selection `#ffb39c` | **10.47** | AAA |
| `--status-success-ink` | `#2b5039` | status success `#dfeae1` | **7.36** | AAA |
| `--status-warning-ink` | `#6f4e12` | status warning `#f1dfb8` | **5.76** | AA |
| `--status-danger-ink` | `#8e1f16` | status danger `#f7ded8` | **6.95** | AA |
| `--status-info-ink` | `#094d78` | status info `#d3e0e8` | **6.65** | AA |
| `--field-ink` | `#041826` | field text `#fdfefc` | **17.84** | AAA |
| `--field-placeholder-ink` | `#566654` | field placeholder `#fdfefc` | **6.06** | AA |
| `--field-rule` | `#788a73` | field rule `#fdfefc` | **3.65** | 3:1 pass |
| `--field-rule-focus` | `#a8330e` | field rule, focused `#fdfefc` | **6.60** | 3:1 pass |
| `--field-error-ink` | `#8e1f16` | field error `#f7ded8` | **6.95** | AA |
| `--state-disabled-ink` | `#788a73` | disabled, exempt SC 1.4.3 `#e9ede8` | **3.12** | exempt |

### Paper scope (a light plate inside a dark section)

| Token | Value | Against | Ratio | Verdict |
|---|---|---|---|---|
| `--ink-primary` | `#041826` | page `#f7f8f6` | **16.94** | AAA |
| `--ink-primary` | `#041826` | sunken `#e9ede8` | **15.25** | AAA |
| `--ink-secondary` | `#07395a` | page `#f7f8f6` | **11.32** | AAA |
| `--ink-brand` | `#094d78` | page `#f7f8f6` | **8.41** | AAA |
| `--ink-brand` | `#094d78` | sunken `#e9ede8` | **7.57** | AAA |
| `--ink-muted` | `#566654` | page `#f7f8f6` | **5.76** | AA |
| `--ink-muted` | `#566654` | raised `#fafbf8` | **5.90** | AA |
| `--ink-muted` | `#566654` | bright `#fdfefc` | **6.06** | AA |
| `--ink-muted` | `#566654` | sunken `#e9ede8` | **5.18** | AA |
| `--ink-faint` | `#5f6e5c` | page `#f7f8f6` | **5.09** | AA |
| `--ink-faint` | `#5f6e5c` | raised `#fafbf8` | **5.22** | AA |
| `--ink-faint` | `#5f6e5c` | bright `#fdfefc` | **5.36** | AA |
| `--ink-faint` | `#5f6e5c` | sunken `#e9ede8` | **4.58** | AA |
| `--ink-accent` | `#a8330e` | page `#f7f8f6` | **6.27** | AA |
| `--ink-accent` | `#a8330e` | sunken `#e9ede8` | **5.64** | AA |
| `--ink-hot` | `#ff5325` | page `#f7f8f6` | **3.03** | 3:1 pass |
| `--ink-hot` | `#ff5325` | sunken `#e9ede8` | **2.72** | documented exception (the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.) |
| `--ink-gold` | `#6f4e12` | page `#f7f8f6` | **7.11** | AAA |
| `--ink-green` | `#2b5039` | page `#f7f8f6` | **8.54** | AAA |
| `--rule-structural` | `#788a73` | page `#f7f8f6` | **3.47** | 3:1 pass |
| `--rule-structural` | `#788a73` | raised `#fafbf8` | **3.56** | 3:1 pass |
| `--rule-structural` | `#788a73` | bright `#fdfefc` | **3.65** | 3:1 pass |
| `--rule-structural` | `#788a73` | sunken `#e9ede8` | **3.12** | 3:1 pass |
| `--rule-decorative` | `#d3dbd0` | page `#f7f8f6` | **1.33** | documented exception (ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.) |
| `--focus-ring-color` | `#a8330e` | page `#f7f8f6` | **6.27** | 3:1 pass |
| `--focus-ring-color` | `#a8330e` | sunken `#e9ede8` | **5.64** | 3:1 pass |
| `--focus-ring-color` | `#a8330e` | bright `#fdfefc` | **6.60** | 3:1 pass |
| `--link-ink` | `#a8330e` | page `#f7f8f6` | **6.27** | AA |
| `--link-ink` | `#a8330e` | sunken `#e9ede8` | **5.64** | AA |
| `--link-ink-hover` | `#8c2a0b` | page `#f7f8f6` | **8.04** | AAA |
| `--action-primary-ink` | `#041826` | primary button `#ff5325` | **5.60** | AA |
| `--action-primary-ink` | `#041826` | primary hover `#f94d1c` | **5.25** | AA |
| `--action-primary-ink` | `#041826` | primary active `#e8511f` | **4.84** | AA |
| `--action-secondary-ink` | `#041826` | secondary hover `#e9ede8` | **15.25** | AAA |
| `--selection-ink` | `#041826` | selection `#ffb39c` | **10.47** | AAA |
| `--status-success-ink` | `#2b5039` | status success `#dfeae1` | **7.36** | AAA |
| `--status-warning-ink` | `#6f4e12` | status warning `#f1dfb8` | **5.76** | AA |
| `--status-danger-ink` | `#8e1f16` | status danger `#f7ded8` | **6.95** | AA |
| `--status-info-ink` | `#094d78` | status info `#d3e0e8` | **6.65** | AA |
| `--field-ink` | `#041826` | field text `#fdfefc` | **17.84** | AAA |
| `--field-placeholder-ink` | `#566654` | field placeholder `#fdfefc` | **6.06** | AA |
| `--field-rule` | `#788a73` | field rule `#fdfefc` | **3.65** | 3:1 pass |
| `--field-rule-focus` | `#a8330e` | field rule, focused `#fdfefc` | **6.60** | 3:1 pass |
| `--field-error-ink` | `#8e1f16` | field error `#f7ded8` | **6.95** | AA |
| `--state-disabled-ink` | `#788a73` | disabled, exempt SC 1.4.3 `#e9ede8` | **3.12** | exempt |

### Deep scope (the navy band)

| Token | Value | Against | Ratio | Verdict |
|---|---|---|---|---|
| `--ink-primary` | `#fafbf8` | page `#041826` | **17.37** | AAA |
| `--ink-primary` | `#fafbf8` | sunken `#06283e` | **14.64** | AAA |
| `--ink-secondary` | `#d3e0e8` | page `#041826` | **13.40** | AAA |
| `--ink-brand` | `#fdfefc` | page `#041826` | **17.84** | AAA |
| `--ink-brand` | `#fdfefc` | sunken `#06283e` | **15.03** | AAA |
| `--ink-muted` | `#8fb2c7` | page `#041826` | **8.04** | AAA |
| `--ink-muted` | `#8fb2c7` | raised `#06283e` | **6.78** | AA |
| `--ink-muted` | `#8fb2c7` | bright `#07395a` | **5.37** | AA |
| `--ink-muted` | `#8fb2c7` | sunken `#06283e` | **6.78** | AA |
| `--ink-faint` | `#7ca6c4` | page `#041826` | **6.97** | AA |
| `--ink-faint` | `#7ca6c4` | raised `#06283e` | **5.87** | AA |
| `--ink-faint` | `#7ca6c4` | bright `#07395a` | **4.65** | AA |
| `--ink-faint` | `#7ca6c4` | sunken `#06283e` | **5.87** | AA |
| `--ink-accent` | `#ff5325` | page `#041826` | **5.60** | AA |
| `--ink-accent` | `#ff5325` | sunken `#06283e` | **4.72** | AA |
| `--ink-hot` | `#ff5325` | page `#041826` | **5.60** | 3:1 pass |
| `--ink-hot` | `#ff5325` | sunken `#06283e` | **4.72** | 3:1 pass |
| `--ink-gold` | `#e0be7a` | page `#041826` | **10.15** | AAA |
| `--ink-green` | `#75ac8b` | page `#041826` | **6.90** | AA |
| `--rule-structural` | `#6197b8` | page `#041826` | **5.69** | 3:1 pass |
| `--rule-structural` | `#6197b8` | raised `#06283e` | **4.80** | 3:1 pass |
| `--rule-structural` | `#6197b8` | bright `#07395a` | **3.80** | 3:1 pass |
| `--rule-structural` | `#6197b8` | sunken `#06283e` | **4.80** | 3:1 pass |
| `--rule-decorative` | `#07395a` | page `#041826` | **1.50** | documented exception (ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.) |
| `--focus-ring-color` | `#ff8154` | page `#041826` | **7.32** | 3:1 pass |
| `--focus-ring-color` | `#ff8154` | sunken `#06283e` | **6.17** | 3:1 pass |
| `--focus-ring-color` | `#ff8154` | bright `#07395a` | **4.89** | 3:1 pass |
| `--link-ink` | `#ff8154` | page `#041826` | **7.32** | AAA |
| `--link-ink` | `#ff8154` | sunken `#06283e` | **6.17** | AA |
| `--link-ink-hover` | `#ffb39c` | page `#041826` | **10.47** | AAA |
| `--action-primary-ink` | `#041826` | primary button `#ff5325` | **5.60** | AA |
| `--action-primary-ink` | `#041826` | primary hover `#f94d1c` | **5.25** | AA |
| `--action-primary-ink` | `#041826` | primary active `#e8511f` | **4.84** | AA |
| `--action-secondary-ink` | `#fafbf8` | secondary hover `#07395a` | **11.61** | AAA |
| `--selection-ink` | `#041826` | selection `#e0be7a` | **10.15** | AAA |
| `--status-success-ink` | `#75ac8b` | status success `#07395a` | **4.61** | AA |
| `--status-warning-ink` | `#e0be7a` | status warning `#07395a` | **6.78** | AA |
| `--status-danger-ink` | `#ffb39c` | status danger `#07395a` | **6.99** | AA |
| `--status-info-ink` | `#b7cedd` | status info `#07395a` | **7.40** | AAA |
| `--field-ink` | `#fafbf8` | field text `#07395a` | **11.61** | AAA |
| `--field-placeholder-ink` | `#b7cedd` | field placeholder `#07395a` | **7.40** | AAA |
| `--field-rule` | `#6197b8` | field rule `#07395a` | **3.80** | 3:1 pass |
| `--field-rule-focus` | `#ff8154` | field rule, focused `#07395a` | **4.89** | 3:1 pass |
| `--field-error-ink` | `#ffb39c` | field error `#07395a` | **6.99** | AA |
| `--state-disabled-ink` | `#6197b8` | disabled, exempt SC 1.4.3 `#07395a` | **3.80** | exempt |

### Deepest scope (the footer plane)

| Token | Value | Against | Ratio | Verdict |
|---|---|---|---|---|
| `--ink-primary` | `#fafbf8` | page `#041826` | **17.37** | AAA |
| `--ink-primary` | `#fafbf8` | sunken `#06283e` | **14.64** | AAA |
| `--ink-secondary` | `#d3e0e8` | page `#041826` | **13.40** | AAA |
| `--ink-brand` | `#fdfefc` | page `#041826` | **17.84** | AAA |
| `--ink-brand` | `#fdfefc` | sunken `#06283e` | **15.03** | AAA |
| `--ink-muted` | `#8fb2c7` | page `#041826` | **8.04** | AAA |
| `--ink-muted` | `#8fb2c7` | raised `#06283e` | **6.78** | AA |
| `--ink-muted` | `#8fb2c7` | bright `#07395a` | **5.37** | AA |
| `--ink-muted` | `#8fb2c7` | sunken `#06283e` | **6.78** | AA |
| `--ink-faint` | `#7ca6c4` | page `#041826` | **6.97** | AA |
| `--ink-faint` | `#7ca6c4` | raised `#06283e` | **5.87** | AA |
| `--ink-faint` | `#7ca6c4` | bright `#07395a` | **4.65** | AA |
| `--ink-faint` | `#7ca6c4` | sunken `#06283e` | **5.87** | AA |
| `--ink-accent` | `#ff5325` | page `#041826` | **5.60** | AA |
| `--ink-accent` | `#ff5325` | sunken `#06283e` | **4.72** | AA |
| `--ink-hot` | `#ff5325` | page `#041826` | **5.60** | 3:1 pass |
| `--ink-hot` | `#ff5325` | sunken `#06283e` | **4.72** | 3:1 pass |
| `--ink-gold` | `#e0be7a` | page `#041826` | **10.15** | AAA |
| `--ink-green` | `#75ac8b` | page `#041826` | **6.90** | AA |
| `--rule-structural` | `#6197b8` | page `#041826` | **5.69** | 3:1 pass |
| `--rule-structural` | `#6197b8` | raised `#06283e` | **4.80** | 3:1 pass |
| `--rule-structural` | `#6197b8` | bright `#07395a` | **3.80** | 3:1 pass |
| `--rule-structural` | `#6197b8` | sunken `#06283e` | **4.80** | 3:1 pass |
| `--rule-decorative` | `#06283e` | page `#041826` | **1.19** | documented exception (ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.) |
| `--focus-ring-color` | `#ff8154` | page `#041826` | **7.32** | 3:1 pass |
| `--focus-ring-color` | `#ff8154` | sunken `#06283e` | **6.17** | 3:1 pass |
| `--focus-ring-color` | `#ff8154` | bright `#07395a` | **4.89** | 3:1 pass |
| `--link-ink` | `#ff8154` | page `#041826` | **7.32** | AAA |
| `--link-ink` | `#ff8154` | sunken `#06283e` | **6.17** | AA |
| `--link-ink-hover` | `#ffb39c` | page `#041826` | **10.47** | AAA |
| `--action-primary-ink` | `#041826` | primary button `#ff5325` | **5.60** | AA |
| `--action-primary-ink` | `#041826` | primary hover `#f94d1c` | **5.25** | AA |
| `--action-primary-ink` | `#041826` | primary active `#e8511f` | **4.84** | AA |
| `--action-secondary-ink` | `#fafbf8` | secondary hover `#07395a` | **11.61** | AAA |
| `--selection-ink` | `#041826` | selection `#e0be7a` | **10.15** | AAA |
| `--status-success-ink` | `#75ac8b` | status success `#07395a` | **4.61** | AA |
| `--status-warning-ink` | `#e0be7a` | status warning `#07395a` | **6.78** | AA |
| `--status-danger-ink` | `#ffb39c` | status danger `#07395a` | **6.99** | AA |
| `--status-info-ink` | `#b7cedd` | status info `#07395a` | **7.40** | AAA |
| `--field-ink` | `#fafbf8` | field text `#07395a` | **11.61** | AAA |
| `--field-placeholder-ink` | `#b7cedd` | field placeholder `#07395a` | **7.40** | AAA |
| `--field-rule` | `#6197b8` | field rule `#07395a` | **3.80** | 3:1 pass |
| `--field-rule-focus` | `#ff8154` | field rule, focused `#07395a` | **4.89** | 3:1 pass |
| `--field-error-ink` | `#ffb39c` | field error `#07395a` | **6.99** | AA |
| `--state-disabled-ink` | `#6197b8` | disabled, exempt SC 1.4.3 `#07395a` | **3.80** | exempt |

### Forest scope (the green band)

| Token | Value | Against | Ratio | Verdict |
|---|---|---|---|---|
| `--ink-primary` | `#fafbf8` | page `#12231b` | **15.77** | AAA |
| `--ink-primary` | `#fafbf8` | sunken `#15291b` | **14.81** | AAA |
| `--ink-secondary` | `#d3e2d5` | page `#12231b` | **12.18** | AAA |
| `--ink-brand` | `#fdfefc` | page `#12231b` | **16.19** | AAA |
| `--ink-brand` | `#fdfefc` | sunken `#15291b` | **15.21** | AAA |
| `--ink-muted` | `#8bb89a` | page `#12231b` | **7.35** | AAA |
| `--ink-muted` | `#8bb89a` | raised `#15291b` | **6.90** | AA |
| `--ink-muted` | `#8bb89a` | bright `#1f3c2a` | **5.42** | AA |
| `--ink-muted` | `#8bb89a` | sunken `#15291b` | **6.90** | AA |
| `--ink-faint` | `#75ac8b` | page `#12231b` | **6.26** | AA |
| `--ink-faint` | `#75ac8b` | raised `#15291b` | **5.88** | AA |
| `--ink-faint` | `#75ac8b` | bright `#1f3c2a` | **4.62** | AA |
| `--ink-faint` | `#75ac8b` | sunken `#15291b` | **5.88** | AA |
| `--ink-accent` | `#ff5325` | page `#12231b` | **5.08** | AA |
| `--ink-accent` | `#ff5325` | sunken `#15291b` | **4.77** | AA |
| `--ink-hot` | `#ff5325` | page `#12231b` | **5.08** | 3:1 pass |
| `--ink-hot` | `#ff5325` | sunken `#15291b` | **4.77** | 3:1 pass |
| `--ink-gold` | `#e0be7a` | page `#12231b` | **9.22** | AAA |
| `--ink-green` | `#fafbf8` | page `#12231b` | **15.77** | AAA |
| `--rule-structural` | `#639c7b` | page `#12231b` | **5.13** | 3:1 pass |
| `--rule-structural` | `#639c7b` | raised `#15291b` | **4.81** | 3:1 pass |
| `--rule-structural` | `#639c7b` | bright `#1f3c2a` | **3.78** | 3:1 pass |
| `--rule-structural` | `#639c7b` | sunken `#15291b` | **4.81** | 3:1 pass |
| `--rule-decorative` | `#1f3c2a` | page `#12231b` | **1.36** | documented exception (ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.) |
| `--focus-ring-color` | `#ff8154` | page `#12231b` | **6.65** | 3:1 pass |
| `--focus-ring-color` | `#ff8154` | sunken `#15291b` | **6.24** | 3:1 pass |
| `--focus-ring-color` | `#ff8154` | bright `#1f3c2a` | **4.90** | 3:1 pass |
| `--link-ink` | `#ff8154` | page `#12231b` | **6.65** | AA |
| `--link-ink` | `#ff8154` | sunken `#15291b` | **6.24** | AA |
| `--link-ink-hover` | `#ffb39c` | page `#12231b` | **9.50** | AAA |
| `--action-primary-ink` | `#041826` | primary button `#ff5325` | **5.60** | AA |
| `--action-primary-ink` | `#041826` | primary hover `#f94d1c` | **5.25** | AA |
| `--action-primary-ink` | `#041826` | primary active `#e8511f` | **4.84** | AA |
| `--action-secondary-ink` | `#fafbf8` | secondary hover `#1f3c2a` | **11.63** | AAA |
| `--selection-ink` | `#041826` | selection `#e0be7a` | **10.15** | AAA |
| `--status-success-ink` | `#d3e2d5` | status success `#1f3c2a` | **8.98** | AAA |
| `--status-warning-ink` | `#e0be7a` | status warning `#1f3c2a` | **6.80** | AA |
| `--status-danger-ink` | `#ffb39c` | status danger `#1f3c2a` | **7.01** | AAA |
| `--status-info-ink` | `#b7d1be` | status info `#1f3c2a` | **7.41** | AAA |
| `--field-ink` | `#fafbf8` | field text `#1f3c2a` | **11.63** | AAA |
| `--field-placeholder-ink` | `#b7d1be` | field placeholder `#1f3c2a` | **7.41** | AAA |
| `--field-rule` | `#639c7b` | field rule `#1f3c2a` | **3.78** | 3:1 pass |
| `--field-rule-focus` | `#ff8154` | field rule, focused `#1f3c2a` | **4.90** | 3:1 pass |
| `--field-error-ink` | `#ffb39c` | field error `#1f3c2a` | **7.01** | AAA |
| `--state-disabled-ink` | `#639c7b` | disabled, exempt SC 1.4.3 `#1f3c2a` | **3.78** | exempt |

**Total pairs checked: 270.**

10 pair(s) ship below floor on purpose, each named and restricted rather than fixed:

- `--ink-hot` on sunken at 2.72:1. the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.
- `--rule-decorative` on page at 1.33:1. ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.
- `--ink-hot` on page at 2.72:1. the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.
- `--ink-hot` on sunken at 2.72:1. the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.
- `--rule-decorative` on page at 1.81:1. ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.
- `--ink-hot` on sunken at 2.72:1. the brand orange is a field, a rule or an aria-hidden mark on a light ground, never a letterform. Legal as text only in a dark scope. DESIGN_SYSTEM 5.
- `--rule-decorative` on page at 1.33:1. ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.
- `--rule-decorative` on page at 1.50:1. ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.
- `--rule-decorative` on page at 1.19:1. ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.
- `--rule-decorative` on page at 1.36:1. ornament by definition. If deleting the rule would lose meaning it was the wrong token. DESIGN_SYSTEM 5.

<!-- CONTRAST:END -->

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

**Where it never goes.** Body text on a light ground. Headings. Hover states on links in prose. Icon washes. Anything that is orange because orange is the brand color rather than because a decision is being asked for.

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

### 6.2 The wash

**The photographs carry colour.** This was a grayscale duotone until the Cool Modern Ag revision, and on a site about agriculture that deleted the strongest signal it had. The archive is a sunflower field day, a green corn canopy, Fendt tractors on a trade show floor, a blue stage wash, and a meeting planner from a farm bureau was landing on a black-and-white literary journal.

```
filter:            saturate(0.82) contrast(1.18);        /* --photo-filter */
shadow layer:      --photo-veil-ink at 0.20, multiply    /* navy-950 */
highlight layer:   --surface-page at 0.24, screen        /* --photo-wash-highlight */
```

**It is tighter than the grayscale it replaced.** The obvious objection to colour is that mixed-quality sources stop reading as one set. Measured mean luminance spread across the placeable photographs: raw colour **2.59**, the old grayscale duotone **2.03**, this wash **1.89**. It is not a relaxation of the one-material discipline, it is a better fitted version of it.

It works because the screen and multiply pair does most of the desaturation on its own. The worst frame on the site for chroma is `keynote-stage-podium.jpg`, a magenta and blue stage wash at raw saturation P90 **0.986**; the pair alone brings it to 0.67 before `saturate()` applies at all. That leaves `saturate()` as a fine adjustment rather than the mechanism, so it can stay high enough for a green canopy and a gold sunflower to survive.

**The highlight layer points at `--surface-page`**, not a fixed value. That is what makes the sources share a white point, and it means the wash re-tunes itself whenever the ground moves: it followed the palette from bone to cool stone with nobody editing it.

Veil opacities are role-specific:

- `--photo-veil-opacity` `0.20` for a plate. The subject must read. `0.16` in a dark scope, where the ground is already doing part of the shadow layer's job.
- `--photo-veil-opacity-band` `0.62` for a full-bleed band carrying reversed type over it. **This one place stays a darkroom, and it is physics rather than taste.**

**Why the band veil cannot come down.** Reversed body copy over a colour photograph cannot reach 4.5:1 by any veil and gradient arrangement that leaves the photograph legible as colour. Computed for `--ink-primary` against a worst-case white pixel, through the veil and the hero scrim, at the position where the rightmost line of type actually sits:

| veil | x=0% | x=50% | x=75% |
|---|---|---|---|
| 0.20 | 9.59 | 2.64 | **1.58** |
| 0.40 | 11.19 | 4.07 | **2.61** |
| 0.50 | 12.05 | 5.16 | **3.47** |
| **0.62** | 13.11 | 6.95 | **5.03** |

A redesigned scrim holding 0.80 out to 62% still only reaches 3.67. So 0.62 stays and necessarily kills chroma. It costs nothing today: both band consumers on the site carry `microphones-background.jpg`, whose raw mean luminance is 9.7 of 255. There is no colour in it to lose.

**The rule that follows: if a band's photograph has colour worth seeing, the band is the wrong element.** Use `.dm-photo--band`, the standalone 21:8 plate that owns its own box and takes the plate veil, rather than a `Hero variant="band"`.

### 6.3 Crops and focal points

| Role | Ratio | Focal point | Notes |
|---|---|---|---|
| Hero portrait | `--ratio-portrait` 4:5 | `--photo-focus-portrait` 50% 22% | `portrait-dark-blazer.jpg`. The meeting planner is buying a person and needs to see his face above the fold. |
| Editorial plate | `--ratio-plate` 3:2 | 50% 40% | A captioned figure lower on the page, never a hero. |
| Full-bleed band | `--ratio-band` 21:8, `--ratio-band-mobile` 4:3 | `--photo-focus-band` 50% 40% | Reversed type over the band. Ships with the 0.62 veil. |
| Card thumbnail | `--ratio-square` 1:1 | 50% 30% | Episode and video grids. |

### 6.4 The screenshot

`speaking-collage.png`, the Acres TV episode grid and the browser-chrome captures are screenshots, not photographs. Rules:

1. A screenshot never appears in a hero, a band, or above the fold.
2. If a screenshot is the only asset for a slot, replace the slot with a typographic treatment: a `Card` in the `ruled` variant carrying the title, a mono folio and a link. A ruled card with a real headline beats a blurry rectangle every time.
3. If a screenshot must appear as evidence, crop it to remove all browser and OS chrome, place it inside a `--surface-plate` figure with a hairline, and give it a cutline that says what it is.

### 6.5 Supplied brand artwork

Photography takes the wash. **Artwork is not photography**, and until round 3 of Phase 6 this document had no clause for it, so eleven full-colour islands shipped unfiltered, most of them on near-white plates inside light sections, in a system that is otherwise two colours and a ration of orange. The gap is closed here rather than route by route, because "brand art is exempt" and "brand art takes the wash" are both defensible and only one can be true.

Artwork means the three book covers, the two podcast cover arts, the Business of Agriculture lockup, the XtremeAg and Granary marks: files somebody else drew, that a reader is meant to recognise.

1. **It keeps its colour.** The duotone recipe in 6.2 exists to make photographs one material. Running it over a partner's mark destroys the one thing the mark is on the page to do, which is be recognised. The two podcast covers survive greyscale; the two book jackets do not.
2. **On a light surface it never gets a plate of its own.** Every one of these files carries its own hard white ground, so a `--surface-bright` fill behind it produced a plate inside a plate with a visible edge where the two whites met. Give the frame a hairline and nothing else, and set `mix-blend-mode: multiply` on the image, which resolves the artwork's white to whatever surface is behind it. This is the same treatment the logo wall gives 31 white-backed marks and it is the reason that wall has no inner edges. Multiply is unconditional even where the file is a transparent PNG, because `xtreme-ag.jpg` sitting next to two transparent PNGs in the same row is exactly how one white rectangle survives a review.

   **The one exception is a mark on a deep surface**, where the marks are black letterforms and multiply against navy would erase them. There the plate is load bearing and it is a `data-surface="paper"` light plate per section 3.3, never `--surface-bright`. The Granary mark on `/xtreme-ag/` is the only placement that qualifies. A bright plate inside a page or sunken section is always the defect, never the exception.
3. **It is sized by optical area, not by its box.** Two square covers and a 2.1:1 wordmark in identical boxes read as a 1.45x mismatch. Give each mark a factor that holds `sqrt(width x height)` constant, exactly as section 7.1 does for the logo walls, and correct that factor for the mark's ink fraction where the supplied file is loosely cropped. The worked example is the three-up on `/podcasts/`.
4. **No single piece exceeds `--size-brand-art-max`, and that means every piece.** Section 5.1 rations orange to one filled field per viewport so nothing out-shouts the call to action. A 474px square of saturated yellow is several times that field's area and breaks the ration without ever using the colour. 22rem is the ceiling, and it is the ceiling for a hero cover art as much as for a credit in the corner: the rule was written and then three placements kept `--size-portrait-max` because they had been sized as if they were photographs, which put a 458px, a 426px and a 410px piece back over the line. `--size-portrait-max` is for a photograph of a person. Artwork takes `--size-brand-art-max`.

   Where two pieces of artwork share a row, cap the axis that makes them peers rather than the one the grid already caps. Two book jackets side by side and one on its own bottomed out at 176px and 350px under an inline-size cap, because inline-size was the axis the column was already deciding; `--size-jacket-h` caps the block axis instead and the two cover rows land on one baseline.
5. **The file is cleaned, not hidden.** `scripts/normalize-brand-art.mjs` trims each mark to its own ink and deletes near-transparent leftovers, including the RGB under fully transparent pixels. That last part is not cosmetic: the image optimizer emits AVIF with a lossy alpha channel and will rebuild a deleted ghost out of whatever colour the exporter left underneath it. See the header of that script.

### 6.6 Loading

`loading="lazy"` on every image below the fold and on all 21 logo-wall marks. Explicit `width` and `height` on every image so nothing shifts. The hero portrait is the only eager image on any page.

---

## 7. The logo wall

21 ragged client marks and 10 sponsor marks. Every file in `public/img/clients` and `public/img/sponsors` has an opaque **pure white** ground, which is what `mix-blend-mode: multiply` needs to make the ground disappear into the cell.

Every file is also trimmed to its own ink, by `scripts/normalize-logo-ink.mjs`, which runs at the end of `scripts/normalize-assets.mjs`. After that trim the canvas aspect ratio **is** the mark's aspect ratio, and those run from 0.86 (newfields-ag) to 6.05 (life-scientific). Before it they were the supplier's framing, and that is not the same thing: `claas.png` arrived as 168 by 148 with 27px of ink in it, so the cell gave it a full 72px box and 13px of visible mark. Measured on the live wall at 1440, ink height ran 13.1px to 72.0px on the clients and 15.6px to 69.8px on the sponsors, a 5.5x and a 4.5x spread inside cells that were the same size to the pixel. Trimmed, the same measurement is 26.6 to 67.9 and 36.0 to 67.7, and what is left is aspect ratio, which is real: a 5.6:1 logotype cannot be as tall as a square badge in a cell that is 2.2:1.

**Do not normalize a mark in CSS.** Per-logo height overrides would need hand tuning for all 31 and would have to be redone on the next logo drop. The trim is a property of the file.

Four of the 31 did not arrive that way and were fixed at the source rather than in CSS, in `GROUND_FIXES` in `scripts/normalize-assets.mjs`: `land-olakes-purina.png` had a 1px grey rule drawn down each side, `iowa-farm-bureau.jpg` sat on 244,243,241, `heads-up-plant-protectants.jpg` sat on a grey radial gradient, and `newfields-ag.jpg` was a shield cut out of a solid black square. Multiply erases white and nothing else, so each of those grounds rendered as a visible box around the mark in a wall where every neighbour vanished into the paper. **A new logo drop gets checked for this before it ships**: sample the four corners and the median of the border ring, and if either is not 255 the file needs an entry in `GROUND_FIXES`, not a per-cell override. Run against the two supplied folders that test still names exactly those four and no others, and run against the 31 files in `public/` it passes on all of them, so nothing has regressed and nothing new is hiding. The ink trim is applied after the ground fix for the same reason the fix exists: a ground that is not white is ink to a trim, and trimming to a baked-in frame would keep the frame and throw away the margin.

### 7.1 Normalization is on OPTICAL AREA, not on height

The ink trim above is the precondition, not the answer. It makes the canvas aspect equal the mark's aspect; it cannot make two marks look the same size, because a single cell cannot hand equal height AND equal width to shapes running from 0.86:1 to 6.05:1. Under a dual cap a wide wordmark hits `max-inline-size` and never reaches the height cap while a square badge fills it. Measured on the live wall at 1440 after the trim: claas 158.8 x 28.6, california-farm-bureau 72.0 x 72.0, a 2.52x height spread. At 390 it was 4.49x with claas at 17.8px, which is not legible.

**Chasing equal height is the wrong target.** Two marks read as the same size when they carry the same amount of ink, which is why a designer sets a wide wordmark wider and shorter than a square badge and the pair still look like peers. Hold the geometric mean of the rendered box constant instead: `sqrt(width x height)` is the side of the square with the same area, so equal geometric mean is equal apparent visual weight.

```css
.dm-logo-cell__img { inline-size: calc(var(--logo-optical) * var(--logo-ar-sqrt, 1));
                     block-size: auto;
                     max-inline-size: 100%;                     /* safety net */
                     max-block-size: var(--logo-box-h-compact); /* safety net */
                     object-fit: contain;
                     filter: var(--logo-filter);
                     mix-blend-mode: var(--logo-blend);
                     opacity: var(--logo-opacity); }
```

Each mark carries one number, `--logo-ar-sqrt` = `sqrt(width / height)` of its normalized canvas, generated per file into `src/styles/logo-optical.css` by `scripts/normalize-logo-ink.mjs`. Width is then `G x sqrt(a)` and height `G / sqrt(a)`, so `sqrt(w x h)` is `G` for every mark whatever its shape. `G` is `--logo-optical` (64px) below 768 and `--logo-optical-wide` (69px) from 768 up. Both are the largest value at which no mark on either wall touches either cap: 69 is bound by claas needing 162.6 of the 166.8px the client cell offers at 1440, 64 by the same mark needing 150.8 of the 157px a two-across cell offers at 390.

Measured in Chromium after the change, at 1440 / 768 / 390 on both walls:

| | client 1440 | sponsor 1440 | client 390 | sponsor 390 |
|---|---|---|---|---|
| optical spread before | 1.57x | 1.87x | 2.11x | 1.69x |
| optical spread after | **1.00x** | **1.00x** | **1.00x** | **1.00x** |
| height spread before | 2.52x | 1.73x | 4.49x | 2.89x |
| height spread after | 2.39x | 2.57x | 2.38x | 2.57x |
| smallest mark before | 28.6px | 41.5px | 17.8px | 27.7px |
| smallest mark after | 29.3px | 29.0px | 27.2px | 26.9px |

**The residual height spread is not a defect and must not be driven down.** It equals `sqrt(aspect_max / aspect_min)`, which is 2.39x for the 21 client marks and 2.57x for the 10 sponsors. It is the amount by which a 6:1 logotype is genuinely wider than it is tall. Rendering claas as tall as a square badge would give it 2.4x its correct visual weight and make it the loudest thing on the wall. **Report optical spread, not height spread.** `scripts/measure-logo-wall.mjs` measures all three in a real browser.

**Do not hand-write a per-logo override in CSS.** The factor is derived from the file's real pixel dimensions by the same script that writes those dimensions, which is why `src/styles/logo-optical.css` is generated and carries a do-not-edit banner. A hand-tuned number can drift from the file it describes; a generated one cannot.

There is no wide-mark backoff. `--logo-scale-wide` `0.86` existed because a wide FILE was usually a narrow mark inside a wide margin, and shaving 14% off stopped that margin pushing its neighbours around. Once the trim landed, a wide file means a wide mark, and those are the marks the cell already limits hardest. The backoff was subtracting from the wrong end, and it is gone.

### 7.1.1 The section head does not ride the wide container

The seven-column grid needs `Container width="wide"`; the section head does not. When the head rode along with it, every eyebrow, folio and H2 on a logo-wall section sat at x=48 while every other section on the same page sat at x=96, and on Home that jog was directly visible between "For meeting planners" and "Client roster". The head takes the standard container and only the `<ul>` goes wide.

### 7.2 Column counts are locked

21 divides evenly by 1, 3, 7 and 21. 10 divides evenly by 1, 2, 5 and 10. Any other count leaves a ragged tail of dead cells at exactly the width a meeting planner on a laptop sees.

| Set | 1024px and up | 768 to 1023 | below 768 |
|---|---|---|---|
| Clients (21) | **7** | **3** | **2** |
| Sponsors (10) | **5** | **2** | **2** |

No 4-across, no 5-across for clients, no 3-across for sponsors.

**Below 768 the client wall is two across, not three, and the exception is measured.** Three across leaves 99px of content in a cell, and at the optical target in 7.1 a 5.55:1 logotype in 99px renders 17.8px tall. Two across offers 157px and carries the same mark to 27.2px, which is what makes the wall legible on a phone. It costs four extra rows of scroll. 21 is odd, so the twenty-first cell spans both columns rather than leaving a ruled hole, which is why the "no dead cells" property above still holds.

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

`level` (the semantics) and `size` (the appearance) are independent, always. `display: true` sets the masthead face and is only accepted with `level: 1` and a `size` of `3xl` and above; the type signature is the guardrail for both.

`folio` renders the numbered prefix ("No. 01") **inside** the heading element, so the document outline carries it. That is the corrected form of direction 1's best idea. Do not put a section number in a sibling `Eyebrow` and call the section headed.

The ladder, at 1440: H1 `6xl` 120px, hero secondary `5xl` 80px, band title `3xl` 50px, section H2 `2xl` 40px, H3 `xl` 30px, H4 `lg` 23px. No two adjacent steps are within 20% of each other. Exactly one H1 per page, and after the Cool Modern Ag revision that is enforced rather than asserted: `display: true` requires `level: 1`.

A hero H1 does not take `6xl` directly. `--fs-6xl-hero` rebinds it to **83 to 109px** inside `.dm-hero__type` from 1024 up, because the hero type track is 7 of 12 columns rather than the full measure. That ramp is **fitted by measurement, not chosen**: `scripts/_type-fit-tmp.mjs` walks every route at six widths and reports the size at which each H1's widest single token would exactly fill its track, and the binding case at every width is the home page's `Straight-Forward`. Re-derive it after any change to the display face; do not scale it.

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

`variant`: `raised` (default, a light ground with a hairline), `bright` (the whitest surface, for logo cells and form panels), `ruled` (no box, just a 2px rule across the top, and the broadsheet default for an episode row, a press item or a list), `plate` (the ground a photograph sits on). `flush` removes padding for a full-bleed first child. `interactive` adds a hover ground, only for a card that is entirely a link.

Cards do not get shadows.

### `Rule`

`tone`: `structural` (default, clears 3:1 in every scope, for any rule that conveys information such as a table boundary, a ledger column, a section head or a list divider), `strong`, `brand`, `accent` (counts against the orange budget), `decorative` (ornament only, below 3:1 on purpose).

If deleting a rule would lose meaning, it is structural. Choosing `decorative` for a rule that carries structure is a bug.

`weight`: `hairline` | `thin` | `thick`. `length`: `full` | `short` | `medium`.

### `Stat`

The proof figure. `index` (decorative, auto `aria-hidden`), `value` (the figure only, never with the plus baked in), `plus` (renders an `aria-hidden` orange `+`, so a screen reader says "2,400" and the glyph is exempt from the text contrast floor while still meaning "more than"), `label`, `note`.

The figure is Source Serif 4 at `--fs-figure` with `tabular-nums lining-nums`, in `--ink-brand`. Never the display face: no condensed gothic has tabular figures.

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

1. **Do not pin `font-variation-settings`.** Especially not `"opsz"`. And do not assume an axis is live because a declaration mentions it: `next/font/google` requests no axis beyond `wght` unless you pass `axes:`, so for the whole life of the previous face `font-optical-sizing: auto` was controlling a master that was not in the file. If a future display face has an `opsz` axis and you want it, requesting it forces `weight: 'variable'` and the full variable font. Measure the byte cost first.
2. **Do not set the display face below `--fs-3xl`, and never on anything but a page's `h1`.** `2xl` is the section H2 step, and the masthead voice reaching it flattens the ladder. The type signature enforces both: `display: true` requires `level: 1`.
3. **Do not set a proof figure in the display face at any size.** Figures are Source Serif 4, tabular, always. The reason is not that any one face is fragile: **no condensed gothic on Google Fonts has working tabular figures**, so a ledger column set in one does not align, and a ledger column that does not align is not a ledger.
4. **Do not reverse the wordmark, and do not put it on green.** `wordmark-white.png` exists in the asset library and this system does not use it. A mark inside any dark region, navy or forest, sits on a `surface="paper"` plate.
5. **Do not use `#FF5325` as a letterform on a light ground.** It measures 3.19 on `bright`, 3.10 on `raised`, 3.03 on `page` and 2.72 on the sage band, so it clears the 3:1 non-text floor on the page but nothing clears 4.5:1. Use `--ink-accent` `#A8330E` (6.27 on the page), or put the type on a dark ground, where the brand orange is legal as text. Note the restriction names a **ground**, not a scope: 37 Sections use `sunken`, where it is still 2.72.
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
17. **Do not put a photograph with colour worth seeing behind reversed type.** The band veil is 0.62 because nothing lower reaches 4.5:1, and 0.62 kills chroma. Use `.dm-photo--band`, the standalone plate, instead of a `Hero variant="band"`. Superseded the old "cool navy duotone only" rule, which the wash in section 6.2 replaced.
18. **Do not put a screenshot in a hero, a band, or above the fold.**
19. **Do not ship a logo grid at a column count that does not divide the set.** 7 or 3 for the 21 clients, 5 or 2 for the 10 sponsors.
20. **Do not put a shadow on a card, an image or a button.** Shadows exist for the nav dropdown, the mobile sheet and the sticky header, and for nothing else.
21. **Do not remove a focus indicator.** Replace it if you must.
22. **Do not write an em dash.** Not in copy, not in alt text, not in a comment. Period, comma or colon. The colon is the in-voice substitute and Damian already uses it constantly.

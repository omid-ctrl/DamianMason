# Pre-revision baseline

Captured against a production build (`npm run build && npx next start -p 3200`) immediately before
the Cool Modern Ag revision. Everything here is the bar the revision has to hold, and the two
numbers that are *supposed* to move are marked.

Measured 2026-08-07, at commit `8fc0b41`.

## Accessibility

| Check | Result |
|---|---|
| `scripts/a11y.mjs`, 18 routes x 1440 and 390 | **0 violations** |
| `scripts/orange-check.mjs`, 1440 | **0 routes over budget** |

Raw: `docs/qa/a11y-baseline.json`.

## Layout

`scripts/shoot.mjs --widths 320,390,768,1440 --dpr 1`, 72 shots, `docs/qa/screenshots/baseline/`.

| Check | Result |
|---|---|
| `horizontalOverflow` across all 72 shots | **0** |

Note this is the **first 1x capture in the project's history**. Every previous screenshot was taken
at `deviceScaleFactor: 2`, which is exactly the density at which a hairline falling under one device
pixel still has two to land on. The defect that set the display face's 40px floor has never been
photographed.

## Headings: 7 breaks, and they are the point

`scripts/hyph.mjs`, five widths from 1024 to 1440. Raw: `docs/qa/hyph-baseline.txt`.

```
1024 /  H1 BREAKS: "Straight-Forward"
1200 /  H1 BREAKS: "Straight-Forward"
1280 /  H1 BREAKS: "Straight-Forward"
1380 /  H1 BREAKS: "Straight-Forward"
1440 /  H1 BREAKS: "Straight-Forward"
1380 /meeting-coordinators/  H2 BREAKS: "Co-Creation,"
1440 /meeting-coordinators/  H2 BREAKS: "Co-Creation,"
```

**The home page's flagship H1 breaks mid-word at every width it was measured at.** This is the
defect `app/page.tsx:143` records as "KNOWN, MEASURED, AND NOT FIXABLE HERE": `--fs-6xl-hero` was
fitted to `Coordinators` rather than to `Straight-Forward`, because Bodoni Moda cannot fit the
flagship word in a 7-of-12 column track at any size the ladder permits.

It is not unfixable. It is unfixable *in that face*. This is the number the display swap exists to
move, and **zero breaks is the gate** on the new one.

## Font budget

Five preloaded woff2 files, **128.7 KB**:

| Family | KB |
|---|---|
| Source Serif 4, roman 400/600/700 | 49.7 |
| Archivo 400/500/600/700 | 34.1 |
| Bodoni Moda 400/500/600 | 25.2 |
| IBM Plex Mono 400 | 9.8 |
| IBM Plex Mono 500 | 9.8 |

Two observations worth carrying into the swap. Source Serif is 39% of the budget on its own and
requests a `700` weight that no rule consumes. IBM Plex Mono preloads **twice**, because it is a
static-only family and two weights means two files, while `--weight-regular` appears in exactly one
mono rule. Neither is in scope here; both are the cheapest bytes on the table afterwards.

## Contrast

`scripts/contrast-table.mjs`: **225 pairs, 11 documented exceptions, exit 0**, reproducing the
hand-computed table in `docs/DESIGN_SYSTEM.md` section 4 exactly in every scope.

## What is allowed to change

Everything above holds except:

1. **The 7 heading breaks go to 0.** That is the gate on the new display face.
2. **The font budget drops.** Bodoni Moda's 25.2 KB is the line item being replaced.

Everything else is a regression if it moves.

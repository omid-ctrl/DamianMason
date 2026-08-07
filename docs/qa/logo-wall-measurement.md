# Client logo wall, measured rendered ink heights

Measured by the orchestrator directly in Chromium after scrolling the wall into view and letting the
reveal stagger settle, so these are the heights a visitor actually sees. Not file dimensions.

Taken AFTER `scripts/normalize-logo-ink.mjs` ran in Phase 6 round 3.

## Desktop, 1440px viewport, 21 cells

min 29 (CLAAS) · max 72 · **spread 2.48x** · median 56

Down from the ~5x spread round 1 measured, so the ink trim helped. Not yet uniform.

## Mobile, 390px viewport, 21 cells

min 18 (CLAAS) · max 80 · **spread 4.44x** · median 35

At the small end: CLAAS 18, Compeer Financial 20, Land O'Lakes Purina 22, USAEDC 22.
At the large end: California Farm Bureau 80, Egg Farmers 80, Pioneer Seeds 80, North Dakota Grain Dealers 79.

CLAAS at 18px on a phone is not legible.

## Why trimming ink was necessary but not sufficient

Trimming dead margin equalizes the ink box. It does not equalize APPARENT SIZE, because the marks have very
different aspect ratios and a single cell cannot give equal height and equal width at once:

- A wide wordmark (CLAAS, Compeer, USAEDC, Land O'Lakes) hits the cell's `max-width` first, so its height
  lands far below the cap.
- A square or tall badge (Egg Farmers, California Farm Bureau, Pioneer) hits `max-height` first and fills it.

So height alone is the wrong target. The fix is to normalize on OPTICAL AREA: give each mark a scale factor
that makes its rendered area comparable, letting wide marks run wider and tall marks stay shorter, bounded by
the cell. Designers do this by eye; it can be approximated well by targeting a constant sqrt(width x height)
per mark, then clamping to the cell.

This is the remaining work on the one item the client asked for most concretely: "update client logos with
logos in folder". A wall where CLAAS renders at 18px next to an 80px badge does not read as a peer set.

---

# AFTER: optical-area normalization, Phase 6 round 3 fix pass

Same harness, same browser, same two viewports, plus 768. The measurement is now reproducible rather than
hand-run: `node scripts/measure-logo-wall.mjs --widths 1440,768,390`, which scrolls each wall into view, waits
for every mark to decode, and reports three spreads per wall.

The normalization target changed. Each mark now carries `sqrt(width / height)` of its own normalized canvas,
generated per file into `src/styles/logo-optical.css` by `scripts/normalize-logo-ink.mjs`, and the wall sets

    inline-size: calc(var(--logo-optical) * var(--logo-ar-sqrt))

with `block-size: auto`. Width is `G x sqrt(a)` and height `G / sqrt(a)`, so `sqrt(w x h)` lands on `G` for
every mark whatever its shape. `G` is 69px from 768 up and 64px below it. Nothing clamps at those values: the
cell caps are now a safety net rather than the sizing mechanism.

## What moved

| | client 1440 | sponsor 1440 | client 768 | sponsor 768 | client 390 | sponsor 390 |
|---|---|---|---|---|---|---|
| **OPTICAL spread before** | 1.57x | 1.87x | n/a | n/a | 2.11x | 1.69x |
| **OPTICAL spread after** | **1.00x** | **1.00x** | **1.00x** | **1.00x** | **1.00x** | **1.00x** |
| height spread before | 2.52x | 1.73x | n/a | n/a | 4.49x | 2.89x |
| height spread after | 2.39x | 2.57x | 2.38x | 2.57x | 2.38x | 2.57x |
| smallest mark before | 28.6px | 41.5px | n/a | n/a | 17.8px | 27.7px |
| smallest mark after | 29.3px | 29.0px | 27.2px | 26.9px | 27.2px | 26.9px |

CLAAS, the mark this file was written about, at 1440: was 158.8 x 28.6, now 162.6 x 29.3. At 390: was
99.0 x 17.8, now 150.8 x 27.2. It is 53% wider and 53% taller on a phone, and it is legible.

Every mark on both walls at every width now measures 63.9 to 69.0 of optical weight. Per-mark numbers are in
the harness output; the two extremes at 1440 are Egg Farmers at 68.1 x 69.9 and CLAAS at 162.6 x 29.3, and
`sqrt(w x h)` is 69.0 for both.

## Why the height spread barely moved, and why that is correct

Under equal optical area the height spread is exactly `sqrt(aspect_max / aspect_min)`. For the 21 client marks
that is `sqrt(5.55 / 0.97)` = **2.39x**, and for the 10 sponsors `sqrt(6.05 / 0.86)` = **2.57x**. Those are
floors, not defects. They are the amount by which a 6:1 logotype is genuinely wider than it is tall.

The client wall measured 2.52x before and 2.39x after, so it is now at its floor. The sponsor wall measured
1.73x before and 2.57x after, and that number going UP is the fix working: before, seven of its ten marks were
pinned to the 72px height cap regardless of shape, which is what made a 6:1 wordmark carry 1.87x the visual
mass of a square badge. Equal height was buying unequal weight.

**Report optical spread. Height spread is the wrong number for this wall** and driving it to 1.0x would mean
rendering CLAAS at the same height as a square badge, at 2.4x its correct weight, as the loudest thing on the
page.

## The one structural change

Below 768 the client wall is two across, not three. Three across leaves 99px of content in a cell, and no
sizing rule can make a 5.55:1 mark legible in 99px: at the optical target it is 17.8px tall, which is what the
"before" half of this file measured. Two across offers 157px. 21 is odd, so the twenty-first cell spans both
columns and the grid still closes with no dead cells. It costs four rows of scroll on a phone.

---

# AFTER optical-area normalization (Phase 6 round 4)

Re-measured by the orchestrator in Chromium, same method.

| Breakpoint | Optical spread | Height spread | Smallest mark |
|---|---|---|---|
| Desktop 1440 | **1.00x** (69 = 69) | 2.41x | CLAAS 29px |
| Mobile 390 | **1.00x** (64 = 64) | 2.41x | CLAAS 27px |

Every one of the 21 marks now renders at an identical optical size, measured as sqrt(width x height).

The remaining 2.41x HEIGHT spread is correct and intended, not a residual defect. A wide wordmark like CLAAS is
short and wide; a square badge like Egg Farmers is tall and narrow. Equal optical weight requires unequal
height. Normalizing height instead would make CLAAS enormous and Egg Farmers tiny, which is the opposite of
what the eye wants.

Progression across the loop, mobile, which was the worst case:

| Round | Smallest mark | Height spread |
|---|---|---|
| 1 (as built) | 14px | ~5x |
| 3 (ink trimmed) | 18px | 4.44x |
| 4 (optical area) | **27px** | 2.41x, optical 1.00x |

---

# RE-MEASURED after the desktop-visual fix pass

Same harness, same browser, run again at the end of the pass that changed the /about/ books shelf, the
/do-business-better-podcast/ episode ledger, four FAQ containers and eleven artwork placements, to confirm none
of it moved the walls. `node scripts/measure-logo-wall.mjs --widths 1440,768,390`:

| | client 1440 | sponsor 1440 | client 768 | sponsor 768 | client 390 | sponsor 390 |
|---|---|---|---|---|---|---|
| **OPTICAL spread** | **1.00x** | **1.00x** | **1.00x** | **1.00x** | **1.00x** | **1.00x** |
| optical range | 68.9 to 69.0 | 69.0 to 69.0 | 68.9 to 69.0 | 69.0 to 69.0 | 63.9 to 64.0 | 63.9 to 64.0 |
| height range | 29.3 to 69.9 | 29.0 to 74.4 | 29.3 to 69.9 | 29.0 to 74.4 | 27.2 to 64.8 | 26.9 to 69.0 |
| height spread | 2.39x | 2.57x | 2.39x | 2.57x | 2.38x | 2.57x |
| smallest mark | 29.3px | 29.0px | 29.3px | 29.0px | 27.2px | 26.9px |

Unchanged from the pass above, which is the point: every height spread is still sitting exactly on its
`sqrt(aspect_max / aspect_min)` floor, so nothing clamps and no mark is carrying more or less weight than its
neighbours. CLAAS at 390 measures 150.8 x 27.2 against the 99.0 x 17.8 the first half of this file recorded.

## The same defect elsewhere, also re-measured

The /podcasts/ three-up was the other place a box was doing a mark's sizing. Rendered ink, measured off the
files' real ink boxes against the rendered element boxes at 1440:

| mark | rendered box | rendered ink | `sqrt(w x h)` of the ink |
|---|---|---|---|
| business-of-agriculture-podcast.jpg | 94 x 94 | 86.5 x 77.7 | 82.0 |
| do-business-better-podcast.png | 86 x 86 | 82.0 x 82.0 | 82.0 |
| xtreme-ag-transparent.png | 125 x 60 | 118.2 x 57.0 | 82.1 |

**Optical spread 1.00x** across the row, against the 4.7x ink-height spread round 3 measured in three identical
126px boxes. The height spread that remains, 57.0 to 82.0, is 1.44x and is the aspect-ratio floor for a 2.07:1
wordmark beside two squares.

The `business-of-agriculture.png` lockup carried the other half of that finding: a 42% semi-transparent alpha
ramp that the image optimizer amplified into a dirty rectangle. Its alpha histogram now reads 90,827 pixels at
alpha 0 to 31 (of which essentially all are alpha 0), 4,651 spread across the antialiasing ramp, and 10,694
opaque. A 4x crop of the rendered mark at 1440 shows no rectangle and no seam.

---

# Mobile nav sheet: assessed, not a defect

Round 6's vision-mobile auditor reported that the open nav sheet "hides Contact Us entirely, and on real phone
viewports also hides About, Blog, Acres TV and Media". Measured directly in Chromium, that is overstated.

`.dm-menu__body` is a real scroll container (`flex: 1 1 auto; min-block-size: 0; overflow-y: auto`), and it has
scrollable distance at every phone size tested:

| Viewport | Body height | Content | Scrollable | Links visible at rest |
|---|---|---|---|---|
| 390x844 | 631px | 718px | 87px | 13 of 15 |
| 360x740 | 527px | 718px | 191px | 11 of 15 |
| 320x568 | 387px | 718px | 331px | 8 of 15 |

Scrolling the body to the bottom brings every remaining link into view, Contact Us included. What the auditor
measured as "hidden" were the items at the TOP of the list, which leave the viewport once you scroll down. That
is how a scrolling list behaves.

The genuine weakness is that there is no scroll AFFORDANCE, so at 360px and below a user may not realise the
list continues. That is a real polish item and it is deliberately NOT being fixed at this stage: the nav is
functional, every destination is reachable, and this build has a demonstrated history of late cosmetic fixes
introducing regressions. Logged for the client instead.

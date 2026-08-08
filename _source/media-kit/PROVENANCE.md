# _source/media-kit

Photography recovered from the client's own WordPress media library on **2026-08-07**,
before the old hosting was switched off.

## Why this folder exists, and why it is not `_source/media/`

`_source/media/` is a dated crawl artifact. `_source/manifest.json` records `crawledAt`
and asserts `gate.actual.mediaAssets: 70`, and three documents reason from that number.
Dropping a 2026 rescue into it would retroactively falsify a record the whole audit trail
rests on. This folder is a second, separately dated source, and the completeness gate in
`scripts/normalize-assets.mjs` audits it exactly the same way.

## How it was found

`docs/OPEN-ITEMS.md` item 4 asked the client to commission headshots and live-event
photography, calling it "the single largest remaining lift in quality". Item 3 said no
downloadable speaker asset existed. Item 12 said an FAQ answer pointed at an AV document
"nobody can reach".

All three were wrong, and the reason nobody knew is that the mirror in `_source/` was built
by crawling the 29 **pages**. Anything sitting in the WordPress media library that no page
linked was invisible to it. `_source/manifest.json` `gate.discrepancies` recorded the gap
under "MEDIA ASSET MIRROR GAPS" and it was never followed up.

The library was enumerated with the public REST endpoint:

```
https://damianmason.com/wp-json/wp/v2/media?per_page=100&page=N
```

182 items, of which 96 were never referenced by any mirrored page.

## What was recovered and kept

Every file below is the untouched original. Nothing here has been resized, recompressed or
colour-managed; that happens in `scripts/normalize-assets.mjs` on the way to `public/img/`.

| File | Source URL (under `https://damianmason.com/wp-content/uploads/`) | Dimensions | Bytes | SHA-256 (first 16) |
| --- | --- | --- | --- | --- |
| `studio-portrait-window.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `AG-MEDIA-KIT/DSC_7509.jpg` | 2400×3600 | 1,901,391 | `935da7c8f4055b30` |
| `studio-portrait-dark-jacket.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `AG-MEDIA-KIT/DSC_7571.jpg` | 2400×3600 | 1,994,663 | `b698463a6fb62549` |
| `studio-portrait-check-jacket.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `AG-MEDIA-KIT/DSC_7602.jpg` | 2400×3600 | 2,158,756 | `5c8b794eebead0df` |
| `studio-portrait-headshot.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `AG-MEDIA-KIT/DSC_7616.jpg` | 2400×3600 | 2,373,360 | `13066db5d87d075f` |
| `studio-portrait-boardroom.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `AG-MEDIA-KIT/DSC_7312-edit.jpg` | 2200×2200 | 2,100,205 | `e80ac9e974df04f0` |
| `stage-milk-cartons.jpg` | `2023/05/MEDIA-KIT-PHOTOS.zip` → `DamianMason-live1.jpg` | 2861×1907 | 2,540,290 | `083b8ca686e8663c` |
| `stage-close-gesture.jpg` | `2023/05/MEDIA-KIT-PHOTOS.zip` → `DamianMason-live2.jpg` | 2250×1500 | 2,121,024 | `3074142efe0a6ce7` |
| `stage-labor-slide.jpg` | `2023/05/MEDIA-KIT-PHOTOS.zip` → `DamianMason-live3.jpg` | 2000×1333 | 1,790,751 | `d5ff90e3f5bc476c` |
| `stage-crop-protection-slide.jpg` | `2023/05/MEDIA-KIT-PHOTOS.zip` → `DamianMason-live4.jpg` | 2776×1851 | 2,037,042 | `d437405f93ac3c39` |
| `stage-audience-from-back.jpg` | `2023/05/MEDIA-KIT-PHOTOS.zip` → `DamianMason-audience.jpg` | 2033×1144 | 945,169 | `dfa2c4956e939674` |
| `stage-mueller-walking.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `MUELLER-2018-11-21-at-12.54.42-PM.jpg` | 3000×1880 | 333,350 | `773a3c632cf734a9` |
| `stage-mueller-white-wall.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `MUELLER-2018-12-03-at-1.42.49-PM.jpg` | 3000×1688 | 269,237 | `ac69f1376c2418b3` |
| `stage-blue-jacket.jpg` | `2023/04/AG-MEDIA-KIT-3.zip` → `Screen-Shot-2018-11-05-at-12.47.23-PM.jpg` | 3000×2062 | 284,490 | `598e8a4817ee0ed4` |
| `studio-podcast-desk.jpg` | `2022/12/6A2A4572-scaled.jpg` | 2560×1674 | 205,867 | `def27b5df952a7af` |
| `studio-green-screen.jpg` | `2022/12/6A2A4585-green-screen-scaled.jpeg` | 2560×1707 | 218,092 | `2faf19139178aa04` |
| `food-fear-hardback-table.jpg` | `2022/12/6A2A9174-edit.jpg` | 1555×1103 | 74,267 | `f4cc3a6fdca11ebb` |
| `portrait-cutout.png` | `2022/12/HEADER_DSC_7571.png` | 1500×2250 | 1,393,260 | `d2247d704f5c87bb` |
| `logo-agco.png` | `2023/02/1280px-AGCO_logo.svg_.png` | 1280×335 | 16,221 | `7c6b995d87e85a6f` |
| `logo-bayer.png` | `2023/02/Logo_Bayer.svg_.png` | 2048×2048 | 64,917 | `100bc017b17618fe` |
| `logo-boehringer-ingelheim.png` | `2023/02/1200px-Boehringer_Ingelheim_Logo.svg_.png` | 1200×370 | 21,549 | `dd792e116c76f869` |
| `logo-cpda.jpeg` | `2023/02/cpda.jpeg` | 367×208 | 6,393 | `eba4bbfaf1d874e7` |
| `logo-fast-genetics.png` | `2023/02/fast-genetics-logo-vector.png` | 900×500 | 4,674 | `71a60abbd12d0de1` |

`stage-blue-jacket.jpg` is named `Screen-Shot-…` at source and is **not** a screenshot. It is
a 3000×2062 photograph of Damian on a stage in a blue jacket in front of a "MISSION … YOU"
banner. The filename is a misnomer from whoever assembled the kit. `DESIGN_SYSTEM` §10 rule
18 bars screenshots from heroes and bands; it does not apply here, and this note exists so
nobody re-litigates it from the filename alone.

## What was recovered and deliberately not kept

| Source | Why not |
| --- | --- |
| `AG-MEDIA-KIT/DSC_7639.jpg` and `MEDIA-KIT-PHOTOS/DamianMason6.jpg` | Byte-identical (`13c23e7ccc85b31a`) to `_source/media/DSC_7639.jpg`, which already ships as `portrait-black-suit.jpg`. There is no resolution gain: `PHOTO_MAX` is 2000, so the shipped 1333×2000 is already what a 2400×3600 source produces. |
| `MEDIA-KIT-PHOTOS/DamianMason{,2,3,4,5}.jpg` | Byte-identical to `AG-MEDIA-KIT/DSC_7312-edit, 7509, 7571, 7602, 7616`. Kept once each, under the `AG-MEDIA-KIT` name. Verified by SHA-256, not by eye. |
| `2023/04/{,1-,2-,3-,4-}1500px-home-phone-DSC_7571.png` | Five alternate crops of the same cut-out frame, all **without** an alpha channel: they carry a baked white-to-grey gradient. Only `HEADER_DSC_7571.png` has real transparency, and that is the one thing that made the file worth having. |
| `2022/12/6A2A9174.jpg`, `6A2A9174-edit-2.jpg` | Two more frames of the same Food Fear table setup. `-edit` was kept because at 1555×1103 it is closest to the 3:2 plate ratio the site crops to. |
| `2022/12/web-19MS_187.png` | A two-panel composite, one panel monochrome. `DESIGN_SYSTEM` §6.4 bars composites, and the site harvests panels out of composites rather than shipping them (see the `WEB-COLLAGE-2` entry in `SKIPPED`). Neither panel here is stronger than something already recovered. |
| `2023/05/Damian-Collab-scaled.jpg` | The uncropped 1707×2560 frame whose crop already ships as `portrait-dark-blazer.jpg`. Re-deriving the crop is a marginal gain over an asset that is already correct. |
| ~50 `.mp3` files | The Business of Agriculture back catalogue, self-hosted on the old site. The site streams from `play.libsyn.com` and SoundCloud and self-hosts no audio; `.gitignore` already excludes `/_source/media/*.mp3` for the same reason. **Rescue these to cold storage separately.** See the open question below. |
| `2023/04/AG-MEDIA-KIT-3.zip`, `2023/05/MEDIA-KIT-PHOTOS.zip` | 36 MB of archives whose useful contents are extracted above. Held at `_source/archive/`, git-ignored. |

## Moved out of the image pipeline

| File | New home |
| --- | --- |
| `2023/04/AVRoomSetUp2018.pdf` | `public/docs/av-and-room-setup-requirements.pdf` |

One page, nine numbered requirements, a signature block. This is the document
`docs/OPEN-ITEMS.md` item 12 says "is not linked anywhere on the old site and does not exist
anywhere on the new one".

It must be **linked, never embedded**. `next.config.ts` sets `object-src 'none'` and a
`frame-src` that permits only `youtube-nocookie.com` and `play.libsyn.com`, so an
`<iframe>`, `<object>` or `<embed>` is blocked in production and works in a dev server with
the header stripped. That failure is invisible until it is live.

## Where each file is placed today

Seven of the seventeen are on pages. The rest are through the pipeline, in
`public/img/photos/`, with alt text written and waiting for a slot. Nothing here
is blocked; it is simply a layout decision per route.

| Output | Placed |
| --- | --- |
| `portrait-cutout.png` | `/` hero |
| `portrait-headshot.jpg` | `/reviews/` hero |
| `portrait-window-light.jpg` | `/contact-us/` hero |
| `portrait-charcoal-jacket.jpg` | `/collaboration-opportunities/` hero |
| `portrait-boardroom.jpg` | `/meeting-coordinators/` hero |
| `portrait-check-jacket.jpg` | `/join-the-conversation/` hero |
| `audience-from-the-back.jpg` | `/reviews/` Fig. 02 |
| `stage-dairy-case.jpg` | not yet. Suggested: `/speaking/` or `/keynote/` |
| `stage-mid-sentence.jpg` | not yet. Suggested: `/keynote/`, the tightest working frame in the set |
| `stage-labor-slide.jpg` | not yet |
| `stage-crop-protection-slide.jpg` | not yet |
| `stage-walking-the-front.jpg` | not yet |
| `stage-white-wall.jpg` | not yet |
| `stage-blue-jacket.jpg` | not yet |
| `podcast-desk.jpg` | not yet. Suggested: `/podcasts/` or `/join-the-conversation/`, since it is where both are actually made |
| `green-screen-setup.jpg` | not yet. Suggested: `/blog-news/`, which has no hero image |
| `food-fear-hardback.jpg` | not yet. Suggested: `/about/#books`. The home books section shows jacket ARTWORK by design, so this is not a swap |

## Open questions this raises

1. **The five logos above were never on the old site's client wall**, and they are not in the
   `Client Logos` folder the client supplied. `docs/OPEN-ITEMS.md` item 2 records the
   decision to treat that folder as the definitive list. They are rescued and recorded here,
   and they stay out of `content/clients.ts` until the client says they belong. Adding a
   company to a page that says "some of Damian's clients" is a claim about a commercial
   relationship, and it is not ours to make.
2. **No photographer credit survived.** Neither archive carries an IPTC creator field, and
   `scripts/normalize-assets.mjs` strips EXIF by design. If a shooting contract requires a
   credit line, nobody in this repository knows it.
3. **`stage-audience-from-back.jpg` shows identifiable third parties**, attendees at somebody
   else's event. It was published by the client for press use, which is the operative fact,
   and it is the single strongest asset recovered. It is also the one worth a sentence of
   confirmation before it runs at hero scale.
4. **Are any of the ~50 MP3s missing from the Libsyn feed?** In particular Do Business Better
   episode 144, which `docs/OPEN-ITEMS.md` item 14 records as the one thing the rebuild
   dropped. Its file, `VisionTechMgmt.mp3`, is already held at `_source/media/` and
   git-ignored.

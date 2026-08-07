# CMS readiness

## The premise

This site is front-end only by design. There is no database, no admin login and
no server-side code. Every route is prerendered to static HTML at build time, and
that is why it loads the way it does.

That was a deliberate trade, not a shortcut. The old site was WordPress with
Divi and WooCommerce, and the visible defects it shipped (an unedited "Your Title
Goes Here" panel, two Lorem Ipsum FAQ entries, a broken email link, three buttons
with no destination) were all editable-content defects. A CMS did not prevent
any of them.

What was preserved instead is the property that makes a CMS easy to add later:
**every piece of editable content lives in `content/`, in a typed file, separated
from the code that renders it.** No route hard-codes a testimonial, a logo path,
an FAQ answer, a phone number or a video ID. They import from `content/`.

The practical consequence: adding a CMS means replacing the module that supplies
the data, not rebuilding the site. A route that today reads

```ts
import { testimonials, testimonialsFor } from '@/content/testimonials';
```

would tomorrow read

```ts
import { testimonials, testimonialsFor } from '@/lib/cms/testimonials';
```

with the same names and the same return types. The JSX below it does not change.
The design system does not change. The SEO layer does not change, because
`lib/seo.ts` and `lib/schema.ts` already take all their facts from `content/`
rather than from literals.

This document maps every file in `content/` to the collection it would become,
lists the fields with their real types taken from the TypeScript, marks what is
required and what is a relation, and names the four places where the current data
does not carry something a CMS would need.

---

## 1. The collections at a glance

| File | Entries | Becomes | Shape |
|---|---|---|---|
| `content/clients.ts` | 21 | **Clients** | Collection |
| `content/sponsors.ts` | 10 | **Podcast Sponsors** | Collection |
| `content/testimonials.ts` | 17 | **Testimonials** | Collection + a route-placement relation |
| `content/faq.ts` | 13 | **FAQ Items** | Collection |
| `content/videos.ts` | 16 | **Videos** | Collection, two variants |
| `content/press.ts` | 9 | **Press Items** | Collection |
| `content/posts.ts` | 2 | **Blog Posts** | Collection |
| `content/books.ts` | 3 | **Books** | Collection |
| `content/credentials.ts` | 4 | **Credential Pillars** | Collection, ordered |
| `content/job-titles.ts` | 9 | **Job Titles** | Ordered list of strings, or a global |
| `content/media-band.ts` | 1 | **Media Band** | Singleton (global) |
| `content/site.ts` | 1 | **Site Settings** | Singleton, with five nested groups |
| `content/brand-assets.ts` | 15 | **Brand Assets** | Media library with named slots |
| `content/image-alt.ts` | 13 | *not a collection* | An `alt` field on the media library |
| `content/pages/` | 0 | *not a collection* | Empty and reserved. See section 4.4 |

Legend for the field tables below: **R** required, **O** optional, **REL** a
relation to another collection or to a media item.

---

## 2. Field maps

### 2.1 Clients

`content/clients.ts`, type `Client`. 21 entries. The client logo wall on `/`,
`/speaking/` and `/reviews/`.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `name` | string | R | Doubles as the logo's alt text. It is what a screen reader announces, so it must be the organization's name, not a filename. |
| `logo` | string (path) | R, REL | Media relation. Points at `/img/clients/<name>.png` or `.jpg`. Every entry has a `.webp` sibling at identical dimensions. |
| `width` | number | R | Real pixel width of the file. Not decorative: it reserves layout space so the page does not shift. |
| `height` | number | R | Real pixel height. Same reason. |

`width` and `height` are **generated**, not authored. `scripts/normalize-assets.mjs`
writes them. In a CMS they become derived fields read from the uploaded asset,
and the author never sees them.

### 2.2 Podcast Sponsors

`content/sponsors.ts`, type `Sponsor`. 10 entries. The sponsor wall on
`/the-business-of-agriculture/`.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `name` | string | R | Alt text and the accessible name of the outbound link. |
| `logo` | string (path) | R, REL | Media relation into `/img/sponsors/`. |
| `url` | string (URL) | R | Where the logo links. An empty string is valid and renders an unlinked logo, which is the correct fallback, not a bug. |
| `width` | number | R | Generated. |
| `height` | number | R | Generated. |

Six of the ten URLs were inferred rather than supplied. See `docs/OPEN-ITEMS.md`
item 9.

### 2.3 Testimonials

`content/testimonials.ts`, type `Testimonial`. 17 entries.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `id` | string (slug) | R | Unique. The key routes reference. Never reuse one. |
| `quote` | string | R | The body, **without** surrounding quotation marks. The `Quote` component supplies those. |
| `name` | string | R | May be the empty string, which means "render no byline". Two testimonials shipped unattributed on the old site and both are stored that way deliberately. So the field is required but its empty value is meaningful. |
| `title` | string | O | Job title. |
| `organization` | string | O | Company or association. |
| `featured` | boolean | O | Marks a quote the home page may pull a single line out of, rather than duplicating the full text. Exactly one entry sets it. |
| `sourcePage` | string | R | The **old-site** path this quote was harvested from, for traceability back to `_source/`. Not a live route. `'footer'` means the site-wide footer widget. |

**Plus one relation that is not a field on the entry.** `testimonialsByRoute` at
the bottom of the file maps a live route to an ordered list of testimonial ids:

```ts
'/keynote/': ['wendy-j-ruud', 'titan-pro-team', 'tim-luthy'],
```

In a CMS this is a **many-to-many relation with an explicit order**, either
modelled as a repeater on each page document ("Testimonials shown here") or as an
ordered relation field on the testimonial ("Show on these pages"). The page-side
model is better, because the order within a route is meaningful and the routes
are the thing an editor is thinking about.

### 2.4 FAQ Items

`content/faq.ts`, types `FaqItem` and `FaqLink`. 13 entries.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `id` | string (slug) | R | Unique. Also used to build DOM ids for the accordion. |
| `question` | string | R | Plain text. |
| `answer` | string | R | **Plain text, no markup.** This exact string is serialized into the FAQPage structured data Google reads. Markup here is a defect, not a feature. |
| `topics` | string[] | R | Controlled vocabulary, currently: `booking`, `travel`, `technology`, `program`, `audience`, `fees`. Drives per-route filtering via `faqByTopic()`. In a CMS this is a multi-select against a small taxonomy, not free text. |
| `links` | FaqLink[] | O | See below. |

`FaqLink`, a repeater inside the item:

| Field | Type | R/O | Notes |
|---|---|---|---|
| `match` | string | R | A run of literal text that must appear in `answer` **exactly once**. This is a validation rule a CMS must enforce, because a `match` that appears zero times silently does nothing and one that appears twice is ambiguous. |
| `href` | string (URL) | R | Destination. |
| `label` | string | R | What the reader sees in place of `match`. |

This exists so a bare URL in a verbatim answer can render as a real link without
altering the string the structured data serializes.

### 2.5 Videos

`content/videos.ts`, type `Video`. 16 entries. This is a **discriminated union**:
`kind` selects the variant. In a CMS it is one collection with a "Source" select
that reveals different fields, or two collections behind one relation.

Common to both variants:

| Field | Type | R/O | Notes |
|---|---|---|---|
| `id` | string (slug) | R | Unique. |
| `kind` | `'youtube'` \| `'mp4'` | R | The discriminator. |
| `title` | string | R | |
| `description` | string | O | |
| `framing` | `'wide'` \| `'vertical'` | O | Defaults to `'wide'`. Four entries are `'vertical'`, all shot on a phone. This is not cosmetic: a vertical recording dropped into a 16:9 stage renders as a narrow real frame flanked by two blown-up duplicates of itself. |
| `onPages` | string[] | R, REL | Live route paths this video appears on. A relation to routes, ordered by file order within each route. |

When `kind` is `'youtube'`:

| Field | Type | R/O | Notes |
|---|---|---|---|
| `youtubeId` | string | R | The 11-character video id, not a URL. |

When `kind` is `'mp4'`:

| Field | Type | R/O | Notes |
|---|---|---|---|
| `file` | string (path) | R, REL | Media relation into `/video/`. |
| `poster` | string (path) | O, REL | Media relation into `/img/video-posters/`. |

**Missing and needed: a captions track.** See section 3.1.

### 2.6 Press Items

`content/press.ts`, type `PressItem`. 9 entries. Renders on `/blog-news/`.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `id` | string (slug) | R | Unique. |
| `outlet` | string | R | Publication or broadcaster. |
| `title` | string | R | Verbatim from the source, including its inconsistent heading case. |
| `url` | string (URL) | R | Outbound. Three of the nine were YouTube embeds with no outbound link; their `url` is the canonical watch URL, which is the only destination the old page offered. |
| `date` | string (ISO) | O | **Only one of nine carries a date.** See section 3.3. |
| `type` | `'article'` \| `'podcast'` \| `'video'` \| `'tv'` | R | Classifies the appearance, not the medium of the link. `'video'` is currently unused. In a CMS: a select, not free text. |

### 2.7 Blog Posts

`content/posts.ts`, type `Post`. 2 entries. Renders at `/blog/` and `/blog/[slug]/`.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `slug` | string | R | Becomes the URL segment. Unique. |
| `title` | string | R | The headline. |
| `seoTitle` | string | O | Used as the `<title>` when the headline is too long for a search result. Falls back to `title`. It must be the headline cut down, never a different claim. |
| `date` | string (ISO) | R | From the WordPress `datePublished`. |
| `excerpt` | string | R | Card copy on `/blog/`, and the meta description on the post. |
| `author` | string | R | |
| `authorRole` | `'wrote'` \| `'posted'` | O | Defaults to `'wrote'`. `'posted'` means somebody else wrote it: the byline reads "Posted by" and the Article structured data names the site Organization instead of the Person. |
| `body` | string (markdown) | R | Full body, verbatim. |
| `heroImage` | string (path) | O, REL | Media relation. |
| `heroAlt` | string | O | Required whenever `heroImage` is set. A CMS should enforce that conditional, which TypeScript here does not. |
| `sourceUrl` | string (URL) | O | The outbound piece the post is about. Neither original post linked to it, which was the single biggest defect on both. |

### 2.8 Books

`content/books.ts`, type `Book`. 3 entries. Renders at `/about/#books` as
credibility only.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `slug` | string | R | Unique. |
| `title` | string | R | |
| `subtitle` | string | O | |
| `format` | `'paperback'` \| `'audiobook'` | R | Select. |
| `description` | string | R | Verbatim jacket copy from the retired WooCommerce pages. |
| `cover` | string (path) | R, REL | Media relation. |
| `buyUrl` | string (URL) | R | **Empty on all three entries.** No retailer link exists anywhere in the old site. See `docs/OPEN-ITEMS.md` item 7. |
| `buyLabel` | string | R | Link label, used when `buyUrl` is filled. |
| `forSale` | boolean | R | `false` on every entry. **A hard constraint, not a preference.** The client is not selling books. Nothing may render a price, a quantity, a cart or a checkout from this file. If a CMS is added, this field should be a locked toggle with that note attached, or the price fields should simply not exist in the model. |

### 2.9 Credential Pillars

`content/credentials.ts`, type `CredentialPillar`. 4 entries, order significant.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `title` | string | R | Knowledgeable, Professional, Relatable, Hilarious. |
| `items` | string[] | R | Bullets. A repeater of plain strings. |

There is a second export, `aboutCredentialPillars`, which is **derived, not
authored**: it is the same four pillars with one extra bullet appended to
"Professional". In a CMS that is either a computed value or a per-route override
flag, and it must not become a second hand-maintained copy. The two lists were
hand-copied once and drifted, which is exactly why this file exists.

### 2.10 Job Titles

`content/job-titles.ts`. 9 strings, order significant.

Not really a collection. It is one sentence held as a list so it cannot be
mistyped: "Damian Mason is a Businessman, Agriculturist, Speaker, Podcaster,
Media Guest, Ag Personality, Influencer, Author, and Consultant."

In a CMS: a repeater of strings inside Site Settings. Two derived exports
(`jobTitlesLower`, `jobTitleList()`) handle casing and serial-comma assembly and
stay in code.

### 2.11 Media Band

`content/media-band.ts`. Singleton. The closing band shared by `/acres-tv/` and
`/xtreme-ag/`, which are byte-identical on the old site.

| Field | Type | R/O |
|---|---|---|
| `eyebrow` | string | R |
| `heading` | string | R |
| `inquireLabel` | string | R |
| `mailingListLabel` | string | R |

A CMS global. If a third route ever wants this band, it references the global. It
does not retype it.

### 2.12 Site Settings

`content/site.ts`. One singleton with five nested groups.

**Group: site**

| Field | Type | R/O |
|---|---|---|
| `name` | string | R |
| `legalName` | string | R |
| `tagline` | string | R |
| `url` | string (URL) | R |
| `locale` | string | R |

`url` is the origin every canonical, OG tag and structured-data URL is built
from. Nothing hard-codes the domain.

**Group: contact**

| Field | Type | R/O | Notes |
|---|---|---|---|
| `email` | string (email) | R | Also the destination of the BoASG join mailto. |
| `phone` | string | R | The readable form, with periods. |
| `phoneHref` | string | R | The dialable form, `tel:+1...`. Separate on purpose. A CMS should derive this from `phone` rather than ask an editor for it twice. |

**Group: socials**, a repeater, type `SocialLink`. 5 entries.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `label` | string | R | |
| `href` | string (URL) | R | |
| `icon` | `'facebook'` \| `'x'` \| `'linkedin'` \| `'youtube'` \| `'instagram'` | R | Resolved by `components/ui/SocialIcon`. A select bounded by the icons that exist. Adding a sixth platform requires a code change, which is correct: there is no icon for it yet. |

**Group: nav**, a **recursive tree**, type `NavItem`. 7 top-level entries.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `label` | string | R | |
| `href` | string (path) | R | Every parent must resolve to a real route. Three parents on the old site had no href at all, which is the defect this shape prevents. |
| `children` | NavItem[] | O | One level deep in practice. |

This is the hardest piece to model. The header and the footer both generate from
this one tree, so they cannot drift. A CMS needs a nested repeater or a dedicated
navigation builder, and it needs link validation, because a nav entry pointing at
a nonexistent route is an invisible failure until somebody clicks it.

**Group: podcasts**, three named show records.

| Show | Fields |
|---|---|
| `businessOfAgriculture` | `name`, `libsynShowId`, `rss`, `apple`, `spotify`, `showPage` |
| `doBusinessBetter` | `name`, `soundcloud` |
| `xtremeAg` | `name`, `site`, `granary` |

The three shows carry different fields because they live on different platforms.
In a CMS this is either three globals or a small collection with optional
platform fields.

**Group: newsletter**, the Mailchimp embed config.

| Field | Type | R/O | Notes |
|---|---|---|---|
| `action` | string (URL) | R | The Mailchimp POST endpoint, verbatim from the live site's markup so subscriptions keep landing in the same audience. |
| `listId` | string | R | |
| `userId` | string | R | |
| `fields` | object | R | `{ firstName, lastName, email }`, the Mailchimp field names. |
| `honeypot` | string | R | Mailchimp's bot trap. Must stay present, empty and off-screen. |

This group is configuration, not content. It should be locked or hidden in any
CMS. An editor changing `honeypot` breaks spam protection with no visible symptom.

**Group: proofPoints**, a repeater. 4 entries.

| Field | Type | R/O |
|---|---|---|
| `value` | string | R |
| `label` | string | R |

Currently: 2,400+ audiences addressed, 50 states, speaking since 1994, 40,000+
monthly listeners. Rendered by `StatRow` on `/`, `/about/`, `/keynote/` and
`/speaking/`.

### 2.13 Brand Assets

`content/brand-assets.ts`. Two objects, `brandAssets` (8 slots) and
`brandAssetsExtra` (7 slots). Each slot is a named key pointing at a path.

This is not a collection an editor adds rows to. It is a **fixed set of named
slots** in a media library: `wordmark`, `boasg`, `businessOfAgriculture`,
`granary`, `xtremeAg` and so on. The code references them by name, so a slot
cannot be deleted without a code change, but the file behind a slot can be
swapped freely.

Six of the fifteen are currently unplaced (alternates and source files kept for
completeness). Each carries an inline comment naming exactly where it renders or
stating that it renders nowhere. Preserve those notes in the CMS as help text on
each slot, otherwise the next person cannot tell which of two similar marks is
the live one.

**Generated by `scripts/normalize-assets.mjs`.** Hand edits are overwritten.

### 2.14 Image Alt

`content/image-alt.ts`. 13 entries, keyed by image path.

Not a collection. This is a lookup table that gives **one alt string per image
file**, for images that appear on more than one route. Single-route images keep
their alt inline at the call site, because they have exactly one place to drift
from.

In a CMS this stops being a file and becomes an **`alt` field on the media item
itself**, which is the correct model and strictly better than what exists here.

The reason it exists is worth carrying over as policy. Alt text was originally
typed at each call site, and by the second QA round one portrait carried three
different descriptions on three routes, one of them naming a window that is not
in the frame and another describing a woven charcoal jacket as a "dark suit
jacket". The rule that fixed it: **one file, one description, written against the
image rather than against the copy around it.** Logos are named for the brand
they identify, not described as artwork, because a screen-reader user needs the
company's name and a sighted user is not being told about the shape of the bolt
either.

---

## 3. Where a CMS needs something the current data does not carry

Four gaps. None is large. All four are places where the field does not exist yet,
as distinct from places where the field exists and is empty (those are listed in
`docs/OPEN-ITEMS.md`).

### 3.1 Videos have no captions field

`components/sections/VideoEmbed` already accepts a captions prop, but the `Video`
type has nowhere to put one, so the three self-hosted MP4 demo reels render with
zero text tracks. That is the site's only known WCAG failure (SC 1.2.2 Captions,
Level A).

**What a CMS needs:** a `captions` media relation on the `mp4` variant, pointing
at a WebVTT file, plus an upload slot for `.vtt` alongside the video. The
YouTube variant does not need it; YouTube carries its own.

**Blocked on:** somebody transcribing three videos. This is a content-production
dependency, not a code gap.

### 3.2 There is no page model, so titles and descriptions live in route files

This is the biggest structural gap. Every route's `<title>` and meta description
sit inside `app/<route>/page.tsx` as an argument to `buildMetadata()`:

```ts
export const metadata: Metadata = buildMetadata({
  title: 'Ag Economist, Comedian, Farm Owner',
  description: '...',
  path: '/about/',
});
```

Nineteen routes, nineteen calls. A CMS cannot edit those without a developer,
which defeats most of the point of having one, because a title and a description
are exactly what a marketing person wants to tune.

**What a CMS needs:** a `Pages` collection keyed on `path`, holding at minimum
`path` (required, unique), `title` (required), `description` (required),
`ogImage` (optional media relation) and `noIndex` (boolean, defaults false).
`buildMetadata` then takes a path and looks the rest up.

Two validation rules belong on it, because both were enforced by hand during the
build and both matter: **titles and descriptions must be unique across the
collection**, and description length should warn outside roughly 140 to 160
characters. All 19 current descriptions sit between 146 and 158, and all 19
titles are under 62 characters including the ` | Damian Mason` suffix.

This is also the natural home for the sitemap, which today reads its route list
from `_source/manifest.json` and needs a second hand edit
(`BLOG_POST_SLUGS` in `app/sitemap.ts`) whenever a blog post is added.

### 3.3 Press items have no reliable date

`PressItem.date` is optional and **eight of nine entries have none**, because the
old page displayed no date on any item. The one that has a date got it from a
Forbes URL path.

The list therefore cannot be sorted chronologically, which is the natural sort
for a press page, and it currently renders in source order.

**What a CMS needs:** nothing structural. The field exists. It needs the client to
supply eight dates, at which point `date` becomes required and the list sorts
itself. Until then, do not make the field required or the eight existing entries
become invalid.

### 3.4 Route placement is expressed three different ways

Three collections decide where an entry renders, and they do it three different
ways:

- **Videos** carry `onPages: string[]` on the entry. The video knows its routes.
- **Testimonials** are placed by a separate map, `testimonialsByRoute`, keyed by
  route. The route knows its testimonials.
- **FAQ items** carry `topics: string[]`, and each route filters on topics. The
  placement is implicit in a taxonomy.

All three work. They are inconsistent, which is survivable in code and confusing
in an admin UI, where an editor will reasonably expect "where does this show up"
to look the same everywhere.

**What a CMS needs:** pick one convention, almost certainly the route-side
relation ("Testimonials shown on this page", as an ordered relation field on the
Page document), and express all three that way. Videos and FAQ items would then
gain the same field and lose `onPages` and the topic filtering respectively,
with topics kept as a genuine taxonomy rather than as a placement mechanism.

There is also a small trap here worth encoding as a validation rule: the
site-wide footer quote is **hard-coded** in `components/layout/Footer.tsx`, not
driven by the `footer` key in `testimonialsByRoute`. Placing that same testimonial
on any route renders it twice on that page. It shipped that way once and three
separate auditors caught it. A CMS should either drive the footer from the data
(preferred) or exclude the footer quote from the selectable pool.

---

## 4. Migration sequence, and roughly what it costs

Estimates assume one developer who knows Next.js, working against this repo, with
the client available to answer questions. They do not include the client's own
time entering content.

### Step 0: Choose the CMS. Half a day, mostly discussion.

The shape of this content favors a **git-backed or file-based CMS** over a hosted
database. Everything in `content/` is already structured, typed, versioned and
reviewable in a pull request, and losing that would be a real cost. Options that
preserve it include Sanity, Payload, Keystatic, TinaCMS and Contentlayer with a
markdown backend.

The decision that actually matters is not the vendor, it is whether the site
keeps building statically. If it does, a content change triggers a rebuild and a
redeploy, which takes about a minute and preserves every performance
characteristic the site currently has. If instead the site starts fetching
content at request time, the static prerender goes away and so does most of the
performance work. **Keep the static build.**

### Step 1: Model the collections. 1 to 2 days.

Translate section 2 into the CMS's schema language. The field lists are complete
and the types are real, so this is transcription rather than design. Include the
validation rules called out along the way: unique ids, `FaqLink.match` appearing
exactly once in its answer, `heroAlt` required when `heroImage` is set,
description length warnings, and the `forSale` lock on Books.

### Step 2: Import the existing content. Half a day.

Write a one-time script that reads each `content/*.ts` file and POSTs to the CMS,
or emits the CMS's native import format. The data is already clean, typed and
free of markup, which is the part that usually makes migrations expensive. There
are 95 records across the nine true collections, plus the settings singleton, the
media band global, 9 job-title strings, 15 named brand-asset slots and 13 alt
strings that fold into the media library.

Verify counts against `_source/manifest.json`, which is the same gate the original
build used: 21 client logos, 10 sponsor logos, 17 testimonials, 13 FAQ items, 16
videos, 9 press items, 2 blog posts.

### Step 3: Build the data layer. 1 to 2 days.

Create `lib/cms/` with one module per collection, each exporting the same names
and the same types the `content/` file exports today. Then change the imports in
the routes. The routes themselves do not change.

Do this collection by collection, not all at once. Each collection can ship
independently, because nothing in `content/` imports anything else in `content/`
except `faq.ts` reading `socials` from `site.ts`.

### Step 4: Add the Pages collection. 1 day.

Section 3.2. This is net-new modelling rather than a migration, and it is what
converts the CMS from "edit the testimonials" into "run the site". Move the 19
title and description pairs into it, rewire `buildMetadata`, and point the sitemap
at it so adding a blog post stops needing a second file edit.

### Step 5: Wire the build hook. Half a day.

Publish in the CMS triggers a deploy. On Vercel this is a deploy hook and a
webhook, and it is genuinely about an hour of work plus testing.

### Step 6: Editor guardrails and documentation. 1 day.

The parts that are easy to skip and expensive to skip:

- Help text on the fields that are not self-explanatory: `sourcePage`,
  `authorRole`, `framing`, `topics`, the brand-asset slots, `honeypot`.
- Lock or hide the configuration groups: the Mailchimp block, the generated
  `width` and `height` fields, the `forSale` toggle.
- A short editor guide. Most of it can be lifted from section 4 of
  `docs/HANDOFF.md`, which already covers the eight things that actually change.
- **Carry over the copy rules**, because a CMS makes it trivially easy to
  reintroduce the defect class that cost this build two entire QA rounds: no em
  dashes, curly apostrophes only, and nothing in visitor-facing copy that
  describes the website, the build or the reading order rather than the world.
  `docs/HANDOFF.md` section 7.3 has the examples. `docs/VOICE.md` has the voice.

### Total

**5 to 7 developer days** for the full migration including the Pages collection
and the guardrails. **3 to 4 days** if you skip the Pages collection and accept
that titles and meta descriptions stay in code, which is a reasonable first cut
if the immediate need is only for the client to add testimonials and blog posts.

The reason the number is that small is the whole point of this document: the
separation already exists. What is being replaced is where the data comes from,
and nothing else.

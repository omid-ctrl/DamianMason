# Content-parity audit: damianmason.com versus the Next.js rebuild

Audit snapshot: 2026-08-09

Implementation branch: `codex/content-parity-premium-redesign`

Acceptance rule: meaningful content parity is a hard gate. Defects, placeholders, broken links, duplicate shells, expired checkout furniture, and claims that cannot be supported are not meaningful content.

Scope of this document: source-and-implementation parity. Completed browser, accessibility, link and Lighthouse evidence is summarized in the acceptance table and recorded in [`IMPLEMENTATION_AND_VERIFICATION_2026-08-09.md`](./IMPLEMENTATION_AND_VERIFICATION_2026-08-09.md). The user separately granted production release authority on 2026-08-09.

## The no-bullshit final result

- **The source tree now meets meaningful editorial and service parity across the 21 public page URLs.** No known page-linked legacy article, speaking service, testimonial, media item, podcast record, book record, planner resource, or useful long-form answer has been silently removed. The unlinked WordPress MP3 archive is disclosed separately rather than hidden inside that conclusion.
- **The homepage gap is closed in content and in visible proof.** Home still carries the positioning, keynote, credentials, client proof, reviews, books, FAQs, and booking paths. The density pass restores an early named testimonial, a client-response video and captioned live keynote excerpt; gives all three role blocks real imagery; promotes Do Business Better, XtremeAg and BOASG into substantial illustrated features; keeps UPROOTED, current media, a feed-backed flagship episode and the mailing-list form; places all ten supplied sponsor marks on a legible dark wall; and expands the books section with physical-book photography, both print jackets and the complete usable descriptions.
- **The reviews destination is now complete for speaking proof.** It carries exactly 15 verified written speaking testimonials, not ten, and keeps the four videos from the original reviews page separate. The podcast endorsement and unattributed book endorsement are not miscounted as speaking reviews.
- **Meeting-planner self-service is restored and improved.** The web one-sheet remains detailed; the downloadable speaker sheet is now one tagged Letter page; the A/V document is a direct one-page download; and a curated ZIP supplies ten first-party photographs plus rights notes.
- **Podcast parity is stronger than the legacy site.** The flagship feed now supplies a three-episode recent catalogue on `/podcasts/` and a four-episode recent catalogue on `/the-business-of-agriculture/`, backed by four locally verified fallbacks, RSS discovery and episode schema. UPROOTED is represented from Damian's first-party playlist, and Do Business Better episode 144 again plays on-site from the retained first-party MP3.
- **The unsupported sales copy is gone.** No page now says planners book Damian twice, infers that ten client organizations hold annual meetings, converts the BOASG schedule into “26 calls a year,” claims sponsors' customers are listening, or promises newsletter behavior the source never stated.
- **BOASG's published `$99/month` is restored without reviving checkout.** It is explicitly qualified with “Confirm current terms by email,” the derived annual-call count is gone, and the membership and newsletter actions remain distinct.
- **Commerce was intentionally transformed, not accidentally dropped.** `/books/` is now a non-commerce library for two titles and three editions, with complete usable publisher copy, first-party book/signing photography, edition-specific anchors and honest availability notes. Cart, checkout, account, product prices, and book-purchase actions remain retired under the client's explicit instruction that books are not being sold moving forward.
- **The remaining gaps are facts only Damian can settle, rights/configuration decisions, and named human release checks.** They are listed exactly below. They remain follow-up items and do not justify inventing replacement copy.
- **Production authority was granted after the audit.** The completed local Lighthouse, Axe and manual accessibility results are recorded without claiming blanket WCAG conformance. The user explicitly authorized the commit, push and production deployment on 2026-08-09.

### Status key

- **PASS**: all known meaningful legacy material is present or intentionally redirected.
- **PASS — expanded**: parity is met and verified first-party material adds useful depth.
- **PASS — intentional transformation**: useful content is preserved while obsolete mechanics or duplicate shells are retired under an explicit instruction.
- **PASS — confirmation required**: parity is met, but a published source fact is contradictory, incomplete, or time-sensitive.
- **PASS — release check remains**: implementation is present, but a named human, provider or approved-environment verification is still required.

## Evidence base and limits

This audit uses five layers of evidence:

1. The baseline real-browser desktop and 390px mobile crawls of `https://damianmason.com` and `https://damian-mason.vercel.app`, including navigation, conversion paths, media, downloads, redirects, and console observations.
2. The complete legacy harvest: 28 of 28 source pages, 136 sections, 96 paragraphs, 97 image placements, 17 video placements, 20 testimonial placements, 45 FAQ toggles, and 403 recorded defects.
3. The first-party repository material: `_source/pages`, `_source/html`, `_source/media`, `_source/media-kit`, the source archives, client feedback, supplied client and sponsor marks, written testimonials, video records, PDFs, book records, and media records.
4. The current implementation tree, including the dedicated `/books/` library, `content/current-media.ts`, multi-item parsing in `lib/podcast-feed.ts`, `content/testimonials.ts`, `content/videos.ts`, route code, edition-specific redirects, metadata, structured data, and the public download artifacts.
5. First-party external records captured on 2026-08-09: The Business of Agriculture's Libsyn RSS feed and Damian Mason's UPROOTED YouTube playlist.

Baseline screenshots remain under `output/audit/site-crawl/` and `output/playwright/before/`. The completed post-density after set is under `output/final/routes-density/`: 21 routes at 390px, 768px and 1440px, with 63 of 63 views passing the runtime matrix.

The committed PDFs were inspected directly for this audit. `public/docs/damian-mason-speaker-one-sheet.pdf` and `public/docs/av-and-room-setup-requirements.pdf` are each one tagged Letter page. The photo ZIP was inspected and contains exactly the ten photographs and one usage-note file listed below. The completed build, browser, accessibility, link and Lighthouse evidence is recorded separately in `IMPLEMENTATION_AND_VERIFICATION_2026-08-09.md`; assistive-technology PDF reading order and deployed-environment checks remain human/release work.

## Page-by-page parity: final implementation state

| Current damianmason.com page or section | Rebuild destination | Meaningful legacy content | Final implementation and verified additions | Missing, confirmation, or verified next expansion | Destination and presentation disposition | Final parity status |
|---|---|---|---|---|---|---|
| `/` | `/` | Positioning and personality, keynote, credentials, client logos, planner benefits, roles, flagship podcast, speaking reviews and video, books, real FAQs, newsletter and booking CTAs | Preserves all of that. Restores the named Amy B./AgroLiquid testimonial, a client-response video and a captioned live keynote excerpt in the first third; adds a three-frame stage story and photography for every role; features the feed-backed latest Business of Agriculture episode and UPROOTED; promotes Do Business Better, XtremeAg and BOASG with real artwork/photography and fuller copy; indexes three media appearances; renders all ten supplied sponsor marks legibly on a dark wall; expands the books area with a physical hardback photograph, both print jackets and complete usable descriptions; and keeps the actual Mailchimp form. Todd Thurman is correctly described as an international swine management consultant. | Confirm the 70,000 views/downloads figure, the 40,000 listener figure, BOASG price/cadence, and seven-country count. No known meaningful legacy omission remains. | Proof arrives early, while the later current-work desk, sponsor wall, expanded book shelf, newsletter form and press index support the broader speaking narrative rather than replacing it. | **PASS — expanded / confirmation required** |
| No standalone legacy `/about/`; biography, credentials and books were scattered across Home, Keynote and product pages | `/about/` | Agricultural background, Purdue Ag Economics, Second City, Screen Actors Guild, Indiana farm, speaking record, two books and Food Fear audio format | Consolidates the full biography, credential pillars, source-dated career spine, undated milestone register, book covers, formats and all complete source description copy. Removes the unsupported line about “weeks nobody booked him.” | Damian can supply six missing milestone years, Food Fear audio details, and the truncated final Do Business Better sentence. A current farm photograph is the best verified-material opportunity but is not present in the source archive. | One authoritative biography with a compact author shelf; the complete edition library now lives at `/books/`. | **PASS — expanded / confirmation required** |
| `/shop/`, `/damian-mason-online-shop/`, three book-product pages and related WooCommerce shells | `/books/`, `/books/#food-fear`, `/books/#food-fear-audiobook`, and `/books/#do-business-better` | Two titles, three edition records, cover art, publisher descriptions, product photography, formats and book credibility; the store also carried price, quantity, cart, account and checkout furniture | Adds a dedicated non-commerce library with a first-party signing hero, an edition index, separate print/audio edition sections, full complete source descriptions, hardback and StoneX signing photography, honest availability/source notes, related resources, metadata and `CollectionPage`/`Book` structured data. Known product URLs redirect to the exact edition anchor; shop, cart, checkout, account, category and unknown product paths land on the library. | Food Fear audiobook narrator/runtime/current destination and the missing final Do Business Better jacket sentence still need Damian. No retailer is linked without verification. | The library preserves everything useful about the books while retiring only unsupported/currently unwanted commerce mechanics. | **PASS — expanded / intentional transformation / confirmation required** |
| `/keynote/` | `/keynote/` | The “Ations” program, long-form explanation, credentials, three self-hosted reels, three written testimonials, biography and booking FAQs | Preserves the full program and all three reels/testimonials. All three MP4 records now carry default English WebVTT tracks, and the route points readers to all 15 written speaking testimonials. | A human must listen to all three caption tracks against the recordings before the release-quality accessibility claim. The retired B.A.F. wordmark remains burned into the footage and requires a source re-export to remove cleanly. | Long-form program copy, real stage frames, captioned native media and a clear booking path remain intact. | **PASS — expanded / release check remains** |
| `/reviews/` | `/reviews/` | Ten written speaking reviews and four source-page videos | Collects exactly 15 verified written speaking testimonials: the original ten, three from Keynote, National Ag Aviation Association, and B. Kettler/IHLA. Keeps all four videos, audience photography and the 25-mark client wall. Counts and all cross-route labels now say 15. | One speaking quote remains unattributed in the source. Damian can supply the name/organization; it is retained rather than invented or removed. | `/reviews/` is the complete written speaking archive; curated quotes may still appear elsewhere without becoming separate records. | **PASS — expanded / confirmation required** |
| `/speaking/` blank stub plus an href-less parent | `/speaking/` | Almost no page content; children were hidden behind a non-link parent | Provides the full speaking hub: keynote, testimonials, coordinator resources, collaboration, credentials, sectors, coverage, client proof and booking. The unsupported annual-meeting inference is removed, and every review link correctly describes all 15 written testimonials. | Seven versus eight foreign countries and the country names remain unresolved. | The route is a useful parent in both desktop and mobile IA, not a shallow redirect or empty band. | **PASS — expanded / confirmation required** |
| `/meeting-coordinators/` | `/meeting-coordinators/` | Booking process, terms, travel, room setup, FAQs, one review, old photo/Media Kit links | Preserves the useful process and long-form answers. Replaces the unsupported rebooking claim with the source's “repeat business is the hallmark” wording. Adds direct actions for the web one-sheet, one-page A/V PDF, and ten-photo ZIP. | Confirm current A/V requirements, event-photo rights/credit, and whether the rounds photograph is a breakout or general session. | Useful planner downloads are self-service; the office remains the fallback for alternate sizes or questions. The obsolete “Media Kit” label is not revived. | **PASS — expanded / confirmation required** |
| No coherent legacy speaker-sheet route; only raw Media Kit/ZIP links | `/speaker-one-sheet/` and `/docs/damian-mason-speaker-one-sheet.pdf` | Scattered program, credential, client, fee, travel, FAQ and contact facts | Keeps a rich web resource and supplies a generated, tagged, single-page Letter PDF with program, credentials, selected clients, a sourced review, speaking facts and visible email/phone. Direct A/V and photo downloads sit beside it. | The PDF necessarily inherits the unresolved audience and foreign-country figures. Final PDF reading-order and assistive-technology checks remain release work. | Web depth is preserved; the PDF is the concise committee handoff. A build script asserts page count, tagging and required facts. | **PASS — expanded / release check remains** |
| `/collaboration-opportunities/` | `/collaboration-opportunities/` | Guest, sponsor and media tracks; credentials; metrics; videos; testimonials; inquiry and newsletter paths | Preserves all three collaboration paths and evidence. Expands the current format roster to four: The Business of Agriculture, Do Business Better, XtremeAg and UPROOTED. Removes unsupported customer identity, purchasing and sponsor-overlap claims. The central contact route remains the structured inquiry destination. | Confirm the current 40,000 monthly-listener figure and sponsor roster. No guarantee of audience behavior, sponsor results or ROI is made. | The page sells access and awareness conservatively, then routes qualified inquiries to one contact journey instead of duplicating another full form. | **PASS — expanded / confirmation required** |
| `/boasg/` and BOASG WooCommerce product | `/boasg/` | `$99/month`, every-other-Friday schedule, 60–90 minute format, recordings, Damian and Todd Thurman bios/expertise, benefits/non-benefits, join and newsletter paths | Preserves all program material and both distinct conversion paths. Restores `$99/month` as published context, qualifies current terms by email, and removes the unsupported derived “26 calls a year.” Todd's first-party role wording is correct. | Damian must confirm the current fee, every-other-Friday/11 a.m. Eastern cadence, active program status, Todd's current co-lead role, and which BOASG button his feedback intended. A genuine member testimonial is still unavailable. | Membership inquiry is email-based; the newsletter remains a separate lower-commitment option. WooCommerce quantity/cart mechanics stay retired. | **PASS — confirmation required / intentional transformation** |
| `/the-business-of-agriculture/` | `/the-business-of-agriculture/` | Full show pitch, hard-coded latest episode, Libsyn player/archive, platform links, four text sponsor links, one podcast endorsement, cross-promos, newsletter and rights copy | Preserves all of it. Fetches the four newest valid items from the official RSS feed, fills a short or failed response from four locally verified fallbacks, keeps the newest summary complete and the next three scannable, exposes episode details and direct MP3 when present, adds `PodcastEpisode` structured data and RSS discovery, shows all ten supplied sponsor marks legibly on `deep-alt`, and adds UPROOTED to the cross-promo set. | Confirm audience metrics, which of the ten supplied marks are current sponsors, six externally matched sponsor URLs, and the consolidated Spotify show ID. | A recent four-episode reading catalogue now leads into the complete Libsyn player/archive, platform links, sponsor context, related programs and signup. | **PASS — expanded / confirmation required** |
| `/do-business-better-podcast/` | `/do-business-better-podcast/` | Full show pitch, three named episodes, episode 144 self-hosted audio, SoundCloud, book and newsletter paths | Preserves the full pitch and three episode records. Restores the retained 34,354,476-byte first-party episode 144 MP3 through native `preload="none"` audio with a visible download fallback, plus a 92-block timestamped text transcript. Newsletter wording is narrowed to the source-backed release promise. | The transcript is explicitly machine-assisted, has one `[unclear]` phrase, and still needs a final human listen. The separate WordPress media-library MP3 archive needs a private catalogue/feed comparison. | Native audio and its text alternative restore no-JavaScript access without adding another service; SoundCloud remains the archive destination. | **PASS — restored / expanded / release check remains** |
| `/xtreme-ag/` | `/xtreme-ag/` | XtremeAg relationship, Cutting the Curve, trade-show/field-day/video role, Granary links, first-party features and newsletter | Preserves the full relationship and source-backed role wording, real links, features and media. Home and the podcast hub now expose this work rather than leaving it isolated. | The source says only that The Granary is filmed with XtremeAg in a granary-turned-tavern on Damian's Indiana farm. Damian can supply one accurate sentence on format, participants, duration and cadence. | Conservative page copy and direct XtremeAg destinations; no invented cadence, audience or performance. | **PASS — expanded / confirmation required** |
| Href-less Podcasts parent and `/podcast-2/` stub | `/podcasts/` | No meaningful hub; only child destinations | Provides a four-format discovery page with the three newest valid Business of Agriculture feed items, fallback-backed summaries, UPROOTED episode/playlist, Do Business Better archive, XtremeAg/Cutting the Curve, audience figures, a legible dark supplied-sponsor wall and collaboration path. `/podcast-2/` redirects here. | Audience and sponsor currentity still need Damian. | Varied editorial modules and a three-episode current reading list replace the empty stub without deleting any show-specific route. | **PASS — expanded / confirmation required** |
| No stale WordPress route | UPROOTED modules on `/`, `/podcasts/`, and `/the-business-of-agriculture/` | Absent from the legacy page crawl | Adds Damian's first-party playlist description, verified episode-one title, 26:20 duration, thumbnail, privacy-enhanced YouTube facade and playlist link. | No volatile view counts or unsupported production claims are used. Future episodes can be added only from the first-party playlist/feed. | UPROOTED is treated as a current fourth format, not a replacement for the flagship podcast. | **PASS — verified first-party expansion** |
| `/blog-news/` | `/blog-news/` | Nine media items, three video clips, external article/event/media links | Preserves all nine and all three videos with clearer outlet/type labels, contextual thumbnails and media contact. Home now indexes three selected appearances back to this complete page. | Eight source items have no date; one source title still says “upcoming” for a past event. Damian can supply dates and updated title wording. | Keep the full nine-item record; sort chronologically only when real dates exist. | **PASS — expanded / confirmation required** |
| `/acres-tv/` | `/acres-tv/` | Nearly empty shell plus image/link remnants | Expands the page to six first-party episode records with titles, guests, runtimes and the current watch destination. | No official feed exists in the retained sources, so the page correctly says selected episodes rather than implying a live catalogue. | Useful static archive and outbound viewing path; no invented feed. | **PASS — expanded** |
| `/blog/` | `/blog/` | Two short cards and WordPress archive/sidebar furniture | Preserves both posts and gives each a canonical page, source link and related paths. | The two-post archive remains genuinely small. More articles require real authored source material; none is fabricated here. | Media and podcast routes provide depth without pretending link-outs are long-form articles. | **PASS** |
| `/hello-world/` | `/blog/eggflation-gives-producers-record-profits/` plus 301 | Seven-word body and external article destination | Preserves the exact source sentence, still, outbound story and related paths. | Inherently thin; no safe expansion exists without the linked reporting or new Damian-authored copy. | Retire the WordPress seed slug, not its content. | **PASS — intentional transformation** |
| `/how-the-climate-crisis-is-causing-food-shortages-globally/` | `/blog/how-the-climate-crisis-is-causing-food-shortages-globally/` plus 301 | Five-word body and video destination | Preserves the source line, correct video, still and related paths. | Inherently thin; no invented reporting is added. | Canonical blog path plus legacy redirect. | **PASS — intentional transformation** |
| `/contact-us/` | `/contact-us/` and `/api/contact/` | Email copy; malformed legacy email link and non-tappable phone | Preserves the contact copy and adds valid email/tel paths, routing guidance, booking form, validation, explicit fallback, `action="/api/contact/"`, and native POST parsing for JavaScript-disabled submissions. | Production delivery still requires either Resend environment values or a configured webhook. That destination must be tested on the approved preview. | The form never reports success into a void; visible email and phone remain the durable fallback. | **PASS — expanded / release configuration required** |
| `/join-the-conversation/` and `/join-mailing-list/` | `/join-the-conversation/` plus 301 | Full newsletter pitch, raw Mailchimp form, separate duplicate signup shell and a legacy 40,000-subscriber claim | Consolidates both paths, preserves the exact Mailchimp audience/action and field contract, and limits the promise to new podcast-release notices plus Damian's commentary on food, fuel and fiber trends. Home, Business of Agriculture and Do Business Better now use the same source-grounded signup language. Unsupported speaking-date, inbox-frequency and unsubscribe-behavior promises were removed. | Damian must confirm whether 40,000 subscribers is current and distinct from the 40,000 monthly listeners. | One canonical signup page and reusable direct form; no extra newsletter service. | **PASS — expanded / confirmation required** |
| Global header, footer, metadata, sitemap, redirects and media behavior | Shared layout and system routes | Large dropdowns, empty parent links, broken staging footer links, social/contact/newsletter paths, legacy indexed URLs | Preserves a complete desktop/mobile IA with real parent destinations, includes `/speaker-one-sheet/` and footer access to `/books/`, keeps all 21 public URLs in the sitemap and current QA route definitions, preserves and expands redirects to exact book-edition anchors, adds site-wide RSS alternates, keeps static downloads out of App Router prefetch, removes content-hiding scroll reveal, and applies preview-only metadata/robots/header noindex unless `SITE_ALLOW_INDEXING=true`. The post-density route, redirect, fragment, sitemap, OG and JSON-LD checks pass. | Deployed headers, review social assets and the two normal human social-profile clicks remain release checks; the automated Facebook/LinkedIn responses are disclosed in the verification record. | Production canonicals stay on `damianmason.com`; review assets use the review origin and review deployments stay non-indexable until approved. | **PASS — expanded / release check remains** |

## Implemented content-addition and correction ledger

Every material content addition or disposition in this implementation is recorded here. Mechanical styling and performance changes are not disguised as content.

1. **Homepage business coverage**
   - Added a feed-backed latest Business of Agriculture episode with episode title, date, duration, number, summary and direct destination.
   - Added UPROOTED episode one and the first-party playlist path.
   - Restored an early named testimonial, a source client-response video and a captioned live keynote excerpt, followed by three first-party stage/audience frames, so speaking proof no longer waits until the lower review archive.
   - Added first-party desk, broadcast and studio imagery to the three role blocks.
   - Promoted Do Business Better and XtremeAg from short ledger rows to illustrated feature stories, and promoted BOASG into a full feature with its supplied mark, Todd Thurman portrait, source-stated cadence/duration and qualified published price.
   - Added three selected press appearances that link to the complete nine-item media page.
   - Added a wall of the ten sponsor marks supplied for The Business of Agriculture; Home, `/podcasts/` and `/the-business-of-agriculture/` now place the white-backed artwork on the dark surface its invert-and-screen treatment requires. The wording does not say all ten were published on the legacy page or are currently paying sponsors.
   - Expanded the Home books section with a first-party hardback photograph, event context, both print jackets, every complete usable description and direct links into the full `/books/` library.
   - Added the actual Mailchimp signup form and limited the promise to new podcast releases and commentary on trends in food, fuel and fiber.

2. **Home source-grounding result**
   - XtremeAg's current-work sentence is supported by `_source/pages/xtreme-ag.md`: Damian is described there as a content creator/personality who produces videos, works trade shows and field days, and hosts Cutting the Curve.
   - BOASG's Todd Thurman role, every-other-Friday schedule and 60–90 minute format are supported by `_source/pages/boasg.md`; `$99/month` is the legacy published price and is therefore qualified as needing current confirmation.
   - The sponsor block now says only what the repository proves: ten marks were supplied for The Business of Agriculture.
   - The newsletter block now says only what `_source/pages/join-mailing-list.md` supports: release notices and commentary on trends in the business of food, fuel and fiber. Unsupported speaking-calendar, frequency and unsubscribe claims are gone.
   - The earlier wrong Todd name, sponsor-roster overclaim, newsletter-behavior promises and “keep material current between stages” inference are resolved in the shared tree.

3. **Current podcast and media discovery**
   - Added `content/current-media.ts` for a four-item verified Business of Agriculture fallback sequence and the first-party UPROOTED record.
   - Added `lib/podcast-feed.ts` to parse multiple official Libsyn RSS items, fill a short or failed response from the verified local sequence, shorten only the older catalogue summaries at a sentence boundary, and avoid an empty recent-episode state.
   - Added `PodcastEpisode` structured data, direct MP3 discovery when the feed supplies an enclosure, and site-wide RSS alternate metadata.
   - Expanded `/podcasts/` to four formats plus the three newest Business of Agriculture feed items; `/the-business-of-agriculture/` now carries the newest four before the complete archive player.
   - Added UPROOTED to the Business of Agriculture cross-promotion section.
   - Restored Do Business Better episode 144 as native on-site audio, a direct MP3 download and a timestamped machine-assisted text transcript from the retained first-party file.

4. **Books and resource continuity**
   - Added `/books/` as a first-class, non-commerce route: two titles, three editions, an edition index, complete usable publisher descriptions, separate format treatment, first-party hardback/signing photography, availability notes and related-resource paths.
   - Added `CollectionPage`, `ItemList` and `Book` structured data, route metadata, sitemap inclusion and a footer destination without adding a crowded masthead item.
   - Redirected the known Food Fear print, Food Fear audiobook and Do Business Better product URLs to their exact edition anchors. Shop, cart, checkout, account, category and unknown product paths now land on the general books library; the BOASG product still lands on `/boasg/`.
   - Kept `/about/#books` as compact biography context while moving the complete edition record and all retired-commerce traffic to `/books/`.

5. **Speaking proof and planner resources**
   - Added five verified speaking testimonials to `/reviews/`, bringing the complete written speaking set to exactly 15 while retaining the original four videos.
   - Corrected every stale ten-review reference on `/reviews/`, `/speaking/`, `/keynote/`, `/collaboration-opportunities/`, and `/speaker-one-sheet/`.
   - Rebuilt the speaker PDF as one tagged Letter page with sourced program, credential, client, review and contact facts.
   - Added a direct one-page tagged A/V requirements PDF.
   - Added a self-service speaker-photo ZIP containing four studio portraits, five stage photographs, one audience frame, and usage notes.
   - Linked the one-sheet, A/V PDF and photo ZIP from both `/speaker-one-sheet/` and `/meeting-coordinators/`.

6. **Source-discipline corrections**
   - Replaced “meeting planners book Damian twice” with the source's narrower “repeat business is the hallmark” wording.
   - Removed the claim that the 2,400-room record proves a particular number of second bookings.
   - Removed the inference that ten member organizations necessarily hold annual meetings.
   - Removed sponsor-customer identity, purchasing and overlap claims and any implied sponsor ROI.
   - Replaced the three-show count with four formats where the page discusses Damian's current podcast/video roster.
   - Removed the unsupported About-page line about weeks without bookings.
   - Corrected the sponsor name to the source-backed **Tidal Grow Agriscience**.

7. **BOASG and newsletter accuracy**
   - Restored the source-published `$99/month` with a direct “Confirm current terms by email” qualification.
   - Removed the derived “26 calls a year” and retained only source-stated cadence, time, duration, recordings and leadership.
   - Preserved the email membership inquiry and the separate newsletter signup.
   - Rewrote the canonical newsletter page, reusable form defaults, Home and podcast signup blurbs to remove promises not present in the source.

8. **Media accessibility and no-JavaScript access**
   - Added three default English WebVTT tracks to the three self-hosted keynote reels and wired them into both scripted and no-JavaScript players.
   - Kept visible descriptive cutlines for people who cannot see the footage.
   - Restored no-JavaScript native audio access to the retained Do Business Better episode and associated it with a 92-block timestamped transcript.
   - Removed the root scroll-reveal controller, so content is never dependent on a reveal script to remain visible.

9. **Conversion, metadata and preview safety**
   - Added native form action/method semantics to the booking inquiry and support for JSON, multipart and URL-encoded POST bodies.
   - Preserved visible email/phone fallbacks when no delivery provider is configured or a send fails.
   - Added preview-aware metadata assets, robots rules and `X-Robots-Tag`; a Vercel deployment remains noindex unless an approved release explicitly sets `SITE_ALLOW_INDEXING=true`.
   - Added correct static-download link behavior so PDF, ZIP, MP3 and similar assets are requested as files rather than prefetched as App Router routes.
   - Expanded the a11y, link, no-JavaScript and Lighthouse route definitions to include the speaker one-sheet, `/books/` and the full 21-URL public route set where applicable. The completed post-density suite covers 63 route/width views, 63 Axe runs, 21 JavaScript-disabled routes, 729 unique URLs and 96 Lighthouse audits plus the focused Contact confirmation.

## Commerce and photo-resource disposition

The client's instruction is explicit: “We are not selling product (books) moving forward.” That approves retiring book commerce; it does not approve erasing books or the membership program.

| Legacy route or asset | Final destination | Meaningful material preserved | Intentionally omitted or transformed | Final disposition |
|---|---|---|---|---|
| `/shop/`, `/damian-mason-online-shop/` | `/books/` | Two titles, Food Fear print/audio formats, covers and every complete usable source description | WooCommerce grid, book prices, quantity and cart actions | **PASS — explicit client instruction** |
| `/cart/`, `/checkout/`, `/my-account/` | `/books/` | No unique Damian content existed in these shells | Cart, login and payment furniture | **PASS — obsolete system UI** |
| Food Fear print product | `/books/#food-fear` | Cover, title, subtitle, full usable description and first-party hardback/signing photography | `$19.95`, quantity, cart and related-product machinery | **PASS — credibility preserved / expanded** |
| Food Fear audiobook product | `/books/#food-fear-audiobook` | Audio-format existence, supplied cover and the publisher description retained with an explicit source note | `$19.95`, cart and any unverified narrator/runtime/listening destination | **PASS — factual details still needed** |
| Do Business Better product | `/books/#do-business-better` | Cover and every complete source sentence, with the damaged source ending disclosed | `$19.95`, “limited supply,” cart and the source fragment ending mid-word | **PASS — damaged copy not fabricated** |
| BOASG product | `/boasg/` | Membership, source-published `$99/month`, benefits, schedule, bios, email join and newsletter | Product quantity, cart and incorrect reused product blurb | **PASS — intentional transformation / current terms confirmation required** |
| Legacy Media Kit/photo archives | `/docs/damian-mason-speaker-photos.zip` | Ten useful first-party photographs and direct-download capability | Raw broad archives, duplicate frames, client/company marks and obsolete “Media Kit” naming | **PASS — curated replacement** |
| Legacy speaker-sheet concept | `/speaker-one-sheet/` and `/docs/damian-mason-speaker-one-sheet.pdf` | Complete web planner resource plus concise committee handoff | The former 12-page, self-referential output | **PASS — one tagged Letter page** |
| Legacy A/V PDF | `/docs/av-and-room-setup-requirements.pdf` | All nine numbered requirements and direct download | Inaccessible/unlinked placement | **PASS — one tagged Letter page** |

### Curated photo archive, exactly

- Public file: `public/docs/damian-mason-speaker-photos.zip`, 2,466,004 bytes.
- Contents: four studio portraits, five stage photographs, one audience photograph, and `speaker-photo-notes.txt`.
- It contains no client logos and no standalone retired B.A.F. mark.
- It is linked directly on `/speaker-one-sheet/` and `/meeting-coordinators/`; the office remains the fallback for alternate sizes.
- No photographer credit or usage license survived in the supplied files. The included notes therefore direct commercial users to confirm credit, crop and usage requirements with the office.
- The two raw legacy archives remain source evidence, not public downloads. Duplicate images and unrelated company marks were deliberately not bundled into the speaker-photo resource.

## Exact factual items still needing Damian's confirmation

These are the unresolved facts. The current site either qualifies them, labels the source state, or declines to invent the missing detail.

| Item | What the implementation says or does now | Exact answer needed from Damian |
|---|---|---|
| BOASG price and operating status | Says `$99/month`, “confirm current terms by email,” every other Friday at 11 a.m. Eastern, 60–90 minutes, recordings available, Damian and Todd Thurman leading | Is `$99/month` current? Is the every-other-Friday 11 Eastern cadence current? Is the group active now? Is Todd still co-leading? Which “Sign up” button did Damian's feedback intend to become email? |
| Audience measures | Keeps 40,000 newsletter subscribers on the newsletter route, 40,000 monthly listeners on podcast/speaking routes, and 70,000 monthly Business of Agriculture views/downloads as separate source claims | For each number: exact unit, current value, as-of date and data source. Are subscribers and listeners distinct populations? What channels and period make up 70,000? |
| Speaking total | Publishes `2,400+` audiences since 1994 | Current total and the as-of date Damian wants attached to it, if any |
| Foreign coverage | Normalizes to seven because most source pages say seven; BOASG says eight; the countries are not named | Is the correct count seven, eight, or higher? List the countries exactly as Damian wants them displayed |
| Current sponsor roster | Shows ten marks as client-supplied marks, without saying all ten are current paid sponsors | Which of the ten are current, which are historical, and what public label should the wall use? |
| Six sponsor destinations | Uses the official sites matched in `content/sponsors.ts` for AgView Solutions, EarthOptics, Harvest Returns, Life Scientific, NewFields Ag and Redox Bio | Confirm that each supplied logo maps to that exact company and URL |
| Client wall scope | Shows the 21 supplied client marks plus BASF, Helena Agri-Enterprises, Iowa Pork Producers Association and John Deere restored from the legacy wall | Did the supplied folder replace the old wall, or should these four legacy marks remain? Are all 25 acceptable as a current or historical “who books him” roster? |
| Accessible client names | Uses “Iowa Pork Producers Association” from the artwork's primary line and “Egg Farmers” from the supplied filename | Should the spoken labels be “Iowa Pork Producers Association” or “Iowa Pork Alliance,” and “Egg Farmers” or “Egg Farmers of Ontario”? |
| Five unplaced company marks | Keeps AGCO, Bayer, Boehringer Ingelheim, CPDA and Fast Genetics in first-party source evidence but out of the client wall because no supplied/current wall establishes the relationship | Do any of those five belong in the public client roster, and if so under what relationship label? |
| Sponsor platform link | Consolidates two conflicting legacy Spotify show IDs to the current value in `content/site.ts` | Confirm the correct Business of Agriculture Spotify show URL |
| Photo rights and credit | Publishes a curated ZIP with an explicit office-confirmation note; uses the audience image on-site | Who owns the photographs? Is a photographer credit required? Are commercial reuse, crops and the identifiable audience image approved? |
| A/V sheet | Publishes the recovered requirements as a direct one-page PDF | Are all nine requirements still current, or should Damian provide a revised sheet? |
| Session photograph label | Captions the rounds image as a breakout session | Was that event a breakout or a general session? |
| Unattributed quotations | Retains one speaking-feedback quote and one Food Fear endorsement without a fabricated byline | Name, title/organization and source for each, or explicit approval to keep each unattributed |
| Food Fear audiobook | Shows print and audio as two formats of one title | Narrator, runtime and legitimate current destination, if the audio edition remains publicly available |
| Do Business Better jacket copy | Stops at the last complete source sentence because the old page ended at “how to achieve i” | Supply the exact missing final sentence |
| Media chronology | Preserves nine items in source order; only Forbes has a verified date; one old title says “upcoming” | Dates for the other eight items and approved current wording for the old “upcoming event” title |
| Career chronology | Dates only 1994 and 2023; leaves Purdue, Second City, SAG, both books and the podcast milestone undated | Supply any known years, especially both publication years and The Business of Agriculture launch year |
| The Granary | States only the three source-supported facts: XtremeAg, the granary-turned-tavern on Damian's Indiana farm, and the current destination | One accurate sentence covering who appears, what happens, typical duration and cadence |
| Legacy WordPress MP3 archive | Republishes only the page-linked Do Business Better episode 144; the roughly 50 unlinked media-library MP3s are not bundled into the public site or repository | Confirm Damian holds the masters, archive them privately if needed, and identify whether any episode is absent from the Libsyn/SoundCloud catalogues before the old host is retired |

### Source material still unavailable, not invented

- One named BOASG member testimonial with organization. No speaking testimonial has been repurposed as membership proof.
- A current first-party Indiana farm photograph. The copy can state the sourced farm fact, but the retained archive cannot yet show it.
- Updated source exports of the three reels without the retired B.A.F. watermark.

### Launch decisions and checks, not factual copy questions

- Configure and test either Resend (`RESEND_API_KEY` plus `CONTACT_TO_EMAIL`) or `CONTACT_WEBHOOK_URL` on the approved preview. Without either, the form correctly falls back to visible email and phone but cannot deliver a form submission.
- Human-listen all three WebVTT tracks against the recordings, including names, contractions, colloquial lines and the closing music cues.
- Human-listen the episode 144 transcript, resolving the one `[unclear]` employer descriptor near 01:44 before calling it publication-grade verbatim copy.
- Verify PDF reading order and accessible names with assistive technology; “Tagged: yes” and extractable text are necessary but not sufficient for full PDF accessibility.
- Decide whether to leave the retired watermark burned into the three reels or supply clean source exports. Cropping/re-encoding was not authorized.
- Confirm the approved production deployment is the only environment with `SITE_ALLOW_INDEXING=true`.

## Intentional omissions and genuine duplication

- Book checkout, product prices, cart/account pages and the products-for-sale FAQ remain retired under the client's explicit instruction. Book credibility content is expanded on Home and preserved in full, by edition, at `/books/`.
- “Media Kit” remains removed as a label. Its useful function is replaced by the speaker one-sheet, A/V PDF and curated photo ZIP.
- The standalone Damian Mason · Business · Agriculture · Food mark remains excluded. It survives only as a burned-in watermark in the three source reels.
- The five rescued media-kit company marks remain unplaced until Damian confirms a relationship; the files remain in first-party source evidence.
- The roughly 50 unlinked WordPress media-library MP3s were not republished or committed as a public archive. They may contain guest voices or licensed music; compare them with Libsyn/SoundCloud and archive privately before retiring the old host.
- Duplicate photographs, weaker same-moment frames, WordPress resized copies, raw player screenshots, page-builder shapes/icons, stock commerce furniture, empty FAQ rows, Lorem Ipsum, empty clickable rows and staging-host links remain omitted as defects or true duplicates.
- The three Keynote testimonials duplicated byte-for-byte on the legacy collaboration page are stored once and deliberately reused. They are not counted twice.
- The podcast endorsement and unattributed book endorsement remain outside the 15 speaking-testimonial count.
- No foreign countries, sponsor mechanics, audience demographics, customer identities, ROI, repeat-booking rate, book retailer, media dates, career years, Granary format or newsletter behavior has been invented.

## Final parity acceptance state

| Acceptance area | Final source/implementation result | What remains before production handoff |
|---|---|---|
| Editorial and service route parity | **PASS.** All 21 public page URLs have a mapped purpose; all known meaningful legacy content is present or explicitly transformed; the 21-route rendered and link sweeps pass. | Damian/client content review and the named factual/human checks below |
| Homepage business coverage | **PASS — expanded.** Speaking proof arrives early; three illustrated role blocks, four podcast/video formats, promoted DBB/XtremeAg/BOASG features, a legible sponsor wall, media, expanded books, reviews, newsletter and contact paths are visible in one complete narrative. | Confirm time-sensitive metrics and BOASG terms; review the completed 390px/768px/1440px evidence |
| Speaking proof | **PASS — expanded.** Exactly 15 verified written speaking testimonials plus the four original videos. | Resolve the one unattributed speaking quote if Damian can |
| Meeting-planner resources | **PASS — expanded.** Web one-sheet, one-page tagged PDF, one-page tagged A/V PDF and curated ten-photo ZIP are direct. | Photo rights/credit, A/V currency, PDF reading order |
| Podcast currency and discovery | **PASS — expanded.** Three- and four-item feed-backed recent catalogues, a four-item fallback sequence, RSS, schema, UPROOTED, restored DBB audio and a timestamped text alternative; feed/runtime and no-JavaScript checks pass. | Human transcript review, sponsor/platform confirmations and legacy MP3 archive comparison |
| Factual-claim discipline | **PASS in implemented copy.** Identified overclaims were removed or narrowed to the source. | Damian's exact confirmations in the table above |
| Commerce parity | **PASS — expanded / intentional transformation.** A complete two-title, three-edition `/books/` library and exact product-to-edition redirects preserve the useful record; obsolete book commerce is retired. | BOASG current terms plus Food Fear audio details and the missing Do Business Better sentence |
| Newsletter parity | **PASS.** Same Mailchimp audience and field contract; source-backed promise only. | Confirm 40,000-subscriber current value |
| Media accessibility | **IMPLEMENTED, RELEASE CHECK REMAINS.** Three VTT tracks ship in JS/no-JS players; archived audio has a linked timestamped transcript; Axe, manual and no-JavaScript suites pass. | Human caption/transcript listen; automated zero-violation evidence is not blanket WCAG conformance |
| PDF accessibility | **PARTIAL VERIFIED.** Both current PDFs are one tagged Letter page. | Assistive-technology reading order and link/name checks |
| Contact journey | **PASS with safe fallback.** Native POST semantics, validation, email and phone all remain. | Configure and test the production delivery provider |
| Preview launch safety | **IMPLEMENTED, RELEASE CHECK REMAINS.** Metadata, robots and response-header noindex are environment-aware. | Verify actual preview and approved-production headers/OG assets |
| Visual evidence | **PASS.** `output/final/routes-density/` contains 63 of 63 successful views across all 21 routes at 390px, 768px and 1440px. | Review the evidence set with Damian/client |
| Build, TypeScript, ESLint, links, console, redirects and Lighthouse | **PASS.** Current results are documented in `IMPLEMENTATION_AND_VERIFICATION_2026-08-09.md`; the one noisy Contact Lighthouse sample is paired with its immediate 93/93/93 mobile confirmation. | No automated suite replaces the remaining human caption, PDF, contact-delivery and factual checks |
| Automated and manual accessibility | **PASS for the completed checks.** Axe: 63/63 with zero violations; manual harness: 36/36; no-JavaScript: 21/21 routes. | Do not treat zero automated violations as a blanket conformance or contrast guarantee; complete the named human media/PDF checks |
| Merge/deploy authority | **GRANTED on 2026-08-09.** | Verify the resulting production deployment and preserve the disclosed follow-up list |

The content-parity and completed local verification gates pass, and production deployment is approved. The factual and human checks above remain explicit post-release follow-ups rather than grounds for invented claims.

# Open items: what we need from you

**Read this document first.**

The rebuild is finished and every page is live-ready. This is the list of
questions the old site could not answer for us. In each case we made a decision,
shipped it, and wrote down exactly what changes if you tell us something
different.

**Nothing on this list blocks launch.** The site works as it stands. Every one of
these is either a fact only you know, or a judgement call you are entitled to
overturn.

How to read each item:

- **What ships today** is what a visitor sees right now.
- **Why** is the reasoning, so you can tell whether we guessed well.
- **If you answer differently** is the real cost of changing it, honestly stated.

Items 1 through 10 are the ones we most want answered before launch. Items 11
through 20 are smaller, and several of them are opportunities rather than
problems.

*(This list was renumbered in the final handoff so the launch-critical questions
come first. If you were sent an earlier copy, the items are all still here.)*

---

## 1. Which BoASG button did you mean?

**Your instruction:** "On the BOASG page: The Sign up Link. We need to change the
link to my email address (with some appropriate wording)."

There were two sign-up buttons on that page, and we could not tell which one you
meant.

**What ships today.** The **$99/month Join Today** button is now an email link to
`damianmasonoffice@gmail.com`, with the subject line and the first few lines of
the message already written for the visitor. The separate **"Sign Up for Damian's
Mailing List"** button still points at the newsletter page at
`/join-the-conversation/`.

**Why.** The Join Today button used to go to a WooCommerce checkout. The store is
being removed, so that checkout will not exist, and that button had to change or
it would break. The mailing list button pointed at a page that still exists and
still works, so it did not need to change. That reading also matches the phrase
"with some appropriate wording", which makes sense for a membership enquiry and
not for a newsletter signup.

**If you answer differently.** If you meant the mailing list button, it is a
one-line change and about ten minutes of work, but be aware that the Join Today
button still has to point somewhere, because its old destination is gone.

**Please confirm before launch.** This is the only instruction in the brief we
could not resolve from the source.

---

## 2. John Deere, BASF, Helena and IPPA, restored

**Status: shipped, with one question left.**

**What we told you before.** That the wall showed the 21 logos in the folder you
supplied, that four names from the old wall were missing because they were not in
that folder, and that adding them back was "about half an hour".

**What ships today.** All four are back. The wall carries **25 marks** on the home
page, the speaking page and the reviews page.

**Why we changed our mind.** The original reading was defensible: you said "update
client logos with logos in folder" and we took the folder as the definitive list.
But these four were on your own wall, we had usable artwork for every one of them,
and a client roster that quietly loses John Deere and BASF is a weaker argument
than one that keeps them. If you actually meant the folder to REPLACE the old
wall rather than refresh it, say so and they come straight back out.

**The half hour was wrong, and it is worth saying why**, because it is the kind of
estimate that hides work. 21 divides by 7 and by 3; 25 divides by 5 and by nothing
else useful. So the wall's column counts changed, a CSS rule that spans the odd
last cell had to be scoped so it does not leave a ruled half-row at tablet width,
three build guards that assert the roster is 21 had to be re-derived, the sector
ledger on the speaking page gained two rows' worth of members, and six lines of
page copy quoted the old number. It was most of a day.

**Two things moved on the sector ledger**, which you can check against the wall:

- **Equipment went from one mark to two.** It was a bucket of one, and there is a
  long note in the code explaining why a bucket of one was honest rather than
  tidy. John Deere settles that.
- **Ten of the 25 are now member organizations** rather than nine, which is the
  figure the speaking page leads with, because ten of them run an annual meeting
  and an annual meeting is what a keynote gets booked for.

**The question we still need answered.** The IPPA file is
`19225_IPPA_Alliance_Logo_4C-scaled-1.jpg` and the artwork itself reads **Iowa
Pork Producers Association**. Our earlier note called it "Iowa Pork Alliance". We
have shipped the artwork's own wording, because that is what we can see, but a
logo-wall label is what a screen reader announces and it should be the name the
organisation uses.

**Same question, still open, on Egg Farmers:** the artwork reads "get cracking.
Egg Farmers of Ontario" and the wall says **Egg Farmers**, because that is how the
file was named. Should it say Egg Farmers of Ontario?

**If you would rather supply better files** for any of the four, drop them in the
folder and it is a re-run of one script.

---

## 3. The Media Kit, found

**Status: resolved, and it changes items 4 and 12 as well.**

**What we told you before.** That both Media Kit links had been removed, that the
one we found pointed at a raw `.zip` on a staging domain, and that it was "a
download of unknown contents on a URL that will stop working when the old
hosting is switched off".

**What is actually true.** The contents are no longer unknown. The mirror in this
repository was built by crawling your 29 pages, so anything sitting in your
WordPress media library that no page linked was invisible to it. We went back
and read the library itself. Two archives came out of it:

- **`MEDIA-KIT-PHOTOS.zip`**, 22.4 MB, eleven professional photographs: six
  studio portraits at 2400x3600, an office portrait at 2200x2200, four live
  stage photographs, and one shot from the back of the room with you on stage
  and the audience in frame.
- **`AG-MEDIA-KIT-3.zip`**, 13.9 MB, nine more, three of them stage shots at
  3000px wide.

Both are now in the repository at `_source/media-kit/`, with every file listed by
source URL, dimensions, byte size and SHA-256 in `_source/media-kit/PROVENANCE.md`,
including the ones we chose not to use and why. **None of it existed anywhere
outside the old hosting**, so it would have gone when the site was switched off.

**What ships today.** Seventeen of them are through the build pipeline and in
`public/img/photos/`, and seven are placed on pages so far: six heroes and the
audience shot on the reviews page. The rest are ready and waiting for a slot.
See item 4, which is the item this find really answers.

**And the one-sheet now exists.** `/speaker-one-sheet/` carries the program, the
credentials, the client roster sorted by kind of business, the fifty states, three
named reviews, the five questions planners actually ask, and the number to call.
There is a **PDF of the same page** at
`/docs/damian-mason-speaker-one-sheet.pdf`, which is the thing a planner forwards
to a committee.

**The PDF is generated FROM the page, not drawn separately**, and that is the part
worth knowing. A designed PDF looks better for exactly one edit; after that
somebody changes a fee answer or a client joins the wall, and the file in
somebody's inbox says something the website does not. A script rebuilds it from
the page and then reads the text back out and checks that all eight figures and
both contact details are really in it. It caught a real defect the first time it
ran: the page had your email only as a button label, so the printed version had
no address on it at all.

**It is linked** from the Speaking menu, from the meeting coordinators page where
the old Media Kit button used to be, from the speaking hub, and from the FAQ
answer that has been promising headshots and a bio since the old site.

**It is not called a media kit**, per your instruction.

---

## 4. Professional photography, found

**Status: two of the three things we asked you for already existed.**

**What we asked for.** Two or three current headshots, and live-event photography
from the back of the room showing you on stage with the audience in frame. We
called it "the single largest remaining lift in quality" and we were right about
that. We were wrong that it did not exist.

**What we found, in your own media library.**

1. **Six studio portraits at 2400x3600.** One is the frame the site was already
   using, at the same resolution; the other five it had never seen. Before this,
   five photographs were covering eleven hero slots: one portrait was the hero of
   THREE separate routes and two more were doing double duty. Every route now has
   its own. The five new frames are the heroes of `/reviews/`, `/contact-us/`,
   `/collaboration-opportunities/`, `/meeting-coordinators/` and
   `/join-the-conversation/`, and the first two of those had no hero photograph
   at all before, including the testimonials page, whose entire job is proof.
2. **A transparent-background cut-out** of you, 1500x2250. This is the single
   best asset in the set and it is why the home page looks different: you now
   stand at full height on the page itself, uncropped and unveiled, instead of
   inside a small rectangle. Nothing else on the site can do that.
3. **`DamianMason-audience.jpg`.** Shot from the back of the room, you on stage,
   the audience the actual subject, several of them laughing. **This is the exact
   photograph we asked you to commission**, word for word. It is now the lead
   figure on the testimonials page, where it replaced a 502x452 crop that was
   being blown up to 1344px wide.
4. **Seven more stage photographs**, up to 3000px wide.
5. **Studio product photography of the Food Fear hardback** on a walnut table
   between two stacks of it. Through the pipeline and not yet placed: the books
   section on the home page deliberately shows the JACKET ARTWORK rather than a
   photograph, for reasons written into that section, so dropping this in is a
   layout decision on `/about/#books` rather than a swap. It is the best-looking
   book image you have and it should get a slot.

**One ask survives.** **A farm image.** Nothing in either archive is a farm, and
the Indiana farm is a real differentiator the copy leans on and the imagery still
cannot support. That is now the only photograph the site is missing.

**And the caveat from before still stands** on the XtremeAg cornfield frame,
which is a broadcast grab carrying a burned-in lower third. It ships because it
is the only image on file of you with that group.

**One question for you.** `DamianMason-audience.jpg` shows identifiable people at
somebody else's event. You published it yourself for press use, which is the
fact that matters, and it is the strongest asset we have. It is also the one
worth a sentence of confirmation from you before it runs large.

**And one we cannot answer.** Neither archive carries a photographer credit that
survived, and our pipeline strips EXIF by design. If a shooting contract requires
a credit line, nobody here knows it.

---

## 5. Seven foreign countries, or eight?

**What ships today.** The site says **7 foreign countries**, everywhere.

**Why.** Your old `/boasg/` page said, word for word, "in all 50 states, 8 foreign
countries and in every segment of Ag". Every other page on the old site said 7.
We went with 7 on two grounds: it was the more common figure, and the pages
carrying it were more recently edited (the keynote page was last modified in
August 2024, the BoASG page in August 2023).

**Why we are flagging it.** That was us editing a number inside your biography,
which is not something we are comfortable doing silently even when the evidence
points one way.

**If you answer differently.** If it is 8, tell us and we change every instance
together. Ten minutes. If you have travelled since, the number can go up.

---

## 6. Are the two 40,000s the same 40,000 people?

Your old site used the figure 40,000 twice, meaning two different things:

- "his weekly audience of more than **40,000 subscribers**" (the mailing list page)
- "more than **40,000 listeners per month**" (the collaboration page)

Neither figure has a source anywhere else in the old site.

**What ships today.** We split them by page so no single page shows both:

- **40,000 subscribers** appears only on `/join-the-conversation/`, the page that
  owns the mailing list.
- **40,000 monthly listeners** appears on the podcast, speaking and collaboration
  pages, and in the credibility figures on the home, about, keynote and speaking
  pages.
- **The site-wide footer carries neither.** It used to say "More than 40,000
  subscribers get Damian's read on...", and because the footer renders on every
  page, six pages were showing the same number meaning two different things to
  the same reader within one scroll. The footer now makes the same pitch without
  a figure.

**If they are the same 40,000:** say so, and the site should state it once,
clearly, and stop counting it twice. The footer gets its number back.

**If they are genuinely two different audiences:** the current split stands, and
we would like a one-line confirmation of which is which so the labels are right.

**Related.** The old footer also claimed the newsletter goes out **weekly**, while
the newsletter page itself carefully avoided saying how often it arrives. We did
not carry the weekly claim over. If it is weekly, we will happily say so: a stated
cadence converts better than a vague one.

---

## 7. Where do people buy the books?

**What ships today.** The three books appear on the about page at `/about/#books`
with their cover art and their full description, as credibility. **There are no
purchase links.** No prices, no cart, no "buy now".

**Why.** Two reasons. First, you told us you are not selling books going forward,
so the store is gone. Second, and separately: there is **no retailer link
anywhere in the old site** for any of the three titles. No Amazon, no Audible, no
Barnes and Noble, no Bookshop, no publisher page. We looked through the whole
mirror. We were not willing to guess at a URL that takes money from your readers.

**If you answer differently.** Send us one link per title and they go straight in
as outbound buttons. Twenty minutes. The field is already in the data waiting for
them, and the site is built to render it the moment it is filled.

This is worth doing. Three books with covers, descriptions and no way to buy them
is a small thing that looks like an oversight to a reader.

---

## 8. The Do Business Better description stops mid-word

**What ships today.** The Do Business Better description on the about page ends at
its last complete sentence.

**Why.** The old product page ended, in full and exactly this far:

> "Do Business Better helps you define success on your terms, then shows you how
> to achieve i"

It was truncated on the live site, mid-word, in the last character. Nothing
completes it: not the page, not the structured data, not the social preview text.
Rather than finish your sentence for you, we stopped at the last complete one.

**If you answer differently.** Send the ending. It is almost certainly
"...then shows you how to achieve it." Five minutes, and it goes straight back in.

---

## 9. Six of the ten podcast sponsor links need confirming

**What ships today.** All ten sponsor logos are on the podcast page, each one
linking to that company's website. That is an improvement on the old page, which
listed the sponsors as plain text with no artwork at all.

**Why we need you.** You supplied four URLs on the old page: Heads Up Plant
Protectants, Tidal Grow, Nano-Yield and Good Agriculture. The other six arrived
as image files with no link. We matched each one to a live official website by
company name and business line rather than guessing from the brand name alone,
but **only you know which company each supplied logo actually belongs to.**

| Sponsor | Link we used | How we matched it |
|---|---|---|
| AgView Solutions | `agviewsolutions.com` | farm transition planning, Rowley, Iowa |
| EarthOptics | `earthoptics.com` | soil data mapping, Minneapolis |
| Harvest Returns | `www.harvestreturns.com` | agriculture investment platform, Fort Worth |
| Life Scientific | `lifescientific.com` | crop protection, Dublin |
| NewFields Ag | `newfieldsag.com` | liquid biologicals and seed treatments, Grand Mound, Iowa |
| Redox Bio | `redoxgrows.com` | plant bio-nutrition, Burley, Idaho |

One technical note on Harvest Returns: the plain `harvestreturns.com` address does
not resolve at all, so the site links to the `www.` version, which does.

**If any of these are wrong:** tell us the right one and it is a two-minute change
per link. These point at other people's businesses from a page that says they
sponsor you, so they are worth getting right.

---

## 10. The three demo reels need transcripts

**What ships today.** The three self-hosted demo reels (Food Waste, Labor,
Innovation) play with no captions and no subtitles.

**Why this matters.** This is **the only accessibility failure left on the site.**
Everything else passes: the site scores zero accessibility violations across every
page at every screen size, and 100 out of 100 in Lighthouse. Captions on
pre-recorded video are a Level A requirement, which is the baseline tier, and
missing captions is the kind of thing that draws a complaint on a site aimed at
associations and public bodies.

**Why it is not fixed.** It is not a code problem. The video player already
supports caption tracks and is waiting for the files. Somebody has to transcribe
three videos.

**What we need.** A transcript of each reel, with rough timings. That can come
from a transcription service for a small amount of money, or from YouTube's
automatic captions if the same footage is on your channel (download the caption
file, correct the errors, send it over). Once we have them it is about two hours
to convert, attach and verify.

**This is the one item on the list we would push you to do.**

---

## 11. The contact form: which provider, and is the key set?

**Rewritten 2026-08-07. The previous version of this item said there was no
contact form on the site. That has not been true for some time.**

**What ships today.** `/contact-us/` carries a real booking form. It posts to a
server route on this site, validates in the browser, announces its result to a
screen reader, and moves focus to the confirmation. The two newsletter signups
still go to Mailchimp exactly as they did before.

**What still needs a decision from you, and it is a launch item.** The endpoint
needs somewhere to deliver to: either a transactional email provider (Resend, a
few dollars a month) or a webhook into whatever you already use. Both are
supported and either is a matter of setting one value in the production
environment.

**What happens if nobody sets it.** Nothing breaks and nothing is lost. The
endpoint answers politely, the form replaces itself with the email address and
the phone number, and the visitor is one click from the same inbox. It is a
slower route to the same place rather than a message that vanishes, which was the
whole reason the old page's form was not carried over.

**Our honest read is unchanged.** For a speaker whose enquiries come from meeting
planners who are used to emailing, a clear address with a stated response
expectation converts about as well as a form and never loses a message. The form
lowers the barrier for somebody browsing on a phone, which is why it is there.

---

## 12. The AV requirements document, found

**Status: resolved. No rewording needed.**

**What we told you before.** That an FAQ answer read "Refer to Damian's AV/and
Room Setup Requirements", that the document was linked nowhere on the old site
and existed nowhere on the new one, and that it was the only answer on the site
asking a reader to do something impossible. We offered you a choice between
sending us the document and approving a reworded answer.

**Neither is needed.** It was in your media library the whole time, at
`AVRoomSetUp2018.pdf`, one page, nine numbered requirements and a signature
block. It ships at `/docs/av-and-room-setup-requirements.pdf` and the FAQ answer
now links straight to it.

**The answer text is unchanged**, including "AV/and", because that string is what
the FAQ structured data serialises and we do not edit your words inside it. The
LINK reads "AV and Room Setup Requirements (PDF)", which is what the label field
exists for.

**Worth knowing:** it is a genuinely good document. Lectern and cordless lapel
mic, a Mac-compatible projector, the audience at least 50% lit, no five-minute
stretch immediately before you take the stage, seat people within six to eight
feet of the front, and no children. That is meeting-planner content most speakers
do not have, and there is a case for putting those nine points on the page as
well as behind the download. Tell us if you want that.

---

## 13. The Granary: what is the show?

**What ships today.** A short section on the XtremeAg page stating the three
things we actually know: it is filmed with XtremeAg, it is filmed in a granary
turned tavern on your Indiana farm, and it lives at `xtremeag.farm/the-granary`.
Plus one dry line about the room and a pointer to go watch it.

**Why it is that short.** Nothing about The Granary exists anywhere on the old
site except a single cross-promotional link. We wrote from exactly those three
facts and nothing else. An earlier draft claimed the show was where "growers say
it out loud" about "what a top operation actually does". Neither of those is
supported by anything, so both are gone.

**What we need.** **One sentence on the format.** The reader currently learns what
room it is filmed in and nothing about the programme. Who is on it, what happens,
how long, how often. One sentence from you and this section becomes genuinely
useful instead of merely accurate.

---

## 14. You can no longer listen to Do Business Better on the site

**What ships today.** Every "listen" on the Do Business Better page leaves the
site for SoundCloud.

**Why.** The old page played a single episode (number 144) from a 33MB audio file
hosted on your own site. Carrying a 33MB file for one episode is a poor trade,
particularly on mobile, and the show's own host serves the same audio for free.

**This is the site's only deliberate reduction in functionality.** Everything else
either stayed or improved, so we are naming it rather than letting you discover
it.

**If you want playback back:** we can build a SoundCloud player that loads only
when a visitor presses play, exactly the way the video embeds on this site
already work. That restores playing on the page without the download cost. It is
about half a day. Say the word.

---

## 15. The reviews page holds ten of the thirteen written testimonials

**What ships today.** The reviews page carries ten written testimonials. Three
more (Wendy J. Ruud, The Titan Pro Team, and Tim Luthy of Helena Chemical) are
quoted on the keynote, speaking and collaboration pages, and appear nowhere on
the reviews page.

**Why.** That is how the old site had them: those three sat on their own pages and
were never collected. We honoured the arrangement rather than reshuffling your
testimonials, and we changed the cross-page links to read "Read the ten written
reviews" so nothing implies the reviews page is the complete set.

**If you want one page with everything on it:** the three move over, the reviews
page goes from ten to thirteen, and the links change to match. Half an hour.

Worth considering. A reviews page that is visibly complete does more work than
one a reader has to assemble from four pages.

---

## 16. Is that a breakout session or a general session?

**What ships today.** One photograph, used on the home page and the meeting
coordinators page, is captioned as a breakout session.

**Why we are asking.** Nothing in the source material identifies it. What we can
see is a hotel ballroom, audience at round banquet tables, you at the front beside
a projection screen. The caption describes them as being "at rounds", which is at
least true of the picture.

**If it is a general session,** both captions change. Five minutes. We would
rather ask than describe your own event back to you incorrectly.

---

## 17. The Food Fear audiobook: three facts would fix it

**Rewritten 2026-08-07. The previous version described a layout that changed.**

**What ships today.** The audiobook does **not** have a card of its own. Food Fear
appears once on `/about/#books`, with both jackets on one card, labelled as print
and audio. The heading over the section says "Two books and an audiobook", which
is accurate.

**Why.** The old audiobook product page had the paperback's description pasted
into it word for word. It never used the word "audiobook" in the body, and it
named no narrator, no runtime and no retailer. Your own note on that page
recorded it: "A shopper cannot tell what they are buying." On two separate store
pages that did not show. Next to each other on one page it printed the same
55-word paragraph twice in one scroll, so the two formats became one entry, which
is the second of the two options the earlier version of this item offered you.

**What we still need, and it is three facts.** The **narrator**, the **runtime**,
and **where it is sold**. Any one of them turns the format label into a real line.
All three and it earns its own card back.

---

## 18. Eight of the nine press items have no date

**What ships today.** The media page lists nine press and broadcast appearances in
the order the old page had them.

**Why not newest first.** Only one of the nine carries a date, and we got that
one out of a Forbes URL. The old page displayed no dates at all, so there is
nothing to sort on.

**If you send us the dates:** the list sorts newest first, which is what a
journalist or a producer expects, and each item can show when it ran. That is
worth doing: an undated press list reads as older than it is.

---

## 19. Two blog posts is the whole archive

**What ships today.** The blog has two posts, which is everything the old site
had. Both are very short (one is seven words, the other is five), and both are
really pointers at coverage published elsewhere. The new post template does the
one thing the originals never did, which is actually link to the piece being
referred to.

**No decision needed.** We are flagging it because a two-post blog with two
five-word posts is a weak signal on a site that otherwise argues you are a
prolific voice, and because the podcast and the newsletter are clearly where the
weekly work goes.

**Options, if it bothers you:** post more, or retire the blog and let the media
page and the podcast pages carry that role. Both are cheap. Doing nothing is also
a legitimate answer.

---

## 20. Things we changed that you may want to change back

Short list, for completeness. All were judgement calls and all are cheap to
reverse.

1. **Em dashes are gone from the whole site,** per your instruction. Four of them
   were inside direct quotes from other people, and we changed those to commas
   and a colon. The meaning is unchanged, but it does mean four quotations are not
   punctuated exactly as the person typed them. Say the word and they go back.
2. **The blog moved into the Media dropdown.** On the old navigation it sat as a
   top-level item right beside the Media parent, whose only real child was the
   media page, so two blog-ish destinations were presented as unrelated peers. It
   is the one page on the site that now costs a reader one extra click.
3. **Two podcast pages had conflicting Spotify links.** The old Business of
   Agriculture page carried two different Spotify show IDs. We consolidated to
   one. If it is the wrong one, tell us.
4. **The sponsor "Tidal Grow" is labelled "Tidal Grow AgriScience"** on the site,
   because the supplied logo is a two-line mark reading "Tidal Grow" over
   "AgriScience" and your own old page linked it as "Tidal Grow Agriscience".
   Say if the short form is preferred.

---

## 21. The old logo is burned into all three demo reels

**What you asked for.** "Please omit the logo that reads: Damian Mason - Business,
Agriculture, Food. This has been changed to the one on his current website."

**What we did.** That logo appears nowhere on the site. Not in the header, not in
the footer, not on any page, and the file itself was never copied into the build.
We check for it automatically and it comes back clean every time.

**The problem.** It is burned into the video. All three demo reels carry a
watermark in the bottom right corner reading **"Damian Mason - BUSINESS ·
AGRICULTURE · FOOD"**, on screen for the whole runtime. We confirmed it by pulling
still frames from each of the three files.

**Why we did not fix it.** Removing it means re-encoding your marketing footage,
either cropping the frame (which changes how every shot is composed) or covering
the corner (which looks like a patch). Neither is our call to make to your video,
and both would cost quality on a re-encode.

**What we need.** One of these:

1. **Re-export the reels from the original edit** with the current wordmark, or
   with no watermark at all. This is the clean fix if whoever cut them still has
   the project file. Send us the new MP4s and we will swap them in.
2. **Tell us to crop it.** We can crop the bottom of the frame. You lose a little
   image and the shots get slightly tighter, but the old logo goes.
3. **Leave it.** It is a small watermark on three demo reels, and the reels are
   there to show Damian working, not to show branding. Nobody is likely to notice
   except you and us. This is a perfectly reasonable answer.

**Our recommendation:** option 1 if the edit still exists, option 3 otherwise. It
is not worth degrading the footage over.

---

## 22. Which seven countries? This one is now visible to visitors

**This is the one item on the list a visitor can see.** Everything else here is
a question between us. This one is printed on the site.

**What ships today.** The speaking page now carries a coverage graphic: fifty
squares, one per state, each with its postal code, so a reader can count the
claim instead of taking it on trust. Underneath it sits a second row of **seven
blank squares** under the heading "7 foreign countries", and a caption that
reads: "Seven more countries, since 1994. Nothing in the record names them, so
these seven run blank."

**Why they are blank.** We searched every file we hold: the extracted text of
all 29 pages of your old site, the page-by-page harvest notes, and the whole
content layer of the new one. **No country is named anywhere.** The only
country name in the entire repository sits in a note about Egg Farmers of
Ontario, and that is a client, not a booking abroad. The number is stated on
five pages; the seven countries themselves are stated on none.

We were not willing to guess at seven countries inside your biography, and we
were not willing to draw seven squares and put made-up flags in them.

**This compounds item 5**, which is still open: your old BoASG page said eight
foreign countries and every other page said seven. So the count is unconfirmed
and the members of the set are unknown.

**If you answer.** Send the list, in any form, and the seven blanks become seven
labelled tiles reading CANADA, MEXICO and so on. About twenty minutes. It is
worth doing: seven named countries is a materially better credential than the
number seven, and right now the graphic is honest about a gap rather than
carrying the claim.

**If you would rather not**, say so and we will drop the second register
entirely and leave the graphic at fifty states. Also about twenty minutes. What
we will not do is invent them.

---

## 23. Six career milestones have no year on them

**What ships today.** The about page now carries a short dated spine under the
credentials: **1994**, when you quit the Fortune 500 job, **2023**, when the
keynote got its name, and where it stands today. Under it, a line that says the
record has no year for the Purdue degree, Second City, the Screen Actors Guild
card, either book, or any of the three podcasts.

**Why it is only three entries long.** Those are the only dates that exist. We
searched the whole mirror of your old site for a four-digit year: 1994 appears
five times, 2023 appears as the year you titled the programme, and everything
else that looks like a date is either a WordPress publish stamp on the page
itself or a number inside somebody else's story. There is no graduation year, no
publication year for either book, and no launch date for any of the three shows.

**Why we did not fill them in.** A timeline is a claim about when things
happened. Six invented dates inside your own biography is exactly the kind of
detail nobody checks until somebody does.

**If you send the years.** Any of the six, in any order. Each one you send moves
that entry onto the spine automatically, in the right place, with no rebuilding:
the page is already built to do it. Five minutes per date.

**Most useful first:** the two book publication years and the year The Business
of Agriculture launched. Those three would turn a three-point line into a real
thirty-year arc, which is the strongest version of this credential and the one a
meeting planner reads fastest.

---

## 24. The Success Group has no member testimonial

**New item, added 2026-08-07.**

`/boasg/` is the one page on the site that asks somebody to pay a monthly
subscription, and it is the only page with no social proof of any kind on it. The
page now has a photograph of you, a ledger of how the calls run, both leaders'
credentials and the two lists of what a member gets and does not get. What it
does not have is one member saying it was worth it.

**Why we did not borrow one.** There are seventeen testimonials on the site and
every one of them is about a speaking engagement. Putting a keynote review on a
membership page would read as a member endorsing the group, which is not what any
of those people said.

**What we need.** One sentence from one member, with a name and a business. That
is the single highest-value thing missing from that route, and it is worth more
than anything else we could build on it.

---

## 25. The rescued podcast back catalogue

**New item, added 2026-08-07, and it is a question rather than a problem.**

The WordPress library also holds about fifty `.mp3` files: episodes of The
Business of Agriculture, self-hosted on the old site. They are not on the new
one, deliberately, because the show streams from Libsyn and SoundCloud and the
site self-hosts no audio.

**They will go when the hosting does.** Damian holds the masters, so this is
probably nothing, but it is worth ten minutes of somebody's time to check two
things: whether any episode in that folder is missing from the Libsyn feed, and
in particular whether Do Business Better episode 144 is one of them, since item
14 records that as the one thing the rebuild dropped.

We have not copied them into the repository. Fifty podcast episodes carry guest
voices and possibly licensed music beds, and archiving them privately is a
different decision from republishing them.

---

## Summary: the five we would most like answers to

**Rewritten 2026-08-07.** Two of the five that used to be on this list are now
answered, and both were answered out of your own WordPress media library rather
than by us building anything: the professional photography and the AV document
were there the whole time. What is left is genuinely things only you know.

1. **Item 1**, the BoASG button, because it is the one instruction we could not
   resolve and it involves your money.
2. **Item 10**, the video transcripts, because it is the only accessibility
   failure left on the site. Everything else passes.
3. **Item 7**, the book purchase links, because three books with no way to buy
   them looks like a mistake.
4. **Item 6**, the two 40,000s, because a number the site states about itself
   should be one number with one meaning.
5. **Item 24**, a member testimonial for the Success Group, because it is the
   only page on the site asking for money with nothing on it from anybody who
   has paid.

**And one more, still:** **item 22**, the seven countries. It is the only
question on this list a visitor to the site can see: it ships as seven blank
squares and an honest caption. Naming them turns a gap into a credential.

**Two smaller ones that block a wall each:** the display name for the **Iowa Pork
Producers Association** and for **Egg Farmers of Ontario**, both in item 2. A logo
wall label is what a screen reader announces, so it should be the name the
organisation actually uses.

**And one that is a launch risk rather than a question:** item 11. The contact
form ships and works, but it needs a delivery provider in the production
environment. Without one it answers cleanly and replaces itself with the email
address and phone number, so nothing is lost, but nobody gets a form submission
either.

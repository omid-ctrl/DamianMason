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

## 2. John Deere, BASF, Helena and IPPA

**What ships today.** The client logo wall shows the **21 logos you supplied** in
the `Client Logos` folder, on the home page, the speaking page and the reviews
page. That replaces the six the old site showed.

Four names that were on the old wall are **not** in the folder you supplied:
**John Deere, BASF, Helena** and the **Iowa Pork Alliance (IPPA)**. They do not
appear anywhere on the new site.

**Why.** Your instruction was "update client logos with logos in folder", and we
took the folder as the definitive list rather than merging it with whatever the
old site happened to be showing. We did keep the artwork: the four marks are
sitting in the repository, unused, so nothing has to be re-sourced if you want
them back.

**If you answer differently.** Two options and both are quick:

- **Keep them:** we already have usable files for all four. Adding them back is
  about half an hour, and the wall goes from 21 marks to 25. Three short lines of
  page copy that currently say "and 16 more" and "21 of 2,400+" would move with
  it.
- **Send better files:** if you would rather supply current, higher-resolution
  versions, drop them in the folder and it is the same half hour.

**Related, smaller question:** one of the 21 supplied marks reads "get cracking.
Egg Farmers of Ontario" in the artwork, but we have it labelled simply "Egg
Farmers" because that is how the file was named. Should the wall say **Egg
Farmers of Ontario**? That label is also what a screen reader announces.

---

## 3. The Media Kit

**What ships today.** Nothing. Both Media Kit links have been removed, as you
asked.

**Why.** The old link pointed at a raw `.zip` file sitting on the WP Engine
staging domain (`damianmason.wpengine.com`). That is not a media kit, it is a
download of unknown contents on a URL that will stop working when the old hosting
is switched off. You asked for the link to be removed, and it is.

**The opportunity.** There is now no single asset a meeting planner can download
that carries your bio, your topics, your credentials, your headshots, your client
list and your booking contact in one place. Every one of those things exists on
the site, and several are already written and laid out. Building a proper
**speaker one-sheet** as a designed PDF, drawn from the material already on
`/keynote/` and `/meeting-coordinators/`, is roughly a day of work and is the
single highest-value thing you could add to a booking page.

**If you want it:** say so, and tell us whether it should be a download or a page.
A page is better for search; a PDF is better for forwarding to a committee.
Doing both is barely more work than doing one.

---

## 4. Professional photography

This is the honest answer to "what would make the site better from here", and it
is not more engineering.

**What ships today.** Every photograph on the site is an existing image of yours,
cleaned up, resized and colour-managed. They are used carefully: the strongest
ones lead the pages, and the weak ones are small or absent.

**What we dropped.** Several images on the old site were **literal macOS
screenshots**, including all six press images on the media page, both blog post
header images, and a number of others. A screenshot of somebody else's web page
is not a photograph and cannot be made into one, so instead of reusing them we
redesigned those slots to work typographically: a real headline, a real link, a
ruled card. Those pages look better for it, but they are working around a gap.

**One image we did keep, with a caveat.** The picture of you with the XtremeAg
growers in the cornfield is a frame grab off a broadcast, not a photograph, and
it carries a burned-in "DAMIAN MASON / CUTTING THE CURVE PODCAST" lower third in
the bottom right corner. It ships because it is the only image on file of you
with that group. We can crop the lower third out, or replace it.

**What we would ask for, in priority order:**

1. **Two or three current headshots**, shot against a clean background, one
   horizontal and one vertical. These carry the home page, the about page and
   every social share card.
2. **Live-event photography from the back of the room**, showing you on stage
   with the audience in frame. This is what a meeting planner is actually buying,
   and the site is running on a handful of usable frames of it.
3. **One farm image**, because the Indiana farm is a real differentiator that the
   copy leans on and the imagery cannot support.

**If you commission it:** dropping new photographs in is straightforward, roughly
an hour per image including the alt text and the layout check. The lift in
perceived quality is larger than anything left on the engineering side.

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

## 11. There is no contact form anywhere on the site

**What ships today.** The site has no form that takes a typed message. Every
enquiry route is an email link. The contact page spells out, in plain language,
the five things to put in a first email. The collaboration page closes on
"Contact Damian" and "Email the office".

The only forms on the site are the two newsletter signups, which go to Mailchimp
exactly as they did before.

**Why.** Your old collaboration page had a four-field enquiry form (email, name,
phone, message) that submitted to WordPress. This site has no server, so that
form has nowhere to submit to. A form that looks real and silently loses
enquiries is far worse than no form.

**If you want one back.** It needs a hosted form service. Formspree, Basin and
the equivalent all cost a few dollars a month and take about half a day to wire
in and test. That is a decision about a service and a recurring cost, which is
yours to make rather than ours.

**Our honest read:** for a speaker whose enquiries come from meeting planners who
are used to emailing, a clear email address with a stated response expectation
converts about as well as a form and never loses a message. But a form does lower
the barrier for someone browsing on a phone.

---

## 12. One FAQ answer points at a document nobody can reach

**What ships today.** An FAQ answer reads, word for word from your old site:
"Refer to Damian's AV/and Room Setup Requirements."

**The problem.** That document is not linked anywhere on the old site and does not
exist anywhere on the new one. A meeting planner who follows that instruction has
nowhere to go. It is the only answer on the site that asks the reader to do
something impossible.

**Two ways out, your choice.**

- **Send us the AV one-sheet** and we link it directly from the answer. Best
  outcome: the planner gets the document at the moment they ask for it.
- **Approve this rewording:** "Damian's office will send the AV and room setup
  requirements with the contract." Your meeting coordinators page already says
  much the same thing in its own words, so this is consistent with the rest of
  the site.

(For the record, "AV/and Room Setup Requirements" also reads like a typo in the
original. We left it as you wrote it.)

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

## 17. The Food Fear audiobook has no description of its own

**What ships today.** The audiobook has its own card on the about page with its
cover, and in place of a description it carries one line: "The same book as the
print edition above, read aloud."

**Why.** The old audiobook product page had **the paperback's description pasted
into it word for word**. It never used the word "audiobook" anywhere in the body,
and it named no narrator, no runtime and no retailer. Your own harvest note on the
old page recorded it: "A shopper cannot tell what they are buying."

On the old site that did not show, because the two descriptions were on two
separate store pages. On the new about page the two cards are next to each other,
so the same 55-word paragraph was printing twice within one scroll.

**Send one line and it goes straight in.** The three facts worth having are the
narrator, the runtime, and where it is sold. Any one of them replaces the note.

**Or:** if you would rather the audiobook stopped being its own entry, it becomes
a second format label on the print edition and the heading changes from "Two books
and an audiobook" to "Two books". Twenty minutes either way.

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

## Summary: the five we would most like answers to

If you only have time for a few, these are the ones that change the most:

1. **Item 1**, the BoASG button, because it is the one instruction we could not
   resolve and it involves your money.
2. **Item 10**, the video transcripts, because it is the only accessibility
   failure left on the site.
3. **Item 7**, the book purchase links, because three books with no way to buy
   them looks like a mistake.
4. **Item 4**, professional photography, because it is the single largest
   remaining lift in quality and no amount of further engineering substitutes for
   it.
5. **Item 6**, the two 40,000s, because a number the site states about itself
   should be one number with one meaning.

**And one more, added late:** **item 22**, the seven countries, because it is now
the only question on this list that a visitor to the site can see. It ships as
seven blank squares and an honest caption. Naming them turns a gap into a
credential.

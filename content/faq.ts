/**
 * Booking FAQ, harvested verbatim from the old damianmason.com.
 *
 * Source of truth: `_source/pages/{home,keynote,meeting-coordinators}.md`,
 * verified against `_source/html/*.html`. Never `_source/extracted/*.txt`.
 *
 * COUNT: 13. The old site rendered 45 raw accordion toggles across three
 * pages (home 16, keynote 13, meeting-coordinators 16). Five of those are junk
 * and five are wording variants of questions that appear elsewhere, leaving 14
 * distinct real questions. Removing the products question, which the client
 * asked to be taken off the site, leaves the 13 below. That matches
 * `_source/manifest.json` (faqItems 14, faqItemsCarriedOver 13) and the
 * Corrections table in docs/build/STATE.md.
 *
 * EXCLUDED ON PURPOSE (6 items):
 *   1. "DO YOU HAVE PRODUCTS FOR SALE?" on all three pages. Client request:
 *      commerce is gone from this site, so the question goes with it.
 *   2. An accordion item on the home page with an empty title AND an empty
 *      answer, which the old page rendered OPEN by default.
 *   3. "Your Title Goes Here" on the home page: an unedited Divi placeholder,
 *      also rendered OPEN by default.
 *   4 and 5. Two byte-identical Lorem Ipsum toggles on
 *      /meeting-coordinators/ ("Incidunt ut labore et dolore magnam?").
 *   6. "WHAT ARE THE TECHNOLOGY REQUIREMENTS?" on /keynote/, whose answer div
 *      was completely empty. The same question has a real answer on the home
 *      page and on /meeting-coordinators/, and that real answer is used below.
 *
 * DIVERGENT WORDING, resolved. Two questions shipped with different wording
 * per page. The cleanest phrasing wins and the variants are recorded here:
 *   - Booking and travel expenses. Home said "HOW DO YOU MANAGE BOOKING AND
 *     TRAVEL AND TRAVEL EXPENSES?" with "travel" duplicated. Keynote said
 *     "HOW DO YOU MANAGE BOOKING TRAVEL & TRAVEL EXPENSES?" with an ampersand.
 *     Meeting Coordinators said "HOW DO YOU MANAGE BOOKING TRAVEL AND TRAVEL
 *     EXPENSES?". The Meeting Coordinators wording is used, which also fixes
 *     the duplicated word. The answer is identical on all three pages.
 *   - Technology. Home and Meeting Coordinators said "WHAT ARE YOUR TECHNOLOGY
 *     REQUIREMENTS?", keynote said "WHAT ARE THE TECHNOLOGY REQUIREMENTS?".
 *     "your" is used, and see exclusion 6 above for the answer.
 *
 * QUESTION CASING: the old site set every question in all caps. That is
 * styling, not content, so questions are sentence-cased here. A component may
 * re-case them. Answers are untouched, including the double spaces after some
 * sentence periods and the em dash in the presentation-content answer, which
 * is flagged for a later phase to decide on.
 *
 * KNOWN CONTENT DEFECTS carried through verbatim, for a later phase to fix
 * with the client rather than for this file to invent around:
 *   - "AV/and Room Setup Requirements" reads like a typo, and the document it
 *     refers to is not linked anywhere on the old site.
 *   - "pre recorded" is unhyphenated, and "pre-ordered/ pre-purchased" had the
 *     space on the wrong side, in the removed products answer.
 *   - The YouTube channel URL sits inline in the answer text as bare text. It
 *     needs to become a real link when this renders.
 *
 * `topics` drives per-route filtering. Keys in use: booking, travel,
 * technology, program, audience, fees.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  topics: string[];
};

export const faq: FaqItem[] = [
  {
    id: 'speaking-fees',
    question: 'What are your speaking fees?',
    answer:
      'Fees are quoted at the time of the inquiry. Damian’s fees are NET to him. Damian has been speaking to audiences for almost 30 years. He is well known and appreciated in the Agribusiness industry. His fees reflect that experience and attention to detail.',
    topics: ['fees', 'booking'],
  },
  {
    id: 'booking-travel-expenses',
    question: 'How do you manage booking travel and travel expenses?',
    answer:
      'Damian books all of his airfare and car rental. Damian charges a set Travel Fee to cover these travel expenses, gratuity and meals which is quoted up front. His hotel stay is booked and paid for by the client.',
    topics: ['booking', 'travel', 'fees'],
  },
  {
    id: 'where-do-you-travel',
    question: 'Where do you travel?',
    answer: 'Wherever the client’s event is scheduled.',
    topics: ['travel', 'booking'],
  },
  {
    id: 'presentation-length',
    question: 'How long is your presentation?',
    answer: 'Presentations typically run between 60 – 90 minutes in length.',
    topics: ['program'],
  },
  {
    id: 'multi-day-events',
    question: 'Are you available for multi-day events?',
    answer: 'Yes. Rates may vary depending on time/date of the events.',
    topics: ['booking', 'program'],
  },
  {
    // FLAGGED: the only answer on the site containing an em dash. Kept
    // verbatim, in the phrase 'the program The "Ations" of Agriculture'.
    id: 'presentation-content',
    question: 'How would you describe your presentation content?',
    answer:
      'Damian’s presentation is a forward looking outlook about issues in the marketplace that will be impacting the business of Agriculture.  It is fast paced, humor infused Ag commentary where he connects the dots from consumer issues to regulation to political movements to societal changes and current events and what it means for our industry.  Also, he puts in a bit of feel good facts about the industry.  And, he provides business reality and opportunity coverage, always bringing the issues back to the crowd and making it about them. Beginning 2023 Damian titled the program The “Ations” of Agriculture, addressing the words ending in “ation” that impact our industry:  Immigration, population, regulation, confrontation, inflation, threats from other nations.',
    topics: ['program', 'audience'],
  },
  {
    id: 'sample-preview',
    question: 'Can we get a sample/preview of your presentation?',
    answer:
      'Yes, video links may be found on Damian’s Youtube channel (https://www.youtube.com/@DamianMasonChannel/videos), or viewed on his website.',
    topics: ['program'],
  },
  {
    id: 'delivery-style',
    question: 'How would you describe your presentation delivery style?',
    answer:
      'A forward looking futurist meets an agricultural economist – delivered with humor. Damian’s style makes his presentation entertaining, informative and memorable for your audience.',
    topics: ['program', 'audience'],
  },
  {
    id: 'technology-requirements',
    question: 'What are your technology requirements?',
    answer: 'Refer to Damian’s AV/and Room Setup Requirements.',
    topics: ['technology'],
  },
  {
    id: 'record-or-photograph',
    question: 'Can we record or photograph your presentation?',
    answer: 'Yes, as long as Damian receives a copy of the content to use as well.',
    topics: ['technology', 'program'],
  },
  {
    id: 'break-outs-luncheons-panels',
    question: 'Are you available for break-outs, luncheons, or panel discussions?',
    answer:
      'Absolutely. The only caveat is that Damian will not speak while people are eating or tables are being cleared.',
    topics: ['program', 'booking'],
  },
  {
    id: 'promote-our-event',
    question: 'Will you help us promote our event?',
    answer:
      'Yes, Damian will work with you to help you make it a success. For example: Local Radio interviews are welcomed, Podcast guests, and short introductory videos may be pre recorded for your event. Headshots and Bio are available for your use for your own marketing efforts as well.',
    topics: ['audience', 'program'],
  },
  {
    id: 'book-directly-or-bureau',
    question: 'Should I book directly or through a bureau?',
    answer:
      'Damian books most of his events directly with his clients. A simple contract and small fraction of the total fee is required as a deposit to confirm the contracted date. The remaining fee is due at the time of the event. We do have a few bureaus whom we have successfully worked with over the years, but we do not endorse them. We find great success in booking directly with the client.',
    topics: ['booking', 'fees'],
  },
];

/** Every FAQ item that carries at least one of the given topics, in file order. */
export const faqByTopic = (...topics: string[]): FaqItem[] =>
  faq.filter((item) => item.topics.some((topic) => topics.includes(topic)));

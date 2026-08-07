/**
 * Book credibility content for /about/#books.
 *
 * Harvested verbatim from the retired WooCommerce product pages on the old
 * damianmason.com. Commerce has been removed from this site, so:
 *   - NO prices appear in this file and none may be rendered from it.
 *   - NO cart, quantity, or checkout affordance may be built from it.
 *   - `forSale` is false on every entry; these are credibility items only.
 *
 * The Business of Ag Success Group is deliberately absent. It was sold as a
 * WooCommerce product on the old site but it is a membership, not a book, and
 * it maps to the join CTA on /boasg/.
 *
 * `cover` values are filenames exactly as they exist in _source/media/.
 *
 * OPEN ITEM: the old site contained no outbound retailer link for any title
 * (no Amazon, Audible, Barnes & Noble, Bookshop, or publisher URL appears
 * anywhere in the mirrored source), so every `buyUrl` is an empty string and
 * must be filled in before the books block ships with live purchase links.
 *
 * OPEN ITEM: the Do Business Better description below is reproduced verbatim
 * from the old site, where it was truncated mid-word and ends at "how to
 * achieve i". The client must supply the complete final sentence.
 */

export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  format: 'paperback' | 'audiobook';
  description: string;
  cover: string;
  buyUrl: string;
  buyLabel: string;
  forSale: boolean;
};

export const books: Book[] = [
  {
    slug: 'food-fear',
    title: 'Food Fear',
    subtitle:
      'How Fear is Ruining Your Dinner and Why You Should Celebrate Eating',
    format: 'paperback',
    description:
      'From the history of food production to today’s food fights to the future of eating, FOOD FEAR is the lively dinner conversation we all need to have. Damian Mason combines his farm background, Agricultural education, and industry expertise with wit and edge. The result: a food book that is factual, informative, and entertaining.',
    cover: 'FoodFear-Mockup-Online-Store.png',
    buyUrl: '',
    buyLabel: 'Buy the book',
    forSale: false,
  },
  {
    slug: 'food-fear-audiobook',
    title: 'Food Fear (Audiobook)',
    subtitle:
      'How Fear is Ruining Your Dinner and Why You Should Celebrate Eating',
    format: 'audiobook',
    // Verbatim from the old audiobook product page, which reused the print
    // edition's description word for word and never mentioned audio.
    description:
      'From the history of food production to today’s food fights to the future of eating, FOOD FEAR is the lively dinner conversation we all need to have. Damian Mason combines his farm background, Agricultural education, and industry expertise with wit and edge. The result: a food book that is factual, informative, and entertaining.',
    cover: 'FOOD-FEAR-AUDIOBOOK-STORE.png',
    buyUrl: '',
    buyLabel: 'Get the audiobook',
    forSale: false,
  },
  {
    slug: 'do-business-better',
    title: 'Do Business Better',
    subtitle: 'Traits, Habits, and Actions to Help You Succeed',
    format: 'paperback',
    // Verbatim, including the truncation at the end. See OPEN ITEM above.
    description:
      'Build your best life by forging your own path to business success\n\nAfter speaking to companies such as Merck, Land O’Lakes, and Cargill, and 2,000 audiences across the world, Damian Mason, successful businessman, agriculturalist, podcaster, and writer, wants to help you achieve your entrepreneurial goals and live a better life. While other business books claim to tell you how to reach success, they fall short because they don’t address the fact that success is different for each of us. Do Business Better helps you define success on your terms, then shows you how to achieve i',
    cover: 'dbb-online-store.png',
    buyUrl: '',
    buyLabel: 'Buy the book',
    forSale: false,
  },
];

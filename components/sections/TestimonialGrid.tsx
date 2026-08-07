import type { Testimonial } from '@/content/testimonials';
import { Quote, cx } from '@/components/ui';

export type TestimonialGridColumns = 1 | 2 | 3;

export type TestimonialGridProps = {
  /** Already-filtered testimonials. Use `testimonialsFor(route)` upstream. */
  items: Testimonial[];
  /**
   * grid     the multi-column wall, one ruled row per quote.
   * featured a single pull quote, for a hero band or a section opener.
   */
  variant?: 'grid' | 'featured';
  /** Ignored by the featured variant. */
  columns?: TestimonialGridColumns;
  /**
   * featured only. Adds the orange leading bar from the Quote primitive, which
   * counts against the three orange elements a viewport is allowed. At most
   * one barred quote per screen, and never alongside a primary button.
   */
  barred?: boolean;
  /** Names the list for assistive tech when the section heading sits elsewhere. */
  label?: string;
  /**
   * featured only. Picks a specific quote by id instead of the first entry
   * flagged `featured`.
   */
  featuredId?: string;
  className?: string;
};

const COLUMN_CLASS: Record<TestimonialGridColumns, string> = {
  1: '',
  2: 'dm-testimonials--2',
  3: 'dm-testimonials--3',
};

/**
 * Builds the byline from the three attribution fields, comma separated.
 *
 * Two harvested quotes shipped with no attribution at all and carry an empty
 * `name`, so an empty string has to mean "render no byline" rather than
 * "render an empty figcaption".
 */
function attributionOf(item: Testimonial): string | undefined {
  const parts = [item.name, item.title, item.organization]
    .map((part) => (part ?? '').trim())
    .filter((part) => part.length > 0);

  return parts.length > 0 ? parts.join(', ') : undefined;
}

/**
 * Row height in a CSS grid is set by the tallest cell in the row, and a
 * harvested testimonial wall runs from one line to sixteen. On /reviews/ that
 * put a 10-line quote from Michael Foods next to the 2-line unattributed one
 * and left about 330px of bare bone under the short cell, four times down the
 * page, on the one route a meeting planner opens to check social proof.
 *
 * There is no masonry to reach for here: `grid-template-rows: masonry` is not
 * shipping, and DESIGN_SYSTEM section 10 rule 9 rules out CSS multicolumn.
 * What is left is to stop pairing extremes. Sorting by length descending puts
 * the longest quote beside the second longest and the shortest beside the
 * second shortest, so the gap inside any one row is the difference between
 * neighbours in a sorted list rather than the full range of the set.
 *
 * The wall carries no ranking and no chronology, so its order is presentation,
 * not meaning. The sort is stable on equal lengths, so the source order still
 * decides ties and the output is deterministic on the server.
 */
function balanceByLength(items: Testimonial[]): Testimonial[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.quote.length - a.item.quote.length || a.index - b.index)
    .map((entry) => entry.item);
}

/**
 * Testimonials, on the real quotation primitive.
 *
 * The old site faked its attributions with Squarespace markup pasted into Divi
 * text modules: a `<div class="source">` under a `<blockquote>`, with no
 * `<figure>` and no `<figcaption>` anywhere, and one of those attributions was
 * hard-coded white on a light ground and therefore invisible. Every quote here
 * is a real `<figure>` with a real `<figcaption>`, and the caption color comes
 * from `.dm-quote__attribution` (--ink-muted, 5.74:1 on bone, 8.04:1 on navy),
 * so it cannot go invisible in any surface scope.
 */
export function TestimonialGrid({
  items,
  variant = 'grid',
  columns = 2,
  barred = false,
  label,
  featuredId,
  className,
}: TestimonialGridProps) {
  const usable = items.filter((item) => item.quote.trim().length > 0);
  if (usable.length === 0) return null;

  if (variant === 'featured') {
    const featured =
      (featuredId ? usable.find((item) => item.id === featuredId) : undefined) ??
      usable.find((item) => item.featured) ??
      usable[0];

    return (
      <Quote
        wide
        barred={barred}
        attribution={attributionOf(featured)}
        className={cx('dm-testimonials__featured', className)}
      >
        {featured.quote}
      </Quote>
    );
  }

  // One column has no neighbour to be out of step with, so it keeps the order
  // the quotes were harvested in.
  const ordered = columns > 1 ? balanceByLength(usable) : usable;

  return (
    <ul
      className={cx('dm-testimonials', COLUMN_CLASS[columns], className)}
      aria-label={label}
      data-reveal="stagger"
    >
      {ordered.map((item) => (
        <li key={item.id} className="dm-testimonials__item">
          <Quote wide attribution={attributionOf(item)}>
            {item.quote}
          </Quote>
        </li>
      ))}
    </ul>
  );
}

export default TestimonialGrid;

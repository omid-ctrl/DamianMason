import Image from 'next/image';
import type { PressItem } from '@/content/press';
import { sharedImageAlt } from '@/content/image-alt';
import { Card, Eyebrow, Heading, cx } from '@/components/ui';

export type PressListProps = {
  /** The nine carried-over press items. */
  items: PressItem[];
  /** Keeps only the items of these kinds, for a filtered block. */
  types?: PressItem['type'][];
  /** Caps the list, for a "recent coverage" teaser. */
  limit?: number;
  /** Heading rank per item. Appearance stays fixed at --fs-lg. */
  headingLevel?: 2 | 3 | 4;
  /** Names the list for assistive tech when the section heading sits elsewhere. */
  label?: string;
  /**
   * Renders the left rail on the items that carry a `thumb`. Default on.
   *
   * Set it off where the page already shows the same frame somewhere else,
   * which is the post template's source block. It does NOT control whether an
   * item has a thumb: four of the nine have none, they never get a rail, and
   * they never get a placeholder in place of one.
   */
  thumbs?: boolean;
  className?: string;
};

const TYPE_LABEL: Record<PressItem['type'], string> = {
  article: 'Article',
  podcast: 'Podcast',
  video: 'Video',
  tv: 'TV',
};

/**
 * Formats an ISO date without dragging the server's timezone into the render.
 * Anything that is not a parseable date renders exactly as it was harvested.
 */
function formatDate(value: string): { label: string; dateTime?: string } {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { label: value };

  return {
    label: new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsed),
    dateTime: parsed.toISOString().slice(0, 10),
  };
}

/**
 * Press and media coverage, on the broadsheet ruled row.
 *
 * Every link leaves the site, so every link carries
 * `rel="noopener noreferrer"` and says so to a screen reader rather than
 * relying on a visual convention.
 *
 * FIVE OF THE NINE ROWS CARRY A FRAME, and the other four are the same
 * typographic row they always were. The rail is a grid track that only exists
 * on a row that has something to put in it, so a row without a thumb is not a
 * row with an empty column: it is the original row, unchanged, and it does not
 * get a grey rectangle to keep the set tidy.
 */
export function PressList({
  items,
  types,
  limit,
  headingLevel = 3,
  label,
  thumbs = true,
  className,
}: PressListProps) {
  const rendered = items
    .filter((item) => (types ? types.includes(item.type) : true))
    .slice(0, limit ?? items.length);

  if (rendered.length === 0) return null;

  return (
    <ul className={cx('dm-press', className)} aria-label={label} data-reveal="stagger">
      {rendered.map((item) => {
        const date = item.date ? formatDate(item.date) : undefined;
        const thumb = thumbs ? item.thumb : undefined;

        return (
          <Card
            as="li"
            variant="ruled"
            key={item.id}
            id={item.id}
            className="dm-press__item"
          >
            {/* The layout div rather than the Card itself, because .dm-card
                sets flex-direction and it is declared after this file in the
                cascade. Same shape and same reason as .dm-episode__layout. */}
            <div className={cx('dm-press__layout', thumb && 'dm-press__layout--framed')}>
              {/* A card thumbnail per the 1:1 row of DESIGN_SYSTEM 6.3, not a
                  captioned figure per 6.1, and the same call EpisodeCard makes
                  for the same role. The cutline rule exists so a photograph
                  cannot arrive without something saying what it is; here the
                  outlet, the medium, the headline and the date are all one
                  grid column to the right of the frame, and a caption under it
                  would restate the headline it is sitting beside. */}
              {thumb ? (
                <div className="dm-photo dm-press__thumb">
                  <Image
                    className="dm-photo__img"
                    src={thumb.src}
                    /* Inline where this list is the file's one call site, from
                       content/image-alt.ts where it is not. The type's note in
                       content/press.ts says which is which. */
                    alt={thumb.alt ?? sharedImageAlt(thumb.src)}
                    width={thumb.width}
                    height={thumb.height}
                    loading="lazy"
                    /* The rail is --size-thumb, 10rem at its widest. */
                    sizes="10rem"
                  />
                </div>
              ) : null}

              <div className="dm-press__body">
                <div className="dm-press__head">
                  {/* The muted eyebrow, not the accent one. The outlet name is
                      not clickable, and in --ink-accent it was set in the exact
                      colour --link-ink uses, so on /blog-news/ twelve rows put
                      the site's link orange on the one word in each row that is
                      not a link while the row's only real link sat under it in
                      navy. It now reads as what it is: metadata, on the same
                      ink as the type badge beside it and the date below it. */}
                  <Eyebrow>{item.outlet}</Eyebrow>
                  <span className="dm-press__badge">{TYPE_LABEL[item.type]}</span>
                </div>

                <Heading level={headingLevel} size="lg" className="dm-press__title">
                  <a
                    className="dm-press__link dm-link-bare"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Heading>

                {date?.dateTime ? (
                  <time className="dm-press__date" dateTime={date.dateTime}>
                    {date.label}
                  </time>
                ) : date ? (
                  // A <time> without a machine-readable value is invalid, so an
                  // unparseable harvested date stays plain text.
                  <span className="dm-press__date">{date.label}</span>
                ) : null}
              </div>
            </div>
          </Card>
        );
      })}
    </ul>
  );
}

export default PressList;

import type { PressItem } from '@/content/press';
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
 */
export function PressList({
  items,
  types,
  limit,
  headingLevel = 3,
  label,
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

        return (
          <Card as="li" variant="ruled" key={item.id} className="dm-press__item">
            <div className="dm-press__head">
              <Eyebrow tone="accent">{item.outlet}</Eyebrow>
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
          </Card>
        );
      })}
    </ul>
  );
}

export default PressList;

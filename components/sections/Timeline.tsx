import type { ReactNode } from 'react';

import { Eyebrow, Heading, Prose, cx } from '@/components/ui';
import type { HeadingLevel } from '@/components/ui';
import { datedMilestones, undatedMilestones } from '@/content/timeline';

/**
 * The spine: the dated record, as an ordered list.
 *
 * THIS IS NOT AN SVG AND MUST NOT BECOME ONE. What it renders is a sequence of
 * dated events, and a sequence is what an `<ol>` already is. As text it reflows
 * at 390, it wraps, it inherits the type scale, it is searchable, it is
 * translatable, and it needs no accessible-name workaround. Reach for a drawing
 * when the SHAPE carries the meaning. Here the ORDER carries it, and the order
 * is free.
 *
 * For the same reason there is no `role="img"` on this component and there must
 * not be: role="img" makes a subtree presentational, so putting it on an
 * ordered list of text would delete the very semantics the list exists to
 * carry. SC 1.1.1 has nothing to satisfy here, because there is no non-text
 * content: the spine is a border and the ticks are `::before` pseudo-elements.
 *
 * WHY IT IS THIS SHORT, AND WHY THE REGISTER IS A SENTENCE RATHER THAN A LIST.
 * Nine things belong on this spine and exactly two of them carry a year
 * anywhere in the source; a third is a running total with no as-of date. See
 * the header of content/timeline.ts. The other six are already printed on
 * /about/ at full size: Purdue, Second City and the Screen Actors Guild appear
 * in the biography prose AND again as bullets in the credential bar directly
 * above this component, and both books get a card of their own two sections
 * below. Rendering them a third time as undated ticks would be the page
 * repeating itself with a rule drawn down the side of it. So the register names
 * them in one honest sentence, generated from the same data, and any entry that
 * gains a `year` promotes itself onto the spine with no change here.
 */

export type TimelineProps = {
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Rank, independent of size. Defaults to h3, because this sits under an h2. */
  level?: HeadingLevel;
  intro?: ReactNode;
  className?: string;
};

/** The rail label for the one entry that is a standing state, not an event. */
const STANDING_LABEL = 'Today';

/**
 * Serial comma, per VOICE.md section 3. The source is inconsistent about it and
 * the rebuild standardized on having one.
 */
function series(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function Timeline({ id, eyebrow, title, level = 3, intro, className }: TimelineProps) {
  const headingId = id ? `${id}-title` : undefined;
  const undated = series(undatedMilestones.map((entry) => entry.short));

  return (
    <div id={id} className={cx('dm-spine', className)}>
      {eyebrow || title ? (
        <div className="dm-spine__head">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {title ? (
            <Heading level={level} size="lg" id={headingId}>
              {title}
            </Heading>
          ) : null}
        </div>
      ) : null}

      {intro ? (
        <Prose className="dm-spine__intro">
          {typeof intro === 'string' ? <p>{intro}</p> : intro}
        </Prose>
      ) : null}

      <ol className="dm-spine__list">
        {datedMilestones.map((entry) => (
          <li key={entry.id} className="dm-spine__item">
            <p className="dm-spine__rail">
              {/* A <time> only where a source states the year in words. The
                  standing entry gets none: the source gives the running total
                  without ever saying as of when, and a datetime attribute would
                  invent that date in a machine-readable field. */}
              {entry.year ? <time dateTime={entry.year}>{entry.year}</time> : STANDING_LABEL}
            </p>
            <p className="dm-spine__title">{entry.title}</p>
            <p className="dm-spine__detail">{entry.detail}</p>
          </li>
        ))}
      </ol>

      {undatedMilestones.length > 0 ? (
        <div className="dm-spine__undated">
          <Eyebrow as="p">Dates still to confirm</Eyebrow>
          {/* The list is generated, so this sentence cannot drift from the data
              it describes. The two halves around it are the honesty, in the
              cutline register: two true things, and stop. */}
          <p className="dm-spine__undated-body">
            Dates are still to be confirmed for: {undated}. Each belongs in the chronology; none
            receives a guessed year.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default Timeline;

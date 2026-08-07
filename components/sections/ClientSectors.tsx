import type { ReactNode } from 'react';

import { clientSectors, clientTotal, sectorTally } from '@/content/client-sectors';
import { Eyebrow, Heading, Prose } from '@/components/ui';
import type { HeadingLevel } from '@/components/ui';

/** The members of a bucket, so a row can be checked against the wall above it
 *  rather than asking to be believed. Derived from the same map the counts are,
 *  so the list and the figure beside it cannot disagree. */
const membersOf = (sector: string) =>
  Object.entries(clientSectors)
    .filter(([, value]) => value === sector)
    .map(([name]) => name);

/**
 * The client roster by kind.
 *
 * WHY IT IS NOT A CHART. Six categories with a maximum value of six. An axis,
 * ticks and gridlines would be more furniture than data, and the design system
 * already owns the right object for figures in a ruled column: the stat ledger.
 * This is that object with a proportional bar added.
 *
 * WHY IT IS A <dl>. Every number is in the DOM as text, so the bar beside it is
 * decorative in the SC 1.4.11 sense and does not need to carry 3:1 on its own.
 * A screen reader gets "Commodity and trade groups, 6" and never has to
 * interpret a shape. The row hairlines DO carry structure, so those are
 * --rule-structural.
 *
 * WHY IT EARNS ITS PLACE. The logo wall is 21 marks with no shape: a reader
 * learns that 21 organisations booked him. What a meeting planner is actually
 * evaluating is whether THEIR kind of organisation booked him, and the wall
 * cannot answer that. This can, and every value in it is derived from the same
 * generated list the wall renders, so the two cannot disagree.
 *
 * IT TAKES A REAL HEADING, AND THAT IS NOT OPTIONAL. It shipped for one round
 * as an Eyebrow reading "The roster by kind" over a Section carrying nothing but
 * an aria-label, which is precisely the substitution DESIGN_SYSTEM section 8 and
 * do-not item 11 forbid: a mono label above a section is not a section heading,
 * in the outline or in the render. axe does not catch it, because a missing
 * heading is not a WCAG failure, which is the reason the rule is written down
 * rather than left to the checker. The section now points its aria-labelledby at
 * an h2 that exists.
 *
 * Server component. No client JS, no dependency, nothing animates.
 */
export type ClientSectorsProps = {
  id?: string;
  /**
   * The id put on the heading, for the wrapping Section's aria-labelledby.
   *
   * PASSED IN, NOT DERIVED FROM `id`, and that is the fix for a real defect.
   * Every other section component in this directory owns its own Section and
   * can derive `${id}-title` from the id it was given. This one does not: the
   * route wraps it. Deriving here meant the page had to pass id="sectors" to
   * BOTH the Section and this component to get the ids to line up, which put
   * the same id on two elements. Duplicate ids are invalid HTML and axe will
   * not catch it, because duplicate-id is a best-practice rule and
   * scripts/a11y.mjs excludes those on purpose.
   */
  titleId?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Rank, independent of size. Defaults to h2. */
  level?: HeadingLevel;
  /** The numbered prefix, rendered inside the heading. */
  folio?: string;
  /** Prose between the head and the ledger. */
  intro?: ReactNode;
};

export function ClientSectors({
  id,
  titleId,
  eyebrow = 'The roster by kind',
  title,
  level = 2,
  folio,
  intro,
}: ClientSectorsProps) {
  const headingId = titleId;

  return (
    <div className="dm-sectors" id={id}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? (
        <Heading level={level} size="2xl" folio={folio} id={headingId} className="dm-sectors__title">
          {title}
        </Heading>
      ) : null}
      {intro ? (
        <Prose className="dm-sectors__intro">
          {typeof intro === 'string' ? <p>{intro}</p> : intro}
        </Prose>
      ) : null}
      <dl className="dm-sectors__list">
        {sectorTally.map(({ sector, label, count }) => (
          /* data-count rather than an inline style. DESIGN_SYSTEM section 10
             item 15 bars inline styles in a component, and the bar width is the
             only thing here that varies with data. Six values are possible, so
             six CSS rules carry them: the same shape as the generated
             --logo-ar-sqrt the logo wall uses, which is a stylesheet only
             because there are 31 of those and 6 of these. */
          <div className="dm-sectors__row" data-count={count} key={sector}>
            <dt className="dm-sectors__label">{label}</dt>
            <dd className="dm-sectors__value">
              {/* Tabular, so the column of figures aligns. Source Serif, because
                  no condensed gothic on Google Fonts has working tabular
                  figures: see DESIGN_SYSTEM section 2. */}
              <span className="dm-sectors__count">{count}</span>
              {/* aria-hidden because the figure beside it already said this. A
                  bar that repeats its own label is noise in a screen reader,
                  and it is why so many charts are unusable with one. It is also
                  what makes the bar decorative under SC 1.4.11 rather than a
                  meaningful graphic that would owe 3:1 on its own. */}
              <span className="dm-sectors__bar" aria-hidden="true" />
              {/* The members, so the ledger is checkable against the wall above
                  it rather than asking to be believed. */}
              <span className="dm-sectors__names">{membersOf(sector).join(', ')}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="dm-sectors__total">
        {clientTotal} clients. Every mark on the wall above is in exactly one row.
      </p>
    </div>
  );
}

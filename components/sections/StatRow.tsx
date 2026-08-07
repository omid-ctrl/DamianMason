import type { ReactNode } from 'react';
import {
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
  Stat,
  cx,
} from '@/components/ui';
import type { HeadingLevel, SectionDensity, Surface } from '@/components/ui';

export type StatRowItem = {
  /** "01" through "04". Decorative, auto hidden from assistive tech. Omit it
   *  and the row numbers itself. */
  index?: string;
  /** The figure and only the figure. Never bake the plus into it. */
  value: string;
  /** Renders the aria-hidden orange plus, so a screen reader says "2,400" and
   *  the glyph still means "more than". Counts against the orange budget. */
  plus?: boolean;
  label: string;
};

/**
 * The four numbers that are the whole credibility argument. They are quoted
 * from the source site and they are exact: 2,400+ audiences, 50 states,
 * speaking since 1994, 40,000+ listeners a month. Do not round them, do not
 * "refresh" them, and do not add a fifth.
 */
export const CREDIBILITY_STATS: StatRowItem[] = [
  { value: '2,400', plus: true, label: 'Audiences addressed' },
  { value: '50', label: 'States' },
  { value: '1994', label: 'Speaking since' },
  { value: '40,000', plus: true, label: 'Monthly listeners' },
];

/**
 * The prose restatement that sits under the ledger. If a glyph fails to render
 * or a screen reader skips the row, this sentence still carries the argument.
 * Body face, never mono, capped at the narrow measure.
 */
export const CREDIBILITY_RESTATEMENT =
  'Since 1994, Damian has spoken to over 2,400 audiences in all 50 states and 7 foreign countries. Another 40,000 people listen to the podcast every month.';

export type StatRowProps = {
  /** Defaults to the four credibility figures. */
  items?: StatRowItem[];
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Rank, independent of size. Defaults to h2. */
  level?: HeadingLevel;
  /**
   * The prose under the row. Defaults to the credibility restatement, but only
   * when the default figures are in use: a custom set of numbers needs a
   * sentence written for it. Pass null to suppress it outright.
   */
  restatement?: ReactNode;
  surface?: Surface;
  density?: SectionDensity;
  className?: string;
};

/**
 * The stat ledger, grafted from direction 3. Mono index, serif tabular figure,
 * the orange plus as an aria-hidden glyph, mono label, hairline rows.
 *
 * Below 768 the four columns collapse to four hairline rows reading label on
 * the left and figure on the right, which is the only arrangement that keeps a
 * large figure and a 12px mono label on one line at 390.
 *
 * Orange budget: a full default row spends two of the three permitted orange
 * marks on its plus glyphs. A viewport holding this row and a primary button
 * is at the ceiling.
 */
export function StatRow({
  items,
  id,
  eyebrow,
  title,
  level = 2,
  restatement,
  surface,
  density = 'tight',
  className,
}: StatRowProps) {
  const rows = items ?? CREDIBILITY_STATS;
  const prose = restatement !== undefined ? restatement : items ? null : CREDIBILITY_RESTATEMENT;
  const headingId = id ? `${id}-title` : undefined;

  return (
    <Section
      id={id}
      aria-labelledby={headingId}
      surface={surface}
      density={density}
      className={cx('dm-statrow', className)}
    >
      <Container>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {title ? (
          <Heading level={level} size="2xl" id={headingId} className="dm-statrow__title">
            {title}
          </Heading>
        ) : null}

        <ul className="dm-statrow__list" role="list">
          {rows.map((row, i) => (
            <li key={row.label} className="dm-statrow__item">
              <Stat
                index={row.index ?? String(i + 1).padStart(2, '0')}
                value={row.value}
                plus={row.plus}
                label={row.label}
              />
            </li>
          ))}
        </ul>

        {prose ? (
          <Prose measure="narrow" className="dm-statrow__restatement">
            {typeof prose === 'string' ? <p>{prose}</p> : prose}
          </Prose>
        ) : null}
      </Container>
    </Section>
  );
}

export default StatRow;

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

/*
 * THERE IS NO DEFAULT RESTATEMENT, AND THAT IS DELIBERATE.
 *
 * This file used to export a CREDIBILITY_RESTATEMENT constant that the prose
 * slot fell back to: "Since 1994, Damian has spoken to over 2,400 audiences in
 * all 50 states and 7 foreign countries. Another 40,000 people listen to the
 * podcast every month." Two routes took the fallback (/ and /keynote/) and so
 * rendered that sentence byte for byte, while /speaking/ had hand-typed a third
 * near-copy of it. Measured on the rendered <main> of all 19 routes, the clause
 * "2,400 audiences in all 50 states and 7 foreign countries" was the single
 * most repeated run on the site.
 *
 * It was also the worst place on the page to put it. The sentence re-read all
 * four glyphs standing directly above it, which is the defect round 3 named on
 * /podcasts/: a restatement that restates the ledger tells the reader nothing
 * the ledger did not already say, and on / it repeated that route's own hero
 * line as well.
 *
 * So the slot is now required to be written per route. The prose under the
 * ledger should say what the four figures MEAN on this particular page, the way
 * /about/ does ("Three of these four are stages. The fourth is the podcast..."),
 * not read them back. Pass `restatement={null}` to suppress it outright.
 *
 * Keep it in the body face, never mono, capped at the narrow measure.
 */

export type StatRowProps = {
  /** Defaults to the four credibility figures. */
  items?: StatRowItem[];
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Rank, independent of size. Defaults to h2. */
  level?: HeadingLevel;
  /**
   * The prose under the row. Written per route, never shared: see the note
   * above CREDIBILITY_STATS. Omit it or pass null to render no prose at all.
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
  const prose = restatement ?? null;
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

        {/* The ledger is the one place on the site where a stagger earns its
            keep: four figures reading left to right is how the argument is
            meant to be taken in. See src/styles/motion.css. The row is fully
            visible without JavaScript. */}
        {/* data-count is what the ledger's column count is derived from. A
            three-figure row in a fixed four-column grid drew its top rule
            across the whole container while the bottom rule and the dividers
            stopped three quarters of the way across, which reads as a broken
            table rather than as a choice. */}
        <ul
          className="dm-statrow__list"
          role="list"
          data-count={rows.length}
          data-reveal="stagger"
        >
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

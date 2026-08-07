import type { ReactNode } from 'react';

import { Container, Eyebrow, Heading, Prose, Section, cx } from '@/components/ui';
import type { HeadingLevel, SectionDensity, Surface } from '@/components/ui';
import { foreignCountryCount, stateGrid, statesAlphabetical } from '@/content/coverage';

/**
 * Coverage: fifty states as a countable tally, plus seven blank tiles.
 *
 * THE ARGUMENT IS "ALL OF THEM, AND YOU CAN CHECK", NOT "WHERE". A filled map
 * of the United States at 100% coverage is a silhouette of a country the reader
 * already recognises, so it adds nothing to the "50" glyph in the ledger above
 * it. Fifty equal squares, each carrying its postal code, can be counted down a
 * column with a finger, which is the only thing that turns a claim into a
 * check. It is also the only version that survives 390px: see the header of
 * content/coverage.ts for the path-data and sliver-state arithmetic.
 *
 * ACCESSIBILITY. The plot is one `role="img"` with the headline claim as its
 * accessible name, which satisfies SC 1.1.1 without making a screen reader walk
 * 77 grid cells. Directly beneath it, outside the img role so it is still in the
 * accessibility tree, sits the full list of all fifty states by name. A sighted
 * reader decodes "WA" from its position; a screen reader user gets no position,
 * so they get the word, alphabetically, which is how a person checks a list.
 *
 * NOTHING HERE MOVES. No data-reveal on the plot: a graphic whose point is that
 * it can be counted should not be assembling itself while the reader counts.
 */

export type CoverageGridProps = {
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Rank, independent of size. Defaults to h2. */
  level?: HeadingLevel;
  /** The numbered prefix, rendered inside the heading. */
  folio?: string;
  /** The prose beside the plot. */
  intro?: ReactNode;
  /**
   * The mono cutline under the plot. One of the three standing humor slots:
   * two true things next to each other, and stop. This is where the honesty
   * about the seven unnamed countries lives.
   */
  cutline?: ReactNode;
  surface?: Surface;
  density?: SectionDensity;
  className?: string;
};

/**
 * The accessible name. It carries the claim the graphic makes, in the words the
 * source makes it in, and it is the only thing a screen reader announces for
 * the plot itself. Kept here rather than passed in as a prop because it is part
 * of the graphic's contract, not part of a route's copy.
 */
const PLOT_LABEL =
  'A tally of every state Damian has worked in: all 50 of them, plus 7 unlabelled tiles for 7 foreign countries.';

export function CoverageGrid({
  id,
  eyebrow,
  title,
  level = 2,
  folio,
  intro,
  cutline,
  surface,
  density,
  className,
}: CoverageGridProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <Section
      id={id}
      aria-labelledby={headingId}
      surface={surface}
      density={density}
      className={cx('dm-coverage', className)}
    >
      <Container>
        {eyebrow || title ? (
          <div className="dm-coverage__head">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <Heading level={level} size="2xl" folio={folio} id={headingId}>
                {title}
              </Heading>
            ) : null}
          </div>
        ) : null}

        {/* DOM ORDER IS THE READING ORDER, AND IT IS NOT THE VISUAL ORDER AT
            1024 AND UP. The prose is what tells a reader the squares are meant
            to be counted, so at 390, where the two stack, it has to arrive
            before fifty of them do. It shipped the other way round for one
            round and the phone layout read as fifty unexplained boxes followed
            by a caption about a different subject.

            From lg both are pinned to row 1 by explicit column placement, so
            the plot keeps the wide left track and the prose keeps the narrow
            right one whatever order they are written in. */}
        <div className="dm-grid12 dm-coverage__layout">
          {intro ? (
            <div className="dm-coverage__aside col-span-6 md:col-span-12 lg:col-span-5 lg:col-start-8 lg:row-start-1">
              <Prose measure="full">
                {typeof intro === 'string' ? <p>{intro}</p> : intro}
              </Prose>
            </div>
          ) : null}

          <figure className="dm-coverage__figure col-span-6 md:col-span-12 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <div className="dm-coverage__plot" role="img" aria-label={PLOT_LABEL}>
              {/* Eleven tracks, seven rows. An empty cell is emitted rather
                  than skipped: auto-placement with holes in it would slide
                  every state after the hole one column west. */}
              <div className="dm-coverage__grid">
                {stateGrid.map((row, rowIndex) =>
                  row.map((tile, columnIndex) =>
                    tile ? (
                      <span key={tile.code} className="dm-coverage__tile">
                        {tile.code}
                      </span>
                    ) : (
                      <span
                        key={`void-${rowIndex}-${columnIndex}`}
                        className="dm-coverage__void"
                      />
                    ),
                  ),
                )}
              </div>

              <span className="dm-eyebrow dm-coverage__register">
                {foreignCountryCount} foreign countries
              </span>

              {/* Seven tiles, deliberately blank. Nothing in the source names a
                  single one of them, so nothing here does either. */}
              <div className="dm-coverage__grid dm-coverage__grid--foreign">
                {Array.from({ length: foreignCountryCount }, (_, index) => (
                  <span key={`foreign-${index}`} className="dm-coverage__tile" />
                ))}
              </div>
            </div>

            {/* Outside the img role, so it is still announced. Every value in
                the graphic, as words. */}
            <div className="sr-only">
              <p>All fifty states, in alphabetical order:</p>
              <ul>
                {statesAlphabetical.map((tile) => (
                  <li key={tile.code}>{tile.name}</li>
                ))}
              </ul>
              <p>
                Plus {foreignCountryCount} foreign countries. No source on this site names any of
                them, so they are shown as {foreignCountryCount} blank tiles.
              </p>
            </div>

            {cutline ? <figcaption className="dm-figure__caption">{cutline}</figcaption> : null}
          </figure>
        </div>
      </Container>
    </Section>
  );
}

export default CoverageGrid;

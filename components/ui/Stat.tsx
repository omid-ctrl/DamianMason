import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type StatProps = {
  /** The figure itself, and only the figure: "2,400", "50", "1994", "40,000".
   *  Never bake the plus sign into this string. */
  value: string;
  /** Where the count-up starts. Defaults to zero. See StatRowItem. */
  countFrom?: string;
  /** Renders a trailing plus in brand orange. It is aria-hidden, so a screen
   *  reader says "2,400 audiences addressed" and the orange glyph is exempt
   *  from the text contrast floor while still carrying "more than" visually. */
  plus?: boolean;
  label: string;
  /** The prose restatement under the figure. Keep it under 46 characters wide
   *  and set it in the body face, never in mono. */
  note?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'className'>;

/**
 * The proof figure. Set in Source Serif 4 with tabular lining figures, at
 * --fs-figure, never in the display face: no condensed gothic has tabular
 * figures, and a ledger column that does not align is not a ledger. The
 * numbers are the entire brand argument
 * and they are not allowed to be the most fragile marks on the page.
 */
export function Stat({
  value,
  countFrom,
  plus = false,
  label,
  note,
  className,
  ...rest
}: StatProps) {
  return (
    <div className={cx('dm-stat', className)} {...rest}>
      <p className="dm-stat__figure">
        {/* THE FIGURE IS IN THE DOM TWICE, AND BOTH COPIES ARE THE TRUE VALUE.

            The first is the accessible one. It is never written to by
            JavaScript, and it is the only one of the two in the accessibility
            tree, because a count-up that animates the node a screen reader is
            reading announces a number that is not true, repeatedly.

            The second is the painted one. Server rendered as the final figure,
            so with JavaScript off, with the bundle failing, with
            IntersectionObserver missing, or under prefers-reduced-motion this
            IS the figure and nothing ever touches it. aria-hidden because the
            span above already said it, which is the same pairing the ledger
            index and the orange plus already use.

            data-count-len is the layout reservation, not the animation. See
            .dm-stat__value in app/globals.css: figures are tabular, so one
            character is one advance and the final string's LENGTH reserves the
            box in `ch` before any script runs. Without it "2,400" counting up
            from "0" is a box that grows five characters wide while the reader
            watches, and the mono label under it walks left to right. */}
        <span className="sr-only">{value}</span>
        <span
          className="dm-stat__value"
          aria-hidden="true"
          data-count-to={value}
          data-count-from={countFrom}
          data-count-len={String(value.length)}
        >
          {value}
        </span>
        {plus ? (
          <span className="dm-stat__plus" aria-hidden="true">
            +
          </span>
        ) : null}
      </p>
      <p className="dm-stat__label">{label}</p>
      {note ? <p className="dm-stat__note">{note}</p> : null}
    </div>
  );
}

export default Stat;

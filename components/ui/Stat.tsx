import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

export type StatProps = {
  /** The ledger index, "01" through "04". Decorative, so it is hidden from
   *  assistive tech and exempt from the text contrast floor. Omit it outside
   *  a ledger row. */
  index?: string;
  /** The figure itself, and only the figure: "2,400", "50", "1994", "40,000".
   *  Never bake the plus sign into this string. */
  value: string;
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
export function Stat({ index, value, plus = false, label, note, className, ...rest }: StatProps) {
  return (
    <div className={cx('dm-stat', className)} {...rest}>
      {index ? (
        <span className="dm-stat__index" aria-hidden="true">
          {index}
        </span>
      ) : null}
      <p className="dm-stat__figure">
        {value}
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

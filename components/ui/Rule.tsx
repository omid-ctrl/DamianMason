import type { ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type RuleWeight = 'hairline' | 'thin' | 'thick';
export type RuleTone = 'structural' | 'strong' | 'brand' | 'accent' | 'decorative';
export type RuleLength = 'full' | 'short' | 'medium';

export type RuleProps = {
  weight?: RuleWeight;
  /**
   * structural the default. Clears 3:1 in every scope, per SC 1.4.11. Use it
   *            whenever the rule conveys something: a table or cell boundary, a
   *            ledger column, a section head, a list divider.
   * strong     the heavy broadsheet rule, at the ink color.
   * brand      the wordmark navy.
   * accent     the one orange hairline. Counts against the orange budget.
   * decorative ornament only. Sits below 3:1 on purpose. If deleting the rule
   *            would lose meaning, it was the wrong tone.
   */
  tone?: RuleTone;
  length?: RuleLength;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'hr'>, 'className'>;

const WEIGHT_CLASS: Record<RuleWeight, string> = {
  hairline: '',
  thin: 'dm-rule--thin',
  thick: 'dm-rule--thick',
};

const TONE_CLASS: Record<RuleTone, string> = {
  structural: '',
  strong: 'dm-rule--strong',
  brand: 'dm-rule--brand',
  accent: 'dm-rule--accent',
  decorative: 'dm-rule--decorative',
};

const LENGTH_CLASS: Record<RuleLength, string> = {
  full: '',
  short: 'dm-rule--short',
  medium: 'dm-rule--medium',
};

export function Rule({
  weight = 'hairline',
  tone = 'structural',
  length = 'full',
  className,
  ...rest
}: RuleProps) {
  return (
    <hr
      className={cx(
        'dm-rule',
        WEIGHT_CLASS[weight],
        TONE_CLASS[tone],
        LENGTH_CLASS[length],
        className,
      )}
      {...rest}
    />
  );
}

export default Rule;

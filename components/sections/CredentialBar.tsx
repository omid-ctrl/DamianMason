import { Card, Heading, cx } from '@/components/ui';
import type { HeadingLevel } from '@/components/ui';
import type { CredentialPillar } from '@/content/credentials';

/**
 * The four-pillar credential bar, rendered once for both routes that carry it.
 *
 * WHY THIS FILE EXISTS. `content/credentials.ts` already stopped the two copies
 * of the WORDS from drifting. It did not stop the two copies of the MARKUP:
 * /keynote/ set each bullet with a hairline dash on a tight rhythm, /about/ set
 * the same bullets with no marker at all, in --ink-secondary, on a rhythm half
 * again as loose, which made them read as a column of links. Two nav clicks
 * apart, the same eight facts looked like two different components.
 *
 * The dash treatment won: an unmarked list of blue-grey phrases reads as
 * navigation, and these are credentials. One definition, one rendering, two
 * consumers.
 *
 * The marker is a hairline rule, not an orange glyph. Four cards of orange
 * markers would spend the whole orange budget in DESIGN_SYSTEM 5.1 on
 * decoration.
 */
export type CredentialBarProps = {
  pillars: CredentialPillar[];
  /** Rank for the pillar titles. They sit under an h2, so h3 by default. */
  level?: HeadingLevel;
  className?: string;
  /** RevealController hook, e.g. "stagger". Furniture, never behaviour. */
  'data-reveal'?: string;
};

export function CredentialBar({
  pillars,
  level = 3,
  className,
  'data-reveal': reveal,
}: CredentialBarProps) {
  return (
    <ul className={cx('dm-pillars', className)} role="list" data-reveal={reveal}>
      {pillars.map((pillar) => (
        <li key={pillar.title}>
          <Card variant="ruled" className="dm-pillars__card">
            <Heading level={level} size="lg">
              {pillar.title}
            </Heading>
            <ul className="dm-pillars__points" role="list">
              {pillar.items.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default CredentialBar;

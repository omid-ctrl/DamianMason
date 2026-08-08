import type { ReactNode } from 'react';
import type { ButtonVariant } from '@/components/ui';

/**
 * One call to action inside a section. Sections accept a tuple of at most two,
 * because the orange discipline rule allows exactly one filled orange field per
 * viewport and a third button is a decision nobody is making.
 *
 * The first action in the tuple is the one that earns money and is rendered
 * `primary` by default. Pass `variant` to override, which is what a page does
 * when a primary button is already visible higher in the same viewport.
 */
export type SectionAction = {
  label: string;
  href: string;
  variant?: ButtonVariant;
  /** Forwarded to the anchor. Use for a mailto or an off-site link. */
  rel?: string;
  target?: string;
  /** Announced by assistive tech when the visible label is short, e.g. "Book". */
  'aria-label'?: string;
};

/** Zero, one or two. There is no third slot on purpose. */
export type SectionActions = readonly [] | readonly [SectionAction] | readonly [SectionAction, SectionAction];

/**
 * A normalized logo. Both walls run on this shape: the client set has no URLs
 * (client marks are not links), the sponsor set does.
 *
 * `width` and `height` are the real pixel dimensions of the file on disk. They
 * are not decoration: they are what keeps 21 lazy-loaded marks from shifting
 * the page as they arrive, and they are what decides whether a mark is wide
 * enough to need the 0.86 back-off.
 */
export type LogoItem = {
  name: string;
  logo: string;
  width: number;
  height: number;
  url?: string;
};

/** Shared props every section in this directory accepts. */
export type SectionShellProps = {
  /** Anchor target, and the stem of the generated heading id. */
  id?: string;
  /** Mono running head above the heading. Never a substitute for the heading. */
  eyebrow?: ReactNode;
  className?: string;
};

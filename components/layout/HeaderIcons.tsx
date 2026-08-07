import { cx } from '@/components/ui/cx';

/**
 * The four marks the masthead needs. Every one is decorative: it always sits
 * beside a real text label or inside a control that already has an accessible
 * name, so all four are aria-hidden and none of them is focusable.
 *
 * Geometry is in viewBox units, which are ratios, not pixels. Size and color
 * come from the .dm-* class the caller passes, so nothing here resolves to a
 * raw value.
 */

export type HeaderIconProps = {
  className?: string;
};

const SHARED = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
};

/** Points down when the disclosure is closed, and is rotated by CSS when open. */
export function CaretIcon({ className }: HeaderIconProps) {
  return (
    <svg className={cx(className)} {...SHARED}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function BarsIcon({ className }: HeaderIconProps) {
  return (
    <svg className={cx(className)} {...SHARED}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon({ className }: HeaderIconProps) {
  return (
    <svg className={cx(className)} {...SHARED}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function PhoneIcon({ className }: HeaderIconProps) {
  return (
    <svg className={cx(className)} {...SHARED}>
      <path d="M7 3h4l2 5-3 2a12 12 0 0 0 4 4l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

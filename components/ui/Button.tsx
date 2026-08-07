import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'default' | 'lg';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'dm-btn--primary',
  secondary: 'dm-btn--secondary',
  ghost: 'dm-btn--ghost',
};

type ButtonBase = {
  /**
   * primary   an orange field with navy type. The wordmark's two colors doing a
   *           job. ONE per viewport, and it goes on the action that generates
   *           revenue: Book Damian, Contact, Join.
   * secondary a navy hairline outline with navy type. Everything else.
   * ghost     type only, for a tertiary or in-card action.
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fills its container. Use at 390 where a full-width tap target is needed. */
  block?: boolean;
  className?: string;
  children?: ReactNode;
};

export type ButtonAsButton = ButtonBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

export type ButtonAsLink = ButtonBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    /** Presence of href renders an <a>. A thing that navigates is a link. */
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = 'secondary', size = 'default', block = false, className, children } = props;

  const classes = cx(
    'dm-btn',
    VARIANT_CLASS[variant],
    size === 'lg' && 'dm-btn--lg',
    block && 'dm-btn--block',
    className,
  );

  if (props.href !== undefined) {
    const { variant: _v, size: _s, block: _b, className: _c, children: _ch, ...anchorProps } = props;
    void _v;
    void _s;
    void _b;
    void _c;
    void _ch;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    block: _b,
    className: _c,
    children: _ch,
    href: _h,
    type = 'button',
    ...buttonProps
  } = props;
  void _v;
  void _s;
  void _b;
  void _c;
  void _ch;
  void _h;

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;

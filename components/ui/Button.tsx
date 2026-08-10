import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
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

/**
 * Static downloads need a normal document request. Sending one through
 * next/link makes the App Router prefetch it as an RSC route, which turns a
 * perfectly valid PDF or media file into a noisy `?_rsc=` 404 in the console.
 */
const ROOT_DOWNLOAD_PATH = /^\/(?!\/)[^?#]*\.(?:csv|docx?|epub|m4a|m4v|mobi|mov|mp3|mp4|odp|ods|odt|ogg|pdf|pptx?|rtf|srt|txt|vtt|wav|webm|xlsx?|zip)(?:[?#]|$)/i;

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

    /* A route on this site goes through next/link: client-side
       transition, prefetch, no full document reload. Everything else stays a
       bare <a>, and every one of those cases needs to:
         mailto: and tel:   the browser hands them to another application
         #fragment          same document, and Link would re-run the router
         https://           another origin, which Link cannot navigate to
         static downloads   files are documents, not App Router routes
       Before this, "Book Damian" in the masthead, every Hero and CTABand
       action and the podcast hub cards all triggered a full reload while
       app/blog/ used next/link, so the codebase behaved two ways. */
    const isRootDownload = ROOT_DOWNLOAD_PATH.test(anchorProps.href);
    if (anchorProps.href.startsWith('/') && !isRootDownload && anchorProps.download === undefined) {
      return (
        <Link className={classes} {...anchorProps}>
          {children}
        </Link>
      );
    }

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

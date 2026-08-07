'use client';

/**
 * The mobile navigation, which the old site did not have at all: its trigger
 * was a `<span>` carrying a CSS icon, with no button, no accessible name, no
 * `aria-expanded` and no way to reach the three dropdowns.
 *
 * 'use client' is required: this is a stateful disclosure with a focus trap, a
 * scroll lock and a route-aware `aria-current`.
 *
 * What it does, in order of the requirements it answers:
 *   trigger      a real <button> with aria-expanded and aria-controls
 *   sheet        role="dialog" aria-modal, full viewport, bone ground
 *   focus        moved to Close on open, trapped while open, returned to the
 *                trigger on Escape or Close
 *   scroll       the page behind is locked through a data attribute, never an
 *                inline style
 *   submenus     expanded in place, open by default, collapsible, never hidden
 *                behind a second panel
 *   targets      every control is at least --size-tap-target (44px)
 *   phone        reachable here as well as in the rail, at every breakpoint
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { NavItem } from '@/content/site';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { cx } from '@/components/ui/cx';
import { BarsIcon, CaretIcon, CloseIcon, PhoneIcon } from './HeaderIcons';
import { hubChildren, isCurrentRoute } from './navRoutes';

/** Everything the trap treats as a stop. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The desktop breakpoint, matching the `@media (min-width: 64rem)` in globals.css. */
const DESKTOP_QUERY = '(min-width: 64rem)';

export type MobileMenuProps = {
  items: NavItem[];
  /** The one booking action, repeated inside the sheet. */
  bookingHref: string;
  bookingLabel: string;
  phone: string;
  phoneHref: string;
  className?: string;
};

export function MobileMenu({
  items,
  bookingHref,
  bookingLabel,
  phone,
  phoneHref,
  className,
}: MobileMenuProps) {
  const pathname = usePathname();
  const baseId = useId();
  const sheetId = `${baseId}-sheet`;
  /**
   * The trigger and the close control are addressed by id rather than by ref
   * because `Button` is a plain function component and does not forward one.
   * Reaching for the DOM node this way keeps the primitive unmodified.
   */
  const triggerId = `${baseId}-trigger`;
  const closeId = `${baseId}-close`;

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [seenPath, setSeenPath] = useState(pathname);
  const sheetRef = useRef<HTMLDivElement>(null);

  /**
   * Focus goes back to the trigger only when the reader closed the sheet.
   * A route change closes it too, and there the router owns focus.
   */
  function close(restoreFocus: boolean) {
    setOpen(false);
    if (!restoreFocus) return;
    requestAnimationFrame(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  // Move focus into the sheet as soon as it exists.
  useEffect(() => {
    if (!open) return;
    document.getElementById(closeId)?.focus();
  }, [open, closeId]);

  // Lock the page behind the sheet. The rule lives in globals.css so no
  // component writes an inline style.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.scrollLocked = 'true';
    return () => {
      delete root.dataset.scrollLocked;
    };
  }, [open]);

  // A navigation dismisses the sheet. Adjusted during render, not in an
  // effect: the router owns focus after a navigation, so nothing is restored
  // here and there is no second render to cascade.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    if (open) setOpen(false);
  }

  // Crossing into the desktop breakpoint hides the sheet in CSS, so the state
  // and the scroll lock have to come down with it.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  /** Escape closes. Tab cycles inside the sheet and cannot leave it. */
  function onSheetKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;

    const sheet = sheetRef.current;
    if (!sheet) return;
    const stops = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      // A collapsed submenu is `hidden`, so its links are not stops.
      (node) => node.offsetParent !== null,
    );
    if (stops.length === 0) return;

    const first = stops[0];
    const last = stops[stops.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function toggleGroup(href: string) {
    setCollapsed((current) =>
      current.includes(href) ? current.filter((entry) => entry !== href) : [...current, href],
    );
  }

  return (
    <>
      <Button
        id={triggerId}
        variant="secondary"
        className={cx('dm-masthead__menu', className)}
        aria-expanded={open}
        aria-controls={sheetId}
        onClick={() => (open ? close(true) : setOpen(true))}
      >
        {open ? (
          <CloseIcon className="dm-menu__icon" />
        ) : (
          <BarsIcon className="dm-menu__icon" />
        )}
        <span className="dm-masthead__menu-label">Menu</span>
      </Button>

      <div
        ref={sheetRef}
        id={sheetId}
        className="dm-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        onKeyDown={onSheetKeyDown}
      >
        <Container className="dm-menu__top">
          <Eyebrow>Menu</Eyebrow>
          <Button id={closeId} variant="ghost" onClick={() => close(true)}>
            <CloseIcon className="dm-menu__icon" />
            Close
          </Button>
        </Container>

        <Container className="dm-menu__body">
          <nav aria-label="Primary, mobile">
            <ul className="dm-menu__list">
              {items.map((item) => {
                const submenu = hubChildren(item);
                const groupId = `${baseId}-${normalizeId(item.href)}`;
                const expanded = submenu.length > 0 && !collapsed.includes(item.href);

                return (
                  <li key={item.href}>
                    <div className="dm-menu__row">
                      <Link
                        href={item.href}
                        className="dm-menu__link dm-link-bare"
                        aria-current={isCurrentRoute(pathname, item.href) ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>

                      {submenu.length > 0 && (
                        <button
                          type="button"
                          className="dm-menu__toggle"
                          aria-expanded={expanded}
                          aria-controls={groupId}
                          onClick={() => toggleGroup(item.href)}
                        >
                          <span className="sr-only">{item.label} pages</span>
                          <CaretIcon className="dm-menu__toggle-icon" />
                        </button>
                      )}
                    </div>

                    {submenu.length > 0 && (
                      <ul id={groupId} className="dm-menu__sublist" hidden={!expanded}>
                        {submenu.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="dm-menu__sublink dm-link-bare"
                              aria-current={
                                isCurrentRoute(pathname, child.href) ? 'page' : undefined
                              }
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="dm-menu__foot">
            {/* The phone number is reachable at every breakpoint. Here it is a
                44px target, which is what a meeting planner on a phone needs. */}
            <a className="dm-menu__phone" href={phoneHref}>
              <PhoneIcon className="dm-menu__icon" />
              {phone}
            </a>
            <Button href={bookingHref} variant="primary" block>
              {bookingLabel}
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}

/** Route to id fragment, so two groups never collide on one id. */
function normalizeId(href: string): string {
  return href.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root';
}

export default MobileMenu;

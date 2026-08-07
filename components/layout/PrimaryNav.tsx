'use client';

/**
 * The desktop nav.
 *
 * 'use client' is genuinely required twice over: the dropdowns hold open state
 * driven by pointer, focus and arrow keys, and `aria-current` is derived from
 * `usePathname()`, which is a client hook by design.
 *
 * The three dropdown parents on the old site were bare `<a>` elements with the
 * href attribute absent entirely: not links, not buttons, not focusable, with
 * no `aria-expanded`. Here every parent is a real link to a real hub route, so
 * Enter navigates and the disclosure never swallows the click. The disclosure
 * is opened by hover and by focus, and it is driven from the keyboard with
 * Arrow, Home, End and Escape.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import type { NavItem } from '@/content/site';
import { cx } from '@/components/ui/cx';
import { CaretIcon } from './HeaderIcons';
import { containsCurrentRoute, hubChildren, isCurrentRoute } from './navRoutes';

export type PrimaryNavProps = {
  /** The nav tree, passed in from content/site.ts. Never hard coded here. */
  items: NavItem[];
  /** Names the landmark. Two navs in one document need two names. */
  label?: string;
  className?: string;
};

export function PrimaryNav({ items, label = 'Primary', className }: PrimaryNavProps) {
  const pathname = usePathname();
  /** One open panel at a time, keyed by the parent's hub route. */
  const [openHref, setOpenHref] = useState<string | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);

  // A navigation closes whatever was open. Without this the panel the reader
  // clicked through stays open on the page they land on. Adjusted during
  // render rather than in an effect, which is React's own guidance for state
  // that derives from a changed input: no cascading second render.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    if (openHref !== null) setOpenHref(null);
  }

  return (
    <nav aria-label={label} className={cx('dm-nav', className)}>
      <ul className="dm-nav__list">
        {items.map((item) => {
          const submenu = hubChildren(item);

          if (submenu.length === 0) {
            return (
              <li key={item.href} className="dm-nav__item">
                <Link
                  href={item.href}
                  className="dm-nav__link dm-link-bare"
                  aria-current={isCurrentRoute(pathname, item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          return (
            <NavDropdown
              key={item.href}
              item={item}
              submenu={submenu}
              pathname={pathname}
              open={openHref === item.href}
              onOpen={() => setOpenHref(item.href)}
              onClose={() => setOpenHref((current) => (current === item.href ? null : current))}
            />
          );
        })}
      </ul>
    </nav>
  );
}

type NavDropdownProps = {
  item: NavItem;
  submenu: NavItem[];
  pathname: string | null;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

function NavDropdown({ item, submenu, pathname, open, onOpen, onClose }: NavDropdownProps) {
  const panelId = useId();
  const itemRef = useRef<HTMLLIElement>(null);
  const parentRef = useRef<HTMLAnchorElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const isCurrent = isCurrentRoute(pathname, item.href);
  const inBranch = containsCurrentRoute(pathname, item);

  /** Wraps at both ends, so ArrowDown on the last item returns to the first. */
  function focusLink(index: number) {
    const count = submenu.length;
    if (count === 0) return;
    const wrapped = ((index % count) + count) % count;
    linkRefs.current[wrapped]?.focus();
  }

  /**
   * Opening is a state update, so the panel is still `hidden` (and therefore
   * unfocusable) until React commits. One frame later it is on screen.
   */
  function openThenFocus(index: number) {
    onOpen();
    if (open) {
      focusLink(index);
      return;
    }
    requestAnimationFrame(() => focusLink(index));
  }

  /**
   * Escape has to close the panel and leave it closed. The `<li>` opens on
   * focus, so moving focus back to the parent re-fired that handler and the
   * panel reopened in the same tick: the reader pressed Escape and nothing
   * appeared to happen. The flag suppresses exactly that one re-entrant open
   * and is released on the next frame, so tabbing away and back still opens.
   */
  const suppressFocusOpen = useRef(false);

  function returnFocusToParent() {
    suppressFocusOpen.current = true;
    onClose();
    parentRef.current?.focus();
    requestAnimationFrame(() => {
      suppressFocusOpen.current = false;
    });
  }

  function onItemFocus() {
    if (suppressFocusOpen.current) return;
    onOpen();
  }

  function onParentKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    // Enter and Space are left alone on purpose: the parent is a link to the
    // hub route and activating it must navigate.
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openThenFocus(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openThenFocus(submenu.length - 1);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      returnFocusToParent();
    }
  }

  function onLinkKeyDown(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusLink(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index === 0) {
          parentRef.current?.focus();
        } else {
          focusLink(index - 1);
        }
        break;
      case 'Home':
        event.preventDefault();
        focusLink(0);
        break;
      case 'End':
        event.preventDefault();
        focusLink(submenu.length - 1);
        break;
      case 'Escape':
        event.preventDefault();
        returnFocusToParent();
        break;
      default:
        break;
    }
  }

  /** Tabbing or clicking out of the item closes it. React's onBlur bubbles. */
  function onItemBlur(event: FocusEvent<HTMLLIElement>) {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    onClose();
  }

  /** The pointer leaving must not yank the panel out from under a keyboard user. */
  function onPointerOut() {
    const active = document.activeElement;
    if (active && itemRef.current?.contains(active)) return;
    onClose();
  }

  return (
    <li
      ref={itemRef}
      className="dm-nav__item"
      onMouseEnter={onOpen}
      onMouseLeave={onPointerOut}
      onFocus={onItemFocus}
      onBlur={onItemBlur}
    >
      <Link
        ref={parentRef}
        href={item.href}
        className="dm-nav__link dm-link-bare"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={isCurrent ? 'page' : undefined}
        data-branch={!isCurrent && inBranch ? 'current' : undefined}
        onKeyDown={onParentKeyDown}
      >
        {item.label}
        <CaretIcon className="dm-nav__caret" />
      </Link>

      <ul id={panelId} className="dm-nav__panel" hidden={!open}>
        {submenu.map((child, index) => (
          <li key={child.href}>
            <Link
              ref={(node) => {
                linkRefs.current[index] = node;
              }}
              href={child.href}
              className="dm-nav__panel-link dm-link-bare"
              aria-current={isCurrentRoute(pathname, child.href) ? 'page' : undefined}
              onKeyDown={(event) => onLinkKeyDown(event, index)}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default PrimaryNav;

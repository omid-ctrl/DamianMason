'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The scroll reveal, in one place.
 *
 * Mounted once in app/layout.tsx. It owns a single IntersectionObserver for
 * the whole document, and it is the only thing on the site that may write
 * data-reveal-state. The paired stylesheet is src/styles/motion.css.
 *
 * ----------------------------------------------------------------------------
 * THE INVARIANT: content is visible unless this file has proven it is safe to
 * hide it.
 *
 * Nothing in the stylesheet hides anything. The hidden state exists only while
 * data-reveal-state="pending" is on the element, and only this function writes
 * it. Every failure mode therefore lands on "fully visible":
 *
 *   JavaScript disabled          the attribute is never written
 *   the bundle 404s or throws    the effect never runs, so it is never written
 *   IntersectionObserver absent  we bail before arming anything
 *   reduced motion requested     we bail before arming anything
 *   the observer never reports   the failsafe below releases everything armed
 *   the element is on screen     it is marked shown without ever being hidden
 *
 * That last one is doing two jobs. It is why the fold never flashes, and it is
 * why no LCP candidate is ever sitting at opacity 0 waiting on a callback.
 * ----------------------------------------------------------------------------
 */

/** Authored in markup as data-reveal="fade" or data-reveal="stagger". */
const SELECTOR = '[data-reveal]';

/**
 * The reveal fires a tenth of a viewport before the element reaches the
 * bottom edge, so the motion has finished by the time the reader is looking
 * straight at it. Anything larger reads as content arriving late.
 */
const ROOT_MARGIN = '0px 0px -10% 0px';

/** A hair off zero, so a tall section does not wait for a full 10% of itself. */
const THRESHOLD = 0.02;

/**
 * If the observer has not reported once by now, something is wrong with it and
 * the reveal gives up rather than leaving content hidden. It is deliberately
 * not a blanket "reveal everything after N ms": that would defeat the reveal on
 * a slow connection. It only fires when the observer produced no callback at
 * all, which is a state it should reach synchronously.
 */
const FAILSAFE_MS = 1500;

/**
 * Bumped by every mount. Teardown uses it to answer one question: has another
 * controller taken ownership of the elements I armed?
 *
 * This exists because React runs mount, cleanup, mount in development, and
 * because the App Router remounts on navigation. A cleanup that released
 * unconditionally would mark every target shown before the second mount could
 * observe it, and the reveal would silently never run again. Deferring the
 * release by a task and checking the generation keeps the guarantee (nothing
 * is ever left hidden with no observer watching it) without the false alarm.
 */
let generation = 0;

export function RevealController() {
  /**
   * The App Router swaps the tree without remounting the layout, so the scan
   * has to run again per route. Re-running is safe: an element already marked
   * shown is skipped.
   */
  const pathname = usePathname();

  useEffect(() => {
    const mine = ++generation;

    if (typeof IntersectionObserver === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (targets.length === 0) return;

    const pending: HTMLElement[] = [];
    let reported = false;

    const show = (el: HTMLElement) => {
      el.dataset.revealState = 'shown';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        reported = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD },
    );

    const viewport = window.innerHeight || document.documentElement.clientHeight;

    for (const el of targets) {
      if (el.dataset.revealState === 'shown') continue;

      // Already on screen, or straddling the fold. Never hide it: there is
      // nothing to reveal, and hiding it would be a visible flash.
      if (el.getBoundingClientRect().top < viewport) {
        show(el);
        continue;
      }

      el.dataset.revealState = 'pending';
      pending.push(el);
      observer.observe(el);
    }

    const releaseAll = () => {
      for (const el of pending) show(el);
    };

    const failsafe = window.setTimeout(() => {
      if (!reported) releaseAll();
    }, FAILSAFE_MS);

    // A reader who turns reduced motion on mid-session gets the final state
    // immediately, not the next time they scroll.
    const onPreferenceChange = () => {
      if (reduced.matches) releaseAll();
    };
    reduced.addEventListener('change', onPreferenceChange);

    return () => {
      window.clearTimeout(failsafe);
      reduced.removeEventListener('change', onPreferenceChange);
      observer.disconnect();
      // Unmounting must never leave something hidden with no observer left to
      // reveal it. Deferred by one task so a controller that mounts straight
      // after this one (development, and every client navigation) can adopt
      // the armed elements instead of having them force-shown underneath it.
      window.setTimeout(() => {
        if (generation !== mine) return;
        releaseAll();
      }, 0);
    };
  }, [pathname]);

  return null;
}

export default RevealController;

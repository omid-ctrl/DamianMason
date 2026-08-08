'use client';

import { useEffect } from 'react';

/**
 * Tells the masthead whether it is pinned.
 *
 * Mounted once in app/layout.tsx, beside RevealController. It writes exactly
 * one attribute, `data-scrolled`, onto `.dm-masthead`, and the stylesheet in
 * app/globals.css decides what that means.
 *
 * ----------------------------------------------------------------------------
 * WHY THERE IS STILL NO SCROLL LISTENER.
 *
 * `.dm-masthead` is `position: sticky` with a negative block-start offset equal
 * to the rule plus the identity rail plus a hairline, so the rail rides up out
 * of view and the bar lands flush. Sticky positioning establishes a containing
 * block for absolutely positioned descendants, which means a sentinel can be
 * pinned to the header's own top edge at exactly the distance the header
 * travels. It leaves the viewport at precisely the moment the bar goes flush.
 *
 * An IntersectionObserver reports that transition twice: once on the way up and
 * once on the way back. A scroll listener reports it sixty times a second and
 * then has to be told not to.
 *
 * The sentinel is absolutely positioned, so it takes part in no layout and can
 * shift nothing.
 * ----------------------------------------------------------------------------
 * NO REDUCED-MOTION BAIL, AND THAT IS DELIBERATE.
 *
 * A condensed masthead is state, not motion, in exactly the way the nav caret's
 * rotation on an open panel and the skip link's parked position are state. What
 * the preference removes is the travel between the two states, and it removes
 * it in the stylesheet, where the transitions are. RevealController bails here
 * because a reveal that never runs must never hide anything; this has nothing
 * to hide.
 * ----------------------------------------------------------------------------
 */

const HEADER = '.dm-masthead';
const SENTINEL = '.dm-masthead__sentinel';

export function MastheadState() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(HEADER);
    const sentinel = header?.querySelector<HTMLElement>(SENTINEL);
    if (!header || !sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        header.dataset.scrolled = entry.isIntersecting ? 'false' : 'true';
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      /* Back to the resting state on teardown. The attribute is this file's
         to own, so leaving a stale "true" behind for a header nothing is
         watching any more would be the same class of defect the reveal
         controller's generation counter exists to prevent. */
      delete header.dataset.scrolled;
    };
    /* No usePathname dependency: the header lives in the layout and the App
       Router does not remount it on navigation, so one observer outlives every
       route change. */
  }, []);

  return null;
}

export default MastheadState;

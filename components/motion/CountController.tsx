'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The ledger figures count up, once, when the reader reaches them.
 *
 * Mounted once in app/layout.tsx beside RevealController. One document-wide
 * IntersectionObserver over `[data-count-to]`. The markup contract is in
 * components/ui/Stat.tsx and the layout reservation is in app/globals.css.
 *
 * ----------------------------------------------------------------------------
 * THE INVARIANT, WHICH IS THE SAME ONE THE REVEAL HAS: the true figure is
 * always what is on screen unless this file is actively animating it.
 *
 * Stat renders the final value twice, server side. The first copy is `sr-only`
 * and this file never touches it, so assistive technology reads the real number
 * at every moment. The second is the painted one, and it also ships as the
 * final value, so every failure mode lands on "the correct figure is showing":
 *
 *   JavaScript disabled          the effect never runs
 *   the bundle 404s or throws    the effect never runs
 *   IntersectionObserver absent  we bail before observing anything
 *   reduced motion requested     we bail before observing anything
 *   the observer never reports   nothing is ever written, so nothing changes
 *   unmount mid-animation        teardown writes the final value back
 *
 * There is no failsafe timer, and none is needed. The reveal needs one because
 * it HIDES first and shows later; this only ever replaces a correct value with
 * a sequence ending in the same correct value.
 * ----------------------------------------------------------------------------
 */

const SELECTOR = '[data-count-to]';

/** Same margin as the reveal, so a ledger's rise and its count start together. */
const ROOT_MARGIN = '0px 0px -10% 0px';
const THRESHOLD = 0.02;

/**
 * U+2007 FIGURE SPACE. Exactly one digit wide in any font with tabular
 * figures, which the ledger has by default via --numeric-tabular.
 *
 * The `ch` reservation in the stylesheet holds the BOX. This holds the STRING
 * inside it, so an interim "37" under a five-character final value is padded
 * to five advances and the digits do not slide left to right as they grow.
 */
const FIGURE_SPACE = ' ';

/** Groups thousands the way the source figures are written: 2,400 and 40,000. */
const FORMAT = new Intl.NumberFormat('en-US');

/** "2,400" -> 2400. Returns null for anything that is not a plain number. */
function parseFigure(text: string | undefined): number | null {
  if (!text) return null;
  const digits = text.replace(/[^0-9]/g, '');
  if (!digits || digits.length !== text.replace(/[^0-9,]/g, '').replace(/,/g, '').length) {
    return null;
  }
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

let generation = 0;

export function CountController() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    /* Reduced motion is checked here as well as in the stylesheet, because this
       animation is JavaScript writing text rather than CSS interpolating a
       property, and a transition-duration clamp cannot reach it. */
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const mine = ++generation;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (targets.length === 0) return;

    /* Read from the token layer rather than hard-coding, so a change to the
       motion scale in tokens.css reaches this too. --duration-deliberate is
       620ms, and tokens.css already collapses every duration token to 1ms
       under reduced motion, which is a second independent safety net. */
    const durationToken = getComputedStyle(document.documentElement)
      .getPropertyValue('--duration-deliberate')
      .trim();
    const duration = Number.parseFloat(durationToken) || 620;

    const frames = new Map<HTMLElement, number>();

    function settle(el: HTMLElement) {
      const to = el.dataset.countTo;
      if (to !== undefined) el.textContent = to;
    }

    function run(el: HTMLElement) {
      const to = parseFigure(el.dataset.countTo);
      const from = el.dataset.countFrom === undefined ? 0 : parseFigure(el.dataset.countFrom);
      /* A figure the parser cannot read, or one whose start equals its end,
         simply keeps the value it was served with. */
      if (to === null || from === null || from === to) return;

      const width = (el.dataset.countTo ?? '').length;
      const start = performance.now();

      const step = (now: number) => {
        if (mine !== generation) return settle(el);
        const t = Math.min(1, (now - start) / duration);
        /* The cubic approximation of --easing-entrance. It is an
           approximation and not the bezier, and saying so is cheaper than
           importing a solver for a 620ms text ramp. */
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(from + (to - from) * eased);
        /* Formatted every frame, so the comma is present from the first one
           and the padding below is measuring the same shape it will end on. */
        el.textContent = FORMAT.format(current).padStart(width, FIGURE_SPACE);
        if (t < 1) {
          frames.set(el, requestAnimationFrame(step));
        } else {
          frames.delete(el);
          settle(el);
        }
      };

      frames.set(el, requestAnimationFrame(step));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          /* Once. Unobserve before running so a re-entry cannot restart it. */
          observer.unobserve(el);
          run(el);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD },
    );

    for (const el of targets) observer.observe(el);

    return () => {
      observer.disconnect();
      for (const id of frames.values()) cancelAnimationFrame(id);
      frames.clear();
      /* Unconditional, and it is the same guarantee RevealController gives on
         teardown: unmounting must never leave a node showing a value that is
         not the true one. */
      for (const el of targets) settle(el);
    };
    /* Re-scans on navigation for the same reason the reveal does: the App
       Router swaps the tree without remounting the layout, so a ledger on the
       next route would never be observed. */
  }, [pathname]);

  return null;
}

export default CountController;

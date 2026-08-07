import { site } from '@/content/site';

/**
 * ONE OUTBOUND-LINK CONVENTION, SITE-WIDE.
 *
 * Every link that leaves damianmason.com opens in a new tab, carries
 * `rel="noopener noreferrer"`, and announces itself to a screen reader with the
 * visually hidden string in `NEW_TAB_NOTE`.
 *
 * This file exists because the convention was being applied by hand at each
 * call site and ten links missed it: the three episode titles and the four
 * SoundCloud and YouTube links on /do-business-better-podcast/, and the FAQ
 * anchor that renders on /, /keynote/ and /meeting-coordinators/. The result
 * was that "Listen on SoundCloud" opened a new tab on /podcasts/ and replaced
 * the page on /do-business-better-podcast/, with the same label and the same
 * destination, and a screen-reader user got the warning on one and not the
 * other.
 *
 * `mailto:`, `tel:`, `#` fragments and site-relative paths are all internal by
 * this test, which is correct: none of them should open a new tab.
 */

const ORIGIN = site.url.replace(/\/+$/, '');
const ORIGIN_HOST = ORIGIN.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

/** Attributes for an anchor or a Button that leaves the site. */
export const NEW_TAB_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

/** The sr-only text that goes inside the link, after its label. */
export const NEW_TAB_NOTE = ' (opens in a new tab)';

/** True for an absolute http(s) URL pointing at a host other than this site. */
export function isExternalHref(href: string | undefined): boolean {
  if (!href) return false;
  if (!/^https?:\/\//i.test(href)) return false;

  try {
    const host = new URL(href).hostname.replace(/^www\./i, '');
    return host.toLowerCase() !== ORIGIN_HOST.toLowerCase();
  } catch {
    return false;
  }
}

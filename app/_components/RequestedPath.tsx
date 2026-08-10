'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

import { Eyebrow } from '@/components/ui';

import styles from './RequestedPath.module.css';

/* ============================================================================
   The address the reader actually asked for, echoed back on the 404.

   Why this is a client component. `not-found.tsx` is a server component that
   Next prerenders once as `/_not-found` and then serves for every unmatched
   URL, so it has no request in scope and cannot know the path. The only place
   the path exists at 404 time is `location.pathname` in the browser. The
   component therefore renders nothing on the server and fills in after mount,
   which is also why it sits below the lead paragraph rather than above it: a
   block that appears late must not push the headline around.

   The commerce test is the reason this exists at all. Eleven old URLs 301 to
   new homes, but the WordPress store had a long tail (`/product/*` variants,
   `/wc-api/`, `?add-to-cart=`, category and tag archives) that no redirect
   list can enumerate. Those are the addresses stale Google results and old
   newsletters still point at, and a reader who lands on one deserves to be
   told the store closed rather than left to guess.
   ============================================================================ */

/**
 * Lowercased substrings that mark a path as part of the retired store. Kept as
 * fragments rather than anchored patterns because WooCommerce buried these in
 * the middle of paths as often as at the start.
 */
const COMMERCE_MARKERS = [
  'shop',
  'store',
  'cart',
  'checkout',
  'my-account',
  'product',
  'order',
  'basket',
  'purchase',
  'add-to-cart',
  'wc-api',
  'wc-ajax',
  'woocommerce',
  'for-sale',
] as const;

function looksCommercial(requested: string): boolean {
  const haystack = requested.toLowerCase();
  return COMMERCE_MARKERS.some((marker) => haystack.includes(marker));
}

/* The address is read through useSyncExternalStore rather than an effect that
   calls setState. Both produce the same two renders (null on the server and
   through hydration, the real path immediately after), but setState in an
   effect body is a cascading render React now flags, and this states the
   intent directly: the location bar is an external store being read, not a
   piece of component state being synchronised.

   Nothing to subscribe to. The path cannot change while this is mounted: any
   navigation unmounts the 404 tree, so the store emits exactly once. */
const subscribeToLocation = () => () => {};
const getLocationSnapshot = () => `${window.location.pathname}${window.location.search}`;
const getServerLocationSnapshot = () => null;

export function RequestedPath() {
  const requested = useSyncExternalStore<string | null>(
    subscribeToLocation,
    getLocationSnapshot,
    getServerLocationSnapshot,
  );

  if (requested === null) return null;

  const commerce = looksCommercial(requested);

  return (
    <div className={styles.root}>
      <Eyebrow as="p">You asked for</Eyebrow>
      {/* The path is untrusted text from the address bar. It is rendered as a
          text node, never as markup, and it wraps rather than overflowing at
          390, which is where a long WooCommerce query string would otherwise
          push the page sideways. */}
      <p className={styles.path}>{requested}</p>
      {commerce ? (
        <p className={styles.note}>
          That address belonged to the online store. The store is closed and nothing on this site is
          for sale here. The three book editions are still real: what they are and what is in them is
          in the <Link href="/books/">Books &amp; Resources library</Link>. To ask what is currently
          available, email the office.
        </p>
      ) : null}
    </div>
  );
}

export default RequestedPath;

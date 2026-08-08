import Image from 'next/image';
import Link from 'next/link';
import { contact, nav } from '@/content/site';
import type { NavItem } from '@/content/site';
import { Container, Eyebrow, cx } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from './MobileMenu';
import { PrimaryNav } from './PrimaryNav';

/**
 * The masthead.
 *
 * A server component. Only the two pieces that hold state, PrimaryNav and
 * MobileMenu, cross into the client, and the nav tree they render is passed
 * down from content/site.ts rather than written here.
 *
 * What the old header did and what happens instead:
 *
 *   Old: Speaking, Podcasts and Media rendered as bare <a> elements with the
 *        href attribute absent entirely, so all three were unreachable and
 *        three whole sections of the site had no hub.
 *   Now: every parent is a real link to a real hub route, /speaking/,
 *        /podcasts/ and /blog-news/, and each one opens a keyboard operable
 *        disclosure of its children.
 *
 *   Old: the Media submenu repeated its own parent's label, pointing at the
 *        same page the parent should have pointed at.
 *   Now: hubChildren() in navRoutes.ts drops any child that resolves to its
 *        parent's route, so that entry is gone by rule, not by special case.
 *
 *   Old: no mobile navigation. A <span> with a CSS icon labelled "Select Page".
 *   Now: a real disclosure with a focus trap, a scroll lock, Escape to close
 *        and 44px targets.
 *
 *   Old: a utility bar built around a WooCommerce cart printing "0 Items", and
 *        a phone number in a <span> that no phone could dial.
 *   Now: no cart, no account, no shop, anywhere. The rail carries the identity
 *        lines and a real tel: link.
 */

/**
 * The one action in the masthead that earns money.
 *
 * It is `secondary`, not `primary`, and that is a system-level decision, not a
 * local style choice. See DESIGN_SYSTEM.md section 5. The masthead is pinned,
 * so a filled orange field here is present in every viewport of every route,
 * which left no orange for the page's own ask and put two identical orange
 * "Book Damian" fields on screen at once at the close of eight routes.
 * Persistent chrome earns findability from position and persistence. The page
 * body earns it from color. Do not change this to `primary`.
 */
const BOOKING_HREF = '/contact-us/';
const BOOKING_LABEL = 'Book Damian';

export type HeaderProps = {
  /** Defaults to the tree in content/site.ts. Injectable for a test render. */
  items?: NavItem[];
  className?: string;
};

export function Header({ items = nav, className }: HeaderProps) {
  return (
    <header className={cx('dm-masthead', className)}>
      {/* THE SCROLL SENTINEL, and it is why there is still no scroll listener
          anywhere in this build.

          .dm-masthead is position: sticky, which establishes a containing block
          for absolutely positioned descendants, so this can be pinned to the
          header's own top edge at exactly the distance the header travels. It
          leaves the viewport at precisely the moment the bar goes flush, and an
          IntersectionObserver reports that transition twice where a scroll
          listener would report it sixty times a second.

          Absolutely positioned, so it takes part in no layout and can shift
          nothing. components/motion/MastheadState.tsx watches it. */}
      <span className="dm-masthead__sentinel" aria-hidden="true" />
      {/* Deck 1: the identity rail. This is why the direction won, so it is
          load-bearing, not ornament. The two mono lines stand down as the
          viewport narrows. The phone number never does. */}
      <div className="dm-masthead__rail">
        <Container className="dm-masthead__rail-inner">
          <div className="dm-masthead__identity">
            {/* .dm-eyebrow uppercases, so these render as EST. 1994, INDIANA
                and THE BUSINESS OF FOOD, FUEL, AND FIBER while the text a
                screen reader receives stays in sentence case. */}
            <Eyebrow className="dm-masthead__est">Est. 1994, Indiana</Eyebrow>
            <Eyebrow className="dm-masthead__strap">
              The business of food, fuel, and fiber
            </Eyebrow>
          </div>

          <a className="dm-masthead__phone" href={contact.phoneHref}>
            <span className="dm-masthead__phone-label">Bookings:</span>
            {contact.phone}
          </a>
        </Container>
      </div>

      {/* Deck 2: the bar. This is the part that stays pinned. */}
      <div className="dm-masthead__bar">
        <Container className="dm-masthead__bar-inner">
          <Link href="/" className="dm-masthead__wordmark dm-link-bare">
            {/* The wordmark never reverses to white, and never sits on green. Its ground is the light stone in
                every scope the masthead can appear in, which is the whole
                argument of the design system. public/img/brand/wordmark-white
                .png exists and is not used here or anywhere else. */}
            <Image
              src="/img/brand/wordmark.png"
              alt="Damian Mason, Business Agriculture. Home"
              width={800}
              height={199}
              sizes="(min-width: 80rem) 15rem, 10.5rem"
              /* Eager, because the mark is above the fold on all 19 routes, but
                 deliberately NOT `priority`. LCP was measured on every route
                 against a production build and the wordmark is the LCP element
                 on none of them: it is always either the H1 or the hero
                 portrait, so `priority` was asserting something untrue.

                 Be aware this does not change the emitted network work today.
                 Next 16 preloads any non-lazy image, so the <link rel="preload"
                 as="image"> for this 7KB mark is still there. What it does not
                 do is emit a priority hint: in Next 16 `priority` maps to
                 preload only and the hint is the separate `fetchPriority` prop.
                 Hero.tsx now passes that prop explicitly on both of its image
                 sites, which is where the real LCP element always is. The
                 masthead deliberately does not, so the one hint on the page
                 stays pointed at the element that actually decides LCP. */
              loading="eager"
            />
          </Link>

          <PrimaryNav items={items} />

          <div className="dm-masthead__actions">
            <Button href={BOOKING_HREF} variant="secondary" className="dm-masthead__book">
              {BOOKING_LABEL}
            </Button>

            <MobileMenu
              items={items}
              bookingHref={BOOKING_HREF}
              bookingLabel={BOOKING_LABEL}
              phone={contact.phone}
              phoneHref={contact.phoneHref}
            />
          </div>
        </Container>
      </div>
    </header>
  );
}

export default Header;

/* ============================================================================
   KEYBOARD TRACE
   Walked step by step, no pointer at any stage. Tab order follows DOM order.

   AT 1440, THE DESKTOP NAV

   1.  Load. Tab 1 hits the skip link in app/layout.tsx, which is visible on
       focus and jumps to #main.
   2.  Tab 2: the rail phone link, "Bookings: 888.304.0702". Enter dials.
   3.  Tab 3: the wordmark link. Accessible name comes from the image alt,
       "Damian Mason, Business Agriculture. Home". Enter goes to /.
   4.  Tab 4: "Speaking". Announced as a link, expanded, because focus opens the
       disclosure. Three exits from here, all correct:
         Enter      navigates to /speaking/. The disclosure never intercepts a
                    key it did not claim, so the hub is reachable.
         ArrowDown  preventDefault, opens if needed, focus lands on "Keynote"
                    one frame later, after the panel loses its hidden attribute.
         ArrowUp    same, landing on "Collaboration Opportunities".
         Escape     closes and leaves focus on "Speaking".
   5.  Inside the panel: ArrowDown walks Keynote, Testimonials, Meeting
       Coordinators, Collaboration Opportunities and wraps to Keynote.
       ArrowUp from Keynote climbs back to "Speaking". Home and End jump to the
       ends. Escape closes and returns focus to "Speaking", never to the body.
   6.  Tab from inside the panel exits to the next top-level item. The li's
       onBlur sees relatedTarget outside itself and closes the panel, so no
       orphan dropdown is left hanging over the page.
   7.  Tab 5: "The Business of Ag Success Group", a plain link, no caret, no
       aria-expanded.
   8.  Tab 6 and 7: "Podcasts" and "Media", both behaving as step 4. Media's
       panel holds Acres TV and Blog. The child that used to duplicate the
       parent's label is gone.
   9.  Tab 8 and 9: "About" and "Contact Us".
   10. Tab 10: "Book Damian", the secondary button, an <a> to /contact-us/.
   11. Tab 11: the Menu trigger. It is display:none at this width, so it is not
       in the tab order at all and focus continues into #main.
   12. On the page the nav points at, that link carries aria-current="page" and
       a navy underline. Its parent hub carries data-branch="current", which is
       styling only and says nothing to a screen reader.

   AT 390, THE MOBILE SHEET

   1.  Tab 1: skip link. Tab 2: the rail phone, still a 44px target because the
       rail row is exactly --size-tap-target tall.
   2.  Tab 3: wordmark. Tab 4: "Book Damian". Tab 5: the Menu trigger, a real
       button announced collapsed. The desktop nav is display:none, so none of
       its links are stops.
   3.  Enter or Space on the trigger opens the sheet. The effect moves focus to
       the "Close" button, which is the first stop inside it. The trigger now
       reads expanded. html[data-scroll-locked] stops the page behind from
       scrolling, and the rule lives in the stylesheet, not in an inline style.
   4.  Tab walks: Close, then Speaking, then the caret button for Speaking
       ("Speaking pages", announced expanded), then Keynote, Testimonials,
       Meeting Coordinators, Collaboration Opportunities, then the next group,
       and so on down to the phone link and "Book Damian".
   5.  Tab on "Book Damian", the last stop, wraps to Close. Shift+Tab on Close
       wraps to "Book Damian". Nothing behind the sheet is reachable, and
       aria-modal keeps it out of the virtual buffer too.
   6.  Space on a caret button collapses that group in place. Its links leave
       the tab ring because a hidden element has no offsetParent, which is what
       the trap filters on. Space again expands it. Every group starts expanded,
       so nothing is hidden on the first open.
   7.  Escape anywhere in the sheet closes it and puts focus back on the Menu
       trigger, which then reads collapsed. Same for the Close button.
   8.  Following any link closes the sheet through the pathname effect. Focus is
       not yanked back to the trigger in that case, because the router owns
       focus after a navigation.
   9.  Widening past 64rem while the sheet is open closes it, so the scroll lock
       can never outlive the sheet that set it.

   REDUCED MOTION
   Nothing in the masthead animates position. The only transitions are ink,
   ground and the caret rotation, all on duration tokens that collapse to 1ms
   under prefers-reduced-motion, with the global clamp in globals.css behind
   them. The pinned bar is CSS sticky, so there is no scroll listener and
   nothing to move.
   ============================================================================ */

/**
 * Single source of truth for site-wide constants: contact details, socials,
 * navigation, and podcast/platform identifiers.
 *
 * Everything a future CMS would own lives in `content/`. Swapping this file for
 * a fetch is the whole "add a CMS" job.
 */

/**
 * The production origin. Every canonical URL, every Open Graph URL, the sitemap
 * and robots.txt are built from this one value, so it is the only thing that
 * has to change if the site ever moves.
 *
 * `NEXT_PUBLIC_SITE_URL` overrides it. The prefix is required, not decorative:
 * `PrimaryNav` and `MobileMenu` are client components that import this file, so
 * the value has to survive into the client bundle, and only NEXT_PUBLIC_ vars
 * are inlined there.
 *
 * Vercel's own `VERCEL_URL` is deliberately not consulted. It names the
 * per-deployment hostname, so canonicals and OG URLs on a preview would point
 * at a throwaway origin that outranks nothing and expires. Preview deployments
 * already ship `X-Robots-Tag: noindex` from the platform, so pointing their
 * canonicals at production is both correct and stable.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return 'https://damianmason.com';
  // A trailing slash here would double up in every `${site.url}/sitemap.xml`
  // style template, so it is stripped once, at the source.
  return configured.replace(/\/+$/, '');
}

export const site = {
  name: 'Damian Mason',
  legalName: 'Damian Mason Keynote Speaker',
  tagline: 'The Leading Voice in Agriculture',
  url: resolveSiteUrl(),
  locale: 'en_US',
} as const;

export const contact = {
  email: 'damianmasonoffice@gmail.com',
  phone: '888.304.0702',
  phoneHref: 'tel:+18883040702',
} as const;

export type SocialLink = {
  label: string;
  href: string;
  /** Icon key resolved by components/ui/SocialIcon. */
  icon: 'facebook' | 'x' | 'linkedin' | 'youtube' | 'instagram';
};

export const socials: SocialLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/DamianPMason', icon: 'facebook' },
  { label: 'X', href: 'https://x.com/DamianPMason', icon: 'x' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/damianmason/', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://www.youtube.com/@DamianMasonChannel', icon: 'youtube' },
  { label: 'Instagram', href: 'https://www.instagram.com/DamianPMason/', icon: 'instagram' },
];

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/**
 * The live site's information architecture, with two deliberate changes.
 *
 * 1. The three dropdown parents that carry `href=""` today (Speaking,
 *    Podcasts, Media) resolve to real hub pages.
 * 2. Blog moves from a top-level item into the Media dropdown. On the old nav
 *    it sat at position 5, immediately beside the Media parent whose only
 *    real child was `/blog-news/`, so the two blog-ish destinations were
 *    presented as unrelated peers. It is the one route on the site that costs
 *    a reader one more interaction than it used to, and the trade is recorded
 *    in docs/CONTENT_MANIFEST.md rather than made quietly.
 */
export const nav: NavItem[] = [
  {
    label: 'Speaking',
    href: '/speaking/',
    children: [
      { label: 'Keynote', href: '/keynote/' },
      { label: 'Testimonials', href: '/reviews/' },
      { label: 'Meeting Coordinators', href: '/meeting-coordinators/' },
      { label: 'Collaboration Opportunities', href: '/collaboration-opportunities/' },
    ],
  },
  { label: 'The Business of Ag Success Group', href: '/boasg/' },
  {
    label: 'Podcasts',
    href: '/podcasts/',
    children: [
      { label: 'The Business of Agriculture', href: '/the-business-of-agriculture/' },
      { label: 'Do Business Better', href: '/do-business-better-podcast/' },
      { label: 'XtremeAg', href: '/xtreme-ag/' },
    ],
  },
  {
    label: 'Media',
    href: '/blog-news/',
    children: [
      { label: 'Media', href: '/blog-news/' },
      { label: 'Acres TV', href: '/acres-tv/' },
      { label: 'Blog', href: '/blog/' },
    ],
  },
  { label: 'About', href: '/about/' },
  { label: 'Contact Us', href: '/contact-us/' },
];

export const podcasts = {
  businessOfAgriculture: {
    name: 'The Business of Agriculture',
    libsynShowId: '504653',
    rss: 'https://feeds.libsyn.com/504653/rss',
    apple: 'https://podcasts.apple.com/us/podcast/id1291008696',
    spotify: 'https://open.spotify.com/show/0UDXsogtCT4uNF4CpDpUae',
    showPage: 'https://thebusinessofagriculture.libsyn.com',
  },
  doBusinessBetter: {
    name: 'Do Business Better',
    soundcloud: 'https://soundcloud.com/dobusinessbetter',
  },
  xtremeAg: {
    name: 'XtremeAg',
    site: 'https://xtremeag.farm',
    granary: 'https://xtremeag.farm/the-granary',
  },
} as const;

/**
 * Mailchimp embedded-form values, taken verbatim from the live site's markup so
 * subscriptions keep landing in the same audience.
 */
export const newsletter = {
  action:
    'https://damianmason.us13.list-manage.com/subscribe/post?u=f08e63fefabed3435c6d1f97f&id=6456b31ef4&f_id=007b92e2f0',
  listId: '6456b31ef4',
  userId: 'f08e63fefabed3435c6d1f97f',
  fields: { firstName: 'FNAME', lastName: 'LNAME', email: 'EMAIL' },
  /** Mailchimp's bot trap. Must stay present, empty, and off-screen. */
  honeypot: 'b_f08e63fefabed3435c6d1f97f_6456b31ef4',
} as const;

/** Proof points used across hero, about and speaking pages. */
export const proofPoints = [
  { value: '2,400+', label: 'audiences addressed' },
  { value: '50', label: 'states' },
  { value: '1994', label: 'speaking since' },
  { value: '40,000+', label: 'monthly listeners' },
] as const;

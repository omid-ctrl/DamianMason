/**
 * Typed JSON-LD builders.
 *
 * The old site emitted no structured data at all: no Person, no Organization,
 * no podcast, no FAQ, no breadcrumbs, and no video markup on a site with 16
 * videos. Every builder below returns a plain object that `components/seo/JsonLd`
 * renders, and every one takes its facts from `content/site.ts` so a phone
 * number or a social URL is changed in exactly one place.
 *
 * The three standing nodes (Person, Organization, WebSite) carry stable `@id`
 * values so per-page nodes can reference them instead of restating them.
 */

import { brandAssets, brandAssetsExtra } from '@/content/brand-assets';
import { contact, podcasts, site, socials } from '@/content/site';
import { SITE_LANGUAGE, absoluteUrl, canonicalUrl } from '@/lib/seo';

/* ==========================================================================
   Types
   ========================================================================== */

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue | undefined };

export type JsonLdNode = {
  '@type': string | string[];
  [key: string]: JsonLdValue | undefined;
};

export type JsonLdDocument = JsonLdNode & { '@context': 'https://schema.org' };

/** A pointer to one of the standing nodes, so a page does not restate it. */
export type JsonLdReference = { '@id': string };

const CONTEXT = 'https://schema.org' as const;

/* ==========================================================================
   Stable node identifiers
   ========================================================================== */

export const schemaIds = {
  person: `${site.url}/#person`,
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
} as const;

const personRef: JsonLdReference = { '@id': schemaIds.person };
const organizationRef: JsonLdReference = { '@id': schemaIds.organization };

/** E.164, derived from the tel: href so the two cannot disagree. */
const telephone = contact.phoneHref.replace(/^tel:/, '');

const sameAs = socials.map((social) => social.href);

/**
 * The subjects Damian is on the record about, taken from the harvested copy
 * and from the masthead rail: the business of food, fuel, and fiber.
 */
export const AG_TOPICS = [
  'Agriculture',
  'Agricultural economics',
  'Agribusiness',
  'Farm policy',
  'Food production',
  'Commodity markets',
  'Agricultural technology',
  'Farmland and rural economics',
  'The food supply chain',
  'Food, fuel, and fiber',
] as const;

/* ==========================================================================
   Serialization
   ========================================================================== */

/**
 * Serializes a node for a `<script type="application/ld+json">` body.
 *
 * `<`, `>` and `&` are escaped to their \u form so no string inside the payload
 * can close the script tag or open a new one. U+2028 and U+2029 are escaped
 * because they are valid JSON but illegal raw in a JavaScript string, and a
 * stray one breaks any parser that evals the block.
 *
 * The replacements are ordered so nothing reintroduces an escapable character:
 * the substitutions themselves contain only backslashes, letters and digits.
 */
export function serializeJsonLd(input: JsonLdDocument | JsonLdDocument[]): string {
  return JSON.stringify(input)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/* ==========================================================================
   Person
   ========================================================================== */

export function buildPersonSchema(): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'Person',
    '@id': schemaIds.person,
    name: site.name,
    givenName: 'Damian',
    familyName: 'Mason',
    url: canonicalUrl('/about/'),
    image: absoluteUrl('/img/photos/portrait-dark-blazer.jpg'),
    jobTitle: ['Keynote Speaker', 'Agricultural Economist', 'Podcast Host', 'Author'],
    description:
      'Agricultural economist, keynote speaker, podcaster and author. Purdue Ag Econ degree, Second City Chicago, and a farm in Indiana. Speaking since 1994.',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Purdue University',
      sameAs: 'https://www.purdue.edu/',
    },
    knowsAbout: [...AG_TOPICS],
    knowsLanguage: SITE_LANGUAGE,
    worksFor: organizationRef,
    memberOf: {
      '@type': 'Organization',
      name: 'Screen Actors Guild',
    },
    homeLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'IN',
        addressCountry: 'US',
      },
    },
    sameAs,
  };
}

/* ==========================================================================
   Organization / ProfessionalService
   ========================================================================== */

/**
 * The speaking business. Typed as both Organization and ProfessionalService so
 * a consumer that only understands the general type still gets a usable node,
 * and one that understands the service type gets the contact point.
 */
export function buildOrganizationSchema(): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': ['Organization', 'ProfessionalService'],
    '@id': schemaIds.organization,
    name: site.legalName,
    alternateName: site.name,
    slogan: site.tagline,
    url: canonicalUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(brandAssets.wordmark),
      width: 800,
      height: 199,
      caption: `${site.name}, Business Agriculture`,
    },
    image: absoluteUrl('/img/photos/portrait-dark-blazer.jpg'),
    description:
      'Keynote speaking, program development and podcast partnerships for agriculture and agribusiness audiences. Booking and travel are handled directly from the Indiana farm office.',
    foundingDate: '1994',
    founder: personRef,
    employee: personRef,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'IN',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ],
    knowsAbout: [...AG_TOPICS],
    email: contact.email,
    telephone,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Booking',
        email: contact.email,
        telephone,
        availableLanguage: SITE_LANGUAGE,
        areaServed: 'US',
        url: canonicalUrl('/contact-us/'),
      },
    ],
    sameAs,
  };
}

/* ==========================================================================
   WebSite
   ========================================================================== */

export function buildWebSiteSchema(): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': schemaIds.website,
    name: site.name,
    alternateName: `${site.name}, ${site.tagline}`,
    url: canonicalUrl('/'),
    description:
      'Damian Mason is an agricultural economist, keynote speaker, podcaster and author. Since 1994 he has spoken to over 2,400 audiences in all 50 states and 7 foreign countries.',
    inLanguage: SITE_LANGUAGE,
    publisher: organizationRef,
    about: personRef,
    copyrightHolder: organizationRef,
  };
}

/* ==========================================================================
   PodcastSeries
   ========================================================================== */

export type PodcastSeriesInput = {
  name: string;
  description: string;
  /** Route path on this site, for example `/the-business-of-agriculture/`. */
  path: string;
  /** Cover art. Root-relative path or absolute URL. */
  image?: string;
  /** RSS feed URL, where one is published. */
  webFeed?: string;
  /** Directory and platform URLs: Apple, Spotify, SoundCloud, the show page. */
  sameAs?: string[];
};

export function buildPodcastSeriesSchema({
  name,
  description,
  path,
  image,
  webFeed,
  sameAs: seriesSameAs,
}: PodcastSeriesInput): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'PodcastSeries',
    '@id': `${canonicalUrl(path)}#podcast`,
    name,
    description,
    url: canonicalUrl(path),
    inLanguage: SITE_LANGUAGE,
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(webFeed ? { webFeed } : {}),
    author: personRef,
    publisher: organizationRef,
    ...(seriesSameAs && seriesSameAs.length > 0 ? { sameAs: seriesSameAs } : {}),
  };
}

/** The Business of Agriculture. Libsyn show 504653. */
export function buildBusinessOfAgricultureSchema(): JsonLdDocument {
  const show = podcasts.businessOfAgriculture;
  return buildPodcastSeriesSchema({
    name: show.name,
    description:
      'Smart talk and entertaining commentary about the business of food, fuel, and fiber. Damian has strong opinions and he is not afraid to share them. Over 40,000 listeners a month.',
    path: '/the-business-of-agriculture/',
    image: brandAssets.businessOfAgriculturePodcast,
    webFeed: show.rss,
    sameAs: [show.apple, show.spotify, show.showPage],
  });
}

export type PodcastEpisodeSchemaInput = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  episodeNumber?: string;
  duration?: string;
};

function podcastDuration(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const parts = value.split(':');
  if (parts.length < 2 || parts.length > 3 || !parts.every((part) => /^\d+$/.test(part))) {
    return undefined;
  }
  const [hours, minutes, seconds] =
    parts.length === 3 ? parts.map(Number) : [0, Number(parts[0]), Number(parts[1])];
  return `PT${hours ? `${hours}H` : ''}${minutes}M${seconds}S`;
}

export function buildBusinessOfAgricultureEpisodeSchema({
  title,
  description,
  url,
  publishedAt,
  episodeNumber,
  duration,
}: PodcastEpisodeSchemaInput): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'PodcastEpisode',
    '@id': `${url}#episode`,
    name: title,
    description,
    url,
    datePublished: publishedAt,
    ...(episodeNumber ? { episodeNumber } : {}),
    ...(podcastDuration(duration) ? { timeRequired: podcastDuration(duration) } : {}),
    partOfSeries: { '@id': `${canonicalUrl('/the-business-of-agriculture/')}#podcast` },
    author: personRef,
    publisher: organizationRef,
  };
}

/** Do Business Better. The back catalogue lives on SoundCloud. */
export function buildDoBusinessBetterSchema(): JsonLdDocument {
  const show = podcasts.doBusinessBetter;
  return buildPodcastSeriesSchema({
    name: show.name,
    description:
      'Conversations with people who run things, about what actually moves a business forward. Named for the book of the same title.',
    path: '/do-business-better-podcast/',
    image: brandAssetsExtra.doBusinessBetterPodcast,
    sameAs: [show.soundcloud],
  });
}

/* ==========================================================================
   FAQPage
   ========================================================================== */

export type FaqItem = {
  question: string;
  /** Plain text or a short HTML string. Either is escaped on serialization. */
  answer: string;
};

export function buildFaqPageSchema(items: FaqItem[], path?: string): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    ...(path ? { '@id': `${canonicalUrl(path)}#faq` } : {}),
    inLanguage: SITE_LANGUAGE,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/* ==========================================================================
   BreadcrumbList
   ========================================================================== */

export type BreadcrumbItem = {
  name: string;
  /** Route path on this site. */
  path: string;
};

/**
 * Pass the full trail including Home, for example:
 * `[{ name: 'Home', path: '/' }, { name: 'Speaking', path: '/speaking/' }, ...]`
 */
export function buildBreadcrumbListSchema(trail: BreadcrumbItem[]): JsonLdDocument {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  };
}

/* ==========================================================================
   VideoObject
   ========================================================================== */

export type VideoObjectInput = {
  name: string;
  description: string;
  /** ISO 8601 date. Google treats this as required, so supply it where known. */
  uploadDate?: string;
  /** ISO 8601 duration, for example `PT4M13S`. */
  duration?: string;
  /** YouTube video id. Supplies embedUrl, url and thumbnail when set. */
  youtubeId?: string;
  /** Self-hosted file, for a demo reel served from this domain. */
  contentUrl?: string;
  /** Overrides the derived thumbnail. Root-relative path or absolute URL. */
  thumbnailUrl?: string | string[];
  /** The page the video is embedded on, used for the node id. */
  path?: string;
};

export function buildVideoObjectSchema({
  name,
  description,
  uploadDate,
  duration,
  youtubeId,
  contentUrl,
  thumbnailUrl,
  path,
}: VideoObjectInput): JsonLdDocument {
  const derivedThumbnail = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
    : undefined;
  const thumbnails = thumbnailUrl ?? derivedThumbnail;

  return {
    '@context': CONTEXT,
    '@type': 'VideoObject',
    ...(path ? { '@id': `${canonicalUrl(path)}#video-${youtubeId ?? slugify(name)}` } : {}),
    name,
    description,
    inLanguage: SITE_LANGUAGE,
    ...(uploadDate ? { uploadDate } : {}),
    ...(duration ? { duration } : {}),
    ...(thumbnails
      ? {
          thumbnailUrl: Array.isArray(thumbnails)
            ? thumbnails.map((thumb) => absoluteUrl(thumb))
            : absoluteUrl(thumbnails),
        }
      : {}),
    ...(youtubeId
      ? {
          embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
          url: `https://www.youtube.com/watch?v=${youtubeId}`,
        }
      : {}),
    ...(contentUrl ? { contentUrl: absoluteUrl(contentUrl) } : {}),
    ...(path ? { mainEntityOfPage: canonicalUrl(path) } : {}),
    creator: personRef,
    publisher: organizationRef,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ==========================================================================
   Convenience
   ========================================================================== */

/**
 * The three standing nodes, in the order a crawler prefers to read them. Wire
 * this into the root layout once and let per-page builders add to it.
 */
export function buildSiteBaseSchema(): JsonLdDocument[] {
  return [buildOrganizationSchema(), buildPersonSchema(), buildWebSiteSchema()];
}

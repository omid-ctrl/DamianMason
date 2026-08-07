/**
 * Page metadata builder.
 *
 * The old WordPress site shipped almost no meta descriptions, canonicals that
 * pointed at three different hosts (damianmason.com, DamianMason.com and
 * damianmason.wpengine.com) and og:image values for images that were never on
 * the page. Every route here goes through one function so none of that can
 * happen again.
 *
 * Every URL this file emits is absolute and is built off `site.url` from
 * `content/site.ts`. Nothing hard-codes the origin.
 *
 * `next.config.ts` sets `trailingSlash: true`, so every canonical this file
 * produces carries a trailing slash. A canonical that disagrees with the
 * served URL is the same bug the old site had.
 */

import type { Metadata } from 'next';
import { site, socials } from '@/content/site';

/**
 * Pages pass a bare page name and get "Page Name | Damian Mason". The same
 * template is set on `app/layout.tsx` as `title.template`, so a plain string
 * title resolves through it. `buildMetadata` also applies it by hand when it
 * writes `openGraph.title` and `twitter.title`, because Next does not run the
 * template over those two fields.
 */
export const SITE_TITLE_TEMPLATE = '%s | Damian Mason';

/** Used on the home page and as the fallback when a route sets no title. */
export const SITE_DEFAULT_TITLE = 'Damian Mason, Business Agriculture';

export const SITE_DEFAULT_DESCRIPTION =
  'Damian Mason is an agricultural economist, keynote speaker, podcaster and author. Since 1994 he has spoken to over 2,400 audiences in all 50 states and 7 foreign countries.';

/** `en_US` is the Open Graph form. `en-US` is the BCP 47 form HTML wants. */
export const SITE_LOCALE = site.locale;
export const SITE_LANGUAGE = site.locale.replace('_', '-');

/**
 * Derived from the X entry in `content/site.ts` so the handle cannot drift out
 * of sync with the link in the footer.
 */
export const TWITTER_HANDLE: string | undefined = (() => {
  const profile = socials.find((social) => social.icon === 'x');
  if (!profile) return undefined;
  const handle = new URL(profile.href).pathname.replace(/\//g, '').trim();
  return handle ? `@${handle}` : undefined;
})();

export type OgType = 'website' | 'article' | 'profile';

export type OgImage = {
  /** Absolute URL, or a root-relative path that gets resolved against site.url. */
  url: string;
  width?: number;
  height?: number;
  /** Required. An OG image without alt text is an image a screen reader loses. */
  alt: string;
};

export type BuildMetadataInput = {
  /** The page name only. The template supplies ", Damian Mason". */
  title: string;
  /** One or two sentences, written in voice. No page ships without one. */
  description: string;
  /** Route path, with or without slashes. Normalized to `/like/this/`. */
  path: string;
  /**
   * Omit to inherit the site-wide card from `app/opengraph-image.tsx`. Pass a
   * value only when a route has art of its own, for example a podcast cover or
   * a post image.
   */
  image?: string | OgImage;
  /** Open Graph object type. Posts pass `article`, the bio passes `profile`. */
  type?: OgType;
  /** Set on a route that must stay out of the index, for example a thank-you page. */
  noIndex?: boolean;
  /**
   * Skips the title template. The home page uses this so it does not render as
   * "Damian Mason, Business Agriculture | Damian Mason".
   */
  titleIsAbsolute?: boolean;
};

/**
 * Normalizes any path into the one canonical shape: a leading slash, a
 * trailing slash, no query, no fragment, no origin.
 */
export function canonicalPath(path: string): string {
  const withoutOrigin = path.startsWith(site.url) ? path.slice(site.url.length) : path;
  const bare = withoutOrigin.split('#')[0].split('?')[0];
  const trimmed = bare.replace(/^\/+/, '').replace(/\/+$/, '');
  return trimmed === '' ? '/' : `/${trimmed}/`;
}

/** Resolves a root-relative path against `site.url`. Passes absolute URLs through. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(path, `${site.url}/`).toString();
}

/** The canonical URL for a route, absolute and trailing-slashed. */
export function canonicalUrl(path: string): string {
  return absoluteUrl(canonicalPath(path));
}

/** "Keynote" becomes "Keynote | Damian Mason". */
export function applyTitleTemplate(title: string): string {
  return SITE_TITLE_TEMPLATE.replace('%s', title);
}

function toOgImage(image: string | OgImage): OgImage {
  const normalized = typeof image === 'string' ? { url: image, alt: SITE_DEFAULT_TITLE } : image;
  return { ...normalized, url: absoluteUrl(normalized.url) };
}

/**
 * The one entry point. Every route's `generateMetadata` or exported `metadata`
 * calls this and nothing else.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
  titleIsAbsolute = false,
}: BuildMetadataInput): Metadata {
  const url = canonicalUrl(path);
  const resolvedTitle = titleIsAbsolute ? title : applyTitleTemplate(title);
  const ogImage = image ? toOgImage(image) : undefined;

  return {
    metadataBase: new URL(site.url),
    title: titleIsAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    // Index and follow everywhere, with the previews Google will actually
    // render. The old site's WooCommerce disallows died with the store.
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: SITE_LOCALE,
      title: resolvedTitle,
      description,
      // Left undefined on purpose when no route art is supplied. File-based
      // metadata outranks the metadata object in Next, so app/opengraph-image.tsx
      // fills this slot for every route that does not override it.
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE } : {}),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    creator: site.name,
    publisher: site.legalName,
  };
}

import {
  type PodcastEpisode,
  verifiedBusinessOfAgricultureFallbackEpisodes,
} from '@/content/current-media';
import { podcasts } from '@/content/site';

const FEED_REVALIDATE_SECONDS = 60 * 60;

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, token: string) => {
    if (token.startsWith('#')) {
      const isHex = token[1]?.toLowerCase() === 'x';
      const parsed = Number.parseInt(token.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : entity;
    }
    return named[token.toLowerCase()] ?? entity;
  });
}

function element(xml: string, tag: string): string | undefined {
  const escaped = tag.replace(':', '\\:');
  const match = xml.match(
    new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'),
  );
  if (!match?.[1]) return undefined;
  return match[1].replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, '').trim();
}

function plainText(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const withoutMarkup = value
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(?:p|div|li)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const normalized = decodeEntities(withoutMarkup).replace(/\s+/g, ' ').trim();
  return normalized || undefined;
}

function episodeDescription(value: string | undefined): string | undefined {
  const text = plainText(value);
  if (!text) return undefined;

  // Libsyn appends sponsor credits, cross-promotions, and a rights notice to
  // the editorial summary. Those remain available on the episode page; the
  // card needs the episode description itself rather than an unlabelled list
  // of this week's sponsors flattened into prose.
  return text
    .split(/The Business of Agriculture with Damian Mason is brought to you by:/i)[0]
    .trim();
}

function dateOnly(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function enclosureUrl(item: string): string | undefined {
  const match = item.match(/<enclosure\b[^>]*\burl=(?:"([^"]+)"|'([^']+)')[^>]*>/i);
  return match ? decodeEntities(match[1] ?? match[2] ?? '') : undefined;
}

function parsePodcastEpisodeItem(item: string): PodcastEpisode | null {
  const rssTitle = plainText(element(item, 'title'));
  const title = plainText(element(item, 'itunes:title') ?? rssTitle)?.replace(
    /\s*\|\s*Damian Mason Podcast$/i,
    '',
  );
  const published = dateOnly(element(item, 'pubDate'));
  const link = plainText(element(item, 'link'));
  const description = episodeDescription(element(item, 'description'));

  if (!title || !published || !link || !description) return null;

  return {
    title,
    published,
    link,
    description,
    // A July 2026 feed item labels itself 459 in its canonical title but 455
    // in itunes:episode. Prefer the public title's leading number when it is
    // present, and use the iTunes field for feeds that omit that prefix.
    episodeNumber:
      rssTitle?.match(/^\s*(\d+)\s*-\s+/)?.[1] ??
      plainText(element(item, 'itunes:episode')),
    duration: plainText(element(item, 'itunes:duration')),
    enclosureUrl: enclosureUrl(item),
  };
}

export function parsePodcastEpisodes(xml: string, limit = 4): PodcastEpisode[] {
  const safeLimit = Math.max(1, Math.floor(limit));
  const episodes: PodcastEpisode[] = [];

  for (const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const parsed = parsePodcastEpisodeItem(match[1]);
    if (parsed) episodes.push(parsed);
    if (episodes.length >= safeLimit) break;
  }

  return episodes;
}

export function parseLatestPodcastEpisode(xml: string): PodcastEpisode | null {
  return parsePodcastEpisodes(xml, 1)[0] ?? null;
}

/**
 * Shortens a feed description at a sentence boundary for multi-episode lists.
 * The newest episode can still carry its complete editorial summary while the
 * archive rows remain scannable.
 */
export function podcastEpisodeExcerpt(description: string, maxLength = 360): string {
  if (description.length <= maxLength) return description;

  const candidate = description.slice(0, maxLength + 1);
  const sentenceEnds = [
    candidate.lastIndexOf('. '),
    candidate.lastIndexOf('? '),
    candidate.lastIndexOf('! '),
  ];
  const sentenceEnd = Math.max(...sentenceEnds);

  if (sentenceEnd >= Math.floor(maxLength * 0.55)) {
    return candidate.slice(0, sentenceEnd + 1).trim();
  }

  const wordEnd = candidate.lastIndexOf(' ');
  return `${candidate.slice(0, wordEnd > 0 ? wordEnd : maxLength).trim()}…`;
}

function withFallbackEpisodes(
  episodes: PodcastEpisode[],
  limit: number,
): PodcastEpisode[] {
  const combined = [...episodes];
  const knownLinks = new Set(combined.map((episode) => episode.link));

  for (const fallback of verifiedBusinessOfAgricultureFallbackEpisodes) {
    if (combined.length >= limit) break;
    if (knownLinks.has(fallback.link)) continue;
    combined.push(fallback);
    knownLinks.add(fallback.link);
  }

  return combined.slice(0, limit);
}

/**
 * Gets the first item in Damian's published Libsyn RSS feed. A malformed feed,
 * timeout, or network failure returns the last locally verified item rather
 * than breaking the route or presenting a false empty state.
 */
export async function getLatestBusinessOfAgricultureEpisode(): Promise<PodcastEpisode> {
  return (await getRecentBusinessOfAgricultureEpisodes(1))[0];
}

/**
 * Gets the newest items in Damian's published Libsyn RSS feed. The feed is
 * refreshed hourly; malformed or missing items are filled from the locally
 * verified sequence so the discovery list remains useful during an outage.
 */
export async function getRecentBusinessOfAgricultureEpisodes(
  limit = 4,
): Promise<PodcastEpisode[]> {
  const safeLimit = Math.max(1, Math.floor(limit));

  try {
    const response = await fetch(podcasts.businessOfAgriculture.rss, {
      headers: { Accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8' },
      next: { revalidate: FEED_REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      return withFallbackEpisodes([], safeLimit);
    }

    return withFallbackEpisodes(
      parsePodcastEpisodes(await response.text(), safeLimit),
      safeLimit,
    );
  } catch {
    return withFallbackEpisodes([], safeLimit);
  }
}

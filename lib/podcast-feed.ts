import 'server-only';

import { XMLParser } from 'fast-xml-parser';

import { podcasts } from '@/content/site';

export type LatestEpisode = {
  id: string;
  title: string;
  episodeNumber?: string;
  publishedAt: string;
  duration?: string;
  summary: string;
  episodeUrl: string;
};

const MAX_FEED_BYTES = 4 * 1024 * 1024;
const FEED_TIMEOUT_MS = 4_000;

/**
 * A truthful last-known episode. It is deliberately visible when Libsyn is
 * unavailable: the site stays useful without pretending a failed request is a
 * new release.
 */
export const latestEpisodeFallback: LatestEpisode = {
  id: 'business-of-agriculture-461',
  title: 'Will the Great American Cotton Plan Save U.S. Cotton?',
  episodeNumber: '461',
  publishedAt: '2026-08-03T12:00:00.000Z',
  duration: '53:23',
  summary:
    '$2.6 billion is what U.S. cotton growers stand to lose this year according to USDA. Plains Cotton Growers CEO Kody Bessent joins cotton farmers Todd Kimbrell and Matt Miles to discuss the Great American Cotton Plan, demand, infrastructure, and what it could mean for rural communities.',
  episodeUrl:
    'https://f2a7f5f9-0de4-478a-be41-151ce3dba91c.libsyn.com/461-will-the-great-american-cotton-plan-save-us-cotton-damian-mason-podcast',
};

type XmlRecord = Record<string, unknown>;

function isRecord(value: unknown): value is XmlRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (Array.isArray(value)) return asText(value[0]);
  if (isRecord(value)) return asText(value['#text']);
  return '';
}

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#x')) {
      const codePoint = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    if (entity.startsWith('#')) {
      const codePoint = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return named[entity.toLowerCase()] ?? match;
  });
}

function summaryFromHtml(value: string): string {
  const firstParagraph = value.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? value;
  const plain = decodeEntities(
    firstParagraph
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= 420) return plain;
  const shortened = plain.slice(0, 420).replace(/\s+\S*$/, '').trimEnd();
  return `${shortened}…`;
}

function validHttpUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function parseLatestEpisode(xml: string): LatestEpisode | null {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
    maxNestedTags: 64,
    processEntities: {
      enabled: true,
      maxEntitySize: 1_024,
      maxExpansionDepth: 4,
      maxTotalExpansions: 128,
      maxExpandedLength: 16_384,
      maxEntityCount: 32,
    },
  });

  const parsed: unknown = parser.parse(xml);
  if (!isRecord(parsed) || !isRecord(parsed.rss) || !isRecord(parsed.rss.channel)) return null;

  const rawItems = parsed.rss.channel.item;
  const item = Array.isArray(rawItems) ? rawItems[0] : rawItems;
  if (!isRecord(item)) return null;

  const title = asText(item['itunes:title']) || asText(item.title);
  const rawDate = asText(item.pubDate);
  const published = new Date(rawDate);
  const episodeUrl = validHttpUrl(asText(item.link)) || validHttpUrl(asText(item.guid));
  const summary = summaryFromHtml(
    asText(item.description) || asText(item['content:encoded']) || asText(item['itunes:summary']),
  );

  if (!title || Number.isNaN(published.valueOf()) || !episodeUrl || !summary) return null;

  return {
    id: asText(item.guid) || episodeUrl,
    title,
    episodeNumber: asText(item['itunes:episode']) || undefined,
    publishedAt: published.toISOString(),
    duration: asText(item['itunes:duration']) || undefined,
    summary,
    episodeUrl,
  };
}

export async function getLatestEpisode(): Promise<LatestEpisode> {
  try {
    const response = await fetch(podcasts.businessOfAgriculture.rss, {
      headers: { 'User-Agent': 'DamianMason.com/1.0 podcast-feed' },
      next: {
        revalidate: 3_600,
        tags: ['business-of-agriculture-feed'],
      },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });

    if (!response.ok) return latestEpisodeFallback;

    const declaredSize = Number(response.headers.get('content-length'));
    if (Number.isFinite(declaredSize) && declaredSize > MAX_FEED_BYTES) {
      return latestEpisodeFallback;
    }

    const body = await response.arrayBuffer();
    if (body.byteLength > MAX_FEED_BYTES) return latestEpisodeFallback;

    return parseLatestEpisode(new TextDecoder().decode(body)) ?? latestEpisodeFallback;
  } catch {
    return latestEpisodeFallback;
  }
}

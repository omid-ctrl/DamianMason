import type { ReactNode } from 'react';
import { Button, Card, Heading, cx } from '@/components/ui';
import { NEW_TAB_NOTE, NEW_TAB_PROPS, isExternalHref } from '@/lib/links';

export type EpisodePlatformLink = {
  /** "Apple Podcasts", "Spotify", "Listen on Libsyn". */
  label: string;
  href: string;
};

export type EpisodeCardProps = {
  title: string;
  /** The canonical episode page. Turns the title into a link. */
  href?: string;
  /** Square show or episode artwork. */
  artwork?: string;
  /** Describe what the artwork shows. Empty string marks it decorative. */
  artworkAlt?: string;
  description?: ReactNode;
  /** "48:12" or "1:04:30". Also emitted as an ISO 8601 duration. */
  duration?: string;
  /** ISO date, for example '2026-02-11'. */
  date?: string;
  /** "142". Rendered as "Ep. 142". */
  episodeNumber?: string | number;
  /** The show the episode belongs to, for a mixed feed. */
  show?: string;
  platformLinks?: EpisodePlatformLink[];
  /** stacked artwork above the copy. row artwork beside it, from 480 up. */
  layout?: 'stacked' | 'row';
  /** Heading rank. Appearance stays fixed at --fs-lg. */
  headingLevel?: 2 | 3 | 4;
  /** Renders the card as an <li> inside an episode list. */
  as?: 'article' | 'li';
  className?: string;
};

/** "48:12" becomes "PT48M12S", "1:04:30" becomes "PT1H4M30S". Anything else
 *  returns undefined, and the duration renders as plain text. */
function toIsoDuration(duration: string): string | undefined {
  const parts = duration.trim().split(':');
  if (parts.length < 2 || parts.length > 3) return undefined;
  if (!parts.every((part) => /^\d+$/.test(part))) return undefined;

  const [hours, minutes, seconds] =
    parts.length === 3
      ? parts.map(Number)
      : [0, Number(parts[0]), Number(parts[1])];

  return `PT${hours > 0 ? `${hours}H` : ''}${minutes}M${seconds}S`;
}

function formatDate(value: string): { label: string; dateTime?: string } {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { label: value };

  return {
    label: new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(parsed),
    dateTime: parsed.toISOString().slice(0, 10),
  };
}

/**
 * One podcast episode: artwork, title, description, duration, platform links.
 *
 * The ruled card is the broadsheet default for an episode row, so there is no
 * box and no shadow, just the 2 unit rule across the top. Artwork uses the 1:1
 * card-thumbnail crop at a 50% 30% focal point, which keeps a face in frame on
 * the show avatars.
 */
export function EpisodeCard({
  title,
  href,
  artwork,
  artworkAlt = '',
  description,
  duration,
  date,
  episodeNumber,
  show,
  platformLinks,
  layout = 'row',
  headingLevel = 3,
  as = 'article',
  className,
}: EpisodeCardProps) {
  const isoDuration = duration ? toIsoDuration(duration) : undefined;
  const published = date ? formatDate(date) : undefined;
  const hasMeta = Boolean(show || episodeNumber || published || duration);

  return (
    <Card as={as} variant="ruled" className={cx('dm-episode', className)}>
      <div
        className={cx(
          'dm-episode__layout',
          layout === 'row' && artwork && 'dm-episode__layout--row',
        )}
      >
        {artwork ? (
          <div className="dm-episode__art">
            {/* eslint-disable-next-line @next/next/no-img-element -- artwork
                paths arrive from the content layer at unknown intrinsic sizes;
                the 1:1 box removes the layout shift next/image would buy. */}
            <img src={artwork} alt={artworkAlt} loading="lazy" decoding="async" />
          </div>
        ) : null}

        <div>
          {hasMeta ? (
            <p className="dm-episode__meta">
              {show ? <span>{show}</span> : null}
              {episodeNumber !== undefined ? <span>Ep. {episodeNumber}</span> : null}
              {published?.dateTime ? (
                <time dateTime={published.dateTime}>{published.label}</time>
              ) : published ? (
                <span>{published.label}</span>
              ) : null}
              {duration ? (
                isoDuration ? (
                  <time dateTime={isoDuration}>{duration}</time>
                ) : (
                  <span>{duration}</span>
                )
              ) : null}
            </p>
          ) : null}

          {/* The title link took whatever href the content layer gave it and
              never checked whether it left the site, so the three episode
              titles on /do-business-better-podcast/ replaced the page while the
              platform links six lines below opened a new tab. Same component,
              two behaviours. One test now covers both. */}
          <Heading level={headingLevel} size="lg" className="dm-episode__title">
            {href ? (
              <a
                className="dm-episode__link dm-link-bare"
                href={href}
                {...(isExternalHref(href) ? NEW_TAB_PROPS : {})}
              >
                {title}
                {isExternalHref(href) ? (
                  <span className="sr-only">{NEW_TAB_NOTE}</span>
                ) : null}
              </a>
            ) : (
              title
            )}
          </Heading>

          {description ? (
            /* The running-prose measure, not --wide. An episode summary is a
               paragraph of running text, not a standfirst: these are the
               longest paragraphs on the site and at --measure-wide they were
               also set at the widest measure on the site, which is the wrong
               pairing. Measured at 768, where the card takes the full 704px
               content width, the three summaries on
               /do-business-better-podcast/ ran 87, 90 and 95 characters per
               line over seven and eight lines. --measure-wide is 76ch and 76ch
               of Archivo is wider than the container at that width, so the cap
               was doing nothing at all. */
            <div className="dm-episode__body dm-prose">
              {typeof description === 'string' ? <p>{description}</p> : description}
            </div>
          ) : null}

          {platformLinks && platformLinks.length > 0 ? (
            <ul className="dm-episode__platforms" aria-label={`Listen to ${title}`}>
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Button
                    href={link.href}
                    variant="ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export default EpisodeCard;

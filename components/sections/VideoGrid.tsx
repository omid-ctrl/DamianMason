import type { Video } from '@/content/videos';
import { Heading, cx } from '@/components/ui';
import { VideoEmbed, type VideoCaptionTrack } from './VideoEmbed';

export type VideoGridColumns = 1 | 2 | 3;

export type VideoGridProps = {
  videos: Video[];
  /**
   * Keeps only the videos whose `onPages` contains this key, so a route can
   * hand over the whole set and get its own back.
   */
  page?: string;
  columns?: VideoGridColumns;
  /** Heading rank for each item title. Appearance stays fixed at --fs-lg. */
  headingLevel?: 2 | 3 | 4;
  /** Drops the visible titles where the surrounding copy already names them.
   *  The play control keeps the title in its accessible name either way. */
  showTitles?: boolean;
  /** Poster overrides, keyed by video id. */
  posters?: Record<string, string>;
  /** Caption tracks for the MP4 items, keyed by video id. */
  captions?: Record<string, VideoCaptionTrack>;
  /** Names the list for assistive tech when the section heading sits elsewhere. */
  label?: string;
  className?: string;
};

const COLUMN_CLASS: Record<VideoGridColumns, string> = {
  1: '',
  2: 'dm-video-grid--2',
  3: 'dm-video-grid--3',
};

/**
 * The video wall. Thirteen YouTube facades and three self-hosted MP4s across
 * the site, and not one raw third-party iframe among them: see VideoEmbed.
 */
export function VideoGrid({
  videos,
  page,
  columns = 2,
  headingLevel = 3,
  showTitles = true,
  posters,
  captions,
  label,
  className,
}: VideoGridProps) {
  const items = page ? videos.filter((video) => video.onPages.includes(page)) : videos;
  if (items.length === 0) return null;

  return (
    <ul
      className={cx('dm-video-grid', COLUMN_CLASS[columns], className)}
      aria-label={label}
    >
      {items.map((video) => (
        <li key={video.id} className="dm-video-grid__item">
          {showTitles ? (
            <Heading level={headingLevel} size="lg">
              {video.title}
            </Heading>
          ) : null}
          <VideoEmbed
            video={video}
            poster={posters?.[video.id]}
            captions={captions?.[video.id]}
          />
        </li>
      ))}
    </ul>
  );
}

export default VideoGrid;

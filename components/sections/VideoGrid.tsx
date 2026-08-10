import type { ReactNode } from 'react';

import type { Video } from '@/content/videos';
import { Heading, cx } from '@/components/ui';
import { VideoEmbed, type VideoCaptionTrack } from './VideoEmbed';

export type VideoGridColumns = 1 | 2 | 3 | 4;

export type VideoGridProps = {
  videos: Video[];
  /**
   * Keeps only the videos whose `onPages` contains this key, so a route can
   * hand over the whole set and get its own back.
   */
  page?: string;
  columns?: VideoGridColumns;
  /**
   * Heading rank for each item title. Appearance stays fixed at --fs-lg,
   * except in the 4-up row, where the column is a 9:16 frame's width and the
   * title steps down with it. See .dm-video-grid--4 in src/styles/sections.css.
   */
  headingLevel?: 2 | 3 | 4;
  /** Drops the visible titles where the surrounding copy already names them.
   *  The play control keeps the title in its accessible name either way. */
  showTitles?: boolean;
  /** Poster overrides, keyed by video id. */
  posters?: Record<string, string>;
  /** Caption tracks for the MP4 items, keyed by video id. */
  captions?: Record<string, VideoCaptionTrack>;
  /**
   * Per-route cutline overrides, keyed by video id. `VideoEmbed` already takes
   * a `cutline` and falls back to `video.description`; this is the way a grid
   * reaches it.
   *
   * It exists because one asset is placed on two routes. `demo-innovation` runs
   * on /keynote/ and on /collaboration-opportunities/, and with a single
   * description in content/videos.ts the two pages printed a byte-identical
   * cutline under the same frame. The description in content/videos.ts stays
   * the default and the sponsorship page says what the clip proves to a
   * sponsor. Do not use this to restate the title.
   */
  cutlines?: Record<string, ReactNode>;
  /** Names the list for assistive tech when the section heading sits elsewhere. */
  label?: string;
  className?: string;
};

const COLUMN_CLASS: Record<VideoGridColumns, string> = {
  1: '',
  2: 'dm-video-grid--2',
  3: 'dm-video-grid--3',
  /* The 9:16 row. Four portrait frames across, because a portrait frame in a
     landscape column can only ever be a narrow strip with dead ground beside
     it. Sized so the column IS the frame. */
  4: 'dm-video-grid--4',
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
  cutlines,
  label,
  className,
}: VideoGridProps) {
  const items = page ? videos.filter((video) => video.onPages.includes(page)) : videos;
  if (items.length === 0) return null;

  return (
    <ul
      className={cx('dm-video-grid', COLUMN_CLASS[columns], className)}
      aria-label={label}
      data-reveal="stagger"
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
            captions={
              captions?.[video.id] ?? (video.kind === 'mp4' ? video.captions : undefined)
            }
            cutline={cutlines?.[video.id]}
          />
        </li>
      ))}
    </ul>
  );
}

export default VideoGrid;

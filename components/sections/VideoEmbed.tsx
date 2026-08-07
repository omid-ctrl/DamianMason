'use client';

/**
 * 'use client' is here for one reason: the YouTube facade holds a single piece
 * of state, "has the visitor asked for the player yet", and swaps the poster
 * for the iframe on activation. Thirteen raw YouTube iframes cost roughly
 * 700KB of third-party JavaScript before a visitor presses anything, which is
 * the single largest performance win available on this site.
 *
 * The MP4 branch needs no client behaviour at all and renders identically on
 * the server. It shares this file so a caller has one component to reach for.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Video } from '@/content/videos';
import { cx } from '@/components/ui';

export type VideoCaptionTrack = {
  /** Path to a WebVTT file. */
  src: string;
  /** BCP 47 tag. Defaults to 'en'. */
  srcLang?: string;
  /** Shown in the browser's captions menu. */
  label?: string;
  /** Whether the track is on at load. Defaults to true. */
  isDefault?: boolean;
};

export type VideoEmbedProps = {
  video: Video;
  /**
   * Overrides the poster. YouTube falls back to the still YouTube already
   * hosts; an MP4 falls back to `video.poster`. One source MP4 currently ships
   * with no poster at all, so this is a first-class prop, not an afterthought.
   */
  poster?: string;
  /**
   * A captions track for the MP4 branch. Also first-class: none of the three
   * self-hosted files is captioned yet and a later phase adds the VTT.
   */
  captions?: VideoCaptionTrack;
  /** The cutline under the frame. Falls back to `video.description`. */
  cutline?: ReactNode;
  /** "FIG. 03" style prefix, for a page carrying more than one figure. */
  folio?: string;
  /** Only the hero asset on a page should ever be eager. */
  loading?: 'lazy' | 'eager';
  className?: string;
};

/** The still YouTube serves for every video. 480 by 360, and cropping it to
 *  16:9 removes exactly the letterbox bars it ships with. */
function youtubePoster(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

function youtubeSrc(youtubeId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

export function VideoEmbed({
  video,
  poster,
  captions,
  cutline,
  folio,
  loading = 'lazy',
  className,
}: VideoEmbedProps) {
  const [activated, setActivated] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // The play control disappears on activation, so focus has to land somewhere
  // deliberate. It lands in the player.
  useEffect(() => {
    if (activated) frameRef.current?.focus();
  }, [activated]);

  const caption = cutline ?? video.description;
  const posterSrc =
    poster ?? (video.kind === 'youtube' ? youtubePoster(video.youtubeId) : video.poster);

  return (
    <figure className={cx('dm-figure', 'dm-video', className)}>
      {/* data-surface="deep" rather than a hand-written light-on-dark override:
          the play control, its rule and its focus ring all resolve against a
          dark ground no matter which scope the figure is dropped into. */}
      <div className="dm-figure__media dm-video__stage" data-surface="deep">
        {video.kind === 'youtube' ? (
          activated ? (
            <iframe
              ref={frameRef}
              className="dm-video__frame"
              src={youtubeSrc(video.youtubeId)}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              tabIndex={-1}
            />
          ) : (
            <button
              type="button"
              className="dm-video__facade"
              onClick={() => setActivated(true)}
              aria-label={`Play video: ${video.title}`}
            >
              {posterSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element -- the
                   poster is a remote YouTube still, and next/image would need
                   a remotePatterns entry to serve a frame this component
                   already sizes with aspect-ratio, so there is no layout
                   shift to buy back. */
                <img
                  className="dm-video__poster"
                  src={posterSrc}
                  alt=""
                  width={480}
                  height={360}
                  loading={loading}
                  decoding="async"
                />
              ) : null}
              <span className="dm-video__play" aria-hidden="true">
                <svg viewBox="0 0 12 14" role="presentation" focusable="false">
                  <path d="M0 0 L12 7 L0 14 Z" />
                </svg>
              </span>
            </button>
          )
        ) : (
          <video
            className="dm-video__media"
            controls
            preload="none"
            poster={posterSrc}
            aria-label={video.title}
            playsInline
          >
            <source src={video.file} type="video/mp4" />
            {captions ? (
              <track
                kind="captions"
                src={captions.src}
                srcLang={captions.srcLang ?? 'en'}
                label={captions.label ?? 'English captions'}
                default={captions.isDefault ?? true}
              />
            ) : null}
            <p className="dm-video__fallback">
              Your browser can&rsquo;t play this video.{' '}
              <a href={video.file} download>
                Download the MP4
              </a>
              .
            </p>
          </video>
        )}
      </div>

      {caption ? (
        <figcaption className="dm-figure__caption">
          {folio ? <span className="dm-figure__folio">{folio} </span> : null}
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default VideoEmbed;

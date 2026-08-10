'use client';

/**
 * 'use client' is here for one reason: the YouTube facade holds a single piece
 * of state, "has the visitor asked for the player yet", and swaps the poster
 * for the iframe on activation. Thirteen raw YouTube iframes cost roughly
 * 700KB of third-party JavaScript before a visitor presses anything, which is
 * the single largest performance win available on this site.
 *
 * The MP4 branch keeps its plain <video controls> for a visitor with JavaScript
 * switched off, but that copy lives in a <noscript> block rather than in the
 * server render. The reason is the poster: `poster` has no lazy equivalent, so
 * a server-rendered <video poster> fetches its still at Medium priority no
 * matter how far down the page it sits. On /keynote/ that was 39KB of demo-reel
 * stills pulled ahead of the italic face for a video grid 6.5 viewports below
 * the fold, and blocking those three files was worth 3 Lighthouse points and
 * 0.37s of LCP. Inside <noscript> the same markup is inert text to any browser
 * with scripting on, so the bytes are only ever spent by the visitor who needs
 * them. The real <video> mounts on activation, which is also when its file is
 * first wanted.
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
   * A captions track for the MP4 branch. The three self-hosted files carry
   * their own English tracks in `content/videos.ts`; this prop remains an
   * escape hatch for a route-specific override.
   */
  captions?: VideoCaptionTrack;
  /** The cutline under the frame. Falls back to `video.description`. */
  cutline?: ReactNode;
  /** Only the hero asset on a page should ever be eager. */
  loading?: 'lazy' | 'eager';
  className?: string;
};

/** The still YouTube serves for every video. 480 by 360, and cropping it to
 *  16:9 removes exactly the letterbox bars it ships with. */
function youtubePoster(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/** Attribute-safe. These strings are ours, not a visitor's, but the no-JS
 *  player is assembled as raw HTML and an unescaped apostrophe in a title
 *  would still break the markup. */
function attr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * The whole no-JS branch, as a string, because a browser with scripting on
 * parses <noscript> content as raw text and React cannot hydrate JSX children
 * through it.
 *
 * The style rule is part of the contract, not decoration: with scripting off
 * the facade button is inert, so it is hidden and the real player takes the
 * grid cell. Both selectors are scoped to .dm-video--mp4, so the YouTube
 * facades are untouched.
 */
function noScriptPlayer(
  video: Extract<Video, { kind: 'mp4' }>,
  posterSrc: string | undefined,
  captions: VideoCaptionTrack | undefined,
): string {
  const track = captions
    ? `<track kind="captions" src="${attr(captions.src)}" srclang="${attr(captions.srcLang ?? 'en')}"` +
      ` label="${attr(captions.label ?? 'English captions')}"${(captions.isDefault ?? true) ? ' default' : ''}>`
    : '';
  return (
    '<style>.dm-video--mp4 .dm-video__facade{display:none}' +
    '.dm-video--mp4 noscript{display:contents}</style>' +
    `<video class="dm-video__media" controls preload="none"` +
    (posterSrc ? ` poster="${attr(posterSrc)}"` : '') +
    ` aria-label="${attr(video.title)}" playsinline>` +
    `<source src="${attr(video.file)}" type="video/mp4">${track}` +
    `<p class="dm-video__fallback">Your browser can&rsquo;t play this video. ` +
    `<a href="${attr(video.file)}" download>Download the MP4</a>.</p></video>`
  );
}

/** The canonical watch page. youtube-nocookie.com serves embeds only, so the
 *  no-JS anchor has to point at youtube.com. */
function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/**
 * The no-JS branch for a YouTube embed, as a string, for the same reason the
 * MP4 one is a string: a browser with scripting on parses <noscript> content
 * as raw text and React cannot hydrate JSX children through it.
 *
 * With scripting off the facade is a dead <button> that swallows the whole
 * 16:9 stage, so ten of the thirteen videos on this site had no route to the
 * video at all. The anchor here is a real link to the watch page and it takes
 * the facade's own geometry and classes, so the resting frame is pixel-identical
 * to the scripted one: same cropped still, same veil, same play control. The
 * only difference is that pressing it leaves the site.
 *
 * An iframe would also work and would keep the visitor here, but it costs the
 * full third-party player on a page whose scripts are switched off. A link is
 * the smaller promise and the one that always resolves.
 *
 * Both style selectors are scoped to .dm-video--youtube, so the MP4 branch is
 * untouched.
 */
function noScriptYouTube(
  video: Extract<Video, { kind: 'youtube' }>,
  posterSrc: string | undefined,
): string {
  return (
    '<style>.dm-video--youtube button.dm-video__facade{display:none}' +
    '.dm-video--youtube noscript{display:contents}</style>' +
    `<a class="dm-video__facade" href="${attr(youtubeWatchUrl(video.youtubeId))}"` +
    ' target="_blank" rel="noopener noreferrer">' +
    (posterSrc
      ? `<img class="dm-video__poster" src="${attr(posterSrc)}" alt="" width="480" height="360" decoding="async">`
      : '') +
    '<span class="dm-video__play" aria-hidden="true">' +
    '<svg viewBox="0 0 12 14" role="presentation" focusable="false"><path d="M0 0 L12 7 L0 14 Z"/></svg>' +
    `</span><span class="dm-video__nojs-label">Watch &ldquo;${attr(video.title)}&rdquo; on YouTube` +
    '</span></a>'
  );
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
  loading = 'lazy',
  className,
}: VideoEmbedProps) {
  const [activated, setActivated] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);

  // The play control disappears on activation, so focus has to land somewhere
  // deliberate. It lands in the player.
  useEffect(() => {
    if (!activated) return;
    if (frameRef.current) frameRef.current.focus();
    if (mediaRef.current) {
      mediaRef.current.focus();
      // The visitor already pressed play once. Asking them to press it again
      // in a second control is the bug the facade was meant to fix.
      void mediaRef.current.play().catch(() => {});
    }
  }, [activated]);

  const caption = cutline ?? video.description;
  const posterSrc =
    poster ?? (video.kind === 'youtube' ? youtubePoster(video.youtubeId) : video.poster);

  /**
   * Only a captioned embed is a figure. Without a cutline the `<figure>` would
   * announce as a nameless group around a control that already names itself
   * ("Play video: <title>"), which is noise, not structure. The visual box is
   * identical either way.
   */
  const Frame = caption ? 'figure' : 'div';

  /** One resting state for both branches: a duotone still and a play control
   *  centred over it. Both children sit in the same grid cell, which is what
   *  makes `object-fit: cover` crop the still to the 16:9 stage. */
  const facade = (
    <button
      type="button"
      className="dm-video__facade"
      onClick={() => setActivated(true)}
      aria-label={`Play video: ${video.title}`}
    >
      {posterSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element -- the YouTube
           poster is a remote still, and next/image would need a remotePatterns
           entry to serve a frame this component already sizes with
           aspect-ratio, so there is no layout shift to buy back. The MP4
           posters take the same path so both branches rest identically. */
        <img
          className="dm-video__poster"
          src={posterSrc}
          alt=""
          width={video.kind === 'youtube' ? 480 : 640}
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
  );

  return (
    <Frame
      className={cx(
        'dm-figure',
        'dm-video',
        video.kind === 'mp4' && 'dm-video--mp4',
        video.kind === 'youtube' && 'dm-video--youtube',
        /* A 9:16 recording gets a stage its own shape. In a 16:9 stage the
           cover crop lands on YouTube's 4:3 still, whose outer thirds are a
           blown-up duplicate of the real frame rather than black bars, and all
           four /reviews/ testimonials shipped as three mismatched panels
           because of it. On a 9:16 stage the same crop lands exactly on the
           202 real columns and the duplicate never paints. See the framing
           note in content/videos.ts. */
        video.framing === 'vertical' && 'dm-video--vertical',
        className,
      )}
    >
      {/* data-surface="deep" rather than a hand-written light-on-dark override:
          the play control, its rule and its focus ring all resolve against a
          dark ground no matter which scope the figure is dropped into. */}
      <div className="dm-figure__media dm-video__stage" data-surface="deep">
        {video.kind === 'youtube' ? (
          <>
            {activated ? (
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
              facade
            )}
            {/* The facade is a <button>, so with scripting off it is a control
                that does nothing covering the entire frame, and ten of the
                thirteen videos on this site had no reachable route to the
                video at all. This anchor is that route. It is inert text to
                any browser with scripting on, so it costs the normal visitor
                nothing. */}
            <noscript
              dangerouslySetInnerHTML={{
                __html: noScriptYouTube(video, posterSrc),
              }}
            />
          </>
        ) : (
          <>
            {/* The MP4 branch used to ship its player bare: native Chrome
                controls across the bottom of every frame and a full-colour
                poster, on a navy band two sections below three duotone
                figures. It was the only unstyled and only non-duotone media on
                the site, and it taught a visitor that Damian's videos have
                controls right before showing them four on the homepage that
                do not. It now rests behind the same facade the YouTube embeds
                use, and reveals the controls once the visitor asks for them.

                The resting frame is the facade's <img loading="lazy">, never
                the video's own `poster`, which has no lazy equivalent and would
                be fetched from the server render six viewports early. The
                <video> is mounted on activation, so nothing about the file or
                its still costs anything until a visitor asks. Every file behind
                `poster` is pre-resized to its displayed size. See the POSTER
                SIZING note in content/videos.ts before pointing this at
                anything larger. */}
            {activated ? (
              <video
                ref={mediaRef}
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
            ) : (
              facade
            )}
            <noscript
              dangerouslySetInnerHTML={{
                __html: noScriptPlayer(video, posterSrc, captions),
              }}
            />
          </>
        )}
      </div>

      {caption ? (
        <figcaption className="dm-figure__caption">
          {caption}
        </figcaption>
      ) : null}
    </Frame>
  );
}

export default VideoEmbed;

'use client';

/**
 * A third-party iframe that does not exist until a visitor asks for it.
 *
 * `loading="lazy"` is not a defence here. Chrome's lazy threshold runs to
 * several thousand pixels on a fast connection, so a player sitting anywhere
 * in the first screenful or two loads immediately anyway. The Libsyn embed on
 * /the-business-of-agriculture/ was measured at 892KB of third-party
 * JavaScript plus 1.6MB of artwork, fetched before anyone pressed anything,
 * which made that route roughly three times the weight of every other route on
 * the site.
 *
 * This is the same trade VideoEmbed already makes for YouTube: reserve the
 * box, render a real control, and mount the frame on activation. Plate and
 * frame share one height token, which is why the swap costs no layout shift.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button, Eyebrow, cx } from '@/components/ui';

export type EmbedFacadeProps = {
  /** The third-party URL. Only ever requested after activation. */
  src: string;
  /** The iframe's accessible name. */
  title: string;
  /**
   * The embed's own height in CSS pixels, carried from the provider's URL so
   * the element reserves its box before any stylesheet applies. The painted
   * height comes from --size-embed-player-h, which holds the same value; the
   * two are kept in step deliberately.
   */
  height: number;
  /** The mono running head on the plate. */
  eyebrow?: ReactNode;
  /** What the visitor gets, and what it costs them, in plain words. */
  children?: ReactNode;
  /** The control's label. */
  action?: string;
  className?: string;
};

export function EmbedFacade({
  src,
  title,
  height,
  eyebrow,
  children,
  action = 'Load the player',
  className,
}: EmbedFacadeProps) {
  const [activated, setActivated] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // The control that had focus is gone once the frame mounts, so focus is put
  // somewhere deliberate rather than being dropped back on <body>.
  useEffect(() => {
    if (activated) frameRef.current?.focus();
  }, [activated]);

  return (
    <div className={cx('dm-embed', className)}>
      {activated ? (
        <iframe
          ref={frameRef}
          className="dm-embed__frame"
          src={src}
          title={title}
          height={height}
          scrolling="no"
          allowFullScreen
          tabIndex={-1}
        />
      ) : (
        <div className="dm-embed__plate">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {children ? <p className="dm-embed__note">{children}</p> : null}
          <Button variant="secondary" onClick={() => setActivated(true)}>
            {action}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmbedFacade;

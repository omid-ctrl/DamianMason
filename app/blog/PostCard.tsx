import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/content/posts';
import { sharedImageAlt } from '@/content/image-alt';
import { Card, Heading, Prose, cx } from '@/components/ui';
import styles from './page.module.css';

/**
 * One post entry, on the broadsheet ruled row.
 *
 * Route-colocated rather than shared, because with two posts in the archive
 * this shape exists in exactly two places: the /blog/ index and the "more from
 * the blog" block at the foot of a post. If the archive ever grows past a
 * handful, this is the thing to promote into components/sections/.
 *
 * THE THUMB. This card had none, on the reading that both featured images were
 * screenshots. They are not: both are broadcast frame grabs, Straight Arrow
 * News and Cheddar News, carrying that newsroom's own kicker and headline in
 * the pixels. DESIGN_SYSTEM 6.4 rule 3 admits a capture as evidence once the
 * player chrome is cropped off and it sits on a --surface-plate figure with a
 * hairline and a cutline, and CROPS in scripts/normalize-assets.mjs is where
 * the chrome came off. A frame of Damian on air is the strongest thing either
 * of these seven-word posts has to show.
 *
 * It stays optional, and a post without one gets no placeholder: the ruled
 * card was a complete object before the thumb existed and still is.
 */
export type PostCardProps = {
  post: Post;
  /** Decorative broadsheet index, "01". aria-hidden, never read aloud. */
  index?: number;
  /** Rank, independent of appearance. The index page uses 2, a post uses 3. */
  headingLevel?: 2 | 3;
  className?: string;
};

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/** Formats an ISO date in UTC so the server's timezone never shifts the day. */
export function formatPostDate(iso: string): string {
  return DATE_FORMAT.format(new Date(`${iso}T00:00:00Z`));
}

export function PostCard({ post, index, headingLevel = 2, className }: PostCardProps) {
  const href = `/blog/${post.slug}/`;

  return (
    <Card as="li" variant="ruled" className={cx(styles.item, className)}>
      {post.image ? (
        // Square, per the card-thumbnail row of DESIGN_SYSTEM 6.3. Both frames
        // are 16:9 and both put Damian in the left or the centre box, so the
        // 50% 30% focal point the ratio ships with keeps a face in the crop.
        <div className={cx('dm-photo', styles.thumb)}>
          <Image
            className="dm-photo__img"
            src={post.image.src}
            alt={sharedImageAlt(post.image.src)}
            width={post.image.width}
            height={post.image.height}
            loading="lazy"
            /* The box is --size-thumb, which tops out at 10rem. Unhinted, a
               2000px source pulls the 1920px candidate into a 160px slot. */
            sizes="10rem"
          />
        </div>
      ) : null}

      <p className={styles.meta}>
        {index !== undefined ? (
          <span className={styles.index} aria-hidden="true">
            {String(index).padStart(2, '0')}
          </span>
        ) : null}
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </p>

      <Heading level={headingLevel} size="xl" className={styles.title}>
        <Link className={cx(styles.titleLink, 'dm-link-bare')} href={href}>
          {post.title}
        </Link>
      </Heading>

      <Prose className={styles.excerpt}>
        <p>{post.excerpt}</p>
      </Prose>

      <p className={styles.more}>
        <Link className="dm-action-link" href={href}>
          Read the post
          <span className="sr-only">: {post.title}</span>
        </Link>
      </p>
    </Card>
  );
}

export default PostCard;

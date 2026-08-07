import Link from 'next/link';
import type { Post } from '@/content/posts';
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
 * There is no thumbnail. Both source posts carried a raw macOS screenshot of
 * another publisher's page as their featured image, and DESIGN_SYSTEM 6.4 sends
 * a screenshot-only slot to a ruled card with a real headline instead.
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
        <Link href={href}>
          Read the post
          <span className="sr-only">: {post.title}</span>
        </Link>
      </p>
    </Card>
  );
}

export default PostCard;

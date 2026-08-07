import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Container, Eyebrow, Heading, Prose, Rule, Section, cx } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { PressList } from '@/components/sections/PressList';
import { VideoEmbed } from '@/components/sections/VideoEmbed';
import { JsonLd } from '@/components/seo';
import { postBySlug, posts, postsByDate } from '@/content/posts';
import { press } from '@/content/press';
import { videos, type Video } from '@/content/videos';
import {
  buildBreadcrumbListSchema,
  buildVideoObjectSchema,
  schemaIds,
  type JsonLdDocument,
} from '@/lib/schema';
import { SITE_LANGUAGE, buildMetadata, canonicalUrl } from '@/lib/seo';
import { PostCard, formatPostDate } from '../PostCard';
import styles from './page.module.css';

/**
 * /blog/[slug]/ , the post template.
 *
 * Read content/posts.ts before touching this file. Both post bodies are real,
 * verbatim and almost empty: seven words on one, five on the other. This
 * template renders exactly what is there and then does the one thing the
 * originals never did, which is link to the piece the post is about. The
 * Cheddar segment was a YouTube video the whole time and the old page showed a
 * still frame of it, so the video gets embedded here.
 *
 * Neither featured image ships. Both are raw macOS screenshots of another
 * publisher's page, and DESIGN_SYSTEM 6.4 rules a screenshot out of a hero and
 * out of the fold, and sends a screenshot-only slot to a typographic treatment
 * with a real headline and a real link instead. That is the ruled source card
 * and the video frame below.
 */

type RouteParams = { slug: string };

/** Editorial framing for the source block. One entry per post, written for the
 *  rebuild against docs/VOICE.md. Nothing here is a claim the linked piece and
 *  its own headline do not already make. */
const SOURCE_NOTE: Record<string, string> = {
  'eggflation-gives-producers-record-profits':
    'Simone Del Rosario wrote it for Straight Arrow News in December 2022, and Damian supplied the ag economics: producers were booking record profits while the grocery aisle turned into a meme. If you buy eggs or price them, it’s a short read.',
  'how-the-climate-crisis-is-causing-food-shortages-globally':
    'Cheddar News booked Damian in April 2023 to talk about climate pressure and the global food supply. Here’s the segment, in full. Nothing loads until you press play.',
};

function youtubeIdFrom(url: string): string | undefined {
  const match = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/.exec(url);
  return match?.[1];
}

/**
 * Renders the verbatim body. Blank lines become paragraphs and a single
 * newline becomes a <br>, which is what preserves the line break between
 * "Damian featured in Straight Arrow News" and "By Simone Del Rosario". That
 * break is exactly what the old excerpt dropped, and dropping it is what
 * produced "Straight Arrow NewsBy Simone Del Rosario" on the live archive.
 */
function PostBody({ body }: { body: string }) {
  return (
    <>
      {body.split(/\n{2,}/).map((paragraph, paragraphIndex) => {
        const lines = paragraph
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        return (
          <p key={paragraphIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

export function generateStaticParams(): RouteParams[] {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: 'Post not found',
      description: 'That post is not on damianmason.com. The blog archive lists everything that is.',
      path: '/blog/',
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const post = postBySlug(slug);

  if (!post) notFound();

  const path = `/blog/${post.slug}/`;
  const url = canonicalUrl(path);

  // The outlet, its name and its media type all already live in content/press.ts,
  // keyed by the same URL the post points at. Matching on that URL keeps the
  // post and the media archive from ever disagreeing about who published it.
  const source = post.sourceUrl ? press.find((item) => item.url === post.sourceUrl) : undefined;

  const youtubeId = post.sourceUrl ? youtubeIdFrom(post.sourceUrl) : undefined;
  const video = youtubeId
    ? videos.find(
        (item): item is Extract<Video, { kind: 'youtube' }> =>
          item.kind === 'youtube' && item.youtubeId === youtubeId,
      )
    : undefined;

  const note = SOURCE_NOTE[post.slug];
  const others = postsByDate().filter((other) => other.slug !== post.slug);
  const thumbnail = video ? `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg` : undefined;

  const breadcrumbSchema = buildBreadcrumbListSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog/' },
    { name: post.title, path },
  ]);

  const articleSchema: JsonLdDocument = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'BlogPosting'],
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    inLanguage: SITE_LANGUAGE,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: 'Blog',
    author: { '@id': schemaIds.person },
    publisher: { '@id': schemaIds.organization },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${canonicalUrl('/blog/')}#blog`,
      name: 'Damian Mason, Blog',
      url: canonicalUrl('/blog/'),
    },
    ...(thumbnail ? { image: thumbnail } : {}),
    ...(source
      ? {
          citation: {
            '@type': 'CreativeWork',
            name: source.title,
            url: source.url,
            publisher: { '@type': 'Organization', name: source.outlet },
          },
        }
      : {}),
  };

  const videoSchema = video
    ? buildVideoObjectSchema({
        name: video.title,
        description: post.excerpt,
        uploadDate: post.date,
        youtubeId: video.youtubeId,
        path,
      })
    : undefined;

  const schema: JsonLdDocument[] = videoSchema
    ? [breadcrumbSchema, articleSchema, videoSchema]
    : [breadcrumbSchema, articleSchema];

  return (
    <>
      <JsonLd schema={schema} />

      <Section>
        <Container width="text">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <ol className={styles.crumbs}>
              <li className={styles.crumb}>
                <Link href="/">Home</Link>
                <span className={styles.crumbMark} aria-hidden="true">
                  /
                </span>
              </li>
              <li className={styles.crumb}>
                <Link href="/blog/">Blog</Link>
                <span className={styles.crumbMark} aria-hidden="true">
                  /
                </span>
              </li>
              <li className={cx(styles.crumb, styles.crumbCurrent)} aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <article>
            <header>
              {source ? <Eyebrow tone="accent">{source.outlet}</Eyebrow> : null}

              <Heading level={1} display size="4xl" className={styles.title}>
                {post.title}
              </Heading>

              <p className={styles.byline}>
                <span>By {post.author}</span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </p>

              <Rule className={styles.headRule} />
            </header>

            <Prose className={styles.body}>
              <PostBody body={post.body} />
            </Prose>

            {source ? (
              <div className={styles.source}>
                <Heading level={2}>
                  {video ? 'Watch the segment' : 'Read it at the source'}
                </Heading>

                {note ? (
                  <Prose className={styles.sourceCopy}>
                    <p>{note}</p>
                  </Prose>
                ) : null}

                <div className={styles.sourceMedia}>
                  {video ? (
                    <>
                      <VideoEmbed
                        video={video}
                        folio="FIG. 01"
                        cutline={`${source.outlet}, ${formatPostDate(post.date)}. Damian Mason on climate pressure and the global food supply. The player loads from YouTube only after you press play.`}
                      />
                      {/* The player is a facade, so it needs JavaScript. This
                          link does not, which keeps the source reachable no
                          matter what the visitor's browser is doing. */}
                      <p className={styles.sourceFallback}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          Open the segment on YouTube
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </p>
                    </>
                  ) : (
                    <PressList
                      items={[source]}
                      headingLevel={3}
                      label={`Source for ${post.title}`}
                    />
                  )}
                </div>
              </div>
            ) : null}
          </article>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section surface="sunken" density="tight" aria-labelledby="more-posts">
          <Container width="narrow">
            <Heading level={2} id="more-posts" className={styles.moreHead}>
              More from the blog
            </Heading>

            <ul className={styles.moreList}>
              {others.map((other) => (
                <PostCard key={other.slug} post={other} headingLevel={3} />
              ))}
            </ul>

            <div className={styles.backRow}>
              <Button href="/blog/" variant="secondary">
                All posts
              </Button>
              <Button href="/blog-news/" variant="secondary">
                See the media archive
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      <CTABand
        id="post-booking"
        eyebrow="Booking"
        heading="Book the economist the newsrooms call."
        copy="Since 1994 Damian has spoken to over 2,400 audiences in all 50 states and 7 foreign countries. Your date either works or it doesn’t. First step: send it to the office and find out."
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
          { label: 'See the keynote', href: '/keynote/', variant: 'secondary' },
        ]}
      />
    </>
  );
}

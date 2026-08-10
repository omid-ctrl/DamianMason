import { Fragment } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Container, Eyebrow, Heading, Prose, Rule, Section, cx } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { PressList } from '@/components/sections/PressList';
import { VideoEmbed } from '@/components/sections/VideoEmbed';
import { JsonLd } from '@/components/seo';
import { sharedImageAlt } from '@/content/image-alt';
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
 * BOTH FEATURED IMAGES NOW SHIP, as a 3:2 plate under the byline. The earlier
 * reading was that they were screenshots of another publisher's page. They are
 * frame grabs off a broadcast, carrying that newsroom's own kicker and
 * headline burned into the pixels, and DESIGN_SYSTEM 6.4 rule 3 admits a
 * capture as evidence once the player chrome is cropped, it sits on a plate
 * with a hairline, and the cutline says what it is. All three hold here. The
 * chrome came off in CROPS, in scripts/normalize-assets.mjs.
 *
 * The plate is deliberately below the byline rather than above the headline:
 * rule 1 keeps a capture out of a hero, and this is the article's first
 * figure, not its masthead.
 */

type RouteParams = { slug: string };

/** Editorial framing for the source block. One entry per post, written for the
 *  rebuild against docs/VOICE.md. Nothing here is a claim the linked piece and
 *  its own headline do not already make. */
/**
 * The closing band's copy, per post.
 *
 * One CTABand serves both posts, so a single hard-coded string renders twice
 * across the site by construction: a reader who opens both articles reads the
 * identical booking pitch under each. It is keyed by slug for the same reason
 * SOURCE_NOTE is, and each one leads on that post's own subject.
 *
 * A new post with no entry here falls back to BOOKING_COPY_FALLBACK, which
 * says nothing post-specific and is therefore safe to repeat once.
 */
const BOOKING_COPY: Record<string, string> = {
  'eggflation-gives-producers-record-profits':
    'Egg prices got twenty minutes of national coverage and about four minutes of explanation. Damian does the other sixteen, on a stage, for a room that already knows what a laying flock costs. Send him a date.',
  'how-the-climate-crisis-is-causing-food-shortages-globally':
    'A camera crew gets four minutes. Your association gets sixty to ninety, and gets to ask questions at the end of them. Send the office a date and find out whether it is open.',
};

/** Same reason as BOOKING_COPY: one band, two posts, two headings. */
const BOOKING_HEADING: Record<string, string> = {
  'eggflation-gives-producers-record-profits': 'Get the whole egg story, not the clip.',
  'how-the-climate-crisis-is-causing-food-shortages-globally':
    'Book the economist the newsrooms call.',
};

const BOOKING_HEADING_FALLBACK = 'Book the economist the newsrooms call.';

const BOOKING_COPY_FALLBACK =
  'Damian says the same things on a stage that he says on camera, at rather greater length. Send the office a date and find out whether it is open.';

/**
 * The cutline under the header plate, per post. Same reason as BOOKING_COPY:
 * one template, two posts, and a cutline is a humour slot rather than a label,
 * so it cannot be generated from the outlet and the date.
 *
 * Both of these state two things that are literally in the frame and stop.
 */
const IMAGE_CUTLINE: Record<string, string> = {
  'eggflation-gives-producers-record-profits':
    'Straight Arrow News, December 2022. The headline says Cal-Maine’s profit went up 165 times. The internet went with a meme.',
  'how-the-climate-crisis-is-causing-food-shortages-globally':
    'Cheddar News, April 2023. The question on screen is about the food supply. The ticker running under it is about the Dow.',
};

const SOURCE_NOTE: Record<string, string> = {
  'eggflation-gives-producers-record-profits':
    'Simone Del Rosario wrote it for Straight Arrow News in December 2022, and Damian is quoted in it: producers were booking record profits while the grocery aisle turned into a meme. If you buy eggs or price them, it’s a short read.',
  'how-the-climate-crisis-is-causing-food-shortages-globally':
    'Cheddar News booked Damian in April 2023 to talk about climate pressure and the global food supply. Here’s the segment, in full.',
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

  // `seoTitle` is the headline cut to fit a SERP. Both live headlines run long
  // enough that the site suffix would push them past 60 characters and Google
  // would rewrite them for us. The H1 on the page is still `post.title`.
  return buildMetadata({
    title: post.seoTitle ?? post.title,
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
    // A 'posted' entry is a link out to somebody else's piece, so the author of
    // this page is the site, not Damian. Naming the Person here made a search
    // result for Straight Arrow News's own headline credit him with writing it.
    author:
      post.authorRole === 'posted'
        ? { '@id': schemaIds.organization }
        : { '@id': schemaIds.person },
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

              {/* "Posted by", not "By", on a post that is coverage of Damian
                  rather than writing by him. The Eggflation body carries its
                  own byline three lines below this one ("By Simone Del
                  Rosario"), so a bare "By Damian Mason" put two bylines that
                  disagree inside one screen, under a headline that belongs to
                  Straight Arrow News. content/posts.ts sets authorRole. */}
              <p className={styles.byline}>
                <span>
                  {post.authorRole === 'posted' ? 'Posted by' : 'By'} {post.author}
                </span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </p>

              <Rule className={styles.headRule} />

              {post.image ? (
                <figure className={cx('dm-figure', styles.plate)}>
                  <div className="dm-photo dm-photo--evidence dm-photo--uncropped">
                    <Image
                      className="dm-photo__img"
                      src={post.image.src}
                      alt={sharedImageAlt(post.image.src)}
                      width={post.image.width}
                      height={post.image.height}
                      loading="lazy"
                      sizes="(min-width: 64rem) 41rem, 100vw"
                    />
                  </div>
                  <figcaption className="dm-figure__caption">
                    {IMAGE_CUTLINE[post.slug]}
                  </figcaption>
                </figure>
              ) : null}
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
                        /* Fig. 02 since the header gained a plate above it. */
                        cutline={`${source.outlet}, ${formatPostDate(post.date)}. A national news desk calling an Indiana farm owner about the global food supply.`}
                      />
                      {/* The player is a facade, so it needs JavaScript. This
                          link does not, which keeps the source reachable no
                          matter what the visitor's browser is doing. */}
                      <p className={styles.sourceFallback}>
                        <a
                          className="dm-action-link"
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                      /* This row and the plate in the header above resolve to
                         the same file, and they would land about 600px apart
                         on the same screen. The media archive is where that
                         thumb earns its place; here it is the picture the
                         reader has already looked at. */
                      thumbs={false}
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
          {/* The same measure and the same axis as the article above it. At
              width="narrow" this block opened at x=320 under an article that
              opens at x=400, so a post ran three left edges down one page
              (400, then 320, then the full-width band at 96) with the 80px step
              landing between two stacked blocks. One measure for the reading
              column, then one step out to the band. */}
          <Container width="text">
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
        /* The article is set in `text` from the breadcrumb down, so the band
           closing it is too. See the prop's note in CTABand: at `max` this was
           the only element on either post that did not hang at x=400. */
        containerWidth="text"
        eyebrow="Booking"
        heading={BOOKING_HEADING[post.slug] ?? BOOKING_HEADING_FALLBACK}
        /* Per post, from BOOKING_COPY. The hard-coded string this replaces also
           dropped the "since 1994 / 2,400 audiences / 50 states / 7 foreign
           countries" run, which was the single most repeated passage on the
           site at eleven routes, and the "First step" formula, which was on
           nine. */
        copy={BOOKING_COPY[post.slug] ?? BOOKING_COPY_FALLBACK}
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
          { label: 'See the keynote', href: '/keynote/', variant: 'secondary' },
        ]}
      />
    </>
  );
}

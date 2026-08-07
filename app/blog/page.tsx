import type { Metadata } from 'next';
import { Button, Container, Eyebrow, Heading, Prose, Section, cx } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import { JsonLd } from '@/components/seo';
import { postsByDate } from '@/content/posts';
import {
  buildBreadcrumbListSchema,
  schemaIds,
  type JsonLdDocument,
} from '@/lib/schema';
import { SITE_LANGUAGE, buildMetadata, canonicalUrl } from '@/lib/seo';
import { PostCard } from './PostCard';
import styles from './page.module.css';

/**
 * /blog/ , the post archive.
 *
 * The old page had no H1, no intro copy, no meta description, an empty
 * pagination block, a sidebar widget that was a blank <h2>, and two excerpts
 * that were both visibly broken. It also has exactly two posts, and it always
 * will until the client writes more. So the page is designed for two: two full
 * broadsheet entries side by side, and a section underneath that says plainly
 * where the rest of the work actually lives.
 */

const posts = postsByDate();

export const metadata: Metadata = buildMetadata({
  title: 'Agriculture Blog',
  description:
    'Two posts on what food actually costs: record 2022 egg profits for producers, and the climate pressure behind global food shortages. Read them both.',
  path: '/blog/',
});

const breadcrumbSchema = buildBreadcrumbListSchema([
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog/' },
]);

const blogSchema: JsonLdDocument = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${canonicalUrl('/blog/')}#blog`,
  name: 'Damian Mason, Blog',
  description:
    'Posts from Damian Mason on the business of food, fuel, and fiber, each one pointing at the newsroom appearance it came from.',
  url: canonicalUrl('/blog/'),
  inLanguage: SITE_LANGUAGE,
  author: { '@id': schemaIds.person },
  publisher: { '@id': schemaIds.organization },
  blogPost: posts.map((post) => ({
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl(`/blog/${post.slug}/`)}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: canonicalUrl(`/blog/${post.slug}/`),
    author: { '@id': schemaIds.person },
  })),
};

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema, blogSchema]} />

      <Hero
        id="blog"
        eyebrow="Filed from the Indiana farm office"
        title="Blog"
        deck="Two posts. Both are about what food costs. When Straight Arrow News or Cheddar News needs an ag economist on the record about egg prices or a global food shortage, they call Damian. You’ll find both here, with the source attached."
        cutline="Both posts are Damian in somebody else’s newsroom: Straight Arrow News in December 2022, Cheddar News in April 2023."
      />

      <Section surface="sunken">
        <Container>
          <ul className={cx('dm-grid12', styles.list)} aria-label="Blog posts">
            {posts.map((post, position) => (
              <PostCard
                key={post.slug}
                post={post}
                index={position + 1}
                headingLevel={2}
                className="col-span-6"
              />
            ))}
          </ul>
        </Container>
      </Section>

      <Section density="tight" aria-labelledby="rest-of-it">
        <Container>
          <div className="dm-grid12">
            <div className="col-span-6 md:col-span-8 lg:col-span-7">
              <Eyebrow>The rest of the record</Eyebrow>
              <Heading level={2} id="rest-of-it">
                Where the rest of it is
              </Heading>
              <Prose className={styles.blurb}>
                <p>
                  Two posts is the whole blog archive. The weekly work goes somewhere else: a
                  new podcast episode every Monday for more than 40,000 listeners, and nine
                  press appearances on the Media page, from Forbes to Newsmax. If you want
                  volume, that’s where it is.
                </p>
              </Prose>
              <div className={styles.actions}>
                <Button href="/blog-news/" variant="secondary">
                  See the media archive
                </Button>
                <Button href="/podcasts/" variant="secondary">
                  Hear the podcasts
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        id="blog-booking"
        eyebrow="Booking"
        heading="Two posts here. Over 2,400 audiences out there."
        copy="Since 1994 Damian has taken a Purdue Ag Econ degree and a Second City stage to 2,400 audiences in all 50 states and 7 foreign countries. Growers, lenders, agronomists: if you want that hour, the office keeps the calendar. It’s one email."
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
          { label: 'See the keynote', href: '/keynote/', variant: 'secondary' },
        ]}
      />
    </>
  );
}

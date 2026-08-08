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
import { PressList } from '@/components/sections/PressList';
import { press } from '@/content/press';
import { imageAlt } from '@/content/image-alt';

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
    // Same rule as the post template: a 'posted' entry is coverage of Damian
    // written by somebody else, so the author of the page is the site.
    author:
      post.authorRole === 'posted'
        ? { '@id': schemaIds.organization }
        : { '@id': schemaIds.person },
  })),
};

/**
 * The seven press items that are NOT the two posts above.
 *
 * The filter is required, not tidy: content/press.ts records at both of these
 * ids that the item IS the blog post, so without it each of the two would
 * render twice on one page, once as a card and once as a row.
 */
const OWN_POSTS = ['san-eggflation-record-profits', 'cheddar-climate-food-shortages'];
const OTHER_COVERAGE = press.filter((item) => !OWN_POSTS.includes(item.id));

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema, blogSchema]} />

      <Hero
        id="blog"
        /* "Filed from the Indiana farm office" used to fly on three routes at
           once. It came off this one first, and off /about/, its last holdout,
           in the Cool Modern Ag revision: it was costume rather than
           biography. A blog index gets an eyebrow about the writing anyway,
           not about the desk. */
        eyebrow="Two interviews, written up"
        title="Blog"
        deck="Two posts. Both are about what food costs. When Straight Arrow News or Cheddar News needs an ag economist on the record about egg prices or a global food shortage, they call Damian. You’ll find both here, with the source attached."
        /* A type-only hero with no action, on a two-post archive, was the
           thinnest opening on the site. The desk is the honest picture for a
           blog index: it is where the writing happens, and it is the same frame
           /join-the-conversation/ closes on, which is deliberate rather than a
           reuse. The two routes are the same promise in two formats. */
        image={{
          src: '/img/photos/podcast-desk.jpg',
          alt: imageAlt['/img/photos/podcast-desk.jpg'],
          width: 2000,
          height: 1308,
          feature: true,
        }}
        actions={[
          { label: 'See the media archive', href: '/blog-news/', variant: 'secondary' },
        ] as const}
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

      {/* THE SECTION ABOVE SAYS WHERE THE REST OF IT IS. This shows it.

          A two-post archive that ends on a paragraph explaining that the real
          work is somewhere else is a page apologising for itself. The nine
          press items are the real work, they are already in content/press.ts
          with verified outbound links, and two of them ARE these two posts,
          which is why they are filtered out below rather than rendered twice.

          Navy, because this route ran 3,412px of one grey and four images. */}
      <Section id="elsewhere" surface="deep-alt" aria-labelledby="elsewhere-title">
        <Container>
          <div className="dm-grid12">
            <div className="dm-rail col-span-6 md:col-span-4">
              <Eyebrow>Also on the record</Eyebrow>
              <Heading level={2} size="2xl" id="elsewhere-title">
                Where the rest of it ran
              </Heading>
              <Prose measure="narrow">
                <p>
                  The posts above are two of nine. The other seven ran in
                  somebody else&rsquo;s publication, which is where an interview
                  belongs, and every one of them is linked at the source.
                </p>
              </Prose>
            </div>
            <div className="col-span-6 md:col-span-8">
              <PressList
                items={OTHER_COVERAGE}
                limit={4}
                headingLevel={3}
                label="Coverage elsewhere"
              />
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        id="blog-booking"
        eyebrow="Booking"
        heading="Two posts here. Over 2,400 audiences out there."
        /* The "growers, lenders, agronomists" triplet was on seven routes. This
           route's own audience is the one that reads the coverage, so it names
           them instead. */
        copy="The same analysis Straight Arrow News and Cheddar News put on air runs 60 to 90 minutes on a stage. If your association or your dealer meeting wants that hour, the office keeps the calendar. It’s one email."
        actions={[
          { label: 'Book Damian', href: '/contact-us/' },
          { label: 'See the keynote', href: '/keynote/', variant: 'secondary' },
        ]}
      />
    </>
  );
}

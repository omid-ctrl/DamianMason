import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo';
import { CTABand } from '@/components/sections/CTABand';
import { Hero } from '@/components/sections/Hero';
import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
  type Surface,
} from '@/components/ui';
import { books, type Book } from '@/content/books';
import {
  buildBreadcrumbListSchema,
  schemaIds,
  type JsonLdDocument,
} from '@/lib/schema';
import {
  SITE_LANGUAGE,
  absoluteUrl,
  buildMetadata,
  canonicalUrl,
} from '@/lib/seo';

import styles from './page.module.css';

const PATH = '/books/';

const HERO_IMAGE = {
  src: '/img/photos/food-fear-hardback.jpg',
  alt: 'A hardback copy of Food Fear stands between two stacks of the book on a walnut table.',
  width: 1555,
  height: 1103,
};

type Cover = {
  src: string;
  alt: string;
};

const COVERS: Record<string, Cover> = {
  'food-fear': {
    src: '/img/photos/food-fear-book-cover.png',
    alt: 'Food Fear book cover: a tomato held in an open palm casts the shadow of a monster.',
  },
  'food-fear-audiobook': {
    src: '/img/photos/food-fear-audiobook-cover.png',
    alt: 'Food Fear audiobook cover, marked with headphones and an open book.',
  },
  'do-business-better': {
    src: '/img/photos/do-business-better-book-cover.png',
    alt: 'Do Business Better book cover by Damian Mason.',
  },
};

type Edition = {
  book: Book;
  cover: Cover;
  surface: Surface;
  imageSide: 'left' | 'right';
  formatLabel: string;
  descriptionNote?: string;
  editorialNote?: string;
  availability: string;
  photo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
};

const EDITION_DETAILS: Record<string, Omit<Edition, 'book' | 'cover'>> = {
  'food-fear': {
    surface: 'page',
    imageSide: 'left',
    formatLabel: 'Print edition',
    availability:
      'A verified current retailer link is not available yet. Contact Damian’s office for current availability.',
    photo: {
      src: '/img/photos/book-signing-table.jpg',
      alt: 'Damian Mason signs copies of Food Fear while event attendees wait at the book table.',
      width: 2000,
      height: 1500,
      caption: 'Damian signs Food Fear while attendees wait at the table after an event.',
    },
  },
  'food-fear-audiobook': {
    surface: 'deep-alt',
    imageSide: 'right',
    formatLabel: 'Audiobook edition',
    descriptionNote:
      'The audio listing carries the same publisher description as the print edition.',
    availability:
      'A current listening or purchase destination, narrator, and runtime have not been verified. Contact Damian’s office for availability.',
  },
  'do-business-better': {
    surface: 'sunken',
    imageSide: 'left',
    formatLabel: 'Print edition',
    editorialNote:
      'The source description for this title ends mid-sentence. The text above stops at its last complete sentence instead of guessing at the missing words.',
    availability:
      'A verified current retailer link is not available yet. Contact Damian’s office for current availability.',
  },
};

const EDITIONS: Edition[] = books.map((book) => ({
  book,
  cover: COVERS[book.slug],
  ...EDITION_DETAILS[book.slug],
}));

const RESOURCES = [
  {
    label: 'Listen',
    title: 'Podcasts',
    description:
      'The Business of Agriculture, UPROOTED, Do Business Better, and XtremeAg, gathered in one place.',
    href: '/podcasts/',
  },
  {
    label: 'Read and watch',
    title: 'Articles and media',
    description: 'Damian’s own articles plus broadcast and publication appearances.',
    href: '/blog-news/',
  },
  {
    label: 'Plan an event',
    title: 'Speaker resources',
    description:
      'Program details, testimonials, the speaker one-sheet, and meeting coordinator resources.',
    href: '/speaking/',
  },
  {
    label: 'Follow the work',
    title: 'Newsletter',
    description:
      'New podcast-release notices and commentary on the business of food, fuel, and fiber.',
    href: '/join-the-conversation/',
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: 'Books & Resources',
  description:
    'Explore Food Fear in print and audio and Do Business Better in print, with each edition’s cover, available sourced description, first-party photography, and related resources.',
  path: PATH,
  image: {
    url: HERO_IMAGE.src,
    width: HERO_IMAGE.width,
    height: HERO_IMAGE.height,
    alt: HERO_IMAGE.alt,
  },
});

const BOOK_FORMAT: Record<Book['format'], string> = {
  paperback: 'https://schema.org/Paperback',
  audiobook: 'https://schema.org/AudiobookFormat',
};

const booksPageSchema: JsonLdDocument = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${canonicalUrl(PATH)}#webpage`,
  name: 'Books and resources by Damian Mason',
  description:
    'Food Fear in print and audio, Do Business Better in print, and related first-party resources from Damian Mason.',
  url: canonicalUrl(PATH),
  inLanguage: SITE_LANGUAGE,
  isPartOf: { '@id': schemaIds.website },
  about: { '@id': schemaIds.person },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: absoluteUrl(HERO_IMAGE.src),
    width: HERO_IMAGE.width,
    height: HERO_IMAGE.height,
    caption: HERO_IMAGE.alt,
  },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: EDITIONS.length,
    itemListElement: EDITIONS.map(({ book, cover }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Book',
        '@id': `${canonicalUrl(PATH)}#${book.slug}-book`,
        name: book.subtitle ? `${book.title}: ${book.subtitle}` : book.title,
        description: book.description,
        url: `${canonicalUrl(PATH)}#${book.slug}`,
        image: absoluteUrl(cover.src),
        bookFormat: BOOK_FORMAT[book.format],
        author: { '@id': schemaIds.person },
      },
    })),
  },
};

const breadcrumbSchema = buildBreadcrumbListSchema([
  { name: 'Home', path: '/' },
  { name: 'Books & Resources', path: PATH },
]);

function bookParagraphs(description: string): string[] {
  const lastStop = description.lastIndexOf('.');
  const complete = lastStop === -1 ? description : description.slice(0, lastStop + 1);

  return complete
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function EditionFeature({ edition, position }: { edition: Edition; position: number }) {
  const { book, cover, photo } = edition;
  const titleId = `${book.slug}-title`;
  const dark = edition.surface === 'deep' || edition.surface === 'deep-alt';

  return (
    <Section
      id={book.slug}
      surface={edition.surface}
      aria-labelledby={titleId}
      className={styles.editionSection}
    >
      <Container>
        <article className={styles.edition} data-image-side={edition.imageSide}>
          <div
            className={`${styles.editionVisual} ${
              photo ? styles.editionVisualWithPhoto : styles.editionVisualCoverOnly
            }`}
          >
            {photo ? (
              <figure className={`dm-figure ${styles.editionPhoto}`}>
                <div className="dm-photo dm-photo--plate">
                  <Image
                    className="dm-photo__img"
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    sizes="(min-width: 64rem) 34rem, 100vw"
                  />
                </div>
                <figcaption className="dm-figure__caption">{photo.caption}</figcaption>
              </figure>
            ) : null}

            <div
              className={photo ? styles.jacketFrame : styles.coverStage}
              data-surface={!photo && dark ? 'paper' : undefined}
            >
              <Image
                className={styles.jacket}
                src={cover.src}
                alt={cover.alt}
                width={1200}
                height={1200}
                loading="lazy"
                sizes={
                  photo
                    ? '(min-width: 64rem) 14rem, (min-width: 48rem) 12rem, 70vw'
                    : '(min-width: 64rem) 22rem, (min-width: 48rem) 20rem, 80vw'
                }
              />
            </div>
          </div>

          <div className={styles.editionCopy}>
            <div className={styles.editionMeta}>
              <Eyebrow>{`0${position}`}</Eyebrow>
              <Eyebrow>{edition.formatLabel}</Eyebrow>
            </div>

            <div className={styles.editionHeading}>
              <Heading level={2} size="3xl" id={titleId}>
                {book.title}
              </Heading>
              {book.subtitle ? <p className={styles.subtitle}>{book.subtitle}</p> : null}
            </div>

            <div className={styles.publisherCopy}>
              <Eyebrow>From the publisher</Eyebrow>
              {edition.descriptionNote ? (
                <p className={styles.sourceNote}>{edition.descriptionNote}</p>
              ) : null}
              <Prose measure="full">
                {bookParagraphs(book.description).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Prose>
            </div>

            {edition.editorialNote ? (
              <aside className={styles.editorialNote} aria-label="Editorial note">
                <Eyebrow>Editorial note</Eyebrow>
                <p>{edition.editorialNote}</p>
              </aside>
            ) : null}

            <aside className={styles.availability} aria-label={`${book.title} availability`}>
              <Eyebrow>Current availability</Eyebrow>
              <p>
                {edition.availability}{' '}
                <Link href="/contact-us/">Contact the office.</Link>
              </p>
            </aside>
          </div>
        </article>
      </Container>
    </Section>
  );
}

export default function BooksPage() {
  return (
    <>
      <JsonLd id="books-schema" schema={[booksPageSchema, breadcrumbSchema]} />

      <Hero
        id="books"
        variant="band"
        eyebrow="Food. Business. Print and audio."
        title="Books by Damian Mason."
        deck="Food Fear takes on modern food fights. Do Business Better examines success on your own terms. Food Fear also has an audio edition."
        actions={[
          { label: 'Browse the editions', href: '#titles' },
          { label: 'More resources', href: '#resources', variant: 'secondary' },
        ] as const}
        image={HERO_IMAGE}
        cutline="Food Fear in hardback, with the physical inventory behind it."
      />

      <Section id="titles" surface="sunken" aria-labelledby="titles-title">
        <Container>
          <div className={styles.indexIntro}>
            <Eyebrow>The shelf</Eyebrow>
            <Heading level={2} id="titles-title">
              Two books. Three editions.
            </Heading>
            <Prose measure="wide">
              <p>
                Food Fear appears in print and audio. Do Business Better appears in print.
                Each edition is presented separately below with the publisher description
                currently available.
              </p>
            </Prose>
          </div>

          <ol className={styles.editionIndex} aria-label="Book editions">
            {EDITIONS.map(({ book, formatLabel }, index) => (
              <li key={book.slug}>
                <a className={`dm-link-bare ${styles.indexLink}`} href={`#${book.slug}`}>
                  <span className={styles.indexNumber}>{`0${index + 1}`}</span>
                  <span className={styles.indexTitle}>{book.title}</span>
                  <span className={styles.indexFormat}>{formatLabel}</span>
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {EDITIONS.map((edition, index) => (
        <EditionFeature key={edition.book.slug} edition={edition} position={index + 1} />
      ))}

      <Section surface="forest" aria-labelledby="signing-title">
        <Container>
          <div className={`dm-grid12 ${styles.signingGrid}`}>
            <figure className="dm-figure col-span-6 md:col-span-12 lg:col-span-7">
              <div className="dm-photo dm-photo--plate">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/book-signing-stonex.jpg"
                  alt="Damian Mason stands beside an attendee holding Food Fear at a StoneX Ag and Dairy Market Outlook book signing."
                  width={1512}
                  height={1209}
                  loading="lazy"
                  sizes="(min-width: 64rem) 46rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                Food Fear at the StoneX Ag &amp; Dairy Market Outlook signing table.
              </figcaption>
            </figure>

            <div className={`${styles.signingCopy} col-span-6 md:col-span-12 lg:col-span-5`}>
              <Eyebrow>From the event archive</Eyebrow>
              <Heading level={2} size="3xl" id="signing-title">
                A Food Fear signing at StoneX.
              </Heading>
              <Prose measure="narrow">
                <p>
                  The event archive places the book in the same room as Damian&rsquo;s
                  Agriculture audiences. The speaking work, the questions afterward, and
                  the signing table are part of one conversation.
                </p>
              </Prose>
              <Button href="/speaking/" variant="secondary">
                Explore the speaking work
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="resources" aria-labelledby="resources-title">
        <Container>
          <div className={styles.resourcesIntro}>
            <Eyebrow>Beyond the books</Eyebrow>
            <Heading level={2} id="resources-title">
              More from Damian.
            </Heading>
            <Prose measure="wide">
              <p>
                Continue with the podcasts, articles, media appearances, event material,
                or Damian&rsquo;s mailing list. Every destination below is first-party site
                material or a verified path to Damian&rsquo;s current work.
              </p>
            </Prose>
          </div>

          <ul className={styles.resourceList} role="list">
            {RESOURCES.map((resource, index) => (
              <li key={resource.href}>
                <Link className={`dm-link-bare ${styles.resourceLink}`} href={resource.href}>
                  <span className={styles.resourceNumber}>{`0${index + 1}`}</span>
                  <span className={styles.resourceBody}>
                    <Eyebrow>{resource.label}</Eyebrow>
                    <Heading level={3} size="lg">
                      {resource.title}
                    </Heading>
                    <span className={styles.resourceDescription}>{resource.description}</span>
                  </span>
                  <span className={styles.resourceArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CTABand
        id="book-availability"
        eyebrow="Availability"
        heading="Looking for a current edition?"
        copy="No retailer or audiobook destination is linked until it can be verified. Damian’s office can answer current availability questions."
        actions={[
          { label: 'Contact Damian’s office', href: '/contact-us/' },
          { label: 'About the author', href: '/about/', variant: 'secondary' },
        ] as const}
      />
    </>
  );
}

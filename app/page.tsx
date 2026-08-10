import Image from 'next/image';
import Link from 'next/link';

import { CTABand } from '@/components/sections/CTABand';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { StatRow } from '@/components/sections/StatRow';
import { VideoGrid } from '@/components/sections/VideoGrid';
import { JsonLd } from '@/components/seo';
import { Button, Card, Container, Eyebrow, Heading, Prose, Quote, Section } from '@/components/ui';
import { brandAssets } from '@/content/brand-assets';
import { imageAlt } from '@/content/image-alt';
import { podcasts } from '@/content/site';
import { testimonials } from '@/content/testimonials';
import { videos } from '@/content/videos';
import { getLatestEpisode } from '@/lib/podcast-feed';
import {
  buildBreadcrumbListSchema,
  buildBusinessOfAgricultureEpisodeSchema,
  buildBusinessOfAgricultureSchema,
} from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

export const metadata = buildMetadata({
  title: 'Damian Mason and The Business of Agriculture',
  description:
    'Listen to the latest Business of Agriculture episode, get Damian Mason’s agriculture newsletter, or bring his audience and perspective to your organization.',
  path: '/',
  titleIsAbsolute: true,
  rss: podcasts.businessOfAgriculture.rss,
});

const PATHWAYS = [
  {
    eyebrow: 'I’m here to listen',
    title: 'Start with the latest conversation.',
    body: 'New Business of Agriculture episodes arrive every Monday. Browse the archive or keep the useful parts coming by email.',
    actions: [
      { label: 'Browse the podcast', href: '/the-business-of-agriculture/' },
      { label: 'Join the newsletter', href: '/join-the-conversation/' },
    ],
  },
  {
    eyebrow: 'I want to reach this audience',
    title: 'Put your brand where agriculture pays attention.',
    body: 'See the historical sponsor roster, the available formats, and the one inquiry form that routes straight to the office.',
    actions: [
      { label: 'Sponsor the show', href: '/collaboration-opportunities/' },
      {
        label: 'Ask another question',
        href: '/contact-us/?intent=other#inquiry',
      },
    ],
  },
] as const;

const BEYOND_THE_MIC = [
  {
    title: 'Speaking',
    body: 'Agricultural economics, business ownership, and Second City training for a room that expects substance without the sleeping pill.',
    href: '/speaking/',
    label: 'See Damian on stage',
  },
  {
    title: 'Media',
    body: 'Fast, plain-English commentary when a food, farm, labor, or commodity story needs real agricultural context.',
    href: '/blog-news/',
    label: 'Watch media appearances',
  },
  {
    title: 'Ag Success Group',
    body: 'A peer group for agricultural professionals who want sharper decisions, better conversations, and stronger businesses.',
    href: '/boasg/',
    label: 'Explore the group',
  },
] as const;

const proofQuotes = testimonials.filter((item) =>
  ['mike-elliott', 'melissa-bockman'].includes(item.id),
);
const keynoteSample = videos.find((video) => video.id === 'demo-innovation');

function formatEpisodeDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

export default async function HomePage() {
  const latestEpisode = await getLatestEpisode();

  return (
    <>
      <JsonLd
        schema={[
          buildBusinessOfAgricultureSchema(),
          buildBusinessOfAgricultureEpisodeSchema({
            title: latestEpisode.title,
            description: latestEpisode.summary,
            url: latestEpisode.episodeUrl,
            publishedAt: latestEpisode.publishedAt,
            episodeNumber: latestEpisode.episodeNumber,
            duration: latestEpisode.duration,
          }),
          buildBreadcrumbListSchema([{ name: 'Home', path: '/' }]),
        ]}
      />

      <Section className={styles.episodeHero} aria-labelledby="home-title">
        <Container>
          <div className={`dm-grid12 ${styles.heroGrid}`}>
            <figure className={`${styles.cover} col-span-6 md:col-span-5`}>
              <Image
                src={brandAssets.businessOfAgriculturePodcast}
                alt={imageAlt['/img/brand/business-of-agriculture-podcast.jpg']}
                width={800}
                height={800}
                priority
                sizes="(min-width: 64rem) 31rem, (min-width: 48rem) 42vw, 86vw"
              />
              <figcaption className="dm-figure__caption">New every Monday.</figcaption>
            </figure>

            <div className={`${styles.heroCopy} col-span-6 md:col-span-7`}>
              <Eyebrow>Latest • The Business of Agriculture</Eyebrow>
              <Heading level={1} display size="5xl" id="home-title">
                {latestEpisode.title}
              </Heading>
              <p className={styles.episodeMeta}>
                {latestEpisode.episodeNumber ? <span>Episode {latestEpisode.episodeNumber}</span> : null}
                <time dateTime={latestEpisode.publishedAt}>
                  {formatEpisodeDate(latestEpisode.publishedAt)}
                </time>
                {latestEpisode.duration ? <span>{latestEpisode.duration}</span> : null}
              </p>
              <Prose lead measure="wide">
                <p>{latestEpisode.summary}</p>
              </Prose>
              <div className={styles.actions}>
                <Button href={latestEpisode.episodeUrl} variant="primary" size="lg">
                  Listen to this episode
                </Button>
                <Button href="/the-business-of-agriculture/" variant="secondary" size="lg">
                  Browse the podcast
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="sunken" aria-labelledby="paths-title">
        <Container>
          <div className={styles.sectionHead}>
            <Eyebrow>Choose your way in</Eyebrow>
            <Heading level={2} size="2xl" id="paths-title">
              Listen to the work. Or put it to work.
            </Heading>
          </div>
          <ul className={`dm-grid12 ${styles.pathGrid}`} role="list">
            {PATHWAYS.map((pathway) => (
              <Card
                as="li"
                variant="bright"
                key={pathway.eyebrow}
                className={`${styles.pathCard} col-span-6 md:col-span-6`}
              >
                <Eyebrow>{pathway.eyebrow}</Eyebrow>
                <Heading level={3} size="xl">
                  {pathway.title}
                </Heading>
                <Prose measure="full">
                  <p>{pathway.body}</p>
                </Prose>
                <div className={styles.cardActions}>
                  {pathway.actions.map((action, index) => (
                    <Button key={action.href} href={action.href} variant={index === 0 ? 'secondary' : 'ghost'}>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      <StatRow
        id="credibility"
        surface="deep-alt"
        eyebrow="The record"
        title="Built in rooms, fields, and weekly conversations"
        restatement="The speaking record explains the trust. The monthly audience proves that trust continues after the room clears."
      />

      <Section aria-labelledby="beyond-title">
        <Container>
          <div className={`dm-grid12 ${styles.beyondIntro}`}>
            <div className={`${styles.sectionHead} col-span-6 md:col-span-7`}>
              <Eyebrow>Damian beyond the mic</Eyebrow>
              <Heading level={2} size="2xl" id="beyond-title">
                An economist who can hold the room.
              </Heading>
              <Prose lead>
                <p>
                  Damian combines a Purdue Ag Economics degree, three decades of business
                  ownership, comedy training at Second City, and an Indiana farm of his own.
                </p>
              </Prose>
            </div>
            <figure className={`${styles.portrait} col-span-6 md:col-span-5`}>
              <Image
                src="/img/photos/portrait-dark-blazer.jpg"
                alt={imageAlt['/img/photos/portrait-dark-blazer.jpg']}
                width={1333}
                height={2000}
                loading="lazy"
                sizes="(min-width: 48rem) 30rem, 86vw"
              />
              <figcaption className="dm-figure__caption">
                Damian Mason. Agricultural economist, speaker, podcaster, author, and working
                Indiana farmer.
              </figcaption>
            </figure>
          </div>

          <ul className={`dm-grid12 ${styles.beyondGrid}`} role="list">
            {BEYOND_THE_MIC.map((item) => (
              <Card
                as="li"
                variant="ruled"
                key={item.href}
                className={`${styles.beyondCard} col-span-6 md:col-span-4`}
              >
                <Heading level={3} size="xl">
                  {item.title}
                </Heading>
                <Prose measure="full">
                  <p>{item.body}</p>
                </Prose>
                <Link className="dm-action-link" href={item.href}>
                  {item.label}
                </Link>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="sunken" aria-labelledby="proof-title">
        <Container>
          <div className={styles.sectionHead}>
            <Eyebrow>See the work</Eyebrow>
            <Heading level={2} size="2xl" id="proof-title">
              One keynote sample. Two people who booked him.
            </Heading>
          </div>
          <div className={`dm-grid12 ${styles.proofGrid}`}>
            <div className="col-span-6 md:col-span-7">
              {keynoteSample ? (
                <VideoGrid
                  videos={[keynoteSample]}
                  columns={1}
                  headingLevel={3}
                  label="Keynote sample"
                />
              ) : null}
              <div className={styles.proofAction}>
                <Button href="/keynote/" variant="secondary">
                  See the keynote programs
                </Button>
              </div>
            </div>
            <ul className={`${styles.quoteList} col-span-6 md:col-span-5`} role="list">
              {proofQuotes.map((testimonial) => (
                <li key={testimonial.id}>
                  <Quote
                    attribution={[testimonial.name, testimonial.organization]
                      .filter(Boolean)
                      .join(', ')}
                    barred
                  >
                    {testimonial.quote}
                  </Quote>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section id="newsletter" aria-labelledby="newsletter-title">
        <Container>
          <div className={`dm-grid12 ${styles.newsletterGrid}`}>
            <div className={`${styles.sectionHead} col-span-6 md:col-span-4`}>
              <Eyebrow>Keep the useful part</Eyebrow>
              <Heading level={2} size="2xl" id="newsletter-title">
                One place for the next episode and Damian’s latest read.
              </Heading>
            </div>
            <Card variant="bright" className="col-span-6 md:col-span-8">
              <NewsletterForm
                idPrefix="home-newsletter"
                title={null}
                blurb="Ag news you can use, new podcast episodes, and where Damian is speaking next."
              />
            </Card>
          </div>
        </Container>
      </Section>

      <CTABand
        id="sponsor"
        eyebrow="Reach the audience"
        heading="Sponsor The Business of Agriculture."
        copy="See who has sponsored the show, choose a partnership format, and tell the office what your brand needs to communicate."
        actions={[
          { label: 'Sponsor the show', href: '/collaboration-opportunities/' },
          { label: 'See all ways to work together', href: '/contact-us/', variant: 'secondary' },
        ]}
        panel={{
          eyebrow: 'Monthly audience',
          value: '40,000',
          plus: true,
          label: 'Listeners',
          note: 'The Business of Agriculture',
        }}
      />
    </>
  );
}

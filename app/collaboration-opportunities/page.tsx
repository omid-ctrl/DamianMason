import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { ContactForm } from '@/components/sections/ContactForm';
import { SponsorWall } from '@/components/sections/SponsorWall';
import { StatRow } from '@/components/sections/StatRow';
import { JsonLd } from '@/components/seo';
import { Button, Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { brandAssets } from '@/content/brand-assets';
import { imageAlt } from '@/content/image-alt';
import { sponsors } from '@/content/sponsors';
import { getLatestEpisode } from '@/lib/podcast-feed';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

const ROUTE = '/collaboration-opportunities/';

export const metadata: Metadata = buildMetadata({
  title: 'Sponsor The Business of Agriculture',
  description:
    'Put your brand in front of more than 40,000 monthly listeners across agriculture. See past sponsors, partnership formats, and start an inquiry.',
  path: ROUTE,
  image: {
    url: brandAssets.businessOfAgriculturePodcast,
    width: 800,
    height: 800,
    alt: imageAlt['/img/brand/business-of-agriculture-podcast.jpg'],
  },
});

const PARTNERSHIPS = [
  {
    title: 'Episode sponsorship',
    body: 'Put a clear, host-read message inside the flagship show your customers already choose to hear.',
  },
  {
    title: 'Webinar or co-hosted content',
    body: 'Build a useful conversation around a subject your company knows and the agriculture audience cares about.',
  },
  {
    title: 'Brand partnership',
    body: 'Shape a longer collaboration when one episode is not enough to tell the story honestly.',
  },
] as const;

const OTHER_SERVICES = [
  {
    title: 'Pitch a podcast guest',
    body: 'Bring a point of view, real experience, and a subject that earns the listener’s time.',
    intent: 'podcast_guest',
  },
  {
    title: 'Book media commentary',
    body: 'Agricultural economics and plain-English context for live, recorded, or written coverage.',
    intent: 'media_commentary',
  },
  {
    title: 'Propose a brand partnership',
    body: 'Influencer, promotion, or original content with a clear audience and objective.',
    intent: 'brand_partnership',
  },
  {
    title: 'Book a speaking event',
    body: 'Keynotes, breakouts, panels, webinars, and live conversations for agriculture and business.',
    intent: 'speaking_event',
  },
  {
    title: 'Coaching or consulting',
    body: 'One-on-one or small-group work around the business problem in front of you.',
    intent: 'coaching_consulting',
  },
  {
    title: 'Join the Ag Success Group',
    body: 'Ask about membership, peer sessions, or whether the group fits your business.',
    intent: 'boasg_membership',
  },
  {
    title: 'Something else',
    body: 'If it does not fit a label, explain the idea and what a good outcome looks like.',
    intent: 'other',
  },
] as const;

export default async function CollaborationOpportunitiesPage() {
  const latestEpisode = await getLatestEpisode();

  return (
    <>
      <JsonLd
        schema={buildBreadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Sponsor the Show', path: ROUTE },
        ])}
      />

      <Section className={styles.hero} aria-labelledby="sponsor-title">
        <Container>
          <div className={`dm-grid12 ${styles.heroGrid}`}>
            <div className={`${styles.heroCopy} col-span-6 md:col-span-7`}>
              <Eyebrow>The Business of Agriculture</Eyebrow>
              <Heading level={1} display size="5xl" id="sponsor-title">
                Sponsor the show agriculture listens to.
              </Heading>
              <Prose lead measure="wide">
                <p>
                  More than 40,000 people listen each month for straight talk about the
                  business of food, fuel, and fiber. If they are your customers, put a useful
                  message where they are already paying attention.
                </p>
              </Prose>
              <div className={styles.actions}>
                <Button href="#inquiry" variant="primary" size="lg">
                  Start a sponsor inquiry
                </Button>
                <Button href={latestEpisode.episodeUrl} variant="secondary" size="lg">
                  Listen to the latest episode
                </Button>
              </div>
            </div>

            <figure className={`${styles.showArt} col-span-6 md:col-span-5`}>
              <Image
                src={brandAssets.businessOfAgriculturePodcast}
                alt={imageAlt['/img/brand/business-of-agriculture-podcast.jpg']}
                width={800}
                height={800}
                priority
                sizes="(min-width: 48rem) 34rem, 82vw"
              />
              <figcaption className="dm-figure__caption">
                A new conversation lands every Monday. The latest episode is live now.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      <StatRow
        id="sponsor-proof"
        surface="deep-alt"
        eyebrow="Proof before pitch"
        title="An established show, not an untested placement"
        items={[
          { value: '40,000', plus: true, label: 'Monthly listeners' },
          { value: String(sponsors.length), label: 'Brands in the sponsor record' },
          { value: String(PARTNERSHIPS.length), label: 'Partnership formats' },
        ]}
        restatement="The listener figure is the published monthly audience. The brands below are a historical sponsor roster, not a claim that every one is currently active."
      />

      <SponsorWall
        id="sponsor-record"
        surface="sunken"
        eyebrow="The sponsor record"
        title="Brands that have sponsored the show"
        meta="Historical roster supplied by Damian Mason’s office"
        intro="Agriculture technology, crop protection, biologicals, farm transition planning, and investment brands have all used the show to reach this audience."
      />

      <Section aria-labelledby="formats-title">
        <Container>
          <div className={styles.sectionHead}>
            <Eyebrow>Ways to partner</Eyebrow>
            <Heading level={2} size="2xl" id="formats-title">
              Start with the format that fits the story.
            </Heading>
          </div>
          <ul className={`dm-grid12 ${styles.cardGrid}`} role="list">
            {PARTNERSHIPS.map((partnership) => (
              <Card
                as="li"
                variant="ruled"
                key={partnership.title}
                className={`${styles.card} col-span-6 md:col-span-4`}
              >
                <Heading level={3} size="xl">
                  {partnership.title}
                </Heading>
                <Prose measure="full">
                  <p>{partnership.body}</p>
                </Prose>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="sunken" aria-labelledby="services-title">
        <Container>
          <div className={styles.sectionHead}>
            <Eyebrow>Beyond sponsorship</Eyebrow>
            <Heading level={2} size="2xl" id="services-title">
              Other ways to work with Damian.
            </Heading>
            <Prose>
              <p>
                Sponsorship belongs to The Business of Agriculture. The office also handles
                guest pitches, media, brand work, speaking, coaching, and the Ag Success Group.
              </p>
            </Prose>
          </div>
          <ul className={`dm-grid12 ${styles.serviceGrid}`} role="list">
            {OTHER_SERVICES.map((service) => (
              <li key={service.intent} className="col-span-6 md:col-span-6 lg:col-span-4">
                <Link
                  className={`dm-link-bare ${styles.serviceLink}`}
                  href={`/contact-us/?intent=${service.intent}#inquiry`}
                >
                  <span className={styles.serviceTitle}>{service.title}</span>
                  <span>{service.body}</span>
                  <span className={styles.serviceAction}>Start this inquiry →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="inquiry" surface="deep" aria-labelledby="inquiry-title">
        <Container>
          <div className={`dm-grid12 ${styles.inquiryGrid}`}>
            <div className={`${styles.inquiryIntro} col-span-6 md:col-span-4`}>
              <Eyebrow>Start here</Eyebrow>
              <Heading level={2} size="2xl" id="inquiry-title">
                Tell us what the audience should hear.
              </Heading>
              <Prose>
                <p>
                  Share the brand, objective, audience, and timing. The form is preselected for
                  sponsorship, but you can change it if another route fits better.
                </p>
              </Prose>
            </div>
            <Card variant="bright" className="col-span-6 md:col-span-8">
              <ContactForm
                idPrefix="sponsor-inquiry"
                labelledBy="inquiry-title"
                initialInquiryType="podcast_sponsorship"
              />
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

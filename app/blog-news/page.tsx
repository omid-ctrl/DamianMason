/**
 * /blog-news/  ·  "Media" in the navigation.
 *
 * Source of truth: `_source/pages/blog-news.md`, eleven Divi sections, nine of
 * which are real media items. The other two are an empty video module and an
 * empty trailing section, both dropped.
 *
 * Three deliberate departures from the old page, each one a rule in
 * docs/DESIGN_SYSTEM.md:
 *
 *   1. The six inline images are gone. All six are raw macOS screenshots with
 *      empty alt text, three of them served from the staging host, two with a
 *      raw U+202F inside the filename. Section 6.4 rule 2 says a slot whose
 *      only asset is a screenshot becomes a typographic treatment instead: a
 *      ruled card with a real headline and a real link. That is exactly what
 *      PressList renders, so the nine items keep their content and lose the
 *      blurry rectangles.
 *   2. The Forbes item was an H1 on the old page, which gave it two. Here every
 *      item is an H3 under a real H2, and the page has one H1.
 *   3. The old download link to a raw .zip on the staging domain is gone. The
 *      client asked for it removed in both places it appeared. No replacement
 *      asset exists and none is invented here.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { Container, Eyebrow, Heading, Prose, Rule, Section } from '@/components/ui';
import { Hero } from '@/components/sections/Hero';
import { PressList } from '@/components/sections/PressList';
import { StatRow, type StatRowItem } from '@/components/sections/StatRow';
import { VideoGrid } from '@/components/sections/VideoGrid';
import { CTABand } from '@/components/sections/CTABand';
import { JsonLd } from '@/components/seo';
import { buildMetadata } from '@/lib/seo';
import { buildBreadcrumbListSchema, buildVideoObjectSchema } from '@/lib/schema';
import { press } from '@/content/press';
import { videos } from '@/content/videos';
import { contact } from '@/content/site';

import styles from './page.module.css';

const ROUTE = '/blog-news/';

export const metadata: Metadata = buildMetadata({
  title: 'Ag News and Media Appearances',
  description:
    'Nine press appearances, from Forbes to Newsmax to Cheddar News, plus three broadcast segments you can watch here. When Ag makes news, they call Damian.',
  path: ROUTE,
});

/**
 * The old page carried no description on any embed, so these are written here
 * rather than added to `content/videos.ts`, which another agent owns. They
 * exist for the VideoObject nodes, not for the render.
 */
const VIDEO_DESCRIPTIONS: Record<string, string> = {
  'cheddar-climate-food-shortage':
    'Damian Mason on Cheddar News, on how climate disruption is driving food shortages worldwide.',
  'eagle-country-95-9-interview':
    'Damian Mason joins Eagle Country 95.9 to talk about his event with Bison Ag Supply And Service.',
  'newsmax-wheat-and-inflation':
    'Damian Mason on Newsmax TV, on wheat supply and the inflation of food prices.',
};

const pageVideos = videos.filter((video) => video.onPages.includes(ROUTE));

const schema = [
  buildBreadcrumbListSchema([
    { name: 'Home', path: '/' },
    { name: 'Media', path: ROUTE },
  ]),
  ...pageVideos.map((video) =>
    buildVideoObjectSchema({
      name: video.title,
      description: VIDEO_DESCRIPTIONS[video.id] ?? video.title,
      youtubeId: video.kind === 'youtube' ? video.youtubeId : undefined,
      path: ROUTE,
    }),
  ),
];

const CTA_ACTIONS = [
  { label: 'Contact the office', href: '/contact-us/' },
  {
    label: `Call ${contact.phone}`,
    href: contact.phoneHref,
    variant: 'secondary',
  },
] as const;

/**
 * Derived, not typed. Nine press items, the distinct outlets among them, and
 * the three that carry video, so the ledger cannot disagree with the two lists
 * further down the page.
 */
const MEDIA_STATS: StatRowItem[] = [
  { value: String(press.length), label: 'Appearances' },
  { value: String(new Set(press.map((item) => item.outlet)).size), label: 'Outlets' },
  { value: String(pageVideos.length), label: 'On camera' },
];

export default function MediaPage() {
  return (
    <>
      <JsonLd schema={schema} id="media-schema" />

      <Hero
        id="media"
        className={styles.heroRunningHead}
        eyebrow="Forbes · Newsmax · Cheddar News · Straight Arrow News · Eagle Country 95.9"
        title="News & Media"
        deck="Reporters call when a story needs both halves: the commodity market and the grocery bill. Damian gives them the figure, then what it’s doing to a farm in Indiana. Nine appearances, five outlets, three of them on video below."
        /* This route ran a type-only hero AND no call to action above the
           closing band, on the page a producer or a booker lands on when they
           are deciding whether to put him on air. Both are fixed here: the
           green-screen frame is the only photograph in the archive of the
           actual apparatus a remote television hit is done on, which is the
           thing this page is selling. */
        image={{
          src: '/img/photos/green-screen-setup.jpg',
          /* Single call site, so the string lives here rather than in
             content/image-alt.ts, per the rule at the head of that module. */
          alt: 'Damian Mason waving on a green-screen stage, between a studio light and a camera on a tripod.',
          width: 2000,
          height: 1334,
          feature: true,
        }}
        actions={[
          { label: 'Book Damian for a segment', href: '/contact-us/' },
          { label: 'Watch the clips', href: '#segments', variant: 'secondary' },
        ] as const}
        cutline="When the price of eggs makes the national news, somebody has to explain why. Damian gets the call."
      />

      {/* The deck above states three figures in prose and the page then never
          shows them. A ledger is the block this site uses for exactly that, and
          it puts a dark band on a route that had none: /blog-news/ ran 5,193px
          of one grey before its closing CTA. Every number here is arithmetic on
          content/press.ts and content/videos.ts, not a new claim. */}
      <StatRow
        id="record"
        surface="deep-alt"
        eyebrow="On the record"
        title="Who calls, and how often"
        items={MEDIA_STATS}
        restatement="Three networks, three subjects, one phone call each. The ones with video are below; the rest are linked where they ran."
      />

      <Section id="coverage" aria-labelledby="coverage-title" surface="sunken">
        <Container>
          <div className="dm-grid12">
            <div className={`dm-rail ${styles.head} col-span-6 md:col-span-4`}>
              <Eyebrow>Print, web, and broadcast</Eyebrow>
              <Heading level={2} size="2xl" id="coverage-title">
                Nine appearances, five outlets
              </Heading>
              <Prose measure="narrow">
                <p>
                  Straight Arrow News called four times about food prices. Forbes quoted
                  him on the AGCO and Trimble joint venture. Cheddar News and Newsmax
                  wanted the story behind fertilizer and wheat. If you&rsquo;re a booker
                  or a producer looking for a guest who will say something, start here.
                </p>
                <p>
                  Two of these also ran as posts on the{' '}
                  <Link href="/blog/">blog</Link>.
                </p>
              </Prose>
            </div>

            <div className="col-span-6 md:col-span-8">
              <PressList
                items={press}
                headingLevel={3}
                label="Press and media coverage"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section id="segments" aria-labelledby="segments-title">
        <Container>
          <div className={styles.head}>
            <Eyebrow>Television and radio</Eyebrow>
            <Heading level={2} size="2xl" id="segments-title">
              Watch three of them
            </Heading>
            <Prose>
              <p>
                Cheddar News on climate and food shortages. Newsmax on wheat and food
                price inflation. Eagle Country 95.9 on an event that&rsquo;s now several
                years past, which is what happens to an interview about an upcoming
                date.
              </p>
              <p>
                Longer sit-downs run on <Link href="/acres-tv/">Acres TV</Link>, where an
                episode goes 41 to 54 minutes.
              </p>
            </Prose>
          </div>

          <Rule weight="thick" tone="strong" className={styles.headRule} />

          <div className={styles.body}>
            <VideoGrid
              videos={videos}
              page={ROUTE}
              columns={3}
              headingLevel={3}
              label="Broadcast and radio segments"
            />
          </div>
        </Container>
      </Section>

      <CTABand
        id="press-enquiries"
        eyebrow="Press and media enquiries"
        heading="Working on a food or farm story?"
        copy="Damian is a Purdue Ag Econ graduate who owns an Indiana farm and has been on stage since 1994. If your segment needs one person who can explain a commodity market and a grocery bill in the same take, email the office. We typically respond within one business day."
        actions={CTA_ACTIONS}
        panel={{
          eyebrow: 'The Business of Agriculture',
          value: '40,000',
          plus: true,
          label: 'listeners per month',
          note: 'His own audience, before your segment reaches yours.',
        }}
      />
    </>
  );
}

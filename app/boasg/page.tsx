import Image from 'next/image';
import type { Metadata } from 'next';

import { CTABand } from '@/components/sections/CTABand';
import { JsonLd } from '@/components/seo';
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
} from '@/components/ui';
import { brandAssets } from '@/content/brand-assets';
import { contact } from '@/content/site';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

import styles from './page.module.css';

/* ============================================================================
   THE JOIN CTA

   The client instruction for this page, verbatim: "On the BOASG page: The Sign
   up Link.... We need to change the link to my email address (with some
   appropriate wording)."

   The old page sent both of its "Join Today" buttons to the retired WooCommerce
   membership route, which now 301s here. A membership that used to be bought
   through a checkout is started by writing to Damian instead, so the join
   action is a mailto with the subject and the body already written. The visitor
   only fills in the facts about themselves.

   The monthly figure is deliberately absent. The old page set it as a second
   h1 directly above the checkout button. With no checkout behind it, a number
   on the page is a number nobody can act on, so the email asks for the current
   terms instead. The membership is still described as monthly, which is what
   the source copy supports.
   ============================================================================ */

const JOIN_SUBJECT = 'BoASG: I want in';

const JOIN_BODY = [
  'Damian,',
  '',
  'I read the BoASG page and I want to join. Here is where I sit in the business:',
  '',
  'Name:',
  'Operation or company:',
  'What I grow, sell, or finance:',
  'State:',
  'Phone:',
  '',
  'Send me the monthly terms, the next program date, and how to get on the calls.',
  '',
  'Thanks,',
].join('\n');

const JOIN_HREF = `mailto:${contact.email}?subject=${encodeURIComponent(
  JOIN_SUBJECT,
)}&body=${encodeURIComponent(JOIN_BODY)}`;

const MAILTO_PLAIN = `mailto:${contact.email}`;

/* ============================================================================
   COPY
   Source: _source/pages/boasg.md, plus the Description tab of the retired
   WooCommerce product page, which held the only accurate membership copy the
   old site had. Kept in constants so the typographic apostrophes survive JSX.
   ============================================================================ */

const HERO_INTRO =
  'The Business of Ag Success Group is an information-packed community of ag professionals that span the industry, from pig farmers to beet growers, to ag finance and planning. Together, we gather bi-monthly in an incredible information exchange, led by world recognized Agriculturist, Damian Mason and International Swine Management Consultant Todd Thurman. If you’re looking for a community to join where you get take-aways at every turn, this is it.';

const POSITIONING =
  'The Business of Ag Success Group (BoASG) is a business outlook, advisory, and networking community for Ag professionals.';

const WHAT_YOU_GET = [
  'Bi-monthly online programs addressing Business and Agricultural topics',
  'Guest presenters delivering pertinent information and implementable ideas',
  'Special promotions',
  'Networking opportunities within the group',
];

const WHAT_YOU_WONT_GET = [
  'High-pressure sales tactics or constant pitches',
  'Multiple emails each day clogging up your inbox',
  'Unusable fluff',
];

const SCHEDULE_NOTE =
  'Online, every other Friday at 11am Eastern. Time and dates are subject to change. Programs will be approximately 60 to 90 minutes including an interactive Q&A session. Recordings are always available to members.';

const DAMIAN_EXPERTISE = [
  'Ag Current Events',
  'Ag Economics',
  'The Future of American and International Ag',
  'Business',
  'Consumer Behavior',
  'Global Trends',
  'Finance and Money',
  'Sales and Training',
];

const DAMIAN_BIO =
  'Damian Mason is a leading voice in the Agricultural industry, sought out by media, podcasts, and publications for his tell-it-like-it-is style of delivery. He gives you the truth about Ag without sugar coating the message, helping to prepare his listeners (and BoASG members) to navigate their way through the rapidly changing, volatile industry. He has spoken and consulted with the biggest names in Agriculture, in all 50 states, 8 foreign countries, and in every segment of Ag.';

const TODD_EXPERTISE = [
  'Animal Performance',
  'Animal Productivity',
  'Business Planning',
  'Predictive analytics and outlook',
  'System Design',
  'Global Protein Markets',
  'International Business',
  'Training and Talent Development',
];

const TODD_BIO =
  'Todd Thurman is an International Swine Management Consultant and Founder of SwineTex Consulting Services. He draws on his 20+ years of Industry experience to help large scale pork production companies and allied industries improve the efficiency and profitability of their operations.';

const MAILING_LIST_COPY =
  'Damian’s mailing list is the shorter commitment. You get what he’s seeing in the business of food, fuel, and fiber, and you can join the group later.';

const JOIN_QUESTION =
  'Are you an Ag professional who could benefit from outside perspectives, ideas, insights, and vision? Joining starts with an email. Tell Damian what you grow, sell, or finance, and he’ll send you the details and the next program date.';

const JOIN_FALLBACK_LEAD = 'The button opens your email app with the message started. If it doesn’t, write to ';

/* ========================================================================== */

export const metadata: Metadata = buildMetadata({
  title: 'The Business of Ag Success Group',
  description:
    'A bi-monthly business outlook, advisory, and networking community for Ag professionals, led by Damian Mason and swine consultant Todd Thurman. Email Damian to join.',
  path: '/boasg/',
  image: {
    url: brandAssets.boasg,
    width: 800,
    height: 563,
    alt: 'The Business of Ag Success Group badge, with Damian Mason and Todd Thurman',
  },
});

const breadcrumbs = buildBreadcrumbListSchema([
  { name: 'Home', path: '/' },
  { name: 'The Business of Ag Success Group', path: '/boasg/' },
]);

export default function BoasgPage() {
  return (
    <>
      <JsonLd schema={breadcrumbs} id="boasg-breadcrumbs" />

      {/* --- Hero ------------------------------------------------------------
          Source section 1. The old page set the monthly figure as a second h1
          under the real one and hung the checkout button off it. One h1 here,
          and the action beside it is the email. */}
      <Section
        id="boasg-hero"
        aria-labelledby="boasg-hero-title"
        className="dm-hero dm-hero--portrait"
      >
        <Container>
          <div className="dm-grid12 dm-hero__grid">
            <div className="dm-hero__type col-span-6 md:col-span-12 lg:col-span-7">
              <Eyebrow>Exclusive monthly membership</Eyebrow>
              <Heading level={1} display size="5xl" id="boasg-hero-title">
                The Business of Ag Success Group
              </Heading>
              <Prose lead>
                <p>{HERO_INTRO}</p>
              </Prose>
              <div className="dm-hero__actions">
                <Button href={JOIN_HREF} variant="primary" size="lg">
                  Email Damian to Join
                </Button>
              </div>
            </div>

            <div className="col-span-6 md:col-span-12 lg:col-span-5">
              <Card variant="bright" className={styles.badge}>
                <Image
                  className={styles.badgeImg}
                  src={brandAssets.boasgWhite}
                  alt="The Business of Ag Success Group badge, established 2020"
                  width={800}
                  height={800}
                  priority
                  sizes="(min-width: 64rem) 32rem, 100vw"
                />
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- What the membership is -----------------------------------------
          Source section 2, first half. The live page split "What you get" over
          two separate <ul> elements, which put a gap after the first bullet.
          One list each. */}
      <Section id="membership" surface="sunken" aria-labelledby="membership-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-8`}>
              <Eyebrow>The membership</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 01" id="membership-title">
                What you get, and what you won&rsquo;t
              </Heading>
              <Prose measure="wide">
                <p>{POSITIONING}</p>
              </Prose>
            </div>
          </div>

          <div className={`${styles.pairs} ${styles.rows}`}>
            <Card variant="ruled" className={styles.stackTight}>
              <Heading level={3} size="lg">
                What you get:
              </Heading>
              <Prose measure="narrow">
                <ul>
                  {WHAT_YOU_GET.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Prose>
            </Card>

            <Card variant="ruled" className={styles.stackTight}>
              <Heading level={3} size="lg">
                What you won&rsquo;t get:
              </Heading>
              <Prose measure="narrow">
                <ul>
                  {WHAT_YOU_WONT_GET.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Prose>
            </Card>
          </div>

          {/* Source section 4's footnote. The live page opened it with a bare
              asterisk that referenced nothing on the page. */}
          <p className={styles.note}>{SCHEDULE_NOTE}</p>
        </Container>
      </Section>

      {/* --- Who leads it ----------------------------------------------------
          Source sections 2 (second half) and 3. Both expertise lists were
          runs of bullet glyphs separated by <br /> inside one paragraph. They
          are real lists here, and both labels are marked up the same way. */}
      <Section id="who-leads-it" aria-labelledby="who-leads-it-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-8`}>
              <Eyebrow>Who runs the calls</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 02" id="who-leads-it-title">
                Led by Damian Mason and Todd Thurman
              </Heading>
            </div>
          </div>

          <div className={`${styles.leader} ${styles.rows} dm-grid12`}>
            <div className="col-span-6 md:col-span-8">
              <Heading level={3} size="xl">
                Damian Mason
              </Heading>
              <Eyebrow className={styles.expertise}>Damian Mason expertise</Eyebrow>
              <Prose measure="wide" className={styles.leaderProse}>
                <ul>
                  {DAMIAN_EXPERTISE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{DAMIAN_BIO}</p>
              </Prose>
            </div>

            <figure className="dm-figure col-span-6 md:col-span-4">
              <div className="dm-photo dm-photo--portrait">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/portrait-black-suit.jpg"
                  alt="Damian Mason, arms folded, in a dark blazer beside a window."
                  width={1333}
                  height={2000}
                  loading="lazy"
                  sizes="(min-width: 48rem) 28rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 01 </span>
                Damian Mason. Purdue Ag Econ degree, Second City Chicago. Both of them
                turn up on the same call.
              </figcaption>
            </figure>
          </div>

          <div className={`${styles.leader} dm-grid12`}>
            <div className="col-span-6 md:col-span-8">
              <Heading level={3} size="xl">
                Todd Thurman
              </Heading>
              <Eyebrow className={styles.expertise}>Todd Thurman expertise</Eyebrow>
              <Prose measure="wide" className={styles.leaderProse}>
                <ul>
                  {TODD_EXPERTISE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{TODD_BIO}</p>
              </Prose>
            </div>

            <figure className="dm-figure col-span-6 md:col-span-4">
              <div className="dm-photo dm-photo--portrait">
                <Image
                  className="dm-photo__img"
                  src="/img/photos/todd-thurman.png"
                  alt="Todd Thurman, headshot in a checked shirt against a studio backdrop."
                  width={500}
                  height={750}
                  loading="lazy"
                  sizes="(min-width: 48rem) 28rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                <span className="dm-figure__folio">Fig. 02 </span>
                Todd Thurman, founder of SwineTex Consulting Services. Twenty years in
                swine production, most of it spent inside other people&rsquo;s operations.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* --- Join the Conversation -------------------------------------------
          Source section 5. This is the one CTA on the old page that was never
          commerce, so it keeps its label and its destination. */}
      <Section
        id="mailing-list"
        surface="sunken"
        density="tight"
        aria-labelledby="mailing-list-title"
      >
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-7`}>
              <Eyebrow>Lower commitment</Eyebrow>
              <Heading level={2} size="2xl" folio="No. 03" id="mailing-list-title">
                Join the Conversation
              </Heading>
              <Prose>
                <p>{MAILING_LIST_COPY}</p>
              </Prose>
              <Button href="/join-the-conversation/" variant="secondary" size="lg">
                Sign Up for Damian&rsquo;s Mailing List
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- The join CTA ----------------------------------------------------
          The client's one required change on this route. */}
      <CTABand
        id="join"
        eyebrow="Membership"
        folio="No. 04"
        heading="Join the group"
        copy={
          <>
            <p>{JOIN_QUESTION}</p>
            <p>
              {JOIN_FALLBACK_LEAD}
              <a href={MAILTO_PLAIN}>{contact.email}</a>.
            </p>
          </>
        }
        actions={
          [
            {
              label: 'Email Damian to Join',
              href: JOIN_HREF,
              'aria-label': 'Email Damian to join the Business of Ag Success Group',
            },
          ] as const
        }
        panel={{
          eyebrow: 'The group',
          value: '2020',
          label: 'meeting since',
          note: 'Damian Mason and Todd Thurman host every program.',
        }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import { Button, Card, Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import { CTABand } from '@/components/sections/CTABand';
import { EpisodeCard } from '@/components/sections/EpisodeCard';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { JsonLd } from '@/components/seo';
import { brandAssetsExtra } from '@/content/brand-assets';
import { NEW_TAB_NOTE, NEW_TAB_PROPS } from '@/lib/links';
import { contact, podcasts, socials } from '@/content/site';
import { buildBreadcrumbListSchema, buildDoBusinessBetterSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';
import { imageAlt } from '@/content/image-alt';

/* ============================================================================
   DO BUSINESS BETTER PODCAST

   Source: _source/pages/do-business-better-podcast.md (5 sections, 10 CTAs).

   Live-site defects deliberately not reproduced:
     - the "Follow on SoundCloud" icon pointed at soundcloud.com/thebusinessof
       agriculture, which is the OTHER show. Every link here resolves through
       podcasts.doBusinessBetter in content/site.ts, so the two cannot drift.
     - two empty-fragment placeholder links (YouTube, iTunes). The YouTube slot now
       resolves to Damian's real channel from content/site.ts and is labelled
       as his channel, not the show's. The Apple slot is gone: no Apple
       Podcasts URL for this show exists anywhere in the mirrored source, and a
       link that goes nowhere is worse than no link.
     - two <h1> elements. There is exactly one here.
     - the H1 to H3 to H4 to H2 to H1 heading order. This page runs h1, then h2
       per section, then h3 inside them.
     - the show art shipped with alt="". It is the page's identity image and it
       now describes itself.
     - the "Latest Episode" block repeated episode 144 verbatim immediately
       above the list that already contained it. Rendered once.
     - a 33 MB self-hosted MP3 of episode 144, played by a native <audio>
       element. Playback goes to the show's own host instead. Nothing on this
       page replaces it, so this route no longer plays anything in place: every
       listen now leaves for SoundCloud. That is a deliberate functional
       reduction and it is the only one on the route, logged for the client in
       docs/OPEN-ITEMS.md. A facade-loaded SoundCloud player would restore it.
     - the contact email was plain text. It is a mailto in two places here.
   ============================================================================ */

const show = podcasts.doBusinessBetter;
const youtube = socials.find((social) => social.icon === 'youtube');

const SHOW_ART = {
  src: brandAssetsExtra.doBusinessBetterPodcast,
  width: 800,
  height: 800,
  alt: imageAlt['/img/brand/do-business-better-podcast.png'],
};

const BOOK_COVER = {
  src: '/img/photos/do-business-better-book-cover.png',
  width: 1200,
  height: 1200,
  alt: imageAlt['/img/photos/do-business-better-book-cover.png'],
};

/**
 * The show description, verbatim from the source page's "Start Listening
 * Today!" block. It is also the page's meta description and og:description on
 * the old site, and it is the only first-person paragraph on the page, so it
 * is reproduced word for word rather than rewritten.
 */
const SHOW_DESCRIPTION =
  'This podcast is for you: the entrepreneur, business owner, solopreneur, self employed striver, or business person who wants to do it better. By better I mean more profitably, more happily, and for as many years as you choose. That’s what doing business better is about. I quit my Fortune 500 job in 1994 to pursue a life and business of my choice. All these years later I’m still driven by my original “why” that made me an entrepreneur: to be more creative and rewarded financially for my accomplishments.';

/**
 * The three episodes the old page listed, in the order it listed them, with
 * their descriptions verbatim. Two changes, both recorded in
 * docs/build/STATE.md under "Build notes":
 *   1. the SoundCloud share-widget tracking tails on 142 and 141 are stripped.
 *      They carried a double-encoded URL inside a query string and pointed the
 *      same place without it.
 *   2. two em dashes inside the 142 and 141 descriptions became a colon and a
 *      pair of commas. The client asked for no em dashes on the site. Meaning
 *      is unchanged.
 * "in his mid 50’s" is corrected to "in his mid 50s". It is an apostrophe on a
 * decade, flagged as a copy defect in the source harvest.
 */
const EPISODES = [
  {
    number: '144',
    title: 'A Vision to Reap ROI From Client’s Existing Technology',
    href: 'https://soundcloud.com/dobusinessbetter/144-a-vision-to-reap-roi-from-clients-existing-technology',
    description:
      'Dave Swain worked in corporate Agriculture his entire career until he jumped ship and started his own business (in his mid 50s no less!). His company, Vision Technology Management, was born from his vision to help companies better utilize technology for which they had already invested. Face it, we all feel the pressure to innovate with new tech but sometimes we find implementation or full utilization so daunting, we revert back to what we know. This leaves a lot of under-utilized tech with a very bad ROI. Dave shares his entrepreneurial journey while discussing the business side of technology utilization.',
  },
  {
    number: '142',
    title: 'An Engineer With An Entrepreneurial Side-Hustle',
    href: 'https://soundcloud.com/dobusinessbetter/142-an-engineer-with-an-entrepreneurial-side-hustle',
    description:
      'Matt Roeder is an Iowa farm kid who’s employed as an Agricultural engineer for a plastics manufacturing company. A few years ago, after seeing a shortcoming on his corn planter (he still farms on the side), he designed a new and improved closing wheel. But this product design doesn’t belong to his employer, it’s his. Matt explains the inspiration for the product, how he brings it to market, and the delicate and mutually beneficial relationship he has with his employer: they build his designs and support his side hustle all while he retains his day job. We also discuss patent problems and assess the 5 entrepreneurial personalities. This is an excellent discussion for those looking to create or expand a side hustle.',
  },
  {
    number: '141',
    title: 'A Budding Beer Entrepreneur Resurrects an Old Beer Brand',
    href: 'https://soundcloud.com/dobusinessbetter/141-a-budding-beer-entrepreneur-resurrects-an-old-beer-brand',
    description:
      'My friend Brad Klopfenstein and I have shared a love of beer drinking and beer history for more than 3 decades. Now Mr. Klopfenstein is turning his love into a side hustle. A novice Indiana historian, Brad was poking around the internet researching old Indiana beers as sort of a “where are they now?” endeavor. That’s when he discovered Alps Brau, a former Fort Wayne, IN based beer brand, was available for the taking. Brad acquired the rights to the brand and in February 2023, will release the first batch of Alps Brau since 1978! Brad explains the path to his new endeavor, business lessons learned, and how he hopes to capitalize on the appeal of nostalgia.',
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: 'Do Business Better Podcast',
  description:
    'Damian quit his Fortune 500 job in 1994. Now he asks owners, solopreneurs and self employed strivers what actually worked. Three episodes to start with.',
  path: '/do-business-better-podcast/',
  image: {
    url: SHOW_ART.src,
    width: SHOW_ART.width,
    height: SHOW_ART.height,
    alt: SHOW_ART.alt,
  },
});

export default function DoBusinessBetterPodcastPage() {
  return (
    <>
      <JsonLd
        schema={[
          buildDoBusinessBetterSchema(),
          buildBreadcrumbListSchema([
            { name: 'Home', path: '/' },
            { name: 'Podcasts', path: '/podcasts/' },
            { name: 'Do Business Better', path: '/do-business-better-podcast/' },
          ]),
        ]}
      />

      {/* SECTION 1 */}
      {/* Hero. The one orange field in this viewport is the listen button. */}
      <Section aria-labelledby="show-title">
        <Container>
          <div className="dm-grid12 dm-hero__grid">
            <div
              className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-7`}
            >
              <Eyebrow>Podcast · Entrepreneurs, owners, solopreneurs</Eyebrow>
              <Heading level={1} display size="5xl" id="show-title">
                Do Business Better Podcast
              </Heading>
              <Prose lead>
                <p>
                  Damian quit his Fortune 500 job in 1994 and hasn’t had a boss since.
                  Every episode is that same conversation with somebody who made the same
                  jump: an Iowa engineer with a closing wheel of his own design, a novice
                  historian reviving a beer brand that died in 1978, a corporate Ag lifer
                  who jumped ship in his mid 50s.
                </p>
              </Prose>
              <div className="dm-hero__actions">
                <Button href={show.soundcloud} variant="primary" size="lg" {...NEW_TAB_PROPS}>
                  Listen on SoundCloud
                </Button>
                <Button href="#subscribe" variant="secondary" size="lg">
                  Get new episodes
                </Button>
              </div>
            </div>

            <figure
              className={`${styles.figure} ${styles.heroFigure} col-span-6 md:col-span-12 lg:col-span-5`}
            >
              <div className={styles.plate}>
                <Image
                  src={SHOW_ART.src}
                  alt={SHOW_ART.alt}
                  width={SHOW_ART.width}
                  height={SHOW_ART.height}
                  priority
                  sizes="(min-width: 64rem) 32rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                Show art for Do Business Better. The show and the book share a title, an
                argument, and an author.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* SECTION 2 */}
      {/* The show description, verbatim, and the two places it actually plays. */}
      <Section surface="sunken" aria-labelledby="listen-title">
        <Container>
          <div className="dm-grid12">
            <div className={`${styles.stack} col-span-6 md:col-span-12 lg:col-span-7`}>
              <Heading level={2} id="listen-title">
                Start Listening Today!
              </Heading>
              <Prose>
                <p>{SHOW_DESCRIPTION}</p>
              </Prose>
            </div>

            <Card
              variant="ruled"
              className="col-span-6 md:col-span-12 lg:col-span-4 lg:col-start-9"
            >
              <Eyebrow>Where it plays</Eyebrow>
              <Heading level={3} size="lg">
                Where to listen
              </Heading>
              <ul className={styles.platforms}>
                <li>
                  {/* .dm-action-link, because this is a standalone target
                      with a caption under it, not a link inside a sentence:
                      bare it measured 17px tall at both 390 and 768, under the
                      24px floor WCAG 2.2 SC 2.5.8 sets. The class is
                      inline-flex with align-items:center, so only the box
                      grows and the type stays optically where it was. */}
                  <a className="dm-action-link" href={show.soundcloud} {...NEW_TAB_PROPS}>
                    Every episode on SoundCloud
                    <span className="sr-only">{NEW_TAB_NOTE}</span>
                  </a>
                  <p className={styles.platformNote}>The whole catalog lives here</p>
                </li>
                {youtube ? (
                  <li>
                    <a className="dm-action-link" href={youtube.href} {...NEW_TAB_PROPS}>
                      Damian Mason on YouTube
                      <span className="sr-only">{NEW_TAB_NOTE}</span>
                    </a>
                    <p className={styles.platformNote}>His channel, not the show feed</p>
                  </li>
                ) : null}
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* SECTION 3 */}
      {/* The old page called this "Latest 3 Episodes" in an h1, and the three
          it listed were 144, 142 and 141. 143 is not among them, so the
          heading here does not claim to be the latest anything.

          NAVY. This route ran three light bands and one arrival, and the
          episodes are what it is actually for. */}
      <Section surface="deep-alt" aria-labelledby="episodes-title">
        {/* A left rail for the head and the reading column for the episodes.
            The section used to run head and list at full container width, so
            each episode's top rule spanned 1248px over a paragraph that stopped
            at 830 and left 500px of nothing under every rule, and the intro
            was set at a 420px measure while the bodies under it ran at 730. The
            rail fixes both: the rules are now the width of the column they
            rule, and the intro is set by the rail rather than by a second
            measure nobody chose. */}
        <Container>
          <div className="dm-grid12">
            <div className={`dm-rail ${styles.stack} col-span-6 md:col-span-4`}>
              <Eyebrow>From the catalog</Eyebrow>
              <Heading level={2} id="episodes-title">
                Three episodes to start with
              </Heading>
              <Prose>
                <p>
                  Episodes 144, 142, and 141: a consultant who started his own firm in his
                  mid 50s, an engineer with a side hustle and a day job, and a beer brand
                  brought back from 1978. Start anywhere.
                </p>
              </Prose>
            </div>

            <div className="col-span-6 md:col-span-8">
          <ul className={styles.episodeList}>
            {EPISODES.map((episode) => (
              <EpisodeCard
                key={episode.number}
                as="li"
                headingLevel={3}
                show="Do Business Better"
                episodeNumber={episode.number}
                title={episode.title}
                href={episode.href}
                description={episode.description}
              />
            ))}
          </ul>

            </div>
          </div>

          {/* The close belongs to the section, not to the episode column.
              Inside the col-span-8 wrapper its hairline started at the column
              rather than at the container: MEASURED at 768 it ran 459px from
              x=278 where the identically classed rules on /speaking/,
              /keynote/ and /acres-tv/ run the container's 704 from x=32. It
              also carried .stack, whose align-items: flex-start defeated the
              convention's own 390 branch and left this the one section-closing
              button on the site that did not fill the width at 390 (270px
              against 349px everywhere else). .dm-section-close is already a
              flex row and already owns the interval above it, so neither the
              wrapper nor .stack has anything left to add. */}
          <div className="dm-section-close">
            <Button href={show.soundcloud} variant="secondary" {...NEW_TAB_PROPS}>
              All episodes on SoundCloud
            </Button>
          </div>
        </Container>
      </Section>

      {/* SECTION 4 */}
      {/* The book, as credibility only. No price, no retailer, no purchase
          affordance anywhere on this site. */}
      <Section surface="sunken" aria-labelledby="book-title">
        <Container>
          <div className="dm-grid12">
            <figure className={`${styles.figure} col-span-6 md:col-span-5`}>
              <div className={`${styles.plate} ${styles.bookPlate}`}>
                <Image
                  src={BOOK_COVER.src}
                  alt={BOOK_COVER.alt}
                  width={BOOK_COVER.width}
                  height={BOOK_COVER.height}
                  loading="lazy"
                  sizes="(min-width: 48rem) 24rem, 100vw"
                />
              </div>
              <figcaption className="dm-figure__caption">
                Do Business Better: Traits, Habits, and Actions to Help You Succeed. Wiley
                published it, with a foreword by Larry Winget.
              </figcaption>
            </figure>

            <div
              className={`${styles.stack} col-span-6 md:col-span-6 md:col-start-7`}
            >
              <Eyebrow>Same name, on paper</Eyebrow>
              <Heading level={2} id="book-title">
                The book the show is named after
              </Heading>
              {/* The jacket copy in content/books.ts says "2,000 audiences
                  across the world" and it stays verbatim there, on /about/,
                  where it reads as a quotation. This paragraph is the
                  rebuild's own sentence, so it carries the figure the rest of
                  the site carries rather than a second, lower career total. */}
              <Prose>
                <p>
                  Damian wrote Do Business Better after speaking to companies such as Merck,
                  Land O’Lakes, and Cargill, and more than 2,400 audiences since 1994. Most
                  business books tell you how to reach success. This one makes you define
                  success first, because yours isn’t your neighbor’s.
                </p>
              </Prose>
              <Button href="/about/#books" variant="secondary">
                More about the books
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* SECTION 5 */}
      {/* The old page signup: a Divi form with no action, a placeholder anchor
          for a submit control instead of a button, and a display:none label.
          This one posts
          straight to the same Mailchimp audience, has a real submit button and
          a real label, and works with scripting off. Secondary, because the
          CTA band below it owns the orange in this part of the page. */}
      {/* The label has to name the heading NewsletterForm actually renders,
          which is `${idPrefix}-title`. Pointing at a bare "subscribe-title"
          resolved to nothing, which left the section unnamed: an unnamed
          <section> maps to role generic, and generic prohibits
          aria-labelledby, so one dangling reference broke two rules. */}
      {/* align="start", like the identical section on the sibling route
          /the-business-of-agriculture/. Centred, this was the only section head
          on the site that did not open on the 96px left spine: it measured
          x=320 against x=96 everywhere else, so the page's left edge stepped
          224px in and back out again for one section. */}
      <Section id="subscribe" aria-labelledby="dbb-subscribe-title">
        <Container width="narrow" align="start">
          <NewsletterForm
            idPrefix="dbb-subscribe"
            headingLevel={2}
            title="Subscribe to get notified of new releases."
            blurb="One email when a new episode is up, plus where Damian is speaking next. Nothing else."
            submitLabel="Add me to the list"
            submitVariant="secondary"
          />
        </Container>
      </Section>

      {/* SECTION 6 */}
      {/* The old "Contact Us" block: an email address in plain text, beside an
          empty two-thirds layout column. */}
      <CTABand
        id="contact"
        eyebrow="Contact"
        heading="Booking a date, pitching a guest, or just curious?"
        copy={
          <p>
            Email the office at <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            Booking a keynote, pitching a guest for the show, or asking about a sponsorship:
            it all starts at the same address. You’ll get a straight answer, not a
            brochure.
          </p>
        }
        actions={[
          { label: 'Email the office', href: `mailto:${contact.email}` },
          { label: 'Contact Damian', href: '/contact-us/' },
        ]}
        panel={{
          eyebrow: 'On his own since',
          value: '1994',
          label: 'the year he quit the Fortune 500 job',
          note: 'That decision is the premise of the whole show.',
        }}
      />
    </>
  );
}

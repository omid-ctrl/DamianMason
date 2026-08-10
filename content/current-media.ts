import type { Video } from './videos';

/**
 * A feed item from The Business of Agriculture.
 *
 * The fallbacks below were verified against Damian's first-party Libsyn feed
 * on 2026-08-09. Server pages ask the feed for fresher items and use these
 * records only when Libsyn is unavailable or returns malformed XML, so a
 * transient feed failure never leaves a blank recent-episode section.
 */
export type PodcastEpisode = {
  title: string;
  episodeNumber?: string;
  published: string;
  duration?: string;
  link: string;
  enclosureUrl?: string;
  description: string;
};

export const verifiedBusinessOfAgricultureFallbackEpisodes: PodcastEpisode[] = [
  {
    title: 'Will the Great American Cotton Plan Save U.S. Cotton?',
    episodeNumber: '461',
    published: '2026-08-03',
    duration: '53:23',
    link:
      'https://f2a7f5f9-0de4-478a-be41-151ce3dba91c.libsyn.com/461-will-the-great-american-cotton-plan-save-us-cotton-damian-mason-podcast',
    enclosureUrl:
      'https://traffic.libsyn.com/secure/f2a7f5f9-0de4-478a-be41-151ce3dba91c/GreatAmericanCottonPlan.mp3?dest-id=4358633',
    description:
      '$2.6 billion is what USDA says U.S. cotton growers stand to lose this year, the industry\u2019s fifth straight year of red ink. Plains Cotton Growers CEO Kody Bessent joins cotton farmers Todd Kimbrell and Matt Miles to examine the Great American Cotton Plan, cotton demand, apparel, rural infrastructure, and what the initiative could mean for producers.',
  },
  {
    title:
      'AI Is Coming for Agriculture — The Upside, the Dark Side, and What It Means for Your Business',
    episodeNumber: '460',
    published: '2026-07-27',
    duration: '01:05:46',
    link:
      'https://f2a7f5f9-0de4-478a-be41-151ce3dba91c.libsyn.com/460-ai-is-coming-for-agriculture-the-upside-the-dark-side-and-what-it-means-for-your-business-damian-mason-podcast',
    enclosureUrl:
      'https://traffic.libsyn.com/secure/f2a7f5f9-0de4-478a-be41-151ce3dba91c/AI.mp3?dest-id=4358633',
    description:
      'Artificial intelligence is no longer a future concept for agriculture. It is already transforming how farms, agribusinesses, and agricultural professionals make decisions, manage risk, and compete in a rapidly changing global marketplace.',
  },
  {
    title: 'Why American Farmers Pay More for Crop Inputs Than Brazil',
    episodeNumber: '459',
    published: '2026-07-20',
    duration: '52:06',
    link:
      'https://f2a7f5f9-0de4-478a-be41-151ce3dba91c.libsyn.com/459-why-american-farmers-pay-more-for-crop-inputs-than-brazil-damian-mason-podcast',
    enclosureUrl:
      'https://traffic.libsyn.com/secure/f2a7f5f9-0de4-478a-be41-151ce3dba91c/AmericaBrazil.mp3?dest-id=4358633',
    description:
      'Why do American farmers pay significantly more for seed and crop protection products than farmers in Brazil? A National Corn Growers Association study finds that U.S. farmers face substantially higher crop input prices, with some products costing nearly twice as much as comparable inputs in Brazil.',
  },
  {
    title: '200 Million Acres of Southern Timberland: Why Land Outvalues Trees',
    episodeNumber: '458',
    published: '2026-07-13',
    duration: '01:00:58',
    link:
      'https://f2a7f5f9-0de4-478a-be41-151ce3dba91c.libsyn.com/458-200-million-acres-of-southern-timberland-why-land-outvalues-trees-damian-mason-podcast',
    enclosureUrl:
      'https://traffic.libsyn.com/secure/f2a7f5f9-0de4-478a-be41-151ce3dba91c/Timber.mp3?dest-id=4358633',
    description:
      'More than 200 million acres of the American South are covered in timber. The South produces one-third of America\u2019s lumber, with paper and cardboard as an important by-product. Bobby Dobson and Spencer Smith join Damian Mason to break down an industry that looks remarkably familiar to anyone who follows corn and soybean economics.',
  },
];

export const verifiedBusinessOfAgricultureFallback =
  verifiedBusinessOfAgricultureFallbackEpisodes[0];

export const uprooted = {
  name: 'UPROOTED',
  playlist:
    'https://www.youtube.com/playlist?list=PLC6Hi9FYKyg0&si=3VxxIXoQrIZRaXxV',
  description:
    'UPROOTED is where agriculture gets pulled apart and examined from the roots up. Damian travels across the country uncovering the businesses, technologies, and people changing the future of farming. Each episode combines documentary-style storytelling with practical business insight to explain not just what is happening in agriculture, but why it matters.',
  episodeOneTitle:
    'What Is Nanotechnology? The Tiny Science That Could Change Farming | Uprooted Episode 1',
  episodeOneDuration: '26:20',
} as const;

/** First-party YouTube record for the inaugural UPROOTED documentary. */
export const uprootedEpisodeOne: Video = {
  id: 'uprooted-nanotechnology',
  kind: 'youtube',
  youtubeId: 'EefARYINIQQ',
  title: uprooted.episodeOneTitle,
  description:
    'Episode one follows the tiny science of nanotechnology into the field and asks how it could change farming.',
  onPages: ['/', '/podcasts/'],
};

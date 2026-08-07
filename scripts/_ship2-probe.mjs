/** Ship-2 desktop probe: section rhythm, heading axes, media boxes. Temp tooling. */
import { chromium } from 'playwright';

const W = +(process.argv[2] || 1440);
const BASE = 'http://localhost:3100';
const ROUTES = [
  ['home', '/'],
  ['about', '/about/'],
  ['acres-tv', '/acres-tv/'],
  ['blog', '/blog/'],
  ['blog-news', '/blog-news/'],
  ['boasg', '/boasg/'],
  ['collaboration', '/collaboration-opportunities/'],
  ['contact-us', '/contact-us/'],
  ['dbb-podcast', '/do-business-better-podcast/'],
  ['join', '/join-the-conversation/'],
  ['keynote', '/keynote/'],
  ['meeting-coordinators', '/meeting-coordinators/'],
  ['podcasts', '/podcasts/'],
  ['reviews', '/reviews/'],
  ['speaking', '/speaking/'],
  ['boa', '/the-business-of-agriculture/'],
  ['xtreme-ag', '/xtreme-ag/'],
  ['post-eggflation', '/blog/eggflation-gives-producers-record-profits/'],
  ['post-climate', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],
];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: 1000 }, reducedMotion: 'reduce' });
const p = await ctx.newPage();
await p.route('**/*', (r) => {
  const u = new URL(r.request().url());
  return u.hostname === 'localhost' || u.hostname.endsWith('ytimg.com') ? r.continue() : r.abort();
});

const out = {};
for (const [name, route] of ROUTES) {
  await p.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(400);
  out[name] = await p.evaluate(() => {
    const R = (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y + window.scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    };
    const main = document.querySelector('#main');
    const sections = [...main.querySelectorAll(':scope > section, :scope > * > section')];
    const secs = sections.map((s) => {
      const cs = getComputedStyle(s);
      const r = R(s);
      // first + last painted descendant, to measure real breathing room
      const kids = [...s.querySelectorAll('*')].filter((n) => {
        const b = n.getBoundingClientRect();
        return b.width > 4 && b.height > 4;
      });
      let top = Infinity;
      let bot = -Infinity;
      for (const k of kids) {
        const b = k.getBoundingClientRect();
        top = Math.min(top, b.top + window.scrollY);
        bot = Math.max(bot, b.bottom + window.scrollY);
      }
      const h = s.querySelector('h1,h2');
      return {
        surface: s.dataset.surface || 'page',
        ...r,
        padT: +cs.paddingBlockStart.replace('px', ''),
        padB: +cs.paddingBlockEnd.replace('px', ''),
        gapTop: Math.round(top - r.y),
        gapBot: Math.round(r.y + r.h - bot),
        head: h ? { tag: h.tagName, x: R(h).x, w: R(h).w, text: h.textContent.trim().slice(0, 46) } : null,
      };
    });
    const media = [...main.querySelectorAll('img, .dm-video__frame, video')].map((m) => ({
      tag: m.tagName,
      cls: (m.className || '').toString().slice(0, 40),
      ...R(m),
      nat: m.naturalWidth ? `${m.naturalWidth}x${m.naturalHeight}` : '',
      fit: getComputedStyle(m).objectFit,
      src: (m.currentSrc || m.src || '').split('/').pop()?.slice(0, 44) || '',
    }));
    const heads = [...main.querySelectorAll('h1,h2,h3')].map((h) => ({
      tag: h.tagName,
      ...R(h),
      lines: Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)),
      text: h.textContent.trim().slice(0, 52),
    }));
    return { secs, media, heads };
  });
  console.error('done', name);
}
await b.close();
console.log(JSON.stringify(out));

/**
 * TYPE BAKE-OFF COMP GENERATOR
 *
 * Writes docs/design/type/comp-*.html, one per display-face candidate plus the
 * shipped Bodoni Moda as a control.
 *
 * WHY A GENERATOR RATHER THAN FOUR HAND-WRITTEN FILES. The Phase 1a direction
 * bake-off shot three comps that had three different layouts, so a judge could
 * only compare them from memory, and the legibility lens lost that round partly
 * because of it. These four differ in exactly one object: FACES[n]. Everything
 * else is one template string, so the shots register pixel-for-pixel and a
 * judge can flip between them. Byte-identity is a property of the code here,
 * not a thing someone has to keep true by hand.
 *
 * The ground is the NEW cool-white palette, not the shipped bone. Judging a
 * face against a ground it will never ship on is judging the wrong thing.
 *
 *   node scripts/build-type-comps.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs/design/type');
mkdirSync(OUT, { recursive: true });

/* The candidates. `link` is the Google Fonts request; `stack` is what
   --family-display resolves to; the tracking pair is what section 3d of the
   plan splits --ls-tightest into. */
const FACES = [
  {
    id: '0-bodoni',
    name: 'Bodoni Moda',
    note: 'CONTROL. The shipped face. Didone, 40px floor, 25.2 KB preloaded.',
    // Deliberately wght-only, because that is what next/font actually requests
    // today: it emits no opsz axis unless you pass axes:, so the shipped file
    // has no optical-size master and font-optical-sizing: auto is inert.
    link: 'family=Bodoni+Moda:wght@500',
    stack: '"Bodoni Moda", "Times New Roman", serif',
    weight: 500,
    ls: '-0.032em',
    lsMasthead: '-0.032em',
    lh: 1.02,
  },
  {
    id: 'a-oswald',
    name: 'Oswald',
    note: 'ATF Alternate Gothic, redrawn for screen. No opsz axis, so no wrong master. 12.4 KB.',
    link: 'family=Oswald:wght@600',
    stack: '"Oswald", "Arial Narrow", sans-serif',
    weight: 600,
    ls: '-0.014em',
    lsMasthead: '-0.022em',
    lh: 1.02,
  },
  {
    id: 'b-big-shoulders',
    name: 'Big Shoulders',
    note: 'Chicago condensed gothic. Shown at the DISPLAY optical master, which costs the full 56.9 KB variable font.',
    link: 'family=Big+Shoulders:opsz,wght@72,600',
    stack: '"Big Shoulders", "Arial Narrow", sans-serif',
    weight: 600,
    ls: '-0.014em',
    lsMasthead: '-0.022em',
    lh: 1.02,
  },
  {
    id: 'c-libre-franklin',
    name: 'Libre Franklin',
    note: 'Benton Franklin Gothic. NORMAL WIDTH: in the bake-off to make the width thesis falsifiable, not to win. 15.6 KB.',
    link: 'family=Libre+Franklin:wght@800',
    stack: '"Libre Franklin", Helvetica, Arial, sans-serif',
    weight: 800,
    ls: '-0.014em',
    lsMasthead: '-0.022em',
    lh: 1.02,
  },
];

/* Real strings from the site. Every one of these is set somewhere in app/. */
const H1S = [
  'Straight-Forward Agriculture Dialogue',
  'Ag economist, comedian, farm owner.',
  'Meeting Coordinators',
  'Join the Conversation',
  'Testimonials',
  'News & Media',
];

function page(f) {
  return `<meta charset="utf-8">
<title>Type bake-off: ${f.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${f.link}&family=Archivo:wght@400;600&family=Source+Serif+4:opsz,wght@8..60,400;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
  /* ---- the NEW cool-white palette, so the face is judged on the ground it ships on ---- */
  :root {
    --surface-page: #F7F8F6;
    --surface-sunken: #E9EDE8;
    --surface-forest: #12231B;
    --ink-primary: #041826;
    --ink-brand: #094D78;
    --ink-muted: #566654;
    --ink-accent: #A8330E;
    --ink-hot: #FF5325;
    --rule-structural: #788A73;

    --family-display: ${f.stack};
    --family-body: "Archivo", Helvetica, Arial, sans-serif;
    --family-serif: "Source Serif 4", Georgia, serif;
    --family-mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;

    --weight-display: ${f.weight};
    --ls-display: ${f.ls};
    --ls-display-masthead: ${f.lsMasthead};
    --lh-tight: ${f.lh};
  }

  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--surface-page); color: var(--ink-primary);
    font-family: var(--family-body); -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1344px; margin: 0 auto; padding: 0 48px; }
  @media (max-width: 500px) { .wrap { padding: 0 20px; } }

  .panel { padding: 64px 0; border-top: 1px solid var(--rule-structural); }
  .panel:first-of-type { border-top: 0; }

  .eyebrow {
    font-family: var(--family-mono); font-size: 12px; text-transform: uppercase;
    letter-spacing: 0.16em; color: var(--ink-muted); margin: 0 0 24px;
  }

  .display {
    font-family: var(--family-display); font-weight: var(--weight-display);
    line-height: var(--lh-tight); letter-spacing: var(--ls-display);
    color: var(--ink-primary); margin: 0 0 28px;
  }
  .display.masthead { letter-spacing: var(--ls-display-masthead); }

  /* THE HERO TYPE TRACK. 7 of 12 columns at 1440. The rule down the right edge
     is the whole point of this panel: an overrun has to be visible, not
     inferred from a number in a report. */
  .track {
    width: 708px; max-width: 100%;
    border-right: 1px solid var(--ink-hot);
    padding-right: 2px; margin-bottom: 40px;
  }
  @media (max-width: 500px) { .track { width: 350px; } }

  .size-6xl { font-size: 110px; }
  .size-5xl { font-size: 80px; }
  .size-4xl { font-size: 60px; }
  .size-3xl { font-size: 50px; }
  .size-2xl { font-size: 40px; }
  @media (max-width: 500px) {
    .size-6xl { font-size: 52px; }
    .size-5xl { font-size: 48px; }
    .size-4xl { font-size: 40px; }
    .size-3xl { font-size: 34px; }
    .size-2xl { font-size: 28px; }
  }

  .body { font-size: 17px; line-height: 1.6; max-width: 66ch; margin: 0 0 16px; }
  .serif-h2 { font-family: var(--family-serif); font-weight: 600; font-size: 40px; margin: 0 0 16px; }

  .figure {
    font-family: var(--family-serif); font-weight: 600; font-size: 54px;
    font-variant-numeric: tabular-nums lining-nums; color: var(--ink-brand);
  }
  .figure-display {
    font-family: var(--family-display); font-weight: var(--weight-display); font-size: 54px;
    font-variant-numeric: tabular-nums lining-nums; color: var(--ink-brand);
  }
  .plus { color: var(--ink-hot); }
  .ledger { display: flex; gap: 48px; flex-wrap: wrap; }
  .ledger div { border-top: 2px solid var(--ink-primary); padding-top: 12px; }
  .lbl { font-family: var(--family-mono); font-size: 12px; text-transform: uppercase;
         letter-spacing: 0.16em; color: var(--ink-muted); display: block; margin-top: 8px; }

  .sunken { background: var(--surface-sunken); }
  .forest { background: var(--surface-forest); color: #FAFBF8; }
  .forest .display, .forest .serif-h2 { color: #FAFBF8; }
  .forest .eyebrow { color: #8BB89A; }
</style>

<div class="wrap">

  <section class="panel">
    <p class="eyebrow">${f.name} &nbsp;/&nbsp; ${f.note}</p>
  </section>

  <!-- PANEL 1. Every real H1 on the site, in the real hero track, with the
       track edge drawn. This is the panel that decides --fs-6xl-hero. -->
  <section class="panel">
    <p class="eyebrow">01 / Masthead: every H1, in a real 7-of-12 track</p>
${H1S.map((h) => `    <div class="track"><h1 class="display masthead size-6xl">${h}</h1></div>`).join('\n')}
    <div class="track"><h2 class="display size-4xl">A Leading Agriculture Presenter Who Talks Candidly About Current Events.</h2></div>
    <div class="track"><h2 class="display size-5xl">Damian&rsquo;s Business of Agriculture streams on Acres TV.</h2></div>
  </section>

  <!-- PANEL 2. The panel the judgement turns on. If the display face and
       Archivo read as one face at two sizes, the candidate has failed the only
       test that matters, and Libre Franklin is here to prove the test is real. -->
  <section class="panel">
    <p class="eyebrow">02 / Differentiation: display against the Archivo body and the Source Serif rank</p>
    <h2 class="display size-3xl">Not Your Boring Ag Speaker, Damian is:</h2>
    <h3 class="serif-h2">Three decades on stage</h3>
    <p class="body">Damian Mason has an exceptional understanding of the Agriculture industry, he&rsquo;s been
    involved in it his entire life. That, combined with his passion to stay one step ahead of what&rsquo;s
    looming for the industry, means he works tirelessly to stay up to date with current trends,
    research current events and news, and connect with industry leaders.</p>
    <p class="body">You don&rsquo;t need anyone telling you the weather forecast or the commodity prices,
    technology does that for you! What you need is a connection with real-world agriculture people.</p>
  </section>

  <!-- PANEL 3. The ladder, and the tabular-figure test. The right-hand column
       is the display face trying to do the ledger's job. On every condensed
       gothic on Google Fonts the digits will not align, which is why
       --family-figure stays Source Serif whoever wins. -->
  <section class="panel">
    <p class="eyebrow">03 / Ladder, and the proof figures in both faces</p>
    <div class="track"><p class="display size-6xl">Straight-Forward</p></div>
    <p class="display size-5xl">Straight-Forward</p>
    <p class="display size-4xl">Straight-Forward Agriculture</p>
    <p class="display size-3xl">Straight-Forward Agriculture Dialogue</p>
    <p class="display size-2xl">Straight-Forward Agriculture Dialogue, set at the section head step</p>

    <div class="ledger" style="margin-top:48px">
      <div><span class="figure">2,400<span class="plus">+</span></span><span class="lbl">Serif, tabular</span></div>
      <div><span class="figure">40,000<span class="plus">+</span></span><span class="lbl">Serif, tabular</span></div>
      <div><span class="figure">1994</span><span class="lbl">Serif, tabular</span></div>
      <div><span class="figure-display">2,400<span class="plus">+</span></span><span class="lbl">Display face</span></div>
      <div><span class="figure-display">40,000<span class="plus">+</span></span><span class="lbl">Display face</span></div>
      <div><span class="figure-display">1994</span><span class="lbl">Display face</span></div>
    </div>
  </section>

</div>

<!-- PANEL 4. The furniture the face has to live with, on the two bands it has
     to survive: the sage alternating band and the new forest scope. -->
<section class="panel sunken">
  <div class="wrap" style="padding-top:64px;padding-bottom:64px">
    <p class="eyebrow">04 / On the sage band</p>
    <h2 class="display size-2xl">No. 04 &nbsp; If it&rsquo;s Agriculture, it Needs Damian.</h2>
    <p class="body">Cargill, Merck, Land O&rsquo;Lakes Purina, CLAAS, Pioneer, and 16 more.</p>
  </div>
</section>

<section class="panel forest">
  <div class="wrap" style="padding-top:64px;padding-bottom:64px">
    <p class="eyebrow">05 / On the forest band</p>
    <h2 class="display size-3xl">Connecting people of the world&rsquo;s most important industry.</h2>
    <p class="body">Since 1994, he has spoken to over 2,400 audiences in all 50 states and 7 foreign countries.</p>
  </div>
</section>
`;
}

const targets = [];
for (const f of FACES) {
  const file = join(OUT, `comp-${f.id}.html`);
  writeFileSync(file, page(f));
  targets.push({ name: `type-${f.id}`, url: `file://${file}` });
}
writeFileSync(join(OUT, 'targets.json'), JSON.stringify(targets, null, 2));
console.log(`Wrote ${FACES.length} comps and targets.json to ${OUT}`);

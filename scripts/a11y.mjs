/**
 * Automated WCAG 2.1 AA pass over every route, at desktop and mobile.
 *
 *   node scripts/a11y.mjs [--base http://localhost:3100] [--widths 1440,390]
 *                         [--out docs/qa/a11y-report.json]
 *
 * Runs axe-core with the wcag2a, wcag2aa, wcag21a and wcag21aa tag sets, which
 * is exactly the conformance target and nothing beyond it. Best-practice rules
 * are deliberately excluded: they are opinions, not the standard, and mixing
 * them into the count makes the honest number impossible to read.
 *
 * Writes a machine-readable JSON report plus a readable .md summary next to it.
 *
 * Exit code is 1 when any violation survives, so this can gate a build.
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);

const BASE = args.base ?? 'http://localhost:3100';
const WIDTHS = (args.widths ?? '1440,390').split(',').map(Number);
const OUT = path.resolve(
  process.cwd(),
  args.out ?? 'docs/qa/a11y-report.json',
);

/** The 21 routes. Order matches the IA, not the filesystem. */
const ROUTES = [
  ['home', '/'],
  ['about', '/about/'],
  ['books', '/books/'],
  ['speaking', '/speaking/'],
  ['keynote', '/keynote/'],
  ['reviews', '/reviews/'],
  ['meeting-coordinators', '/meeting-coordinators/'],
  ['speaker-one-sheet', '/speaker-one-sheet/'],
  ['collaboration-opportunities', '/collaboration-opportunities/'],
  ['boasg', '/boasg/'],
  ['podcasts', '/podcasts/'],
  ['the-business-of-agriculture', '/the-business-of-agriculture/'],
  ['do-business-better-podcast', '/do-business-better-podcast/'],
  ['xtreme-ag', '/xtreme-ag/'],
  ['blog-news', '/blog-news/'],
  ['acres-tv', '/acres-tv/'],
  ['blog', '/blog/'],
  ['blog-eggflation', '/blog/eggflation-gives-producers-record-profits/'],
  ['blog-climate-crisis', '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/'],
  ['contact-us', '/contact-us/'],
  ['join-the-conversation', '/join-the-conversation/'],
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const browser = await chromium.launch();
const results = [];
const startedAt = new Date().toISOString();

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    deviceScaleFactor: 1,
    isMobile: width < 500,
    hasTouch: width < 500,
    // Reduced motion so a mid-flight transition never reports a false
    // contrast or overlap failure. It also matches how the site is authored.
    reducedMotion: 'reduce',
  });

  for (const [name, route] of ROUTES) {
    const page = await context.newPage();
    const url = BASE.replace(/\/$/, '') + route;
    let record = { name, route, url, width };

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.evaluate(() => document.fonts?.ready);
      // Walk the page so lazily mounted content is in the DOM when axe runs.
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let y = 0;
          const step = () => {
            window.scrollBy(0, window.innerHeight);
            y += window.innerHeight;
            if (y < document.body.scrollHeight + window.innerHeight) requestAnimationFrame(step);
            else { window.scrollTo(0, 0); resolve(); }
          };
          step();
        });
      });
      await page.waitForTimeout(400);

      const axe = await new AxeBuilder({ page }).withTags(TAGS).analyze();

      record.violations = axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        tags: v.tags.filter((t) => TAGS.includes(t) || t.startsWith('cat.')),
        nodes: v.nodes.map((n) => ({
          target: n.target,
          html: n.html.slice(0, 300),
          failureSummary: (n.failureSummary ?? '').slice(0, 400),
        })),
      }));
      record.passCount = axe.passes.length;
      record.incompleteCount = axe.incomplete.length;
      record.incomplete = axe.incomplete.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodeCount: v.nodes.length,
        targets: v.nodes.slice(0, 5).map((n) => n.target),
      }));

      // Structural facts axe reports only partially. Cheap to collect, and
      // they are the exact things the old site got wrong.
      record.structure = await page.evaluate(() => {
        const sel = (s) => [...document.querySelectorAll(s)];
        const label = (el) =>
          el.getAttribute('aria-label') ||
          (el.getAttribute('aria-labelledby')
            ? document.getElementById(el.getAttribute('aria-labelledby'))?.textContent?.trim()
            : null);
        return {
          mainCount: sel('main, [role="main"]').length,
          h1: sel('h1').map((h) => h.textContent.trim().slice(0, 80)),
          headingOrder: sel('h1,h2,h3,h4,h5,h6').map((h) => Number(h.tagName[1])),
          navLabels: sel('nav, [role="navigation"]').map(label),
          imagesMissingAlt: sel('img:not([alt])').map((i) => i.currentSrc || i.src),
          emptyAltImages: sel('img[alt=""]').length,
          totalImages: sel('img').length,
          landmarks: {
            banner: sel('header:not([role]), [role="banner"]').length,
            contentinfo: sel('footer:not([role]), [role="contentinfo"]').length,
            main: sel('main, [role="main"]').length,
          },
          unlabelledControls: sel('input, select, textarea')
            .filter((el) => {
              if (el.type === 'hidden') return false;
              if (el.getAttribute('aria-label')) return false;
              if (el.getAttribute('aria-labelledby')) return false;
              if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false;
              if (el.closest('label')) return false;
              if (el.title) return false;
              return true;
            })
            .map((el) => el.outerHTML.slice(0, 160)),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          skipLinkTarget: (() => {
            const a = document.querySelector('a[href^="#"]');
            if (!a) return null;
            const id = a.getAttribute('href').slice(1);
            return { href: a.getAttribute('href'), exists: !!document.getElementById(id) };
          })(),
        };
      });
    } catch (err) {
      record.error = err.message.slice(0, 300);
      record.violations = [];
    }

    // Headings must descend without skipping a level.
    if (record.structure) {
      const skips = [];
      let prev = 0;
      for (const lvl of record.structure.headingOrder) {
        if (prev && lvl > prev + 1) skips.push(`h${prev} -> h${lvl}`);
        prev = lvl;
      }
      record.headingSkips = skips;
    }

    results.push(record);

    const n = record.violations?.length ?? 0;
    const nodes = (record.violations ?? []).reduce((a, v) => a + v.nodes.length, 0);
    console.log(
      `${String(width).padStart(5)}  ${name.padEnd(36)} ` +
      (record.error ? `ERROR ${record.error}` : `${n} rule(s) / ${nodes} node(s)`) +
      (record.headingSkips?.length ? `  HEADING-SKIP:${record.headingSkips.join(',')}` : '') +
      (record.structure?.mainCount > 1 ? `  MAIN:${record.structure.mainCount}` : '') +
      (record.structure?.h1?.length !== 1 ? `  H1:${record.structure?.h1?.length}` : ''),
    );

    await page.close();
  }
  await context.close();
}

await browser.close();

// ---- aggregate --------------------------------------------------------------

const byImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };
const byRule = {};
let totalNodes = 0;

for (const r of results) {
  for (const v of r.violations ?? []) {
    const imp = v.impact ?? 'minor';
    byImpact[imp] = (byImpact[imp] ?? 0) + v.nodes.length;
    totalNodes += v.nodes.length;
    byRule[v.id] ??= { id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl, nodes: 0, routes: new Set() };
    byRule[v.id].nodes += v.nodes.length;
    byRule[v.id].routes.add(`${r.name}@${r.width}`);
  }
}

const ruleRows = Object.values(byRule)
  .map((r) => ({ ...r, routes: [...r.routes].sort() }))
  .sort((a, b) => b.nodes - a.nodes);

const summary = {
  generatedAt: startedAt,
  base: BASE,
  widths: WIDTHS,
  tags: TAGS,
  routeCount: ROUTES.length,
  runCount: results.length,
  totalViolationNodes: totalNodes,
  distinctRules: ruleRows.length,
  byImpact,
  byRule: ruleRows,
  structuralFlags: {
    routesWithoutExactlyOneH1: results
      .filter((r) => (r.structure?.h1?.length ?? 0) !== 1)
      .map((r) => `${r.name}@${r.width}:${r.structure?.h1?.length ?? 'n/a'}`),
    routesWithoutExactlyOneMain: results
      .filter((r) => (r.structure?.mainCount ?? 0) !== 1)
      .map((r) => `${r.name}@${r.width}:${r.structure?.mainCount ?? 'n/a'}`),
    routesWithHeadingSkips: results
      .filter((r) => r.headingSkips?.length)
      .map((r) => `${r.name}@${r.width}:${r.headingSkips.join(' ')}`),
    imagesMissingAlt: results.flatMap((r) => (r.structure?.imagesMissingAlt ?? []).map((s) => `${r.name}@${r.width}:${s}`)),
    unlabelledControls: results.flatMap((r) => (r.structure?.unlabelledControls ?? []).map((s) => `${r.name}@${r.width}:${s}`)),
    horizontalOverflow: results
      .filter((r) => r.structure && r.structure.scrollWidth > r.structure.clientWidth)
      .map((r) => `${r.name}@${r.width}:+${r.structure.scrollWidth - r.structure.clientWidth}px`),
    duplicateOrMissingNavLabels: results
      .filter((r) => {
        const labels = r.structure?.navLabels ?? [];
        return labels.some((l) => !l) || new Set(labels).size !== labels.length;
      })
      .map((r) => `${r.name}@${r.width}:${JSON.stringify(r.structure.navLabels)}`),
    errors: results.filter((r) => r.error).map((r) => `${r.name}@${r.width}: ${r.error}`),
  },
  results,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));

// ---- readable summary -------------------------------------------------------

const md = [];
md.push('# Accessibility report');
md.push('');
md.push(`Generated ${startedAt} against ${BASE}`);
md.push('');
md.push(`Tags: \`${TAGS.join('`, `')}\`. Best-practice rules excluded on purpose: the target is WCAG 2.1 AA, and folding opinions into the count hides the real number.`);
md.push('');
md.push(`**${ROUTES.length} routes x ${WIDTHS.length} widths = ${results.length} runs.**`);
md.push('');
md.push('## Violations by impact');
md.push('');
md.push('| Impact | Nodes |');
md.push('|---|---|');
for (const k of ['critical', 'serious', 'moderate', 'minor']) md.push(`| ${k} | ${byImpact[k] ?? 0} |`);
md.push(`| **total** | **${totalNodes}** |`);
md.push('');
md.push('## Violations by rule');
md.push('');
if (!ruleRows.length) {
  md.push('None. Zero axe violations across every route at every width.');
} else {
  md.push('| Rule | Impact | Nodes | Routes |');
  md.push('|---|---|---|---|');
  for (const r of ruleRows) md.push(`| \`${r.id}\` | ${r.impact} | ${r.nodes} | ${r.routes.join(', ')} |`);
}
md.push('');
md.push('## Structural checks (not axe)');
md.push('');
const f = summary.structuralFlags;
const row = (k, v) => md.push(`- **${k}:** ${v.length ? v.join('; ') : 'clean'}`);
row('routes not carrying exactly one h1', f.routesWithoutExactlyOneH1);
row('routes not carrying exactly one main', f.routesWithoutExactlyOneMain);
row('heading level skips', f.routesWithHeadingSkips);
row('images with no alt attribute at all', f.imagesMissingAlt);
row('form controls with no accessible name', f.unlabelledControls);
row('horizontal overflow', f.horizontalOverflow);
row('nav landmarks missing or sharing a label', f.duplicateOrMissingNavLabels);
row('page load errors', f.errors);
md.push('');
md.push('## Per-route detail');
md.push('');
for (const r of results) {
  const n = (r.violations ?? []).reduce((a, v) => a + v.nodes.length, 0);
  md.push(`### ${r.name} @ ${r.width}: ${n} node(s)`);
  if (r.error) md.push(`- ERROR: ${r.error}`);
  for (const v of r.violations ?? []) {
    md.push(`- \`${v.id}\` (${v.impact}), ${v.nodes.length} node(s): ${v.help}`);
    for (const node of v.nodes.slice(0, 4)) md.push(`  - \`${node.target.join(' ')}\``);
  }
  if (!(r.violations ?? []).length && !r.error) md.push('- clean');
  md.push('');
}

const mdOut = OUT.replace(/\.json$/, '-summary.md');
fs.writeFileSync(mdOut, md.join('\n'));

console.log('');
console.log(`Total violation nodes: ${totalNodes}  (critical ${byImpact.critical}, serious ${byImpact.serious}, moderate ${byImpact.moderate}, minor ${byImpact.minor})`);
console.log(`Distinct rules failing: ${ruleRows.length}`);
for (const r of ruleRows) console.log(`  ${r.id.padEnd(34)} ${String(r.nodes).padStart(4)} nodes  [${r.impact}]`);
console.log('');
console.log(`Wrote ${OUT}`);
console.log(`Wrote ${mdOut}`);

process.exit(totalNodes > 0 ? 1 : 0);

/**
 * Lighthouse audit runner.
 *
 * Audits the routes below against a PRODUCTION build (`next build && next start -p 3200`)
 * in both mobile and desktop form factors, then writes:
 *   docs/qa/lighthouse.json: full per-run category scores, Core Web Vitals, LCP element,
 *                              failing audits, and opportunities worth > 0.2s
 * and prints a readable summary table.
 *
 * Dev-server numbers are meaningless for performance. Always point BASE at a prod server.
 *
 * Usage: node scripts/lighthouse.mjs [--base http://localhost:3200] [--out docs/qa/lighthouse.json]
 *                                     [--routes /,/contact-us/]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const BASE = arg('base', 'http://localhost:3200');
const OUT = path.resolve(ROOT, arg('out', 'docs/qa/lighthouse.json'));

const DEFAULT_ROUTES = [
  '/',
  '/about/',
  '/books/',
  '/speaking/',
  '/keynote/',
  '/reviews/',
  '/meeting-coordinators/',
  '/speaker-one-sheet/',
  '/boasg/',
  '/podcasts/',
  '/the-business-of-agriculture/',
  '/do-business-better-podcast/',
  '/blog-news/',
  '/contact-us/',
  // These last two carry media the core conversion routes do not.
  // /collaboration-opportunities/ shares the innovation reel and /acres-tv/
  // is the heaviest of the remaining image routes.
  '/collaboration-opportunities/',
  '/acres-tv/',
];

const requestedRoutes = arg('routes', '')
  .split(',')
  .map((route) => route.trim())
  .filter(Boolean);
const ROUTES = requestedRoutes.length ? requestedRoutes : DEFAULT_ROUTES;

const TARGETS = {
  performance: 90,
  accessibility: 95,
  'best-practices': 95,
  seo: 100,
};

/** Lighthouse's own default throttling presets, stated explicitly so the run is reproducible. */
const FORM_FACTORS = {
  mobile: {
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 750,
    },
  },
  desktop: {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
};

/**
 * Pull the element Lighthouse blamed for LCP, plus the phase breakdown.
 *
 * Lighthouse 13 dropped `largest-contentful-paint-element` in favour of the
 * `lcp-breakdown-insight` audit, whose details list carries both a subpart
 * table and a `node` entry for the winning element.
 */
function lcpElement(lhr) {
  const items =
    lhr.audits['lcp-breakdown-insight']?.details?.items ??
    lhr.audits['largest-contentful-paint-element']?.details?.items ??
    [];

  let node = null;
  let subparts = null;

  for (const item of items) {
    if (item.type === 'node') {
      node = item;
    } else if (item.type === 'table' && item.items?.[0]?.subpart) {
      subparts = item.items.map((s) => ({ subpart: s.subpart, ms: Math.round(s.duration) }));
    } else if (item.items) {
      // LH12 shape: a table whose rows wrap a node.
      for (const row of item.items) {
        if (row.node) node = row.node;
      }
    }
  }

  return {
    selector: node?.selector ?? null,
    snippet: node?.snippet ?? null,
    label: node?.nodeLabel ?? null,
    isText: node ? !/^<(img|video|image|svg)\b/i.test(node.snippet ?? '') : null,
    subparts,
  };
}

/** Every audit that scored below 1 in a category, with the points it cost. */
function failing(lhr, categoryId) {
  const cat = lhr.categories[categoryId];
  if (!cat) return [];
  const totalWeight = cat.auditRefs.reduce((sum, r) => sum + (r.weight || 0), 0);
  return cat.auditRefs
    .map((ref) => ({ ref, audit: lhr.audits[ref.id] }))
    .filter(({ audit }) => audit && audit.score !== null && audit.score < 1)
    .map(({ ref, audit }) => ({
      id: ref.id,
      title: audit.title,
      score: audit.score,
      weight: ref.weight || 0,
      // Points lost out of 100 for this category.
      pointsLost:
        totalWeight > 0
          ? Number((((ref.weight || 0) * (1 - audit.score)) / totalWeight * 100).toFixed(1))
          : 0,
      displayValue: audit.displayValue ?? null,
    }))
    .sort((a, b) => b.pointsLost - a.pointsLost);
}

/**
 * Audits whose rows this runner cannot vouch for, and why. A row from one of
 * these carries `unverified` so nobody reads it as though it were a
 * render-blocking measurement.
 */
const UNVERIFIED = {
  'image-delivery-insight':
    'useResponsiveSize rows are DPR-blind under emulation. Confirm by blocking the file and re-running before resizing anything.',
};

/**
 * Anything with a savings estimate, from either shape.
 *
 * LH12 put savings on `details.overallSavingsMs` for `type: 'opportunity'`
 * audits. LH13 moved most of them to `*-insight` audits that express value as
 * `metricSavings: { LCP, FCP, ... }` in milliseconds and put the byte figure in
 * `details.debugData.wastedBytes` or in the row totals. Read both, so a run
 * never silently reports an empty opportunity list.
 *
 * ONE OF THESE AUDITS LIES, AND IT HAS ALREADY COST THIS BUILD ONE WRONG FIX.
 * `image-delivery-insight` compares a file's pixels against its CSS pixels and
 * ignores the emulated device pixel ratio, so under Lighthouse's own mobile
 * emulation its "larger than it needs to be" rows are wrong. Run /keynote/
 * mobile at deviceScaleFactor 1, 1.75 and 3 and the insight reports the
 * identical string all three times, for the same file with no srcset: "This
 * image file is larger than it needs to be (640x360) for its displayed
 * dimensions (370x208)." 370x208 is the CSS box. At the 1.75 DPR Lighthouse
 * emulates, the device box is 648x364 and 640x360 is the correct pick; at DPR 3
 * the file is UNDERSIZED and the insight still calls it oversized, and it flags
 * the wordmark at exactly the 4x error the DPR accounts for. The trace engine
 * says so itself, in
 * node_modules/@paulirish/trace_engine/models/trace/handlers/ImagePaintingHandler.js:
 * "Painting in Chrome never uses the emulated DPR ... the results may be very
 * misleading", and its correction only runs when metadata.hostDPR is present.
 *
 * A round-1 fix resized the demo-reel posters to 640x360 on this audit's
 * recommendation and recorded that the insight had cleared. It had not, and
 * following it again would mean shrinking those posters to 370x208 and the hero
 * portrait to 370x554, which is visibly soft on every retina phone. Confirm any
 * row from this audit by blocking the file and re-measuring before touching an
 * asset. That is how the real 373ms poster cost was established; the 150ms this
 * audit advertised for the same files was phantom.
 */
function opportunities(lhr, minMs = 200) {
  const out = [];
  for (const [id, audit] of Object.entries(lhr.audits)) {
    if (!audit || audit.score === 1 || audit.score === null) continue;

    const legacyMs = audit.details?.type === 'opportunity' ? audit.details.overallSavingsMs : null;
    const metricSavings = audit.metricSavings ?? {};
    const bestMetricMs = Math.max(0, ...Object.values(metricSavings).filter((v) => typeof v === 'number'));
    const savingsMs = Math.max(legacyMs ?? 0, bestMetricMs);

    const rows = audit.details?.items ?? [];
    const wastedBytes =
      audit.details?.overallSavingsBytes ??
      audit.details?.debugData?.wastedBytes ??
      (rows.length ? rows.reduce((s, r) => s + (r.wastedBytes ?? 0), 0) || null : null);
    const wastedMsFromRows = rows.length
      ? rows.reduce((s, r) => s + (r.wastedMs ?? 0), 0) || null
      : null;

    if (savingsMs >= minMs || (wastedBytes ?? 0) >= 50_000) {
      out.push({
        id,
        title: audit.title,
        savingsMs: Math.round(savingsMs),
        metricSavings,
        savingsBytes: wastedBytes,
        rowWastedMs: wastedMsFromRows ? Math.round(wastedMsFromRows) : null,
        displayValue: audit.displayValue ?? null,
        ...(UNVERIFIED[id] ? { unverified: UNVERIFIED[id] } : {}),
      });
    }
  }
  return out.sort((a, b) => b.savingsMs - a.savingsMs || (b.savingsBytes ?? 0) - (a.savingsBytes ?? 0));
}

/** Per-type transfer weight, so a regression in font or image budget is visible. */
function resourceBreakdown(lhr) {
  const items = lhr.audits['resource-summary']?.details?.items ?? [];
  return Object.fromEntries(
    items.map((i) => [i.resourceType, { requests: i.requestCount, bytes: i.transferSize }]),
  );
}

async function run(chrome, url, formFactor) {
  const cfg = FORM_FACTORS[formFactor];
  const result = await lighthouse(
    url,
    { port: chrome.port, output: 'json', logLevel: 'error' },
    {
      extends: 'lighthouse:default',
      settings: {
        formFactor: cfg.formFactor,
        screenEmulation: cfg.screenEmulation,
        throttling: cfg.throttling,
        throttlingMethod: 'simulate',
        emulatedUserAgent:
          cfg.formFactor === 'mobile'
            ? undefined
            : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
    },
  );
  const lhr = result.lhr;
  const num = (id) => lhr.audits[id]?.numericValue ?? null;
  return {
    scores: {
      performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
      'best-practices': Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
      seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    },
    metrics: {
      lcpMs: num('largest-contentful-paint'),
      fcpMs: num('first-contentful-paint'),
      cls: num('cumulative-layout-shift'),
      tbtMs: num('total-blocking-time'),
      siMs: num('speed-index'),
      ttiMs: num('interactive'),
    },
    lcpElement: lcpElement(lhr),
    totalByteWeight: lhr.audits['total-byte-weight']?.numericValue ?? null,
    resources: resourceBreakdown(lhr),
    failing: {
      performance: failing(lhr, 'performance'),
      accessibility: failing(lhr, 'accessibility'),
      'best-practices': failing(lhr, 'best-practices'),
      seo: failing(lhr, 'seo'),
    },
    opportunities: opportunities(lhr, 200),
  };
}

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});

const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  targets: TARGETS,
  lighthouseVersion: (await import('lighthouse/package.json', { with: { type: 'json' } })).default
    .version,
  runs: {},
};

/**
 * Lighthouse's simulated throttling is noisy: a single mobile run of this site
 * moved LCP by ~0.8s between passes, which is enough to flip a 90 verdict.
 * Run each route N times and keep the median-performance run.
 */
const RUNS = Number(arg('runs', '3'));

function median(results) {
  const sorted = [...results].sort((a, b) => a.scores.performance - b.scores.performance);
  return sorted[Math.floor(sorted.length / 2)];
}

try {
  for (const route of ROUTES) {
    report.runs[route] = {};
    for (const ff of ['mobile', 'desktop']) {
      const passes = [];
      for (let i = 0; i < RUNS; i++) {
        process.stderr.write(`  auditing ${ff.padEnd(7)} ${route} (${i + 1}/${RUNS})\n`);
        passes.push(await run(chrome, BASE + route, ff));
      }
      const chosen = median(passes);
      chosen.allPerfScores = passes.map((p) => p.scores.performance);
      chosen.allLcpMs = passes.map((p) => Math.round(p.metrics.lcpMs));
      report.runs[route][ff] = chosen;
    }
  }
} finally {
  await chrome.kill();
}

// ---- summary table ----
const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);

/** Rendered once and stored on the report, so the artifact and stdout can never disagree. */
function renderSummary(rep) {
  const out = [];
  for (const ff of ['mobile', 'desktop']) {
    out.push(`\n=== ${ff.toUpperCase()} (targets: Perf>=90 A11y>=95 BP>=95 SEO=100) ===`);
    out.push(
      `${pad('route', 32)}${lpad('Perf', 6)}${lpad('A11y', 6)}${lpad('BP', 6)}${lpad('SEO', 6)}` +
        `${lpad('LCP s', 8)}${lpad('CLS', 8)}${lpad('TBT ms', 8)}${lpad('KB', 7)}  perf runs`,
    );
    out.push('-'.repeat(100));
    for (const route of ROUTES) {
      const r = rep.runs[route][ff];
      const mark = (v, t) => `${v}${v < t ? '*' : ' '}`;
      out.push(
        pad(route, 32) +
          lpad(mark(r.scores.performance, 90), 6) +
          lpad(mark(r.scores.accessibility, 95), 6) +
          lpad(mark(r.scores['best-practices'], 95), 6) +
          lpad(mark(r.scores.seo, 100), 6) +
          lpad((r.metrics.lcpMs / 1000).toFixed(2), 8) +
          lpad(r.metrics.cls.toFixed(3), 8) +
          lpad(Math.round(r.metrics.tbtMs), 8) +
          lpad(Math.round((r.totalByteWeight ?? 0) / 1024), 7) +
          '  ' +
          (r.allPerfScores ?? []).join('/'),
      );
    }
    out.push('(* = below target)');

    out.push(`\n  LCP element (${ff}):`);
    for (const route of ROUTES) {
      const e = rep.runs[route][ff].lcpElement;
      out.push(`    ${pad(route, 32)} ${e.isText ? 'TEXT' : 'IMG '}  ${e.selector ?? '?'}`);
    }

    out.push(`\n  Opportunities >= 0.2s or >= 50KB (${ff}):`);
    let sawUnverified = false;
    for (const route of ROUTES) {
      const os = rep.runs[route][ff].opportunities;
      out.push(
        `    ${pad(route, 32)} ` +
          (os.length
            ? os
                .map((o) => {
                  if (o.unverified) sawUnverified = true;
                  return (
                    `${o.id} ${o.savingsMs}ms/${Math.round((o.savingsBytes ?? 0) / 1024)}KB` +
                    (o.unverified ? ' (unverified)' : '')
                  );
                })
                .join('  |  ')
            : 'none'),
      );
    }
    // An unverified row is a lead, not a measurement. See the note on
    // opportunities().
    if (sawUnverified) {
      for (const [id, why] of Object.entries(UNVERIFIED)) {
        out.push(`    (unverified) ${id}: ${why}`);
      }
    }
  }
  return out.join('\n');
}

report.summaryTable = renderSummary(report);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

console.log(report.summaryTable);
console.log(`\nFull report: ${OUT}`);

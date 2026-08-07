/**
 * CONTRAST TABLE GENERATOR
 *
 * docs/DESIGN_SYSTEM.md section 4 asserts "no pair ships that is not in this
 * table". It was 76 pairs computed by hand. A hand table is fine until the
 * palette moves, and then it is 76 opportunities to write down a number that
 * is not what the browser will render.
 *
 * This reads src/styles/tokens.css, resolves the var() indirection separately
 * inside every data-surface scope, computes WCAG 2.x contrast for every pair
 * the file declares an intent for, writes the markdown back into
 * DESIGN_SYSTEM.md between two markers, and exits non-zero if any pair is
 * below the floor it claims.
 *
 * WHY ANNOTATIONS RATHER THAN A SEPARATE MANIFEST. A manifest is a second file
 * that can silently disagree with the first. An annotation sits on the
 * declaration it describes, so a token cannot be renamed or repointed without
 * the person doing it seeing the floor it has to clear. It is the same reason
 * every ratio in this codebase is written in a comment next to its value.
 *
 *   --ink-muted: var(--palette-bone-800);   / * @on page,raised,bright,sunken >=4.5 * /
 *
 * GRAMMAR, deliberately tiny:
 *
 *   @on <grounds> >=<ratio>   grounds are the suffixes of --surface-*, resolved
 *                             IN THE SAME SCOPE. One annotation therefore
 *                             produces the light-scope pair from :root and the
 *                             dark-scope pair from inside [data-surface="deep"],
 *                             with no duplication. Repeatable.
 *   @allow-fail [ground] "reason"
 *                             a pair that ships below its floor on purpose. It
 *                             prints with its real number and a verdict, and it
 *                             does not fail the build. A missing reason IS a
 *                             failure: an undocumented exception is how a real
 *                             defect gets waved through.
 *   @skip "reason"            a value that cannot be measured (color-mix against
 *                             transparent, currentColor). Anything annotated
 *                             @on that will not resolve and has no @skip is a
 *                             hard failure. That is the property that stops this
 *                             tool drifting quietly out of date.
 *
 * Usage:
 *   node scripts/contrast-table.mjs            print the table, exit 0/1
 *   node scripts/contrast-table.mjs --write    splice it into DESIGN_SYSTEM.md
 *   node scripts/contrast-table.mjs --json     machine output
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = join(ROOT, 'src/styles/tokens.css');
const DOC = join(ROOT, 'docs/DESIGN_SYSTEM.md');
const BEGIN = '<!-- CONTRAST:BEGIN -->';
const END = '<!-- CONTRAST:END -->';

/* ---------------------------------------------------------------------------
   Pairs that are not "a token against a ground in its scope". A button's ink
   sits on the button's own field, not on the page, so no @on annotation can
   express it. Evaluated once per scope; a scope where either side does not
   resolve simply does not produce a row.
   --------------------------------------------------------------------------- */
const PAIRS = [
  { fg: '--action-primary-ink', bg: '--action-primary-bg', min: 4.5, label: 'primary button' },
  { fg: '--action-primary-ink', bg: '--action-primary-bg-hover', min: 4.5, label: 'primary hover' },
  { fg: '--action-primary-ink', bg: '--action-primary-bg-active', min: 4.5, label: 'primary active' },
  { fg: '--action-secondary-ink', bg: '--action-secondary-bg-hover', min: 4.5, label: 'secondary hover' },
  { fg: '--selection-ink', bg: '--selection-bg', min: 4.5, label: 'selection' },
  { fg: '--status-success-ink', bg: '--status-success-bg', min: 4.5, label: 'status success' },
  { fg: '--status-warning-ink', bg: '--status-warning-bg', min: 4.5, label: 'status warning' },
  { fg: '--status-danger-ink', bg: '--status-danger-bg', min: 4.5, label: 'status danger' },
  { fg: '--status-info-ink', bg: '--status-info-bg', min: 4.5, label: 'status info' },
  { fg: '--field-ink', bg: '--field-bg', min: 4.5, label: 'field text' },
  { fg: '--field-placeholder-ink', bg: '--field-bg', min: 4.5, label: 'field placeholder' },
  { fg: '--field-rule', bg: '--field-bg', min: 3, label: 'field rule' },
  { fg: '--field-rule-focus', bg: '--field-bg', min: 3, label: 'field rule, focused' },
  { fg: '--field-error-ink', bg: '--field-error-bg', min: 4.5, label: 'field error' },
  // SC 1.4.3 exempts a disabled control, so the floor is 0. It is still
  // reported, because "exempt" is a decision and a number nobody looks at is
  // how a disabled control ends up invisible rather than merely quiet.
  { fg: '--state-disabled-ink', bg: '--state-disabled-bg', min: 0, label: 'disabled, exempt SC 1.4.3' },
];

/* Ground key -> the surface token it names. `page` is the scope's own ground. */
const GROUNDS = {
  page: '--surface-page',
  raised: '--surface-raised',
  bright: '--surface-bright',
  sunken: '--surface-sunken',
  plate: '--surface-plate',
  deep: '--surface-deep',
  'deep-alt': '--surface-deep-alt',
  'deep-raised': '--surface-deep-raised',
};

/* ---------------------------------------------------------------------------
   Parsing. tokens.css is a flat set of top-level blocks, so this does not need
   PostCSS, but it does need to get three things right that a naive parser gets
   wrong. They are called out where they happen.
   --------------------------------------------------------------------------- */

function parse(css) {
  const blocks = [];
  let i = 0;

  while (i < css.length) {
    // TRAP 1: @media wraps a nested :root. Its declarations are durations, not
    // colour, but a parser that does not skip the whole at-rule mis-counts
    // braces from here to the end of the file.
    if (css.startsWith('@media', i)) {
      const open = css.indexOf('{', i);
      let depth = 0;
      let j = open;
      for (; j < css.length; j++) {
        if (css[j] === '{') depth++;
        else if (css[j] === '}' && --depth === 0) break;
      }
      i = j + 1;
      continue;
    }

    const open = css.indexOf('{', i);
    if (open === -1) break;
    const close = css.indexOf('}', open);
    if (close === -1) break;

    const prelude = css.slice(i, open);
    // A block's selector is whatever follows the previous block, minus comments.
    const selectors = prelude
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    blocks.push({ selectors, body: css.slice(open + 1, close) });
    i = close + 1;
  }

  return blocks;
}

const ANNOT = {
  on: /@on\s+([a-z0-9,\-]+)\s*>=\s*([\d.]+)/gi,
  allowFail: /@allow-fail(?:\s+([a-z0-9\-]+))?\s+"([^"]+)"/gi,
  skip: /@skip\s+"([^"]+)"/i,
};

function declarations(body) {
  const out = [];
  // Match a custom property and the comment trailing it. The comment is where
  // the intent lives, so it is captured rather than stripped.
  //
  // The trailing group must span newlines: the longest annotations in this file
  // are five lines of prose inside one /* */, and capturing only to end-of-line
  // silently drops every @allow-fail that does not fit on the first line. That
  // is a failure mode worth naming, because it does not error, it just quietly
  // reports a documented exception as a hard failure.
  //
  // [ \t]* rather than \s* so the comment must start on the declaration's own
  // line, and a token with no comment cannot adopt the next line's.
  const re = /(--[\w-]+)\s*:\s*([^;]+);[ \t]*(\/\*[\s\S]*?\*\/)?/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const [, name, rawValue, trailing] = m;
    out.push({ name, value: rawValue.trim(), comment: trailing ?? '' });
  }
  return out;
}

function intents(comment) {
  if (!comment) return { on: [], allowFail: [], skip: null };
  const on = [];
  const allowFail = [];
  let m;

  ANNOT.on.lastIndex = 0;
  while ((m = ANNOT.on.exec(comment)) !== null) {
    on.push({ grounds: m[1].split(',').filter(Boolean), min: Number(m[2]) });
  }

  ANNOT.allowFail.lastIndex = 0;
  while ((m = ANNOT.allowFail.exec(comment)) !== null) {
    // A reason usually wraps across several comment lines. Collapse it, or the
    // emitted markdown carries the source file's indentation into a table cell
    // and breaks the row.
    allowFail.push({ ground: m[1] || null, reason: m[2].replace(/\s+/g, ' ').trim() });
  }

  const skip = ANNOT.skip.exec(comment);
  return { on, allowFail, skip: skip ? skip[1] : null };
}

/* ---------------------------------------------------------------------------
   Scope assembly. A scope's map is root overlaid with its own declarations, in
   source order.

   TRAP 2: `[data-surface="deep"], [data-surface="deepest"]` is one block that
   applies to BOTH scopes, and a later block refines `deepest` alone. Keying a
   block by its first selector builds a `deepest` scope with no ink tokens at
   all and then reports navy on navy. Every selector in the list gets the block.
   --------------------------------------------------------------------------- */

function buildScopes(blocks) {
  const root = new Map();
  const own = new Map(); // scope -> Map

  for (const block of blocks) {
    const decls = declarations(block.body);
    for (const sel of block.selectors) {
      if (sel === ':root') {
        for (const d of decls) root.set(d.name, d);
        continue;
      }
      const m = /^\[data-surface="([^"]+)"\]$/.exec(sel);
      if (!m) continue;
      const scope = m[1];
      if (!own.has(scope)) own.set(scope, new Map());
      const map = own.get(scope);
      for (const d of decls) map.set(d.name, d);
    }
  }

  const scopes = new Map();
  scopes.set('root', root);
  for (const [name, map] of own) {
    const merged = new Map(root);
    for (const [k, v] of map) {
      // INTENT INHERITS, VALUES DO NOT. A scope redeclares --ink-muted with its
      // own value and its own measured-ratio comment; it does not restate that
      // the token has to clear 4.5:1 on four grounds, because that is a property
      // of the token's JOB and the job is the same in every scope.
      //
      // So one @on annotation on the :root declaration produces the light-scope
      // pair here and the dark-scope pair inside [data-surface="deep"], with no
      // duplication and no way for the two to drift apart. A scope that wants a
      // different floor states its own @on and overrides this.
      const rootDecl = root.get(k);
      const ownIntent = intents(v.comment);
      const inherits = !ownIntent.on.length && !ownIntent.skip && !ownIntent.allowFail.length;
      merged.set(k, inherits && rootDecl ? { ...v, comment: `${v.comment ?? ''} ${rootDecl.comment ?? ''}` } : v);
    }
    scopes.set(name, merged);
  }
  return scopes;
}

/* TRAP 3: --border-color points at --rule-structural points at a palette step.
   Resolve recursively, per scope, and throw on a cycle rather than recursing
   into the stack limit. */
function resolve(map, name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`var() cycle at ${name}`);
  seen.add(name);
  const decl = map.get(name);
  if (!decl) return null;
  let v = decl.value.trim();

  const varMatch = /^var\(\s*(--[\w-]+)\s*(?:,[\s\S]*)?\)$/.exec(v);
  if (varMatch) return resolve(map, varMatch[1], seen);

  return v;
}

/* ---------------------------------------------------------------------------
   WCAG 2.x relative luminance and contrast.
   --------------------------------------------------------------------------- */

function toRgb(value) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (!hex) return null;
  let h = hex[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminance([r, g, b]) {
  const lin = [r, g, b]
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/* Match the existing table's rounding so the regenerated numbers can be diffed
   against the hand-written ones during the acceptance run. */
const round2 = (n) => Math.round(n * 100) / 100;

function verdict(ratio, min) {
  if (min === 0) return 'exempt';
  if (min <= 3) return ratio >= 3 ? '3:1 pass' : 'FAIL';
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'FAIL';
}

/* --------------------------------------------------------------------------- */

function run() {
  const css = readFileSync(TOKENS, 'utf8');
  const blocks = parse(css);
  const scopes = buildScopes(blocks);

  const rows = [];
  const failures = [];
  const allowed = [];

  // Iterate scopes in a stable, documented order so the emitted table is
  // deterministic and reviewable as a diff.
  const ORDER = ['root', 'sunken', 'paper', 'deep', 'deepest', 'forest'];
  const scopeNames = [
    ...ORDER.filter((s) => scopes.has(s)),
    ...[...scopes.keys()].filter((s) => !ORDER.includes(s)),
  ];

  for (const scopeName of scopeNames) {
    const map = scopes.get(scopeName);

    for (const [name, decl] of map) {
      const intent = intents(decl.comment);
      if (!intent.on.length) continue;
      if (intent.skip) continue;

      const fgValue = resolve(map, name);
      const fg = toRgb(fgValue);

      for (const { grounds, min } of intent.on) {
        for (const groundKey of grounds) {
          const groundToken = GROUNDS[groundKey];
          if (!groundToken) {
            failures.push({
              scope: scopeName,
              token: name,
              reason: `@on names an unknown ground "${groundKey}"`,
            });
            continue;
          }
          const bgValue = resolve(map, groundToken);
          const bg = toRgb(bgValue);

          if (!fg || !bg) {
            // An annotated token that will not resolve is a hard failure. This
            // is the check that stops the tool going quietly stale.
            failures.push({
              scope: scopeName,
              token: name,
              reason: `unresolvable (${name}=${fgValue ?? 'none'}, ${groundToken}=${bgValue ?? 'none'}) and no @skip`,
            });
            continue;
          }

          const ratio = round2(contrast(fg, bg));
          const waiver = intent.allowFail.find((a) => a.ground === null || a.ground === groundKey);
          const pass = ratio >= min;

          const row = {
            scope: scopeName,
            token: name,
            value: fgValue,
            ground: groundKey,
            groundValue: bgValue,
            ratio,
            min,
            verdict: pass ? verdict(ratio, min) : waiver ? 'documented exception' : 'FAIL',
            waived: Boolean(waiver && !pass),
            reason: waiver?.reason ?? null,
          };
          rows.push(row);

          if (!pass) {
            if (waiver) allowed.push(row);
            else failures.push({ scope: scopeName, token: name, reason: `${ratio}:1 against ${groundKey}, needs ${min}` });
          }
        }
      }
    }

    for (const pair of PAIRS) {
      const fgValue = resolve(map, pair.fg);
      const bgValue = resolve(map, pair.bg);
      const fg = toRgb(fgValue);
      const bg = toRgb(bgValue);
      if (!fg || !bg) continue; // a scope that does not define both simply has no such control

      const ratio = round2(contrast(fg, bg));
      const pass = pair.min === 0 || ratio >= pair.min;
      rows.push({
        scope: scopeName,
        token: pair.fg,
        value: fgValue,
        ground: pair.label,
        groundValue: bgValue,
        ratio,
        min: pair.min,
        verdict: pass ? verdict(ratio, pair.min) : 'FAIL',
        waived: false,
        reason: null,
      });
      if (!pass) {
        failures.push({ scope: scopeName, token: pair.fg, reason: `${ratio}:1 on ${pair.bg}, needs ${pair.min}` });
      }
    }
  }

  // app/opengraph-image.tsx is the only file in the runtime carrying raw hex,
  // because next/og renders through Satori and Satori resolves neither CSS
  // custom properties nor Tailwind. Its header says the values "MUST be kept in
  // sync with tokens.css by hand", and until now nothing checked that they were.
  // A social card quietly rendering last season's palette is exactly the kind of
  // drift nobody notices, because nobody looks at the OG image after shipping it.
  //
  // Each entry there carries a JSDoc naming the token it mirrors. Parse that
  // claim and hold it to it.
  const ogPath = join(ROOT, 'app/opengraph-image.tsx');
  try {
    const og = readFileSync(ogPath, 'utf8');
    const root = scopes.get('root');
    const re = /\/\*\*[^*]*?(--[\w-]+)[^*]*?\*\/\s*\n\s*(\w+):\s*'(#[0-9a-fA-F]{3,6})'/g;
    let m;
    while ((m = re.exec(og)) !== null) {
      const [, token, key, hex] = m;
      const expected = resolve(root, token);
      if (!expected) continue; // the JSDoc names something that is not a token, e.g. --brand-orange alias
      if (expected.toLowerCase() !== hex.toLowerCase()) {
        failures.push({
          scope: 'opengraph-image.tsx',
          token: `${key} (claims ${token})`,
          reason: `is ${hex}, but ${token} resolves to ${expected}`,
        });
      }
    }
  } catch {
    // The file is optional as far as this tool is concerned.
  }

  // An @allow-fail with no reason is itself a failure, wherever it appears.
  for (const [scopeName, map] of scopes) {
    for (const [name, decl] of map) {
      if (/@allow-fail/.test(decl.comment ?? '') && !intents(decl.comment).allowFail.length) {
        failures.push({ scope: scopeName, token: name, reason: '@allow-fail without a quoted reason' });
      }
    }
  }

  return { rows, failures, allowed, scopes };
}

function markdown({ rows, allowed }) {
  const byScope = new Map();
  for (const r of rows) {
    if (!byScope.has(r.scope)) byScope.set(r.scope, []);
    byScope.get(r.scope).push(r);
  }

  const TITLES = {
    root: 'Default scope (the page ground)',
    sunken: 'Sunken scope (the alternating band)',
    paper: 'Paper scope (a light plate inside a dark section)',
    deep: 'Deep scope (the navy band)',
    deepest: 'Deepest scope (the footer plane)',
    forest: 'Forest scope (the green band)',
  };

  const out = [];
  out.push('');
  out.push('_This section is generated by `node scripts/contrast-table.mjs --write`. Do not hand-edit it._');
  out.push('');
  out.push('Every pair below was computed with the WCAG 2.x relative-luminance formula against the');
  out.push('resolved token values, per scope. Thresholds: **4.5:1** for text under 24px, **3:1** for');
  out.push('large text, UI component boundaries and meaningful graphics (SC 1.4.11), and no floor for');
  out.push('pure decoration or a disabled control.');
  out.push('');

  let n = 0;
  for (const [scope, list] of byScope) {
    out.push(`### ${TITLES[scope] ?? scope}`);
    out.push('');
    out.push('| Token | Value | Against | Ratio | Verdict |');
    out.push('|---|---|---|---|---|');
    for (const r of list) {
      n++;
      const flag = r.waived ? ` (${r.reason})` : '';
      out.push(`| \`${r.token}\` | \`${r.value}\` | ${r.ground} \`${r.groundValue}\` | **${r.ratio.toFixed(2)}** | ${r.verdict}${flag} |`);
    }
    out.push('');
  }

  out.push(`**Total pairs checked: ${n}.**`);
  out.push('');
  if (allowed.length) {
    out.push(`${allowed.length} pair(s) ship below floor on purpose, each named and restricted rather than fixed:`);
    out.push('');
    for (const r of allowed) {
      out.push(`- \`${r.token}\` on ${r.ground} at ${r.ratio.toFixed(2)}:1. ${r.reason}`);
    }
    out.push('');
  }
  return out.join('\n');
}

const args = process.argv.slice(2);
const result = run();

if (args.includes('--json')) {
  console.log(JSON.stringify(result, (k, v) => (v instanceof Map ? undefined : v), 2));
} else if (args.includes('--write')) {
  const doc = readFileSync(DOC, 'utf8');
  const a = doc.indexOf(BEGIN);
  const b = doc.indexOf(END);
  if (a === -1 || b === -1) {
    console.error(`Markers not found in ${DOC}. Add ${BEGIN} and ${END} around section 4.`);
    process.exit(1);
  }
  const next = doc.slice(0, a + BEGIN.length) + '\n' + markdown(result) + '\n' + doc.slice(b);
  writeFileSync(DOC, next);
  console.log(`Wrote ${result.rows.length} pairs into ${DOC}`);
} else {
  console.log(markdown(result));
}

if (result.failures.length) {
  console.error('\nCONTRAST FAILURES');
  for (const f of result.failures) console.error(`  [${f.scope}] ${f.token}: ${f.reason}`);
  process.exit(1);
}
console.error(`\nOK. ${result.rows.length} pairs, ${result.allowed.length} documented exception(s).`);

/**
 * A production build that cannot fight a running dev server. `npm run build:qa`.
 *
 * WHY THIS EXISTS. Turbopack keeps a persistent cache under the output
 * directory, and a build and a dev server may not share one. Run `next build`
 * while `next dev -p 3100` is writing the same `.next`, which is exactly what a
 * QA pass does, and the build dies before it compiles anything:
 *
 *   Build error occurred
 *   [Error: Failed to open database
 *   Caused by: 0: Loading persistence directory failed
 *              1: invalid digit found in string]
 *
 * The only cure at that point is deleting `.next`, which takes the dev server
 * down with it. This script builds into `.next-qa` instead, so the dev server
 * keeps serving and the QA build gets a cold cache every time. `.gitignore`
 * already carries `/.next-*\/` for this.
 *
 * `next start` against the result:  NEXT_DIST_DIR=.next-qa npx next start -p 3200
 *
 * THE TSCONFIG DANCE, and it is not optional. `next build` writes generated
 * route types into whatever distDir it was handed and then appends that path to
 * the `include` list in tsconfig.json. It does this whether or not its own type
 * check is enabled, and there is no flag that stops it. Left alone, tsconfig.json
 * ends up listing the same generated types twice, once under `.next` and once
 * under `.next-qa`, and every later `npx tsc --noEmit` fails on duplicate
 * LayoutProps. So: type check first with the real tsconfig, build second, and
 * put tsconfig.json back byte for byte afterwards, including when the build
 * fails. Nothing is checked less than a stock `next build` checks.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.NEXT_DIST_DIR || '.next-qa';
const TSCONFIG = path.join(ROOT, 'tsconfig.json');

const run = (cmd, args, env) =>
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } });

if (DIST === '.next') {
  console.error('build:qa refuses to write .next. That is the dev server’s directory.');
  process.exit(1);
}

console.log(`\n== tsc --noEmit`);
run('npx', ['tsc', '--noEmit']);

console.log(`\n== next build into ${DIST}`);
fs.rmSync(path.join(ROOT, DIST), { recursive: true, force: true });

const before = fs.readFileSync(TSCONFIG);
let failed = null;
try {
  run('npx', ['next', 'build'], { NEXT_DIST_DIR: DIST });
} catch (error) {
  failed = error;
} finally {
  const after = fs.readFileSync(TSCONFIG);
  if (!after.equals(before)) {
    fs.writeFileSync(TSCONFIG, before);
    console.log(`\n   restored tsconfig.json, which next build had rewritten for ${DIST}`);
  }
}

if (failed) process.exit(failed.status ?? 1);
console.log(`\nDONE. Serve it with: NEXT_DIST_DIR=${DIST} npx next start -p 3200`);

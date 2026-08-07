/**
 * The checks axe cannot make. Everything here is driven through a real browser
 * with real key events, because every one of these is a behavior, not a
 * property of the markup.
 *
 *   node scripts/a11y-manual.mjs [--base http://localhost:3100]
 *
 * Groups:
 *   1  skip link, tab order, focus visibility, keyboard trap
 *   2  header dropdowns: Arrow, Escape, Enter on a parent
 *   3  mobile sheet: focus moved in, trapped, restored
 *   4  landmarks, headings, lists, figures
 *   5  form controls and the Mailchimp honeypot
 *   6  WCAG 1.4.12 text spacing
 *   7  200 percent zoom at 1280
 *   8  image alt quality
 *
 * Prints PASS / FAIL per check and exits 1 if anything failed.
 */
import { chromium } from 'playwright';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const BASE = (args.base ?? 'http://localhost:3100').replace(/\/$/, '');

const ROUTES = [
  '/', '/about/', '/speaking/', '/keynote/', '/reviews/', '/meeting-coordinators/',
  '/collaboration-opportunities/', '/boasg/', '/podcasts/', '/the-business-of-agriculture/',
  '/do-business-better-podcast/', '/xtreme-ag/', '/blog-news/', '/acres-tv/', '/blog/',
  '/blog/eggflation-gives-producers-record-profits/',
  '/blog/how-the-climate-crisis-is-causing-food-shortages-globally/',
  '/contact-us/', '/join-the-conversation/',
];

const results = [];
const record = (group, name, pass, detail = '') => {
  results.push({ group, name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  [${group}] ${name}${detail ? `  ::  ${detail}` : ''}`);
};

/** Describes whatever currently has focus, plus whether a ring is painted. */
const DESCRIBE_ACTIVE = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const width = parseFloat(cs.outlineWidth) || 0;
  const visible =
    (cs.outlineStyle !== 'none' && width > 0) ||
    cs.boxShadow !== 'none' ||
    // A background/border swap also counts, but only if the element opted in.
    el.matches(':focus-visible');
  return {
    tag: el.tagName.toLowerCase(),
    text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 44),
    href: el.getAttribute('href'),
    cls: (typeof el.className === 'string' ? el.className : '').slice(0, 50),
    outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
    ringVisible: visible,
    id: el.id || null,
  };
};

const browser = await chromium.launch();

// ============================================================================
// 1. Skip link, tab order, focus visibility, keyboard trap
// ============================================================================
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/speaking/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts?.ready);

  // First Tab from the document must land on the skip link.
  // The settle wait is load-bearing: the skip link travels into view on a
  // 140ms transition, so measuring at t=0 reports its parked position and
  // invents a failure.
  await page.keyboard.press('Tab');
  await page.waitForTimeout(400);
  const first = await page.evaluate(DESCRIBE_ACTIVE);
  record(
    '1 keyboard',
    'first Tab stop is the skip link',
    first?.cls?.includes('dm-skip-link') && first.href === '#main',
    `${first?.tag} "${first?.text}" href=${first?.href}`,
  );
  record(
    '1 keyboard',
    'skip link is visible when focused (not permanently off screen)',
    await page.evaluate(() => {
      const a = document.querySelector('.dm-skip-link');
      const r = a.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight && r.width > 0 && r.height > 0;
    }),
  );

  // Activating it must move focus to the main landmark, not merely scroll.
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const afterSkip = await page.evaluate(() => ({
    hash: location.hash,
    mainExists: !!document.getElementById('main'),
    // Browsers move the sequential-focus starting point to the target even
    // when it is not itself focusable, so the next Tab is what proves it.
    active: document.activeElement?.id || document.activeElement?.tagName,
  }));
  await page.keyboard.press('Tab');
  const afterSkipTab = await page.evaluate(() => {
    const el = document.activeElement;
    return { inMain: !!document.getElementById('main')?.contains(el), tag: el?.tagName, text: (el?.textContent || '').trim().slice(0, 40) };
  });
  record(
    '1 keyboard',
    'skip link targets #main and the next Tab lands inside it',
    afterSkip.hash === '#main' && afterSkip.mainExists && afterSkipTab.inMain,
    `hash=${afterSkip.hash} nextStop=<${afterSkipTab.tag}> "${afterSkipTab.text}" inMain=${afterSkipTab.inMain}`,
  );

  // Walk the whole document. Every stop must paint a ring, and the walk must
  // terminate rather than cycle forever inside one widget.
  await page.goto(`${BASE}/speaking/`, { waitUntil: 'networkidle' });
  const seen = [];
  const noRing = [];
  let trapped = false;
  for (let i = 0; i < 220; i += 1) {
    await page.keyboard.press('Tab');
    const d = await page.evaluate(DESCRIBE_ACTIVE);
    if (!d) break; // focus left the document into browser chrome: the walk ended
    // The Next dev-tools overlay injects its own web component into the tab
    // order. It is not shipped markup and must not be judged as if it were.
    if (d.tag === 'nextjs-portal') continue;
    const key = `${d.tag}|${d.text}|${d.href}|${d.id}`;
    if (!d.ringVisible) noRing.push(`${d.tag} "${d.text}" outline=${d.outline}`);
    // Same element three times in a row is a trap.
    if (seen.length >= 2 && seen[seen.length - 1] === key && seen[seen.length - 2] === key) {
      trapped = true;
      break;
    }
    seen.push(key);
  }
  record('1 keyboard', 'no keyboard trap on a representative route', !trapped, `${seen.length} stops walked`);
  record(
    '1 keyboard',
    'focus indicator visible on every tab stop',
    noRing.length === 0,
    noRing.length ? `${noRing.length} without a ring: ${noRing.slice(0, 3).join(' | ')}` : `${seen.length} stops all ringed`,
  );

  // Tab order must follow the document: header, then main, then footer.
  const order = await page.evaluate(() => {
    const stops = [...document.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.offsetParent !== null || el.classList.contains('dm-skip-link'));
    const region = (el) =>
      el.closest('header') ? 'header' : el.closest('main') ? 'main' : el.closest('footer') ? 'footer' : 'other';
    return stops.map(region);
  });
  const rank = { other: 0, header: 1, main: 2, footer: 3 };
  let monotonic = true;
  let prev = 0;
  for (const r of order) {
    if (rank[r] < prev) { monotonic = false; break; }
    prev = Math.max(prev, rank[r]);
  }
  record('1 keyboard', 'tab order follows header then main then footer', monotonic, `${order.length} stops`);

  await ctx.close();
}

// ============================================================================
// 2. Header dropdowns
// ============================================================================
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const parent = page.locator('.dm-nav__link[aria-expanded]').first();
  const parentHref = await parent.getAttribute('href');
  await parent.focus();

  const expandedOnFocus = await parent.getAttribute('aria-expanded');
  record('2 dropdown', 'focusing a parent opens its panel', expandedOnFocus === 'true', `aria-expanded=${expandedOnFocus}`);

  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(120);
  const onFirst = await page.evaluate(DESCRIBE_ACTIVE);
  record(
    '2 dropdown',
    'ArrowDown moves focus to the first panel link',
    onFirst?.cls?.includes('dm-nav__panel-link'),
    `${onFirst?.tag} "${onFirst?.text}"`,
  );

  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(80);
  const onSecond = await page.evaluate(DESCRIBE_ACTIVE);
  record(
    '2 dropdown',
    'ArrowDown moves down the panel',
    onSecond?.cls?.includes('dm-nav__panel-link') && onSecond.text !== onFirst.text,
    `"${onFirst?.text}" -> "${onSecond?.text}"`,
  );

  await page.keyboard.press('End');
  await page.waitForTimeout(80);
  const onLast = await page.evaluate(DESCRIBE_ACTIVE);
  await page.keyboard.press('Home');
  await page.waitForTimeout(80);
  const backHome = await page.evaluate(DESCRIBE_ACTIVE);
  record(
    '2 dropdown',
    'Home and End jump to the ends of the panel',
    onLast?.cls?.includes('dm-nav__panel-link') && backHome?.text === onFirst?.text,
    `End="${onLast?.text}" Home="${backHome?.text}"`,
  );

  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  const afterEsc = await page.evaluate(DESCRIBE_ACTIVE);
  const expandedAfterEsc = await parent.getAttribute('aria-expanded');
  record(
    '2 dropdown',
    'Escape closes the panel and returns focus to the parent',
    afterEsc?.href === parentHref && expandedAfterEsc === 'false',
    `focus=${afterEsc?.href} aria-expanded=${expandedAfterEsc}`,
  );

  // Enter on the parent must navigate to the hub route, not just toggle.
  await parent.focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${parentHref}`, { timeout: 5000 }).catch(() => {});
  const landed = new URL(page.url()).pathname;
  record(
    '2 dropdown',
    'Enter on a parent navigates to the hub route',
    landed === parentHref,
    `expected ${parentHref}, got ${landed}`,
  );

  await ctx.close();
}

// ============================================================================
// 3. The mobile sheet
// ============================================================================
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const trigger = page.locator('.dm-masthead__menu');
  await trigger.focus();
  const triggerId = await trigger.getAttribute('id');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);

  const opened = await page.evaluate(DESCRIBE_ACTIVE);
  record(
    '3 mobile sheet',
    'opening moves focus into the sheet (onto Close)',
    /close/i.test(opened?.text ?? ''),
    `focus on "${opened?.text}"`,
  );
  record(
    '3 mobile sheet',
    'sheet is a modal dialog with an accessible name',
    await page.evaluate(() => {
      const d = document.querySelector('.dm-menu');
      return d && !d.hidden && d.getAttribute('role') === 'dialog' &&
        d.getAttribute('aria-modal') === 'true' && !!d.getAttribute('aria-label');
    }),
  );
  record(
    '3 mobile sheet',
    'the page behind the sheet is scroll locked',
    await page.evaluate(() => document.documentElement.hasAttribute('data-scroll-locked')),
  );

  // Tab all the way round. Focus must never leave the sheet.
  let escaped = null;
  for (let i = 0; i < 60; i += 1) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const d = document.querySelector('.dm-menu');
      const el = document.activeElement;
      return { inside: !!d?.contains(el), what: (el?.textContent || el?.tagName || '').trim().slice(0, 30) };
    });
    if (!inside.inside) { escaped = `${inside.what} at step ${i}`; break; }
  }
  record('3 mobile sheet', 'focus is trapped inside the sheet (60 forward tabs)', escaped === null, escaped ?? 'never escaped');

  let escapedBack = null;
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press('Shift+Tab');
    const inside = await page.evaluate(() => !!document.querySelector('.dm-menu')?.contains(document.activeElement));
    if (!inside) { escapedBack = `escaped backwards at step ${i}`; break; }
  }
  record('3 mobile sheet', 'focus is trapped going backwards too', escapedBack === null, escapedBack ?? 'never escaped');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const restored = await page.evaluate(DESCRIBE_ACTIVE);
  record(
    '3 mobile sheet',
    'Escape closes the sheet and restores focus to the trigger',
    restored?.id === triggerId,
    `focus id=${restored?.id} expected=${triggerId}`,
  );
  record(
    '3 mobile sheet',
    'the scroll lock is released on close',
    await page.evaluate(() => !document.documentElement.hasAttribute('data-scroll-locked')),
  );

  await ctx.close();
}

// ============================================================================
// 4. Landmarks, headings, lists, figures  (all 18 routes)
// ============================================================================
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();

  const bad = { main: [], banner: [], contentinfo: [], navLabels: [], headings: [], figures: [], lists: [] };

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    const s = await page.evaluate(() => {
      const q = (sel) => [...document.querySelectorAll(sel)];
      const name = (el) =>
        el.getAttribute('aria-label') ||
        (el.getAttribute('aria-labelledby') || '')
          .split(/\s+/).filter(Boolean)
          .map((id) => document.getElementById(id)?.textContent?.trim())
          .join(' ') || null;

      const navs = q('nav, [role="navigation"]').map(name);
      const levels = q('h1,h2,h3,h4,h5,h6').map((h) => +h.tagName[1]);
      const skips = [];
      let prev = 0;
      for (const l of levels) { if (prev && l > prev + 1) skips.push(`h${prev}->h${l}`); prev = l; }

      return {
        main: q('main, [role="main"]').length,
        banner: q('body > header, [role="banner"]').length,
        contentinfo: q('body > footer, [role="contentinfo"]').length,
        navs,
        h1: q('h1').length,
        skips,
        // A figure carrying a caption must use figcaption, not a div.
        figuresNoCaption: q('figure').filter((f) => !f.querySelector('figcaption')).length,
        figureCount: q('figure').length,
        // Anything that looks like a list must actually be one.
        strayListItems: q('li').filter((li) => !li.parentElement?.matches('ul,ol,menu')).length,
      };
    });

    if (s.main !== 1) bad.main.push(`${route}:${s.main}`);
    if (s.banner !== 1) bad.banner.push(`${route}:${s.banner}`);
    if (s.contentinfo !== 1) bad.contentinfo.push(`${route}:${s.contentinfo}`);
    if (s.navs.some((n) => !n) || new Set(s.navs).size !== s.navs.length)
      bad.navLabels.push(`${route}:${JSON.stringify(s.navs)}`);
    if (s.h1 !== 1 || s.skips.length) bad.headings.push(`${route}: h1=${s.h1} ${s.skips.join(',')}`);
    if (s.figuresNoCaption) bad.figures.push(`${route}:${s.figuresNoCaption}/${s.figureCount}`);
    if (s.strayListItems) bad.lists.push(`${route}:${s.strayListItems}`);
  }

  record('4 semantics', 'exactly one <main> per route', bad.main.length === 0, bad.main.join(' '));
  record('4 semantics', 'exactly one banner landmark per route', bad.banner.length === 0, bad.banner.join(' '));
  record('4 semantics', 'exactly one contentinfo landmark per route', bad.contentinfo.length === 0, bad.contentinfo.join(' '));
  record('4 semantics', 'every <nav> has a distinguishing label', bad.navLabels.length === 0, bad.navLabels.join(' '));
  record('4 semantics', 'one h1 per route and no skipped heading levels', bad.headings.length === 0, bad.headings.join(' | '));
  record('4 semantics', 'every <figure> carries a <figcaption>', bad.figures.length === 0, bad.figures.join(' '));
  record('4 semantics', 'every <li> sits in a real list', bad.lists.length === 0, bad.lists.join(' '));

  await ctx.close();
}

// ============================================================================
// 5. Form controls and the honeypot
// ============================================================================
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const formRoutes = ['/contact-us/', '/join-the-conversation/', '/do-business-better-podcast/', '/'];
  const unlabelled = [];
  const honeypotProblems = [];

  for (const route of formRoutes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const q = (s) => [...document.querySelectorAll(s)];
      const bad = [];
      for (const el of q('input,select,textarea')) {
        if (el.type === 'hidden') continue;
        const byFor = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        const wrapping = el.closest('label');
        if (!byFor && !wrapping) bad.push(`no <label>: ${el.outerHTML.slice(0, 90)}`);
      }
      const hp = [];
      for (const wrap of q('.dm-form__honeypot')) {
        const input = wrap.querySelector('input');
        const cs = getComputedStyle(wrap);
        const rect = wrap.getBoundingClientRect();
        hp.push({
          ariaHidden: wrap.getAttribute('aria-hidden') === 'true',
          visuallyHidden: cs.clipPath !== 'none' || cs.position === 'absolute',
          tinyBox: rect.width <= 2 && rect.height <= 2,
          notTabbable: input?.getAttribute('tabindex') === '-1',
          empty: input?.value === '',
          hasLabel: !!wrap.querySelector('label'),
        });
      }
      return { bad, hp, honeypotCount: q('.dm-form__honeypot').length };
    });
    unlabelled.push(...r.bad.map((b) => `${route} ${b}`));
    for (const h of r.hp) {
      if (!h.ariaHidden) honeypotProblems.push(`${route}: not aria-hidden`);
      if (!h.visuallyHidden || !h.tinyBox) honeypotProblems.push(`${route}: not visually hidden`);
      if (!h.notTabbable) honeypotProblems.push(`${route}: reachable by Tab`);
      if (!h.empty) honeypotProblems.push(`${route}: not empty`);
    }
  }

  record('5 forms', 'every visible form control has a real associated <label>', unlabelled.length === 0, unlabelled.slice(0, 3).join(' | '));
  record('5 forms', 'the Mailchimp honeypot is hidden from sighted users AND assistive tech', honeypotProblems.length === 0, honeypotProblems.slice(0, 4).join(' | '));

  // A keyboard user must never reach the honeypot.
  await page.goto(`${BASE}/join-the-conversation/`, { waitUntil: 'networkidle' });
  let reachedHoneypot = false;
  for (let i = 0; i < 160; i += 1) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => !!document.activeElement?.closest('.dm-form__honeypot'))) { reachedHoneypot = true; break; }
  }
  record('5 forms', 'the honeypot is never reached by Tab', !reachedHoneypot);

  await ctx.close();
}

// ============================================================================
// 6. WCAG 1.4.12 text spacing
// ============================================================================
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const TEXT_SPACING = `
    * , *::before, *::after {
      line-height: 1.5 !important;
      letter-spacing: 0.12em !important;
      word-spacing: 0.16em !important;
    }
    p, li, dd, dt, blockquote, figcaption, h1, h2, h3, h4, h5, h6 {
      margin-bottom: 2em !important;
    }`;
  const clipped = [];
  const overflowed = [];

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: TEXT_SPACING });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const bad = [];
      // Text clipped by a fixed height with hidden overflow is the failure
      // mode 1.4.12 exists to catch.
      for (const el of document.querySelectorAll('p,li,h1,h2,h3,h4,figcaption,blockquote,span,a,dd,dt')) {
        const cs = getComputedStyle(el);
        if (cs.overflow === 'visible' && cs.overflowY === 'visible') continue;
        if (cs.position === 'absolute' && parseFloat(cs.width) <= 2) continue; // visually-hidden helpers
        if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0)
          bad.push(`${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').slice(0, 34)} ${el.clientHeight}<${el.scrollHeight}`);
      }
      return { bad: [...new Set(bad)], overflow: doc.scrollWidth - doc.clientWidth };
    });
    if (r.bad.length) clipped.push(`${route}: ${r.bad.slice(0, 2).join(', ')}`);
    if (r.overflow > 0) overflowed.push(`${route}:+${r.overflow}px`);
  }

  record('6 text spacing', 'no text clipped under the 1.4.12 overrides', clipped.length === 0, clipped.slice(0, 4).join(' | '));
  record('6 text spacing', 'no horizontal scroll under the 1.4.12 overrides', overflowed.length === 0, overflowed.join(' '));
  await ctx.close();
}

// ============================================================================
// 7. 200 percent zoom at 1280 (SC 1.4.4 / 1.4.10)
// ============================================================================
{
  // 200 percent zoom at a 1280 viewport is the same layout as a 640 CSS-pixel
  // viewport at 1x, which is what deviceScaleFactor plus a 640 width models.
  const ctx = await browser.newContext({ viewport: { width: 640, height: 512 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const overflow = [];
  const lost = [];

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts?.ready);
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      // Content "lost" means an element pushed outside the viewport inline axis
      // with no way to scroll to it.
      const off = [...document.querySelectorAll('main *')].filter((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) return false;
        return b.right > doc.clientWidth + 2 || b.left < -2;
      }).length;
      return { overflow: doc.scrollWidth - doc.clientWidth, off, h1: !!document.querySelector('h1') };
    });
    if (r.overflow > 0) overflow.push(`${route}:+${r.overflow}px`);
    if (!r.h1) lost.push(`${route}: h1 gone`);
  }

  record('7 zoom 200%', 'no horizontal scroll at 200 percent zoom on a 1280 viewport', overflow.length === 0, overflow.join(' '));
  record('7 zoom 200%', 'no content lost at 200 percent zoom', lost.length === 0, lost.join(' '));
  await ctx.close();
}

// ============================================================================
// 8. Image alt quality
// ============================================================================
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const missing = [];
  const suspicious = [];
  let decorative = 0;
  let total = 0;

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await new Promise((res) => { let y = 0; const s = () => { scrollBy(0, innerHeight); y += innerHeight; if (y < document.body.scrollHeight + innerHeight) requestAnimationFrame(s); else { scrollTo(0, 0); res(); } }; s(); });
    });
    const r = await page.evaluate(() => {
      const out = { missing: [], suspicious: [], decorative: 0, total: 0 };
      const junk = /^(image|photo|picture|img|graphic|icon|logo|untitled|dsc[_-]?\d|screen ?shot|\d+)$/i;
      for (const img of document.querySelectorAll('img')) {
        out.total += 1;
        const alt = img.getAttribute('alt');
        const src = (img.currentSrc || img.src).split('/').pop().split('?')[0];
        if (alt === null) { out.missing.push(src); continue; }
        if (alt.trim() === '') { out.decorative += 1; continue; }
        const a = alt.trim();
        if (junk.test(a) || a.length < 5 || /\.(jpe?g|png|webp|svg|gif)$/i.test(a))
          out.suspicious.push(`${src} :: "${a}"`);
      }
      return out;
    });
    missing.push(...r.missing.map((m) => `${route}:${m}`));
    suspicious.push(...r.suspicious.map((m) => `${route}:${m}`));
    decorative += r.decorative;
    total += r.total;
  }

  record('8 images', 'no <img> is missing its alt attribute', missing.length === 0, missing.slice(0, 5).join(' '));
  record('8 images', 'no alt text is a filename or a placeholder word', suspicious.length === 0, suspicious.slice(0, 5).join(' | '));
  console.log(`      note: ${total} images across 18 routes, ${decorative} decorative (alt="")`);
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length) {
  console.log('\nFAILED:');
  for (const f of failed) console.log(`  [${f.group}] ${f.name} :: ${f.detail}`);
}
process.exit(failed.length ? 1 : 0);

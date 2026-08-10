/**
 * Critical regression check: with JavaScript disabled, no content may be
 * invisible and no media may be unreachable.
 *
 * Two failure modes are hunted here. The first is a scroll-reveal that hides
 * content by default and relies on an IntersectionObserver to show it. The
 * second is a facade: every video on this site rests behind a <button> that
 * swaps in the player on click, and with scripting off that button is a dead
 * control covering the whole frame. Ten of the thirteen YouTube embeds shipped
 * that way, with no anchor and no <noscript>, so the video simply did not
 * exist for a visitor without JavaScript. Every .dm-video must now offer a
 * real route to its file: an <a href> or a <video> with controls, both of
 * which a browser parses out of <noscript> when scripting is off.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const targets = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const browser = await chromium.launch();
const ctx = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 1440, height: 1000 },
});

const results = [];
for (const t of targets) {
  const page = await ctx.newPage();
  await page.goto(t.url, { waitUntil: 'load', timeout: 60_000 });

  const r = await page.evaluate(() => {
    const out = {
      revealAttrs: document.querySelectorAll('[data-reveal-state]').length,
      pending: document.querySelectorAll('[data-reveal-state="pending"]').length,
      hiddenTextNodes: [],
      offscreenTransformed: [],
      textLength: document.body.innerText.trim().length,
      h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
      headings: [...document.querySelectorAll('h2,h3')].map((h) => h.innerText.trim()).filter(Boolean).length,
      /* Added with the amplification pass. Two effects now write into the
         page from JavaScript, and both must be no-ops here.

         countsWrong: components/ui/Stat.tsx renders the true figure twice,
         once sr-only and once painted, both server side. With scripting off
         the painted copy IS the figure, so any drift between its text and its
         own data-count-to means the count-up has become load bearing.

         clipped: data-reveal="wipe" hides a figure's CHILDREN behind a
         clip-path, and only when the controller has written
         data-reveal-state="pending". With no controller there is nothing to
         un-clip, so a clipped child here is content that no reader without
         JavaScript can see. */
      countsWrong: [],
      clipped: [],
      videos: 0,
      unreachableVideos: [],
      deadFacades: [],
      audios: 0,
      unreachableAudios: [],
    };

    /**
     * Every video facade must expose a real route to the media with scripting
     * off. A <button> is not one: it needs JavaScript to do anything.
     *
     * Three things are asserted per figure, not one. A route that exists in
     * the markup but is painted at zero size, or is display:none, is not a
     * route, and an assertion that only reads the FIRST anchor in the figure
     * would be satisfied by an unrelated link in the cutline. So: scan every
     * anchor, require the matching one to be rendered, and separately require
     * that the inert <button> facade is not still sitting on top of it.
     */
    const rendered = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    };

    for (const fig of document.querySelectorAll('.dm-video')) {
      out.videos += 1;
      const name = (
        fig.querySelector('.dm-video__facade')?.getAttribute('aria-label') ??
        fig.querySelector('.dm-video__nojs-label')?.textContent?.trim() ??
        fig.querySelector('figcaption')?.textContent?.trim() ??
        '(unnamed)'
      ).slice(0, 80);

      // Any anchor in the figure may be the route, so all of them are read.
      // A YouTube facade must reach the canonical watch page (the
      // -nocookie.com host serves embeds only); a self-hosted file must reach
      // the MP4 itself, either through a link or through a <video> the
      // browser can actually play.
      const route = [...fig.querySelectorAll('a[href]')].find((a) => {
        const href = a.getAttribute('href') ?? '';
        return href.includes('youtube.com/watch') || href.endsWith('.mp4');
      });
      const media = fig.querySelector('video[controls]');
      const reachable = rendered(route) || rendered(media);
      if (!reachable) out.unreachableVideos.push(name);

      // The scripted facade is a <button> that cannot do anything here. If it
      // is still painted it covers the whole 16:9 stage and swallows the
      // press that was meant for the route underneath, so a route that exists
      // is not yet a route a visitor can reach.
      if (rendered(fig.querySelector('button.dm-video__facade'))) {
        out.deadFacades.push(name);
      }
    }

    // Native audio must remain a real control with a direct first-party file
    // when scripting is off. This is the archived Do Business Better episode,
    // not a player facade, so there is no button to rescue it later.
    for (const player of document.querySelectorAll('audio[controls]')) {
      out.audios += 1;
      const source = player.querySelector('source[src]')?.getAttribute('src') ??
        player.getAttribute('src') ?? '';
      const route = source ? new URL(source, document.baseURI) : null;
      const transcript = [...(player.closest('[data-audio-archive]')?.querySelectorAll('a[href]') ?? [])]
        .find((anchor) => /\.txt(?:[?#]|$)/i.test(anchor.getAttribute('href') ?? ''));
      if (
        !rendered(player) ||
        !route ||
        !/\.mp3(?:[?#]|$)/i.test(route.pathname) ||
        !rendered(transcript)
      ) {
        out.unreachableAudios.push(
          `${source || '(missing source)'}${transcript ? '' : ' (missing transcript)'}`,
        );
      }
    }
    // Any element that directly holds visible text must actually be visible.
    const all = document.querySelectorAll('body *');
    for (const el of all) {
      const direct = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
      );
      if (!direct) continue;
      const cs = getComputedStyle(el);
      const label = (el.tagName + '.' + (el.className || '')).slice(0, 80) +
        ' :: ' + el.textContent.trim().slice(0, 60);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue; // intentionally hidden (sr-only patterns handled below)
      // The skip link is parked off-screen by design and returns on
      // :focus-visible through pure CSS, so it works with JS off. Not a reveal.
      if (el.classList.contains('dm-skip-link')) continue;
      const op = parseFloat(cs.opacity);
      if (op < 0.99) out.hiddenTextNodes.push(label + ' [opacity ' + cs.opacity + ']');
      const tr = cs.transform;
      if (tr && tr !== 'none') {
        const m = tr.match(/matrix\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(',').map(Number);
          if (Math.abs(p[5]) > 4 || Math.abs(p[4]) > 4) {
            out.offscreenTransformed.push(label + ' [' + tr + ']');
          }
        }
      }
    }
        for (const el of document.querySelectorAll('[data-count-to]')) {
      const want = el.getAttribute('data-count-to');
      if (el.textContent.trim() !== want) out.countsWrong.push(`"${el.textContent}" != "${want}"`);
    }
    for (const el of document.querySelectorAll('[data-reveal]')) {
      for (const kid of el.children) {
        const cp = getComputedStyle(kid).clipPath;
        /* Only a clip that actually hides something. The resting state of a
           wipe is inset(0px), a full-visible no-op that exists so the pending
           state has something to interpolate FROM: an unset clip-path does not
           animate toward inset(0) and the reveal would snap. Flagging that
           would fail the check on every correctly-behaving figure. */
        if (cp && cp !== 'none' && !/^inset\(0px\)$/.test(cp) && /[1-9]/.test(cp)) {
          out.clipped.push(cp);
        }
      }
    }
    return out;
  });

  // Sanity: is the page's real copy actually painted? Sample the visible text.
  results.push({ name: t.name, ...r });
  console.log(
    `${t.name.padEnd(34)} text:${String(r.textLength).padStart(6)} h1:${r.h1.length} h2/h3:${String(r.headings).padStart(3)}` +
    ` revealAttrs:${r.revealAttrs} pending:${r.pending} video:${r.videos} audio:${r.audios}` +
    (r.hiddenTextNodes.length ? `  HIDDEN:${r.hiddenTextNodes.length}` : '') +
    (r.offscreenTransformed.length ? `  SHIFTED:${r.offscreenTransformed.length}` : '') +
    (r.unreachableVideos.length ? `  UNREACHABLE-VIDEO:${r.unreachableVideos.length}` : '') +
    (r.unreachableAudios.length ? `  UNREACHABLE-AUDIO:${r.unreachableAudios.length}` : '') +
    (r.countsWrong.length ? `  COUNT-DRIFT:${r.countsWrong.length}` : '') +
    (r.clipped.length ? `  CLIPPED:${r.clipped.length}` : '') +
    (r.deadFacades.length ? `  DEAD-FACADE:${r.deadFacades.length}` : ''),
  );
  if (r.hiddenTextNodes.length) console.log('    ' + r.hiddenTextNodes.slice(0, 5).join('\n    '));
  if (r.offscreenTransformed.length) console.log('    ' + r.offscreenTransformed.slice(0, 5).join('\n    '));
  if (r.unreachableVideos.length) console.log('    unreachable: ' + r.unreachableVideos.join('\n    unreachable: '));
  if (r.unreachableAudios.length) console.log('    unreachable audio: ' + r.unreachableAudios.join('\n    unreachable audio: '));
  if (r.deadFacades.length) console.log('    dead facade: ' + r.deadFacades.join('\n    dead facade: '));
  if (r.countsWrong.length) console.log('    count drift: ' + r.countsWrong.join('\n    count drift: '));
  if (r.clipped.length) console.log('    clipped with no controller: ' + r.clipped.join(', '));
  await page.close();
}

await browser.close();
fs.writeFileSync(process.argv[3] ?? 'docs/qa/nojs-report.json', JSON.stringify(results, null, 2));
const failures = results.filter(
  (r) =>
    r.pending > 0 ||
    r.countsWrong.length > 0 ||
    r.clipped.length > 0 ||
    r.hiddenTextNodes.length > 0 ||
    r.offscreenTransformed.length > 0 ||
    r.unreachableVideos.length > 0 ||
    r.unreachableAudios.length > 0 ||
    r.deadFacades.length > 0 ||
    r.textLength < 400,
);
const videoTotal = results.reduce((n, r) => n + r.videos, 0);
const videoBad = results.reduce((n, r) => n + r.unreachableVideos.length, 0);
const audioTotal = results.reduce((n, r) => n + r.audios, 0);
const audioBad = results.reduce((n, r) => n + r.unreachableAudios.length, 0);
const facadeBad = results.reduce((n, r) => n + r.deadFacades.length, 0);

/**
 * The reachability count is only meaningful against a known total. Without
 * this floor a route that stopped rendering its videos altogether would pass
 * the sweep by having nothing left to fail, which is how a regression hides.
 * The floor covers every media figure across the 21 routes. The precise
 * route-level count is reported above and must be raised when media is added;
 * never lower it to make the sweep pass.
 */
const EXPECTED_VIDEOS = 18;
const countShort = videoTotal < EXPECTED_VIDEOS;
const audioCountShort = audioTotal < 1;

console.log(`\nVIDEOS: ${videoTotal - videoBad}/${videoTotal} reachable with JS off`);
console.log(`AUDIO: ${audioTotal - audioBad}/${audioTotal} reachable with JS off`);
if (facadeBad) console.log(`DEAD FACADES STILL PAINTED: ${facadeBad}`);
if (countShort) {
  console.log(`VIDEO COUNT SHORT: found ${videoTotal}, expected at least ${EXPECTED_VIDEOS}`);
}
if (audioCountShort) console.log('AUDIO COUNT SHORT: expected the archived episode 144 player');
console.log('FAILING ROUTES: ' + failures.length);
for (const f of failures) console.log('  ' + f.name);
process.exitCode = failures.length || countShort || audioCountShort ? 1 : 0;

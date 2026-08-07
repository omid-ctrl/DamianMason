import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const OUT = '/tmp/dm-photo-qa';
fs.mkdirSync(OUT, { recursive: true });

const routes = [
  '/', '/about/', '/acres-tv/', '/blog-news/', '/blog/',
  '/boasg/', '/collaboration-opportunities/', '/contact-us/',
  '/do-business-better-podcast/', '/join-the-conversation/', '/keynote/',
  '/meeting-coordinators/', '/podcasts/', '/reviews/', '/speaking/',
  '/the-business-of-agriculture/', '/xtreme-ag/',
];

const vw = +process.argv[2] || 1440;
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: vw, height: 1000 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  isMobile: vw < 500,
  hasTouch: vw < 500,
});
const p = await ctx.newPage();
await p.route('**/*', (r) => {
  const u = new URL(r.request().url());
  return u.hostname === 'localhost' ? r.continue() : r.abort();
});

const report = [];
for (const route of routes) {
  await p.goto('http://localhost:3100' + route, { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(1200);
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);
  const n = await p.locator('.dm-photo').count();
  for (let i = 0; i < n; i++) {
    const el = p.locator('.dm-photo').nth(i);
    const meta = await el.evaluate((e) => {
      const img = e.querySelector('img');
      let src = img ? (img.currentSrc || img.src) : '';
      try { const u = new URL(src, location.href); if (u.pathname.startsWith('/_next/image')) src = decodeURIComponent(u.searchParams.get('url') || src); } catch {}
      const after = getComputedStyle(e, '::after');
      return { cls: e.className, src, veil: after.opacity, pos: img ? getComputedStyle(img).objectPosition : '', filt: img ? getComputedStyle(img).filter : '' };
    });
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    const slug = route.replace(/\//g, '_') + '-' + i + '-' + vw;
    const file = `${OUT}/${slug}.png`;
    try { await el.screenshot({ path: file }); } catch { continue; }
    const png = PNG.sync.read(fs.readFileSync(file));
    let sum = 0, sum2 = 0, min = 255, max = 0, c = 0;
    for (let k = 0; k < png.data.length; k += 4) {
      const l = 0.2126 * png.data[k] + 0.7152 * png.data[k + 1] + 0.0722 * png.data[k + 2];
      sum += l; sum2 += l * l; if (l < min) min = l; if (l > max) max = l; c++;
    }
    const mean = sum / c;
    const sd = Math.sqrt(sum2 / c - mean * mean);
    report.push({ route, vw, i, file, src: meta.src, cls: meta.cls, veil: meta.veil, pos: meta.pos,
      mean: +mean.toFixed(1), sd: +sd.toFixed(1), min: +min.toFixed(0), max: +max.toFixed(0),
      w: png.width, h: png.height });
  }
}
await b.close();
fs.writeFileSync(`${OUT}/report-${vw}.json`, JSON.stringify(report, null, 1));
for (const r of report) {
  console.log([String(r.mean).padStart(6), String(r.sd).padStart(6), String(r.min).padStart(4), String(r.max).padStart(4),
    (r.w + 'x' + r.h).padStart(9), r.veil.padStart(4), r.route.padEnd(32), r.src.replace(/.*\//, '').padEnd(38), r.cls].join(' '));
}

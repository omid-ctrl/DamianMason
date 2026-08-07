import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = '/tmp/dm-video-frames';
fs.mkdirSync(OUT, { recursive: true });

const reels = [
  { name: 'food-waste', file: '/video/dm-food-waste-720p.mp4' },
  { name: 'labor', file: '/video/dm-labor-720p.mp4' },
  { name: 'innovation', file: '/video/dm-innovation-720p.mp4' },
];

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto('http://localhost:3100/', { waitUntil: 'load' });

for (const reel of reels) {
  const dur = await p.evaluate(async (src) => {
    document.querySelectorAll('#probe-video').forEach((n) => n.remove());
    const v = document.createElement('video');
    v.id = 'probe-video';
    v.src = src;
    v.muted = true;
    v.preload = 'auto';
    v.style.cssText = 'position:fixed;inset:0;z-index:99999;width:1280px;height:720px;background:#000';
    document.body.appendChild(v);
    await new Promise((res) => { v.onloadedmetadata = res; });
    return v.duration;
  }, reel.file);
  console.log(reel.name, 'duration', dur);

  const marks = [0.5, 2, 4, 8, 14, 22, 30, 40, 50, 60, 70, 80].filter((t) => t < dur - 0.5);
  marks.push(+(dur - 1).toFixed(1));
  for (const t of marks) {
    await p.evaluate(async (t) => {
      const v = document.getElementById('probe-video');
      v.currentTime = t;
      await new Promise((res) => { v.onseeked = res; });
      await new Promise((r) => setTimeout(r, 120));
    }, t);
    await p.locator('#probe-video').screenshot({ path: `${OUT}/${reel.name}-${String(t).padStart(5, '0')}.png` });
  }
  await p.evaluate(() => document.getElementById('probe-video')?.remove());
}
await b.close();
console.log('frames in', OUT);

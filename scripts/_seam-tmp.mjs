import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';

// Find vertical seams: columns where mean absolute row-to-row luminance detail
// jumps. Blur-pad panels have far lower high-frequency energy than real footage.
for (const f of process.argv.slice(2)) {
  const tmp = f.replace(/\.jpg$/, '.__tmp.png');
  execFileSync('sips', ['-s', 'format', 'png', f, '--out', tmp], { stdio: 'ignore' });
  const p = PNG.sync.read(fs.readFileSync(tmp));
  fs.unlinkSync(tmp);
  const energy = [];
  for (let x = 1; x < p.width; x++) {
    let e = 0;
    for (let y = 1; y < p.height; y++) {
      const i = (y * p.width + x) * 4;
      const j = ((y - 1) * p.width + x) * 4;
      e += Math.abs(p.data[i] - p.data[j]);
    }
    energy.push(e / p.height);
  }
  // Smooth
  const sm = energy.map((_, i) => {
    const a = Math.max(0, i - 6), b = Math.min(energy.length, i + 7);
    return energy.slice(a, b).reduce((s, v) => s + v, 0) / (b - a);
  });
  const max = Math.max(...sm);
  const sharp = sm.map((v) => v > max * 0.45);
  let start = -1, end = -1;
  for (let i = 0; i < sharp.length; i++) if (sharp[i]) { if (start < 0) start = i; end = i; }
  console.log(
    f.split('/').pop(),
    `${p.width}x${p.height}`,
    `detailed band x=${start}..${end}`,
    `(${(((end - start) / p.width) * 100).toFixed(0)}% of width)`,
  );
}

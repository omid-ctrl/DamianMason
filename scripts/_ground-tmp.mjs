import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';

for (const f of process.argv.slice(2)) {
  const tmp = `/tmp/__ground_${Math.random().toString(36).slice(2)}.png`;
  execFileSync('sips', ['-s', 'format', 'png', f, '--out', tmp], { stdio: 'ignore' });
  const p = PNG.sync.read(fs.readFileSync(tmp));
  fs.unlinkSync(tmp);
  const at = (x, y) => {
    const i = (y * p.width + x) * 4;
    return [p.data[i], p.data[i + 1], p.data[i + 2], p.data[i + 3]];
  };
  const ring = [];
  for (let x = 0; x < p.width; x++) { ring.push(at(x, 0)); ring.push(at(x, p.height - 1)); }
  for (let y = 0; y < p.height; y++) { ring.push(at(0, y)); ring.push(at(p.width - 1, y)); }
  const lum = ring.map((c) => (c[3] < 8 ? 255 : 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2])).sort((a, b) => a - b);
  const med = lum[Math.floor(lum.length / 2)];
  const nonWhite = ring.filter((c) => c[3] > 8 && (c[0] < 250 || c[1] < 250 || c[2] < 250)).length;
  console.log(
    f.split('/').pop().padEnd(38),
    `${p.width}x${p.height}`,
    'corners', JSON.stringify([at(0, 0), at(p.width - 1, 0), at(0, p.height - 1), at(p.width - 1, p.height - 1)]),
    'ringMedianLum', med.toFixed(0),
    'ringNonWhite', `${((nonWhite / ring.length) * 100).toFixed(0)}%`,
  );
}

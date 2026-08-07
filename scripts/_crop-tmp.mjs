import fs from 'node:fs';
import { PNG } from 'pngjs';

// usage: node _crop-tmp.mjs <src.png> <out.png> <cssX> <cssY> <cssW> <cssH> [dpr]
const [src, out, x, y, w, h, dpr = 2] = process.argv.slice(2);
const png = PNG.sync.read(fs.readFileSync(src));
const X = Math.round(Number(x) * dpr);
const Y = Math.round(Number(y) * dpr);
const W = Math.min(Math.round(Number(w) * dpr), png.width - X);
const H = Math.min(Math.round(Number(h) * dpr), png.height - Y);
const dst = new PNG({ width: W, height: H });
PNG.bitblt(png, dst, X, Y, W, H, 0, 0);
fs.writeFileSync(out, PNG.sync.write(dst));
console.log(out, W, H);

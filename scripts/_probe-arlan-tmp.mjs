import sharp from 'sharp';

const src = '_source/media/Screenshot-2023-04-13-at-12.43.38-PM.png';
const shipped = 'public/img/photos/acres-tv-arlan-suderman.png';

const m = await sharp(src).metadata();
console.log('source', m.width, m.height);

// Find the green-bordered thumbnail. Scan for the bright green frame.
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;
const isGreen = (x, y) => {
  const i = (y * info.width + x) * ch;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return g > 120 && g - r > 50 && g - b > 50;
};
let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1, n = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (isGreen(x, y)) { n++; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
}
console.log('green px', n, 'bbox', minX, minY, maxX, maxY, 'size', maxX - minX + 1, maxY - minY + 1);

const sm = await sharp(shipped).metadata();
console.log('shipped', sm.width, sm.height, 'ratio', (sm.width / (maxX - minX + 1)).toFixed(2));

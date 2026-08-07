import sharp from 'sharp';

const SRC = '_source/media/332503780_161776152950398_8554729294588018579_n.jpeg';
const SHIP = 'public/img/photos/keynote-stage-xtremeag-portrait.jpg';

const sm = await sharp(SRC).metadata();
const pm = await sharp(SHIP).metadata();
console.log('src', sm.width, sm.height, 'ship', pm.width, pm.height);

// low-res greyscale of the source
const SW = 384, SH = Math.round((sm.height / sm.width) * SW); // 384 x 512
const srcBuf = await sharp(SRC).greyscale().resize(SW, SH, { fit: 'fill' }).raw().toBuffer();
const scale = sm.width / SW;

// the patch, at a fixed small size
const PW = 32, PH = 40;
const patch = await sharp(SHIP).greyscale().resize(PW, PH, { fit: 'fill' }).raw().toBuffer();
const pMean = patch.reduce((a, b) => a + b, 0) / patch.length;
const pDev = patch.map((v) => v - pMean);
const pNorm = Math.sqrt(pDev.reduce((a, b) => a + b * b, 0));

let best = { score: -2 };
// candidate crop widths in low-res px (4:5 boxes)
for (let w = 120; w <= SW; w += 2) {
  const h = Math.round(w * 1.25);
  if (h > SH) continue;
  for (let x = 0; x + w <= SW; x += 2) {
    for (let y = 0; y + h <= SH; y += 2) {
      // sample the window down to PW x PH by nearest neighbour
      let sum = 0;
      const vals = new Float64Array(PW * PH);
      for (let j = 0; j < PH; j++) {
        const sy = y + Math.floor((j + 0.5) * h / PH);
        for (let i = 0; i < PW; i++) {
          const sx = x + Math.floor((i + 0.5) * w / PW);
          const v = srcBuf[sy * SW + sx];
          vals[j * PW + i] = v; sum += v;
        }
      }
      const mean = sum / vals.length;
      let num = 0, den = 0;
      for (let k = 0; k < vals.length; k++) { const d = vals[k] - mean; num += d * pDev[k]; den += d * d; }
      const score = num / (Math.sqrt(den) * pNorm + 1e-9);
      if (score > best.score) best = { score, x, y, w, h };
    }
  }
}
console.log('best low-res', best);
console.log('source px', {
  left: Math.round(best.x * scale), top: Math.round(best.y * scale),
  width: Math.round(best.w * scale), height: Math.round(best.h * scale),
});

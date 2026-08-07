import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [src,out,tileH] = [process.argv[2],process.argv[3],Number(process.argv[4]||1300)];
fs.mkdirSync(out,{recursive:true});
const files = fs.readdirSync(src).filter(f=>f.endsWith('.png'));
for (const f of files) {
  const p = path.join(src,f);
  const img = sharp(p);
  const {width,height} = await img.metadata();
  const cols = Math.ceil(height/tileH);
  const gut = 12;
  const canvasW = cols*width + (cols-1)*gut;
  const comps = [];
  for (let i=0;i<cols;i++){
    const top = i*tileH;
    const h = Math.min(tileH, height-top);
    const buf = await sharp(p).extract({left:0,top,width,height:h}).png().toBuffer();
    comps.push({input:buf, left:i*(width+gut), top:0});
  }
  await sharp({create:{width:canvasW,height:tileH,channels:3,background:{r:255,g:0,b:0}}})
    .composite(comps).png().toFile(path.join(out,f));
  console.log(f, `${width}x${height} -> ${canvasW}x${tileH} (${cols} cols)`);
}

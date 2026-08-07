import fs from 'node:fs';
import { PNG } from 'pngjs';
const [src, out, hex='E8DFCE', scale=1] = process.argv.slice(2);
const p = PNG.sync.read(fs.readFileSync(src));
const br=parseInt(hex.slice(0,2),16), bg=parseInt(hex.slice(2,4),16), bb=parseInt(hex.slice(4,6),16);
const d = new PNG({width:p.width, height:p.height});
for (let i=0;i<p.data.length;i+=4){
  const a=p.data[i+3]/255;
  d.data[i]=Math.round(p.data[i]*a+br*(1-a));
  d.data[i+1]=Math.round(p.data[i+1]*a+bg*(1-a));
  d.data[i+2]=Math.round(p.data[i+2]*a+bb*(1-a));
  d.data[i+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(d));
console.log(out,p.width,p.height);

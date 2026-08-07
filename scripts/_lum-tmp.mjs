import fs from 'node:fs';
import { PNG } from 'pngjs';
const [src, x, y, w, h, dpr=2] = process.argv.slice(2);
const p = PNG.sync.read(fs.readFileSync(src));
const X=Math.round(x*dpr), Y=Math.round(y*dpr), W=Math.round(w*dpr), H=Math.round(h*dpr);
let sum=0,n=0,min=255,max=0; const hist=new Array(16).fill(0);
for(let j=Y;j<Y+H&&j<p.height;j++) for(let i=X;i<X+W&&i<p.width;i++){
  const k=(j*p.width+i)*4;
  const l=0.2126*p.data[k]+0.7152*p.data[k+1]+0.0722*p.data[k+2];
  sum+=l;n++;if(l<min)min=l;if(l>max)max=l;hist[Math.min(15,Math.floor(l/16))]++;
}
console.log(src.split('/').pop(), `mean=${(sum/n).toFixed(1)} min=${min.toFixed(0)} max=${max.toFixed(0)} p>64=${((hist.slice(4).reduce((a,b)=>a+b,0)/n)*100).toFixed(1)}%`);

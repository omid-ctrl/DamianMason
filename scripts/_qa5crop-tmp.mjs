import sharp from 'sharp';
const [src,out,top,h,scale] = [process.argv[2],process.argv[3],Number(process.argv[4]),Number(process.argv[5]),Number(process.argv[6]||1)];
const m = await sharp(src).metadata();
let p = sharp(src).extract({left:0,top,width:m.width,height:Math.min(h,m.height-top)});
if(scale!==1) p = p.resize({width:Math.round(m.width*scale)});
await p.png().toFile(out);
console.log('ok',m.width,m.height);

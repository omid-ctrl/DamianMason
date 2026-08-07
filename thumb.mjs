import sharp from 'sharp';
await sharp('public/img/photos/keynote-stage-podium.jpg').resize(640).toFile('/tmp/kn.png');
console.log('ok');

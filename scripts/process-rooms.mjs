import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const refDir = 'd:/APPs/newtajpalace.com/Reference Data';
const outDir = 'd:/APPs/newtajpalace.com/public/images/rooms';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function processRooms() {
  const files = fs.readdirSync(refDir).filter(f => f.startsWith('WhatsApp Image') && (f.endsWith('.jpeg') || f.endsWith('.jpg')));
  console.log(`Found ${files.length} room photos in Reference Data`);

  let count = 1;
  for (const file of files) {
    const inPath = path.join(refDir, file);
    const outName = `room-${count}.webp`;
    const outPath = path.join(outDir, outName);

    // Resize to max 1280px width/height and compress to high quality WebP
    await sharp(inPath)
      .resize({ width: 1280, height: 960, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    console.log(`Processed ${outName}: ${(stats.size / 1024).toFixed(1)} KB`);
    count++;
  }
}

processRooms().catch(err => {
  console.error('Room processing failed:', err);
  process.exit(1);
});

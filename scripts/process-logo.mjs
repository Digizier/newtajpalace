import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcPath = 'C:/Users/NB LAPTOP/.gemini/antigravity/brain/d3949b2c-e205-4c19-831b-b5a60ae6f3c5/.user_uploaded/media_1792075742928_5c89a7ec.jpg';
const publicDir = 'd:/APPs/newtajpalace.com/public';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function processLogo() {
  console.log('Processing logo from:', srcPath);
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  
  // Flood fill from borders to remove faux checkerboard
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBackground(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    
    // Check if pixel is neutral grayscale (checkerboard squares are ~200-255 with R~=G~=B)
    const diffRG = Math.abs(r - g);
    const diffGB = Math.abs(g - b);
    const diffRB = Math.abs(r - b);
    
    // Gold logo has distinct color (high red/green, low blue)
    const isNeutral = (diffRG <= 12 && diffGB <= 12 && diffRB <= 12);
    const isBright = (r >= 180 && g >= 180 && b >= 180);
    return isNeutral && isBright;
  }

  // Push all border pixels that qualify as background
  for (let x = 0; x < width; x++) {
    if (isBackground(x, 0)) { queue.push((0 * width + x)); visited[0 * width + x] = 1; }
    if (isBackground(x, height - 1)) { queue.push(((height - 1) * width + x)); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isBackground(0, y)) { queue.push((y * width + 0)); visited[y * width + 0] = 1; }
    if (isBackground(width - 1, y)) { queue.push((y * width + (width - 1))); visited[y * width + (width - 1)] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // Make this pixel transparent
    data[curr * 4 + 3] = 0;

    // Check 4 neighbors
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!visited[nidx] && isBackground(nx, ny)) {
          visited[nidx] = 1;
          queue.push(nidx);
        }
      }
    }
  }

  console.log(`Flood fill completed. Background pixels removed: ${head}`);

  // Save transparent PNG
  const outPng = path.join(publicDir, 'logo.png');
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outPng);
  console.log('Saved transparent logo:', outPng);

  // Save WebP version
  const outWebp = path.join(publicDir, 'logo.webp');
  await sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(outWebp);
  console.log('Saved webp logo:', outWebp);

  // Save favicon (192x192 and 32x32)
  const outFavicon = path.join(publicDir, 'favicon.png');
  await sharp(data, { raw: { width, height, channels: 4 } })
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outFavicon);
  console.log('Saved favicon.png:', outFavicon);

  // Also create favicon.ico
  const outIco = path.join(publicDir, 'favicon.ico');
  await sharp(data, { raw: { width, height, channels: 4 } })
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outIco);
  console.log('Saved favicon.ico:', outIco);
}

processLogo().catch(err => {
  console.error('Logo processing failed:', err);
  process.exit(1);
});

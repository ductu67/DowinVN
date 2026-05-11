/**
 * DowinVN Image Optimizer
 * Converts JPG images → optimized JPG + WebP + AVIF
 * Max width: 1920px, quality tuned per format
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const MAX_WIDTH = 1920;
const QUALITY = { jpg: 85, webp: 82, avif: 72 };

function getFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      getFiles(full, files);
    } else if (/\.jpg$/i.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function fmtKB(bytes) { return (bytes / 1024).toFixed(0) + ' KB'; }

async function processImage(src) {
  const dir = path.dirname(src);
  const base = path.basename(src, path.extname(src));
  const origSize = fs.statSync(src).size;

  const srcBuf = fs.readFileSync(src);
  const img = sharp(srcBuf).resize({ width: MAX_WIDTH, withoutEnlargement: true });

  // Optimized JPG (overwrite)
  const jpgOut = path.join(dir, base + '.jpg');
  const jpgBuf = await img.clone().jpeg({ quality: QUALITY.jpg, progressive: true, mozjpeg: true }).toBuffer();
  fs.writeFileSync(jpgOut, jpgBuf);

  // WebP (overwrite existing)
  const webpOut = path.join(dir, base + '.webp');
  const webpBuf = await img.clone().webp({ quality: QUALITY.webp, effort: 6 }).toBuffer();
  fs.writeFileSync(webpOut, webpBuf);

  // AVIF (new)
  const avifOut = path.join(dir, base + '.avif');
  const avifBuf = await img.clone().avif({ quality: QUALITY.avif, effort: 6 }).toBuffer();
  fs.writeFileSync(avifOut, avifBuf);

  const jpgSize = jpgBuf.length;
  const webpSize = webpBuf.length;
  const avifSize = avifBuf.length;
  const rel = path.relative(IMAGES_DIR, src).replace(/\\/g, '/');
  console.log(`${rel}: ${fmtKB(origSize)} → JPG ${fmtKB(jpgSize)} | WebP ${fmtKB(webpSize)} | AVIF ${fmtKB(avifSize)}`);
}

(async () => {
  const files = getFiles(IMAGES_DIR);
  console.log(`Processing ${files.length} JPG files...\n`);
  let ok = 0, err = 0;
  for (const f of files) {
    try {
      await processImage(f);
      ok++;
    } catch (e) {
      console.error(`ERROR: ${f}: ${e.message}`);
      err++;
    }
  }
  console.log(`\nDone: ${ok} processed, ${err} errors.`);
})();

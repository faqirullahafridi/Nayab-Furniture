import { readdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generatedDir = path.join(packageDir, "public/generated");

const MAX_WIDTH = 1400;
const JPEG_QUALITY = 76;
const WEBP_QUALITY = 72;
const MIN_BYTES_TO_RECOMPRESS = 100_000;

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const info = await stat(filePath);
  const meta = await sharp(filePath, { failOn: "none" }).metadata();
  const needsResize = (meta.width ?? 0) > MAX_WIDTH;

  if (!needsResize && info.size < MIN_BYTES_TO_RECOMPRESS) {
    const webpOut = filePath.replace(/\.(jpe?g|png)$/i, ".webp");
    try {
      await stat(webpOut);
      return;
    } catch {
      // create webp sibling below
    }
  }

  const jpegOut = filePath.replace(/\.png$/i, ".jpg").replace(/\.jpeg$/i, ".jpg");
  const webpOut = jpegOut.replace(/\.jpg$/i, ".webp");
  const tmpOut = `${jpegOut}.tmp`;

  await sharp(filePath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(tmpOut);

  await sharp(filePath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(webpOut);

  await rename(tmpOut, jpegOut);

  if (jpegOut !== filePath && ext === ".png") {
    await unlink(filePath).catch(() => undefined);
  }

  const after = await stat(jpegOut);
  console.log(
    `compressed ${path.basename(filePath)}: ${Math.round(info.size / 1024)}KB → ${Math.round(after.size / 1024)}KB`,
  );
}

const entries = await readdir(generatedDir);
for (const name of entries) {
  if (name.endsWith(".tmp")) continue;
  await processFile(path.join(generatedDir, name));
}

console.log("Image compression complete.");

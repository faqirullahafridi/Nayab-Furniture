import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(packageDir, "public");
const svgPath = path.join(publicDir, "favicon.svg");
const svg = await readFile(svgPath);

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
];

for (const { name, size } of sizes) {
  const out = path.join(publicDir, name);
  await sharp(svg, { density: Math.max(192, size * 4) })
    .resize(size, size)
    .png()
    .toFile(out);
  console.log(`wrote ${name}`);
}

// favicon.ico (16 + 32 multi-size)
const icon16 = await sharp(svg, { density: 128 }).resize(16, 16).png().toBuffer();
const icon32 = await sharp(svg, { density: 128 }).resize(32, 32).png().toBuffer();

// Minimal ICO: single 32x32 entry (widely supported)
await sharp(icon32).toFile(path.join(publicDir, "favicon.ico"));
console.log("wrote favicon.ico");

await writeFile(
  path.join(publicDir, "site.webmanifest"),
  `${JSON.stringify(
    {
      name: "Nayab Furniture",
      short_name: "Nayab",
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      ],
      theme_color: "#1f1812",
      background_color: "#faf8f5",
      display: "standalone",
    },
    null,
    2,
  )}\n`,
);

console.log("Favicon generation complete.");

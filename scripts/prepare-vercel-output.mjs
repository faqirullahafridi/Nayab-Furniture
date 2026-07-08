import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const built = path.join(repoRoot, "artifacts/nayab-furniture/dist/public");

if (!existsSync(path.join(built, "index.html"))) {
  throw new Error(`Build output missing: ${built}/index.html`);
}

function syncToPublic(target) {
  rmSync(target, { recursive: true, force: true });
  cpSync(built, target, { recursive: true });
  console.log(`Synced static output → ${target}`);
}

// Vite writes to dist/public; Vercel dashboard often expects "public" relative to Root Directory.
const publicTargets = new Set([
  path.join(repoRoot, "public"),
  path.join(repoRoot, "artifacts/nayab-furniture/public"),
]);

if (process.env.VERCEL === "1") {
  // Root Directory is often artifacts/api-server or artifacts/nayab-furniture in Vercel UI.
  publicTargets.add(path.join(repoRoot, "artifacts/api-server/public"));
  publicTargets.add(path.join(process.cwd(), "public"));
}

for (const target of publicTargets) {
  syncToPublic(target);
}

console.log(`Vite build output: ${built}`);

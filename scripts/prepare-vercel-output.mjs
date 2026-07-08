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

// Targets for vercel.json / dashboard "Output Directory: public"
const publicTargets = new Set([path.join(repoRoot, "public")]);

if (process.env.VERCEL === "1") {
  // Root Directory may be repo root or artifacts/nayab-furniture
  publicTargets.add(path.join(repoRoot, "artifacts/nayab-furniture/public"));
  publicTargets.add(path.join(process.cwd(), "public"));
}

for (const target of publicTargets) {
  syncToPublic(target);
}

console.log(`Vite build output: ${built}`);

import { cpSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const built = path.join(root, "artifacts/nayab-furniture/dist/public");
const out = path.join(root, "public");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(built, out, { recursive: true });

console.log(`Vercel static output ready at ${out}`);

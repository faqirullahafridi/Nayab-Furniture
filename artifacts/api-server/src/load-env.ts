import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

const envCandidates = [
  path.resolve(moduleDir, "../../../.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    config({ path: envPath, override: false });
    break;
  }
}

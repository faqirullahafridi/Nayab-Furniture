import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo root (where .env and pnpm-workspace.yaml live). */
export function getWorkspaceRoot(): string {
  const candidates = [
    path.resolve(moduleDir, "../../../"),
    path.resolve(moduleDir, "../../../../"),
    path.resolve(process.cwd()),
    path.resolve(process.cwd(), "../.."),
  ];

  for (const dir of candidates) {
    if (
      fs.existsSync(path.join(dir, "pnpm-workspace.yaml")) ||
      fs.existsSync(path.join(dir, ".env"))
    ) {
      return dir;
    }
  }

  return path.resolve(moduleDir, "../../../");
}

import fs from "node:fs";
import path from "node:path";
import { getWorkspaceRoot } from "./workspace-root";

function resolveFromWorkspace(relativeOrAbsolute: string): string {
  const trimmed = relativeOrAbsolute.trim();
  return path.isAbsolute(trimmed)
    ? trimmed
    : path.resolve(getWorkspaceRoot(), trimmed);
}

/** Primary uploads directory for legacy /uploads/* URLs. */
export function getUploadsDir(): string {
  if (process.env.UPLOADS_DIR?.trim()) {
    return resolveFromWorkspace(process.env.UPLOADS_DIR);
  }

  const root = getWorkspaceRoot();
  const candidates = [
    path.join(root, "artifacts/nayab-furniture/public/uploads"),
    path.join(root, "nayab-furniture/public/uploads"),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }

  return candidates[0];
}

/** Older API builds wrote files here before UPLOADS_DIR was fixed. */
export function getLegacyUploadsDir(): string {
  return path.join(getWorkspaceRoot(), "nayab-furniture/public/uploads");
}

/** Directories checked when serving /uploads (newest path first). */
export function getUploadsServeDirs(): string[] {
  const dirs = [getUploadsDir(), getLegacyUploadsDir()];
  return [...new Set(dirs)].filter((dir) => fs.existsSync(dir));
}

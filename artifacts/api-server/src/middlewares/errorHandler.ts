import type { ErrorRequestHandler } from "express";
import { logger } from "../lib/logger";

function isZodError(
  err: unknown,
): err is { issues: Array<{ path: PropertyKey[]; message: string }> } {
  return (
    err instanceof Error &&
    err.name === "ZodError" &&
    "issues" in err &&
    Array.isArray((err as { issues: unknown }).issues)
  );
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (isZodError(err)) {
    res.status(400).json({
      error: "Validation error",
      details: err.issues.map((issue) => ({
        path: issue.path.map(String).join("."),
        message: issue.message,
      })),
    });
    return;
  }

  logger.error({ err }, "Unhandled request error");
  res.status(500).json({ error: "Internal server error" });
};

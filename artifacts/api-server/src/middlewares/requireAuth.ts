import type { NextFunction, Request, Response } from "express";
import { getAuth, verifyToken } from "@clerk/express";
import { logger } from "../lib/logger";

function readBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header) return undefined;

  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || undefined;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const auth = getAuth(req);
    if (auth.userId) {
      next();
      return;
    }
    logger.warn(
      { userId: auth.userId },
      "requireAuth: clerkMiddleware getAuth returned no user",
    );
  } catch (err) {
    logger.warn({ err }, "requireAuth: getAuth threw");
  }

  const token = readBearerToken(req);
  logger.info(
    { hasToken: Boolean(token), hasSecret: Boolean(process.env.CLERK_SECRET_KEY) },
    "requireAuth: attempting bearer verification",
  );

  const jwtKey = process.env.CLERK_JWT_KEY;
  if (token && (jwtKey || process.env.CLERK_SECRET_KEY)) {
    try {
      const payload = await verifyToken(token, {
        // Prefer networkless verification via the instance public key.
        ...(jwtKey ? { jwtKey } : {}),
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      if (payload.sub) {
        next();
        return;
      }
      logger.warn({ payload }, "requireAuth: token verified but no sub");
    } catch (err) {
      logger.warn({ err: String(err) }, "requireAuth: verifyToken failed");
    }
  }

  res.status(401).json({ error: "Unauthorized" });
}

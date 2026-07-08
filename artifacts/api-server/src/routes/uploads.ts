import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  isObjectStorageConfigured,
  uploadImageToObjectStorage,
} from "../lib/object-storage";

const router: IRouter = Router();

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const UploadBody = {
  parse(body: unknown): { data: string; filename?: string; mimeType: string } {
    if (!body || typeof body !== "object") {
      throw new Error("Invalid body");
    }
    const { data, filename, mimeType } = body as Record<string, unknown>;
    if (typeof data !== "string" || !data) throw new Error("Missing image data");
    if (typeof mimeType !== "string" || !mimeType) throw new Error("Missing mime type");
    return {
      data,
      mimeType,
      filename: typeof filename === "string" ? filename : undefined,
    };
  },
};

router.post("/uploads", requireAuth, async (req, res) => {
  let body: { data: string; filename?: string; mimeType: string };
  try {
    body = UploadBody.parse(req.body);
  } catch {
    res.status(400).json({ error: "Invalid upload payload." });
    return;
  }

  if (!ALLOWED_TYPES.has(body.mimeType)) {
    res.status(400).json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed." });
    return;
  }

  const base64 = body.data.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  if (buffer.length > 5 * 1024 * 1024) {
    res.status(400).json({ error: "Image must be 5 MB or smaller." });
    return;
  }

  try {
    if (!isObjectStorageConfigured()) {
      res.status(503).json({
        error:
          "Object storage is not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY in .env, then restart the API server.",
      });
      return;
    }

    const url = await uploadImageToObjectStorage(
      buffer,
      body.mimeType,
      body.filename,
    );
    res.status(201).json({ url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Image upload failed.";
    res.status(500).json({ error: message });
  }
});

export default router;

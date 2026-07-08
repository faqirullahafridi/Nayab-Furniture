import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryImagesTable } from "@workspace/db";
import {
  ListGalleryImagesQueryParams,
  CreateGalleryImageBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/gallery", async (req, res) => {
  res.set("Cache-Control", "public, max-age=600, stale-while-revalidate=86400");
  const query = ListGalleryImagesQueryParams.parse(req.query);
  const rows = query.category
    ? await db
        .select()
        .from(galleryImagesTable)
        .where(eq(galleryImagesTable.category, query.category))
    : await db.select().from(galleryImagesTable);
  res.json(rows);
});

router.post("/gallery", requireAuth, async (req, res) => {
  const body = CreateGalleryImageBody.parse(req.body);
  const [row] = await db.insert(galleryImagesTable).values(body).returning();
  res.status(201).json(row);
});

router.delete("/gallery/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db
    .delete(galleryImagesTable)
    .where(eq(galleryImagesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Gallery image not found" });
    return;
  }
  res.status(204).end();
});

export default router;

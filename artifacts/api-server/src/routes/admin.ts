import { Router, type IRouter } from "express";
import { count, desc, eq } from "drizzle-orm";
import { db, productsTable, galleryImagesTable, inquiriesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/admin/summary", requireAuth, async (_req, res) => {
  const [[{ totalProducts }], [{ totalGalleryImages }], [{ totalInquiries }], [{ newInquiries }], recentInquiries] =
    await Promise.all([
      db.select({ totalProducts: count() }).from(productsTable),
      db.select({ totalGalleryImages: count() }).from(galleryImagesTable),
      db.select({ totalInquiries: count() }).from(inquiriesTable),
      db
        .select({ newInquiries: count() })
        .from(inquiriesTable)
        .where(eq(inquiriesTable.status, "new")),
      db
        .select()
        .from(inquiriesTable)
        .orderBy(desc(inquiriesTable.createdAt))
        .limit(5),
    ]);

  res.json({
    totalProducts,
    totalGalleryImages,
    totalInquiries,
    newInquiries,
    recentInquiries,
  });
});

export default router;

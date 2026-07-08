import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, inquiriesTable } from "@workspace/db";
import { CreateInquiryBody, UpdateInquiryBody } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/inquiries", requireAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(inquiriesTable)
    .orderBy(desc(inquiriesTable.createdAt));
  res.json(rows);
});

router.post("/inquiries", async (req, res) => {
  const body = CreateInquiryBody.parse(req.body);
  const [row] = await db.insert(inquiriesTable).values(body).returning();
  res.status(201).json(row);
});

router.patch("/inquiries/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const body = UpdateInquiryBody.parse(req.body);
  const [row] = await db
    .update(inquiriesTable)
    .set(body)
    .where(eq(inquiriesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }
  res.json(row);
});

router.delete("/inquiries/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db
    .delete(inquiriesTable)
    .where(eq(inquiriesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }
  res.status(204).end();
});

export default router;

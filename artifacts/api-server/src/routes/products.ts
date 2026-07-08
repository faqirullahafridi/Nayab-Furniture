import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  UpdateProductBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
  const query = ListProductsQueryParams.parse(req.query);
  const conditions = [];
  if (query.category) conditions.push(eq(productsTable.category, query.category));
  if (query.featured !== undefined)
    conditions.push(eq(productsTable.featured, query.featured));

  const rows = await db
    .select()
    .from(productsTable)
    .where(conditions.length ? and(...conditions) : undefined);
  res.json(rows);
});

router.get("/products/:id", async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
  const id = Number(req.params.id);
  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(row);
});

router.post("/products", requireAuth, async (req, res) => {
  const body = CreateProductBody.parse(req.body);
  const [row] = await db.insert(productsTable).values(body).returning();
  res.status(201).json(row);
});

router.patch("/products/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const body = UpdateProductBody.parse(req.body);
  const [row] = await db
    .update(productsTable)
    .set(body)
    .where(eq(productsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(row);
});

router.delete("/products/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.status(204).end();
});

export default router;

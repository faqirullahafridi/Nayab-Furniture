import { eq, inArray, notInArray } from "drizzle-orm";
import { db, pool, productsTable } from "./index";
import { FEATURED_PRODUCT_NAMES, PRODUCT_CATALOG } from "./catalog";

async function seedCatalog() {
  const existing = await db
    .select({ name: productsTable.name })
    .from(productsTable);
  const existingNames = new Set(existing.map((row) => row.name));

  const toInsert = PRODUCT_CATALOG.filter(
    (product) => !existingNames.has(product.name),
  );

  if (toInsert.length > 0) {
    await db.insert(productsTable).values([...toInsert]);
    console.log(`Added ${toInsert.length} new products to the catalog.`);
  } else {
    console.log("All catalog products already exist.");
  }

  let imageUpdates = 0;
  for (const product of PRODUCT_CATALOG) {
    const result = await db
      .update(productsTable)
      .set({
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description,
        priceLabel: product.priceLabel,
      })
      .where(eq(productsTable.name, product.name))
      .returning({ id: productsTable.id });

    if (result.length > 0) {
      imageUpdates += 1;
    }
  }
  console.log(`Synced catalog details for ${imageUpdates} products.`);

  await db
    .update(productsTable)
    .set({ featured: true })
    .where(inArray(productsTable.name, [...FEATURED_PRODUCT_NAMES]));

  await db
    .update(productsTable)
    .set({ featured: false })
    .where(notInArray(productsTable.name, [...FEATURED_PRODUCT_NAMES]));

  console.log(`Synced ${FEATURED_PRODUCT_NAMES.length} featured products for the home page.`);
}

seedCatalog()
  .catch((err) => {
    console.error("Catalog seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

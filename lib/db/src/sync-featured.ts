import { inArray, notInArray } from "drizzle-orm";
import { db, pool, productsTable } from "./index";
import { FEATURED_PRODUCT_NAMES } from "./catalog";

async function syncFeatured() {
  await db
    .update(productsTable)
    .set({ featured: true })
    .where(inArray(productsTable.name, [...FEATURED_PRODUCT_NAMES]));

  await db
    .update(productsTable)
    .set({ featured: false })
    .where(notInArray(productsTable.name, [...FEATURED_PRODUCT_NAMES]));

  console.log(`Synced ${FEATURED_PRODUCT_NAMES.length} featured products.`);
}

syncFeatured()
  .catch((err) => {
    console.error("Failed to sync featured products:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

import { sql } from "drizzle-orm";
import { db, pool, productsTable, galleryImagesTable } from "./index";
import { PRODUCT_CATALOG } from "./catalog";

const galleryImages = [
  {
    imageUrl: "/generated/gallery-living-room.jpg",
    caption: "Custom walnut living room suite in Hayatabad",
    category: "Living Room",
  },
  {
    imageUrl: "/generated/gallery-bedroom.jpg",
    caption: "Hand-carved master bedroom with matching side tables",
    category: "Bedroom",
  },
  {
    imageUrl: "/generated/gallery-dining-room.jpg",
    caption: "Solid wood dining set for a family of eight",
    category: "Dining Room",
  },
  {
    imageUrl: "/generated/gallery-workshop.jpg",
    caption: "Our artisans at work in the Nayab workshop",
    category: "Workshop",
  },
  {
    imageUrl: "/generated/hero-showroom.jpg",
    caption: "The Nayab Furniture showroom on Ring Road",
    category: "Showroom",
  },
];

async function seed() {
  const [{ count: productCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable);

  if (productCount > 0) {
    console.log("Products already exist — run `pnpm run seed-catalog` to add new items.");
    return;
  }

  await db.insert(productsTable).values([...PRODUCT_CATALOG]);
  await db.insert(galleryImagesTable).values(galleryImages);
  console.log(
    `Seeded ${PRODUCT_CATALOG.length} products and ${galleryImages.length} gallery images.`,
  );
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

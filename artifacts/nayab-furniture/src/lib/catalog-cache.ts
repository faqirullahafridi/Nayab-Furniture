import type { QueryClient } from "@tanstack/react-query";
import {
  getListGalleryImagesQueryKey,
  getListProductsQueryKey,
  type GalleryImage,
  type Product,
} from "@workspace/api-client-react";

const STORAGE_KEY = "nayab-catalog-v1";
const VERSION = 1;
const TTL_MS = 24 * 60 * 60 * 1000;

type CatalogBlob = {
  v: number;
  at: number;
  products?: Product[];
  gallery?: GalleryImage[];
};

function readBlob(): CatalogBlob | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const blob = JSON.parse(raw) as CatalogBlob;
    if (blob.v !== VERSION || Date.now() - blob.at > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return blob;
  } catch {
    return null;
  }
}

function writeBlob(patch: Partial<Pick<CatalogBlob, "products" | "gallery">>) {
  const existing = readBlob() ?? { v: VERSION, at: Date.now() };
  const next: CatalogBlob = { ...existing, ...patch, v: VERSION, at: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — skip persistence.
  }
}

export function readCachedProducts(): Product[] | undefined {
  const products = readBlob()?.products;
  return products?.length ? products : undefined;
}

export function readCachedGallery(): GalleryImage[] | undefined {
  const gallery = readBlob()?.gallery;
  return gallery?.length ? gallery : undefined;
}

function isFullProductsKey(key: readonly unknown[]): boolean {
  if (key[0] !== "/api/products") return false;
  if (key.length === 1) return true;
  const params = key[1];
  if (!params || typeof params !== "object") return true;
  return Object.keys(params as object).length === 0;
}

function isGalleryKey(key: readonly unknown[]): boolean {
  if (key[0] !== "/api/gallery") return false;
  if (key.length === 1) return true;
  const params = key[1];
  if (!params || typeof params !== "object") return true;
  return Object.keys(params as object).length === 0;
}

/** Hydrate React Query from localStorage before the first render. */
export function hydrateCatalogCache(queryClient: QueryClient) {
  if (typeof window === "undefined") return;

  const products = readCachedProducts();
  if (products) {
    queryClient.setQueryData(getListProductsQueryKey({}), products);
  }

  const gallery = readCachedGallery();
  if (gallery) {
    queryClient.setQueryData(getListGalleryImagesQueryKey(), gallery);
  }
}

/** Persist successful catalog fetches back to localStorage. */
export function subscribeCatalogCache(queryClient: QueryClient): () => void {
  return queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== "updated") return;
    const { query } = event;
    if (query.state.status !== "success" || !query.state.data) return;

    const key = query.queryKey;
    if (isFullProductsKey(key)) {
      writeBlob({ products: query.state.data as Product[] });
    }
    if (isGalleryKey(key)) {
      writeBlob({ gallery: query.state.data as GalleryImage[] });
    }
  });
}

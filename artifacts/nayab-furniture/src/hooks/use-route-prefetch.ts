import { useCallback } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  getListGalleryImagesQueryOptions,
  getListProductsQueryOptions,
} from "@workspace/api-client-react";
import { CATALOG_STALE_TIME } from "@/lib/query-client";

function prefetchProducts(queryClient: QueryClient) {
  void queryClient.prefetchQuery({
    ...getListProductsQueryOptions({}),
    staleTime: CATALOG_STALE_TIME,
  });
}

function prefetchGallery(queryClient: QueryClient) {
  void queryClient.prefetchQuery({
    ...getListGalleryImagesQueryOptions(),
    staleTime: CATALOG_STALE_TIME,
  });
}

const routeImports: Record<string, () => Promise<unknown>> = {
  "/about": () => import("@/pages/About"),
  "/products": () => import("@/pages/Products"),
  "/gallery": () => import("@/pages/Gallery"),
  "/contact": () => import("@/pages/Contact"),
};

export function useRoutePrefetch() {
  const queryClient = useQueryClient();

  const prefetchRoute = useCallback(
    (href: string) => {
      const path = href.split("?")[0];
      routeImports[path]?.();

      if (path === "/products") prefetchProducts(queryClient);
      if (path === "/gallery") prefetchGallery(queryClient);
    },
    [queryClient],
  );

  const prefetchCatalogData = useCallback(() => {
    prefetchProducts(queryClient);
    prefetchGallery(queryClient);
    routeImports["/products"]?.();
    routeImports["/gallery"]?.();
  }, [queryClient]);

  return { prefetchRoute, prefetchCatalogData };
}

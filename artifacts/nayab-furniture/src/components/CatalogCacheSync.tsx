import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeCatalogCache } from "@/lib/catalog-cache";

export function CatalogCacheSync() {
  const queryClient = useQueryClient();

  useEffect(() => subscribeCatalogCache(queryClient), [queryClient]);

  return null;
}

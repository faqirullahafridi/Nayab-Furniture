import { QueryClient } from "@tanstack/react-query";

function isUnauthorized(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: number }).status === 401
  );
}

/** Catalog pages (Collections / Showcase) stay fresh longer — localStorage backs them up. */
export const CATALOG_STALE_TIME = 30 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (isUnauthorized(error)) return false;
        return failureCount < 1;
      },
    },
  },
});

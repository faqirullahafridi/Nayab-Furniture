import { useEffect } from "react";
import { useRoutePrefetch } from "@/hooks/use-route-prefetch";

function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

export function PrefetchBootstrap() {
  const { prefetchCatalogData } = useRoutePrefetch();

  useEffect(() => {
    if (isSlowConnection()) return;

    const schedule = () => prefetchCatalogData();

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(schedule, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(schedule, 800);
    return () => globalThis.clearTimeout(id);
  }, [prefetchCatalogData]);

  return null;
}

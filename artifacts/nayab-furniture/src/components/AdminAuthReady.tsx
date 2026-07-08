import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { PageLoader } from "@/components/PageLoader";

export function AdminAuthReady({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setReady(false);
      return;
    }

    let active = true;

    void (async () => {
      const token = await getTokenRef.current();
      if (!active) return;
      if (token) {
        // Clear any cached errors (e.g. 401s from before the token was ready)
        // so admin queries refetch cleanly.
        await queryClient.resetQueries();
      }
      setReady(Boolean(token));
    })();

    return () => {
      active = false;
      setReady(false);
    };
  }, [isLoaded, isSignedIn, queryClient]);

  if (!isLoaded || !isSignedIn || !ready) {
    return <PageLoader />;
  }

  return <>{children}</>;
}

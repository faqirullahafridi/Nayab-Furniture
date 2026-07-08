import { useAuth } from "@clerk/react";
import { useCallback, useRef } from "react";

export function useAdminApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const withAuth = useCallback(async (init: RequestInit = {}): Promise<RequestInit> => {
    const token = await getTokenRef.current();
    if (!token) {
      throw new Error("Missing Clerk session token");
    }

    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return { ...init, headers };
  }, []);

  return {
    withAuth,
    isLoaded,
    isSignedIn,
    isReady: isLoaded && isSignedIn,
  };
}

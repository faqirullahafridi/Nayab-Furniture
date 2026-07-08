import { useLocation } from "wouter";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div key={location} className="flex-1">
      {children}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

type LazyMapProps = {
  className?: string;
  heightClass?: string;
};

export function LazyMap({
  className = "",
  heightClass = "h-64",
}: LazyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${heightClass} bg-card border border-border rounded-sm overflow-hidden relative ${className}`}
    >
      {shouldLoad ? (
        <iframe
          title="Nayab Furniture location"
          src={`https://maps.google.com/maps?q=${SITE.mapsEmbedQuery}&output=embed`}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setShouldLoad(true)}
          className="w-full h-full flex flex-col items-center justify-center gap-3 bg-muted/40 text-muted-foreground hover:bg-muted/60 transition-colors"
          aria-label="Load map"
        >
          <MapPin className="h-8 w-8 text-primary" />
          <span className="text-sm font-medium">Tap to load map</span>
        </button>
      )}
      <a
        href={`https://maps.google.com/?q=${SITE.mapsQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 bg-background text-foreground px-3 py-1.5 rounded-sm text-xs font-medium shadow-lg hover:bg-background/90 transition-colors z-10"
      >
        Open in Google Maps
      </a>
    </div>
  );
}

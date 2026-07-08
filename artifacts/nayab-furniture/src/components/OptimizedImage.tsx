import { useEffect, useMemo, useState, type ImgHTMLAttributes } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import {
  getOptimizedImageUrl,
  IMAGE_PLACEHOLDER,
} from "@/lib/images";
import { acquireImageSlot, releaseImageSlot } from "@/lib/image-load-queue";

type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean;
  defer?: boolean;
  maxWidth?: number;
  quality?: number;
  shrinkToFit?: boolean;
  sizes?: string;
};

export function OptimizedImage({
  priority = false,
  defer = false,
  maxWidth,
  quality,
  shrinkToFit = false,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  onLoad,
  onError,
  alt = "",
  src,
  ...props
}: OptimizedImageProps) {
  const shouldDefer = defer && !priority;
  const { ref, inView } = useInView<HTMLSpanElement>({
    enabled: shouldDefer,
    rootMargin: "320px 0px",
  });

  const [slotReady, setSlotReady] = useState(priority);
  const [loaded, setLoaded] = useState(priority);
  const [errored, setErrored] = useState(false);
  const [slotHeld, setSlotHeld] = useState(false);

  const resolvedSrc = useMemo(
    () =>
      errored
        ? IMAGE_PLACEHOLDER
        : getOptimizedImageUrl(typeof src === "string" ? src : undefined, {
            width: maxWidth,
            quality,
          }),
    [errored, maxWidth, quality, src],
  );

  const visible = priority || inView || !shouldDefer;

  useEffect(() => {
    if (priority || slotReady || !visible) return;

    let cancelled = false;
    void acquireImageSlot().then(() => {
      if (cancelled) {
        releaseImageSlot();
        return;
      }
      setSlotHeld(true);
      setSlotReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [priority, slotReady, visible]);

  useEffect(() => {
    return () => {
      if (slotHeld && !loaded) releaseImageSlot();
    };
  }, [slotHeld, loaded]);

  const showImage = slotReady && visible;
  const isAbsolute =
    typeof className === "string" && /\babsolute\b/.test(className);

  return (
    <span
      ref={ref}
      className={cn(
        "overflow-hidden",
        shrinkToFit
          ? "inline-block max-w-full align-top"
          : isAbsolute
            ? "absolute inset-0"
            : "relative block h-full w-full",
      )}
    >
      {(!loaded || !showImage) && !errored && (
        <span
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden
        />
      )}
      {showImage && (
        <img
          {...props}
          src={resolvedSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          sizes={sizes}
          onLoad={(event) => {
            if (slotHeld) releaseImageSlot();
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={(event) => {
            if (slotHeld) releaseImageSlot();
            setErrored(true);
            setLoaded(true);
            onError?.(event);
          }}
          className={cn(
            loaded ? "opacity-100" : "opacity-0",
            !priority && "transition-opacity duration-150",
            isAbsolute && "h-full w-full object-cover",
            className,
          )}
        />
      )}
    </span>
  );
}

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  rootMargin?: string;
  enabled?: boolean;
};

export function useInView<T extends Element>({
  rootMargin = "280px 0px",
  enabled = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setInView(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return { ref, inView };
}

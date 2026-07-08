import logo from "@assets/ChatGPT_Image_Jul_30__2025__09_21_32_AM-removebg-preview-1-1_1783483284128.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  imgClassName?: string;
  alt?: string;
};

/** Brand mark with a dark walnut frame so white/gold artwork stays visible on any header. */
export function Logo({
  className,
  imgClassName,
  alt = "Nayab Furniture",
}: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md",
        "bg-[#1f1812] ring-1 ring-primary/50 shadow-md p-1",
        className,
      )}
    >
      <img
        src={logo}
        alt={alt}
        className={cn("h-full w-full object-contain", imgClassName)}
        width={96}
        height={96}
        decoding="async"
      />
    </span>
  );
}

export const logoSrc = logo;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23e8e0d5' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a09080' font-family='serif' font-size='18'%3ENayab Furniture%3C/text%3E%3C/svg%3E";

/** Prefix relative image paths with the Vite base URL. */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return IMAGE_PLACEHOLDER;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  return url.startsWith("/") ? `${BASE}${url}` : `${BASE}/${url}`;
}

type OptimizeOptions = {
  width?: number;
  quality?: number;
  format?: "webp" | "origin";
};

/** Smaller URLs for grid/lightbox; Supabase uses render API, local assets prefer .webp siblings. */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: OptimizeOptions = {},
): string {
  const resolved = resolveImageUrl(url);
  const { width, quality = 72, format = "webp" } = options;

  const supabaseObject = resolved.match(
    /^https:\/\/([^.]+)\.supabase\.co\/storage\/v1\/object\/public\/(.+)$/,
  );
  if (supabaseObject) {
    const [, project, objectPath] = supabaseObject;
    const params = new URLSearchParams({ quality: String(quality) });
    if (width) params.set("width", String(width));
    if (format === "webp") params.set("format", "webp");
    return `https://${project}.supabase.co/storage/v1/render/image/public/${objectPath}?${params}`;
  }

  if (width && resolved !== IMAGE_PLACEHOLDER) {
    const webp = resolved.replace(/\.(jpe?g|png)$/i, ".webp");
    if (webp !== resolved) return webp;
  }

  return resolved;
}

export function galleryThumbWidth(): number {
  if (typeof window === "undefined") return 520;
  if (window.innerWidth < 640) return 380;
  if (window.innerWidth < 1024) return 520;
  return 640;
}

export function galleryLightboxWidth(): number {
  if (typeof window === "undefined") return 1200;
  return Math.min(Math.round(window.innerWidth * 0.94), 1280);
}

/** Resize and compress images before upload for faster mobile loading. */
export async function compressImageFile(
  file: File,
  maxWidth = 1400,
  quality = 0.82,
): Promise<{ blob: Blob; mimeType: string }> {
  if (file.type === "image/gif") {
    return { blob: file, mimeType: file.type };
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return { blob: file, mimeType: file.type };
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const mimeType =
    file.type === "image/png" && file.size < 400_000
      ? "image/png"
      : "image/jpeg";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Compression failed"))),
      mimeType,
      quality,
    );
  });

  return { blob, mimeType };
}

export function readBlobAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

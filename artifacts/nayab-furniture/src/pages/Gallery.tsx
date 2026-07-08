import { useMemo, useState } from "react";
import { useListGalleryImages } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ApiErrorState } from "@/components/ApiErrorState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { galleryLightboxWidth, galleryThumbWidth } from "@/lib/images";
import { X } from "lucide-react";

export default function Gallery() {
  const thumbWidth = useMemo(() => galleryThumbWidth(), []);
  const lightboxWidth = useMemo(() => galleryLightboxWidth(), []);

  const { data: images, isLoading, isError, refetch } = useListGalleryImages();

  const showSkeleton = isLoading && !images;
  const [selectedImage, setSelectedImage] = useState<{url: string, caption: string} | null>(null);

  const categories = ["All", ...Array.from(new Set(images?.map(img => img.category) || []))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = images?.filter(img => activeCategory === "All" || img.category === activeCategory) || [];

  return (
    <div className="flex-1 w-full bg-background min-h-screen pb-20">
      <div className="bg-card py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-card-foreground mb-4">Showcase</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A gallery of our completed projects and bespoke commissions installed in homes across Peshawar.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {showSkeleton ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className={`w-full rounded-sm bg-muted break-inside-avoid ${i % 3 === 0 ? 'h-72' : i % 2 === 0 ? 'h-56' : 'h-64'}`} />
            ))}
          </div>
        ) : isError ? (
          <ApiErrorState onRetry={() => refetch()} />
        ) : filteredImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className="relative break-inside-avoid overflow-hidden rounded-sm bg-muted cursor-zoom-in [content-visibility:auto] [contain-intrinsic-size:320px]"
                onClick={() => setSelectedImage({ url: image.imageUrl, caption: image.caption })}
              >
                <OptimizedImage 
                  src={image.imageUrl} 
                  alt={image.caption}
                  priority={index < 3}
                  defer={index >= 3}
                  maxWidth={thumbWidth}
                  quality={68}
                  className="w-full h-auto object-cover"
                />
                <div className="p-3 bg-card border-t border-border">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">
                    {image.category}
                  </span>
                  <p className="text-foreground text-sm font-medium mt-1 line-clamp-2">
                    {image.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground border border-dashed border-border rounded-sm">
            No gallery images available yet.
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent
          hideCloseButton
          className="flex w-auto max-w-[min(96vw,56rem)] max-h-[92vh] items-center justify-center p-0 gap-0 border-0 bg-transparent shadow-none overflow-visible"
        >
          <DialogTitle className="sr-only">{selectedImage?.caption}</DialogTitle>
          {selectedImage && (
            <figure className="relative m-0 inline-flex max-w-full flex-col overflow-hidden rounded-sm bg-black shadow-2xl">
              <OptimizedImage
                src={selectedImage.url}
                alt={selectedImage.caption}
                priority
                shrinkToFit
                maxWidth={lightboxWidth}
                quality={76}
                className="block max-h-[80vh] max-w-full w-auto h-auto object-contain"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pb-4 pt-10 text-center pointer-events-none">
                <p className="text-white text-sm md:text-base font-medium leading-snug">
                  {selectedImage.caption}
                </p>
              </figcaption>
              <DialogClose
                className="absolute top-2 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </DialogClose>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

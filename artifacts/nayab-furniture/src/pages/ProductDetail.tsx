import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone } from "lucide-react";
import { getGetProductQueryOptions } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ApiErrorState } from "@/components/ApiErrorState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { whatsappUrl } from "@/lib/site";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = Number(params?.id);

  const { data: product, isLoading, isError, refetch } = useQuery({
    ...getGetProductQueryOptions(id > 0 ? id : 0),
    enabled: Number.isFinite(id) && id > 0,
  });

  if (!Number.isFinite(id) || id <= 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold mb-4">Invalid product</h1>
        <Link href="/products" className="text-primary hover:underline">
          Back to collections
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-sm" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to collections
        </Link>
        <ApiErrorState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-square overflow-hidden rounded-sm bg-muted border border-border">
            <OptimizedImage
              src={product.imageUrl}
              alt={product.name}
              priority
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                Featured
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
                {product.name}
              </h1>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            <div className="text-2xl font-bold text-foreground">
              {product.priceLabel}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={whatsappUrl(
                  `Hi, I'm interested in the ${product.name} (${product.priceLabel})`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Phone className="h-4 w-4" /> Inquire on WhatsApp
              </a>
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto">
                  Send a Message
                </Button>
              </Link>
            </div>

            <div className="border-t border-border pt-6 text-sm text-muted-foreground space-y-2">
              <p>✓ Solid wood construction with 20-year workmanship guarantee</p>
              <p>✓ Custom sizing and finishes available on request</p>
              <p>✓ Free consultation at our Hayatabad showroom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

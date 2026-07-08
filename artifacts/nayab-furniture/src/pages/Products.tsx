import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Search, Filter, Phone, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiErrorState } from "@/components/ApiErrorState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { whatsappUrl } from "@/lib/site";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setActiveCategory(searchParams.get("category") || "");
  }, [location]);

  const { data: allProducts, isLoading, isError, refetch } = useListProducts({});

  const categoryProducts =
    allProducts?.filter(
      (p) => !activeCategory || p.category === activeCategory,
    ) ?? [];

  const filteredProducts =
    categoryProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const categories = [
    "All",
    "Sofa Sets", 
    "Bed Sets", 
    "Dining Tables", 
    "Dressing Tables", 
    "Coffee Tables", 
    "Kitchen Cabinets", 
    "Wedding Packages",
    "Other",
  ];

  const showSkeleton = isLoading && !allProducts;

  const selectValue = activeCategory || "All";

  return (
    <div className="flex-1 w-full bg-background min-h-screen pb-20">
      <div className="bg-card py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-card-foreground mb-4">Our Collections</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Explore our range of handcrafted furniture, designed to bring affordable luxury to your home.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile filters */}
          <div className="lg:hidden space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Category
              </label>
              <Select
                value={selectValue}
                onValueChange={(val) => setActiveCategory(val === "All" ? "" : val)}
              >
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0 space-y-8">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9 bg-card border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat === "All" ? "" : cat)}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                        (cat === "All" && activeCategory === "") || activeCategory === cat
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card p-6 rounded-sm border border-border">
              <h4 className="font-serif font-bold mb-2">Custom Request?</h4>
              <p className="text-sm text-muted-foreground mb-4">We build custom dimensions and finishes to match your exact vision.</p>
              <a 
                href={whatsappUrl()} 
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-2 rounded-sm text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                <Phone className="h-4 w-4" /> Discuss on WhatsApp
              </a>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {showSkeleton ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-sm" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <ApiErrorState onRetry={() => refetch()} />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-card border border-border rounded-sm overflow-hidden fine-hover:hover:shadow-md flex flex-col">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <OptimizedImage 
                          src={product.imageUrl} 
                          alt={product.name} 
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover"
                        />
                        {product.featured && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                            Featured
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4 md:p-5 flex flex-col flex-1">
                      <Link href={`/products/${product.id}`}>
                        <div className="text-xs font-semibold tracking-wider text-primary uppercase mb-1">
                          {product.category}
                        </div>
                        <h4 className="font-serif text-lg md:text-xl font-bold text-card-foreground mb-2 line-clamp-2">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border gap-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          Call for Price
                        </span>
                        <a
                          href={whatsappUrl(`Hi, I'd like to know the price for ${product.name}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 shrink-0"
                        >
                          Inquire <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card border border-border rounded-sm">
                <h3 className="font-serif text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground text-sm">We couldn't find any products matching your current filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => { setActiveCategory(""); setSearchQuery(""); }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

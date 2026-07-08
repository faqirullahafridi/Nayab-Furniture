import { Link } from "wouter";
import { ArrowRight, CheckCircle2, ChevronRight, Phone, Star } from "lucide-react";
import { useListProducts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiErrorState } from "@/components/ApiErrorState";
import { OptimizedImage } from "@/components/OptimizedImage";
import { whatsappUrl } from "@/lib/site";

export default function Home() {
  const { data: featuredProducts, isLoading, isError, refetch } = useListProducts({ featured: true });

  const categories = [
    { name: "Sofa Sets", desc: "Luxurious seating for family gatherings", image: "/hero-living-room.jpg" },
    { name: "Bed Sets", desc: "Hand-carved elegance for restful nights", image: "/craftsman-detail.jpg" }, // Use a different image if possible, but craftsman is ok for now, or fallback to an icon.
    { name: "Dining Tables", desc: "Solid walnut pieces to anchor your dining room", image: "/dining-room.jpg" },
    { name: "Kitchen Cabinets", desc: "Custom fittings with premium brass hardware", image: "/kitchen-cabinets.jpg" },
    { name: "Wedding Packages", desc: "Complete home setups for the new couple", image: "/hero-living-room.jpg" },
  ];

  return (
    <div className="flex-1 w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <OptimizedImage 
            src="/hero-living-room.jpg" 
            alt="Luxurious Nayab Furniture Living Room" 
            priority
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-20 mx-auto px-4 text-center text-white pt-20">
          <span className="inline-block py-1 px-3 mb-6 border border-white/30 rounded-full text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-sm bg-white/10">
            Peshawar's Premier Woodworkers
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
            Handcrafted Luxury for the <span className="italic text-primary">Generations</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            Old-world woodworking craftsmanship delivered at honest prices. Beautiful, durable, and guaranteed for 20 years.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/products" 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 min-w-[200px] justify-center"
            >
              Explore Collections <ArrowRight className="h-4 w-4" />
            </Link>
            <a 
              href={whatsappUrl()} 
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2 min-w-[200px] justify-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
              <OptimizedImage 
                src="/craftsman-detail.jpg" 
                alt="Master woodworker chiseling dark walnut wood" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-white font-serif text-xl">"True craftsmanship isn't just about how it looks, but how long it lasts."</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] text-primary uppercase mb-3">Our Promise</h2>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                  The Art of <br />Fine Woodworking
                </h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At Nayab Furniture, we don't assemble pieces; we craft heirlooms. Using premium walnut and robust hardwoods, our artisans spend hours perfecting every joint, curve, and finish.
              </p>
              
              <ul className="space-y-4 pt-4">
                {[
                  "Solid wood construction with zero compromises",
                  "20-Year Workmanship Guarantee on all products",
                  "Hand-applied finishes that enrich with age",
                  "Custom sizing available for Peshawar homes"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6">
                <Link href="/about" className="inline-flex items-center gap-2 text-foreground font-bold hover:text-primary transition-colors pb-1 border-b-2 border-primary/30 hover:border-primary">
                  Read Our Story <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.2em] text-primary uppercase mb-3">Masterpieces</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-card-foreground">
                Featured Collections
              </h3>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium">
              View All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-sm border border-border bg-background">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="col-span-full">
                <ApiErrorState onRetry={() => refetch()} />
              </div>
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 6).map((product) => (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background shadow-sm fine-hover:hover:shadow-md"
                >
                  <Link href={`/products/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-muted">
                    <OptimizedImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-sm bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
                      {product.category}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="font-serif text-xl font-bold text-white md:text-2xl">
                        {product.name}
                      </h4>
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                      >
                        View details
                      </Link>
                      <a
                        href={whatsappUrl(`Hi, I'd like to know the price for ${product.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-sm bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call for Price
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Check back soon for our featured masterpieces.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories / Services Overview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-primary uppercase mb-3">Our Expertise</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Everything Your Home Needs
            </h3>
            <p className="text-muted-foreground">From a single statement coffee table to a complete bridal furniture package, we bring warmth and elegance to every corner of your home.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`group flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-sm fine-hover:hover:shadow-md ${i === 0 || i === 3 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className={`overflow-hidden ${i === 0 || i === 3 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                  <OptimizedImage 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <h4 className="font-serif text-2xl font-bold text-foreground mb-2">{cat.name}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{cat.desc}</p>
                  <span className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
            
            <div className="group relative overflow-hidden rounded-sm aspect-[4/3] bg-primary flex flex-col items-center justify-center p-8 text-center text-primary-foreground hover:bg-primary/90 transition-colors">
              <h4 className="font-serif text-2xl font-bold mb-4">Furniture Fitting & Repair</h4>
              <p className="text-primary-foreground/80 text-sm mb-6">Expert restoration for your beloved wooden pieces.</p>
              <Link href="/contact" className="bg-background text-foreground px-6 py-2 rounded-sm font-medium text-sm hover:bg-background/90 transition-colors">
                Book a Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-background mb-6 leading-tight">
            Ready to transform your space?
          </h2>
          <p className="text-background/80 text-lg mb-10 font-light">
            Visit our Hayatabad showroom to feel the quality of our craftsmanship in person, or reach out on WhatsApp to discuss custom designs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={whatsappUrl()} 
              target="_blank" rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              Message us on WhatsApp
            </a>
            <Link 
              href="/contact" 
              className="bg-transparent border border-background/30 text-background px-8 py-4 rounded-sm font-medium hover:bg-background/10 transition-colors w-full sm:w-auto"
            >
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from "wouter";
import { ArrowRight, Award, ShieldCheck, HeartHandshake, Clock } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

export default function About() {
  const values = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Master Craftsmanship",
      description: "Every joint, polish, and curve is executed by artisans with decades of woodworking experience."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "20-Year Guarantee",
      description: "We stand by our work. Our structural integrity and materials are guaranteed to last generations."
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-primary" />,
      title: "Honest Pricing",
      description: "Affordable luxury means transparent pricing without the massive markups of corporate showrooms."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "On-Time Delivery",
      description: "We respect your time. Especially for wedding packages, we ensure everything is ready when promised."
    }
  ];

  return (
    <div className="flex-1 w-full bg-background pb-20">
      {/* Page Header */}
      <div className="bg-card py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-card-foreground mb-4">Our Story</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A legacy of woodworking excellence on Ring Road, Hayatabad, Peshawar.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">The Nayab Heritage</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
              Peshawar's most trusted family of woodworkers.
            </h3>
            
            <div className="space-y-4 text-muted-foreground text-lg font-light leading-relaxed">
              <p>
                Founded on the principles of integrity and unparalleled craftsmanship, Nayab Furniture has been a fixture on Ring Road, Hayatabad for years. We are a family-run atelier dedicated to the art of fine woodworking.
              </p>
              <p>
                We believe that furniture is not just functional—it is the backdrop to your family's memories. That's why we reject mass-produced, flimsy alternatives in favor of solid hardwoods, intricate hand-carving, and meticulous finishing.
              </p>
              <p>
                From serving individual homeowners looking for that perfect statement piece to outfitting entire homes with our comprehensive wedding packages, our mission remains the same: <strong className="text-foreground font-medium">Affordable luxury delivered at honest prices.</strong>
              </p>
            </div>

            <div className="pt-6">
              <OptimizedImage 
                src="/hero-living-room.jpg" 
                alt="Our craftsmanship" 
                className="w-full h-48 object-cover rounded-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-card p-8 rounded-sm border border-border shadow-sm">
                <div className="mb-4 bg-background w-16 h-16 rounded-full flex items-center justify-center border border-primary/20">
                  {value.icon}
                </div>
                <h4 className="font-serif text-xl font-bold mb-3">{value.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-32 bg-foreground text-background p-12 md:p-16 rounded-sm text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Experience the difference</h2>
          <p className="text-background/80 max-w-2xl mx-auto mb-8 text-lg font-light">
            Visit our showroom in Hayatabad to smell the polished wood and feel the sturdy craftsmanship that only Nayab Furniture provides.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/gallery" 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              View Our Showcase <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border border-background/30 text-background px-8 py-3 rounded-sm font-medium hover:bg-background/10 transition-all"
            >
              Visit Showroom
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

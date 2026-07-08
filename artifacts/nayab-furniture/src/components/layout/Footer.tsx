import { Link, useLocation } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SITE, whatsappUrl } from "@/lib/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-14 w-[72px]" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-wide uppercase leading-none">Nayab</span>
                <span className="text-[10px] text-primary font-medium tracking-[0.2em] uppercase leading-none mt-1">Furniture</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Family-run for years, offering old-world woodworking craftsmanship delivered at honest prices for Peshawar homes. Affordable luxury that lasts generations.
            </p>
            <div className="pt-2 border-t border-border inline-block">
              <p className="font-serif italic text-primary">20-Year Workmanship Guarantee</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-semibold tracking-wide uppercase">Collections</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products?category=Sofa Sets" className="text-muted-foreground hover:text-primary transition-colors">Sofa Sets</Link></li>
              <li><Link href="/products?category=Bed Sets" className="text-muted-foreground hover:text-primary transition-colors">Bed Sets</Link></li>
              <li><Link href="/products?category=Dining Tables" className="text-muted-foreground hover:text-primary transition-colors">Dining Tables</Link></li>
              <li><Link href="/products?category=Wedding Packages" className="text-muted-foreground hover:text-primary transition-colors">Wedding Packages</Link></li>
              <li><Link href="/products" className="text-primary font-medium hover:underline transition-colors mt-2 inline-block">View All Products &rarr;</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-semibold tracking-wide uppercase">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Showcase</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-semibold tracking-wide uppercase">Visit Us</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SITE.address.line1}, {SITE.address.line2}, {SITE.address.region}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={whatsappUrl()} className="hover:text-primary transition-colors">{SITE.whatsappDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors">{SITE.email}</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} Nayab Furniture. All rights reserved.</p>
          <p>Handcrafted in Peshawar.</p>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Show, useClerk } from "@clerk/react";
import { SITE, whatsappUrl } from "@/lib/site";
import { useRoutePrefetch } from "@/hooks/use-route-prefetch";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { prefetchRoute } = useRoutePrefetch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "Our Story" },
    { href: "/products", label: "Collections" },
    { href: "/gallery", label: "Showcase" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,box-shadow] duration-200 ease-out border-b border-transparent",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-border py-2 shadow-sm"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <Logo className="h-14 sm:h-16 w-[72px] sm:w-[88px]" />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-foreground uppercase leading-none">
                Nayab
              </span>
              <span className="text-[10px] md:text-xs text-primary font-medium tracking-[0.2em] uppercase leading-none mt-1">
                Furniture
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-primary relative py-2",
                  location === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-6 rounded-md"
            >
              <Phone className="h-4 w-4" />
              <span>{SITE.whatsappDisplay}</span>
            </a>
            
            <Show when="signed-in">
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
                <Link 
                  href="/admin" 
                  className="text-xs font-semibold text-primary hover:text-primary/80 uppercase tracking-wider"
                >
                  Admin
                </Link>
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
            </Show>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => {
              if (!mobileMenuOpen) {
                prefetchRoute("/products");
                prefetchRoute("/gallery");
              }
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col py-4 px-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                onTouchStart={() => prefetchRoute(link.href)}
                className={cn(
                  "text-lg font-serif py-2 border-b border-border/50",
                  location === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 text-primary font-medium"
            >
              <Phone className="h-5 w-5" />
              <span>WhatsApp: {SITE.whatsappDisplay}</span>
            </a>
            
            <Show when="signed-in">
              <div className="pt-4 mt-2 border-t border-border flex flex-col space-y-4">
                <Link 
                  href="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-primary uppercase tracking-wider"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut({ redirectUrl: "/" });
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-semibold text-left text-muted-foreground uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
            </Show>
          </nav>
        </div>
      )}
    </header>
  );
}

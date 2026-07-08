import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background selection:bg-primary/20 selection:text-foreground">
      <Navbar />
      <main className="flex-1 pt-20 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}

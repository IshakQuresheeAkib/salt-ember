import { Menu } from "@/components/menu";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background pb-20 text-foreground desktop:pb-0">
      <HeroSection />

      <Menu />

      <Testimonials />

      <Footer />
      <MobileBottomNav />
    </main>
  );
}

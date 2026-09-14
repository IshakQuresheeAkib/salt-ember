import { Menu } from "@/components/menu";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <HeroSection />

      <Menu />

      <Testimonials />

      <Footer />
    </main>
  );
}

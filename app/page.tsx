import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AboutSection } from "@/components/sections/about-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { MenuSection } from "@/components/sections/menu-section";
import { ReservationsSection } from "@/components/sections/reservations-section";
import { SignatureDishes } from "@/components/sections/signature-dishes";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <MarqueeStrip />
        <SignatureDishes />
        <AboutSection />
        <MenuSection />
        <GallerySection />
        <TestimonialsSection />
        <ReservationsSection />
      </main>
      <Footer />
    </>
  );
}

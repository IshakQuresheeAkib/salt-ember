import Image from "next/image";
import { HeroFoodSelector } from "@/components/hero-food-selector";
import { HeritageMenu } from "@/components/heritage-menu";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import TestimonialsSection from "@/components/ui/testimonial-v2";

const logoUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/725861508_122133968169161286_5477338884146038255_n-TRM8WIjzHsUOLTgcgfXoTLlJMPd63v.jpg";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="site-header content-shell content-shell--wide">
        <a href="#top" className="brand-mark" aria-label="Salt and Ember home">
          <Image
            src={logoUrl}
            alt="Salt & Ember logo"
            width={200}
            height={200}
            className="object-contain mix-blend-multiply"
            priority
          />
        </a>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          <a className="nav-link active" href="#top">
            Home
          </a>
          <a className="nav-link" href="#menu">
            Menu
          </a>
          <a className="nav-link" href="#testimonials">
            Reviews
          </a>
          <a className="nav-link" href="#contact">
            Contact
          </a>
        </nav>
        <details className="mobile-navigation">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="#top">Home</a>
            <a href="#menu">Menu</a>
            <a href="#testimonials">Reviews</a>
            <a href="#contact">Contact</a>
          </nav>
        </details>
      </header>

      <section id="top" className="hero content-shell content-shell--hero">
        <div className="hero-copy">
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.08}
            blockColor="var(--flameburst-orange)"
          >
            <p className="hero-kicker">Savor the taste of Perfection</p>
          </TextBlockAnimation>
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.16}
            blockColor="var(--flameburst-orange)"
            duration={0.75}
          >
            <h1 className="font-heading">
              It’s not just food;
              <br />
              <em>it’s an experience</em>
            </h1>
          </TextBlockAnimation>
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.3}
            blockColor="var(--flameburst-orange)"
          >
            <p className="hero-intro">
              Where authentic taste meets modern dining — experience freshness,
              tradition, and a touch of luxury in every meal.
            </p>
          </TextBlockAnimation>
          <div className="hero-actions">
            <a className="primary-button" href="#menu">
              Explore the menu <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-button" href="#contact">
              Get in touch
            </a>
          </div>
          <div className="hero-contact">
            <div className="socials" aria-label="Social links">
              <a href="#contact" aria-label="Twitter">
                tw
              </a>
              <a href="#contact" aria-label="Facebook">
                f
              </a>
              <a href="#contact" aria-label="TikTok">
                tk
              </a>
              <a href="#contact" aria-label="Instagram">
                ig
              </a>
            </div>
            <span>+20 654 87 432</span>
          </div>
        </div>
        <HeroFoodSelector />
      </section>

      <HeritageMenu />

      <TestimonialsSection />

      <footer
        id="contact"
        className="footer content-shell content-shell--wide"
      >
        <div className="footer-top">
          <div>
            <a className="footer-brand" href="#top">
              Salt <i>&</i> Ember
            </a>
            <p>
              Come for the fire.
              <br />
              Stay for the flavour.
            </p>
          </div>
          <div>
            <p className="footer-label">Find us</p>
            <p>
              27 Amber Lane
              <br />
              Sylhet, Bangladesh
            </p>
          </div>
          <div>
            <p className="footer-label">Say hello</p>
            <a href="mailto:hello@saltandember.com">hello@saltandember.com</a>
            <br />
            <a href="tel:+8801712345678">+880 1712 345 678</a>
          </div>
          <div>
            <p className="footer-label">Follow along</p>
            <div className="socials">
              <a href="#contact" aria-label="Instagram">
                ig
              </a>
              <a href="#contact" aria-label="Facebook">
                fb
              </a>
              <a href="#contact" aria-label="TikTok">
                tk
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Salt & Ember</span>
          <span>Made for long lunches and late nights.</span>
        </div>
      </footer>
    </main>
  );
}

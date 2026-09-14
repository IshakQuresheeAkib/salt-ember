import Image from "next/image";
import { HeroFoodSelector } from "@/components/hero-food-selector";
import { HeritageMenu } from "@/components/heritage-menu";
import {
  SocialTooltip,
} from "@/components/ui/social-media";
import {
  SALT_AND_EMBER_MOBILE_NUMBER,
  SALT_AND_EMBER_MOBILE_TEL,
  SOCIAL_MEDIA_LINKS,
} from "@/lib/constants/social-media";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import TestimonialsSection from "@/components/ui/testimonial-v2";
import { Beef, MapPinned, PartyPopper, Sparkles } from "lucide-react";
import logo from "@/public/logo.webp"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section id="top" className="hero content-shell--hero">
        <header className="site-header content-shell content-shell--wide">
          <a href="#top" className="brand-mark" aria-label="Salt and Ember home">
            <Image
              src={logo}
              alt="Salt & Ember logo"
              width={200}
              height={200}
              className="object-contain mix-blend-multiply rotate-45"
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
          <a
            className="navbar-location"
            href="https://maps.app.goo.gl/qBEyyTSasUwqyaRs5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Salt & Ember's location in Google Maps"
          >
            <MapPinned className="navbar-location__pin" aria-hidden="true" />
          </a>
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

        <div className="hero-layout content-shell content-shell--hero">
          <div className="hero-copy">
          <TextBlockAnimation
            animateOnScroll={false}
            delay={0.16}
            blockColor="var(--flameburst-orange)"
            duration={0.75}
          >
            <h1 className="font-heading display-title">
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
              <span className="hero-intro__line">
                <Sparkles className="hero-intro__icon" aria-hidden="true" />
                Modern Family-Friendly Steakhouse
              </span>
              <span className="hero-intro__line">
                <Beef className="hero-intro__icon" aria-hidden="true" />
                Steaks • Continental • Thai &amp; Chinese • Seafood &amp; More
              </span>
              <span className="hero-intro__line">
                <PartyPopper className="hero-intro__icon" aria-hidden="true" />
                Family Dining | Parties | Wedding &amp; Corporate Events
              </span>
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
            <SocialTooltip
              className="hero-social-links"
              items={SOCIAL_MEDIA_LINKS}
              aria-label="Social and contact links"
            />
          </div>
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
              <a
                href="https://maps.app.goo.gl/qBEyyTSasUwqyaRs5"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baruthkhana Point, East Zindabazar
                <br />
                Sylhet, Bangladesh
              </a>
            </p>
          </div>
          <div>
            <p className="footer-label">Say hello</p>
            <a href={SALT_AND_EMBER_MOBILE_TEL}>
              {SALT_AND_EMBER_MOBILE_NUMBER}
            </a>
            <br />
            <a
              href="https://wa.me/8801704083376"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </a>
          </div>
          <div>
            <p className="footer-label">Follow along</p>
            <SocialTooltip
              className="footer-social-links"
              items={SOCIAL_MEDIA_LINKS}
              aria-label="Social and contact links"
            />
          </div>
        </div>
      </footer>
    </main>
  );
}

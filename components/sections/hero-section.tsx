import { HeroFoodOrbit } from "@/components/sections/hero-food-orbit";
import { heroOrbitItems } from "@/lib/constants/menu";

export function HeroSection() {
  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="content-shell hero-grid">
        <div className="hero-copy">
          <p className="hero-location">Sylhet, Bangladesh</p>
          <h1
            id="hero-title"
            className="hero-title font-heading"
            aria-label="Flavour meets fire."
          >
            <span>Flavour meets </span>
            <em>fire.</em>
          </h1>
          <p className="hero-intro">
            A fire-led dining room in Sylhet, built around generous plates, bright
            ingredients, and the pleasure of staying awhile.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="button-primary" href="#menu">
              Explore the menu
              <span aria-hidden="true">↓</span>
            </a>
            <a className="button-secondary" href="#reservations">
              Reserve a table
            </a>
          </div>
        </div>

        <HeroFoodOrbit items={heroOrbitItems} />
      </div>
    </section>
  );
}

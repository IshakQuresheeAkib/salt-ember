import Image from "next/image";

import { restaurantDetails } from "@/lib/constants/restaurant";

export function HeroSection() {
  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="content-shell hero-grid">
        <div className="hero-copy">
          <p className="hero-location">Sylhet, Bangladesh</p>
          <h1 id="hero-title" className="hero-title font-heading">
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

        <figure className="hero-image-frame">
          <div className="hero-heat" aria-hidden="true" />
          <div className="ember-seam" aria-hidden="true" />
          <Image
            src={restaurantDetails.heroImage.src}
            alt={restaurantDetails.heroImage.alt}
            width={1200}
            height={1500}
            sizes="(max-width: 767px) 100vw, 48vw"
            className="h-full w-full object-cover"
            priority
          />
          <figcaption className="hero-caption">
            Provisional image · final restaurant photography pending
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

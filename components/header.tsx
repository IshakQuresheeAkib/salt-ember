import Image from "next/image";
import { MapPinned } from "lucide-react";

import logo from "@/public/logo.webp";

export function Header() {
  return (
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
  );
}

import Image from "next/image";
import { HeroFoodSelector } from "@/components/hero-food-selector";
import { HeritageMenu } from "@/components/heritage-menu";

const logoUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/725861508_122133968169161286_5477338884146038255_n-TRM8WIjzHsUOLTgcgfXoTLlJMPd63v.jpg";

const testimonials = [
  [
    "Maya Rahman",
    "The food tastes like a warm evening around a real fire. Every plate had a point of view.",
  ],
  [
    "Arif Chowdhury",
    "A beautiful room, generous service, and the kind of flavors you talk about on the way home.",
  ],
  [
    "Nadia Khan",
    "Salt & Ember made our ordinary Friday feel like an occasion. The ramen is unforgettable.",
  ],
];

function BracketTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="bracket-title font-heading text-balance">{children}</h2>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="site-header content-shell content-shell--wide">
        <a href="#top" className="brand-mark" aria-label="Salt and Ember home">
          <Image
            src={logoUrl}
            alt="Salt & Ember logo"
            width={120}
            height={72}
            className="h-12 w-auto object-contain mix-blend-multiply"
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
          <a className="nav-link" href="#story">
            About Us
          </a>
          <a className="nav-link" href="#menu">
            Menu
          </a>
          <a className="nav-link" href="#contact">
            Reviews
          </a>
          <a className="nav-link" href="#contact">
            Contacts
          </a>
        </nav>
      </header>

      <section id="top" className="hero content-shell content-shell--hero">
        <div className="hero-copy">
          <p className="hero-kicker">Savor the taste of Perfection</p>
          <h1 className="font-heading">
            Its not just food,
            <br />
            <em>its an experience</em>
          </h1>
          <p className="hero-intro">
            Where authentic taste meets modern dining — experience freshness,
            tradition, and a touch of luxury in every meal.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#menu">
              Order now <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-button" href="#contact">
              Book a menu
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

      <section id="story" className="story-band">
        <div className="content-shell content-shell--wide story-grid">
          <div className="story-image">
            <Image
              src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85"
              alt="Fresh ingredients arranged on a kitchen counter"
              width={800}
              height={700}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="story-copy">
            <p className="eyebrow">Our philosophy</p>
            <BracketTitle>
              Made with <em>heat</em>,<br />
              served with heart.
            </BracketTitle>
            <p>
              Salt & Ember is a place for food with a little edge. We cook over
              flame, follow the seasons, and borrow the best ideas from every
              table we have loved.
            </p>
            <a className="text-link" href="#contact">
              Meet the people behind it <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section content-shell content-shell--comfort">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The word around town</p>
            <BracketTitle>
              What they <em>say</em>
            </BracketTitle>
          </div>
        </div>
        <div className="testimonial-grid">
          {testimonials.map(([name, quote]) => (
            <figure className="testimonial" key={name}>
              <div className="stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote>“{quote}”</blockquote>
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

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

import Image from "next/image";

const logoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/725861508_122133968169161286_5477338884146038255_n-TRM8WIjzHsUOLTgcgfXoTLlJMPd63v.jpg";

const dishes = [
  { name: "Charred miso ramen", detail: "Slow broth, smoked egg, spring onion", price: "$18", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85" },
  { name: "Ember chicken", detail: "Coal-roasted thigh, ember glaze, herbs", price: "$24", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85" },
  { name: "Fire-roasted pizza", detail: "Tomato, fior di latte, basil oil", price: "$19", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85" },
  { name: "Market greens", detail: "Crisp garden vegetables, tahini, lime", price: "$14", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85" },
];

const testimonials = [
  ["Maya Rahman", "The food tastes like a warm evening around a real fire. Every plate had a point of view."],
  ["Arif Chowdhury", "A beautiful room, generous service, and the kind of flavors you talk about on the way home."],
  ["Nadia Khan", "Salt & Ember made our ordinary Friday feel like an occasion. The ramen is unforgettable."],
];

function BracketTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="bracket-title font-heading text-balance">{children}</h2>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="site-header">
        <a href="#top" className="brand-mark" aria-label="Salt and Ember home">
          <Image src={logoUrl} alt="Salt & Ember logo" width={100} height={62} className="h-12 w-auto object-contain mix-blend-screen" priority />
          <span>Salt <i>&</i> Ember</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          <a className="nav-link active" href="#top">Home</a>
          <a className="nav-link" href="#menu">Menu</a>
          <a className="nav-link" href="#story">Our story</a>
          <a className="nav-link" href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="header-action">Reserve a table <span aria-hidden="true">↗</span></a>
      </header>

      <section id="top" className="hero content-shell">
        <div className="hero-copy">
          <p className="eyebrow">A restaurant for the curious</p>
          <h1 className="font-heading">Good food.<br /><em>Great fire.</em></h1>
          <p className="hero-intro">We bring the warmth of the flame to everything we do. Local ingredients, global instincts, and a table made for staying awhile.</p>
          <a className="primary-button" href="#menu">Explore our menu <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-art">
          <div className="hero-orbit" aria-hidden="true" />
          <Image src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90" alt="A bowl of noodles topped with a soft egg and herbs" width={900} height={900} className="hero-dish" priority />
          <div className="hero-caption"><span>01</span><span>Flavour<br />meets fire</span></div>
        </div>
      </section>

      <section className="offer content-shell" aria-label="Current offer">
        <div><strong>Good food and a little<br className="hidden sm:block" /> extra joy.</strong><span className="offer-note">A table full of reasons to come back.</span></div>
        <div className="offer-number"><b>20%</b><span>off your first<br />visit</span></div>
        <a href="#contact" className="round-arrow" aria-label="Claim offer">↗</a>
      </section>

      <section id="menu" className="section content-shell">
        <div className="section-heading"><div><p className="eyebrow">From our kitchen</p><BracketTitle>Our best <em>served</em></BracketTitle></div><a className="text-link" href="#contact">See full menu <span aria-hidden="true">↗</span></a></div>
        <div className="dish-grid">{dishes.map((dish) => <article className="dish-card" key={dish.name}><div className="dish-image"><Image src={dish.image} alt={dish.name} width={500} height={360} sizes="(max-width: 768px) 90vw, 25vw" /></div><div className="dish-meta"><div><h3>{dish.name}</h3><p>{dish.detail}</p></div><strong>{dish.price}</strong></div></article>)}</div>
      </section>

      <section id="story" className="story-band">
        <div className="content-shell story-grid"><div className="story-image"><Image src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85" alt="Fresh ingredients arranged on a kitchen counter" width={800} height={700} sizes="(max-width: 768px) 100vw, 50vw" /></div><div className="story-copy"><p className="eyebrow">Our philosophy</p><BracketTitle>Made with <em>heat</em>,<br />served with heart.</BracketTitle><p>Salt & Ember is a place for food with a little edge. We cook over flame, follow the seasons, and borrow the best ideas from every table we have loved.</p><a className="text-link" href="#contact">Meet the people behind it <span aria-hidden="true">↗</span></a></div></div>
      </section>

      <section className="section content-shell"><div className="section-heading"><div><p className="eyebrow">The word around town</p><BracketTitle>What they <em>say</em></BracketTitle></div></div><div className="testimonial-grid">{testimonials.map(([name, quote]) => <figure className="testimonial" key={name}><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“{quote}”</blockquote><figcaption>{name}</figcaption></figure>)}</div></section>

      <footer id="contact" className="footer content-shell"><div className="footer-top"><div><a className="footer-brand" href="#top">Salt <i>&</i> Ember</a><p>Come for the fire.<br />Stay for the flavour.</p></div><div><p className="footer-label">Find us</p><p>27 Amber Lane<br />Sylhet, Bangladesh</p></div><div><p className="footer-label">Say hello</p><a href="mailto:hello@saltandember.com">hello@saltandember.com</a><br /><a href="tel:+8801712345678">+880 1712 345 678</a></div><div><p className="footer-label">Follow along</p><div className="socials"><a href="#contact" aria-label="Instagram">ig</a><a href="#contact" aria-label="Facebook">fb</a><a href="#contact" aria-label="TikTok">tk</a></div></div></div><div className="footer-bottom"><span>© 2025 Salt & Ember</span><span>Made for long lunches and late nights.</span></div></footer>
    </main>
  );
}

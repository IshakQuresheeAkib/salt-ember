import { navItems } from "@/lib/constants/nav";

export function Navbar() {
  return (
    <header className="site-header">
      <div className="content-shell flex min-h-18 items-center justify-between gap-5">
        <a className="brand-wordmark" href="#top" aria-label="Salt & Ember home">
          <span>Salt</span>
          <span className="brand-ampersand" aria-hidden="true">
            &
          </span>
          <span>Ember</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a className="nav-link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="button-primary nav-reserve" href="#reservations">
          Reserve a table
          <span aria-hidden="true">↘</span>
        </a>
        <a className="button-secondary nav-menu" href="#menu">
          Menu
        </a>
      </div>
    </header>
  );
}

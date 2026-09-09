import { navItems } from "@/lib/constants/nav";
import { restaurantDetails } from "@/lib/constants/restaurant";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-ash bg-ink py-16" aria-labelledby="contact-title">
      <div className="content-shell">
        <div className="grid gap-14 border-b border-ash pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-amber uppercase">
              Contact
            </p>
            <h2
              id="contact-title"
              className="max-w-lg font-heading text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-bone"
            >
              Find us in Sylhet.
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <div>
              <p className="footer-label">Visit</p>
              <address className="text-sm leading-7 text-smoke not-italic">
                {restaurantDetails.address}
                <br />
                {restaurantDetails.city}
              </address>
            </div>
            <div>
              <p className="footer-label">Talk to us</p>
              <div className="grid gap-2 text-sm text-smoke">
                <a className="footer-link" href={restaurantDetails.phoneHref}>
                  {restaurantDetails.phoneDisplay}
                </a>
                <a className="footer-link break-all" href={restaurantDetails.emailHref}>
                  {restaurantDetails.email}
                </a>
              </div>
            </div>
            <div>
              <p className="footer-label">Opening hours</p>
              <dl className="grid gap-4 text-sm text-smoke">
                {restaurantDetails.hours.map((entry) => (
                  <div key={entry.days}>
                    <dt className="text-bone">{entry.days}</dt>
                    <dd>{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <p className="my-8 max-w-2xl text-xs leading-6 text-smoke">
          Restaurant details shown here are sample content pending confirmation.
        </p>

        <div className="flex flex-col gap-8 border-t border-ash pt-8 text-xs text-smoke md:flex-row md:items-end md:justify-between">
          <div>
            <a className="brand-wordmark text-xl" href="#top" aria-label="Salt & Ember home">
              Salt <span className="brand-ampersand">&</span> Ember
            </a>
            <p className="mt-3">Come for the fire. Stay for the flavour.</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Footer navigation">
            {navItems.slice(1).map((item) => (
              <a className="footer-link" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <p>© 2026 Salt & Ember</p>
        </div>
      </div>
    </footer>
  );
}

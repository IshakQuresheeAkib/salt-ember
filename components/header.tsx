import Image from "next/image";
import { MapPinned } from "lucide-react";

import { AnimatedUnderlineLink } from "@/components/ui/draw-random-underline";
import { contentShellClassName } from "@/lib/tailwind";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.webp";

type NavigationItem = {
  href: "#top" | "#menu" | "#testimonials" | "#contact";
  label: string;
  isActive?: boolean;
};

const navigationItems: readonly NavigationItem[] = [
  { href: "#top", label: "Home", isActive: true },
  { href: "#menu", label: "Menu" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
] as const;

const navigationLinkClassName =
  "inline-flex min-h-8 min-w-8 items-center justify-center text-[clamp(12px,1.2vw,28px)] transition-colors duration-200";
const inactiveNavigationLinkClassName =
  "text-silver-mist hover:text-flameburst-orange";
const mobileNavigationLinkClassName =
  "rounded-[10px] px-[12.8px] py-[11.2px] text-[12.8px] text-silver-mist hover:bg-[color-mix(in_srgb,var(--flameburst-orange)_18%,transparent)] hover:text-flameburst-orange focus-visible:bg-[color-mix(in_srgb,var(--flameburst-orange)_18%,transparent)] focus-visible:text-flameburst-orange";
const headerClassName =
  "relative z-2 flex min-h-[clamp(64px,5vw,80px)] items-center justify-between mt-2 tablet:mt-4";
const desktopNavigationClassName =
  "hidden items-center gap-8 desktop:absolute desktop:left-1/2 desktop:flex desktop:-translate-x-1/2";
const mapLinkClassName =
  "navbar-location relative hidden min-h-12 min-w-12 items-center justify-center text-flameburst-orange isolate desktop:absolute desktop:top-[clamp(14px,1.8vw,24px)] desktop:right-[clamp(12px,1.5vw,24px)] desktop:inline-flex desktop:text-midnight-shadow hover:text-midnight-shadow focus-visible:text-midnight-shadow desktop:hover:text-flameburst-orange desktop:focus-visible:text-flameburst-orange";
const mobileMenuSummaryClassName =
  "flex min-h-8 cursor-pointer list-none items-center rounded-[10px] border border-flameburst-orange px-3.5 text-xs font-bold text-silver-mist marker:hidden group-open:text-flameburst-orange [&::-webkit-details-marker]:hidden";
const mobileNavigationClassName =
  "absolute top-[calc(100%_+_8px)] right-0 grid min-w-40 rounded-xl border border-flameburst-orange bg-surface p-[7.2px] opacity-0 shadow-[0_12px_28px_color-mix(in_srgb,var(--midnight-shadow)_42%,transparent)] scale-[0.97] origin-top-right transition-[opacity,transform] duration-[180ms] group-open:opacity-100 group-open:scale-100";

export function Header() {
  return (
    <header className={cn(contentShellClassName, headerClassName)}>
      <a href="#top" className="brand-mark" aria-label="Salt and Ember home">
        <Image
          src={logo}
          alt="Salt & Ember logo"
          width={200}
          height={200}
          className="mt-2.5 size-[72.8px] rotate-45 object-contain mix-blend-multiply"
          priority
        />
      </a>
      <nav
        className={desktopNavigationClassName}
        aria-label="Primary navigation"
      >
        {navigationItems.map((item) => (
          <AnimatedUnderlineLink
            key={item.href}
            active={item.isActive}
            className={cn(
              navigationLinkClassName,
              item.isActive
                ? "text-flameburst-orange"
                : inactiveNavigationLinkClassName,
            )}
            href={item.href}
          >
            {item.label}
          </AnimatedUnderlineLink>
        ))}
      </nav>
      <a
        className={mapLinkClassName}
        href="https://maps.app.goo.gl/qBEyyTSasUwqyaRs5"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Salt & Ember's location in Google Maps"
      >
        <MapPinned className="navbar-location__pin size-6 xl:size-9 2xl:size-10 text-flameburst-orange" aria-hidden="true" />
      </a>
      <details className="mobile-navigation group relative desktop:hidden">
        <summary className={mobileMenuSummaryClassName}>Menu</summary>
        <nav className={mobileNavigationClassName} aria-label="Mobile navigation">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              className={mobileNavigationLinkClassName}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}

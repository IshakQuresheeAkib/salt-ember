import Image from "next/image";
import { MapPinned } from "lucide-react";

import { AnimatedUnderlineLink } from "@/components/ui/draw-random-underline";
import { defaultNavItems } from "@/lib/constants/default-nav-items";
import { SALT_AND_EMBER_MAP_URL } from "@/lib/constants/social-media";
import { contentShellClassName } from "@/lib/tailwind";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.webp";

const navigationLinkClassName =
  "inline-flex min-h-8 min-w-8 items-center justify-center text-[clamp(12px,1.2vw,28px)] transition-colors duration-200";
const inactiveNavigationLinkClassName = "text-silver hover:text-orange";
const headerClassName =
  "relative z-2 flex min-h-[clamp(64px,5vw,80px)] items-center justify-between sm:mt-2 2xl:mt-4";
const desktopNavigationClassName =
  "hidden items-center gap-8 desktop:absolute desktop:left-1/2 desktop:flex desktop:-translate-x-1/2";
const mapLinkClassName =
  "navbar-location relative hidden min-w-8 items-center justify-center text-orange isolate hover:text-silver focus-visible:text-silver desktop:absolute desktop:top-[clamp(14px,1.1vw,24px)] desktop:right-[clamp(12px,1.5vw,24px)] desktop:inline-flex desktop:min-w-10 desktop:text-midnight-shadow desktop:hover:text-orange desktop:focus-visible:text-orange";

export function Header() {
  return (
    <header className={cn(contentShellClassName, headerClassName)}>
      <a href="#top" className="brand-mark" aria-label="Salt and Ember home">
        <Image
          src={logo}
          alt="Salt & Ember logo"
          width={200}
          height={200}
          className="mt-2.5 size-14 md:size-16 2xl:size-[4.8vw] rotate-45 object-contain mix-blend-multiply"
          priority
        />
      </a>
      <nav
        className={desktopNavigationClassName}
        aria-label="Primary navigation"
      >
        {defaultNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <AnimatedUnderlineLink
              key={item.href}
              active={item.isActive}
              className={cn(
                navigationLinkClassName,
                item.isActive ? "text-orange" : inactiveNavigationLinkClassName,
              )}
              href={item.href}
            >
              <Icon aria-hidden="true" className="mr-1.5 size-[1em] shrink-0" />
              <p>{item.label}</p>
            </AnimatedUnderlineLink>
          );
        })}
      </nav>
      <a
        className={mapLinkClassName}
        href={SALT_AND_EMBER_MAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Salt & Ember's location in Google Maps"
      >
        <MapPinned
          className="navbar-location__pin size-6 sm:size-7 xl:size-8 2xl:size-10 text-orange"
          aria-hidden="true"
        />
      </a>
    </header>
  );
}

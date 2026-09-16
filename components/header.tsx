import Image from "next/image";

import { AnimatedUnderlineLink } from "@/components/ui/draw-random-underline";
import { defaultNavItems } from "@/lib/constants/default-nav-items";
import { contentShellClassName } from "@/lib/tailwind";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.webp";

const navigationLinkClassName =
  "inline-flex min-h-8 min-w-8 items-center justify-center text-[clamp(12px,1.2vw,28px)] transition-colors duration-200";
const inactiveNavigationLinkClassName = "text-silver hover:text-orange";
const headerClassName =
  "relative z-2 flex min-h-[clamp(64px,5vw,80px)] items-center justify-between 2xl:mt-[0.2vw]";
const desktopNavigationClassName =
  "hidden items-center gap-8 desktop:absolute desktop:left-1/2 desktop:flex desktop:-translate-x-1/2";

export function Header() {
  return (
    <header className={cn(contentShellClassName, headerClassName)}>
      <a href="#top" className="brand-mark" aria-label="Salt and Ember home">
        <Image
          src={logo}
          alt="Salt & Ember logo"
          width={200}
          height={200}
          className="relative top-3 2xl:top-4 size-16 2xl:size-[4.8vw] rotate-45 object-contain mix-blend-multiply"
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
    </header>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

import TextBlockAnimation from "@/components/ui/text-block-animation";
import { chefs } from "@/lib/constants/chefs";
import { gsap } from "@/lib/gsap";
import {
  contentShellClassName,
  highlightedTextClassName,
  sectionHeadingClassName,
} from "@/lib/tailwind";
import { cn } from "@/lib/utils";

const chefSectionClassName = "relative py-[clamp(72px,9vw,132px)] overflow-hidden";
const chefIntroClassName =
  "mx-auto mt-4 max-w-2xl text-center text-[clamp(14px,13.12px+0.18vw,16px)] leading-[1.7] text-muted-foreground";

export function MeetTheChefs() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger: tailored mobile scroll triggers + desktop staggered entrance
  useGSAP(
    () => {
      const container = containerRef.current;
      const grid = cardsGridRef.current;
      if (!container || !grid) return;

      const shouldAnimate =
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!shouldAnimate) return;

      const mm = gsap.matchMedia();

      // Mobile devices (<640px): individual kinetic tilt, parallax depth, and optical-center ember glow
      mm.add("(max-width: 639px)", () => {
        const cards = grid.querySelectorAll<HTMLElement>(".chef-card-item");

        cards.forEach((card) => {
          const image = card.querySelector<HTMLElement>(".chef-card-img");
          const glow = card.querySelector<HTMLElement>(".chef-card-glow");

          // 1. Kinetic entrance with subtle 3D tilt
          gsap.fromTo(
            card,
            {
              autoAlpha: 0,
              y: 40,
              scale: 0.92,
              rotateX: 6,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.8,
              ease: "ember-out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                end: "top 42%",
                toggleActions: "play none none reverse",
              },
            },
          );

          // 2. Tactile depth: subtle portrait image parallax scrub
          if (image) {
            gsap.fromTo(
              image,
              {
                scale: 1.14,
                yPercent: -4,
              },
              {
                scale: 1.02,
                yPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              },
            );
          }

          // 3. Focal zone: active ember horizon glow when centered in mobile viewport
          if (glow) {
            gsap.fromTo(
              glow,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.35,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 62%",
                  end: "bottom 38%",
                  toggleActions: "play reverse play reverse",
                },
              },
            );
          }
        });
      });

      // Tablet & Desktop (>=640px): coordinated staggered entrance
      mm.add("(min-width: 640px)", () => {
        const cardElements = grid.querySelectorAll(".chef-card-item");

        gsap.fromTo(
          cardElements,
          {
            autoAlpha: 0,
            y: 36,
            scale: 0.95,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "ember-out",
            scrollTrigger: {
              trigger: grid,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="chefs"
      aria-labelledby="chefs-heading"
      className={chefSectionClassName}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[680px] rounded-full bg-orange/5 blur-[160px]"
      />

      <div className={cn(contentShellClassName, "relative z-10 flex flex-col items-center")}>
        {/* Section Header with Salt and Ember typography */}
        <div className="mx-auto max-w-4xl text-center">
          <TextBlockAnimation>
            <h2 id="chefs-heading" className={sectionHeadingClassName}>
              Meet The <span className={highlightedTextClassName}>Chefs</span>
            </h2>
          </TextBlockAnimation>
          <p className={chefIntroClassName}>
            The culinary visionaries orchestrating our woodfire hearth. Honoring
            ancestral charcoal techniques, seasonal marinades, and artisanal smoke.
          </p>
        </div>

        {/* 4 Chefs Responsive Grid with standard spacing and compact proportions */}
        <div
          ref={cardsGridRef}
          className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5 xl:gap-6 w-full max-w-[1240px] mx-auto"
        >
          {chefs.map((chef) => (
            <article
              key={chef.id}
              className="chef-card-item group relative flex flex-col justify-end aspect-[3/3.7] sm:aspect-[3/3.8] lg:aspect-[3/3.9] min-h-[290px] sm:min-h-[350px] lg:min-h-[380px] xl:min-h-[400px] w-full max-w-[290px] xs:max-w-[310px] sm:max-w-none mx-auto overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border border-white/10 bg-midnight-shadow shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-orange/60 hover:shadow-[0_22px_50px_rgba(227,100,20,0.18)] [perspective:1000px]"
            >
              {/* Full-bleed Portrait Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={chef.image}
                  alt={`Portrait of Chef ${chef.name}, ${chef.title}`}
                  fill
                  sizes="(max-width: 640px) 310px, (max-width: 1024px) 50vw, 25vw"
                  className="chef-card-img object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={chef.id === "ashraf-al-mansur"}
                />
              </div>

              {/* Dynamic Ember Horizon Glow for Mobile Viewport Focal Zone */}
              <div
                aria-hidden="true"
                className="chef-card-glow pointer-events-none absolute inset-0 z-15 opacity-0 rounded-[inherit] ring-1 ring-orange/60 shadow-[inset_0_0_24px_rgba(227,100,20,0.22)]"
              />

              {/* Progressive blurred gradient overlay (heavier blur at bottom, smoothly decreasing upward) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] z-10 backdrop-blur-md [mask-image:linear-gradient(to_top,black_0%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] z-10 backdrop-blur-xl [mask-image:linear-gradient(to_top,black_20%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_20%,transparent_100%)]"
              />

              {/* Ambient dark gradient scrim for contrast and legibility */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] z-10 bg-gradient-to-t from-midnight-shadow/95 via-midnight-shadow/55 to-transparent"
              />

              {/* Bottom Content: Chef Name and Title */}
              <div className="relative z-20 flex flex-col p-4 sm:p-5 lg:p-5 text-left">
                <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm transition-colors duration-300 group-hover:text-silver">
                  {chef.name}
                </h3>
                <p className="mt-0.5 text-xs sm:text-[13px] font-semibold tracking-wide text-orange">
                  {chef.title}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

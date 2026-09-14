"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  getFanEntryOffsetRem,
  getHoveredFanPositions,
  getInitialFanCenter,
  getResponsiveFanPosition,
  getVisibleFanSlots,
  MAX_VISIBLE_FAN_CARDS,
} from "@/lib/card-fan-carousel-layout";
import { cn } from "@/lib/utils";

export interface CardItem {
  alt?: string;
  imgUrl: string;
  linkUrl?: string;
}

interface CardFanCarouselProps {
  cards: CardItem[];
  initialIndex?: number;
}

function FanCard({
  card,
  index,
  isCurrent,
  isVisible,
  onSelect,
}: {
  card: CardItem;
  index: number;
  isCurrent: boolean;
  isVisible: boolean;
  onSelect: (index: number) => void;
}) {
  const image = (
    <Image
      alt={card.alt ?? `Menu page ${index + 1}`}
      className="size-full object-cover"
      draggable={false}
      height={2048}
      priority={isCurrent}
      sizes="(max-width: 479px) 142px, (max-width: 799px) 22vw, 320px"
      src={card.imgUrl}
      width={1622}
    />
  );
  const interactiveClassName =
    "block size-full cursor-pointer overflow-hidden transition-[filter] duration-200 hover:brightness-110 focus-visible:brightness-110";

  return (
    <div
      aria-hidden={!isVisible}
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 block aspect-[811/1024] w-[clamp(142px,22vw,320px)] overflow-hidden rounded-[4px] border border-flameburst-orange/45 bg-surface text-left opacity-0 shadow-[0_20px_45px_color-mix(in_srgb,var(--midnight-shadow)_80%,transparent)] outline-offset-4",
        isCurrent && "border-flameburst-orange",
      )}
      data-menu-card={index}
    >
      {card.linkUrl ? (
        <a
          aria-current={isCurrent ? "true" : undefined}
          className={interactiveClassName}
          href={card.linkUrl}
          rel={card.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
          tabIndex={isVisible ? 0 : -1}
          target={card.linkUrl.startsWith("http") ? "_blank" : undefined}
        >
          {image}
        </a>
      ) : (
        <button
          aria-current={isCurrent ? "true" : undefined}
          className={interactiveClassName}
          onClick={() => onSelect(index)}
          tabIndex={isVisible ? 0 : -1}
          type="button"
        >
          {image}
        </button>
      )}
    </div>
  );
}

export default function CardFanCarousel({
  cards,
  initialIndex,
}: CardFanCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const previouslyVisible = useRef<Set<number>>(new Set());
  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE_FAN_CARDS;
  const [centerIndex, setCenterIndex] = useState(() =>
    getInitialFanCenter(totalCards, initialIndex),
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeCenterIndex = totalCards
    ? Math.min(centerIndex, totalCards - 1)
    : 0;

  const visibleSlots = useMemo(
    () => getVisibleFanSlots(totalCards, activeCenterIndex),
    [activeCenterIndex, totalCards],
  );
  const visibleMap = useMemo(
    () => new Map(visibleSlots.map(({ cardIndex, slot }) => [cardIndex, slot])),
    [visibleSlots],
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;

      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((current) =>
        direction === "right"
          ? (current + 1) % totalCards
          : (current - 1 + totalCards) % totalCards,
      );
    },
    [needsPagination, totalCards],
  );

  const selectCard = useCallback(
    (index: number) => {
      if (index === activeCenterIndex || isAnimating.current) return;

      const selectedSlot = visibleMap.get(index);
      const centerSlot = visibleSlots.length >> 1;
      directionRef.current =
        selectedSlot !== undefined && selectedSlot > centerSlot ? "right" : "left";
      isAnimating.current = true;
      setCenterIndex(index);
    },
    [activeCenterIndex, visibleMap, visibleSlots.length],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(
      container.querySelectorAll<HTMLElement>("[data-menu-card]"),
    );
    const wasVisible = previouslyVisible.current;
    const isFirstMount = !hasEntered.current;
    const direction = directionRef.current;
    const slotCount = needsPagination ? MAX_VISIBLE_FAN_CARDS : totalCards;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const shouldReduceMotion =
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let completedCards = 0;

    if (isFirstMount && !shouldReduceMotion) isAnimating.current = true;

    const finishCardAnimation = () => {
      completedCards += 1;
      if (completedCards < visibleMap.size) return;

      isAnimating.current = false;
      hasEntered.current = true;
    };

    cardElements.forEach((element, cardIndex) => {
      const slot = visibleMap.get(cardIndex);

      if (slot !== undefined) {
        const position = getResponsiveFanPosition(
          slotCount,
          slot,
          viewportWidth,
          viewportHeight,
        );
        const target = {
          autoAlpha: 1,
          pointerEvents: "auto",
          rotation: position.rotation,
          scale: position.scale,
          x: `${position.xRem}rem`,
          xPercent: -50,
          y: `${position.yRem}rem`,
          yPercent: -50,
          zIndex: position.zIndex,
        };

        if (shouldReduceMotion) {
          gsap.set(element, target);
        } else if (isFirstMount) {
          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              rotation: 0,
              scale: 0.5,
              x: 0,
              xPercent: -50,
              y: `${getFanEntryOffsetRem(viewportWidth, viewportHeight)}rem`,
              yPercent: -50,
            },
            {
              ...target,
              delay: 0.2 + slot * 0.06,
              duration: 1.2,
              ease: "elastic.out(1.05,.78)",
              onComplete: finishCardAnimation,
              overwrite: true,
            },
          );
        } else if (!wasVisible.has(cardIndex)) {
          const entersFromRight = direction === "right";
          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              rotation: entersFromRight ? 30 : -30,
              scale: 0.5,
              x: entersFromRight ? "40rem" : "-40rem",
              xPercent: -50,
              y: `${position.yRem}rem`,
              yPercent: -50,
            },
            {
              ...target,
              duration: 0.6,
              ease: "power2.out",
              onComplete: finishCardAnimation,
              overwrite: true,
            },
          );
        } else {
          gsap.to(element, {
            ...target,
            duration: 0.5,
            ease: "power2.out",
            onComplete: finishCardAnimation,
            overwrite: true,
          });
        }
      } else if (wasVisible.has(cardIndex) && !shouldReduceMotion) {
        const exitsLeft = direction === "right";
        gsap.to(element, {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in",
          pointerEvents: "none",
          rotation: exitsLeft ? -30 : 30,
          scale: 0.5,
          x: exitsLeft ? "-40rem" : "40rem",
          zIndex: 0,
        });
      } else {
        gsap.set(element, {
          autoAlpha: 0,
          pointerEvents: "none",
          scale: 0.3,
          x: 0,
          y: 0,
          zIndex: 0,
        });
      }
    });

    if (shouldReduceMotion) {
      isAnimating.current = false;
      hasEntered.current = true;
    }

    previouslyVisible.current = new Set(visibleMap.keys());

    const visibleElements = cardElements
      .map((element, cardIndex) => ({
        element,
        slot: visibleMap.get(cardIndex),
      }))
      .filter(
        (entry): entry is { element: HTMLElement; slot: number } =>
          entry.slot !== undefined,
      )
      .sort((left, right) => left.slot - right.slot);
    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const positions = getHoveredFanPositions(
        slotCount,
        hoveredSlot,
        window.innerWidth,
        window.innerHeight,
      );
      const centerSlot = visibleElements.length >> 1;

      visibleElements.forEach(({ element, slot }) => {
        const position = positions[slot];

        gsap.to(element, {
          delay: Math.abs(slot - (hoveredSlot ?? centerSlot)) * 0.02,
          duration: 0.5,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
          rotation: position.rotation,
          scale: position.scale,
          x: `${position.xRem}rem`,
          y: `${position.yRem}rem`,
          zIndex: position.zIndex,
        });
      });
    };

    const activateSlot = (slot: number) => {
      if (shouldReduceMotion || isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = null;

      if (activeSlot !== slot) {
        activeSlot = slot;
        updateHoverLayout(slot);
      }
    };
    const entryHandlers = visibleElements.map(({ element, slot }) => {
      const handlePointerEnter = () => activateSlot(slot);
      const handleFocus = () => activateSlot(slot);

      element.addEventListener("pointerenter", handlePointerEnter);
      element.addEventListener("focusin", handleFocus);
      return { element, handleFocus, handlePointerEnter };
    });
    const resetHoverLayout = () => {
      if (shouldReduceMotion || isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    const handleFocusOut = (event: FocusEvent) => {
      if (!container.contains(event.relatedTarget as Node | null)) {
        resetHoverLayout();
      }
    };
    const handleResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };

    container.addEventListener("pointerleave", resetHoverLayout);
    container.addEventListener("focusout", handleFocusOut);
    window.addEventListener("resize", handleResize);

    return () => {
      entryHandlers.forEach(({ element, handleFocus, handlePointerEnter }) => {
        element.removeEventListener("pointerenter", handlePointerEnter);
        element.removeEventListener("focusin", handleFocus);
      });
      container.removeEventListener("pointerleave", resetHoverLayout);
      container.removeEventListener("focusout", handleFocusOut);
      window.removeEventListener("resize", handleResize);
      if (leaveTimer) clearTimeout(leaveTimer);
      gsap.killTweensOf(cardElements);
    };
  }, [needsPagination, prefersReducedMotion, totalCards, visibleMap]);

  if (!totalCards) return null;

  const currentCard = cards[activeCenterIndex];

  return (
    <section
      aria-label="Menu pages"
      className="relative z-20 flex w-full flex-col items-center"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          cycle("left");
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          cycle("right");
        }
      }}
    >
      <div className="flex w-full max-w-[90rem] items-center justify-center">
        <div
          ref={containerRef}
          aria-roledescription="carousel"
          className="relative flex h-[22rem] w-full max-w-[80rem] items-center justify-center overflow-hidden min-[480px]:h-[26rem] min-[640px]:h-[28rem] min-[768px]:h-[34rem] min-[1024px]:h-[38rem]"
          role="region"
        >
          {cards.map((card, index) => (
            <FanCard
              card={card}
              index={index}
              isCurrent={index === activeCenterIndex}
              isVisible={visibleMap.has(index)}
              key={card.imgUrl}
              onSelect={selectCard}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Page {activeCenterIndex + 1} of {totalCards}: {currentCard.alt ?? "Menu page"}
      </p>

      {needsPagination ? (
        <div className="z-30 mt-2 sm:mt-0 flex items-center justify-center gap-4 md:mt-6">
          <button
            aria-label="Previous menu page"
            className="relative z-30 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-flameburst-orange/40 bg-surface/80 text-silver-mist/70 shadow-[0_4px_20px_color-mix(in_srgb,var(--midnight-shadow)_70%,transparent)] outline-none transition-colors duration-300 before:pointer-events-none before:absolute before:inset-[3px] before:rounded-full before:border before:border-silver-mist/5 before:content-[''] hover:border-flameburst-orange/80 hover:text-silver-mist active:opacity-70 focus-visible:border-flameburst-orange focus-visible:text-silver-mist md:size-12"
            onClick={() => cycle("left")}
            type="button"
          >
            <ChevronLeft
              aria-hidden="true"
              className="relative z-[2] size-4 md:size-5"
              strokeWidth={2.5}
            />
          </button>

          <div aria-hidden="true" className="flex items-center gap-1 md:gap-2">
            {cards.map((card, index) => (
              <span
                className={cn(
                  "size-1 rounded-full bg-silver-mist/20 transition-[background-color,transform] duration-300 md:size-2",
                  index === activeCenterIndex &&
                    "scale-[1.3] bg-flameburst-orange",
                )}
                key={card.imgUrl}
              />
            ))}
          </div>

          <button
            aria-label="Next menu page"
            className="relative z-30 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-flameburst-orange/40 bg-surface/80 text-silver-mist/70 shadow-[0_4px_20px_color-mix(in_srgb,var(--midnight-shadow)_70%,transparent)] outline-none transition-colors duration-300 before:pointer-events-none before:absolute before:inset-[3px] before:rounded-full before:border before:border-silver-mist/5 before:content-[''] hover:border-flameburst-orange/80 hover:text-silver-mist active:opacity-70 focus-visible:border-flameburst-orange focus-visible:text-silver-mist md:size-12"
            onClick={() => cycle("right")}
            type="button"
          >
            <ChevronRight
              aria-hidden="true"
              className="relative z-[2] size-4 md:size-5"
              strokeWidth={2.5}
            />
          </button>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  getEntryOffsetRem,
  getHoveredPositions,
  getInitialCenter,
  getInitialViewportWidth,
  getResponsivePosition,
  getVisibleCardCount,
  getVisibleSlots,
} from "@/lib/card-carousel-layout";
import { cn } from "@/lib/utils";

export interface CardItem {
  alt?: string;
  imgUrl: string;
  linkUrl?: string;
}

interface CardCarouselProps {
  cards: CardItem[];
  initialIndex?: number;
}

function CarouselCard({
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
      sizes="(max-width: 479px) 60vw, (max-width: 799px) 42vw, (max-width: 1439px) 27vw, (max-width: 2525px) 19vw, 480px"
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
        "pointer-events-none absolute top-1/2 left-1/2 block aspect-[811/1024] w-[clamp(180px,60vw,260px)] overflow-hidden rounded-[4px] border border-orange/45 bg-surface text-left opacity-0 shadow-[0_20px_45px_color-mix(in_srgb,var(--midnight-shadow)_80%,transparent)] outline-offset-4 min-[480px]:w-[clamp(220px,42vw,340px)] min-[800px]:w-[clamp(280px,27vw,400px)] min-[1440px]:w-[clamp(360px,19vw,480px)]",
        isCurrent && "border-orange",
      )}
      data-menu-card={index}
    >
      {card.linkUrl ? (
        <a
          aria-current={isCurrent ? "true" : undefined}
          className={interactiveClassName}
          href={card.linkUrl}
          rel={
            card.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined
          }
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

export default function CardCarousel({
  cards,
  initialIndex,
}: CardCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const previouslyVisible = useRef<Set<number>>(new Set());
  const totalCards = cards.length;
  const [viewportWidth, setViewportWidth] = useState(getInitialViewportWidth);
  const visibleCardCount = getVisibleCardCount(viewportWidth);
  const needsPagination = totalCards > visibleCardCount;
  const [centerIndex, setCenterIndex] = useState(() =>
    getInitialCenter(totalCards, initialIndex),
  );
  const [exitingCardIndexes, setExitingCardIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeCenterIndex = totalCards
    ? Math.min(centerIndex, totalCards - 1)
    : 0;

  const visibleSlots = useMemo(
    () => getVisibleSlots(totalCards, activeCenterIndex, visibleCardCount),
    [activeCenterIndex, totalCards, visibleCardCount],
  );
  const visibleMap = useMemo(
    () => new Map(visibleSlots.map(({ cardIndex, slot }) => [cardIndex, slot])),
    [visibleSlots],
  );
  const mountedCardIndexes = useMemo(
    () =>
      new Set(
        [...visibleMap.keys(), ...exitingCardIndexes].filter(
          (index) => index < totalCards,
        ),
      ),
    [exitingCardIndexes, totalCards, visibleMap],
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;

      isAnimating.current = true;
      directionRef.current = direction;
      setExitingCardIndexes(new Set(visibleMap.keys()));
      setCenterIndex((current) =>
        direction === "right"
          ? (current + 1) % totalCards
          : (current - 1 + totalCards) % totalCards,
      );
    },
    [needsPagination, totalCards, visibleMap],
  );

  const selectCard = useCallback(
    (index: number) => {
      if (index === activeCenterIndex || isAnimating.current) return;

      const selectedSlot = visibleMap.get(index);
      const centerSlot = visibleSlots.length >> 1;
      directionRef.current =
        selectedSlot !== undefined && selectedSlot > centerSlot
          ? "right"
          : "left";
      isAnimating.current = true;
      setExitingCardIndexes(new Set(visibleMap.keys()));
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
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
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
    const slotCount = visibleSlots.length;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const stageWidth = container.clientWidth;
    const shouldReduceMotion =
      prefersReducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let completedCards = 0;
    let completedExitCards = 0;
    const exitingCardCount = [...wasVisible].filter(
      (cardIndex) => !visibleMap.has(cardIndex),
    ).length;

    if (isFirstMount && !shouldReduceMotion) isAnimating.current = true;

    const finishCardAnimation = () => {
      completedCards += 1;
      if (completedCards < visibleMap.size) return;

      isAnimating.current = false;
      hasEntered.current = true;
    };
    const finishExitAnimation = () => {
      completedExitCards += 1;
      if (completedExitCards < exitingCardCount) return;

      setExitingCardIndexes(new Set());
    };

    cardElements.forEach((element) => {
      const cardIndex = Number(element.dataset.menuCard);
      const slot = visibleMap.get(cardIndex);

      if (slot !== undefined) {
        const position = getResponsivePosition(
          slotCount,
          slot,
          viewportWidth,
          viewportHeight,
          stageWidth,
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
              y: `${getEntryOffsetRem(viewportWidth, viewportHeight)}rem`,
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
          onComplete: finishExitAnimation,
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
        if (wasVisible.has(cardIndex)) finishExitAnimation();
      }
    });

    if (shouldReduceMotion) {
      isAnimating.current = false;
      hasEntered.current = true;
    }

    previouslyVisible.current = new Set(visibleMap.keys());

    const visibleElements = cardElements
      .map((element) => {
        const cardIndex = Number(element.dataset.menuCard);

        return {
        element,
        slot: visibleMap.get(cardIndex),
        };
      })
      .filter(
        (entry): entry is { element: HTMLElement; slot: number } =>
          entry.slot !== undefined,
      )
      .sort((left, right) => left.slot - right.slot);
    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const positions = getHoveredPositions(
        slotCount,
        hoveredSlot,
        window.innerWidth,
        window.innerHeight,
        container.clientWidth,
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
  }, [
    needsPagination,
    prefersReducedMotion,
    totalCards,
    visibleCardCount,
    visibleMap,
    visibleSlots.length,
  ]);

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
          className="relative flex h-100 w-full max-w-7xl items-center justify-center overflow-hidden min-[480px]:h-[75vw] min-[800px]:h-[50vw] min-[1440px]:h-180"
          role="region"
        >
          {cards.map((card, index) =>
            mountedCardIndexes.has(index) ? (
              <CarouselCard
                card={card}
                index={index}
                isCurrent={index === activeCenterIndex}
                isVisible={visibleMap.has(index)}
                key={card.imgUrl}
                onSelect={selectCard}
              />
            ) : null,
          )}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Page {activeCenterIndex + 1} of {totalCards}:{" "}
        {currentCard.alt ?? "Menu page"}
      </p>

      {needsPagination ? (
        <div className="z-30 mt-6 flex items-center justify-center gap-4 lg:mt-0">
          <button
            aria-label="Previous menu page"
            className="relative z-30 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-orange/60 bg-surface/80 shadow-[0_4px_20px_color-mix(in_srgb,var(--silver)_30%,transparent)] outline-none transition-colors duration-300 hover:border-silver/80 hover:text-silver active:opacity-70 focus-visible:border-orange focus-visible:text-silver md:size-12"
            onClick={() => cycle("left")}
            type="button"
          >
            <ChevronLeft
              aria-hidden="true"
              className="carousel__arrow carousel__arrow--previous relative z-2 size-6 text-orange xl:size-8"
              strokeWidth={4}
            />
          </button>

          <div aria-hidden="true" className="flex items-center gap-1 md:gap-2">
            {cards.map((card, index) => (
              <span
                className={cn(
                  "size-1 rounded-full bg-silver/20 transition-[background-color,transform] duration-300 md:size-2",
                  index === activeCenterIndex && "scale-[1.3] bg-orange",
                )}
                key={card.imgUrl}
              />
            ))}
          </div>

          <button
            aria-label="Next menu page"
            className="relative z-30 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-orange/60 bg-surface/80 shadow-[0_4px_20px_color-mix(in_srgb,var(--silver)_30%,transparent)] outline-none transition-colors duration-300 hover:border-silver/80 hover:text-silver active:opacity-70 focus-visible:border-orange focus-visible:text-silver md:size-12"
            onClick={() => cycle("right")}
            type="button"
          >
            <ChevronRight
              aria-hidden="true"
              className="carousel__arrow carousel__arrow--next relative z-2 size-6 text-orange xl:size-8"
              strokeWidth={4}
            />
          </button>
        </div>
      ) : null}
    </section>
  );
}

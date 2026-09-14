"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface CardItem {
  alt: string;
  imgUrl: string;
}

interface CardFanCarouselProps {
  cards: CardItem[];
  initialIndex?: number;
}

const VISIBLE_RADIUS = 3;
const SWIPE_DISTANCE_PX = 52;
const SWIPE_VELOCITY_PX_PER_SECOND = 500;

function shortestOffset(index: number, centerIndex: number, total: number) {
  const directOffset = index - centerIndex;
  const wrappedOffset =
    directOffset > total / 2
      ? directOffset - total
      : directOffset < -total / 2
        ? directOffset + total
        : directOffset;

  return Math.abs(wrappedOffset) <= VISIBLE_RADIUS ? wrappedOffset : null;
}

function getPosition(offset: number) {
  const distance = Math.abs(offset);

  return {
    rotation: offset * 7,
    scale: 1 - distance * 0.075,
    xPercent: -50 + offset * 38,
    yPercent: -50 + distance * distance * 3,
    zIndex: 10 - distance,
  };
}

function FanCard({
  card,
  dragX,
  index,
  isCurrent,
  isVisible,
  offset,
  onSelect,
}: {
  card: CardItem;
  dragX: MotionValue<number>;
  index: number;
  isCurrent: boolean;
  isVisible: boolean;
  offset: number | null;
  onSelect: (index: number) => void;
}) {
  const dragMultiplier = offset === null ? 0 : 1 - Math.abs(offset) * 0.08;
  const cardDragX = useTransform(dragX, (value) => value * dragMultiplier);
  const cardDragTransform = useMotionTemplate`translate3d(${cardDragX}px, 0, 0)`;

  return (
    <div
      aria-hidden={!isVisible}
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 block aspect-[811/1024] w-[clamp(142px,22vw,320px)] overflow-hidden rounded-[4px] border border-flameburst-orange/45 bg-surface text-left opacity-0 shadow-[0_20px_45px_color-mix(in_srgb,var(--midnight-shadow)_80%,transparent)] outline-offset-4",
        isCurrent && "border-flameburst-orange",
      )}
      data-menu-card={index}
    >
      <motion.button
        aria-current={isCurrent ? "true" : undefined}
        className="size-full cursor-grab overflow-hidden transition-[filter] duration-200 hover:brightness-110 active:cursor-grabbing focus-visible:brightness-110"
        onClick={() => onSelect(index)}
        style={{ transform: cardDragTransform }}
        tabIndex={isVisible ? 0 : -1}
        type="button"
      >
        <Image
          alt={card.alt}
          className="size-full object-cover"
          draggable={false}
          height={2048}
          priority={isCurrent}
          sizes="(max-width: 479px) 142px, (max-width: 799px) 22vw, 320px"
          src={card.imgUrl}
          width={1622}
        />
      </motion.button>
    </div>
  );
}

export default function CardFanCarousel({
  cards,
  initialIndex = 0,
}: CardFanCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const shouldIgnoreCardClick = useRef(false);
  const dragX = useMotionValue(0);
  const [centerIndex, setCenterIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(cards.length - 1, 0)),
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const visibleCards = useMemo(
    () =>
      cards
        .map((card, index) => ({
          card,
          index,
          offset: shortestOffset(index, centerIndex, cards.length),
        }))
        .filter(
          (item): item is { card: CardItem; index: number; offset: number } =>
            item.offset !== null,
        ),
    [cards, centerIndex],
  );

  const selectCard = useCallback(
    (index: number) => {
      if (index !== centerIndex) {
        setCenterIndex(index);
      }
    },
    [centerIndex],
  );

  const cycle = useCallback(
    (direction: "previous" | "next") => {
      setCenterIndex((current) =>
        direction === "next"
          ? (current + 1) % cards.length
          : (current - 1 + cards.length) % cards.length,
      );
    },
    [cards.length],
  );

  const settleDrag = useCallback(
    (offsetX: number, velocityX: number) => {
      const draggedEnough = Math.abs(offsetX) > SWIPE_DISTANCE_PX;
      const flickedEnough = Math.abs(velocityX) > SWIPE_VELOCITY_PX_PER_SECOND;
      const shouldAdvance = draggedEnough || flickedEnough;

      shouldIgnoreCardClick.current = Math.abs(offsetX) > 8;
      if (shouldIgnoreCardClick.current) {
        window.setTimeout(() => {
          shouldIgnoreCardClick.current = false;
        }, 0);
      }

      if (shouldAdvance) {
        cycle(offsetX < 0 || velocityX < 0 ? "next" : "previous");
      }

      if (prefersReducedMotion) {
        dragX.set(0);
      } else {
        animate(dragX, 0, { type: "spring", duration: 0.5, bounce: 0.2 });
      }
    },
    [cycle, dragX, prefersReducedMotion],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardElements = carousel.querySelectorAll<HTMLElement>("[data-menu-card]");

    cardElements.forEach((element) => {
      const index = Number(element.dataset.menuCard);
      const visibleCard = visibleCards.find((card) => card.index === index);

      if (!visibleCard) {
        gsap.set(element, { autoAlpha: 0, pointerEvents: "none", zIndex: 0 });
        return;
      }

      const position = getPosition(visibleCard.offset);
      const animation = {
        autoAlpha: 1,
        pointerEvents: "auto",
        ...position,
      };

      if (prefersReducedMotion) {
        gsap.set(element, animation);
      } else if (isFirstRender.current) {
        gsap.fromTo(
          element,
          { autoAlpha: 0, xPercent: -50, yPercent: -28, scale: 0.78 },
          {
            ...animation,
            duration: 0.72,
            delay: 0.08 + (visibleCard.offset + VISIBLE_RADIUS) * 0.045,
            ease: "power3.out",
            overwrite: true,
          },
        );
      } else {
        gsap.to(element, {
          ...animation,
          duration: 0.46,
          ease: "power3.out",
          overwrite: true,
        });
      }
    });

    isFirstRender.current = false;
    return () => {
      gsap.killTweensOf(cardElements);
    };
  }, [centerIndex, prefersReducedMotion, visibleCards]);

  if (!cards.length) return null;

  const currentCard = cards[centerIndex];

  return (
    <div
      className="w-full"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          cycle("previous");
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          cycle("next");
        }
      }}
    >
      <motion.div
        drag={cards.length > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={(_, info) => {
          if (!prefersReducedMotion) {
            dragX.set(info.offset.x);
          }
        }}
        onDragEnd={(_, info) => settleDrag(info.offset.x, info.velocity.x)}
        onDragStart={() => dragX.stop()}
        className="touch-pan-y"
      >
        <div
          ref={carouselRef}
          aria-label="Menu pages"
          aria-roledescription="carousel"
          className="relative mx-auto h-[clamp(300px,43vw,590px)] w-full max-w-11/12 overflow-hidden"
          role="region"
          tabIndex={0}
        >
          {cards.map((card, index) => {
            const offset = shortestOffset(index, centerIndex, cards.length);

            return (
              <FanCard
                card={card}
                dragX={dragX}
                index={index}
                isCurrent={index === centerIndex}
                isVisible={offset !== null}
                key={card.imgUrl}
                offset={offset}
                onSelect={(selectedIndex) => {
                  if (shouldIgnoreCardClick.current) {
                    shouldIgnoreCardClick.current = false;
                    return;
                  }
                  selectCard(selectedIndex);
                }}
              />
            );
          })}
        </div>
      </motion.div>

      <div className="mx-auto mt-3 flex max-w-11/12 items-center justify-between gap-4 border-t border-flameburst-orange/30 pt-4">
        <button
          aria-label="Previous menu page"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-flameburst-orange/60 text-silver-mist transition-colors hover:bg-flameburst-orange hover:text-midnight-shadow focus-visible:bg-flameburst-orange focus-visible:text-midnight-shadow"
          onClick={() => cycle("previous")}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <p aria-live="polite" className="m-0 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Page {centerIndex + 1} of {cards.length}
          <span className="sr-only">: {currentCard.alt}</span>
        </p>
        <button
          aria-label="Next menu page"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-flameburst-orange/60 text-silver-mist transition-colors hover:bg-flameburst-orange hover:text-midnight-shadow focus-visible:bg-flameburst-orange focus-visible:text-midnight-shadow"
          onClick={() => cycle("next")}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  );
}

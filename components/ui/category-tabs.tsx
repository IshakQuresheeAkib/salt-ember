"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryTabItem {
  id: string;
  name: string;
  shortName?: string;
  count?: number;
}

interface CategoryTabsProps {
  categories: readonly CategoryTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
  className,
}: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    el.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      el.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll, categories]);

  // Scroll active tab into view when activeId changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left + 40) {
        container.scrollTo({
          left: container.scrollLeft + (tabRect.left - containerRect.left) - 40,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      } else if (tabRect.right > containerRect.right - 40) {
        container.scrollTo({
          left: container.scrollLeft + (tabRect.right - containerRect.right) + 40,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    }
    checkScroll();
  }, [activeId, checkScroll, prefersReducedMotion]);

  const scrollBy = (offset: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({
      left: offset,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % categories.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + categories.length) % categories.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = categories.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextCategory = categories[nextIndex];
      onSelect(nextCategory.id);
      const buttons = scrollContainerRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      );
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Scroll controls for desktop/tablet */}
      <div className="relative flex items-center">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-240)}
            aria-label="Scroll categories left"
            className="absolute left-0 z-20 flex h-9 w-9 -translate-x-2 items-center justify-center rounded-full border border-border/40 bg-surface text-silver shadow-lg backdrop-blur-sm transition-transform hover:scale-105 hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Horizontal tabs list */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="Menu food categories"
          className="no-scrollbar relative flex w-full items-center gap-1 overflow-x-auto scroll-smooth border-b border-white/10 px-1 py-1 md:gap-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((cat, index) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                ref={isActive ? activeTabRef : null}
                role="tab"
                id={`food-tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`food-panel-${cat.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect(cat.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm tracking-wide transition-all duration-200 outline-none md:px-5 md:py-3.5 md:text-base",
                  isActive
                    ? "font-semibold text-orange"
                    : "font-normal text-muted-foreground hover:text-silver",
                )}
              >
                <span>{cat.name}</span>

                {typeof cat.count === "number" && (
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium transition-colors",
                      isActive
                        ? "border border-orange/40 bg-orange/15 text-orange"
                        : "bg-surface/80 text-muted-foreground group-hover:text-silver",
                    )}
                  >
                    {cat.count}
                  </span>
                )}

                {/* Animated active underline matching reference image + ember glow */}
                {isActive && (
                  <motion.div
                    layoutId={prefersReducedMotion ? undefined : "active-category-underline"}
                    className="absolute -bottom-px left-0 right-0 h-[3px] rounded-full bg-orange shadow-[0_0_14px_rgba(227,100,20,0.85)]"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy(240)}
            aria-label="Scroll categories right"
            className="absolute right-0 z-20 flex h-9 w-9 translate-x-2 items-center justify-center rounded-full border border-border/40 bg-surface text-silver shadow-lg backdrop-blur-sm transition-transform hover:scale-105 hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

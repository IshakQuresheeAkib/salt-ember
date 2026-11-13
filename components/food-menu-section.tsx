"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X, Flame, Sparkles, BookOpen, Utensils } from "lucide-react";
import {
  FOOD_CATEGORIES,
  FOOD_DISHES,
  type FoodItem,
} from "@/lib/constants/food-menu-data";
import { CategoryTabs, type CategoryTabItem } from "@/components/ui/category-tabs";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import {
  contentShellClassName,
  highlightedTextClassName,
  sectionHeadingClassName,
} from "@/lib/tailwind";
import { cn } from "@/lib/utils";

type QuickFilter = "all" | "popular" | "spicy";

export function FoodMenuSection() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    FOOD_CATEGORIES[0]?.id ?? "starters",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const searchInputId = useId();
  const prefersReducedMotion = useReducedMotion();

  // Filter dishes by search and quick filter
  const filteredDishes = useMemo(() => {
    return FOOD_DISHES.filter((dish) => {
      // Category match
      if (dish.category !== activeCategoryId) {
        return false;
      }

      // Quick filter
      if (quickFilter === "popular" && !dish.isPopular) {
        return false;
      }
      if (quickFilter === "spicy" && !dish.isSpicy) {
        return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesCategory = dish.category.toLowerCase().includes(query);
        const matchesPortion = dish.portion?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesPortion) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategoryId, quickFilter, searchQuery]);

  // Compute category counts
  const categoryTabs: readonly CategoryTabItem[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FOOD_CATEGORIES.map((cat) => {
      const count = FOOD_DISHES.filter((dish) => {
        if (dish.category !== cat.id) return false;
        if (quickFilter === "popular" && !dish.isPopular) return false;
        if (quickFilter === "spicy" && !dish.isSpicy) return false;
        if (q) {
          return (
            dish.name.toLowerCase().includes(q) ||
            dish.description.toLowerCase().includes(q)
          );
        }
        return true;
      }).length;

      return {
        id: cat.id,
        name: cat.name,
        shortName: cat.shortName,
        count,
      };
    });
  }, [quickFilter, searchQuery]);

  const activeCategory = useMemo(() => {
    return (
      FOOD_CATEGORIES.find((c) => c.id === activeCategoryId) ??
      FOOD_CATEGORIES[0]
    );
  }, [activeCategoryId]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setQuickFilter("all");
    setActiveCategoryId(FOOD_CATEGORIES[0]?.id ?? "starters");
  };

  return (
    <section
      id="dishes"
      aria-labelledby="dishes-section-title"
      className={cn(contentShellClassName, "my-24 md:my-32")}
    >
      {/* Section Header */}
      <div className="mx-auto max-w-155 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-orange">
          Culinary Selection
        </p>
        <TextBlockAnimation blockColor="var(--orange)">
          <h2 id="dishes-section-title" className={sectionHeadingClassName}>
            Explore Our <em className={highlightedTextClassName}>Dishes</em>
          </h2>
        </TextBlockAnimation>
        <p className="mt-[15px] mb-0 text-[clamp(11.2px,10.56px+0.14vw,13px)] text-muted-foreground">
          Select a category below to discover flame-grilled steaks, slow-cooked
          ribs, artisanal pastas, pizzas, and house refreshments.
        </p>
      </div>

      {/* Control Bar: Search & Quick Filters */}
      <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <label htmlFor={searchInputId} className="sr-only">
            Search dishes or ingredients
          </label>
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, flavours, or cuts..."
              className="w-full rounded-full border border-border/40 bg-surface/80 py-2.5 pr-10 pl-10 text-sm text-silver placeholder:text-muted-foreground/60 transition-colors focus:border-orange focus:bg-surface focus:outline-none focus:ring-1 focus:ring-orange"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 rounded-full p-1 text-muted-foreground transition-colors hover:text-orange"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setQuickFilter("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              quickFilter === "all"
                ? "border border-orange/50 bg-orange/20 text-orange"
                : "border border-white/10 bg-surface/60 text-muted-foreground hover:text-silver",
            )}
          >
            <Utensils className="h-3 w-3" />
            <span>All</span>
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter("popular")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              quickFilter === "popular"
                ? "border border-orange/50 bg-orange/20 text-orange"
                : "border border-white/10 bg-surface/60 text-muted-foreground hover:text-silver",
            )}
          >
            <Sparkles className="h-3 w-3" />
            <span>Popular</span>
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter("spicy")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              quickFilter === "spicy"
                ? "border border-orange/50 bg-orange/20 text-orange"
                : "border border-white/10 bg-surface/60 text-muted-foreground hover:text-silver",
            )}
          >
            <Flame className="h-3 w-3 text-orange" />
            <span>Spicy Heat</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="mt-8">
        <CategoryTabs
          categories={categoryTabs}
          activeId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />
      </div>

      {/* Active Category Description Strip */}
      <div className="mt-6 flex flex-col justify-between gap-3 border-b border-white/5 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-xl text-silver md:text-2xl">
              {activeCategory.name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-md border border-border/30 bg-surface/50 px-2.5 py-0.5 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3 text-orange" />
              <span>{activeCategory.pageReference}</span>
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            {activeCategory.description}
          </p>
        </div>

        <div className="shrink-0 text-xs text-muted-foreground">
          Showing <span className="font-semibold text-silver">{filteredDishes.length}</span>{" "}
          {filteredDishes.length === 1 ? "dish" : "dishes"}
        </div>
      </div>

      {/* Food Cards Grid (Layout, Feature & Functionality) */}
      <div
        role="tabpanel"
        id={`food-panel-${activeCategoryId}`}
        aria-labelledby={`food-tab-${activeCategoryId}`}
        className="mt-8"
      >
        <AnimatePresence mode="wait">
          {filteredDishes.length > 0 ? (
            <motion.div
              key={`${activeCategoryId}-${quickFilter}-${searchQuery}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.25,
                ease: "easeOut",
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredDishes.map((dish) => (
                <FoodCardPlaceholder key={dish.id} dish={dish} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-surface/30 px-6 py-16 text-center"
            >
              <Utensils className="h-10 w-10 text-muted-foreground/40" />
              <h4 className="mt-4 font-heading text-lg text-silver">
                No dishes found
              </h4>
              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                We couldn&apos;t find any items matching your current filters. Try
                adjusting your keywords or reset your filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 rounded-full border border-orange bg-orange/10 px-5 py-2 text-xs font-semibold text-orange transition-colors hover:bg-orange hover:text-midnight-shadow"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface FoodCardPlaceholderProps {
  dish: FoodItem;
}

function FoodCardPlaceholder({ dish }: FoodCardPlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange/60 hover:bg-surface hover:shadow-[0_8px_30px_rgba(227,100,20,0.12)]">
      <div>
        {/* Visual Card Image */}
        <div className="relative mb-4 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-midnight-shadow/80">
          {dish.image && !imageError ? (
            <>
              {/* Shimmer / Skeleton while image loads */}
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-surface/60" />
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 350px, 400px"
                unoptimized={dish.image.includes("googleusercontent.com")}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={cn(
                  "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0",
                )}
              />
              {/* Ambient bottom-to-top vignette to elevate typography and badges */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight-shadow/80 via-transparent to-transparent" />
            </>
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
              <Utensils className="h-6 w-6 text-orange/70 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                Salt & Ember
              </span>
            </div>
          )}

          {/* Badges: Popular / Spicy */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
            {dish.isPopular && (
              <span className="flex items-center gap-1 rounded-full border border-orange/40 bg-midnight-shadow/85 px-2 py-0.5 text-[10px] font-semibold text-orange backdrop-blur-md">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Popular</span>
              </span>
            )}
            {dish.isSpicy && (
              <span className="flex items-center gap-1 rounded-full border border-red-500/40 bg-midnight-shadow/85 px-2 py-0.5 text-[10px] font-semibold text-orange backdrop-blur-md">
                <Flame className="h-2.5 w-2.5 text-orange" />
                <span>Spicy</span>
              </span>
            )}
          </div>

          {dish.portion && (
            <div className="absolute right-2.5 bottom-2.5 z-10 rounded-md border border-white/10 bg-midnight-shadow/85 px-2 py-0.5 text-[10px] font-medium text-silver/90 backdrop-blur-md">
              {dish.portion}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-heading text-lg leading-snug font-semibold text-silver transition-colors group-hover:text-orange">
            {dish.name}
          </h4>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {dish.description}
        </p>
      </div>

      {/* Card Footer: Price & Culinary Signature */}
      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="font-heading text-base font-bold text-orange">
          {dish.price}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground/60 transition-colors group-hover:text-orange/80">
          Flame Crafted
        </span>
      </div>
    </article>
  );
}

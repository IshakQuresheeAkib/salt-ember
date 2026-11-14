"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, Utensils } from "lucide-react";
import {
  FOOD_CATEGORIES,
  FOOD_DISHES,
} from "@/lib/constants/food-menu-data";
import { CategoryTabs, type CategoryTabItem } from "@/components/ui/category-tabs";
import { FoodMenuCard } from "@/components/food-menu-card";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import {
  contentShellClassName,
  highlightedTextClassName,
  sectionHeadingClassName,
} from "@/lib/tailwind";
import { cn } from "@/lib/utils";

const CATEGORY_TABS: readonly CategoryTabItem[] = FOOD_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.name,
  shortName: cat.shortName,
  count: FOOD_DISHES.filter((dish) => dish.category === cat.id).length,
}));

export function FoodMenuSection() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    FOOD_CATEGORIES[0]?.id ?? "starters",
  );
  const prefersReducedMotion = useReducedMotion();

  const activeCategoryDishes = useMemo(() => {
    return FOOD_DISHES.filter((dish) => dish.category === activeCategoryId);
  }, [activeCategoryId]);

  const activeCategory = useMemo(() => {
    return (
      FOOD_CATEGORIES.find((c) => c.id === activeCategoryId) ??
      FOOD_CATEGORIES[0]
    );
  }, [activeCategoryId]);

  return (
    <section
      id="dishes"
      aria-labelledby="dishes-section-title"
      className={cn(contentShellClassName, "my-24 md:my-32")}
    >
      {/* Section Header */}
      <div className="mx-auto max-w-155 text-center">
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

      {/* Main Tabs Navigation */}
      <div className="mt-10 md:mt-12">
        <CategoryTabs
          categories={CATEGORY_TABS}
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
          Showing <span className="font-semibold text-silver">{activeCategoryDishes.length}</span>{" "}
          {activeCategoryDishes.length === 1 ? "dish" : "dishes"}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div
        role="tabpanel"
        id={`food-panel-${activeCategoryId}`}
        aria-labelledby={`food-tab-${activeCategoryId}`}
        className="mt-8 pt-10 sm:pt-14"
      >
        <AnimatePresence mode="wait">
          {activeCategoryDishes.length > 0 ? (
            <motion.div
              key={activeCategoryId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.25,
                ease: "easeOut",
              }}
              className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-y-20"
            >
              {activeCategoryDishes.map((dish) => (
                <FoodMenuCard key={dish.id} dish={dish} />
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
                There are currently no dishes listed in this category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

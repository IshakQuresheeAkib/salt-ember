"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import {
  contentShellClassName,
  highlightedTextClassName,
  sectionHeadingClassName,
} from "@/lib/tailwind";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Charred Miso Ramen", category: "Dishes", detail: "Slow broth, smoked egg, spring onion.", price: "৳ 1,450", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=88" },
  { name: "Ember Chicken", category: "Dishes", detail: "Coal-roasted thigh, ember glaze, herbs.", price: "৳ 1,850", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=88" },
  { name: "Fire-Roasted Pizza", category: "Platter", detail: "Tomato, fire oil, basil, ash salt.", price: "৳ 1,250", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=88" },
  { name: "Market Greens", category: "Dishes", detail: "Crisp garden vegetables, tahini, lime.", price: "৳ 850", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=88" },
  { name: "Salted Chocolate Tart", category: "Dessert", detail: "Dark chocolate, sea salt, ember cream.", price: "৳ 650", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476f?auto=format&fit=crop&w=700&q=88" },
  { name: "Citrus Ember Spritz", category: "Drinks", detail: "Bitter orange, spice, sparkling finish.", price: "৳ 550", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=88" },
  { name: "Garden Platter", category: "Platter", detail: "Seasonal vegetables, warm flatbread, dips.", price: "৳ 2,100", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=88" },
  { name: "Rosemary Fizz", category: "Drinks", detail: "Rosemary, lemon, tonic, smoked ice.", price: "৳ 500", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=88" },
];

const categories = ["All", "Dishes", "Platter", "Drinks", "Dessert"] as const;
const crossfadeDurationMs = 180;
const heritageGridClassName =
  "heritage-grid [grid-area:1/1] grid grid-cols-2 gap-y-[clamp(48px,5vw,72px)] gap-x-[clamp(10px,1.5vw,18px)] self-start transition-opacity duration-[180ms] min-[704px]:grid-cols-3 min-[1120px]:grid-cols-[repeat(4,minmax(0,1fr))]";
const heritageCardClassName =
  "heritage-card group min-w-0 transition-transform duration-[250ms] hover:-translate-y-1";
const heritageCardImageClassName =
  "heritage-card-image mx-auto mt-[clamp(-50px,-4vw,-32px)] aspect-square w-[calc(100%_-_clamp(16px,2.5vw,34px))] overflow-hidden rounded-full bg-midnight-shadow";
const heritageCardBodyClassName =
  "flex flex-col gap-[clamp(12px,1.5vw,18px)] px-[clamp(12px,1.6vw,18px)] pt-[clamp(25px,3vw,35px)] pb-[clamp(14px,1.6vw,18px)]";
const menuCategoryTabClassName =
  "min-h-8 min-w-8 rounded-[10px] border px-[clamp(10px,1.1vw,14.4px)] py-2 text-[clamp(11.2px,10.56px+0.14vw,12.8px)] transition-[color,background,border-color,scale] duration-200 active:scale-[0.97]";
const activeMenuCategoryTabClassName =
  "border-flameburst-orange bg-flameburst-orange text-midnight-shadow";
const inactiveMenuCategoryTabClassName =
  "border-transparent bg-transparent text-muted-foreground hover:border-flameburst-orange hover:bg-flameburst-orange hover:text-midnight-shadow";
const menuTabsClassName =
  "mb-[clamp(48px,6vw,72px)] flex flex-wrap justify-center gap-[var(--space-2xs)]";

type MenuCategory = (typeof categories)[number];
type MenuItem = (typeof menuItems)[number];

function filterMenuItems(category: MenuCategory) {
  return category === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === category);
}

function HeritageGrid({
  items,
  isEntering = false,
  isExiting = false,
}: {
  items: MenuItem[];
  isEntering?: boolean;
  isExiting?: boolean;
}) {
  return (
    <div
      className={`${heritageGridClassName}${isEntering ? " is-entering" : ""}${isExiting ? " is-exiting" : ""}`}
      aria-hidden={isExiting || undefined}
    >
      {items.map((item) => (
        <article className={heritageCardClassName} key={item.name}>
          <div className={heritageCardImageClassName}>
            <Image
              src={item.image}
              alt={item.name}
              width={500}
              height={500}
              sizes="(max-width: 700px) 42vw, 220px"
              className="size-full object-cover transition-transform duration-[350ms] group-hover:scale-[1.06]"
            />
          </div>
          <div className={heritageCardBodyClassName}>
            <h3 className="m-0 font-heading text-[clamp(16px,1.25vw,22px)] leading-[1.1] text-silver-mist">{item.name}</h3>
            <div className="flex items-baseline">
              <strong className="whitespace-nowrap font-heading text-[clamp(21px,2vw,27px)] font-medium text-silver-mist">{item.price}</strong>
            </div>
            <p className="mt-[-10px] mb-0 text-left text-[clamp(11px,10px+0.14vw,13px)] leading-[1.4] text-muted-foreground">{item.detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Menu() {
  const [category, setCategory] = useState<MenuCategory>("All");
  const [outgoingCategory, setOutgoingCategory] =
    useState<MenuCategory | null>(null);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filteredItems = useMemo(() => filterMenuItems(category), [category]);
  const outgoingItems = useMemo(
    () => (outgoingCategory ? filterMenuItems(outgoingCategory) : null),
    [outgoingCategory],
  );

  useEffect(() => {
    return () => {
      if (cleanupTimer.current) {
        clearTimeout(cleanupTimer.current);
      }
    };
  }, []);

  function selectCategory(nextCategory: MenuCategory) {
    if (nextCategory === category) {
      return;
    }

    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
    }

    setOutgoingCategory(category);
    setCategory(nextCategory);
    cleanupTimer.current = setTimeout(() => {
      setOutgoingCategory(null);
      cleanupTimer.current = null;
    }, crossfadeDurationMs);
  }

  return (
    <section
      className={contentShellClassName}
      id="menu"
      aria-labelledby="heritage-menu-title"
    >
      <div className="mx-auto mb-[var(--space-md)] max-w-[620px] text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-flameburst-orange">From our kitchen</p>
        <TextBlockAnimation blockColor="var(--flameburst-orange)">
        <h2 id="testimonials-heading" className={sectionHeadingClassName}>Our <em className={highlightedTextClassName}>heritage</em> menu
          </h2>
        </TextBlockAnimation>
        <p className="mt-[15px] mb-0 text-[clamp(11.2px,10.56px+0.14vw,13px)] text-muted-foreground">From casual meals to special celebrations, we serve food and moments made to be remembered.</p>
      </div>
      <div className={menuTabsClassName} aria-label="Filter menu by category">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            className={cn(
              menuCategoryTabClassName,
              category === item
                ? activeMenuCategoryTabClassName
                : inactiveMenuCategoryTabClassName,
            )}
            onClick={() => selectCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid">
        {outgoingItems ? (
          <HeritageGrid
            key={outgoingCategory}
            items={outgoingItems}
            isExiting
          />
        ) : null}
        <HeritageGrid
          key={category}
          items={filteredItems}
          isEntering={Boolean(outgoingItems)}
        />
      </div>
    </section>
  );
}

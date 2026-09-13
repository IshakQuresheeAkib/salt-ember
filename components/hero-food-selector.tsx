"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const foodStates = [
  { id: "dishes", label: "Dishes", icon: "◉", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90", alt: "A fresh bowl of noodles topped with herbs and egg" },
  { id: "dessert", label: "Dessert", icon: "▱", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=90", alt: "A plated dessert with berries and cream" },
  { id: "drinks", label: "Drinks", icon: "♧", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=90", alt: "Colorful handcrafted drinks with fresh citrus" },
  { id: "platter", label: "Platter", icon: "◉", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=90", alt: "A fire-roasted platter of vegetables and grilled food" },
] as const;

type FoodId = (typeof foodStates)[number]["id"];

const DISH_TRANSITION_MS = 720;

export function HeroFoodSelector() {
  const [activeId, setActiveId] = useState<FoodId>("dishes");
  const [exitingIds, setExitingIds] = useState<ReadonlySet<FoodId>>(
    () => new Set(),
  );
  const exitTimersRef = useRef(new Map<FoodId, number>());
  const activeFood = useMemo(() => foodStates.find((food) => food.id === activeId) ?? foodStates[0], [activeId]);

  useEffect(() => {
    const exitTimers = exitTimersRef.current;

    return () => {
      exitTimers.forEach((timer) => window.clearTimeout(timer));
      exitTimers.clear();
    };
  }, []);

  const selectFood = useCallback(
    (nextId: FoodId) => {
      if (nextId === activeId) return;

      const previousId = activeId;
      const pendingNextExit = exitTimersRef.current.get(nextId);
      if (pendingNextExit !== undefined) {
        window.clearTimeout(pendingNextExit);
        exitTimersRef.current.delete(nextId);
      }

      const pendingPreviousExit = exitTimersRef.current.get(previousId);
      if (pendingPreviousExit !== undefined) {
        window.clearTimeout(pendingPreviousExit);
      }

      setExitingIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(nextId);
        nextIds.add(previousId);
        return nextIds;
      });
      setActiveId(nextId);

      const exitTimer = window.setTimeout(() => {
        setExitingIds((currentIds) => {
          if (!currentIds.has(previousId)) return currentIds;

          const nextIds = new Set(currentIds);
          nextIds.delete(previousId);
          return nextIds;
        });
        exitTimersRef.current.delete(previousId);
      }, DISH_TRANSITION_MS);

      exitTimersRef.current.set(previousId, exitTimer);
    },
    [activeId],
  );

  return (
    <div className="hero-art">
      <div className="hero-dish-stage" aria-hidden="true">
        <span className="hero-dish-curve" />
        {foodStates.map((food) => (
          <div
            key={food.id}
            className={`hero-dish-scene ${food.id === activeFood.id ? "is-active" : ""} ${exitingIds.has(food.id) ? "is-exiting" : ""}`}
          >
            <Image
              src={food.image}
              alt=""
              width={900}
              height={900}
              className="hero-dish"
              priority={food.id === "dishes"}
            />
          </div>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">{activeFood.alt}</span>
      <div className="hero-categories" aria-label="Food categories">
        {foodStates.map((food) => <button type="button" key={food.id} className={`category-pill ${food.id === activeFood.id ? "active" : ""}`} aria-pressed={food.id === activeFood.id} onClick={() => selectFood(food.id)}><span aria-hidden="true">{food.icon}</span> {food.label}</button>)}
      </div>
    </div>
  );
}

export default HeroFoodSelector;

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const foodStates = [
  { id: "dishes", label: "Dishes", icon: "◉", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90", alt: "A fresh bowl of noodles topped with herbs and egg" },
  { id: "dessert", label: "Dessert", icon: "▱", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=90", alt: "A plated dessert with berries and cream" },
  { id: "drinks", label: "Drinks", icon: "♧", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=90", alt: "Colorful handcrafted drinks with fresh citrus" },
  { id: "platter", label: "Platter", icon: "◉", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=90", alt: "A fire-roasted platter of vegetables and grilled food" },
] as const;

export function HeroFoodSelector() {
  const [activeId, setActiveId] = useState<(typeof foodStates)[number]["id"]>("dishes");
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeFood = useMemo(() => foodStates.find((food) => food.id === activeId) ?? foodStates[0], [activeId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = foodStates.findIndex((food) => food.id === currentId);
        return foodStates[(currentIndex + 1) % foodStates.length].id;
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isPaused, reducedMotion]);

  return (
    <div className="hero-art" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocusCapture={() => setIsPaused(true)} onBlurCapture={() => setIsPaused(false)}>
      <div className="hero-orbit" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="hero-dish-stage" aria-live="polite">
        {foodStates.map((food) => (
          <Image key={food.id} src={food.image} alt={food.alt} width={900} height={900} className={`hero-dish ${food.id === activeFood.id ? "is-active" : ""}`} priority={food.id === "dishes"} />
        ))}
      </div>
      <div className="delivery-card"><span className="delivery-icon" aria-hidden="true">●</span><span><strong>Fast Delivery</strong><small>Free of cost any delivery</small></span></div>
      <div className="hero-categories" aria-label="Food categories">
        {foodStates.map((food) => <button type="button" key={food.id} className={`category-pill ${food.id === activeFood.id ? "active" : ""}`} aria-pressed={food.id === activeFood.id} onClick={() => setActiveId(food.id)}><span aria-hidden="true">{food.icon}</span> {food.label}</button>)}
      </div>
    </div>
  );
}

export default HeroFoodSelector;

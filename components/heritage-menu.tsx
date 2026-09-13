"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import TextBlockAnimation from "@/components/ui/text-block-animation";

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

const categories = ["All", "Dishes", "Platter", "Drinks", "Dessert"];

export function HeritageMenu() {
  const [category, setCategory] = useState("All");
  const filteredItems = useMemo(() => category === "All" ? menuItems : menuItems.filter((item) => item.category === category), [category]);

  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
  }

  return (
    <section
      className="heritage-menu content-shell content-shell--wide"
      id="heritage-menu"
      aria-labelledby="heritage-menu-title"
    >
      <div className="heritage-heading">
        <p className="eyebrow">From our kitchen</p>
        <TextBlockAnimation blockColor="var(--burnt-sienna)">
          <h2 id="heritage-menu-title" className="font-heading">
            Our <em>heritage</em> menu
          </h2>
        </TextBlockAnimation>
        <p>Sample menu — dishes and prices are illustrative.</p>
      </div>
      <div className="heritage-tabs" aria-label="Filter menu by category">
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} className={category === item ? "is-active" : ""} onClick={() => selectCategory(item)}>{item}</button>)}
      </div>
      <div className="heritage-grid">
        {filteredItems.map((item) => <article className="heritage-card" key={item.name}><div className="heritage-card-image"><Image src={item.image} alt={item.name} width={500} height={500} sizes="(max-width: 700px) 42vw, 220px" /></div><div className="heritage-card-body"><h3>{item.name}</h3><div className="heritage-card-details"><strong>{item.price}</strong></div><p>{item.detail}</p></div></article>)}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const menuItems = [
  { name: "Charred Miso Ramen", category: "Dishes", detail: "Slow broth, smoked egg, spring onion.", price: "$18", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=88" },
  { name: "Ember Chicken", category: "Dishes", detail: "Coal-roasted thigh, ember glaze, herbs.", price: "$24", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=88" },
  { name: "Fire-Roasted Pizza", category: "Platter", detail: "Tomato, fire oil, basil, ash salt.", price: "$19", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=88" },
  { name: "Market Greens", category: "Dishes", detail: "Crisp garden vegetables, tahini, lime.", price: "$14", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=88" },
  { name: "Salted Chocolate Tart", category: "Dessert", detail: "Dark chocolate, sea salt, ember cream.", price: "$12", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476f?auto=format&fit=crop&w=700&q=88" },
  { name: "Citrus Ember Spritz", category: "Drinks", detail: "Bitter orange, spice, sparkling finish.", price: "$11", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=88" },
  { name: "Garden Platter", category: "Platter", detail: "Seasonal vegetables, warm flatbread, dips.", price: "$28", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=88" },
  { name: "Rosemary Fizz", category: "Drinks", detail: "Rosemary, lemon, tonic, smoked ice.", price: "$10", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=88" },
];

const categories = ["All", "Dishes", "Platter", "Drinks", "Dessert"];

export function HeritageMenu() {
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const filteredItems = useMemo(() => category === "All" ? menuItems : menuItems.filter((item) => item.category === category), [category]);
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / 8));
  const visibleItems = filteredItems.slice((page - 1) * 8, page * 8);

  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
    setPage(1);
  }

  return (
    <section className="heritage-menu content-shell" id="heritage-menu" aria-labelledby="heritage-menu-title">
      <div className="heritage-heading">
        <p className="eyebrow">From our kitchen</p>
        <h2 id="heritage-menu-title" className="font-heading">Our <em>heritage</em> menu</h2>
        <p>Fire-led plates, bright pours, and the dishes we keep coming back to.</p>
      </div>
      <div className="heritage-tabs" role="tablist" aria-label="Menu categories">
        {categories.map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? "is-active" : ""} onClick={() => selectCategory(item)}>{item}</button>)}
      </div>
      <div className="heritage-grid">
        {visibleItems.map((item) => <article className="heritage-card" key={item.name}><div className="heritage-card-image"><Image src={item.image} alt={item.name} width={500} height={500} sizes="(max-width: 700px) 42vw, 220px" /></div><div className="heritage-card-body"><div className="heritage-card-title-row"><h3>{item.name}</h3><button className="heritage-card-favorite" type="button" aria-label={`Save ${item.name} to favorites`}>♡</button></div><div className="heritage-card-details"><strong>{item.price}</strong><div className="heritage-card-rating" aria-label="5 out of 5 stars"><span aria-hidden="true">★</span> 5.0</div></div><p>{item.detail}</p><div className="heritage-card-footer"><a href="#contact">Order now <span aria-hidden="true">↗</span></a></div></div></article>)}
      </div>
      <nav className="heritage-pagination" aria-label="Menu pages"><button type="button" aria-label="Previous menu page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>‹</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" aria-current={page === number ? "page" : undefined} className={page === number ? "is-active" : ""} onClick={() => setPage(number)}>{number}</button>)}<button type="button" aria-label="Next menu page" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>›</button></nav>
    </section>
  );
}

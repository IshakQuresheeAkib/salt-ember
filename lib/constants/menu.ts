import type { HeroOrbitItem, MenuItem } from "@/lib/types";

export const menuItems = [
  {
    id: "ember-chicken",
    name: "Ember Chicken",
    description: "Coal-roasted chicken, charred lime, herb oil, and warm spice.",
    priceBdt: 780,
    category: "grills",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=88",
    alt: "Char-grilled chicken served with herbs and roasted vegetables",
    tags: ["halal", "spicy"],
    spiceLevel: 2,
    isAvailable: true,
    isFeatured: true,
    isProvisional: true,
  },
  {
    id: "fire-roasted-fish",
    name: "Fire-roasted Fish",
    description: "Market fish, burnt lemon, green chilli, and coriander butter.",
    priceBdt: 920,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=88",
    alt: "A plated fire-roasted fish dish with herbs and fresh vegetables",
    tags: ["halal", "spicy", "gluten-free"],
    spiceLevel: 2,
    isAvailable: true,
    isFeatured: true,
    isProvisional: true,
  },
  {
    id: "smoked-beef-short-rib",
    name: "Smoked Beef Short Rib",
    description: "Slow-cooked beef, tamarind glaze, onion, and toasted sesame.",
    priceBdt: 1180,
    category: "grills",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=88",
    alt: "Sliced smoked beef short rib with a dark glaze and herbs",
    tags: ["halal"],
    spiceLevel: 1,
    isAvailable: true,
    isFeatured: true,
    isProvisional: true,
  },
  {
    id: "charred-aubergine",
    name: "Charred Aubergine",
    description: "Fire-softened aubergine, tahini, pomegranate, and crisp herbs.",
    priceBdt: 420,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=88",
    alt: "Charred aubergine arranged with pomegranate and fresh herbs",
    tags: ["vegan", "gluten-free"],
    spiceLevel: 1,
    isAvailable: true,
    isFeatured: false,
    isProvisional: true,
  },
  {
    id: "coal-roasted-cauliflower",
    name: "Coal-roasted Cauliflower",
    description: "Whole roasted cauliflower, cashew cream, chilli, and lime.",
    priceBdt: 560,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=88",
    alt: "Roasted cauliflower with greens, chilli, and citrus",
    tags: ["vegan", "spicy", "gluten-free"],
    spiceLevel: 2,
    isAvailable: true,
    isFeatured: false,
    isProvisional: true,
  },
  {
    id: "market-greens",
    name: "Market Greens",
    description: "Seasonal leaves, cucumber, toasted seeds, and bright lime dressing.",
    priceBdt: 320,
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=88",
    alt: "A bowl of fresh market greens with cucumber and toasted seeds",
    tags: ["vegan", "gluten-free"],
    spiceLevel: 0,
    isAvailable: true,
    isFeatured: false,
    isProvisional: true,
  },
  {
    id: "smoked-potatoes",
    name: "Smoked Potatoes",
    description: "Crisp potatoes, smoked yoghurt, spring onion, and chilli dust.",
    priceBdt: 340,
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=88",
    alt: "Crisp roasted potatoes served with yoghurt and spring onion",
    tags: ["vegetarian", "spicy"],
    spiceLevel: 1,
    isAvailable: false,
    isFeatured: false,
    isProvisional: true,
  },
  {
    id: "cardamom-milk-cake",
    name: "Cardamom Milk Cake",
    description: "Soft milk cake, cardamom cream, pistachio, and orange zest.",
    priceBdt: 420,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=88",
    alt: "A soft milk cake topped with cream, pistachio, and citrus",
    tags: ["vegetarian"],
    spiceLevel: 0,
    isAvailable: true,
    isFeatured: true,
    isProvisional: true,
  },
  {
    id: "tamarind-ember-soda",
    name: "Tamarind Ember Soda",
    description: "Tamarind, ginger, citrus, toasted spice, and sparkling water.",
    priceBdt: 260,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=88",
    alt: "A chilled amber-coloured soda with citrus and fresh herbs",
    tags: ["vegan", "gluten-free"],
    spiceLevel: 1,
    isAvailable: true,
    isFeatured: false,
    isProvisional: true,
  },
  {
    id: "salted-lime-cooler",
    name: "Salted Lime Cooler",
    description: "Fresh lime, sea salt, mint, and chilled soda.",
    priceBdt: 220,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=88",
    alt: "A clear lime cooler with ice, mint, and fresh citrus",
    tags: ["vegan", "gluten-free"],
    spiceLevel: 0,
    isAvailable: true,
    isFeatured: false,
    isProvisional: true,
  },
] satisfies MenuItem[];

export const featuredMenuItems = menuItems.filter((item) => item.isFeatured);

function createHeroOrbitItem(id: string, label: string): HeroOrbitItem {
  const item = menuItems.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`Missing hero orbit menu item: ${id}`);
  }

  return { id, label, src: item.image, alt: item.alt };
}

export const heroOrbitItems = [
  createHeroOrbitItem("ember-chicken", "Grill"),
  createHeroOrbitItem("coal-roasted-cauliflower", "Plant-led"),
  createHeroOrbitItem("cardamom-milk-cake", "Dessert"),
  createHeroOrbitItem("tamarind-ember-soda", "Drinks"),
];

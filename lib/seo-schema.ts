import type { FoodCategory, FoodItem } from "./constants/food-menu-data";

export interface SingleOffer {
  "@type": "Offer";
  price: number;
  priceCurrency: "BDT";
}

export interface RangeOffer {
  "@type": "AggregateOffer";
  lowPrice: number;
  highPrice: number;
  priceCurrency: "BDT";
}

export interface MenuItemStructuredData {
  "@type": "MenuItem";
  name: string;
  description: string;
  image?: string;
  offers: SingleOffer | RangeOffer;
}

export interface MenuSectionStructuredData {
  "@type": "MenuSection";
  name: string;
  description: string;
  hasMenuItem: MenuItemStructuredData[];
}

export interface MenuStructuredData {
  "@type": "Menu";
  "@id": string;
  name: string;
  url: string;
  inLanguage?: string;
  hasMenuSection: MenuSectionStructuredData[];
}

export interface SiteConfigInput {
  name: string;
  url: string;
  locale?: string;
}

export function parseDishOffer(priceStr: string): SingleOffer | RangeOffer {
  if (priceStr.includes("/")) {
    const parts = priceStr.split("/").map((part) => {
      const match = part.match(/\d+(?:\.\d+)?/);
      return match ? parseFloat(match[0]) : 0;
    });
    const low = Math.min(parts[0] || 0, parts[1] || 0);
    const high = Math.max(parts[0] || 0, parts[1] || 0);
    return {
      "@type": "AggregateOffer",
      lowPrice: low,
      highPrice: high,
      priceCurrency: "BDT",
    };
  }

  const match = priceStr.match(/\d+(?:\.\d+)?/);
  const price = match ? parseFloat(match[0]) : 0;
  return {
    "@type": "Offer",
    price,
    priceCurrency: "BDT",
  };
}

export function resolveAbsoluteImageUrl(
  image: string | undefined,
  siteUrl: string,
): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  if (image.startsWith("/")) {
    try {
      return new URL(image, siteUrl).toString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function generateMenuStructuredData(
  categories: FoodCategory[],
  dishes: FoodItem[],
  siteConfig: SiteConfigInput,
): MenuStructuredData {
  const siteUrl = siteConfig.url.replace(/\/+$/, "");

  return {
    "@type": "Menu",
    "@id": `${siteUrl}/#menu`,
    name: `${siteConfig.name} Menu`,
    url: `${siteUrl}/#menu`,
    inLanguage: siteConfig.locale || "en-BD",
    hasMenuSection: categories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      description: cat.description,
      hasMenuItem: dishes
        .filter((dish) => dish.category === cat.id)
        .map((dish) => {
          const imageUrl = resolveAbsoluteImageUrl(dish.image, siteUrl);
          return {
            "@type": "MenuItem",
            name: dish.name,
            description: dish.description,
            ...(imageUrl ? { image: imageUrl } : {}),
            offers: parseDishOffer(dish.price),
          };
        }),
    })),
  };
}

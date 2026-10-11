export const siteOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    (process.env.URL ? process.env.URL : null) ||
    "https://saltandember.com"
);

export const siteConfig = {
  name: "Salt & Ember",
  shortName: "Salt & Ember",
  title: "Salt & Ember | Flavour Meets Fire",
  description:
    "At Salt & Ember, every dish is crafted to bring together bold steakhouse flavors, quality ingredients, and a warm dining experience. From casual meals to special celebrations, we serve food and moments made to be remembered.",
  tagline: "Flavour Meets Fire",
  locale: "en_BD",
  url: siteOrigin.origin,
  location: {
    streetAddress: "Baruthkhana Point, East Zindabazar",
    addressLocality: "Sylhet",
    addressRegion: "Sylhet Division",
    postalCode: "3100",
    addressCountry: "BD",
    latitude: 24.8949,
    longitude: 91.8687,
    mapUrl: "https://maps.app.goo.gl/qBEyyTSasUwqyaRs5",
  },
  priceRange: "$$",
  currenciesAccepted: "BDT",
  servesCuisine: [
    "Fire-led Cooking",
    "Wood-fired Grill",
    "Steakhouse",
    "Continental",
    "Thai & Chinese",
    "Seafood",
    "Artisanal",
  ],
  contact: {
    telephone: "+880 1704 083 376",
    telephoneRaw: "+8801704083376",
    whatsappUrl: "https://wa.me/8801704083376",
  },
  social: {
    facebook: "https://www.facebook.com/saltandember7",
    instagram: "https://www.instagram.com/salt.and.ember_",
  },
  themeColor: "#0B2228",
  keywords: [
    "Salt & Ember",
    "Salt and Ember",
    "restaurant in Sylhet",
    "wood-fired restaurant Sylhet",
    "steakhouse Sylhet",
    "fine dining Sylhet",
    "Baruthkhana Point restaurant",
    "East Zindabazar food",
    "flavour meets fire",
    "artisanal grill Sylhet",
    "Sylhet best restaurants",
    "BBQ and steak Sylhet",
  ],
} as const;

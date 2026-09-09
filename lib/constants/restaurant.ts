import type { RestaurantDetails } from "@/lib/types";

export const restaurantDetails = {
  name: "Salt & Ember",
  tagline: "Flavour meets fire",
  address: "27 Amber Lane",
  city: "Sylhet 3100, Bangladesh",
  phoneDisplay: "+880 1712 345 678",
  phoneHref: "tel:+8801712345678",
  email: "hello@saltandember.com",
  emailHref: "mailto:hello@saltandember.com",
  heroImage: {
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=90",
    alt: "A fire-roasted platter finished with herbs and seasonal vegetables",
  },
  aboutImage: {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=88",
    alt: "A cook working carefully at a warmly lit restaurant kitchen pass",
  },
  hours: [
    { days: "Sunday–Thursday", hours: "12:00–23:00" },
    { days: "Friday–Saturday", hours: "12:00–00:00" },
  ],
  socialLinks: [
    { href: "https://www.instagram.com/", label: "Instagram" },
    { href: "https://www.facebook.com/", label: "Facebook" },
  ],
  isProvisional: true,
} satisfies RestaurantDetails;

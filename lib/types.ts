export const menuCategories = [
  "starters",
  "mains",
  "grills",
  "sides",
  "desserts",
  "drinks",
] as const;

export type MenuCategory = (typeof menuCategories)[number];

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "halal"
  | "spicy"
  | "gluten-free";

export interface NavItem {
  href: `#${string}`;
  label: string;
}

export interface ImageFixture {
  src: string;
  alt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceBdt: number;
  category: MenuCategory;
  image: string;
  alt: string;
  tags: DietaryTag[];
  spiceLevel: 0 | 1 | 2 | 3;
  isAvailable: boolean;
  isFeatured: boolean;
  isProvisional: true;
}

export interface GalleryItem extends ImageFixture {
  id: string;
  caption: string;
  layout: "landscape" | "portrait" | "square";
  isProvisional: true;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  isProvisional: true;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface SocialLink {
  href: string;
  label: string;
}

export interface RestaurantDetails {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phoneDisplay: string;
  phoneHref: `tel:${string}`;
  email: string;
  emailHref: `mailto:${string}`;
  heroImage: ImageFixture;
  aboutImage: ImageFixture;
  hours: OpeningHours[];
  socialLinks: SocialLink[];
  isProvisional: true;
}

export interface ReservationValues {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: string;
  notes: string;
}

export interface EventEnquiryValues {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: string;
  preferredDate: string;
  message: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type PrototypeKind = "reservation" | "event";

export type PrototypeResult =
  | {
      status: "success";
      kind: PrototypeKind;
      title: string;
      message: string;
      disclosure: string;
    }
  | {
      status: "error";
      kind: PrototypeKind;
      title: string;
      message: string;
    };

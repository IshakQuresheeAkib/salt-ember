import {
  Home,
  MessageCircle,
  Phone,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type DefaultNavItem = {
  href: "#top" | "#menu" | "#testimonials" | "#contact";
  icon: LucideIcon;
  isActive?: boolean;
  label: string;
};

export const defaultNavItems: readonly DefaultNavItem[] = [
  { href: "#top", icon: Home, isActive: true, label: "Home" },
  { href: "#menu", icon: UtensilsCrossed, label: "Menu" },
  { href: "#testimonials", icon: MessageCircle, label: "Reviews" },
  { href: "#contact", icon: Phone, label: "Contact" },
];

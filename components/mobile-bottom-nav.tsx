"use client";

import { MapPinned } from "lucide-react";

import {
  BottomNavBar,
  type BottomNavBarItem,
} from "@/components/ui/bottom-nav-bar";
import { defaultNavItems } from "@/lib/constants/default-nav-items";
import { SALT_AND_EMBER_MAP_URL } from "@/lib/constants/social-media";

const mobileNavigationItems = [
  ...defaultNavItems,
  {
    external: true,
    href: SALT_AND_EMBER_MAP_URL,
    icon: MapPinned,
    label: "Location",
  },
] satisfies readonly BottomNavBarItem[];

export function MobileBottomNav() {
  return (
    <BottomNavBar
      items={mobileNavigationItems}
      stickyBottom
      className="desktop:hidden"
    />
  );
}

"use client";

import {
  BottomNavBar,
} from "@/components/ui/bottom-nav-bar";
import { defaultNavItems } from "@/lib/constants/default-nav-items";

export function MobileBottomNav() {
  return (
    <BottomNavBar
      items={defaultNavItems}
      stickyBottom
      className="desktop:hidden"
    />
  );
}

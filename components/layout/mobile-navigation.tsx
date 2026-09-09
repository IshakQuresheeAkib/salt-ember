"use client";

import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/lib/constants/nav";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation"
        render={<Button className="nav-trigger" size="icon-lg" variant="outline" />}
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Explore Salt & Ember in Sylhet.</SheetDescription>
        </SheetHeader>
        <nav className="mobile-nav-links" aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a href={item.href} key={item.href} onClick={() => setOpen(false)}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-nav-footer">
          <p>Come for the fire.</p>
          <p>Stay for the flavour.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
